<!-- src/components/feature/profile/OrderHistory.vue -->
<template>
  <div class="order-history">
    <div class="order-history__header">
      <h2 class="order-history__title">Historial de Pedidos</h2>
      <div class="order-history__filters">
        <select v-model="statusFilter" class="filter-select">
          <option value="">Todos los estados</option>
          <option value="Pending">Pendientes</option>
          <option value="Accepted">Aceptados</option>
          <option value="Preparing">Preparando</option>
          <option value="OnTheWay">En camino</option>
          <option value="Delivered">Entregados</option>
          <option value="Cancelled">Cancelados</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="order-history__loading">
      <div class="loading-spinner"></div>
      <p>Cargando historial de pedidos...</p>
    </div>

    <div v-else-if="error" class="order-history__error">
      <div class="error-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <h3>Error al cargar pedidos</h3>
      <p>{{ error }}</p>
      <button @click="loadOrders" class="retry-btn">Intentar de nuevo</button>
    </div>

    <div v-else-if="filteredOrders.length === 0" class="order-history__empty">
      <div class="empty-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
          <line x1="9" y1="9" x2="9.01" y2="9"></line>
          <line x1="15" y1="9" x2="15.01" y2="9"></line>
        </svg>
      </div>
      <h3>{{ statusFilter ? 'No hay pedidos con este estado' : 'No tienes pedidos aún' }}</h3>
      <p>{{ statusFilter ? 'Prueba con otro filtro' : 'Cuando hagas tu primer pedido aparecerá aquí' }}</p>
      <router-link to="/" class="explore-btn" v-if="!statusFilter">Explorar restaurantes</router-link>
    </div>

    <div v-else class="order-history__list">
      <div v-for="order in filteredOrders" :key="order.id" class="order-card" @click="viewOrderDetails(order.id)">
        <div class="order-card__header">
          <div class="order-card__info">
            <h4 class="order-card__restaurant">{{ order.restaurantName || 'Restaurante' }}</h4>
            <div class="order-card__id">Pedido #{{ order.id }}</div>
          </div>
          <div class="order-card__status" :class="getStatusClass(order.status)">
            {{ getStatusText(order.status) }}
          </div>
        </div>

        <div class="order-card__items">
          <div class="order-card__items-summary">
            {{ getOrderSummary(order.items) }}
          </div>
          <div class="order-card__date">{{ formatDate(order.createdAt) }}</div>
        </div>

        <div class="order-card__footer">
          <div class="order-card__total">${{ order.total.toFixed(2) }}</div>
          <div class="order-card__actions">
            <button v-if="canReorder(order)" @click.stop="reorderItems(order)" class="reorder-btn">
              Pedir de nuevo
            </button>
            <button v-if="canCancel(order)" @click.stop="showCancelModal(order)" class="cancel-btn">
              Cancelar
            </button>
            <button @click.stop="viewOrderDetails(order.id)" class="details-btn">
              Ver detalles
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para cancelar pedido -->
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
          <p class="cancel-warning">Esta acción no se puede deshacer y el pedido será cancelado inmediatamente.</p>
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
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import orderService, { OrderStatus } from '@/services/orderService';
import type { OrderResponse } from '@/services/orderService';

const router = useRouter();
const cartStore = useCartStore();

// Estado
const orders = ref<OrderResponse[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const statusFilter = ref('');
const showCancelDialog = ref(false);
const selectedOrder = ref<OrderResponse | null>(null);
const cancelling = ref(false);

// Computed
const filteredOrders = computed(() => {
  if (!statusFilter.value) return orders.value;
  return orders.value.filter(order => order.status === statusFilter.value);
});

// Métodos
const loadOrders = async () => {
  loading.value = true;
  error.value = null;

  try {
    const userOrders = await orderService.getUserOrders();
    orders.value = userOrders.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (err: any) {
    console.error('Error cargando pedidos:', err);
    error.value = err.message || 'No se pudieron cargar los pedidos. Por favor, intenta de nuevo.';
  } finally {
    loading.value = false;
  }
};

const getStatusClass = (status: OrderStatus): string => {
  switch (status) {
    case OrderStatus.DELIVERED:
      return 'status--delivered';
    case OrderStatus.CANCELLED:
      return 'status--cancelled';
    case OrderStatus.ON_THE_WAY:
      return 'status--on-way';
    case OrderStatus.PREPARING:
    case OrderStatus.ACCEPTED:
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

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return `Hoy, ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
  } else if (diffDays === 1) {
    return `Ayer, ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
  } else if (diffDays < 7) {
    return `Hace ${diffDays} días`;
  } else {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: diffDays > 365 ? 'numeric' : undefined
    });
  }
};

const getOrderSummary = (items: any[]): string => {
  if (!items || items.length === 0) return 'Sin productos';

  const summary = items.map(item => `${item.quantity}× ${item.name}`).join(', ');
  return summary.length > 60 ? summary.substring(0, 57) + '...' : summary;
};

const canReorder = (order: OrderResponse): boolean => {
  return [OrderStatus.DELIVERED, OrderStatus.CANCELLED].includes(order.status);
};

const canCancel = (order: OrderResponse): boolean => {
  return [OrderStatus.PENDING, OrderStatus.ACCEPTED].includes(order.status);
};

const viewOrderDetails = (orderId: number) => {
  router.push(`/orders/${orderId}`);
};

const reorderItems = async (order: OrderResponse) => {
  cartStore.clearCart();

  if (order.items) {
    for (const item of order.items) {
      await cartStore.addToCart({
        id: item.productId,
        name: item.name,
        price: item.price,
        restaurantId: order.restaurantId,
        categoryName: '',
        description: '',
        imageUrl: '',
        isAvailable: true,
        categoryId: 0
      }, item.quantity);
    }
  }

  router.push('/cart');
};

