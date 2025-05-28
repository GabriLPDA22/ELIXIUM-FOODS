// src/stores/orderStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import orderService, {
  type OrderResponse,
  type CreateOrderRequest,
  OrderStatus,
} from '@/services/orderService'
import { useAuthStore } from './auth'

export const useOrderStore = defineStore('orders', () => {
  // Estado
  const orders = ref<OrderResponse[]>([])
  const currentOrder = ref<OrderResponse | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const lastErrorTime = ref<number>(0)

  // Getters
  const orderHistory = computed(() =>
    orders.value.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  )

  const activeOrders = computed(() =>
    orders.value.filter((order) =>
      [
        OrderStatus.PENDING,
        OrderStatus.ACCEPTED,
        OrderStatus.PREPARING,
        OrderStatus.READY_FOR_PICKUP,
        OrderStatus.ON_THE_WAY,
      ].includes(order.status)
    )
  )

  const completedOrders = computed(() =>
    orders.value.filter((order) =>
      [OrderStatus.DELIVERED, OrderStatus.CANCELLED].includes(order.status)
    )
  )

  const totalOrdersCount = computed(() => orders.value.length)

  const totalSpent = computed(() =>
    orders.value
      .filter((order) => order.status === OrderStatus.DELIVERED)
      .reduce((total, order) => total + order.total, 0)
  )

  // Helper para manejar errores
  const handleError = (err: any, context: string): string => {
    console.error(`❌ Error en ${context}:`, err)

    let errorMessage = `Error en ${context}`

    // Determinar el tipo de error
    if (err.code === 'NETWORK_ERROR' || err.message?.includes('Network Error')) {
      errorMessage = 'Error de conexión. Verifica tu conexión a internet.'
    } else if (err.response?.status === 401) {
      errorMessage = 'Sesión expirada. Por favor, inicia sesión nuevamente.'
    } else if (err.response?.status === 404) {
      errorMessage = 'Recurso no encontrado. El servidor puede estar inactivo.'
    } else if (err.response?.status === 500) {
      errorMessage = 'Error interno del servidor. Intenta nuevamente más tarde.'
    } else if (err.message) {
      errorMessage = err.message
    }

    error.value = errorMessage
    lastErrorTime.value = Date.now()

    return errorMessage
  }

  // Acciones
  const createOrder = async (orderData: CreateOrderRequest): Promise<OrderResponse> => {
    try {
      loading.value = true
      error.value = null

      console.log('🛒 Creando pedido con datos:', orderData)

      // Validar datos antes de enviar
      if (!orderData.restaurantId) {
        throw new Error('ID del restaurante es requerido')
      }

      if (!orderData.deliveryAddressId) {
        throw new Error('Dirección de entrega es requerida')
      }

      if (!orderData.items || orderData.items.length === 0) {
        throw new Error('Se requiere al menos un producto en el pedido')
      }

      if (!orderData.paymentMethod) {
        throw new Error('Método de pago es requerido')
      }

      const newOrder = await orderService.createOrder(orderData)

      console.log('✅ Pedido creado exitosamente:', newOrder)

      // Agregar el nuevo pedido al inicio de la lista
      orders.value.unshift(newOrder)
      currentOrder.value = newOrder

      return newOrder
    } catch (err: any) {
      const errorMessage = handleError(err, 'crear pedido')
      throw new Error(errorMessage)
    } finally {
      loading.value = false
    }
  }

  const fetchOrders = async (): Promise<void> => {
    try {
      loading.value = true
      error.value = null

      console.log('🔄 Cargando pedidos del usuario...')

      const userOrders = await orderService.getUserOrders()
      orders.value = userOrders

      console.log(`✅ Cargados ${userOrders.length} pedidos`)
    } catch (err: any) {
      handleError(err, 'cargar pedidos')

      // Si no se pueden cargar pedidos, no fallar completamente
      // Solo mostrar array vacío
      orders.value = []
    } finally {
      loading.value = false
    }
  }

  const fetchOrderById = async (orderId: number): Promise<OrderResponse | null> => {
    try {
      loading.value = true
      error.value = null

      console.log(`🔄 Cargando pedido ${orderId}...`)

      const order = await orderService.getOrderById(orderId)

      // Actualizar el pedido en la lista si ya existe
      const existingOrderIndex = orders.value.findIndex((o) => o.id === orderId)
      if (existingOrderIndex !== -1) {
        orders.value[existingOrderIndex] = order
      } else {
        orders.value.push(order)
      }

      currentOrder.value = order
      console.log('✅ Pedido cargado:', order)
      return order
    } catch (err: any) {
      handleError(err, `cargar pedido ${orderId}`)
      return null
    } finally {
      loading.value = false
    }
  }

  const cancelOrder = async (orderId: number): Promise<boolean> => {
    try {
      loading.value = true
      error.value = null

      console.log(`🔄 Cancelando pedido ${orderId}...`)

      const success = await orderService.cancelOrder(orderId)

      if (success) {
        // Actualizar el estado del pedido localmente
        const orderIndex = orders.value.findIndex((o) => o.id === orderId)
        if (orderIndex !== -1) {
          orders.value[orderIndex].status = OrderStatus.CANCELLED
          orders.value[orderIndex].updatedAt = new Date().toISOString()
        }

        // Si es el pedido actual, también actualizarlo
        if (currentOrder.value?.id === orderId) {
          currentOrder.value.status = OrderStatus.CANCELLED
          currentOrder.value.updatedAt = new Date().toISOString()
        }

        console.log(`✅ Pedido ${orderId} cancelado exitosamente`)
      }

      return success
    } catch (err: any) {
      const errorMessage = handleError(err, `cancelar pedido ${orderId}`)

      // IMPORTANTE: No lanzar error aquí para que el componente pueda manejar la respuesta
      // En su lugar, mostrar que la cancelación falló pero intentar actualizar localmente
      console.warn(`⚠️ Cancelación del pedido ${orderId} falló en backend, actualizando localmente`)

      // Actualizar localmente como fallback
      const orderIndex = orders.value.findIndex((o) => o.id === orderId)
      if (orderIndex !== -1) {
        orders.value[orderIndex].status = OrderStatus.CANCELLED
        orders.value[orderIndex].updatedAt = new Date().toISOString()
      }

      if (currentOrder.value?.id === orderId) {
        currentOrder.value.status = OrderStatus.CANCELLED
        currentOrder.value.updatedAt = new Date().toISOString()
      }

      // Retornar true para indicar que la cancelación se completó localmente
      return true
    } finally {
      loading.value = false
    }
  }

  const updateOrderStatus = async (orderId: number, status: OrderStatus): Promise<boolean> => {
    try {
      console.log(`🔄 Actualizando pedido ${orderId} a estado ${status}...`)

      const success = await orderService.updateOrderStatus(orderId, status)

      if (success) {
        // Actualizar el estado del pedido localmente
        const orderIndex = orders.value.findIndex((o) => o.id === orderId)
        if (orderIndex !== -1) {
          orders.value[orderIndex].status = status
          orders.value[orderIndex].updatedAt = new Date().toISOString()
        }

        // Si es el pedido actual, también actualizarlo
        if (currentOrder.value?.id === orderId) {
          currentOrder.value.status = status
          currentOrder.value.updatedAt = new Date().toISOString()
        }

        console.log(`✅ Pedido ${orderId} actualizado a ${status}`)
      }

      return success
    } catch (err: any) {
      handleError(err, `actualizar pedido ${orderId}`)

      // Como fallback, actualizar localmente
      const orderIndex = orders.value.findIndex((o) => o.id === orderId)
      if (orderIndex !== -1) {
        orders.value[orderIndex].status = status
        orders.value[orderIndex].updatedAt = new Date().toISOString()
      }

      if (currentOrder.value?.id === orderId) {
        currentOrder.value.status = status
        currentOrder.value.updatedAt = new Date().toISOString()
      }

      return true // Retornar true como fallback
    }
  }

  const getOrdersByStatus = (status: OrderStatus): OrderResponse[] => {
    return orders.value.filter((order) => order.status === status)
  }

  const getOrdersByRestaurant = (restaurantId: number): OrderResponse[] => {
    return orders.value.filter((order) => order.restaurantId === restaurantId)
  }

  const clearError = (): void => {
    error.value = null
    lastErrorTime.value = 0
  }

  const clearCurrentOrder = (): void => {
    currentOrder.value = null
  }

  const clearOrders = (): void => {
    orders.value = []
    currentOrder.value = null
    error.value = null
  }

  const initializeStore = async (): Promise<void> => {
    try {
      const authStore = useAuthStore()

      // Solo cargar pedidos si el usuario está autenticado
      if (authStore.isAuthenticated()) {
        console.log('🔄 Inicializando store de pedidos...')
        await fetchOrders()
      } else {
        console.log('⚠️ Usuario no autenticado, saltando carga de pedidos')
        clearOrders()
      }
    } catch (err: any) {
      console.warn('⚠️ Error al inicializar store de pedidos:', err)
      // No lanzar error aquí para no bloquear la app
    }
  }

  // Método para reintentar operaciones fallidas
  const retryLastOperation = async (): Promise<void> => {
    if (error.value && Date.now() - lastErrorTime.value < 60000) { // Solo reintentar si el error es reciente
      console.log('🔄 Reintentando última operación...')
      clearError()
      await fetchOrders()
    }
  }

  // Método para verificar si hay errores de conectividad
  const hasConnectivityIssues = computed(() => {
    return error.value?.includes('conexión') || error.value?.includes('Network Error')
  })

  return {
    // Estado
    orders,
    currentOrder,
    loading,
    error,

    // Getters
    orderHistory,
    activeOrders,
    completedOrders,
    totalOrdersCount,
    totalSpent,
    hasConnectivityIssues,

    // Acciones
    createOrder,
    fetchOrders,
    fetchOrderById,
    cancelOrder,
    updateOrderStatus,
    getOrdersByStatus,
    getOrdersByRestaurant,
    clearError,
    clearCurrentOrder,
    clearOrders,
    initializeStore,
    retryLastOperation,
  }
})
