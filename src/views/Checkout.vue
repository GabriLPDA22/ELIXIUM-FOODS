<!-- src/views/Checkout.vue -->
<template>
  <div class="checkout-page">
    <div class="container">
      <!-- Breadcrumb navigation -->
      <div class="breadcrumb">
        <router-link to="/" class="breadcrumb__link">Inicio</router-link>
        <span class="breadcrumb__separator">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </span>
        <router-link to="/cart" class="breadcrumb__link">Carrito</router-link>
        <span class="breadcrumb__separator">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </span>
        <span class="breadcrumb__current">Checkout</span>
      </div>

      <h1 class="checkout-page__title">Finalizar pedido</h1>

      <!-- Main checkout content -->
      <div class="checkout-content">
        <div class="checkout-steps">
          <!-- Step progress indicator -->
          <div class="step-progress">
            <div v-for="(step, index) in steps" :key="step.id" class="step-item"
              :class="{ 'step-item--active': currentStep >= index, 'step-item--completed': currentStep > index }">
              <div class="step-item__indicator">
                <template v-if="currentStep > index">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </template>
                <template v-else>
                  {{ index + 1 }}
                </template>
              </div>
              <span class="step-item__name">{{ step.name }}</span>
            </div>
          </div>

          <!-- Step content container -->
          <div class="step-content">
            <!-- Delivery options step (step 1) -->
            <div v-if="currentStep === 0" class="step-panel">
              <h2 class="step-panel__title">Opciones de entrega</h2>
              <DeliveryOptions 
                :addresses="addresses" 
                :selectedAddress="selectedAddress"
                @select-address="selectAddress"
                @add-address="showAddAddressModal = true"
              />
              <div class="step-panel__actions">
                <button @click="goToStep(1)" class="btn-next" :disabled="!selectedAddress">
                  Continuar al pago
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Payment methods step (step 2) -->
            <div v-else-if="currentStep === 1" class="step-panel">
              <h2 class="step-panel__title">Método de pago</h2>
              <PaymentMethods 
                :paymentMethods="paymentMethods" 
                :selectedPaymentMethod="selectedPaymentMethod"
                @select-payment="selectPaymentMethod"
                @add-payment="showAddPaymentModal = true"
              />
              <div class="step-panel__actions">
                <button @click="goToStep(0)" class="btn-back">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                  Volver
                </button>
                <button @click="goToStep(2)" class="btn-next" :disabled="!selectedPaymentMethod">
                  Revisar pedido
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Order review step (step 3) -->
            <div v-else-if="currentStep === 2" class="step-panel">
              <h2 class="step-panel__title">Revisar pedido</h2>
              <OrderSummary 
                :cartItems="cartItems"
                :subtotal="subtotal"
                :deliveryFee="deliveryFee"
                :tax="tax"
                :total="total"
                :selectedAddress="getSelectedAddress()"
                :selectedPaymentMethod="getSelectedPaymentMethod()"
                :estimatedDeliveryTime="estimatedDeliveryTime"
              />
              <div class="step-panel__actions">
                <button @click="goToStep(1)" class="btn-back">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                  Volver
                </button>
                <button @click="placeOrder" class="btn-place-order" :disabled="loading">
                  <span v-if="!loading">Realizar pedido</span>
                  <span v-else class="loading-spinner"></span>
                </button>
              </div>
            </div>

            <!-- Order confirmation step (step 4) -->
            <div v-else-if="currentStep === 3" class="step-panel step-panel--success">
              <div class="order-success">
                <div class="order-success__icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <h2 class="order-success__title">¡Pedido realizado con éxito!</h2>
                <p class="order-success__text">Tu pedido #{{ orderId }} ha sido recibido y está siendo procesado.</p>
                <div class="order-success__details">
                  <div class="order-success__detail">
                    <span class="order-success__label">Número de pedido:</span>
                    <span class="order-success__value">{{ orderId }}</span>
                  </div>
                  <div class="order-success__detail">
                    <span class="order-success__label">Tiempo estimado de entrega:</span>
                    <span class="order-success__value">{{ estimatedDeliveryTime }} minutos</span>
                  </div>
                  <div class="order-success__detail">
                    <span class="order-success__label">Dirección de entrega:</span>
                    <span class="order-success__value">{{ getSelectedAddress()?.street }}</span>
                  </div>
                  <div class="order-success__detail">
                    <span class="order-success__label">Método de pago:</span>
                    <span class="order-success__value">{{ getSelectedPaymentMethod()?.name }}</span>
                  </div>
                  <div class="order-success__detail">
                    <span class="order-success__label">Total:</span>
                    <span class="order-success__value">${{ total.toFixed(2) }}</span>
                  </div>
                </div>
                <div class="order-success__actions">
                  <router-link to="/orders" class="order-success__button">Ver mis pedidos</router-link>
                  <router-link to="/" class="order-success__button order-success__button--secondary">Volver al inicio</router-link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Order summary sidebar -->
        <div class="order-sidebar" v-if="currentStep < 3">
          <div class="order-summary">
            <div class="order-summary__header">
              <h3 class="order-summary__title">Resumen del pedido</h3>
            </div>
            <div class="order-summary__content">
              <div class="order-summary__restaurant">
                <img :src="restaurantLogo" alt="Logo restaurante" class="order-summary__logo">
                <div>
                  <h4 class="order-summary__restaurant-name">{{ restaurantName }}</h4>
                  <p class="order-summary__delivery-time">{{ estimatedDeliveryTime }} min</p>
                </div>
              </div>

              <!-- Cart item list (compact) -->
              <div class="order-summary__items">
                <div v-for="item in cartItems" :key="item.id" class="order-summary__item">
                  <div class="item-quantity">{{ item.quantity }}×</div>
                  <div class="item-name">{{ item.name }}</div>
                  <div class="item-price">${{ (item.price * item.quantity).toFixed(2) }}</div>
                </div>
              </div>

              <!-- Order totals -->
              <div class="order-summary__totals">
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
              </div>

              <div class="order-summary__promocode">
                <input type="text" class="promocode-input" placeholder="Código promocional" v-model="promoCode">
                <button class="promocode-button">Aplicar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal for adding a new address -->
    <div v-if="showAddAddressModal" class="modal-overlay">
      <div class="modal">
        <div class="modal__header">
          <h3 class="modal__title">Añadir nueva dirección</h3>
          <button class="modal__close" @click="showAddAddressModal = false">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="modal__content">
          <form @submit.prevent="addNewAddress" class="address-form">
            <div class="form-group">
              <label for="addressName">Nombre de la dirección</label>
              <input type="text" id="addressName" v-model="newAddress.name" placeholder="Ej. Casa, Oficina" required>
            </div>
            <div class="form-group">
              <label for="addressStreet">Calle y número</label>
              <input type="text" id="addressStreet" v-model="newAddress.street" placeholder="Ej. Av. Siempreviva 742" required>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="addressNumber">Número exterior</label>
                <input type="text" id="addressNumber" v-model="newAddress.number" placeholder="Ej. 123" required>
              </div>
              <div class="form-group">
                <label for="addressInterior">Interior (opcional)</label>
                <input type="text" id="addressInterior" v-model="newAddress.interior" placeholder="Ej. Apto 4B">
              </div>
            </div>
            <div class="form-group">
              <label for="addressNeighborhood">Colonia</label>
              <input type="text" id="addressNeighborhood" v-model="newAddress.neighborhood" placeholder="Ej. Centro" required>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="addressCity">Ciudad</label>
                <input type="text" id="addressCity" v-model="newAddress.city" placeholder="Ej. Zaragoza" required>
              </div>
              <div class="form-group">
                <label for="addressState">Estado</label>
                <input type="text" id="addressState" v-model="newAddress.state" placeholder="Ej. Aragón" required>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="addressZipCode">Código postal</label>
                <input type="text" id="addressZipCode" v-model="newAddress.zipCode" placeholder="Ej. 50001" required>
              </div>
              <div class="form-group">
                <label for="addressPhone">Teléfono</label>
                <input type="tel" id="addressPhone" v-model="newAddress.phone" placeholder="Ej. 555-123-4567" required>
              </div>
            </div>
            <div class="form-group form-checkbox">
              <input type="checkbox" id="addressDefault" v-model="newAddress.isDefault">
              <label for="addressDefault">Establecer como dirección predeterminada</label>
            </div>
            <div class="form-actions">
              <button type="button" class="btn-cancel" @click="showAddAddressModal = false">Cancelar</button>
              <button type="submit" class="btn-save">Guardar dirección</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal for adding a new payment method -->
    <div v-if="showAddPaymentModal" class="modal-overlay">
      <div class="modal">
        <div class="modal__header">
          <h3 class="modal__title">Añadir nuevo método de pago</h3>
          <button class="modal__close" @click="showAddPaymentModal = false">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="modal__content">
          <form @submit.prevent="addNewPaymentMethod" class="payment-form">
            <div class="form-group">
              <label for="cardNumber">Número de tarjeta</label>
              <input type="text" id="cardNumber" v-model="newPayment.cardNumber" placeholder="1234 5678 9012 3456" required>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="cardName">Nombre en la tarjeta</label>
                <input type="text" id="cardName" v-model="newPayment.cardName" placeholder="Juan Pérez" required>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="cardExpiry">Fecha de expiración</label>
                <input type="text" id="cardExpiry" v-model="newPayment.cardExpiry" placeholder="MM/AA" required>
              </div>
              <div class="form-group">
                <label for="cardCvv">CVV</label>
                <input type="text" id="cardCvv" v-model="newPayment.cardCvv" placeholder="123" required>
              </div>
            </div>
            <div class="form-group form-checkbox">
              <input type="checkbox" id="cardDefault" v-model="newPayment.isDefault">
              <label for="cardDefault">Establecer como método predeterminado</label>
            </div>
            <div class="form-actions">
              <button type="button" class="btn-cancel" @click="showAddPaymentModal = false">Cancelar</button>
              <button type="submit" class="btn-save">Guardar método de pago</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import DeliveryOptions from '@/components/feature/checkout/DeliveryOptions.vue';
