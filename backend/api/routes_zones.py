from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from database.connection import get_db
from database.repository import ZoneRepository, CameraRepository
from models.schemas import ZoneCreate, ZoneUpdate, ZoneResponse
from monitoring.zone_evaluator import ZoneEvaluator

router = APIRouter(prefix="/zones", tags=["Restricted Zones"])

@router.get("", response_model=List[ZoneResponse])
def list_zones(camera_id: Optional[str] = None, db: Session = Depends(get_db)):
    """List restricted zones, optionally filtered by camera."""
    if camera_id:
        return ZoneRepository.get_by_camera(db, camera_id)
    return ZoneRepository.get_all(db)

@router.post("", response_model=ZoneResponse, status_code=status.HTTP_201_CREATED)
def create_zone(payload: ZoneCreate, db: Session = Depends(get_db)):
    """Define a new restricted zone boundary."""
    camera = CameraRepository.get(db, payload.camera_id)
    if not camera:
        raise HTTPException(status_code=400, detail=f"Referenced camera '{payload.camera_id}' does not exist.")

    # Validate polygon coordinates format
    pts = ZoneEvaluator.parse_polygon(payload.polygon_coords)
    if len(pts) < 3:
        raise HTTPException(status_code=400, detail="Zone polygon must contain at least 3 coordinates [[x,y],...]")

    existing = ZoneRepository.get(db, payload.id)
    if existing:
        raise HTTPException(status_code=400, detail=f"Zone with ID '{payload.id}' already exists.")

    zone = ZoneRepository.create(
        db=db,
        zone_id=payload.id,
        camera_id=payload.camera_id,
        name=payload.name,
        polygon_coords=payload.polygon_coords,
        description=payload.description,
        is_active=payload.is_active
    )
    return zone

@router.get("/{zone_id}", response_model=ZoneResponse)
def get_zone(zone_id: str, db: Session = Depends(get_db)):
    """Get restricted zone details."""
    zone = ZoneRepository.get(db, zone_id)
    if not zone:
        raise HTTPException(status_code=404, detail="Restricted zone not found.")
    return zone

@router.put("/{zone_id}", response_model=ZoneResponse)
def update_zone(zone_id: str, payload: ZoneUpdate, db: Session = Depends(get_db)):
    """Update restricted zone parameters."""
    if payload.polygon_coords:
        pts = ZoneEvaluator.parse_polygon(payload.polygon_coords)
        if len(pts) < 3:
            raise HTTPException(status_code=400, detail="Zone polygon must contain at least 3 coordinates.")

    zone = ZoneRepository.update(db, zone_id, **payload.model_dump(exclude_unset=True))
    if not zone:
        raise HTTPException(status_code=404, detail="Restricted zone not found.")
    return zone

@router.delete("/{zone_id}")
def delete_zone(zone_id: str, db: Session = Depends(get_db)):
    """Delete a restricted zone."""
    success = ZoneRepository.delete(db, zone_id)
    if not success:
        raise HTTPException(status_code=404, detail="Restricted zone not found.")
    return {"message": f"Restricted zone '{zone_id}' deleted successfully."}
