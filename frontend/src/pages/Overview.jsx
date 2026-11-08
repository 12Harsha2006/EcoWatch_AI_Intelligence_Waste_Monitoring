import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  CheckCheck,
  Camera,
  ExternalLink,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts';
import MetricCard from '../components/MetricCard';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import EvidenceModal from '../components/EvidenceModal';
import { incidentService } from '../services/incidentService';
import { cameraService } from '../services/cameraService';

const PIE_COLORS = ['#f59e0b', '#1B5E20', '#e11d48', '#0d9488'];

export default function Overview() {
  const [metrics, setMetrics] = useState(null);
  const [recentIncidents, setRecentIncidents] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [m, incs, cams] = await Promise.all([
        incidentService.getMetrics().catch(() => null),
        incidentService.getAll().catch(() => []),
        cameraService.getAll().catch(() => []),
      ]);
      setMetrics(m);
      setRecentIncidents(incs || []);
      setCameras(cams || []);
    } catch (err) {
      console.error('Error loading dashboard overview:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Connecting to surveillance node..." />;
  }

  // Chart data calculations
  const total = metrics?.total_incidents || recentIncidents.length || 0;
  const pending = metrics?.pending_incidents || recentIncidents.filter((i) => i.status === 'PENDING').length || 0;
  const verified = metrics?.verified_incidents || recentIncidents.filter((i) => i.status === 'VERIFIED').length || 0;
  const rejected = metrics?.rejected_incidents || recentIncidents.filter((i) => i.status === 'REJECTED').length || 0;
  const resolved = metrics?.resolved_incidents || recentIncidents.filter((i) => i.status === 'RESOLVED').length || 0;
  const activeCameras = metrics?.active_cameras || cameras.filter((c) => c.status === 'ACTIVE' && c.is_enabled).length || 0;

  // Status distribution for donut chart
  const statusChartData = [
    { name: 'Pending Review', value: pending },
    { name: 'Verified Alert', value: verified },
    { name: 'Rejected False', value: rejected },
    { name: 'Resolved / Cleaned', value: resolved },
  ];

  // Location data
  const locationCounts = {};
  recentIncidents.forEach((i) => {
    const loc = i.location || 'Unknown Location';
    locationCounts[loc] = (locationCounts[loc] || 0) + 1;
  });
  const locationChartData = Object.entries(locationCounts).map(([name, count]) => ({
    name: name.length > 20 ? name.slice(0, 18) + '...' : name,
    count,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#173B2A]">
            Surveillance Overview
          </h1>
          <p className="text-xs text-[#647067]">
            Real-time monitoring metrics, detection statistics, and unauthorized disposal alerts across municipal perimeters.
          </p>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
        <MetricCard
          title="Total Alerts"
          value={total}
          icon={AlertTriangle}
          delta="System Lifetime"
          color="amber"
        />
        <MetricCard
          title="Pending Review"
          value={pending}
          icon={Clock}
          delta={pending > 0 ? `${pending} action required` : 'Review queue clear'}
          deltaType={pending > 0 ? 'warning' : 'normal'}
          color="amber"
        />
        <MetricCard
          title="Verified Dumps"
          value={verified}
          icon={CheckCircle}
          delta="Confirmed violations"
          deltaType="success"
          color="emerald"
        />
        <MetricCard
          title="Rejected Alerts"
          value={rejected}
          icon={XCircle}
          delta="False alarms"
          color="rose"
        />
        <MetricCard
          title="Resolved"
          value={resolved}
          icon={CheckCheck}
          delta="Cleared by sanitation"
          color="sky"
        />
        <MetricCard
          title="Active Cameras"
          value={activeCameras}
          icon={Camera}
          delta={`${cameras.length} nodes registered`}
          color="purple"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Location Hotspots */}
        <div className="rounded-3xl border border-[#E8F5E9] bg-white p-6 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold tracking-wide text-[#173B2A]">
              Incidents by Location Hotspot
            </h3>
            <span className="text-[11px] font-semibold text-[#647067] bg-[#F8F9F0] px-2.5 py-1 rounded-xl border border-[#E8F5E9]">
              Surveillance zones
            </span>
          </div>
          <div className="h-64 w-full">
            {locationChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={locationChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8F5E9" vertical={false} />
                  <XAxis dataKey="name" stroke="#647067" fontSize={11} angle={-15} textAnchor="end" />
                  <YAxis stroke="#647067" fontSize={11} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#C8E6C9', borderRadius: '16px', color: '#173B2A', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                    itemStyle={{ color: '#1B5E20', fontWeight: 700 }}
                  />
                  <Bar dataKey="count" fill="#1B5E20" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-[#647067]">
                No location records logged yet.
              </div>
            )}
          </div>
        </div>

        {/* Verification Status Breakdown */}
        <div className="rounded-3xl border border-[#E8F5E9] bg-white p-6 shadow-xs">
          <h3 className="text-sm font-bold tracking-wide text-[#173B2A] mb-4">
            Incident Status Distribution
          </h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#C8E6C9', borderRadius: '16px', color: '#173B2A', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs pt-2">
            {statusChartData.map((item, i) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                <span className="text-[#647067] truncate">{item.name}:</span>
                <span className="font-bold text-[#173B2A]">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Incidents Table */}
      <div className="rounded-3xl border border-[#E8F5E9] bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold tracking-wide text-[#173B2A]">Recent Surveillance Alerts</h3>
            <p className="text-[11px] text-[#647067]">Latest flagged events across monitored perimeters</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E8F5E9] text-[#647067] bg-[#F8F9F0]">
                <th className="py-3 px-3 font-bold rounded-l-xl">Incident ID</th>
                <th className="py-3 px-3 font-bold">Timestamp (UTC)</th>
                <th className="py-3 px-3 font-bold">Camera Source</th>
                <th className="py-3 px-3 font-bold">Location</th>
                <th className="py-3 px-3 font-bold">Waste Category</th>
                <th className="py-3 px-3 font-bold">Confidence</th>
                <th className="py-3 px-3 font-bold">Status</th>
                <th className="py-3 px-3 font-bold text-right rounded-r-xl">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8F5E9]">
              {recentIncidents.slice(0, 8).map((inc) => (
                <tr key={inc.id} className="transition hover:bg-[#F8F9F0]">
                  <td className="py-3.5 px-3 font-mono font-bold text-[#1B5E20]">{inc.id}</td>
                  <td className="py-3.5 px-3 font-mono text-[#647067]">{inc.timestamp?.replace('T', ' ').slice(0, 19)}</td>
                  <td className="py-3.5 px-3 text-[#173B2A] font-semibold">{inc.camera_id}</td>
                  <td className="py-3.5 px-3 text-[#173B2A]">{inc.location}</td>
                  <td className="py-3.5 px-3 capitalize font-bold text-amber-700">{inc.waste_category?.replace('_', ' ')}</td>
                  <td className="py-3.5 px-3 text-[#1B5E20] font-mono font-bold">{(inc.confidence * 100).toFixed(0)}%</td>
                  <td className="py-3.5 px-3"><StatusBadge status={inc.status} /></td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => setSelectedIncident(inc)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-[#C8E6C9] bg-[#E8F5E9] px-3 py-1.5 text-[#1B5E20] font-bold transition hover:bg-[#1B5E20] hover:text-white cursor-pointer shadow-xs"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>Review</span>
                    </button>
                  </td>
                </tr>
              ))}
              {recentIncidents.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#647067]">
                    No surveillance incidents logged yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Evidence Modal */}
      {selectedIncident && (
        <EvidenceModal
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
          onStatusUpdated={() => {
            fetchData();
            setSelectedIncident(null);
          }}
        />
      )}
    </div>
  );
}
