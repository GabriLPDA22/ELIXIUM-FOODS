// src/services/api.ts
import axios from 'axios';

// Crear instancia de axios con configuración base
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5290', // URL de tu backend de ASP.NET Core
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para agregar el token a las solicitudes
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      // Asegurarse de que config.headers existe
      config.headers = config.headers || {};

      // Verificar si el token parece ser un JWT (debe tener dos puntos)
      if (token.split('.').length === 3) {
        config.headers['Authorization'] = `Bearer ${token}`;
        console.log(`Enviando JWT válido: ${token.substring(0, 20)}...`);
      } else {
        console.warn('⚠️ El token almacenado no parece ser un JWT válido');
        // Enviar de todos modos en desarrollo para diagnóstico
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  error => Promise.reject(error)
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Si el error es 401 (Unauthorized) y no es un intento de refresco de token
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Limpiar datos de autenticación
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Redireccionar al login solo si no estamos ya en la página de login
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login')) {
        window.location.href = `/login?returnUrl=${encodeURIComponent(currentPath)}`;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
