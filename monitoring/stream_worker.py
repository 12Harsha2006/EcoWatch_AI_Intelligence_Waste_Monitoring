import threading
import time
import cv2
import numpy as np
from collections import deque
from typing import Dict, Optional, Generator, Any

from database.connection import SessionLocal
from database.repository import CameraRepository, ZoneRepository
from detection.mock_provider import MockDetectionProvider
from detection.yolo_provider import YOLOProvider
from monitoring.video_source import VideoSource
from monitoring.event_engine import EventEngine
from utils.visualizer import draw_detections, draw_polygon_zone
from utils.config import settings
from utils.logger import logger

class CameraWorker:
    """
    Background worker thread dedicated to capturing, analyzing,
    and streaming video for a single camera.
    """

    def __init__(self, camera_id: str, source_type: str, source_path: str):
        self.camera_id = camera_id
        self.source_type = source_type
        self.source_path = source_path

        self.running = False
        self.thread: Optional[threading.Thread] = None

        self.video_source: Optional[VideoSource] = None
        self.event_engine = EventEngine(cooldown_seconds=12)

        # Select detection provider based on configuration
        if settings.DETECTION_PROVIDER.lower() == "yolo":
            self.detector = YOLOProvider()
        else:
            self.detector = MockDetectionProvider(simulation_mode="dynamic")

        # Rolling frame buffer (last 30 frames for incident video clips)
        self.frame_buffer = deque(maxlen=30)
        self.latest_annotated_frame: Optional[np.ndarray] = None
        self.latest_jpeg_bytes: Optional[bytes] = None
        self.lock = threading.Lock()
        self.status = "INITIALIZING"
        self.fps = 0.0

    def start(self):
        if self.running:
            return
        self.running = True
        self.thread = threading.Thread(target=self._run_loop, name=f"Worker-{self.camera_id}", daemon=True)
        self.thread.start()
        logger.info(f"Started monitoring worker thread for {self.camera_id}")

    def stop(self):
        self.running = False
        if self.thread and self.thread.is_alive():
            self.thread.join(timeout=2.0)
        if self.video_source:
            self.video_source.release()
        self.status = "INACTIVE"
        logger.info(f"Stopped monitoring worker thread for {self.camera_id}")

    def trigger_incident(self):
        """Forces mock provider to trigger an unauthorized waste disposal event."""
        if hasattr(self.detector, "trigger_mock_incident"):
            self.detector.trigger_mock_incident()

    def _run_loop(self):
        self.status = "ACTIVE"
        try:
            self.video_source = VideoSource(self.camera_id, self.source_type, self.source_path)
            frame_times = deque(maxlen=10)

            while self.running:
                t0 = time.time()
                success, frame = self.video_source.read_frame()
                if not success or frame is None:
                    time.sleep(0.05)
                    continue

                # Fetch active zones from DB periodically
                zones_data = []
                try:
                    db = SessionLocal()
                    db_zones = ZoneRepository.get_by_camera(db, self.camera_id, active_only=True)
                    for z in db_zones:
                        zones_data.append({
                            "id": z.id,
                            "name": z.name,
                            "polygon_coords": z.polygon_coords
                        })
                    db.close()
                except Exception:
                    pass

                # Store raw frame in rolling history
                self.frame_buffer.append(frame.copy())

                # Run object detection
                detections = self.detector.detect(frame, confidence_threshold=settings.CONFIDENCE_THRESHOLD)

                # Process events through Event Engine
                self.event_engine.process_frame_events(
                    camera_id=self.camera_id,
                    frame=frame,
                    detections=detections,
                    zones=zones_data,
                    recent_frames=list(self.frame_buffer),
                    provider_type="SIMULATED_MOCK" if self.detector.is_simulated else "YOLO_V8"
                )

                # Render overlay for live streaming
                display_frame = frame.copy()
                for z in zones_data:
                    from monitoring.zone_evaluator import ZoneEvaluator
                    pts = ZoneEvaluator.parse_polygon(z.get("polygon_coords", "[]"))
                    draw_polygon_zone(display_frame, pts, z.get("name", "Zone"), is_violated=False)

                display_frame = draw_detections(
                    display_frame,
                    detections,
                    is_simulated=self.detector.is_simulated
                )

                # Compress to JPEG for high-speed streaming
                ret, jpeg = cv2.imencode(".jpg", display_frame, [int(cv2.IMWRITE_JPEG_QUALITY), 75])

                with self.lock:
                    self.latest_annotated_frame = display_frame
                    if ret:
                        self.latest_jpeg_bytes = jpeg.tobytes()

                # FPS calculation & throttling (~15-20 FPS)
                t1 = time.time()
                dt = t1 - t0
                frame_times.append(dt)
                if frame_times:
                    self.fps = round(len(frame_times) / sum(frame_times), 1)

                sleep_time = max(0.01, (1.0 / 18.0) - dt)
                time.sleep(sleep_time)

        except Exception as e:
            logger.error(f"Worker {self.camera_id} encountered error: {e}")
            self.status = "ERROR"
        finally:
            if self.video_source:
                self.video_source.release()
            self.status = "INACTIVE"

    def get_latest_jpeg(self) -> Optional[bytes]:
        with self.lock:
            return self.latest_jpeg_bytes


