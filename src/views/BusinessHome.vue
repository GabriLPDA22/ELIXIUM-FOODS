<template>
  <div class="business-home">
    <div class="business-home__header">
      <div class="business-home__header-left">
        <h1 class="business-home__title">¡Hola, <span class="business-home__name">{{ businessName }}</span>!</h1>
        <p class="business-home__welcome">Aquí tienes un resumen de tu actividad.</p>
      </div>
      <div class="business-home__header-right">
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
        <h3 class="business-home__alert-title">Tu negocio está cerrado</h3>
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
            <p class="business-home__card-value">{{ todayOrders }}</p>
            <p v-if="orderChange !== 0"
              :class="['business-home__card-change', orderChange > 0 ? 'business-home__card-change--positive' : 'business-home__card-change--negative']">
              <svg v-if="orderChange > 0" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="17 11 12 6 7 11"></polyline>
                <line x1="12" y1="18" x2="12" y2="6"></line>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="7 13 12 18 17 13"></polyline>
                <line x1="12" y1="6" x2="12" y2="18"></line>
              </svg>
              <span>{{ Math.abs(orderChange) }}%</span>
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
            <p class="business-home__card-value">{{ formatCurrency(todayRevenue) }}</p>
            <p v-if="revenueChange !== 0"
              :class="['business-home__card-change', revenueChange > 0 ? 'business-home__card-change--positive' : 'business-home__card-change--negative']">
              <svg v-if="revenueChange > 0" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
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
              <span>{{ Math.abs(revenueChange) }}%</span>
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
            <p class="business-home__card-value">{{ totalProducts }}</p>
          </div>
          <p v-if="newProducts > 0" class="business-home__card-period">+{{ newProducts }} nuevos esta semana</p>
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
          <p class="business-home__card-value">{{ averageRating.toFixed(1) }}</p>
          <div class="business-home__rating-stars">
            <div class="business-home__stars-filled" :style="{ width: `${(averageRating / 5) * 100}%` }">★★★★★</div>
            <div class="business-home__stars-empty">★★★★★</div>
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
                <p class="business-home__order-items">{{ typeof order.items === 'number' ? order.items :
                  order.items?.length }} artículo(s)</p>
              </div>
            </div>
            <div class="business-home__order-actions">
              <span class="business-home__order-total">{{ formatCurrency(order.total) }}</span>
              <span :class="['business-home__status', `business-home__status--${order.status}`]">{{
                getStatusLabel(order.status) }}</span>
              <button @click="viewOrderDetails(order)" class="business-home__order-btn">Ver Detalles</button>
            </div>
          </div>
          <button v-if="pendingOrders.length > 3 && hasMorePendingOrders" @click="loadMorePendingOrders"
            class="business-home__load-more">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15v-5m-3.5-2.5L12 12l3.5-2.5" />
            </svg>
            <span>Cargar más</span>
          </button>
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
          <router-link :to="{ name: 'business-products-new' }" class="business-home__add-product-btn">
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
              <div class="business-home__summary-item">
                <span>Subtotal</span>
                <span>{{ formatCurrency(calculateSubtotal()) }}</span>
              </div>
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
// Tu script actual de BusinessHome.vue se mantiene igual
// ... (el script que ya proporcionaste)
// Solo asegúrate de que las variables referenciadas en el template (como businessName, isRestaurantOpen, etc.)
// estén definidas y sean reactivas (usando ref o computed).
import { ref, computed, onMounted } from 'vue'
import { useBusinessAuthStore } from '@/stores/businessAuth' // Asumo que este store existe
import { useRouter } from 'vue-router'

const businessAuthStore = useBusinessAuthStore()
const router = useRouter()

const businessName = computed(() => businessAuthStore.businessName || 'Tu Negocio')
const isRestaurantOpen = ref(true)
const todayOrders = ref(12)
const todayRevenue = ref(482.50)
const orderChange = ref(5.7) // Porcentaje positivo
const revenueChange = ref(-2.3) // Porcentaje negativo
const totalProducts = ref(24)
const newProducts = ref(3) // Nuevos productos esta semana
const averageRating = ref(4.7)
const isRefreshing = ref(false)

