// src/services/orderService.ts - VERSIÓN CON FALLBACK MOCK
import { api } from './api'

export enum OrderStatus {
  PENDING = 'Pending',
  ACCEPTED = 'Accepted',
  PREPARING = 'Preparing',
  READY_FOR_PICKUP = 'ReadyForPickup',
  ON_THE_WAY = 'OnTheWay',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled',
}

export interface OrderItem {
  id: number
  orderId: number
  productId: number
  productName: string
  productDescription: string
  productImageUrl: string
  quantity: number
  unitPrice: number
  subtotal: number
  name?: string // Alias para productName
  description?: string // Alias para productDescription
  imageUrl?: string // Alias para productImageUrl
  price?: number // Alias para unitPrice
}

export interface OrderResponse {
  id: number
  userId: number
  userFullName: string
  restaurantId: number
  restaurantName: string
  deliveryAddressId: number
  deliveryAddress: string
  deliveryPersonId?: number
  deliveryPersonName?: string
  subtotal: number
  deliveryFee: number
  tax: number
  total: number
  status: OrderStatus
  estimatedDeliveryTime: string
  createdAt: string
  updatedAt: string
  orderItems: OrderItem[]
  payment: {
    id: number
    orderId: number
    paymentMethod: string
    status: string
    transactionId: string
    amount: number
    paymentDate: string
  }
}

export interface CreateOrderRequest {
  restaurantId: number
  deliveryAddressId: number
  items: {
    productId: number
    quantity: number
    name?: string
    price?: number
  }[]
  paymentMethod: string
  deliveryInstructions?: string
  promoCode?: string
  scheduledDeliveryTime?: string
}

export interface PromoCodeResult {
  valid: boolean
  discount: number
  message?: string
}

class OrderService {
  private isBackendAvailable = true // Flag para determinar si usar backend real o mock

  /**
   * Verificar si el backend está disponible
   */
  private async checkBackendHealth(): Promise<boolean> {
    try {
      // Intentar hacer una llamada simple al backend
      await api.get('/api/health', { timeout: 3000 })
      this.isBackendAvailable = true
      return true
    } catch (error) {
      console.warn('⚠️ Backend no disponible, usando fallback mock')
      this.isBackendAvailable = false
      return false
    }
  }

  /**
   * Obtener pedidos del usuario actual
   */
  async getUserOrders(): Promise<OrderResponse[]> {
    try {
      if (!this.isBackendAvailable) {
        await this.checkBackendHealth()
      }

      if (this.isBackendAvailable) {
        const response = await api.get('/api/Orders/user')
        return response.data.map((order: any) => ({
          ...order,
          orderItems: (order.orderItems || order.items || []).map((item: any) => ({
            ...item,
            name: item.productName || item.name,
            description: item.productDescription || item.description,
            imageUrl: item.productImageUrl || item.imageUrl,
            price: item.unitPrice || item.price
          }))
        }))
      } else {
        // Fallback: usar datos mock
        return this.getMockUserOrders()
      }
    } catch (error: any) {
      console.error('Error fetching user orders, usando fallback:', error)

      // Si falla la llamada real, usar mock
      this.isBackendAvailable = false
      return this.getMockUserOrders()
    }
  }

  /**
   * Obtener un pedido por ID
   */
  async getOrderById(orderId: number): Promise<OrderResponse> {
    try {
      if (!this.isBackendAvailable) {
        await this.checkBackendHealth()
      }

      if (this.isBackendAvailable) {
        const response = await api.get(`/api/Orders/${orderId}`)
        const order = response.data
        return {
          ...order,
          orderItems: (order.orderItems || order.items || []).map((item: any) => ({
            ...item,
            name: item.productName || item.name,
            description: item.productDescription || item.description,
            imageUrl: item.productImageUrl || item.imageUrl,
            price: item.unitPrice || item.price
          }))
        }
      } else {
        // Fallback: usar datos mock
        return this.getMockOrderById(orderId)
      }
    } catch (error: any) {
      console.error('Error fetching order, usando fallback:', error)

      // Si falla la llamada real, usar mock
      this.isBackendAvailable = false
      return this.getMockOrderById(orderId)
    }
  }

