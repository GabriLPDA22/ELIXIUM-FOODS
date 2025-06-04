<!--src/components/reviews/ReviewSummary.vue-->
<template>
  <div class="review-summary bg-white rounded-lg border border-gray-200 p-6">
    <div class="review-summary__header flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-gray-900">
        Reseñas {{ title }}
      </h2>
      
      <button
        v-if="canAddReview"
        @click="showReviewForm = true"
        class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Escribir reseña
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="review-summary__loading">
      <div class="animate-pulse space-y-4">
        <div class="h-4 bg-gray-200 rounded w-3/4"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2"></div>
        <div class="h-20 bg-gray-200 rounded"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="review-summary__error text-center py-8">
      <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="text-gray-600">{{ error }}</p>
      <button
        @click="loadReviews"
        class="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
      >
        Reintentar
      </button>
    </div>

    <!-- Content -->
    <div v-else class="review-summary__content">
      <!-- Stats Overview -->
      <div class="review-summary__stats grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <!-- Overall Rating -->
        <div class="review-summary__overall bg-gray-50 rounded-lg p-4">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-medium text-gray-900">Calificación general</h3>
            <span class="text-2xl font-bold text-gray-900">
              {{ stats?.averageRating.toFixed(1) || '0.0' }}
            </span>
          </div>
          
          <div class="flex items-center gap-2 mb-3">
            <RatingStars :rating="stats?.averageRating || 0" size="medium" />
            <span class="text-sm text-gray-600">
              ({{ stats?.totalReviews || 0 }} reseñas)
            </span>
          </div>
          
          <p class="text-xs text-gray-500">
            {{ stats?.recentReviews || 0 }} reseñas en los últimos 30 días
          </p>
        </div>

        <!-- Rating Distribution -->
        <div class="review-summary__distribution">
          <h3 class="font-medium text-gray-900 mb-3">Distribución de calificaciones</h3>
          <div class="space-y-2">
            <div v-for="rating in [5, 4, 3, 2, 1]" :key="rating" class="flex items-center gap-2">
              <span class="text-sm text-gray-600 w-8">{{ rating }}★</span>
              <div class="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                  :style="{ width: getRatingPercentage(rating) + '%' }"
                ></div>
              </div>
              <span class="text-sm text-gray-600 w-8 text-right">
                {{ stats?.ratingDistribution[rating] || 0 }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Reviews -->
      <div v-if="recentReviews.length > 0" class="review-summary__recent">
        <h3 class="font-medium text-gray-900 mb-4">Reseñas destacadas</h3>
        <div class="space-y-4">
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
        
        <div class="text-center mt-6">
          <button
            @click="showAllReviews"
            class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Ver todas las reseñas ({{ stats?.totalReviews }})
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="review-summary__empty text-center py-12">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          Aún no hay reseñas
        </h3>
        <p class="text-gray-600 mb-6">
          Sé el primero en compartir tu experiencia
        </p>
        <button
          v-if="canAddReview"
          @click="showReviewForm = true"
          class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Escribir la primera reseña
        </button>
      </div>
    </div>

    <!-- Review Form Modal -->
    <div v-if="showReviewForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Eliminar reseña</h3>
        <p class="text-gray-600 mb-6">
          ¿Estás seguro de que quieres eliminar esta reseña? Esta acción no se puede deshacer.
        </p>
        <div class="flex justify-end gap-3">
          <button
            @click="showDeleteConfirm = false"
            class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="confirmDelete"
            :disabled="loading"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            Eliminar
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
import { useAuthStore } from '@/stores/auth' // Asumiendo que tienes un store de auth

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
    await loadReviews() // Reload reviews
    showDeleteConfirm.value = false
    reviewToDelete.value = null
  } catch (err) {
    console.error('Error deleting review:', err)
  }
}

const onReviewSuccess = async () => {
  closeReviewForm()
  await loadReviews() // Reload reviews
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