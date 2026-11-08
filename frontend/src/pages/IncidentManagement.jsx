import React, { useState, useEffect } from 'react';
import {
  AlertOctagon,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  RefreshCw,
  Eye,
  FileDown,
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import SimulationAlert from '../components/SimulationAlert';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import EvidenceModal from '../components/EvidenceModal';
import { incidentService } from '../services/incidentService';
import { cameraService } from '../services/cameraService';

export default function IncidentManagement() {
  const [incidents, setIncidents] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [cameraFilter, setCameraFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== 'ALL') params.status = statusFilter;
      if (cameraFilter !== 'ALL') params.camera_id = cameraFilter;
      if (categoryFilter !== 'ALL') params.waste_category = categoryFilter;

      const [data, cams] = await Promise.all([
        incidentService.getAll(params),
        cameraService.getAll().catch(() => []),
      ]);
      setIncidents(data);
      setCameras(cams);
    } catch (err) {
      console.error('Error fetching incidents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, [statusFilter, cameraFilter, categoryFilter]);

  // Client-side search
  const filteredIncidents = incidents.filter((inc) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      inc.id.toLowerCase().includes(q) ||
      inc.location.toLowerCase().includes(q) ||
      inc.waste_category.toLowerCase().includes(q) ||
      (inc.remarks && inc.remarks.toLowerCase().includes(q))
    );
  });

  const handleQuickAction = async (e, incId, action) => {
    e.stopPropagation();
    try {
      if (action === 'VERIFIED') await incidentService.verify(incId, 'Verified via quick review');
      if (action === 'REJECTED') await incidentService.reject(incId, 'Rejected false alert via quick review');
      if (action === 'RESOLVED') await incidentService.resolve(incId, 'Resolved via quick review');
      fetchIncidents();
    } catch (err) {
      alert('Action failed: ' + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <div className="space-y-6">
      <SimulationAlert />

      {/* Header */}
      <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Incident Review & Audit Vault</h1>
          <p className="text-xs text-slate-400">
            Verify automated dumping alerts, reject false alarms, review evidence images, and manage resolution states.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search incident ID, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-950 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending Review</option>
            <option value="VERIFIED">Verified Alert</option>
            <option value="REJECTED">Rejected False Alert</option>
            <option value="RESOLVED">Resolved / Cleared</option>
          </select>
        </div>

        {/* Camera Filter */}
        <div>
          <select
            value={cameraFilter}
            onChange={(e) => setCameraFilter(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
          >
            <option value="ALL">All Camera Nodes</option>
            {cameras.map((c) => (
              <option key={c.id} value={c.id}>
                {c.id} - {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
          >
            <option value="ALL">All Waste Categories</option>
            <option value="plastic_waste">Plastic Waste</option>
            <option value="garbage_bag">Garbage Bag</option>
            <option value="cardboard_box">Cardboard Box</option>
            <option value="construction_debris">Construction Debris</option>
            <option value="organic_waste">Organic Waste</option>
          </select>
        </div>
      </div>

      {/* Incidents Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-slate-400">
            Showing <strong className="text-white">{filteredIncidents.length}</strong> recorded incidents
          </span>
        </div>

        {loading ? (
          <LoadingSpinner text="Retrieving surveillance records..." />
        ) : filteredIncidents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3 font-semibold">Incident ID</th>
                  <th className="pb-3 font-semibold">Date & Time (UTC)</th>
                  <th className="pb-3 font-semibold">Location</th>
                  <th className="pb-3 font-semibold">Waste Category</th>
                  <th className="pb-3 font-semibold">Confidence</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-center">Quick Review</th>
                  <th className="pb-3 font-semibold text-right">Evidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredIncidents.map((inc) => (
                  <tr
                    key={inc.id}
                    onClick={() => setSelectedIncident(inc)}
                    className="cursor-pointer transition hover:bg-slate-800/50"
                  >
                    <td className="py-3.5 font-mono font-semibold text-emerald-400">{inc.id}</td>
                    <td className="py-3.5 font-mono text-slate-400">
                      {inc.timestamp?.replace('T', ' ').slice(0, 19)}
                    </td>
                    <td className="py-3.5 text-slate-300">
                      <div>{inc.location}</div>
                      <span className="text-[10px] text-slate-500 font-mono">{inc.camera_id}</span>
                    </td>
                    <td className="py-3.5">
                      <span className="rounded-md bg-slate-800 px-2 py-0.5 text-amber-300 uppercase tracking-wide">
                        {inc.waste_category?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-300 font-mono">
                      {(inc.confidence * 100).toFixed(0)}%
                    </td>
                    <td className="py-3.5">
                      <StatusBadge status={inc.status} />
                    </td>
                    <td className="py-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                      {inc.status === 'PENDING' ? (
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            title="Verify incident"
                            onClick={(e) => handleQuickAction(e, inc.id, 'VERIFIED')}
                            className="rounded p-1 text-slate-400 hover:bg-emerald-500/20 hover:text-emerald-400"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            title="Reject false alert"
                            onClick={(e) => handleQuickAction(e, inc.id, 'REJECTED')}
                            className="rounded p-1 text-slate-400 hover:bg-rose-500/20 hover:text-rose-400"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </div>
                      ) : inc.status === 'VERIFIED' ? (
                        <button
                          title="Mark resolved"
                          onClick={(e) => handleQuickAction(e, inc.id, 'RESOLVED')}
                          className="inline-flex items-center gap-1 rounded bg-sky-500/10 px-2 py-0.5 text-[11px] text-sky-400 hover:bg-sky-500/20"
                        >
                          <RefreshCw className="h-3 w-3" /> Resolve
                        </button>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => setSelectedIncident(inc)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600/20 px-2.5 py-1 font-semibold text-emerald-400 transition hover:bg-emerald-600 hover:text-white"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No incidents found"
            description="No surveillance alerts match the selected status or filters."
          />
        )}
      </div>

      {/* Evidence Modal */}
      {selectedIncident && (
        <EvidenceModal
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
          onStatusUpdated={() => {
            fetchIncidents();
            setSelectedIncident(null);
          }}
        />
      )}
    </div>
  );
}

