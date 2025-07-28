import apiClient from '../client';
import { ENDPOINTS } from '../endpoints';

export const doctorsService = {
  getAll: (params = {}) => apiClient.get(ENDPOINTS.DOCTORS, { params }),
  getById: (id) => apiClient.get(ENDPOINTS.DOCTOR_BY_ID(id)),
  create: (data) => apiClient.post(ENDPOINTS.DOCTORS, data),
  update: (id, data) => apiClient.put(ENDPOINTS.DOCTOR_BY_ID(id), data),
  delete: (id) => apiClient.delete(ENDPOINTS.DOCTOR_BY_ID(id)),
  getSchedules: (id) => apiClient.get(ENDPOINTS.DOCTOR_SCHEDULES(id)),
  updateSchedules: (id, schedules) => apiClient.put(ENDPOINTS.DOCTOR_SCHEDULES(id), { schedules }),
  getSpecialties: () => apiClient.get(ENDPOINTS.SPECIALTIES),
};