import api, { BASE_URL } from './api';

export const monitoringService = {
  // Start live monitoring for camera
  start: async (cameraId) => {
    const res = await api.post(`/monitoring/start/${cameraId}`);
    return res.data;
  },

  // Stop live monitoring for camera
  stop: async (cameraId) => {
    const res = await api.post(`/monitoring/stop/${cameraId}`);
    return res.data;
  },

  // Get stream worker status & FPS
  getStatus: async (cameraId) => {
    const res = await api.get(`/monitoring/status/${cameraId}`);
    return res.data;
  },

  // Trigger simulated waste drop event for testing
  triggerMock: async (cameraId) => {
    const res = await api.post(`/monitoring/trigger-mock/${cameraId}`);
    return res.data;
  },

  // Get direct MJPEG stream URL
  getStreamUrl: (cameraId) => {
    return `${BASE_URL}/api/monitoring/stream/${cameraId}`;
  },
};

