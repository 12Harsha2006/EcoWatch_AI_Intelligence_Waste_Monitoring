import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';

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
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Portal: Welcome / Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Administrator Login Gateway */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Administrative Dashboard Layout */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Overview />} />
            <Route path="overview" element={<Navigate to="/dashboard" replace />} />
            <Route path="monitoring" element={<LiveMonitoring />} />
            <Route path="incidents" element={<IncidentManagement />} />
            <Route path="evidence" element={<EvidenceManagement />} />
            <Route path="cameras" element={<CameraManagement />} />
            <Route path="analytics" element={<WasteAnalytics />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Friendly Backwards-Compatibility Redirects */}
          <Route path="/monitoring" element={<Navigate to="/dashboard/monitoring" replace />} />
          <Route path="/incidents" element={<Navigate to="/dashboard/incidents" replace />} />
          <Route path="/evidence" element={<Navigate to="/dashboard/evidence" replace />} />
          <Route path="/cameras" element={<Navigate to="/dashboard/cameras" replace />} />
          <Route path="/analytics" element={<Navigate to="/dashboard/analytics" replace />} />
          <Route path="/reports" element={<Navigate to="/dashboard/reports" replace />} />
          <Route path="/settings" element={<Navigate to="/dashboard/settings" replace />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
