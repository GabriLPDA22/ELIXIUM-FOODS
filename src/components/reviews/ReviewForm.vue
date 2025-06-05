<!--src/components/reviews/ReviewForm.vue-->
<template>
  <div class="review-form">
    <form @submit.prevent="submitReview" class="review-form__form" style=" overflow-y: auto; max-height: 400px;">
      <!-- Rating Section -->
      <div class="review-form__section">
        <label class="review-form__label">
          <svg class="review-form__label-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          Calificación *
        </label>
        <div class="review-form__rating">
          <RatingStars
            v-model:rating="form.rating"
            interactive
            :disabled="loading"
            size="large"
          />
          <div class="review-form__rating-text">
            <span v-if="form.rating > 0" class="review-form__rating-description">
              {{ getRatingText(form.rating) }}
            </span>
            <span v-else class="review-form__rating-placeholder">
              Selecciona tu calificación
            </span>
          </div>
        </div>
        <div v-if="errors.rating" class="review-form__error">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          {{ errors.rating }}
        </div>
      </div>

      <!-- Comment Section -->
      <div class="review-form__section">
        <label for="comment" class="review-form__label">
          <svg class="review-form__label-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          Comentario *
        </label>
        <div class="review-form__textarea-wrapper">
          <textarea
            id="comment"
            v-model="form.comment"
            :disabled="loading"
            rows="4"
            class="review-form__textarea"
            :class="{ 'review-form__textarea--error': errors.comment }"
            placeholder="Comparte tu experiencia... ¿Qué te gustó más? ¿Recomendarías este lugar?"
            maxlength="1000"
          ></textarea>
          <div v-if="form.comment.length === 0" class="review-form__textarea-hint">
            💡 Tip: Sé específico sobre sabor, servicio, presentación...
          </div>
        </div>
        <div class="review-form__comment-footer">
          <div class="review-form__comment-info">
            <div v-if="errors.comment" class="review-form__error">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              {{ errors.comment }}
            </div>
          </div>
          <div class="review-form__char-count" :class="{ 'review-form__char-count--warning': form.comment.length > 800 }">
            {{ form.comment.length }}/1000
          </div>
        </div>
      </div>

      <!-- Image Section -->
      <div class="review-form__section">
        <label class="review-form__label">
          <svg class="review-form__label-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
          Agregar foto (opcional)
        </label>

        <div class="review-form__image-section">
          <input
            v-model="form.imageUrl"
            type="url"
            :disabled="loading"
            class="review-form__input"
            :class="{ 'review-form__input--error': errors.imageUrl }"
            placeholder="https://ejemplo.com/mi-foto.jpg"
          />
          <div class="review-form__image-tip">
            Pega la URL de una imagen para mostrar tu experiencia
          </div>

          <!-- Image Preview -->
          <div v-if="form.imageUrl" class="review-form__image-preview">
            <div class="review-form__preview-container">
              <img
                :src="form.imageUrl"
                alt="Vista previa"
                class="review-form__preview-image"
                @error="onImageError"
                @load="errors.imageUrl = ''"
              />
              <button
                type="button"
                @click="form.imageUrl = ''"
                class="review-form__preview-remove"
                title="Quitar imagen"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div v-if="errors.imageUrl" class="review-form__error">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          {{ errors.imageUrl }}
        </div>
      </div>

      <!-- Actions -->
      <div class="review-form__actions">
        <button
          type="button"
          @click="cancelReview"
          :disabled="loading"
          class="review-form__cancel"
        >
          Cancelar
        </button>

        <button
          type="submit"
          :disabled="loading || !isFormValid"
          class="review-form__submit"
        >
          <svg v-if="loading" class="review-form__submit-spinner" width="16" height="16" viewBox="0 0 24 24">
            <circle class="spinner-track" cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="3"></circle>
            <path class="spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg v-else class="review-form__submit-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <span>{{ isEditing ? 'Actualizar reseña' : 'Publicar reseña' }}</span>
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

