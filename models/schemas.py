from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
from datetime import datetime

# =====================================================================
# CAMERA SCHEMAS
# =====================================================================
class CameraBase(BaseModel):
    name: str = Field(..., description="Camera descriptive name")
    location: str = Field(..., description="Physical or logical location")
    source_type: str = Field("webcam", description="'webcam', 'file', 'rtsp', or 'synthetic'")
    source_path: str = Field("0", description="Index 0, video file path, or RTSP URL")
    is_enabled: bool = Field(True, description="Whether camera is active for monitoring")

class CameraCreate(CameraBase):
    id: str = Field(..., description="Unique Camera Identifier (e.g., CAM_01)")

class CameraUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    source_type: Optional[str] = None
    source_path: Optional[str] = None
    status: Optional[str] = None
    is_enabled: Optional[bool] = None

class CameraResponse(CameraBase):
    id: str
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# =====================================================================
# RESTRICTED ZONE SCHEMAS
# =====================================================================
class ZoneBase(BaseModel):
    camera_id: str
    name: str
    polygon_coords: str = Field(..., description="JSON string of [[x1,y1], [x2,y2], ...]")
    description: Optional[str] = None
    is_active: bool = True

class ZoneCreate(ZoneBase):
    id: str

class ZoneUpdate(BaseModel):
    name: Optional[str] = None
    polygon_coords: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None

class ZoneResponse(ZoneBase):
    id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# =====================================================================
# DETECTION SCHEMAS
# =====================================================================
class DetectionItem(BaseModel):
    category: str = Field(..., description="person, plastic_waste, garbage_bag, etc.")
    confidence: float = Field(..., ge=0.0, le=1.0)
    bbox: List[float] = Field(..., description="[x1, y1, x2, y2]")
    is_in_zone: bool = False
    zone_id: Optional[str] = None

class DetectionResult(BaseModel):
    camera_id: str
    timestamp: datetime
    detections: List[DetectionItem]
    is_simulated: bool = Field(True, description="Clearly tags whether detection was simulated or real AI")
    provider_type: str = Field("SIMULATED_MOCK", description="Provider identifier")


# =====================================================================
# EVIDENCE SCHEMAS
# =====================================================================
class EvidenceResponse(BaseModel):
    id: str
    incident_id: str
    file_type: str
    file_path: str
    file_size_bytes: int
    captured_at: datetime

    model_config = ConfigDict(from_attributes=True)


# =====================================================================
# VERIFICATION AUDIT SCHEMAS
# =====================================================================
class VerificationRecordResponse(BaseModel):
    id: str
    incident_id: str
    previous_status: str
    new_status: str
    remarks: Optional[str] = None
    verified_by: str
    verified_at: datetime

    model_config = ConfigDict(from_attributes=True)


# =====================================================================
# INCIDENT SCHEMAS
# =====================================================================
class IncidentBase(BaseModel):
    camera_id: str
    location: str
    waste_category: str
    confidence: float
    remarks: Optional[str] = None

class IncidentCreate(IncidentBase):
    incident_id: Optional[str] = None
    evidence_folder: str

class IncidentUpdateStatus(BaseModel):
    status: str = Field(..., description="'VERIFIED', 'REJECTED', or 'RESOLVED'")
    remarks: Optional[str] = Field(None, description="Administrator feedback or remarks")
    verified_by: str = Field("admin", description="Admin username or identifier")

class IncidentResponse(IncidentBase):
    id: str
    status: str
    evidence_folder: str
    timestamp: datetime
    created_at: datetime
    updated_at: datetime
    evidence_items: List[EvidenceResponse] = []
    verification_records: List[VerificationRecordResponse] = []

    model_config = ConfigDict(from_attributes=True)


# =====================================================================
# METRICS & REPORT SCHEMAS
# =====================================================================
class IncidentMetrics(BaseModel):
    total_incidents: int
    pending_incidents: int
    verified_incidents: int
    rejected_incidents: int
    resolved_incidents: int
    active_cameras: int
    by_location: Dict[str, int]
    by_category: Dict[str, int]

class IncidentReportFilter(BaseModel):
    status: Optional[str] = "ALL"
    camera_id: Optional[str] = "ALL"
    waste_category: Optional[str] = "ALL"
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
