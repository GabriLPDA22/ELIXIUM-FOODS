<!--src/components/reviews/ReviewsSection.vue-->
<template>
  <section class="reviews-section">
    <!-- Summary Section -->
    <ReviewSummary
      :restaurant-id="restaurantId"
      :product-id="productId"
      :title="title"
      @show-all="showAllReviews = true"
    />

    <!-- All Reviews Modal -->
    <div v-if="showAllReviews" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <!-- Header -->
        <header class="reviews-modal__header flex items-center justify-between p-6 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">
            Todas las reseñas {{ title }}
          </h2>
          <button
            @click="showAllReviews = false"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <!-- Filters -->
        <div class="reviews-modal__filters p-6 border-b border-gray-200 bg-gray-50">
          <div class="flex flex-wrap gap-4">
            <!-- Rating Filter -->
            <select
              v-model="filters.rating"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Todas las calificaciones</option>
              <option value="5">5 estrellas</option>
              <option value="4">4 estrellas</option>
              <option value="3">3 estrellas</option>
              <option value="2">2 estrellas</option>
              <option value="1">1 estrella</option>
            </select>

            <!-- Sort Filter -->
            <select
              v-model="filters.sortBy"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="newest">Más recientes</option>
              <option value="oldest">Más antiguas</option>
              <option value="highest_rating">Mejor calificación</option>
              <option value="lowest_rating">Peor calificación</option>
              <option value="most_helpful">Más útiles</option>
            </select>

            <!-- Verified Filter -->
            <label class="flex items-center gap-2">
              <input
                v-model="filters.verifiedOnly"
                type="checkbox"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              >
              <span class="text-sm text-gray-700">Solo compras verificadas</span>
            </label>

            <!-- With Images Filter -->
            <label class="flex items-center gap-2">
              <input
                v-model="filters.withImages"
                type="checkbox"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              >
              <span class="text-sm text-gray-700">Con imágenes</span>
            </label>
          </div>
        </div>

        <!-- Reviews List -->
        <div class="reviews-modal__content flex-1 overflow-y-auto p-6">
          <div v-if="reviewsLoading" class="space-y-4">
            <div v-for="i in 3" :key="i" class="animate-pulse">
              <div class="bg-gray-200 h-32 rounded-lg"></div>
            </div>
          </div>

          <div v-else-if="filteredReviews.length === 0" class="text-center py-12">
            <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0118 12M6 20.5a8.966 8.966 0 01-2.427-1.116M18 20.5a8.966 8.966 0 002.427-1.116M6 20.5a8.966 8.966 0 01-2.427-1.116" />
            </svg>
            <p class="text-gray-600">No se encontraron reseñas con los filtros aplicados</p>
          </div>

          <div v-else class="space-y-6">
            <ReviewCard
              v-for="review in filteredReviews"
              :key="review.id"
              :review="review"
              :can-edit="canEditReview(review)"
              :can-delete="canDeleteReview(review)"
              @edit="editReview"
              @delete="deleteReview"
            />

            <!-- Load More Button -->
            <div v-if="hasMoreReviews" class="text-center">
              <button
                @click="loadMoreReviews"
                :disabled="reviewsLoading"
                class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Cargar más reseñas
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import type { Review, ReviewFilter } from '@/types/review'
import ReviewSummary from './ReviewsSummary.vue'
import ReviewCard from './ReviewCard.vue'
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

const authStore = useAuthStore()
const { 
  getRestaurantReviews, 
  getProductReviews, 
  deleteReview: deleteReviewApi 
} = useReviews()

const showAllReviews = ref(false)
const reviewsLoading = ref(false)
const allReviews = ref<Review[]>([])
const currentPage = ref(1)
const hasMoreReviews = ref(true)

const filters = reactive<ReviewFilter>({
  rating: undefined,
  verifiedOnly: false,
  withImages: false,
  sortBy: 'newest',
  page: 1,
  pageSize: 10
})

const filteredReviews = computed(() => {
  return allReviews.value // Los filtros se aplican en el backend
})

const canEditReview = (review: Review): boolean => {
  return authStore.user?.id === review.userId
}

const canDeleteReview = (review: Review): boolean => {
  return authStore.user?.id === review.userId || authStore.user?.role === 'Admin'
}

const loadReviews = async (append = false) => {
  reviewsLoading.value = true
  
  try {
    const filtersCopy = { ...filters }
    filtersCopy.page = append ? currentPage.value : 1
    
    let reviews: Review[]
    if (props.productId) {
      reviews = await getProductReviews(props.productId, filtersCopy)
    } else {
      reviews = await getRestaurantReviews(props.restaurantId, filtersCopy)
    }
    
    if (append) {
      allReviews.value.push(...reviews)
    } else {
      allReviews.value = reviews
      currentPage.value = 1
    }
    
    hasMoreReviews.value = reviews.length === filters.pageSize
    
  } catch (error) {
    console.error('Error loading reviews:', error)
  } finally {
    reviewsLoading.value = false
  }
}

const loadMoreReviews = async () => {
  currentPage.value++
  await loadReviews(true)
}

const editReview = (review: Review) => {
  // Implementar edición de reseña
  console.log('Edit review:', review)
}

const deleteReview = async (review: Review) => {
  if (confirm('¿Estás seguro de que quieres eliminar esta reseña?')) {
    try {
      await deleteReviewApi(review.id)
      allReviews.value = allReviews.value.filter(r => r.id !== review.id)
    } catch (error) {
      console.error('Error deleting review:', error)
    }
  }
}

// Watch filters for changes
watch(filters, () => {
  if (showAllReviews.value) {
    loadReviews()
  }
}, { deep: true })

// Load reviews when modal opens
watch(showAllReviews, (show) => {
  if (show) {
    loadReviews()
  }
})
</script>

<style scoped>
.reviews-modal__content {
  min-height: 0; /* For proper flex sizing */
}
</style>