import PaymentMethods from '@/components/feature/checkout/PaymentMethods.vue';
import OrderSummary from '@/components/feature/checkout/OrderSummary.vue';
import type { CartItem } from '@/stores/cart';

// Router
const router = useRouter();

// Cart store
const cartStore = useCartStore();

// Checkout steps
const steps = [
  { id: 'delivery', name: 'Entrega' },
  { id: 'payment', name: 'Pago' },
  { id: 'review', name: 'Revisión' },
  { id: 'confirmation', name: 'Confirmación' }
];

// State
const currentStep = ref(0);
const loading = ref(false);
const promoCode = ref('');
const orderId = ref('');
const estimatedDeliveryTime = ref(30);

// Addresses
const selectedAddress = ref<number | null>(null);
const addresses = ref<any[]>([]);
const showAddAddressModal = ref(false);
const newAddress = ref({
  name: '',
  street: '',
  number: '',
  interior: '',
  neighborhood: '',
  city: '',
  state: '',
  zipCode: '',
  phone: '',
  isDefault: false
});

// Payment methods
const selectedPaymentMethod = ref<number | null>(null);
const paymentMethods = ref<any[]>([]);
const showAddPaymentModal = ref(false);
const newPayment = ref({
  cardNumber: '',
  cardName: '',
  cardExpiry: '',
  cardCvv: '',
  isDefault: false
});

