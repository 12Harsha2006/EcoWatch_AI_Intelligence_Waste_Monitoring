import json
import cv2
import numpy as np
from typing import List, Dict, Any, Tuple, Optional
from utils.logger import logger

class ZoneEvaluator:
    """
    Evaluates whether detected objects (bounding boxes) fall within
    geometrical restricted zones defined by arbitrary 2D polygons.
    """

    @staticmethod
    def parse_polygon(coords_json: str) -> List[Tuple[int, int]]:
        """
        Parses JSON array string into list of (x, y) integer tuples.
        Example input: '[[100, 150], [450, 150], [450, 420], [100, 420]]'
        """
        try:
            raw_pts = json.loads(coords_json)
            pts = [(int(p[0]), int(p[1])) for p in raw_pts]
            return pts
        except Exception as e:
            logger.error(f"Failed to parse zone polygon coordinates: {e}")
            return []

    @classmethod
    def is_point_in_polygon(cls, point: Tuple[float, float], polygon_points: List[Tuple[int, int]]) -> bool:
        """
        Check if (x, y) point is inside polygon using cv2.pointPolygonTest.
        """
        if len(polygon_points) < 3:
            return False

        contour = np.array(polygon_points, dtype=np.int32)
        dist = cv2.pointPolygonTest(contour, (float(point[0]), float(point[1])), measureDist=False)
        return dist >= 0

    @classmethod
    def evaluate_detection(
        cls,
        bbox: List[float],
        zones: List[Dict[str, Any]]
    ) -> Tuple[bool, Optional[str], Optional[str]]:
        """
        Evaluates a bounding box against a list of active zones.

        Returns:
            (is_in_zone: bool, zone_id: Optional[str], zone_name: Optional[str])
        """
        x1, y1, x2, y2 = bbox

        # Bottom-center represents ground contact point (where waste lies or person stands)
        bottom_center = ((x1 + x2) / 2.0, y2)
        center = ((x1 + x2) / 2.0, (y1 + y2) / 2.0)

        for z in zones:
            coords = z.get("polygon_coords")
            if isinstance(coords, str):
                polygon_pts = cls.parse_polygon(coords)
            elif isinstance(coords, list):
                polygon_pts = coords
            else:
                continue

            # Check bottom-center first, then centroid
            if cls.is_point_in_polygon(bottom_center, polygon_pts) or cls.is_point_in_polygon(center, polygon_pts):
                return True, z.get("id"), z.get("name")

        return False, None, None

