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

const COLORS = ['#1B5E20', '#4CAF50', '#0ea5e9', '#f59e0b', '#ec4899', '#8b5cf6'];

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
          <h1 className="text-2xl font-extrabold tracking-tight text-[#173B2A]">Waste Accumulation Analytics</h1>
          <p className="text-xs text-[#647067]">
            Temporal patterns, disposal hotspots, and waste material classification statistics.
          </p>
        </div>

        {/* Time Filter */}
        <div className="flex items-center gap-1.5 rounded-2xl border border-[#E8F5E9] bg-white p-1 shadow-xs">
          {['ALL', 'MONTHLY', 'WEEKLY', 'DAILY'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                timeRange === range
                  ? 'bg-gradient-to-r from-[#1B5E20] to-[#4CAF50] text-white shadow-xs'
                  : 'text-[#647067] hover:text-[#173B2A]'
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
        <div className="rounded-3xl border border-[#E8F5E9] bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#173B2A]">Disposal Incidents Timeline</h3>
            <span className="text-[11px] font-semibold text-[#647067] bg-[#F8F9F0] px-2.5 py-1 rounded-xl border border-[#E8F5E9]">
              Trend by timeline
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8F5E9" vertical={false} />
                <XAxis dataKey="date" stroke="#647067" fontSize={11} />
                <YAxis stroke="#647067" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#C8E6C9', borderRadius: '16px', color: '#173B2A', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                  itemStyle={{ color: '#1B5E20', fontWeight: 700 }}
                />
                <Line
                  type="monotone"
                  dataKey="incidents"
                  stroke="#1B5E20"
                  strokeWidth={3}
                  dot={{ fill: '#4CAF50', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Waste Category Breakdown */}
        <div className="rounded-3xl border border-[#E8F5E9] bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#173B2A]">Material Category Distribution</h3>
            <span className="text-[11px] font-semibold text-[#647067] bg-[#F8F9F0] px-2.5 py-1 rounded-xl border border-[#E8F5E9]">
              Classified debris types
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8F5E9" horizontal={false} />
                <XAxis type="number" stroke="#647067" fontSize={11} allowDecimals={false} />
                <YAxis dataKey="name" type="category" stroke="#647067" fontSize={10} width={110} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#C8E6C9', borderRadius: '16px', color: '#173B2A', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                />
                <Bar dataKey="count" fill="#1B5E20" radius={[0, 8, 8, 0]}>
                  {categoryChartData.map((_, index) => (
                    <Cell key={`cat-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Location Hotspots Bar Chart */}
        <div className="rounded-3xl border border-[#E8F5E9] bg-white p-6 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#173B2A]">Location Hotspot Analysis</h3>
            <span className="text-[11px] font-semibold text-[#647067] bg-[#F8F9F0] px-2.5 py-1 rounded-xl border border-[#E8F5E9]">
              Perimeter vulnerability rankings
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={locationChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8F5E9" vertical={false} />
                <XAxis dataKey="location" stroke="#647067" fontSize={11} />
                <YAxis stroke="#647067" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#C8E6C9', borderRadius: '16px', color: '#173B2A', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                  itemStyle={{ color: '#1B5E20', fontWeight: 700 }}
                />
                <Bar dataKey="incidents" fill="#1B5E20" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
