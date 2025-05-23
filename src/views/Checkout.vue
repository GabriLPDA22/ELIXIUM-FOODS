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

              <!-- Delivery time options -->
              <div class="delivery-options">
                <div class="delivery-option"
                     :class="{ 'delivery-option--active': deliveryType === 'now' }"
                     @click="deliveryType = 'now'">
                  <input type="radio" v-model="deliveryType" value="now" id="delivery-now">
                  <label for="delivery-now">
                    <div class="delivery-option__main">
                      <h4>Entregar ahora</h4>
                      <p>{{ estimatedDeliveryTime }}-{{ estimatedDeliveryTime + 15 }} min</p>
                    </div>
                  </label>
                </div>

                <div class="delivery-option"
                     :class="{ 'delivery-option--active': deliveryType === 'scheduled' }"
                     @click="deliveryType = 'scheduled'">
                  <input type="radio" v-model="deliveryType" value="scheduled" id="delivery-scheduled">
                  <label for="delivery-scheduled">
                    <div class="delivery-option__main">
                      <h4>Programar para más tarde</h4>
                      <p>Elige día y hora</p>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Scheduled delivery time picker -->
              <div v-if="deliveryType === 'scheduled'" class="scheduled-delivery">
                <h4>Selecciona fecha y hora de entrega</h4>
                <div class="scheduled-delivery__inputs">
                  <div class="input-group">
                    <label for="delivery-date">Fecha</label>
                    <input type="date"
                           id="delivery-date"
                           v-model="scheduledDate"
                           :min="minDate"
                           :max="maxDate">
                  </div>
                  <div class="input-group">
                    <label for="delivery-time">Hora</label>
                    <select id="delivery-time" v-model="scheduledTime" class="time-selector">
                      <option value="">Seleccionar hora</option>
                      <option v-for="time in availableTimeSlots" :key="time" :value="time">
                        {{ time }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Address selection -->
              <div class="address-section">
                <h4>Dirección de entrega</h4>
                <div v-if="loadingAddresses" class="loading-addresses">
                  <div class="loading-spinner"></div>
                  <span>Cargando direcciones...</span>
                </div>
                <div v-else-if="addresses.length === 0" class="no-addresses">
                  <div class="empty-state">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <p>No tienes direcciones guardadas</p>
                    <p class="empty-state__subtitle">Agrega una dirección para continuar con tu pedido</p>
                  </div>
                  <button @click="showAddAddressModal = true" class="add-item-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Agregar primera dirección
                  </button>
                </div>
                <div v-else class="address-list">
                  <div v-for="address in addresses" :key="address.id"
                       class="address-item"
                       :class="{ 'address-item--selected': selectedAddress === address.id }"
                       @click="selectAddress(address.id)">
                    <div class="address-content">
                      <h5>{{ address.name }}</h5>
                      <p>{{ formatAddress(address) }}</p>
                      <span v-if="address.isDefault" class="default-badge">Predeterminada</span>
                    </div>
                    <div class="radio-indicator">
                      <input type="radio"
                             :checked="selectedAddress === address.id"
                             @change="selectAddress(address.id)">
                    </div>
                  </div>
                  <!-- Botón funcional para agregar dirección -->
                  <button @click="showAddAddressModal = true" class="add-item-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Agregar nueva dirección
                  </button>
                </div>
              </div>

              <!-- Delivery instructions -->
              <div class="delivery-instructions">
                <label for="instructions">Instrucciones para la entrega (opcional)</label>
                <textarea id="instructions"
                          v-model="deliveryInstructions"
                          placeholder="Ej. Timbre no funciona, llamar por teléfono..."
                          rows="3"></textarea>
              </div>

              <div class="step-panel__actions">
                <button @click="goToStep(1)"
                        class="btn-next"
                        :disabled="!canProceedToPayment">
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

              <div class="payment-methods">
                <div v-if="loadingPaymentMethods" class="loading-payment">
                  <div class="loading-spinner"></div>
                  <span>Cargando métodos de pago...</span>
                </div>
                <div v-else-if="paymentMethods.length === 0" class="no-payment-methods">
                  <div class="empty-state">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                      <line x1="1" y1="10" x2="23" y2="10"></line>
                    </svg>
                    <p>No tienes métodos de pago guardados</p>
                    <p class="empty-state__subtitle">Agrega un método de pago para finalizar tu pedido</p>
                  </div>
                  <button @click="showAddPaymentModal = true" class="add-item-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Agregar primer método de pago
                  </button>
                </div>
                <div v-else class="payment-method-list">
                  <div v-for="method in paymentMethods" :key="method.id"
                       class="payment-method"
                       :class="{ 'payment-method--selected': selectedPaymentMethod === method.id }"
                       @click="selectPaymentMethod(method.id)">
                    <div class="payment-method__icon">
                      <svg v-if="method.type === 'card'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                        <line x1="1" y1="10" x2="23" y2="10"></line>
                      </svg>
                      <svg v-else-if="method.type === 'paypal'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M8 12h8"></path>
                      </svg>
                    </div>
                    <div class="payment-method__details">
                      <h5>{{ method.name }}</h5>
                      <p>{{ getPaymentMethodDescription(method) }}</p>
                    </div>
                    <div class="radio-indicator">
                      <input type="radio"
                             :checked="selectedPaymentMethod === method.id"
                             @change="selectPaymentMethod(method.id)">
                    </div>
                  </div>
                  <!-- Botón funcional para agregar método de pago -->
                  <button @click="showAddPaymentModal = true" class="add-item-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Agregar nuevo método de pago
                  </button>
                </div>
              </div>

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

              <!-- Order review content -->
              <div class="order-review">
                <div class="review-section">
                  <h4>Detalles de entrega</h4>
                  <div class="review-item">
                    <strong>Tipo:</strong> {{ deliveryType === 'now' ? 'Entregar ahora' : 'Programado' }}
                  </div>
                  <div v-if="deliveryType === 'scheduled'" class="review-item">
                    <strong>Fecha y hora:</strong> {{ formatScheduledDelivery() }}
                  </div>
                  <div class="review-item">
                    <strong>Dirección:</strong> {{ getSelectedAddress()?.name }} - {{ formatAddress(getSelectedAddress()) }}
                  </div>
                  <div v-if="deliveryInstructions" class="review-item">
                    <strong>Instrucciones:</strong> {{ deliveryInstructions }}
                  </div>
                </div>

                <div class="review-section">
                  <h4>Método de pago</h4>
                  <div class="review-item">
                    <strong>{{ getSelectedPaymentMethod()?.name }}</strong>
                    <span>{{ getPaymentMethodDescription(getSelectedPaymentMethod()) }}</span>
                  </div>
                </div>

                <div class="review-section">
                  <h4>Productos</h4>
                  <div class="review-items">
                    <div v-for="item in cartItems" :key="item.id" class="review-product">
                      <span class="quantity">{{ item.quantity }}×</span>
                      <span class="name">{{ item.name }}</span>
                      <span class="price">${{ (item.price * item.quantity).toFixed(2) }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="step-panel__actions">
                <button @click="goToStep(1)" class="btn-back">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                  Volver
                </button>
                <button @click="placeOrder" class="btn-place-order" :disabled="placingOrder">
                  <span v-if="!placingOrder">Realizar pedido</span>
                  <span v-else class="loading-spinner"></span>
                </button>
              </div>
            </div>

            <!-- Order confirmation step (step 4) - CON VIDEOS ALEATORIOS -->
            <div v-else-if="currentStep === 3" class="step-panel step-panel--success">
              <div class="order-success">
                <!-- Video aleatorio de delivery -->
                <div class="delivery-animation-container">
                  <video
                    v-if="randomDeliveryGifUrl"
                    :src="randomDeliveryGifUrl"
                    autoplay
                    loop
                    muted
                    playsinline
                    class="delivery-video">
                  </video>

                  <!-- Textos animados -->
                  <div class="delivery-text">
                    <h3 class="delivery-title">¡Tu pedido está en camino!</h3>
                    <p class="delivery-subtitle">El repartidor ya salió del restaurante</p>
                    <div class="loading-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>

                <div class="order-success__icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <h2 class="order-success__title">¡Pedido realizado con éxito!</h2>
                <p class="order-success__text">Tu pedido #{{ createdOrderId }} ha sido recibido y está siendo procesado.</p>
                <div class="order-success__details">
                  <div class="order-success__detail">
                    <span class="order-success__label">Número de pedido:</span>
                    <span class="order-success__value">{{ createdOrderId }}</span>
                  </div>
                  <div class="order-success__detail">
                    <span class="order-success__label">{{ deliveryType === 'now' ? 'Tiempo estimado de entrega:' : 'Entrega programada:' }}</span>
                    <span class="order-success__value">{{ getDeliveryTimeText() }}</span>
                  </div>
                  <div class="order-success__detail">
                    <span class="order-success__label">Total:</span>
                    <span class="order-success__value">${{ total.toFixed(2) }}</span>
                  </div>
                </div>
                <div class="order-success__actions">
                  <router-link :to="`/orders/${createdOrderId}`" class="order-success__button">Ver detalles del pedido</router-link>
                  <router-link to="/orders" class="order-success__button order-success__button--secondary">Ver todos mis pedidos</router-link>
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
              <!-- Restaurant info -->
              <div class="order-summary__restaurant">
                <div class="restaurant-placeholder">{{ restaurantName[0] || 'R' }}</div>
                <div>
                  <h4 class="order-summary__restaurant-name">{{ restaurantName }}</h4>
                  <p class="order-summary__delivery-time">{{ estimatedDeliveryTime }} min</p>
                </div>
              </div>

              <!-- Cart item list -->
              <div class="order-summary__items">
                <div v-for="item in cartItems" :key="item.id" class="order-summary__item">
                  <div class="item-quantity">{{ item.quantity }}×</div>
                  <div class="item-name">{{ item.name }}</div>
                  <div class="item-price">${{ (item.price * item.quantity).toFixed(2) }}</div>
                </div>
              </div>

              <!-- Promo code -->
              <div class="order-summary__promocode">
                <input type="text"
                       class="promocode-input"
                       placeholder="Código promocional"
                       v-model="promoCode"
                       @keyup.enter="applyPromoCode">
                <button class="promocode-button"
                        @click="applyPromoCode"
                        :disabled="validatingPromo">
                  <span v-if="!validatingPromo">Aplicar</span>
                  <span v-else class="loading-spinner loading-spinner--small"></span>
                </button>
              </div>

              <!-- Promo discount display -->
              <div v-if="promoDiscount > 0" class="promo-success">
                <div class="promo-success__message">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Código aplicado: -${{ promoDiscount.toFixed(2) }}
                </div>
                <button @click="removePromoCode" class="remove-promo">×</button>
              </div>

              <!-- Order totals -->
              <div class="order-summary__totals">
                <div class="order-summary__row">
                  <span>Subtotal</span>
                  <span>${{ subtotal.toFixed(2) }}</span>
                </div>
                <div v-if="promoDiscount > 0" class="order-summary__row order-summary__row--discount">
                  <span>Descuento</span>
                  <span>-${{ promoDiscount.toFixed(2) }}</span>
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
            </div>
          </div>
        </div>
      </div>

      <!-- Modal para agregar dirección -->
      <div v-if="showAddAddressModal" class="modal-overlay">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Agregar Nueva Dirección</h3>
            <button @click="showAddAddressModal = false" class="modal-close">×</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>Nombre de la dirección</label>
              <input v-model="newAddress.name" type="text" placeholder="Casa, Trabajo, etc.">
            </div>
            <div class="form-group">
              <label>Calle</label>
              <input v-model="newAddress.street" type="text" placeholder="Calle Principal">
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Número</label>
                <input v-model="newAddress.number" type="text" placeholder="123">
              </div>
              <div class="form-group">
                <label>Interior</label>
                <input v-model="newAddress.interior" type="text" placeholder="Apt 4B">
              </div>
            </div>
            <div class="form-group">
              <label>Colonia</label>
              <input v-model="newAddress.neighborhood" type="text" placeholder="Centro">
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Ciudad</label>
                <input v-model="newAddress.city" type="text" placeholder="Zaragoza">
              </div>
              <div class="form-group">
                <label>Estado</label>
                <input v-model="newAddress.state" type="text" placeholder="Aragón">
              </div>
            </div>
            <div class="form-group">
              <label>Código Postal</label>
              <input v-model="newAddress.zipCode" type="text" placeholder="50001">
            </div>
            <div class="form-group">
              <label>Teléfono</label>
              <input v-model="newAddress.phone" type="tel" placeholder="612 345 678">
            </div>
            <div class="form-group">
              <label class="checkbox-label">
                <input v-model="newAddress.isDefault" type="checkbox">
                Establecer como dirección predeterminada
              </label>
            </div>
          </div>
          <div class="modal-footer">
            <button @click="showAddAddressModal = false" class="btn-secondary">Cancelar</button>
            <button @click="saveNewAddress" class="btn-primary" :disabled="savingAddress">
              <span v-if="!savingAddress">Guardar</span>
              <span v-else class="loading-spinner loading-spinner--small"></span>
            </button>
          </div>
        </div>
      </div>

      <!-- Modal para agregar método de pago -->
      <div v-if="showAddPaymentModal" class="modal-overlay">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Agregar Método de Pago</h3>
            <button @click="showAddPaymentModal = false" class="modal-close">×</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>Número de tarjeta</label>
              <input v-model="newPayment.cardNumber"
                     type="text"
                     placeholder="1234 5678 9012 3456"
                     maxlength="19"
                     @input="formatCardNumber">
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Fecha de vencimiento</label>
                <input v-model="newPayment.expiryDate" type="text" placeholder="MM/AA" maxlength="5">
              </div>
              <div class="form-group">
                <label>CVV</label>
                <input v-model="newPayment.cvv" type="text" placeholder="123" maxlength="3">
              </div>
            </div>
            <div class="form-group">
              <label>Nombre en la tarjeta</label>
              <input v-model="newPayment.cardholderName" type="text" placeholder="Juan Pérez">
            </div>
            <div class="form-group">
              <label class="checkbox-label">
                <input v-model="newPayment.isDefault" type="checkbox">
                Establecer como método predeterminado
              </label>
            </div>
          </div>
          <div class="modal-footer">
            <button @click="showAddPaymentModal = false" class="btn-secondary">Cancelar</button>
            <button @click="saveNewPayment" class="btn-primary" :disabled="savingPayment">
              <span v-if="!savingPayment">Guardar</span>
              <span v-else class="loading-spinner loading-spinner--small"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import { useOrderStore } from '@/stores/orderStore';
import { useAuthStore } from '@/stores/auth';
import userService from '@/services/userService';
import orderService from '@/services/orderService';
import type { Address } from '@/types';

const router = useRouter();
const cartStore = useCartStore();
const orderStore = useOrderStore();
const authStore = useAuthStore();

// Checkout steps
const steps = [
  { id: 'delivery', name: 'Entrega' },
  { id: 'payment', name: 'Pago' },
  { id: 'review', name: 'Revisión' },
  { id: 'confirmation', name: 'Confirmación' }
];

// State
const currentStep = ref(0);
const placingOrder = ref(false);
const createdOrderId = ref('');

// Videos de delivery aleatorios
const deliveryGifFiles = ['Bici.mp4', 'Moto.mp4', 'Scooter.mp4'];
const randomDeliveryGifUrl = ref<string | null>(null);

// Función para obtener la URL del video desde assets
const getVideoUrl = (filename: string) => {
  return new URL(`../assets/videos/${filename}`, import.meta.url).href;
};

// Modales
const showAddAddressModal = ref(false);
const showAddPaymentModal = ref(false);
const savingAddress = ref(false);
const savingPayment = ref(false);

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

const newPayment = ref({
  cardNumber: '',
  expiryDate: '',
  cvv: '',
  cardholderName: '',
  isDefault: false
});

const deliveryType = ref('now');
const scheduledDate = ref('');
const scheduledTime = ref('');
const deliveryInstructions = ref('');
const availableTimeSlots = ref<string[]>([]);

const addresses = ref<Address[]>([]);
const selectedAddress = ref<number | null>(null);
const loadingAddresses = ref(true);

const paymentMethods = ref<any[]>([]);
const selectedPaymentMethod = ref<number | null>(null);
const loadingPaymentMethods = ref(true);

const promoCode = ref('');
const promoDiscount = ref(0);
const validatingPromo = ref(false);

const restaurantId = computed(() => cartStore.restaurantId);
const restaurantName = computed(() => cartStore.restaurantName || 'Restaurante');
const cartItems = computed(() => cartStore.items);
const subtotal = computed(() => cartStore.totalAmount);
const deliveryFee = ref(0);
const taxRate = 0.16;
const tax = computed(() => (subtotal.value - promoDiscount.value) * taxRate);
const total = computed(() => subtotal.value - promoDiscount.value + deliveryFee.value + tax.value);
const estimatedDeliveryTime = ref(30);

const minDate = computed(() => {
  const today = new Date();
  return today.toISOString().split('T')[0];
});

const maxDate = computed(() => {
  const future = new Date();
  future.setDate(future.getDate() + 7);
  return future.toISOString().split('T')[0];
});

const canProceedToPayment = computed(() => {
  if (!selectedAddress.value) return false;
  if (deliveryType.value === 'scheduled') {
    return scheduledDate.value && scheduledTime.value;
  }
  return true;
});

const goToStep = (step: number) => {
  currentStep.value = step;
  window.scrollTo(0, 0);
};

const selectAddress = async (addressId: number) => {
  selectedAddress.value = addressId;
  if (restaurantId.value) {
    try {
      const fee = await orderService.getDeliveryFee(restaurantId.value, addressId);
      deliveryFee.value = fee;
    } catch (error) {
      deliveryFee.value = 3.99; // Tarifa de respaldo
    }
  }
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

const formatAddress = (address: Address | null) => {
  if (!address) return '';
  return `${address.street} ${address.number || ''}, ${address.city}, ${address.state}`;
};

const getPaymentMethodDescription = (method: any) => {
  if (!method) return '';
  if (method.type === 'card') {
    return `Termina en ${method.name.slice(-4)}`;
  }
  return method.type;
};

const formatScheduledDelivery = () => {
  if (!scheduledDate.value || !scheduledTime.value) return '';
  const date = new Date(scheduledDate.value);
  const today = new Date();
  today.setHours(0,0,0,0);

  let dateStr = '';
  if (date.toDateString() === today.toDateString()) {
    dateStr = 'Hoy';
  } else {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (date.toDateString() === tomorrow.toDateString()) {
      dateStr = 'Mañana';
    } else {
      dateStr = date.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      });
    }
  }
  return `${dateStr} a las ${scheduledTime.value}`;
};

const getDeliveryTimeText = () => {
  if (deliveryType.value === 'scheduled') {
    return formatScheduledDelivery();
  }
  return `${estimatedDeliveryTime.value}-${estimatedDeliveryTime.value + 15} minutos`;
};

const applyPromoCode = async () => {
  if (!promoCode.value.trim() || !restaurantId.value) return;
  validatingPromo.value = true;
  try {
    const result = await orderService.validatePromoCode(
      promoCode.value.trim(),
      restaurantId.value,
      subtotal.value
    );
    if (result.valid) {
      promoDiscount.value = result.discount;
    } else {
      alert(result.message || 'Código promocional inválido');
      promoCode.value = '';
    }
  } catch (error) {
    alert('Error al validar el código promocional');
  } finally {
    validatingPromo.value = false;
  }
};

const removePromoCode = () => {
  promoCode.value = '';
  promoDiscount.value = 0;
};

const placeOrder = async () => {
  if (!selectedAddress.value || !selectedPaymentMethod.value) {
    alert('Por favor completa todos los campos requeridos');
    return;
  }
  placingOrder.value = true;

  try {
    const orderRequest = {
      restaurantId: restaurantId.value!,
      deliveryAddressId: selectedAddress.value,
      items: cartItems.value.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        name: item.name,
        price: item.price
      })),
      paymentMethod: getSelectedPaymentMethod()?.type || 'card',
      deliveryInstructions: deliveryInstructions.value || undefined,
      promoCode: promoCode.value || undefined,
      scheduledDeliveryTime: deliveryType.value === 'scheduled'
        ? `${scheduledDate.value}T${scheduledTime.value}:00`
        : undefined
    };

    const order = await orderStore.createOrder(orderRequest);
    createdOrderId.value = order.id.toString();

    cartStore.clearCart();

    // Seleccionar video aleatorio
    const randomIndex = Math.floor(Math.random() * deliveryGifFiles.length);
    const selectedVideo = deliveryGifFiles[randomIndex];
    randomDeliveryGifUrl.value = getVideoUrl(selectedVideo);

    goToStep(3);

  } catch (error: any) {
    alert(error.message || 'Error al procesar el pedido');
  } finally {
    placingOrder.value = false;
  }
};

