import React, { useState, useEffect } from 'react';
import { Camera, Plus, Trash2, Edit3, Power, X } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
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
      {/* Header */}
      <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#173B2A]">Surveillance Camera Nodes</h1>
          <p className="text-xs text-[#647067]">
            Register CCTV sources, configure optical feeds, and manage surveillance perimeters.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setEditCamera(null);
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#1B5E20] to-[#4CAF50] px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:opacity-95 cursor-pointer"
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
              className="rounded-3xl border border-[#E8F5E9] bg-white p-6 shadow-xs transition hover:border-[#4CAF50] hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-[#E8F5E9] border border-[#C8E6C9] p-3 text-[#1B5E20]">
                    <Camera className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#173B2A] text-sm">{cam.name}</h3>
                    <span className="font-mono text-xs text-[#647067] font-semibold">{cam.id}</span>
                  </div>
                </div>
                <StatusBadge status={cam.status} />
              </div>

              <div className="mt-5 space-y-2.5 text-xs">
                <div className="flex justify-between border-b border-[#E8F5E9] pb-2">
                  <span className="text-[#647067]">Physical Location:</span>
                  <span className="font-semibold text-[#173B2A]">{cam.location}</span>
                </div>
                <div className="flex justify-between border-b border-[#E8F5E9] pb-2">
                  <span className="text-[#647067]">Source Protocol:</span>
                  <span className="font-mono text-[#1B5E20] uppercase font-bold">{cam.source_type}</span>
                </div>
                <div className="flex justify-between border-b border-[#E8F5E9] pb-2">
                  <span className="text-[#647067]">Source Path:</span>
                  <span className="font-mono text-[#647067] truncate max-w-[170px]" title={cam.source_path}>
                    {cam.source_path}
                  </span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="text-[#647067]">Operational:</span>
                  <span className={cam.is_enabled ? 'text-[#1B5E20] font-bold' : 'text-[#647067]'}>
                    {cam.is_enabled ? 'Armed & Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 flex items-center justify-between border-t border-[#E8F5E9] pt-4">
                <button
                  onClick={() => handleToggle(cam.id)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                    cam.is_enabled
                      ? 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                      : 'bg-[#E8F5E9] text-[#1B5E20] border border-[#C8E6C9] hover:bg-[#1B5E20] hover:text-white'
                  }`}
                >
                  <Power className="h-3.5 w-3.5" />
                  <span>{cam.is_enabled ? 'Deactivate' : 'Activate'}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEdit(cam)}
                    className="rounded-xl p-2 text-[#647067] transition hover:bg-[#F8F9F0] hover:text-[#173B2A] cursor-pointer"
                    title="Edit camera"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cam.id)}
                    className="rounded-xl p-2 text-[#647067] transition hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-[#E8F5E9] bg-white p-7 shadow-2xl text-[#173B2A]">
            <div className="flex items-center justify-between border-b border-[#E8F5E9] pb-4">
              <h3 className="text-base font-bold text-[#173B2A]">
                {editCamera ? `Edit Camera Node: ${editCamera.id}` : 'Register Surveillance Camera'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-xl p-1 text-[#647067] hover:bg-[#F8F9F0] hover:text-[#173B2A] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-[#173B2A]">Camera ID</label>
                <input
                  type="text"
                  disabled={!!editCamera}
                  value={camId}
                  onChange={(e) => setCamId(e.target.value)}
                  placeholder="CAM_01"
                  required
                  className="mt-1 w-full rounded-2xl border border-[#C8E6C9] bg-[#F8F9F0] px-3.5 py-2 text-xs text-[#173B2A] disabled:opacity-50 focus:bg-white focus:border-[#4CAF50] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#173B2A]">Camera Descriptive Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="North Perimeter Gate"
                  required
                  className="mt-1 w-full rounded-2xl border border-[#C8E6C9] bg-[#F8F9F0] px-3.5 py-2 text-xs text-[#173B2A] focus:bg-white focus:border-[#4CAF50] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#173B2A]">Location Area</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Sector A - Industrial Entry"
                  required
                  className="mt-1 w-full rounded-2xl border border-[#C8E6C9] bg-[#F8F9F0] px-3.5 py-2 text-xs text-[#173B2A] focus:bg-white focus:border-[#4CAF50] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#173B2A]">Source Protocol</label>
                  <select
                    value={sourceType}
                    onChange={(e) => {
                      setSourceType(e.target.value);
                      if (e.target.value === 'synthetic') setSourcePath('synthetic_source');
                      if (e.target.value === 'webcam') setSourcePath('0');
                    }}
                    className="mt-1 w-full rounded-2xl border border-[#C8E6C9] bg-[#F8F9F0] px-3.5 py-2 text-xs text-[#173B2A] focus:bg-white focus:border-[#4CAF50] focus:outline-none font-bold cursor-pointer"
                  >
                    <option value="synthetic">Synthetic Simulation</option>
                    <option value="webcam">Physical Webcam (0)</option>
                    <option value="file">Video File (.mp4)</option>
                    <option value="rtsp">RTSP IP Stream</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#173B2A]">Source Index / Path</label>
                  <input
                    type="text"
                    value={sourcePath}
                    onChange={(e) => setSourcePath(e.target.value)}
                    placeholder="0 or path/to/video.mp4"
                    required
                    className="mt-1 w-full rounded-2xl border border-[#C8E6C9] bg-[#F8F9F0] px-3.5 py-2 text-xs text-[#173B2A] focus:bg-white focus:border-[#4CAF50] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="enabledCheck"
                  checked={isEnabled}
                  onChange={(e) => setIsEnabled(e.target.checked)}
                  className="h-4 w-4 rounded border-[#C8E6C9] text-[#1B5E20] focus:ring-[#4CAF50] cursor-pointer"
                />
                <label htmlFor="enabledCheck" className="text-xs font-semibold text-[#173B2A] cursor-pointer">
                  Enable immediately upon registration
                </label>
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-[#E8F5E9] pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-2xl px-4 py-2 text-xs font-bold text-[#647067] hover:bg-[#F8F9F0] hover:text-[#173B2A] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-2xl bg-gradient-to-r from-[#1B5E20] to-[#4CAF50] px-5 py-2.5 text-xs font-bold text-white shadow-md transition hover:opacity-95 disabled:opacity-50 cursor-pointer"
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
