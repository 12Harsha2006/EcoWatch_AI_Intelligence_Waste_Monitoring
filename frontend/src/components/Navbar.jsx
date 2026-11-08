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
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#E8F5E9] bg-white/95 px-6 backdrop-blur-md text-[#173B2A]">
      {/* Left: Application Name & Search */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="flex items-center gap-2 rounded-xl bg-[#E8F5E9] px-3 py-1.5 border border-[#C8E6C9] shrink-0">
          <ShieldCheck className="h-4 w-4 text-[#1B5E20]" />
          <span className="text-xs font-bold tracking-wider text-[#1B5E20] uppercase">
            EcoWatch AI • Operations
          </span>
        </div>

        {/* Global Search field */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#647067]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search camera nodes, incident IDs, or zones..."
            className="w-full rounded-xl border border-[#E8F5E9] bg-[#F8F9F0] pl-9 pr-3 py-1.5 text-xs text-[#173B2A] placeholder-[#647067] focus:border-[#4CAF50] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#4CAF50] transition-colors"
          />
        </form>
      </div>

      {/* Right Controls & User Profile */}
      <div className="flex items-center gap-3">
        {/* UTC Clock */}
        <div className="hidden xl:flex items-center gap-1.5 text-xs font-mono text-[#647067] bg-[#F8F9F0] px-3 py-1.5 rounded-xl border border-[#E8F5E9]">
          <Clock className="h-3.5 w-3.5 text-[#1B5E20]" />
          <span>{timeStr || 'Syncing UTC...'}</span>
        </div>

        {/* Backend Online Pill */}
        <div className="hidden md:flex items-center gap-2">
          {isBackendOnline ? (
            <div className="flex items-center gap-1.5 rounded-full border border-[#C8E6C9] bg-[#E8F5E9] px-3 py-1 text-xs font-semibold text-[#1B5E20]">
              <span className="h-2 w-2 rounded-full bg-[#4CAF50] animate-pulse" />
              <span>Backend Connected</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
              <WifiOff className="h-3.5 w-3.5" />
              <span>Connecting...</span>
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-xl border border-[#E8F5E9] bg-[#F8F9F0] text-[#647067] hover:text-[#173B2A] hover:bg-white hover:border-[#C8E6C9] transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#1B5E20] text-[9px] font-bold text-white shadow-sm">
                {unreadCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-[#E8F5E9] bg-white p-4 shadow-xl z-50 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#E8F5E9]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#173B2A] uppercase tracking-wider">
                    Surveillance Alerts
                  </span>
                  {unreadCount > 0 && (
                    <span className="rounded-lg bg-[#E8F5E9] px-1.5 py-0.5 text-[10px] font-bold text-[#1B5E20]">
                      {unreadCount} New
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[11px] font-semibold text-[#1B5E20] hover:text-[#4CAF50]"
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
                        ? 'border-[#C8E6C9] bg-[#E8F5E9]/50 text-[#173B2A]'
                        : 'border-[#E8F5E9] bg-[#F8F9F0] text-[#647067]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <span className="font-bold text-[#173B2A]">{item.title}</span>
                      <span className="text-[10px] text-[#647067] shrink-0">{item.time}</span>
                    </div>
                    <div className="mt-1 text-[11px] text-[#647067]">{item.camera}</div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-[#E8F5E9] text-center">
                <button
                  onClick={() => {
                    setNotificationsOpen(false);
                    navigate('/dashboard/incidents');
                  }}
                  className="text-xs text-[#1B5E20] hover:text-[#4CAF50] font-bold"
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
            className="flex items-center gap-2.5 rounded-xl border border-[#E8F5E9] bg-[#F8F9F0] pl-2 pr-2.5 py-1.5 hover:bg-white hover:border-[#C8E6C9] transition-colors cursor-pointer"
          >
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-[#1B5E20] to-[#4CAF50] flex items-center justify-center font-bold text-xs text-white shadow-sm">
              AD
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-[#173B2A] leading-tight">
                {user?.name || 'Chief Env Officer'}
              </p>
              <p className="text-[10px] font-semibold text-[#1B5E20] leading-tight">
                {user?.role || 'Administrator'}
              </p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-[#647067]" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-[#E8F5E9] bg-white p-2 shadow-xl z-50 space-y-1">
              <div className="px-3 py-2 border-b border-[#E8F5E9]">
                <p className="text-xs font-bold text-[#173B2A]">{user?.name || 'Chief Env Officer'}</p>
                <p className="text-[11px] text-[#647067] truncate">{user?.email || 'admin@wastedetection.gov'}</p>
              </div>

              <button
                onClick={() => {
                  setProfileOpen(false);
                  navigate('/dashboard/settings');
                }}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-[#173B2A] hover:bg-[#F8F9F0] transition-colors cursor-pointer"
              >
                <User className="h-4 w-4 text-[#647067]" />
                <span>Account & Settings</span>
              </button>

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer"
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
          className="p-2 rounded-xl border border-[#E8F5E9] bg-[#F8F9F0] text-[#647067] hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors cursor-pointer"
          aria-label="Logout"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
