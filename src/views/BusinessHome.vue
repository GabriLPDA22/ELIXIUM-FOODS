<template>
  <div class="business-home">
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

        <div v-if="popularProducts.length === 0" class="business-home__empty">
          <router-link :to="{ name: 'business-products' }" class="business-home__add-product-btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Añadir Producto</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Tu script actual de BusinessHome.vue se mantiene igual
import { ref, computed, onMounted } from 'vue' // Asegúrate de tener estas importaciones
import { useBusinessAuthStore } from '@/stores/businessAuth' // Asumo que este store existe
import { useRouter } from 'vue-router' // Si necesitas usar router programáticamente

const businessAuthStore = useBusinessAuthStore() // Inicializa si es necesario
const router = useRouter() // Inicializa si es necesario

const businessName = computed(() => businessAuthStore.businessName || 'Negocio') // Ejemplo con fallback
const isRestaurantOpen = ref(true)
const todayOrders = ref(12)
const todayRevenue = ref(482.50)
const orderChange = ref(5.7)
const revenueChange = ref(-2.3)
const totalProducts = ref(24)
const newProducts = ref(3)
const averageRating = ref(4.7)
const isRefreshing = ref(false)

// Define los tipos para selectedOrder, pendingOrders y popularProducts para mayor claridad
interface OrderItemDetail { name: string; quantity: number; price: number; options: string | null; }
interface Order { id: number; date?: Date; customerName?: string; items?: number | OrderItemDetail[]; total: number; status: string; }
interface Product { id: number; name: string; price: number; image?: string; ordersCount?: number; revenue?: number; }

const selectedOrder = ref<Order | null>(null)
const selectedOrderStatus = ref('')
const orderItems = ref<OrderItemDetail[]>([
  { name: 'Pizza Margarita', quantity: 1, price: 12.95, options: 'Masa fina' },
  { name: 'Ensalada César', quantity: 1, price: 7.50, options: null },
  { name: 'Coca-Cola', quantity: 2, price: 2.50, options: null }
])

const pendingOrders = ref<Order[]>([
  { id: 1025, date: new Date(2023, 4, 15, 14, 30), customerName: 'María García', items: 3, total: 42.95, status: 'pending' },
  { id: 1024, date: new Date(2023, 4, 15, 13, 45), customerName: 'Juan Pérez', items: 2, total: 27.50, status: 'preparing' },
  { id: 1023, date: new Date(2023, 4, 15, 12, 15), customerName: 'Ana Martínez', items: 5, total: 63.75, status: 'ready' }
])

const popularProducts = ref<Product[]>([
  { id: 1, name: 'Hamburguesa Clásica', price: 12.95, image: '/images/product-placeholder.png', ordersCount: 42, revenue: 543.90 },
  { id: 2, name: 'Pizza Margarita', price: 14.50, image: '/images/product-placeholder.png', ordersCount: 38, revenue: 551.00 },
  { id: 3, name: 'Ensalada César', price: 9.95, image: '/images/product-placeholder.png', ordersCount: 26, revenue: 258.70 },
  { id: 4, name: 'Pasta Carbonara', price: 13.75, image: '/images/product-placeholder.png', ordersCount: 24, revenue: 330.00 }
])

const currentDate = computed(() => {
  return new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
})

const pendingOrdersCount = computed(() => {
  return pendingOrders.value.filter(order => ['pending', 'preparing', 'ready'].includes(order.status)).length
})

const hasMorePendingOrders = ref(true)

const formatCurrency = (value: number): string => {
  return value.toFixed(2).replace('.', ',') + ' €'
}

const formatTime = (date?: Date): string => {
  if (!date) return ''
  return new Intl.DateTimeFormat('es', { hour: '2-digit', minute: '2-digit' }).format(date)
}

const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'pending': return 'Pendiente';
    case 'preparing': return 'En preparación';
    case 'ready': return 'Listo';
    default: return status;
  }
}

const refreshData = async () => { isRefreshing.value = true; await new Promise(resolve => setTimeout(resolve, 1000)); isRefreshing.value = false; }
const toggleRestaurantOpen = () => { isRestaurantOpen.value = !isRestaurantOpen.value; }
const loadMorePendingOrders = () => { hasMorePendingOrders.value = false; }
const viewOrderDetails = (order: Order) => { selectedOrder.value = order; selectedOrderStatus.value = order.status; }
const closeOrderDetails = () => { selectedOrder.value = null; }
const calculateSubtotal = (): number => { return orderItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0); }
const updateOrderStatus = () => { if (selectedOrder.value) { selectedOrder.value.status = selectedOrderStatus.value; closeOrderDetails(); } }

