// src/stores/auth.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from '@/services/api';

// Interfaces
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  userId?: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

export const useAuthStore = defineStore('auth', () => {
  // Estado
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const isAuthenticated = () => !!token.value;
  const isAdmin = () => user.value?.role === 'Admin';
  const isRestaurant = () => user.value?.role === 'Restaurant';
  const isDeliveryPerson = () => user.value?.role === 'DeliveryPerson';
  const isCustomer = () => user.value?.role === 'Customer';

  // Acciones
  const initialize = () => {
    // Cargar token y usuario desde localStorage al iniciar
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken) {
      token.value = savedToken;
      
      // Configurar token en las cabeceras por defecto
      if (api.defaults.headers) {
        api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
      }
    }

    if (savedUser) {
      try {
        user.value = JSON.parse(savedUser);
      } catch (err) {
        console.error('Error parsing user from localStorage:', err);
        user.value = null;
      }
    }
  };

  const login = async (credentials: LoginRequest): Promise<boolean> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.post<AuthResponse>('/api/Auth/login', credentials);
      const data = response.data;

      if (data.success && data.token) {
        // Guardar token
        token.value = data.token;
        localStorage.setItem('token', data.token);
        
        // Configurar token en las cabeceras por defecto
        if (api.defaults.headers) {
          api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        }

        // Guardar información del usuario
        user.value = {
          id: data.userId!,
          email: data.email!,
          firstName: data.firstName!,
          lastName: data.lastName!,
          role: data.role!
        };
        localStorage.setItem('user', JSON.stringify(user.value));

        return true;
      } else {
        error.value = data.message || 'Error en la autenticación';
        return false;
      }
    } catch (err: any) {
      console.error('Login error:', err);
      error.value = err.response?.data?.message || 'Error en la conexión con el servidor';
      return false;
    } finally {
      loading.value = false;
    }
  };

  const register = async (userData: RegisterRequest): Promise<boolean> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.post<AuthResponse>('/api/Auth/register', userData);
      const data = response.data;

      if (data.success && data.token) {
        // Guardar token
        token.value = data.token;
        localStorage.setItem('token', data.token);
        
        // Configurar token en las cabeceras por defecto
        if (api.defaults.headers) {
          api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        }

        // Guardar información del usuario
        user.value = {
          id: data.userId!,
          email: data.email!,
          firstName: data.firstName!,
          lastName: data.lastName!,
          role: data.role!
        };
        localStorage.setItem('user', JSON.stringify(user.value));

        return true;
      } else {
        error.value = data.message || 'Error en el registro';
        return false;
      }
    } catch (err: any) {
      console.error('Register error:', err);
      error.value = err.response?.data?.message || 'Error en la conexión con el servidor';
      return false;
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    // Limpiar datos de autenticación
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Eliminar token de las cabeceras
    if (api.defaults.headers) {
      delete api.defaults.headers.common['Authorization'];
    }
  };

  const checkAuth = async (): Promise<boolean> => {
    // Si no hay token, no estamos autenticados
    if (!token.value) return false;

    try {
      // Verificar si el token sigue siendo válido haciendo una petición al endpoint de usuario actual
      const response = await api.get('/api/Users/me');
      if (response.status === 200) {
        // Actualizar información del usuario si es necesario
        return true;
      } else {
        // Si hay algún problema, hacer logout
        logout();
        return false;
      }
    } catch (err) {
      console.error('Auth check error:', err);
      logout();
      return false;
    }
  };

  // Inicializar al crear el store
  initialize();

  return {
    // Estado
    user,
    token,
    loading,
    error,
    
    // Getters
    isAuthenticated,
    isAdmin,
    isRestaurant,
    isDeliveryPerson,
    isCustomer,
    
    // Acciones
    login,
    register,
    logout,
    checkAuth
  };
});