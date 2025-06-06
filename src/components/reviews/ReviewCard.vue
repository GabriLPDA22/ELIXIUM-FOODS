<!--src/components/reviews/ReviewCard.vue-->
<template>
  <div class="review-card">
    <!-- Header -->
    <div class="review-card__header">
      <div class="review-card__user">
        <div class="review-card__avatar">
          <img
            v-if="review.userAvatarUrl"
            :src="review.userAvatarUrl"
            :alt="review.userName"
          >
          <div v-else class="review-card__avatar-placeholder">
            {{ getInitials(review.userName) }}
          </div>
        </div>
        <div class="review-card__user-info">
          <h3 class="review-card__user-name">
            {{ review.userName }}
            <svg v-if="review.isVerifiedPurchase" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </h3>
          <div class="review-card__meta">
            <RatingStars :rating="review.rating" size="small" />
            <span class="review-card__time">{{ review.timeAgo || formatDate(review.createdAt) }}</span>
          </div>
          <div v-if="review.isVerifiedPurchase" class="review-card__verified">
            ✓ Compra verificada
          </div>
        </div>
      </div>

      <div class="review-card__actions" v-if="canEdit || canDelete">
        <button
          v-if="canEdit"
          @click="$emit('edit', review)"
          class="review-card__action review-card__action--edit"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>

        <button
          v-if="canDelete"
          @click="$emit('delete', review)"
          class="review-card__action review-card__action--delete"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Product info -->
    <div v-if="review.productName" class="review-card__product">
      Producto: <strong>{{ review.productName }}</strong>
    </div>

    <!-- Content -->
    <div class="review-card__content">
      <p class="review-card__comment">{{ review.comment }}</p>

      <!-- Image -->
      <div v-if="review.imageUrl" class="review-card__image">
        <img :src="review.imageUrl" :alt="`Imagen de ${review.userName}`" @click="openImage">
      </div>
    </div>

    <!-- Footer -->
    <div class="review-card__footer">
      <span class="review-card__date">{{ formatDate(review.createdAt) }}</span>
    </div>

    <!-- Image Modal -->
    <div v-if="showImageModal" class="image-modal" @click="closeImage">
      <img :src="review.imageUrl" :alt="`Imagen de ${review.userName}`">
      <button @click="closeImage" class="image-modal__close">✕</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Review } from '@/types/review'
import RatingStars from '@/components/ui/RatingStars.vue'

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

const showImageModal = ref(false)

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const markHelpful = () => {
}

const openImage = () => {
  showImageModal.value = true
}

const closeImage = () => {
  showImageModal.value = false
}
</script>

<style lang="scss" scoped>
.review-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
  }

  &__user {
    display: flex;
    gap: 0.75rem;
  }

  &__avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    background: #f1f5f9;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &-placeholder {
      width: 100%;
      height: 100%;
      background: #FF416C;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.875rem;
    }
  }

  &__user-info {
    flex: 1;
  }

  &__user-name {
    font-size: 1rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    svg {
      color: #10b981;
    }
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
  }

  &__time {
    font-size: 0.8rem;
    color: #64748b;
  }

  &__verified {
    font-size: 0.75rem;
    color: #10b981;
    font-weight: 500;
  }

  &__actions {
    display: flex;
    gap: 0.5rem;
  }

  &__action {
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;

    &--edit {
      background: rgba(59, 130, 246, 0.1);
      color: #3b82f6;

      &:hover {
        background: rgba(59, 130, 246, 0.2);
      }
    }

    &--delete {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;

      &:hover {
        background: rgba(239, 68, 68, 0.2);
      }
    }
  }

  &__product {
    background: #f8fafc;
    padding: 0.5rem;
    border-radius: 6px;
    font-size: 0.875rem;
    color: #64748b;
    margin-bottom: 1rem;
  }

  &__content {
    margin-bottom: 1rem;
  }

  &__comment {
    color: #374151;
    line-height: 1.6;
    margin: 0 0 1rem;
  }

  &__image {
    img {
      max-width: 200px;
      height: 150px;
      object-fit: cover;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        transform: scale(1.02);
      }
    }
  }

  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 1rem;
    border-top: 1px solid #f1f5f9;
  }

  &__helpful {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    background: none;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    color: #64748b;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.875rem;

    &:hover {
      border-color: #FF416C;
      color: #FF416C;
    }

    &--active {
      background: rgba(255, 65, 108, 0.1);
      border-color: #FF416C;
      color: #FF416C;
    }
  }

  &__date {
    font-size: 0.8rem;
    color: #94a3b8;
  }
}

.image-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;

  img {
    max-width: 90%;
    max-height: 90%;
    object-fit: contain;
    border-radius: 8px;
  }

  &__close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.9);
    border: none;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.2rem;
    color: #374151;
  }
}

@media (max-width: 640px) {
  .review-card {
    &__header {
      flex-direction: column;
      gap: 1rem;
    }

    &__actions {
      align-self: flex-end;
    }

    &__footer {
      flex-direction: column;
      gap: 0.75rem;
      align-items: stretch;
    }
  }
}
</style>
