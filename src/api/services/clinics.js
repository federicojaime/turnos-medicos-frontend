// ====== src/api/services/clinics.js ======
import apiClient from '../client';
import { ENDPOINTS } from '../endpoints';

export const clinicsService = {
  getAll: (params = {}) => apiClient.get(ENDPOINTS.CLINICS, { params }),
  getById: (id) => apiClient.get(ENDPOINTS.CLINIC_BY_ID(id)),
  create: (data) => apiClient.post(ENDPOINTS.CLINICS, data),
  update: (id, data) => apiClient.put(ENDPOINTS.CLINIC_BY_ID(id), data),
  delete: (id) => apiClient.delete(ENDPOINTS.CLINIC_BY_ID(id)),
  getStats: (id) => apiClient.get(ENDPOINTS.CLINIC_STATS(id)),
  getCities: () => apiClient.get(ENDPOINTS.CITIES),
};