import numpy as np
from monitoring.video_source import VideoSource
from monitoring.zone_evaluator import ZoneEvaluator

def test_synthetic_video_source():
    source = VideoSource("CAM_SYN_TEST", "synthetic", "synthetic_source")
    assert source.is_opened() is True

    ret, frame = source.read_frame()
    assert ret is True
    assert isinstance(frame, np.ndarray)
    assert frame.shape == (480, 640, 3)

    source.release()
    assert source.is_opened() is False

def test_zone_evaluator_point_in_polygon():
    # Square zone: (100, 100) to (300, 300)
    polygon = [(100, 100), (300, 100), (300, 300), (100, 300)]

    # Point clearly inside
    inside_point = (200, 200)
    assert ZoneEvaluator.is_point_in_polygon(inside_point, polygon) is True

    # Point clearly outside
    outside_point = (50, 50)
    assert ZoneEvaluator.is_point_in_polygon(outside_point, polygon) is False

def test_zone_evaluator_detection():
    zones = [{
        "id": "Z1",
        "name": "Perimeter",
        "polygon_coords": "[[100, 100], [300, 100], [300, 300], [100, 300]]"
    }]

    # Box inside zone
    box_inside = [150, 150, 250, 250]
    in_zone, zid, zname = ZoneEvaluator.evaluate_detection(box_inside, zones)
    assert in_zone is True
    assert zid == "Z1"

    # Box outside zone
    box_outside = [10, 10, 50, 50]
    in_zone, zid, zname = ZoneEvaluator.evaluate_detection(box_outside, zones)
    assert in_zone is False
    assert zid is None
