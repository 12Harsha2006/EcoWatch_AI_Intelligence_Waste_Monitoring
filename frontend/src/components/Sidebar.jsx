import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Video,
  AlertOctagon,
  FolderLock,
  Camera,
  BarChart3,
  FileSpreadsheet,
  Sliders,
  ShieldCheck,
  Globe,
  Radio,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };
  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard, exact: true },
    { label: 'Live Monitoring', path: '/dashboard/monitoring', icon: Video },
    { label: 'Incident Management', path: '/dashboard/incidents', icon: AlertOctagon },
    { label: 'Evidence Management', path: '/dashboard/evidence', icon: FolderLock },
    { label: 'Camera Management', path: '/dashboard/cameras', icon: Camera },
    { label: 'Waste Analytics', path: '/dashboard/analytics', icon: BarChart3 },
    { label: 'Reports', path: '/dashboard/reports', icon: FileSpreadsheet },
    { label: 'Settings', path: '/dashboard/settings', icon: Sliders },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-[#1E2D42] bg-[#111C2E] px-4 py-5 text-[#F8FAFC] shadow-xl">
      {/* Brand Logo & Application Name */}
      <div className="flex items-center gap-3 px-2 mb-6">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-sm font-bold tracking-tight text-white truncate" title="Waste_Disposal_Detection">
            Waste_Disposal_Detection
          </h1>
          <p className="text-[10px] font-semibold tracking-wider text-emerald-400 uppercase">
            Surveillance Console
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
          Monitoring Modules
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm'
                    : 'text-[#94A3B8] hover:bg-[#1A273D] hover:text-white'
                }`
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Return to Public Portal & Logout Links */}
      <div className="pt-2 pb-2 space-y-1">
        <Link
          to="/"
          className="flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-xs font-medium text-[#94A3B8] hover:bg-[#1A273D] hover:text-white transition-colors"
        >
          <Globe className="h-4 w-4 text-teal-400" />
          <span>Public Portal</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* System Telemetry Footer */}
      <div className="border-t border-[#1E2D42] pt-4 px-1">
        <div className="rounded-xl border border-[#1E2D42] bg-[#0B1220] p-3 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-[#94A3B8]">
            <span className="flex items-center gap-1.5">
              <Radio className="h-3 w-3 text-emerald-400 animate-pulse" />
              <span>Node Stream</span>
            </span>
            <span className="font-semibold text-emerald-400">Online</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500">
            <span>Detection Mode</span>
            <span className="font-mono text-teal-400">MOCK SIMULATED</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
