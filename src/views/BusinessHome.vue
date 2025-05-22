<template>
  <div class="business-home">
    <div class="business-home__header">
      <div class="business-home__header-left">
        <h1 class="business-home__title">¡Bienvenido a <span class="business-home__name">{{ businessName }}</span>!</h1>
        <p class="business-home__welcome">Aquí tienes un resumen de tu actividad.</p>
      </div>
      <div class="business-home__header-right">
        <div class="business-home__restaurant-selector" v-if="restaurants.length > 1">
          <label for="restaurantSelect" class="business-home__selector-label">Restaurante:</label>
          <select 
            id="restaurantSelect" 
            v-model="selectedRestaurantId" 
            @change="onRestaurantChange"
            class="business-home__selector"
          >
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
        <div class="business-home__date">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round" class="business-home__date-icon">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>{{ currentDate }}</span>
        </div>
        <button @click="refreshData" class="business-home__refresh-btn" :disabled="isRefreshing">
          <svg :class="['business-home__refresh-icon', { 'business-home__refresh-icon--rotating': isRefreshing }]"
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <polyline points="23 4 23 10 17 10"></polyline>
            <polyline points="1 20 1 14 7 14"></polyline>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
          </svg>
          <span>{{ isRefreshing ? 'Actualizando...' : 'Actualizar' }}</span>
        </button>
      </div>
    </div>

    <div v-if="!isRestaurantOpen" class="business-home__alert">
      <div class="business-home__alert-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      </div>
      <div class="business-home__alert-content">
        <h3 class="business-home__alert-title">{{ selectedRestaurantName }} está cerrado</h3>
        <p class="business-home__alert-message">No estás aceptando pedidos nuevos en este momento.</p>
      </div>
      <button @click="toggleRestaurantOpen" class="business-home__alert-action">Abrir negocio</button>
    </div>

    <div class="business-home__summary">
      <div class="business-home__card business-home__card--orders">
        <div class="business-home__card-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
        </div>
        <div class="business-home__card-content">
          <h3 class="business-home__card-title">Pedidos de Hoy</h3>
          <div class="business-home__card-stats">
            <p class="business-home__card-value">{{ currentStats.todayOrders }}</p>
            <p v-if="currentStats.orderChange !== 0"
              :class="['business-home__card-change', currentStats.orderChange > 0 ? 'business-home__card-change--positive' : 'business-home__card-change--negative']">
              <svg v-if="currentStats.orderChange > 0" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="17 11 12 6 7 11"></polyline>
                <line x1="12" y1="18" x2="12" y2="6"></line>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="7 13 12 18 17 13"></polyline>
                <line x1="12" y1="6" x2="12" y2="18"></line>
              </svg>
              <span>{{ Math.abs(currentStats.orderChange) }}%</span>
            </p>
          </div>
          <p class="business-home__card-period">vs ayer</p>
        </div>
      </div>

      <div class="business-home__card business-home__card--revenue">
        <div class="business-home__card-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="1" x2="12" y2="23"></line>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
        </div>
        <div class="business-home__card-content">
          <h3 class="business-home__card-title">Ingresos de Hoy</h3>
          <div class="business-home__card-stats">
            <p class="business-home__card-value">{{ formatCurrency(currentStats.todayRevenue) }}</p>
            <p v-if="currentStats.revenueChange !== 0"
              :class="['business-home__card-change', currentStats.revenueChange > 0 ? 'business-home__card-change--positive' : 'business-home__card-change--negative']">
              <svg v-if="currentStats.revenueChange > 0" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round">
                <polyline points="17 11 12 6 7 11"></polyline>
                <line x1="12" y1="18" x2="12" y2="6"></line>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="7 13 12 18 17 13"></polyline>
                <line x1="12" y1="6" x2="12" y2="18"></line>
              </svg>
              <span>{{ Math.abs(currentStats.revenueChange) }}%</span>
            </p>
          </div>
          <p class="business-home__card-period">vs ayer</p>
        </div>
      </div>

      <div class="business-home__card business-home__card--products">
        <div class="business-home__card-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <path
              d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z">
            </path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
        </div>
        <div class="business-home__card-content">
          <h3 class="business-home__card-title">Total Productos</h3>
          <div class="business-home__card-stats">
            <p class="business-home__card-value">{{ currentStats.totalProducts }}</p>
          </div>
          <p class="business-home__card-period">{{ selectedRestaurantId === 'all' ? 'en todos tus restaurantes' : 'en este restaurante' }}</p>
        </div>
      </div>

      <div class="business-home__card business-home__card--rating">
        <div class="business-home__card-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <polygon
              points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2">
            </polygon>
          </svg>
        </div>
        <div class="business-home__card-content">
          <h3 class="business-home__card-title">Valoración Media</h3>
          <p class="business-home__card-value">{{ currentStats.averageRating.toFixed(1) }}</p>
          <div class="business-home__rating-stars">
            <div class="business-home__stars-filled" :style="{ width: `${(currentStats.averageRating / 5) * 100}%` }">★★★★★</div>
            <div class="business-home__stars-empty">★★★★★</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Nueva sección de restaurantes -->
    <div v-if="restaurants.length > 1" class="business-home__restaurants-overview">
      <div class="business-home__section-header">
        <h2 class="business-home__section-title">Tus Restaurantes</h2>
        <router-link :to="{ name: 'business-settings' }" class="business-home__section-link">
          Gestionar
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </router-link>
      </div>
      <div class="business-home__restaurants-grid">
        <div 
          v-for="restaurant in restaurants" 
          :key="restaurant.id" 
          :class="['business-home__restaurant-card', { 'business-home__restaurant-card--selected': selectedRestaurantId === restaurant.id }]"
          @click="selectRestaurant(restaurant.id)"
        >
          <div class="business-home__restaurant-image">
            <img :src="restaurant.logoUrl || '/images/restaurant-placeholder.png'" :alt="restaurant.name">
            <div v-if="!restaurant.isOpen" class="business-home__restaurant-status business-home__restaurant-status--closed">
              Cerrado
            </div>
            <div v-else class="business-home__restaurant-status business-home__restaurant-status--open">
              Abierto
            </div>
          </div>
          <div class="business-home__restaurant-info">
            <h4 class="business-home__restaurant-name">{{ restaurant.name }}</h4>
            <p class="business-home__restaurant-address">{{ getRestaurantAddress(restaurant) }}</p>
            <div class="business-home__restaurant-stats">
              <div class="business-home__restaurant-stat">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
                <span>{{ getRestaurantProductCount(restaurant.id) }} productos</span>
              </div>
              <div class="business-home__restaurant-stat">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <span>{{ restaurant.averageRating?.toFixed(1) || '0.0' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="business-home__sections">
      <div class="business-home__section business-home__section--pending">
        <div class="business-home__section-header">
          <h2 class="business-home__section-title">
            <span>Pedidos Pendientes</span>
            <span v-if="pendingOrdersCount > 0" class="business-home__section-badge">{{ pendingOrdersCount }}</span>
          </h2>
          <router-link :to="{ name: 'business-orders' }" class="business-home__section-link">
            Ver todos
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </router-link>
        </div>
        <div v-if="pendingOrders.length > 0" class="business-home__orders-list">
          <div v-for="order in pendingOrders.slice(0, 3)" :key="order.id" class="business-home__order-item">
            <div class="business-home__order-info">
              <div class="business-home__order-header">
                <h4 class="business-home__order-id">Pedido #{{ order.id }}</h4>
                <span class="business-home__order-time">{{ formatTime(order.date) }}</span>
              </div>
              <div class="business-home__order-details">
                <p class="business-home__customer-name">{{ order.customerName }}</p>
                <p class="business-home__order-items">{{ order.items }} artículo(s)</p>
              </div>
            </div>
            <div class="business-home__order-actions">
              <span class="business-home__order-total">{{ formatCurrency(order.total) }}</span>
              <span :class="['business-home__status', `business-home__status--${order.status}`]">{{
                getStatusLabel(order.status) }}</span>
              <button @click="viewOrderDetails(order)" class="business-home__order-btn">Ver Detalles</button>
            </div>
          </div>
        </div>
        <div v-else class="business-home__empty">
          <div class="business-home__empty-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h4>Todo al día</h4>
          <p>No tienes pedidos pendientes en este momento. ¡Buen trabajo!</p>
        </div>
      </div>

      <div class="business-home__section business-home__section--products">
        <div class="business-home__section-header">
          <h2 class="business-home__section-title">Productos Populares</h2>
          <router-link :to="{ name: 'business-products' }" class="business-home__section-link">
            Ver todos
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </router-link>
        </div>
        <div v-if="popularProducts.length > 0" class="business-home__products-grid">
          <div v-for="product in popularProducts.slice(0, 4)" :key="product.id" class="business-home__product-card">
            <div class="business-home__product-image">
              <img :src="product.image || '/images/product-placeholder.png'" :alt="product.name">
            </div>
            <div class="business-home__product-info">
              <h4 class="business-home__product-name">{{ product.name }}</h4>
              <p class="business-home__product-price">{{ formatCurrency(product.price) }}</p>
              <div class="business-home__product-stats">
                <span class="business-home__product-orders">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                  {{ product.ordersCount }} pedidos
                </span>
                <span class="business-home__product-revenue">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                  {{ formatCurrency(product.revenue || 0) }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="business-home__empty">
          <div class="business-home__empty-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </div>
          <h4>Sin productos populares aún</h4>
          <p>A medida que recibas pedidos, tus productos más vendidos aparecerán aquí.</p>
          <router-link :to="{ name: 'business-products' }" class="business-home__add-product-btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Añadir Nuevo Producto</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Modal de detalles de pedido -->
    <div v-if="selectedOrder" class="business-home__modal" @click.self="closeOrderDetails">
      <div class="business-home__modal-content">
        <div class="business-home__modal-header">
          <h3 class="business-home__modal-title">Detalles del Pedido #{{ selectedOrder.id }}</h3>
          <button @click="closeOrderDetails" class="business-home__modal-close">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="business-home__modal-body">
          <div class="business-home__order-details-section">
            <h4 class="business-home__details-title">Información del Cliente</h4>
            <div class="business-home__details-item">
              <span class="business-home__details-label">Nombre:</span>
              <span class="business-home__details-value">{{ selectedOrder.customerName }}</span>
            </div>
            <div class="business-home__details-item">
              <span class="business-home__details-label">Hora:</span>
              <span class="business-home__details-value">{{ formatTime(selectedOrder.date) }}</span>
            </div>
          </div>

          <div class="business-home__order-details-section">
            <h4 class="business-home__details-title">Artículos del Pedido</h4>
            <ul class="business-home__order-items-list">
              <li v-for="(item, index) in orderItems" :key="index" class="business-home__order-item-detail">
                <span class="business-home__item-quantity">{{ item.quantity }}x</span>
                <div class="business-home__item-info">
                  <span class="business-home__item-name">{{ item.name }}</span>
                  <span v-if="item.options" class="business-home__item-options">{{ item.options }}</span>
                </div>
                <span class="business-home__item-price">{{ formatCurrency(item.price * item.quantity) }}</span>
              </li>
            </ul>
            <div class="business-home__order-summary">
              <div class="business-home__summary-item business-home__summary-item--total">
                <span>Total</span>
                <span>{{ formatCurrency(selectedOrder.total) }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="business-home__modal-footer">
          <div class="business-home__status-update">
            <label for="statusSelect" class="business-home__status-label">Estado:</label>
            <select id="statusSelect" v-model="selectedOrderStatus" class="business-home__status-select">
              <option value="pending">Pendiente</option>
              <option value="preparing">En preparación</option>
              <option value="ready">Listo para recoger/enviar</option>
              <option value="delivering">En reparto</option>
              <option value="delivered">Entregado</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
          <div class="business-home__modal-actions">
            <button @click="closeOrderDetails"
              class="business-home__modal-btn business-home__modal-btn--secondary">Cerrar</button>
            <button @click="updateOrderStatus"
              class="business-home__modal-btn business-home__modal-btn--primary">Actualizar Estado</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { api } from '@/services/api'

const authStore = useAuthStore()
const router = useRouter()

// Estados básicos
const business = ref(null)
const restaurants = ref([])
const selectedRestaurantId = ref('all')
const isRefreshing = ref(false)
const popularProducts = ref([])
const allProducts = ref([])

// Nombre del negocio REAL desde el business cargado
const businessName = computed(() => {
  return business.value?.name || authStore.user?.businessName || 'Mi Negocio'
})

const selectedRestaurantName = computed(() => {
  if (selectedRestaurantId.value === 'all') {
    return 'Tu negocio'
  }
  const restaurant = restaurants.value.find(r => r.id === selectedRestaurantId.value)
  return restaurant?.name || 'Restaurante'
})

// Stats hardcodeadas que cambian según el restaurante seleccionado
const allStats = ref({
  all: {
    todayOrders: 25,
    todayRevenue: 680.50,
    orderChange: 12,
    revenueChange: 18,
    averageRating: 4.5,
    totalProducts: 0
  }
})

// Stats actuales basadas en el restaurante seleccionado
const currentStats = computed(() => {
  if (selectedRestaurantId.value === 'all') {
    return {
      ...allStats.value.all,
      totalProducts: allProducts.value.length
    }
  }
  
  // Stats para restaurante específico (simuladas pero basadas en productos reales)
  const restaurantProducts = allProducts.value.filter(p => p.restaurantId === selectedRestaurantId.value)
  return {
    todayOrders: Math.floor(allStats.value.all.todayOrders * 0.6), // Simulado como 60% del total
    todayRevenue: allStats.value.all.todayRevenue * 0.6,
    orderChange: allStats.value.all.orderChange - 3,
    revenueChange: allStats.value.all.revenueChange - 5,
    averageRating: 4.3, // Hardcodeado pero diferente
    totalProducts: restaurantProducts.length
  }
})

// Estados existentes
const isRestaurantOpen = ref(true)

// Pedidos hardcodeados por ahora
const pendingOrders = ref([
  {
    id: 1,
    date: new Date(),
    customerName: 'Juan Pérez',
    items: 3,
    total: 24.50,
    status: 'pending'
  }
])

// Modal
const selectedOrder = ref(null)
const selectedOrderStatus = ref('')
const orderItems = ref([])

// Computed
const currentDate = computed(() => {
  return new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
})

const pendingOrdersCount = computed(() => {
  return pendingOrders.value.filter(order => ['pending', 'preparing', 'ready'].includes(order.status)).length
})

// Funciones
const formatCurrency = (value: number): string => {
  if (typeof value !== 'number' || isNaN(value)) return '0,00 €'
  return value.toFixed(2).replace('.', ',') + ' €'
}

const formatTime = (date: Date): string => {
  return new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false }).format(date)
}

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    pending: 'Pendiente',
    preparing: 'En preparación', 
    ready: 'Listo',
    delivering: 'En reparto',
    delivered: 'Entregado',
    cancelled: 'Cancelado'
  }
  return labels[status] || status
}

