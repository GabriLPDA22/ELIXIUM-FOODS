<!--src/components/reviews/FloatingReviewButton.vue-->
<template>
  <div class="floating-review-button" v-if="authStore.isAuthenticated && canWriteReview">
    <!-- Botón principal -->
    <button
      @click="toggleMenu"
      class="floating-review-button__main"
      :class="{ 'floating-review-button__main--active': isMenuOpen }"
      :title="isMenuOpen ? 'Cerrar menú' : 'Escribir reseña'"
    >
      <svg v-if="!isMenuOpen" class="floating-review-button__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
      <svg v-else class="floating-review-button__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>

    <!-- Menú de opciones -->
    <div class="floating-review-button__menu" :class="{ 'floating-review-button__menu--open': isMenuOpen }">
      <!-- Reseñar restaurante -->
      <button
        @click="openRestaurantReview"
        class="floating-review-button__option floating-review-button__option--restaurant"
        title="Reseñar restaurante"
      >
        <div class="floating-review-button__option-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9,22 9,12 15,12 15,22"></polyline>
          </svg>
        </div>
        <span class="floating-review-button__option-label">Restaurante</span>
      </button>

      <!-- Ver todas las reseñas -->
      <button
        @click="scrollToReviews"
        class="floating-review-button__option floating-review-button__option--view"
        title="Ver reseñas"
      >
        <div class="floating-review-button__option-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
          </svg>
        </div>
        <span class="floating-review-button__option-label">Ver reseñas</span>
      </button>
    </div>

    <!-- Overlay para cerrar menú -->
    <div
      v-if="isMenuOpen"
      @click="closeMenu"
      class="floating-review-button__overlay"
    ></div>
  </div>

  <!-- Modal de reseña del restaurante -->
  <div v-if="showRestaurantReviewModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
    <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">
              Reseñar {{ restaurantName }}
            </h3>
            <p class="text-sm text-gray-600 mt-1">
              Comparte tu experiencia general del restaurante
            </p>
          </div>
          <button
            @click="closeRestaurantReviewModal"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <ReviewForm
        :restaurant-id="restaurantId"
        @success="onRestaurantReviewSuccess"
        @cancel="closeRestaurantReviewModal"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useReviews } from '@/composables/useReviews'
import ReviewForm from './ReviewForm.vue'

interface Props {
  restaurantId: number
  restaurantName: string
  canWrite?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  canWrite: true
})

const emit = defineEmits<{
  'review-created': []
}>()

const authStore = useAuthStore()
const { canReviewRestaurant } = useReviews()

const isMenuOpen = ref(false)
const showRestaurantReviewModal = ref(false)
const canWriteReview = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const openRestaurantReview = () => {
  closeMenu()
  showRestaurantReviewModal.value = true
}

const closeRestaurantReviewModal = () => {
  showRestaurantReviewModal.value = false
}

const scrollToReviews = () => {
  closeMenu()
  const reviewsSection = document.querySelector('.restaurant-reviews')
  if (reviewsSection) {
    reviewsSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }
}

const onRestaurantReviewSuccess = () => {
  closeRestaurantReviewModal()
  emit('review-created')
}

// Cerrar menú al hacer scroll
const handleScroll = () => {
  if (isMenuOpen.value) {
    closeMenu()
  }
}

// Verificar si puede escribir reseña
const checkCanReview = async () => {
  if (authStore.isAuthenticated && props.canWrite) {
    try {
      canWriteReview.value = await canReviewRestaurant(props.restaurantId)
    } catch (error) {
      console.error('Error checking review permissions:', error)
      canWriteReview.value = false
    }
  } else {
    canWriteReview.value = false
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  checkCanReview()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style lang="scss" scoped>
.floating-review-button {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 50;

  @media (max-width: 768px) {
    bottom: 1.5rem;
    right: 1.5rem;
  }

  &__main {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, #FF416C, #FF4B2B);
    color: white;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 25px rgba(255, 65, 108, 0.4);
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: relative;
    z-index: 3;

    &:hover {
      transform: translateY(-3px) scale(1.05);
      box-shadow: 0 12px 35px rgba(255, 65, 108, 0.5);
    }

    &--active {
      background: linear-gradient(135deg, #EF4444, #DC2626);
      transform: rotate(180deg);
    }

    @media (max-width: 768px) {
      width: 56px;
      height: 56px;
    }
  }

  &__icon {
    width: 28px;
    height: 28px;
    transition: all 0.3s ease;

    @media (max-width: 768px) {
      width: 24px;
      height: 24px;
    }
  }

  &__menu {
    position: absolute;
    bottom: 80px;
    right: 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    opacity: 0;
    visibility: hidden;
    transform: translateY(20px);
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    pointer-events: none;

    &--open {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
      pointer-events: auto;
    }

    @media (max-width: 768px) {
      bottom: 72px;
    }
  }

  &__option {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    background: white;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
    white-space: nowrap;
    min-width: 140px;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      transition: left 0.5s ease;
    }

    &:hover {
      transform: translateX(-8px) translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);

      &::before {
        left: 100%;
      }
    }

    &--restaurant {
      background: linear-gradient(135deg, #06C167, #04A653);
      color: white;

      &:hover {
        background: linear-gradient(135deg, #059862, #037540);
      }
    }

    &--view {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;

      &:hover {
        background: linear-gradient(135deg, #5a6fd8, #6a4190);
      }
    }
  }

  &__option-icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;

    svg {
      width: 100%;
      height: 100%;
    }
  }

  &__option-label {
    font-size: 0.875rem;
    font-weight: 600;
  }

  &__overlay {
    position: fixed;
    inset: 0;
    z-index: 1;
    cursor: pointer;
  }
}

// Animaciones de entrada escalonada
.floating-review-button__menu--open {
  .floating-review-button__option {
    animation: slideInRight 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;

    &:nth-child(1) {
      animation-delay: 0.1s;
    }

    &:nth-child(2) {
      animation-delay: 0.2s;
    }
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

// Pulse animation for main button
@keyframes pulse {
  0% {
    box-shadow: 0 8px 25px rgba(255, 65, 108, 0.4);
  }
  50% {
    box-shadow: 0 8px 25px rgba(255, 65, 108, 0.6), 0 0 0 10px rgba(255, 65, 108, 0.1);
  }
  100% {
    box-shadow: 0 8px 25px rgba(255, 65, 108, 0.4);
  }
}

.floating-review-button__main {
  animation: pulse 3s infinite;
}

// Dark mode support
@media (prefers-color-scheme: dark) {
  .floating-review-button__option {
    background: #1f2937;
    color: #f9fafb;

    &:not(.floating-review-button__option--restaurant):not(.floating-review-button__option--view) {
      border: 1px solid #374151;
    }
  }
}
</style>
