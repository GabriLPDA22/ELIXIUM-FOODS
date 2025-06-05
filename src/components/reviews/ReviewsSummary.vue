<!--src/components/reviews/ReviewsSummary.vue-->
<template>
  <div class="review-summary">
    <div class="review-summary__header">
      <h2 class="review-summary__title">
        <svg class="review-summary__title-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        Reseñas {{ title }}
      </h2>

      <button
        v-if="canAddReview"
        @click="showReviewForm = true"
        class="review-summary__add-btn"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 4v16m8-8H4" />
        </svg>
        <span>Escribir reseña</span>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="review-summary__loading">
      <div class="review-summary__skeleton">
        <div class="skeleton skeleton--title"></div>
        <div class="skeleton skeleton--subtitle"></div>
        <div class="skeleton skeleton--chart"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="review-summary__error">
      <div class="review-summary__error-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <h3 class="review-summary__error-title">Error al cargar reseñas</h3>
      <p class="review-summary__error-text">{{ error }}</p>
      <button @click="loadReviews" class="review-summary__error-retry">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="23 4 23 10 17 10"></polyline>
          <polyline points="1 20 1 14 7 14"></polyline>
          <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
        </svg>
        Reintentar
      </button>
    </div>

    <!-- Content -->
    <div v-else class="review-summary__content">
      <!-- Stats Overview -->
      <div class="review-summary__stats">
        <!-- Overall Rating -->
        <div class="review-summary__overall">
          <div class="review-summary__overall-header">
            <h3 class="review-summary__overall-title">Calificación general</h3>
            <div class="review-summary__overall-score">
              {{ stats?.averageRating?.toFixed(1) || '0.0' }}
            </div>
          </div>

          <div class="review-summary__overall-stars">
            <RatingStars :rating="stats?.averageRating || 0" size="large" />
            <span class="review-summary__overall-count">
              ({{ stats?.totalReviews || 0 }} reseña{{ (stats?.totalReviews || 0) !== 1 ? 's' : '' }})
            </span>
          </div>

          <div class="review-summary__overall-recent">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            {{ stats?.recentReviews || 0 }} reseñas en los últimos 30 días
          </div>
        </div>

        <!-- Rating Distribution -->
        <div class="review-summary__distribution">
          <h3 class="review-summary__distribution-title">Distribución de calificaciones</h3>
          <div class="review-summary__bars">
            <div v-for="rating in [5, 4, 3, 2, 1]" :key="rating" class="rating-bar">
              <span class="rating-bar__label">{{ rating }}★</span>
              <div class="rating-bar__track">
                <div
                  class="rating-bar__fill"
                  :style="{ width: getRatingPercentage(rating) + '%' }"
                ></div>
              </div>
              <span class="rating-bar__count">{{ stats?.ratingDistribution?.[rating] || 0 }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Reviews -->
      <div v-if="recentReviews.length > 0" class="review-summary__recent">
        <h3 class="review-summary__recent-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L9 7m5 3v10-10z" />
          </svg>
          Reseñas destacadas
        </h3>
        <div class="review-summary__recent-list">
          <ReviewCard
            v-for="review in recentReviews"
            :key="review.id"
            :review="review"
            :can-edit="canEditReview(review)"
            :can-delete="canDeleteReview(review)"
            @edit="editReview"
            @delete="deleteReview"
          />
        </div>

        <div class="review-summary__show-all">
          <button @click="showAllReviews" class="review-summary__show-all-btn">
            <span>Ver todas las reseñas ({{ stats?.totalReviews }})</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="review-summary__empty">
        <div class="review-summary__empty-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 class="review-summary__empty-title">Aún no hay reseñas</h3>
        <p class="review-summary__empty-text">
          Sé el primero en compartir tu experiencia y ayuda a otros usuarios a decidir
        </p>
        <button
          v-if="canAddReview"
          @click="showReviewForm = true"
          class="review-summary__empty-cta"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 4v16m8-8H4" />
          </svg>
          Escribir la primera reseña
        </button>
      </div>
    </div>

    <!-- Review Form Modal -->
    <div v-if="showReviewForm" class="review-modal">
      <div class="review-modal__backdrop" @click="closeReviewForm"></div>
      <div class="review-modal__container">
        <div class="review-modal__header">
          <h3 class="review-modal__title">
            {{ editingReview ? 'Editar reseña' : `Reseñar ${title}` }}
          </h3>
          <button @click="closeReviewForm" class="review-modal__close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <ReviewForm
          :restaurant-id="restaurantId"
          :product-id="productId"
          :existing-review="editingReview"
          @success="onReviewSuccess"
          @cancel="closeReviewForm"
        />
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="delete-modal">
      <div class="delete-modal__backdrop" @click="showDeleteConfirm = false"></div>
      <div class="delete-modal__container">
        <div class="delete-modal__icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </div>
        <h3 class="delete-modal__title">¿Eliminar reseña?</h3>
        <p class="delete-modal__text">
          Esta acción no se puede deshacer. La reseña será eliminada permanentemente.
        </p>
        <div class="delete-modal__actions">
          <button @click="showDeleteConfirm = false" class="delete-modal__cancel">
            Cancelar
          </button>
          <button @click="confirmDelete" :disabled="loading" class="delete-modal__confirm">
            <svg v-if="loading" class="delete-modal__spinner" width="16" height="16" viewBox="0 0 24 24">
              <circle class="spinner" cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="4"></circle>
              <path class="spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span v-if="!loading">Eliminar</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Review, ReviewStats } from '@/types/review'
import RatingStars from '@/components/ui/RatingStars.vue'
import ReviewCard from './ReviewCard.vue'
import ReviewForm from './ReviewForm.vue'
import { useReviews } from '@/composables/useReviews'
import { useAuthStore } from '@/stores/auth'

interface Props {
  restaurantId: number
  productId?: number
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: ''
})

