<!-- src/components/feature/checkout/DeliveryOptions.vue -->
<template>
  <div class="delivery-options">
    <!-- Address selection section -->
    <div class="address-selection">
      <h3 class="section-title">Selecciona una dirección de entrega</h3>

      <!-- Address list -->
      <div class="address-list">
        <div 
          v-for="address in addresses" 
          :key="address.id" 
          class="address-card"
          :class="{ 'address-card--selected': selectedAddress === address.id }"
          @click="selectAddress(address.id)"
        >
          <div class="address-card__radio">
            <div class="radio-circle" :class="{ 'radio-circle--checked': selectedAddress === address.id }"></div>
          </div>
          
          <div class="address-card__content">
            <div class="address-card__header">
              <h4 class="address-card__title">{{ address.name }}</h4>
              <span v-if="address.isDefault" class="address-card__badge">Predeterminada</span>
            </div>
            
            <div class="address-card__details">
              <p class="address-card__line">
                {{ address.street }} {{ address.number }}
                <span v-if="address.interior">, {{ address.interior }}</span>
              </p>
              <p class="address-card__line">{{ address.neighborhood }}, {{ address.city }}</p>
              <p class="address-card__line">{{ address.state }}, CP {{ address.zipCode }}</p>
              <p class="address-card__line">Tel: {{ address.phone }}</p>
            </div>
            
            <div class="address-card__actions">
              <button class="address-card__edit">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Editar
              </button>
            </div>
          </div>
        </div>

        <!-- Add new address card -->
        <div class="address-card address-card--add" @click="$emit('add-address')">
          <div class="address-card__add-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </div>
          <div class="address-card__add-text">Añadir nueva dirección</div>
        </div>
      </div>
    </div>

    <!-- Delivery time options -->
    <div class="delivery-time">
      <h3 class="section-title">Tiempo de entrega</h3>
      
      <div class="time-options">
        <div class="time-option time-option--selected">
          <div class="time-option__radio">
            <div class="radio-circle radio-circle--checked"></div>
          </div>
          
          <div class="time-option__content">
            <div class="time-option__title">Lo antes posible</div>
            <div class="time-option__subtitle">30-45 min aprox.</div>
          </div>
        </div>
        
        <div class="time-option">
          <div class="time-option__radio">
            <div class="radio-circle"></div>
          </div>
          
          <div class="time-option__content">
            <div class="time-option__title">Programar para más tarde</div>
            <div class="time-option__subtitle">Elige día y hora</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delivery instructions -->
    <div class="delivery-instructions">
      <h3 class="section-title">Instrucciones para la entrega</h3>
      
      <textarea 
        class="instructions-textarea" 
        placeholder="Instrucciones para el repartidor (opcional). Ej. Timbre no funciona, llamar por teléfono."
        v-model="instructions"
        rows="3"
      ></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
  addresses: {
    type: Array,
    required: true
  },
  selectedAddress: {
    type: Number,
    default: null
  }
});

const emit = defineEmits(['select-address', 'add-address']);

const instructions = ref('');

const selectAddress = (addressId: number) => {
  emit('select-address', addressId);
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

// Address selection
.address-selection {
  margin-bottom: 32px;
}

// Address list
.address-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

// Address card
.address-card {
  display: flex;
  padding: 16px;
  background-color: $white;
  border: 1px solid $medium-gray;
  border-radius: $border-radius-sm;
  cursor: pointer;
  transition: $transition;
  position: relative;

  &:hover {
    border-color: $medium-gray;
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
    padding-top: 4px;
  }

  &__content {
    flex: 1;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  &__title {
    font-size: 16px;
    font-weight: 600;
    margin: 0;
    color: $text-primary;
  }

  &__badge {
    font-size: 12px;
    background-color: rgba($primary-color, 0.1);
    color: $primary-color;
    padding: 2px 8px;
    border-radius: 100px;
    font-weight: 500;
  }

  &__details {
    margin-bottom: 16px;
  }

  &__line {
    margin: 0 0 4px;
    font-size: 14px;
    color: $text-secondary;
    line-height: 1.4;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__actions {
    margin-top: auto;
  }

  &__edit {
    display: flex;
    align-items: center;
    gap: 6px;
    background: none;
    border: none;
    color: $primary-color;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    padding: 4px 0;

    &:hover {
      text-decoration: underline;
    }
  }

  // Add new address card
  &--add {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    height: 100%;
    min-height: 160px;
    border-style: dashed;

    &:hover {
      background-color: rgba($primary-color, 0.05);
      border-color: $primary-color;
    }
  }

  &__add-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: rgba($primary-color, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    color: $primary-color;
    margin-bottom: 12px;
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

// Delivery time
.delivery-time {
  margin-bottom: 32px;
}

// Time options
.time-options {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

// Time option
.time-option {
  display: flex;
  align-items: flex-start;
  padding: 16px;
  background-color: $white;
  border: 1px solid $medium-gray;
  border-radius: $border-radius-sm;
  cursor: pointer;
  transition: $transition;

  &:hover {
    border-color: $medium-gray;
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
    padding-top: 4px;
  }

  &__content {
    flex: 1;
  }

  &__title {
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 4px;
  }

  &__subtitle {
    font-size: 14px;
    color: $text-secondary;
  }
}

// Delivery instructions
.delivery-instructions {
  margin-bottom: 16px;
}

// Instructions textarea
.instructions-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid $medium-gray;
  border-radius: $border-radius-sm;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  transition: $transition;

  &:focus {
    outline: none;
    border-color: $primary-color;
  }

  &::placeholder {
    color: lighten($text-secondary, 15%);
  }
}
</style>