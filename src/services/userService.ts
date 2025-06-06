// src/services/userService.ts - MEJORADO PARA MANEJAR 401s
import { api } from './api';
import type { User, Address } from '@/types';

export interface UserProfile {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  birthdate?: string | null;
  bio?: string | null;
  dietaryPreferences?: string[];
  photoURL?: string | null;
  createdAt?: string;
}

export interface AddressRequest {
  id?: number;
  name: string;
  street: string;
  number: string;
  interior?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: number;
  type: 'card' | string;
  cardholderName: string;
  lastFourDigits: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
  brand?: string;
}

export interface PaymentMethodRequest {
  id?: number;
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  isDefault: boolean;
}

interface AuthApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface ChangePasswordApiResponse {
  success: boolean;
  message: string;
}

// ✅ HELPER PARA MANEJAR ERRORES DE API
const handleApiError = (error: any, context: string) => {
  console.error(`❌ Error en ${context}:`, {
    status: error.response?.status,
    statusText: error.response?.statusText,
    data: error.response?.data,
    message: error.message
  });

  // Si es 401, el interceptor ya se encargará
  if (error.response?.status === 401) {
    console.log('🔓 Error 401 en', context, '- interceptor manejará el redirect');
    throw new Error('Sesión expirada. Serás redirigido al login.');
  }

  // Para otros errores, extraer mensaje útil
  const backendMessage = error.response?.data?.message ||
                         (typeof error.response?.data === 'string' ? error.response.data : null) ||
                         error.message;

  throw new Error(backendMessage || `Error en ${context}`);
};

export const userService = {
  async getCurrentUser(): Promise<UserProfile> {
    try {
      const response = await api.get<AuthApiResponse<UserProfile>>('/api/Auth/me');
      if (response.data && response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data?.message || 'Respuesta no exitosa del servidor para obtener perfil.');
      }
    } catch (error: any) {
      return handleApiError(error, 'getCurrentUser');
    }
  },

  async updateUserProfile(userData: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const response = await api.put<AuthApiResponse<UserProfile>>('/api/Auth/me', userData);

      if (response.data && response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data?.message || 'Error al actualizar el perfil.');
      }
    } catch (error: any) {
      return handleApiError(error, 'updateUserProfile');
    }
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<ChangePasswordApiResponse> {
    try {
      const response = await api.post<ChangePasswordApiResponse>('/api/Auth/change-password', {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error: any) {
      return handleApiError(error, 'changePassword');
    }
  },

  async getUserAddresses(): Promise<Address[]> {
    try {
      const response = await api.get<{ success: boolean; data: Address[] }>('/api/Addresses');

      // Manejar diferentes formatos de respuesta
      if (response.data) {
        if (Array.isArray(response.data)) {
          return response.data;
        } else if (response.data.success && Array.isArray(response.data.data)) {
          return response.data.data;
        }
      }

      return [];
    } catch (error: any) {
      return handleApiError(error, 'getUserAddresses');
    }
  },

  async addAddress(address: AddressRequest): Promise<Address> {
    try {
      const response = await api.post<{ success: boolean; data: Address } | Address>('/api/Addresses', address);

      // Manejar diferentes formatos de respuesta
      if (response.data) {
        if ('success' in response.data && response.data.success) {
          return response.data.data;
        } else if ('id' in response.data) {
          return response.data as Address;
        }
      }

      throw new Error('Formato de respuesta inesperado');
    } catch (error: any) {
      return handleApiError(error, 'addAddress');
    }
  },

  async updateAddress(id: number, address: AddressRequest): Promise<Address> {
    try {
      const response = await api.put<{ success: boolean; data: Address } | Address>(`/api/Addresses/${id}`, address);

      // Manejar diferentes formatos de respuesta
      if (response.data) {
        if ('success' in response.data && response.data.success) {
          return response.data.data;
        } else if ('id' in response.data) {
          return response.data as Address;
        }
      }

      throw new Error('Formato de respuesta inesperado');
    } catch (error: any) {
      return handleApiError(error, 'updateAddress');
    }
  },

  async deleteAddress(id: number): Promise<boolean> {
    try {
      const response = await api.delete(`/api/Addresses/${id}`);
      return response.status === 200 || response.status === 204;
    } catch (error: any) {
      handleApiError(error, 'deleteAddress');
      return false;
    }
  },

  async setAddressAsDefault(id: number): Promise<boolean> {
    try {
      const response = await api.put(`/api/Addresses/${id}/default`, {});
      return response.status === 200 || response.status === 204;
    } catch (error: any) {
      handleApiError(error, 'setAddressAsDefault');
      return false;
    }
  },

  async getUserPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      const response = await api.get<{ success: boolean; data: PaymentMethod[] } | PaymentMethod[]>('/api/PaymentMethods');

      // Manejar diferentes formatos de respuesta
      if (response.data) {
        if (Array.isArray(response.data)) {
          return response.data;
        } else if ('success' in response.data && response.data.success && Array.isArray(response.data.data)) {
          return response.data.data;
        }
      }

      return [];
    } catch (error: any) {
      return handleApiError(error, 'getUserPaymentMethods');
    }
  },

  async addPaymentMethod(paymentMethodData: PaymentMethodRequest): Promise<PaymentMethod> {
    try {
      const response = await api.post<{ success: boolean; data: PaymentMethod } | PaymentMethod>('/api/PaymentMethods', paymentMethodData);

      // Manejar diferentes formatos de respuesta
      if (response.data) {
        if ('success' in response.data && response.data.success) {
          return response.data.data;
        } else if ('id' in response.data) {
          return response.data as PaymentMethod;
        }
      }

      throw new Error('Formato de respuesta inesperado');
    } catch (error: any) {
      return handleApiError(error, 'addPaymentMethod');
    }
  },

  async deletePaymentMethod(id: number): Promise<boolean> {
    try {
      const response = await api.delete(`/api/PaymentMethods/${id}`);
      return response.status === 200 || response.status === 204;
    } catch (error: any) {
      handleApiError(error, 'deletePaymentMethod');
      return false;
    }
  },

  async setPaymentMethodAsDefault(id: number): Promise<boolean> {
    try {
      const response = await api.put(`/api/PaymentMethods/${id}/default`, {});
      return response.status === 200 || response.status === 204;
    } catch (error: any) {
      handleApiError(error, 'setPaymentMethodAsDefault');
      return false;
    }
  }
};

export default userService;
