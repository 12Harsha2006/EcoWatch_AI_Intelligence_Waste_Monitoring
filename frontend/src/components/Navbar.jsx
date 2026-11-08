import React, { useState, useEffect } from 'react';
import { ShieldCheck, Wifi, WifiOff, Bell, Clock } from 'lucide-react';
import api from '../services/api';

export default function Navbar() {
  const [isBackendOnline, setIsBackendOnline] = useState(false);
  const [timeStr, setTimeStr] = useState('');

  // Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toUTCString().replace('GMT', 'UTC'));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Health check
  useEffect(() => {
    const checkHealth = async () => {
      try {
        await api.get('/health', { timeout: 3000 });
        setIsBackendOnline(true);
      } catch {
        setIsBackendOnline(false);
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-[#0b0f17]/80 px-6 backdrop-blur-md">
      {/* Left Title / Breadcrumb */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-1.5 border border-emerald-500/20">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">
            AI Surveillance Engine v1.0
          </span>
        </div>
      </div>

      {/* Right Controls & Status */}
      <div className="flex items-center gap-5">
        {/* UTC Clock */}
        <div className="hidden md:flex items-center gap-1.5 text-xs font-mono text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
          <Clock className="h-3.5 w-3.5 text-slate-500" />
          <span>{timeStr || 'Loading UTC...'}</span>
        </div>

        {/* Backend Connectivity Status */}
        <div className="flex items-center gap-2">
          {isBackendOnline ? (
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 radar-dot" />
              <span>FastAPI Online</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-medium text-rose-400">
              <WifiOff className="h-3.5 w-3.5" />
              <span>Connecting to Backend...</span>
            </div>
          )}
        </div>

        {/* User profile avatar */}
        <div className="flex items-center gap-2 border-l border-slate-800 pl-4">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center font-bold text-xs text-black">
            AD
          </div>
          <div className="hidden lg:block">
            <p className="text-xs font-semibold text-slate-200">Admin Supervisor</p>
            <p className="text-[10px] text-slate-400">Security Control</p>
          </div>
        </div>
      </div>
    </header>
  );
}

