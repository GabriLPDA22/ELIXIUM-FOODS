// src/services/restaurantService.ts
import { api } from './api'

export interface RestaurantCard {
  id: number
  name: string
  description: string
  logoUrl: string
  coverImageUrl: string
  averageRating: number
  isOpen: boolean
  deliveryFee: number
  estimatedDeliveryTime: number
  cuisine: string
  priceRange: string
  reviewCount: number
  distance: number
  featured: boolean
  isNew: boolean
  promoText: string
}

export const restaurantService = {
  // Obtener todos los restaurantes
  async getAllRestaurants(): Promise<RestaurantCard[]> {
    const response = await api.get('/api/Restaurants')
    return response.data
  },

  // Obtener restaurantes populares
  async getPopularRestaurants(limit: number = 10): Promise<RestaurantCard[]> {
    const response = await api.get(`/api/Restaurants/popular?limit=${limit}`)
    return response.data
  },

  // Obtener un restaurante por ID
  async getRestaurantById(id: number): Promise<RestaurantCard> {
    const response = await api.get(`/api/Restaurants/${id}`)
    return response.data
  },
}
