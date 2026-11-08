# AI-Based Unauthorized Waste Disposal Detection and Monitoring System

An intelligent surveillance and incident management application designed to detect, flag, and monitor unauthorized garbage disposal activities from CCTV feeds, webcams, or uploaded video recordings.

---

## 📌 Project Architecture & Approach

This system is built with a **modular architecture** separating computer vision inference, surveillance logic, database persistence, REST API backend, and the administrator dashboard.

> **IMPORTANT ARCHITECTURAL NOTICE (SIMULATION VS REAL AI):**
> Initially, we do **not** train custom models from scratch. The current phase establishes the complete software system using a **Mock Detection Provider** that returns simulated detection coordinates, object categories, and confidence scores. 
> 
> The system implements a strict **Modular Provider Pattern** (`BaseDetectionProvider`), so open-source pretrained models (**YOLOv8**, **Grounding DINO**, **MediaPipe**, and **ByteTrack**) can be plugged in later **without rewriting any database schemas, API routes, or dashboard components**.

```
+-----------------------------------------------------------------------------------+
|                        React.js / Vite AI Surveillance Dashboard                  |
| (Overview | Live CCTV | Incidents | Evidence | Cameras | Analytics | Reports | Settings)|
+------------------------------------------+----------------------------------------+
                                           | Axios REST / Direct Proxy
                                           v
+-----------------------------------------------------------------------------------+
|                               FastAPI Backend API                                 |
|      (/api/cameras | /api/zones | /api/incidents | /api/evidence | /api/monitoring)       |
+--------------------+---------------------+--------------------+-------------------+
                     |                     |                    |
                     v                     v                    v
          +--------------------+ +-------------------+ +--------------------+
          | SQLite / SQLAlchemy| | Video Monitoring  | | Evidence Manager   |
          |  6 Relational      | |  Event Engine &   | |  Isolated Folders  |
          |  Tables + Audits   | |  Zone Evaluator   | |  JPG/MP4/JSON      |
          +--------------------+ +---------+---------+ +--------------------+
                                           |
                                           v
                       +---------------------------------------+
                       | BaseDetectionProvider Interface       |
                       +-------------------+-------------------+
                                           |
                    +----------------------+----------------------+
                    |                                             |
                    v (CURRENT PHASE)                             v (FUTURE PLUG-IN)
      +----------------------------+             +-------------------------------+
      |   MockDetectionProvider    |             |  Pretrained AI Models:        |
      |   [SIMULATED DETECTION]    |             |  - YOLOv8 (Object Detection)  |
      | - Person BBoxes            |             |  - Grounding DINO (Text-based)|
      | - Waste BBoxes             |             |  - MediaPipe (Pose/Dumping)   |
      | - Confidence Scores        |             |  - ByteTrack (Object Tracking)|
      +----------------------------+             +-------------------------------+
```

---

## 🛠️ Technology Stack

| Technology | Purpose |
| :--- | :--- |
| **React 19 & Vite** | Fast, modern client-side frontend framework |
| **Tailwind CSS v4** | Dark professional surveillance dashboard styling |
| **Axios** | REST API communication with FastAPI backend |
| **React Router (v7)** | Seamless client-side SPA routing across all 8 surveillance pages |
| **Recharts** | Interactive timeline, location hotspot, and category distribution charts |
| **Lucide React** | Modern surveillance and status icons |
| **Python 3.10+** | Backend API, detection engine, and database logic |
| **OpenCV (`cv2`)** | Video stream reading, polygon evaluation, and frame annotation |
| **FastAPI** | High-performance asynchronous REST backend API with OpenAPI docs |
| **SQLite & SQLAlchemy** | Relational database and Object-Relational Mapper (ORM) |
| **NumPy** | Array manipulations and coordinate geometric transformations |
| **Pydantic (v2)** | Request/response data validation and settings management |
| **Pytest** | Automated unit and integration testing suite |

---

## 📁 Project Directory Structure

