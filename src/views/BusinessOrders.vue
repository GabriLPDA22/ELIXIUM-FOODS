<template>
  <div class="business-orders">
    <div class="business-orders__header">
      <h1 class="business-orders__title">Gestión de Pedidos</h1>
      <div class="business-orders__actions">
        <div class="business-orders__filter">
          <select v-model="statusFilter" class="business-orders__select">
            <option value="all">Todos los estados</option>
            <option value="Pending">Pendientes</option>
            <option value="Accepted">Aceptados</option>
            <option value="Preparing">En preparación</option>
            <option value="ReadyForPickup">Listos para entrega</option>
            <option value="OnTheWay">En camino</option>
            <option value="Delivered">Entregados</option>
            <option value="Cancelled">Cancelados</option>
          </select>
        </div>
        <div class="business-orders__restaurant-filter" v-if="restaurants.length > 1">
          <select v-model="restaurantFilter" class="business-orders__select">
            <option value="all">Todos los restaurantes</option>
            <option
              v-for="restaurant in restaurants"
              :key="restaurant.id"
              :value="restaurant.id"
            >
              {{ restaurant.name }}
            </option>
          </select>
        </div>
        <div class="business-orders__search">
          <input type="text" v-model="searchQuery" placeholder="Buscar por ID o cliente..."
            class="business-orders__search-input" />
          <button @click="clearSearch" v-if="searchQuery" class="business-orders__search-clear">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div class="business-orders__tabs">
      <button v-for="tab in tabs" :key="tab.value" @click="currentTab = tab.value"
        :class="['business-orders__tab', { 'business-orders__tab--active': currentTab === tab.value }]">
        {{ tab.label }}
        <span class="business-orders__tab-count">{{ getOrdersCountByTab(tab.value) }}</span>
      </button>
    </div>

    <div class="business-orders__content">
      <div v-if="loading" class="business-orders__loading">
        <div class="business-orders__spinner"></div>
        <p>Cargando pedidos...</p>
      </div>

      <div v-else-if="!paginatedOrders || paginatedOrders.length === 0" class="business-orders__empty">
        <div class="business-orders__empty-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
        </div>
        <h3>No hay pedidos</h3>
        <p v-if="searchQuery">No se encontraron resultados para "{{ searchQuery }}"</p>
        <p v-else-if="statusFilter !== 'all'">No hay pedidos con el estado seleccionado</p>
        <p v-else>Aún no tienes pedidos para gestionar</p>
        <button @click="resetFilters" class="business-orders__empty-button">Limpiar filtros</button>
      </div>

      <div v-else-if="isMobileView" class="business-orders__cards">
        <div v-for="order in paginatedOrders" :key="order.id" class="business-orders__card"
          :class="`business-orders__card--${order.status.toLowerCase()}`">
          <div class="business-orders__card-header">
            <div>
              <span class="business-orders__card-id">Pedido #{{ order.id }}</span>
              <span :class="['business-orders__status', `business-orders__status--${order.status.toLowerCase()}`]">
                {{ getStatusLabel(order.status) }}
              </span>
            </div>
            <span class="business-orders__card-date">{{ formatDate(order.createdAt) }}</span>
          </div>

          <div class="business-orders__card-customer">
            <span class="business-orders__card-customer-name">{{ getCustomerName(order) }}</span>
            <span class="business-orders__card-customer-email">{{ order.user?.email || 'Sin email' }}</span>
          </div>

          <div class="business-orders__card-info">
            <div class="business-orders__card-info-item">
              <span class="business-orders__card-label">Items:</span>
              <span class="business-orders__card-value">{{ order.orderItems?.length || 0 }}</span>
            </div>
            <div class="business-orders__card-info-item">
              <span class="business-orders__card-label">Total:</span>
              <span class="business-orders__card-value business-orders__card-total">
                {{ formatCurrency(order.total) }}
              </span>
            </div>
          </div>

          <div class="business-orders__card-actions">
            <button @click="viewOrder(order)" class="business-orders__card-btn business-orders__card-btn--view">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              Ver detalles
            </button>

            <button v-if="canUpdateStatus(order.status)" @click="updateOrderStatus(order)"
              class="business-orders__card-btn business-orders__card-btn--update">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="23 4 23 10 17 10"></polyline>
                <polyline points="1 20 1 14 7 14"></polyline>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
              </svg>
              Actualizar estado
            </button>
          </div>
        </div>
      </div>

      <div v-else class="business-orders__table-container">
        <table class="business-orders__table">
          <thead>
            <tr>
              <th>Pedido #</th>
              <th>Cliente</th>
              <th>Restaurante</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in paginatedOrders" :key="order.id" class="business-orders__row">
              <td class="business-orders__order-id">{{ order.id }}</td>
              <td>
                <div class="business-orders__customer">
                  <span class="business-orders__customer-name">{{ getCustomerName(order) }}</span>
                  <span class="business-orders__customer-email">{{ order.user?.email || 'Sin email' }}</span>
                </div>
              </td>
              <td>
                <div class="business-orders__restaurant">
                  <span class="business-orders__restaurant-name">{{ order.restaurant?.name || 'Restaurant' }}</span>
                </div>
              </td>
              <td>
                <div class="business-orders__date">
                  <span class="business-orders__date-full">{{ formatDate(order.createdAt) }}</span>
                  <span class="business-orders__date-time">{{ formatTime(order.createdAt) }}</span>
                </div>
              </td>
              <td class="business-orders__total">{{ formatCurrency(order.total) }}</td>
              <td>
                <span :class="['business-orders__status', `business-orders__status--${order.status.toLowerCase()}`]">
                  {{ getStatusLabel(order.status) }}
                </span>
              </td>
              <td>
                <div class="business-orders__actions-cell">
                  <button @click="viewOrder(order)"
                    class="business-orders__action-btn business-orders__action-btn--view">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    <span class="business-orders__action-label">Ver</span>
                  </button>

                  <button v-if="canUpdateStatus(order.status)" @click="updateOrderStatus(order)"
                    class="business-orders__action-btn business-orders__action-btn--update">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="23 4 23 10 17 10"></polyline>
                      <polyline points="1 20 1 14 7 14"></polyline>
                      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                    </svg>
                    <span class="business-orders__action-label">Actualizar</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="totalPages > 0 && paginatedOrders && paginatedOrders.length > 0" class="business-orders__pagination">
      <button @click="prevPage" :disabled="currentPage === 1" class="business-orders__pagination-btn">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      <span class="business-orders__pagination-info">
        Página {{ currentPage }} de {{ totalPages }}
      </span>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="business-orders__pagination-btn">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>

    <!-- Modal de detalles -->
    <div v-if="selectedOrder" class="business-orders__modal" @click="closeModal">
      <div class="business-orders__modal-content" @click.stop>
        <div class="business-orders__modal-header">
          <h2 class="business-orders__modal-title">Detalles del Pedido #{{ selectedOrder.id }}</h2>
          <button @click="closeModal" class="business-orders__modal-close">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="business-orders__modal-body">
          <div class="business-orders__details-grid">
            <div class="business-orders__detail-section">
              <h3 class="business-orders__section-title">Información del Cliente</h3>
              <div class="business-orders__detail-item">
                <span class="business-orders__detail-label">Nombre:</span>
                <span class="business-orders__detail-value">{{ getCustomerName(selectedOrder) }}</span>
              </div>
              <div class="business-orders__detail-item">
                <span class="business-orders__detail-label">Email:</span>
                <span class="business-orders__detail-value">{{ selectedOrder.user?.email || 'Sin email' }}</span>
              </div>
              <div class="business-orders__detail-item">
                <span class="business-orders__detail-label">Teléfono:</span>
                <span class="business-orders__detail-value">{{ selectedOrder.user?.phoneNumber || 'Sin teléfono' }}</span>
              </div>
            </div>

            <div class="business-orders__detail-section">
              <h3 class="business-orders__section-title">Información de Entrega</h3>
              <div class="business-orders__detail-item">
                <span class="business-orders__detail-label">Dirección:</span>
                <span class="business-orders__detail-value">{{ getDeliveryAddress(selectedOrder) }}</span>
              </div>
              <div class="business-orders__detail-item">
                <span class="business-orders__detail-label">Restaurante:</span>
                <span class="business-orders__detail-value">{{ selectedOrder.restaurant?.name || 'Restaurant' }}</span>
              </div>
              <div class="business-orders__detail-item">
                <span class="business-orders__detail-label">Hora estimada:</span>
                <span class="business-orders__detail-value">{{ formatDateTime(selectedOrder.estimatedDeliveryTime) }}</span>
              </div>
            </div>
          </div>

          <div class="business-orders__detail-section">
            <h3 class="business-orders__section-title">Productos</h3>
            <div class="business-orders__items-table-container">
              <table class="business-orders__items-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in selectedOrder.orderItems || []" :key="item.id" class="business-orders__item-row">
                    <td>
                      <div class="business-orders__product">
                        <div class="business-orders__product-image">
                          <img :src="item.product?.imageUrl || '/Images/product-placeholder.png'" :alt="item.product?.name">
                        </div>
                        <div class="business-orders__product-info">
                          <span class="business-orders__product-name">{{ item.product?.name || 'Producto' }}</span>
                        </div>
                      </div>
                    </td>
                    <td>{{ formatCurrency(item.unitPrice) }}</td>
                    <td>{{ item.quantity }}</td>
                    <td>{{ formatCurrency(item.subtotal) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="business-orders__detail-section">
            <h3 class="business-orders__section-title">Resumen</h3>
            <div class="business-orders__summary">
              <div class="business-orders__summary-item">
                <span class="business-orders__summary-label">Subtotal:</span>
                <span class="business-orders__summary-value">{{ formatCurrency(selectedOrder.subtotal) }}</span>
              </div>
              <div class="business-orders__summary-item">
                <span class="business-orders__summary-label">Envío:</span>
                <span class="business-orders__summary-value">{{ formatCurrency(selectedOrder.deliveryFee) }}</span>
              </div>
              <div class="business-orders__summary-item">
                <span class="business-orders__summary-label">Impuestos:</span>
                <span class="business-orders__summary-value">{{ formatCurrency(selectedOrder.tax) }}</span>
              </div>
              <div class="business-orders__summary-item business-orders__summary-item--total">
                <span class="business-orders__summary-label">Total:</span>
                <span class="business-orders__summary-value">{{ formatCurrency(selectedOrder.total) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="business-orders__modal-footer">
          <button @click="closeModal" class="business-orders__modal-btn business-orders__modal-btn--secondary">
            Cerrar
          </button>

          <div v-if="canUpdateStatus(selectedOrder.status)" class="business-orders__status-actions">
            <button @click="updateStatus(selectedOrder, getNextStatus(selectedOrder.status))"
              class="business-orders__modal-btn business-orders__modal-btn--primary">
              {{ getNextStatusActionLabel(selectedOrder.status) }}
            </button>

            <button v-if="selectedOrder.status !== 'Cancelled' && selectedOrder.status !== 'Delivered'"
              @click="updateStatus(selectedOrder, 'Cancelled')"
              class="business-orders__modal-btn business-orders__modal-btn--danger">
              Cancelar Pedido
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de actualización de estado -->
    <div v-if="statusUpdateOrder" class="business-orders__modal" @click="statusUpdateOrder = null">
      <div class="business-orders__modal-content business-orders__modal-content--small" @click.stop>
        <div class="business-orders__modal-header">
          <h2 class="business-orders__modal-title">Actualizar Estado</h2>
          <button @click="statusUpdateOrder = null" class="business-orders__modal-close">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="business-orders__modal-body">
          <p class="business-orders__status-prompt">
            Pedido #{{ statusUpdateOrder.id }} - {{ getCustomerName(statusUpdateOrder) }}
          </p>

          <div class="business-orders__status-options">
            <button v-for="option in getAvailableStatusOptions(statusUpdateOrder.status)" :key="option.value"
              @click="updateStatus(statusUpdateOrder, option.value)" :class="[
                'business-orders__status-option',
                `business-orders__status-option--${option.value.toLowerCase()}`
              ]">
              <div class="business-orders__status-option-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span>{{ option.label }}</span>
            </button>
          </div>
        </div>

        <div class="business-orders__modal-footer">
          <button @click="statusUpdateOrder = null"
            class="business-orders__modal-btn business-orders__modal-btn--secondary">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { api } from '@/services/api'

const authStore = useAuthStore()

// Estados
const loading = ref(true)
const business = ref(null)
const restaurants = ref([])
const orders = ref([])
const selectedOrder = ref(null)
const statusUpdateOrder = ref(null)
const searchQuery = ref('')
const statusFilter = ref('all')
const restaurantFilter = ref('all')
const currentTab = ref('today')
const currentPage = ref(1)
const pageSize = ref(10)
const isMobileView = ref(false)

const tabs = [
  { label: 'Hoy', value: 'today' },
  { label: 'Pendientes', value: 'pending' },
  { label: 'Historial', value: 'history' }
]

// Cargar datos del business
const loadBusiness = async () => {
  try {
    const userId = authStore.user?.id
    if (!userId) return

    const response = await api.get(`/api/Business/user/${userId}`)
    if (response.data) {
      business.value = response.data
    }
  } catch (error) {
    console.error('Error cargando business:', error)
  }
}

// Cargar restaurantes
const loadRestaurants = async () => {
  try {
    if (!business.value?.id) return

    const response = await api.get(`/api/Restaurants/business/${business.value.id}`)
    if (response.data) {
      restaurants.value = response.data
    }
  } catch (error) {
    console.error('Error cargando restaurantes:', error)
    restaurants.value = []
  }
}

// Cargar pedidos de todos los restaurantes
const loadOrders = async () => {
  if (restaurants.value.length === 0) return

  loading.value = true
  try {
    const allOrdersData = []

    for (const restaurant of restaurants.value) {
      try {
        const ordersResponse = await api.get(`/api/Orders/restaurant/${restaurant.id}`)
        if (ordersResponse.data) {
          allOrdersData.push(...ordersResponse.data)
        }
      } catch (error) {
        console.error(`Error pedidos restaurante ${restaurant.id}:`, error)
      }
    }

    orders.value = allOrdersData
    console.log('Pedidos cargados:', orders.value.length)
  } catch (error) {
    console.error('Error cargando pedidos:', error)
  } finally {
    loading.value = false
  }
}

// Pedidos filtrados
const filteredOrders = computed(() => {
  let result = orders.value

  // Filtrar por estado
  if (statusFilter.value !== 'all') {
    result = result.filter(order => order.status === statusFilter.value)
  }

  // Filtrar por restaurante
  if (restaurantFilter.value !== 'all') {
    result = result.filter(order => order.restaurantId === restaurantFilter.value)
  }

  // Filtrar por búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(order =>
      order.id.toString().includes(query) ||
      getCustomerName(order).toLowerCase().includes(query) ||
      (order.user?.email && order.user.email.toLowerCase().includes(query))
    )
  }

  // Filtrar por tab
  if (currentTab.value === 'today') {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    result = result.filter(order => {
      const orderDate = new Date(order.createdAt)
      orderDate.setHours(0, 0, 0, 0)
      return orderDate.getTime() === today.getTime()
    })
  } else if (currentTab.value === 'pending') {
    result = result.filter(order =>
      ['Pending', 'Accepted', 'Preparing', 'ReadyForPickup'].includes(order.status)
    )
  } else if (currentTab.value === 'history') {
    result = result.filter(order =>
      ['Delivered', 'Cancelled'].includes(order.status)
    )
  }

  return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
})

// Paginación
const paginatedOrders = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value
  return filteredOrders.value.slice(startIndex, startIndex + pageSize.value)
})

