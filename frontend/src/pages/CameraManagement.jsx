import React, { useState, useEffect } from 'react';
import { Camera, Plus, Trash2, Edit3, Power, Video, Globe, HardDrive, Check, X } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import SimulationAlert from '../components/SimulationAlert';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { cameraService } from '../services/cameraService';

export default function CameraManagement() {
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editCamera, setEditCamera] = useState(null);

  // Form State
  const [camId, setCamId] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [sourceType, setSourceType] = useState('synthetic');
  const [sourcePath, setSourcePath] = useState('synthetic_source');
  const [isEnabled, setIsEnabled] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchCameras = async () => {
    try {
      setLoading(true);
      const data = await cameraService.getAll();
      setCameras(data);
    } catch (err) {
      console.error('Failed to load cameras:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCameras();
  }, []);

  const handleToggle = async (id) => {
    try {
      await cameraService.toggle(id);
      fetchCameras();
    } catch (err) {
      alert('Failed to toggle camera: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to remove surveillance camera node ${id}?`)) return;
    try {
      await cameraService.delete(id);
      fetchCameras();
    } catch (err) {
      alert('Delete failed: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editCamera) {
        await cameraService.update(editCamera.id, {
          name,
          location,
          source_type: sourceType,
          source_path: sourcePath,
          is_enabled: isEnabled,
        });
      } else {
        await cameraService.create({
          id: camId,
          name,
          location,
          source_type: sourceType,
          source_path: sourcePath,
          is_enabled: isEnabled,
        });
      }
      setShowAddModal(false);
      setEditCamera(null);
      resetForm();
      fetchCameras();
    } catch (err) {
      alert('Save failed: ' + (err.response?.data?.detail || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const openEdit = (cam) => {
    setEditCamera(cam);
    setCamId(cam.id);
    setName(cam.name);
    setLocation(cam.location);
    setSourceType(cam.source_type);
    setSourcePath(cam.source_path);
    setIsEnabled(cam.is_enabled);
    setShowAddModal(true);
  };

  const resetForm = () => {
    setCamId(`CAM_${Date.now().toString().slice(-4)}`);
    setName('');
    setLocation('');
    setSourceType('synthetic');
    setSourcePath('synthetic_source');
    setIsEnabled(true);
  };

  return (
    <div className="space-y-6">
      <SimulationAlert />

      {/* Header */}
      <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Surveillance Camera Nodes</h1>
          <p className="text-xs text-slate-400">
            Register CCTV sources, configure optical feeds, and manage surveillance perimeters.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setEditCamera(null);
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-emerald-950/40 transition hover:bg-emerald-500"
        >
          <Plus className="h-4 w-4" />
          <span>Register Camera Node</span>
        </button>
      </div>

      {/* Cameras Grid */}
      {loading ? (
        <LoadingSpinner text="Retrieving surveillance camera nodes..." />
      ) : cameras.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cameras.map((cam) => (
            <div
              key={cam.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md transition hover:border-slate-700"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-slate-800 p-2.5 text-emerald-400">
                    <Camera className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{cam.name}</h3>
                    <span className="font-mono text-xs text-slate-400">{cam.id}</span>
                  </div>
                </div>
                <StatusBadge status={cam.status} />
              </div>

              <div className="mt-4 space-y-2 text-xs text-slate-400">
                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-500">Physical Location:</span>
                  <span className="font-medium text-slate-200">{cam.location}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-500">Source Protocol:</span>
                  <span className="font-mono text-emerald-400 uppercase">{cam.source_type}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-500">Source Path:</span>
                  <span className="font-mono text-slate-300 truncate max-w-[170px]" title={cam.source_path}>
                    {cam.source_path}
                  </span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="text-slate-500">Operational:</span>
                  <span className={cam.is_enabled ? 'text-emerald-400 font-semibold' : 'text-slate-500'}>
                    {cam.is_enabled ? 'Armed & Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 flex items-center justify-between border-t border-slate-800/80 pt-3">
                <button
                  onClick={() => handleToggle(cam.id)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                    cam.is_enabled
                      ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                  }`}
                >
                  <Power className="h-3.5 w-3.5" />
                  <span>{cam.is_enabled ? 'Deactivate' : 'Activate'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(cam)}
                    className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                    title="Edit camera"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cam.id)}
                    className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-500/20 hover:text-rose-400"
                    title="Delete camera"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No cameras registered"
          description="Register optical inputs (webcams, CCTV streams, or video files) to begin automated waste monitoring."
          icon={Camera}
        />
      )}

      {/* Add / Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-base font-bold text-white">
                {editCamera ? `Edit Camera Node: ${editCamera.id}` : 'Register Surveillance Camera'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300">Camera ID</label>
                <input
                  type="text"
                  disabled={!!editCamera}
                  value={camId}
                  onChange={(e) => setCamId(e.target.value)}
                  placeholder="CAM_01"
                  required
                  className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white disabled:opacity-50"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Camera Descriptive Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="North Perimeter Gate"
                  required
                  className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Location Area</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Sector A - Industrial Entry"
                  required
                  className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Source Protocol</label>
                  <select
                    value={sourceType}
                    onChange={(e) => {
                      setSourceType(e.target.value);
                      if (e.target.value === 'synthetic') setSourcePath('synthetic_source');
                      if (e.target.value === 'webcam') setSourcePath('0');
                    }}
                    className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                  >
                    <option value="synthetic">Synthetic Simulation</option>
                    <option value="webcam">Physical Webcam (0)</option>
                    <option value="file">Video File (.mp4)</option>
                    <option value="rtsp">RTSP IP Stream</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300">Source Index / Path</label>
                  <input
                    type="text"
                    value={sourcePath}
                    onChange={(e) => setSourcePath(e.target.value)}
                    placeholder="0 or path/to/video.mp4"
                    required
                    className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="enabledCheck"
                  checked={isEnabled}
                  onChange={(e) => setIsEnabled(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-800 bg-slate-950 text-emerald-500 focus:ring-0"
                />
                <label htmlFor="enabledCheck" className="text-xs font-medium text-slate-300">
                  Enable immediately upon registration
                </label>
              </div>

              <div className="mt-6 flex justify-end gap-2 border-t border-slate-800 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-emerald-600 px-5 py-2 text-xs font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editCamera ? 'Update Camera' : 'Register Camera'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
