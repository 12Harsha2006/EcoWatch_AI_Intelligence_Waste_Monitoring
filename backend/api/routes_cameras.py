from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from pathlib import Path
import shutil

from database.connection import get_db
from database.repository import CameraRepository
from models.schemas import CameraCreate, CameraUpdate, CameraResponse
from utils.logger import logger
from utils.config import BASE_DIR

UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

router = APIRouter(prefix="/cameras", tags=["Cameras"])

@router.get("", response_model=List[CameraResponse])
def list_cameras(db: Session = Depends(get_db)):
    """List all registered cameras."""
    return CameraRepository.get_all(db)

@router.post("", response_model=CameraResponse, status_code=status.HTTP_201_CREATED)
def create_camera(payload: CameraCreate, db: Session = Depends(get_db)):
    """Register a new camera source."""
    existing = CameraRepository.get(db, payload.id)
    if existing:
        raise HTTPException(status_code=400, detail=f"Camera with ID '{payload.id}' already exists.")
    
    camera = CameraRepository.create(
        db=db,
        camera_id=payload.id,
        name=payload.name,
        location=payload.location,
        source_type=payload.source_type,
        source_path=payload.source_path,
        is_enabled=payload.is_enabled
    )
    return camera

@router.get("/{camera_id}", response_model=CameraResponse)
def get_camera(camera_id: str, db: Session = Depends(get_db)):
    """Get camera details by ID."""
    camera = CameraRepository.get(db, camera_id)
    if not camera:
        raise HTTPException(status_code=404, detail="Camera not found.")
    return camera

@router.put("/{camera_id}", response_model=CameraResponse)
def update_camera(camera_id: str, payload: CameraUpdate, db: Session = Depends(get_db)):
    """Update camera configuration."""
    camera = CameraRepository.update(db, camera_id, **payload.model_dump(exclude_unset=True))
    if not camera:
        raise HTTPException(status_code=404, detail="Camera not found.")
    return camera

@router.delete("/{camera_id}")
def delete_camera(camera_id: str, db: Session = Depends(get_db)):
    """Delete a camera and its associated zones."""
    success = CameraRepository.delete(db, camera_id)
    if not success:
        raise HTTPException(status_code=404, detail="Camera not found.")
    return {"message": f"Camera '{camera_id}' deleted successfully."}

@router.post("/{camera_id}/toggle", response_model=CameraResponse)
def toggle_camera(camera_id: str, db: Session = Depends(get_db)):
    """Toggle camera enabled/disabled status."""
    camera = CameraRepository.get(db, camera_id)
    if not camera:
        raise HTTPException(status_code=404, detail="Camera not found.")
    
    new_state = not camera.is_enabled
    new_status = "ACTIVE" if new_state else "INACTIVE"
    updated = CameraRepository.update(db, camera_id, is_enabled=new_state, status=new_status)
    return updated

@router.post("/upload", response_model=CameraResponse, status_code=status.HTTP_201_CREATED)
def upload_camera_video(
    camera_id: str = Form(...),
    name: str = Form(...),
    location: str = Form(...),
    file: UploadFile = File(...),
    is_enabled: bool = Form(True),
    db: Session = Depends(get_db)
):
    """
    Upload a surveillance video file (.mp4, .avi, etc.) and register it as an active camera source.
    """
    existing = CameraRepository.get(db, camera_id)
    if existing:
        raise HTTPException(status_code=400, detail=f"Camera with ID '{camera_id}' already exists.")

    # Save uploaded file
    safe_filename = Path(file.filename).name
    save_path = UPLOAD_DIR / f"{camera_id}_{safe_filename}"
    
    with open(save_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    camera = CameraRepository.create(
        db=db,
        camera_id=camera_id,
        name=name,
        location=location,
        source_type="file",
        source_path=str(save_path),
        is_enabled=is_enabled
    )
    logger.info(f"Uploaded video surveillance source registered: {camera_id} at {save_path}")
    return camera

