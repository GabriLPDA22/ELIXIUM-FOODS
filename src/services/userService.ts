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

interface AuthApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface ChangePasswordApiResponse {
  success: boolean;
  message: string;
}

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
      console.error('Error en userService.getCurrentUser:', error.response?.data || error.message);
      throw error.response?.data || new Error('No se pudo conectar con el servidor para obtener los datos del usuario.');
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
      console.error('Error en userService.updateUserProfile:', error.response?.data || error.message);
      const backendMessage = error.response?.data?.message ||
                             (typeof error.response?.data === 'string' ? error.response.data : null) ||
                             error.message;
      throw new Error(backendMessage || 'No se pudo conectar con el servidor para actualizar el perfil.');
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
      console.error('Error en userService.changePassword:', error.response?.data || error.message);
      throw error.response?.data || new Error('No se pudo conectar con el servidor para cambiar la contraseña.');
    }
  },

  async getUserAddresses(): Promise<Address[]> {
    try {
      const response = await api.get<Address[]>('/api/Addresses');
      return response.data;
    } catch (error: any) {
      console.error('Error en userService.getUserAddresses:', error.response?.data || error.message);
      throw error.response?.data || new Error('No se pudo conectar con el servidor para obtener las direcciones.');
    }
  },

  async addAddress(address: AddressRequest): Promise<Address> {
    try {
      const response = await api.post<Address>('/api/Addresses', address);
      return response.data;
    } catch (error: any) {
      console.error('Error en userService.addAddress:', error.response?.data || error.message);
      throw error.response?.data || new Error('No se pudo conectar con el servidor para agregar la dirección.');
    }
  },

  async updateAddress(id: number, address: AddressRequest): Promise<Address> {
    try {
      const response = await api.put<Address>(`/api/Addresses/${id}`, address);
      return response.data;
    } catch (error: any) {
      console.error('Error en userService.updateAddress:', error.response?.data || error.message);
      throw error.response?.data || new Error('No se pudo conectar con el servidor para actualizar la dirección.');
    }
  },

  async deleteAddress(id: number): Promise<boolean> {
    try {
      const response = await api.delete(`/api/Addresses/${id}`);
      return response.status === 200 || response.status === 204;
    } catch (error: any) {
      console.error('Error en userService.deleteAddress:', error.response?.data || error.message);
      throw error.response?.data || new Error('No se pudo conectar con el servidor para eliminar la dirección.');
    }
  },

  async setAddressAsDefault(id: number): Promise<boolean> {
    try {
      const response = await api.put(`/api/Addresses/${id}/default`, {});
      return response.status === 200 || response.status === 204;
    } catch (error: any) {
      console.error('Error en userService.setAddressAsDefault:', error.response?.data || error.message);
      throw error.response?.data || new Error('No se pudo conectar con el servidor para establecer la dirección predeterminada.');
    }
  },

  async getUserPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      const response = await api.get<PaymentMethod[]>('/api/PaymentMethods');
      return response.data;
    } catch (error: any) {
      console.error('Error en userService.getUserPaymentMethods:', error.response?.data || error.message);
      throw error.response?.data || new Error('No se pudo conectar para obtener los métodos de pago.');
    }
  },

  async addPaymentMethod(paymentMethodData: PaymentMethodRequest): Promise<PaymentMethod> {
    try {
      const response = await api.post<PaymentMethod>('/api/PaymentMethods', paymentMethodData);
      return response.data;
    } catch (error: any) {
      console.error('Error en userService.addPaymentMethod:', error.response?.data || error.message);
      throw error.response?.data || new Error('No se pudo conectar para agregar el método de pago.');
    }
  },

  async deletePaymentMethod(id: number): Promise<boolean> {
    try {
      const response = await api.delete(`/api/PaymentMethods/${id}`);
      return response.status === 200 || response.status === 204;
    } catch (error: any) {
      console.error('Error en userService.deletePaymentMethod:', error.response?.data || error.message);
      throw error.response?.data || new Error('No se pudo conectar para eliminar el método de pago.');
    }
  },

  async setPaymentMethodAsDefault(id: number): Promise<boolean> {
    try {
      const response = await api.put(`/api/PaymentMethods/${id}/default`, {});
      return response.status === 200 || response.status === 204;
    } catch (error: any) {
      console.error('Error en userService.setPaymentMethodAsDefault:', error.response?.data || error.message);
      throw error.response?.data || new Error('No se pudo conectar para establecer el método de pago predeterminado.');
    }
  }
};

export default userService;

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
