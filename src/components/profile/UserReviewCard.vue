<!--src/components/profile/UserReviewCard.vue-->
<template>
  <article class="user-review-card bg-white rounded-lg border border-gray-200 p-6">
    <!-- Header -->
    <header class="user-review-card__header flex items-start justify-between mb-4">
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-1">
          <h3 class="font-semibold text-gray-900">{{ review.restaurantName }}</h3>
          <span v-if="review.isVerifiedPurchase" class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
            ✓ Verificada
          </span>
        </div>
        
        <div v-if="review.productName" class="text-sm text-gray-600 mb-2">
          Producto: <span class="font-medium">{{ review.productName }}</span>
        </div>
        
        <div class="flex items-center gap-3">
          <RatingStars :rating="review.rating" size="small" />
          <span class="text-sm text-gray-500">{{ review.timeAgo }}</span>
        </div>
      </div>
      
      <div class="flex items-center gap-2">
        <button
          @click="$emit('edit', review)"
          class="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
          title="Editar reseña"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        
        <button
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

    <!-- Content -->
    <div class="user-review-card__content">
      <p class="text-gray-800 leading-relaxed mb-4">
        {{ review.comment }}
      </p>

      <!-- Image if available -->
      <div v-if="review.imageUrl" class="mb-4">
        <img 
          :src="review.imageUrl" 
          :alt="'Imagen de reseña'"
          class="max-w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
          @click="openImageModal"
        />
      </div>
    </div>

    <!-- Footer -->
    <footer class="user-review-card__footer flex items-center justify-between pt-4 border-t border-gray-100">
      <div class="flex items-center gap-4 text-sm text-gray-600">
        <span class="flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L9 7m5 3v10-10z" />
          </svg>
          {{ review.helpfulCount }} personas encontraron esto útil
        </span>
      </div>

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
        :alt="'Imagen de reseña'"
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

interface Props {
  review: Review
}

defineProps<Props>()

defineEmits<{
  edit: [review: Review]
  delete: [review: Review]
}>()

const showImageModal = ref(false)

const openImageModal = () => {
  showImageModal.value = true
}

const closeImageModal = () => {
  showImageModal.value = false
}
</script>