<template>
  <div class="business-analytics">
    <div class="business-analytics__header">
      <div class="business-analytics__header-left">
        <h1 class="business-analytics__title">Analíticas</h1>
        <p class="business-analytics__subtitle">Análisis detallado del rendimiento de tu negocio</p>
      </div>
      <div class="business-analytics__header-right">
        <div class="business-analytics__date-selector">
          <select v-model="selectedPeriod" class="business-analytics__select">
            <option value="7">Últimos 7 días</option>
            <option value="30">Últimos 30 días</option>
            <option value="90">Últimos 90 días</option>
            <option value="365">Último año</option>
          </select>
        </div>
        <div class="business-analytics__restaurant-selector" v-if="restaurants.length > 1">
          <select v-model="selectedRestaurantId" class="business-analytics__select">
            <option value="all">Todos los restaurantes</option>
            <option v-for="restaurant in restaurants" :key="restaurant.id" :value="restaurant.id">
              {{ restaurant.name }}
            </option>
          </select>
        </div>
        <button @click="refreshData" :disabled="loading" class="business-analytics__refresh-btn">
          <svg :class="['business-analytics__refresh-icon', { 'business-analytics__refresh-icon--spinning': loading }]"
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 4 23 10 17 10"></polyline>
            <polyline points="1 20 1 14 7 14"></polyline>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
          </svg>
          {{ loading ? 'Actualizando...' : 'Actualizar' }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="business-analytics__loading">
      <div class="business-analytics__spinner"></div>
      <p>Cargando datos analíticos...</p>
    </div>

    <div v-else class="business-analytics__content">
      <!-- KPI Cards -->
      <div class="business-analytics__kpi-grid">
        <div class="business-analytics__kpi-card business-analytics__kpi-card--revenue">
          <div class="business-analytics__kpi-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
          <div class="business-analytics__kpi-content">
            <h3>Ingresos Totales</h3>
            <div class="business-analytics__kpi-value">{{ formatCurrency(kpiData.totalRevenue) }}</div>
            <div class="business-analytics__kpi-change" :class="getChangeClass(kpiData.revenueChange)">
              <svg v-if="kpiData.revenueChange > 0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="17 11 12 6 7 11"></polyline>
                <line x1="12" y1="18" x2="12" y2="6"></line>
              </svg>
              <svg v-else-if="kpiData.revenueChange < 0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="7 13 12 18 17 13"></polyline>
                <line x1="12" y1="6" x2="12" y2="18"></line>
              </svg>
              <span>{{ formatPercentage(kpiData.revenueChange) }}</span>
            </div>
          </div>
        </div>

        <div class="business-analytics__kpi-card business-analytics__kpi-card--orders">
          <div class="business-analytics__kpi-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </div>
          <div class="business-analytics__kpi-content">
            <h3>Total Pedidos</h3>
            <div class="business-analytics__kpi-value">{{ kpiData.totalOrders }}</div>
            <div class="business-analytics__kpi-change" :class="getChangeClass(kpiData.ordersChange)">
              <svg v-if="kpiData.ordersChange > 0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="17 11 12 6 7 11"></polyline>
                <line x1="12" y1="18" x2="12" y2="6"></line>
              </svg>
              <svg v-else-if="kpiData.ordersChange < 0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="7 13 12 18 17 13"></polyline>
                <line x1="12" y1="6" x2="12" y2="18"></line>
              </svg>
              <span>{{ formatPercentage(kpiData.ordersChange) }}</span>
            </div>
          </div>
        </div>

        <div class="business-analytics__kpi-card business-analytics__kpi-card--average">
          <div class="business-analytics__kpi-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div class="business-analytics__kpi-content">
            <h3>Ticket Promedio</h3>
            <div class="business-analytics__kpi-value">{{ formatCurrency(kpiData.averageOrderValue) }}</div>
            <div class="business-analytics__kpi-change" :class="getChangeClass(kpiData.aovChange)">
              <svg v-if="kpiData.aovChange > 0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="17 11 12 6 7 11"></polyline>
                <line x1="12" y1="18" x2="12" y2="6"></line>
              </svg>
              <svg v-else-if="kpiData.aovChange < 0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="7 13 12 18 17 13"></polyline>
                <line x1="12" y1="6" x2="12" y2="18"></line>
              </svg>
              <span>{{ formatPercentage(kpiData.aovChange) }}</span>
            </div>
          </div>
        </div>

        <div class="business-analytics__kpi-card business-analytics__kpi-card--customers">
          <div class="business-analytics__kpi-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div class="business-analytics__kpi-content">
            <h3>Clientes Únicos</h3>
            <div class="business-analytics__kpi-value">{{ kpiData.uniqueCustomers }}</div>
            <div class="business-analytics__kpi-change" :class="getChangeClass(kpiData.customersChange)">
              <svg v-if="kpiData.customersChange > 0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="17 11 12 6 7 11"></polyline>
                <line x1="12" y1="18" x2="12" y2="6"></line>
              </svg>
              <svg v-else-if="kpiData.customersChange < 0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="7 13 12 18 17 13"></polyline>
                <line x1="12" y1="6" x2="12" y2="18"></line>
              </svg>
              <span>{{ formatPercentage(kpiData.customersChange) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="business-analytics__charts">
        <!-- Revenue Chart -->
        <div class="business-analytics__chart-container">
          <div class="business-analytics__chart-header">
            <h3>Ingresos en el Tiempo</h3>
            <div class="business-analytics__chart-controls">
              <button 
                v-for="period in chartPeriods" 
                :key="period.value"
                @click="changeChartPeriod(period.value)"
                :class="['business-analytics__chart-btn', { 'business-analytics__chart-btn--active': chartPeriod === period.value }]"
              >
                {{ period.label }}
              </button>
            </div>
          </div>
          <div class="business-analytics__chart">
            <canvas ref="revenueChart" width="400" height="200"></canvas>
          </div>
        </div>

        <!-- Orders Chart -->
        <div class="business-analytics__chart-container">
          <div class="business-analytics__chart-header">
            <h3>Distribución de Estados de Pedidos</h3>
          </div>
          <div class="business-analytics__chart">
            <canvas ref="ordersChart" width="400" height="200"></canvas>
          </div>
        </div>
      </div>

      <!-- Tables Section -->
      <div class="business-analytics__tables">
        <!-- Top Products -->
        <div class="business-analytics__table-container">
          <div class="business-analytics__table-header">
            <h3>Productos Más Vendidos</h3>
            <span class="business-analytics__table-period">{{ selectedPeriodLabel }}</span>
          </div>
          <div class="business-analytics__table-wrapper">
            <table class="business-analytics__table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Restaurante</th>
                  <th>Pedidos</th>
                  <th>Ingresos</th>
                  <th>Precio Promedio</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="product in topProducts" :key="product.id" class="business-analytics__table-row">
                  <td>
                    <div class="business-analytics__product-info">
                      <img :src="product.imageUrl || '/images/product-placeholder.png'" :alt="product.name" class="business-analytics__product-image">
                      <span class="business-analytics__product-name">{{ product.name }}</span>
                    </div>
                  </td>
                  <td>{{ product.restaurantName }}</td>
                  <td><span class="business-analytics__metric">{{ product.totalOrders }}</span></td>
                  <td><span class="business-analytics__metric business-analytics__metric--revenue">{{ formatCurrency(product.totalRevenue) }}</span></td>
                  <td><span class="business-analytics__metric">{{ formatCurrency(product.averagePrice) }}</span></td>
                </tr>
              </tbody>
            </table>
            <div v-if="topProducts.length === 0" class="business-analytics__table-empty">
              <p>No hay datos de productos para el período seleccionado</p>
            </div>
          </div>
        </div>

        <!-- Restaurant Performance -->
        <div class="business-analytics__table-container" v-if="restaurants.length > 1">
          <div class="business-analytics__table-header">
            <h3>Rendimiento por Restaurante</h3>
            <span class="business-analytics__table-period">{{ selectedPeriodLabel }}</span>
          </div>
          <div class="business-analytics__table-wrapper">
            <table class="business-analytics__table">
              <thead>
                <tr>
                  <th>Restaurante</th>
                  <th>Pedidos</th>
                  <th>Ingresos</th>
                  <th>Ticket Promedio</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="restaurant in restaurantStats" :key="restaurant.id" class="business-analytics__table-row">
                  <td>
                    <div class="business-analytics__restaurant-info">
                      <img :src="restaurant.logoUrl || '/images/restaurant-placeholder.png'" :alt="restaurant.name" class="business-analytics__restaurant-image">
                      <span class="business-analytics__restaurant-name">{{ restaurant.name }}</span>
                    </div>
                  </td>
                  <td><span class="business-analytics__metric">{{ restaurant.totalOrders }}</span></td>
                  <td><span class="business-analytics__metric business-analytics__metric--revenue">{{ formatCurrency(restaurant.totalRevenue) }}</span></td>
                  <td><span class="business-analytics__metric">{{ formatCurrency(restaurant.averageOrderValue) }}</span></td>
                  <td>
                    <div class="business-analytics__rating">
                      <span class="business-analytics__rating-value">{{ restaurant.averageRating.toFixed(1) }}</span>
                      <div class="business-analytics__rating-stars">
                        <span class="business-analytics__stars-filled" :style="{ width: `${(restaurant.averageRating / 5) * 100}%` }">★★★★★</span>
                        <span class="business-analytics__stars-empty">★★★★★</span>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, onActivated, nextTick, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { api } from '@/services/api'

const authStore = useAuthStore()
const router = useRouter()

// Estado principal
const loading = ref(true)
const business = ref(null)
const restaurants = ref([])
const allOrders = ref([])
const allProducts = ref([])
const isComponentMounted = ref(false)
const isDataLoaded = ref(false)

// Filtros
const selectedPeriod = ref(30)
const selectedRestaurantId = ref('all')
const chartPeriod = ref('daily')

// Charts
const revenueChart = ref(null)
const ordersChart = ref(null)
let revenueChartInstance = null
let ordersChartInstance = null

// Períodos disponibles
const chartPeriods = [
  { label: 'Diario', value: 'daily' },
  { label: 'Semanal', value: 'weekly' },
  { label: 'Mensual', value: 'monthly' }
]

// Computed
const selectedPeriodLabel = computed(() => {
  const labels = {
    7: 'Últimos 7 días',
    30: 'Últimos 30 días', 
    90: 'Últimos 90 días',
    365: 'Último año'
  }
  return labels[selectedPeriod.value] || 'Período personalizado'
})

// Filtrar órdenes por período y restaurante
const filteredOrders = computed(() => {
  let orders = [...allOrders.value]

  // Filtrar por período
  const now = new Date()
  const startDate = new Date(now.getTime() - (selectedPeriod.value * 24 * 60 * 60 * 1000))
  orders = orders.filter(order => new Date(order.createdAt) >= startDate)

  // Filtrar por restaurante
  if (selectedRestaurantId.value !== 'all') {
    orders = orders.filter(order => order.restaurantId === selectedRestaurantId.value)
  }

  return orders
})

// Calcular KPIs basados en datos reales
const kpiData = computed(() => {
  const currentOrders = filteredOrders.value
  const currentRevenue = currentOrders.reduce((sum, order) => sum + order.total, 0)
  const currentOrderCount = currentOrders.length
  const uniqueCustomerIds = new Set(currentOrders.map(order => order.userId))
  const uniqueCustomers = uniqueCustomerIds.size

  // Calcular período anterior para comparación
  const now = new Date()
  const currentStartDate = new Date(now.getTime() - (selectedPeriod.value * 24 * 60 * 60 * 1000))
  const previousStartDate = new Date(currentStartDate.getTime() - (selectedPeriod.value * 24 * 60 * 60 * 1000))
  
  let previousOrders = [...allOrders.value]
  if (selectedRestaurantId.value !== 'all') {
    previousOrders = previousOrders.filter(order => order.restaurantId === selectedRestaurantId.value)
  }
  previousOrders = previousOrders.filter(order => {
    const orderDate = new Date(order.createdAt)
    return orderDate >= previousStartDate && orderDate < currentStartDate
  })

  const previousRevenue = previousOrders.reduce((sum, order) => sum + order.total, 0)
  const previousOrderCount = previousOrders.length
  const previousUniqueCustomerIds = new Set(previousOrders.map(order => order.userId))
  const previousUniqueCustomers = previousUniqueCustomerIds.size

  // Calcular cambios porcentuales
  const revenueChange = previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0
  const ordersChange = previousOrderCount > 0 ? ((currentOrderCount - previousOrderCount) / previousOrderCount) * 100 : 0
  const customersChange = previousUniqueCustomers > 0 ? ((uniqueCustomers - previousUniqueCustomers) / previousUniqueCustomers) * 100 : 0

  const currentAOV = currentOrderCount > 0 ? currentRevenue / currentOrderCount : 0
  const previousAOV = previousOrderCount > 0 ? previousRevenue / previousOrderCount : 0
  const aovChange = previousAOV > 0 ? ((currentAOV - previousAOV) / previousAOV) * 100 : 0

  return {
    totalRevenue: currentRevenue,
    totalOrders: currentOrderCount,
    averageOrderValue: currentAOV,
    uniqueCustomers: uniqueCustomers,
    revenueChange,
    ordersChange,  
    aovChange,
    customersChange
  }
})

// Top productos basados en datos reales
const topProducts = computed(() => {
  const productStats = new Map()

  filteredOrders.value.forEach(order => {
    order.orderItems?.forEach(item => {
      const productId = item.productId
      if (!productStats.has(productId)) {
        productStats.set(productId, {
          id: productId,
          name: item.product?.name || 'Producto desconocido',
          imageUrl: item.product?.imageUrl,
          restaurantName: order.restaurant?.name || 'Restaurante',
          totalOrders: 0,
          totalRevenue: 0,
          totalQuantity: 0
        })
      }

      const stats = productStats.get(productId)
      stats.totalOrders += item.quantity
      stats.totalRevenue += item.subtotal
      stats.totalQuantity += item.quantity
    })
  })

  return Array.from(productStats.values())
    .map(product => ({
      ...product,
      averagePrice: product.totalQuantity > 0 ? product.totalRevenue / product.totalQuantity : 0
    }))
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 10)
})

// Stats por restaurante
const restaurantStats = computed(() => {
  if (restaurants.value.length <= 1) return []

  return restaurants.value.map(restaurant => {
    const restaurantOrders = filteredOrders.value.filter(order => order.restaurantId === restaurant.id)
    const totalRevenue = restaurantOrders.reduce((sum, order) => sum + order.total, 0)
    const totalOrders = restaurantOrders.length
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    return {
      id: restaurant.id,
      name: restaurant.name,
      logoUrl: restaurant.logoUrl,
      totalOrders,
      totalRevenue,
      averageOrderValue,
      averageRating: restaurant.averageRating || 0
    }
  }).sort((a, b) => b.totalRevenue - a.totalRevenue)
})

// Funciones de utilidad
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(value)
}

const formatPercentage = (value: number): string => {
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(1)}%`
}

const getChangeClass = (change: number): string => {
  if (change > 0) return 'business-analytics__kpi-change--positive'
  if (change < 0) return 'business-analytics__kpi-change--negative'
  return 'business-analytics__kpi-change--neutral'
}

// Cargar datos (usando mismo patrón que BusinessHome.vue)
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

const loadOrders = async () => {
  if (restaurants.value.length === 0) return

  try {
    const allOrdersData = []

    for (const restaurant of restaurants.value) {
      try {
        const ordersResponse = await api.get(`/api/Orders/restaurant/${restaurant.id}`)
        if (ordersResponse.data) {
          const restaurantOrders = ordersResponse.data.map((order: any) => ({
            ...order,
            restaurantId: restaurant.id,
            restaurantName: restaurant.name
          }))
          allOrdersData.push(...restaurantOrders)
        }
      } catch (error) {
        console.error(`Error pedidos restaurante ${restaurant.id}:`, error)
      }
    }

    allOrders.value = allOrdersData
  } catch (error) {
    console.error('Error cargando pedidos:', error)
  }
}

const loadProducts = async () => {
  if (restaurants.value.length === 0) return

  try {
    const allProductsData = []

    for (const restaurant of restaurants.value) {
      try {
        const productsResponse = await api.get(`/api/Products/Restaurant/${restaurant.id}`)
        if (productsResponse.data) {
          const restaurantProducts = productsResponse.data.map((product: any) => ({
            ...product,
            restaurantId: restaurant.id,
            restaurantName: restaurant.name
          }))
          allProductsData.push(...restaurantProducts)
        }
      } catch (error) {
        console.error(`Error productos restaurante ${restaurant.id}:`, error)
      }
    }

    allProducts.value = allProductsData
  } catch (error) {
    console.error('Error cargando productos:', error)
  }
}

// Crear gráficos
const createRevenueChart = async () => {
  if (!revenueChart.value) return

  const ctx = revenueChart.value.getContext('2d')
  if (!ctx) return
  
  // Preparar datos de ingresos por día
  const chartData = prepareRevenueChartData()
  
  // Destruir gráfico anterior si existe
  if (revenueChartInstance) {
    revenueChartInstance.destroy()
    revenueChartInstance = null
  }

  // Verificar que Chart.js esté disponible
  if (!window.Chart) return

  // Crear nuevo gráfico usando Chart.js básico
  const gradient = ctx.createLinearGradient(0, 0, 0, 400)
  gradient.addColorStop(0, 'rgba(6, 169, 141, 0.1)')
  gradient.addColorStop(1, 'rgba(6, 169, 141, 0)')

  revenueChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: chartData.labels,
      datasets: [{
        label: 'Ingresos',
        data: chartData.values,
        borderColor: '#06a98d',
        backgroundColor: gradient,
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return formatCurrency(value)
            }
          }
        }
      }
    }
  })
}

const createOrdersChart = async () => {
  if (!ordersChart.value) return

  const ctx = ordersChart.value.getContext('2d')
  if (!ctx) return
  
  // Contar pedidos por estado
  const statusCounts = filteredOrders.value.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1
    return acc
  }, {})

  const statusLabels = {
    'Pending': 'Pendientes',
    'Accepted': 'Aceptados', 
    'Preparing': 'En preparación',
    'ReadyForPickup': 'Listos',
    'OnTheWay': 'En camino',
    'Delivered': 'Entregados',
    'Cancelled': 'Cancelados'
  }

  const labels = Object.keys(statusCounts).map(status => statusLabels[status] || status)
  const data = Object.values(statusCounts)
  const colors = [
    '#fbbf24', '#3b82f6', '#8b5cf6', '#0ea5e9', '#10b981', '#ef4444'
  ]

  // Destruir gráfico anterior si existe
  if (ordersChartInstance) {
    ordersChartInstance.destroy()
    ordersChartInstance = null
  }

  // Verificar que Chart.js esté disponible
  if (!window.Chart) return

  // Si no hay datos, mostrar mensaje
  if (data.length === 0 || data.every(d => d === 0)) {
    ordersChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Sin datos'],
        datasets: [{
          data: [1],
          backgroundColor: ['#e2e8f0'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        }
      }
    })
    return
  }

  ordersChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: colors,
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  })
}

const prepareRevenueChartData = () => {
  const now = new Date()
  const startDate = new Date(now.getTime() - (selectedPeriod.value * 24 * 60 * 60 * 1000))
  
  const labels = []
  const values = []
  
  // Generar etiquetas según el período del gráfico
  const daysInPeriod = selectedPeriod.value
  const dataPoints = chartPeriod.value === 'daily' ? Math.min(daysInPeriod, 30) : 
                     chartPeriod.value === 'weekly' ? Math.min(Math.ceil(daysInPeriod / 7), 12) :
                     Math.min(Math.ceil(daysInPeriod / 30), 12)
  
  for (let i = dataPoints - 1; i >= 0; i--) {
    let periodStart, periodEnd, label
    
    if (chartPeriod.value === 'daily') {
      periodStart = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000))
      periodEnd = new Date(periodStart.getTime() + (24 * 60 * 60 * 1000))
      label = periodStart.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })
    } else if (chartPeriod.value === 'weekly') {
      periodStart = new Date(now.getTime() - (i * 7 * 24 * 60 * 60 * 1000))
      periodEnd = new Date(periodStart.getTime() + (7 * 24 * 60 * 60 * 1000))
      label = `Sem ${Math.ceil((now.getTime() - periodStart.getTime()) / (7 * 24 * 60 * 60 * 1000))}`
    } else {
      periodStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
      periodEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
      label = periodStart.toLocaleDateString('es-ES', { month: 'short' })
    }
    
    const periodRevenue = filteredOrders.value
      .filter(order => {
        const orderDate = new Date(order.createdAt)
        return orderDate >= periodStart && orderDate < periodEnd
      })
      .reduce((sum, order) => sum + order.total, 0)
    
    labels.push(label)
    values.push(periodRevenue)
  }
  
  return { labels, values }
}

// Event handlers
const updateAnalytics = async () => {
  await nextTick()
  await createCharts()
}

const changeChartPeriod = async (period: string) => {
  chartPeriod.value = period
  await nextTick()
  await createCharts()
}

const createCharts = async () => {
  await nextTick()
  await Promise.all([
    createRevenueChart(),
    createOrdersChart()
  ])
}

const refreshData = async () => {
  loading.value = true
  
  // Resetear el estado para que el watcher se dispare
  isDataLoaded.value = false
  
  try {
    await loadBusiness()
    await loadRestaurants() 
    await loadOrders()
    await loadProducts()
    isDataLoaded.value = true
  } finally {
    loading.value = false
  }
}

// Watcher para crear gráficos cuando los datos estén listos
watch(isDataLoaded, async (newValue) => {
  if (newValue && isComponentMounted.value) {
    await nextTick()
    await createCharts()
  }
})

// Watchers para actualizar automáticamente cuando cambian los filtros
watch([selectedPeriod, selectedRestaurantId], async () => {
  if (isDataLoaded.value) {
    await updateAnalytics()
  }
})

watch(chartPeriod, async () => {
  if (isDataLoaded.value) {
    await updateAnalytics()  
  }
})

// Lifecycle
onMounted(async () => {
  isComponentMounted.value = true
  
  if (!authStore.isAuthenticated()) {
    const isAuth = await authStore.checkAuth()
    if (!isAuth || (authStore.user?.role !== 'Business' && authStore.user?.role !== 'Admin')) {
      router.push('/login')
      return
    }
  }

  // Cargar Chart.js si no está disponible
  if (!window.Chart) {
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js'
    script.onload = async () => {
      await refreshData()
    }
    document.head.appendChild(script)
  } else {
    await refreshData()
  }
})

onActivated(async () => {
  if (isDataLoaded.value) {
    await nextTick()
    await createCharts()
  }
})

onBeforeUnmount(() => {
  isComponentMounted.value = false
  isDataLoaded.value = false
  
  if (revenueChartInstance) {
    revenueChartInstance.destroy()
    revenueChartInstance = null
  }
  if (ordersChartInstance) {
    ordersChartInstance.destroy()
    ordersChartInstance = null
  }
})
</script>

<style lang="scss" scoped>
.business-analytics {
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;

    @media (max-width: 768px) {
      flex-direction: column;
    }
  }

  &__header-left {
    flex: 1;
  }

  &__title {
    font-size: 1.75rem;
    font-weight: 700;
    margin: 0 0 0.25rem;
    color: #1e293b;
  }

  &__subtitle {
    color: #64748b;
    margin: 0;
  }

  &__header-right {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;

    @media (max-width: 480px) {
      width: 100%;
      flex-direction: column;
    }
  }

  &__select {
    padding: 0.5rem 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background-color: white;
    color: #1e293b;
    font-size: 0.9rem;
    min-width: 150px;

    &:focus {
      outline: none;
      border-color: #06a98d;
      box-shadow: 0 0 0 3px rgba(6, 169, 141, 0.1);
    }

    @media (max-width: 480px) {
      width: 100%;
    }
  }

  &__refresh-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background-color: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    color: #1e293b;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover:not(:disabled) {
      border-color: #cbd5e0;
      background-color: #f8fafc;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  &__refresh-icon {
    width: 16px;
    height: 16px;
    transition: transform 0.8s ease;

    &--spinning {
      animation: spin 1s linear infinite;
    }
  }

  &__loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1rem;
    text-align: center;
  }

  &__spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #f1f5f9;
    border-radius: 50%;
    border-top-color: #06a98d;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }

  // KPI Cards
  &__kpi-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  &__kpi-card {
    background-color: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 1rem;
    border-left: 4px solid transparent;

    &--revenue {
      border-left-color: #10b981;
    }

    &--orders {
      border-left-color: #3b82f6;
    }

    &--average {
      border-left-color: #8b5cf6;
    }

    &--customers {
      border-left-color: #f59e0b;
    }
  }

  &__kpi-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    svg {
      width: 24px;
      height: 24px;
    }

    .business-analytics__kpi-card--revenue & {
      background-color: rgba(16, 185, 129, 0.1);
      color: #10b981;
    }

    .business-analytics__kpi-card--orders & {
      background-color: rgba(59, 130, 246, 0.1);
      color: #3b82f6;
    }

    .business-analytics__kpi-card--average & {
      background-color: rgba(139, 92, 246, 0.1);
      color: #8b5cf6;
    }

    .business-analytics__kpi-card--customers & {
      background-color: rgba(245, 158, 11, 0.1);
      color: #f59e0b;
    }
  }

  &__kpi-content {
    flex: 1;

    h3 {
      font-size: 0.9rem;
      font-weight: 500;
      color: #64748b;
      margin: 0 0 0.5rem;
    }
  }

  &__kpi-value {
    font-size: 1.75rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 0.25rem;
    line-height: 1.2;
  }

  &__kpi-change {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.85rem;
    font-weight: 600;

    svg {
      width: 14px;
      height: 14px;
    }

    &--positive {
      color: #10b981;
    }

    &--negative {
      color: #ef4444;
    }

    &--neutral {
      color: #64748b;
    }
  }

  // Charts
  &__charts {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  &__chart-container {
    background-color: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  &__chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;

    h3 {
      font-size: 1.1rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }

    @media (max-width: 480px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }
  }

  &__chart-controls {
    display: flex;
    gap: 0.25rem;
  }

  &__chart-btn {
    padding: 0.4rem 0.8rem;
    border: 1px solid #e2e8f0;
    background-color: white;
    color: #64748b;
    font-size: 0.8rem;
    font-weight: 500;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover {
      background-color: #f8fafc;
      color: #1e293b;
    }

    &--active {
      background-color: #06a98d;
      color: white;
      border-color: #06a98d;
    }
  }

  &__chart {
    height: 300px;
    position: relative;

    canvas {
      max-height: 100%;
    }
  }

  // Tables
  &__tables {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  &__table-container {
    background-color: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  &__table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;

    h3 {
      font-size: 1.1rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }
  }

  &__table-period {
    font-size: 0.85rem;
    color: #64748b;
    font-weight: 500;
  }

  &__table-wrapper {
    overflow-x: auto;
  }

  &__table {
    width: 100%;
    border-collapse: collapse;

    th {
      text-align: left;
      padding: 0.75rem;
      font-weight: 600;
      color: #64748b;
      border-bottom: 1px solid #e2e8f0;
      font-size: 0.85rem;
      white-space: nowrap;
    }
  }

  &__table-row {
    border-bottom: 1px solid #f1f5f9;
    transition: background-color 0.15s ease;

    &:hover {
      background-color: #f8fafc;
    }

    &:last-child {
      border-bottom: none;
    }

    td {
      padding: 1rem 0.75rem;
      font-size: 0.9rem;
      color: #1e293b;
    }
  }

  &__product-info,
  &__restaurant-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  &__product-image,
  &__restaurant-image {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    object-fit: cover;
    flex-shrink: 0;
  }

  &__product-name,
  &__restaurant-name {
    font-weight: 500;
    color: #1e293b;
  }

  &__metric {
    font-weight: 600;
    color: #1e293b;

    &--revenue {
      color: #10b981;
    }
  }

  &__rating {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__rating-value {
    font-weight: 600;
    color: #1e293b;
  }

  &__rating-stars {
    position: relative;
    display: inline-block;
    font-size: 0.9rem;
    line-height: 1;
  }

  &__stars-filled {
    position: absolute;
    top: 0;
    left: 0;
    white-space: nowrap;
    overflow: hidden;
    color: #f59e0b;
  }

  &__stars-empty {
    color: #e2e8f0;
  }

  &__table-empty {
    text-align: center;
    padding: 2rem;
    color: #64748b;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>