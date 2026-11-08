import api from './api';

export const zoneService = {
  // Get all zones, optionally by camera ID
  getAll: async (cameraId = null) => {
    const params = cameraId ? { camera_id: cameraId } : {};
    const res = await api.get('/zones', { params });
    return res.data;
  },

  // Get zone by ID
  getById: async (id) => {
    const res = await api.get(`/zones/${id}`);
    return res.data;
  },

  // Create restricted zone
  create: async (data) => {
    const res = await api.post('/zones', data);
    return res.data;
  },

  // Update restricted zone
  update: async (id, data) => {
    const res = await api.put(`/zones/${id}`, data);
    return res.data;
  },

  // Delete restricted zone
  delete: async (id) => {
    const res = await api.delete(`/zones/${id}`);
    return res.data;
  },
};

