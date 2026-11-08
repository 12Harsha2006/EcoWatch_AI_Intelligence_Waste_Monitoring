import io
import csv
import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, Response
from sqlalchemy.orm import Session
from typing import List, Optional

from database.connection import get_db
from database.repository import IncidentRepository
from models.schemas import (
    IncidentResponse,
    IncidentUpdateStatus,
    IncidentMetrics
)

router = APIRouter(prefix="/incidents", tags=["Incidents"])

@router.get("", response_model=List[IncidentResponse])
def list_incidents(
    status: Optional[str] = Query(None, description="Filter: PENDING, VERIFIED, REJECTED, RESOLVED, or ALL"),
    camera_id: Optional[str] = Query(None, description="Filter by Camera ID"),
    waste_category: Optional[str] = Query(None, description="Filter by Waste Category"),
    start_date: Optional[datetime.datetime] = Query(None, description="Start date timestamp filter"),
    end_date: Optional[datetime.datetime] = Query(None, description="End date timestamp filter"),
    db: Session = Depends(get_db)
):
    """Retrieve incidents with optional status, camera, and date range filters."""
    return IncidentRepository.get_all(
        db=db,
        status=status,
        camera_id=camera_id,
        waste_category=waste_category,
        start_date=start_date,
        end_date=end_date
    )

@router.get("/metrics/summary", response_model=IncidentMetrics)
def get_dashboard_metrics(db: Session = Depends(get_db)):
    """Aggregate statistics for the administrative dashboard overview."""
    return IncidentRepository.get_metrics(db)

@router.get("/export/csv")
def export_incidents_csv(
    status: Optional[str] = Query(None),
    camera_id: Optional[str] = Query(None),
    waste_category: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Generate and export a CSV report containing incident records.
    Fulfills MODULE 9: REPORT GENERATION.
    """
    incidents = IncidentRepository.get_all(
        db=db,
        status=status,
        camera_id=camera_id,
        waste_category=waste_category
    )

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Incident ID",
        "Timestamp (UTC)",
        "Camera ID",
        "Location",
        "Waste Category",
        "Confidence Score",
        "Verification Status",
        "Remarks",
        "Evidence Directory"
    ])

    for inc in incidents:
        writer.writerow([
            inc.id,
            inc.timestamp.isoformat() if inc.timestamp else "",
            inc.camera_id,
            inc.location,
            inc.waste_category,
            f"{inc.confidence:.2f}",
            inc.status,
            inc.remarks or "",
            inc.evidence_folder
        ])

    csv_data = output.getvalue()
    filename = f"waste_incidents_report_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"

    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@router.get("/{incident_id}", response_model=IncidentResponse)
def get_incident(incident_id: str, db: Session = Depends(get_db)):
    """Get complete details for a specific incident including evidence and audit log."""
    incident = IncidentRepository.get(db, incident_id)
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found.")
    return incident

@router.post("/{incident_id}/verify", response_model=IncidentResponse)
def verify_incident(incident_id: str, payload: IncidentUpdateStatus, db: Session = Depends(get_db)):
    """Mark an incident as VERIFIED."""
    incident = IncidentRepository.update_status(
        db=db,
        incident_id=incident_id,
        new_status="VERIFIED",
        remarks=payload.remarks,
        verified_by=payload.verified_by
    )
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found.")
    return incident

@router.post("/{incident_id}/reject", response_model=IncidentResponse)
def reject_incident(incident_id: str, payload: IncidentUpdateStatus, db: Session = Depends(get_db)):
    """Reject a false alert incident."""
    incident = IncidentRepository.update_status(
        db=db,
        incident_id=incident_id,
        new_status="REJECTED",
        remarks=payload.remarks,
        verified_by=payload.verified_by
    )
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found.")
    return incident

@router.post("/{incident_id}/resolve", response_model=IncidentResponse)
def resolve_incident(incident_id: str, payload: IncidentUpdateStatus, db: Session = Depends(get_db)):
    """Mark an incident as clean / RESOLVED."""
    incident = IncidentRepository.update_status(
        db=db,
        incident_id=incident_id,
        new_status="RESOLVED",
        remarks=payload.remarks,
        verified_by=payload.verified_by
    )
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found.")
    return incident

