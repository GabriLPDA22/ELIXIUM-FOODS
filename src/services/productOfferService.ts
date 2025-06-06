// src/services/productOfferService.ts
import api from './api';

// Interfaces basadas en el backend
export interface ProductOfferDto {
  id: number;
  name: string;
  description: string;
  discountType: string; // "percentage" | "fixed"
  discountValue: number;
  minimumOrderAmount: number;
  minimumQuantity: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usageCount: number;
  status: string;
  restaurantId: number;
  restaurantName: string;
  productId: number;
  productName: string;
  productImageUrl: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  isExpired: boolean;
  remainingUses: number;
}

export interface ProductOfferSummaryDto {
  offerId: number;
  name: string;
  discountType: string;
  discountValue: number;
  originalPrice: number;
  applied: boolean;
  calculatedDiscount: number;
  finalPrice: number;
  reasonNotApplied?: string;
}

export interface OfferValidationDto {
  offerId: number;
  productId: number;
  quantity: number;
  canApply: boolean;
  validationMessage: string;
}

export const productOfferService = {
  // Obtener todas las ofertas
  async getAllOffers(): Promise<ProductOfferDto[]> {
    try {
      const response = await api.get('/api/product-offers');
      return response.data;
    } catch (error) {
      console.error('Error fetching all offers:', error);
      throw error;
    }
  },

  // Obtener todas las ofertas activas
  async getActiveOffers(): Promise<ProductOfferDto[]> {
    try {
      const response = await api.get('/api/product-offers/active');
      return response.data;
    } catch (error) {
      console.error('Error fetching active offers:', error);
      throw error;
    }
  },

  // Obtener oferta por ID
  async getOfferById(id: number): Promise<ProductOfferDto> {
    try {
      const response = await api.get(`/api/product-offers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching offer by ID:', error);
      throw error;
    }
  },

  // Obtener ofertas por restaurante
  async getOffersByRestaurant(restaurantId: number): Promise<ProductOfferDto[]> {
    try {
      const response = await api.get(`/api/product-offers/restaurant/${restaurantId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching restaurant offers:', error);
      throw error;
    }
  },

  // Obtener ofertas activas por restaurante
  async getActiveOffersByRestaurant(restaurantId: number): Promise<ProductOfferDto[]> {
    try {
      const response = await api.get(`/api/product-offers/restaurant/${restaurantId}/active`);
      return response.data;
    } catch (error) {
      console.error('Error fetching active restaurant offers:', error);
      throw error;
    }
  },

  // Obtener ofertas por producto
  async getOffersByProduct(productId: number): Promise<ProductOfferDto[]> {
    try {
      const response = await api.get(`/api/product-offers/product/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product offers:', error);
      throw error;
    }
  },

  // Validar ofertas para orden
  async validateOffersForOrder(
    restaurantId: number, 
    orderItems: Array<{productId: number, quantity: number}>, 
    orderSubtotal: number
  ): Promise<OfferValidationDto[]> {
    try {
      const response = await api.post(`/api/product-offers/restaurant/${restaurantId}/validate`, {
        orderItems,
        orderSubtotal
      });
      return response.data;
    } catch (error) {
      console.error('Error validating offers for order:', error);
      throw error;
    }
  },

  // Calcular ofertas para productos
  async calculateOffersForProducts(
    restaurantId: number, 
    products: Array<{productId: number, quantity: number, unitPrice: number}>, 
    orderSubtotal: number
  ): Promise<ProductOfferSummaryDto[]> {
    try {
      const response = await api.post(`/api/product-offers/restaurant/${restaurantId}/calculate`, {
        products,
        orderSubtotal
      });
      return response.data;
    } catch (error) {
      console.error('Error calculating offers for products:', error);
      throw error;
    }
  },

  // Aplicar uso de oferta
  async applyOfferUsage(offerId: number): Promise<boolean> {
    try {
      const response = await api.post(`/api/product-offers/${offerId}/apply`);
      return response.data;
    } catch (error) {
      console.error('Error applying offer usage:', error);
      throw error;
    }
  }
};

// Utilidades para ofertas
export const offerUtils = {
  // Formatear descuento
  formatDiscount(discountType: string, discountValue: number): string {
    if (discountType === 'percentage') {
      return `-${discountValue}%`;
    } else if (discountType === 'fixed') {
      return `-$${discountValue}`;
    }
    return discountValue.toString();
  },

  // Verificar si oferta está activa
  isOfferActive(offer: ProductOfferDto): boolean {
    return offer.isActive && !offer.isExpired;
  },

  // Obtener tiempo restante
  getTimeRemaining(endDate: string): string | null {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return null;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  },

  // Calcular prioridad de oferta
  getOfferPriority(offer: ProductOfferDto): number {
    let priority = 0;
    
    // Mayor descuento = mayor prioridad
    if (offer.discountType === 'percentage') {
      priority += offer.discountValue;
    } else {
      priority += offer.discountValue * 5;
    }
    
    // Ofertas que expiran pronto
    const timeRemaining = this.getTimeRemaining(offer.endDate);
    if (timeRemaining) {
      const [value, unit] = timeRemaining.split(/[^\d]/);
      if (unit === 'd' && parseInt(value) <= 2) priority += 50;
      if (unit === 'h') priority += 30;
      if (unit === 'm') priority += 20;
    }
    
    // Usos limitados restantes
    if (offer.remainingUses > 0 && offer.remainingUses <= 10) {
      priority += 25;
    }
    
    return priority;
  },

  // Verificar si es oferta "hot"
  isHotOffer(offer: ProductOfferDto): boolean {
    const priority = this.getOfferPriority(offer);
    return priority > 75;
  },

  // Verificar si expira pronto
  isExpiringOffer(offer: ProductOfferDto): boolean {
    const timeRemaining = this.getTimeRemaining(offer.endDate);
    if (!timeRemaining) return false;
    
    const [value, unit] = timeRemaining.split(/[^\d]/);
    return (unit === 'd' && parseInt(value) <= 2) || unit === 'h' || unit === 'm';
  }
};