class StreamManager:
    """
    Central coordinator managing video processing workers across all registered cameras.
    """

    def __init__(self):
        self._workers: Dict[str, CameraWorker] = {}
        self._lock = threading.Lock()

    def start_camera(self, camera_id: str) -> bool:
        with self._lock:
            if camera_id in self._workers and self._workers[camera_id].running:
                return True

            db = SessionLocal()
            camera = CameraRepository.get(db, camera_id)
            if not camera:
                db.close()
                logger.error(f"Cannot start camera {camera_id}: not found in database.")
                return False

            source_type = camera.source_type
            source_path = camera.source_path
            CameraRepository.update(db, camera_id, status="ACTIVE")
            db.close()

            worker = CameraWorker(camera_id, source_type, source_path)
            worker.start()
            self._workers[camera_id] = worker
            return True

    def stop_camera(self, camera_id: str) -> bool:
        with self._lock:
            worker = self._workers.get(camera_id)
            if worker:
                worker.stop()
                del self._workers[camera_id]

            db = SessionLocal()
            CameraRepository.update(db, camera_id, status="INACTIVE")
            db.close()
            return True

    def stop_all(self):
        with self._lock:
            for cid, worker in list(self._workers.items()):
                worker.stop()
            self._workers.clear()

    def is_running(self, camera_id: str) -> bool:
        with self._lock:
            worker = self._workers.get(camera_id)
            return worker.running if worker else False

    def trigger_incident(self, camera_id: str) -> bool:
        with self._lock:
            worker = self._workers.get(camera_id)
            if worker:
                worker.trigger_incident()
                return True
            return False

    def get_worker(self, camera_id: str) -> Optional[CameraWorker]:
        with self._lock:
            return self._workers.get(camera_id)

    def generate_mjpeg_stream(self, camera_id: str) -> Generator[bytes, None, None]:
        """
        MJPEG generator yielding multipart HTTP boundaries for live browser display.
        """
        worker = self.get_worker(camera_id)
        if not worker or not worker.running:
            # Try starting automatically
            self.start_camera(camera_id)
            worker = self.get_worker(camera_id)

        while worker and worker.running:
            jpeg = worker.get_latest_jpeg()
            if jpeg is not None:
                yield (b"--frame\r\n"
                       b"Content-Type: image/jpeg\r\n\r\n" + jpeg + b"\r\n")
            time.sleep(0.04)  # ~25 FPS max


# Global singleton StreamManager
camera_stream_manager = StreamManager()

