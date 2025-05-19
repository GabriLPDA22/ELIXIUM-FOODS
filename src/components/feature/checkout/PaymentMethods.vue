<!-- src/components/feature/checkout/PaymentMethods.vue -->
<template>
  <div class="payment-methods">
    <h3 class="section-title">Elige un método de pago</h3>

    <!-- Payment method list -->
    <div class="payment-list">
      <div 
        v-for="method in paymentMethods" 
        :key="method.id" 
        class="payment-card"
        :class="{ 'payment-card--selected': selectedPaymentMethod === method.id }"
        @click="selectPayment(method.id)"
      >
        <div class="payment-card__radio">
          <div class="radio-circle" :class="{ 'radio-circle--checked': selectedPaymentMethod === method.id }"></div>
        </div>
        
        <div class="payment-card__content">
          <div class="payment-card__logo">
            <img v-if="method.cardType === 'visa'" src="@/assets/images/visa.svg" alt="Visa" class="payment-card__logo-img">
            <img v-else-if="method.cardType === 'mastercard'" src="@/assets/images/mastercard.svg" alt="Mastercard" class="payment-card__logo-img">
            <img v-else-if="method.cardType === 'amex'" src="@/assets/images/amex.svg" alt="Amex" class="payment-card__logo-img">
            <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
              <line x1="1" y1="10" x2="23" y2="10"></line>
            </svg>
          </div>
          
          <div class="payment-card__details">
            <div class="payment-card__name">{{ method.name }}</div>
            <div v-if="method.isDefault" class="payment-card__badge">Predeterminada</div>
          </div>
        </div>
      </div>

      <!-- Add new payment method card -->
      <div class="payment-card payment-card--add" @click="$emit('add-payment')">
        <div class="payment-card__add-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </div>
        <div class="payment-card__add-text">Añadir nuevo método de pago</div>
      </div>
    </div>

    <!-- Secure payment info -->
    <div class="secure-payment">
      <div class="secure-payment__icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      </div>
      <div class="secure-payment__text">
        Todas las transacciones son seguras y están encriptadas.
      </div>
    </div>

    <!-- Billing information -->
    <div class="billing-info">
      <h3 class="section-title">Información de facturación</h3>
      
      <div class="billing-option">
        <div class="billing-option__header">
          <div class="billing-option__checkbox checked">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <div class="billing-option__title">Misma que la dirección de entrega</div>
        </div>
      </div>
      
      <div class="billing-option">
        <div class="billing-option__header">
          <div class="billing-option__checkbox">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <div class="billing-option__title">Usar una dirección de facturación diferente</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  paymentMethods: {
    type: Array,
    required: true
  },
  selectedPaymentMethod: {
    type: Number,
    default: null
  }
});

const emit = defineEmits(['select-payment', 'add-payment']);

const selectPayment = (paymentId: number) => {
  emit('select-payment', paymentId);
};
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

// Payment methods
.payment-methods {
  margin-bottom: 24px;
}

// Payment list
.payment-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

// Payment card
.payment-card {
  display: flex;
  padding: 16px;
  background-color: $white;
  border: 1px solid $medium-gray;
  border-radius: $border-radius-sm;
  cursor: pointer;
  transition: $transition;

  &:hover {
    border-color: darken($medium-gray, 10%);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  }

  &--selected {
    border-color: $primary-color;
    box-shadow: 0 0 0 1px $primary-color;

    &:hover {
      border-color: $primary-color;
    }
  }

  &__radio {
    margin-right: 16px;
    padding-top: 6px;
  }

  &__content {
    flex: 1;
    display: flex;
    align-items: center;
  }

  &__logo {
    width: 40px;
    height: 24px;
    display: flex;
    align-items: center;
    margin-right: 12px;
    color: $text-secondary;

    &-img {
      width: 100%;
      height: auto;
      object-fit: contain;
    }
  }

  &__details {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  &__name {
    font-weight: 500;
    color: $text-primary;
  }

  &__badge {
    font-size: 12px;
    background-color: rgba($primary-color, 0.1);
    color: $primary-color;
    padding: 2px 8px;
    border-radius: 100px;
    font-weight: 500;
    display: inline-block;
    margin-top: 4px;
  }

  // Add new payment method card
  &--add {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    height: 100%;
    min-height: 100px;
    border-style: dashed;

    &:hover {
      background-color: rgba($primary-color, 0.05);
      border-color: $primary-color;
    }
  }

  &__add-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: rgba($primary-color, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    color: $primary-color;
    margin-bottom: 8px;
  }

  &__add-text {
    font-weight: 500;
    color: $primary-color;
  }
}

// Radio circle
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
    background-color: $primary-color;
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

// Secure payment
.secure-payment {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: rgba($success-color, 0.08);
  padding: 12px 16px;
  border-radius: $border-radius-sm;
  margin-bottom: 32px;
  
  &__icon {
    color: $success-color;
  }
  
  &__text {
    font-size: 14px;
    color: $text-primary;
  }
}

// Billing info
.billing-info {
  margin-bottom: 24px;
}

// Billing option
.billing-option {
  padding: 16px;
  background-color: $white;
  border: 1px solid $medium-gray;
  border-radius: $border-radius-sm;
  cursor: pointer;
  transition: $transition;
  margin-bottom: 16px;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  &:hover {
    border-color: darken($medium-gray, 10%);
  }
  
  &__header {
    display: flex;
    align-items: center;
  }
  
  &__checkbox {
    width: 20px;
    height: 20px;
    border-radius: 4px;
    border: 2px solid $medium-gray;
    margin-right: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $white;
    
    &.checked {
      background-color: $primary-color;
      border-color: $primary-color;
    }
  }
  
  &__title {
    font-weight: 500;
    color: $text-primary;
  }
}
</style>