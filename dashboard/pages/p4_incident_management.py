import streamlit as st
from pathlib import Path
from dashboard.components.ui_widgets import render_header, render_status_badge
from dashboard.components.api_client import api_client

def render():
    render_header("🚨 Incident Management & Review", "Review automated surveillance alerts, verify dumps, reject false alarms, and add remarks.")

    # 1. Filter Controls
    f_col1, f_col2, f_col3 = st.columns(3)
    with f_col1:
        status_filter = st.selectbox("Filter by Status", ["ALL", "PENDING", "VERIFIED", "REJECTED", "RESOLVED"])
    with f_col2:
        cameras = api_client.get_cameras()
        cam_ids = ["ALL"] + [c["id"] for c in cameras]
        cam_filter = st.selectbox("Filter by Camera", cam_ids)
    with f_col3:
        waste_filter = st.selectbox(
            "Filter by Waste Category",
            ["ALL", "plastic_waste", "garbage_bag", "cardboard_box", "construction_debris", "organic_waste"]
        )

    # Fetch incidents
    incidents = api_client.get_incidents(
        status=None if status_filter == "ALL" else status_filter,
        camera_id=None if cam_filter == "ALL" else cam_filter
    )

    if waste_filter != "ALL":
        incidents = [i for i in incidents if i["waste_category"] == waste_filter]

    st.markdown(f"Found **{len(incidents)}** incident(s).")
    st.markdown("---")

    if not incidents:
        st.info("No incidents match the selected filter criteria.")
        return

    # Incident selection
    inc_options = {f"{i['id']} | {i['status']} | {i['waste_category'].replace('_', ' ').title()} ({i['location']})": i['id'] for i in incidents}
    selected_label = st.selectbox("Select Incident to Inspect", list(inc_options.keys()))
    selected_id = inc_options[selected_label]

    # Full incident details
    inc = api_client.get_incident(selected_id)
    if not inc:
        st.error("Failed to load incident details.")
        return

    col_left, col_right = st.columns([1.2, 1.0])

    with col_left:
        st.subheader("📸 Incident Snapshot Evidence")
        evidence_items = inc.get("evidence_items", [])
        image_found = False

        for evi in evidence_items:
            if evi.get("file_type") == "IMAGE":
                img_path = Path(evi.get("file_path", ""))
                if img_path.exists():
                    st.image(str(img_path), caption=f"Evidence Snapshot for {inc['id']}", use_container_width=True)
                    image_found = True
                    break

        if not image_found:
            # Check default incident image path
            default_img = Path(inc.get("evidence_folder", "")) / "incident.jpg"
            if default_img.exists():
                st.image(str(default_img), caption=f"Evidence Snapshot for {inc['id']}", use_container_width=True)
            else:
                st.warning("Evidence snapshot file not found on disk.")

    with col_right:
        st.subheader("ℹ️ Incident Metadata")
        st.markdown(f"**Incident ID:** `{inc['id']}`")
        st.markdown(f"**Status:** {render_status_badge(inc['status'])}", unsafe_allow_html=True)
        st.markdown(f"**Camera:** `{inc['camera_id']}` ({inc['location']})")
        st.markdown(f"**Waste Category:** `{inc['waste_category']}`")
        st.markdown(f"**Detection Confidence:** `{inc['confidence']:.2f}`")
        st.markdown(f"**Timestamp (UTC):** `{inc['timestamp']}`")
        st.markdown(f"**Current Remarks:** *{inc.get('remarks') or 'None'}*")

        st.markdown("---")
        st.subheader("⚖️ Administrative Verification Action")
        remarks_input = st.text_area("Remarks / Inspection Note", value=inc.get("remarks") or "", placeholder="Enter verification notes or reasons...")
        admin_name = st.text_input("Reviewer Name", value="Senior Administrator")

        b1, b2, b3 = st.columns(3)
        with b1:
            if st.button("✅ Verify Incident", type="primary", use_container_width=True):
                if api_client.update_incident_status(inc["id"], "VERIFIED", remarks_input, admin_name):
                    st.success("Incident marked as VERIFIED.")
                    st.rerun()
        with b2:
            if st.button("❌ Reject (False Alert)", use_container_width=True):
                if api_client.update_incident_status(inc["id"], "REJECTED", remarks_input, admin_name):
                    st.warning("Incident marked as REJECTED.")
                    st.rerun()
        with b3:
            if st.button("🧹 Mark Resolved", use_container_width=True):
                if api_client.update_incident_status(inc["id"], "RESOLVED", remarks_input, admin_name):
                    st.info("Incident marked as RESOLVED.")
                    st.rerun()

    # Audit Trail
    st.markdown("---")
    st.subheader("📜 Verification Audit Log")
    v_records = inc.get("verification_records", [])
    if v_records:
        for v in v_records:
            st.markdown(
                f"- **{v['verified_at'][:19].replace('T', ' ')}** by `{v['verified_by']}`: "
                f"Changed `{v['previous_status']}` ➔ `{v['new_status']}` | *{v.get('remarks') or 'No remarks'}*"
            )
    else:
        st.caption("No administrative reviews performed yet on this incident.")