const loadAddresses = async () => {
  try {
    loadingAddresses.value = true;
    addresses.value = await userService.getUserAddresses();
    const defaultAddress = addresses.value.find(addr => addr.isDefault);
    if (defaultAddress) {
      await selectAddress(defaultAddress.id);
    } else if (addresses.value.length > 0) {
      await selectAddress(addresses.value[0].id);
    }
    if (deliveryType.value === 'scheduled' && scheduledDate.value && selectedAddress.value) {
      await loadAvailableTimeSlots();
    }
  } catch (error) {
    console.error('Error loading addresses:', error);
  } finally {
    loadingAddresses.value = false;
  }
};

const loadPaymentMethods = async () => {
  loadingPaymentMethods.value = false;
  paymentMethods.value = [
    { id: 1, type: 'card', name: 'Tarjeta **** 1234', isDefault: true }
  ];
  const defaultPayment = paymentMethods.value.find(pm => pm.isDefault);
  if (defaultPayment) {
    selectedPaymentMethod.value = defaultPayment.id;
  } else if (paymentMethods.value.length > 0) {
     selectedPaymentMethod.value = paymentMethods.value[0].id;
  }
};

const loadAvailableTimeSlots = async () => {
  if (!restaurantId.value || !selectedAddress.value) return;
  try {
    const times = await orderService.getAvailableDeliveryTimes(restaurantId.value, selectedAddress.value);
    availableTimeSlots.value = times;
  } catch (error) {
    const slots = [];
    const now = new Date();
    const currentHour = now.getHours();
    for (let hour = Math.max(11, currentHour + 1); hour <= 22; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    availableTimeSlots.value = slots;
  }
};

const saveNewAddress = async () => {
  if (!newAddress.value.name || !newAddress.value.street || !newAddress.value.city) {
    alert('Por favor completa los campos obligatorios');
    return;
  }
  savingAddress.value = true;
  try {
    const addressData = { ...newAddress.value };
    const savedAddress = await userService.addAddress(addressData);
    addresses.value.push(savedAddress);
    if (newAddress.value.isDefault || addresses.value.length === 1) {
      await selectAddress(savedAddress.id);
    }
    newAddress.value = { name: '', street: '', number: '', interior: '', neighborhood: '', city: '', state: '', zipCode: '', phone: '', isDefault: false };
    showAddAddressModal.value = false;
    alert('Dirección agregada exitosamente');
  } catch (error) {
    console.error('Error saving address:', error);
    alert('Error al guardar la dirección');
  } finally {
    savingAddress.value = false;
  }
};

const saveNewPayment = async () => {
  if (!newPayment.value.cardNumber || !newPayment.value.expiryDate || !newPayment.value.cvv || !newPayment.value.cardholderName) {
    alert('Por favor completa todos los campos');
    return;
  }
  savingPayment.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newId = paymentMethods.value.length > 0 ? Math.max(...paymentMethods.value.map(pm => pm.id)) + 1 : 1;
    const newMethodData = {
      id: newId,
      type: 'card',
      name: `Tarjeta **** ${newPayment.value.cardNumber.slice(-4)}`,
      isDefault: newPayment.value.isDefault
    };
    paymentMethods.value.push(newMethodData);
    if (newPayment.value.isDefault || paymentMethods.value.length === 1) {
      selectPaymentMethod(newId);
    }
    newPayment.value = { cardNumber: '', expiryDate: '', cvv: '', cardholderName: '', isDefault: false };
    showAddPaymentModal.value = false;
    alert('Método de pago agregado exitosamente');
  } catch (error) {
    console.error('Error saving payment method:', error);
    alert('Error al guardar el método de pago');
  } finally {
    savingPayment.value = false;
  }
};