const getRestaurantAddress = (restaurant: any): string => {
  if (!restaurant.address) return 'Dirección no disponible'
  return `${restaurant.address.street}, ${restaurant.address.city}`
}

const getRestaurantProductCount = (restaurantId: number): number => {
  return allProducts.value.filter(p => p.restaurantId === restaurantId).length
}

// Cargar business REAL usando tu endpoint
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
    business.value = null
  }
}

// Cargar restaurantes REALES del business
const loadRestaurants = async () => {
  try {
    if (!business.value?.id) return

    const response = await api.get(`/api/Restaurants/business/${business.value.id}`)
    if (response.data) {
      restaurants.value = response.data
      console.log('Restaurantes cargados:', restaurants.value)
    }
  } catch (error) {
    console.error('Error cargando restaurantes:', error)
    restaurants.value = []
  }
}

// Cargar productos REALES usando tus endpoints
const loadProducts = async () => {
  try {
    if (!business.value?.id) return

    const allProductsData = []
    
    for (const restaurant of restaurants.value) {
      try {
        const productsResponse = await api.get(`/api/Products/Restaurant/${restaurant.id}`)
        if (productsResponse.data) {
          const restaurantProducts = productsResponse.data.map((product: any) => ({
            ...product,
            restaurantId: restaurant.id,
            restaurantName: restaurant.name,
            image: product.imageUrl
          }))
          allProductsData.push(...restaurantProducts)
        }
      } catch (error) {
        console.error(`Error productos restaurante ${restaurant.id}:`, error)
      }
    }
    
    allProducts.value = allProductsData
    
    // Filtrar productos populares (simulado por ahora)
    popularProducts.value = allProductsData.slice(0, 8).map(product => ({
      ...product,
      ordersCount: Math.floor(Math.random() * 50) + 5,
      revenue: product.price * (Math.floor(Math.random() * 50) + 5)
    }))
    
    console.log('Productos cargados:', allProducts.value.length)
  } catch (error) {
    console.error('Error cargando productos:', error)
    allProducts.value = []
    popularProducts.value = []
  }
}