const emit = defineEmits<{
  'show-all': []
}>()

const authStore = useAuthStore()
const {
  getRestaurantReviewSummary,
  getProductReviewSummary,
  deleteReview: deleteReviewApi,
  canReviewRestaurant,
  canReviewProduct,
  loading,
  error
} = useReviews()

const stats = ref<ReviewStats | null>(null)
const recentReviews = ref<Review[]>([])
const showReviewForm = ref(false)
const showDeleteConfirm = ref(false)
const editingReview = ref<Review | null>(null)
const reviewToDelete = ref<Review | null>(null)
const canAddReview = ref(false)

const getRatingPercentage = (rating: number): number => {
  if (!stats.value?.totalReviews) return 0
  const count = stats.value.ratingDistribution[rating] || 0
  return (count / stats.value.totalReviews) * 100
}

const canEditReview = (review: Review): boolean => {
  return authStore.user?.id === review.userId
}

const canDeleteReview = (review: Review): boolean => {
  return authStore.user?.id === review.userId || authStore.user?.role === 'Admin'
}

const loadReviews = async () => {
  try {
    if (props.productId) {
      const summary = await getProductReviewSummary(props.productId)
      stats.value = summary.stats
      recentReviews.value = summary.recentReviews

      if (authStore.isAuthenticated) {
        canAddReview.value = await canReviewProduct(props.productId)
      }
    } else {
      const summary = await getRestaurantReviewSummary(props.restaurantId)
      stats.value = summary.stats
      recentReviews.value = summary.recentReviews

      if (authStore.isAuthenticated) {
        canAddReview.value = await canReviewRestaurant(props.restaurantId)
      }
    }
  } catch (err) {
    console.error('Error loading reviews:', err)
  }
}

const editReview = (review: Review) => {
  editingReview.value = review
  showReviewForm.value = true
}

const deleteReview = (review: Review) => {
  reviewToDelete.value = review
  showDeleteConfirm.value = true
}

