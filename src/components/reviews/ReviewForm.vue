<!--src/components/reviews/ReviewForm.vue-->
<template>
  <div class="review-form bg-white rounded-lg border border-gray-200 p-6">
    <h3 class="review-form__title text-lg font-semibold text-gray-900 mb-6">
      {{ isEditing ? 'Editar reseña' : 'Escribir una reseña' }}
    </h3>

    <form @submit.prevent="submitReview" class="space-y-6">
      <!-- Rating -->
      <div class="review-form__rating">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Calificación *
        </label>
        <RatingStars 
          v-model:rating="form.rating"
          interactive
          :disabled="loading"
          size="large"
        />
        <p v-if="errors.rating" class="text-red-600 text-sm mt-1">{{ errors.rating }}</p>
      </div>

      <!-- Comment -->
      <div class="review-form__comment">
        <label for="comment" class="block text-sm font-medium text-gray-700 mb-2">
          Comentario *
        </label>
        <textarea
          id="comment"
          v-model="form.comment"
          :disabled="loading"
          rows="5"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-500"
          placeholder="Comparte tu experiencia..."
          maxlength="1000"
        ></textarea>
        <div class="flex justify-between items-center mt-1">
          <p v-if="errors.comment" class="text-red-600 text-sm">{{ errors.comment }}</p>
          <span class="text-xs text-gray-500">{{ form.comment.length }}/1000</span>
        </div>
      </div>

      <!-- Image Upload -->
      <div class="review-form__image">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Agregar foto (opcional)
        </label>
        
        <div class="space-y-3">
          <!-- URL Input -->
          <input
            v-model="form.imageUrl"
            type="url"
            :disabled="loading"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
            placeholder="https://ejemplo.com/imagen.jpg"
          />
          
          <!-- Image Preview -->
          <div v-if="form.imageUrl" class="review-form__preview">
            <img 
              :src="form.imageUrl" 
              alt="Vista previa"
              class="w-32 h-32 object-cover rounded-lg border border-gray-200"
              @error="onImageError"
            />
            <button
              type="button"
              @click="form.imageUrl = ''"
              class="ml-2 text-red-600 hover:text-red-800 text-sm"
            >
              Quitar imagen
            </button>
          </div>
        </div>
        
        <p v-if="errors.imageUrl" class="text-red-600 text-sm mt-1">{{ errors.imageUrl }}</p>
      </div>

      <!-- Actions -->
      <div class="review-form__actions flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          @click="cancelReview"
          :disabled="loading"
          class="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 transition-colors"
        >
          Cancelar
        </button>
        
        <button
          type="submit"
          :disabled="loading || !isFormValid"
          class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <svg v-if="loading" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isEditing ? 'Actualizar reseña' : 'Publicar reseña' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import type { Review, CreateReviewDto, UpdateReviewDto } from '@/types/review'
import RatingStars from '@/components/ui/RatingStars.vue'
import { useReviews } from '@/composables/useReviews'

interface Props {
  restaurantId: number
  productId?: number
  existingReview?: Review
}

const props = defineProps<Props>()

const emit = defineEmits<{
  success: [review: Review]
  cancel: []
}>()

const { createReview, updateReview } = useReviews()

const loading = ref(false)
const errors = reactive({
  rating: '',
  comment: '',
  imageUrl: ''
})

const form = reactive({
  rating: 0,
  comment: '',
  imageUrl: ''
})

const isEditing = computed(() => !!props.existingReview)

const isFormValid = computed(() => {
  return form.rating > 0 && 
         form.comment.trim().length >= 10 && 
         form.comment.trim().length <= 1000 &&
         !errors.rating &&
         !errors.comment &&
         !errors.imageUrl
})

// Initialize form with existing review if editing
watch(
  () => props.existingReview,
  (review) => {
    if (review) {
      form.rating = review.rating
      form.comment = review.comment
      form.imageUrl = review.imageUrl || ''
    }
  },
  { immediate: true }
)

// Validation
watch(() => form.rating, (rating) => {
  if (rating < 1 || rating > 5) {
    errors.rating = 'La calificación debe estar entre 1 y 5 estrellas'
  } else {
    errors.rating = ''
  }
})

watch(() => form.comment, (comment) => {
  const trimmed = comment.trim()
  if (trimmed.length < 10) {
    errors.comment = 'El comentario debe tener al menos 10 caracteres'
  } else if (trimmed.length > 1000) {
    errors.comment = 'El comentario no puede exceder 1000 caracteres'
  } else {
    errors.comment = ''
  }
})

watch(() => form.imageUrl, (url) => {
  if (url && !isValidUrl(url)) {
    errors.imageUrl = 'La URL de la imagen no es válida'
  } else {
    errors.imageUrl = ''
  }
})

const submitReview = async () => {
  if (!isFormValid.value) return

  loading.value = true
  
  try {
    if (isEditing.value && props.existingReview) {
      const updateData: UpdateReviewDto = {
        rating: form.rating,
        comment: form.comment.trim(),
        imageUrl: form.imageUrl || undefined
      }
      
      const updatedReview = await updateReview(props.existingReview.id, updateData)
      emit('success', updatedReview)
    } else {
      const createData: CreateReviewDto = {
        restaurantId: props.restaurantId,
        productId: props.productId,
        rating: form.rating,
        comment: form.comment.trim(),
        imageUrl: form.imageUrl || undefined
      }
      
      const newReview = await createReview(createData)
      emit('success', newReview)
    }
    
    // Reset form if creating new review
    if (!isEditing.value) {
      resetForm()
    }
  } catch (error) {
    console.error('Error submitting review:', error)
  } finally {
    loading.value = false
  }
}

const cancelReview = () => {
  if (!isEditing.value) {
    resetForm()
  }
  emit('cancel')
}

const resetForm = () => {
  form.rating = 0
  form.comment = ''
  form.imageUrl = ''
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
}

const onImageError = () => {
  errors.imageUrl = 'No se pudo cargar la imagen. Verifica la URL.'
}

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}
</script>