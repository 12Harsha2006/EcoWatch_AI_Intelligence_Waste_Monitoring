import streamlit as st
import json
import cv2
import numpy as np
from dashboard.components.ui_widgets import render_header
from dashboard.components.api_client import api_client
from utils.visualizer import draw_polygon_zone
from monitoring.zone_evaluator import ZoneEvaluator

def render():
    render_header("🛑 Restricted Zone Configuration", "Configure spatial polygon boundaries where garbage dumping triggers automated alerts.")

    cameras = api_client.get_cameras()
    if not cameras:
        st.warning("Please register at least one camera first.")
        return

    cam_options = {f"{c['id']} - {c['name']}": c['id'] for c in cameras}
    selected_cam_label = st.selectbox("Select Target Camera", list(cam_options.keys()))
    selected_cam_id = cam_options[selected_cam_label]

    zones = api_client.get_zones(selected_cam_id)

    # 1. Active Zones Display & Visualizer
    st.subheader(f"📍 Active Zones on {selected_cam_id}")
    if zones:
        # Create a preview frame showing the zones
        preview_frame = np.zeros((480, 640, 3), dtype=np.uint8)
        preview_frame[:] = (40, 40, 40)
        cv2.putText(preview_frame, f"CAMERA: {selected_cam_id} (640x480)", (20, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (200, 200, 200), 1)

        for z in zones:
            pts = ZoneEvaluator.parse_polygon(z.get("polygon_coords", "[]"))
            if pts:
                draw_polygon_zone(preview_frame, pts, z.get("name", "Zone"), is_violated=False)

        rgb_preview = cv2.cvtColor(preview_frame, cv2.COLOR_BGR2RGB)
        st.image(rgb_preview, caption="Spatial Layout of Restricted Zones", use_container_width=True)

        for z in zones:
            col_z_info, col_z_action = st.columns([3, 1])
            with col_z_info:
                st.markdown(f"**Zone:** `{z['id']}` — **{z['name']}**")
                st.markdown(f"**Description:** {z.get('description') or 'None'}")
                st.markdown(f"**Coordinates:** `{z['polygon_coords']}`")
            with col_z_action:
                if st.button("🗑️ Delete Zone", key=f"del_z_{z['id']}", use_container_width=True):
                    api_client.delete_zone(z['id'])
                    st.success(f"Deleted {z['id']}")
                    st.rerun()
    else:
        st.info("No restricted zones defined on this camera yet.")

    st.markdown("---")

    # 2. Add New Zone Form
    st.subheader("➕ Define New Restricted Zone Boundary")

    preset = st.radio(
        "Choose Coordinate Preset or Custom",
        [
            "Center Clean Zone (Standard: [[150, 180], [480, 180], [480, 420], [150, 420]])",
            "Left Dumpster Boundary ([[50, 100], [300, 100], [300, 400], [50, 400]])",
            "Right Alley Perimeter ([[350, 100], [600, 100], [600, 400], [350, 400]])",
            "Custom Polygon"
        ]
    )

    preset_map = {
        "Center Clean Zone (Standard: [[150, 180], [480, 180], [480, 420], [150, 420]])": "[[150, 180], [480, 180], [480, 420], [150, 420]]",
        "Left Dumpster Boundary ([[50, 100], [300, 100], [300, 400], [50, 400]])": "[[50, 100], [300, 100], [300, 400], [50, 400]]",
        "Right Alley Perimeter ([[350, 100], [600, 100], [600, 400], [350, 400]])": "[[350, 100], [600, 100], [600, 400], [350, 400]]",
        "Custom Polygon": "[[100, 150], [500, 150], [500, 350], [100, 350]]"
    }

    with st.form("create_zone_form"):
        z_id = st.text_input("Zone ID", value=f"ZONE_{selected_cam_id}_{len(zones)+1:02d}")
        z_name = st.text_input("Zone Name", value="Designated Clean Area")
        z_desc = st.text_input("Description", value="Strict no-dumping zone monitored 24/7.")
        z_coords = st.text_area("Polygon Coordinates (JSON)", value=preset_map[preset])

        submitted = st.form_submit_button("Save Restricted Zone", type="primary")
        if submitted:
            try:
                pts = json.loads(z_coords)
                if not isinstance(pts, list) or len(pts) < 3:
                    st.error("Coordinates must be a JSON list with at least 3 points: [[x1, y1], [x2, y2], [x3, y3]]")
                else:
                    success = api_client.create_zone({
                        "id": z_id.strip(),
                        "camera_id": selected_cam_id,
                        "name": z_name.strip(),
                        "description": z_desc.strip(),
                        "polygon_coords": z_coords.strip(),
                        "is_active": True
                    })
                    if success:
                        st.success(f"Restricted zone '{z_id}' saved successfully!")
                        st.rerun()
                    else:
                        st.error("Failed to save zone. Ensure Zone ID is unique.")
            except Exception as e:
                st.error(f"Invalid JSON format for coordinates: {e}")

