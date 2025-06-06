<!-- components/feature/restaurant/RestaurantCard.vue -->
<template>
  <div class="restaurant-card"
       :class="{ 'restaurant-card--closed': !restaurant.isCurrentlyOpen }"
       @click="goToRestaurant">

    <!-- Imagen del restaurante -->
    <div class="restaurant-card__image-wrapper">
      <img :src="restaurant.coverImageUrl || restaurant.logoUrl"
           :alt="restaurant.name"
           class="restaurant-card__image" />

      <!-- Overlay para restaurantes cerrados -->
      <div v-if="!restaurant.isCurrentlyOpen" class="restaurant-card__closed-overlay">
        <div class="restaurant-card__closed-badge">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
          CERRADO
        </div>
        <div class="restaurant-card__closed-message">
          {{ getClosedMessage }}
        </div>
      </div>

      <!-- Promoción si existe -->
      <div v-if="restaurant.promoText" class="restaurant-card__promo">
        {{ restaurant.promoText }}
      </div>

      <!-- Badges de estado y características -->
      <div class="restaurant-card__badges">
        <!-- Estado principal (abierto/cerrado) -->
        <span v-if="restaurant.isCurrentlyOpen"
              class="restaurant-card__badge restaurant-card__badge--open">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Abierto
        </span>
        <span v-else class="restaurant-card__badge restaurant-card__badge--closed">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
          Cerrado
        </span>

        <!-- Badge popular (siempre mostrar en sección popular) -->
        <span class="restaurant-card__badge restaurant-card__badge--popular">
          <span class="restaurant-card__badge-icon">🔥</span>
          Popular
        </span>

        <!-- Badge destacado -->
        <span v-if="restaurant.featured"
              class="restaurant-card__badge restaurant-card__badge--featured">
          <span class="restaurant-card__badge-icon">⭐</span>
          Destacado
        </span>

        <!-- Badge nuevo -->
        <span v-if="restaurant.isNew || isNewRestaurant"
              class="restaurant-card__badge restaurant-card__badge--new">
          <span class="restaurant-card__badge-icon">✨</span>
          Nuevo
        </span>

        <!-- Badge delivery rápido -->
        <span v-if="isFastDelivery"
              class="restaurant-card__badge restaurant-card__badge--fast">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
          </svg>
          Rápido
        </span>
      </div>

      <!-- Tiempo de delivery mejorado -->
      <div class="restaurant-card__delivery-time">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        {{ getDeliveryTimeText }}
      </div>
    </div>

    <!-- Contenido del restaurante -->
    <div class="restaurant-card__content">
      <!-- Header con nombre y rating -->
      <div class="restaurant-card__header">
        <div class="restaurant-card__title-wrapper">
          <h3 class="restaurant-card__title"
              :class="{ 'restaurant-card__title--closed': !restaurant.isCurrentlyOpen }">
            {{ restaurant.name }}
          </h3>
          <div class="restaurant-card__cuisine">{{ getCuisineText }}</div>
        </div>
        <div class="restaurant-card__rating">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#FFCC00" stroke="#FFCC00" stroke-width="0.5">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          <span class="restaurant-card__rating-value">{{ restaurant.averageRating || 4.5 }}</span>
          <span class="restaurant-card__rating-count">({{ restaurant.reviewCount || Math.floor(Math.random() * 200) + 50 }})</span>
        </div>
      </div>

      <!-- Estado del restaurante mejorado -->
      <div class="restaurant-card__status"
           :class="{ 'restaurant-card__status--open': restaurant.isCurrentlyOpen }">
        <div class="restaurant-card__status-indicator"></div>
        <span class="restaurant-card__status-text">
          {{ getStatusMessage }}
        </span>
      </div>

      <!-- Descripción -->
      <p v-if="restaurant.description" class="restaurant-card__description">
        {{ truncateText(restaurant.description, 85) }}
      </p>

      <!-- Información del restaurante -->
      <div class="restaurant-card__info">
        <div class="restaurant-card__info-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>{{ restaurant.estimatedDeliveryTime || 30 }} min</span>
        </div>
        <div class="restaurant-card__info-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span>{{ restaurant.distance?.toFixed(1) || '1.2' }} km</span>
        </div>
        <div class="restaurant-card__info-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="6" width="18" height="12" rx="2" ry="2"></rect>
            <line x1="9" y1="11" x2="15" y2="11"></line>
          </svg>
          <span>{{ formatDeliveryFee(restaurant.deliveryFee) }}</span>
        </div>
      </div>

      <!-- Delivery info destacado -->
      <div v-if="(restaurant.deliveryFee || 0) === 0" class="restaurant-card__free-delivery">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        ¡Envío gratis!
      </div>

      <!-- Botón de acción mejorado -->
      <div class="restaurant-card__actions">
        <button class="restaurant-card__cta-btn"
                :class="{ 'restaurant-card__cta-btn--disabled': !restaurant.isCurrentlyOpen }"
                :disabled="!restaurant.isCurrentlyOpen"
                @click.stop="goToRestaurant">
          <span v-if="restaurant.isCurrentlyOpen">Ver menú</span>
          <span v-else>{{ getClosedButtonText }}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { RestaurantCard as RestaurantType } from '@/services/restaurantService'

