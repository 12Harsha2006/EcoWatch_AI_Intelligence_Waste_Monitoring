import streamlit as st
import pandas as pd
from pathlib import Path
from dashboard.components.ui_widgets import render_header, render_status_badge
from dashboard.components.api_client import api_client

UPLOAD_DIR = Path(__file__).resolve().parent.parent.parent / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

def render():
    render_header("🎥 Camera Management", "Register, inspect, and configure camera surveillance nodes.")

    # 1. Existing Cameras Table
    st.subheader("📋 Registered Cameras")
    cameras = api_client.get_cameras()

    if cameras:
        for cam in cameras:
            with st.expander(f"📷 {cam['id']} — {cam['name']} ({cam['location']})", expanded=False):
                col_info, col_actions = st.columns([3, 1])

                with col_info:
                    st.markdown(f"**ID:** `{cam['id']}`")
                    st.markdown(f"**Location:** {cam['location']}")
                    st.markdown(f"**Source Type:** `{cam['source_type']}`")
                    st.markdown(f"**Source Path:** `{cam['source_path']}`")
                    st.markdown(
                        f"**Status:** {render_status_badge(cam['status'])} | **Enabled:** `{'Yes' if cam['is_enabled'] else 'No'}`",
                        unsafe_allow_html=True
                    )

                with col_actions:
                    toggle_btn_label = "Disable Camera" if cam['is_enabled'] else "Enable Camera"
                    if st.button(toggle_btn_label, key=f"toggle_{cam['id']}", use_container_width=True):
                        api_client.toggle_camera(cam['id'])
                        st.rerun()

                    if st.button("🗑️ Delete", key=f"del_{cam['id']}", type="secondary", use_container_width=True):
                        if api_client.delete_camera(cam['id']):
                            st.success(f"Camera {cam['id']} deleted.")
                            st.rerun()
                        else:
                            st.error("Failed to delete camera.")
    else:
        st.info("No cameras registered yet. Use the form below to register a new camera.")

    st.markdown("---")

    # 2. Add New Camera Form
    st.subheader("➕ Register New Camera Source")

    tab_manual, tab_upload = st.tabs(["📝 Manual Configuration (Webcam / RTSP / Synthetic)", "📤 Upload Video File (MP4/AVI)"])

    with tab_manual:
        with st.form("add_camera_form"):
            col1, col2 = st.columns(2)
            with col1:
                cam_id = st.text_input("Camera ID", value=f"CAM_{len(cameras)+1:02d}", help="Unique identifier, e.g. CAM_04")
                cam_name = st.text_input("Camera Name", value="West Perimeter Gate")
                cam_location = st.text_input("Physical Location", value="Sector D - Industrial Corridor")

            with col2:
                cam_type = st.selectbox(
                    "Source Type",
                    ["synthetic", "webcam", "file", "rtsp"],
                    index=0,
                    help="Synthetic generates simulated CCTV; Webcam uses local camera; File plays MP4/AVI; RTSP connects to IP stream"
                )
                default_path = "synthetic_source" if cam_type == "synthetic" else ("0" if cam_type == "webcam" else "")
                cam_path = st.text_input("Source Path / Index / URL", value=default_path)
                cam_enabled = st.checkbox("Enable Immediately", value=True)

            submitted = st.form_submit_button("Register Camera", type="primary")
            if submitted:
                if not cam_id.strip() or not cam_name.strip() or not cam_location.strip():
                    st.error("Camera ID, Name, and Location are mandatory.")
                else:
                    success = api_client.create_camera({
                        "id": cam_id.strip(),
                        "name": cam_name.strip(),
                        "location": cam_location.strip(),
                        "source_type": cam_type,
                        "source_path": cam_path.strip(),
                        "is_enabled": cam_enabled
                    })
                    if success:
                        st.success(f"Camera '{cam_id}' registered successfully!")
                        st.rerun()
                    else:
                        st.error("Failed to register camera. Ensure ID is unique.")

    with tab_upload:
        st.markdown("Upload a video recording (`.mp4`, `.avi`, `.mov`) to automatically configure it as a surveillance source.")
        uploaded_file = st.file_uploader("Select Video File", type=["mp4", "avi", "mov", "mkv"])

        with st.form("upload_camera_form"):
            up_col1, up_col2 = st.columns(2)
            with up_col1:
                up_cam_id = st.text_input("Camera ID for Upload", value=f"CAM_VID_{len(cameras)+1:02d}")
                up_cam_name = st.text_input("Camera Name", value="Uploaded Surveillance Clip")
            with up_col2:
                up_cam_loc = st.text_input("Location", value="Recorded Incident Area")
                up_enabled = st.checkbox("Enable Camera", value=True, key="up_enabled")

            up_submitted = st.form_submit_button("Upload & Register Camera", type="primary")
            if up_submitted:
                if not uploaded_file:
                    st.error("Please choose a video file first.")
                elif not up_cam_id.strip() or not up_cam_name.strip():
                    st.error("Camera ID and Name are required.")
                else:
                    # Save video to uploads folder
                    dest_path = UPLOAD_DIR / uploaded_file.name
                    with open(dest_path, "wb") as f:
                        f.write(uploaded_file.getbuffer())

                    success = api_client.create_camera({
                        "id": up_cam_id.strip(),
                        "name": up_cam_name.strip(),
                        "location": up_cam_loc.strip(),
                        "source_type": "file",
                        "source_path": str(dest_path),
                        "is_enabled": up_enabled
                    })
                    if success:
                        st.success(f"Video uploaded to `{dest_path.name}` and registered as `{up_cam_id}`!")
                        st.rerun()
                    else:
                        st.error("Failed to register uploaded video camera.")
