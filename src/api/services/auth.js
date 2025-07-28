import apiClient from '../client';
import { ENDPOINTS } from '../endpoints';

export const authService = {
  login: (credentials) => apiClient.post(ENDPOINTS.LOGIN, credentials),
  register: (userData) => apiClient.post(ENDPOINTS.REGISTER, userData),
  getProfile: () => apiClient.get(ENDPOINTS.PROFILE),
  updateProfile: (data) => apiClient.put(ENDPOINTS.PROFILE, data),
  changePassword: (data) => apiClient.put(ENDPOINTS.CHANGE_PASSWORD, data),
  logout: () => apiClient.post('/auth/logout'),
};