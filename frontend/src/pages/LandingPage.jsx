import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Eye,
  Camera,
  Layers,
  FileCheck2,
  TrendingUp,
  Cpu,
  Video,
  AlertTriangle,
  Compass,
  ArrowRight,
  CheckCircle2,
  Lock,
  Boxes,
  Database,
  Code2,
  Activity,
  Menu,
  X,
  Mail,
  MapPin,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1220] text-[#F8FAFC] selection:bg-emerald-500 selection:text-white">
      {/* ========================================================================= */}
      {/* TOP NAVIGATION HEADER */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 border-b border-[#1E2D42]/80 bg-[#0B1220]/90 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          {/* Logo & Application Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white block">
                Waste_Disposal_Detection
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-emerald-400 block -mt-1">
                Environmental AI Platform
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#94A3B8]">
            <button
              onClick={() => scrollToSection('hero')}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('technology')}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Technology
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Contact
            </button>
          </nav>

          {/* CTA: Administrator Login */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-500 transition-all duration-200 hover:scale-[1.02]"
              >
                <span>Access Dashboard</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-5 py-2.5 text-sm font-semibold text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all duration-200 shadow-sm"
              >
                <Lock className="h-4 w-4" />
                <span>Administrator Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#111C2E]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[#1E2D42] bg-[#0B1220] px-6 py-4 space-y-3">
            <button
              onClick={() => scrollToSection('hero')}
              className="block w-full text-left py-2 text-sm font-medium text-slate-300 hover:text-emerald-400"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="block w-full text-left py-2 text-sm font-medium text-slate-300 hover:text-emerald-400"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="block w-full text-left py-2 text-sm font-medium text-slate-300 hover:text-emerald-400"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="block w-full text-left py-2 text-sm font-medium text-slate-300 hover:text-emerald-400"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('technology')}
              className="block w-full text-left py-2 text-sm font-medium text-slate-300 hover:text-emerald-400"
            >
              Technology
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="block w-full text-left py-2 text-sm font-medium text-slate-300 hover:text-emerald-400"
            >
              Contact
            </button>
            <div className="pt-2 border-t border-[#1E2D42]">
              <Link
                to={isAuthenticated ? "/dashboard" : "/login"}
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-emerald-500 py-2.5 text-sm font-semibold text-white"
              >
                <Lock className="h-4 w-4" />
                <span>{isAuthenticated ? "Go to Dashboard" : "Administrator Login"}</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ========================================================================= */}
      {/* HERO SECTION */}
      {/* ========================================================================= */}
      <section id="hero" className="relative overflow-hidden py-16 lg:py-24 border-b border-[#1E2D42]/60">
        {/* Subtle Background Glows */}
        <div className="absolute top-1/4 left-1/4 -z-10 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 -z-10 h-80 w-80 rounded-full bg-teal-500/10 blur-[100px]" />

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 radar-dot" />
                <span>Next-Gen Environmental Surveillance</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
                Smarter Waste Monitoring. <br />
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent">
                  Cleaner Communities.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#94A3B8] max-w-2xl leading-relaxed">
                An intelligent computer vision-powered monitoring platform designed to identify unauthorized waste disposal activities, monitor waste accumulation and support faster environmental response.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => scrollToSection('features')}
                  className="flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-500 transition-all duration-200 hover:-translate-y-0.5"
                >
                  <span>Explore Platform</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <Link
                  to="/login"
                  className="flex items-center gap-2 rounded-xl border border-[#1E2D42] bg-[#111C2E] px-6 py-3.5 text-sm font-semibold text-white hover:border-emerald-500/50 hover:bg-[#1A273D] transition-all duration-200"
                >
                  <Lock className="h-4 w-4 text-emerald-400" />
                  <span>Administrator Login</span>
                </Link>
              </div>

              {/* Key Platform Highlights */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-[#1E2D42]/80 max-w-lg">
                <div>
                  <div className="text-emerald-400 font-bold text-sm">24/7 Node Support</div>
                  <div className="text-xs text-[#94A3B8]">CCTV & Webcams</div>
                </div>
                <div>
                  <div className="text-teal-400 font-bold text-sm">Automated Audits</div>
                  <div className="text-xs text-[#94A3B8]">Evidence Vault</div>
                </div>
                <div>
                  <div className="text-emerald-400 font-bold text-sm">Modular Vision</div>
                  <div className="text-xs text-[#94A3B8]">YOLO / Grounding DINO</div>
                </div>
              </div>
            </div>

            {/* Right Visual: High-Tech Simulated CCTV Surveillance HUD */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl border border-[#1E2D42] bg-[#111C2E] p-3 shadow-2xl shadow-emerald-950/40">
                {/* HUD Top Bar */}
                <div className="flex items-center justify-between border-b border-[#1E2D42] pb-3 mb-3 px-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping" />
                    <span className="text-xs font-mono font-bold text-rose-400 tracking-wider">
                      REC • LIVE SURVEILLANCE
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    CAM-04 [SIMULATED]
                  </div>
                </div>

                {/* Surveillance Viewport Window */}
                <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-[#070D18] border border-[#1E2D42]/60 flex flex-col justify-between p-4">
                  {/* Grid Lines Pattern Overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(#1E2D42_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />

                  {/* Corner Targets */}
                  <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-emerald-500/60" />
                  <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-emerald-500/60" />
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-emerald-500/60" />
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-emerald-500/60" />

                  {/* Top HUD Telemetry */}
                  <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <div>SECTOR: RIVERFRONT_PARK_NORTH</div>
                    <div className="text-emerald-400">FPS: 30.0 • 1080P</div>
                  </div>

                  {/* Bounding Box 1: Simulated Person Detection */}
                  <div className="relative z-10 mx-auto w-3/4 h-28 border border-dashed border-teal-400/70 rounded-lg p-2 bg-teal-500/5 backdrop-blur-[1px]">
                    <div className="flex items-center justify-between text-[10px] font-mono text-teal-300">
                      <span>[ID: 104] PERSON</span>
                      <span className="bg-teal-500/20 px-1 rounded">CONF: 0.96</span>
                    </div>
                    <div className="mt-2 text-[10px] text-slate-300 font-mono">
                      MOTION: UNLOADING ACTION DETECTED
                    </div>

                    {/* Nested Bounding Box 2: Detected Waste Pile */}
                    <div className="mt-2 w-28 border-2 border-rose-500 rounded p-1 bg-rose-500/20">
                      <div className="text-[9px] font-bold text-rose-300 font-mono flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3 text-rose-400" />
                        <span>SUSPECTED_WASTE</span>
                      </div>
                      <div className="text-[8px] text-rose-200 font-mono">CONF: 0.94 [SIM]</div>
                    </div>
                  </div>

                  {/* HUD Bottom Info Bar */}
                  <div className="relative z-10 flex items-center justify-between border-t border-[#1E2D42]/70 pt-2 text-[10px] font-mono">
                    <span className="text-amber-400 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" /> RESTRICTED ZONE INFRINGEMENT
                    </span>
                    <span className="text-slate-400">MOCK PROVIDER ACTIVE</span>
                  </div>
                </div>

                {/* Sub-telemetry strip */}
                <div className="mt-3 flex items-center justify-between text-xs text-[#94A3B8] px-1">
                  <span>Tamper-Resistant Storage</span>
                  <span className="text-emerald-400 font-medium">Auto-Archived to Evidence Vault</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* ABOUT SECTION */}
      {/* ========================================================================= */}
      <section id="about" className="py-20 bg-[#0B1220] border-b border-[#1E2D42]/60">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1 text-xs font-semibold text-teal-400 uppercase tracking-wider">
              About The System
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Transforming Waste Monitoring Through Artificial Intelligence
            </h2>
            <p className="text-base sm:text-lg text-[#94A3B8] leading-relaxed">
              Traditional waste monitoring often depends on manual inspections and public complaints. Our platform introduces an intelligent monitoring approach that uses computer vision and automated event analysis to identify suspected unauthorized waste disposal activities and provide actionable evidence.
            </p>
          </div>

          {/* Three Key Pillars */}
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-[#1E2D42] bg-[#111C2E] p-6 hover:border-emerald-500/40 transition-colors">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5">
                <Compass className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Proactive Surveillance</h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed">
                Shifts municipal enforcement from reactive cleanup after citizen complaints to proactive real-time surveillance of high-risk dumping sectors.
              </p>
            </div>

            <div className="rounded-2xl border border-[#1E2D42] bg-[#111C2E] p-6 hover:border-teal-500/40 transition-colors">
              <div className="h-12 w-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-5">
                <Activity className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Automated Event Triaging</h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed">
                Correlates restricted geographical boundaries with person and object presence to filter out benign movement from dumping events.
              </p>
            </div>

            <div className="rounded-2xl border border-[#1E2D42] bg-[#111C2E] p-6 hover:border-emerald-500/40 transition-colors">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5">
                <FileCheck2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Tamper-Evident Evidence</h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed">
                Logs photographic snapshots, video clips, and cryptographic verification logs so enforcement teams hold defensible proof for action.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FEATURES SECTION */}
      {/* ========================================================================= */}
      <section id="features" className="py-20 bg-[#0B1220]/70 border-b border-[#1E2D42]/60">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Core Capabilities
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              End-to-End Environmental Surveillance Features
            </h2>
            <p className="text-sm sm:text-base text-[#94A3B8]">
              Purpose-built capabilities designed specifically for environmental supervisors and municipal enforcement teams.
            </p>
          </div>

          {/* 6 Feature Cards requested by user */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Intelligent Waste Detection */}
            <div className="rounded-2xl border border-[#1E2D42] bg-[#111C2E] p-6 hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1 group">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                  <Eye className="h-6 w-6" />
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  VISION
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Intelligent Waste Detection</h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed">
                Identifies visible waste and relevant objects using computer vision.
              </p>
            </div>

            {/* 2. Unauthorized Disposal Monitoring */}
            <div className="rounded-2xl border border-[#1E2D42] bg-[#111C2E] p-6 hover:border-teal-500/50 transition-all duration-300 hover:-translate-y-1 group">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 group-hover:bg-teal-500 group-hover:text-white transition-all">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <span className="text-[11px] font-mono text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded">
                  ZONES
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Unauthorized Disposal Monitoring</h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed">
                Analyses suspected waste disposal activities in predefined restricted areas.
              </p>
            </div>

            {/* 3. Real-Time Surveillance */}
            <div className="rounded-2xl border border-[#1E2D42] bg-[#111C2E] p-6 hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1 group">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                  <Video className="h-6 w-6" />
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  STREAM
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Real-Time Surveillance</h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed">
                Supports video-based monitoring through connected cameras.
              </p>
            </div>

            {/* 4. Evidence Collection */}
            <div className="rounded-2xl border border-[#1E2D42] bg-[#111C2E] p-6 hover:border-teal-500/50 transition-all duration-300 hover:-translate-y-1 group">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 group-hover:bg-teal-500 group-hover:text-white transition-all">
                  <FileCheck2 className="h-6 w-6" />
                </div>
                <span className="text-[11px] font-mono text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded">
                  VAULT
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Evidence Collection</h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed">
                Automatically stores incident images, timestamps and relevant video clips.
              </p>
            </div>

            {/* 5. Waste Accumulation Analysis */}
            <div className="rounded-2xl border border-[#1E2D42] bg-[#111C2E] p-6 hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1 group">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  ANALYTICS
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Waste Accumulation Analysis</h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed">
                Monitors changes in waste accumulation over time.
              </p>
            </div>

            {/* 6. Incident Management */}
            <div className="rounded-2xl border border-[#1E2D42] bg-[#111C2E] p-6 hover:border-teal-500/50 transition-all duration-300 hover:-translate-y-1 group">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 group-hover:bg-teal-500 group-hover:text-white transition-all">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <span className="text-[11px] font-mono text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded">
                  WORKFLOW
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Incident Management</h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed">
                Helps administrators review, verify and manage detected incidents.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* HOW IT WORKS SECTION */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="py-20 bg-[#0B1220] border-b border-[#1E2D42]/60">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1 text-xs font-semibold text-teal-400 uppercase tracking-wider">
              Workflow Pipeline
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              How the System Operates
            </h2>
            <p className="text-sm sm:text-base text-[#94A3B8]">
              A continuous, automated four-stage pipeline linking camera input to administrator resolution.
            </p>
          </div>

          {/* 4 Steps requested by user */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className="relative rounded-2xl border border-[#1E2D42] bg-[#111C2E] p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 font-bold text-emerald-400">
                    01
                  </div>
                  <Camera className="h-5 w-5 text-slate-500" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">Step 1: Video Acquisition</h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed">
                  Camera captures the monitored environment.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#1E2D42]/70 text-xs text-emerald-400 font-mono">
                Webcam • CCTV • Files
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative rounded-2xl border border-[#1E2D42] bg-[#111C2E] p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 border border-teal-500/30 font-bold text-teal-400">
                    02
                  </div>
                  <Cpu className="h-5 w-5 text-slate-500" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">Step 2: AI Analysis</h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed">
                  Computer vision models analyse video frames and identify relevant objects.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#1E2D42]/70 text-xs text-teal-400 font-mono">
                Person & Waste Detection
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative rounded-2xl border border-[#1E2D42] bg-[#111C2E] p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 font-bold text-emerald-400">
                    03
                  </div>
                  <AlertTriangle className="h-5 w-5 text-slate-500" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">Step 3: Incident Identification</h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed">
                  The system analyses activity patterns and identifies suspected unauthorized disposal.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#1E2D42]/70 text-xs text-emerald-400 font-mono">
                Restricted Zone Evaluation
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative rounded-2xl border border-[#1E2D42] bg-[#111C2E] p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 border border-teal-500/30 font-bold text-teal-400">
                    04
                  </div>
                  <FileCheck2 className="h-5 w-5 text-slate-500" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">Step 4: Monitoring and Reporting</h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed">
                  Evidence is stored and administrators can review incidents through the dashboard.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#1E2D42]/70 text-xs text-teal-400 font-mono">
                Verification & Audit Logs
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* PROJECT IMPACT SECTION */}
      {/* ========================================================================= */}
      <section className="py-20 bg-[#0B1220]/70 border-b border-[#1E2D42]/60">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Civic & Environmental Value
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                Measurable Project Impact On Urban Ecosystems
              </h2>
              <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
                By replacing sluggish manual patrolling with continuous visual telemetry, the platform provides municipal authorities with defensible intelligence to curtail illicit dumping before ecological degradation becomes irreversible.
              </p>
              <div className="pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300"
                >
                  <span>Explore Operational Controls</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Benefit 1 */}
              <div className="rounded-xl border border-[#1E2D42] bg-[#111C2E] p-5">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                  <h4 className="font-bold text-white text-sm">Faster Incident Identification</h4>
                </div>
                <p className="text-xs text-[#94A3B8] leading-relaxed pl-8">
                  Reduces the latency between an illegal dumping occurrence and municipal detection from days or weeks to immediate digital alerts.
                </p>
              </div>

              {/* Benefit 2 */}
              <div className="rounded-xl border border-[#1E2D42] bg-[#111C2E] p-5">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle2 className="h-5 w-5 text-teal-400 shrink-0" />
                  <h4 className="font-bold text-white text-sm">Evidence-Backed Reporting</h4>
                </div>
                <p className="text-xs text-[#94A3B8] leading-relaxed pl-8">
                  Generates tamper-resistant records featuring timestamped snapshots and video clips suitable for regulatory citations.
                </p>
              </div>

              {/* Benefit 3 */}
              <div className="rounded-xl border border-[#1E2D42] bg-[#111C2E] p-5">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                  <h4 className="font-bold text-white text-sm">Deterrent to Illegal Dumping</h4>
                </div>
                <p className="text-xs text-[#94A3B8] leading-relaxed pl-8">
                  Visible surveillance monitoring and consistent incident enforcement foster stronger civic accountability across monitored corridors.
                </p>
              </div>

              {/* Benefit 4 */}
              <div className="rounded-xl border border-[#1E2D42] bg-[#111C2E] p-5">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle2 className="h-5 w-5 text-teal-400 shrink-0" />
                  <h4 className="font-bold text-white text-sm">Data-Driven Environmental Management</h4>
                </div>
                <p className="text-xs text-[#94A3B8] leading-relaxed pl-8">
                  Equips city planners with longitudinal accumulation patterns to optimize bin placements and targeted clean-up dispatches.
                </p>
              </div>

              {/* Benefit 5 */}
              <div className="sm:col-span-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                <div className="flex items-center gap-3 mb-1">
                  <Sparkles className="h-5 w-5 text-emerald-400 shrink-0" />
                  <h4 className="font-bold text-white text-sm">Cleaner, Healthier Public Spaces</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pl-8">
                  Safeguards public parks, drainage channels, riverfronts, and vacant plots from contamination, vector breeding, and environmental hazards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* ABOUT THE TECHNOLOGY SECTION */}
      {/* ========================================================================= */}
      <section id="technology" className="py-20 bg-[#0B1220] border-b border-[#1E2D42]/60">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Architecture & Stack
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Built on Modern Open-Source Engineering
            </h2>
            <p className="text-sm sm:text-base text-[#94A3B8]">
              The platform decouples video capture, event rule processing, and user interfaces so high-capacity neural vision models can be plugged in seamlessly.
            </p>
          </div>

          {/* Development Status Notice */}
          <div className="mb-10 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 max-w-4xl mx-auto flex items-start gap-4">
            <AlertTriangle className="h-6 w-6 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-sm">
              <span className="font-bold text-amber-300">Modular Architecture Notice: </span>
              <span className="text-slate-300">
                The current software layer operates with a fully integrated simulated detection provider. Core modules for video management, camera nodes, restricted zones, evidence auditing, and incident tracking are 100% active. Pretrained models (YOLO, Grounding DINO, MediaPipe, ByteTrack) are under active development and designed for drop-in activation without altering application logic.
              </span>
            </div>
          </div>

          {/* Technology Badges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="rounded-xl border border-[#1E2D42] bg-[#111C2E] p-4 text-center">
              <Code2 className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
              <div className="font-bold text-white text-sm">Python</div>
              <div className="text-[11px] text-[#94A3B8]">Core Backend Engine</div>
            </div>

            <div className="rounded-xl border border-[#1E2D42] bg-[#111C2E] p-4 text-center">
              <Video className="h-6 w-6 text-teal-400 mx-auto mb-2" />
              <div className="font-bold text-white text-sm">OpenCV</div>
              <div className="text-[11px] text-[#94A3B8]">Video & Frame Stream</div>
            </div>

            <div className="rounded-xl border border-[#1E2D42] bg-[#111C2E] p-4 text-center">
              <Zap className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
              <div className="font-bold text-white text-sm">FastAPI</div>
              <div className="text-[11px] text-[#94A3B8]">High-Speed REST API</div>
            </div>

            <div className="rounded-xl border border-[#1E2D42] bg-[#111C2E] p-4 text-center">
              <Database className="h-6 w-6 text-teal-400 mx-auto mb-2" />
              <div className="font-bold text-white text-sm">SQLite & SQLAlchemy</div>
              <div className="text-[11px] text-[#94A3B8]">Relational Auditing DB</div>
            </div>

            <div className="rounded-xl border border-[#1E2D42] bg-[#111C2E] p-4 text-center">
              <Boxes className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
              <div className="font-bold text-white text-sm">React & Vite</div>
              <div className="text-[11px] text-[#94A3B8]">Tailwind UI Dashboard</div>
            </div>

            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center">
              <Cpu className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
              <div className="font-bold text-white text-sm">YOLO</div>
              <div className="text-[11px] text-emerald-300">Object Detection (Modular)</div>
            </div>

            <div className="rounded-xl border border-teal-500/20 bg-teal-500/5 p-4 text-center">
              <Eye className="h-6 w-6 text-teal-400 mx-auto mb-2" />
              <div className="font-bold text-white text-sm">Grounding DINO</div>
              <div className="text-[11px] text-teal-300">Open-Vocabulary Waste</div>
            </div>

            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center">
              <Activity className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
              <div className="font-bold text-white text-sm">MediaPipe</div>
              <div className="text-[11px] text-emerald-300">Pose & Dumping Motion</div>
            </div>

            <div className="rounded-xl border border-teal-500/20 bg-teal-500/5 p-4 text-center">
              <Compass className="h-6 w-6 text-teal-400 mx-auto mb-2" />
              <div className="font-bold text-white text-sm">ByteTrack</div>
              <div className="text-[11px] text-teal-300">Multi-Object Tracking</div>
            </div>

            <div className="rounded-xl border border-[#1E2D42] bg-[#111C2E] p-4 text-center">
              <ShieldCheck className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
              <div className="font-bold text-white text-sm">Pydantic</div>
              <div className="text-[11px] text-[#94A3B8]">Strict Data Validation</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* CONTACT / CIVIC PORTAL SECTION */}
      {/* ========================================================================= */}
      <section id="contact" className="py-20 bg-[#0B1220]/80 border-b border-[#1E2D42]/60">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="rounded-3xl border border-[#1E2D42] bg-gradient-to-br from-[#111C2E] to-[#0B1220] p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  Civic Collaboration & Inquiries
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white">
                  Partnering for Cleaner Municipalities
                </h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed">
                  Are you an environmental officer, municipality planner, or surveillance coordinator looking to implement automated waste detection in your jurisdiction?
                </p>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-emerald-400" />
                    <span>surveillance-support@wastedetection.gov</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-emerald-400" />
                    <span>Department of Environmental Protection & Civic Technology</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-lg-end gap-4">
                <Link
                  to="/login"
                  className="w-full sm:w-auto text-center rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-500 transition-all"
                >
                  Administrator Portal Login
                </Link>
                <button
                  onClick={() => alert('Demo contact request logged. For support inquiries, reach out to surveillance-support@wastedetection.gov.')}
                  className="w-full sm:w-auto text-center rounded-xl border border-[#1E2D42] bg-[#111C2E] px-6 py-3.5 text-sm font-semibold text-slate-200 hover:text-white hover:bg-[#1A273D] transition-all"
                >
                  Request Platform Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FOOTER */}
      {/* ========================================================================= */}
      <footer className="bg-[#0B1220] py-12 text-[#94A3B8]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#1E2D42]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <span className="text-base font-bold text-white block">
                  Waste_Disposal_Detection
                </span>
                <span className="text-[10px] text-emerald-400 block -mt-0.5">
                  AI Surveillance & Monitoring System
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs">
              <button onClick={() => scrollToSection('hero')} className="hover:text-emerald-400">Home</button>
              <button onClick={() => scrollToSection('about')} className="hover:text-emerald-400">About</button>
              <button onClick={() => scrollToSection('features')} className="hover:text-emerald-400">Features</button>
              <button onClick={() => scrollToSection('how-it-works')} className="hover:text-emerald-400">How It Works</button>
              <button onClick={() => scrollToSection('technology')} className="hover:text-emerald-400">Technology</button>
              <Link to="/login" className="hover:text-emerald-400 font-semibold text-white">Administrator Access</Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              &copy; {new Date().getFullYear()} Waste_Disposal_Detection. Environmental Surveillance & Waste Monitoring Platform.
            </div>
            <div className="flex items-center gap-4">
              <span>FastAPI Backend</span>
              <span>•</span>
              <span>OpenCV Video Pipeline</span>
              <span>•</span>
              <span>React 19 Frontend</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
