import uuid
import datetime
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func, desc

from database.models import (
    Camera,
    RestrictedZone,
    DetectionEvent,
    Incident,
    EvidenceRecord,
    VerificationRecord,
    utc_now
)
from utils.logger import logger

class CameraRepository:
    @staticmethod
    def create(db: Session, camera_id: str, name: str, location: str, source_type: str = "webcam", source_path: str = "0", is_enabled: bool = True) -> Camera:
        camera = Camera(
            id=camera_id,
            name=name,
            location=location,
            source_type=source_type,
            source_path=source_path,
            status="ACTIVE" if is_enabled else "INACTIVE",
            is_enabled=is_enabled
        )
        db.add(camera)
        db.commit()
        db.refresh(camera)
        logger.info(f"Registered camera: {camera.id} ({camera.name})")
        return camera

    @staticmethod
    def get(db: Session, camera_id: str) -> Optional[Camera]:
        return db.query(Camera).filter(Camera.id == camera_id).first()

    @staticmethod
    def get_all(db: Session) -> List[Camera]:
        return db.query(Camera).order_by(Camera.created_at.desc()).all()

    @staticmethod
    def update(db: Session, camera_id: str, **kwargs) -> Optional[Camera]:
        camera = db.query(Camera).filter(Camera.id == camera_id).first()
        if not camera:
            return None
        for key, value in kwargs.items():
            if hasattr(camera, key) and value is not None:
                setattr(camera, key, value)
        camera.updated_at = utc_now()
        db.commit()
        db.refresh(camera)
        logger.info(f"Updated camera {camera_id}: {kwargs}")
        return camera

    @staticmethod
    def delete(db: Session, camera_id: str) -> bool:
        camera = db.query(Camera).filter(Camera.id == camera_id).first()
        if not camera:
            return False
        db.delete(camera)
        db.commit()
        logger.info(f"Deleted camera {camera_id}")
        return True


class ZoneRepository:
    @staticmethod
    def create(db: Session, zone_id: str, camera_id: str, name: str, polygon_coords: str, description: Optional[str] = None, is_active: bool = True) -> RestrictedZone:
        zone = RestrictedZone(
            id=zone_id,
            camera_id=camera_id,
            name=name,
            polygon_coords=polygon_coords,
            description=description,
            is_active=is_active
        )
        db.add(zone)
        db.commit()
        db.refresh(zone)
        logger.info(f"Created restricted zone: {zone.id} for camera {camera_id}")
        return zone

    @staticmethod
    def get(db: Session, zone_id: str) -> Optional[RestrictedZone]:
        return db.query(RestrictedZone).filter(RestrictedZone.id == zone_id).first()

    @staticmethod
    def get_by_camera(db: Session, camera_id: str, active_only: bool = False) -> List[RestrictedZone]:
        query = db.query(RestrictedZone).filter(RestrictedZone.camera_id == camera_id)
        if active_only:
            query = query.filter(RestrictedZone.is_active == True)
        return query.all()

    @staticmethod
    def get_all(db: Session) -> List[RestrictedZone]:
        return db.query(RestrictedZone).order_by(RestrictedZone.created_at.desc()).all()

    @staticmethod
    def update(db: Session, zone_id: str, **kwargs) -> Optional[RestrictedZone]:
        zone = db.query(RestrictedZone).filter(RestrictedZone.id == zone_id).first()
        if not zone:
            return None
        for key, value in kwargs.items():
            if hasattr(zone, key) and value is not None:
                setattr(zone, key, value)
        db.commit()
        db.refresh(zone)
        return zone

    @staticmethod
    def delete(db: Session, zone_id: str) -> bool:
        zone = db.query(RestrictedZone).filter(RestrictedZone.id == zone_id).first()
        if not zone:
            return False
        db.delete(zone)
        db.commit()
        return True


class DetectionEventRepository:
    @staticmethod
    def create(
        db: Session,
        camera_id: str,
        object_category: str,
        confidence: float,
        bbox: List[float],
        is_in_restricted_zone: bool = False,
        zone_id: Optional[str] = None,
        provider_type: str = "SIMULATED_MOCK"
    ) -> DetectionEvent:
        event = DetectionEvent(
            id=f"DET_{uuid.uuid4().hex[:10]}",
            camera_id=camera_id,
            object_category=object_category,
            confidence=confidence,
            bbox_x1=bbox[0],
            bbox_y1=bbox[1],
            bbox_x2=bbox[2],
            bbox_y2=bbox[3],
            is_in_restricted_zone=is_in_restricted_zone,
            zone_id=zone_id,
            provider_type=provider_type,
            timestamp=utc_now()
        )
        db.add(event)
        db.commit()
        db.refresh(event)
        return event

    @staticmethod
    def list_recent(db: Session, limit: int = 50) -> List[DetectionEvent]:
        return db.query(DetectionEvent).order_by(desc(DetectionEvent.timestamp)).limit(limit).all()


