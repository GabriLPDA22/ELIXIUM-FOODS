<!-- components/feature/restaurant/RestaurantCard.vue -->
<template>
  <router-link :to="`/restaurants/${restaurant.id}`" class="restaurant-card">
    <div class="restaurant-card__image-wrapper">
      <img :src="restaurant.coverImageUrl || restaurant.logoUrl" :alt="restaurant.name"
        class="restaurant-card__image" />
      <div v-if="restaurant.promoText" class="restaurant-card__promo">{{ restaurant.promoText }}</div>
      <div class="restaurant-card__badges">
        <span v-if="restaurant.featured"
          class="restaurant-card__badge restaurant-card__badge--featured">Destacado</span>
        <span v-if="restaurant.isNew" class="restaurant-card__badge restaurant-card__badge--new">Nuevo</span>
      </div>
    </div>

    <div class="restaurant-card__content">
      <div class="restaurant-card__header">
        <div class="restaurant-card__title-wrapper">
          <h3 class="restaurant-card__title">{{ restaurant.name }}</h3>
          <div class="restaurant-card__cuisine">{{ restaurant.cuisine }}</div>
        </div>
        <div class="restaurant-card__rating">
          <span class="restaurant-card__rating-value">★ {{ restaurant.averageRating }}</span>
          <span class="restaurant-card__rating-count">({{ restaurant.reviewCount }})</span>
        </div>
      </div>

      <p class="restaurant-card__description">{{ restaurant.description }}</p>

      <div class="restaurant-card__info">
        <div class="restaurant-card__info-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>{{ restaurant.estimatedDeliveryTime }} min</span>
        </div>
        <div class="restaurant-card__info-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span>{{ restaurant.distance?.toFixed(1) }} km</span>
        </div>
        <div class="restaurant-card__info-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="6" width="18" height="12" rx="2" ry="2"></rect>
            <line x1="9" y1="11" x2="15" y2="11"></line>
          </svg>
          <span>{{ formatDeliveryFee(restaurant.deliveryFee) }}</span>
        </div>
      </div>

      <div class="restaurant-card__status" :class="{ 'restaurant-card__status--open': restaurant.isOpen }">
        {{ restaurant.isOpen ? 'Abierto' : 'Cerrado' }}
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { type RestaurantCard as RestaurantType } from '@/services/restaurantService'

interface Props {
  restaurant: RestaurantType
}

const props = defineProps < Props > ()

const formatDeliveryFee = (fee: number): string => {
  return fee === 0 ? 'Envío gratis' : `€${fee.toFixed(2)} envío`
}
</script>

<style lang="scss" scoped>
.restaurant-card {
  display: block;
  text-decoration: none;
  color: inherit;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }

  &__image-wrapper {
    position: relative;
    aspect-ratio: 16 / 9;
    overflow: hidden;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;

    .restaurant-card:hover & {
      transform: scale(1.05);
    }
  }

  &__promo {
    position: absolute;
    top: 16px;
    left: 16px;
    background: linear-gradient(135deg, #FF416C, #FF4B2B);
    color: white;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 600;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &__badges {
    position: absolute;
    top: 16px;
    right: 16px;
    display: flex;
    gap: 8px;
  }

  &__badge {
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;

    &--featured {
      background: #FFA502;
      color: white;
    }

    &--new {
      background: #10b981;
      color: white;
    }
  }

  &__content {
    padding: 1rem;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 8px;
  }

  &__title-wrapper {
    flex: 1;
    min-width: 0;
  }

  &__title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1a202c;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__cuisine {
    font-size: 0.875rem;
    color: #718096;
    margin-top: 2px;
  }

  &__rating {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
    margin-left: 8px;
  }

  &__rating-value {
    font-weight: 600;
    color: #2d3748;
  }

  &__rating-count {
    font-size: 0.875rem;
    color: #718096;
  }

  &__description {
    font-size: 0.875rem;
    color: #718096;
    margin-bottom: 16px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  &__info {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }

  &__info-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.875rem;
    color: #4a5568;

    svg {
      color: #718096;
    }
  }

  &__status {
    padding: 4px 12px;
    border-radius: 16px;
    font-size: 0.875rem;
    font-weight: 600;
    background: #fed7d7;
    color: #c53030;
    width: fit-content;

    &--open {
      background: #c6f6d5;
      color: #2f855a;
    }
  }
}

@media (max-width: 640px) {
  .restaurant-card {
    border-radius: 12px;

    &__content {
      padding: 0.875rem;
    }

    &__info {
      flex-direction: column;
      gap: 8px;
    }
  }
}
</style>
