import React, { useState, useEffect } from 'react';
import { FileSpreadsheet, Download, Filter, Calendar, MapPin, CheckCircle } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import SimulationAlert from '../components/SimulationAlert';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { incidentService } from '../services/incidentService';
import { cameraService } from '../services/cameraService';

export default function Reports() {
  const [incidents, setIncidents] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [cameraFilter, setCameraFilter] = useState('ALL');
  const [wasteFilter, setWasteFilter] = useState('ALL');

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== 'ALL') params.status = statusFilter;
      if (cameraFilter !== 'ALL') params.camera_id = cameraFilter;
      if (wasteFilter !== 'ALL') params.waste_category = wasteFilter;

      const [data, cams] = await Promise.all([
        incidentService.getAll(params),
        cameraService.getAll().catch(() => []),
      ]);
      setIncidents(data);
      setCameras(cams);
    } catch (err) {
      console.error('Error fetching report data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [statusFilter, cameraFilter, wasteFilter]);

  const handleExportCsv = async () => {
    setExporting(true);
    try {
      const params = {};
      if (statusFilter !== 'ALL') params.status = statusFilter;
      if (cameraFilter !== 'ALL') params.camera_id = cameraFilter;
      if (wasteFilter !== 'ALL') params.waste_category = wasteFilter;

      const blob = await incidentService.exportCsv(params);
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'text/csv' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `waste_surveillance_report_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      alert('CSV export failed: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <SimulationAlert />

      {/* Header */}
      <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Compliance & Audit Reports</h1>
          <p className="text-xs text-slate-400">
            Generate formal incident summaries, filter by operational sector, and export CSV compliance audits.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          disabled={exporting || incidents.length === 0}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-emerald-950/40 transition hover:bg-emerald-500 disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          <span>{exporting ? 'Generating CSV...' : 'Export Report (CSV)'}</span>
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md">
        <div>
          <label className="text-[11px] font-semibold text-slate-400">Verification Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="VERIFIED">Verified Alert</option>
            <option value="REJECTED">Rejected False Alert</option>
            <option value="RESOLVED">Resolved / Cleared</option>
          </select>
        </div>

        <div>
          <label className="text-[11px] font-semibold text-slate-400">Camera Surveillance Node</label>
          <select
            value={cameraFilter}
            onChange={(e) => setCameraFilter(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
          >
            <option value="ALL">All Camera Nodes</option>
            {cameras.map((c) => (
              <option key={c.id} value={c.id}>
                {c.id} - {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[11px] font-semibold text-slate-400">Waste Material Category</label>
          <select
            value={wasteFilter}
            onChange={(e) => setWasteFilter(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
          >
            <option value="ALL">All Material Types</option>
            <option value="plastic_waste">Plastic Waste</option>
            <option value="garbage_bag">Garbage Bag</option>
            <option value="cardboard_box">Cardboard Box</option>
            <option value="construction_debris">Construction Debris</option>
            <option value="organic_waste">Organic Waste</option>
          </select>
        </div>
      </div>

      {/* Report Data Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-slate-400">
            Audit Ledger: <strong className="text-white">{incidents.length}</strong> matching records
          </span>
        </div>

        {loading ? (
          <LoadingSpinner text="Generating compliance report data..." />
        ) : incidents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                  <th className="pb-3">Incident ID</th>
                  <th className="pb-3">Timestamp (UTC)</th>
                  <th className="pb-3">Camera Node</th>
                  <th className="pb-3">Location</th>
                  <th className="pb-3">Material Category</th>
                  <th className="pb-3">Confidence</th>
                  <th className="pb-3">Audit Status</th>
                  <th className="pb-3">Remarks / Action Log</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {incidents.map((inc) => (
                  <tr key={inc.id} className="transition hover:bg-slate-800/40">
                    <td className="py-3 font-mono font-bold text-emerald-400">{inc.id}</td>
                    <td className="py-3 font-mono text-slate-400">
                      {inc.timestamp?.replace('T', ' ').slice(0, 19)}
                    </td>
                    <td className="py-3 font-mono text-slate-300">{inc.camera_id}</td>
                    <td className="py-3 text-slate-300">{inc.location}</td>
                    <td className="py-3 capitalize text-amber-300">
                      {inc.waste_category?.replace('_', ' ')}
                    </td>
                    <td className="py-3 font-mono text-slate-300">
                      {(inc.confidence * 100).toFixed(0)}%
                    </td>
                    <td className="py-3">
                      <StatusBadge status={inc.status} />
                    </td>
                    <td className="py-3 text-slate-400 italic max-w-xs truncate">
                      {inc.remarks || 'No remarks recorded.'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No records to report"
            description="Adjust your status or location filters to view matching surveillance logs."
            icon={FileSpreadsheet}
          />
        )}
      </div>
    </div>
  );
}