const formatCardNumber = (event: Event) => {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
  const formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
  if (formattedValue !== input.value) {
    newPayment.value.cardNumber = formattedValue;
  }
};

watch([deliveryType, scheduledDate, selectedAddress], () => {
  if (deliveryType.value === 'scheduled' && scheduledDate.value && selectedAddress.value) {
    loadAvailableTimeSlots();
  }
});

onMounted(async () => {
  if (cartStore.isEmpty) {
    router.push('/cart');
    return;
  }
  if (!authStore.isAuthenticated()) {
    router.push('/login?redirect=/checkout');
    return;
  }
  await Promise.all([
    loadAddresses(),
    loadPaymentMethods()
  ]);
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

.checkout-content {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 24px;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
}

// Contenedor de animación de delivery con videos
.delivery-animation-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background: linear-gradient(65deg, #e8fafd, #d7f8d1);
  border-radius: 20px;
  margin: 2rem 0;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.delivery-video {
  width: 300px;
  height: 200px;
  object-fit: cover;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  margin-bottom: 1.5rem;
  background: #f0f0f0;

  @media (max-width: 768px) {
    width: 250px;
    height: 167px;
  }

  @media (max-width: 480px) {
    width: 200px;
    height: 133px;
  }
}

.delivery-text {
  text-align: center;

  .delivery-title {
    font-size: 22px;
    font-weight: 700;
    color: #1a365d;
    margin: 0 0 8px;
    animation: titleGlow 3s ease-in-out infinite;
  }

  .delivery-subtitle {
    font-size: 15px;
    color: #4a5568;
    margin: 0 0 20px;
    font-weight: 500;
  }
}

@keyframes titleGlow {
  0%, 100% { color: #1a365d; transform: scale(1); }
  50% { color: #2c5aa0; transform: scale(1.02); }
}

.loading-dots {
  display: flex;
  gap: 6px;
  justify-content: center;

  span {
    width: 8px;
    height: 8px;
    background: linear-gradient(135deg, #3182ce, #2c5aa0);
    border-radius: 50%;
    animation: dotBounce 1.6s ease-in-out infinite;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);

    &:nth-child(1) { animation-delay: 0s; }
    &:nth-child(2) { animation-delay: 0.3s; }
    &:nth-child(3) { animation-delay: 0.6s; }
  }
}

@keyframes dotBounce {
  0%, 80%, 100% {
    transform: scale(0.8) translateY(0px);
    opacity: 0.7;
  }
  40% {
    transform: scale(1.2) translateY(-10px);
    opacity: 1;
  }
}

// Estados vacíos mejorados
.empty-state {
  text-align: center;
  padding: 2rem;
  color: $text-secondary;

  svg {
    margin-bottom: 1rem;
  }

  p {
    margin: 0.5rem 0;

    &.empty-state__subtitle {
      font-size: 0.9rem;
      color: lighten($text-secondary, 10%);
    }
  }
}

// Botones para agregar elementos
.add-item-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba($primary-color, 0.1);
  border: 2px dashed $primary-color;
  color: $primary-color;
  font-weight: 500;
  cursor: pointer;
  padding: 1rem;
  text-align: center;
  border-radius: 8px;
  transition: all 0.3s ease;
  text-decoration: none;
  font-size: 14px;
  margin-top: 12px;

  &:hover {
    background: rgba($primary-color, 0.15);
    border-color: darken($primary-color, 10%);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(6, 193, 103, 0.2);
  }
}

// Modales
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;

  h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
    color: $text-primary;
  }
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: $text-secondary;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: $transition;

  &:hover {
    background: rgba($text-secondary, 0.1);
    color: $text-primary;
  }
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
  border-radius: 0 0 16px 16px;
}

// Formularios en modales
.form-group {
  margin-bottom: 1.25rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: $text-primary;
    font-size: 0.9rem;
  }

  input, select, textarea {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-size: 1rem;
    transition: $transition;

    &:focus {
      outline: none;
      border-color: $primary-color;
      box-shadow: 0 0 0 3px rgba(6, 193, 103, 0.1);
    }

    &::placeholder {
      color: #9ca3af;
    }
  }
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
}

.checkbox-label {
  display: flex !important;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500 !important;
  cursor: pointer;

  input[type="checkbox"] {
    width: auto !important;
    margin: 0;
    transform: scale(1.2);
    accent-color: $primary-color;
  }
}

// Botones de modales
.btn-primary {
  background: $primary-color;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: $transition;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 100px;

  &:hover:not(:disabled) {
    background: darken($primary-color, 5%);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(6, 193, 103, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
}

.btn-secondary {
  background: #f1f5f9;
  color: $text-primary;
  border: 1px solid #e2e8f0;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: $transition;

  &:hover {
    background: #e2e8f0;
    border-color: #cbd5e1;
  }
}

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

.delivery-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.delivery-option {
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: $primary-color;
  }

  &--active {
    border-color: $primary-color;
    background-color: rgba(6, 193, 103, 0.05);
  }

  input[type="radio"] {
    display: none;
  }

  label {
    cursor: pointer;
    margin: 0;
  }

  &__main {
    h4 {
      margin: 0 0 0.25rem;
      font-weight: 600;
      color: #1e293b;
    }

    p {
      margin: 0;
      color: #64748b;
      font-size: 0.9rem;
    }
  }
}

.scheduled-delivery {
  background: #f8fafc;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;

  h4 {
    margin: 0 0 1rem;
    color: #1e293b;
    font-weight: 600;
  }

  &__inputs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;

    @media (max-width: 576px) {
      grid-template-columns: 1fr;
    }
  }

  .input-group {
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #1e293b;
      font-size: 0.9rem;
    }

    input,
    select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 1rem;

      &:focus {
        outline: none;
        border-color: $primary-color;
        box-shadow: 0 0 0 3px rgba(6, 193, 103, 0.1);
      }
    }

    .time-selector {
      background-color: white;
      cursor: pointer;

      option {
        padding: 8px;
      }
    }
  }
}

