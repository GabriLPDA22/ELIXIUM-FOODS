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

      <!-- Progress indicator -->
      <div class="progress-indicator">
        <div class="progress-indicator__track">
          <div class="progress-indicator__fill" :style="{ width: `${(step / 4) * 100}%` }"></div>
        </div>
        <div class="progress-steps">
          <div
            v-for="(stepInfo, index) in progressSteps"
            :key="index"
            class="progress-step"
            :class="{
              'progress-step--active': step === index + 1,
              'progress-step--completed': step > index + 1
            }"
          >
            <div class="progress-step__circle">
              <svg
                v-if="step > index + 1"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span v-else>{{ index + 1 }}</span>
            </div>
            <span class="progress-step__label">{{ stepInfo.label }}</span>
          </div>
        </div>
      </div>

      <!-- Main checkout content -->
      <div class="checkout-content">
        <div class="checkout-main">
          <!-- ===== PASO 1: ENTREGA ===== -->
          <section v-if="step === 1" class="checkout-step">
            <div class="step-header">
              <div class="step-header__icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M9 17H7A5 5 0 0 1 7 7h2"></path>
                  <path d="M15 7h2a5 5 0 1 1 0 10h-2"></path>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
              </div>
              <div class="step-header__content">
                <h2 class="step-header__title">Opciones de entrega</h2>
                <p class="step-header__subtitle">Selecciona dónde y cuándo quieres recibir tu pedido</p>
              </div>
            </div>

            <!-- Delivery Address -->
            <div class="form-section">
              <h3 class="form-section__title">Dirección de entrega</h3>
              <div class="address-selector" v-if="userAddresses.length > 0">
                <div
                  v-for="addr in userAddresses"
                  :key="addr.id"
                  class="address-option"
                  :class="{ 'address-option--selected': selectedAddress === addr.id }"
                  @click="selectedAddress = addr.id"
                >
                  <div class="address-option__radio">
                    <div class="radio-circle" :class="{ 'radio-circle--checked': selectedAddress === addr.id }"></div>
                  </div>
                  <div class="address-option__content">
                    <div class="address-option__name">{{ addr.name || 'Mi dirección' }}</div>
                    <div class="address-option__details">{{ addr.street }}, {{ addr.city }}</div>
                  </div>
                </div>
              </div>
              <div v-else class="empty-state">
                <div class="empty-state__icon">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <p class="empty-state__text">No tienes direcciones guardadas</p>
              </div>
            </div>

            <!-- Delivery Type -->
            <div class="form-section">
              <h3 class="form-section__title">Tipo de entrega</h3>
              <div class="delivery-options">
                <div
                  class="delivery-option"
                  :class="{ 'delivery-option--selected': deliveryType === 'now' }"
                  @click="deliveryType = 'now'"
                >
                  <div class="delivery-option__radio">
                    <div class="radio-circle" :class="{ 'radio-circle--checked': deliveryType === 'now' }"></div>
                  </div>
                  <div class="delivery-option__content">
                    <div class="delivery-option__title">Entregar ahora</div>
                    <div class="delivery-option__subtitle">Lo antes posible</div>
                  </div>
                  <div class="delivery-option__icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                </div>

                <div
                  class="delivery-option"
                  :class="{ 'delivery-option--selected': deliveryType === 'scheduled' }"
                  @click="deliveryType = 'scheduled'"
                >
                  <div class="delivery-option__radio">
                    <div class="radio-circle" :class="{ 'radio-circle--checked': deliveryType === 'scheduled' }"></div>
                  </div>
                  <div class="delivery-option__content">
                    <div class="delivery-option__title">Programar para más tarde</div>
                    <div class="delivery-option__subtitle">Elige día y hora</div>
                  </div>
                  <div class="delivery-option__icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Scheduled Delivery -->
            <div v-if="deliveryType === 'scheduled'" class="form-section scheduled-section">
              <h3 class="form-section__title">Programar entrega</h3>
              <div class="scheduled-inputs">
                <div class="input-group">
                  <label for="scheduledDate" class="input-label">Fecha</label>
                  <input
                    id="scheduledDate"
                    type="date"
                    v-model="scheduledDate"
                    :min="minDate"
                    :max="maxDate"
                    class="form-input"
                  />
                </div>
                <div class="input-group">
                  <label for="scheduledTime" class="input-label">Hora</label>
                  <select id="scheduledTime" v-model="scheduledTime" class="form-select">
                    <option value="">Seleccionar hora</option>
                    <option v-for="t in availableTimeSlots" :key="t" :value="t">{{ t }}</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Delivery Instructions -->
            <div class="form-section">
              <h3 class="form-section__title">Instrucciones de entrega (opcional)</h3>
              <textarea
                v-model="deliveryInstructions"
                class="form-textarea"
                placeholder="Ej. Timbre no funciona, llamar por teléfono..."
                rows="3"
              ></textarea>
            </div>

            <div class="step-actions">
              <button
                class="btn-primary btn-primary--large"
                :disabled="!canProceedToPayment"
                @click="step = 2"
              >
                <span>Continuar al pago</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
          </section>

          <!-- ===== PASO 2: PAGO ===== -->
          <section v-if="step === 2" class="checkout-step">
            <div class="step-header">
              <div class="step-header__icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                  <line x1="1" y1="10" x2="23" y2="10"></line>
                </svg>
              </div>
              <div class="step-header__content">
                <h2 class="step-header__title">Método de pago</h2>
                <p class="step-header__subtitle">Selecciona cómo quieres pagar tu pedido</p>
              </div>
            </div>

            <!-- Existing Payment Methods -->
            <div v-if="paymentMethods.length" class="form-section">
              <h3 class="form-section__title">Métodos de pago guardados</h3>
              <div class="payment-methods">
                <div
                  v-for="pm in paymentMethods"
                  :key="pm.id"
                  class="payment-method"
                  :class="{ 'payment-method--selected': selectedPaymentMethod === pm.id }"
                  @click="selectedPaymentMethod = pm.id"
                >
                  <div class="payment-method__radio">
                    <div
                      class="radio-circle"
                      :class="{ 'radio-circle--checked': selectedPaymentMethod === pm.id }"
                    ></div>
                  </div>
                  <div class="payment-method__icon">
                    <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
                      <rect width="32" height="20" rx="4" fill="#E2E8F0" />
                      <text
                        x="16"
                        y="14"
                        text-anchor="middle"
                        fill="#64748B"
                        font-size="6"
                        font-weight="bold"
                      >
                        CARD
                      </text>
                    </svg>
                  </div>
                  <div class="payment-method__details">
                    <div class="payment-method__name">{{ displayPaymentMethod(pm) }}</div>
                    <div v-if="pm.isDefault" class="payment-method__badge">Predeterminado</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- New Payment Method Form -->
            <div v-else class="form-section">
              <h3 class="form-section__title">Agregar método de pago</h3>
              <div class="new-payment-form">
                <div class="input-group">
                  <label for="nickname" class="input-label">Nombre del método *</label>
                  <input
                    id="nickname"
                    v-model="newPayment.nickname"
                    type="text"
                    class="form-input"
                    placeholder="Ej: Mi Tarjeta Visa"
                  />
                </div>

                <div class="input-group">
                  <label for="type" class="input-label">Tipo de pago *</label>
                  <select id="type" v-model="newPayment.type" class="form-select">
                    <option value="">Seleccionar tipo</option>
                    <option value="paypal">PayPal</option>
                    <option value="visa">Visa</option>
                    <option value="mastercard">Mastercard</option>
                    <option value="other">Otra tarjeta</option>
                  </select>
                </div>

                <!-- PayPal Fields -->
                <div v-if="newPayment.type.toLowerCase() === 'paypal'" class="input-group">
                  <label for="payPalEmail" class="input-label">Correo PayPal *</label>
                  <input
                    id="payPalEmail"
                    v-model="newPayment.payPalEmail"
                    type="email"
                    class="form-input"
                    placeholder="usuario@ejemplo.com"
                  />
                </div>

                <!-- Card Fields -->
                <div v-if="['visa', 'mastercard', 'other'].includes(newPayment.type.toLowerCase())">
                  <div class="input-group">
                    <label for="cardNumber" class="input-label">Número de tarjeta *</label>
                    <input
                      id="cardNumber"
                      v-model="newPayment.cardNumber"
                      type="text"
                      class="form-input"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                  <div class="input-row">
                    <div class="input-group">
                      <label for="expiryDate" class="input-label">Vencimiento *</label>
                      <input
                        id="expiryDate"
                        v-model="newPayment.expiryDate"
                        type="text"
                        class="form-input"
                        placeholder="MM/AA"
                      />
                    </div>
                    <div class="input-group">
                      <label for="cvv" class="input-label">CVV *</label>
                      <input
                        id="cvv"
                        v-model="newPayment.cvv"
                        type="text"
                        class="form-input"
                        placeholder="123"
                      />
                    </div>
                  </div>
                  <div class="input-group">
                    <label for="cardholderName" class="input-label">Nombre del titular *</label>
                    <input
                      id="cardholderName"
                      v-model="newPayment.cardholderName"
                      type="text"
                      class="form-input"
                      placeholder="Juan Pérez"
                    />
                  </div>
                </div>

                <div class="checkbox-group">
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="newPayment.isDefault" />
                    <span class="checkbox-custom"></span>
                    Establecer como método predeterminado
                  </label>
                </div>
              </div>
            </div>

            <div class="step-actions">
              <button class="btn-secondary" @click="step = 1">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                <span>Volver</span>
              </button>

              <button
                v-if="paymentMethods.length"
                class="btn-primary btn-primary--large"
                :disabled="!selectedPaymentMethod"
                @click="step = 3"
              >
                <span>Revisar pedido</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>

              <button
                v-else
                class="btn-primary btn-primary--large"
                :disabled="!canSavePayment"
                @click="saveNewPaymentMethod"
              >
                <span>Guardar y continuar</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
          </section>

          <!-- ===== PASO 3: REVISIÓN ===== -->
          <section v-if="step === 3" class="checkout-step">
            <div class="step-header">
              <div class="step-header__icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <div class="step-header__content">
                <h2 class="step-header__title">Revisar pedido</h2>
                <p class="step-header__subtitle">
                  Verifica que todo esté correcto antes de confirmar
                </p>
              </div>
            </div>

            <!-- Order Review -->
            <div class="review-section">
              <h3 class="review-section__title">Productos del pedido</h3>
              <div class="review-products">
                <div
                  v-for="item in processedCartItems"
                  :key="item.id"
                  class="review-product"
                >
                  <div class="review-product__quantity">{{ item.quantity }}×</div>
                  <div class="review-product__details">
                    <div class="review-product__name">{{ item.name }}</div>
                    <div
                      v-if="item.appliedOffer"
                      class="review-product__price-with-offer"
                    >
                      <span class="review-product__original-price">
                        ${{ item.originalPrice.toFixed(2) }}
                      </span>
                      <span class="review-product__discounted-price">
                        ${{ item.finalPrice.toFixed(2) }}
                      </span>
                    </div>
                    <div v-else class="review-product__price">
                      ${{ item.finalPrice.toFixed(2) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Delivery Details -->
            <div class="review-section">
              <h3 class="review-section__title">Detalles de entrega</h3>
              <div class="review-details">
                <div class="review-detail">
                  <span class="review-detail__label">Tipo:</span>
                  <span class="review-detail__value">
                    {{ deliveryType === 'now' ? 'Entregar ahora' : 'Programado' }}
                  </span>
                </div>
                <div v-if="deliveryType === 'scheduled'" class="review-detail">
                  <span class="review-detail__label">Fecha y hora:</span>
                  <span class="review-detail__value">
                    {{ scheduledDate }} a las {{ scheduledTime }}
                  </span>
                </div>
                <div v-if="deliveryInstructions" class="review-detail">
                  <span class="review-detail__label">Instrucciones:</span>
                  <span class="review-detail__value">{{ deliveryInstructions }}</span>
                </div>
              </div>
            </div>

            <div class="step-actions">
              <button class="btn-secondary" @click="step = 2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                <span>Volver</span>
              </button>
              <button
                class="btn-primary btn-primary--large btn-primary--confirm"
                :disabled="placingOrder"
                @click="placeOrder"
              >
                <span v-if="!placingOrder">Confirmar y pagar</span>
                <span v-else class="loading-spinner loading-spinner--small"></span>
              </button>
            </div>
          </section>

          <!-- ===== PASO 4: CONFIRMACIÓN ===== -->
          <section v-if="step === 4" class="checkout-step checkout-step--success">
            <div class="success-content">
              <div class="success-icon">
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h2 class="success-title">¡Pedido confirmado!</h2>
              <p class="success-subtitle">Tu pedido ha sido procesado exitosamente</p>

              <div class="order-summary-final">
                <div v-if="finalOrderTotals.totalSavings > 0" class="order-summary-final__row order-summary-final__row--savings">
                  <span>Ahorros por ofertas:</span>
                  <span>-${{ finalOrderTotals.totalSavings.toFixed(2) }}</span>
                </div>
                <div class="order-summary-final__row order-summary-final__row--total">
                  <span>Total pagado:</span>
                  <span>${{ finalOrderTotals.total.toFixed(2) }}</span>
                </div>
                <div class="order-summary-final__row">
                  <span>Tiempo de entrega:</span>
                  <span>{{ getDeliveryTimeText() }}</span>
                </div>
              </div>

              <div class="success-actions">
                <button class="btn-secondary" @click="router.push('/')">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                  <span>Volver al inicio</span>
                </button>
                <button class="btn-primary" @click="router.push('/orders')">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 1 2 2h8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"></path>
                    <polyline points="14 2 14 8 11 6 8 8 8 2"></polyline>
                  </svg>
                  <span>Ver mis pedidos</span>
                </button>
              </div>
            </div>
          </section>
        </div>

        <!-- Order Summary Sidebar -->
        <div v-if="step < 4" class="order-sidebar">
          <div class="order-summary">
            <div class="order-summary__header">
              <h3 class="order-summary__title">Resumen del pedido</h3>
            </div>
            <div class="order-summary__content">
              <div class="order-summary__row">
                <span>Subtotal (sin descuentos)</span>
                <span>${{ cartTotals.originalSubtotal.toFixed(2) }}</span>
              </div>
              <div v-if="cartTotals.totalOfferSavings > 0" class="order-summary__row order-summary__row--savings">
                <span>Ahorros por ofertas</span>
                <span>-${{ cartTotals.totalOfferSavings.toFixed(2) }}</span>
              </div>
              <div class="order-summary__row">
                <span>Costo de envío</span>
                <span v-if="deliveryFee > 0">${{ deliveryFee.toFixed(2) }}</span>
                <span v-else class="free-delivery">Gratis</span>
              </div>
              <div class="order-summary__row order-summary__row--total">
                <span>Total</span>
                <span>${{ finalTotal.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import { useOrderStore } from '@/stores/orderStore';
import { useAuthStore } from '@/stores/auth';

import { restaurantService } from '@/services/restaurantService';
import paymentService, { PaymentMethodInfo, CreatePaymentMethodRequest } from '@/services/paymentService';
import userService from '@/services/userService';

import type { Address } from '@/types';

// ——— Instanciar stores y router ———
const router = useRouter();
const cartStore = useCartStore();
const orderStore = useOrderStore();
const authStore = useAuthStore();

// ——— Paso actual del checkout (1..4) ———
const step = ref<1 | 2 | 3 | 4>(1);

// ——— Progress steps data ———
const progressSteps = ref([
  { label: 'Entrega' },
  { label: 'Pago' },
  { label: 'Revisión' },
  { label: 'Confirmación' }
]);

// ——— 1) Estados para direcciones y usuario ———
const userAddresses = ref<Address[]>([]);
const loadingAddresses = ref(false);
const selectedAddress = ref<number | null>(null);

// ——— 2) Estados para métodos de pago ———
const paymentMethods = ref<PaymentMethodInfo[]>([]);
const loadingPayments = ref(false);
const selectedPaymentMethod = ref<number | null>(null);

// Datos para "Agregar nuevo método de pago"
const newPayment = ref<CreatePaymentMethodRequest>({
  nickname: '',
  type: '',
  cardNumber: undefined,
  expiryDate: undefined,
  cvv: undefined,
  cardholderName: undefined,
  payPalEmail: undefined,
  isDefault: false
});

// ——— 3) Datos del restaurante (para deliveryFee) ———
const restaurantData = ref<{ id: number; name: string; deliveryFee: number } | null>(null);
const loadingRestaurantData = ref(false);

// ——— 4) Fechas/hora para programar entrega ———
const deliveryType = ref<'now' | 'scheduled'>('now');
const scheduledDate = ref<string>('');
const scheduledTime = ref<string>('');
const availableTimeSlots = ref<string[]>([]);
const deliveryInstructions = ref<string>('');

// ——— 5) Estado al "colocar pedido" ———
const placingOrder = ref<boolean>(false);

// ——— 6) Costo de envío que viene del restaurante ———
const deliveryFee = ref<number>(0);

// ——— 7) Variables temporales para mostrar en la confirmación ———
const tempOrderTotals = ref<{
  originalSubtotal: number;
  subtotalWithOffers: number;
  totalOfferSavings: number;
  total: number;
} | null>(null);

// ——— 8) Getters dependientes del carrito ———
const restaurantId = computed(() => cartStore.restaurantId);
const restaurantName = computed(() => cartStore.restaurantName || 'Restaurante');
const cartItems = computed(() =>
  cartStore.items as Array<{
    id: number;
    name: string;
    originalPrice?: number;
    price?: number;
    quantity: number;
    appliedOffer?: unknown;
    restaurantId: number;
  }>
);

// ——— 9) Procesar cada ítem del carrito con precios robustos ———
interface ProcessedCartItem {
  id: number;
  productId: number;
  name: string;
  originalPrice: number;
  finalPrice: number;
  quantity: number;
  appliedOffer?: unknown;
}

// Helper: obtener precio robusto del producto
const getProductPrice = (product: any): number => {
  const priceFields = ['price', 'unitPrice', 'basePrice', 'salePrice', 'cost', 'originalPrice'];
  for (let field of priceFields) {
    if (
      product[field] !== null &&
      product[field] !== undefined &&
      product[field] !== ''
    ) {
      const testPrice =
        typeof product[field] === 'number'
          ? product[field]
          : parseFloat(product[field]);
      if (!isNaN(testPrice) && testPrice > 0) {
        return testPrice;
      }
    }
  }
  return 9.99; // Precio por defecto si no se encuentra ninguno válido
};

const processedCartItems = computed<ProcessedCartItem[]>(() => {
  if (!cartItems.value.length) return [];
  return cartItems.value.map(item => {
    const originalPrice = item.originalPrice && item.originalPrice > 0 
      ? item.originalPrice 
      : getProductPrice(item);
    const finalPrice = item.price && item.price > 0 
      ? item.price 
      : originalPrice;
      
    return {
      id:            item.id,
      productId:     item.id,
      name:          item.name || 'Producto',
      originalPrice,
      finalPrice,
      quantity:      item.quantity || 1,
      appliedOffer:  item.appliedOffer
    };
  });
});

// ——— 10) Cálculo de totales ===== 
const cartTotals = computed(() => {
  const originalSubtotal = processedCartItems.value.reduce((sum, item) => {
    return sum + item.originalPrice * item.quantity;
  }, 0);

  const subtotalWithOffers = processedCartItems.value.reduce((sum, item) => {
    return sum + item.finalPrice * item.quantity;
  }, 0);

  // 🔄 Redondear ahorros hacia ARRIBA para beneficiar al cliente
  const rawSavings = originalSubtotal - subtotalWithOffers;
  const totalOfferSavings = rawSavings > 0 ? Math.ceil(rawSavings * 100) / 100 : 0;

  return {
    originalSubtotal,
    subtotalWithOffers,
    totalOfferSavings
  };
});

// ——— 11) Total final incluyendo envío ===== 
const finalTotal = computed(() => {
  return cartTotals.value.subtotalWithOffers + deliveryFee.value;
});

// ——— 12) Totales finales simplificados para mostrar en paso 4 =====
const finalOrderTotals = computed(() => {
  // Si tenemos totales temporales (después de limpiar carrito), usar esos
  if (tempOrderTotals.value) {
    return {
      total: tempOrderTotals.value.total,
      totalSavings: tempOrderTotals.value.totalOfferSavings
    };
  }
  // Si no, usar los valores actuales del carrito
  return {
    total: finalTotal.value,
    totalSavings: cartTotals.value.totalOfferSavings
  };
});

// ——— 13) Fechas mínimas/máximas para programar entrega =====
const minDate = computed(() => {
  const today = new Date();
  return today.toISOString().split('T')[0];
});
const maxDate = computed(() => {
  const future = new Date();
  future.setDate(future.getDate() + 7);
  return future.toISOString().split('T')[0];
});

// ——— 14) Validaciones reactivas para habilitar botones =====
const canProceedToPayment = computed(() => {
  if (!selectedAddress.value) return false;
  if (deliveryType.value === 'scheduled') {
    return !!(scheduledDate.value && scheduledTime.value);
  }
  return true;
});
const canSavePayment = computed(() => {
  if (!newPayment.value.nickname?.trim()) return false;
  if (!newPayment.value.type) return false;
  const tipo = newPayment.value.type.toLowerCase();
  if (tipo === 'paypal') {
    return !!newPayment.value.payPalEmail?.includes('@');
  }
  if (['visa', 'mastercard', 'other'].includes(tipo)) {
    return (
      !!newPayment.value.cardNumber &&
      !!newPayment.value.expiryDate &&
      !!newPayment.value.cvv &&
      !!newPayment.value.cardholderName
    );
  }
  return true;
});

// ——— 15) onMounted: cargar carrito, direcciones, métodos de pago y restaurante =====
onMounted(async () => {
  // 15.a) Asegurarnos de que el carrito esté cargado ANTES de calcular totales
  if (typeof cartStore.loadFromLocalStorage === 'function') {
    await cartStore.loadFromLocalStorage();
  }

  // 15.b) Chequear autenticación
  if (!authStore.isAuthenticated) {
    alert('Por favor, inicia sesión para continuar.');
    router.push('/login?redirect=/checkout');
    return;
  }

  // 15.c) Cargar direcciones, métodos de pago y datos del restaurante en paralelo
  await Promise.all([
    loadAddresses(),
    loadPaymentMethods(),
    fetchRestaurantData()
  ]);
});

// ——— 16) Cargar direcciones del usuario =====
async function loadAddresses() {
  try {
    loadingAddresses.value = true;
    const res = await userService.getUserAddresses();
    userAddresses.value = res || [];
    if (userAddresses.value.length > 0) {
      selectedAddress.value = userAddresses.value[0].id;
    }
  } catch (err: any) {
    console.error('Error cargando direcciones:', err);
    userAddresses.value = [];
  } finally {
    loadingAddresses.value = false;
  }
}

// ——— 17) Cargar métodos de pago =====
async function loadPaymentMethods() {
  try {
    loadingPayments.value = true;
    const res = await paymentService.getUserPaymentMethods();
    paymentMethods.value = res || [];
    if (paymentMethods.value.length > 0) {
      selectedPaymentMethod.value = paymentMethods.value[0].id;
    }
  } catch (err: any) {
    console.error('Error cargando métodos de pago:', err);
    paymentMethods.value = [];
  } finally {
    loadingPayments.value = false;
  }
}

// ——— 18) Cargar datos del restaurante (para deliveryFee) =====
async function fetchRestaurantData() {
  // Si restaurantId es null o 0, no llamamos a la API
  if (!restaurantId.value) {
    deliveryFee.value = 0;
    restaurantData.value = null;
    return;
  }

  try {
    loadingRestaurantData.value = true;
    const res = await restaurantService.getRestaurantById(restaurantId.value);
    restaurantData.value = {
      id:          res.id,
      name:        res.name,
      deliveryFee: res.deliveryFee
    };
    deliveryFee.value = res.deliveryFee;
  } catch (err: any) {
    console.error('Error cargando datos de restaurante:', err);
    deliveryFee.value = 0;
    restaurantData.value = null;
  } finally {
    loadingRestaurantData.value = false;
  }
}

// ——— 19) Si el usuario programó entrega y cambia la fecha, traer slots =====
watch(scheduledDate, async newDate => {
  if (newDate && restaurantId.value && selectedAddress.value) {
    try {
      const times = await orderStore.getAvailableDeliveryTimes(
        restaurantId.value,
        selectedAddress.value,
        newDate
      );
      availableTimeSlots.value = times;
    } catch (err: any) {
      console.error('Error obteniendo slots de tiempo:', err);
      availableTimeSlots.value = [];
    }
  }
});

// ——— 20) Guardar un nuevo método de pago =====
const saveNewPaymentMethod = async () => {
  try {
    const created = await paymentService.addPaymentMethod(newPayment.value);
    // Recargar lista y seleccionar el método recién creado
    await loadPaymentMethods();
    if (paymentMethods.value.length > 0) {
      selectedPaymentMethod.value = created.id;
    }
    step.value = 3;
  } catch (err: any) {
    alert(err.message || 'No se pudo guardar el método de pago');
  }
};

// ——— 21) Construir y enviar el pedido al backend =====
const placeOrder = async () => {
  if (!selectedAddress.value || !selectedPaymentMethod.value) {
    alert('Por favor selecciona una dirección de entrega y un método de pago.');
    return;
  }
  if (!restaurantId.value) {
    alert('Error interno: no se identificó el restaurante.');
    return;
  }

  // 🔄 GUARDAR TOTALES INMEDIATAMENTE al inicio, antes de cualquier operación
  const currentTotals = {
    originalSubtotal: cartTotals.value.originalSubtotal,
    subtotalWithOffers: cartTotals.value.subtotalWithOffers,
    totalOfferSavings: cartTotals.value.totalOfferSavings,
    total: finalTotal.value
  };
  
  console.log('💰 Totales capturados:', currentTotals);

  placingOrder.value = true;
  try {
    // Guardar en la variable temporal
    tempOrderTotals.value = currentTotals;

    // Armar payload usando "item.finalPrice" (sin doble descuento)
    const orderRequest = {
      restaurantId:         restaurantId.value,
      deliveryAddressId:    selectedAddress.value,
      paymentMethodId:      selectedPaymentMethod.value,
      deliveryType:         deliveryType.value,
      scheduledDate:
        deliveryType.value === 'scheduled'
          ? `${scheduledDate.value} ${scheduledTime.value}`
          : null,
      deliveryInstructions: deliveryInstructions.value,
      items: processedCartItems.value.map(item => ({
        productId: item.productId,
        quantity:  item.quantity,
        unitPrice: item.finalPrice
      }))
    };

    console.log('📦 Enviando pedido con totales guardados:', tempOrderTotals.value);

    await orderStore.createOrder(orderRequest);
    
    // ✅ Vaciar el carrito después de confirmar el pedido exitosamente
    cartStore.clearCart();
    console.log('✅ Carrito vaciado después de confirmar pedido');
    
    step.value = 4;
  } catch (err: any) {
    console.error('Error al crear pedido:', err);
    alert(err.message || 'No se pudo procesar tu pedido. Intenta de nuevo.');
  } finally {
    placingOrder.value = false;
  }
};

// ——— 22) Mostrar texto de tiempo de entrega =====
const getDeliveryTimeText = (): string => {
  if (deliveryType.value === 'now') {
    // Si restaurantData es null, simplemente mostramos "Envío inmediato"
    const estimatedTime = restaurantData.value?.estimatedDeliveryTime ?? 30;
    return `Envío inmediato (aprox. ${estimatedTime} min)`;
  } else {
    return `Programado: ${scheduledDate.value} a las ${scheduledTime.value}`;
  }
};

// ——— 23) Helper para presentar un método de pago en la lista =====
const displayPaymentMethod = (pm: PaymentMethodInfo) => {
  const tipo = pm.type.toLowerCase();
  if (tipo === 'paypal') {
    return `PayPal • ${pm.payPalEmail}`;
  }
  if (pm.lastFourDigits) {
    return `${pm.nickname} •••• ${pm.lastFourDigits}`;
  }
  return pm.nickname;
};

// ——— 24) Limpiar estado temporal si el usuario regresa a pasos anteriores =====
const clearTempOrderData = () => {
  tempOrderTotals.value = null;
};

// ——— 25) Watch para limpiar datos temporales si retrocede =====
watch(step, (newStep) => {
  if (newStep < 4 && tempOrderTotals.value) {
    clearTempOrderData();
    console.log('🧹 Limpiando datos temporales del pedido');
  }
});
</script>


<style lang="scss" scoped>
// Variables
$primary-color: #06C167;
$primary-gradient: linear-gradient(135deg, #06C167, #04A653);
$secondary-gradient: linear-gradient(135deg, #667eea, #764ba2);
$success-gradient: linear-gradient(135deg, #10b981, #059669);
$white: #FFFFFF;
$light-gray: #F8FAFC;
$medium-gray: #E2E8F0;
$dark-gray: #64748B;
$text-primary: #1E293B;
$text-secondary: #64748B;
$border-radius: 16px;
$border-radius-sm: 8px;
$transition: all 0.3s ease;
$shadow-soft: 0 4px 16px rgba(0, 0, 0, 0.06);
$shadow-medium: 0 10px 25px rgba(0, 0, 0, 0.08);
$shadow-elevated: 0 20px 40px rgba(0, 0, 0, 0.1);

// Container
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
}

.checkout-page {
  background: linear-gradient(to bottom, $white, $light-gray);
  min-height: 100vh;
  padding: 2rem 0 4rem;

  &__title {
    font-size: 2rem;
    font-weight: 800;
    background: $primary-gradient;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    margin: 0 0 2rem;
    text-align: center;

    @media (max-width: 768px) {
      font-size: 1.75rem;
    }
  }
}

// Breadcrumb
.breadcrumb {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.9rem;

  &__link {
    color: $text-secondary;
    text-decoration: none;
    transition: $transition;

    &:hover {
      color: $primary-color;
    }
  }

  &__separator {
    margin: 0 0.5rem;
    color: $text-secondary;
    display: flex;
    align-items: center;
  }

  &__current {
    color: $text-primary;
    font-weight: 600;
  }
}

// Progress Indicator
.progress-indicator {
  margin-bottom: 3rem;

  &__track {
    width: 100%;
    height: 4px;
    background: $medium-gray;
    border-radius: 2px;
    margin-bottom: 1.5rem;
    position: relative;
    overflow: hidden;
  }

  &__fill {
    height: 100%;
    background: $primary-gradient;
    border-radius: 2px;
    transition: width 0.6s ease;
  }
}

.progress-steps {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;

  &__circle {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: $medium-gray;
    color: $text-secondary;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    margin-bottom: 0.5rem;
    transition: $transition;
  }

  &__label {
    font-size: 0.85rem;
    color: $text-secondary;
    font-weight: 500;
    text-align: center;
  }

  &--active {
    .progress-step__circle {
      background: $primary-gradient;
      color: white;
      transform: scale(1.1);
      box-shadow: $shadow-medium;
    }

    .progress-step__label {
      color: $primary-color;
      font-weight: 700;
    }
  }

  &--completed {
    .progress-step__circle {
      background: $success-gradient;
      color: white;
    }

    .progress-step__label {
      color: $text-primary;
      font-weight: 600;
    }
  }
}

// Checkout Content
.checkout-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 3rem;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr 350px;
    gap: 2rem;
  }

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

// Checkout Step
.checkout-step {
  background: white;
  border-radius: $border-radius;
  box-shadow: $shadow-soft;
  padding: 2rem;
  margin-bottom: 2rem;

  &--success {
    text-align: center;
    padding: 3rem 2rem;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
}

// Step Header
.step-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid;
  border-image: $primary-gradient 1;

  &__icon {
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    background: $primary-gradient;
    color: white;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__title {
    font-size: 1.5rem;
    font-weight: 700;
    color: $text-primary;
    margin: 0 0 0.25rem;
  }

  &__subtitle {
    color: $text-secondary;
    margin: 0;
    font-size: 0.95rem;
  }
}

// Form Section
.form-section {
  margin-bottom: 2rem;

  &__title {
    font-size: 1.1rem;
    font-weight: 700;
    color: $text-primary;
    margin: 0 0 1rem;
  }
}

// Address Selector
.address-selector {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.address-option {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 2px solid $medium-gray;
  border-radius: $border-radius-sm;
  cursor: pointer;
  transition: $transition;

  &:hover {
    border-color: $primary-color;
    transform: translateY(-2px);
    box-shadow: $shadow-medium;
  }

  &--selected {
    border-color: $primary-color;
    background: rgba($primary-color, 0.05);
    box-shadow: 0 0 0 1px $primary-color;
  }

  &__radio {
    flex-shrink: 0;
  }

  &__name {
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 0.25rem;
  }

  &__details {
    color: $text-secondary;
    font-size: 0.9rem;
  }
}

// Radio Circle
.radio-circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid $medium-gray;
  position: relative;
  transition: $transition;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    width: 10px;
    height: 10px;
    background: $primary-color;
    border-radius: 50%;
    transition: $transition;
  }

  &--checked {
    border-color: $primary-color;

    &::after {
      transform: translate(-50%, -50%) scale(1);
    }
  }
}

// Delivery Options
.delivery-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.delivery-option {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 2px solid $medium-gray;
  border-radius: $border-radius-sm;
  cursor: pointer;
  transition: $transition;

  &:hover {
    border-color: $primary-color;
    transform: translateY(-2px);
    box-shadow: $shadow-medium;
  }

  &--selected {
    border-color: $primary-color;
    background: rgba($primary-color, 0.05);
    box-shadow: 0 0 0 1px $primary-color;
  }

  &__radio {
    flex-shrink: 0;
  }

  &__content {
    flex: 1;
  }

  &__title {
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 0.25rem;
  }

  &__subtitle {
    color: $text-secondary;
    font-size: 0.9rem;
  }

  &__icon {
    flex-shrink: 0;
    color: $primary-color;
  }
}

// Scheduled Section
.scheduled-section {
  background: rgba($primary-color, 0.02);
  border: 1px solid rgba($primary-color, 0.1);
  border-radius: $border-radius-sm;
  padding: 1.5rem;
}

.scheduled-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
}

// Input Groups
.input-group {
  margin-bottom: 1rem;
}

.input-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
}

.input-label {
  display: block;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid $medium-gray;
  border-radius: $border-radius-sm;
  font-size: 1rem;
  transition: $transition;

  &:focus {
    outline: none;
    border-color: $primary-color;
    box-shadow: 0 0 0 3px rgba($primary-color, 0.1);
  }

  &::placeholder {
    color: $text-secondary;
  }
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

// Checkbox
.checkbox-group {
  margin-top: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-weight: 500;

  input[type="checkbox"] {
    display: none;
  }
}

.checkbox-custom {
  width: 20px;
  height: 20px;
  border: 2px solid $medium-gray;
  border-radius: 4px;
  position: relative;
  transition: $transition;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    width: 12px;
    height: 12px;
    background: $primary-color;
    border-radius: 2px;
    transition: $transition;
  }

  input:checked + & {
    border-color: $primary-color;

    &::after {
      transform: translate(-50%, -50%) scale(1);
    }
  }
}

// Payment Methods
.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.payment-method {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 2px solid $medium-gray;
  border-radius: $border-radius-sm;
  cursor: pointer;
  transition: $transition;

  &:hover {
    border-color: $primary-color;
    transform: translateY(-2px);
    box-shadow: $shadow-medium;
  }

  &--selected {
    border-color: $primary-color;
    background: rgba($primary-color, 0.05);
    box-shadow: 0 0 0 1px $primary-color;
  }

  &__radio {
    flex-shrink: 0;
  }

  &__icon {
    flex-shrink: 0;
  }

  &__details {
    flex: 1;
  }

  &__name {
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 0.25rem;
  }

  &__badge {
    font-size: 0.75rem;
    background: rgba($primary-color, 0.1);
    color: $primary-color;
    padding: 0.125rem 0.5rem;
    border-radius: 12px;
    font-weight: 600;
  }
}

.new-payment-form {
  background: rgba($primary-color, 0.02);
  border: 1px solid rgba($primary-color, 0.1);
  border-radius: $border-radius-sm;
  padding: 1.5rem;
}

// Review Section
.review-section {
  margin-bottom: 2rem;

  &__title {
    font-size: 1.1rem;
    font-weight: 700;
    color: $text-primary;
    margin: 0 0 1rem;
  }
}

.review-products {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.review-product {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: $light-gray;
  border-radius: $border-radius-sm;

  &__quantity {
    font-weight: 700;
    color: $primary-color;
    min-width: 30px;
  }

  &__details {
    flex: 1;
  }

  &__name {
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 0.25rem;
  }

  &__price-with-offer {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__original-price {
    color: $text-secondary;
    text-decoration: line-through;
    font-size: 0.9rem;
  }

  &__discounted-price {
    color: $primary-color;
    font-weight: 700;
  }

  &__price {
    color: $text-primary;
    font-weight: 600;
  }
}

.review-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.review-detail {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;

  &__label {
    color: $text-secondary;
    font-weight: 500;
  }

  &__value {
    color: $text-primary;
    font-weight: 600;
    text-align: right;
  }
}

// Step Actions
.step-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;

  @media (max-width: 576px) {
    flex-direction: column;
    gap: 0.75rem;
  }
}

// Buttons
.btn-primary,
.btn-secondary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: $border-radius-sm;
  font-weight: 600;
  cursor: pointer;
  transition: $transition;
  text-decoration: none;
  border: none;
  font-size: 0.95rem;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }

  @media (max-width: 576px) {
    width: 100%;
  }
}

.btn-primary {
  background: $primary-gradient;
  color: white;
  box-shadow: $shadow-soft;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: $shadow-medium;
  }

  &--large {
    padding: 1rem 2rem;
    font-size: 1rem;
  }

  &--confirm {
    background: $success-gradient;
  }
}

.btn-secondary {
  background: white;
  color: $text-primary;
  border: 2px solid $medium-gray;

  &:hover:not(:disabled) {
    border-color: $primary-color;
    color: $primary-color;
    transform: translateY(-2px);
    box-shadow: $shadow-soft;
  }
}

// Success Content
.success-content {
  max-width: 500px;
  margin: 0 auto;
}

.success-icon {
  width: 100px;
  height: 100px;
  background: $success-gradient;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  box-shadow: $shadow-elevated;
}

.success-title {
  font-size: 2rem;
  font-weight: 800;
  background: $success-gradient;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin: 0 0 0.5rem;
}

.success-subtitle {
  color: $text-secondary;
  font-size: 1.1rem;
  margin: 0 0 2rem;
}

.order-summary-final {
  background: $light-gray;
  border-radius: $border-radius-sm;
  padding: 1.5rem;
  margin-bottom: 2rem;

  &__row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
    font-size: 0.95rem;

    &:last-child {
      margin-bottom: 0;
    }

    &--savings {
      color: $primary-color;
      font-weight: 700;
    }

    &--total {
      font-size: 1.2rem;
      font-weight: 800;
      color: $text-primary;
      border-top: 1px solid $medium-gray;
      padding-top: 0.75rem;
      margin-top: 0.75rem;
    }
  }
}