interface Props {
  restaurant: RestaurantType
}

const props = defineProps<Props>()
const router = useRouter()

// Computadas
const getCuisineText = computed(() => {
  if (props.restaurant.cuisine) return props.restaurant.cuisine

  // Si viene con 'tipo' numérico, convertir
  const tipos = {
    1: 'Americano',
    2: 'Italiano',
    3: 'Mexicano',
    4: 'Asiático',
    5: 'Fast Food',
    6: 'Saludable',
    7: 'Postres',
    8: 'Vegano'
  }

  return tipos[props.restaurant.tipo] || 'Variado'
})

const isNewRestaurant = computed(() => {
  if (!props.restaurant.createdAt) return false
  const twoMonthsAgo = new Date()
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2)
  return new Date(props.restaurant.createdAt) > twoMonthsAgo
})

const isFastDelivery = computed(() => {
  return (props.restaurant.estimatedDeliveryTime || 30) <= 20
})

const getDeliveryTimeText = computed(() => {
  const time = props.restaurant.estimatedDeliveryTime || 30
  return `${time}-${time + 15} min`
})

const getStatusMessage = computed(() => {
  if (props.restaurant.isCurrentlyOpen) {
    return props.restaurant.statusMessage || 'Abierto ahora'
  } else {
    // Simular horarios de apertura
    const now = new Date()
    const hour = now.getHours()

    if (hour < 11) {
      return 'Abre a las 11:00'
    } else if (hour >= 23) {
      return 'Abre mañana a las 11:00'
    } else {
      return props.restaurant.statusMessage || 'Cerrado temporalmente'
    }
  }
})

const getClosedMessage = computed(() => {
  const now = new Date()
  const hour = now.getHours()

  if (hour < 11) {
    return 'Abre a las 11:00'
  } else if (hour >= 23) {
    return 'Abre mañana'
  } else {
    return 'Cerrado temporalmente'
  }
})

const getClosedButtonText = computed(() => {
  const now = new Date()
  const hour = now.getHours()

  if (hour < 11) {
    return 'Abre a las 11:00'
  } else if (hour >= 23) {
    return 'Abre mañana'
  } else {
    return 'Cerrado'
  }
})

// Métodos
const formatDeliveryFee = (fee: number): string => {
  return fee === 0 ? 'Gratis' : `$${fee.toFixed(2)}`
}

