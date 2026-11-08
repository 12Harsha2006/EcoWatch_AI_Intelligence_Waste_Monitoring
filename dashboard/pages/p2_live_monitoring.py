import streamlit as st
import time
import cv2
import numpy as np
from dashboard.components.ui_widgets import render_header
from dashboard.components.api_client import api_client
from monitoring.stream_worker import camera_stream_manager
from utils.config import settings

def render():
    render_header("📹 Live Surveillance Monitoring", "Direct feed monitoring, zone violation alerts, and stream controls.")

    cameras = api_client.get_cameras()
    if not cameras:
        st.warning("No cameras registered in system. Please add cameras on the 'Camera Management' page.")
        return

    cam_options = {f"{c['id']} - {c['name']} ({c['location']})": c['id'] for c in cameras}
    selected_label = st.selectbox("Select Active Camera Stream", list(cam_options.keys()))
    selected_cam_id = cam_options[selected_label]

    # Camera status
    is_running = camera_stream_manager.is_running(selected_cam_id)
    worker = camera_stream_manager.get_worker(selected_cam_id)
    current_fps = worker.fps if worker else 0.0

    # Controls Row
    c1, c2, c3, c4 = st.columns([1.5, 1.5, 2.5, 2])
    with c1:
        if not is_running:
            if st.button("▶️ Start Monitoring", use_container_width=True, type="primary"):
                camera_stream_manager.start_camera(selected_cam_id)
                st.rerun()
        else:
            if st.button("⏹️ Stop Monitoring", use_container_width=True):
                camera_stream_manager.stop_camera(selected_cam_id)
                st.rerun()

    with c2:
        if is_running:
            if st.button("🚨 Simulate Waste Drop", use_container_width=True, help="Force mock detector to drop waste inside restricted zone"):
                camera_stream_manager.trigger_incident(selected_cam_id)
                st.success("Simulated waste drop injected!")

    with c3:
        status_color = "green" if is_running else "gray"
        st.markdown(
            f"<div style='margin-top: 8px;'>Stream Status: <b style='color:{status_color};'>{'ACTIVE' if is_running else 'STOPPED'}</b> | FPS: <b>{current_fps}</b></div>",
            unsafe_allow_html=True
        )

    with c4:
        st.markdown(
            f"<div style='margin-top: 8px; color: gray;'>Backend Provider: <b>{settings.DETECTION_PROVIDER.upper()}</b></div>",
            unsafe_allow_html=True
        )

    st.markdown("---")

    # Video display container
    video_container = st.empty()

    if is_running:
        st.info("Monitoring feed is streaming. Click 'Simulate Waste Drop' to generate an instant surveillance incident.")

        # Stream placeholder that refreshes live frames
        # Stream up to 100 frames or until user stops/interacts
        for _ in range(120):
            worker = camera_stream_manager.get_worker(selected_cam_id)
            if not worker or not worker.running:
                break

            with worker.lock:
                frame = worker.latest_annotated_frame

            if frame is not None:
                # Convert BGR (OpenCV) to RGB (Streamlit)
                rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                video_container.image(rgb_frame, channels="RGB", use_container_width=True)

            time.sleep(0.06)
    else:
        st.info("Monitoring is currently stopped. Click 'Start Monitoring' above to activate this camera.")
        # Show placeholder snapshot if camera worker had a previous frame
        worker = camera_stream_manager.get_worker(selected_cam_id)
        if worker and worker.latest_annotated_frame is not None:
            rgb_frame = cv2.cvtColor(worker.latest_annotated_frame, cv2.COLOR_BGR2RGB)
            video_container.image(rgb_frame, channels="RGB", caption="Last captured frame", use_container_width=True)