.success-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;

  @media (max-width: 576px) {
    flex-direction: column;
  }
}

// Order Sidebar
.order-sidebar {
  position: sticky;
  top: 2rem;
  height: fit-content;

  @media (max-width: 992px) {
    position: static;
  }
}

.order-summary {
  background: white;
  border-radius: $border-radius;
  box-shadow: $shadow-soft;
  overflow: hidden;

  &__header {
    background: $primary-gradient;
    color: white;
    padding: 1.5rem;
  }

  &__title {
    font-size: 1.25rem;
    font-weight: 700;
    margin: 0;
  }

  &__content {
    padding: 1.5rem;
  }

  &__row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
    font-size: 0.9rem;
    color: $text-secondary;

    &:last-child {
      margin-bottom: 0;
    }

    &--savings {
      color: $primary-color;
      font-weight: 700;
    }

    &--total {
      font-size: 1.1rem;
      font-weight: 800;
      color: $text-primary;
      border-top: 1px solid $medium-gray;
      padding-top: 0.75rem;
      margin-top: 0.75rem;
    }
  }
}

.free-delivery {
  color: $primary-color;
  font-weight: 700;
}

// Empty State
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem;
  color: $text-secondary;

  &__icon {
    margin-bottom: 1rem;
  }

  &__text {
    margin: 0;
  }
}

// Loading Spinner
.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;

  &--small {
    width: 16px;
    height: 16px;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

// Responsive
@media (max-width: 768px) {
  .checkout-page {
    padding: 1rem 0 3rem;

    &__title {
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
    }
  }

  .progress-indicator {
    margin-bottom: 2rem;
  }

  .progress-step {
    &__circle {
      width: 32px;
      height: 32px;
    }

    &__label {
      font-size: 0.75rem;
    }
  }

  .step-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;

    &__icon {
      align-self: center;
    }
  }

  .checkout-content {
    gap: 1.5rem;
  }

  .step-actions {
    flex-direction: column;
  }
}
</style>