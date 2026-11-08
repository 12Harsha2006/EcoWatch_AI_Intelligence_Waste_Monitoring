import streamlit as st
import pandas as pd
from dashboard.components.ui_widgets import render_header, render_status_badge
from dashboard.components.api_client import api_client

def render():
    render_header("📊 Surveillance Overview", "Real-time summary of unauthorized disposal events and camera statuses.")

    # Fetch metrics
    metrics = api_client.get_metrics()
    total = metrics.get("total_incidents", 0)
    pending = metrics.get("pending_incidents", 0)
    verified = metrics.get("verified_incidents", 0)
    rejected = metrics.get("rejected_incidents", 0)
    resolved = metrics.get("resolved_incidents", 0)
    active_cams = metrics.get("active_cameras", 0)

    # 1. Metric Cards
    c1, c2, c3, c4, c5, c6 = st.columns(6)
    with c1:
        st.metric(label="Total Incidents", value=total)
    with c2:
        st.metric(label="Pending Review", value=pending, delta=f"{pending} need review" if pending > 0 else "Clear", delta_color="inverse")
    with c3:
        st.metric(label="Verified Incidents", value=verified)
    with c4:
        st.metric(label="Rejected (False)", value=rejected)
    with c5:
        st.metric(label="Resolved", value=resolved)
    with c6:
        st.metric(label="Active Cameras", value=active_cams)

    st.markdown("---")

    # 2. Charts Section
    col_left, col_right = st.columns(2)

    with col_left:
        st.subheader("📍 Incidents by Location")
        by_loc = metrics.get("by_location", {})
        if by_loc:
            df_loc = pd.DataFrame(list(by_loc.items()), columns=["Location", "Incidents"]).set_index("Location")
            st.bar_chart(df_loc, color="#3B82F6")
        else:
            st.info("No location data available yet.")

    with col_right:
        st.subheader("🏷️ Incidents by Waste Category")
        by_cat = metrics.get("by_category", {})
        if by_cat:
            df_cat = pd.DataFrame(list(by_cat.items()), columns=["Category", "Count"]).set_index("Category")
            st.bar_chart(df_cat, color="#EF4444")
        else:
            st.info("No waste category data available yet.")

    st.markdown("---")

    # 3. Recent Incidents Table
    st.subheader("⏱️ Recent Surveillance Alerts")
    incidents = api_client.get_incidents()
    if incidents:
        display_data = []
        for inc in incidents[:8]:
            display_data.append({
                "Incident ID": inc["id"],
                "Timestamp (UTC)": inc["timestamp"][:19].replace("T", " ") if inc.get("timestamp") else "",
                "Camera ID": inc["camera_id"],
                "Location": inc["location"],
                "Waste Category": inc["waste_category"].replace("_", " ").title(),
                "Confidence": f"{inc['confidence']:.2f}",
                "Status": inc["status"]
            })
        st.dataframe(pd.DataFrame(display_data), use_container_width=True)
    else:
        st.info("No incidents detected yet. Start monitoring on the 'Live Monitoring' page.")