const getRatingText = (rating: number): string => {
  const texts = {
    1: '😞 Muy malo',
    2: '😕 Malo',
    3: '😐 Regular',
    4: '😊 Bueno',
    5: '🤩 ¡Excelente!'
  }
  return texts[rating as keyof typeof texts] || ''
}

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

// Validation watchers
watch(() => form.rating, (rating) => {
  if (rating < 1 || rating > 5) {
    errors.rating = 'Debes seleccionar una calificación del 1 al 5'
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
  errors.imageUrl = 'No se pudo cargar la imagen. Verifica que la URL sea correcta.'
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

<style lang="scss" scoped>
.review-form {
  padding: 1.5rem;

  &__form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  &__section {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  &__label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;

    &-icon {
      color: #FF416C;
      flex-shrink: 0;
    }
  }

  // Rating Section
  &__rating {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    background: #fafbfc;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
  }

  &__rating-text {
    text-align: center;
  }

  &__rating-description {
    font-size: 1rem;
    font-weight: 600;
    color: #374151;
  }

  &__rating-placeholder {
    font-size: 0.875rem;
    color: #9ca3af;
    font-style: italic;
  }

  // Comment Section
  &__textarea-wrapper {
    position: relative;
  }

  &__textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 0.875rem;
    line-height: 1.5;
    resize: vertical;
    min-height: 100px;
    background: white;
    transition: all 0.2s ease;
    font-family: inherit;

    &:focus {
      outline: none;
      border-color: #FF416C;
      box-shadow: 0 0 0 3px rgba(255, 65, 108, 0.1);
    }

    &--error {
      border-color: #ef4444;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }

    &::placeholder {
      color: #9ca3af;
    }
  }

  &__textarea-hint {
    position: absolute;
    top: 0.75rem;
    left: 0.75rem;
    font-size: 0.75rem;
    color: #9ca3af;
    pointer-events: none;
    background: white;
    padding: 0 0.25rem;
  }

  &__comment-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  &__comment-info {
    flex: 1;
  }

  &__char-count {
    font-size: 0.75rem;
    color: #9ca3af;
    font-weight: 500;

    &--warning {
      color: #f59e0b;
      font-weight: 600;
    }
  }

  // Image Section
  &__image-section {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  &__input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 0.875rem;
    background: white;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: #FF416C;
      box-shadow: 0 0 0 3px rgba(255, 65, 108, 0.1);
    }

    &--error {
      border-color: #ef4444;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }

    &::placeholder {
      color: #9ca3af;
    }
  }

  &__image-tip {
    font-size: 0.75rem;
    color: #6b7280;
  }

  &__image-preview {
    margin-top: 0.75rem;
  }

  &__preview-container {
    position: relative;
    display: inline-block;
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &__preview-image {
    width: 150px;
    height: 100px;
    object-fit: cover;
    display: block;
  }

  &__preview-remove {
    position: absolute;
    top: 0.25rem;
    right: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(239, 68, 68, 0.8);
    }
  }

  // Error Messages
  &__error {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #ef4444;
    font-size: 0.75rem;
    font-weight: 500;

    svg {
      flex-shrink: 0;
    }
  }

  // Actions
  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e5e7eb;

    @media (max-width: 640px) {
      flex-direction: column-reverse;
    }
  }

  &__cancel {
    padding: 0.75rem 1.25rem;
    background: #f8fafc;
    color: #64748b;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
      background: #f1f5f9;
      color: #475569;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  &__submit {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: #FF416C;
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
      background: #e63946;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    &-icon,
    &-spinner {
      flex-shrink: 0;
    }

    &-spinner {
      animation: spin 1s linear infinite;

      .spinner-track {
        opacity: 0.3;
      }

      .spinner-path {
        opacity: 0.8;
      }
    }
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 640px) {
  .review-form {
    padding: 1rem;

    &__rating {
      padding: 1rem;
    }

    &__actions {
      gap: 0.5rem;
    }

    &__cancel,
    &__submit {
      width: 100%;
      justify-content: center;
    }
  }
}
</style>