// Restaurant and order information
const restaurantId = computed(() => cartStore.restaurantId);
const restaurantName = computed(() => cartStore.restaurantName || 'Restaurante');
const restaurantLogo = ref('https://via.placeholder.com/50');
const cartItems = computed(() => cartStore.items);

// Calculate order values
const subtotal = computed(() => cartStore.totalAmount);
const deliveryFee = ref(3.99);
const taxRate = 0.16; // 16% IVA
const tax = computed(() => subtotal.value * taxRate);
const total = computed(() => subtotal.value + deliveryFee.value + tax.value);

// Methods
const goToStep = (step: number) => {
  currentStep.value = step;
  window.scrollTo(0, 0);
};

const selectAddress = (addressId: number) => {
  selectedAddress.value = addressId;
};

const selectPaymentMethod = (paymentId: number) => {
  selectedPaymentMethod.value = paymentId;
};

const getSelectedAddress = () => {
  return addresses.value.find(address => address.id === selectedAddress.value) || null;
};

const getSelectedPaymentMethod = () => {
  return paymentMethods.value.find(method => method.id === selectedPaymentMethod.value) || null;
};

const addNewAddress = () => {
  // In a real app, we would make an API call to save the address
  const newId = addresses.value.length + 1;
  const address = {
    id: newId,
    ...newAddress.value
  };
  
  addresses.value.push(address);
  selectedAddress.value = newId;
  showAddAddressModal.value = false;
  
  // Reset form
  newAddress.value = {
    name: '',
    street: '',
    number: '',
    interior: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    isDefault: false
  };
};

