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
  HelpCircle,
  X,
  FileCheck2,
  Video,
  Activity,
  CheckCircle2,
  Sparkles,
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
    <div className="min-h-screen bg-[#F8F9F0] text-[#173B2A] flex flex-col justify-between selection:bg-[#4CAF50] selection:text-white">
      {/* Top Header Bar */}
      <header className="border-b border-[#E8F5E9] bg-white/90 backdrop-blur-md px-6 py-4 sticky top-0 z-20">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1B5E20] to-[#4CAF50] text-white shadow-md shadow-[#4CAF50]/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-[#173B2A] block">
                EcoWatch<span className="text-[#4CAF50]"> AI</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#1B5E20] block -mt-1">
                Authorized Municipal Portal
              </span>
            </div>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#647067] hover:text-[#1B5E20] bg-white border border-[#E8F5E9] px-3.5 py-1.5 rounded-xl shadow-xs transition-colors"
          >
            &larr; Back to Public Portal
          </Link>
        </div>
      </header>

      {/* Main 2-Column Section */}
      <main className="flex-1 flex items-center justify-center px-4 py-10 lg:py-16">
        <div className="mx-auto max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN: Hero visual showcase & municipal context */}
          {/* ========================================================================= */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C8E6C9] bg-[#E8F5E9] px-3.5 py-1 text-xs font-bold text-[#1B5E20]">
              <span className="h-2 w-2 rounded-full bg-[#4CAF50] animate-pulse" />
              <span>Municipal Operations Gateway</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#173B2A] leading-tight">
              AI Surveillance & Municipal Waste Monitoring
            </h1>

            <p className="text-sm sm:text-base text-[#647067] leading-relaxed">
              Authorized access is restricted to municipal environmental officers, surveillance operations personnel, and sanitation directors managing clean perimeters and ecological compliance.
            </p>

            {/* Environmental Image Banner with Overlay Card */}
            <div className="relative rounded-3xl overflow-hidden border border-[#E8F5E9] shadow-md group">
              <img
                src="/assets/hero-clean-city.jpg"
                alt="EcoWatch Clean Smart City"
                className="w-full h-48 sm:h-56 object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#173B2A]/90 via-[#173B2A]/40 to-transparent flex flex-col justify-end p-5 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <span className="h-2 w-2 rounded-full bg-[#4CAF50] animate-ping" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#E8F5E9]">
                    Continuous Optical Surveillance
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold">
                  Automated Unauthorized Disposal Detection
                </h3>
                <p className="text-xs text-slate-200 mt-0.5 line-clamp-1">
                  Real-time video inference, zone boundaries, and evidentiary logging.
                </p>
              </div>
            </div>

            {/* Feature Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="rounded-2xl border border-[#E8F5E9] bg-white p-3.5 shadow-xs">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#E8F5E9] text-[#1B5E20] mb-2">
                  <Video className="h-4 w-4" />
                </div>
                <h4 className="text-xs font-bold text-[#173B2A]">Live Video Streams</h4>
                <p className="text-[11px] text-[#647067] mt-0.5">
                  Multi-camera and CCTV monitoring feeds.
                </p>
              </div>

              <div className="rounded-2xl border border-[#E8F5E9] bg-white p-3.5 shadow-xs">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#E8F5E9] text-[#1B5E20] mb-2">
                  <FileCheck2 className="h-4 w-4" />
                </div>
                <h4 className="text-xs font-bold text-[#173B2A]">Incident Review</h4>
                <p className="text-[11px] text-[#647067] mt-0.5">
                  Verify or reject automated dumping alerts.
                </p>
              </div>

              <div className="rounded-2xl border border-[#E8F5E9] bg-white p-3.5 shadow-xs">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#E8F5E9] text-[#1B5E20] mb-2">
                  <Activity className="h-4 w-4" />
                </div>
                <h4 className="text-xs font-bold text-[#173B2A]">Audit Analytics</h4>
                <p className="text-[11px] text-[#647067] mt-0.5">
                  Hotspot trends and CSV compliance exports.
                </p>
              </div>
            </div>

            {/* Demo Credentials Quick-Fill Card */}
            <div className="rounded-2xl border border-[#C8E6C9] bg-[#E8F5E9]/60 p-4 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1B5E20] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-[#4CAF50]" />
                  Default Demo Credentials
                </span>
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="text-xs font-bold text-[#1B5E20] hover:text-[#4CAF50] underline cursor-pointer"
                >
                  Quick-Fill Form
                </button>
              </div>
              <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-white/80 rounded-xl p-2 border border-[#C8E6C9]">
                  <span className="text-[#647067] block text-[10px] font-sans font-semibold">User:</span>
                  <span className="text-[#173B2A] font-medium font-mono text-[11px]">admin@wastedetection.gov</span>
                </div>
                <div className="bg-white/80 rounded-xl p-2 border border-[#C8E6C9]">
                  <span className="text-[#647067] block text-[10px] font-sans font-semibold">Pass:</span>
                  <span className="text-[#173B2A] font-medium font-mono text-[11px]">admin123</span>
                </div>
              </div>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: Elevated Sign In Card */}
          {/* ========================================================================= */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl border border-[#E8F5E9] bg-white p-8 sm:p-10 shadow-xl shadow-[#1B5E20]/5 relative">
              
              <div className="mb-7">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1B5E20] to-[#4CAF50] text-white shadow-md shadow-[#4CAF50]/30 mb-4">
                  <Lock className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-extrabold text-[#173B2A] tracking-tight">
                  Administrator Portal
                </h2>
                <p className="text-xs sm:text-sm text-[#647067] mt-1">
                  Sign in with municipal credentials to access the operational surveillance console.
                </p>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="mb-5 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800">
                  <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
                  <div className="flex-1 font-medium">{errorMessage}</div>
                  <button
                    onClick={() => setErrorMessage('')}
                    className="text-rose-500 hover:text-rose-700 cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <div>
                  <label className="block text-xs font-bold text-[#173B2A] uppercase tracking-wider mb-2">
                    Administrator Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#647067]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@wastedetection.gov"
                      required
                      className="w-full rounded-2xl border border-[#C8E6C9] bg-[#F8F9F0] pl-10 pr-4 py-3 text-sm text-[#173B2A] placeholder-[#647067] focus:bg-white focus:border-[#4CAF50] focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/20 transition-all"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-[#173B2A] uppercase tracking-wider">
                      Security Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setForgotModalOpen(true)}
                      className="text-xs font-semibold text-[#1B5E20] hover:text-[#4CAF50] transition-colors cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#647067]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full rounded-2xl border border-[#C8E6C9] bg-[#F8F9F0] pl-10 pr-11 py-3 text-sm text-[#173B2A] placeholder-[#647067] focus:bg-white focus:border-[#4CAF50] focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#647067] hover:text-[#173B2A] cursor-pointer"
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
                      className="h-4 w-4 rounded border-[#C8E6C9] text-[#1B5E20] focus:ring-[#4CAF50]"
                    />
                    <span className="text-xs text-[#647067]">Remember this terminal session</span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#1B5E20] to-[#4CAF50] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#1B5E20]/25 hover:from-[#154a19] hover:to-[#43a047] focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:ring-offset-2 disabled:opacity-50 transition-all duration-200 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      <span>Authenticating Credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to Dashboard</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Security Banner */}
              <div className="mt-8 pt-5 border-t border-[#E8F5E9] flex items-center justify-between text-[11px] text-[#647067]">
                <span className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#1B5E20]" />
                  <span>256-Bit SHA Encrypted</span>
                </span>
                <span className="font-medium">Audit Log Enabled</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-[#E8F5E9] bg-white p-6 sm:p-7 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#173B2A] font-bold text-base">
                <HelpCircle className="h-5 w-5 text-[#1B5E20]" />
                <span>Credential Recovery</span>
              </div>
              <button
                onClick={() => setForgotModalOpen(false)}
                className="rounded-lg p-1 text-[#647067] hover:bg-[#F8F9F0] hover:text-[#173B2A]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs text-[#647067] leading-relaxed">
              Because this system connects to municipal video feeds and law-enforcement evidentiary vaults, automated public email password resets are disabled.
            </p>
            <div className="rounded-2xl border border-[#C8E6C9] bg-[#E8F5E9]/60 p-4 text-xs text-[#173B2A] space-y-1.5">
              <p className="font-bold text-[#1B5E20]">Standard Administrative Recovery:</p>
              <p className="text-[#647067]">Contact the Environmental IT Dispatcher or verify via local environment variables (<code className="text-[#1B5E20] font-mono">ADMIN_PASSWORD</code>).</p>
              <p className="pt-1 text-[#647067]">Default development credentials: <span className="text-[#173B2A] font-mono font-bold">admin@wastedetection.gov / admin123</span></p>
            </div>
            <button
              onClick={() => {
                handleFillDemo();
                setForgotModalOpen(false);
              }}
              className="w-full rounded-2xl bg-gradient-to-r from-[#1B5E20] to-[#4CAF50] py-3 text-xs font-bold text-white shadow-md hover:from-[#154a19] hover:to-[#43a047] transition-all cursor-pointer"
            >
              Fill Default Demo Account & Close
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-[#E8F5E9] bg-white py-4 px-6 text-center text-xs text-[#647067]">
        &copy; {new Date().getFullYear()} EcoWatch AI • AI-Based Unauthorized Waste Disposal Detection and Monitoring System
      </footer>
    </div>
  );
}
