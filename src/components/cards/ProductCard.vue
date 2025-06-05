<template>
  <div class="product-card" @click="$emit('click')">
    <div class="product-card__image-wrapper">
      <img
        :src="product.imageUrl"
        :alt="product.name"
        class="product-card__image"
      />
      <div class="product-card__overlay"></div>
      
      <!-- Rating del producto en la esquina -->
      <div v-if="productRating && productRating.totalReviews > 0" class="product-card__rating-badge">
        <div class="product-card__rating-stars">
          <RatingStars :rating="productRating.averageRating" size="small" />
        </div>
        <span class="product-card__rating-score">{{ productRating.averageRating.toFixed(1) }}</span>
      </div>
      
      <div v-if="!product.isAvailable" class="product-card__unavailable">
        <span class="product-card__unavailable-text">No disponible</span>
      </div>
      <img
        src="https://recetasdecocina.elmundo.es/wp-content/uploads/2024/09/tortilla-de-patatas-con-cebolla-1024x683.jpg"
        alt="Producto no disponible"
        class="product-card__unavailable-icon">
        <img
        src="https://recetasdecocina.elmundo.es/wp-content/uploads/2024/09/tortilla-de-patatas-con-cebolla-1024x683.jpg"
        alt="Producto no disponible"
        class="product-card__unavailable-icon"><img
        src="https://recetasdecocina.elmundo.es/wp-content/uploads/2024/09/tortilla-de-patatas-con-cebolla-1024x683.jpg"
        alt="Producto no disponible"
        class="product-card__unavailable-icon"><img
        src="https://recetasdecocina.elmundo.es/wp-content/uploads/2024/09/tortilla-de-patatas-con-cebolla-1024x683.jpg"
        alt="Producto no disponible"
        class="product-card__unavailable-icon"><img
        src="https://recetasdecocina.elmundo.es/wp-content/uploads/2024/09/tortilla-de-patatas-con-cebolla-1024x683.jpg"
        alt="Producto no disponible"
        class="product-card__unavailable-icon">
      <div class="product-card__price">
        €{{ formatPrice(product.basePrice) }}
      </div>
    </div>
    
    <div class="product-card__content">
      <div class="product-card__header">
        <h3 class="product-card__name">{{ product.name }}</h3>
        <div v-if="product.category" class="product-card__category">
          {{ product.category.name }}
        </div>
      </div>
      
      <p v-if="product.description" class="product-card__description">
        {{ truncateDescription(product.description, 80) }}
      </p>
      
      <!-- Reviews summary -->
      <div v-if="productRating && productRating.totalReviews > 0" class="product-card__reviews">
        <div class="product-card__reviews-summary">
          <RatingStars :rating="productRating.averageRating" size="small" />
          <span class="product-card__reviews-count">({{ productRating.totalReviews }} reseñas)</span>
        </div>
        <button 
          @click.stop="showProductReviews"
          class="product-card__reviews-btn"
        >
          Ver reseñas
        </button>
      </div>
    </div>

    <!-- Product Reviews Modal -->
    <div v-if="showReviewsModal" class="product-card__modal" @click.stop="closeReviewsModal">
      <div class="product-card__modal-backdrop"></div>
      <div class="product-card__modal-container" @click.stop>
        <div class="product-card__modal-header">
          <div class="product-card__modal-title">
            <h2>Reseñas de {{ product.name }}</h2>
            <div v-if="productRating" class="product-card__modal-rating">
              <RatingStars :rating="productRating.averageRating" size="medium" />
              <span class="product-card__modal-rating-text">
                {{ productRating.averageRating.toFixed(1) }} de 5 ({{ productRating.totalReviews }} reseñas)
              </span>
            </div>
          </div>
          <button
            @click="closeReviewsModal"
            class="product-card__modal-close"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="product-card__modal-content">
          <ReviewsSection 
            :restaurant-id="restaurantId" 
            :product-id="product.id"
            title="del producto"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { SearchProduct } from '@/services/searchService'
import type { ProductReviewSummary } from '@/types/review'
import RatingStars from '@/components/ui/RatingStars.vue'
import ReviewsSection from '@/components/reviews/ReviewsSection.vue'
import { useReviews } from '@/composables/useReviews'

interface Props {
  product: SearchProduct
  restaurantId?: number
}

