import datetime
from sqlalchemy import (
    Column,
    String,
    Float,
    Integer,
    Boolean,
    DateTime,
    Text,
    ForeignKey
)
from sqlalchemy.orm import relationship

from database.connection import Base

def utc_now():
    return datetime.datetime.now(datetime.timezone.utc)

class Camera(Base):
    """
    Cameras registered in the monitoring system.
    """
    __tablename__ = "cameras"

    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    location = Column(String(200), nullable=False)
    source_type = Column(String(20), nullable=False, default="webcam")  # 'webcam', 'file', 'rtsp', 'synthetic'
    source_path = Column(String(500), nullable=False, default="0")     # webcam index, file path, or stream URL
    status = Column(String(20), nullable=False, default="INACTIVE")     # 'ACTIVE', 'INACTIVE', 'ERROR'
    is_enabled = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    # Relationships
    restricted_zones = relationship("RestrictedZone", back_populates="camera", cascade="all, delete-orphan")
    detection_events = relationship("DetectionEvent", back_populates="camera", cascade="all, delete-orphan")
    incidents = relationship("Incident", back_populates="camera", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Camera(id={self.id}, name={self.name}, status={self.status})>"


class RestrictedZone(Base):
    """
    Geographical or frame polygon boundaries where waste dumping is strictly prohibited.
    """
    __tablename__ = "restricted_zones"

    id = Column(String(50), primary_key=True, index=True)
    camera_id = Column(String(50), ForeignKey("cameras.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(100), nullable=False)
    polygon_coords = Column(Text, nullable=False)  # JSON-encoded string of [[x1, y1], [x2, y2], ...]
    description = Column(String(255), nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, default=utc_now)

    # Relationships
    camera = relationship("Camera", back_populates="restricted_zones")
    detection_events = relationship("DetectionEvent", back_populates="zone")

    def __repr__(self):
        return f"<RestrictedZone(id={self.id}, camera_id={self.camera_id}, name={self.name})>"


class DetectionEvent(Base):
    """
    Individual object detection occurrences evaluated from camera frames.
    """
    __tablename__ = "detection_events"

    id = Column(String(50), primary_key=True, index=True)
    camera_id = Column(String(50), ForeignKey("cameras.id", ondelete="CASCADE"), nullable=False)
    timestamp = Column(DateTime, default=utc_now, index=True)
    object_category = Column(String(50), nullable=False)  # 'person', 'garbage', 'plastic_waste', etc.
    confidence = Column(Float, nullable=False)
    bbox_x1 = Column(Float, nullable=False)
    bbox_y1 = Column(Float, nullable=False)
    bbox_x2 = Column(Float, nullable=False)
    bbox_y2 = Column(Float, nullable=False)
    is_in_restricted_zone = Column(Boolean, nullable=False, default=False)
    zone_id = Column(String(50), ForeignKey("restricted_zones.id", ondelete="SET NULL"), nullable=True)
    provider_type = Column(String(50), nullable=False, default="SIMULATED_MOCK")  # 'SIMULATED_MOCK', 'YOLO_V8', etc.

    # Relationships
    camera = relationship("Camera", back_populates="detection_events")
    zone = relationship("RestrictedZone", back_populates="detection_events")

    def __repr__(self):
        return f"<DetectionEvent(id={self.id}, category={self.object_category}, conf={self.confidence:.2f})>"


class Incident(Base):
    """
    Suspected unauthorized waste disposal occurrences flagged by the monitoring engine.
    """
    __tablename__ = "incidents"

    id = Column(String(50), primary_key=True, index=True)
    camera_id = Column(String(50), ForeignKey("cameras.id", ondelete="CASCADE"), nullable=False)
    location = Column(String(200), nullable=False)
    waste_category = Column(String(50), nullable=False)  # 'plastic_waste', 'construction_debris', 'organic_waste', etc.
    confidence = Column(Float, nullable=False)
    status = Column(String(20), nullable=False, default="PENDING")  # 'PENDING', 'VERIFIED', 'REJECTED', 'RESOLVED'
    timestamp = Column(DateTime, default=utc_now, index=True)
    remarks = Column(Text, nullable=True)
    evidence_folder = Column(String(500), nullable=False)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    # Relationships
    camera = relationship("Camera", back_populates="incidents")
    evidence_items = relationship("EvidenceRecord", back_populates="incident", cascade="all, delete-orphan")
    verification_records = relationship("VerificationRecord", back_populates="incident", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Incident(id={self.id}, camera={self.camera_id}, status={self.status})>"


class EvidenceRecord(Base):
    """
    Evidence media files associated with an incident.
    """
    __tablename__ = "evidence"

    id = Column(String(50), primary_key=True, index=True)
    incident_id = Column(String(50), ForeignKey("incidents.id", ondelete="CASCADE"), nullable=False)
    file_type = Column(String(20), nullable=False)  # 'IMAGE', 'VIDEO', 'METADATA'
    file_path = Column(String(500), nullable=False)
    file_size_bytes = Column(Integer, nullable=False, default=0)
    captured_at = Column(DateTime, default=utc_now)

    # Relationships
    incident = relationship("Incident", back_populates="evidence_items")

    def __repr__(self):
        return f"<EvidenceRecord(id={self.id}, type={self.file_type}, path={self.file_path})>"


class VerificationRecord(Base):
    """
    Audit log of administrative review and actions on an incident.
    """
    __tablename__ = "verification_records"

    id = Column(String(50), primary_key=True, index=True)
    incident_id = Column(String(50), ForeignKey("incidents.id", ondelete="CASCADE"), nullable=False)
    previous_status = Column(String(20), nullable=False)
    new_status = Column(String(20), nullable=False)
    remarks = Column(Text, nullable=True)
    verified_by = Column(String(100), nullable=False, default="admin")
    verified_at = Column(DateTime, default=utc_now)

    # Relationships
    incident = relationship("Incident", back_populates="verification_records")

    def __repr__(self):
        return f"<VerificationRecord(incident_id={self.incident_id}, {self.previous_status}->{self.new_status})>"
