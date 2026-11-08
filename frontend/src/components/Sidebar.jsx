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
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-800 bg-[#080c14] px-4 py-5">
      {/* Brand Logo */}
      <div className="flex items-center gap-3 px-2 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-black shadow-lg shadow-emerald-500/20">
          <Trash2 className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-tight text-white">EcoSurveil AI</h1>
          <p className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold">
            Waste Disposal Monitor
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Surveillance Modules
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-950'
                    : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
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
      <div className="mt-auto border-t border-slate-800/80 pt-4 px-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Detection Mode</span>
            <span className="font-semibold text-amber-400">Mock AI</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
            <span>Surveillance Status</span>
            <span className="flex items-center gap-1 font-semibold text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Armed
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
