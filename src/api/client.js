// ====== src/api/client.js - CONEXIÓN FORZADA A BD ======
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos timeout
});

// Interceptor para agregar token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar respuestas - CONEXIÓN FORZADA
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // MOSTRAR TODOS LOS ERRORES - NO SILENCIAR NADA
    console.error('❌ ERROR DE API:', error);
    console.error('📍 URL:', error.config?.url);
    console.error('🔧 Método:', error.config?.method);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('🚨 BACKEND NO DISPONIBLE - ASEGÚRATE DE QUE ESTÉ CORRIENDO EN:', API_BASE_URL);
      alert(`🚨 BACKEND NO DISPONIBLE!\n\nAsegúrate de que el servidor esté corriendo en:\n${API_BASE_URL}\n\nEjecuta: npm run dev en el backend`);
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    const message = error.response?.data?.message || error.message || 'Error en la solicitud';
    console.error('💥 Mensaje de error:', message);
    
    return Promise.reject(error);
  }
);

export default apiClient;