const selectRestaurant = (restaurantId: number | string) => {
  selectedRestaurantId.value = restaurantId
  console.log('Restaurante seleccionado:', restaurantId)
}

const onRestaurantChange = () => {
  console.log('Cambio de restaurante:', selectedRestaurantId.value)
}

const refreshData = async () => {
  isRefreshing.value = true
  try {
    await loadBusiness()
    await loadRestaurants()
    await loadProducts()
  } finally {
    isRefreshing.value = false
  }
}

const toggleRestaurantOpen = () => {
  isRestaurantOpen.value = !isRestaurantOpen.value
}

const viewOrderDetails = (order: any) => {
  selectedOrder.value = order
  selectedOrderStatus.value = order.status
  orderItems.value = [
    { name: 'Producto ejemplo', quantity: 2, price: 12.50, options: null }
  ]
}

const closeOrderDetails = () => {
  selectedOrder.value = null
  orderItems.value = []
}

const updateOrderStatus = () => {
  closeOrderDetails()
}

onMounted(async () => {
  if (!authStore.isAuthenticated()) {
    const isAuth = await authStore.checkAuth()
    if (!isAuth || (authStore.user?.role !== 'Business' && authStore.user?.role !== 'Admin')) {
      router.push('/login')
      return
    }
  }

  // Cargar todo en secuencia
  await loadBusiness()
  await loadRestaurants()
  await loadProducts()
})
</script>

