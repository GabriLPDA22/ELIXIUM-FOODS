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

      <div v-else-if="error" class="error-container">
        <div class="error-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <h2 class="error-title">Error al cargar pedidos</h2>
        <p class="error-text">{{ error }}</p>
        <button @click="loadOrders" class="retry-button">Intentar de nuevo</button>
      </div>

      <div v-else-if="orders.length === 0" class="empty-orders">
        <div class="empty-orders__icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
            <line x1="9" y1="9" x2="9.01" y2="9"></line>
            <line x1="15" y1="9" x2="15.01" y2="9"></line>
          </svg>
        </div>
        <h2 class="empty-orders__title">No tienes pedidos recientes</h2>
        <p class="empty-orders__text">Explora restaurantes y comienza a ordenar comida deliciosa</p>
        <router-link to="/" class="empty-orders__button">Explorar restaurantes</router-link>
      </div>

      <div v-else class="orders-list">
        <div v-for="order in orders" :key="order.id" class="order-card" @click="viewOrderDetails(order.id)">
          <div class="order-card__header">
            <div class="order-card__restaurant">{{ order.restaurantName || 'Restaurante' }}</div>
            <div class="order-card__date">{{ formatDate(order.createdAt) }}</div>
          </div>

          <div class="order-card__items">
            <div class="order-card__items-text">
              {{ summarizeOrderItems(order.orderItems || []) }}
            </div>
          </div>

          <div class="order-card__footer">
            <div class="order-card__price">${{ order.total.toFixed(2) }}</div>
            <div class="order-card__status" :class="getStatusClass(order.status)">
              {{ getStatusText(order.status) }}
            </div>
          </div>

          <div class="order-card__actions">
            <button v-if="canReorder(order)" @click.stop="reorderItems(order)" class="action-btn reorder-btn">
              Pedir de nuevo
            </button>
            <button v-if="canCancel(order)" @click.stop="showCancelModal(order)" class="action-btn cancel-btn">
              Cancelar
            </button>
            <span class="order-card__view">
              Ver detalles
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </span>
          </div>
        </div>
      </div>

      <!-- Cancel order modal -->
      <div v-if="showCancelDialog" class="modal">
        <div class="modal__backdrop" @click="closeCancelModal"></div>
        <div class="modal__container">
          <div class="modal__header">
            <h3>Cancelar Pedido</h3>
            <button class="modal__close" @click="closeCancelModal">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="modal__body">
            <p>¿Estás seguro de que quieres cancelar el pedido #{{ selectedOrder?.id }}?</p>
            <p class="cancel-warning">Esta acción no se puede deshacer.</p>
            <div class="modal__actions">
              <button class="modal__btn modal__btn--cancel" @click="closeCancelModal">No, mantener</button>
              <button class="modal__btn modal__btn--confirm" @click="cancelOrder" :disabled="cancelling">
                <span v-if="!cancelling">Sí, cancelar</span>
                <span v-else class="loading-spinner loading-spinner--small"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import { useOrderStore } from '@/stores/orderStore';
import orderService, { OrderStatus, type OrderResponse } from '@/services/orderService';

const router = useRouter();
const cartStore = useCartStore();
const orderStore = useOrderStore();

// State
const orders = ref<OrderResponse[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const showCancelDialog = ref(false);
const selectedOrder = ref<OrderResponse | null>(null);
const cancelling = ref(false);

// Load orders
const loadOrders = async () => {
  loading.value = true;
  error.value = null;

  try {
    await orderStore.fetchOrders();
    orders.value = orderStore.orderHistory;
  } catch (err: any) {
    console.error('Error loading orders:', err);
    error.value = err.message || 'No se pudieron cargar los pedidos';
  } finally {
    loading.value = false;
  }
};

// Helper functions
// ✅ ARREGLO: formatDate corregido para España (CEST = UTC+2 en verano)
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return `Hoy, ${date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Madrid' // ✅ CEST = UTC+2 en verano, CET = UTC+1 en invierno
    })}`;
  } else if (diffDays === 1) {
    return `Ayer, ${date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Madrid' // ✅ CEST = UTC+2 en verano
    })}`;
  } else if (diffDays < 7) {
    return `Hace ${diffDays} días`;
  } else {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: diffDays > 365 ? 'numeric' : undefined,
      timeZone: 'Europe/Madrid' // ✅ CEST = UTC+2 en verano
    });
  }
};

// ✅ VERIFICACIÓN: Console log para debug de fechas problemas de veranitos utc +2 momento comedia
console.log('🕒 DEBUG FECHAS:');
console.log('Fecha desde DB (ejemplo):', '2025-06-02T15:37:25.912Z');
console.log('Convertida a Date:', new Date('2025-06-02T15:37:25.912Z'));
console.log('Formateada con Europe/Madrid:', new Date('2025-06-02T15:37:25.912Z').toLocaleString('es-ES', {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Europe/Madrid'
}));
console.log('Zona horaria actual de Madrid:', Intl.DateTimeFormat().resolvedOptions().timeZone);

const summarizeOrderItems = (items: any[]): string => {
  if (!items || items.length === 0) return 'Sin productos';

  const itemSummary = items.map(item => `${item.quantity}× ${item.productName || item.name}`).join(', ');
  return itemSummary.length > 60 ? itemSummary.substring(0, 57) + '...' : itemSummary;
};

const getStatusClass = (status: OrderStatus): string => {
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
};

const getStatusText = (status: OrderStatus): string => {
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
};

const canReorder = (order: OrderResponse): boolean => {
  return [OrderStatus.DELIVERED, OrderStatus.CANCELLED].includes(order.status);
};

