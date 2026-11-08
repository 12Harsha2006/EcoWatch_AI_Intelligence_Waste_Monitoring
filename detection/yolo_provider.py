from typing import List, Dict, Any
import numpy as np

from detection.base import BaseDetectionProvider
from utils.logger import logger

class YOLOProvider(BaseDetectionProvider):
    """
    Real Pretrained AI Provider using Ultralytics YOLO (e.g. YOLOv8 / YOLOv11).
    
    This class adheres to the BaseDetectionProvider interface.
    When pretrained weights (such as 'yolov8n.pt' or custom fine-tuned waste model)
    are downloaded, this provider will be activated via the configuration setting:
        DETECTION_PROVIDER=yolo
    """

    def __init__(self, model_weights_path: str = "yolov8n.pt"):
        self.model_weights = model_weights_path
        self._model = None
        self._is_ready = False
        self._init_model()

    def _init_model(self):
        try:
            from ultralytics import YOLO
            self._model = YOLO(self.model_weights)
            self._is_ready = True
            logger.info(f"Loaded YOLO model from {self.model_weights}")
        except Exception as e:
            logger.warning(
                f"YOLO model could not be initialized ({e}). "
                "Ensure weights file is present and dependencies are installed."
            )
            self._is_ready = False

    @property
    def provider_name(self) -> str:
        return f"YOLOProvider ({self.model_weights})"

    @property
    def is_simulated(self) -> bool:
        return False

    @property
    def supported_categories(self) -> List[str]:
        if self._is_ready and hasattr(self._model, "names"):
            return list(self._model.names.values())
        return ["person", "bottle", "cup", "backpack", "suitcase"]

    def detect(self, frame: np.ndarray, confidence_threshold: float = 0.5) -> List[Dict[str, Any]]:
        if not self._is_ready or self._model is None:
            logger.error("YOLO model is not ready. Falling back to empty detections.")
            return []

        results = self._model(frame, conf=confidence_threshold, verbose=False)
        detections: List[Dict[str, Any]] = []

        for r in results:
            boxes = r.boxes
            for box in boxes:
                cls_id = int(box.cls[0].item())
                cat_name = self._model.names.get(cls_id, f"class_{cls_id}")
                conf = float(box.conf[0].item())
                coords = [float(v) for v in box.xyxy[0].tolist()]

                detections.append({
                    "category": cat_name,
                    "confidence": round(conf, 2),
                    "bbox": coords,
                    "is_simulated": False
                })

        return detections
