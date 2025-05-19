<template>
  <button 
    class="cart-checkout-button" 
    @click="proceedToCheckout"
    :disabled="disableButton"
  >
    <span v-if="isLoading" class="loading-spinner"></span>
    <span v-else>{{ buttonText }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed, defineProps, ref } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  buttonText: {
    type: String,
    default: 'Realizar pedido'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  redirectTo: {
    type: String,
    default: '/cart'
  }
});

const router = useRouter();
const isLoading = ref(false);

const disableButton = computed(() => {
  return props.disabled || isLoading.value;
});

const proceedToCheckout = () => {
  isLoading.value = true;
  
  // Simulamos una pequeña latencia para la UX
  setTimeout(() => {
    isLoading.value = false;
    router.push(props.redirectTo);
  }, 300);
};
</script>

<style lang="scss" scoped>
.cart-checkout-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 50px;
  background-color: #06C167; // Color principal
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 8px rgba(6, 193, 103, 0.2);

  &:hover:not(:disabled) {
    background-color: darken(#06C167, 5%);
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(6, 193, 103, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>