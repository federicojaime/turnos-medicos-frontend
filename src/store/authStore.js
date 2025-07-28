import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import apiClient from '../api/client';
import { ENDPOINTS } from '../api/endpoints';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const response = await apiClient.post(ENDPOINTS.LOGIN, credentials);
          const { user, tokens } = response.data.data;
          
          localStorage.setItem('access_token', tokens.accessToken);
          
          set({
            user,
            token: tokens.accessToken,
            isAuthenticated: true,
            isLoading: false,
          });
          
          return { success: true, user };
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      updateProfile: async (data) => {
        try {
          await apiClient.put(ENDPOINTS.PROFILE, data);
          const currentUser = get().user;
          set({
            user: { ...currentUser, ...data }
          });
        } catch (error) {
          throw error;
        }
      },

      checkAuth: async () => {
        const token = localStorage.getItem('access_token');
        if (!token) return;

        try {
          const response = await apiClient.get(ENDPOINTS.PROFILE);
          const user = response.data.data;
          
          set({
            user,
            token,
            isAuthenticated: true,
          });
        } catch (error) {
          get().logout();
        }
      },
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
    }
  )
);

export default useAuthStore;