// src/services/api.ts - OPTIMIZADO SIN LOGS INNECESARIOS
import axios from 'axios';

// Crear instancia de axios con configuración base
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5290',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Flag para evitar múltiples redirects simultáneos
let isRedirecting = false;

// ✅ RUTAS PÚBLICAS QUE NO NECESITAN AUTENTICACIÓN
const PUBLIC_ROUTES = [
  '/api/Restaurants',
  '/api/Restaurants/with-status',
  '/api/Restaurants/search',
  '/api/Restaurants/by-tipo',
  '/api/Restaurants/popular',
  '/api/Auth/login',
  '/api/Auth/register',
  '/api/Auth/google-login',
  '/api/Auth/forgot-password',
  '/api/Auth/reset-password'
];

// ✅ FUNCIÓN HELPER PARA VERIFICAR SI UNA RUTA ES PÚBLICA
const isPublicRoute = (url: string): boolean => {
  return PUBLIC_ROUTES.some(route => url.includes(route));
};

// ✅ FUNCIÓN HELPER PARA OBTENER TOKEN
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken') || localStorage.getItem('token');
};

// ✅ FUNCIÓN HELPER PARA LIMPIAR TOKENS
const clearAuthData = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('cart');
};

// ✅ INTERCEPTOR OPTIMIZADO - Solo autenticación cuando es necesaria
api.interceptors.request.use(
  config => {
    // Si es ruta pública, no agregar token
    if (isPublicRoute(config.url || '')) {
      return config;
    }

    // Solo para rutas privadas, intentar agregar token
    const token = getAuthToken();
    if (token) {
      config.headers = config.headers || {};

      // Verificar si es JWT válido (básico)
      if (token.split('.').length === 3) {
        config.headers['Authorization'] = `Bearer ${token}`;
      } else {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    // Si no hay token en ruta privada, la request continuará y el servidor responderá 401 si es necesario

    return config;
  },
  error => Promise.reject(error)
);

// ✅ INTERCEPTOR DE RESPUESTA SIMPLIFICADO
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Solo manejar 401 en rutas privadas y evitar loops
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isRedirecting &&
      !isPublicRoute(originalRequest?.url || '')
    ) {
      originalRequest._retry = true;

      const currentPath = window.location.pathname;

      // ✅ RUTAS QUE NO REQUIEREN REDIRECT
      const noRedirectRoutes = ['/login', '/register', '/forgot-password', '/reset-password', '/', '/about', '/contact'];
      const shouldNotRedirect = noRedirectRoutes.some(route =>
        currentPath === route || (route === '/restaurants' && currentPath.startsWith('/restaurants'))
      );

      // Solo limpiar datos si el error indica problema real de autenticación
      if (error.response?.data?.message?.toLowerCase().includes('token') ||
          error.response?.data?.message?.toLowerCase().includes('unauthorized') ||
          error.response?.data?.message?.toLowerCase().includes('expired')) {
        clearAuthData();
      }

      // Redirigir solo si es necesario
      if (!shouldNotRedirect && !isRedirecting) {
        isRedirecting = true;

        setTimeout(() => {
          const returnUrl = currentPath !== '/' && !currentPath.startsWith('/login')
            ? encodeURIComponent(currentPath)
            : null;

          const loginUrl = returnUrl ? `/login?returnUrl=${returnUrl}` : '/login';
          window.location.href = loginUrl;

          // Reset flag después de redirect
          setTimeout(() => {
            isRedirecting = false;
          }, 2000);
        }, 100);
      }
    }

    return Promise.reject(error);
  }
);

// ✅ FUNCIÓN PARA RESETEAR EL FLAG DE REDIRECT
export const resetRedirectFlag = () => {
  isRedirecting = false;
};

// ✅ FUNCIÓN HELPER PARA VERIFICAR SI EL TOKEN ES VÁLIDO
export const isTokenValid = (): boolean => {
  const token = getAuthToken();
  if (!token) return false;

  try {
    if (token.split('.').length === 3) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);

      if (payload.exp && payload.exp < now) {
        return false;
      }
    }
    return true;
  } catch {
    return false;
  }
};

// ✅ API ESPECÍFICA PARA RUTAS PÚBLICAS (opcional, para mayor claridad)
export const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5290',
  timeout: 10000, // Timeout más corto para rutas públicas
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export default api;
