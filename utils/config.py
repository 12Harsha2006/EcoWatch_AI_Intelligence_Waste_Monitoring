import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

# Base directory of the project
BASE_DIR = Path(__file__).resolve().parent.parent

class Settings(BaseSettings):
    """
    Central Application Settings loaded from environment variables or .env file.
    """
    APP_ENV: str = "development"
    APP_DEBUG: bool = True

    # Database
    DATABASE_URL: str = f"sqlite:///{BASE_DIR / 'waste_detection.db'}"

    # API Server
    API_HOST: str = "127.0.0.1"
    API_PORT: int = 8000

    # Dashboard
    DASHBOARD_PORT: int = 8501

    # Storage paths
    EVIDENCE_DIR: str = str(BASE_DIR / "evidence")

    # Detection Provider
    DETECTION_PROVIDER: str = "mock"  # "mock" for simulation, "yolo" for future pretrained
    CONFIDENCE_THRESHOLD: float = 0.50

    # Logging
    LOG_LEVEL: str = "INFO"

    model_config = SettingsConfigDict(
        env_file=str(BASE_DIR / ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

# Singleton settings instance
settings = Settings()

# Ensure evidence directory exists
os.makedirs(settings.EVIDENCE_DIR, exist_ok=True)
