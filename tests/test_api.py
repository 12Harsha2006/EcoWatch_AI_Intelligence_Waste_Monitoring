import pytest
from fastapi.testclient import TestClient
from backend.app import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "Unauthorized Waste Disposal" in data["system"]
    assert data["status"] == "ONLINE"

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "HEALTHY"

def test_list_cameras():
    response = client.get("/api/cameras")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_incidents_metrics():
    response = client.get("/api/incidents/metrics/summary")
    assert response.status_code == 200
    metrics = response.json()
    assert "total_incidents" in metrics
    assert "pending_incidents" in metrics
    assert "active_cameras" in metrics

def test_export_csv():
    response = client.get("/api/incidents/export/csv")
    assert response.status_code == 200
    assert "text/csv" in response.headers.get("content-type", "")
    assert "Incident ID" in response.text

def test_auth_login_success():
    response = client.post("/api/auth/login", json={
        "email": "admin@wastedetection.gov",
        "password": "admin123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "admin@wastedetection.gov"

    # Test me endpoint
    token = data["access_token"]
    me_resp = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_resp.status_code == 200
    assert me_resp.json()["role"] == "System Administrator"

def test_auth_login_invalid():
    response = client.post("/api/auth/login", json={
        "email": "admin@wastedetection.gov",
        "password": "wrongpassword"
    })
    assert response.status_code == 401