.address-section,
.payment-methods {
  margin-bottom: 2rem;

  h4 {
    margin: 0 0 1rem;
    color: #1e293b;
    font-weight: 600;
    font-size: 1.1rem;
  }
}

.loading-addresses,
.loading-payment {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 2rem;
  justify-content: center;
  color: #64748b;

  .loading-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid #e2e8f0;
    border-top-color: $primary-color;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
}

.address-list,
.payment-method-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.address-item,
.payment-method {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: $primary-color;
  }

  &--selected {
    border-color: $primary-color;
    background-color: rgba(6, 193, 103, 0.05);
  }

  .address-content,
  .payment-method__details {
    flex: 1;

    h5 {
      margin: 0 0 0.25rem;
      font-weight: 600;
      color: #1e293b;
    }

    p {
      margin: 0;
      color: #64748b;
      font-size: 0.9rem;
    }
  }

  .default-badge {
    display: inline-block;
    background: rgba(6, 193, 103, 0.1);
    color: $primary-color;
    padding: 0.125rem 0.5rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    margin-top: 0.25rem;
  }

  .radio-indicator input {
    margin: 0;
  }
}

.payment-method__icon {
  margin-right: 1rem;
  color: #64748b;
}

.delivery-instructions {
  margin-bottom: 2rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #1e293b;
  }

  textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 1rem;
    font-family: inherit;
    resize: vertical;

    &:focus {
      outline: none;
      border-color: $primary-color;
      box-shadow: 0 0 0 3px rgba(6, 193, 103, 0.1);
    }
  }
}