const canCancel = (order: OrderResponse): boolean => {
  return [OrderStatus.PENDING, OrderStatus.ACCEPTED].includes(order.status);
};

const viewOrderDetails = (orderId: number): void => {
  router.push(`/orders/${orderId}`);
};

const reorderItems = async (order: OrderResponse): Promise<void> => {
  cartStore.clearCart();

  if (order.orderItems && order.orderItems.length > 0) {
    for (const item of order.orderItems) {
      try {
        await cartStore.addToCart({
          id: item.productId,
          name: item.productName || item.name || 'Producto',
          price: item.unitPrice,
          restaurantId: order.restaurantId,
          categoryName: '',
          description: '',
          imageUrl: item.productImageUrl || '',
          isAvailable: true,
          categoryId: 0
        }, item.quantity);
      } catch (error) {
        console.error('Error adding item to cart:', error);
      }
    }
  }

  router.push('/cart');
};

const showCancelModal = (order: OrderResponse): void => {
  selectedOrder.value = order;
  showCancelDialog.value = true;
};

const closeCancelModal = (): void => {
  selectedOrder.value = null;
  showCancelDialog.value = false;
  cancelling.value = false;
};

const cancelOrder = async (): Promise<void> => {
  if (!selectedOrder.value) return;

  try {
    cancelling.value = true;
    await orderStore.cancelOrder(selectedOrder.value.id);

    // Actualizar el pedido en la lista local
    const orderIndex = orders.value.findIndex(o => o.id === selectedOrder.value!.id);
    if (orderIndex !== -1) {
      orders.value[orderIndex].status = OrderStatus.CANCELLED;
    }
    closeCancelModal();
  } catch (err: any) {
    console.error('Error cancelling order:', err);
    alert(err.message || 'No se pudo cancelar el pedido');
  } finally {
    cancelling.value = false;
  }
};

// Initialize
onMounted(() => {
  loadOrders();
});
</script>

<style lang="scss" scoped>
// Variables
$primary: #06C167;
$success: #10b981;
$warning: #f59e0b;
$error: #ef4444;
$dark: #1e293b;
$light: #f8fafc;
$text: #1e293b;
$text-light: #64748b;
$border: #e2e8f0;

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.orders-page {
  background-color: $light;
  min-height: 100vh;
  padding: 40px 0 60px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 32px;
  color: $text;
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  text-align: center;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid $border;
  border-radius: 50%;
  border-top-color: $primary;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

.error-icon {
  color: $error;
  margin-bottom: 1.5rem;
}

.retry-button,
.empty-orders__button {
  background-color: $primary;
  color: white;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba($primary, 0.2);
  }
}

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
    background-color: white;
    border-radius: 50%;
    color: $text-light;
    margin-bottom: 32px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  }

  &__title {
    font-size: 24px;
    font-weight: 700;
    color: $text;
    margin: 0 0 12px;
  }

  &__text {
    font-size: 16px;
    color: $text-light;
    margin: 0 0 32px;
    max-width: 500px;
  }
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-card {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s ease;

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
    color: $text;
  }

  &__date {
    color: $text-light;
    font-size: 14px;
  }

  &__items {
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid $border;
  }

  &__items-text {
    color: $text-light;
    font-size: 14px;
    line-height: 1.5;
  }

  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  &__price {
    font-weight: 600;
    font-size: 16px;
    color: $text;
  }

  &__status {
    font-size: 14px;
    font-weight: 500;
    padding: 4px 10px;
    border-radius: 100px;

    &.status--delivered {
      background-color: rgba($success, 0.1);
      color: $success;
    }

    &.status--cancelled {
      background-color: rgba($error, 0.1);
      color: $error;
    }

    &.status--on-the-way {
      background-color: rgba($warning, 0.1);
      color: $warning;
    }

    &.status--preparing {
      background-color: rgba(#3b82f6, 0.1);
      color: #3b82f6;
    }

    &.status--pending {
      background-color: rgba($text-light, 0.1);
      color: $text-light;
    }
  }

  &__actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__view {
    color: $primary;
    font-weight: 500;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 4px;
  }
}

.action-btn {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  margin-right: 0.5rem;

  &.reorder-btn {
    background: rgba($primary, 0.1);
    color: $primary;

    &:hover {
      background: rgba($primary, 0.15);
    }
  }

  &.cancel-btn {
    background: rgba($error, 0.1);
    color: $error;

    &:hover {
      background: rgba($error, 0.15);
    }
  }
}

// Modal
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;

  &__backdrop {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
  }

  &__container {
    position: relative;
    background: white;
    border-radius: 12px;
    width: 100%;
    max-width: 450px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid $border;

    h3 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 700;
      color: $text;
    }
  }

  &__close {
    background: none;
    border: none;
    cursor: pointer;
    color: $text-light;
    transition: all 0.3s ease;

    &:hover {
      color: $text;
    }
  }

  &__body {
    padding: 1.5rem;

    p {
      margin: 0 0 1rem;
      color: $text;
    }

    .cancel-warning {
      color: $text-light;
      font-size: 0.9rem;
      margin-bottom: 1.5rem;
    }
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
  }

  &__btn {
    padding: 0.75rem 1.5rem;
    border-radius: 50px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.95rem;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;

    &--cancel {
      background: $light;
      color: $text;

      &:hover {
        background: #e2e8f0;
      }
    }

    &--confirm {
      background: $error;
      color: white;

      &:hover:not(:disabled) {
        background: #dc2626;
        transform: translateY(-2px);
      }

      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }
    }
  }
}

.loading-spinner--small {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