const confirmDelete = async () => {
  if (!reviewToDelete.value) return

  try {
    await deleteReviewApi(reviewToDelete.value.id)
    await loadReviews()
    showDeleteConfirm.value = false
    reviewToDelete.value = null
  } catch (err) {
    console.error('Error deleting review:', err)
  }
}

const onReviewSuccess = async () => {
  closeReviewForm()
  await loadReviews()
}

const closeReviewForm = () => {
  showReviewForm.value = false
  editingReview.value = null
}

const showAllReviews = () => {
  emit('show-all')
}

onMounted(() => {
  loadReviews()
})
</script>

<style lang="scss" scoped>
// Variables
$primary: #FF416C;
$primary-light: rgba(255, 65, 108, 0.1);
$primary-dark: #e63946;
$secondary: #FF4B2B;
$success: #06C167;
$warning: #FFC837;
$danger: #EF4444;
$gray-50: #f9fafb;
$gray-100: #f3f4f6;
$gray-200: #e5e7eb;
$gray-300: #d1d5db;
$gray-400: #9ca3af;
$gray-500: #6b7280;
$gray-600: #4b5563;
$gray-700: #374151;
$gray-800: #1f2937;
$gray-900: #111827;

.review-summary {
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 24px;
  padding: 2rem;
  border: 1px solid rgba($primary, 0.1);
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, $primary 0%, $secondary 100%);
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid $gray-100;

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 1rem;
      align-items: stretch;
    }
  }

  &__title {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1.75rem;
    font-weight: 800;
    background: linear-gradient(135deg, $primary 0%, $secondary 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    margin: 0;

    &-icon {
      color: $primary;
    }

    @media (max-width: 768px) {
      justify-content: center;
      font-size: 1.5rem;
    }
  }

  &__add-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: linear-gradient(135deg, $primary 0%, $secondary 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    box-shadow: 0 4px 12px rgba($primary, 0.3);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba($primary, 0.4);
    }

    &:active {
      transform: translateY(0);
    }
  }

  // Loading State
  &__loading {
    padding: 2rem 0;
  }

  &__skeleton {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .skeleton {
    background: linear-gradient(90deg, $gray-200 25%, $gray-100 50%, $gray-200 75%);
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
    border-radius: 8px;

    &--title {
      height: 24px;
      width: 60%;
    }

    &--subtitle {
      height: 16px;
      width: 40%;
    }

    &--chart {
      height: 120px;
      width: 100%;
    }
  }

  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  // Error State
  &__error {
    text-align: center;
    padding: 3rem 2rem;

    &-icon {
      margin: 0 auto 1.5rem;
      color: $danger;
    }

    &-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: $gray-900;
      margin: 0 0 0.5rem;
    }

    &-text {
      color: $gray-600;
      margin: 0 0 1.5rem;
    }

    &-retry {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: $danger;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: $danger;
        transform: translateY(-1px);
      }
    }
  }

  // Stats Section
  &__stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-bottom: 2.5rem;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
  }

  &__overall {
    background: linear-gradient(135deg, rgba($success, 0.05) 0%, rgba($warning, 0.05) 100%);
    padding: 2rem;
    border-radius: 20px;
    border: 2px solid rgba($success, 0.1);
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -50%;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle, rgba($warning, 0.1) 0%, transparent 70%);
      pointer-events: none;
    }

    &-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    &-title {
      font-size: 1rem;
      font-weight: 600;
      color: $gray-700;
      margin: 0;
    }

    &-score {
      font-size: 3rem;
      font-weight: 900;
      background: linear-gradient(135deg, $success 0%, $warning 100%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      line-height: 1;
    }

    &-stars {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    &-count {
      font-size: 0.9rem;
      color: $gray-600;
      font-weight: 500;
    }

    &-recent {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      color: $gray-500;

      svg {
        color: $primary;
      }
    }
  }

  &__distribution {
    background: white;
    padding: 2rem;
    border-radius: 20px;
    border: 2px solid $gray-100;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

    &-title {
      font-size: 1rem;
      font-weight: 600;
      color: $gray-700;
      margin: 0 0 1.5rem;
    }
  }

  &__bars {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  // Recent Reviews
  &__recent {
    &-title {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 1.25rem;
      font-weight: 700;
      color: $gray-900;
      margin: 0 0 1.5rem;

      svg {
        color: $primary;
      }
    }

    &-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
  }

  &__show-all {
    text-align: center;

    &-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 2rem;
      background: white;
      color: $primary;
      border: 2px solid $primary;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: $primary;
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba($primary, 0.3);
      }
    }
  }

  // Empty State
  &__empty {
    text-align: center;
    padding: 4rem 2rem;

    &-icon {
      margin: 0 auto 2rem;
      color: $gray-400;
      animation: float 3s ease-in-out infinite;
    }

    &-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: $gray-900;
      margin: 0 0 1rem;
    }

    &-text {
      color: $gray-600;
      margin: 0 0 2rem;
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
      line-height: 1.6;
    }

    &-cta {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 2rem;
      background: linear-gradient(135deg, $primary 0%, $secondary 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      box-shadow: 0 4px 12px rgba($primary, 0.3);

      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 25px rgba($primary, 0.4);
      }
    }
  }
}

