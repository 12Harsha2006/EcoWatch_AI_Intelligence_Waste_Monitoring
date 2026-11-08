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

