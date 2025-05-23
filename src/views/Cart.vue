<!-- src/views/Cart.vue -->
<template>
  <div class="cart-page">
    <div class="container">
      <!-- Empty cart state -->
      <div v-if="isEmpty" class="empty-cart">
        <div class="empty-cart__icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
        </div>
        <h2 class="empty-cart__title">Tu carrito está vacío</h2>
        <p class="empty-cart__text">Añade elementos de tus restaurantes favoritos para empezar tu pedido</p>
        <router-link to="/restaurants" class="empty-cart__button">Explorar restaurantes</router-link>
      </div>

      <!-- Cart with items -->
      <template v-else>
        <h1 class="cart-page__title">Mi carrito</h1>
        
        <div class="cart-wrapper">
          <!-- Cart items section -->
          <div class="cart-items">
            <div class="cart-restaurant">
              <div class="cart-restaurant__header">
                <div class="cart-restaurant__info">
                  <img :src="restaurantLogo" alt="Logo restaurante" class="cart-restaurant__logo" />
                  <div>
                    <h3 class="cart-restaurant__name">{{ restaurantName }}</h3>
                    <p class="cart-restaurant__delivery">Tiempo estimado de entrega: {{ deliveryTime }} min</p>
                  </div>
                </div>
                <router-link :to="`/restaurant/${restaurantId}`" class="cart-restaurant__link">
                  <span>Añadir más productos</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </router-link>
              </div>

              <!-- Cart item list -->
              <div class="cart-item-list">
                <div v-for="item in cartItems" :key="item.id" class="cart-item">
                  <div class="cart-item__image">
                    <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.name" />
                    <div v-else class="cart-item__placeholder">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                      </svg>
                    </div>
                  </div>
                  
                  <div class="cart-item__details">
                    <div class="cart-item__name">{{ item.name }}</div>
                    <div class="cart-item__price">${{ item.price.toFixed(2) }}</div>
                    
                    <div class="cart-item__actions">
                      <div class="cart-item__quantity">
                        <button class="cart-item__quantity-btn" @click="decrementItem(item.id)">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                        </button>
                        <span>{{ item.quantity }}</span>
                        <button class="cart-item__quantity-btn" @click="incrementItem(item.id)">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                        </button>
                      </div>
                      
                      <button class="cart-item__remove" @click="removeItem(item.id)">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </div>

                  <div class="cart-item__subtotal">
                    ${{ (item.price * item.quantity).toFixed(2) }}
                  </div>
                </div>
              </div>

              <div class="cart-actions">
                <button class="cart-actions__clear" @click="clearCart">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                  Vaciar carrito
                </button>
              </div>
            </div>
          </div>

          <!-- Order summary section -->
          <div class="order-summary">
            <div class="order-summary__header">
              <h3 class="order-summary__title">Resumen del pedido</h3>
            </div>

            <div class="order-summary__content">
              <div class="order-summary__row">
                <span>Subtotal</span>
                <span>${{ subtotal.toFixed(2) }}</span>
              </div>
              <div class="order-summary__row">
                <span>Costo de envío</span>
                <span v-if="deliveryFee > 0">${{ deliveryFee.toFixed(2) }}</span>
                <span v-else class="free-delivery">Gratis</span>
              </div>
              <div class="order-summary__row">
                <span>Impuestos</span>
                <span>${{ tax.toFixed(2) }}</span>
              </div>
              <div class="order-summary__row order-summary__total">
                <span>Total</span>
                <span>${{ total.toFixed(2) }}</span>
              </div>

              <div class="promocode">
                <input type="text" class="promocode__input" placeholder="Código promocional" v-model="promoCode" />
                <button class="promocode__button">Aplicar</button>
              </div>

              <button @click="proceedToCheckout" class="checkout-button">
                <span>Proceder al pago</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import type { CartItem } from '@/stores/cart';

const router = useRouter();
const cartStore = useCartStore();
const promoCode = ref('');

// Computed properties
const isEmpty = computed(() => cartStore.isEmpty);
const cartItems = computed(() => cartStore.items);
const restaurantId = computed(() => cartStore.restaurantId);
const restaurantName = computed(() => cartStore.restaurantName || 'Restaurante');
const restaurantLogo = ref('https://via.placeholder.com/50');
const deliveryTime = ref(25);

// Calculate order values
const subtotal = computed(() => cartStore.totalAmount);
const deliveryFee = ref(3.99);
const taxRate = 0.16; // 16% IVA
const tax = computed(() => subtotal.value * taxRate);
const total = computed(() => subtotal.value + deliveryFee.value + tax.value);

// Methods
const incrementItem = (itemId: number) => {
  const item = cartItems.value.find(item => item.id === itemId);
  if (item) {
    cartStore.updateQuantity(itemId, item.quantity + 1);
  }
};

const decrementItem = (itemId: number) => {
  const item = cartItems.value.find(item => item.id === itemId);
  if (item && item.quantity > 1) {
    cartStore.updateQuantity(itemId, item.quantity - 1);
  } else if (item) {
    removeItem(itemId);
  }
};

const removeItem = (itemId: number) => {
  cartStore.removeItem(itemId);
};

const clearCart = () => {
  if (confirm('¿Estás seguro de que deseas vaciar tu carrito?')) {
    cartStore.clearCart();
  }
};

const proceedToCheckout = () => {
  router.push('/checkout');
};

