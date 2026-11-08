import cv2
import numpy as np
import time
from typing import Tuple, Optional
from utils.logger import logger

class VideoSource:
    """
    Abstractions over OpenCV VideoCapture supporting:
    - Webcams (source_type='webcam', source_path='0')
    - Uploaded video files (source_type='file', source_path='path/to/video.mp4')
    - RTSP/CCTV live IP feeds (source_type='rtsp', source_path='rtsp://...')
    - Synthetic Demo feeds (source_type='synthetic', source_path='synthetic_stream')
    """

    def __init__(self, camera_id: str, source_type: str, source_path: str, width: int = 640, height: int = 480):
        self.camera_id = camera_id
        self.source_type = source_type.lower()
        self.source_path = str(source_path)
        self.width = width
        self.height = height

        self.cap: Optional[cv2.VideoCapture] = None
        self.is_synthetic = (self.source_type == "synthetic" or not self.source_path)
        self._frame_count = 0
        self._opened = False

        self._open()

    def _open(self):
        if self.is_synthetic:
            self._opened = True
            logger.info(f"Initialized synthetic video source for {self.camera_id}")
            return

        try:
            if self.source_type == "webcam":
                idx = int(self.source_path) if self.source_path.isdigit() else 0
                self.cap = cv2.VideoCapture(idx)
            else:
                self.cap = cv2.VideoCapture(self.source_path)

            if not self.cap or not self.cap.isOpened():
                logger.warning(
                    f"Could not open physical/file video source '{self.source_path}' for {self.camera_id}. "
                    "Falling back to synthetic simulated stream."
                )
                self.is_synthetic = True
                self._opened = True
            else:
                self._opened = True
                self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, self.width)
                self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, self.height)
                logger.info(f"Connected to video source '{self.source_path}' for camera {self.camera_id}")
        except Exception as e:
            logger.error(f"Error opening source for {self.camera_id}: {e}. Falling back to synthetic.")
            self.is_synthetic = True
            self._opened = True

    def read_frame(self) -> Tuple[bool, Optional[np.ndarray]]:
        """
        Read the next frame.
        Returns (success: bool, frame: np.ndarray).
        """
        if not self._opened:
            return False, None

        self._frame_count += 1

        if self.is_synthetic:
            return True, self._generate_synthetic_frame()

        ret, frame = self.cap.read()
        if not ret or frame is None:
            # If video file reached EOF, loop back to the beginning
            if self.source_type == "file" and self.cap:
                self.cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                ret, frame = self.cap.read()

        if not ret or frame is None:
            # If still failing, output synthetic fallback
            return True, self._generate_synthetic_frame()

        if frame.shape[1] != self.width or frame.shape[0] != self.height:
            frame = cv2.resize(frame, (self.width, self.height))

        return True, frame

    def _generate_synthetic_frame(self) -> np.ndarray:
        """
        Creates a realistic simulated CCTV background frame with simulated motion.
        """
        frame = np.zeros((self.height, self.width, 3), dtype=np.uint8)

        # Gradient background simulating a street/facility pavement
        for y in range(self.height):
            c_val = int(35 + (y / self.height) * 40)
            frame[y, :] = (c_val, c_val, c_val)

        # Draw curb / lane markings
        cv2.line(frame, (0, int(self.height * 0.7)), (self.width, int(self.height * 0.7)), (80, 80, 80), 3)
        cv2.line(frame, (int(self.width * 0.3), 0), (int(self.width * 0.3), self.height), (60, 60, 60), 1)

        # Top status bar
        cv2.rectangle(frame, (0, 0), (self.width, 35), (20, 20, 20), -1)

        # Camera ID & Timestamp
        now_str = time.strftime("%Y-%m-%d %H:%M:%S")
        status_text = f"CCTV [{self.camera_id}] LIVE | {now_str}"
        cv2.putText(frame, status_text, (15, 23), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (0, 255, 0), 1, cv2.LINE_AA)

        # Simulated moving elements
        dot_x = int((self._frame_count * 2) % self.width)
        cv2.circle(frame, (dot_x, int(self.height * 0.15)), 3, (0, 100, 255), -1)

        return frame

    def is_opened(self) -> bool:
        return self._opened

    def release(self):
        """Release OpenCV video capture resources."""
        if self.cap is not None:
            try:
                self.cap.release()
            except Exception:
                pass
            self.cap = None
        self._opened = False
        logger.info(f"Released video source for camera {self.camera_id}")
