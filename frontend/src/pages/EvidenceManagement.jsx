import React, { useState, useEffect } from 'react';
import { FolderLock, Image, Video, Download, ExternalLink, Calendar, MapPin, Camera } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import SimulationAlert from '../components/SimulationAlert';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import EvidenceModal from '../components/EvidenceModal';
import { incidentService } from '../services/incidentService';

export default function EvidenceManagement() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [viewType, setViewType] = useState('ALL'); // ALL, IMAGE, VIDEO

  const fetchEvidence = async () => {
    try {
      setLoading(true);
      const data = await incidentService.getAll();
      setIncidents(data);
    } catch (err) {
      console.error('Error fetching evidence archives:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvidence();
  }, []);

  return (
    <div className="space-y-6">
      <SimulationAlert />

      {/* Header */}
      <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Surveillance Evidence Vault</h1>
          <p className="text-xs text-slate-400">
            Isolated cryptographic archive of captured snapshot frames, video clips, and metadata logs.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 p-1">
          <button
            onClick={() => setViewType('ALL')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              viewType === 'ALL' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Archives
          </button>
          <button
            onClick={() => setViewType('IMAGE')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              viewType === 'IMAGE' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Photos Only
          </button>
          <button
            onClick={() => setViewType('VIDEO')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              viewType === 'VIDEO' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Recordings Only
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Retrieving evidence archives..." />
      ) : incidents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {incidents.map((inc) => {
            const imgUrl = incidentService.getImageUrl(inc.evidence_folder);
            return (
              <div
                key={inc.id}
                onClick={() => setSelectedIncident(inc)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-950/20"
              >
                {/* Image Snapshot Area */}
                <div className="relative aspect-video w-full overflow-hidden bg-black/60">
                  <img
                    src={imgUrl}
                    alt={`Evidence ${inc.id}`}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/640x360/0f172a/94a3b8?text=Evidence+Snapshot';
                    }}
                  />
                  <div className="absolute top-3 left-3">
                    <StatusBadge status={inc.status} />
                  </div>
                  <div className="absolute top-3 right-3 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-mono text-emerald-400 backdrop-blur-md">
                    {(inc.confidence * 100).toFixed(0)}% Match
                  </div>
                </div>

                {/* Metadata details */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-mono text-sm font-bold text-white group-hover:text-emerald-400 transition">
                      {inc.id}
                    </h3>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
                      {inc.waste_category?.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{inc.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Camera className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                      <span className="font-mono">{inc.camera_id}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-mono text-[11px]">
                      <Calendar className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                      <span>{inc.timestamp?.replace('T', ' ').slice(0, 19)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-800/80 pt-3">
                    <span className="text-[11px] text-slate-500 font-mono">
                      Dir: {inc.evidence_folder?.split('\\').pop() || inc.id}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 group-hover:underline">
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>Open Vault</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="Evidence vault empty"
          description="No incidents have been captured yet. Active cameras will record evidence files when violations are detected."
          icon={FolderLock}
        />
      )}

      {/* Modal */}
      {selectedIncident && (
        <EvidenceModal
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
          onStatusUpdated={() => {
            fetchEvidence();
            setSelectedIncident(null);
          }}
        />
      )}
    </div>
  );
}

