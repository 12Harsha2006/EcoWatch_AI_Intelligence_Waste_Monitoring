from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from utils.config import settings
from utils.logger import logger
from database.connection import init_db
from database.seed_data import seed_demo_data
from monitoring.stream_worker import camera_stream_manager

from backend.api.routes_cameras import router as cameras_router
from backend.api.routes_zones import router as zones_router
from backend.api.routes_incidents import router as incidents_router
from backend.api.routes_evidence import router as evidence_router
from backend.api.routes_monitoring import router as monitoring_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager:
    - Runs on startup: initializes DB schema & seeds demo data
    - Runs on shutdown: terminates camera worker threads
    """
    logger.info("Initializing Waste Disposal Detection System...")
    init_db()
    seed_demo_data()
    yield
    logger.info("Shutting down active video monitoring streams...")
    camera_stream_manager.stop_all()

# Create FastAPI application
app = FastAPI(
    title="Unauthorized Waste Disposal Detection and Monitoring API",
    description=(
        "Backend services for AI-Based Unauthorized Waste Disposal Detection. "
        "Supports camera feeds, restricted-zone evaluation, incident logging, and evidence storage. "
        "Currently operating in SIMULATED MOCK MODE until pretrained models (YOLO, Grounding DINO, ByteTrack) are loaded."
    ),
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount evidence static directory for direct inspection
app.mount("/evidence-files", StaticFiles(directory=settings.EVIDENCE_DIR), name="evidence_files")

# Register API Routers
app.include_router(cameras_router, prefix="/api")
app.include_router(zones_router, prefix="/api")
app.include_router(incidents_router, prefix="/api")
app.include_router(evidence_router, prefix="/api")
app.include_router(monitoring_router, prefix="/api")

@app.get("/", tags=["System"])
def root():
    return {
        "system": "Unauthorized Waste Disposal Detection System",
        "version": "1.0.0",
        "detection_mode": f"{settings.DETECTION_PROVIDER.upper()} (SIMULATED: {settings.DETECTION_PROVIDER == 'mock'})",
        "docs_url": "/docs",
        "status": "ONLINE"
    }

@app.get("/health", tags=["System"])
def health_check():
    return {
        "status": "HEALTHY",
        "app_env": settings.APP_ENV,
        "evidence_directory": settings.EVIDENCE_DIR
    }
