import { api } from './api'
import type {
  Order,
  CreateOrderRequest,
  Address,
  ApiResponse
} from '@/types'

export enum OrderStatus {
  PENDING = 'Pending',
  ACCEPTED = 'Accepted',
  PREPARING = 'Preparing',
  READY_FOR_PICKUP = 'ReadyForPickup',
  ON_THE_WAY = 'OnTheWay',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled'
}

export interface OrderResponse {
  id: number
  userId: number
  restaurantId: number
  restaurantName: string
  status: OrderStatus
  total: number
  subtotal: number
  deliveryFee: number
  createdAt: string
  updatedAt: string
  estimatedDeliveryTime: string
  orderItems?: {
    id: number
    productId: number
    productName: string
    name: string
    quantity: number
    unitPrice: number
    productImageUrl?: string
  }[]
}

export interface PromoCodeValidation {
  valid: boolean
  discount: number
  message?: string
  code?: string
}

export interface DeliveryTimeSlot {
  time: string
  available: boolean
  estimatedDelivery: string
}

export interface OrderSummary {
  subtotal: number
  deliveryFee: number
  tax: number
  total: number
  savings: number
  itemCount: number
}

class OrderService {
  private baseUrl = '/api'

  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    try {
      console.log('🚀 Creando pedido:', orderData)
      const response = await api.post(`${this.baseUrl}/orders`, orderData)
      console.log('✅ Pedido creado exitosamente:', response.data)
      return response.data
    } catch (error: any) {
      console.error('❌ Error creando pedido:', error)
      let errorMessage = 'Error al crear el pedido'
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.response?.data?.errors?.length > 0) {
        errorMessage = error.response.data.errors.join(', ')
      } else if (error.message) {
        errorMessage = error.message
      }
      throw new Error(errorMessage)
    }
  }

  async getUserOrders(): Promise<OrderResponse[]> {
    try {
      console.log('🔍 Obteniendo pedidos del usuario...')
      const response = await api.get(`${this.baseUrl}/orders`)
      console.log('✅ Pedidos obtenidos:', response.data?.length || 0)
      return response.data || []
    } catch (error: any) {
      console.error('❌ Error con /api/orders, intentando método alternativo:', error)
      try {
        const userResponse = await api.get(`${this.baseUrl}/auth/me`)
        const userId = userResponse.data?.id || userResponse.data?.userId
        if (userId) {
          console.log('🔍 Obteniendo pedidos para userId:', userId)
          const ordersResponse = await api.get(`${this.baseUrl}/orders/user/${userId}`)
          return ordersResponse.data || []
        }
        throw new Error('No se pudo obtener el ID del usuario')
      } catch (secondError: any) {
        console.error('❌ Error obteniendo pedidos del usuario:', secondError)
        console.log('📦 Retornando lista vacía como fallback')
        return []
      }
    }
  }

  async getOrderById(orderId: number): Promise<OrderResponse> {
    try {
      const response = await api.get(`${this.baseUrl}/orders/${orderId}`)
      return response.data
    } catch (error: any) {
      console.error('Error fetching order:', error)
      throw new Error(error.response?.data?.message || 'Pedido no encontrado')
    }
  }

  async updateOrderStatus(orderId: number, status: OrderStatus): Promise<OrderResponse> {
    try {
      const response = await api.put(`${this.baseUrl}/orders/${orderId}/status`, {
        status
      })
      return response.data
    } catch (error: any) {
      console.error('Error updating order status:', error)
      throw new Error(error.response?.data?.message || 'Error al actualizar el pedido')
    }
  }

  async cancelOrder(orderId: number, reason?: string): Promise<OrderResponse> {
    try {
      const response = await api.post(`${this.baseUrl}/Orders/${orderId}/cancel`, {
        reason
      })
      return response.data
    } catch (error: any) {
      console.error('Error cancelling order (original AxiosError):', error)
      throw error;
    }
  }

  async validatePromoCode(
    code: string,
    restaurantId: number,
    subtotal: number
  ): Promise<PromoCodeValidation> {
    try {
      const response = await api.post(`${this.baseUrl}/promocodes/validate`, {
        code,
        restaurantId,
        subtotal
      })
      return {
        valid: response.data.valid,
        discount: response.data.discount || 0,
        message: response.data.message,
        code: response.data.code
      }
    } catch (error: any) {
      console.error('Error validating promo code:', error)
      return {
        valid: false,
        discount: 0,
        message: error.response?.data?.message || 'Código promocional inválido'
      }
    }
  }

  async getAvailableDeliveryTimes(
    restaurantId: number,
    addressId: number,
    date: string
  ): Promise<string[]> {
    try {
      const response = await api.get(
        `${this.baseUrl}/restaurants/${restaurantId}/delivery-times`,
        {
          params: { addressId, date }
        }
      )
      return response.data || []
    } catch (error: any) {
      console.error('Error fetching delivery times:', error)
      return this.generateBasicTimeSlots(date)
    }
  }

  async estimateDeliveryTime(
    restaurantId: number,
    addressId: number
  ): Promise<{ estimatedMinutes: number; estimatedTime: string }> {
    try {
      const response = await api.get(
        `${this.baseUrl}/restaurants/${restaurantId}/estimate-delivery`,
        {
          params: { addressId }
        }
      )
      return response.data
    } catch (error: any) {
      console.error('Error estimating delivery time:', error)
      const estimatedMinutes = 35
      const estimatedTime = new Date(Date.now() + estimatedMinutes * 60000).toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      })
      return { estimatedMinutes, estimatedTime }
    }
  }

  calculateOrderSummary(
    items: { price: number; quantity: number }[],
    deliveryFee: number = 0,
    taxRate: number = 0.16,
    promoDiscount: number = 0
  ): OrderSummary {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const subtotalAfterPromo = Math.max(0, subtotal - promoDiscount)
    const tax = subtotalAfterPromo * taxRate
    const total = subtotalAfterPromo + deliveryFee + tax
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
    return {
      subtotal: subtotalAfterPromo,
      deliveryFee,
      tax,
      total,
      savings: promoDiscount,
      itemCount
    }
  }

  getOrderStatusText(status: OrderStatus): string {
    const statusTexts: Record<OrderStatus, string> = {
      [OrderStatus.PENDING]: 'Pendiente',
      [OrderStatus.ACCEPTED]: 'Aceptado',
      [OrderStatus.PREPARING]: 'Preparando',
      [OrderStatus.READY_FOR_PICKUP]: 'Listo para recoger',
      [OrderStatus.ON_THE_WAY]: 'En camino',
      [OrderStatus.DELIVERED]: 'Entregado',
      [OrderStatus.CANCELLED]: 'Cancelado'
    }
    return statusTexts[status] || status
  }

  getOrderStatusClass(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.DELIVERED:
        return 'status--delivered'
      case OrderStatus.CANCELLED:
        return 'status--cancelled'
      case OrderStatus.ON_THE_WAY:
        return 'status--on-the-way'
      case OrderStatus.ACCEPTED:
      case OrderStatus.PREPARING:
      case OrderStatus.READY_FOR_PICKUP:
        return 'status--preparing'
      default:
        return 'status--pending'
    }
  }

  canCancelOrder(order: OrderResponse): boolean {
    return [OrderStatus.PENDING, OrderStatus.ACCEPTED].includes(order.status)
  }

  canReorderOrder(order: OrderResponse): boolean {
    return [OrderStatus.DELIVERED, OrderStatus.CANCELLED].includes(order.status)
  }

  formatOrderDate(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    if (diffDays === 0) {
      return `Hoy, ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`
    } else if (diffDays === 1) {
      return `Ayer, ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`
    } else if (diffDays < 7) {
      return `Hace ${diffDays} días`
    } else {
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: diffDays > 365 ? 'numeric' : undefined
      })
    }
  }

  summarizeOrderItems(items: { productName: string; quantity: number }[]): string {
    if (!items || items.length === 0) return 'Sin productos'
    const itemSummary = items
      .map(item => `${item.quantity}× ${item.productName}`)
      .join(', ')
    return itemSummary.length > 60 ? itemSummary.substring(0, 57) + '...' : itemSummary
  }

  private generateBasicTimeSlots(date: string): string[] {
    const slots: string[] = []
    const selectedDate = new Date(date + 'T00:00:00')
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const isToday = selectedDate.getTime() === today.getTime()
    const currentHour = new Date().getHours()
    let startHour = 11
    if (isToday) {
      startHour = Math.max(startHour, currentHour + 1)
    }
    for (let hour = startHour; hour <= 22; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`)
      if (hour < 22) {
        slots.push(`${hour.toString().padStart(2, '0')}:30`)
      }
    }
    return slots
  }

  async trackOrder(orderId: number): Promise<{
    currentStatus: OrderStatus
    estimatedDelivery: string
    steps: { status: OrderStatus; completed: boolean; timestamp?: string }[]
  }> {
    try {
      const response = await api.get(`${this.baseUrl}/orders/${orderId}/track`)
      return response.data
    } catch (error: any) {
      console.error('Error tracking order:', error)
      const order = await this.getOrderById(orderId)
      return {
        currentStatus: order.status,
        estimatedDelivery: order.estimatedDeliveryTime,
        steps: [
          { status: OrderStatus.PENDING, completed: true },
          { status: OrderStatus.ACCEPTED, completed: order.status !== OrderStatus.PENDING },
          { status: OrderStatus.PREPARING, completed: false },
          { status: OrderStatus.ON_THE_WAY, completed: false },
          { status: OrderStatus.DELIVERED, completed: false }
        ]
      }
    }
  }
}

export const orderService = new OrderService()
export default orderService
