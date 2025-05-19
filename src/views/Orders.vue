<!-- src/views/Orders.vue -->
<template>
  <div class="orders-page">
    <div class="container">
      <h1 class="page-title">Mis Pedidos</h1>

      <!-- Orders list -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p class="loading-text">Cargando tus pedidos...</p>
      </div>

      <div v-else-if="orders.length === 0" class="empty-orders">
        <div class="empty-orders__icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
            <line x1="9" y1="9" x2="9.01" y2="9"></line>
            <line x1="15" y1="9" x2="15.01" y2="9"></line>
          </svg>
        </div>
        <h2 class="empty-orders__title">No tienes pedidos recientes</h2>
        <p class="empty-orders__text">Explora restaurantes y comienza a ordenar comida deliciosa</p>
        <router-link to="/restaurants" class="empty-orders__button">Ver restaurantes</router-link>
      </div>

      <div v-else class="orders-list">
        <div v-for="order in orders" :key="order.id" class="order-card" @click="viewOrderDetails(order.id)">
          <div class="order-card__header">
            <div class="order-card__restaurant">{{ order.restaurantName }}</div>
            <div class="order-card__date">{{ formatDate(order.createdAt) }}</div>
          </div>

          <div class="order-card__items">
            <div class="order-card__items-text">
              {{ summarizeOrderItems(order.items) }}
            </div>
          </div>

          <div class="order-card__footer">
            <div class="order-card__price">${{ order.total.toFixed(2) }}</div>
            <div class="order-card__status" :class="getStatusClass(order.status)">
              {{ getStatusText(order.status) }}
            </div>
          </div>

          <div class="order-card__action">
            <span class="order-card__view">
              Ver detalles
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { orderService, OrderStatus } from '@/services/orderService';

const router = useRouter();

// State
const loading = ref(true);
const orders = ref<any[]>([]);

// Load orders when component mounts
onMounted(async () => {
  try {
    loading.value = true;
    const userOrders = await orderService.getUserOrders();
    
    // Add restaurant names (in a real app this data would come from the API)
    orders.value = userOrders.map(order => ({
      ...order,
      restaurantName: getRestaurantName(order.restaurantId)
    }));
  } catch (error) {
    console.error('Error loading orders:', error);
  } finally {
    loading.value = false;
  }
});

// Helper functions
function getRestaurantName(restaurantId: number): string {
  // This would be a real lookup in a full implementation
  const restaurantNames: {[key: number]: string} = {
    123: 'Burger Express',
    124: 'Pizza Palace',
    125: 'Healthy Greens'
  };
  
  return restaurantNames[restaurantId] || 'Restaurant';
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function summarizeOrderItems(items: any[]): string {
  if (!items || items.length === 0) return 'No items';
  
  const itemSummary = items.map(item => `${item.quantity}× ${item.name}`).join(', ');
  
  // Truncate if too long
  if (itemSummary.length > 60) {
    return itemSummary.substring(0, 57) + '...';
  }
  
  return itemSummary;
}

function getStatusClass(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.DELIVERED:
      return 'status--delivered';
    case OrderStatus.CANCELLED:
      return 'status--cancelled';
    case OrderStatus.ON_THE_WAY:
      return 'status--on-the-way';
    case OrderStatus.ACCEPTED:
    case OrderStatus.PREPARING:
    case OrderStatus.READY_FOR_PICKUP:
      return 'status--preparing';
    default:
      return 'status--pending';
  }
}

function getStatusText(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.PENDING:
      return 'Pendiente';
    case OrderStatus.ACCEPTED:
      return 'Aceptado';
    case OrderStatus.PREPARING:
      return 'Preparando';
    case OrderStatus.READY_FOR_PICKUP:
      return 'Listo para recoger';
    case OrderStatus.ON_THE_WAY:
      return 'En camino';
    case OrderStatus.DELIVERED:
      return 'Entregado';
    case OrderStatus.CANCELLED:
      return 'Cancelado';
    default:
      return status;
  }
}

function viewOrderDetails(orderId: number): void {
  router.push(`/orders/${orderId}`);
}
</script>

<style lang="scss" scoped>
// Variables
$primary-color: #06C167; // Color principal de Uber Eats
$black: #000000;
$white: #FFFFFF;
$light-gray: #F6F6F6;
$medium-gray: #EEEEEE;
$dark-gray: #545454;
$text-primary: #000000;
$text-secondary: #757575;
$success-color: #06C167;
$warning-color: #FF8000;
$error-color: #ff4444;
$border-radius-sm: 8px;
$border-radius: 16px;
$box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
$transition: all 0.2s ease;

// Container
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;

  @media (max-width: 768px) {
    padding: 0 16px;
  }
}

// Orders page
.orders-page {
  background-color: $light-gray;
  min-height: 100vh;
  padding: 40px 0 60px;
}

// Page title
.page-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 32px;
  color: $text-primary;
}

// Loading container
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;

  .loading-spinner {
    width: 48px;
    height: 48px;
    border: 3px solid $light-gray;
    border-radius: 50%;
    border-top-color: $primary-color;
    animation: spinner 1s linear infinite;
    margin-bottom: 16px;
  }

  .loading-text {
    color: $text-secondary;
    font-size: 16px;
  }

  @keyframes spinner {
    to {
      transform: rotate(360deg);
    }
  }
}

// Empty orders
.empty-orders {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 60px 0;

  &__icon {
    width: 120px;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: $white;
    border-radius: 50%;
    color: $text-secondary;
    margin-bottom: 32px;
    box-shadow: $box-shadow;
  }

  &__title {
    font-size: 24px;
    font-weight: 700;
    color: $text-primary;
    margin: 0 0 12px;
  }

  &__text {
    font-size: 16px;
    color: $text-secondary;
    margin: 0 0 32px;
    max-width: 500px;
  }

  &__button {
    background-color: $primary-color;
    color: $white;
    font-weight: 600;
    padding: 12px 24px;
    border-radius: $border-radius-sm;
    text-decoration: none;
    box-shadow: 0 4px 8px rgba(6, 193, 103, 0.2);
    transition: $transition;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(6, 193, 103, 0.3);
    }
  }
}

// Orders list
.orders-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

// Order card
.order-card {
  background-color: $white;
  border-radius: $border-radius;
  box-shadow: $box-shadow;
  padding: 20px;
  cursor: pointer;
  transition: $transition;
  position: relative;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
  }

  &__restaurant {
    font-weight: 600;
    font-size: 18px;
    color: $text-primary;
  }

  &__date {
    color: $text-secondary;
    font-size: 14px;
  }

  &__items {
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid $light-gray;
  }

  &__items-text {
    color: $text-secondary;
    font-size: 14px;
    line-height: 1.5;
  }

  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__price {
    font-weight: 600;
    font-size: 16px;
    color: $text-primary;
  }

  &__status {
    font-size: 14px;
    font-weight: 500;
    padding: 4px 10px;
    border-radius: 100px;
    
    &.status--delivered {
      background-color: rgba($success-color, 0.1);
      color: $success-color;
    }
    
    &.status--cancelled {
      background-color: rgba($error-color, 0.1);
      color: $error-color;
    }
    
    &.status--on-the-way {
      background-color: rgba($warning-color, 0.1);
      color: $warning-color;
    }
    
    &.status--preparing {
      background-color: rgba(#3b82f6, 0.1);
      color: #3b82f6;
    }
    
    &.status--pending {
      background-color: rgba($text-secondary, 0.1);
      color: $text-secondary;
    }
  }

  &__action {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
  }

  &__view {
    color: $primary-color;
    font-weight: 500;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 4px;
  }
}
</style>