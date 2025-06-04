<!--src/components/ui/RatingStars.vue-->
<template>
  <div class="rating-stars" :class="[`rating-stars--${size}`, { 'rating-stars--interactive': interactive }]">
    <template v-for="i in 5" :key="i">
      <button
        v-if="interactive"
        @click="setRating(i)"
        @mouseenter="hoverRating = i"
        @mouseleave="hoverRating = 0"
        class="rating-stars__button"
        :class="getStarClass(i)"
        :disabled="disabled"
        type="button"
      >
        <svg class="rating-stars__icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        <span class="rating-stars__sr-only">{{ i }} estrella{{ i > 1 ? 's' : '' }}</span>
      </button>

      <span
        v-else
        class="rating-stars__display"
        :class="getStarClass(i)"
      >
        <svg class="rating-stars__icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </span>
    </template>

    <span v-if="showText && !interactive" class="rating-stars__text">
      {{ rating ? rating.toFixed(1) : '0.0' }}
      <span v-if="reviewCount" class="rating-stars__count">({{ reviewCount }} reseña{{ reviewCount !== 1 ? 's' : '' }})</span>
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  rating?: number
  interactive?: boolean
  disabled?: boolean
  size?: 'small' | 'medium' | 'large'
  showText?: boolean
  reviewCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  rating: 0,
  interactive: false,
  disabled: false,
  size: 'medium',
  showText: false
})

const emit = defineEmits<{
  'update:rating': [rating: number]
}>()

const hoverRating = ref(0)

const currentRating = computed(() =>
  props.interactive ? (hoverRating.value || props.rating) : props.rating
)

const setRating = (rating: number) => {
  if (!props.disabled) {
    emit('update:rating', rating)
  }
}

const getStarClass = (index: number) => {
  const filled = index <= currentRating.value
  const isHalf = currentRating.value > index - 1 && currentRating.value < index

  return {
    'rating-stars__star': true,
    'rating-stars__star--filled': filled,
    'rating-stars__star--half': isHalf,
    'rating-stars__star--empty': !filled && !isHalf,
    'rating-stars__star--hoverable': props.interactive && !props.disabled,
    'rating-stars__star--disabled': props.disabled
  }
}
</script>

<style lang="scss" scoped>
// Variables
$primary: #FF416C;
$secondary: #FF4B2B;
$warning: #FFC837;
$warning-dark: #F59E0B;
$gray-200: #e5e7eb;
$gray-300: #d1d5db;
$gray-400: #9ca3af;

.rating-stars {
  display: flex;
  align-items: center;
  gap: 0.125rem;

  &--small {
    gap: 0.0625rem;

    .rating-stars__icon {
      width: 14px;
      height: 14px;
    }

    .rating-stars__text {
      font-size: 0.75rem;
      margin-left: 0.375rem;
    }
  }

  &--medium {
    gap: 0.125rem;

    .rating-stars__icon {
      width: 18px;
      height: 18px;
    }

    .rating-stars__text {
      font-size: 0.875rem;
      margin-left: 0.5rem;
    }
  }

  &--large {
    gap: 0.25rem;

    .rating-stars__icon {
      width: 28px;
      height: 28px;
    }

    .rating-stars__text {
      font-size: 1rem;
      margin-left: 0.75rem;
    }
  }

  &--interactive {
    .rating-stars__button {
      cursor: pointer;

      &:not(:disabled):hover {
        transform: scale(1.15);
      }

      &:not(:disabled):active {
        transform: scale(1.05);
      }
    }
  }

  &__button,
  &__display {
    transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  &__button {
    background: none;
    border: none;
    padding: 0.25rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba($primary, 0.3);
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  &__display {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__icon {
    transition: all 0.2s ease;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
  }

  &__star {
    &--filled {
      color: $warning;

      .rating-stars__icon {
        filter: drop-shadow(0 2px 4px rgba($warning, 0.3));
      }
    }

    &--half {
      background: linear-gradient(90deg, $warning 50%, $gray-300 50%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }

    &--empty {
      color: $gray-300;
    }

    &--hoverable:hover {
      color: $warning-dark;

      .rating-stars__icon {
        filter: drop-shadow(0 4px 8px rgba($warning, 0.4));
      }
    }

    &--disabled {
      color: $gray-200;
    }
  }

  // Animación de entrada para estrellas interactivas
  &--interactive &__button {
    animation: starSlideIn 0.3s ease-out;
    animation-delay: calc(var(--star-index, 0) * 0.05s);
    animation-fill-mode: both;
  }

  &__text {
    color: #374151;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  &__count {
    color: #6b7280;
    font-weight: 400;
    font-size: 0.9em;
  }

  &__sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
}

@keyframes starSlideIn {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

// Efecto de hover especial para estrellas grandes
.rating-stars--large.rating-stars--interactive {
  .rating-stars__button:hover {
    &::before {
      content: '';
      position: absolute;
      inset: -4px;
      background: radial-gradient(circle, rgba($warning, 0.2) 0%, transparent 70%);
      border-radius: 50%;
      z-index: -1;
      animation: starGlow 0.3s ease-out;
    }
  }
}

@keyframes starGlow {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

// Responsive adjustments
@media (max-width: 640px) {
  .rating-stars {
    &--large {
      .rating-stars__icon {
        width: 24px;
        height: 24px;
      }
    }

    &--medium {
      .rating-stars__icon {
        width: 16px;
        height: 16px;
      }
    }
  }
}
</style>