const totalPages = computed(() => {
  if (filteredOrders.value.length === 0) return 0
  return Math.ceil(filteredOrders.value.length / pageSize.value)
})

// Funciones de utilidad
const formatDate = (dateStr: string) => {
  if (!dateStr) return 'Sin fecha'
  try {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat('es', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date)
  } catch (error) {
    return 'Fecha inválida'
  }
}

const formatTime = (dateStr: string) => {
  if (!dateStr) return 'Sin hora'
  try {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat('es', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  } catch (error) {
    return 'Hora inválida'
  }
}

const formatDateTime = (dateStr: string) => {
  if (!dateStr) return 'Sin fecha'
  return `${formatDate(dateStr)} ${formatTime(dateStr)}`
}

// FUNCIÓN CORREGIDA - Esta era la que causaba el error
const formatCurrency = (value: number | undefined | null) => {
  // Validar que el valor exista y sea un número válido
  if (value === undefined || value === null || isNaN(value)) {
    return '0,00 €'
  }

  // Convertir a número si es string
  const numericValue = typeof value === 'string' ? parseFloat(value) : value

  // Verificar nuevamente después de la conversión
  if (isNaN(numericValue)) {
    return '0,00 €'
  }

  return numericValue.toFixed(2).replace('.', ',') + ' €'
}

const getStatusLabel = (status: string) => {
  const labels = {
    'Pending': 'Pendiente',
    'Accepted': 'Aceptado',
    'Preparing': 'En preparación',
    'ReadyForPickup': 'Listo',
    'OnTheWay': 'En camino',
    'Delivered': 'Entregado',
    'Cancelled': 'Cancelado'
  }
  return labels[status] || status
}

const getCustomerName = (order: any) => {
  if (order.user) {
    const firstName = order.user.firstName || ''
    const lastName = order.user.lastName || ''
    const fullName = `${firstName} ${lastName}`.trim()
    return fullName || 'Cliente'
  }
  return 'Cliente'
}

const getDeliveryAddress = (order: any) => {
  if (order.deliveryAddress) {
    const street = order.deliveryAddress.street || ''
    const number = order.deliveryAddress.number || ''
    const city = order.deliveryAddress.city || ''
    return `${street} ${number}, ${city}`.trim() || 'Dirección no disponible'
  }
  return 'Dirección no disponible'
}

const getOrdersCountByTab = (tabValue: string) => {
  let filtered = orders.value

  if (tabValue === 'today') {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    filtered = orders.value.filter(order => {
      const orderDate = new Date(order.createdAt)
      orderDate.setHours(0, 0, 0, 0)
      return orderDate.getTime() === today.getTime()
    })
  } else if (tabValue === 'pending') {
    filtered = orders.value.filter(order =>
      ['Pending', 'Accepted', 'Preparing', 'ReadyForPickup'].includes(order.status)
    )
  } else if (tabValue === 'history') {
    filtered = orders.value.filter(order =>
      ['Delivered', 'Cancelled'].includes(order.status)
    )
  }

  return filtered.length
}

const canUpdateStatus = (status: string) => {
  return !['Delivered', 'Cancelled'].includes(status)
}

const getNextStatus = (currentStatus: string) => {
  const statusFlow = {
    'Pending': 'Accepted',
    'Accepted': 'Preparing',
    'Preparing': 'ReadyForPickup',
    'ReadyForPickup': 'OnTheWay',
    'OnTheWay': 'Delivered'
  }
  return statusFlow[currentStatus] || currentStatus
}

const getNextStatusActionLabel = (currentStatus: string) => {
  const labels = {
    'Pending': 'Aceptar Pedido',
    'Accepted': 'Comenzar Preparación',
    'Preparing': 'Marcar como Listo',
    'ReadyForPickup': 'Iniciar Entrega',
    'OnTheWay': 'Confirmar Entrega'
  }
  return labels[currentStatus] || 'Actualizar Estado'
}

const getAvailableStatusOptions = (currentStatus: string) => {
  const options = []

  const nextStatus = getNextStatus(currentStatus)
  if (nextStatus !== currentStatus) {
    options.push({
      label: getNextStatusActionLabel(currentStatus),
      value: nextStatus
    })
  }

  if (!['Delivered', 'Cancelled'].includes(currentStatus)) {
    options.push({ label: 'Cancelar Pedido', value: 'Cancelled' })
  }

  return options
}

// Funciones de interfaz
const updateViewType = () => {
  isMobileView.value = window.innerWidth < 768
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const clearSearch = () => {
  searchQuery.value = ''
}

const resetFilters = () => {
  searchQuery.value = ''
  statusFilter.value = 'all'
  restaurantFilter.value = 'all'
  currentTab.value = 'today'
}

// FUNCIÓN CORREGIDA - viewOrder ahora maneja mejor los datos
const viewOrder = (order: any) => {
  if (!order) {
    console.error('No se puede ver el pedido: datos no válidos')
    return
  }

  console.log('Viendo pedido:', order)
  selectedOrder.value = order
}

const closeModal = () => {
  selectedOrder.value = null
}

const updateOrderStatus = (order: any) => {
  statusUpdateOrder.value = order
}

// Actualizar estado del pedido
const updateStatus = async (order: any, newStatus: string) => {
  try {
    const response = await api.put(`/api/Orders/${order.id}/status`, {
      status: newStatus
    })

    if (response.data) {
      // Actualizar el pedido en la lista local
      const orderIndex = orders.value.findIndex(o => o.id === order.id)
      if (orderIndex !== -1) {
        orders.value[orderIndex] = { ...orders.value[orderIndex], status: newStatus }
      }

      // Actualizar el pedido seleccionado si está abierto
      if (selectedOrder.value && selectedOrder.value.id === order.id) {
        selectedOrder.value = { ...selectedOrder.value, status: newStatus }
      }

      console.log(`Pedido #${order.id} actualizado a estado: ${newStatus}`)
    }
  } catch (error) {
    console.error('Error actualizando estado del pedido:', error)
    // Aquí podrías mostrar una notificación de error
  } finally {
    statusUpdateOrder.value = null
  }
}

// Lifecycle hooks
onMounted(async () => {
  if (!authStore.isAuthenticated) {
    return
  }

  updateViewType()
  window.addEventListener('resize', updateViewType)

  // Cargar datos en secuencia
  await loadBusiness()
  await loadRestaurants()
  await loadOrders()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateViewType)
})

// Watchers
watch([searchQuery, statusFilter, restaurantFilter, currentTab], () => {
  currentPage.value = 1
})
</script>

<style scoped lang="scss">
.business-orders {
  // Variables
  --color-primary: #06a98d;
  --color-primary-dark: #058a73;
  --color-primary-light: #88d8ca;
  --color-white: #ffffff;
  --color-light: #f8fafc;
  --color-light-accent: #f1f5f9;
  --color-medium: #64748b;
  --color-dark: #1e293b;
  --color-border: #e2e8f0;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;
  --color-info: #3b82f6;
  --border-radius-sm: 6px;
  --border-radius: 8px;
  --border-radius-lg: 12px;
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  --transition: all 0.2s ease;
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing: 0.75rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  // Layout
  width: 100%;

  // Header
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-lg);
    flex-wrap: wrap;
    gap: var(--spacing-md);

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: stretch;
    }
  }

  &__title {
    font-size: 1.75rem;
    font-weight: 700;
    margin: 0;
    color: var(--color-dark);
  }

  &__actions {
    display: flex;
    gap: var(--spacing-md);
    align-items: center;

    @media (max-width: 480px) {
      flex-direction: column;
      align-items: stretch;
      width: 100%;
    }
  }

  &__filter {
    min-width: 180px;
  }

  &__select {
    width: 100%;
    padding: var(--spacing) var(--spacing);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius);
    background-color: var(--color-white);
    font-size: 0.9rem;
    color: var(--color-dark);
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    background-size: 1rem;
    padding-right: 2.5rem;

    &:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px rgba(6, 169, 141, 0.1);
    }
  }

  &__search {
    position: relative;
    flex-grow: 1;
    max-width: 300px;

    @media (max-width: 480px) {
      max-width: none;
    }
  }

  &__search-input {
    width: 100%;
    padding: var(--spacing) 2.5rem var(--spacing) var(--spacing);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius);
    font-size: 0.9rem;
    background-color: var(--color-white);

    &:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px rgba(6, 169, 141, 0.1);
    }
  }

  &__search-clear {
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--color-medium);
    padding: var(--spacing-xs);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      color: var(--color-dark);
    }

    svg {
      width: 16px;
      height: 16px;
    }
  }

  // Tabs
  &__tabs {
    display: flex;
    overflow-x: auto;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-lg);
    padding-bottom: var(--spacing-xs);
    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &__tab {
    background: none;
    border: none;
    padding: var(--spacing) var(--spacing-md);
    border-radius: 100px;
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--color-medium);
    cursor: pointer;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    transition: var(--transition);

    &:hover {
      background-color: var(--color-light-accent);
      color: var(--color-dark);
    }

    &--active {
      background-color: var(--color-light-accent);
      color: var(--color-dark);
      font-weight: 600;

      .business-orders__tab-count {
        background-color: var(--color-primary);
        color: var(--color-white);
      }
    }
  }

  &__tab-count {
    background-color: var(--color-border);
    color: var(--color-medium);
    font-size: 0.75rem;
    font-weight: 600;
    min-width: 20px;
    height: 20px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 6px;
  }

  // Content container
  &__content {
    background-color: var(--color-white);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow);
    overflow: hidden;
    margin-bottom: var(--spacing-lg);
  }

  // Loading and empty states
  &__loading,
  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem var(--spacing-md);
    text-align: center;
  }

  &__spinner {
    width: 40px;
    height: 40px;
    border: 3px solid var(--color-light-accent);
    border-radius: 50%;
    border-top-color: var(--color-primary);
    animation: spinner 1s linear infinite;
    margin-bottom: var(--spacing-md);
  }

  &__empty-icon {
    width: 60px;
    height: 60px;
    background-color: var(--color-light-accent);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-medium);
    margin-bottom: var(--spacing-md);

    svg {
      width: 28px;
      height: 28px;
    }
  }

  &__empty h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0 0 var(--spacing-sm);
    color: var(--color-dark);
  }

  &__empty p {
    color: var(--color-medium);
    margin: 0 0 var(--spacing-lg);
    max-width: 400px;
  }

  &__empty-button {
    background-color: var(--color-primary);
    color: var(--color-white);
    border: none;
    border-radius: var(--border-radius);
    padding: var(--spacing) var(--spacing-md);
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);

    &:hover {
      background-color: var(--color-primary-dark);
    }
  }

  // Mobile cards view
  &__cards {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
  }

  &__card {
    background-color: var(--color-white);
    border-radius: var(--border-radius);
    border: 1px solid var(--color-border);
    padding: var(--spacing-md);
    transition: var(--transition);

    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    &--pending {
      border-left: 4px solid #fbbf24;
    }

    &--preparing {
      border-left: 4px solid var(--color-info);
    }

    &--ready {
      border-left: 4px solid #8b5cf6;
    }

    &--delivering {
      border-left: 4px solid #0ea5e9;
    }

    &--delivered {
      border-left: 4px solid var(--color-success);
    }

    &--cancelled {
      border-left: 4px solid var(--color-danger);
    }
  }

  &__card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--spacing-sm);

    div {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }
  }

  &__card-id {
    font-weight: 600;
    color: var(--color-dark);
  }

  &__card-date {
    font-size: 0.85rem;
    color: var(--color-medium);
  }

  &__card-customer {
    margin-bottom: var(--spacing-md);
    padding-bottom: var(--spacing-md);
    border-bottom: 1px solid var(--color-light-accent);
  }

  &__card-customer-name {
    font-weight: 500;
    color: var(--color-dark);
    display: block;
  }

  &__card-customer-email {
    font-size: 0.85rem;
    color: var(--color-medium);
  }

  &__card-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: var(--spacing-md);
  }

  &__card-info-item {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  &__card-label {
    font-size: 0.8rem;
    color: var(--color-medium);
  }

  &__card-value {
    font-weight: 500;
    color: var(--color-dark);
  }

  &__card-total {
    font-size: 1.1rem;
    font-weight: 600;
  }

  &__card-actions {
    display: flex;
    gap: var(--spacing-sm);
    flex-wrap: wrap;
  }

  &__card-btn {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    padding: var(--spacing-sm) var(--spacing);
    border-radius: var(--border-radius-sm);
    border: none;
    font-size: 0.85rem;
    font-weight: 500;
    flex: 1;
    justify-content: center;
    cursor: pointer;
    transition: var(--transition);

    svg {
      width: 16px;
      height: 16px;
    }

    &--view {
      background-color: var(--color-light-accent);
      color: var(--color-dark);

      &:hover {
        background-color: #f1f5f9;
      }
    }

    &--update {
      background-color: #dbeafe;
      color: var(--color-info);

      &:hover {
        background-color: #dbeafe;
      }
    }
  }

  // Table view (desktop)
  &__table-container {
    overflow-x: auto;
    width: 100%;
  }

  &__table {
    width: 100%;
    border-collapse: collapse;

    th {
      text-align: left;
      padding: var(--spacing-md);
      font-weight: 600;
      color: var(--color-medium);
      border-bottom: 1px solid var(--color-border);
      font-size: 0.9rem;
      white-space: nowrap;
    }

    td {
      padding: var(--spacing-md);
      border-bottom: 1px solid var(--color-light-accent);
      font-size: 0.95rem;
      color: var(--color-dark);
    }
  }

  &__row {
    transition: var(--transition);

    &:hover {
      background-color: var(--color-light);
    }

    &:last-child td {
      border-bottom: none;
    }
  }

  &__order-id {
    font-weight: 600;
    color: var(--color-info);
  }

  &__customer {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  &__customer-name {
    font-weight: 500;
  }

  &__customer-email {
    font-size: 0.85rem;
    color: var(--color-medium);
  }

  &__date {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  &__date-full {
    font-weight: 500;
  }

  &__date-time {
    font-size: 0.85rem;
    color: var(--color-medium);
  }

  &__total {
    font-weight: 600;
    color: var(--color-dark);
  }

  // Status badges
  &__status {
    display: inline-block;
    padding: var(--spacing-xs) var(--spacing);
    border-radius: var(--border-radius-sm);
    font-size: 0.85rem;
    font-weight: 500;
    white-space: nowrap;

    &--pending {
      background-color: #fef3c7;
      color: #d97706;
    }

    &--preparing {
      background-color: #dbeafe;
      color: #2563eb;
    }

    &--ready {
      background-color: #e0e7ff;
      color: #4f46e5;
    }

    &--delivering {
      background-color: #e0f2fe;
      color: #0284c7;
    }

    &--delivered {
      background-color: #dcfce7;
      color: #16a34a;
    }

    &--cancelled {
      background-color: #fee2e2;
      color: #dc2626;
    }
  }

  // Action buttons
  &__actions-cell {
    display: flex;
    gap: var(--spacing-sm);

    @media (max-width: 480px) {
      flex-direction: column;
    }
  }

  &__action-btn {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    padding: var(--spacing-xs) var(--spacing);
    border-radius: var(--border-radius-sm);
    border: none;
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);

    svg {
      width: 14px;
      height: 14px;
    }

    &--view {
      background-color: var(--color-light-accent);
      color: var(--color-medium);

      &:hover {
        background-color: #f1f5f9;
      }
    }

    &--update {
      background-color: #dbeafe;
      color: #2563eb;

      &:hover {
        background-color: #bfdbfe;
      }
    }
  }

  // Pagination
  &__pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-xl);
  }

  &__pagination-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: var(--color-white);
    border: 1px solid var(--color-border);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: var(--transition);

    &:hover:not(:disabled) {
      background-color: var(--color-light-accent);
      border-color: var(--color-medium);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    svg {
      width: 16px;
      height: 16px;
      color: var(--color-medium);
    }
  }

  &__pagination-info {
    font-size: 0.9rem;
    color: var(--color-medium);
  }

  // Modals
  &__modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: var(--spacing-md);
  }

  &__modal-content {
    background-color: var(--color-white);
    border-radius: var(--border-radius-lg);
    max-width: 800px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;

    &--small {
      max-width: 480px;
    }
  }

  &__modal-header {
    padding: var(--spacing) var(--spacing-lg);
    border-bottom: 1px solid var(--color-border);
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    background-color: var(--color-white);
    z-index: 10;
  }

  &__modal-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
    color: var(--color-dark);
  }

  &__modal-close {
    background: none;
    border: none;
    padding: var(--spacing-xs);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-medium);
    cursor: pointer;
    border-radius: 4px;

    &:hover {
      background-color: var(--color-light-accent);
      color: var(--color-dark);
    }

    svg {
      width: 20px;
      height: 20px;
    }
  }

  &__modal-body {
    padding: var(--spacing-lg);
    flex-grow: 1;
  }

  // Order details
  &__details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--spacing-lg);
    margin-bottom: var(--spacing-lg);
  }

  &__detail-section {
    margin-bottom: var(--spacing-lg);
  }

  &__section-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0 0 var(--spacing-md);
    color: var(--color-dark);
    padding-bottom: var(--spacing-sm);
    border-bottom: 1px solid var(--color-light-accent);
  }

  &__detail-item {
    margin-bottom: var(--spacing);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  &__detail-label {
    font-size: 0.85rem;
    color: var(--color-medium);
  }

  &__detail-value {
    font-weight: 500;
    color: var(--color-dark);
  }

  // Items table in modal
  &__items-table-container {
    overflow-x: auto;
    width: 100%;
    margin-bottom: var(--spacing-lg);
  }

  &__items-table {
    width: 100%;
    border-collapse: collapse;

    th {
      text-align: left;
      padding: var(--spacing);
      font-weight: 600;
      color: var(--color-medium);
      border-bottom: 1px solid var(--color-border);
      font-size: 0.85rem;
    }

    td {
      padding: var(--spacing);
      border-bottom: 1px solid var(--color-light-accent);
      font-size: 0.9rem;
      color: var(--color-dark);
    }
  }

  &__product {
    display: flex;
    align-items: center;
    gap: var(--spacing);
  }

  &__product-image {
    width: 40px;
    height: 40px;
    border-radius: var(--border-radius-sm);
    overflow: hidden;
    flex-shrink: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__product-info {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  &__product-name {
    font-weight: 500;
    color: var(--color-dark);
  }

  &__product-variant {
    font-size: 0.85rem;
    color: var(--color-medium);
  }

  // Order summary
  &__summary {
    background-color: var(--color-light);
    border-radius: var(--border-radius);
    padding: var(--spacing-md);
  }

  &__summary-item {
    display: flex;
    justify-content: space-between;
    padding: var(--spacing-sm) 0;
    border-bottom: 1px solid var(--color-border);

    &:last-child {
      border-bottom: none;
    }

    &--total {
      font-weight: 600;
      font-size: 1.1rem;
      margin-top: var(--spacing-sm);
      padding-top: var(--spacing-sm);
      border-top: 1px dashed var(--color-border);
    }
  }

  &__summary-label {
    color: var(--color-medium);
  }

  &__summary-value {
    color: var(--color-dark);
  }

  // Status timeline
  &__status-timeline {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
    padding: var(--spacing-sm) 0;
  }

  &__status-step {
    display: flex;
    position: relative;

    &--active {
      .business-orders__status-indicator {
        background-color: var(--color-info);
        border-color: #bfdbfe;
      }

      .business-orders__status-label {
        font-weight: 600;
        color: var(--color-dark);
      }

      .business-orders__status-time {
        color: var(--color-info);
      }
    }

    &--current {
      .business-orders__status-indicator {
        background-color: var(--color-info);
        border-color: #bfdbfe;
        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
      }
    }
  }

  &__status-indicator {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: var(--color-border);
    border: 2px solid var(--color-light-accent);
    margin-right: var(--spacing-md);
    flex-shrink: 0;
    z-index: 1;
  }

  &__status-line {
    position: absolute;
    top: 8px;
    left: 8px;
    width: 2px;
    height: calc(100% + var(--spacing-lg));
    background-color: var(--color-border);
    transform: translateX(-50%);
    z-index: 0;

    &--active {
      background-color: var(--color-info);
    }
  }

  &__status-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  &__status-label {
    font-weight: 500;
    color: var(--color-medium);
  }

  &__status-time {
    font-size: 0.85rem;
    color: var(--color-medium);
  }

  // Modal footer
  &__modal-footer {
    padding: var(--spacing) var(--spacing-lg);
    border-top: 1px solid var(--color-border);
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-md);
    position: sticky;
    bottom: 0;
    background-color: var(--color-white);
    z-index: 10;
  }

  &__status-actions {
    display: flex;
    gap: var(--spacing-md);
  }

  &__modal-btn {
    padding: var(--spacing) var(--spacing-lg);
    border-radius: var(--border-radius);
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);

    &--primary {
      background-color: var(--color-primary);
      color: var(--color-white);
      border: none;

      &:hover {
        background-color: var(--color-primary-dark);
      }
    }

    &--secondary {
      background-color: var(--color-white);
      color: var(--color-medium);
      border: 1px solid var(--color-border);

      &:hover {
        background-color: var(--color-light-accent);
        color: var(--color-dark);
      }
    }

    &--danger {
      background-color: var(--color-white);
      color: var(--color-danger);
      border: 1px solid #fee2e2;

      &:hover {
        background-color: #fee2e2;
      }
    }
  }

  // Status update modal
  &__status-prompt {
    text-align: center;
    font-weight: 500;
    margin-bottom: var(--spacing-lg);
    color: var(--color-dark);
  }

  &__status-options {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-md);
  }

  &__status-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing);
    padding: var(--spacing-lg);
    border-radius: var(--border-radius);
    cursor: pointer;
    border: 1px solid var(--color-border);
    background-color: var(--color-white);
    transition: var(--transition);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    }

    &--preparing {
      &:hover {
        border-color: #bfdbfe;
        background-color: #eff6ff;
      }
    }

    &--ready {
      &:hover {
        border-color: #c7d2fe;
        background-color: #eef2ff;
      }
    }

    &--delivering {
      &:hover {
        border-color: #bae6fd;
        background-color: #e0f2fe;
      }
    }

    &--delivered {
      &:hover {
        border-color: #bbf7d0;
        background-color: #ecfdf5;
      }
    }

    &--cancelled {
      &:hover {
        border-color: #fecaca;
        background-color: #fef2f2;
      }
    }
  }

  &__status-option-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: var(--color-light-accent);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-medium);

    .business-orders__status-option--preparing:hover & {
      background-color: #dbeafe;
      color: #2563eb;
    }

    .business-orders__status-option--ready:hover & {
      background-color: #e0e7ff;
      color: #4f46e5;
    }

    .business-orders__status-option--delivering:hover & {
      background-color: #bae6fd;
      color: #0284c7;
    }

    .business-orders__status-option--delivered:hover & {
      background-color: #dcfce7;
      color: #16a34a;
    }

    .business-orders__status-option--cancelled:hover & {
      background-color: #fee2e2;
      color: #dc2626;
    }

    svg {
      width: 20px;
      height: 20px;
    }
  }
}

@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}
</style>
