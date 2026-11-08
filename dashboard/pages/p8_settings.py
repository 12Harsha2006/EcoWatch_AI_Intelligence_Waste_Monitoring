import streamlit as st
import os
import shutil
from pathlib import Path
from dashboard.components.ui_widgets import render_header
from utils.config import settings

def render():
    render_header("⚙️ System Configuration & AI Status", "Inspect surveillance parameters, storage paths, and pretrained AI integration readiness.")

    st.subheader("🤖 Detection Provider Architecture (Module 10)")

    st.markdown("""
        The system employs a **Modular Provider Pattern** (`BaseDetectionProvider`).
        The surveillance workflow, database storage, incident pipeline, and admin dashboard
        operate independently of the underlying computer vision model.
    """)

    c1, c2 = st.columns(2)
    with c1:
        st.markdown(f"**Current Active Provider:** `{settings.DETECTION_PROVIDER.upper()}`")
        if settings.DETECTION_PROVIDER == "mock":
            st.warning("⚠️ **Running in SIMULATED MOCK MODE**\n\nSimulated bounding boxes and confidence scores are emitted. No neural network weights are currently required.")
        else:
            st.success(f"🟢 **Running in AI Mode:** `{settings.DETECTION_PROVIDER}`")

    with c2:
        st.markdown("**Pretrained AI Integration Roadmap:**")
        st.markdown("""
            - 🎯 **YOLO (v8/v11)**: General object & waste boundary detection.
            - 🔍 **Grounding DINO**: Open-vocabulary text-guided waste localization.
            - 🧍 **MediaPipe**: Human pose estimation (detecting dumping postures).
            - 🧭 **ByteTrack**: Multi-object tracking across video frames.
        """)

    st.markdown("---")

    st.subheader("🔧 Application Settings & Environment")
    env_data = {
        "APP_ENV": settings.APP_ENV,
        "DEBUG_MODE": str(settings.APP_DEBUG),
        "API_HOST": settings.API_HOST,
        "API_PORT": str(settings.API_PORT),
        "DASHBOARD_PORT": str(settings.DASHBOARD_PORT),
        "CONFIDENCE_THRESHOLD": str(settings.CONFIDENCE_THRESHOLD),
        "DATABASE_URL": settings.DATABASE_URL,
        "EVIDENCE_DIR": settings.EVIDENCE_DIR,
        "LOG_LEVEL": settings.LOG_LEVEL
    }

    for k, v in env_data.items():
        st.markdown(f"- **`{k}`**: `{v}`")

    st.markdown("---")

    st.subheader("💾 Evidence Storage Metrics")
    evidence_path = Path(settings.EVIDENCE_DIR)
    if evidence_path.exists():
        total_size = sum(f.stat().st_size for f in evidence_path.glob("**/*") if f.is_file())
        total_dirs = sum(1 for d in evidence_path.iterdir() if d.is_dir())
        size_mb = total_size / (1024 * 1024)

        col_s1, col_s2 = st.columns(2)
        with col_s1:
            st.metric("Total Evidence Archives", f"{total_dirs} Incidents")
        with col_s2:
            st.metric("Disk Storage Used", f"{size_mb:.2f} MB")
    else:
        st.info("Evidence directory not created yet.")
