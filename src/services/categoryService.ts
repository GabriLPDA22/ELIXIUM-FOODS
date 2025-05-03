// src/services/categoryService.ts
import { api } from './api'

export interface Category {
  id: number
  name: string
  description: string
  menuId: number | null // Permitir null para categorías de tipos de restaurante
  products: Product[]
}

export interface RestaurantTypeCategory {
  id: number
  name: string
  description: string
}

export interface Product {
  id: number
  name: string
  description: string
  price: number
  imageUrl: string
  isAvailable: boolean
  categoryId: number
  categoryName: string
  restaurantId: number
}

export const categoryService = {
  // Obtener todas las categorías
  async getAllCategories(): Promise<Category[]> {
    const response = await api.get('/api/Categories')
    return response.data
  },

  // Obtener categorías de tipos de restaurante (sin MenuId)
  async getRestaurantTypeCategories(): Promise<RestaurantTypeCategory[]> {
    const response = await api.get('/api/Categories/restaurant-types')
    return response.data
  },

  // Obtener categorías por menú
  async getCategoriesByMenu(menuId: number): Promise<Category[]> {
    const response = await api.get(`/api/Categories/menu/${menuId}`)
    return response.data
  },

  // Obtener una categoría por ID
  async getCategoryById(id: number): Promise<Category> {
    const response = await api.get(`/api/Categories/${id}`)
    return response.data
  },
}
