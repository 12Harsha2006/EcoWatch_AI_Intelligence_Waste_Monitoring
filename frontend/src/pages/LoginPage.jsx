import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  X,
  FileCheck2,
  Video,
  Activity
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('admin@wastedetection.gov');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [forgotModalOpen, setForgotModalOpen] = useState(false);

  const destination = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both administrator email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate(destination, { replace: true });
    } catch (err) {
      const detail = err.response?.data?.detail || 'Authentication failed. Please check your administrator credentials.';
      setErrorMessage(detail);
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@wastedetection.gov');
    setPassword('admin123');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-[#0B1220] text-[#F8FAFC] flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      {/* Top Simple Bar */}
      <header className="border-b border-[#1E2D42]/80 bg-[#0B1220]/90 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white block">
                Waste_Disposal_Detection
              </span>
              <span className="text-[9px] font-semibold uppercase tracking-widest text-emerald-400 block -mt-1">
                Authorized Access Gateway
              </span>
            </div>
          </Link>

          <Link
            to="/"
            className="text-xs font-semibold text-[#94A3B8] hover:text-emerald-400 transition-colors"
          >
            &larr; Back to Public Portal
          </Link>
        </div>
      </header>

      {/* Main 2-Column Section */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="mx-auto max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* ========================================================================= */}
          {/* LEFT COLUMN: Mission, Platform Context & Capabilities */}
          {/* ========================================================================= */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 radar-dot" />
              <span>Restricted Municipal Portal</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              AI Surveillance & Incident Verification Management
            </h1>

            <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
              Authorized access is restricted to municipal environmental officers, surveillance operations personnel, and system administrators tasked with safeguarding public cleanliness and ecological boundaries.
            </p>

            {/* Feature Bullets */}
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Video className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Live Multi-Node Feeds</h4>
                  <p className="text-xs text-[#94A3B8]">
                    Control real-time video acquisition across registered cameras, CCTV streams, and manual uploads.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
                  <FileCheck2 className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Adjudication & Verification</h4>
                  <p className="text-xs text-[#94A3B8]">
                    Review flagged dumps, examine frame evidence, reject false positives, and log enforcement actions.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Activity className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Longitudinal Analytics & Export</h4>
                  <p className="text-xs text-[#94A3B8]">
                    Analyze hot-spot trends, generate compliance CSV reports, and dispatch municipal clean-up teams.
                  </p>
                </div>
              </div>
            </div>

            {/* Demo Credentials Reminder Card */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  Default Demo Credentials
                </span>
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-200 underline cursor-pointer"
                >
                  Quick-Fill Form
                </button>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs font-mono text-slate-300">
                <div>
                  <span className="text-slate-400 block">User:</span>
                  <span className="text-white font-medium">admin@wastedetection.gov</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Pass:</span>
                  <span className="text-white font-medium">admin123</span>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: Sign In Form */}
          {/* ========================================================================= */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl border border-[#1E2D42] bg-[#111C2E] p-8 shadow-2xl shadow-emerald-950/40 relative">
              <div className="mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md mb-4">
                  <Lock className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Welcome Back
                </h2>
                <p className="text-sm text-[#94A3B8] mt-1">
                  Sign in to access your environmental monitoring dashboard.
                </p>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="mb-5 flex items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300">
                  <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
                  <div className="flex-1">{errorMessage}</div>
                  <button
                    onClick={() => setErrorMessage('')}
                    className="text-rose-400 hover:text-rose-200"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Administrator Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@wastedetection.gov"
                      required
                      className="w-full rounded-xl border border-[#1E2D42] bg-[#0B1220] pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Security Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setForgotModalOpen(true)}
                      className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full rounded-xl border border-[#1E2D42] bg-[#0B1220] pl-10 pr-11 py-3 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-[#1E2D42] bg-[#0B1220] text-emerald-500 focus:ring-emerald-500"
                    />
                    <span className="text-xs text-[#94A3B8]">Remember this terminal session</span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-[#111C2E] disabled:opacity-50 transition-all duration-200 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      <span>Authenticating Credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Security Banner */}
              <div className="mt-6 pt-5 border-t border-[#1E2D42] flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  <span>256-Bit SHA Encrypted</span>
                </span>
                <span>Audit Log Enabled</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-[#1E2D42] bg-[#111C2E] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <HelpCircle className="h-5 w-5 text-emerald-400" />
                <span>Credential Recovery</span>
              </div>
              <button
                onClick={() => setForgotModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Because this system connects to municipal video feeds and law-enforcement evidentiary vaults, automated public email password resets are disabled.
            </p>
            <div className="rounded-xl border border-[#1E2D42] bg-[#0B1220] p-3 text-xs text-slate-300 space-y-1">
              <p className="font-semibold text-emerald-400">Standard Administrative Recovery:</p>
              <p>Contact the Environmental IT Dispatcher or verify via local environment variables (<code className="text-emerald-300">ADMIN_PASSWORD</code>).</p>
              <p className="pt-1 text-slate-400">Default development credentials: <span className="text-white font-mono">admin@wastedetection.gov / admin123</span></p>
            </div>
            <button
              onClick={() => {
                handleFillDemo();
                setForgotModalOpen(false);
              }}
              className="w-full rounded-xl bg-emerald-500 py-2.5 text-xs font-semibold text-white hover:bg-emerald-400 transition-colors"
            >
              Fill Default Demo Account & Close
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-[#1E2D42]/80 bg-[#0B1220] py-4 px-6 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} Waste_Disposal_Detection • Official Environmental Surveillance Gateway
      </footer>
    </div>
  );
}