const props = withDefaults(defineProps<Props>(), {
  restaurantId: 0
})

const emit = defineEmits<{
  click: []
}>()

const { getProductReviewSummary } = useReviews()

const productRating = ref<ProductReviewSummary | null>(null)
const showReviewsModal = ref(false)

const formatPrice = (price: number): string => {
  return price.toFixed(2)
}

const truncateDescription = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text || ''
  return text.substring(0, maxLength).trim() + '...'
}

const showProductReviews = () => {
  showReviewsModal.value = true
}

const closeReviewsModal = () => {
  showReviewsModal.value = false
}

onMounted(async () => {
  // Cargar resumen de reseñas del producto
  if (props.product.id) {
    try {
      const summary = await getProductReviewSummary(props.product.id)
      if (summary && summary.stats.totalReviews > 0) {
        productRating.value = summary
      }
    } catch (error) {
      console.error('Error loading product rating:', error)
    }
  }
})
</script>

<style lang="scss" scoped>
// Variables
$primary: #FF416C;
$primary-light: rgba(255, 65, 108, 0.1);
$secondary: #FF4B2B;
$success: #06C167;
$warning: #FFC837;
$danger: #EF4444;
$dark: #1e293b;
$light: #f8fafc;
$text: #1e293b;
$text-light: #64748b;
$text-lighter: #94a3b8;
$border: #e2e8f0;
$white: #ffffff;

.product-card {
  background: $white;
  border-radius: 15px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  position: relative;
  transform-style: preserve-3d;

  &::before {
    content: '';
    position: absolute;
    inset: -1px;
    background: linear-gradient(45deg,
      transparent 30%,
      rgba($primary, 0.1) 40%,
      rgba($secondary, 0.15) 50%,
      rgba($primary, 0.1) 60%,
      transparent 70%
    );
    border-radius: 16px;
    opacity: 0;
    transition: opacity 0.6s ease;
    z-index: -1;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg,
      rgba($white, 0.1) 0%,
      transparent 50%,
      rgba($primary, 0.05) 100%
    );
    border-radius: 15px;
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
    z-index: 10;
  }

  &:hover {
    transform: translateY(-8px) rotateX(1deg) rotateY(-1deg);
    box-shadow:
      0 15px 30px rgba(0, 0, 0, 0.15),
      0 0 0 1px rgba($primary, 0.1),
      0 0 40px rgba($primary, 0.15);

    &::before {
      opacity: 1;
    }

    &::after {
      opacity: 1;
    }

    .product-card__image {
      transform: scale(1.05);
      filter: brightness(1.1) contrast(1.02);
    }

    .product-card__name {
      color: $primary;
    }

    .product-card__rating-badge {
      transform: scale(1.05);
    }

    .product-card__reviews-btn {
      background: $primary;
      color: $white;
      transform: translateY(-2px);
    }
  }

  &__image-wrapper {
    position: relative;
    height: 160px;
    overflow: hidden;
    border-radius: 15px 15px 0 0;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  }

  &__overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.1) 50%,
      rgba(0, 0, 0, 0.2) 100%);
    opacity: 1;
    transition: opacity 0.4s ease;
  }

  &__rating-badge {
    position: absolute;
    top: 0.8rem;
    left: 0.8rem;
    background: rgba($white, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    padding: 0.4rem 0.6rem;
    display: flex;
    align-items: center;
    gap: 0.3rem;
    z-index: 3;
    border: 1px solid rgba($primary, 0.1);
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &__rating-stars {
    display: flex;
    align-items: center;
  }

  &__rating-score {
    font-size: 0.75rem;
    font-weight: 700;
    color: $text;
  }

  &__unavailable {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 4;

    &-text {
      color: $white;
      font-weight: 600;
      font-size: 0.9rem;
      padding: 0.5rem 1rem;
      background: rgba($danger, 0.9);
      border-radius: 50px;
      backdrop-filter: blur(10px);
    }
  }

  &__price {
    position: absolute;
    bottom: 0.8rem;
    right: 0.8rem;
    background: rgba(0, 0, 0, 0.8);
    color: $white;
    border-radius: 50px;
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
    font-weight: 700;
    backdrop-filter: blur(10px);
    border: 1px solid rgba($white, 0.1);
    z-index: 2;
  }

  &__content {
    padding: 1rem;
  }

  &__header {
    margin-bottom: 0.8rem;
  }

  &__name {
    font-size: 1rem;
    font-weight: 700;
    color: $dark;
    margin: 0 0 0.4rem;
    line-height: 1.3;
    transition: color 0.3s ease;
  }

  &__category {
    font-size: 0.8rem;
    color: $primary;
    font-weight: 600;
    background: $primary-light;
    padding: 0.2rem 0.6rem;
    border-radius: 50px;
    display: inline-block;
  }

  &__description {
    color: $text-light;
    font-size: 0.85rem;
    line-height: 1.5;
    margin: 0 0 0.8rem;
  }

  &__reviews {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.8rem;
    padding: 0.6rem 0.8rem;
    background: rgba($primary, 0.05);
    border-radius: 12px;
    border: 1px solid rgba($primary, 0.1);
  }

  &__reviews-summary {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__reviews-count {
    font-size: 0.75rem;
    color: $text-light;
    font-weight: 500;
  }

  &__reviews-btn {
    background: transparent;
    border: 1px solid $primary;
    color: $primary;
    padding: 0.3rem 0.8rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: $primary;
      color: $white;
      transform: translateY(-1px);
    }
  }

  &__footer {
    font-size: 0.75rem;
    color: $text-lighter;
    padding-top: 0.5rem;
    border-top: 1px solid $border;
  }

  &__business {
    font-style: italic;
  }

  // Modal styles
  &__modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }

  &__modal-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(8px);
  }

  &__modal-container {
    position: relative;
    background: $white;
    border-radius: 20px;
    width: 100%;
    max-width: 900px;
    max-height: 90vh;
    overflow: hidden;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
    z-index: 1001;
  }

  &__modal-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 2rem 2rem 1rem;
    border-bottom: 1px solid $border;
    background: linear-gradient(135deg, rgba($primary, 0.05), rgba($secondary, 0.05));
  }

  &__modal-title {
    flex: 1;

    h2 {
      font-size: 1.5rem;
      font-weight: 800;
      color: $dark;
      margin: 0 0 0.5rem;
    }
  }

  &__modal-rating {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  &__modal-rating-text {
    font-size: 0.9rem;
    color: $text-light;
    font-weight: 600;
  }

  &__modal-close {
    background: none;
    border: none;
    color: $text-light;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
      background: rgba($danger, 0.1);
      color: $danger;
    }
  }

  &__modal-content {
    overflow-y: auto;
    max-height: calc(90vh - 120px);
    padding: 1rem 2rem 2rem;

    // Custom scrollbar
    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: rgba($border, 0.3);
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
      background: linear-gradient(to bottom, $primary, $secondary);
      border-radius: 3px;
    }
  }
}