<style lang="scss" scoped>
.business-home {
  &__restaurant-selector {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    
    @media (max-width: 480px) {
      width: 100%;
    }
  }

  &__selector-label {
    color: #64748b;
    font-weight: 500;
    white-space: nowrap;
  }

  &__selector {
    padding: 0.5rem 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background-color: white;
    color: #1e293b;
    font-size: 0.9rem;
    min-width: 180px;

    &:focus {
      outline: none;
      border-color: #06a98d;
      box-shadow: 0 0 0 3px rgba(6, 169, 141, 0.1);
    }

    @media (max-width: 480px) {
      width: 100%;
      min-width: unset;
    }
  }

  &__restaurants-overview {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03);
    padding: 1.25rem;
    margin-bottom: 2rem;
  }

  &__restaurants-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }

  &__restaurant-card {
    background-color: #f8fafc;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.2s ease;
    cursor: pointer;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      border-color: #cbd5e0;
    }

    &--selected {
      border-color: #06a98d;
      background-color: rgba(6, 169, 141, 0.05);
      
      &:hover {
        border-color: #058a73;
      }
    }
  }

  &__restaurant-image {
    height: 120px;
    position: relative;
    overflow: hidden;
    background-color: #f1f5f9;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__restaurant-status {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    padding: 0.25rem 0.6rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;

    &--open {
      background-color: #dcfce7;
      color: #15803d;
    }

    &--closed {
      background-color: #fee2e2;
      color: #dc2626;
    }
  }

  &__restaurant-info {
    padding: 1rem;
  }

  &__restaurant-name {
    font-size: 1rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 0.5rem;
    line-height: 1.3;
  }

  &__restaurant-address {
    font-size: 0.85rem;
    color: #64748b;
    margin: 0 0 0.75rem;
    line-height: 1.4;
  }

  &__restaurant-stats {
    display: flex;
    gap: 1rem;
  }

  &__restaurant-stat {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.8rem;
    color: #64748b;

    svg {
      width: 14px;
      height: 14px;
      opacity: 0.8;
    }

    span {
      font-weight: 500;
    }
  }

  // Resto de estilos existentes...
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    gap: 1rem;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: stretch;
    }
  }

  &__header-left {
    flex: 1;
  }

  &__header-right {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-shrink: 0;

    @media (max-width: 480px) {
      width: 100%;
      flex-direction: column;
      align-items: flex-start;
    }
  }

  &__date {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: #64748b;
    padding: 0.5rem 0.75rem;
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;

    &-icon {
      width: 16px;
      height: 16px;
      stroke-width: 1.5px;
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

    &--rotating {
      animation: rotate 1s linear infinite;
    }
  }

  &__title {
    font-size: 1.75rem;
    font-weight: 700;
    margin: 0 0 0.25rem;
    color: #1e293b;
    line-height: 1.2;
  }

  &__welcome {
    font-size: 1rem;
    color: #64748b;
    margin: 0;
  }

  &__name {
    font-weight: 600;
    color: #06a98d;
  }

  &__alert {
    display: flex;
    align-items: center;
    gap: 1rem;
    background-color: #fff7ed;
    border-left: 4px solid #f97316;
    border-radius: 8px;
    padding: 1rem 1.25rem;
    margin-bottom: 1.5rem;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
    }

    &-icon {
      background-color: #ffedd5;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      svg {
        width: 24px;
        height: 24px;
        color: #f97316;
      }
    }

    &-content {
      flex: 1;
    }

    &-title {
      font-size: 1rem;
      font-weight: 600;
      color: #9a3412;
      margin: 0 0 0.25rem;
    }

    &-message {
      font-size: 0.9rem;
      color: #7c2d12;
      margin: 0;
      line-height: 1.4;
    }

    &-action {
      background-color: transparent;
      border: 1px solid #fb923c;
      color: #c2410c;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s ease;
      margin-left: auto;

      &:hover {
        background-color: #ffedd5;
        border-color: #f97316;
      }

      @media (max-width: 768px) {
        margin-top: 0.75rem;
        align-self: flex-start;
        margin-left: 0;
      }
    }
  }

  &__summary {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1.25rem;
    margin-bottom: 2rem;
  }

  &__card {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03);
    padding: 1.25rem;
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    transition: all 0.2s ease-in-out;
    border-left: 4px solid transparent;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.07), 0 2px 5px rgba(0, 0, 0, 0.05);
    }

    &--orders {
      border-left-color: #3b82f6;
    }

    &--revenue {
      border-left-color: #10b981;
    }

    &--products {
      border-left-color: #8b5cf6;
    }

    &--rating {
      border-left-color: #f59e0b;
    }
  }

  &__card-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    svg {
      width: 20px;
      height: 20px;
    }

    .business-home__card--orders & {
      background-color: rgba(59, 130, 246, 0.1);
      color: #3b82f6;
    }

    .business-home__card--revenue & {
      background-color: rgba(16, 185, 129, 0.1);
      color: #10b981;
    }

    .business-home__card--products & {
      background-color: rgba(139, 92, 246, 0.1);
      color: #8b5cf6;
    }

    .business-home__card--rating & {
      background-color: rgba(245, 158, 11, 0.1);
      color: #f59e0b;
    }
  }

  &__card-content {
    flex: 1;
  }

  &__card-title {
    font-size: 0.85rem;
    font-weight: 500;
    color: #64748b;
    margin: 0 0 0.35rem;
  }

  &__card-stats {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    margin-bottom: 0.1rem;
  }

  &__card-value {
    font-size: 1.6rem;
    font-weight: 700;
    margin: 0;
    color: #1e293b;
    line-height: 1.2;
  }

  &__card-change {
    display: flex;
    align-items: center;
    gap: 0.15rem;
    font-size: 0.8rem;
    font-weight: 600;

    svg {
      width: 14px;
      height: 14px;
      stroke-width: 2.5px;
    }

    &--positive {
      color: #10b981;
    }

    &--negative {
      color: #ef4444;
    }
  }

  &__card-period {
    font-size: 0.75rem;
    color: #94a3b8;
    margin-top: 0.1rem;
  }

  &__rating-stars {
    position: relative;
    display: inline-block;
    font-size: 1.1rem;
    line-height: 1;
    margin-top: 0.3rem;

    .business-home__stars-filled {
      position: absolute;
      top: 0;
      left: 0;
      white-space: nowrap;
      overflow: hidden;
      color: #f59e0b;
    }

    .business-home__stars-empty {
      color: #e2e8f0;
    }
  }

  &__sections {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 450px), 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
  }

  &__section {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03);
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
  }

  &__section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.25rem;
    flex-shrink: 0;
  }

  &__section-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0;
    color: #1e293b;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__section-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    padding: 0 0.4em;
    background-color: #ef4444;
    color: white;
    font-size: 0.75rem;
    font-weight: 600;
    border-radius: 10px;
    line-height: 1;
  }

  &__section-link {
    display: inline-flex;
    align-items: center;
    font-size: 0.9rem;
    color: #06a98d;
    text-decoration: none;
    font-weight: 500;

    svg {
      width: 16px;
      height: 16px;
      margin-left: 0.35rem;
      transition: transform 0.2s ease-out;
    }

    &:hover {
      color: #058a73;

      svg {
        transform: translateX(2px);
      }
    }
  }

  &__orders-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    flex-grow: 1;
  }

  &__order-item {
    display: flex;
    align-items: stretch;
    border-radius: 8px;
    background-color: #fdfdfd;
    border: 1px solid #e2e8f0;
    transition: all 0.15s ease;
    overflow: hidden;

    &:hover {
      border-color: #cbd5e0;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.04);
    }

    @media (max-width: 600px) {
      flex-direction: column;
    }
  }

  &__order-info {
    flex: 1;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  &__order-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }

  &__order-id {
    font-weight: 600;
    color: #3b82f6;
    margin: 0;
    font-size: 0.9rem;
  }

  &__order-time {
    font-size: 0.8rem;
    color: #94a3b8;
    margin: 0;
  }

  &__order-details {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
  }

  &__customer-name {
    font-size: 0.95rem;
    font-weight: 500;
    color: #1e293b;
    margin: 0;
  }

  &__order-items {
    font-size: 0.85rem;
    color: #64748b;
    margin: 0;
  }

  &__order-actions {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: space-between;
    gap: 0.5rem;
    padding: 1rem;
    min-width: 130px;
    background-color: #f8fafc;
    border-left: 1px solid #e2e8f0;

    @media (max-width: 600px) {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      border-left: none;
      border-top: 1px solid #e2e8f0;
      padding: 0.75rem 1rem;
    }
  }

  &__order-total {
    font-weight: 600;
    color: #1e293b;
    font-size: 1rem;
    margin-bottom: 0.25rem;

    @media (max-width: 600px) {
      margin-bottom: 0;
    }
  }

  &__status {
    font-size: 0.7rem;
    font-weight: 600;
    padding: 0.25rem 0.6rem;
    border-radius: 12px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    align-self: flex-end;
    margin-bottom: 0.5rem;

    @media (max-width: 600px) {
      margin-bottom: 0;
      order: -1;
    }

    &--pending {
      background-color: #fef3c7;
      color: #b45309;
    }

    &--preparing {
      background-color: #dbeafe;
      color: #1e40af;
    }

    &--ready {
      background-color: #e0e7ff;
      color: #3730a3;
    }

    &--delivering {
      background-color: #cffafe;
      color: #0891b2;
    }

    &--delivered {
      background-color: #dcfce7;
      color: #15803d;
    }

    &--cancelled {
      background-color: #fee2e2;
      color: #991b1b;
    }
  }

  &__order-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0.85rem;
    font-weight: 500;
    padding: 0.4rem 0.8rem;
    background-color: #06a98d;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.15s ease;
    width: 100%;

    &:hover {
      background-color: #058a73;
    }

    @media (max-width: 600px) {
      width: auto;
      padding: 0.5rem 1rem;
    }
  }

  &__empty {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
    text-align: center;
    border-top: 1px solid #f1f5f9;
    margin-top: 1.25rem;

    &-icon {
      width: 56px;
      height: 56px;
      background-color: #f1f5f9;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.25rem;
      color: #94a3b8;

      svg {
        width: 28px;
        height: 28px;
      }
    }

    h4 {
      font-size: 1.15rem;
      font-weight: 600;
      color: #334155;
      margin: 0 0 0.5rem;
    }

    p {
      color: #64748b;
      margin: 0 0 1.5rem;
      max-width: 300px;
      line-height: 1.5;
    }
  }

  &__add-product-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.7rem 1.2rem;
    background-color: #06a98d;
    color: white;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.15s ease;

    svg {
      width: 16px;
      height: 16px;
    }

    &:hover {
      background-color: #058a73;
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  }

  &__products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
    gap: 1rem;
    flex-grow: 1;
  }

  &__product-card {
    background-color: white;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #e2e8f0;
    transition: all 0.2s ease-in-out;
    display: flex;
    flex-direction: column;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
      border-color: #cbd5e0;
    }
  }

  &__product-image {
    height: 120px;
    overflow: hidden;
    background-color: #f8fafc;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
  }

  &:hover &__product-image img {
    transform: scale(1.05);
  }

  &__product-info {
    padding: 0.85rem;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }

  &__product-name {
    font-size: 0.9rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 0.35rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.3;
  }

  &__product-price {
    font-weight: 600;
    color: #06a98d;
    margin: 0 0 0.75rem;
    font-size: 0.9rem;
  }

  &__product-stats {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    font-size: 0.75rem;
    color: #64748b;
    margin-top: auto;
  }

  &__product-orders,
  &__product-revenue {
    display: flex;
    align-items: center;
    gap: 0.4rem;

    svg {
      width: 12px;
      height: 12px;
      opacity: 0.8;
    }
  }

  // Modal styles
  &__modal {
    position: fixed;
    inset: 0;
    background-color: rgba(9, 30, 66, 0.54);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
    overflow-y: auto;
  }

  &__modal-content {
    background-color: white;
    border-radius: 12px;
    width: 100%;
    max-width: 550px;
    max-height: calc(100vh - 2rem);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.1);
  }

  &__modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid #e2e8f0;
    flex-shrink: 0;
  }

  &__modal-title {
    font-size: 1.15rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
  }

  &__modal-close {
    background: transparent;
    border: none;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #64748b;
    cursor: pointer;
    border-radius: 50%;
    padding: 0;

    svg {
      width: 20px;
      height: 20px;
    }

    &:hover {
      background-color: #f1f5f9;
      color: #1e293b;
    }
  }

  &__modal-body {
    padding: 1.25rem;
    flex-grow: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  &__order-details-section {
    margin-bottom: 1.5rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__details-title {
    font-size: 0.9rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #475569;
    margin: 0 0 0.75rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #f1f5f9;
  }

  &__details-item {
    display: flex;
    align-items: baseline;
    margin-bottom: 0.6rem;
    font-size: 0.9rem;
    line-height: 1.5;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__details-label {
    font-weight: 500;
    color: #64748b;
    width: 110px;
    flex-shrink: 0;
    margin-right: 0.5rem;
  }

  &__details-value {
    color: #1e293b;
    word-break: break-word;
  }

  &__order-items-list {
    list-style: none;
    padding: 0;
    margin: 0 0 1.25rem;
  }

  &__order-item-detail {
    display: flex;
    align-items: flex-start;
    padding: 0.85rem 0;
    border-bottom: 1px solid #f1f5f9;

    &:first-child {
      padding-top: 0.25rem;
    }

    &:last-child {
      border-bottom: none;
      padding-bottom: 0.25rem;
    }
  }

  &__item-quantity {
    font-size: 0.9rem;
    font-weight: 600;
    color: #06a98d;
    margin-right: 1rem;
    min-width: 25px;
    text-align: right;
  }

  &__item-info {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  &__item-name {
    font-size: 0.9rem;
    font-weight: 500;
    color: #1e293b;
    line-height: 1.3;
  }

  &__item-options {
    font-size: 0.8rem;
    color: #64748b;
    margin-top: 0.2rem;
    font-style: italic;
  }

  &__item-price {
    font-size: 0.9rem;
    font-weight: 500;
    color: #1e293b;
    text-align: right;
    min-width: 70px;
    margin-left: 0.5rem;
  }

  &__order-summary {
    background-color: #f8fafc;
    border-radius: 8px;
    padding: 1rem;
    margin-top: 1rem;
  }

  &__summary-item {
    display: flex;
    justify-content: space-between;
    padding: 0.6rem 0;
    font-size: 0.9rem;
    color: #475569;

    &--total {
      padding-top: 0.85rem;
      margin-top: 0.5rem;
      border-top: 1px solid #e2e8f0;
      font-weight: 700;
      font-size: 1rem;
      color: #1e293b;
    }

    span:first-child {
      font-weight: 500;
    }
  }

  &__modal-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.25rem;
    border-top: 1px solid #e2e8f0;
    background-color: #f8fafc;
    flex-shrink: 0;

    @media (max-width: 520px) {
      flex-direction: column;
      align-items: stretch;
      gap: 1rem;
    }
  }

  &__status-update {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  &__status-label {
    font-size: 0.9rem;
    font-weight: 500;
    color: #1e293b;
    white-space: nowrap;
  }

  &__status-select {
    padding: 0.6rem 0.85rem;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    font-size: 0.9rem;
    color: #1e293b;
    background-color: white;
    flex-grow: 1;

    &:focus {
      outline: none;
      border-color: #06a98d;
      box-shadow: 0 0 0 2px rgba(6, 169, 141, 0.2);
    }
  }

  &__modal-actions {
    display: flex;
    gap: 0.75rem;
  }

  &__modal-btn {
    padding: 0.6rem 1.1rem;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease;
    border: 1px solid transparent;

    @media (max-width: 520px) {
      flex-grow: 1;
      text-align: center;
    }

    &--primary {
      background-color: #06a98d;
      color: white;

      &:hover {
        background-color: #058a73;
      }

      &:active {
        background-color: #047660;
      }
    }

    &--secondary {
      background-color: white;
      color: #475569;
      border-color: #cbd5e1;

      &:hover {
        background-color: #f8fafc;
        border-color: #94a3b8;
      }

      &:active {
        background-color: #f1f5f9;
      }
    }
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>