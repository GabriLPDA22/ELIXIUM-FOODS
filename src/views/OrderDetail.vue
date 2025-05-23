<!-- src/views/OrderDetail.vue -->
<template>
  <div class="order-detail-page">
    <div class="container">
      <!-- Breadcrumb navigation -->
      <div class="breadcrumb">
        <router-link to="/" class="breadcrumb__link">Inicio</router-link>
        <span class="breadcrumb__separator">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </span>
        <router-link to="/orders" class="breadcrumb__link">Mis Pedidos</router-link>
        <span class="breadcrumb__separator">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </span>
        <span class="breadcrumb__current">Pedido #{{ orderId }}</span>
      </div>

      <!-- Order detail content -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p class="loading-text">Cargando detalles del pedido...</p>
      </div>

      <div v-else-if="error" class="error-container">
        <div class="error-container__icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <h2 class="error-container__title">Ups, algo salió mal</h2>
        <p class="error-container__text">No pudimos cargar los detalles del pedido</p>
        <p class="error-container__message">{{ error }}</p>
        <router-link to="/orders" class="error-container__button">Volver a mis pedidos</router-link>
      </div>

      <div v-else class="order-detail">
        <!-- Order header section -->
        <div class="order-header">
          <div class="order-header__left">
            <h1 class="order-header__title">Pedido #{{ order.id }}</h1>
            <div class="order-header__status" :class="getStatusClass(order.status)">
              {{ getStatusText(order.status) }}
            </div>
          </div>
          <div class="order-header__right">
            <div class="order-header__date">
              <div class="order-header__label">Fecha del pedido</div>
              <div>{{ formatDate(order.createdAt) }}</div>
            </div>
            <div class="order-header__actions">
              <button v-if="canCancel" @click="showCancelModal = true" class="order-header__cancel-btn">
                Cancelar pedido
              </button>
              <button v-if="canReorder" @click="reorderItems" class="order-header__reorder-btn">
                Pedir de nuevo
              </button>
            </div>
          </div>
        </div>

        <div class="order-content">
          <!-- Restaurant info -->
          <div class="restaurant-info">
            <div class="restaurant-info__logo">
              <!-- This would be a real logo in a full implementation -->
              <div class="restaurant-info__logo-placeholder">
                {{ getRestaurantInitials(order.restaurantName) }}
              </div>
            </div>
            <div class="restaurant-info__details">
              <h2 class="restaurant-info__name">{{ order.restaurantName }}</h2>
              <router-link :to="'/restaurants/' + order.restaurantId" class="restaurant-info__link">
                Ver restaurante
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </router-link>
            </div>
          </div>

          <!-- Items list -->
          <div class="order-items">
            <h3 class="section-title">Productos</h3>
            
            <div class="item-list">
              <div v-for="(item, index) in order.items" :key="index" class="order-item">
                <div class="order-item__quantity">{{ item.quantity }}×</div>
                <div class="order-item__details">
                  <div class="order-item__name">{{ item.name }}</div>
                  <div class="order-item__price">${{ (item.price * item.quantity).toFixed(2) }}</div>
                </div>
              </div>
            </div>

            <div class="order-costs">
              <div class="cost-row">
                <span>Subtotal</span>
                <span>${{ order.subtotal.toFixed(2) }}</span>
              </div>
              <div class="cost-row">
                <span>Costo de envío</span>
                <span>${{ order.deliveryFee.toFixed(2) }}</span>
              </div>
              <div class="cost-row">
                <span>Impuestos</span>
                <span>${{ order.tax.toFixed(2) }}</span>
              </div>
              <div class="cost-row cost-row--total">
                <span>Total</span>
                <span>${{ order.total.toFixed(2) }}</span>
              </div>
            </div>
          </div>

          <!-- Order details -->
          <div class="order-info">
            <div class="info-column">
              <h3 class="section-title">Detalles de entrega</h3>
              <div class="info-card">
                <div class="info-card__group">
                  <div class="info-card__label">Entregado a</div>
                  <div class="info-card__value">{{ getFullAddress() }}</div>
                </div>
                <div class="info-card__group">
                  <div class="info-card__label">Estado</div>
                  <div class="info-card__value status-value" :class="getStatusClass(order.status)">
                    {{ getStatusText(order.status) }}
                  </div>
                </div>
                <div class="info-card__group">
                  <div class="info-card__label">Tiempo estimado de entrega</div>
                  <div class="info-card__value">{{ formatDate(order.estimatedDeliveryTime) }}</div>
                </div>
              </div>
            </div>

            <div class="info-column">
              <h3 class="section-title">Detalles de pago</h3>
              <div class="info-card">
                <div class="info-card__group">
                  <div class="info-card__label">Método de pago</div>
                  <div class="info-card__value">{{ getPaymentMethodName(order.payment.method) }}</div>
                </div>
                <div class="info-card__group">
                  <div class="info-card__label">Estado del pago</div>
                  <div class="info-card__value payment-status" :class="getPaymentStatusClass(order.payment.status)">
                    {{ getPaymentStatusText(order.payment.status) }}
                  </div>
                </div>
                <div v-if="order.payment.transactionId" class="info-card__group">
                  <div class="info-card__label">ID de transacción</div>
                  <div class="info-card__value">{{ order.payment.transactionId }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Help and support -->
          <div class="help-support">
            <h3 class="section-title">¿Necesitas ayuda?</h3>
            <div class="help-actions">
              <button class="help-action">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                Contactar soporte
              </button>

              <button class="help-action">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                Reportar un problema
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Cancel order modal -->
    <div v-if="showCancelModal" class="modal-overlay">
      <div class="modal">
        <div class="modal__header">
          <h3 class="modal__title">Cancelar pedido</h3>
          <button class="modal__close" @click="showCancelModal = false">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="modal__content">
          <p class="modal__message">¿Estás seguro de que deseas cancelar este pedido?</p>
          <p class="modal__hint">Solo puedes cancelar un pedido si aún no ha sido aceptado por el restaurante.</p>
          
          <div class="modal__actions">
            <button class="modal__button modal__button--cancel" @click="showCancelModal = false">No, mantener pedido</button>
            <button class="modal__button modal__button--confirm" @click="cancelOrder" :disabled="cancellingOrder">
              <span v-if="!cancellingOrder">Sí, cancelar pedido</span>
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
import { useRoute, useRouter } from 'vue-router';
import { orderService, OrderStatus } from '@/services/orderService';
import { PaymentStatus } from '@/services/paymentService';
import { useCartStore } from '@/stores/cart';

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();

// State
const orderId = ref<number | null>(null);
const order = ref<any>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const showCancelModal = ref(false);
const cancellingOrder = ref(false);

// Computed properties
const canCancel = computed(() => {
  if (!order.value) return false;
  
  // Only allow cancellation for pending or accepted orders
  return [OrderStatus.PENDING, OrderStatus.ACCEPTED].includes(order.value.status);
});

const canReorder = computed(() => {
  if (!order.value) return false;
  
  // Allow reordering for any completed or cancelled order
  return [OrderStatus.DELIVERED, OrderStatus.CANCELLED].includes(order.value.status);
});

// Load order data
onMounted(async () => {
  try {
    // Get order ID from route params
    const id = Number(route.params.id);
    if (isNaN(id)) {
      throw new Error('ID de pedido inválido');
    }
    
    orderId.value = id;
    loading.value = true;
    
    // Fetch order details
    const orderData = await orderService.getOrderById(id);
    
    // Add restaurant name (would come from the API in a real implementation)
    order.value = {
      ...orderData,
      restaurantName: getRestaurantName(orderData.restaurantId)
    };
  } catch (err: any) {
    console.error('Error loading order:', err);
    error.value = err.message || 'Error al cargar los detalles del pedido';
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

function getRestaurantInitials(name: string): string {
  if (!name) return '';
  
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
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

function getPaymentMethodName(method: string): string {
  switch (method) {
    case 'card':
      return 'Tarjeta de crédito/débito';
    case 'paypal':
      return 'PayPal';
    case 'cash':
      return 'Efectivo';
    default:
      return method;
  }
}

function getPaymentStatusClass(status: PaymentStatus): string {
  switch (status) {
    case PaymentStatus.COMPLETED:
      return 'status--delivered';
    case PaymentStatus.REFUNDED:
      return 'status--cancelled';
    case PaymentStatus.FAILED:
      return 'status--cancelled';
    case PaymentStatus.PROCESSING:
      return 'status--preparing';
    default:
      return 'status--pending';
  }
}

function getPaymentStatusText(status: PaymentStatus): string {
  switch (status) {
    case PaymentStatus.PENDING:
      return 'Pendiente';
    case PaymentStatus.PROCESSING:
      return 'Procesando';
    case PaymentStatus.COMPLETED:
      return 'Completado';
    case PaymentStatus.FAILED:
      return 'Fallido';
    case PaymentStatus.REFUNDED:
      return 'Reembolsado';
    case PaymentStatus.CANCELLED:
      return 'Cancelado';
    default:
      return status;
  }
}

function getFullAddress(): string {
  // In a real app, this would use actual address data
  return 'Calle Mayor 123, Piso 4B, Centro, Zaragoza, Aragón, 50001';
}

async function cancelOrder() {
  if (!order.value) return;
  
  try {
    cancellingOrder.value = true;
    
    const success = await orderService.cancelOrder(order.value.id);
    
    if (success) {
      // Update local order status
      order.value.status = OrderStatus.CANCELLED;
      showCancelModal.value = false;
      
      // Show success message (this would use a proper toast notification in a real app)
      alert('Pedido cancelado con éxito');
    } else {
      throw new Error('No se pudo cancelar el pedido');
    }
  } catch (err: any) {
    console.error('Error cancelling order:', err);
    alert(err.message || 'Error al cancelar el pedido');
  } finally {
    cancellingOrder.value = false;
  }
}

function reorderItems() {
  // Clear current cart
  cartStore.clearCart();
  
  // Add items from this order to cart
  if (order.value && order.value.items) {
    for (const item of order.value.items) {
      // In a real app, we'd have all the product details
      cartStore.addToCart({
        id: item.productId,
        name: item.name,
        price: item.price,
        restaurantId: order.value.restaurantId,
        categoryName: order.value.restaurantName,
        description: '',
        imageUrl: '',
        isAvailable: true,
        categoryId: 0
      }, item.quantity);
    }
  }
  
  // Redirect to cart
  router.push('/cart');
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

// Order detail page
.order-detail-page {
  background-color: $light-gray;
  min-height: 100vh;
  padding: 40px 0 60px;
}

// Breadcrumb navigation
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
}

.loading-spinner--small {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: $white;
  animation: spinner 1s linear infinite;
}

@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}

// Error container
.error-container {
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
    color: $error-color;
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
    margin: 0 0 16px;
    max-width: 500px;
  }

  &__message {
    font-size: 14px;
    color: $error-color;
    margin: 0 0 32px;
    padding: 12px 16px;
    background-color: rgba($error-color, 0.1);
    border-radius: $border-radius-sm;
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

// Order detail
.order-detail {
  background-color: $white;
  border-radius: $border-radius;
  box-shadow: $box-shadow;
  overflow: hidden;
}

// Order header
.order-header {
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid $light-gray;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }

  &__left {
    display: flex;
    align-items: center;
    gap: 16px;

    @media (max-width: 576px) {
      flex-direction: column;
      align-items: flex-start;
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

  &__right {
    text-align: right;

    @media (max-width: 768px) {
      text-align: left;
      width: 100%;
    }
  }

  &__date {
    margin-bottom: 16px;
    font-size: 14px;
    color: $text-secondary;
  }

  &__label {
    font-weight: 500;
    color: $text-primary;
    margin-bottom: 4px;
  }

  &__actions {
    display: flex;
    gap: 16px;
    justify-content: flex-end;

    @media (max-width: 768px) {
      justify-content: flex-start;
    }

    @media (max-width: 576px) {
      flex-direction: column;
      gap: 8px;
    }
  }

  &__cancel-btn {
    background-color: rgba($error-color, 0.1);
    color: $error-color;
    border: none;
    padding: 8px 16px;
    border-radius: $border-radius-sm;
    font-weight: 500;
    cursor: pointer;
    font-size: 14px;
    transition: $transition;

    &:hover {
      background-color: rgba($error-color, 0.2);
    }
  }

  &__reorder-btn {
    background-color: $primary-color;
    color: $white;
    border: none;
    padding: 8px 16px;
    border-radius: $border-radius-sm;
    font-weight: 500;
    cursor: pointer;
    font-size: 14px;
    transition: $transition;

    &:hover {
      background-color: darken($primary-color, 5%);
    }
  }
}

// Order content
.order-content {
  padding: 24px;
}

// Restaurant info
.restaurant-info {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid $light-gray;

  &__logo {
    width: 64px;
    height: 64px;
    flex-shrink: 0;
  }

  &__logo-placeholder {
    width: 100%;
    height: 100%;
    background-color: $primary-color;
    color: $white;
    border-radius: $border-radius-sm;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 24px;
  }

  &__details {
    flex: 1;
  }

  &__name {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 8px;
    color: $text-primary;
  }

  &__link {
    color: $primary-color;
    text-decoration: none;
    font-weight: 500;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 4px;
    width: fit-content;

    &:hover {
      text-decoration: underline;
    }
  }
}

// Section title
.section-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 16px;
  color: $text-primary;
}

// Order items
.order-items {
  margin-bottom: 32px;
}

// Item list
.item-list {
  background-color: $light-gray;
  border-radius: $border-radius-sm;
  overflow: hidden;
  margin-bottom: 16px;
}

// Order item
.order-item {
  display: flex;
  padding: 16px;
  border-bottom: 1px solid $white;

  &:last-child {
    border-bottom: none;
  }

  &__quantity {
    font-weight: 600;
    margin-right: 16px;
    min-width: 24px;
    color: $text-primary;
  }

  &__details {
    flex: 1;
    display: flex;
    justify-content: space-between;
  }

  &__name {
    font-weight: 500;
    color: $text-primary;
  }

  &__price {
    font-weight: 500;
    color: $text-primary;
  }
}

// Order costs
.order-costs {
  background-color: $light-gray;
  border-radius: $border-radius-sm;
  padding: 16px;
}

// Cost row
.cost-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 14px;
  color: $text-secondary;

  &:last-child {
    margin-bottom: 0;
  }

  &--total {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid $white;
    font-size: 16px;
    font-weight: 600;
    color: $text-primary;
  }
}

// Order info
.order-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

// Info column
.info-column {
  flex: 1;
}

// Info card
.info-card {
  background-color: $light-gray;
  border-radius: $border-radius-sm;
  padding: 16px;
}

// Info card group
.info-card__group {
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
}

// Info card label
.info-card__label {
  font-weight: 500;
  color: $text-primary;
  margin-bottom: 4px;
  font-size: 14px;
}

// Info card value
.info-card__value {
  color: $text-secondary;
  font-size: 14px;
  line-height: 1.5;
}

// Status value
.status-value {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 100px;
  font-weight: 500;
  font-size: 12px;
  
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

// Payment status
.payment-status {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 100px;
  font-weight: 500;
  font-size: 12px;
}

// Help and support
.help-support {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid $light-gray;
}

// Help actions
.help-actions {
  display: flex;
  gap: 16px;

  @media (max-width: 576px) {
    flex-direction: column;
  }
}

// Help action
.help-action {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: $light-gray;
  border: none;
  padding: 12px 20px;
  border-radius: $border-radius-sm;
  color: $text-primary;
  font-weight: 500;
  cursor: pointer;
  transition: $transition;

  &:hover {
    background-color: darken($light-gray, 5%);
  }
}

// Modal overlay and modal
.modal-overlay {
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
  padding: 24px;
}

.modal {
  width: 100%;
  max-width: 500px;
  background-color: $white;
  border-radius: $border-radius;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  overflow: hidden;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid $light-gray;
  }

  &__title {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
    color: $text-primary;
  }

  &__close {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $text-secondary;
    background: transparent;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: $transition;

    &:hover {
      background-color: $light-gray;
      color: $text-primary;
    }
  }

  &__content {
    padding: 20px;
  }

  &__message {
    font-size: 16px;
    margin: 0 0 12px;
    color: $text-primary;
  }

  &__hint {
    font-size: 14px;
    margin: 0 0 24px;
    color: $text-secondary;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 16px;

    @media (max-width: 576px) {
      flex-direction: column-reverse;
    }
  }

  &__button {
    padding: 12px 20px;
    border-radius: $border-radius-sm;
    font-weight: 500;
    cursor: pointer;
    transition: $transition;
    font-size: 14px;

    &--cancel {
      background-color: transparent;
      border: 1px solid $medium-gray;
      color: $text-primary;

      &:hover {
        background-color: $light-gray;
      }
    }

    &--confirm {
      background-color: $error-color;
      border: none;
      color: $white;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 42px;

      &:hover:not(:disabled) {
        background-color: darken($error-color, 5%);
      }

      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }
    }
  }
}
</style>