```
Waste_Disposal_Detection/
│
├── backend/                         # FastAPI Application Layer
│   ├── api/                         # Modular API Route Controllers
│   │   ├── __init__.py
│   │   ├── routes_cameras.py        # Camera registration, enable/disable, CRUD
│   │   ├── routes_zones.py          # Restricted zone boundaries CRUD
│   │   ├── routes_incidents.py      # Incident review, verification, CSV export
│   │   ├── routes_evidence.py       # Evidence download and retrieval
│   │   └── routes_monitoring.py     # Live MJPEG streaming and start/stop controls
│   ├── __init__.py
│   └── app.py                       # FastAPI application factory and lifespan manager
│
├── database/                        # Database Persistence Layer
│   ├── __init__.py
│   ├── connection.py                # SQLite engine, sessionmaker, and init_db()
│   ├── models.py                    # 6 SQLAlchemy ORM models and relationships
│   ├── repository.py                # Clean CRUD queries and repository methods
│   └── seed_data.py                 # Initial demo cameras, zones, and sample incident
│
├── detection/                       # Computer Vision & Detection Layer
│   ├── __init__.py
│   ├── base.py                      # BaseDetectionProvider, BaseTracker, BasePoseEstimator
│   ├── mock_provider.py             # MockDetectionProvider (Clearly marked SIMULATED)
│   └── yolo_provider.py             # Pretrained YOLOv8 plug-in scaffold
│
├── monitoring/                      # Real-Time Surveillance & Event Engine
│   ├── __init__.py
│   ├── video_source.py              # OpenCV VideoCapture (Webcam, File, RTSP, Synthetic)
│   ├── zone_evaluator.py            # Point-in-polygon geometric testing
│   ├── event_engine.py              # Detection evaluation, cooldown, and incident creation
│   └── stream_worker.py             # Multi-camera background worker & MJPEG streamer
│
├── dashboard/                       # Streamlit Administrator Dashboard
│   ├── components/                  # Shared UI widgets and resilient API client
│   │   ├── __init__.py
│   │   ├── api_client.py            # HTTP client with direct SQLite fallback
│   │   └── ui_widgets.py            # Metric cards, status badges, simulation banner
│   ├── pages/                       # Multi-Page Dashboard Views
│   │   ├── 1_Overview.py            # KPI metrics and incident trend charts
│   │   ├── 2_Live_Monitoring.py     # Live CCTV feed, start/stop, simulated drop trigger
│   │   ├── 3_Camera_Management.py   # Register, edit, enable/disable cameras
│   │   ├── 4_Incident_Management.py # Review, verify, reject, resolve incidents
│   │   ├── 5_Evidence_Viewer.py     # High-res snapshot, video player, JSON metadata
│   │   ├── 6_Restricted_Zones.py    # Spatial polygon definition and visual layout
│   │   ├── 7_Reports.py             # Filtered compliance reports & CSV export
│   │   ├── 8_System_Settings.py     # Environment parameters and AI status
│   │   ├── p1_overview.py ... p8_settings.py
│   ├── __init__.py
│   └── app.py                       # Main Streamlit entrance and navigation hub
│
├── evidence/                        # Incident Evidence Storage
│   └── INC_DEMO_001/                # Each incident gets an isolated subfolder
│       ├── incident.jpg             # Annotated snapshot
│       ├── incident_video.mp4       # Video recording clip (when available)
│       └── metadata.json            # Machine-readable audit file
│
├── models/                          # Pydantic Data Contracts & Schemas
│   ├── __init__.py
│   └── schemas.py                   # Camera, Zone, Detection, Incident schemas
│
├── utils/                           # Core Utilities
│   ├── __init__.py
│   ├── config.py                    # Pydantic Settings loaded from .env
│   ├── logger.py                    # Standardized logging setup
│   ├── file_manager.py              # Evidence folder creator, saver, and validator
│   └── visualizer.py                # OpenCV bounding box and polygon rendering
│
├── tests/                           # Automated Test Suite (13 passing tests)
│   ├── __init__.py
│   ├── test_api.py                  # FastAPI endpoints test
│   ├── test_database.py             # SQLAlchemy CRUD & relationships test
│   ├── test_detection.py            # Mock detection provider test
│   └── test_monitoring.py           # VideoSource and ZoneEvaluator test
│
├── main.py                          # Unified CLI entrypoint
├── requirements.txt                 # Python project dependencies
├── .env.example                     # Sample environment variable template
├── .env                             # Active environment variable file
├── .gitignore                       # Git exclusion rules
└── README.md                        # Documentation and user guide
```

---

## 🗄️ Database Schema (Module 6)

The system maintains 6 relational SQLite tables managed via SQLAlchemy:

1. **`cameras`**: Stores camera ID, name, location, source type (`webcam`, `file`, `rtsp`, `synthetic`), source path, status (`ACTIVE`, `INACTIVE`, `ERROR`), and enabled flag.
2. **`restricted_zones`**: Stores geometric polygon boundaries (`[[x1,y1], [x2,y2], ...]`) linked to specific cameras.
3. **`detection_events`**: High-frequency log of detected entities (persons, garbage objects, bounding box coordinates, confidence, provider type).
4. **`incidents`**: Flagged surveillance violations with unique IDs (e.g. `INC_20261108_001`), camera ID, location, detected waste category, confidence, status (`PENDING`, `VERIFIED`, `REJECTED`, `RESOLVED`), and evidence path.
5. **`evidence`**: Registered evidence media paths (`IMAGE`, `VIDEO`, `METADATA`), file sizes, and timestamps.
6. **`verification_records`**: Complete administrator audit trail recording state transitions (`PENDING -> VERIFIED`), reviewer username, timestamps, and remarks.

---

