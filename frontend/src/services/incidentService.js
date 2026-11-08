import api, { BASE_URL } from './api';

export const incidentService = {
  // Get all incidents with optional filters
  getAll: async (params = {}) => {
    const res = await api.get('/incidents', { params });
    return res.data;
  },

  // Get incident metrics / summary statistics
  getMetrics: async () => {
    const res = await api.get('/incidents/metrics/summary');
    return res.data;
  },

  // Get incident details by ID
  getById: async (id) => {
    const res = await api.get(`/incidents/${id}`);
    return res.data;
  },

  // Verify incident
  verify: async (id, remarks = '', verified_by = 'admin') => {
    const res = await api.post(`/incidents/${id}/verify`, {
      status: 'VERIFIED',
      remarks,
      verified_by,
    });
    return res.data;
  },

  // Reject incident (false alarm)
  reject: async (id, remarks = '', verified_by = 'admin') => {
    const res = await api.post(`/incidents/${id}/reject`, {
      status: 'REJECTED',
      remarks,
      verified_by,
    });
    return res.data;
  },

  // Resolve incident (cleaned up)
  resolve: async (id, remarks = '', verified_by = 'admin') => {
    const res = await api.post(`/incidents/${id}/resolve`, {
      status: 'RESOLVED',
      remarks,
      verified_by,
    });
    return res.data;
  },

  // Export report as CSV blob
  exportCsv: async (params = {}) => {
    const res = await api.get('/incidents/export/csv', {
      params,
      responseType: 'blob',
    });
    return res.data;
  },

  // Construct direct image URL for incident
  getImageUrl: (evidenceFolder, filename = 'incident.jpg') => {
    // If evidenceFolder is like "evidence/INC_001" or absolute
    const folderName = evidenceFolder.replace(/\\/g, '/').split('/').pop();
    return `${BASE_URL}/evidence-files/${folderName}/${filename}`;
  },

  // Construct direct video URL
  getVideoUrl: (evidenceFolder, filename = 'incident_video.mp4') => {
    const folderName = evidenceFolder.replace(/\\/g, '/').split('/').pop();
    return `${BASE_URL}/evidence-files/${folderName}/${filename}`;
  },
};
