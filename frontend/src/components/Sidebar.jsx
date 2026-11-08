import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Video,
  AlertOctagon,
  FolderLock,
  Camera,
  BarChart3,
  FileSpreadsheet,
  Sliders,
  Trash2,
  ShieldCheck,
} from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { label: 'Overview', path: '/', icon: LayoutDashboard },
    { label: 'Live Monitoring', path: '/monitoring', icon: Video },
    { label: 'Incident Review', path: '/incidents', icon: AlertOctagon },
    { label: 'Evidence Vault', path: '/evidence', icon: FolderLock },
    { label: 'Camera Nodes', path: '/cameras', icon: Camera },
    { label: 'Waste Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Reports & Export', path: '/reports', icon: FileSpreadsheet },
    { label: 'System Settings', path: '/settings', icon: Sliders },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-200 bg-white px-4 py-5 shadow-sm">
      {/* Brand Logo & Name */}
      <div className="flex items-center gap-3 px-2 mb-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-500/20">
          <Trash2 className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-sm font-bold tracking-tight text-slate-900 truncate" title="Waste_Disposal_Detection">
            Waste_Disposal_Detection
          </h1>
          <p className="text-[10px] font-semibold tracking-wider text-emerald-600 uppercase">
            AI Monitoring System
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Navigation Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* System Footer info */}
      <div className="mt-auto border-t border-slate-100 pt-4 px-2">
        <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-3">
          <div className="flex items-center justify-between text-[11px] text-slate-600">
            <span>System State</span>
            <span className="flex items-center gap-1 font-semibold text-emerald-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500 radar-dot" /> Online
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
            <span>Platform</span>
            <span className="font-medium text-slate-600">v1.0.0 Enterprise</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
