<!--src/components/ui/RatingStars.vue-->
<template>
  <div class="rating-stars flex items-center gap-1">
    <template v-for="i in 5" :key="i">
      <button
        v-if="interactive"
        @click="setRating(i)"
        @mouseenter="hoverRating = i"
        @mouseleave="hoverRating = 0"
        class="star-button transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 rounded"
        :class="getStarClass(i)"
        :disabled="disabled"
      >
        <svg class="w-5 h-5" :class="size" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.719c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      </button>
      <span
        v-else
        class="star-display"
        :class="getStarClass(i)"
      >
        <svg class="w-5 h-5" :class="size" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.719c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      </span>
    </template>
    
    <span v-if="showText && !interactive" class="ml-2 text-sm text-gray-600">
      {{ rating ? rating.toFixed(1) : '0.0' }} 
      <span v-if="reviewCount">({{ reviewCount }} reseñas)</span>
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

const sizeClasses = computed(() => ({
  small: 'w-4 h-4',
  medium: 'w-5 h-5',
  large: 'w-6 h-6'
}))

const size = computed(() => sizeClasses.value[props.size])

const setRating = (rating: number) => {
  if (!props.disabled) {
    emit('update:rating', rating)
  }
}

const getStarClass = (index: number) => {
  const filled = index <= currentRating.value
  
  if (props.interactive) {
    return {
      'text-yellow-400': filled && !props.disabled,
      'text-gray-300': !filled && !props.disabled,
      'text-gray-200': props.disabled,
      'hover:text-yellow-500': !props.disabled,
      'cursor-pointer': !props.disabled,
      'cursor-not-allowed': props.disabled
    }
  }
  
  return {
    'text-yellow-400': filled,
    'text-gray-300': !filled
  }
}
</script>
