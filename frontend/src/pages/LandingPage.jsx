import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  Leaf,
  ShieldCheck,
  Camera,
  Cpu,
  Eye,
  AlertTriangle,
  FileCheck2,
  TrendingUp,
  BarChart3,
  Users,
  Layers,
  ArrowRight,
  CheckCircle2,
  Lock,
  ChevronRight,
  Menu,
  X,
  Sparkles,
  TreePine,
  Recycle,
  Shield,
  HeartHandshake,
  Database,
  Code2,
  Zap,
  MapPin,
  ExternalLink,
  Activity,
  FileSpreadsheet,
  PackageCheck,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#173B2A] font-sans selection:bg-[#4CAF50] selection:text-white">
      {/* ========================================================================= */}
      {/* 3. NAVIGATION BAR */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 border-b border-[#E8F5E9] bg-white/95 backdrop-blur-md transition-all shadow-xs">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          {/* Logo & Application Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1B5E20] to-[#4CAF50] text-white shadow-md shadow-[#4CAF50]/20 group-hover:scale-105 transition-transform duration-200">
              <Leaf className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-[#173B2A]">
                  EcoWatch<span className="text-[#4CAF50]"> AI</span>
                </span>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[#4CAF50] block -mt-1">
                Intelligent Waste Monitoring
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#647067]">
            <button
              onClick={() => scrollToSection('hero')}
              className="hover:text-[#1B5E20] transition-colors cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="hover:text-[#1B5E20] transition-colors cursor-pointer"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="hover:text-[#1B5E20] transition-colors cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-[#1B5E20] transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('impact')}
              className="hover:text-[#1B5E20] transition-colors cursor-pointer"
            >
              Impact
            </button>
            <button
              onClick={() => scrollToSection('technology')}
              className="hover:text-[#1B5E20] transition-colors cursor-pointer"
            >
              Technology
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="hover:text-[#1B5E20] transition-colors cursor-pointer"
            >
              Contact
            </button>
          </nav>

          {/* Login Button */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1B5E20] to-[#4CAF50] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#4CAF50]/25 hover:from-[#174e1b] hover:to-[#43a047] transition-all duration-200 hover:-translate-y-0.5"
              >
                <span>Dashboard Console</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 rounded-xl border border-[#4CAF50]/40 bg-[#E8F5E9] px-5 py-2.5 text-sm font-bold text-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition-all duration-200 shadow-xs"
              >
                <Lock className="h-4 w-4 text-[#4CAF50]" />
                <span>Admin Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-[#173B2A] hover:bg-[#E8F5E9] transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[#E8F5E9] bg-white px-6 py-4 space-y-3 animate-in fade-in">
            <button
              onClick={() => scrollToSection('hero')}
              className="block w-full text-left py-2 text-sm font-semibold text-[#173B2A] hover:text-[#4CAF50]"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="block w-full text-left py-2 text-sm font-semibold text-[#173B2A] hover:text-[#4CAF50]"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="block w-full text-left py-2 text-sm font-semibold text-[#173B2A] hover:text-[#4CAF50]"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="block w-full text-left py-2 text-sm font-semibold text-[#173B2A] hover:text-[#4CAF50]"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('impact')}
              className="block w-full text-left py-2 text-sm font-semibold text-[#173B2A] hover:text-[#4CAF50]"
            >
              Impact
            </button>
            <button
              onClick={() => scrollToSection('technology')}
              className="block w-full text-left py-2 text-sm font-semibold text-[#173B2A] hover:text-[#4CAF50]"
            >
              Technology
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="block w-full text-left py-2 text-sm font-semibold text-[#173B2A] hover:text-[#4CAF50]"
            >
              Contact
            </button>
            <div className="pt-2 border-t border-[#E8F5E9]">
              <Link
                to={isAuthenticated ? "/dashboard" : "/login"}
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-[#1B5E20] to-[#4CAF50] py-2.5 text-sm font-bold text-white shadow-md shadow-[#4CAF50]/20"
              >
                <Lock className="h-4 w-4" />
                <span>{isAuthenticated ? "Go to Dashboard" : "Admin Login"}</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ========================================================================= */}
      {/* 4. HERO SECTION */}
      {/* ========================================================================= */}
      <section
        id="hero"
        className="relative overflow-hidden bg-gradient-to-b from-[#F8F9F0] via-white to-[#E8F5E9]/30 py-16 sm:py-20 lg:py-28 border-b border-[#E8F5E9]"
      >
        {/* Soft Eco Gradient Orbs */}
        <div className="absolute top-10 left-10 -z-10 h-96 w-96 rounded-full bg-[#E8F5E9] blur-3xl opacity-70" />
        <div className="absolute bottom-10 right-10 -z-10 h-96 w-96 rounded-full bg-[#C8E6C9] blur-3xl opacity-50" />

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              {/* Nature Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-[#4CAF50]/30 bg-white px-4 py-1.5 text-xs font-bold text-[#1B5E20] shadow-xs">
                <span className="flex h-2 w-2 rounded-full bg-[#4CAF50] eco-pulse" />
                <span className="tracking-wide">AI-Powered Environmental Surveillance</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#173B2A] leading-[1.15]">
                Smart AI Monitoring for a{' '}
                <span className="bg-gradient-to-r from-[#1B5E20] to-[#4CAF50] bg-clip-text text-transparent">
                  Cleaner Tomorrow
                </span>
              </h1>

              {/* Supporting Description */}
              <p className="text-base sm:text-lg text-[#647067] max-w-2xl leading-relaxed">
                EcoWatch AI uses intelligent computer vision technology to detect and monitor suspected unauthorized waste disposal activities, helping communities maintain cleaner and healthier surroundings.
              </p>

              {/* Two Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => scrollToSection('features')}
                  className="flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-[#1B5E20] to-[#4CAF50] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#4CAF50]/25 hover:from-[#174e1b] hover:to-[#43a047] transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                >
                  <span>Explore Features</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <Link
                  to="/login"
                  className="flex items-center gap-2 rounded-xl border-2 border-[#1B5E20] bg-white px-7 py-3.5 text-sm font-bold text-[#1B5E20] hover:bg-[#E8F5E9] transition-all duration-200 shadow-xs"
                >
                  <Lock className="h-4 w-4 text-[#4CAF50]" />
                  <span>Admin Login</span>
                </Link>
              </div>

              {/* Startup Credibility Highlights */}
              <div className="pt-8 grid grid-cols-3 gap-6 border-t border-[#E8F5E9] max-w-lg">
                <div>
                  <div className="text-[#1B5E20] font-extrabold text-base">24/7 Monitoring</div>
                  <div className="text-xs text-[#647067]">CCTV & Optical Feeds</div>
                </div>
                <div>
                  <div className="text-[#1B5E20] font-extrabold text-base">Zero False Claims</div>
                  <div className="text-xs text-[#647067]">Auditable Evidence</div>
                </div>
                <div>
                  <div className="text-[#1B5E20] font-extrabold text-base">Eco-Friendly</div>
                  <div className="text-xs text-[#647067]">Clean Communities</div>
                </div>
              </div>
            </div>

            {/* Right Visual: High-Quality Environmental Photograph with Floating Cards */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl p-3 bg-gradient-to-br from-[#E8F5E9] to-white border border-[#C8E6C9] shadow-xl shadow-[#1B5E20]/5">
                {/* Main Environmental Photo */}
                <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-[#E8F5E9]">
                  <img
                    src="/assets/hero-clean-city.jpg"
                    alt="Clean green eco-friendly city park and sustainable community"
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#173B2A]/40 via-transparent to-transparent" />
                </div>

                {/* Floating Information Card 1: AI-Powered Detection */}
                <div className="absolute -top-4 -left-4 sm:top-6 sm:-left-6 rounded-2xl bg-white/95 p-3.5 shadow-lg border border-[#C8E6C9] backdrop-blur-md animate-float-1 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F5E9] text-[#1B5E20]">
                    <Cpu className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#173B2A]">AI-Powered Detection</p>
                    <p className="text-[10px] text-[#647067]">Vision-Based Analysis</p>
                  </div>
                </div>

                {/* Floating Information Card 2: Smart Waste Monitoring */}
                <div className="absolute -bottom-4 -left-2 sm:bottom-6 sm:-left-4 rounded-2xl bg-white/95 p-3.5 shadow-lg border border-[#C8E6C9] backdrop-blur-md animate-float-2 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F5E9] text-[#4CAF50]">
                    <Recycle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#173B2A]">Smart Waste Monitoring</p>
                    <p className="text-[10px] text-[#647067]">Perimeter Zone Alerts</p>
                  </div>
                </div>

                {/* Floating Information Card 3: Cleaner Communities */}
                <div className="absolute -bottom-4 -right-2 sm:bottom-10 sm:-right-6 rounded-2xl bg-white/95 p-3.5 shadow-lg border border-[#C8E6C9] backdrop-blur-md animate-float-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1B5E20] text-white">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#173B2A]">Cleaner Communities</p>
                    <p className="text-[10px] text-[#647067]">Sustainable Cities</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. ABOUT ECOWATCH AI */}
      {/* ========================================================================= */}
      <section id="about" className="py-20 lg:py-28 bg-[#FFFFFF] border-b border-[#E8F5E9]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Image: Waste Segregation & Proper Cleanliness */}
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="relative rounded-3xl p-3 bg-gradient-to-br from-[#E8F5E9] to-white border border-[#C8E6C9] shadow-lg">
                <div className="aspect-4/3 w-full overflow-hidden rounded-2xl bg-[#E8F5E9]">
                  <img
                    src="/assets/about-waste-management.jpg"
                    alt="Proper waste management, colorful recycling bins and environmental cleanliness"
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1000&q=80';
                    }}
                  />
                </div>
                <div className="mt-3 flex items-center justify-between px-2 text-xs text-[#647067]">
                  <span className="font-semibold text-[#1B5E20]">Community Waste Segregation</span>
                  <span>Modern Environmental Best Practices</span>
                </div>
              </div>
            </div>

            {/* Right Text: Purpose & Principles */}
            <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#4CAF50]/30 bg-[#E8F5E9] px-4 py-1 text-xs font-bold text-[#1B5E20]">
                <Sprout className="h-4 w-4 text-[#4CAF50]" />
                <span>About EcoWatch AI</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#173B2A] leading-tight">
                Building a Cleaner Future Through Intelligent Technology
              </h2>

              <p className="text-base text-[#647067] leading-relaxed">
                EcoWatch AI is an AI-powered waste disposal monitoring system designed to identify suspicious waste disposal activities using computer vision and camera-based monitoring.
              </p>

              <p className="text-sm text-[#647067] leading-relaxed">
                By bridging modern optical cameras with intelligent spatial evaluation, the platform transforms manual municipal monitoring into an automated, responsive environmental protection network.
              </p>

              {/* Value Checkmark List */}
              <div className="space-y-3.5 pt-2">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E8F5E9] text-[#1B5E20]">
                    <Check className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#173B2A]">Proactive Environmental Protection</h4>
                    <p className="text-xs text-[#647067]">
                      Dispatches early notifications before illegal dumps grow into unmanageable environmental hazards.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E8F5E9] text-[#1B5E20]">
                    <Check className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#173B2A]">Restricted Zone Compliance</h4>
                    <p className="text-xs text-[#647067]">
                      Monitors vulnerable public parks, drainage channels, riverfronts, and vacant plots with custom polygon borders.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E8F5E9] text-[#1B5E20]">
                    <Check className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#173B2A]">Defensible Evidence Vault</h4>
                    <p className="text-xs text-[#647067]">
                      Captures timestamped image frames and video recordings with full audit logs for administrative verification.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. FEATURES SECTION (8 CARDS) */}
      {/* ========================================================================= */}
      <section id="features" className="py-20 lg:py-28 bg-[#F8F9F0] border-b border-[#E8F5E9]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#4CAF50]/30 bg-[#E8F5E9] px-4 py-1 text-xs font-bold text-[#1B5E20]">
              <Leaf className="h-4 w-4 text-[#4CAF50]" />
              <span>Core Capabilities</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#173B2A]">
              Powerful Features for Smarter Waste Management
            </h2>
            <p className="text-sm sm:text-base text-[#647067]">
              Purpose-built capabilities engineered to detect, record, and resolve unauthorized waste disposal with speed and accuracy.
            </p>
          </div>

          {/* 8 Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1. AI-Based Person Detection */}
            <div className="rounded-2xl border border-[#E8F5E9] bg-white p-6 shadow-xs hover:shadow-md hover:border-[#4CAF50]/40 transition-all duration-300 hover:-translate-y-1 group">
              <div className="h-12 w-12 rounded-2xl bg-[#E8F5E9] flex items-center justify-center text-[#1B5E20] group-hover:bg-[#1B5E20] group-hover:text-white transition-colors mb-5">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-[#173B2A] mb-2">AI-Based Person Detection</h3>
              <p className="text-xs text-[#647067] leading-relaxed">
                Identifies people appearing in camera footage.
              </p>
            </div>

            {/* 2. Waste Object Detection */}
            <div className="rounded-2xl border border-[#E8F5E9] bg-white p-6 shadow-xs hover:shadow-md hover:border-[#4CAF50]/40 transition-all duration-300 hover:-translate-y-1 group">
              <div className="h-12 w-12 rounded-2xl bg-[#E8F5E9] flex items-center justify-center text-[#1B5E20] group-hover:bg-[#1B5E20] group-hover:text-white transition-colors mb-5">
                <Recycle className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-[#173B2A] mb-2">Waste Object Detection</h3>
              <p className="text-xs text-[#647067] leading-relaxed">
                Identifies supported waste objects using computer vision models.
              </p>
            </div>

            {/* 3. Suspicious Dumping Detection */}
            <div className="rounded-2xl border border-[#E8F5E9] bg-white p-6 shadow-xs hover:shadow-md hover:border-[#4CAF50]/40 transition-all duration-300 hover:-translate-y-1 group">
              <div className="h-12 w-12 rounded-2xl bg-[#E8F5E9] flex items-center justify-center text-[#1B5E20] group-hover:bg-[#1B5E20] group-hover:text-white transition-colors mb-5">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-[#173B2A] mb-2">Suspicious Dumping Detection</h3>
              <p className="text-xs text-[#647067] leading-relaxed">
                Analyses movement and object placement to identify suspected dumping events.
              </p>
            </div>

            {/* 4. Restricted Area Monitoring */}
            <div className="rounded-2xl border border-[#E8F5E9] bg-white p-6 shadow-xs hover:shadow-md hover:border-[#4CAF50]/40 transition-all duration-300 hover:-translate-y-1 group">
              <div className="h-12 w-12 rounded-2xl bg-[#E8F5E9] flex items-center justify-center text-[#1B5E20] group-hover:bg-[#1B5E20] group-hover:text-white transition-colors mb-5">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-[#173B2A] mb-2">Restricted Area Monitoring</h3>
              <p className="text-xs text-[#647067] leading-relaxed">
                Monitors predefined areas where waste disposal is not permitted.
              </p>
            </div>

            {/* 5. Evidence Collection */}
            <div className="rounded-2xl border border-[#E8F5E9] bg-white p-6 shadow-xs hover:shadow-md hover:border-[#4CAF50]/40 transition-all duration-300 hover:-translate-y-1 group">
              <div className="h-12 w-12 rounded-2xl bg-[#E8F5E9] flex items-center justify-center text-[#1B5E20] group-hover:bg-[#1B5E20] group-hover:text-white transition-colors mb-5">
                <FileCheck2 className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-[#173B2A] mb-2">Evidence Collection</h3>
              <p className="text-xs text-[#647067] leading-relaxed">
                Captures relevant images and video clips for administrator review.
              </p>
            </div>

            {/* 6. Incident Management */}
            <div className="rounded-2xl border border-[#E8F5E9] bg-white p-6 shadow-xs hover:shadow-md hover:border-[#4CAF50]/40 transition-all duration-300 hover:-translate-y-1 group">
              <div className="h-12 w-12 rounded-2xl bg-[#E8F5E9] flex items-center justify-center text-[#1B5E20] group-hover:bg-[#1B5E20] group-hover:text-white transition-colors mb-5">
                <PackageCheck className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-[#173B2A] mb-2">Incident Management</h3>
              <p className="text-xs text-[#647067] leading-relaxed">
                Allows administrators to review and manage reported incidents.
              </p>
            </div>

            {/* 7. Waste Monitoring */}
            <div className="rounded-2xl border border-[#E8F5E9] bg-white p-6 shadow-xs hover:shadow-md hover:border-[#4CAF50]/40 transition-all duration-300 hover:-translate-y-1 group">
              <div className="h-12 w-12 rounded-2xl bg-[#E8F5E9] flex items-center justify-center text-[#1B5E20] group-hover:bg-[#1B5E20] group-hover:text-white transition-colors mb-5">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-[#173B2A] mb-2">Waste Monitoring</h3>
              <p className="text-xs text-[#647067] leading-relaxed">
                Helps monitor changes in waste accumulation over time.
              </p>
            </div>

            {/* 8. Analytics and Reports */}
            <div className="rounded-2xl border border-[#E8F5E9] bg-white p-6 shadow-xs hover:shadow-md hover:border-[#4CAF50]/40 transition-all duration-300 hover:-translate-y-1 group">
              <div className="h-12 w-12 rounded-2xl bg-[#E8F5E9] flex items-center justify-center text-[#1B5E20] group-hover:bg-[#1B5E20] group-hover:text-white transition-colors mb-5">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-[#173B2A] mb-2">Analytics and Reports</h3>
              <p className="text-xs text-[#647067] leading-relaxed">
                Presents monitoring information through visual reports and charts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. HOW IT WORKS */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="py-20 lg:py-28 bg-[#FFFFFF] border-b border-[#E8F5E9]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#4CAF50]/30 bg-[#E8F5E9] px-4 py-1 text-xs font-bold text-[#1B5E20]">
              <Activity className="h-4 w-4 text-[#4CAF50]" />
              <span>Operational Pipeline</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#173B2A]">
              How EcoWatch AI Works
            </h2>
            <p className="text-sm sm:text-base text-[#647067]">
              A continuous, automated four-stage process connecting camera surveillance to municipal verification.
            </p>
          </div>

          {/* Horizontal Process Flow (4 Steps) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Step 1: Camera Monitoring */}
            <div className="relative rounded-2xl border border-[#E8F5E9] bg-[#F8F9F0] p-6 flex flex-col justify-between hover:border-[#4CAF50]/40 transition-all">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1B5E20] text-white font-extrabold text-base shadow-sm">
                    01
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-[#E8F5E9] text-[#1B5E20]">
                    <Camera className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-[#173B2A] mb-2">Step 1: Camera Monitoring</h3>
                <p className="text-xs text-[#647067] leading-relaxed">
                  Camera footage is captured using CCTV or a webcam.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E8F5E9] text-[11px] font-semibold text-[#1B5E20]">
                CCTV • Webcams • Video Uploads
              </div>
            </div>

            {/* Step 2: AI Detection */}
            <div className="relative rounded-2xl border border-[#E8F5E9] bg-[#F8F9F0] p-6 flex flex-col justify-between hover:border-[#4CAF50]/40 transition-all">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#4CAF50] text-white font-extrabold text-base shadow-sm">
                    02
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-[#E8F5E9] text-[#4CAF50]">
                    <Cpu className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-[#173B2A] mb-2">Step 2: AI Detection</h3>
                <p className="text-xs text-[#647067] leading-relaxed">
                  Computer vision models analyse people and supported waste objects.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E8F5E9] text-[11px] font-semibold text-[#4CAF50]">
                Bounding Boxes • Confidence Scoring
              </div>
            </div>

            {/* Step 3: Activity Analysis */}
            <div className="relative rounded-2xl border border-[#E8F5E9] bg-[#F8F9F0] p-6 flex flex-col justify-between hover:border-[#4CAF50]/40 transition-all">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1B5E20] text-white font-extrabold text-base shadow-sm">
                    03
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-[#E8F5E9] text-[#1B5E20]">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-[#173B2A] mb-2">Step 3: Activity Analysis</h3>
                <p className="text-xs text-[#647067] leading-relaxed">
                  The system analyses object movement and placement to identify suspected dumping activities.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E8F5E9] text-[11px] font-semibold text-[#1B5E20]">
                Spatial Zones • Cooldown Tracking
              </div>
            </div>

            {/* Step 4: Admin Verification */}
            <div className="relative rounded-2xl border border-[#E8F5E9] bg-[#F8F9F0] p-6 flex flex-col justify-between hover:border-[#4CAF50]/40 transition-all">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#4CAF50] text-white font-extrabold text-base shadow-sm">
                    04
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-[#E8F5E9] text-[#4CAF50]">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-[#173B2A] mb-2">Step 4: Admin Verification</h3>
                <p className="text-xs text-[#647067] leading-relaxed">
                  Evidence is stored and administrators can review and verify reported incidents.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E8F5E9] text-[11px] font-semibold text-[#4CAF50]">
                Image Vault • CSV Compliance Export
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. ENVIRONMENTAL IMPACT SECTION */}
      {/* ========================================================================= */}
      <section
        id="impact"
        className="relative py-24 lg:py-32 overflow-hidden border-b border-[#E8F5E9]"
      >
        {/* Background Wide Nature Photograph with Light Overlay */}
        <div className="absolute inset-0 -z-20">
          <img
            src="/assets/impact-green-nature.jpg"
            alt="Lush green natural canopy and clean sustainable environment"
            className="h-full w-full object-cover object-center"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1600&q=80';
            }}
          />
        </div>
        {/* Bright Eco-friendly Overlay Ensuring 100% Text Readability */}
        <div className="absolute inset-0 -z-10 bg-white/90 backdrop-blur-[2px]" />

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#4CAF50]/30 bg-[#E8F5E9] px-4 py-1 text-xs font-bold text-[#1B5E20]">
              <TreePine className="h-4 w-4 text-[#4CAF50]" />
              <span>Civic Sustainability</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#173B2A]">
              Technology for a Greener Tomorrow
            </h2>
            <p className="text-base text-[#647067] leading-relaxed">
              By providing smart visual telemetry, EcoWatch AI empowers cities and municipalities to build cleaner, more sustainable living spaces for future generations.
            </p>
          </div>

          {/* 5 Impact Highlight Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="rounded-2xl border border-[#C8E6C9] bg-white/95 p-6 shadow-sm hover:shadow-md transition-all text-center space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-[#E8F5E9] text-[#1B5E20] flex items-center justify-center mx-auto">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-sm text-[#173B2A]">Cleaner Public Spaces</h3>
              <p className="text-xs text-[#647067] leading-relaxed">
                Protects community parks, streets, and riverfronts from waste accumulation.
              </p>
            </div>

            <div className="rounded-2xl border border-[#C8E6C9] bg-white/95 p-6 shadow-sm hover:shadow-md transition-all text-center space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-[#E8F5E9] text-[#4CAF50] flex items-center justify-center mx-auto">
                <Recycle className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-sm text-[#173B2A]">Responsible Waste Disposal</h3>
              <p className="text-xs text-[#647067] leading-relaxed">
                Encourages compliance with municipal segregation and designated trash zones.
              </p>
            </div>

            <div className="rounded-2xl border border-[#C8E6C9] bg-white/95 p-6 shadow-sm hover:shadow-md transition-all text-center space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-[#E8F5E9] text-[#1B5E20] flex items-center justify-center mx-auto">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-sm text-[#173B2A]">Reduced Illegal Dumping</h3>
              <p className="text-xs text-[#647067] leading-relaxed">
                Acts as a 24/7 deterrent against unauthorized commercial and residential dumping.
              </p>
            </div>

            <div className="rounded-2xl border border-[#C8E6C9] bg-white/95 p-6 shadow-sm hover:shadow-md transition-all text-center space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-[#E8F5E9] text-[#4CAF50] flex items-center justify-center mx-auto">
                <Eye className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-sm text-[#173B2A]">Smart Monitoring</h3>
              <p className="text-xs text-[#647067] leading-relaxed">
                Transforms static cameras into intelligent, proactive environmental sentinels.
              </p>
            </div>

            <div className="rounded-2xl border border-[#C8E6C9] bg-white/95 p-6 shadow-sm hover:shadow-md transition-all text-center space-y-3 sm:col-span-2 lg:col-span-1">
              <div className="h-12 w-12 rounded-2xl bg-[#E8F5E9] text-[#1B5E20] flex items-center justify-center mx-auto">
                <HeartHandshake className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-sm text-[#173B2A]">Sustainable Communities</h3>
              <p className="text-xs text-[#647067] leading-relaxed">
                Creates healthier urban neighborhoods free from biohazards and litter.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. TECHNOLOGY SECTION */}
      {/* ========================================================================= */}
      <section id="technology" className="py-20 lg:py-28 bg-[#F8F9F0] border-b border-[#E8F5E9]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#4CAF50]/30 bg-[#E8F5E9] px-4 py-1 text-xs font-bold text-[#1B5E20]">
              <Cpu className="h-4 w-4 text-[#4CAF50]" />
              <span>Technology Stack</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#173B2A]">
              Powered by Intelligent Technology
            </h2>
            <p className="text-sm sm:text-base text-[#647067]">
              Built with proven open-source technologies and engineered with a decoupled architecture for future AI neural model upgrades.
            </p>
          </div>

          {/* 8 Technology Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {/* 1. Python */}
            <div className="rounded-2xl border border-[#E8F5E9] bg-white p-6 shadow-xs hover:shadow-md hover:border-[#4CAF50]/40 transition-all text-center space-y-2">
              <div className="h-12 w-12 rounded-2xl bg-[#E8F5E9] text-[#1B5E20] flex items-center justify-center mx-auto font-bold text-base">
                Py
              </div>
              <h4 className="font-bold text-sm text-[#173B2A]">Python</h4>
              <p className="text-[11px] text-[#647067]">Core Processing Engine</p>
            </div>

            {/* 2. OpenCV */}
            <div className="rounded-2xl border border-[#E8F5E9] bg-white p-6 shadow-xs hover:shadow-md hover:border-[#4CAF50]/40 transition-all text-center space-y-2">
              <div className="h-12 w-12 rounded-2xl bg-[#E8F5E9] text-[#4CAF50] flex items-center justify-center mx-auto">
                <Camera className="h-6 w-6" />
              </div>
              <h4 className="font-bold text-sm text-[#173B2A]">OpenCV</h4>
              <p className="text-[11px] text-[#647067]">Video Frame Acquisition</p>
            </div>

            {/* 3. YOLO */}
            <div className="rounded-2xl border border-[#E8F5E9] bg-white p-6 shadow-xs hover:shadow-md hover:border-[#4CAF50]/40 transition-all text-center space-y-2">
              <div className="h-12 w-12 rounded-2xl bg-[#E8F5E9] text-[#1B5E20] flex items-center justify-center mx-auto">
                <Eye className="h-6 w-6" />
              </div>
              <h4 className="font-bold text-sm text-[#173B2A]">YOLO</h4>
              <p className="text-[11px] text-[#647067]">Modular Object Detection</p>
            </div>

            {/* 4. FastAPI */}
            <div className="rounded-2xl border border-[#E8F5E9] bg-white p-6 shadow-xs hover:shadow-md hover:border-[#4CAF50]/40 transition-all text-center space-y-2">
              <div className="h-12 w-12 rounded-2xl bg-[#E8F5E9] text-[#4CAF50] flex items-center justify-center mx-auto">
                <Zap className="h-6 w-6" />
              </div>
              <h4 className="font-bold text-sm text-[#173B2A]">FastAPI</h4>
              <p className="text-[11px] text-[#647067]">High-Speed Backend API</p>
            </div>

            {/* 5. React.js */}
            <div className="rounded-2xl border border-[#E8F5E9] bg-white p-6 shadow-xs hover:shadow-md hover:border-[#4CAF50]/40 transition-all text-center space-y-2">
              <div className="h-12 w-12 rounded-2xl bg-[#E8F5E9] text-[#1B5E20] flex items-center justify-center mx-auto">
                <Code2 className="h-6 w-6" />
              </div>
              <h4 className="font-bold text-sm text-[#173B2A]">React.js</h4>
              <p className="text-[11px] text-[#647067]">Interactive Web Dashboard</p>
            </div>

            {/* 6. SQLite */}
            <div className="rounded-2xl border border-[#E8F5E9] bg-white p-6 shadow-xs hover:shadow-md hover:border-[#4CAF50]/40 transition-all text-center space-y-2">
              <div className="h-12 w-12 rounded-2xl bg-[#E8F5E9] text-[#4CAF50] flex items-center justify-center mx-auto">
                <Database className="h-6 w-6" />
              </div>
              <h4 className="font-bold text-sm text-[#173B2A]">SQLite</h4>
              <p className="text-[11px] text-[#647067]">Relational Audit Database</p>
            </div>

            {/* 7. Computer Vision */}
            <div className="rounded-2xl border border-[#E8F5E9] bg-white p-6 shadow-xs hover:shadow-md hover:border-[#4CAF50]/40 transition-all text-center space-y-2">
              <div className="h-12 w-12 rounded-2xl bg-[#E8F5E9] text-[#1B5E20] flex items-center justify-center mx-auto">
                <Activity className="h-6 w-6" />
              </div>
              <h4 className="font-bold text-sm text-[#173B2A]">Computer Vision</h4>
              <p className="text-[11px] text-[#647067]">Polygon Spatial Triaging</p>
            </div>

            {/* 8. Artificial Intelligence */}
            <div className="rounded-2xl border border-[#E8F5E9] bg-white p-6 shadow-xs hover:shadow-md hover:border-[#4CAF50]/40 transition-all text-center space-y-2">
              <div className="h-12 w-12 rounded-2xl bg-[#E8F5E9] text-[#4CAF50] flex items-center justify-center mx-auto">
                <Cpu className="h-6 w-6" />
              </div>
              <h4 className="font-bold text-sm text-[#173B2A]">Artificial Intelligence</h4>
              <p className="text-[11px] text-[#647067]">Human Pose & Action Analysis</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. CALL-TO-ACTION SECTION */}
      {/* ========================================================================= */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1B5E20] via-[#2E7D32] to-[#4CAF50] p-10 sm:p-16 shadow-2xl text-white text-center">
            {/* Background Decorative Rings */}
            <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full border border-white/20 pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full border border-white/20 pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md px-4 py-1 text-xs font-bold uppercase tracking-wider text-white">
                <Sparkles className="h-4 w-4" />
                <span>Empowering Environmental Stewards</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                Let's Build Cleaner Communities Together
              </h2>

              <p className="text-base sm:text-lg text-[#E8F5E9] leading-relaxed">
                Experience intelligent waste monitoring with EcoWatch AI.
              </p>

              <div className="pt-2 flex flex-wrap justify-center gap-4">
                <Link
                  to={isAuthenticated ? "/dashboard" : "/login"}
                  className="flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-sm font-extrabold text-[#1B5E20] shadow-lg shadow-black/10 hover:bg-[#F8F9F0] transition-all duration-200 hover:scale-105"
                >
                  <Lock className="h-4 w-4 text-[#4CAF50]" />
                  <span>Access Admin Dashboard</span>
                  <ArrowRight className="h-4 w-4 text-[#1B5E20]" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* CONTACT / INQUIRY SECTION */}
      {/* ========================================================================= */}
      <section id="contact" className="py-16 bg-[#F8F9F0] border-t border-[#E8F5E9]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center space-y-3">
            <h3 className="text-2xl font-bold text-[#173B2A]">
              Connect with the EcoWatch AI Team
            </h3>
            <p className="text-sm text-[#647067]">
              Interested in deploying automated waste detection in your municipality or academic campus?
            </p>
            <div className="pt-2 text-xs font-medium text-[#1B5E20]">
              support@ecowatch-ai.org • Environmental Systems & Civic Technology
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11. FOOTER */}
      {/* ========================================================================= */}
      <footer className="bg-white border-t border-[#E8F5E9] py-14 text-[#647067]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#E8F5E9]">
            {/* Logo & Tagline */}
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1B5E20] to-[#4CAF50] text-white shadow-md">
                <Leaf className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xl font-extrabold text-[#173B2A] block leading-tight">
                  EcoWatch<span className="text-[#4CAF50]"> AI</span>
                </span>
                <span className="text-xs font-semibold text-[#1B5E20] block">
                  Intelligent Monitoring. Cleaner Communities.
                </span>
              </div>
            </div>

            {/* Quick Navigation Links */}
            <div className="flex flex-wrap items-center gap-6 text-xs font-semibold">
              <button onClick={() => scrollToSection('hero')} className="hover:text-[#1B5E20] cursor-pointer">
                Home
              </button>
              <button onClick={() => scrollToSection('about')} className="hover:text-[#1B5E20] cursor-pointer">
                About
              </button>
              <button onClick={() => scrollToSection('features')} className="hover:text-[#1B5E20] cursor-pointer">
                Features
              </button>
              <button onClick={() => scrollToSection('how-it-works')} className="hover:text-[#1B5E20] cursor-pointer">
                How It Works
              </button>
              <button onClick={() => scrollToSection('impact')} className="hover:text-[#1B5E20] cursor-pointer">
                Impact
              </button>
              <button onClick={() => scrollToSection('technology')} className="hover:text-[#1B5E20] cursor-pointer">
                Technology
              </button>
              <Link to="/login" className="text-[#1B5E20] font-bold hover:underline">
                Admin Login
              </Link>
            </div>
          </div>

          {/* Project Description & Copyright */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#647067]">
            <p>
              &copy; {new Date().getFullYear()} EcoWatch AI – AI-Based Unauthorized Waste Disposal Detection and Monitoring System. All rights reserved.
            </p>
            <div className="flex items-center gap-3 text-[11px] font-medium text-[#1B5E20]">
              <span>FastAPI Backend</span>
              <span>•</span>
              <span>OpenCV Stream</span>
              <span>•</span>
              <span>React 19 & Tailwind</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