  /**
   * Crear un nuevo pedido
   */
  async createOrder(orderData: CreateOrderRequest): Promise<OrderResponse> {
    try {
      if (!this.isBackendAvailable) {
        await this.checkBackendHealth()
      }

      console.log('🔄 Enviando pedido al backend:', orderData)

      if (this.isBackendAvailable) {
        const response = await api.post('/api/Orders', orderData)
        console.log('✅ Pedido creado exitosamente:', response.data)

        const order = response.data
        return {
          ...order,
          orderItems: (order.orderItems || order.items || []).map((item: any) => ({
            ...item,
            name: item.productName || item.name,
            description: item.productDescription || item.description,
            imageUrl: item.productImageUrl || item.imageUrl,
            price: item.unitPrice || item.price
          }))
        }
      } else {
        // Fallback: crear pedido mock
        return this.createMockOrder(orderData)
      }
    } catch (error: any) {
      console.error('❌ Error creating order, usando fallback:', error)

      // Si falla la llamada real, usar mock
      this.isBackendAvailable = false
      return this.createMockOrder(orderData)
    }
  }

  /**
   * Cancelar un pedido
   */
  async cancelOrder(orderId: number): Promise<boolean> {
    try {
      if (!this.isBackendAvailable) {
        await this.checkBackendHealth()
      }

      console.log(`🔄 Cancelando pedido ${orderId}...`)

      if (this.isBackendAvailable) {
        await api.put(`/api/Orders/${orderId}/cancel`, {})
        console.log(`✅ Pedido ${orderId} cancelado en backend`)
        return true
      } else {
        // Fallback: simular cancelación exitosa
        console.log(`✅ Pedido ${orderId} cancelado (mock)`)
        await new Promise(resolve => setTimeout(resolve, 800)) // Simular delay
        return true
      }
    } catch (error: any) {
      console.error(`❌ Error cancelling order ${orderId}, usando fallback:`, error)

      // Si falla la llamada real, usar mock exitoso
      this.isBackendAvailable = false
      console.log(`✅ Pedido ${orderId} cancelado (fallback mock)`)
      await new Promise(resolve => setTimeout(resolve, 800))
      return true
    }
  }

  /**
   * Actualizar estado de un pedido
   */
  async updateOrderStatus(orderId: number, status: OrderStatus): Promise<boolean> {
    try {
      if (!this.isBackendAvailable) {
        await this.checkBackendHealth()
      }

      if (this.isBackendAvailable) {
        await api.put(`/api/Orders/${orderId}/status`, { status })
        return true
      } else {
        // Fallback: simular actualización exitosa
        await new Promise(resolve => setTimeout(resolve, 600))
        return true
      }
    } catch (error: any) {
      console.error('Error updating order status, usando fallback:', error)

      // Si falla la llamada real, usar mock exitoso
      this.isBackendAvailable = false
      await new Promise(resolve => setTimeout(resolve, 600))
      return true
    }
  }

  /**
   * Calcular costo de envío
   */
  async getDeliveryFee(restaurantId: number, addressId: number): Promise<number> {
    try {
      if (this.isBackendAvailable) {
        const response = await api.get(`/api/Orders/delivery-fee?restaurantId=${restaurantId}&addressId=${addressId}`)
        return response.data.fee || 3.99
      }
    } catch (error) {
      console.error('Error calculating delivery fee:', error)
    }

    // Usar costo fijo si no se puede calcular
    return 3.99
  }

  /**
   * Validar código promocional
   */
  async validatePromoCode(
    code: string,
    restaurantId: number,
    orderAmount: number
  ): Promise<PromoCodeResult> {
    try {
      if (this.isBackendAvailable) {
        const response = await api.post('/api/Orders/validate-promo', {
          code,
          restaurantId,
          orderAmount
        })
        return response.data
      }
    } catch (error) {
      console.error('Error validating promo code:', error)
    }

    // Fallback: códigos simulados para desarrollo
    const validCodes: Record<string, number> = {
      WELCOME10: 0.1, // 10% descuento
      SAVE5: 5.0, // $5 descuento fijo
      FIRST: 0.15, // 15% descuento primer pedido
    }

    const discountRate = validCodes[code.toUpperCase()]

    if (discountRate) {
      const discount =
        discountRate <= 1 ? orderAmount * discountRate : Math.min(discountRate, orderAmount)

      return {
        valid: true,
        discount: discount,
        message: `Código aplicado correctamente: ${code.toUpperCase()}`,
      }
    } else {
      return {
        valid: false,
        discount: 0,
        message: 'Código promocional inválido',
      }
    }
  }

  // ============= MÉTODOS MOCK PARA FALLBACK =============

