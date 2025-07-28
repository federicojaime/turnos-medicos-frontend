import apiClient from '../client';
import { ENDPOINTS } from '../endpoints';

export const appointmentsService = {
  getAll: (params = {}) => apiClient.get(ENDPOINTS.APPOINTMENTS, { params }),
  getById: (id) => apiClient.get(ENDPOINTS.APPOINTMENT_BY_ID(id)),
  create: (data) => apiClient.post(ENDPOINTS.APPOINTMENTS, data),
  update: (id, data) => apiClient.put(ENDPOINTS.APPOINTMENT_BY_ID(id), data),
  cancel: (id, reason) => apiClient.put(ENDPOINTS.APPOINTMENT_CANCEL(id), { cancellationReason: reason }),
  confirm: (id) => apiClient.put(ENDPOINTS.APPOINTMENT_CONFIRM(id)),
  complete: (id, notes) => apiClient.put(ENDPOINTS.APPOINTMENT_COMPLETE(id), { notes }),
  delete: (id) => apiClient.delete(ENDPOINTS.APPOINTMENT_BY_ID(id)),
  getAvailability: (doctorId, date) => apiClient.get(ENDPOINTS.AVAILABILITY(doctorId, date)),
  getTodayAppointments: (params = {}) => apiClient.get(ENDPOINTS.TODAY_APPOINTMENTS, { params }),
  getStats: (params = {}) => apiClient.get(ENDPOINTS.APPOINTMENT_STATS, { params }),
};