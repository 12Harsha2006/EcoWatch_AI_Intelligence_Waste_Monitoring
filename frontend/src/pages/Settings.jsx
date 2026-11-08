import React, { useState, useEffect } from 'react';
import {
  Sliders,
  ShieldAlert,
  Bell,
  Cpu,
  Layers,
  Save,
  Plus,
  Trash2,
  CheckCircle,
} from 'lucide-react';
import SimulationAlert from '../components/SimulationAlert';
import LoadingSpinner from '../components/LoadingSpinner';
import { cameraService } from '../services/cameraService';
import { zoneService } from '../services/zoneService';

export default function Settings() {
  const [cameras, setCameras] = useState([]);
  const [zones, setZones] = useState([]);
  const [selectedCamId, setSelectedCamId] = useState('');
  const [loading, setLoading] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // New Zone State
  const [showAddZone, setShowAddZone] = useState(false);
  const [zoneId, setZoneId] = useState('');
  const [zoneName, setZoneName] = useState('Critical Entryway Perimeter');
  const [zoneDesc, setZoneDesc] = useState('No waste disposal permitted.');
  const [zoneCoords, setZoneCoords] = useState('[[150, 180], [480, 180], [480, 420], [150, 420]]');

  // Preferences State
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.5);
  const [cooldownSeconds, setCooldownSeconds] = useState(12);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [audioAlerts, setAudioAlerts] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [cams, zList] = await Promise.all([
        cameraService.getAll(),
        zoneService.getAll(),
      ]);
      setCameras(cams);
      setZones(zList);
      if (cams.length > 0 && !selectedCamId) {
        setSelectedCamId(cams[0].id);
      }
    } catch (err) {
      console.error('Failed to load settings data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateZone = async (e) => {
    e.preventDefault();
    if (!selectedCamId) {
      alert('Select a camera first.');
      return;
    }
    try {
      const generatedId = zoneId.trim() || `ZONE_${selectedCamId}_${Date.now().toString().slice(-4)}`;
      await zoneService.create({
        id: generatedId,
        camera_id: selectedCamId,
        name: zoneName,
        description: zoneDesc,
        polygon_coords: zoneCoords,
        is_active: true,
      });
      setShowAddZone(false);
      setZoneId('');
      fetchData();
    } catch (err) {
      alert('Failed to create zone: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleDeleteZone = async (id) => {
    if (!window.confirm(`Delete restricted zone ${id}?`)) return;
    try {
      await zoneService.delete(id);
      fetchData();
    } catch (err) {
      alert('Delete zone failed: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleSavePreferences = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  if (loading) {
    return <LoadingSpinner text="Loading system parameters..." />;
  }

  const cameraZones = zones.filter((z) => !selectedCamId || z.camera_id === selectedCamId);

  return (
    <div className="space-y-6">
      <SimulationAlert />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">System Settings & Perimeter Rules</h1>
        <p className="text-xs text-slate-400">
          Configure detection sensitivity, restricted polygon zones, surveillance notifications, and AI model hooks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Restricted Zone Configuration */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Restricted Zone Management</h3>
            </div>
            <button
              onClick={() => setShowAddZone(!showAddZone)}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600/20 px-3 py-1 text-xs font-semibold text-emerald-400 transition hover:bg-emerald-600 hover:text-white"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Define Zone</span>
            </button>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400">Filter Zones by Camera Node</label>
            <select
              value={selectedCamId}
              onChange={(e) => setSelectedCamId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
            >
              {cameras.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id} - {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Add Zone Drawer */}
          {showAddZone && (
            <form onSubmit={handleCreateZone} className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
              <h4 className="text-xs font-bold text-emerald-400">Add New Restricted Spatial Zone</h4>
              <div>
                <label className="text-[11px] text-slate-400">Zone Name</label>
                <input
                  type="text"
                  value={zoneName}
                  onChange={(e) => setZoneName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white"
                  required
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400">Description</label>
                <input
                  type="text"
                  value={zoneDesc}
                  onChange={(e) => setZoneDesc(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white"
                />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-[11px] text-slate-400">Polygon Coordinates (JSON Array)</label>
                  <span className="text-[10px] text-slate-500 font-mono">Resolution: 640 x 480</span>
                </div>

                {/* Preset quick buttons */}
                <div className="my-1.5 flex flex-wrap gap-1">
                  {[
                    { label: 'Center Zone', coords: '[[150, 180], [480, 180], [480, 420], [150, 420]]' },
                    { label: 'Left Dumpster', coords: '[[50, 100], [300, 100], [300, 400], [50, 400]]' },
                    { label: 'Right Corridor', coords: '[[350, 100], [600, 100], [600, 400], [350, 400]]' },
                    { label: 'Lower Half', coords: '[[50, 240], [590, 240], [590, 440], [50, 440]]' },
                  ].map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setZoneCoords(p.coords)}
                      className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300 transition hover:bg-emerald-600 hover:text-white"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                <textarea
                  rows={2}
                  value={zoneCoords}
                  onChange={(e) => setZoneCoords(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 font-mono text-xs text-white"
                  required
                />
              </div>

              {/* Visual SVG Polygon Preview */}
              <div className="rounded-lg border border-slate-800/80 bg-black/60 p-2">
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span>Spatial Zone Preview (640x480)</span>
                  <span className="text-amber-400 font-mono">Restricted Area</span>
                </div>
                <div className="relative aspect-[4/3] w-full max-h-36 bg-slate-950 rounded border border-slate-900 overflow-hidden flex items-center justify-center">
                  <svg viewBox="0 0 640 480" className="h-full w-full">
                    {/* Background grid */}
                    <line x1="0" y1="240" x2="640" y2="240" stroke="#1e293b" strokeDasharray="4 4" />
                    <line x1="320" y1="0" x2="320" y2="480" stroke="#1e293b" strokeDasharray="4 4" />
                    {(() => {
                      try {
                        const pts = JSON.parse(zoneCoords);
                        if (Array.isArray(pts) && pts.length >= 3) {
                          const pointsStr = pts.map((p) => `${p[0]},${p[1]}`).join(' ');
                          return (
                            <>
                              <polygon
                                points={pointsStr}
                                fill="rgba(245, 158, 11, 0.2)"
                                stroke="#f59e0b"
                                strokeWidth="3"
                              />
                              {pts.map((p, idx) => (
                                <circle key={idx} cx={p[0]} cy={p[1]} r="5" fill="#10b981" />
                              ))}
                            </>
                          );
                        }
                      } catch {
                        return null;
                      }
                      return null;
                    })()}
                  </svg>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddZone(false)}
                  className="rounded px-2.5 py-1 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-500"
                >
                  Save Zone
                </button>
              </div>
            </form>
          )}

          {/* Zone List */}
          <div className="space-y-2">
            {cameraZones.map((z) => (
              <div
                key={z.id}
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/40 p-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{z.name}</span>
                    <span className="font-mono text-[10px] text-emerald-400">{z.id}</span>
                  </div>
                  <p className="mt-0.5 text-slate-400">{z.description || 'Restricted perimeter'}</p>
                  <p className="font-mono text-[10px] text-slate-500 truncate max-w-sm">{z.polygon_coords}</p>
                </div>
                <button
                  onClick={() => handleDeleteZone(z.id)}
                  className="rounded p-1.5 text-slate-500 transition hover:bg-rose-500/20 hover:text-rose-400"
                  title="Remove zone"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            {cameraZones.length === 0 && (
              <p className="text-center py-6 text-xs text-slate-500">
                No restricted zones configured on this camera node.
              </p>
            )}
          </div>
        </div>

        {/* Right: Surveillance Parameters & AI Roadmap */}
        <div className="space-y-6">
          {/* Sensitivity & Preferences */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sliders className="h-5 w-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Detection & Notification Preferences</h3>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Minimum Confidence Threshold</span>
                <span className="font-mono font-bold text-emerald-400">{(confidenceThreshold * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.3"
                max="0.95"
                step="0.05"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Incident Alert Cooldown</span>
                <span className="font-mono font-bold text-emerald-400">{cooldownSeconds} seconds</span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                step="1"
                value={cooldownSeconds}
                onChange={(e) => setCooldownSeconds(parseInt(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-950 text-emerald-500 focus:ring-0"
                />
                <span>Email supervisor digest for verified incidents</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={audioAlerts}
                  onChange={(e) => setAudioAlerts(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-950 text-emerald-500 focus:ring-0"
                />
                <span>Audible siren on live surveillance dumping detection</span>
              </label>
            </div>

            <div className="pt-2 flex items-center justify-between">
              {savedSuccess ? (
                <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                  <CheckCircle className="h-4 w-4" /> Preferences saved!
                </span>
              ) : (
                <span />
              )}
              <button
                type="button"
                onClick={handleSavePreferences}
                className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-500"
              >
                <Save className="h-3.5 w-3.5" /> Save Preferences
              </button>
            </div>
          </div>

          {/* AI Provider Architecture Status */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Cpu className="h-5 w-5 text-purple-400" />
              <h3 className="text-sm font-bold text-white">Pretrained AI Model Hookups</h3>
            </div>

            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="text-white font-medium">YOLOv8 / YOLOv11:</span>
                <span className="font-mono text-emerald-400">Class BaseReady</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="text-white font-medium">Grounding DINO:</span>
                <span className="font-mono text-amber-400">Text Prompt Hook</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="text-white font-medium">MediaPipe Pose:</span>
                <span className="font-mono text-purple-400">Discarding Action</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">ByteTrack:</span>
                <span className="font-mono text-sky-400">Temporal Persistence</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

