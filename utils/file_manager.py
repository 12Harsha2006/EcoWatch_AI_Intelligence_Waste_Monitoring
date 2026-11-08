import os
import json
import shutil
from pathlib import Path
from typing import Dict, Any, Optional
import cv2
import numpy as np

from utils.config import settings
from utils.logger import logger

class EvidenceFileManager:
    """
    Manages filesystem evidence storage for detected incidents.
    Each incident has its own isolated subfolder:
        evidence/{incident_id}/
            incident.jpg
            incident_video.mp4 (optional)
            metadata.json
    """

    def __init__(self, base_evidence_dir: Optional[str] = None):
        self.base_dir = Path(base_evidence_dir or settings.EVIDENCE_DIR)
        self.base_dir.mkdir(parents=True, exist_ok=True)

    def get_incident_dir(self, incident_id: str) -> Path:
        """
        Return the directory path for a specific incident.
        Creates it if it does not exist.
        """
        # Sanitize folder name
        safe_id = "".join(c for c in incident_id if c.isalnum() or c in ("-", "_"))
        incident_dir = self.base_dir / safe_id
        incident_dir.mkdir(parents=True, exist_ok=True)
        return incident_dir

    def save_incident_image(self, incident_id: str, frame: np.ndarray, filename: str = "incident.jpg") -> str:
        """
        Save a numpy OpenCV frame as an incident evidence image.
        Returns the absolute file path.
        """
        try:
            if frame is None or frame.size == 0:
                raise ValueError("Frame is empty or invalid.")

            target_dir = self.get_incident_dir(incident_id)
            target_path = target_dir / filename
            success = cv2.imwrite(str(target_path), frame)
            if not success:
                raise IOError(f"OpenCV failed to write image to {target_path}")

            logger.info(f"Saved incident evidence image: {target_path}")
            return str(target_path)
        except Exception as e:
            logger.error(f"Error saving incident image for {incident_id}: {e}")
            raise

    def save_incident_video(self, incident_id: str, frames: list, fps: int = 15, filename: str = "incident_video.mp4") -> Optional[str]:
        """
        Save a sequence of OpenCV frames as an MP4 evidence video clip.
        Returns the absolute file path or None if frames list is empty.
        """
        if not frames:
            logger.warning(f"No frames provided to write video clip for {incident_id}")
            return None

        try:
            target_dir = self.get_incident_dir(incident_id)
            target_path = target_dir / filename

            height, width, _ = frames[0].shape
            fourcc = cv2.VideoWriter_fourcc(*"mp4v")
            out = cv2.VideoWriter(str(target_path), fourcc, fps, (width, height))

            for frame in frames:
                if frame is not None and frame.shape == frames[0].shape:
                    out.write(frame)
            out.release()

            logger.info(f"Saved incident evidence video clip: {target_path} ({len(frames)} frames)")
            return str(target_path)
        except Exception as e:
            logger.error(f"Error writing incident video clip for {incident_id}: {e}")
            return None

    def save_metadata(self, incident_id: str, metadata: Dict[str, Any], filename: str = "metadata.json") -> str:
        """
        Save incident metadata JSON file.
        """
        try:
            target_dir = self.get_incident_dir(incident_id)
            target_path = target_dir / filename
            with open(target_path, "w", encoding="utf-8") as f:
                json.dump(metadata, f, indent=4, default=str)

            logger.info(f"Saved incident metadata: {target_path}")
            return str(target_path)
        except Exception as e:
            logger.error(f"Error writing metadata for {incident_id}: {e}")
            raise

    def get_metadata(self, incident_id: str, filename: str = "metadata.json") -> Optional[Dict[str, Any]]:
        """
        Read incident metadata JSON file if present.
        """
        target_path = self.get_incident_dir(incident_id) / filename
        if not target_path.exists():
            return None
        try:
            with open(target_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Error reading metadata for {incident_id}: {e}")
            return None

    def validate_file(self, file_path: str) -> bool:
        """
        Check if an evidence file exists and has non-zero size.
        """
        path = Path(file_path)
        return path.exists() and path.is_file() and path.stat().st_size > 0

    def delete_incident_evidence(self, incident_id: str) -> bool:
        """
        Remove the entire incident directory.
        """
        try:
            target_dir = self.get_incident_dir(incident_id)
            if target_dir.exists():
                shutil.rmtree(target_dir)
                logger.info(f"Deleted evidence folder for {incident_id}")
                return True
            return False
        except Exception as e:
            logger.error(f"Error deleting evidence for {incident_id}: {e}")
            return False

# Singleton instance
evidence_manager = EvidenceFileManager()
