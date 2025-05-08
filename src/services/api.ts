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
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Si el error es 401 (Unauthorized) y no es un intento de refresco de token
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Aquí podrías implementar lógica para refrescar el token si tienes endpoint de refresh
      // Por ahora, simplemente redirigimos al login
      
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