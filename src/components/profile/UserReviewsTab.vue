<!--src/components/profile/UserReviewsTab.vue--> 
<template>
  <div class="user-reviews-tab">
    <!-- Header -->
    <div class="user-reviews-tab__header flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Mis Reseñas</h2>
        <p class="text-gray-600 mt-1">
          Has escrito {{ userReviews.length }} reseña{{ userReviews.length !== 1 ? 's' : '' }}
        </p>
      </div>

      <!-- Filtros -->
      <div class="flex items-center gap-4">
        <select
          v-model="filters.sortBy"
          class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="newest">Más recientes</option>
          <option value="oldest">Más antiguas</option>
          <option value="highest_rating">Mejor calificación</option>
          <option value="lowest_rating">Peor calificación</option>
        </select>

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
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="animate-pulse">
        <div class="bg-gray-200 h-32 rounded-lg"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="text-gray-600 mb-4">{{ error }}</p>
      <button
        @click="loadUserReviews"
        class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
      >
        Reintentar
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredReviews.length === 0" class="text-center py-12">
      <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">
        {{ userReviews.length === 0 ? 'Aún no has escrito reseñas' : 'No se encontraron reseñas' }}
      </h3>
      <p class="text-gray-600 mb-6">
        {{ userReviews.length === 0 
          ? 'Comparte tu experiencia con otros usuarios escribiendo reseñas de restaurantes y productos que hayas probado.' 
          : 'Intenta cambiar los filtros para ver más reseñas.'
        }}
      </p>
      <router-link
        v-if="userReviews.length === 0"
        to="/restaurants"
        class="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
      >
        Explorar restaurantes
      </router-link>
    </div>

    <!-- Reviews List -->
    <div v-else class="space-y-6">
      <!-- Stats Summary -->
      <div class="user-reviews-tab__stats grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-white p-4 rounded-lg border border-gray-200">
          <div class="text-2xl font-bold text-gray-900">{{ userReviews.length }}</div>
          <div class="text-sm text-gray-600">Total reseñas</div>
        </div>
        
        <div class="bg-white p-4 rounded-lg border border-gray-200">
          <div class="flex items-center gap-2">
            <span class="text-2xl font-bold text-gray-900">{{ averageUserRating.toFixed(1) }}</span>
            <RatingStars :rating="averageUserRating" size="small" />
          </div>
          <div class="text-sm text-gray-600">Rating promedio</div>
        </div>
        
        <div class="bg-white p-4 rounded-lg border border-gray-200">
          <div class="text-2xl font-bold text-gray-900">{{ totalHelpfulVotes }}</div>
          <div class="text-sm text-gray-600">Votos útiles</div>
        </div>
        
        <div class="bg-white p-4 rounded-lg border border-gray-200">
          <div class="text-2xl font-bold text-gray-900">{{ verifiedReviewsCount }}</div>
          <div class="text-sm text-gray-600">Compras verificadas</div>
        </div>
      </div>

      <!-- Reviews -->
      <div class="space-y-4">
        <UserReviewCard
          v-for="review in filteredReviews"
          :key="review.id"
          :review="review"
          @edit="editReview"
          @delete="showDeleteDialog"
        />
      </div>

      <!-- Pagination -->
      <div v-if="filteredReviews.length < userReviews.length" class="text-center mt-8">
        <button
          @click="showMore"
          class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Ver más reseñas
        </button>
      </div>
    </div>

    <!-- Edit Review Modal -->
    <div v-if="showEditModal && editingReview" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <ReviewForm
          :restaurant-id="editingReview.restaurantId"
          :product-id="editingReview.productId"
          :existing-review="editingReview"
          @success="onEditSuccess"
          @cancel="closeEditModal"
        />
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Eliminar reseña</h3>
        <p class="text-gray-600 mb-6">
          ¿Estás seguro de que quieres eliminar esta reseña? Esta acción no se puede deshacer.
        </p>
        <div class="flex justify-end gap-3">
          <button
            @click="showDeleteModal = false"
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
import { ref, computed, reactive, onMounted, watch } from 'vue'
import type { Review, ReviewFilter } from '@/types/review'
import RatingStars from '@/components/ui/RatingStars.vue'
import UserReviewCard from './UserReviewCard.vue'
import ReviewForm from '@/components/reviews/ReviewForm.vue'
import { useReviews } from '@/composables/useReviews'
import { reviewUtils } from '@/utils/reviewUtils'

interface Props {
  userId: number
}

const props = defineProps<Props>()

const { getUserReviews, deleteReview: deleteReviewFromAPI, loading, error } = useReviews()

const userReviews = ref<Review[]>([])
const editingReview = ref<Review | null>(null)
const reviewToDelete = ref<Review | null>(null)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const displayLimit = ref(10)

const filters = reactive<ReviewFilter>({
  rating: undefined,
  sortBy: 'newest'
})

const filteredReviews = computed(() => {
  let filtered = reviewUtils.filterReviews(userReviews.value, {
    rating: filters.rating ? Number(filters.rating) : undefined
  })
  
  filtered = reviewUtils.sortReviews(filtered, filters.sortBy || 'newest')
  
  return filtered.slice(0, displayLimit.value)
})

const averageUserRating = computed(() => {
  if (userReviews.value.length === 0) return 0
  const total = userReviews.value.reduce((sum, review) => sum + review.rating, 0)
  return total / userReviews.value.length
})

const totalHelpfulVotes = computed(() => {
  return userReviews.value.reduce((sum, review) => sum + review.helpfulCount, 0)
})

const verifiedReviewsCount = computed(() => {
  return userReviews.value.filter(review => review.isVerifiedPurchase).length
})

const loadUserReviews = async () => {
  if (!props.userId) return
  
  try {
    const reviews = await getUserReviews(props.userId)
    userReviews.value = reviews
  } catch (err) {
    console.error('Error loading user reviews:', err)
  }
}

const editReview = (review: Review) => {
  editingReview.value = review
  showEditModal.value = true
}

const showDeleteDialog = (review: Review) => {
  reviewToDelete.value = review
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!reviewToDelete.value) return
  
  try {
    await deleteReviewFromAPI(reviewToDelete.value.id)  // <- Usar función renombrada
    userReviews.value = userReviews.value.filter(r => r.id !== reviewToDelete.value!.id)
    showDeleteModal.value = false
    reviewToDelete.value = null
  } catch (err) {
    console.error('Error deleting review:', err)
  }
}
const onEditSuccess = () => {
  closeEditModal()
  loadUserReviews() // Reload reviews
}

const closeEditModal = () => {
  showEditModal.value = false
  editingReview.value = null
}

const showMore = () => {
  displayLimit.value += 10
}

// Watch filters to reset display limit
watch(filters, () => {
  displayLimit.value = 10
}, { deep: true })

onMounted(() => {
  loadUserReviews()
})
</script>