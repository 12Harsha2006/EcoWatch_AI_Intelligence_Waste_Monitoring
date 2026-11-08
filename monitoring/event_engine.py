import time
from typing import List, Dict, Any, Optional
import numpy as np

from database.connection import SessionLocal
from database.repository import (
    IncidentRepository,
    EvidenceRepository,
    DetectionEventRepository,
    CameraRepository
)
from utils.file_manager import evidence_manager
from utils.visualizer import draw_detections, draw_polygon_zone
from monitoring.zone_evaluator import ZoneEvaluator
from utils.logger import logger

class EventEngine:
    """
    Core event processing pipeline for unauthorized waste disposal alerts.
    
    Processes detection bounding boxes against configured restricted zones.
    When unauthorized garbage is detected inside a restricted zone:
      1. Enforces cooldown logic to prevent duplicate spamming.
      2. Creates a unique Incident in SQLite with status 'PENDING'.
      3. Saves annotated snapshot and recent video frames to evidence/{incident_id}/.
      4. Records evidence paths and detection logs in the database.
    """

    def __init__(self, cooldown_seconds: int = 15):
        self.cooldown_seconds = cooldown_seconds
        # Mapping: camera_id -> last_incident_timestamp
        self._last_alert_time: Dict[str, float] = {}

    def process_frame_events(
        self,
        camera_id: str,
        frame: np.ndarray,
        detections: List[Dict[str, Any]],
        zones: List[Dict[str, Any]],
        recent_frames: Optional[List[np.ndarray]] = None,
        provider_type: str = "SIMULATED_MOCK"
    ) -> Optional[str]:
        """
        Evaluate frame detections. If unauthorized waste disposal is identified,
        creates an Incident and returns the incident ID.
        """
        db = SessionLocal()
        try:
            camera = CameraRepository.get(db, camera_id)
            cam_location = camera.location if camera else "Unknown Location"

            flagged_waste = None

            # 1. Evaluate each detection against active zones
            for det in detections:
                category = det.get("category", "")
                conf = det.get("confidence", 0.0)
                bbox = det.get("bbox", [0, 0, 0, 0])

                in_zone, zone_id, zone_name = ZoneEvaluator.evaluate_detection(bbox, zones)
                det["in_zone"] = in_zone
                det["zone_id"] = zone_id

                # Save detection event to database
                DetectionEventRepository.create(
                    db=db,
                    camera_id=camera_id,
                    object_category=category,
                    confidence=conf,
                    bbox=bbox,
                    is_in_restricted_zone=in_zone,
                    zone_id=zone_id,
                    provider_type=provider_type
                )

                # Flag if it is waste inside an active restricted zone
                is_garbage = any(w in category.lower() for w in ["waste", "garbage", "trash", "debris", "bottle", "bag", "box"])
                if in_zone and is_garbage:
                    if flagged_waste is None or conf > flagged_waste.get("confidence", 0):
                        flagged_waste = det
                        flagged_waste["zone_name"] = zone_name

            # 2. Check if incident condition is met and cooldown has passed
            now = time.time()
            last_alert = self._last_alert_time.get(camera_id, 0)

            if flagged_waste and (now - last_alert >= self.cooldown_seconds):
                self._last_alert_time[camera_id] = now

                incident_id = IncidentRepository.generate_incident_id(db)
                incident_folder = str(evidence_manager.get_incident_dir(incident_id))

                # Annotate evidence frame
                annotated_frame = frame.copy()
                for z in zones:
                    pts = ZoneEvaluator.parse_polygon(z.get("polygon_coords", "[]"))
                    draw_polygon_zone(annotated_frame, pts, z.get("name", "Zone"), is_violated=True)

                annotated_frame = draw_detections(
                    annotated_frame,
                    detections,
                    is_simulated=("SIMULATED" in provider_type.upper() or "MOCK" in provider_type.upper())
                )

                # Save image evidence
                img_path = evidence_manager.save_incident_image(incident_id, annotated_frame)

                # Save video clip evidence if recent frames available
                video_path = None
                if recent_frames and len(recent_frames) > 5:
                    video_path = evidence_manager.save_incident_video(incident_id, recent_frames, fps=12)

                # Save metadata JSON
                metadata = {
                    "incident_id": incident_id,
                    "camera_id": camera_id,
                    "location": cam_location,
                    "waste_category": flagged_waste.get("category"),
                    "confidence": flagged_waste.get("confidence"),
                    "zone_id": flagged_waste.get("zone_id"),
                    "zone_name": flagged_waste.get("zone_name"),
                    "provider_type": provider_type,
                    "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S")
                }
                meta_path = evidence_manager.save_metadata(incident_id, metadata)

                # Register Incident in database
                remarks = f"Automated Alert: Detected '{flagged_waste.get('category')}' within restricted zone '{flagged_waste.get('zone_name')}'."
                incident = IncidentRepository.create(
                    db=db,
                    incident_id=incident_id,
                    camera_id=camera_id,
                    location=cam_location,
                    waste_category=flagged_waste.get("category"),
                    confidence=flagged_waste.get("confidence"),
                    evidence_folder=incident_folder,
                    remarks=remarks
                )

                # Register Evidence records
                img_size = len(annotated_frame)
                EvidenceRepository.create(db, incident_id, "IMAGE", img_path, file_size_bytes=img_size)
                if video_path and evidence_manager.validate_file(video_path):
                    EvidenceRepository.create(db, incident_id, "VIDEO", video_path)
                EvidenceRepository.create(db, incident_id, "METADATA", meta_path)

                logger.warning(f"🚨 INCIDENT FLAGGED: {incident_id} on {camera_id} - {remarks}")
                return incident_id

            return None
        except Exception as e:
            logger.error(f"Error in EventEngine.process_frame_events: {e}")
            db.rollback()
            return None
        finally:
            db.close()

