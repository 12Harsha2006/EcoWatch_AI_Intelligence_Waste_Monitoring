import api from './api';

export const cameraService = {
  // Get all cameras
  getAll: async () => {
    const res = await api.get('/cameras');
    return res.data;
  },

  // Get single camera
  getById: async (id) => {
    const res = await api.get(`/cameras/${id}`);
    return res.data;
  },

  // Register new camera
  create: async (data) => {
    const res = await api.post('/cameras', data);
    return res.data;
  },

  // Upload video and register camera
  uploadVideo: async (formData) => {
    const res = await api.post('/cameras/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  // Update camera
  update: async (id, data) => {
    const res = await api.put(`/cameras/${id}`, data);
    return res.data;
  },

  // Delete camera
  delete: async (id) => {
    const res = await api.delete(`/cameras/${id}`);
    return res.data;
  },

  // Toggle active/enabled status
  toggle: async (id) => {
    const res = await api.post(`/cameras/${id}/toggle`);
    return res.data;
  },
};