interface OrderItemDetail { name: string; quantity: number; price: number; options: string | null; }
interface Order { id: number; date?: Date; customerName?: string; items?: number | OrderItemDetail[]; total: number; status: string; } // items puede ser número o array
interface Product { id: number; name: string; price: number; image?: string; ordersCount?: number; revenue?: number; }


const selectedOrder = ref<Order | null>(null)
const selectedOrderStatus = ref('') // Para el select del modal
const orderItems = ref<OrderItemDetail[]>([ // Ejemplo de items para el modal, cargar dinámicamente
  { name: 'Pizza Margarita', quantity: 1, price: 12.95, options: 'Masa fina' },
  { name: 'Ensalada César', quantity: 1, price: 7.50, options: null },
  { name: 'Coca-Cola', quantity: 2, price: 2.50, options: null }
])


const pendingOrders = ref<Order[]>([
  { id: 1025, date: new Date(), customerName: 'María García', items: 3, total: 42.95, status: 'pending' },
  { id: 1024, date: new Date(Date.now() - 30 * 60000), customerName: 'Juan Pérez', items: 2, total: 27.50, status: 'preparing' },
  { id: 1023, date: new Date(Date.now() - 90 * 60000), customerName: 'Ana Martínez', items: 5, total: 63.75, status: 'ready' },
  { id: 1022, date: new Date(Date.now() - 120 * 60000), customerName: 'Luis Fernández', items: 1, total: 15.00, status: 'pending' },
])

const popularProducts = ref<Product[]>([
  { id: 1, name: 'Hamburguesa Clásica Súper Larga con Doble Queso', price: 12.95, image: 'https://via.placeholder.com/300x200/FFDDC1/8B5A2B?text=Hamburguesa', ordersCount: 42, revenue: 543.90 },
  { id: 2, name: 'Pizza Margarita Fresca', price: 14.50, image: 'https://via.placeholder.com/300x200/C1FFD7/2B8B5A?text=Pizza', ordersCount: 38, revenue: 551.00 },
  { id: 3, name: 'Ensalada César con Pollo', price: 9.95, image: 'https://via.placeholder.com/300x200/D7C1FF/5A2B8B?text=Ensalada', ordersCount: 26, revenue: 258.70 },
  { id: 4, name: 'Pasta Carbonara Auténtica', price: 13.75, image: 'https://via.placeholder.com/300x200/FFC1C1/8B2B2B?text=Pasta', ordersCount: 24, revenue: 330.00 },
])

const currentDate = computed(() => {
  return new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
})

const pendingOrdersCount = computed(() => {
  return pendingOrders.value.filter(order => ['pending', 'preparing', 'ready'].includes(order.status)).length
})

const hasMorePendingOrders = ref(true) // Para el botón "Cargar más"

const formatCurrency = (value: number): string => {
  if (typeof value !== 'number' || isNaN(value)) return '0,00 €';
  return value.toFixed(2).replace('.', ',') + ' €'
}

const formatTime = (date?: Date): string => {
  if (!date) return ''
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
  };
  return labels[status] || status;
}


const refreshData = async () => {
  isRefreshing.value = true;
  // Simular llamada API
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Aquí actualizarías tus datos (pendingOrders, popularProducts, etc.)
  console.log('Datos actualizados');
  isRefreshing.value = false;
}

const toggleRestaurantOpen = () => {
  isRestaurantOpen.value = !isRestaurantOpen.value;
  // Aquí podrías llamar a una API para persistir el estado
}

const loadMorePendingOrders = () => {
  // Lógica para cargar más pedidos pendientes
  console.log('Cargando más pedidos pendientes...');
  // Ejemplo: añadir más pedidos mock o llamar a API
  // Por ahora, solo ocultamos el botón
  hasMorePendingOrders.value = false;
}

const viewOrderDetails = (order: Order) => {
  selectedOrder.value = order;
  selectedOrderStatus.value = order.status; // Pre-seleccionar el estado actual en el select
  // Aquí cargarías los items específicos de 'order' en orderItems.value si es necesario
  // Por ahora, usamos el 'orderItems' de ejemplo.
  console.log('Viendo detalles del pedido:', order.id);
}