// Responsive
@media (max-width: 768px) {
  .product-card {
    &__image-wrapper {
      height: 140px;
    }

    &__content {
      padding: 0.8rem;
    }

    &__name {
      font-size: 0.9rem;
    }

    &__description {
      font-size: 0.8rem;
    }

    &__rating-badge {
      padding: 0.3rem 0.5rem;
    }

    &__rating-score {
      font-size: 0.7rem;
    }

    &__reviews {
      flex-direction: column;
      gap: 0.5rem;
      align-items: stretch;
    }

    &__reviews-btn {
      width: 100%;
      text-align: center;
    }

    &__modal-container {
      margin: 0.5rem;
      max-width: none;
    }

    &__modal-header {
      padding: 1.5rem 1rem 1rem;
      flex-direction: column;
      gap: 1rem;
      align-items: stretch;

      h2 {
        font-size: 1.2rem;
      }
    }

    &__modal-content {
      padding: 1rem;
    }
  }
}

// Dark mode support (opcional)
@media (prefers-color-scheme: dark) {
  .product-card {
    background: #1e293b;
    
    &__name {
      color: #f1f5f9;
    }
    
    &__description {
      color: #94a3b8;
    }
    
    &__footer {
      color: #64748b;
      border-top-color: #334155;
    }
    
    &__modal-container {
      background: #1e293b;
    }
    
    &__modal-header {
      border-bottom-color: #334155;
      
      h2 {
        color: #f1f5f9;
      }
    }
  }
}
</style>