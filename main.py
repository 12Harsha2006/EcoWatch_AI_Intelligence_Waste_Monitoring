import sys
import os
import argparse
import uvicorn
import subprocess

from utils.config import settings
from utils.logger import logger
from database.connection import init_db
from database.seed_data import seed_demo_data

def run_init_db():
    logger.info("Initializing database schema...")
    init_db()
    seed_demo_data()
    logger.info("Database initialization and demo seeding completed successfully.")

def run_backend():
    logger.info(f"Starting FastAPI Backend on {settings.API_HOST}:{settings.API_PORT}...")
    uvicorn.run(
        "backend.app:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=settings.APP_DEBUG,
        log_level=settings.LOG_LEVEL.lower()
    )

def run_dashboard():
    dashboard_path = os.path.join(os.path.dirname(__file__), "dashboard", "app.py")
    logger.info(f"Launching Streamlit Admin Dashboard on port {settings.DASHBOARD_PORT}...")
    cmd = [
        sys.executable,
        "-m",
        "streamlit",
        "run",
        dashboard_path,
        "--server.port",
        str(settings.DASHBOARD_PORT),
        "--server.headless",
        "false"
    ]
    subprocess.run(cmd)

def run_tests():
    logger.info("Running full automated test suite...")
    subprocess.run([sys.executable, "-m", "pytest", "-v"])

def main():
    parser = argparse.ArgumentParser(
        description="AI-Based Unauthorized Waste Disposal Detection & Monitoring System CLI",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python main.py init-db      Initialize database schema and seed demo cameras
  python main.py backend      Launch FastAPI Backend server (port 8000)
  python main.py dashboard    Launch Streamlit Admin Dashboard (port 8501)
  python main.py test         Execute pytest automated test suite
        """
    )
    parser.add_argument(
        "command",
        nargs="?",
        default="help",
        choices=["init-db", "backend", "dashboard", "test", "help"],
        help="Action to execute"
    )

    args = parser.parse_args()

    if args.command == "init-db":
        run_init_db()
    elif args.command == "backend":
        run_backend()
    elif args.command == "dashboard":
        run_dashboard()
    elif args.command == "test":
        run_tests()
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
