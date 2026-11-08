import requests
from typing import Dict, Any, List, Optional
from utils.config import settings
from utils.logger import logger

# Fallback direct DB access
from database.connection import SessionLocal
from database.repository import (
    CameraRepository,
    ZoneRepository,
    IncidentRepository,
    EvidenceRepository
)

class APIClient:
    """
    HTTP API Client interfacing with FastAPI backend.
    If the API server is unreachable, gracefully falls back to direct
    database queries so the dashboard never breaks.
    """

    def __init__(self, base_url: Optional[str] = None):
        self.base_url = base_url or f"http://{settings.API_HOST}:{settings.API_PORT}/api"

    def _get(self, endpoint: str, params: Optional[Dict] = None) -> Optional[Any]:
        try:
            resp = requests.get(f"{self.base_url}{endpoint}", params=params, timeout=2.5)
            if resp.status_code == 200:
                return resp.json()
        except Exception:
            pass
        return None

    def _post(self, endpoint: str, json_data: Optional[Dict] = None) -> Optional[Any]:
        try:
            resp = requests.post(f"{self.base_url}{endpoint}", json=json_data, timeout=3.0)
            if resp.status_code in (200, 201):
                return resp.json()
        except Exception:
            pass
        return None

    # Cameras
    def get_cameras(self) -> List[Dict[str, Any]]:
        data = self._get("/cameras")
        if data is not None:
            return data
        # Fallback to direct DB
        db = SessionLocal()
        cams = CameraRepository.get_all(db)
        result = [{
            "id": c.id, "name": c.name, "location": c.location,
            "source_type": c.source_type, "source_path": c.source_path,
            "status": c.status, "is_enabled": c.is_enabled,
            "created_at": c.created_at.isoformat() if c.created_at else ""
        } for c in cams]
        db.close()
        return result

    def create_camera(self, data: Dict[str, Any]) -> bool:
        resp = self._post("/cameras", data)
        if resp:
            return True
        db = SessionLocal()
        try:
            CameraRepository.create(
                db=db,
                camera_id=data["id"],
                name=data["name"],
                location=data["location"],
                source_type=data.get("source_type", "webcam"),
                source_path=data.get("source_path", "0"),
                is_enabled=data.get("is_enabled", True)
            )
            return True
        except Exception:
            return False
        finally:
            db.close()

    def toggle_camera(self, camera_id: str) -> bool:
        resp = self._post(f"/cameras/{camera_id}/toggle")
        if resp:
            return True
        db = SessionLocal()
        cam = CameraRepository.get(db, camera_id)
        if cam:
            new_state = not cam.is_enabled
            CameraRepository.update(db, camera_id, is_enabled=new_state, status="ACTIVE" if new_state else "INACTIVE")
        db.close()
        return True

    def delete_camera(self, camera_id: str) -> bool:
        try:
            requests.delete(f"{self.base_url}/cameras/{camera_id}", timeout=2.0)
        except Exception:
            pass
        db = SessionLocal()
        success = CameraRepository.delete(db, camera_id)
        db.close()
        return success

    # Zones
    def get_zones(self, camera_id: Optional[str] = None) -> List[Dict[str, Any]]:
        params = {"camera_id": camera_id} if camera_id else None
        data = self._get("/zones", params)
        if data is not None:
            return data
        db = SessionLocal()
        zones = ZoneRepository.get_by_camera(db, camera_id) if camera_id else ZoneRepository.get_all(db)
        result = [{
            "id": z.id, "camera_id": z.camera_id, "name": z.name,
            "polygon_coords": z.polygon_coords, "description": z.description,
            "is_active": z.is_active
        } for z in zones]
        db.close()
        return result

    def create_zone(self, data: Dict[str, Any]) -> bool:
        resp = self._post("/zones", data)
        if resp:
            return True
        db = SessionLocal()
        try:
            ZoneRepository.create(
                db=db,
                zone_id=data["id"],
                camera_id=data["camera_id"],
                name=data["name"],
                polygon_coords=data["polygon_coords"],
                description=data.get("description"),
                is_active=data.get("is_active", True)
            )
            return True
        except Exception:
            return False
        finally:
            db.close()

    def delete_zone(self, zone_id: str) -> bool:
        try:
            requests.delete(f"{self.base_url}/zones/{zone_id}", timeout=2.0)
        except Exception:
            pass
        db = SessionLocal()
        success = ZoneRepository.delete(db, zone_id)
        db.close()
        return success

    # Incidents
    def get_metrics(self) -> Dict[str, Any]:
        data = self._get("/incidents/metrics/summary")
        if data is not None:
            return data
        db = SessionLocal()
        metrics = IncidentRepository.get_metrics(db)
        db.close()
        return metrics

    def get_incidents(self, status: Optional[str] = None, camera_id: Optional[str] = None) -> List[Dict[str, Any]]:
        params = {}
        if status and status != "ALL":
            params["status"] = status
        if camera_id and camera_id != "ALL":
            params["camera_id"] = camera_id

        data = self._get("/incidents", params)
        if data is not None:
            return data

        db = SessionLocal()
        incidents = IncidentRepository.get_all(db, status=status, camera_id=camera_id)
        result = []
        for inc in incidents:
            result.append({
                "id": inc.id,
                "camera_id": inc.camera_id,
                "location": inc.location,
                "waste_category": inc.waste_category,
                "confidence": inc.confidence,
                "status": inc.status,
                "timestamp": inc.timestamp.isoformat() if inc.timestamp else "",
                "remarks": inc.remarks,
                "evidence_folder": inc.evidence_folder,
                "evidence_items": [{
                    "id": e.id, "file_type": e.file_type, "file_path": e.file_path, "file_size_bytes": e.file_size_bytes
                } for e in inc.evidence_items]
            })
        db.close()
        return result

    def get_incident(self, incident_id: str) -> Optional[Dict[str, Any]]:
        data = self._get(f"/incidents/{incident_id}")
        if data is not None:
            return data
        db = SessionLocal()
        inc = IncidentRepository.get(db, incident_id)
        if not inc:
            db.close()
            return None
        res = {
            "id": inc.id,
            "camera_id": inc.camera_id,
            "location": inc.location,
            "waste_category": inc.waste_category,
            "confidence": inc.confidence,
            "status": inc.status,
            "timestamp": inc.timestamp.isoformat() if inc.timestamp else "",
            "remarks": inc.remarks,
            "evidence_folder": inc.evidence_folder,
            "evidence_items": [{
                "id": e.id, "file_type": e.file_type, "file_path": e.file_path, "file_size_bytes": e.file_size_bytes
            } for e in inc.evidence_items],
            "verification_records": [{
                "id": v.id, "previous_status": v.previous_status, "new_status": v.new_status,
                "remarks": v.remarks, "verified_by": v.verified_by, "verified_at": v.verified_at.isoformat() if v.verified_at else ""
            } for v in inc.verification_records]
        }
        db.close()
        return res

    def update_incident_status(self, incident_id: str, new_status: str, remarks: str = "", verified_by: str = "admin") -> bool:
        endpoint = f"/incidents/{incident_id}/{new_status.lower()}"
        resp = self._post(endpoint, {"status": new_status, "remarks": remarks, "verified_by": verified_by})
        if resp:
            return True
        db = SessionLocal()
        updated = IncidentRepository.update_status(db, incident_id, new_status, remarks, verified_by)
        db.close()
        return updated is not None

    # Monitoring
    def start_monitoring(self, camera_id: str) -> bool:
        resp = self._post(f"/monitoring/start/{camera_id}")
        return resp is not None

    def stop_monitoring(self, camera_id: str) -> bool:
        resp = self._post(f"/monitoring/stop/{camera_id}")
        return resp is not None

    def trigger_mock(self, camera_id: str) -> bool:
        resp = self._post(f"/monitoring/trigger-mock/{camera_id}")
        return resp is not None

api_client = APIClient()

