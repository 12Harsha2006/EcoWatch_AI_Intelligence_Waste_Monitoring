import React, { useState, useEffect } from 'react';
import {
  AlertOctagon,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  RefreshCw,
  Eye,
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
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
      {/* Header */}
      <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#173B2A]">Incident Review & Audit</h1>
          <p className="text-xs text-[#647067]">
            Verify automated dumping alerts, reject false alarms, review evidence images, and manage resolution states.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-3xl border border-[#E8F5E9] bg-white p-5 shadow-xs">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#647067]" />
          <input
            type="text"
            placeholder="Search incident ID, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-[#C8E6C9] bg-[#F8F9F0] pl-10 pr-3 py-2 text-xs text-[#173B2A] placeholder-[#647067] focus:bg-white focus:border-[#4CAF50] focus:outline-none"
          />
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-2xl border border-[#C8E6C9] bg-[#F8F9F0] px-3.5 py-2 text-xs text-[#173B2A] focus:bg-white focus:border-[#4CAF50] focus:outline-none font-bold cursor-pointer"
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
            className="w-full rounded-2xl border border-[#C8E6C9] bg-[#F8F9F0] px-3.5 py-2 text-xs text-[#173B2A] focus:bg-white focus:border-[#4CAF50] focus:outline-none font-bold cursor-pointer"
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
            className="w-full rounded-2xl border border-[#C8E6C9] bg-[#F8F9F0] px-3.5 py-2 text-xs text-[#173B2A] focus:bg-white focus:border-[#4CAF50] focus:outline-none font-bold cursor-pointer"
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
      <div className="rounded-3xl border border-[#E8F5E9] bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-[#647067]">
            Showing <strong className="text-[#173B2A] font-bold">{filteredIncidents.length}</strong> recorded incidents
          </span>
        </div>

        {loading ? (
          <LoadingSpinner text="Retrieving surveillance records..." />
        ) : filteredIncidents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E8F5E9] text-[#647067] bg-[#F8F9F0]">
                  <th className="py-3 px-3 font-bold rounded-l-xl">Incident ID</th>
                  <th className="py-3 px-3 font-bold">Date & Time (UTC)</th>
                  <th className="py-3 px-3 font-bold">Location</th>
                  <th className="py-3 px-3 font-bold">Waste Category</th>
                  <th className="py-3 px-3 font-bold">Confidence</th>
                  <th className="py-3 px-3 font-bold">Status</th>
                  <th className="py-3 px-3 font-bold text-center">Quick Review</th>
                  <th className="py-3 px-3 font-bold text-right rounded-r-xl">Evidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8F5E9]">
                {filteredIncidents.map((inc) => (
                  <tr
                    key={inc.id}
                    onClick={() => setSelectedIncident(inc)}
                    className="cursor-pointer transition hover:bg-[#F8F9F0]"
                  >
                    <td className="py-3.5 px-3 font-mono font-bold text-[#1B5E20]">{inc.id}</td>
                    <td className="py-3.5 px-3 font-mono text-[#647067]">
                      {inc.timestamp?.replace('T', ' ').slice(0, 19)}
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-[#173B2A]">{inc.location}</div>
                      <span className="text-[10px] text-[#647067] font-mono">{inc.camera_id}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="rounded-lg bg-amber-50 border border-amber-200 px-2 py-0.5 text-amber-800 font-bold uppercase tracking-wide">
                        {inc.waste_category?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-[#1B5E20] font-mono font-bold">
                      {(inc.confidence * 100).toFixed(0)}%
                    </td>
                    <td className="py-3.5 px-3">
                      <StatusBadge status={inc.status} />
                    </td>
                    <td className="py-3.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                      {inc.status === 'PENDING' ? (
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            title="Verify incident"
                            onClick={(e) => handleQuickAction(e, inc.id, 'VERIFIED')}
                            className="rounded-lg p-1.5 text-[#1B5E20] hover:bg-[#E8F5E9] transition cursor-pointer"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            title="Reject false alert"
                            onClick={(e) => handleQuickAction(e, inc.id, 'REJECTED')}
                            className="rounded-lg p-1.5 text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </div>
                      ) : inc.status === 'VERIFIED' ? (
                        <button
                          title="Mark resolved"
                          onClick={(e) => handleQuickAction(e, inc.id, 'RESOLVED')}
                          className="inline-flex items-center gap-1 rounded-xl bg-teal-50 border border-teal-200 px-2.5 py-1 text-[11px] font-bold text-teal-800 hover:bg-teal-100 cursor-pointer"
                        >
                          <RefreshCw className="h-3 w-3" /> Resolve
                        </button>
                      ) : (
                        <span className="text-[#647067]">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => setSelectedIncident(inc)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-[#C8E6C9] bg-[#E8F5E9] px-3 py-1.5 font-bold text-[#1B5E20] transition hover:bg-[#1B5E20] hover:text-white cursor-pointer shadow-xs"
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
