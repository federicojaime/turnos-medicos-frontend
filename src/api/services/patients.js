import apiClient from '../client';
import { ENDPOINTS } from '../endpoints';

export const patientsService = {
  getAll: (params = {}) => apiClient.get(ENDPOINTS.PATIENTS, { params }),
  getById: (id) => apiClient.get(ENDPOINTS.PATIENT_BY_ID(id)),
  create: (data) => apiClient.post(ENDPOINTS.PATIENTS, data),
  update: (id, data) => apiClient.put(ENDPOINTS.PATIENT_BY_ID(id), data),
  delete: (id) => apiClient.delete(ENDPOINTS.PATIENT_BY_ID(id)),
  getHistory: (id) => apiClient.get(ENDPOINTS.PATIENT_HISTORY(id)),
  getUpcoming: (id) => apiClient.get(ENDPOINTS.PATIENT_UPCOMING(id)),
};