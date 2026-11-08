import pytest
from database.connection import SessionLocal, init_db
from database.repository import (
    CameraRepository,
    ZoneRepository,
    IncidentRepository,
    EvidenceRepository
)

@pytest.fixture(scope="module")
def db_session():
    init_db()
    db = SessionLocal()
    yield db
    db.close()

def test_camera_crud(db_session):
    cam_id = "CAM_TEST_01"
    # Clean up if existed
    CameraRepository.delete(db_session, cam_id)

    # Create
    cam = CameraRepository.create(
        db=db_session,
        camera_id=cam_id,
        name="Test Camera",
        location="Lab Section",
        source_type="synthetic",
        source_path="dummy"
    )
    assert cam.id == cam_id
    assert cam.name == "Test Camera"

    # Get
    fetched = CameraRepository.get(db_session, cam_id)
    assert fetched is not None
    assert fetched.location == "Lab Section"

    # Update
    updated = CameraRepository.update(db_session, cam_id, location="New Lab Section")
    assert updated.location == "New Lab Section"

    # Delete
    deleted = CameraRepository.delete(db_session, cam_id)
    assert deleted is True
    assert CameraRepository.get(db_session, cam_id) is None

def test_zone_creation(db_session):
    cam_id = "CAM_TEST_ZONE"
    CameraRepository.delete(db_session, cam_id)
    CameraRepository.create(db_session, cam_id, "Zone Cam", "Sector Z", "synthetic", "0")

    zone_id = "ZONE_TEST_01"
    ZoneRepository.delete(db_session, zone_id)

    coords = "[[10, 10], [50, 10], [50, 50], [10, 50]]"
    zone = ZoneRepository.create(db_session, zone_id, cam_id, "Test Zone", coords)
    assert zone.id == zone_id
    assert zone.camera_id == cam_id

    fetched = ZoneRepository.get(db_session, zone_id)
    assert fetched is not None

    ZoneRepository.delete(db_session, zone_id)
    CameraRepository.delete(db_session, cam_id)

def test_incident_lifecycle(db_session):
    cam_id = "CAM_TEST_INC"
    CameraRepository.create(db_session, cam_id, "Inc Cam", "Sector I", "synthetic", "0")

    inc_id = "INC_TEST_001"
    inc = IncidentRepository.create(
        db=db_session,
        incident_id=inc_id,
        camera_id=cam_id,
        location="Sector I",
        waste_category="plastic_waste",
        confidence=0.92,
        evidence_folder="./evidence/INC_TEST_001",
        remarks="Test alert"
    )
    assert inc.status == "PENDING"

    # Verify
    verified = IncidentRepository.update_status(db_session, inc_id, "VERIFIED", remarks="Verified by test")
    assert verified.status == "VERIFIED"
    assert len(verified.verification_records) == 1

    # Cleanup
    CameraRepository.delete(db_session, cam_id)
