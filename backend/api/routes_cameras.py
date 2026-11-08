from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database.connection import get_db
from database.repository import CameraRepository
from models.schemas import CameraCreate, CameraUpdate, CameraResponse
from utils.logger import logger

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
