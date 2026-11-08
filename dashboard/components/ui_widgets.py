import streamlit as st

def render_header(title: str, subtitle: str = ""):
    """Render unified page header with styled typography."""
    st.markdown(f"""
        <div style="margin-bottom: 25px;">
            <h1 style="font-size: 2.2rem; font-weight: 700; margin-bottom: 5px; color: #1E293B;">{title}</h1>
            <p style="font-size: 1.05rem; color: #64748B; margin-top: 0;">{subtitle}</p>
        </div>
    """, unsafe_allow_html=True)

def render_simulation_banner():
    """Renders prominent advisory banner indicating mock detection mode."""
    st.markdown("""
        <div style="background-color: #FEF3C7; border-left: 5px solid #F59E0B; padding: 12px 18px; border-radius: 6px; margin-bottom: 20px;">
            <strong style="color: #92400E; font-size: 0.95rem;">⚠️ SIMULATION MODE ACTIVE (MOCK PROVIDER)</strong>
            <p style="color: #B45309; font-size: 0.85rem; margin: 4px 0 0 0;">
                Detections and waste events are currently simulated for prototyping the surveillance architecture.
                Pretrained models (YOLO, Grounding DINO, ByteTrack) will be plugged in via the AI provider interface.
            </p>
        </div>
    """, unsafe_allow_html=True)

def render_status_badge(status: str) -> str:
    """Returns HTML chip for incident status."""
    status_colors = {
        "PENDING": ("#FEF3C7", "#92400E"),
        "VERIFIED": ("#DCFCE7", "#166534"),
        "REJECTED": ("#FEE2E2", "#991B1B"),
        "RESOLVED": ("#E0F2FE", "#075985"),
        "ACTIVE": ("#DCFCE7", "#166534"),
        "INACTIVE": ("#F1F5F9", "#475569")
    }
    bg, fg = status_colors.get(status.upper(), ("#F1F5F9", "#475569"))
    return f"""<span style="background-color: {bg}; color: {fg}; padding: 3px 10px; border-radius: 12px; font-weight: 600; font-size: 0.8rem;">{status.upper()}</span>"""
