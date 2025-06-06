<template>
  <div class="order-detail-page">
    <div class="container">
      <!-- Breadcrumb -->
      <div class="breadcrumb">
        <router-link to="/" class="breadcrumb__link">Inicio</router-link>
        <span class="breadcrumb__separator">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </span>
        <router-link to="/orders" class="breadcrumb__link">Mis Pedidos</router-link>
        <span class="breadcrumb__separator">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </span>
        <span class="breadcrumb__current">Pedido #{{ orderId }}</span>
      </div>

      <!-- Connectivity Issues Banner -->
      <div v-if="orderStore.hasConnectivityIssues" class="connectivity-banner">
        <div class="connectivity-banner__content">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <span>Problemas de conectividad detectados. Los cambios se guardarán localmente.</span>
          <button @click="orderStore.retryLastOperation" class="retry-connectivity-btn">
            Reintentar
          </button>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p class="loading-text">Cargando detalles del pedido...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="error-container">
        <div class="error-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <h2 class="error-title">Error al cargar el pedido</h2>
        <p class="error-text">{{ error }}</p>
        <div class="error-actions">
          <button @click="loadOrderDetails" class="retry-button">Intentar de nuevo</button>
          <button @click="$router.push('/orders')" class="back-button">Volver a mis pedidos</button>
        </div>
      </div>

      <!-- Order details -->
      <div v-else-if="order" class="order-detail">
        <!-- Order header -->
        <div class="order-header">
          <div class="order-header__main">
            <h1 class="order-header__title">Pedido #{{ order.id }}</h1>
            <div class="order-header__status" :class="getStatusClass(order.status)">
              {{ getStatusText(order.status) }}
            </div>
          </div>
          <div class="order-header__date">
            <span class="order-header__label">Fecha del pedido</span>
            <span class="order-header__value">{{ formatDate(order.createdAt) }}</span>
          </div>
          <div class="order-header__actions">
            <button v-if="canCancel(order)" @click="showCancelModal" class="cancel-btn" :disabled="cancelling">
              <span v-if="!cancelling">Cancelar pedido</span>
              <span v-else class="loading-spinner loading-spinner--small"></span>
            </button>
            <button v-if="canReorder(order)" @click="reorderItems" class="reorder-btn">
              Pedir de nuevo
            </button>
          </div>
        </div>

        <!-- Order progress -->
        <div v-if="isActiveOrder(order)" class="order-progress">
          <h3 class="order-progress__title">Estado del pedido</h3>
          <div class="progress-steps">
            <div v-for="(step, index) in orderSteps" :key="step.status" class="progress-step" :class="{
              'progress-step--completed': isStepCompleted(step.status, order.status),
              'progress-step--active': isStepActive(step.status, order.status)
            }">
              <div class="progress-step__indicator">
                <svg v-if="isStepCompleted(step.status, order.status)" width="16" height="16" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span v-else>{{ index + 1 }}</span>
              </div>
              <div class="progress-step__content">
                <div class="progress-step__title">{{ step.title }}</div>
                <div class="progress-step__description">{{ step.description }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Order info grid -->
        <div class="order-info-grid">
          <!-- Restaurant info -->
          <div class="info-card">
            <h3 class="info-card__title">Restaurante</h3>
            <div class="restaurant-info">
              <div class="restaurant-info__logo">{{ order.restaurantName?.[0] || 'R' }}</div>
              <div class="restaurant-info__details">
                <div class="restaurant-info__name">{{ order.restaurantName || 'Restaurante' }}</div>
                <div class="restaurant-info__time">Tiempo estimado: {{ formatDeliveryTime(order.estimatedDeliveryTime) }}</div>
              </div>
            </div>
          </div>

          <!-- Delivery info -->
          <div class="info-card">
            <h3 class="info-card__title">Entrega</h3>
            <div class="delivery-info">
              <div class="delivery-info__address">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>{{ order.deliveryAddress || 'Dirección de entrega' }}</span>
              </div>
              <div class="delivery-info__time">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>{{ formatDeliveryTime(order.estimatedDeliveryTime) }}</span>
              </div>
            </div>
          </div>

          <!-- Payment info -->
          <div class="info-card">
            <h3 class="info-card__title">Pago</h3>
            <div class="payment-info">
              <div class="payment-info__method">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                  <line x1="1" y1="10" x2="23" y2="10"></line>
                </svg>
                <span>{{ order.payment?.paymentMethod || 'Tarjeta' }}</span>
              </div>
              <div class="payment-info__status" :class="getPaymentStatusClass(order.payment?.status)">
                {{ getPaymentStatusText(order.payment?.status) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Order items -->
        <div class="order-items">
          <h3 class="order-items__title">Productos</h3>
          <div class="items-list">
            <div v-for="item in order.orderItems || order.items" :key="item.id" class="order-item">
              <div class="order-item__image">
                <img v-if="item.productImageUrl || item.imageUrl" :src="item.productImageUrl || item.imageUrl"
                  :alt="item.productName || item.name" />
                <div v-else class="order-item__placeholder">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                </div>
              </div>
              <div class="order-item__details">
                <div class="order-item__name">{{ item.productName || item.name || 'Producto' }}</div>
                <div class="order-item__description">{{ item.productDescription || item.description || '' }}</div>
                <div class="order-item__quantity">Cantidad: {{ item.quantity }}</div>
              </div>
              <div class="order-item__price">
                <div class="order-item__unit-price">${{ (item.unitPrice || item.price || 0).toFixed(2) }} c/u</div>
                <div class="order-item__total">${{ (item.subtotal || (item.unitPrice || item.price || 0) *
                  item.quantity).toFixed(2) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Order summary -->
        <div class="order-summary">
          <h3 class="order-summary__title">Resumen del pedido</h3>
          <div class="summary-details">
            <div class="summary-row">
              <span>Subtotal</span>
              <span>${{ (order.subtotal || 0).toFixed(2) }}</span>
            </div>
            <div class="summary-row">
              <span>Costo de envío</span>
              <span v-if="order.deliveryFee > 0">${{ order.deliveryFee.toFixed(2) }}</span>
              <span v-else class="free-delivery">Gratis</span>
            </div>
            <div class="summary-row">
              <span>Impuestos</span>
              <span>${{ (order.tax || 0).toFixed(2) }}</span>
            </div>
            <div class="summary-row summary-row--total">
              <span>Total</span>
              <span>${{ (order.total || 0).toFixed(2) }}</span>
            </div>
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
            <p>¿Estás seguro de que quieres cancelar el pedido #{{ order?.id }}?</p>
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

      <!-- Success toast -->
      <div v-if="successMessage" class="toast toast--success">
        <div class="toast__content">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>{{ successMessage }}</span>
        </div>
      </div>

      <!-- Error toast -->
      <div v-if="errorMessage" class="toast toast--error">
        <div class="toast__content">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>{{ errorMessage }}</span>
          <button @click="errorMessage = null" class="toast__close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import { useOrderStore } from '@/stores/orderStore';
import { OrderStatus } from '@/services/orderService';
import type { OrderResponse } from '@/services/orderService';

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();
const orderStore = useOrderStore();

// State
const order = ref<OrderResponse | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const showCancelDialog = ref(false);
const cancelling = ref(false);
const successMessage = ref<string | null>(null);
const errorMessage = ref<string | null>(null);

// Get order ID from route
const orderId = computed(() => {
  const id = route.params.id;
  return typeof id === 'string' ? parseInt(id) : null;
});

// Order steps for progress tracking
const orderSteps = [
  { status: OrderStatus.PENDING, title: 'Pedido recibido', description: 'Tu pedido ha sido recibido' },
  { status: OrderStatus.ACCEPTED, title: 'Confirmado', description: 'El restaurante confirmó tu pedido' },
  { status: OrderStatus.PREPARING, title: 'Preparando', description: 'Tu pedido se está preparando' },
  { status: OrderStatus.READY_FOR_PICKUP, title: 'Listo', description: 'Tu pedido está listo para entrega' },
  { status: OrderStatus.ON_THE_WAY, title: 'En camino', description: 'Tu pedido está en camino' },
  { status: OrderStatus.DELIVERED, title: 'Entregado', description: 'Tu pedido ha sido entregado' }
];

// Toast helpers
const showSuccess = (message: string) => {
  successMessage.value = message;
  setTimeout(() => successMessage.value = null, 3000);
};

const showError = (message: string) => {
  errorMessage.value = message;
  // El error se cierra manualmente o después de 10 segundos
  setTimeout(() => errorMessage.value = null, 10000);
};

// Methods
const loadOrderDetails = async () => {
  if (!orderId.value) {
    error.value = 'ID de pedido inválido';
    loading.value = false;
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const orderData = await orderStore.fetchOrderById(orderId.value);
    order.value = orderData;
  } catch (err: any) {
    console.error('Error loading order:', err);
    error.value = err.message || 'Error al cargar el pedido';
  } finally {
    loading.value = false;
  }
};

// ✅ ARREGLO: formatDate con zona horaria correcta para España
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Madrid' // ✅ CEST = UTC+2 en verano, CET = UTC+1 en invierno
  });
};

// ✅ ARREGLO: formatDeliveryTime con zona horaria correcta
const formatDeliveryTime = (estimatedTime: string): string => {
  if (!estimatedTime) return 'Sin estimar';

  const deliveryDate = new Date(estimatedTime);
  const now = new Date();

  if (deliveryDate > now) {
    const diffMinutes = Math.round((deliveryDate.getTime() - now.getTime()) / (1000 * 60));
    return `En ${diffMinutes} minutos`;
  } else {
    return deliveryDate.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Madrid' // ✅ CEST = UTC+2 en verano
    });
  }
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

const getPaymentStatusClass = (status?: string): string => {
  switch (status) {
    case 'completed':
      return 'payment-status--completed';
    case 'failed':
      return 'payment-status--failed';
    case 'refunded':
      return 'payment-status--refunded';
    default:
      return 'payment-status--pending';
  }
};

const getPaymentStatusText = (status?: string): string => {
  switch (status) {
    case 'completed':
      return 'Pagado';
    case 'failed':
      return 'Falló';
    case 'refunded':
      return 'Reembolsado';
    case 'pending':
      return 'Pendiente';
    default:
      return 'Desconocido';
  }
};

const isActiveOrder = (order: OrderResponse): boolean => {
  return [
    OrderStatus.PENDING,
    OrderStatus.ACCEPTED,
    OrderStatus.PREPARING,
    OrderStatus.READY_FOR_PICKUP,
    OrderStatus.ON_THE_WAY
  ].includes(order.status);
};

const canCancel = (order: OrderResponse): boolean => {
  return [OrderStatus.PENDING, OrderStatus.ACCEPTED].includes(order.status);
};

const canReorder = (order: OrderResponse): boolean => {
  return [OrderStatus.DELIVERED, OrderStatus.CANCELLED].includes(order.status);
};

const isStepCompleted = (stepStatus: OrderStatus, currentStatus: OrderStatus): boolean => {
  const statusOrder = [
    OrderStatus.PENDING,
    OrderStatus.ACCEPTED,
    OrderStatus.PREPARING,
    OrderStatus.READY_FOR_PICKUP,
    OrderStatus.ON_THE_WAY,
    OrderStatus.DELIVERED
  ];

  const stepIndex = statusOrder.indexOf(stepStatus);
  const currentIndex = statusOrder.indexOf(currentStatus);

  return stepIndex < currentIndex;
};

const isStepActive = (stepStatus: OrderStatus, currentStatus: OrderStatus): boolean => {
  return stepStatus === currentStatus;
};

const showCancelModal = (): void => {
  showCancelDialog.value = true;
};

const closeCancelModal = (): void => {
  showCancelDialog.value = false;
  cancelling.value = false;
};

const cancelOrder = async (): Promise<void> => {
  if (!order.value) return;

  try {
    cancelling.value = true;
    const success = await orderStore.cancelOrder(order.value.id);
    if (success) {
      // Actualizar el pedido localmente
      order.value.status = OrderStatus.CANCELLED;
      order.value.updatedAt = new Date().toISOString();

      console.log(`✅ Pedido ${order.value.id} cancelado exitosamente`);

      // Cerrar modal
      closeCancelModal();

      // Mostrar mensaje de éxito
      showSuccess('Pedido cancelado exitosamente');
    }

  } catch (err: any) {
    console.error(`❌ Error al cancelar pedido ${order.value.id}:`, err);

    // Mostrar error específico
    let errorText = 'No se pudo cancelar el pedido';

    if (err.message?.includes('404')) {
      errorText = 'El pedido no fue encontrado o ya no existe';
    } else if (err.message?.includes('400')) {
      errorText = 'El pedido no se puede cancelar en su estado actual';
    } else if (err.message?.includes('401')) {
      errorText = 'No tienes permisos para cancelar este pedido';
    } else if (err.message) {
      errorText = err.message;
    }

    showError(errorText);
    closeCancelModal();
  } finally {
    cancelling.value = false;
  }
};

const reorderItems = async (): Promise<void> => {
  if (!order.value) return;

  try {
    cartStore.clearCart();

    const items = order.value.orderItems || order.value.items || [];

    if (items.length > 0) {
      for (const item of items) {
        try {
          await cartStore.addToCart({
            id: item.productId,
            name: item.productName || item.name || 'Producto',
            price: item.unitPrice || item.price || 0,
            restaurantId: order.value.restaurantId,
            categoryName: '',
            description: item.productDescription || item.description || '',
            imageUrl: item.productImageUrl || item.imageUrl || '',
            isAvailable: true,
            categoryId: 0
          }, item.quantity);
        } catch (error) {
          console.error('Error adding item to cart:', error);
        }
      }
    }

    showSuccess('Productos agregados al carrito');
    router.push('/cart');
  } catch (error) {
    showError('Error al agregar productos al carrito');
  }
};

// Initialize
onMounted(() => {
  loadOrderDetails();
});
</script>

<style lang="scss" scoped>
// Variables
$primary-color: #06C167;
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

.order-detail-page {
  background-color: $light-gray;
  min-height: 100vh;
  padding: 40px 0 60px;
}

// Connectivity Banner
.connectivity-banner {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  border-radius: $border-radius-sm;
  padding: 12px 20px;
  margin-bottom: 24px;
  color: white;

  &__content {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    font-weight: 500;
  }
}

.retry-connectivity-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: $transition;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
}

