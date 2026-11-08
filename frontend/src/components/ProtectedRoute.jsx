import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck } from 'lucide-react';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#0B1220] text-slate-100">
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-[#111C2E] border border-emerald-500/30">
            <ShieldCheck className="h-8 w-8 text-emerald-400 animate-pulse" />
            <div className="absolute inset-0 rounded-2xl border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold tracking-wide text-white">Validating Administrator Security Clearance</p>
            <p className="text-xs text-slate-400">Waste_Disposal_Detection Security Gateway</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
