import json
import numpy as np
import cv2
from database.connection import SessionLocal, init_db
from database.repository import (
    CameraRepository,
    ZoneRepository,
    IncidentRepository,
    EvidenceRepository,
    DetectionEventRepository
)
from utils.file_manager import evidence_manager
from utils.logger import logger

def seed_demo_data():
    """
    Populates initial sample cameras, restricted zones, and an initial demo incident
    with generated evidence so the dashboard has rich data out of the box.
    """
    init_db()
    db = SessionLocal()

    try:
        # Check if already seeded
        if CameraRepository.get(db, "CAM_01") is not None:
            logger.info("Database already seeded. Skipping initial seeding.")
            return

        logger.info("Seeding initial demo cameras and zones...")

        # 1. Cameras
        cams = [
            ("CAM_01", "North Gate Perimeter", "Perimeter Sector A - Entryway", "synthetic", "synthetic_stream_0", True),
            ("CAM_02", "South Waste Station", "Sector B - Waste Disposal Dumpster", "synthetic", "synthetic_stream_1", True),
            ("CAM_03", "East Alleyway CCTV", "Sector C - Service Corridor", "webcam", "0", False),
        ]

        for cid, name, loc, stype, spath, enabled in cams:
            if not CameraRepository.get(db, cid):
                CameraRepository.create(
                    db=db,
                    camera_id=cid,
                    name=name,
                    location=loc,
                    source_type=stype,
                    source_path=spath,
                    is_enabled=enabled
                )

        # 2. Restricted Zones
        # Coordinates in [x, y] pixel coordinates for standard 640x480 frame
        zone1_points = [[150, 180], [480, 180], [480, 420], [150, 420]]
        zone2_points = [[80, 120], [350, 120], [350, 360], [80, 360]]

        if not ZoneRepository.get(db, "ZONE_01"):
            ZoneRepository.create(
                db=db,
                zone_id="ZONE_01",
                camera_id="CAM_01",
                name="North Gate Clean Zone (No Dumping)",
                polygon_coords=json.dumps(zone1_points),
                description="Strict no-dumping zone near the security entrance.",
                is_active=True
            )

        if not ZoneRepository.get(db, "ZONE_02"):
            ZoneRepository.create(
                db=db,
                zone_id="ZONE_02",
                camera_id="CAM_02",
                name="Dumpster Boundary Overflow Zone",
                polygon_coords=json.dumps(zone2_points),
                description="Monitors illegal littering outside designated dumpster boundary.",
                is_active=True
            )

        # 3. Create a Demo Incident with Synthetic Evidence
        demo_incident_id = "INC_DEMO_001"
        if not IncidentRepository.get(db, demo_incident_id):
            logger.info("Creating demo incident and synthetic evidence files...")
            incident_folder = str(evidence_manager.get_incident_dir(demo_incident_id))

            # Create synthetic evidence image
            dummy_frame = np.zeros((480, 640, 3), dtype=np.uint8)
            # Background
            dummy_frame[:] = (45, 45, 45)
            # Draw synthetic zone
            pts = np.array(zone1_points, np.int32).reshape((-1, 1, 2))
            cv2.polylines(dummy_frame, [pts], True, (0, 165, 255), 2)
            cv2.putText(dummy_frame, "[ZONE] North Gate Clean Zone", (160, 170), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (0, 165, 255), 2)

            # Draw synthetic person
            cv2.rectangle(dummy_frame, (180, 200), (260, 390), (255, 178, 50), 2)
            cv2.putText(dummy_frame, "PERSON: 0.91", (180, 195), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 178, 50), 1)

            # Draw synthetic garbage in zone
            cv2.rectangle(dummy_frame, (280, 310), (390, 400), (0, 0, 255), 2)
            cv2.putText(dummy_frame, "PLASTIC_WASTE: 0.88 [IN ZONE]", (280, 305), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 1)

            # Watermark
            cv2.putText(dummy_frame, "[SIMULATED DETECTION - DEMO INCIDENT]", (15, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (0, 255, 255), 2)

            img_path = evidence_manager.save_incident_image(demo_incident_id, dummy_frame)
            meta_path = evidence_manager.save_metadata(demo_incident_id, {
                "incident_id": demo_incident_id,
                "camera_id": "CAM_01",
                "location": "Perimeter Sector A - Entryway",
                "waste_category": "plastic_waste",
                "confidence": 0.88,
                "provider": "SIMULATED_MOCK",
                "is_simulated": True,
                "timestamp": "2026-11-08T10:30:00"
            })

            # Save in database
            incident = IncidentRepository.create(
                db=db,
                incident_id=demo_incident_id,
                camera_id="CAM_01",
                location="Perimeter Sector A - Entryway",
                waste_category="plastic_waste",
                confidence=0.88,
                evidence_folder=incident_folder,
                remarks="Automated simulation alert: Unauthorized plastic waste discarded within restricted zone."
            )

            EvidenceRepository.create(db, demo_incident_id, "IMAGE", img_path, file_size_bytes=len(dummy_frame))
            EvidenceRepository.create(db, demo_incident_id, "METADATA", meta_path, file_size_bytes=100)

            # Detection events
            DetectionEventRepository.create(
                db=db,
                camera_id="CAM_01",
                object_category="person",
                confidence=0.91,
                bbox=[180, 200, 260, 390],
                is_in_restricted_zone=True,
                zone_id="ZONE_01",
                provider_type="SIMULATED_MOCK"
            )
            DetectionEventRepository.create(
                db=db,
                camera_id="CAM_01",
                object_category="plastic_waste",
                confidence=0.88,
                bbox=[280, 310, 390, 400],
                is_in_restricted_zone=True,
                zone_id="ZONE_01",
                provider_type="SIMULATED_MOCK"
            )

        logger.info("Demo data seeding completed successfully.")
    except Exception as e:
        logger.error(f"Error during demo seeding: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_demo_data()
