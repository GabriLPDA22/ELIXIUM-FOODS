// src/services/offerService.ts

import { api } from './api'
import type { ProductOffer } from '@/types'

export interface OfferCalculation {
  offerId: number
  name: string
  discountType: string
  discountValue: number
  originalPrice: number
  applied: boolean
  calculatedDiscount: number
  finalPrice: number
  reasonNotApplied?: string
}

export interface OfferValidation {
  offerId: number
  productId: number
  quantity: number
  canApply: boolean
  validationMessage: string
}

class OfferService {
  private baseUrl = '/api'

  /**
   * Obtiene todas las ofertas activas de un restaurante
   */
  async getActiveOffersByRestaurant(restaurantId: number): Promise<ProductOffer[]> {
    try {
      const response = await api.get(`${this.baseUrl}/restaurants/${restaurantId}/offers/active`)
      return response.data || []
    } catch (error: any) {
      console.error('Error fetching active offers:', error)
      return []
    }
  }

  /**
   * Obtiene ofertas específicas para un producto
   */
  async getOffersByProduct(restaurantId: number, productId: number): Promise<ProductOffer[]> {
    try {
      const response = await api.get(`${this.baseUrl}/restaurants/${restaurantId}/offers`)
      const allOffers = response.data || []
      return allOffers.filter((offer: ProductOffer) =>
        offer.productId === productId && offer.status === 'active'
      )
    } catch (error: any) {
      console.error('Error fetching product offers:', error)
      return []
    }
  }

  /**
   * Calcula ofertas aplicables para una lista de productos
   */
  async calculateOffersForProducts(
    restaurantId: number,
    products: { productId: number; quantity: number; unitPrice: number }[],
    orderSubtotal: number
  ): Promise<OfferCalculation[]> {
    try {
      const response = await api.post(
        `${this.baseUrl}/restaurants/${restaurantId}/offers/calculate`,
        {
          products,
          orderSubtotal
        }
      )
      return response.data || []
    } catch (error: any) {
      console.error('Error calculating offers:', error)
      return []
    }
  }

  /**
   * Valida ofertas para un pedido específico
   */
  async validateOffersForOrder(
    restaurantId: number,
    orderItems: { productId: number; quantity: number }[],
    orderSubtotal: number
  ): Promise<OfferValidation[]> {
    try {
      const response = await api.post(
        `${this.baseUrl}/restaurants/${restaurantId}/offers/validate`,
        {
          orderItems,
          orderSubtotal
        }
      )
      return response.data || []
    } catch (error: any) {
      console.error('Error validating offers:', error)
      return []
    }
  }

  /**
   * Aplica una oferta específica (incrementa contador de uso)
   */
  async applyOffer(offerId: number): Promise<boolean> {
    try {
      await api.post(`${this.baseUrl}/offers/${offerId}/apply`)
      return true
    } catch (error: any) {
      console.error('Error applying offer:', error)
      return false
    }
  }

  /**
   * Calcula el mejor precio para un producto específico
   */
  calculateBestPrice(
    product: { id: number; price: number },
    offers: ProductOffer[],
    quantity: number = 1,
    orderSubtotal: number = 0
  ): { originalPrice: number; finalPrice: number; appliedOffer?: ProductOffer; savings: number } {
    const originalPrice = product.price
    let bestOffer: ProductOffer | undefined
    let lowestPrice = originalPrice

    // Filtrar ofertas aplicables para este producto
    const applicableOffers = offers.filter(offer =>
      offer.productId === product.id &&
      offer.status === 'active' &&
      this.isOfferValid(offer) &&
      quantity >= offer.minimumQuantity &&
      orderSubtotal >= offer.minimumOrderAmount
    )

    // Encontrar la mejor oferta (mayor descuento)
    for (const offer of applicableOffers) {
      const discountedPrice = this.calculateDiscountedPrice(originalPrice, offer)
      if (discountedPrice < lowestPrice) {
        lowestPrice = discountedPrice
        bestOffer = offer
      }
    }

    return {
      originalPrice,
      finalPrice: lowestPrice,
      appliedOffer: bestOffer,
      savings: originalPrice - lowestPrice
    }
  }

  /**
   * Calcula el precio con descuento aplicado
   */
  private calculateDiscountedPrice(originalPrice: number, offer: ProductOffer): number {
    if (!this.isOfferValid(offer)) return originalPrice

    let discountedPrice: number

    if (offer.discountType === 'percentage' || offer.discountType === '%') {
      discountedPrice = originalPrice * (1 - offer.discountValue / 100)
    } else {
      // fixed discount
      discountedPrice = Math.max(0.01, originalPrice - offer.discountValue)
    }

    return Math.max(0.01, discountedPrice) // Mínimo $0.01
  }

  /**
   * Verifica si una oferta está válida temporalmente
   */
  private isOfferValid(offer: ProductOffer): boolean {
    const now = new Date()
    const startDate = new Date(offer.startDate)
    const endDate = new Date(offer.endDate)

    return (
      offer.status === 'active' &&
      startDate <= now &&
      endDate >= now &&
      (offer.usageLimit === 0 || offer.usageCount < offer.usageLimit)
    )
  }

  /**
   * Formatea el badge de una oferta
   */
  formatOfferBadge(offer: ProductOffer): string {
    if (offer.discountType === 'percentage' || offer.discountType === '%') {
      return `${offer.discountValue}% OFF`
    } else {
      return `$${offer.discountValue.toFixed(2)} OFF`
    }
  }

  /**
   * Calcula ahorros totales para una lista de productos
   */
  calculateTotalSavings(
    products: { id: number; price: number; quantity: number }[],
    offers: ProductOffer[],
    orderSubtotal: number = 0
  ): { totalOriginal: number; totalWithOffers: number; totalSavings: number } {
    let totalOriginal = 0
    let totalWithOffers = 0

    for (const product of products) {
      const calculation = this.calculateBestPrice(product, offers, product.quantity, orderSubtotal)
      totalOriginal += calculation.originalPrice * product.quantity
      totalWithOffers += calculation.finalPrice * product.quantity
    }

    return {
      totalOriginal,
      totalWithOffers,
      totalSavings: totalOriginal - totalWithOffers
    }
  }
}

export const offerService = new OfferService()
export default offerService
