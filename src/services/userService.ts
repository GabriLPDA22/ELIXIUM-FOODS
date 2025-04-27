// src/services/userService.ts
import { api } from './api'
import type { User, Address } from '@/types'

export interface UserProfile {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  birthdate?: string
  bio?: string
  dietaryPreferences?: string[]
  photoURL?: string
  createdAt?: Date
}

export interface AddressRequest {
  id?: number
  name: string
  street: string
  number: string
  interior: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  phone: string
  isDefault: boolean
}

export const userService = {
  // Obtener perfil del usuario actual
  async getCurrentUser(): Promise<User> {
    const response = await api.get('/api/Users/me')
    return response.data
  },

  // Actualizar información del usuario
  async updateUserProfile(userData: Partial<UserProfile>): Promise<User> {
    const response = await api.put('/api/Users/profile', userData)
    return response.data
  },

  // Cambiar la contraseña
  async changePassword(currentPassword: string, newPassword: string): Promise<boolean> {
    const response = await api.put('/api/Users/password', {
      currentPassword,
      newPassword,
    })
    return response.status === 204
  },

  // Obtener las direcciones del usuario
  async getUserAddresses(): Promise<Address[]> {
    const response = await api.get('/api/Addresses')
    return response.data
  },

  // Agregar una nueva dirección
  async addAddress(address: AddressRequest): Promise<Address> {
    const response = await api.post('/api/Addresses', address)
    return response.data
  },

  // Actualizar una dirección existente
  async updateAddress(id: number, address: AddressRequest): Promise<Address> {
    const response = await api.put(`/api/Addresses/${id}`, address)
    return response.data
  },

  // Eliminar una dirección
  async deleteAddress(id: number): Promise<boolean> {
    const response = await api.delete(`/api/Addresses/${id}`)
    return response.status === 204
  },

  // Establecer dirección como predeterminada
  async setAddressAsDefault(id: number): Promise<boolean> {
    const response = await api.put(`/api/Addresses/${id}/default`, {})
    return response.status === 204
  },
}

export default userService
