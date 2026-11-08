"""Detection package for Waste Disposal Detection System."""
from detection.base import BaseDetectionProvider
from detection.mock_provider import MockDetectionProvider

__all__ = ["BaseDetectionProvider", "MockDetectionProvider"]