onMounted(() => { /* Cargar datos iniciales */ })
</script>

<style lang="scss" scoped>
.business-home {
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    gap: 1rem;

    @media (max-width: 768px) {
      flex-direction: column;
    }
  }

  &__header-left {
    flex: 1;
  }

  &__header-right {
    display: flex;
    align-items: center;
    gap: 1rem;

    @media (max-width: 480px) {
      width: 100%;
      justify-content: space-between;
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
    margin: 0 0 0.5rem;
    color: #1e293b;
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
      border-radius: 20px;
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
      color: #9a3412;
      margin: 0;
    }

    &-action {
      background-color: white;
      border: 1px solid #fdba74;
      color: #c2410c;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s ease;

      &:hover {
        background-color: #ffedd5;
        border-color: #fb923c;
      }

      @media (max-width: 768px) {
        margin-top: 0.75rem;
        align-self: flex-end;
      }
    }
  }

  &__summary {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1.25rem;
    margin-bottom: 2rem;

    @media (max-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 480px) {
      grid-template-columns: 1fr;
    }
  }

  &__card {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 1.25rem;
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    transition: all 0.2s ease;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    &--orders {
      border-left: 4px solid #3b82f6;
    }

    &--revenue {
      border-left: 4px solid #10b981;
    }

    &--products {
      border-left: 4px solid #8b5cf6;
    }

    &--rating {
      border-left: 4px solid #f59e0b;
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
    margin: 0 0 0.5rem;
  }

  &__card-stats {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
  }

  &__card-value {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
    color: #1e293b;
  }

  &__card-change {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.85rem;
    font-weight: 500;
    color: #ef4444;

    svg {
      width: 16px;
      height: 16px;
    }

    &--positive {
      color: #10b981;
    }

    &--negative {
      color: #ef4444;
    }
  }

  &__card-period {
    font-size: 0.8rem;
    color: #94a3b8;
    margin: 0.25rem 0 0;
  }

  &__rating-stars {
    position: relative;
    display: inline-block;
    font-size: 1.25rem;
    line-height: 1;
    margin-top: 0.5rem;

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
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 1.5rem;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  &__section {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 1.25rem;
    height: 100%;
    display: flex;
    flex-direction: column;

    &--pending {
      background-color: #fbfdfe;
    }
  }

  &__section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.25rem;
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
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    background-color: #ef4444;
    color: white;
    font-size: 0.75rem;
    font-weight: 600;
    border-radius: 50%;
  }

  &__section-link {
    display: flex;
    align-items: center;
    font-size: 0.9rem;
    color: #06a98d;
    text-decoration: none;
    font-weight: 500;

    svg {
      width: 16px;
      height: 16px;
      margin-left: 0.25rem;
      transition: transform 0.2s ease;
    }

    &:hover {
      color: #058a73;

      svg {
        transform: translateX(3px);
      }
    }
  }

  &__empty {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1rem;
    text-align: center;

    &-icon {
      width: 60px;
      height: 60px;
      background-color: #f8fafc;
      border-radius: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
      color: #94a3b8;

      svg {
        width: 30px;
        height: 30px;
      }
    }

    h4 {
      font-size: 1.1rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 0.5rem;
    }

    p {
      color: #64748b;
      margin: 0 0 1.5rem;
      max-width: 250px;
    }
  }

  &__add-product-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1rem;
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
    }
  }

  &__orders-list {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  &__order-item {
    display: flex;
    align-items: stretch;
    border-radius: 8px;
    margin-bottom: 0.75rem;
    background-color: white;
    border: 1px solid #e2e8f0;
    transition: all 0.15s ease;
    overflow: hidden;

    &:hover {
      border-color: #cbd5e0;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    }

    @media (max-width: 640px) {
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
  }

  &__order-time {
    font-size: 0.8rem;
    color: #94a3b8;
    margin: 0;
  }

  &__order-details {
    display: flex;
    flex-direction: column;
  }

  &__customer-name {
    font-size: 0.95rem;
    font-weight: 500;
    color: #1e293b;
    margin: 0 0 0.25rem;
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
    justify-content: center;
    gap: 0.5rem;
    padding: 1rem;
    min-width: 120px;
    background-color: #f8fafc;
    border-left: 1px solid #e2e8f0;

    @media (max-width: 640px) {
      flex-direction: row;
      justify-content: space-between;
      border-left: none;
      border-top: 1px solid #e2e8f0;
    }
  }

  &__order-total {
    font-weight: 600;
    color: #1e293b;
  }

  &__status {
    font-size: 0.75rem;
    font-weight: 500;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;

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

  &__order-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0.85rem;
    font-weight: 500;
    padding: 0.4rem 0.75rem;
    background-color: #06a98d;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover {
      background-color: #058a73;
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
    border: 1px dashed #cbd5e0;
    border-radius: 8px;
    color: #64748b;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease;

    svg {
      width: 16px;
      height: 16px;
    }

    &:hover {
      background-color: #f8fafc;
      border-color: #94a3b8;
      color: #1e293b;
    }
  }

  &__products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1rem;

    @media (max-width: 640px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  &__product-card {
    background-color: white;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #e2e8f0;
    transition: all 0.2s ease;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      border-color: #cbd5e0;
    }
  }

  &__product-image {
    height: 120px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    &:hover img {
      transform: scale(1.05);
    }
  }

  &__product-info {
    padding: 0.75rem;
  }

  &__product-name {
    font-size: 0.95rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 0.25rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
    font-size: 0.8rem;
    color: #64748b;
  }

  &__product-orders,
  &__product-revenue {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    svg {
      width: 14px;
      height: 14px;
      opacity: 0.7;
    }
  }

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
    z-index: 50;
    padding: 1rem;
  }

  &__modal-content {
    background-color: white;
    border-radius: 12px;
    width: 100%;
    max-width: 550px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  &__modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem;
    border-bottom: 1px solid #e2e8f0;
  }

  &__modal-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
  }

  &__modal-close {
    background: none;
    border: none;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #64748b;
    cursor: pointer;
    border-radius: 4px;

    svg {
      width: 18px;
      height: 18px;
    }

    &:hover {
      background-color: #f1f5f9;
      color: #1e293b;
    }
  }

  &__modal-body {
    padding: 1.25rem;
    flex: 1;
    overflow-y: auto;
  }

  &__order-details-section {
    margin-bottom: 1.5rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__details-title {
    font-size: 0.95rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 0.75rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #f1f5f9;
  }

  &__details-item {
    display: flex;
    margin-bottom: 0.5rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__details-label {
    font-size: 0.9rem;
    font-weight: 500;
    color: #64748b;
    width: 100px;
    flex-shrink: 0;
  }

  &__details-value {
    font-size: 0.9rem;
    color: #1e293b;
  }

  &__order-items-list {
    list-style: none;
    padding: 0;
    margin: 0 0 1.25rem;
  }

  &__order-item-detail {
    display: flex;
    align-items: flex-start;
    padding: 0.75rem 0;
    border-bottom: 1px solid #f1f5f9;

    &:last-child {
      border-bottom: none;
    }
  }

  &__item-quantity {
    font-size: 0.9rem;
    font-weight: 600;
    color: #1e293b;
    margin-right: 0.75rem;
    min-width: 30px;
  }

  &__item-info {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  &__item-name {
    font-size: 0.9rem;
    color: #1e293b;
  }

  &__item-options {
    font-size: 0.8rem;
    color: #64748b;
    margin-top: 0.25rem;
  }

  &__item-price {
    font-size: 0.9rem;
    font-weight: 500;
    color: #1e293b;
    text-align: right;
  }

  &__order-summary {
    background-color: #f8fafc;
    border-radius: 8px;
    padding: 0.75rem 1rem;
  }

  &__summary-item {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    font-size: 0.9rem;
    color: #64748b;

    &--total {
      padding-top: 0.75rem;
      margin-top: 0.25rem;
      border-top: 1px dashed #e2e8f0;
      font-weight: 600;
      color: #1e293b;
    }
  }

  &__modal-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem;
    border-top: 1px solid #e2e8f0;
    background-color: #f8fafc;

    @media (max-width: 480px) {
      flex-direction: column;
      gap: 1rem;
    }
  }

  &__status-update {
    display: flex;
    align-items: center;
    gap: 0.75rem;

    @media (max-width: 480px) {
      width: 100%;
    }
  }

  &__status-label {
    font-size: 0.9rem;
    font-weight: 500;
    color: #1e293b;
  }

  &__status-select {
    padding: 0.5rem 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    font-size: 0.9rem;
    color: #1e293b;
    background-color: white;

    @media (max-width: 480px) {
      flex: 1;
    }
  }

  &__modal-actions {
    display: flex;
    gap: 0.75rem;

    @media (max-width: 480px) {
      width: 100%;
    }
  }

  &__modal-btn {
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease;

    @media (max-width: 480px) {
      flex: 1;
      text-align: center;
    }

    &--primary {
      background-color: #06a98d;
      color: white;
      border: none;

      &:hover {
        background-color: #058a73;
      }
    }

    &--secondary {
      background-color: white;
      color: #64748b;
      border: 1px solid #e2e8f0;

      &:hover {
        background-color: #f1f5f9;
        color: #1e293b;
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