const closeOrderDetails = () => {
  selectedOrder.value = null;
}
const calculateSubtotal = (): number => {
  // Asegúrate de que orderItems está poblado con los items del selectedOrder
  return orderItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

const updateOrderStatus = () => {
  if (selectedOrder.value) {
    // Lógica para actualizar el estado del pedido en el backend
    console.log(`Actualizando estado del pedido #${selectedOrder.value.id} a ${selectedOrderStatus.value}`);
    // Actualizar localmente (simulación)
    const orderInList = pendingOrders.value.find(o => o.id === selectedOrder.value!.id);
    if (orderInList) {
      orderInList.status = selectedOrderStatus.value;
    }
    closeOrderDetails();
  }
}


onMounted(() => {
  // Cargar datos iniciales si es necesario desde una API
  console.log('Componente Home montado');
  refreshData(); // Cargar datos al montar
})

</script>

<style lang="scss" scoped>
// Tus estilos SCSS actuales se mantienen igual.
// Asegúrate de que las clases usadas en el template de arriba
// (como __summary, __card, __orders-list, __products-grid, etc.)
// tengan estilos definidos.
// ... (los estilos que ya proporcionaste)
.business-home {
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start; // Alinea los items al inicio para mejor distribución vertical
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    gap: 1rem;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: stretch; // Para que los elementos ocupen el ancho
    }
  }

  &__header-left {
    flex: 1; // Permite que tome el espacio disponible
  }

  &__header-right {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-shrink: 0; // Evita que se encoja si el título es largo

    @media (max-width: 480px) {
      width: 100%;
      flex-direction: column; // Stack them on very small screens
      align-items: flex-start; // Align to start
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
    margin: 0 0 0.25rem; // Menos margen inferior
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
    color: #06a98d; // Color principal de tu marca
  }

  &__alert {
    display: flex;
    align-items: center; // Centra verticalmente el icono con el texto
    gap: 1rem;
    background-color: #fff7ed; // Naranja muy claro
    border-left: 4px solid #f97316; // Naranja
    border-radius: 8px; // Bordes redondeados
    padding: 1rem 1.25rem;
    margin-bottom: 1.5rem; // Espacio antes de los cards

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start; // El icono se queda arriba
    }

    &-icon {
      background-color: #ffedd5; // Naranja más claro para el círculo del icono
      width: 40px;
      height: 40px;
      border-radius: 50%; // Círculo perfecto
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0; // Evita que el icono se encoja

      svg {
        width: 24px;
        height: 24px;
        color: #f97316; // Naranja para el icono SVG
      }
    }

    &-content {
      flex: 1; // El contenido toma el espacio restante
    }

    &-title {
      font-size: 1rem;
      font-weight: 600;
      color: #9a3412; // Naranja oscuro para el título
      margin: 0 0 0.25rem;
    }

    &-message {
      font-size: 0.9rem;
      color: #7c2d12; // Naranja medio-oscuro para el mensaje
      margin: 0;
      line-height: 1.4;
    }

    &-action {
      background-color: transparent; // Botón transparente
      border: 1px solid #fb923c; // Borde naranja claro
      color: #c2410c; // Texto naranja oscuro
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s ease;
      margin-left: auto; // Empuja el botón a la derecha si hay espacio

      &:hover {
        background-color: #ffedd5; // Fondo naranja muy claro al pasar el mouse
        border-color: #f97316; // Borde naranja
      }

      @media (max-width: 768px) {
        margin-top: 0.75rem;
        align-self: flex-start; // Botón al inicio en móviles
        margin-left: 0;
      }
    }
  }

  &__summary {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); // Ajusta minmax según necesidad
    gap: 1.25rem;
    margin-bottom: 2rem;
  }

  &__card {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03); // Sombra más sutil
    padding: 1.25rem;
    display: flex;
    align-items: flex-start; // Icono y contenido alineados arriba
    gap: 1rem;
    transition: all 0.2s ease-in-out;
    border-left: 4px solid transparent; // Para el color de borde específico

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.07), 0 2px 5px rgba(0, 0, 0, 0.05);
    }

    &--orders {
      border-left-color: #3b82f6;
    }

    // Azul
    &--revenue {
      border-left-color: #10b981;
    }

    // Verde
    &--products {
      border-left-color: #8b5cf6;
    }

    // Morado
    &--rating {
      border-left-color: #f59e0b;
    }

    // Naranja/Amarillo
  }

  &__card-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px; // Ligeramente menos redondeado que un círculo
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    svg {
      width: 20px; // Iconos un poco más pequeños
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
    margin: 0 0 0.35rem; // Menos espacio
  }

  &__card-stats {
    display: flex;
    align-items: baseline; // Alinear valor y cambio
    gap: 0.5rem; // Espacio entre valor y cambio
    margin-bottom: 0.1rem;
  }

  &__card-value {
    font-size: 1.6rem; // Un poco más grande
    font-weight: 700;
    margin: 0;
    color: #1e293b;
    line-height: 1.2;
  }

  &__card-change {
    display: flex;
    align-items: center;
    gap: 0.15rem; // Menos espacio para el icono de cambio
    font-size: 0.8rem; // Un poco más pequeño
    font-weight: 600; // Más grueso

    svg {
      width: 14px; // Iconos de cambio más pequeños
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
    font-size: 0.75rem; // Texto del periodo más pequeño
    color: #94a3b8;
    margin-top: 0.1rem;
  }

  &__rating-stars {
    position: relative;
    display: inline-block;
    font-size: 1.1rem; // Estrellas un poco más pequeñas
    line-height: 1;
    margin-top: 0.3rem; // Espacio sobre las estrellas

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
    // Para dos columnas, podrías usar: grid-template-columns: repeat(2, 1fr);
    // O para que se adapte:
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 450px), 1fr)); // Adaptable, mínimo 450px o 100% si es más pequeño
    gap: 1.5rem;
    margin-top: 2rem; // Espacio después de los cards de resumen
  }

  &__section {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03);
    padding: 1.25rem;
    // height: 100%; // Quitar para que el contenido defina la altura
    display: flex; // Para controlar el crecimiento del contenido interno
    flex-direction: column; // Contenido se apila verticalmente

    &--pending {
      // Podrías darle un fondo ligeramente diferente si quieres destacarlo
      // background-color: #f7f9fc;
    }
  }

  &__section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.25rem;
    flex-shrink: 0; // Evita que el header se encoja
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
    display: inline-flex; // Para mejor alineación y tamaño
    align-items: center;
    justify-content: center;
    min-width: 20px; // Ancho mínimo
    height: 20px;
    padding: 0 0.4em; // Padding horizontal para números de más de un dígito
    background-color: #ef4444; // Rojo para la notificación
    color: white;
    font-size: 0.75rem;
    font-weight: 600;
    border-radius: 10px; // Píldora
    line-height: 1; // Asegura que el texto no se salga
  }

  &__section-link {
    display: inline-flex; // Mejor alineación con el icono
    align-items: center;
    font-size: 0.9rem;
    color: #06a98d;
    text-decoration: none;
    font-weight: 500;

    svg {
      width: 16px;
      height: 16px;
      margin-left: 0.35rem; // Un poco más de espacio
      transition: transform 0.2s ease-out;
    }

    &:hover {
      color: #058a73; // Un verde más oscuro al pasar el mouse

      svg {
        transform: translateX(2px);
      }

      // Pequeño movimiento
    }
  }

  &__orders-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem; // Espacio entre items de pedido
    flex-grow: 1; // Para que ocupe el espacio si la sección es flex
  }

  &__order-item {
    display: flex;
    align-items: stretch; // Para que info y actions tengan la misma altura
    border-radius: 8px;
    // margin-bottom: 0.75rem; // No necesario si usamos gap en __orders-list
    background-color: #fdfdfd; // Un blanco muy sutilmente diferente
    border: 1px solid #e2e8f0;
    transition: all 0.15s ease;
    overflow: hidden; // Para que el borde redondeado funcione

    &:hover {
      border-color: #cbd5e0;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.04);
    }

    @media (max-width: 600px) {
      // Punto de quiebre para apilar
      flex-direction: column;
    }
  }

  &__order-info {
    flex: 1; // Toma el espacio principal
    padding: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center; // Centra el contenido si es corto
  }

  &__order-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }

  &__order-id {
    font-weight: 600;
    color: #3b82f6; // Azul para el ID
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
    gap: 0.1rem; // Pequeño espacio entre nombre y items
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
    align-items: flex-end; // Alinear a la derecha
    justify-content: space-between; // Espacio entre total/status y botón
    gap: 0.5rem;
    padding: 1rem;
    min-width: 130px; // Ancho mínimo para acciones
    background-color: #f8fafc; // Fondo ligeramente diferente
    border-left: 1px solid #e2e8f0; // Separador

    @media (max-width: 600px) {
      flex-direction: row; // Acciones en fila en móvil
      align-items: center; // Alinear items
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
    margin-bottom: 0.25rem; // Espacio antes del status

    @media (max-width: 600px) {
      margin-bottom: 0;
    }
  }

  &__status {
    // Estilos de los badges de estado
    font-size: 0.7rem; // Más pequeño
    font-weight: 600; // Más grueso
    padding: 0.25rem 0.6rem; // Padding ajustado
    border-radius: 12px; // Más redondeado (píldora)
    text-transform: uppercase;
    letter-spacing: 0.05em;
    align-self: flex-end; // Alinear a la derecha dentro de su contenedor
    margin-bottom: 0.5rem;

    @media (max-width: 600px) {
      margin-bottom: 0;
      order: -1; // Poner el status antes del total en móvil
    }

    &--pending {
      background-color: #fef3c7;
      color: #b45309;
    }

    // Amarillo/Naranja
    &--preparing {
      background-color: #dbeafe;
      color: #1e40af;
    }

    // Azul
    &--ready {
      background-color: #e0e7ff;
      color: #3730a3;
    }

    // Morado/Índigo
    &--delivering {
      background-color: #cffafe;
      color: #0891b2;
    }

    // Cyan
    &--delivered {
      background-color: #dcfce7;
      color: #15803d;
    }

    // Verde
    &--cancelled {
      background-color: #fee2e2;
      color: #991b1b;
    }

    // Rojo
  }

  &__order-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0.85rem;
    font-weight: 500;
    padding: 0.4rem 0.8rem; // Padding ajustado
    background-color: #06a98d;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.15s ease;
    width: 100%; // Botón ocupa todo el ancho disponible en su columna

    &:hover {
      background-color: #058a73;
    }

    @media (max-width: 600px) {
      width: auto; // No ocupar todo el ancho en móvil
      padding: 0.5rem 1rem;
    }
  }

  &__load-more {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 0.75rem;
    padding: 0.6rem;
    background-color: transparent;
    border: 1px solid #e2e8f0; // Borde más sutil
    border-radius: 8px;
    color: #475569; // Color de texto más oscuro
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease;
    width: 100%; // Ocupa todo el ancho

    svg {
      width: 16px;
      height: 16px;
    }

    &:hover {
      background-color: #f8fafc;
      border-color: #06a98d; // Borde verde al pasar el mouse
      color: #06a98d; // Texto verde
    }
  }


  &__empty {
    // Estilos para los mensajes de "no hay elementos"
    flex-grow: 1; // Ocupa el espacio vertical restante
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem; // Más padding vertical
    text-align: center;
    border-top: 1px solid #f1f5f9; // Separador sutil si hay header
    margin-top: 1.25rem; // Si el header está presente

    &-icon {
      width: 56px; // Icono más grande
      height: 56px;
      background-color: #f1f5f9; // Fondo más claro
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.25rem; // Más espacio
      color: #94a3b8;

      svg {
        width: 28px;
        height: 28px;
      }

      // SVG dentro del icono más grande
    }

    h4 {
      font-size: 1.15rem; // Título del empty state un poco más grande
      font-weight: 600;
      color: #334155; // Color de texto un poco más oscuro
      margin: 0 0 0.5rem;
    }

    p {
      color: #64748b;
      margin: 0 0 1.5rem;
      max-width: 300px; // Ancho máximo del párrafo
      line-height: 1.5;
    }
  }

  &__add-product-btn {
    // Botón para añadir producto
    display: inline-flex;
    align-items: center;
    gap: 0.6rem; // Más espacio con el icono
    padding: 0.7rem 1.2rem; // Botón más grande
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
    grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); // Ajusta minmax
    gap: 1rem;
    flex-grow: 1;
  }

  &__product-card {
    background-color: white;
    border-radius: 8px;
    overflow: hidden; // Para la imagen y hover
    border: 1px solid #e2e8f0;
    transition: all 0.2s ease-in-out;
    display: flex;
    flex-direction: column; // Para que el contenido se expanda bien

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
      border-color: #cbd5e0;
    }
  }

  &__product-image {
    height: 120px; // Altura fija para la imagen
    overflow: hidden; // Para el efecto de zoom de la imagen
    background-color: #f8fafc; // Color de fondo para imágenes transparentes o mientras carga

    img {
      width: 100%;
      height: 100%;
      object-fit: cover; // Cubre el área sin distorsionar
      transition: transform 0.3s ease;
    }

    // No es necesario el hover aquí si el card ya tiene un hover
  }

  &:hover &__product-image img {
    // Efecto de zoom en la imagen cuando se hace hover en la tarjeta
    transform: scale(1.05);
  }


  &__product-info {
    padding: 0.85rem; // Padding consistente
    display: flex;
    flex-direction: column;
    flex-grow: 1; // Para que ocupe el espacio restante
  }

  &__product-name {
    font-size: 0.9rem; // Un poco más pequeño si el espacio es limitado
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 0.35rem;
    white-space: nowrap; // Evita que el nombre se rompa en varias líneas
    overflow: hidden; // Oculta el texto que se desborda
    text-overflow: ellipsis; // Añade "..." al final del texto desbordado
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
    font-size: 0.75rem; // Estadísticas más pequeñas
    color: #64748b;
    margin-top: auto; // Empuja las estadísticas al final si hay espacio
  }

  &__product-orders,
  &__product-revenue {
    display: flex;
    align-items: center;
    gap: 0.4rem; // Menos espacio para el icono

    svg {
      width: 12px; // Iconos más pequeños
      height: 12px;
      opacity: 0.8; // Ligeramente más visibles
    }
  }

  // --- Modal Styles ---
  &__modal {
    position: fixed;
    inset: 0; // Equivalente a top, left, right, bottom = 0
    background-color: rgba(9, 30, 66, 0.54); // Color de fondo semi-transparente (más corporativo)
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000; // Asegura que esté por encima de todo
    padding: 1rem; // Espacio por si el modal es muy grande
    overflow-y: auto; // Permite scroll si el modal es más alto que la pantalla
  }

  &__modal-content {
    background-color: white;
    border-radius: 12px; // Bordes más redondeados
    width: 100%;
    max-width: 550px; // Ancho máximo del modal
    max-height: calc(100vh - 2rem); // Altura máxima, dejando espacio
    display: flex;
    flex-direction: column;
    overflow: hidden; // El scroll principal estará en modal-body
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.1);
  }

  &__modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.25rem; // Padding ajustado
    border-bottom: 1px solid #e2e8f0;
    flex-shrink: 0; // Evita que se encoja
  }

  &__modal-title {
    font-size: 1.15rem; // Título un poco más grande
    font-weight: 600;
    color: #1e293b;
    margin: 0;
  }

  &__modal-close {
    background: transparent; // Botón transparente
    border: none;
    width: 32px; // Área de click más grande
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #64748b;
    cursor: pointer;
    border-radius: 50%; // Círculo
    padding: 0; // Reset padding

    svg {
      width: 20px;
      height: 20px;
    }

    // Icono un poco más grande

    &:hover {
      background-color: #f1f5f9;
      color: #1e293b;
    }
  }

  &__modal-body {
    padding: 1.25rem;
    flex-grow: 1; // Ocupa el espacio disponible
    overflow-y: auto; // Scroll interno para el contenido del cuerpo
    -webkit-overflow-scrolling: touch; // Scroll suave en iOS
  }

  &__order-details-section {
    margin-bottom: 1.5rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__details-title {
    font-size: 0.9rem; // Título de sección más pequeño
    font-weight: 600;
    text-transform: uppercase; // Mayúsculas para destacar
    letter-spacing: 0.05em;
    color: #475569; // Color grisáceo
    margin: 0 0 0.75rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #f1f5f9;
  }

  &__details-item {
    display: flex; // Para alinear etiqueta y valor
    align-items: baseline;
    margin-bottom: 0.6rem; // Espacio entre items
    font-size: 0.9rem; // Tamaño de fuente base
    line-height: 1.5;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__details-label {
    font-weight: 500;
    color: #64748b; // Etiqueta en gris
    width: 110px; // Ancho fijo para etiquetas
    flex-shrink: 0; // Evita que se encoja
    margin-right: 0.5rem;
  }

  &__details-value {
    color: #1e293b; // Valor en color oscuro
    word-break: break-word; // Para valores largos
  }

  &__order-items-list {
    list-style: none;
    padding: 0;
    margin: 0 0 1.25rem; // Margen inferior después de la lista
  }

  &__order-item-detail {
    display: flex;
    align-items: flex-start; // Alinear items al inicio
    padding: 0.85rem 0; // Más padding vertical
    border-bottom: 1px solid #f1f5f9;

    &:first-child {
      padding-top: 0.25rem;
    }

    // Menos padding arriba para el primero
    &:last-child {
      border-bottom: none;
      padding-bottom: 0.25rem;
    }

    // Sin borde y menos padding para el último
  }

  &__item-quantity {
    font-size: 0.9rem;
    font-weight: 600;
    color: #06a98d; // Color principal para la cantidad
    margin-right: 1rem; // Más espacio
    min-width: 25px; // Ancho mínimo para la cantidad
    text-align: right;
  }

  &__item-info {
    flex: 1; // Toma el espacio principal
    display: flex;
    flex-direction: column;
  }

  &__item-name {
    font-size: 0.9rem;
    font-weight: 500; // Nombre del item un poco más grueso
    color: #1e293b;
    line-height: 1.3;
  }

  &__item-options {
    font-size: 0.8rem;
    color: #64748b;
    margin-top: 0.2rem; // Menos espacio
    font-style: italic; // Opciones en cursiva
  }

  &__item-price {
    font-size: 0.9rem;
    font-weight: 500;
    color: #1e293b;
    text-align: right;
    min-width: 70px; // Ancho mínimo para el precio
    margin-left: 0.5rem;
  }

  &__order-summary {
    background-color: #f8fafc;
    border-radius: 8px;
    padding: 1rem; // Más padding
    margin-top: 1rem; // Espacio antes del resumen
  }

  &__summary-item {
    display: flex;
    justify-content: space-between;
    padding: 0.6rem 0; // Padding ajustado
    font-size: 0.9rem;
    color: #475569; // Color de texto del resumen

    &--total {
      padding-top: 0.85rem;
      margin-top: 0.5rem; // Más espacio antes del total
      border-top: 1px solid #e2e8f0; // Borde más visible
      font-weight: 700; // Total más grueso
      font-size: 1rem; // Total un poco más grande
      color: #1e293b;
    }

    span:first-child {
      font-weight: 500;
    }

    // Etiqueta del resumen un poco más gruesa
  }

  &__modal-footer {
    display: flex;
    align-items: center;
    justify-content: space-between; // Espacio entre select y botones
    padding: 1rem 1.25rem; // Padding ajustado
    border-top: 1px solid #e2e8f0;
    background-color: #f8fafc; // Fondo sutil para el footer
    flex-shrink: 0; // Evita que se encoja

    @media (max-width: 520px) {
      // Punto de quiebre para apilar el footer
      flex-direction: column;
      align-items: stretch; // Botones y select ocupan todo el ancho
      gap: 1rem;
    }
  }

  &__status-update {
    display: flex;
    align-items: center;
    gap: 0.75rem;

    @media (max-width: 520px) {
      // Ya se estira por el flex-direction column del footer
    }
  }

  &__status-label {
    font-size: 0.9rem;
    font-weight: 500;
    color: #1e293b;
    white-space: nowrap; // Evita que se rompa la etiqueta
  }

  &__status-select {
    padding: 0.6rem 0.85rem; // Padding del select
    border: 1px solid #cbd5e1; // Borde un poco más oscuro
    border-radius: 6px;
    font-size: 0.9rem;
    color: #1e293b;
    background-color: white;
    flex-grow: 1; // Para que ocupe el espacio si está en flex

    &:focus {
      outline: none;
      border-color: #06a98d;
      box-shadow: 0 0 0 2px rgba(6, 169, 141, 0.2);
    }
  }

  &__modal-actions {
    display: flex;
    gap: 0.75rem;

    @media (max-width: 520px) {
      // Ya se estira por el flex-direction column del footer
    }
  }

  &__modal-btn {
    padding: 0.6rem 1.1rem; // Padding de botones
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease;
    border: 1px solid transparent; // Para mantener el layout

    @media (max-width: 520px) {
      flex-grow: 1; // Botones ocupan el espacio
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
      color: #475569; // Color de texto
      border-color: #cbd5e1; // Borde

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
