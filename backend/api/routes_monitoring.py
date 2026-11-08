from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import StreamingResponse
from monitoring.stream_worker import camera_stream_manager
from utils.logger import logger

router = APIRouter(prefix="/monitoring", tags=["Live Monitoring"])

@router.post("/start/{camera_id}")
def start_camera_monitoring(camera_id: str):
    """Start video ingestion and real-time monitoring for a camera."""
    success = camera_stream_manager.start_camera(camera_id)
    if not success:
        raise HTTPException(status_code=400, detail=f"Failed to start monitoring on camera '{camera_id}'.")
    return {"status": "SUCCESS", "camera_id": camera_id, "monitoring": "ACTIVE"}

@router.post("/stop/{camera_id}")
def stop_camera_monitoring(camera_id: str):
    """Stop video ingestion and monitoring for a camera."""
    success = camera_stream_manager.stop_camera(camera_id)
    return {"status": "SUCCESS", "camera_id": camera_id, "monitoring": "INACTIVE"}

@router.get("/status/{camera_id}")
def get_camera_monitoring_status(camera_id: str):
    """Check whether a camera's video stream is currently active."""
    worker = camera_stream_manager.get_worker(camera_id)
    if not worker:
        return {"camera_id": camera_id, "status": "INACTIVE", "fps": 0.0}
    return {
        "camera_id": camera_id,
        "status": worker.status,
        "fps": worker.fps,
        "running": worker.running
    }

@router.get("/stream/{camera_id}")
def live_mjpeg_stream(camera_id: str):
    """
    Live MJPEG video stream endpoint.
    Embed directly into <img> tags in HTML or Streamlit.
    """
    return StreamingResponse(
        camera_stream_manager.generate_mjpeg_stream(camera_id),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )

@router.post("/trigger-mock/{camera_id}")
def trigger_mock_incident(camera_id: str):
    """
    Manually injects a simulated unauthorized waste dumping event on this camera stream.
    Useful for testing notifications and incident verification flow.
    """
    success = camera_stream_manager.trigger_incident(camera_id)
    if not success:
        raise HTTPException(status_code=400, detail=f"Camera '{camera_id}' is not currently running.")
    return {"status": "SIMULATION_TRIGGERED", "camera_id": camera_id}
