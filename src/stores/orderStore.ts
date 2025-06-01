import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Order, CreateOrderRequest } from '@/types'
import orderService, { OrderStatus, type OrderResponse } from '@/services/orderService'

export const useOrderStore = defineStore('order', () => {
  const currentOrder = ref<Order | null>(null)
  const orderHistory = ref<OrderResponse[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const lastOrderId = ref<number | null>(null)

  const hasOrders = computed(() => orderHistory.value.length > 0)

  const recentOrders = computed(() =>
    orderHistory.value
      .slice()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
  )

  const activeOrders = computed(() =>
    orderHistory.value.filter(order =>
      ![OrderStatus.DELIVERED, OrderStatus.CANCELLED].includes(order.status)
    )
  )

  const completedOrders = computed(() =>
    orderHistory.value.filter(order =>
      [OrderStatus.DELIVERED, OrderStatus.CANCELLED].includes(order.status)
    )
  )

  async function createOrder(orderData: CreateOrderRequest): Promise<Order> {
    try {
      loading.value = true
      error.value = null
      console.log('🚀 Creando pedido desde store:', orderData)
      const order = await orderService.createOrder(orderData)
      currentOrder.value = order
      lastOrderId.value = order.id
      const existingIndex = orderHistory.value.findIndex(o => o.id === order.id)
      if (existingIndex === -1) {
        orderHistory.value.unshift(order as OrderResponse)
      } else {
        orderHistory.value[existingIndex] = order as OrderResponse
      }
      console.log('✅ Pedido creado exitosamente:', order)
      return order
    } catch (err: any) {
      error.value = err.message
      console.error('❌ Error creando pedido:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchOrders(): Promise<void> {
    try {
      loading.value = true
      error.value = null
      const orders = await orderService.getUserOrders()
      orderHistory.value = orders.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      console.log('✅ Pedidos cargados:', orders.length)
    } catch (err: any) {
      error.value = err.message
      console.error('❌ Error cargando pedidos:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchOrderById(orderId: number): Promise<OrderResponse> {
    try {
      loading.value = true
      error.value = null
      const order = await orderService.getOrderById(orderId)
      const existingIndex = orderHistory.value.findIndex(o => o.id === orderId)
      if (existingIndex !== -1) {
        orderHistory.value[existingIndex] = order
      } else {
        orderHistory.value.unshift(order)
      }
      if (currentOrder.value?.id === orderId) {
        currentOrder.value = order as Order
      }
      return order
    } catch (err: any) {
      error.value = err.message
      console.error('❌ Error cargando pedido:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateOrderStatus(orderId: number, status: OrderStatus): Promise<OrderResponse> {
    try {
      loading.value = true
      error.value = null
      const updatedOrder = await orderService.updateOrderStatus(orderId, status)
      const existingIndex = orderHistory.value.findIndex(o => o.id === orderId)
      if (existingIndex !== -1) {
        orderHistory.value[existingIndex] = updatedOrder
      }
      if (currentOrder.value?.id === orderId) {
        currentOrder.value = updatedOrder as Order
      }
      console.log('✅ Estado del pedido actualizado:', { orderId, status })
      return updatedOrder
    } catch (err: any) {
      error.value = err.message
      console.error('❌ Error actualizando estado del pedido:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function cancelOrder(orderId: number, reason?: string): Promise<OrderResponse> {
    try {
      loading.value = true
      error.value = null
      const cancelledOrder = await orderService.cancelOrder(orderId, reason)
      const existingIndex = orderHistory.value.findIndex(o => o.id === orderId)
      if (existingIndex !== -1) {
        orderHistory.value[existingIndex] = cancelledOrder
      }
      if (currentOrder.value?.id === orderId) {
        currentOrder.value = cancelledOrder as Order
      }
      console.log('✅ Pedido cancelado:', orderId)
      return cancelledOrder
    } catch (err: any) {
      error.value = err.message
      console.error('❌ Error cancelando pedido:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function trackOrder(orderId: number): Promise<{
    currentStatus: OrderStatus
    estimatedDelivery: string
    steps: { status: OrderStatus; completed: boolean; timestamp?: string }[]
  }> {
    try {
      const trackingInfo = await orderService.trackOrder(orderId)
      console.log('✅ Información de rastreo obtenida:', trackingInfo)
      return trackingInfo
    } catch (err: any) {
      console.error('❌ Error rastreando pedido:', err)
      throw err
    }
  }

  async function validatePromoCode(
    code: string,
    restaurantId: number,
    subtotal: number
  ): Promise<{ valid: boolean; discount: number; message?: string }> {
    try {
      const result = await orderService.validatePromoCode(code, restaurantId, subtotal)
      console.log('✅ Código promocional validado:', result)
      return result
    } catch (err: any) {
      console.error('❌ Error validando código promocional:', err)
      return {
        valid: false,
        discount: 0,
        message: err.message || 'Error al validar código promocional'
      }
    }
  }

  async function getAvailableDeliveryTimes(
    restaurantId: number,
    addressId: number,
    date: string
  ): Promise<string[]> {
    try {
      const times = await orderService.getAvailableDeliveryTimes(restaurantId, addressId, date)
      return times
    } catch (err: any) {
      console.error('❌ Error obteniendo tiempos de entrega:', err)
      return []
    }
  }

  async function estimateDeliveryTime(
    restaurantId: number,
    addressId: number
  ): Promise<{ estimatedMinutes: number; estimatedTime: string }> {
    try {
      const estimate = await orderService.estimateDeliveryTime(restaurantId, addressId)
      return estimate
    } catch (err: any) {
      console.error('❌ Error estimando tiempo de entrega:', err)
      return {
        estimatedMinutes: 35,
        estimatedTime: new Date(Date.now() + 35 * 60000).toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit'
        })
      }
    }
  }

  function findOrderById(orderId: number): OrderResponse | undefined {
    return orderHistory.value.find(order => order.id === orderId)
  }

  function canCancelOrder(order: OrderResponse): boolean {
    return orderService.canCancelOrder(order)
  }

  function canReorderOrder(order: OrderResponse): boolean {
    return orderService.canReorderOrder(order)
  }

  function getOrderStatusText(status: OrderStatus): string {
    return orderService.getOrderStatusText(status)
  }

  function getOrderStatusClass(status: OrderStatus): string {
    return orderService.getOrderStatusClass(status)
  }

  function formatOrderDate(dateString: string): string {
    return orderService.formatOrderDate(dateString)
  }

  function summarizeOrderItems(items: { productName: string; quantity: number }[]): string {
    return orderService.summarizeOrderItems(items)
  }

  function clearState(): void {
    currentOrder.value = null
    orderHistory.value = []
    error.value = null
    lastOrderId.value = null
  }

  function clearError(): void {
    error.value = null
  }

  function setCurrentOrder(order: Order): void {
    currentOrder.value = order
    lastOrderId.value = order.id
  }

  return {
    currentOrder,
    orderHistory,
    loading,
    error,
    lastOrderId,
    hasOrders,
    recentOrders,
    activeOrders,
    completedOrders,
    createOrder,
    fetchOrders,
    fetchOrderById,
    updateOrderStatus,
    cancelOrder,
    trackOrder,
    validatePromoCode,
    getAvailableDeliveryTimes,
    estimateDeliveryTime,
    findOrderById,
    canCancelOrder,
    canReorderOrder,
    getOrderStatusText,
    getOrderStatusClass,
    formatOrderDate,
    summarizeOrderItems,
    clearState,
    clearError,
    setCurrentOrder
  }
})
