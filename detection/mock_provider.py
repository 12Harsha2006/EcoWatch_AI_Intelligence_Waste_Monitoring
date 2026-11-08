import random
import time
from typing import List, Dict, Any
import numpy as np

from detection.base import BaseDetectionProvider
from utils.logger import logger

class MockDetectionProvider(BaseDetectionProvider):
    """
    Simulated Object Detection Provider for development, testing, and UI integration.
    
    IMPORTANT NOTICE:
    This provider generates SIMULATED data for prototyping the monitoring architecture.
    It does NOT run real neural network inference.
    Pretrained AI models (YOLO, Grounding DINO, MediaPipe) will be plugged in later
    without changing the upstream codebase.
    """

    CATEGORIES = [
        "person",
        "plastic_waste",
        "garbage_bag",
        "cardboard_box",
        "construction_debris",
        "organic_waste"
    ]

    def __init__(self, simulation_mode: str = "dynamic"):
        """
        simulation_mode:
            - 'dynamic': Simulates a realistic cyclic sequence (person enters -> drops waste -> leaves)
            - 'static': Returns a constant mock detection box
            - 'random': Generates stochastic detections
        """
        self.mode = simulation_mode
        self._frame_counter = 0
        self._manual_incident_trigger = False
        logger.info(f"Initialized MockDetectionProvider (SIMULATED MODE: {self.mode})")

    @property
    def provider_name(self) -> str:
        return "MockDetectionProvider (SIMULATED)"

    @property
    def is_simulated(self) -> bool:
        return True

    @property
    def supported_categories(self) -> List[str]:
        return self.CATEGORIES

    def trigger_mock_incident(self):
        """Forces the next detection cycle to emit an unauthorized waste disposal event."""
        self._manual_incident_trigger = True
        logger.info("Manual mock incident requested for next detection frame.")

    def detect(self, frame: np.ndarray, confidence_threshold: float = 0.5) -> List[Dict[str, Any]]:
        """
        Generate simulated detections on the given frame.
        """
        self._frame_counter += 1
        height, width = frame.shape[:2] if frame is not None else (480, 640)

        detections: List[Dict[str, Any]] = []

        # Check if manual incident trigger is active or periodic cycle occurs
        cycle = self._frame_counter % 90  # 90-frame cycle (~3 to 5 seconds depending on FPS)

        should_generate_incident = self._manual_incident_trigger or (30 <= cycle <= 75)

        if should_generate_incident:
            self._manual_incident_trigger = False

            # 1. Person moving in scene
            # Walk from x=160 towards x=320
            progress = min(1.0, (cycle - 30) / 45.0) if cycle >= 30 else 0.5
            person_x1 = int(160 + progress * 100)
            person_y1 = int(height * 0.35)
            person_w = int(width * 0.12)
            person_h = int(height * 0.45)

            detections.append({
                "category": "person",
                "confidence": round(random.uniform(0.85, 0.95), 2),
                "bbox": [
                    person_x1,
                    person_y1,
                    min(width - 5, person_x1 + person_w),
                    min(height - 5, person_y1 + person_h)
                ],
                "is_simulated": True
            })

            # 2. Garbage discarded in restricted zone area (e.g. Center: x=250-400, y=280-380)
            waste_cat = random.choice(["plastic_waste", "garbage_bag", "cardboard_box", "construction_debris"])
            waste_x1 = int(person_x1 + person_w + 15)
            waste_y1 = int(person_y1 + person_h * 0.65)
            waste_w = int(width * 0.10)
            waste_h = int(height * 0.15)

            waste_conf = round(random.uniform(0.78, 0.92), 2)
            if waste_conf >= confidence_threshold:
                detections.append({
                    "category": waste_cat,
                    "confidence": waste_conf,
                    "bbox": [
                        waste_x1,
                        waste_y1,
                        min(width - 5, waste_x1 + waste_w),
                        min(height - 5, waste_y1 + waste_h)
                    ],
                    "is_simulated": True
                })
        else:
            # Baseline background: only occasional person walking outside zone or idle
            if self._frame_counter % 20 < 10:
                detections.append({
                    "category": "person",
                    "confidence": 0.88,
                    "bbox": [int(width * 0.05), int(height * 0.4), int(width * 0.15), int(height * 0.85)],
                    "is_simulated": True
                })

        return detections

