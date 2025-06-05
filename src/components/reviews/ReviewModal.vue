<!-- src/components/reviews/ReviewModal.vue -->
<template>
  <div class="review-modal-overlay" @click="handleBackdropClick">
    <div class="review-modal-container" @click.stop>
      <!-- Header limpio y minimalista -->
      <div class="review-modal-header">
        <div class="review-modal-title-section">
          <h3 class="review-modal-title">{{ title }}</h3>
          <p class="review-modal-subtitle">Comparte tu experiencia y ayuda a otros usuarios</p>
        </div>
        <button @click="$emit('cancel')" class="review-modal-close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="review-modal-content">
        <ReviewForm
          :restaurant-id="restaurantId"
          :product-id="productId"
          :existing-review="existingReview"
          @success="$emit('success', $event)"
          @cancel="$emit('cancel')"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import ReviewForm from './ReviewForm.vue'
import type { Review } from '@/types/review'

interface Props {
  restaurantId: number
  productId?: number
  existingReview?: Review
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Escribir reseña'
})

const emit = defineEmits<{
  success: [review: Review]
  cancel: []
}>()

// Body scroll lock
const lockBodyScroll = () => {
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
  document.body.style.overflow = 'hidden'
  document.body.style.paddingRight = `${scrollbarWidth}px`
}

const unlockBodyScroll = () => {
  document.body.style.overflow = ''
  document.body.style.paddingRight = ''
}

const handleBackdropClick = () => {
  emit('cancel')
}

// Handle escape key
const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    emit('cancel')
  }
}

onMounted(() => {
  lockBodyScroll()
  document.addEventListener('keydown', handleEscapeKey)
})

onUnmounted(() => {
  unlockBodyScroll()
  document.removeEventListener('keydown', handleEscapeKey)
})
</script>

<style lang="scss" scoped>
.review-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  animation: fadeIn 0.2s ease-out;
}

.review-modal-container {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 4px 12px rgba(0, 0, 0, 0.05);
  animation: slideUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  flex-direction: column;
}

.review-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  gap: 1rem;
}

.review-modal-title-section {
  flex: 1;
  min-width: 0;
}

.review-modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.25rem;
  line-height: 1.3;
}

.review-modal-subtitle {
  color: #64748b;
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.4;
}

.review-modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #f8fafc;
  color: #64748b;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: #f1f5f9;
    color: #475569;
  }

  &:active {
    transform: scale(0.95);
  }
}

.review-modal-content {
  flex: 1;
  overflow-y: auto;
  min-height: 0;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f8fafc;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;

    &:hover {
      background: #94a3b8;
    }
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (max-width: 640px) {
  .review-modal-overlay {
    padding: 0.5rem;
  }

  .review-modal-container {
    max-height: 95vh;
  }

  .review-modal-header {
    padding: 1rem;
  }

  .review-modal-title {
    font-size: 1.125rem;
  }
}
</style>
