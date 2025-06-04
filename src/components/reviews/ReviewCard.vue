<!--src/components/reviews/ReviewCard.vue-->
<template>
  <article class="review-card bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
    <!-- Header -->
    <header class="review-card__header flex items-start justify-between mb-4">
      <div class="review-card__user flex items-center gap-3">
        <img 
          :src="review.userAvatarUrl || '/default-avatar.png'" 
          :alt="review.userName"
          class="w-10 h-10 rounded-full object-cover"
          @error="onImageError"
        />
        <div>
          <h3 class="review-card__user-name font-semibold text-gray-900">
            {{ review.userName }}
          </h3>
          <div class="flex items-center gap-2">
            <RatingStars :rating="review.rating" size="small" />
            <span class="text-sm text-gray-500">{{ review.timeAgo }}</span>
            <span 
              v-if="review.isVerifiedPurchase" 
              class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full"
            >
              ✓ Compra verificada
            </span>
          </div>
        </div>
      </div>
      
      <div class="review-card__actions flex items-center gap-2">
        <button
          v-if="canEdit"
          @click="$emit('edit', review)"
          class="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
          title="Editar reseña"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        
        <button
          v-if="canDelete"
          @click="$emit('delete', review)"
          class="text-gray-400 hover:text-red-600 p-1 rounded transition-colors"
          title="Eliminar reseña"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </header>

    <!-- Product info if applicable -->
    <div v-if="review.productName" class="review-card__product mb-3 text-sm text-gray-600">
      Producto: <span class="font-medium">{{ review.productName }}</span>
    </div>

    <!-- Content -->
    <div class="review-card__content">
      <p class="review-card__comment text-gray-800 leading-relaxed mb-4">
        {{ review.comment }}
      </p>

      <!-- Image if available -->
      <div v-if="review.imageUrl" class="review-card__image mb-4">
        <img 
          :src="review.imageUrl" 
          :alt="'Imagen de reseña de ' + review.userName"
          class="max-w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
          @click="openImageModal"
          @error="onReviewImageError"
        />
      </div>
    </div>

    <!-- Footer -->
    <footer class="review-card__footer flex items-center justify-between pt-4 border-t border-gray-100">
      <button
        @click="markAsHelpful"
        :disabled="loading"
        class="review-card__helpful flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L9 7m5 3v10-10z" />
        </svg>
        <span>Útil ({{ review.helpfulCount }})</span>
      </button>

      <time class="text-xs text-gray-400" :datetime="review.createdAt">
        {{ new Date(review.createdAt).toLocaleDateString() }}
      </time>
    </footer>

    <!-- Image Modal -->
    <div 
      v-if="showImageModal" 
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      @click="closeImageModal"
    >
      <img 
        :src="review.imageUrl" 
        :alt="'Imagen de reseña de ' + review.userName"
        class="max-w-full max-h-full object-contain"
        @click.stop
      />
      <button 
        @click="closeImageModal"
        class="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl"
      >
        ✕
      </button>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Review } from '@/types/review'
import RatingStars from '@/components/ui/RatingStars.vue'
import { useReviews } from '@/composables/useReviews'

interface Props {
  review: Review
  canEdit?: boolean
  canDelete?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  canEdit: false,
  canDelete: false
})

const emit = defineEmits<{
  edit: [review: Review]
  delete: [review: Review]
}>()

const { markAsHelpful: markReviewAsHelpful } = useReviews()

const loading = ref(false)
const showImageModal = ref(false)

const markAsHelpful = async () => {
  loading.value = true
  try {
    await markReviewAsHelpful(props.review.id)
  } catch (error) {
    console.error('Error marking review as helpful:', error)
  } finally {
    loading.value = false
  }
}

const openImageModal = () => {
  showImageModal.value = true
}

const closeImageModal = () => {
  showImageModal.value = false
}

const onImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/default-avatar.png'
}

const onReviewImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
}
</script>

<style scoped>
.review-card {
  @apply transition-all duration-200;
}

.review-card:hover {
  @apply shadow-lg;
}

.review-card__helpful:hover svg {
  @apply text-blue-600;
}
</style>