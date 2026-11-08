import cv2
import numpy as np
from typing import List, Dict, Any, Tuple

# Distinct color palette for categories (BGR format)
COLOR_PERSON = (255, 178, 50)      # Blue/Orange
COLOR_GARBAGE = (0, 0, 255)        # Red
COLOR_ZONE = (0, 165, 255)         # Orange
COLOR_ZONE_VIOLATION = (0, 0, 220) # Deep Red
COLOR_TEXT_BG = (30, 30, 30)

def draw_polygon_zone(
    frame: np.ndarray,
    polygon_points: List[Tuple[int, int]],
    zone_name: str = "Restricted Zone",
    is_violated: bool = False,
    alpha: float = 0.25
) -> np.ndarray:
    """
    Draw a semi-transparent polygon zone onto the frame with a label.
    """
    if len(polygon_points) < 3:
        return frame

    overlay = frame.copy()
    pts = np.array(polygon_points, np.int32).reshape((-1, 1, 2))
    fill_color = COLOR_ZONE_VIOLATION if is_violated else COLOR_ZONE

    # Draw filled polygon on overlay
    cv2.fillPoly(overlay, [pts], fill_color)
    cv2.polylines(frame, [pts], isClosed=True, color=fill_color, thickness=2)

    # Blend with original frame
    cv2.addWeighted(overlay, alpha, frame, 1 - alpha, 0, frame)

    # Draw zone label
    start_x, start_y = polygon_points[0]
    cv2.putText(
        frame,
        f"[ZONE] {zone_name}",
        (start_x, max(20, start_y - 10)),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.55,
        fill_color,
        2
    )
    return frame

def draw_detections(
    frame: np.ndarray,
    detections: List[Dict[str, Any]],
    is_simulated: bool = False
) -> np.ndarray:
    """
    Draw bounding boxes, labels, and confidence tags on the frame.
    Detections format:
        [
            {
                "category": "garbage" | "person" | etc.,
                "confidence": 0.88,
                "bbox": [x1, y1, x2, y2],
                "in_zone": True/False
            }
        ]
    """
    output = frame.copy()

    for det in detections:
        bbox = det.get("bbox", [0, 0, 0, 0])
        x1, y1, x2, y2 = [int(v) for v in bbox]
        category = det.get("category", "object")
        confidence = det.get("confidence", 0.0)
        in_zone = det.get("in_zone", False)

        # Determine color
        if "garbage" in category.lower() or "waste" in category.lower():
            color = COLOR_GARBAGE
        elif "person" in category.lower():
            color = COLOR_PERSON
        else:
            color = (0, 255, 0)

        if in_zone and ("garbage" in category.lower() or "waste" in category.lower()):
            color = (0, 0, 255) # Intense red alert

        # Draw box
        cv2.rectangle(output, (x1, y1), (x2, y2), color, 2)

        # Label formatting
        label = f"{category.upper()}: {confidence:.2f}"
        if in_zone:
            label += " [IN ZONE]"

        # Draw label background for readability
        (tw, th), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 1)
        cv2.rectangle(output, (x1, max(0, y1 - 22)), (x1 + tw + 6, max(22, y1)), color, -1)
        cv2.putText(
            output,
            label,
            (x1 + 3, max(16, y1 - 5)),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.5,
            (255, 255, 255),
            1,
            cv2.LINE_AA
        )

    # Watermark if simulated
    if is_simulated:
        watermark = "[SIMULATED DETECTION - MOCK PROVIDER]"
        cv2.putText(
            output,
            watermark,
            (15, 25),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.65,
            (0, 255, 255),
            2,
            cv2.LINE_AA
        )

    return output
