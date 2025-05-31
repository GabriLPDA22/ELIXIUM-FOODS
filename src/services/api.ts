// src/services/api.ts - ARREGLADO CON NOMBRES CONSISTENTES
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

// ✅ FUNCIÓN HELPER PARA OBTENER TOKEN
const getAuthToken = (): string | null => {
  // Intentar ambos nombres para compatibilidad
  return localStorage.getItem('authToken') || localStorage.getItem('token');
};

// ✅ FUNCIÓN HELPER PARA LIMPIAR TOKENS
const clearAuthData = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('token'); // Limpiar ambos por compatibilidad
  localStorage.removeItem('user');
  localStorage.removeItem('cart');
};

// Interceptor para agregar el token a las solicitudes
api.interceptors.request.use(
  config => {
    const token = getAuthToken();

    if (token) {
      config.headers = config.headers || {};

      // Verificar si el token parece ser un JWT válido
      if (token.split('.').length === 3) {
        config.headers['Authorization'] = `Bearer ${token}`;
        console.log(`🔑 Enviando JWT válido: ${token.substring(0, 20)}...`);
      } else {
        console.warn('⚠️ Token no parece ser JWT válido:', token.substring(0, 20));
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    } else {
      console.log('❌ No hay token disponible para la petición a:', config.url);
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

    console.log('🚨 Error en API interceptor:', {
      status: error.response?.status,
      url: originalRequest?.url,
      currentPath: window.location.pathname,
      isRedirecting,
      hasToken: !!getAuthToken()
    });

    // Si el error es 401 (Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry && !isRedirecting) {
      console.log('🔓 Error 401 detectado, procesando...');

      // Marcar que ya intentamos procesar este error
      originalRequest._retry = true;

      const currentPath = window.location.pathname;

      // ✅ VERIFICACIONES MEJORADAS PARA EVITAR LOOPS

      // 1. No redirigir si ya estamos en rutas de auth
      const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
      const isInAuthRoute = authRoutes.some(route => currentPath.startsWith(route));

      // 2. No redirigir si es una ruta pública
      const publicRoutes = ['/', '/about', '/contact', '/restaurants'];
      const isPublicRoute = publicRoutes.some(route =>
        currentPath === route || (route === '/restaurants' && currentPath.startsWith('/restaurants'))
      );

      // 3. Solo limpiar datos si realmente hay un problema de auth
      if (error.response?.data?.message?.includes('token') ||
          error.response?.data?.message?.includes('unauthorized') ||
          error.response?.data?.message?.includes('expired')) {

        console.log('🧹 Limpiando datos de autenticación por token inválido...');
        clearAuthData();
      }

      // ✅ REDIRIGIR SOLO SI ES NECESARIO
      if (!isInAuthRoute && !isPublicRoute && !isRedirecting) {
        isRedirecting = true;

        console.log('🔀 Redirigiendo al login desde:', currentPath);

        // Pequeño delay para evitar conflictos con router guards
        setTimeout(() => {
          const returnUrl = currentPath !== '/' && !currentPath.startsWith('/login')
            ? encodeURIComponent(currentPath)
            : null;

          const loginUrl = returnUrl
            ? `/login?returnUrl=${returnUrl}`
            : '/login';

          console.log('🔀 Redirect URL:', loginUrl);
          window.location.href = loginUrl;

          // Reset flag después de redirect
          setTimeout(() => {
            isRedirecting = false;
          }, 2000);
        }, 100);
      }
    }

    // Para otros errores, no hacer nada especial
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
    // Si es JWT, verificar expiración
    if (token.split('.').length === 3) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);

      if (payload.exp && payload.exp < now) {
        console.log('🕐 Token expirado detectado');
        return false;
      }
    }
    return true;
  } catch (error) {
    console.warn('⚠️ Error verificando validez del token:', error);
    return false;
  }
};

export default api;
