import React, { useState } from 'react';
import { X, CheckCircle, XCircle, RefreshCw, Download, FileText, Image, Video } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { incidentService } from '../services/incidentService';

export default function EvidenceModal({ incident, onClose, onStatusUpdated }) {
  const [activeTab, setActiveTab] = useState('image');
  const [remarks, setRemarks] = useState(incident?.remarks || '');
  const [reviewer, setReviewer] = useState('Senior Admin');
  const [isUpdating, setIsUpdating] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  if (!incident) return null;

  const imageUrl = incidentService.getImageUrl(incident.evidence_folder);
  const videoUrl = incidentService.getVideoUrl(incident.evidence_folder);

  const handleAction = async (actionType) => {
    setIsUpdating(true);
    setActionMessage(null);
    try {
      let updated;
      if (actionType === 'VERIFIED') {
        updated = await incidentService.verify(incident.id, remarks, reviewer);
      } else if (actionType === 'REJECTED') {
        updated = await incidentService.reject(incident.id, remarks, reviewer);
      } else if (actionType === 'RESOLVED') {
        updated = await incidentService.resolve(incident.id, remarks, reviewer);
      }
      setActionMessage({ type: 'success', text: `Incident successfully marked as ${actionType}` });
      if (onStatusUpdated) onStatusUpdated(updated);
    } catch (err) {
      setActionMessage({ type: 'error', text: err.response?.data?.detail || 'Action failed.' });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/80">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-white tracking-tight">
              Incident Evidence: <span className="font-mono text-emerald-400">{incident.id}</span>
            </h2>
            <StatusBadge status={incident.status} />
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="grid grid-cols-1 overflow-y-auto lg:grid-cols-5 gap-6 p-6">
          
          {/* Media Viewer Area */}
          <div className="lg:col-span-3 flex flex-col">
            {/* Tabs */}
            <div className="mb-3 flex items-center gap-2 border-b border-slate-800 pb-2">
              <button
                onClick={() => setActiveTab('image')}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  activeTab === 'image'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Image className="h-4 w-4" /> Snapshot Image
              </button>
              <button
                onClick={() => setActiveTab('video')}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  activeTab === 'video'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Video className="h-4 w-4" /> Video Recording
              </button>
              <button
                onClick={() => setActiveTab('metadata')}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  activeTab === 'metadata'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <FileText className="h-4 w-4" /> Audit JSON
              </button>
            </div>

            {/* Tab Panes */}
            <div className="relative flex flex-1 items-center justify-center rounded-xl border border-slate-800 bg-slate-950/80 p-2 min-h-[300px]">
              {activeTab === 'image' && (
                <div className="flex flex-col items-center">
                  <img
                    src={imageUrl}
                    alt={`Evidence ${incident.id}`}
                    className="max-h-[360px] w-auto rounded-lg object-contain shadow-md"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/640x480/0f172a/94a3b8?text=Snapshot+Preview+Archived';
                    }}
                  />
                  <a
                    href={imageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:underline"
                  >
                    <Download className="h-3.5 w-3.5" /> Download Snapshot (Full Resolution)
                  </a>
                </div>
              )}

              {activeTab === 'video' && (
                <div className="flex flex-col items-center w-full">
                  <video
                    src={videoUrl}
                    controls
                    className="max-h-[360px] w-full rounded-lg bg-black"
                  >
                    Your browser does not support video playback.
                  </video>
                  <a
                    href={videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:underline"
                  >
                    <Download className="h-3.5 w-3.5" /> Download MP4 Recording
                  </a>
                </div>
              )}

              {activeTab === 'metadata' && (
                <pre className="max-h-[360px] w-full overflow-auto rounded-lg bg-slate-900/80 p-4 font-mono text-xs text-slate-300">
                  {JSON.stringify(incident, null, 2)}
                </pre>
              )}
            </div>
          </div>

          {/* Details & Review Actions */}
          <div className="lg:col-span-2 flex flex-col justify-between space-y-4">
            <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Incident Details</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500">Camera Source:</span>
                  <p className="font-semibold text-slate-200">{incident.camera_id}</p>
                </div>
                <div>
                  <span className="text-slate-500">Confidence:</span>
                  <p className="font-semibold text-emerald-400">{(incident.confidence * 100).toFixed(0)}%</p>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500">Location:</span>
                  <p className="font-semibold text-slate-200">{incident.location}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500">Waste Classification:</span>
                  <p className="font-semibold text-amber-400 uppercase tracking-wide">
                    {incident.waste_category?.replace('_', ' ')}
                  </p>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500">Captured At (UTC):</span>
                  <p className="font-mono text-slate-300">{incident.timestamp?.replace('T', ' ').slice(0, 19)}</p>
                </div>
              </div>
            </div>

            {/* Review Form */}
            <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Administrative Review</h4>
              
              <div>
                <label className="text-[11px] font-medium text-slate-400">Reviewer Identification</label>
                <input
                  type="text"
                  value={reviewer}
                  onChange={(e) => setReviewer(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-400">Remarks / Action Log</label>
                <textarea
                  rows={2}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Enter verification notes or resolution details..."
                  className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {actionMessage && (
                <div
                  className={`rounded-lg p-2 text-xs font-medium ${
                    actionMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                  }`}
                >
                  {actionMessage.text}
                </div>
              )}

              <div className="grid grid-cols-3 gap-2 pt-1">
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => handleAction('VERIFIED')}
                  className="flex items-center justify-center gap-1 rounded-lg bg-emerald-600 px-2 py-2 text-xs font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50"
                >
                  <CheckCircle className="h-3.5 w-3.5" /> Verify
                </button>
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => handleAction('REJECTED')}
                  className="flex items-center justify-center gap-1 rounded-lg bg-rose-600/80 px-2 py-2 text-xs font-semibold text-white transition hover:bg-rose-500 disabled:opacity-50"
                >
                  <XCircle className="h-3.5 w-3.5" /> Reject
                </button>
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => handleAction('RESOLVED')}
                  className="flex items-center justify-center gap-1 rounded-lg bg-sky-600 px-2 py-2 text-xs font-semibold text-white transition hover:bg-sky-500 disabled:opacity-50"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Resolve
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
