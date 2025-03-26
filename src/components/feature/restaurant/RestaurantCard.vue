<!-- components/feature/restaurant/RestaurantCard.vue -->
<template>
    <router-link :to="`/restaurant/${restaurant.id}`" class="restaurant-card">
        <div class="restaurant-card__image-container">
            <img :src="restaurant.image" :alt="restaurant.name" class="restaurant-card__image">

            <div class="restaurant-card__badges">
                <span v-if="restaurant.featured" class="restaurant-card__badge restaurant-card__badge--featured">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <polygon
                            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2">
                        </polygon>
                    </svg>
                    Destacado
                </span>
                <span v-if="restaurant.isNew" class="restaurant-card__badge restaurant-card__badge--new">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="16"></line>
                        <line x1="8" y1="12" x2="16" y2="12"></line>
                    </svg>
                    Nuevo
                </span>
            </div>

            <div class="restaurant-card__delivery-time">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                </svg>
                {{ restaurant.deliveryTime }} min
            </div>
        </div>

        <div class="restaurant-card__content">
            <div class="restaurant-card__header">
                <h3 class="restaurant-card__name">{{ restaurant.name }}</h3>
                <div class="restaurant-card__rating">
                    <div class="restaurant-card__stars">
                        <span>{{ restaurant.rating }}</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#FFC107" stroke="#FFC107"
                            stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round">
                            <polygon
                                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2">
                            </polygon>
                        </svg>
                    </div>
                    <span class="restaurant-card__reviews">({{ restaurant.reviewCount }})</span>
                </div>
            </div>

            <div class="restaurant-card__details">
                <div class="restaurant-card__tags">
                    <span class="restaurant-card__tag">{{ restaurant.cuisine }}</span>
                    <span class="restaurant-card__tag">{{ restaurant.priceRange }}</span>
                    <span class="restaurant-card__tag">{{ restaurant.distance }} km</span>
                </div>

                <div class="restaurant-card__delivery">
                    <span v-if="restaurant.deliveryFee > 0">Envío: ${{ restaurant.deliveryFee.toFixed(2) }}</span>
                    <span v-else class="restaurant-card__free-delivery">Envío gratis</span>
                </div>
            </div>

            <div v-if="restaurant.promoText" class="restaurant-card__promo">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z">
                    </path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                {{ restaurant.promoText }}
            </div>
        </div>

        <div class="restaurant-card__hover-effect">
            <span class="restaurant-card__view-text">Ver restaurante</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
        </div>
    </router-link>
</template>

<script setup lang="ts">
defineProps({
    restaurant: {
        type: Object,
        required: true
    }
})
</script>

<style lang="scss" scoped>
.restaurant-card {
    display: flex;
    flex-direction: column;
    text-decoration: none;
    color: inherit;
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
    position: relative;
    height: 100%;

    &:hover {
        transform: translateY(-10px);
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);

        .restaurant-card__image {
            transform: scale(1.08);
        }

        .restaurant-card__hover-effect {
            opacity: 1;
            transform: translateY(0);
        }
    }

    &__image-container {
        position: relative;
        height: 180px;
        overflow: hidden;
    }

    &__image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
    }

    &__badges {
        position: absolute;
        top: 12px;
        left: 12px;
        display: flex;
        gap: 8px;
    }

    &__badge {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 5px 8px;
        border-radius: 20px;
        font-size: 0.7rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        backdrop-filter: blur(4px);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

        &--featured {
            background-color: rgba(255, 165, 2, 0.9);
            color: white;
        }

        &--new {
            background-color: rgba(32, 191, 107, 0.9);
            color: white;
        }
    }

    &__delivery-time {
        position: absolute;
        bottom: 12px;
        right: 12px;
        background-color: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 6px 10px;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 4px;
        backdrop-filter: blur(4px);
    }

    &__content {
        padding: 1.25rem;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
    }

    &__header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 0.75rem;
    }

    &__name {
        font-size: 1.25rem;
        font-weight: 700;
        margin: 0;
        color: #1e293b;
    }

    &__rating {
        display: flex;
        align-items: center;
        gap: 4px;
    }

    &__stars {
        display: flex;
        align-items: center;
        gap: 3px;
        font-weight: 700;
        color: #1e293b;
    }

    &__reviews {
        font-size: 0.85rem;
        color: #64748b;
    }

    &__details {
        margin-bottom: 0.75rem;
    }

    &__tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 0.5rem;
    }

    &__tag {
        background-color: #f1f5f9;
        color: #64748b;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.8rem;
    }

    &__delivery {
        font-size: 0.9rem;
        color: #64748b;
    }

    &__free-delivery {
        color: #10b981;
        font-weight: 600;
    }

    &__promo {
        margin-top: auto;
        background: linear-gradient(to right, #ffefba, #ffffff);
        padding: 10px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.85rem;
        color: #b45309;

        svg {
            color: #f59e0b;
            flex-shrink: 0;
        }
    }

    &__hover-effect {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(to right, #FF416C, #FF4B2B);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 1rem;
        opacity: 0;
        transform: translateY(100%);
        transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
        font-weight: 600;

        svg {
            transition: transform 0.3s ease;
        }

        &:hover svg {
            transform: translateX(3px);
        }
    }
}
</style>