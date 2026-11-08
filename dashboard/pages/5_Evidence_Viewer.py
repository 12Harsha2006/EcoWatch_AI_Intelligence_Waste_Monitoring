import sys
from pathlib import Path
ROOT_DIR = Path(__file__).resolve().parent.parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))
from dashboard.pages.p5_evidence_viewer import render
from dashboard.components.ui_widgets import render_simulation_banner

render_simulation_banner()
render()
