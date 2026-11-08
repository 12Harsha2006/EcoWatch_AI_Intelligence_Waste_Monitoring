import streamlit as st
import pandas as pd
import io
import datetime
from dashboard.components.ui_widgets import render_header
from dashboard.components.api_client import api_client

def render():
    render_header("📑 Waste Accumulation & Audit Reports", "Generate filtered compliance audits, analyze waste accumulation trends, and export CSV logs.")

    # Filter section
    col1, col2, col3 = st.columns(3)
    with col1:
        status_sel = st.selectbox("Status Filter", ["ALL", "PENDING", "VERIFIED", "REJECTED", "RESOLVED"])
    with col2:
        cameras = api_client.get_cameras()
        cam_opts = ["ALL"] + [c["id"] for c in cameras]
        cam_sel = st.selectbox("Camera Source", cam_opts)
    with col3:
        cat_sel = st.selectbox(
            "Waste Category",
            ["ALL", "plastic_waste", "garbage_bag", "cardboard_box", "construction_debris", "organic_waste"]
        )

    # Fetch matching incidents
    incidents = api_client.get_incidents(
        status=None if status_sel == "ALL" else status_sel,
        camera_id=None if cam_sel == "ALL" else cam_sel
    )
    if cat_sel != "ALL":
        incidents = [i for i in incidents if i["waste_category"] == cat_sel]

    # Convert to DataFrame
    rows = []
    for inc in incidents:
        rows.append({
            "Incident ID": inc["id"],
            "Date and Time (UTC)": inc["timestamp"][:19].replace("T", " ") if inc.get("timestamp") else "",
            "Camera ID": inc["camera_id"],
            "Location": inc["location"],
            "Waste Category": inc["waste_category"].replace("_", " ").title(),
            "Confidence": f"{inc['confidence']:.2f}",
            "Verification Status": inc["status"],
            "Remarks": inc.get("remarks") or ""
        })

    df = pd.DataFrame(rows)

    # Export Button & Summary Row
    e_col1, e_col2 = st.columns([3, 1])
    with e_col1:
        st.markdown(f"Total Matching Incidents: **{len(df)}**")
    with e_col2:
        if not df.empty:
            csv_buffer = io.StringIO()
            df.to_csv(csv_buffer, index=False)
            filename = f"waste_report_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
            st.download_button(
                label="📥 Export Report as CSV",
                data=csv_buffer.getvalue(),
                file_name=filename,
                mime="text/csv",
                type="primary",
                use_container_width=True
            )

    st.markdown("---")

    if not df.empty:
        st.dataframe(df, use_container_width=True)

        st.markdown("---")
        st.subheader("📈 Waste Accumulation Analytics")
        ch1, ch2 = st.columns(2)

        with ch1:
            st.markdown("##### Disposal Incidents by Category")
            cat_summary = df["Waste Category"].value_counts()
            st.bar_chart(cat_summary, color="#10B981")

        with ch2:
            st.markdown("##### Distribution by Location Hotspots")
            loc_summary = df["Location"].value_counts()
            st.bar_chart(loc_summary, color="#6366F1")
    else:
        st.info("No incident records found matching the filter.")