// Rating Bar Component
.rating-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;

  &__label {
    font-size: 0.875rem;
    font-weight: 600;
    color: $gray-600;
    min-width: 32px;
  }

  &__track {
    flex: 1;
    height: 8px;
    background: $gray-200;
    border-radius: 4px;
    overflow: hidden;
    position: relative;
  }

  &__fill {
    height: 100%;
    background: linear-gradient(90deg, $warning 0%, $success 100%);
    border-radius: 4px;
    transition: width 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: relative;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
      animation: shimmer-bar 2s infinite;
    }
  }

  &__count {
    font-size: 0.875rem;
    font-weight: 600;
    color: $gray-600;
    min-width: 24px;
    text-align: right;
  }
}

@keyframes shimmer-bar {
  0% { left: -100%; }
  100% { left: 100%; }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

// Modals
.review-modal, .delete-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;

  &__backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(8px);
  }

  &__container {
    position: relative;
    background: white;
    border-radius: 20px;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
    max-width: 600px;
    width: 100%;
    max-height: 90vh;
    overflow: hidden;
    animation: modalSlideIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2rem 2rem 1rem;
    border-bottom: 2px solid $gray-100;
  }

  &__title {
    font-size: 1.5rem;
    font-weight: 700;
    color: $gray-900;
    margin: 0;
  }

  &__close {
    background: none;
    border: none;
    color: $gray-400;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 8px;
    transition: all 0.2s ease;

    &:hover {
      background: $gray-100;
      color: $gray-600;
    }
  }
}

.delete-modal {
  &__container {
    max-width: 400px;
    text-align: center;
    padding: 2rem;
  }

  &__icon {
    margin: 0 auto 1.5rem;
    color: $danger;
  }

  &__title {
    font-size: 1.25rem;
    font-weight: 700;
    color: $gray-900;
    margin: 0 0 1rem;
  }

  &__text {
    color: $gray-600;
    margin: 0 0 2rem;
    line-height: 1.6;
  }

  &__actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  &__cancel {
    padding: 0.75rem 1.5rem;
    background: $gray-100;
    color: $gray-700;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: $gray-200;
    }
  }

  &__confirm {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: $danger;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
      background: $danger;
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }

  &__spinner {
    animation: spin 1s linear infinite;
  }
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-50px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner {
  opacity: 0.25;
}

.spinner-path {
  opacity: 0.75;
}

// Responsive
@media (max-width: 768px) {
  .review-summary {
    padding: 1.5rem;
    border-radius: 16px;
  }

  .review-modal__container,
  .delete-modal__container {
    margin: 1rem;
    max-width: none;
  }
}
</style>
