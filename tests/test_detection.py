import numpy as np
from detection.mock_provider import MockDetectionProvider
from detection.base import BaseDetectionProvider

def test_mock_provider_implements_interface():
    provider = MockDetectionProvider()
    assert isinstance(provider, BaseDetectionProvider)
    assert provider.is_simulated is True
    assert "MockDetectionProvider" in provider.provider_name

def test_mock_detections_format():
    provider = MockDetectionProvider()
    dummy_frame = np.zeros((480, 640, 3), dtype=np.uint8)

    # Force simulated incident detection
    provider.trigger_mock_incident()
    detections = provider.detect(dummy_frame)

    assert isinstance(detections, list)
    assert len(detections) >= 1

    for det in detections:
        assert "category" in det
        assert "confidence" in det
        assert "bbox" in det
        assert det["is_simulated"] is True
        assert len(det["bbox"]) == 4

        # Validate bounding box boundaries
        x1, y1, x2, y2 = det["bbox"]
        assert 0 <= x1 < x2 <= 640
        assert 0 <= y1 < y2 <= 480
        assert 0.0 <= det["confidence"] <= 1.0