const truncateText = (text: string, maxLength: number): string => {
  if (!text) return ''
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

const goToRestaurant = (): void => {
  router.push(`/restaurant/${props.restaurant.id}`)
}
</script>

<style lang="scss" scoped>
.restaurant-card {
  display: block;
  background: white;
  border-radius: 24px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  position: relative;
  transform-style: preserve-3d;
  border: 1px solid rgba(255, 255, 255, 0.2);

  // Shimmer effect
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 161, 2, 0.1),
      rgba(255, 107, 43, 0.15),
      rgba(255, 161, 2, 0.1),
      transparent
    );
    transition: left 0.8s ease;
    z-index: 1;
    pointer-events: none;
    opacity: 0;
  }

  &:hover {
    transform: translateY(-12px) rotateX(5deg) rotateY(-3deg);
    box-shadow:
      0 20px 25px -5px rgba(0, 0, 0, 0.1),
      0 10px 10px -5px rgba(0, 0, 0, 0.04),
      0 0 0 1px rgba(255, 161, 2, 0.1),
      0 0 50px rgba(255, 161, 2, 0.15);

    &::before {
      opacity: 1;
      left: 100%;
    }

    .restaurant-card__image {
      transform: scale(1.08);
      filter: brightness(1.1) contrast(1.05) saturate(1.1);
    }

    .restaurant-card__title {
      color: #FFA502;
      transform: translateX(2px);
    }

    .restaurant-card__cta-btn:not(:disabled) {
      background: linear-gradient(135deg, #FFA502 0%, #FF6B2B 50%, #E055FD 100%);
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 10px 25px rgba(255, 165, 2, 0.4);
    }

    .restaurant-card__badges {
      transform: translateY(-2px);
    }
  }

  // Estado cerrado
  &--closed {
    opacity: 0.88;

    &:hover {
      transform: translateY(-6px) rotateX(2deg) rotateY(-1deg);
      box-shadow:
        0 15px 20px -5px rgba(0, 0, 0, 0.1),
        0 5px 10px -5px rgba(0, 0, 0, 0.04);
    }
  }

  &__image-wrapper {
    position: relative;
    height: 220px;
    overflow: hidden;
    background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  }

  // Overlay para restaurantes cerrados MEJORADO
  &__closed-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 5;
    backdrop-filter: blur(3px);
    animation: fadeInOverlay 0.3s ease;
  }

  &__closed-badge {
    background: linear-gradient(135deg, #DC2626 0%, #EF4444 50%, #B91C1C 100%);
    color: white;
    padding: 1rem 2rem;
    border-radius: 50px;
    font-weight: 900;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    box-shadow:
      0 8px 25px rgba(239, 68, 68, 0.5),
      0 0 0 3px rgba(255, 255, 255, 0.1);
    border: 2px solid rgba(255, 255, 255, 0.2);
    letter-spacing: 1px;
    animation: pulse-closed 2s infinite;
    margin-bottom: 0.75rem;

    svg {
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
    }
  }

  &__closed-message {
    color: white;
    font-size: 0.9rem;
    font-weight: 600;
    background: rgba(255, 255, 255, 0.1);
    padding: 0.5rem 1rem;
    border-radius: 20px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  &__promo {
    position: absolute;
    top: 1rem;
    left: 1rem;
    background: linear-gradient(135deg, #FF416C, #FF4B2B);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 25px;
    font-size: 0.85rem;
    font-weight: 700;
    box-shadow: 0 4px 15px rgba(255, 65, 108, 0.4);
    z-index: 3;
    animation: bounceIn 0.6s ease;
  }

  &__badges {
    position: absolute;
    top: 1rem;
    right: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    z-index: 3;
    transition: transform 0.3s ease;
  }

  &__badge {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.5rem 0.9rem;
    border-radius: 30px;
    font-size: 0.75rem;
    font-weight: 800;
    backdrop-filter: blur(15px);
    border: 1.5px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
    text-transform: uppercase;
    letter-spacing: 0.5px;

    &--open {
      background: linear-gradient(135deg, #10B981 0%, #059669 50%, #047857 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
    }

    &--closed {
      background: linear-gradient(135deg, #EF4444 0%, #DC2626 50%, #B91C1C 100%);
      color: white;
      animation: pulse-closed 2s infinite;
      box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
    }

    &--popular {
      background: linear-gradient(135deg, #FF6B35 0%, #F7931E 50%, #FFD23F 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(255, 107, 53, 0.4);
      animation: glow-orange 3s ease-in-out infinite alternate;
    }

    &--featured {
      background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
    }

    &--new {
      background: linear-gradient(135deg, #EC4899 0%, #DB2777 50%, #BE185D 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(236, 72, 153, 0.4);
      animation: sparkle 2s ease-in-out infinite;
    }

    &--fast {
      background: linear-gradient(135deg, #F59E0B 0%, #D97706 50%, #B45309 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);
    }

    &-icon {
      font-size: 0.9rem;
      filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
    }
  }

  &__delivery-time {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    background: rgba(0, 0, 0, 0.9);
    color: white;
    border-radius: 30px;
    padding: 0.6rem 1.2rem;
    font-size: 0.8rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  }

  &__content {
    padding: 1.5rem;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
    gap: 1rem;
  }

  &__title-wrapper {
    flex: 1;
    min-width: 0;
  }

  &__title {
    font-size: 1.4rem;
    font-weight: 800;
    color: #1a202c;
    margin: 0 0 0.25rem;
    line-height: 1.3;
    transition: all 0.3s ease;

    &--closed {
      color: #64748B;
    }
  }

  &__cuisine {
    font-size: 0.9rem;
    color: #718096;
    font-weight: 600;
  }

  &__rating {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-weight: 700;
    font-size: 0.95rem;
    color: #1a202c;
    flex-shrink: 0;
    background: rgba(255, 204, 0, 0.1);
    padding: 0.4rem 0.8rem;
    border-radius: 20px;
    border: 1px solid rgba(255, 204, 0, 0.2);
  }

  &__rating-count {
    color: #64748b;
    font-weight: 500;
    font-size: 0.85rem;
  }

  &__status {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin-bottom: 1rem;
    padding: 0.6rem;
    border-radius: 12px;
    background: rgba(239, 68, 68, 0.05);
    border: 1px solid rgba(239, 68, 68, 0.1);

    &--open {
      background: rgba(16, 185, 129, 0.05);
      border-color: rgba(16, 185, 129, 0.1);

      .restaurant-card__status-indicator {
        background: #10B981;
        box-shadow: 0 0 10px rgba(16, 185, 129, 0.4);
      }

      .restaurant-card__status-text {
        color: #059669;
      }
    }

    &:not(&--open) {
      .restaurant-card__status-indicator {
        background: #EF4444;
        box-shadow: 0 0 10px rgba(239, 68, 68, 0.4);
        animation: pulse-dot 2s infinite;
      }

      .restaurant-card__status-text {
        color: #DC2626;
      }
    }
  }

  &__status-indicator {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  &__status-text {
    font-size: 0.9rem;
    font-weight: 700;
  }

  &__description {
    font-size: 0.9rem;
    color: #718096;
    line-height: 1.6;
    margin: 0 0 1.2rem;
  }

  &__info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  &__info-item {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.85rem;
    color: #4a5568;
    font-weight: 600;

    svg {
      color: #718096;
    }
  }

  &__free-delivery {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #059669;
    font-weight: 700;
    font-size: 0.9rem;
    background: rgba(16, 185, 129, 0.1);
    padding: 0.5rem 1rem;
    border-radius: 20px;
    margin-bottom: 1rem;
    border: 1px solid rgba(16, 185, 129, 0.2);
  }

  &__actions {
    text-align: center;
  }

  &__cta-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 30px;
    padding: 1rem 2.5rem;
    font-weight: 800;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
    width: 100%;
    justify-content: center;
    text-transform: uppercase;
    letter-spacing: 0.5px;

    &:hover:not(:disabled) {
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
    }

    &:disabled,
    &--disabled {
      background: linear-gradient(135deg, #9CA3AF 0%, #6B7280 100%);
      cursor: not-allowed;
      opacity: 0.8;

      &:hover {
        transform: none;
        box-shadow: 0 6px 20px rgba(156, 163, 175, 0.3);
      }
    }
  }
}

// Animaciones
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes pulse-closed {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
    transform: scale(1);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
    transform: scale(1.05);
  }
}

@keyframes pulse-dot {
  0%, 100% {
    box-shadow: 0 0 10px rgba(239, 68, 68, 0.4);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 15px rgba(239, 68, 68, 0.8);
    transform: scale(1.2);
  }
}

@keyframes glow-orange {
  0% { box-shadow: 0 4px 15px rgba(255, 107, 53, 0.4); }
  100% { box-shadow: 0 6px 25px rgba(255, 107, 53, 0.6); }
}

@keyframes sparkle {
  0%, 100% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.05) rotate(2deg); }
}

@keyframes bounceIn {
  0% { transform: scale(0) rotate(-180deg); opacity: 0; }
  50% { transform: scale(1.2) rotate(-90deg); opacity: 0.8; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}

@keyframes fadeInOverlay {
  0% { opacity: 0; backdrop-filter: blur(0px); }
  100% { opacity: 1; backdrop-filter: blur(3px); }
}

@media (max-width: 640px) {
  .restaurant-card {
    border-radius: 16px;

    &__content {
      padding: 1.2rem;
    }

    &__title {
      font-size: 1.2rem;
    }

    &__cta-btn {
      padding: 0.85rem 2rem;
      font-size: 0.9rem;
    }

    &__info {
      flex-direction: column;
      gap: 0.5rem;
    }
  }
}
</style>