// Fetch additional data when component mounts
onMounted(async () => {
  if (restaurantId.value) {
    try {
      // In a real app, we'd fetch restaurant details to get the logo and delivery time
      // For now, we'll just use placeholder values
      console.log(`Would fetch details for restaurant ${restaurantId.value}`);
      
      // If the restaurant has free delivery, we'd set deliveryFee to 0
      // deliveryFee.value = 0;
    } catch (error) {
      console.error('Error fetching restaurant details:', error);
    }
  }
});
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

.cart-page {
  background-color: $light-gray;
  min-height: 100vh;
  padding: 40px 0 60px;

  &__title {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 24px;
    color: $text-primary;
  }
}

// Empty cart
.empty-cart {
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

// Cart wrapper
.cart-wrapper {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 24px;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
}

// Cart items
.cart-items {
  background-color: $white;
  border-radius: $border-radius;
  box-shadow: $box-shadow;
  overflow: hidden;
}

// Cart restaurant
.cart-restaurant {
  padding: 24px;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }
  }

  &__info {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  &__logo {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    object-fit: cover;
  }

  &__name {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 4px;
    color: $text-primary;
  }

  &__delivery {
    font-size: 14px;
    color: $text-secondary;
    margin: 0;
  }

  &__link {
    display: flex;
    align-items: center;
    gap: 8px;
    color: $primary-color;
    font-weight: 500;
    text-decoration: none;
    padding: 8px 12px;
    border-radius: 8px;
    transition: $transition;

    &:hover {
      background-color: rgba($primary-color, 0.1);
    }
  }
}

// Cart item list
.cart-item-list {
  border-top: 1px solid $light-gray;
  margin-bottom: 24px;
}

// Cart item
.cart-item {
  display: flex;
  padding: 16px 0;
  border-bottom: 1px solid $light-gray;

  @media (max-width: 576px) {
    flex-direction: column;
    gap: 16px;
  }

  &__image {
    width: 80px;
    height: 80px;
    border-radius: 8px;
    overflow: hidden;
    margin-right: 16px;
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
    font-weight: 500;
    margin-bottom: 4px;
    color: $text-primary;
  }

  &__price {
    color: $text-secondary;
    font-size: 14px;
    margin-bottom: 16px;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  &__quantity {
    display: flex;
    align-items: center;
    gap: 4px;

    span {
      min-width: 24px;
      text-align: center;
      font-weight: 600;
    }
  }

  &__quantity-btn {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    border: 1px solid $medium-gray;
    background-color: $white;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $text-primary;
    cursor: pointer;
    transition: $transition;

    &:hover {
      background-color: $light-gray;
    }
  }

  &__remove {
    display: flex;
    align-items: center;
    gap: 6px;
    background-color: transparent;
    border: none;
    color: $text-secondary;
    cursor: pointer;
    transition: $transition;
    padding: 6px 8px;
    border-radius: 6px;

    &:hover {
      color: $error-color;
      background-color: rgba($error-color, 0.1);
    }

    svg {
      stroke: currentColor;
    }
  }

  &__subtotal {
    font-weight: 600;
    color: $text-primary;
    margin-left: 16px;
    text-align: right;
    min-width: 70px;

    @media (max-width: 576px) {
      text-align: left;
      margin-left: 0;
    }
  }
}

// Cart actions
.cart-actions {
  display: flex;
  justify-content: flex-end;

  &__clear {
    display: flex;
    align-items: center;
    gap: 8px;
    background-color: transparent;
    border: 1px solid $medium-gray;
    padding: 8px 16px;
    border-radius: 8px;
    color: $text-secondary;
    font-weight: 500;
    cursor: pointer;
    transition: $transition;

    &:hover {
      background-color: rgba($error-color, 0.1);
      border-color: $error-color;
      color: $error-color;
    }

    svg {
      stroke: currentColor;
    }
  }
}

// Order summary
.order-summary {
  background-color: $white;
  border-radius: $border-radius;
  box-shadow: $box-shadow;
  overflow: hidden;
  position: sticky;
  top: 24px;

  &__header {
    padding: 24px;
    border-bottom: 1px solid $light-gray;
  }

  &__title {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
    color: $text-primary;
  }

  &__content {
    padding: 24px;
  }

  &__row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
    font-size: 14px;
    color: $text-secondary;

    &:last-child {
      margin-bottom: 24px;
    }
  }

  &__total {
    padding-top: 16px;
    margin-top: 16px;
    border-top: 1px solid $light-gray;
    font-size: 18px;
    font-weight: 600;
    color: $text-primary;
  }
}

// Free delivery
.free-delivery {
  color: $success-color;
  font-weight: 600;
}

// Promocode
.promocode {
  display: flex;
  margin-bottom: 24px;

  &__input {
    flex: 1;
    height: 44px;
    padding: 0 16px;
    border: 1px solid $medium-gray;
    border-radius: 8px 0 0 8px;
    font-size: 14px;

    &:focus {
      outline: none;
      border-color: $primary-color;
    }
  }

  &__button {
    height: 44px;
    padding: 0 16px;
    background-color: $primary-color;
    border: none;
    border-radius: 0 8px 8px 0;
    color: $white;
    font-weight: 600;
    cursor: pointer;
    transition: $transition;

    &:hover {
      background-color: darken($primary-color, 5%);
    }
  }
}

// Checkout button
.checkout-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 50px;
  background-color: $primary-color;
  border: none;
  border-radius: 8px;
  color: $white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: $transition;
  box-shadow: 0 4px 8px rgba(6, 193, 103, 0.2);

  &:hover {
    background-color: darken($primary-color, 5%);
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(6, 193, 103, 0.3);
  }
}
</style>