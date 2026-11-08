import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  CheckCheck,
  Camera,
  ExternalLink,
  TrendingUp,
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
} from 'recharts';
import MetricCard from '../components/MetricCard';
import StatusBadge from '../components/StatusBadge';
import SimulationAlert from '../components/SimulationAlert';
import LoadingSpinner from '../components/LoadingSpinner';
import EvidenceModal from '../components/EvidenceModal';
import { incidentService } from '../services/incidentService';
import { cameraService } from '../services/cameraService';

const PIE_COLORS = ['#f59e0b', '#10b981', '#f43f5e', '#0284c7'];

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
      {/* Simulation Advisory Banner */}
      <SimulationAlert />

      {/* Header */}
      <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Surveillance Command Center</h1>
          <p className="text-xs text-slate-400">
            Real-time monitoring metrics, detection statistics, and unauthorized disposal alerts.
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
          delta="False positives"
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
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold tracking-wide text-white">
              Incidents by Location Hotspot
            </h3>
            <span className="text-[11px] text-slate-400">Real-time surveillance zones</span>
          </div>
          <div className="h-64 w-full">
            {locationChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={locationChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} angle={-15} textAnchor="end" />
                  <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                    itemStyle={{ color: '#10b981' }}
                  />
                  <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-slate-500">
                No location records logged yet.
              </div>
            )}
          </div>
        </div>

        {/* Verification Status Breakdown */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
          <h3 className="text-sm font-semibold tracking-wide text-white mb-4">
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
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs pt-2">
            {statusChartData.map((item, i) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                <span className="text-slate-400 truncate">{item.name}:</span>
                <span className="font-semibold text-slate-200">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Incidents Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-white">Recent Surveillance Alerts</h3>
            <p className="text-[11px] text-slate-400">Latest flagged events across monitored perimeters</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-semibold">Incident ID</th>
                <th className="pb-3 font-semibold">Timestamp (UTC)</th>
                <th className="pb-3 font-semibold">Camera Source</th>
                <th className="pb-3 font-semibold">Location</th>
                <th className="pb-3 font-semibold">Waste Category</th>
                <th className="pb-3 font-semibold">Confidence</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recentIncidents.slice(0, 8).map((inc) => (
                <tr key={inc.id} className="transition hover:bg-slate-800/40">
                  <td className="py-3 font-mono font-semibold text-emerald-400">{inc.id}</td>
                  <td className="py-3 font-mono text-slate-400">{inc.timestamp?.replace('T', ' ').slice(0, 19)}</td>
                  <td className="py-3 text-slate-300">{inc.camera_id}</td>
                  <td className="py-3 text-slate-300">{inc.location}</td>
                  <td className="py-3 capitalize text-amber-300">{inc.waste_category?.replace('_', ' ')}</td>
                  <td className="py-3 text-slate-300">{(inc.confidence * 100).toFixed(0)}%</td>
                  <td className="py-3"><StatusBadge status={inc.status} /></td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => setSelectedIncident(inc)}
                      className="inline-flex items-center gap-1 rounded-lg bg-slate-800 px-2.5 py-1 text-slate-300 transition hover:bg-emerald-600 hover:text-white"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>Review</span>
                    </button>
                  </td>
                </tr>
              ))}
              {recentIncidents.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-slate-500">
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
