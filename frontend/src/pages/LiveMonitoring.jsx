import React, { useState, useEffect } from 'react';
import {
  Play,
  Square,
  Upload,
  Camera,
  Sparkles,
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { cameraService } from '../services/cameraService';
import { monitoringService } from '../services/monitoringService';

export default function LiveMonitoring() {
  const [cameras, setCameras] = useState([]);
  const [selectedCamId, setSelectedCamId] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [fps, setFps] = useState(0);
  const [loading, setLoading] = useState(true);
  const [simAlertMsg, setSimAlertMsg] = useState(null);

  // Video upload state
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadCamId, setUploadCamId] = useState('');
  const [uploadCamName, setUploadCamName] = useState('Uploaded Corridor Video');
  const [uploadLocation, setUploadLocation] = useState('East Alleyway');
  const [isUploading, setIsUploading] = useState(false);

  // Load cameras
  const fetchCameras = async () => {
    try {
      const data = await cameraService.getAll();
      setCameras(data);
      if (data.length > 0 && !selectedCamId) {
        setSelectedCamId(data[0].id);
      }
    } catch (err) {
      console.error('Error fetching cameras:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCameras();
  }, []);

  // Poll status for selected camera
  useEffect(() => {
    if (!selectedCamId) return;

    const checkStatus = async () => {
      try {
        const stat = await monitoringService.getStatus(selectedCamId);
        setIsRunning(stat.running || false);
        setFps(stat.fps || 0);
      } catch {
        setIsRunning(false);
        setFps(0);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 3000);
    return () => clearInterval(interval);
  }, [selectedCamId]);

  const handleStart = async () => {
    try {
      await monitoringService.start(selectedCamId);
      setIsRunning(true);
    } catch (err) {
      console.error('Failed to start camera:', err);
    }
  };

  const handleStop = async () => {
    try {
      await monitoringService.stop(selectedCamId);
      setIsRunning(false);
    } catch (err) {
      console.error('Failed to stop camera:', err);
    }
  };

  const handleTriggerSimulatedDrop = async () => {
    setSimAlertMsg(null);
    try {
      await monitoringService.triggerMock(selectedCamId);
      setSimAlertMsg({
        type: 'success',
        text: 'Simulated waste drop injected into video stream! Check Incident Review.',
      });
    } catch (err) {
      setSimAlertMsg({
        type: 'error',
        text: 'Ensure monitoring stream is actively running before triggering simulation.',
      });
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadFile) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      const generatedId = uploadCamId.trim() || `CAM_UP_${Date.now().toString().slice(-4)}`;
      formData.append('camera_id', generatedId);
      formData.append('name', uploadCamName);
      formData.append('location', uploadLocation);
      formData.append('file', uploadFile);
      formData.append('is_enabled', 'true');

      await cameraService.uploadVideo(formData);
      await fetchCameras();
      setSelectedCamId(generatedId);
      setUploadOpen(false);
      setUploadFile(null);
    } catch (err) {
      alert('Upload failed: ' + (err.response?.data?.detail || err.message));
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Connecting to surveillance stream nodes..." />;
  }

  const selectedCam = cameras.find((c) => c.id === selectedCamId);
  const streamUrl = selectedCamId ? monitoringService.getStreamUrl(selectedCamId) : '';

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Live Surveillance & Detection
          </h1>
          <p className="text-xs text-slate-500">
            Real-time optical monitoring, spatial zone evaluation, and automated incident capture.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setUploadOpen(!uploadOpen)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
          >
            <Upload className="h-4 w-4 text-emerald-600" />
            <span>Upload Video Source</span>
          </button>
        </div>
      </div>

      {/* Upload Video Drawer */}
      {uploadOpen && (
        <form
          onSubmit={handleUploadSubmit}
          className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-md animate-in fade-in"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-emerald-800">
              Upload Video Footage for Surveillance Analysis
            </h3>
            <button
              type="button"
              onClick={() => setUploadOpen(false)}
              className="text-xs font-semibold text-slate-400 hover:text-slate-700"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-600">Camera Node ID (Optional)</label>
              <input
                type="text"
                placeholder="CAM_UP_01"
                value={uploadCamId}
                onChange={(e) => setUploadCamId(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Camera Name</label>
              <input
                type="text"
                value={uploadCamName}
                onChange={(e) => setUploadCamName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Location</label>
              <input
                type="text"
                value={uploadLocation}
                onChange={(e) => setUploadLocation(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Video File (.mp4, .avi)</label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setUploadFile(e.target.files[0])}
                className="mt-1 w-full text-xs text-slate-600 file:mr-2 file:rounded-md file:border-0 file:bg-emerald-600 file:px-2.5 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-emerald-700 cursor-pointer"
                required
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={isUploading}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
            >
              <Upload className="h-4 w-4" />
              <span>{isUploading ? 'Uploading & Registering...' : 'Upload & Start Stream'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Main Surveillance Monitor Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Video Stream Area (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 aspect-video flex items-center justify-center shadow-lg">
            {isRunning ? (
              <img
                src={streamUrl}
                alt="Live Camera Stream"
                className="h-full w-full object-contain"
                onError={() => {
                  setIsRunning(false);
                }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400">
                <Camera className="h-14 w-14 stroke-1 text-slate-600 mb-3" />
                <p className="text-sm font-semibold text-slate-200">Surveillance Stream Inactive</p>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  Click 'Start Monitoring' below to activate the video feed and detection engine.
                </p>
              </div>
            )}

            {/* Top-left Overlay Badges */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-md bg-black/70 px-2.5 py-1 text-[11px] font-mono text-white backdrop-blur-md border border-white/10">
                <span className={`h-2 w-2 rounded-full ${isRunning ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
                {isRunning ? 'LIVE CCTV' : 'OFFLINE'}
              </span>
              <span className="rounded-md bg-black/70 px-2 py-1 text-[11px] font-mono text-emerald-400 backdrop-blur-md border border-white/10">
                {selectedCamId}
              </span>
            </div>

            {/* Top-right Overlay FPS */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span className="rounded-md bg-black/70 px-2.5 py-1 text-[11px] font-mono text-slate-300 backdrop-blur-md border border-white/10">
                FPS: <strong className="text-emerald-400">{fps}</strong>
              </span>
            </div>
          </div>

          {/* Stream Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              {isRunning ? (
                <button
                  onClick={handleStop}
                  className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-rose-700"
                >
                  <Square className="h-4 w-4" /> Stop Monitoring
                </button>
              ) : (
                <button
                  onClick={handleStart}
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                >
                  <Play className="h-4 w-4" /> Start Monitoring
                </button>
              )}

              <button
                onClick={handleTriggerSimulatedDrop}
                disabled={!isRunning}
                className="flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-2 text-xs font-semibold text-amber-800 transition hover:bg-amber-100 disabled:opacity-40"
              >
                <Sparkles className="h-4 w-4 text-amber-600" />
                <span>Simulate Waste Drop Alert</span>
              </button>
            </div>

            <div className="text-xs text-slate-500 font-medium">
              Provider Mode:{' '}
              <span className="font-mono font-semibold text-slate-800">Automated Pipeline</span>
            </div>
          </div>

          {/* Alert Message */}
          {simAlertMsg && (
            <div
              className={`rounded-xl border p-3 text-xs font-medium ${
                simAlertMsg.type === 'success'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                  : 'border-rose-200 bg-rose-50 text-rose-800'
              }`}
            >
              {simAlertMsg.text}
            </div>
          )}
        </div>

        {/* Right Camera Feed Selector & Details (1 col) */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Select Camera Node
            </h3>
            <div className="space-y-2">
              {cameras.map((cam) => (
                <button
                  key={cam.id}
                  onClick={() => {
                    if (cam.id !== selectedCamId) {
                      setIsRunning(false);
                      setSelectedCamId(cam.id);
                    }
                  }}
                  className={`w-full text-left rounded-xl p-3 border text-xs transition ${
                    cam.id === selectedCamId
                      ? 'border-emerald-300 bg-emerald-50/70 text-slate-900 shadow-sm'
                      : 'border-slate-200/80 bg-slate-50/50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-emerald-700">{cam.id}</span>
                    <span className={`h-2 w-2 rounded-full ${cam.is_enabled ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  </div>
                  <p className="font-semibold text-slate-800 mt-1 truncate">{cam.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{cam.location}</p>
                </button>
              ))}

              {cameras.length === 0 && (
                <p className="text-xs text-slate-400">No cameras registered.</p>
              )}
            </div>
          </div>

          {/* Node Diagnostics */}
          {selectedCam && (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 text-xs shadow-sm space-y-2.5">
              <h4 className="font-bold uppercase tracking-wider text-slate-500">Node Configuration</h4>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Source Type:</span>
                <span className="font-mono text-slate-800 uppercase font-semibold">{selectedCam.source_type}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Stream Path:</span>
                <span className="font-mono text-slate-700 truncate max-w-[150px]" title={selectedCam.source_path}>
                  {selectedCam.source_path}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Evaluation:</span>
                <span className="text-emerald-700 font-semibold">Restricted Polygon</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="text-slate-800 font-semibold">{selectedCam.status}</span>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
