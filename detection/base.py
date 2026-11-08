from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
import numpy as np

class BaseDetectionProvider(ABC):
    """
    Abstract Base Class for all object detection providers.
    Ensures that switching between simulated mock detection and future AI models
    (such as YOLOv8, Grounding DINO) requires zero changes to the backend or dashboard.
    """

    @property
    @abstractmethod
    def provider_name(self) -> str:
        """Name of the provider (e.g. 'MockDetectionProvider', 'YOLOv8Provider')."""
        pass

    @property
    @abstractmethod
    def is_simulated(self) -> bool:
        """
        Flag explicitly stating whether the provider outputs simulated data
        or real pretrained AI inferences.
        """
        pass

    @property
    @abstractmethod
    def supported_categories(self) -> List[str]:
        """List of object categories this provider can detect."""
        pass

    @abstractmethod
    def detect(self, frame: np.ndarray, confidence_threshold: float = 0.5) -> List[Dict[str, Any]]:
        """
        Execute object detection on a single frame.

        Parameters:
            frame (np.ndarray): OpenCV BGR frame.
            confidence_threshold (float): Minimum confidence score (0.0 to 1.0).

        Returns:
            List[Dict[str, Any]]: List of detections, where each item has:
                {
                    "category": str,           # e.g., 'person', 'plastic_waste'
                    "confidence": float,       # e.g., 0.89
                    "bbox": [x1, y1, x2, y2],  # bounding box pixel coordinates
                    "is_simulated": bool       # explicit simulation tag
                }
        """
        pass


class BaseTracker(ABC):
    """
    Abstract Base Class for multi-object tracking (e.g. ByteTrack, DeepSORT).
    Prepared for future tracking integration.
    """

    @abstractmethod
    def update(self, detections: List[Dict[str, Any]], frame: np.ndarray) -> List[Dict[str, Any]]:
        """
        Assign consistent tracking IDs to detections across consecutive frames.
        Returns detections with an added 'track_id' field.
        """
        pass


class BasePoseEstimator(ABC):
    """
    Abstract Base Class for human pose estimation (e.g. MediaPipe Pose).
    Prepared for future dumping action / gesture recognition.
    """

    @abstractmethod
    def estimate_pose(self, frame: np.ndarray, person_bbox: List[float]) -> Optional[Dict[str, Any]]:
        """
        Extract keypoints from a detected person to recognize bending,
        arm extension, or discarding movements.
        """
        pass
