import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  WifiOff,
  Clock,
  Search,
  Bell,
  LogOut,
  User,
  CheckCircle,
  AlertTriangle,
  X,
  ChevronDown
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isBackendOnline, setIsBackendOnline] = useState(false);
  const [timeStr, setTimeStr] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notificationsRef = useRef(null);
  const profileRef = useRef(null);

  // Simulated notifications based on system incidents
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New Suspected Dumping Event',
      time: '2 mins ago',
      camera: 'CAM-01 (Sector 4 Riverfront)',
      unread: true,
      type: 'alert'
    },
    {
      id: 2,
      title: 'Camera Node Reconnected',
      time: '14 mins ago',
      camera: 'CAM-03 (Alleyway North)',
      unread: false,
      type: 'info'
    },
    {
      id: 3,
      title: 'Restricted Zone Infringement',
      time: '1 hour ago',
      camera: 'CAM-02 (Industrial Corridor)',
      unread: false,
      type: 'warning'
    }
  ]);

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

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/dashboard/incidents?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#1E2D42] bg-[#111C2E]/95 px-6 backdrop-blur-md text-[#F8FAFC]">
      {/* Left: Application Name & Search */}
      <div className="flex items-center gap-6 flex-1 max-w-xl">
        <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-3 py-1.5 border border-emerald-500/30 shrink-0">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span className="text-xs font-bold tracking-wider text-emerald-300 uppercase">
            EcoWatch AI • Waste Surveillance
          </span>
        </div>

        {/* Global Search field */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search camera nodes, incident IDs, or zones..."
            className="w-full rounded-xl border border-[#1E2D42] bg-[#0B1220] pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
          />
        </form>
      </div>

      {/* Right Controls & User Profile */}
      <div className="flex items-center gap-4">
        {/* UTC Clock */}
        <div className="hidden xl:flex items-center gap-1.5 text-xs font-mono text-[#94A3B8] bg-[#0B1220] px-3 py-1.5 rounded-xl border border-[#1E2D42]">
          <Clock className="h-3.5 w-3.5 text-emerald-400" />
          <span>{timeStr || 'Syncing UTC...'}</span>
        </div>

        {/* Backend Online Pill */}
        <div className="hidden md:flex items-center gap-2">
          {isBackendOnline ? (
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 radar-dot" />
              <span>Backend Connected</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-medium text-rose-300">
              <WifiOff className="h-3.5 w-3.5" />
              <span>Connecting...</span>
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-xl border border-[#1E2D42] bg-[#0B1220] text-slate-300 hover:text-white hover:border-emerald-500/40 transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-white shadow-sm">
                {unreadCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-[#1E2D42] bg-[#111C2E] p-4 shadow-2xl z-50 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#1E2D42]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Surveillance Alerts
                  </span>
                  {unreadCount > 0 && (
                    <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-300">
                      {unreadCount} New
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300"
                  >
                    Mark read
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`rounded-xl border p-2.5 text-xs transition-colors ${
                      item.unread
                        ? 'border-emerald-500/30 bg-emerald-500/5 text-white'
                        : 'border-[#1E2D42] bg-[#0B1220] text-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <span className="font-semibold text-white">{item.title}</span>
                      <span className="text-[10px] text-slate-500 shrink-0">{item.time}</span>
                    </div>
                    <div className="mt-1 text-[11px] text-[#94A3B8]">{item.camera}</div>
                  </div>
                ))}
              </div>

              <div className="pt-1 border-t border-[#1E2D42] text-center">
                <button
                  onClick={() => {
                    setNotificationsOpen(false);
                    navigate('/dashboard/incidents');
                  }}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  View All Incidents &rarr;
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Dropdown & Logout */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 rounded-xl border border-[#1E2D42] bg-[#0B1220] pl-2.5 pr-3 py-1.5 hover:border-emerald-500/40 transition-colors cursor-pointer"
          >
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center font-bold text-xs text-white shadow-sm">
              AD
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-semibold text-white leading-tight">
                {user?.name || 'Chief Env Officer'}
              </p>
              <p className="text-[10px] text-emerald-400 leading-tight">
                {user?.role || 'Administrator'}
              </p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-[#1E2D42] bg-[#111C2E] p-2 shadow-2xl z-50 space-y-1">
              <div className="px-3 py-2 border-b border-[#1E2D42]">
                <p className="text-xs font-bold text-white">{user?.name || 'Chief Env Officer'}</p>
                <p className="text-[11px] text-[#94A3B8] truncate">{user?.email || 'admin@wastedetection.gov'}</p>
              </div>

              <button
                onClick={() => {
                  setProfileOpen(false);
                  navigate('/dashboard/settings');
                }}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-slate-300 hover:bg-[#1A273D] hover:text-white transition-colors"
              >
                <User className="h-4 w-4 text-slate-400" />
                <span>Account & Settings</span>
              </button>

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout Session</span>
              </button>
            </div>
          )}
        </div>

        {/* Direct Logout Icon Button */}
        <button
          onClick={handleLogout}
          title="Sign Out"
          className="p-2 rounded-xl border border-[#1E2D42] bg-[#0B1220] text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-colors cursor-pointer"
          aria-label="Logout"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