const addNewPaymentMethod = () => {
  // In a real app, we would make an API call to save the payment method
  const newId = paymentMethods.value.length + 1;
  const paymentMethod = {
    id: newId,
    type: 'card',
    name: `**** ${newPayment.value.cardNumber.slice(-4)}`,
    cardType: getCardType(newPayment.value.cardNumber),
    ...newPayment.value
  };
  
  paymentMethods.value.push(paymentMethod);
  selectedPaymentMethod.value = newId;
  showAddPaymentModal.value = false;
  
  // Reset form
  newPayment.value = {
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: '',
    isDefault: false
  };
};

const getCardType = (cardNumber: string) => {
  // Basic card type detection based on first digit
  const firstDigit = cardNumber.charAt(0);
  
  if (firstDigit === '4') return 'visa';
  if (firstDigit === '5') return 'mastercard';
  if (firstDigit === '3') return 'amex';
  
  return 'generic';
};

const placeOrder = async () => {
  if (!selectedAddress.value || !selectedPaymentMethod.value) {
    return;
  }
  
  loading.value = true;
  
  try {
    // Here we would call the API to place the order
    // For now, we'll simulate the API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create order request
    const orderRequest = {
      restaurantId: restaurantId.value,
      items: cartItems.value.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      })),
      addressId: selectedAddress.value,
      paymentMethod: getSelectedPaymentMethod()?.type || 'card'
    };
    
    console.log('Order placed:', orderRequest);
    
    // Generate a fake order ID
    orderId.value = Math.floor(Math.random() * 10000).toString().padStart(5, '0');
    
    // Order success - clear cart and move to confirmation step
    cartStore.clearCart();
    goToStep(3);
  } catch (error) {
    console.error('Error placing order:', error);
    alert('Error al procesar el pedido. Por favor, inténtalo de nuevo.');
  } finally {
    loading.value = false;
  }
};

