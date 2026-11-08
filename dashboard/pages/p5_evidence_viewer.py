import streamlit as st
import json
from pathlib import Path
from dashboard.components.ui_widgets import render_header
from dashboard.components.api_client import api_client

def render():
    render_header("🔍 Evidence File Viewer", "Inspect raw evidence packages: annotated images, video recordings, and JSON audit files.")

    incidents = api_client.get_incidents()
    if not incidents:
        st.info("No recorded incidents available in the system.")
        return

    inc_options = {f"{i['id']} ({i['waste_category']})": i['id'] for i in incidents}
    selected_label = st.selectbox("Select Incident Archive", list(inc_options.keys()))
    selected_id = inc_options[selected_label]

    inc = api_client.get_incident(selected_id)
    if not inc:
        st.error("Failed to retrieve incident archive.")
        return

    folder_path = Path(inc.get("evidence_folder", ""))
    st.markdown(f"**Archive Directory:** `{folder_path}`")

    t1, t2, t3 = st.tabs(["🖼️ Image Evidence", "🎥 Video Recording", "📄 Metadata JSON"])

    with t1:
        img_path = folder_path / "incident.jpg"
        if img_path.exists():
            st.image(str(img_path), caption=f"Evidence Snapshot for {inc['id']}", use_container_width=True)
            with open(img_path, "rb") as f:
                st.download_button(
                    label="⬇️ Download Evidence Image",
                    data=f.read(),
                    file_name=f"{inc['id']}_evidence.jpg",
                    mime="image/jpeg"
                )
        else:
            st.warning("No snapshot image file found in this archive.")

    with t2:
        vid_path = folder_path / "incident_video.mp4"
        if vid_path.exists():
            st.video(str(vid_path))
            with open(vid_path, "rb") as f:
                st.download_button(
                    label="⬇️ Download Video Clip",
                    data=f.read(),
                    file_name=f"{inc['id']}_clip.mp4",
                    mime="video/mp4"
                )
        else:
            st.info("No video recording attached to this incident (video capture is generated when sufficient frames are buffered).")

    with t3:
        meta_path = folder_path / "metadata.json"
        if meta_path.exists():
            with open(meta_path, "r", encoding="utf-8") as f:
                data = json.load(f)
            st.json(data)
            with open(meta_path, "rb") as f:
                st.download_button(
                    label="⬇️ Download Metadata JSON",
                    data=f.read(),
                    file_name=f"{inc['id']}_metadata.json",
                    mime="application/json"
                )
        else:
            st.warning("No metadata.json found in this archive.")
