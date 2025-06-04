// ===== SERVICIOS API =====

// src/services/reviewService.ts
import axios from 'axios'
import type {
  Review,
  CreateReviewDto,
  UpdateReviewDto,
  ReviewFilter,
  RestaurantReviewSummary,
  ProductReviewSummary
} from '@/types/review'

const API_BASE = '/reviews'

export const reviewService = {
  // Obtener reseñas de restaurante
  async getRestaurantReviews(restaurantId: number, filter?: ReviewFilter): Promise<Review[]> {
    const params = filter ? { ...filter } : {}
    const response = await axios.get(`${API_BASE}/restaurant/${restaurantId}`, { params })
    return response.data.data
  },

  // Obtener reseñas de producto
  async getProductReviews(productId: number, filter?: ReviewFilter): Promise<Review[]> {
    const params = filter ? { ...filter } : {}
    const response = await axios.get(`${API_BASE}/product/${productId}`, { params })
    return response.data.data
  },

  // Obtener reseñas de usuario
  async getUserReviews(userId: number, filter?: ReviewFilter): Promise<Review[]> {
    const params = filter ? { ...filter } : {}
    const response = await axios.get(`${API_BASE}/user/${userId}`, { params })
    return response.data.data
  },

  // Obtener reseña por ID
  async getReview(id: number): Promise<Review> {
    const response = await axios.get(`${API_BASE}/${id}`)
    return response.data.data
  },

  // Crear reseña
  async createReview(reviewData: CreateReviewDto): Promise<Review> {
    const response = await axios.post(API_BASE, reviewData)
    return response.data.data
  },

  // Actualizar reseña
  async updateReview(id: number, reviewData: UpdateReviewDto): Promise<Review> {
    const response = await axios.put(`${API_BASE}/${id}`, reviewData)
    return response.data.data
  },

  // Eliminar reseña
  async deleteReview(id: number): Promise<void> {
    await axios.delete(`${API_BASE}/${id}`)
  },

  // Obtener resumen de reseñas de restaurante
  async getRestaurantReviewSummary(restaurantId: number): Promise<RestaurantReviewSummary> {
    const response = await axios.get(`${API_BASE}/restaurant/${restaurantId}/summary`)
    return response.data.data
  },

  // Obtener resumen de reseñas de producto
  async getProductReviewSummary(productId: number): Promise<ProductReviewSummary> {
    const response = await axios.get(`${API_BASE}/product/${productId}/summary`)
    return response.data.data
  },

  // Marcar reseña como útil
  async markAsHelpful(reviewId: number): Promise<void> {
    await axios.post(`${API_BASE}/${reviewId}/helpful`)
  },

  // Verificar si puede reseñar restaurante
  async canReviewRestaurant(restaurantId: number): Promise<boolean> {
    const response = await axios.get(`${API_BASE}/can-review/restaurant/${restaurantId}`)
    return response.data.data
  },

  // Verificar si puede reseñar producto
  async canReviewProduct(productId: number): Promise<boolean> {
    const response = await axios.get(`${API_BASE}/can-review/product/${productId}`)
    return response.data.data
  }
}