class IncidentRepository:
    @staticmethod
    def generate_incident_id(db: Session) -> str:
        """
        Generate a human-readable sequential incident ID like INC_20261108_001
        """
        date_str = datetime.datetime.now().strftime("%Y%m%d")
        prefix = f"INC_{date_str}_"
        count = db.query(Incident).filter(Incident.id.like(f"{prefix}%")).count()
        return f"{prefix}{count + 1:03d}"

    @staticmethod
    def create(
        db: Session,
        camera_id: str,
        location: str,
        waste_category: str,
        confidence: float,
        evidence_folder: str,
        remarks: Optional[str] = None,
        incident_id: Optional[str] = None
    ) -> Incident:
        inc_id = incident_id or IncidentRepository.generate_incident_id(db)
        incident = Incident(
            id=inc_id,
            camera_id=camera_id,
            location=location,
            waste_category=waste_category,
            confidence=confidence,
            status="PENDING",
            evidence_folder=evidence_folder,
            remarks=remarks,
            timestamp=utc_now()
        )
        db.add(incident)
        db.commit()
        db.refresh(incident)
        logger.info(f"Registered new incident: {incident.id} at {location} (status: PENDING)")
        return incident

    @staticmethod
    def get(db: Session, incident_id: str) -> Optional[Incident]:
        return db.query(Incident).filter(Incident.id == incident_id).first()

    @staticmethod
    def get_all(
        db: Session,
        status: Optional[str] = None,
        camera_id: Optional[str] = None,
        waste_category: Optional[str] = None,
        start_date: Optional[datetime.datetime] = None,
        end_date: Optional[datetime.datetime] = None
    ) -> List[Incident]:
        query = db.query(Incident)
        if status and status != "ALL":
            query = query.filter(Incident.status == status.upper())
        if camera_id and camera_id != "ALL":
            query = query.filter(Incident.camera_id == camera_id)
        if waste_category and waste_category != "ALL":
            query = query.filter(Incident.waste_category == waste_category)
        if start_date:
            query = query.filter(Incident.timestamp >= start_date)
        if end_date:
            query = query.filter(Incident.timestamp <= end_date)
        return query.order_by(desc(Incident.timestamp)).all()

    @staticmethod
    def update_status(
        db: Session,
        incident_id: str,
        new_status: str,
        remarks: Optional[str] = None,
        verified_by: str = "admin"
    ) -> Optional[Incident]:
        incident = db.query(Incident).filter(Incident.id == incident_id).first()
        if not incident:
            return None

        previous_status = incident.status
        incident.status = new_status.upper()
        if remarks:
            incident.remarks = remarks
        incident.updated_at = utc_now()

        # Create verification audit record
        verification = VerificationRecord(
            id=f"VER_{uuid.uuid4().hex[:10]}",
            incident_id=incident.id,
            previous_status=previous_status,
            new_status=new_status.upper(),
            remarks=remarks or "",
            verified_by=verified_by,
            verified_at=utc_now()
        )
        db.add(verification)
        db.commit()
        db.refresh(incident)
        logger.info(f"Incident {incident_id} updated: {previous_status} -> {new_status} by {verified_by}")
        return incident

    @staticmethod
    def get_metrics(db: Session) -> Dict[str, Any]:
        """
        Aggregate overview metrics for the dashboard.
        """
        total = db.query(Incident).count()
        pending = db.query(Incident).filter(Incident.status == "PENDING").count()
        verified = db.query(Incident).filter(Incident.status == "VERIFIED").count()
        rejected = db.query(Incident).filter(Incident.status == "REJECTED").count()
        resolved = db.query(Incident).filter(Incident.status == "RESOLVED").count()
        active_cameras = db.query(Camera).filter(Camera.status == "ACTIVE", Camera.is_enabled == True).count()

        # Incidents by location
        location_counts = (
            db.query(Incident.location, func.count(Incident.id))
            .group_by(Incident.location)
            .all()
        )

        # Incidents by waste category
        category_counts = (
            db.query(Incident.waste_category, func.count(Incident.id))
            .group_by(Incident.waste_category)
            .all()
        )

        return {
            "total_incidents": total,
            "pending_incidents": pending,
            "verified_incidents": verified,
            "rejected_incidents": rejected,
            "resolved_incidents": resolved,
            "active_cameras": active_cameras,
            "by_location": dict(location_counts),
            "by_category": dict(category_counts)
        }


class EvidenceRepository:
    @staticmethod
    def create(db: Session, incident_id: str, file_type: str, file_path: str, file_size_bytes: int = 0) -> EvidenceRecord:
        record = EvidenceRecord(
            id=f"EVI_{uuid.uuid4().hex[:10]}",
            incident_id=incident_id,
            file_type=file_type.upper(),
            file_path=file_path,
            file_size_bytes=file_size_bytes,
            captured_at=utc_now()
        )
        db.add(record)
        db.commit()
        db.refresh(record)
        return record

    @staticmethod
    def get_by_incident(db: Session, incident_id: str) -> List[EvidenceRecord]:
        return db.query(EvidenceRecord).filter(EvidenceRecord.incident_id == incident_id).all()