// Breadcrumb
.breadcrumb {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  font-size: 14px;

  &__link {
    color: $text-secondary;
    text-decoration: none;
    transition: $transition;

    &:hover {
      color: $primary-color;
    }
  }

  &__separator {
    margin: 0 8px;
    color: $text-secondary;
    display: flex;
    align-items: center;
  }

  &__current {
    color: $text-primary;
    font-weight: 500;
  }
}

// Loading & Error states
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
  border: 3px solid $medium-gray;
  border-radius: 50%;
  border-top-color: $primary-color;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

.error-icon {
  color: $error-color;
  margin-bottom: 1.5rem;
}

.error-title {
  font-size: 24px;
  font-weight: 700;
  color: $text-primary;
  margin: 0 0 12px;
}

.error-text {
  color: $text-secondary;
  margin: 0 0 24px;
}

.error-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.retry-button,
.back-button {
  padding: 12px 24px;
  border-radius: $border-radius-sm;
  border: none;
  cursor: pointer;
  transition: $transition;
  font-weight: 600;
}

.retry-button {
  background-color: $primary-color;
  color: white;

  &:hover {
    background-color: $primary-color;
    transform: translateY(-2px);
  }
}

.back-button {
  background-color: $medium-gray;
  color: $text-primary;

  &:hover {
    background-color: $medium-gray;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

// Toast notifications
.toast {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 1000;
  max-width: 400px;
  border-radius: $border-radius-sm;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  animation: slideIn 0.3s ease;

  &--success {
    background: linear-gradient(135deg, $success-color, $success-color);
    color: white;
  }

  &--error {
    background: linear-gradient(135deg, $error-color, $error-color);
    color: white;
  }

  &__content {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    font-size: 14px;
    font-weight: 500;
  }

  &__close {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    margin-left: auto;
    opacity: 0.8;
    transition: $transition;

    &:hover {
      opacity: 1;
    }
  }
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

// Order Detail
.order-detail {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

// Order Header
.order-header {
  background-color: $white;
  border-radius: $border-radius;
  box-shadow: $box-shadow;
  padding: 24px;
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 24px;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
    text-align: center;
  }

  &__main {
    display: flex;
    align-items: center;
    gap: 16px;

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 8px;
    }
  }

  &__title {
    font-size: 24px;
    font-weight: 700;
    margin: 0;
    color: $text-primary;
  }

  &__status {
    padding: 6px 12px;
    border-radius: 100px;
    font-size: 14px;
    font-weight: 600;

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

  &__date {
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    @media (max-width: 768px) {
      align-items: center;
    }
  }

  &__label {
    font-size: 12px;
    color: $text-secondary;
    margin-bottom: 4px;
  }

  &__value {
    font-weight: 600;
    color: $text-primary;
  }

  &__actions {
    display: flex;
    gap: 12px;

    @media (max-width: 768px) {
      justify-content: center;
    }
  }
}

// Action buttons
.cancel-btn,
.reorder-btn {
  padding: 8px 16px;
  border-radius: $border-radius-sm;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: $transition;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

.cancel-btn {
  background: rgba($error-color, 0.1);
  color: $error-color;

  &:hover:not(:disabled) {
    background: rgba($error-color, 0.2);
  }
}

.reorder-btn {
  background: rgba($primary-color, 0.1);
  color: $primary-color;

  &:hover {
    background: rgba($primary-color, 0.2);
  }
}

// Order Progress
.order-progress {
  background-color: $white;
  border-radius: $border-radius;
  box-shadow: $box-shadow;
  padding: 24px;

  &__title {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 24px;
    color: $text-primary;
  }
}

.progress-steps {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.progress-step {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  position: relative;

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    left: 24px;
    top: 48px;
    width: 2px;
    height: calc(100% + 16px);
    background-color: $medium-gray;
  }

  &--completed {
    .progress-step__indicator {
      background-color: $success-color;
      color: $white;
      border-color: $success-color;
    }

    &::after {
      background-color: $success-color;
    }
  }

  &--active {
    .progress-step__indicator {
      background-color: $primary-color;
      color: $white;
      border-color: $primary-color;
    }

    .progress-step__title {
      color: $text-primary;
      font-weight: 600;
    }
  }

  &__indicator {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: $white;
    border: 2px solid $medium-gray;
    font-weight: 600;
    font-size: 16px;
    flex-shrink: 0;
  }

  &__content {
    flex: 1;
    padding-top: 8px;
  }

  &__title {
    font-weight: 500;
    margin: 0 0 4px;
    color: $text-secondary;
  }

  &__description {
    font-size: 14px;
    color: $text-secondary;
    margin: 0;
  }
}

// Info Cards Grid
.order-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.info-card {
  background-color: $white;
  border-radius: $border-radius;
  box-shadow: $box-shadow;
  padding: 20px;

  &__title {
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 16px;
    color: $text-primary;
  }
}

// Restaurant Info
.restaurant-info {
  display: flex;
  align-items: center;
  gap: 12px;

  &__logo {
    width: 48px;
    height: 48px;
    border-radius: $border-radius-sm;
    background-color: $primary-color;
    color: $white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 18px;
  }

  &__name {
    font-weight: 600;
    margin: 0 0 4px;
    color: $text-primary;
  }

  &__time {
    font-size: 14px;
    color: $text-secondary;
    margin: 0;
  }
}

// Delivery Info
.delivery-info {
  display: flex;
  flex-direction: column;
  gap: 12px;

  &__address,
  &__time {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: $text-primary;

    svg {
      color: $text-secondary;
    }
  }
}

// Payment Info
.payment-info {
  display: flex;
  justify-content: space-between;
  align-items: center;

  &__method {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: $text-primary;

    svg {
      color: $text-secondary;
    }
  }

  &__status {
    padding: 4px 8px;
    border-radius: 100px;
    font-size: 12px;
    font-weight: 600;

    &.payment-status--completed {
      background-color: rgba($success-color, 0.1);
      color: $success-color;
    }

    &.payment-status--failed {
      background-color: rgba($error-color, 0.1);
      color: $error-color;
    }

    &.payment-status--pending {
      background-color: rgba($warning-color, 0.1);
      color: $warning-color;
    }

    &.payment-status--refunded {
      background-color: rgba($text-secondary, 0.1);
      color: $text-secondary;
    }
  }
}

// Order Items
.order-items {
  background-color: $white;
  border-radius: $border-radius;
  box-shadow: $box-shadow;
  padding: 24px;

  &__title {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 20px;
    color: $text-primary;
  }
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid $light-gray;

  &:last-child {
    border-bottom: none;
  }

  &__image {
    width: 64px;
    height: 64px;
    border-radius: $border-radius-sm;
    overflow: hidden;
    flex-shrink: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__placeholder {
    width: 100%;
    height: 100%;
    background-color: $light-gray;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $text-secondary;
  }

  &__details {
    flex: 1;
  }

  &__name {
    font-weight: 600;
    margin: 0 0 4px;
    color: $text-primary;
  }

  &__description {
    font-size: 14px;
    color: $text-secondary;
    margin: 0 0 8px;
  }

  &__quantity {
    font-size: 14px;
    color: $text-secondary;
    margin: 0;
  }

  &__price {
    text-align: right;
    flex-shrink: 0;
  }

  &__unit-price {
    font-size: 14px;
    color: $text-secondary;
    margin: 0 0 4px;
  }

  &__total {
    font-weight: 600;
    color: $text-primary;
    margin: 0;
  }
}

// Order Summary
.order-summary {
  background-color: $white;
  border-radius: $border-radius;
  box-shadow: $box-shadow;
  padding: 24px;

  &__title {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 20px;
    color: $text-primary;
  }
}

.summary-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: $text-secondary;

  &--total {
    padding-top: 12px;
    margin-top: 12px;
    border-top: 1px solid $light-gray;
    font-size: 18px;
    font-weight: 600;
    color: $text-primary;
  }

  .free-delivery {
    color: $success-color;
    font-weight: 600;
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
    border-bottom: 1px solid $light-gray;

    h3 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 700;
      color: $text-primary;
    }
  }

  &__close {
    background: none;
    border: none;
    cursor: pointer;
    color: $text-secondary;
    transition: $transition;

    &:hover {
      color: $text-primary;
    }
  }

  &__body {
    padding: 1.5rem;

    p {
      margin: 0 0 1rem;
      color: $text-primary;
    }

    .cancel-warning {
      color: $text-secondary;
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
      background: $light-gray;
      color: $text-primary;

      &:hover {
        background: #e2e8f0;
      }
    }

    &--confirm {
      background: $error-color;
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
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
</style>