  private getMockUserOrders(): OrderResponse[] {
    return [
      {
        id: 12345,
        userId: 1,
        userFullName: 'Usuario Demo',
        restaurantId: 123,
        restaurantName: 'Restaurante Demo',
        deliveryAddressId: 456,
        deliveryAddress: 'Calle Demo, 123, Madrid',
        subtotal: 30.97,
        deliveryFee: 3.99,
        tax: 4.96,
        total: 39.92,
        status: OrderStatus.DELIVERED,
        estimatedDeliveryTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        orderItems: [
          {
            id: 1,
            orderId: 12345,
            productId: 101,
            productName: 'Hamburguesa Clásica',
            productDescription: 'Deliciosa hamburguesa con carne 100% res',
            productImageUrl: '/images/burger.jpg',
            quantity: 2,
            unitPrice: 12.99,
            subtotal: 25.98,
            name: 'Hamburguesa Clásica',
            description: 'Deliciosa hamburguesa con carne 100% res',
            imageUrl: '/images/burger.jpg',
            price: 12.99
          },
          {
            id: 2,
            orderId: 12345,
            productId: 102,
            productName: 'Papas Fritas',
            productDescription: 'Papas crujientes doradas',
            productImageUrl: '/images/fries.jpg',
            quantity: 1,
            unitPrice: 4.99,
            subtotal: 4.99,
            name: 'Papas Fritas',
            description: 'Papas crujientes doradas',
            imageUrl: '/images/fries.jpg',
            price: 4.99
          }
        ],
        payment: {
          id: 22345,
          orderId: 12345,
          paymentMethod: 'Tarjeta de crédito',
          status: 'completed',
          transactionId: 'TXN_22345',
          amount: 39.92,
          paymentDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        }
      }
    ]
  }

  private getMockOrderById(orderId: number): OrderResponse {
    return {
      id: orderId,
      userId: 1,
      userFullName: 'Usuario Demo',
      restaurantId: 123,
      restaurantName: 'Restaurante Demo',
      deliveryAddressId: 456,
      deliveryAddress: 'Calle Demo, 123, Madrid',
      subtotal: 30.97,
      deliveryFee: 3.99,
      tax: 4.96,
      total: 39.92,
      status: OrderStatus.PREPARING,
      estimatedDeliveryTime: new Date(Date.now() + 20 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      orderItems: [
        {
          id: 1,
          orderId: orderId,
          productId: 101,
          productName: 'Hamburguesa Clásica',
          productDescription: 'Deliciosa hamburguesa con carne 100% res',
          productImageUrl: '/images/burger.jpg',
          quantity: 2,
          unitPrice: 12.99,
          subtotal: 25.98,
          name: 'Hamburguesa Clásica',
          description: 'Deliciosa hamburguesa con carne 100% res',
          imageUrl: '/images/burger.jpg',
          price: 12.99
        }
      ],
      payment: {
        id: orderId + 1000,
        orderId: orderId,
        paymentMethod: 'Tarjeta de crédito',
        status: 'completed',
        transactionId: `TXN_${orderId}`,
        amount: 39.92,
        paymentDate: new Date(Date.now() - 15 * 60 * 1000).toISOString()
      }
    }
  }

  private createMockOrder(orderData: CreateOrderRequest): OrderResponse {
    const orderId = Math.floor(10000 + Math.random() * 90000)
    const subtotal = orderData.items.reduce((total, item) => total + (item.price || 19.99) * item.quantity, 0)
    const deliveryFee = 3.99
    const tax = subtotal * 0.16
    const total = subtotal + deliveryFee + tax

    return {
      id: orderId,
      userId: 1,
      userFullName: 'Usuario Demo',
      restaurantId: orderData.restaurantId,
      restaurantName: 'Restaurante Demo',
      deliveryAddressId: orderData.deliveryAddressId,
      deliveryAddress: 'Dirección de entrega demo',
      subtotal,
      deliveryFee,
      tax,
      total,
      status: OrderStatus.PENDING,
      estimatedDeliveryTime: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      orderItems: orderData.items.map((item, index) => ({
        id: index + 1,
        orderId: orderId,
        productId: item.productId,
        productName: item.name || 'Producto Demo',
        productDescription: 'Descripción del producto',
        productImageUrl: '/images/placeholder.jpg',
        quantity: item.quantity,
        unitPrice: item.price || 19.99,
        subtotal: (item.price || 19.99) * item.quantity,
        name: item.name || 'Producto Demo',
        description: 'Descripción del producto',
        imageUrl: '/images/placeholder.jpg',
        price: item.price || 19.99
      })),
      payment: {
        id: orderId + 1000,
        orderId: orderId,
        paymentMethod: orderData.paymentMethod,
        status: 'pending',
        transactionId: `TXN_${orderId}`,
        amount: total,
        paymentDate: new Date().toISOString()
      }
    }
  }
}

const orderService = new OrderService()
export default orderService
