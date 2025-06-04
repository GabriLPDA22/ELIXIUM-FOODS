<!-- src/components/feature/checkout/OrderSummary.vue -->
<template>
  <div class="order-summary-component">
    <!-- Order items -->
    <div class="order-items">
      <h3 class="section-title">Resumen de productos</h3>
      
      <div class="item-list">
        <div v-for="item in cartItems" :key="item.id" class="order-item">
          <div class="order-item__quantity">{{ item.quantity }}×</div>
          <div class="order-item__details">
            <div class="order-item__name">{{ item.name }}</div>
            <div class="order-item__price">${{ (item.price * item.quantity).toFixed(2) }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Order costs -->
    <div class="order-costs">
      <div class="cost-row">
        <span>Subtotal</span>
        <span>${{ subtotal.toFixed(2) }}</span>
      </div>
      <div class="cost-row">
        <span>Costo de envío</span>
        <span v-if="deliveryFee > 0">${{ deliveryFee.toFixed(2) }}</span>
        <span v-else class="free-delivery">Gratis</span>
      </div>
      <div class="cost-row">
        <span>Impuestos (16%)</span>
        <span>${{ tax.toFixed(2) }}</span>
      </div>
      <div class="cost-row cost-row--total">
        <span>Total</span>
        <span>${{ total.toFixed(2) }}</span>
      </div>
    </div>

    <!-- Order details -->
    <div class="order-details">
      <h3 class="section-title">Detalles del pedido</h3>
      
      <div class="detail-group">
        <div class="detail-label">Tiempo estimado de entrega:</div>
        <div class="detail-value">{{ estimatedDeliveryTime }} minutos</div>
      </div>
      
      <div class="detail-group">
        <div class="detail-label">Dirección de entrega:</div>
        <div class="detail-value" v-if="selectedAddress">
          <div>{{ selectedAddress.street }} {{ selectedAddress.number }}<span v-if="selectedAddress.interior">, {{ selectedAddress.interior }}</span></div>
          <div>{{ selectedAddress.neighborhood }}, {{ selectedAddress.city }}</div>
          <div>{{ selectedAddress.state }}, CP {{ selectedAddress.zipCode }}</div>
        </div>
        <div class="detail-value" v-else>No seleccionada</div>
      </div>
      
      <div class="detail-group">
        <div class="detail-label">Método de pago:</div>
        <div class="detail-value payment-method-value" v-if="selectedPaymentMethod">
          <div class="payment-method-logo">
            <img v-if="selectedPaymentMethod.cardType === 'visa'" src="@/assets/Images/visa.svg" alt="Visa" class="payment-logo-img">
            <img v-else-if="selectedPaymentMethod.cardType === 'mastercard'" src="@/assets/Images/mastercard.svg" alt="Mastercard" class="payment-logo-img">
            <img v-else-if="selectedPaymentMethod.cardType === 'amex'" src="@/assets/Images/amex.svg" alt="Amex" class="payment-logo-img">
            <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
              <line x1="1" y1="10" x2="23" y2="10"></line>
            </svg>
          </div>
          <div>{{ selectedPaymentMethod.name }}</div>
        </div>
        <div class="detail-value" v-else>No seleccionado</div>
      </div>
    </div>

    <!-- Legal and policy information -->
    <div class="order-policies">
      <p class="policy-text">
        Al completar tu pedido, aceptas nuestros <a href="#" class="policy-link">Términos y Condiciones</a> y nuestra <a href="#" class="policy-link">Política de Privacidad</a>.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import type { CartItem } from '@/stores/cart';

defineProps({
  cartItems: {
    type: Array as () => CartItem[],
    required: true
  },
  subtotal: {
    type: Number,
    required: true
  },
  deliveryFee: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  selectedAddress: {
    type: Object,
    default: null
  },
  selectedPaymentMethod: {
    type: Object,
    default: null
  },
  estimatedDeliveryTime: {
    type: Number,
    default: 30
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
$border-radius-sm: 8px;
$border-radius: 16px;
$transition: all 0.2s ease;

// Section title
.section-title {
  font-size: 16px;
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
  background-color: $white;
  border: 1px solid $medium-gray;
  border-radius: $border-radius-sm;
  overflow: hidden;
}

// Order item
.order-item {
  display: flex;
  padding: 16px;
  border-bottom: 1px solid $light-gray;

  &:last-child {
    border-bottom: none;
  }

  &__quantity {
    font-weight: 600;
    margin-right: 16px;
    min-width: 24px;
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
  background-color: $white;
  border: 1px solid $medium-gray;
  border-radius: $border-radius-sm;
  padding: 16px;
  margin-bottom: 32px;
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
    border-top: 1px solid $light-gray;
    font-size: 16px;
    font-weight: 600;
    color: $text-primary;
  }
}

// Free delivery
.free-delivery {
  color: $success-color;
  font-weight: 600;
}

// Order details
.order-details {
  margin-bottom: 32px;
}

// Detail group
.detail-group {
  background-color: $white;
  border: 1px solid $medium-gray;
  border-radius: $border-radius-sm;
  padding: 16px;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
}

// Detail label
.detail-label {
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 8px;
}

// Detail value
.detail-value {
  color: $text-secondary;
  font-size: 14px;
  line-height: 1.5;
}

// Payment method value
.payment-method-value {
  display: flex;
  align-items: center;
  gap: 12px;
}

// Payment method logo
.payment-method-logo {
  width: 40px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $text-secondary;

  .payment-logo-img {
    width: 100%;
    height: auto;
    object-fit: contain;
  }
}

// Order policies
.order-policies {
  background-color: $light-gray;
  border-radius: $border-radius-sm;
  padding: 16px;
}

// Policy text
.policy-text {
  font-size: 14px;
  color: $text-secondary;
  margin: 0;
  line-height: 1.5;
}

// Policy link
.policy-link {
  color: $primary-color;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
}
</style>