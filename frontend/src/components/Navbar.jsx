import React, { useState, useEffect } from 'react';
import { ShieldCheck, Wifi, WifiOff, Clock } from 'lucide-react';
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
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/90 px-6 backdrop-blur-md">
      {/* Left Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-1.5 border border-emerald-200">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span className="text-xs font-bold tracking-wider text-emerald-800 uppercase">
            Waste_Disposal_Detection
          </span>
        </div>
      </div>

      {/* Right Controls & Status */}
      <div className="flex items-center gap-4">
        {/* UTC Clock */}
        <div className="hidden md:flex items-center gap-1.5 text-xs font-mono text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          <Clock className="h-3.5 w-3.5 text-slate-400" />
          <span>{timeStr || 'Loading UTC...'}</span>
        </div>

        {/* Backend Status */}
        <div className="flex items-center gap-2">
          {isBackendOnline ? (
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500 radar-dot" />
              <span>Backend Connected</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">
              <WifiOff className="h-3.5 w-3.5" />
              <span>Connecting...</span>
            </div>
          )}
        </div>

        {/* Supervisor Profile Avatar */}
        <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
          <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-xs text-white shadow-sm">
            AD
          </div>
          <div className="hidden lg:block">
            <p className="text-xs font-semibold text-slate-800">Admin Supervisor</p>
            <p className="text-[10px] text-slate-500">Security Control</p>
          </div>
        </div>
      </div>
    </header>
  );
}