// Fetch necessary data on component mount
onMounted(async () => {
  // Redirect to cart if cart is empty
  if (cartStore.isEmpty) {
    router.push('/cart');
    return;
  }
  
  // Fetch user addresses
  // In a real app, this would be an API call
  addresses.value = [
    {
      id: 1,
      name: 'Casa',
      street: 'Calle Mayor',
      number: '123',
      interior: '',
      neighborhood: 'Centro',
      city: 'Zaragoza',
      state: 'Aragón',
      zipCode: '50003',
      phone: '976123456',
      isDefault: true
    },
    {
      id: 2,
      name: 'Oficina',
      street: 'Paseo Independencia',
      number: '45',
      interior: 'Piso 3, Oficina B',
      neighborhood: 'Centro',
      city: 'Zaragoza',
      state: 'Aragón',
      zipCode: '50001',
      phone: '976654321',
      isDefault: false
    }
  ];
  
  // Set default address if available
  const defaultAddress = addresses.value.find(addr => addr.isDefault);
  if (defaultAddress) {
    selectedAddress.value = defaultAddress.id;
  } else if (addresses.value.length > 0) {
    selectedAddress.value = addresses.value[0].id;
  }
  
  // Fetch payment methods
  // In a real app, this would be an API call
  paymentMethods.value = [
    {
      id: 1,
      type: 'card',
      name: '**** 1234',
      cardType: 'visa',
      isDefault: true
    },
    {
      id: 2,
      type: 'card',
      name: '**** 5678',
      cardType: 'mastercard',
      isDefault: false
    }
  ];
  
  // Set default payment method if available
  const defaultPayment = paymentMethods.value.find(method => method.isDefault);
  if (defaultPayment) {
    selectedPaymentMethod.value = defaultPayment.id;
  } else if (paymentMethods.value.length > 0) {
    selectedPaymentMethod.value = paymentMethods.value[0].id;
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

// Checkout page
.checkout-page {
  background-color: $light-gray;
  min-height: 100vh;
  padding: 40px 0 60px;

  &__title {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 32px;
    color: $text-primary;
  }
}

// Breadcrumb navigation
.breadcrumb {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
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

// Checkout content
.checkout-content {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 24px;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
}

// Step progress
.step-progress {
  display: flex;
  justify-content: space-between;
  margin-bottom: 32px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 24px;
    left: 24px;
    right: 24px;
    height: 2px;
    background-color: $medium-gray;
    z-index: 1;
  }
}

// Step item
.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;

  &::before {
    content: '';
    position: absolute;
    top: 24px;
    left: -50%;
    width: 100%;
    height: 2px;
    background-color: $primary-color;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &--active {
    .step-item__indicator {
      background-color: $primary-color;
      color: $white;
      border-color: $primary-color;
    }

    .step-item__name {
      color: $text-primary;
      font-weight: 600;
    }
  }

  &--completed {
    &::before {
      opacity: 1;
    }

    .step-item__indicator {
      background-color: $primary-color;
      color: $white;
      border-color: $primary-color;
    }
  }

  &:first-child::before {
    display: none;
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
    margin-bottom: 8px;
    font-weight: 600;
    transition: all 0.3s ease;
  }

  &__name {
    font-size: 14px;
    color: $text-secondary;
    transition: all 0.3s ease;
  }
}

// Step panels
.step-panel {
  background-color: $white;
  border-radius: $border-radius;
  box-shadow: $box-shadow;
  padding: 24px;
  margin-bottom: 16px;

  &__title {
    font-size: 20px;
    font-weight: 600;
    margin: 0 0 24px;
    color: $text-primary;
  }

  &__actions {
    display: flex;
    justify-content: space-between;
    margin-top: 32px;
  }

  &--success {
    text-align: center;
  }
}

// Navigation buttons
.btn-next {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: $primary-color;
  color: $white;
  border: none;
  border-radius: $border-radius-sm;
  padding: 12px 24px;
  font-weight: 600;
  cursor: pointer;
  transition: $transition;
  box-shadow: 0 4px 8px rgba(6, 193, 103, 0.2);

  &:hover:not(:disabled) {
    background-color: darken($primary-color, 5%);
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(6, 193, 103, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.btn-back {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: $white;
  color: $text-primary;
  border: 1px solid $medium-gray;
  border-radius: $border-radius-sm;
  padding: 12px 24px;
  font-weight: 500;
  cursor: pointer;
  transition: $transition;

  &:hover {
    background-color: $light-gray;
  }
}

.btn-place-order {
  background-color: $primary-color;
  color: $white;
  border: none;
  border-radius: $border-radius-sm;
  padding: 12px 32px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: $transition;
  box-shadow: 0 4px 8px rgba(6, 193, 103, 0.2);
  min-width: 200px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    background-color: darken($primary-color, 5%);
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(6, 193, 103, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

// Loading spinner
.loading-spinner {
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

// Order sidebar
.order-sidebar {
  position: sticky;
  top: 24px;

  @media (max-width: 992px) {
    position: static;
  }
}

// Order summary
.order-summary {
  background-color: $white;
  border-radius: $border-radius;
  box-shadow: $box-shadow;
  overflow: hidden;

  &__header {
    padding: 20px;
    border-bottom: 1px solid $light-gray;
  }

  &__title {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
    color: $text-primary;
  }

  &__content {
    padding: 20px;
  }

  &__restaurant {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid $light-gray;
  }

  &__logo {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    object-fit: cover;
  }

  &__restaurant-name {
    font-weight: 600;
    margin: 0 0 4px;
    font-size: 16px;
  }

  &__delivery-time {
    margin: 0;
    font-size: 14px;
    color: $text-secondary;
  }

  &__items {
    margin-bottom: 20px;
    max-height: 200px;
    overflow-y: auto;
  }

  &__item {
    display: flex;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid $light-gray;

    &:last-child {
      border-bottom: none;
    }

    .item-quantity {
      font-weight: 600;
      margin-right: 8px;
      min-width: 30px;
    }

    .item-name {
      flex: 1;
      font-size: 14px;
    }

    .item-price {
      font-weight: 500;
      font-size: 14px;
    }
  }

  &__totals {
    padding: 16px 0;
    border-top: 1px solid $light-gray;
    margin-bottom: 16px;
  }

  &__row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 14px;
    color: $text-secondary;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__total {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid $light-gray;
    font-size: 16px;
    font-weight: 600;
    color: $text-primary;
  }

  &__promocode {
    display: flex;
    margin-bottom: 16px;
  }
}

// Free delivery
.free-delivery {
  color: $success-color;
  font-weight: 600;
}

// Promocode input
.promocode-input {
  flex: 1;
  height: 40px;
  padding: 0 12px;
  border: 1px solid $medium-gray;
  border-radius: 8px 0 0 8px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: $primary-color;
  }
}

.promocode-button {
  height: 40px;
  padding: 0 12px;
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

// Order success message
.order-success {
  padding: 24px 0;

  &__icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 24px;
    background-color: rgba($success-color, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $success-color;
  }

  &__title {
    font-size: 24px;
    font-weight: 700;
    margin: 0 0 16px;
    color: $text-primary;
  }

  &__text {
    font-size: 16px;
    color: $text-secondary;
    margin: 0 0 32px;
  }

  &__details {
    max-width: 400px;
    margin: 0 auto 32px;
    text-align: left;
    background-color: $light-gray;
    border-radius: $border-radius;
    padding: 16px;
  }

  &__detail {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    font-size: 14px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__label {
    font-weight: 500;
    color: $text-secondary;
  }

  &__value {
    font-weight: 600;
    color: $text-primary;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 16px;
  }

  &__button {
    padding: 12px 24px;
    border-radius: $border-radius-sm;
    font-weight: 600;
    text-decoration: none;
    transition: $transition;

    &:hover {
      transform: translateY(-2px);
    }

    background-color: $primary-color;
    color: $white;
    box-shadow: 0 4px 8px rgba(6, 193, 103, 0.2);

    &--secondary {
      background-color: transparent;
      border: 1px solid $primary-color;
      color: $primary-color;
      box-shadow: none;

      &:hover {
        background-color: rgba($primary-color, 0.05);
      }
    }
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
  max-height: 90vh;
  display: flex;
  flex-direction: column;

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
    overflow-y: auto;
  }
}

// Form styles
.form-group {
  margin-bottom: 16px;

  label {
    display: block;
    margin-bottom: 6px;
    font-size: 14px;
    font-weight: 500;
    color: $text-primary;
  }

  input[type="text"],
  input[type="tel"] {
    width: 100%;
    height: 40px;
    padding: 0 12px;
    border: 1px solid $medium-gray;
    border-radius: 8px;
    font-size: 14px;
    transition: $transition;

    &:focus {
      outline: none;
      border-color: $primary-color;
    }
  }
}

.form-row {
  display: flex;
  gap: 16px;

  .form-group {
    flex: 1;
  }

  @media (max-width: 576px) {
    flex-direction: column;
    gap: 0;
  }
}

.form-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;

  input[type="checkbox"] {
    width: 16px;
    height: 16px;
  }

  label {
    margin-bottom: 0;
    cursor: pointer;
  }
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 24px;
}

.btn-cancel {
  padding: 10px 20px;
  border: 1px solid $medium-gray;
  background-color: transparent;
  border-radius: 8px;
  color: $text-secondary;
  font-weight: 500;
  cursor: pointer;
  transition: $transition;

  &:hover {
    background-color: $light-gray;
  }
}

.btn-save {
  padding: 10px 20px;
  border: none;
  background-color: $primary-color;
  border-radius: 8px;
  color: $white;
  font-weight: 600;
  cursor: pointer;
  transition: $transition;

  &:hover {
    background-color: darken($primary-color, 5%);
  }
}
</style>