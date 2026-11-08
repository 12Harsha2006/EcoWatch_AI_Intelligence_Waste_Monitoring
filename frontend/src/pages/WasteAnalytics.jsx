import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import { BarChart3, Tag, MapPin } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import MetricCard from '../components/MetricCard';
import { incidentService } from '../services/incidentService';

const COLORS = ['#10b981', '#14b8a6', '#0ea5e9', '#f59e0b', '#ec4899', '#8b5cf6'];

export default function WasteAnalytics() {
  const [incidents, setIncidents] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('ALL');

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        const [incs, m] = await Promise.all([
          incidentService.getAll(),
          incidentService.getMetrics().catch(() => null),
        ]);
        setIncidents(incs);
        setMetrics(m);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Computing waste accumulation trends..." />;
  }

  // 1. Waste Category Distribution
  const categoryCounts = {};
  incidents.forEach((inc) => {
    const cat = inc.waste_category || 'general_waste';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });
  const categoryChartData = Object.entries(categoryCounts).map(([cat, count]) => ({
    name: cat.replace('_', ' ').toUpperCase(),
    count,
  }));

  // 2. Location Distribution
  const locationCounts = {};
  incidents.forEach((inc) => {
    const loc = inc.location || 'Unknown';
    locationCounts[loc] = (locationCounts[loc] || 0) + 1;
  });
  const locationChartData = Object.entries(locationCounts).map(([loc, count]) => ({
    location: loc.length > 18 ? loc.slice(0, 16) + '...' : loc,
    incidents: count,
  }));

  // 3. Trend by Date
  const dateCounts = {};
  incidents.forEach((inc) => {
    const d = inc.timestamp?.slice(0, 10) || '2026-11-08';
    dateCounts[d] = (dateCounts[d] || 0) + 1;
  });
  const trendData = Object.entries(dateCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, incidents]) => ({
      date: date.slice(5),
      incidents,
    }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Waste Accumulation Analytics</h1>
          <p className="text-xs text-[#94A3B8]">
            Temporal patterns, disposal hotspots, and waste material classification statistics.
          </p>
        </div>

        {/* Time Filter */}
        <div className="flex items-center gap-2 rounded-2xl border border-[#1E2D42] bg-[#111C2E] p-1 shadow-sm">
          {['ALL', 'MONTHLY', 'WEEKLY', 'DAILY'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                timeRange === range ? 'bg-emerald-600 text-white shadow-sm' : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Monitored Dumping Events"
          value={incidents.length}
          icon={BarChart3}
          delta="Accumulated observations"
          color="emerald"
        />
        <MetricCard
          title="Dominant Category"
          value={
            categoryChartData.length > 0
              ? categoryChartData.reduce((p, c) => (p.count > c.count ? p : c)).name
              : 'N/A'
          }
          icon={Tag}
          delta="Highest frequency material"
          color="amber"
        />
        <MetricCard
          title="Active Hotspot Perimeters"
          value={Object.keys(locationCounts).length}
          icon={MapPin}
          delta="Surveillance locations affected"
          color="sky"
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Accumulation Timeline */}
        <div className="rounded-2xl border border-[#1E2D42] bg-[#111C2E] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white">Disposal Incidents Timeline</h3>
            <span className="text-[11px] font-medium text-slate-400">Trend by timeline</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2D42" vertical={false} />
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B1220', borderColor: '#1E2D42', borderRadius: '12px', color: '#F8FAFC' }}
                  itemStyle={{ color: '#10B981', fontWeight: 600 }}
                />
                <Line
                  type="monotone"
                  dataKey="incidents"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  dot={{ fill: '#10B981', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Waste Category Breakdown */}
        <div className="rounded-2xl border border-[#1E2D42] bg-[#111C2E] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white">Material Category Distribution</h3>
            <span className="text-[11px] font-medium text-slate-400">Classified debris types</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2D42" horizontal={false} />
                <XAxis type="number" stroke="#94A3B8" fontSize={11} allowDecimals={false} />
                <YAxis dataKey="name" type="category" stroke="#94A3B8" fontSize={10} width={110} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B1220', borderColor: '#1E2D42', borderRadius: '12px', color: '#F8FAFC' }}
                />
                <Bar dataKey="count" fill="#14B8A6" radius={[0, 6, 6, 0]}>
                  {categoryChartData.map((_, index) => (
                    <Cell key={`cat-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Location Hotspots Bar Chart */}
        <div className="rounded-2xl border border-[#1E2D42] bg-[#111C2E] p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white">Location Hotspot Analysis</h3>
            <span className="text-[11px] font-medium text-slate-400">Perimeter vulnerability rankings</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={locationChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2D42" vertical={false} />
                <XAxis dataKey="location" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B1220', borderColor: '#1E2D42', borderRadius: '12px', color: '#F8FAFC' }}
                  itemStyle={{ color: '#10B981', fontWeight: 600 }}
                />
                <Bar dataKey="incidents" fill="#10B981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
