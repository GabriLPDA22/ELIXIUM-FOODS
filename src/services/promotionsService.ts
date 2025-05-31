// src/services/promotionsService.ts - EXTENSIÓN para productOfferService
import { api } from './api'
import { ProductOfferDto } from './productOfferService'

export interface CreateProductOfferDto {
  name: string
  description: string
  discountType: string
  discountValue: number
  minimumOrderAmount: number
  minimumQuantity: number
  startDate: string
  endDate: string
  usageLimit: number
  productId: number
}

export interface UpdateProductOfferDto {
  name?: string
  description?: string
  discountType?: string
  discountValue?: number
  minimumOrderAmount?: number
  minimumQuantity?: number
  startDate?: string
  endDate?: string
  usageLimit?: number
  status?: string
}

/**
 * Extensiones para productOfferService - métodos de escritura usando endpoints reales
 */
export const promotionsService = {
  /**
   * Crear nueva oferta
   */
  async createOffer(restaurantId: number, offerData: CreateProductOfferDto): Promise<ProductOfferDto> {
    try {
      const response = await api.post(`/api/restaurants/${restaurantId}/offers`, offerData)
      return response.data
    } catch (error: any) {
      console.error('Error creando oferta:', error)
      throw new Error(error.response?.data?.message || 'Error al crear la oferta')
    }
  },

  /**
   * Actualizar oferta
   */
  async updateOffer(restaurantId: number, offerId: number, offerData: UpdateProductOfferDto): Promise<ProductOfferDto> {
    try {
      const response = await api.put(`/api/restaurants/${restaurantId}/offers/${offerId}`, offerData)
      return response.data
    } catch (error: any) {
      console.error('Error actualizando oferta:', error)
      throw new Error(error.response?.data?.message || 'Error al actualizar la oferta')
    }
  },

  /**
   * Eliminar oferta
   */
  async deleteOffer(restaurantId: number, offerId: number): Promise<boolean> {
    try {
      await api.delete(`/api/restaurants/${restaurantId}/offers/${offerId}`)
      return true
    } catch (error: any) {
      console.error('Error eliminando oferta:', error)
      throw new Error(error.response?.data?.message || 'Error al eliminar la oferta')
    }
  },

  /**
   * Activar oferta
   */
  async activateOffer(restaurantId: number, offerId: number): Promise<boolean> {
    try {
      await api.post(`/api/restaurants/${restaurantId}/offers/${offerId}/activate`)
      return true
    } catch (error: any) {
      console.error('Error activando oferta:', error)
      throw new Error(error.response?.data?.message || 'Error al activar la oferta')
    }
  },

  /**
   * Desactivar oferta
   */
  async deactivateOffer(restaurantId: number, offerId: number): Promise<boolean> {
    try {
      await api.post(`/api/restaurants/${restaurantId}/offers/${offerId}/deactivate`)
      return true
    } catch (error: any) {
      console.error('Error desactivando oferta:', error)
      throw new Error(error.response?.data?.message || 'Error al desactivar la oferta')
    }
  },

  /**
   * Obtener ofertas por restaurante (usando endpoint real)
   */
  async getOffersByRestaurant(restaurantId: number): Promise<ProductOfferDto[]> {
    try {
      const response = await api.get(`/api/restaurants/${restaurantId}/offers`)
      return response.data
    } catch (error: any) {
      console.error('Error obteniendo ofertas del restaurante:', error)
      throw new Error(error.response?.data?.message || 'Error al obtener ofertas del restaurante')
    }
  }
}