const showCancelModal = (order: OrderResponse) => {
  selectedOrder.value = order;
  showCancelDialog.value = true;
};

const closeCancelModal = () => {
  selectedOrder.value = null;
  showCancelDialog.value = false;
  cancelling.value = false;
};

const cancelOrder = async () => {
  if (!selectedOrder.value) return;

  try {
    cancelling.value = true;
    const success = await orderService.cancelOrder(selectedOrder.value.id);

    if (success) {
      // Actualizar el pedido en la lista local
      const orderIndex = orders.value.findIndex(o => o.id === selectedOrder.value!.id);
      if (orderIndex !== -1) {
        orders.value[orderIndex].status = OrderStatus.CANCELLED;
      }

      closeCancelModal();
    }
  } catch (err: any) {
    console.error('Error cancelando pedido:', err);
    alert('No se pudo cancelar el pedido. Por favor, intenta de nuevo.');
  } finally {
    cancelling.value = false;
  }
};

// Inicialización
onMounted(() => {
  loadOrders();
});
</script>

<style lang="scss" scoped>
// Variables
$primary: #FF416C;
$primary-gradient: linear-gradient(to right, #FF416C, #FF4B2B);
$secondary: #0652DD;
$accent: #FFA502;
$success: #10b981;
$warning: #f59e0b;
$error: #ef4444;
$dark: #1e293b;
$light: #f8fafc;
$text: #1e293b;
$text-light: #64748b;
$border: #e2e8f0;
$border-radius: 12px;
$transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);

.order-history {
  width: 100%;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 1rem;
      align-items: stretch;
    }
  }

  &__title {
    font-size: 1.5rem;
    font-weight: 700;
    color: $dark;
    margin: 0;
  }

  &__filters {
    display: flex;
    gap: 1rem;
  }

  &__loading,
  &__error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    text-align: center;
  }

  &__loading {
    color: $text-light;

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid $border;
      border-top-color: $primary;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }
  }

  &__error {
    .error-icon {
      color: $error;
      margin-bottom: 1rem;
    }

    h3 {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0 0 0.5rem;
      color: $dark;
    }

    p {
      color: $text-light;
      margin: 0 0 1.5rem;
    }
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    text-align: center;

    .empty-icon {
      color: $text-light;
      margin-bottom: 1.5rem;
    }

    h3 {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0 0 0.5rem;
      color: $dark;
    }

    p {
      color: $text-light;
      margin: 0 0 1.5rem;
    }
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
}

.filter-select {
  padding: 0.5rem 1rem;
  border: 1px solid $border;
  border-radius: 8px;
  background: white;
  color: $text;
  font-size: 0.9rem;
  cursor: pointer;
  transition: $transition;

  &:focus {
    outline: none;
    border-color: $primary;
    box-shadow: 0 0 0 3px rgba($primary, 0.1);
  }
}

.retry-btn, .explore-btn {
  background: $primary-gradient;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: $transition;
  text-decoration: none;
  display: inline-block;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba($primary, 0.2);
  }
}

.order-card {
  background: white;
  border-radius: $border-radius;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  border: 1px solid $border;
  cursor: pointer;
  transition: $transition;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
  }

  &__info {
    flex: 1;
  }

  &__restaurant {
    font-size: 1.1rem;
    font-weight: 700;
    margin: 0 0 0.25rem;
    color: $dark;
  }

  &__id {
    font-size: 0.85rem;
    color: $text-light;
    font-weight: 500;
  }

  &__status {
    padding: 0.25rem 0.75rem;
    border-radius: 50px;
    font-size: 0.75rem;
    font-weight: 600;

    &.status--delivered {
      background: rgba($success, 0.1);
      color: $success;
    }

    &.status--cancelled {
      background: rgba($error, 0.1);
      color: $error;
    }

    &.status--on-way {
      background: rgba($warning, 0.1);
      color: $warning;
    }

    &.status--preparing {
      background: rgba($secondary, 0.1);
      color: $secondary;
    }

    &.status--pending {
      background: rgba($text-light, 0.1);
      color: $text-light;
    }
  }

  &__items {
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid $border;
  }

  &__items-summary {
    color: $text;
    font-size: 0.9rem;
    line-height: 1.4;
    margin-bottom: 0.5rem;
  }

  &__date {
    color: $text-light;
    font-size: 0.85rem;
  }

  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__total {
    font-size: 1.1rem;
    font-weight: 700;
    color: $dark;
  }

  &__actions {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }
}

.reorder-btn, .cancel-btn, .details-btn {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: $transition;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-1px);
  }
}

.reorder-btn {
  background: rgba($primary, 0.1);
  color: $primary;

  &:hover {
    background: rgba($primary, 0.15);
  }
}

.cancel-btn {
  background: rgba($error, 0.1);
  color: $error;

  &:hover {
    background: rgba($error, 0.15);
  }
}

.details-btn {
  background: rgba($secondary, 0.1);
  color: $secondary;

  &:hover {
    background: rgba($secondary, 0.15);
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
    border-radius: $border-radius;
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
      color: $dark;
    }
  }

  &__close {
    background: none;
    border: none;
    cursor: pointer;
    color: $text-light;
    transition: $transition;

    &:hover {
      color: $dark;
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
    transition: $transition;
    font-size: 0.95rem;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;

    &--cancel {
      background: $light;
      color: $text;

      &:hover {
        background: darken($light, 3%);
      }
    }

    &--confirm {
      background: $error;
      color: white;

      &:hover:not(:disabled) {
        background: darken($error, 5%);
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