// Buttons
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

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: $white;
  animation: spin 1s linear infinite;
}

.loading-spinner--small {
  width: 16px;
  height: 16px;
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

// Order sidebar
.order-sidebar {
  position: sticky;
  top: 24px;

  @media (max-width: 992px) {
    position: static;
  }
}

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

    .restaurant-placeholder {
      width: 40px;
      height: 40px;
      background: $primary-color;
      color: white;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
    }
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

  &__promocode {
    display: flex;
    margin-bottom: 16px;
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

    &--discount {
      color: #10b981;
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
}

.free-delivery {
  color: $success-color;
  font-weight: 600;
}

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

  &:hover:not(:disabled) {
    background-color: darken($primary-color, 5%);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

.promo-success {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 8px;
  padding: 0.75rem;
  margin-bottom: 1rem;

  &__message {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #10b981;
    font-weight: 500;
    font-size: 0.9rem;
  }

  .remove-promo {
    background: none;
    border: none;
    color: #10b981;
    font-size: 1.25rem;
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;

    &:hover {
      background-color: rgba(16, 185, 129, 0.1);
    }
  }
}

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

.order-review {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.review-section {
  background: #f8fafc;
  border-radius: 8px;
  padding: 1.5rem;

  h4 {
    margin: 0 0 1rem;
    color: #1e293b;
    font-weight: 600;
  }

  .review-item {
    margin-bottom: 0.5rem;

    &:last-child {
      margin-bottom: 0;
    }

    strong {
      color: #1e293b;
      margin-right: 0.5rem;
    }
  }
}

.review-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.review-product {
  display: flex;
  align-items: center;
  gap: 0.75rem;

  .quantity {
    font-weight: 600;
    color: #1e293b;
    min-width: 30px;
  }

  .name {
    flex: 1;
    color: #1e293b;
  }

  .price {
    font-weight: 500;
    color: #1e293b;
  }
}
</style>