## 🚀 Step-by-Step Setup Guide (For Beginners)

Open **VS Code** in the project directory: `c:\Users\Harsha D K\OneDrive\Desktop\Waste_Disposal_Detection`

### Step 1: Open VS Code PowerShell Terminal
Press <kbd>Ctrl</kbd> + <kbd>`</kbd> (or go to `Terminal` -> `New Terminal`).

### Step 2: Activate the Virtual Environment
```powershell
.\venv\Scripts\Activate.ps1
```
*(If script execution is restricted on your machine, run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` first).*

### Step 3: Install Required Dependencies
All required libraries are specified in `requirements.txt`:
```powershell
pip install -r requirements.txt
```

### Step 4: Initialize Database and Seed Demo Data
Run the database initializer to create all SQLite tables and insert demo cameras and zones:
```powershell
python main.py init-db
```

### Step 5: Run Automated Tests
Execute the comprehensive test suite to confirm everything is working properly:
```powershell
python main.py test
```
*(All 13 tests should pass).*

---

## 🖥️ Running the Application

### Option A: Run the React.js + Vite Frontend Dashboard
In your terminal, navigate to the `frontend` directory or run via `main.py`:
```powershell
python main.py frontend
```
Or directly using npm:
```powershell
cd frontend
npm run dev
```
> The React Dashboard will launch at: **`http://localhost:5173`** (with automatic proxy to FastAPI on port 8000).

---

### Option B: Run the FastAPI Backend Server
In a second terminal window (with the virtual environment activated):
```powershell
python main.py backend
```
> The FastAPI backend will launch on: **`http://127.0.0.1:8000`**
> - Interactive OpenAPI Swagger UI: **`http://127.0.0.1:8000/docs`**
> - Alternative Redoc API documentation: **`http://127.0.0.1:8000/redoc`**

---

### Option C: Run the Streamlit Admin Dashboard (Optional Python UI)
You can also run the Streamlit dashboard:
```powershell
python main.py dashboard
```
> Launches at: **`http://localhost:8501`**

---

## 📖 Dashboard Features Walkthrough (Module 8)

| Page | Feature Description |
| :--- | :--- |
| **1. Overview** | Real-time metric cards (Total, Pending, Verified, Rejected, Resolved Incidents, Active Cameras) and charts for incidents by location and waste category. |
| **2. Live Monitoring** | Select any camera stream. Start/Stop live video surveillance. Displays live detections and polygon zone overlays. Includes a **"Simulate Waste Drop"** button for live testing. |
| **3. Camera Management** | Register new cameras (Webcam index, MP4 video file, RTSP network stream, or Synthetic CCTV feed), toggle enable/disable status, or delete cameras. |
| **4. Incident Management** | Filter incidents by status, camera, and waste category. View evidence snapshots. One-click administrative review: **Verify Incident**, **Reject False Alert**, or **Mark Resolved** with remarks. |
| **5. Evidence Viewer** | Inspect individual incident evidence packages: snapshot images, MP4 video clips, and metadata JSON files with direct download buttons. |
| **6. Restricted Zones** | Define geometric polygon zones on camera views. Supports presets (Center Clean Zone, Dumpster Boundary) and custom coordinate inputs. |
| **7. Reports & Export** | Filter incidents by date range, camera, waste type, and status. View audit data and click **"Export Report as CSV"** (Module 9). |
| **8. System Settings** | View active environment variables, storage metrics, and the pretrained AI integration architecture roadmap. |

---

## 🔌 Future Pretrained AI Integration (Module 10)

The system is decoupled using the `BaseDetectionProvider` interface defined in `detection/base.py`:

```python
class BaseDetectionProvider(ABC):
    @abstractmethod
    def detect(self, frame: np.ndarray, confidence_threshold: float = 0.5) -> List[Dict[str, Any]]:
        pass
```

### How to plug in real AI models:
1. **YOLO (v8/v11)**:
   - File: `detection/yolo_provider.py`
   - Download weights (e.g. `yolov8n.pt` or fine-tuned garbage model `best.pt`).
   - In `.env`, change:
     ```env
     DETECTION_PROVIDER=yolo
     ```
2. **Grounding DINO**:
   - Implement `detection/grounding_dino_provider.py` inheriting `BaseDetectionProvider`.
   - Pass prompt queries such as `"discarded plastic bottle, trash bag, litter"`.
3. **MediaPipe**:
   - Implement `detection/mediapipe_pose_provider.py` inheriting `BasePoseEstimator`.
   - Recognize bending and arm extension discarding motions before flagging the dropped object.
4. **ByteTrack**:
   - Implement `detection/bytetrack_provider.py` inheriting `BaseTracker`.
   - Track object persistence to differentiate between a person walking by vs leaving waste behind stationary.

**No changes to `database/`, `backend/`, or `dashboard/` will be required when plugging in these AI models.**

