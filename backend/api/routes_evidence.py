from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from pathlib import Path
from typing import List

from database.connection import get_db
from database.repository import EvidenceRepository, IncidentRepository
from models.schemas import EvidenceResponse
from utils.file_manager import evidence_manager

router = APIRouter(prefix="/evidence", tags=["Evidence Management"])

@router.get("/{incident_id}", response_model=List[EvidenceResponse])
def get_incident_evidence_records(incident_id: str, db: Session = Depends(get_db)):
    """List all registered evidence items for a given incident."""
    incident = IncidentRepository.get(db, incident_id)
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found.")
    return EvidenceRepository.get_by_incident(db, incident_id)

@router.get("/{incident_id}/download/{filename}")
def download_evidence_file(incident_id: str, filename: str):
    """
    Download a specific evidence file (e.g. incident.jpg, incident_video.mp4, metadata.json).
    """
    incident_dir = evidence_manager.get_incident_dir(incident_id)
    safe_filename = Path(filename).name  # Prevent directory traversal
    file_path = incident_dir / safe_filename

    if not file_path.exists() or not file_path.is_file():
        raise HTTPException(status_code=404, detail=f"Evidence file '{safe_filename}' not found.")

    media_type = "application/octet-stream"
    if safe_filename.endswith(".jpg") or safe_filename.endswith(".jpeg"):
        media_type = "image/jpeg"
    elif safe_filename.endswith(".mp4"):
        media_type = "video/mp4"
    elif safe_filename.endswith(".json"):
        media_type = "application/json"

    return FileResponse(path=str(file_path), media_type=media_type, filename=safe_filename)

