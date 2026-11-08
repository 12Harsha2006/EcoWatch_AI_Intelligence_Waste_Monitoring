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
    navigate('/', { replace: true });
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
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-[#E8F5E9] bg-white px-4 py-5 text-[#173B2A] shadow-xs">
      {/* Brand Logo & Application Name */}
      <div className="flex items-center gap-3 px-2 mb-6">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1B5E20] to-[#4CAF50] text-white shadow-md shadow-[#4CAF50]/20">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-sm font-extrabold tracking-tight text-[#173B2A] truncate" title="EcoWatch AI">
            EcoWatch <span className="text-[#4CAF50]">AI</span>
          </h1>
          <p className="text-[10px] font-bold tracking-wider text-[#1B5E20] uppercase">
            Waste Surveillance
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#647067]">
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
                    ? 'bg-[#E8F5E9] text-[#1B5E20] font-bold border-l-4 border-[#1B5E20] shadow-xs'
                    : 'text-[#647067] hover:bg-[#F8F9F0] hover:text-[#173B2A]'
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
      <div className="pt-2 pb-2 space-y-1 border-t border-[#E8F5E9]">
        <Link
          to="/"
          className="flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-xs font-medium text-[#647067] hover:bg-[#F8F9F0] hover:text-[#1B5E20] transition-colors"
        >
          <Globe className="h-4 w-4 text-[#4CAF50]" />
          <span>Public Portal</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* System Telemetry Footer */}
      <div className="border-t border-[#E8F5E9] pt-3 px-1">
        <div className="rounded-2xl border border-[#E8F5E9] bg-[#F8F9F0] p-3 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-[#647067]">
            <span className="flex items-center gap-1.5">
              <Radio className="h-3 w-3 text-[#4CAF50] animate-pulse" />
              <span>Node Stream</span>
            </span>
            <span className="font-bold text-[#1B5E20]">Online</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-[#647067]">
            <span>Detection Mode</span>
            <span className="font-mono font-bold text-[#1B5E20]">MOCK SIMULATED</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
