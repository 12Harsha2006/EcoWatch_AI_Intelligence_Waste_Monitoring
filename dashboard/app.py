import streamlit as st
import os
import sys
from pathlib import Path

# Add project root to sys.path so imports work seamlessly
ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from utils.config import settings
from dashboard.components.ui_widgets import render_simulation_banner

st.set_page_config(
    page_title="AI Waste Monitoring Admin",
    page_icon="🗑️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Sidebar Branding & Navigation
with st.sidebar:
    st.markdown("### 🗑️ AI Waste Monitor")
    st.markdown(
        "<span style='font-size: 0.85rem; color: gray;'>Unauthorized Waste Disposal Detection & Surveillance</span>",
        unsafe_allow_html=True
    )
    st.markdown("---")

    page_selection = st.radio(
        "Navigation",
        [
            "Dashboard Overview",
            "Live Monitoring",
            "Camera Management",
            "Incident Management",
            "Evidence Viewer",
            "Restricted Zones",
            "Waste Accumulation Reports",
            "System Settings"
        ],
        index=0
    )

    st.markdown("---")
    st.markdown(f"**Provider**: `{settings.DETECTION_PROVIDER.upper()}`")
    st.markdown(f"**Mode**: `Simulated` ⚠️")
    st.caption("Waste Disposal Detection System v1.0.0")

# Render simulation notice at the top of each view
render_simulation_banner()

# Dynamic page routing
if page_selection == "Dashboard Overview":
    import dashboard.pages.p1_overview as p
    p.render()
elif page_selection == "Live Monitoring":
    import dashboard.pages.p2_live_monitoring as p
    p.render()
elif page_selection == "Camera Management":
    import dashboard.pages.p3_camera_management as p
    p.render()
elif page_selection == "Incident Management":
    import dashboard.pages.p4_incident_management as p
    p.render()
elif page_selection == "Evidence Viewer":
    import dashboard.pages.p5_evidence_viewer as p
    p.render()
elif page_selection == "Restricted Zones":
    import dashboard.pages.p6_restricted_zones as p
    p.render()
elif page_selection == "Waste Accumulation Reports":
    import dashboard.pages.p7_reports as p
    p.render()
elif page_selection == "System Settings":
    import dashboard.pages.p8_settings as p
    p.render()

