import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

import Overview from './pages/Overview';
import LiveMonitoring from './pages/LiveMonitoring';
import IncidentManagement from './pages/IncidentManagement';
import EvidenceManagement from './pages/EvidenceManagement';
import CameraManagement from './pages/CameraManagement';
import WasteAnalytics from './pages/WasteAnalytics';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-[#0b0f17] text-slate-100">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Right Main Content Area */}
        <div className="flex flex-1 flex-col pl-64">
          {/* Top Surveillance Navigation Header */}
          <Navbar />

          {/* Dynamic Page Container */}
          <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/monitoring" element={<LiveMonitoring />} />
              <Route path="/incidents" element={<IncidentManagement />} />
              <Route path="/evidence" element={<EvidenceManagement />} />
              <Route path="/cameras" element={<CameraManagement />} />
              <Route path="/analytics" element={<WasteAnalytics />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
