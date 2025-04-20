<!-- components/feature/restaurant/RestaurantCard.vue -->
<template>
    <!-- Asegúrate de que la ruta sea '/restaurants/:id' en lugar de '/restaurant/:id' -->
    <router-link :to="`/restaurants/${restaurant.id}`" class="restaurant-card">
        <div class="restaurant-card__image-wrapper">
            <img :src="restaurant.image" :alt="restaurant.name" class="restaurant-card__image">

            <div class="restaurant-card__badges">
                <span v-if="restaurant.isNew" class="restaurant-card__badge restaurant-card__badge--new">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="16"></line>
                        <line x1="8" y1="12" x2="16" y2="12"></line>
                    </svg>
                    Nuevo
                </span>
                <span v-if="restaurant.featured" class="restaurant-card__badge restaurant-card__badge--featured">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <polygon
                            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2">
                        </polygon>
                    </svg>
                    Destacado
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
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#FFCC00" stroke="#FFCC00" stroke-width="0.5"
                        stroke-linecap="round" stroke-linejoin="round">
                        <polygon
                            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2">
                        </polygon>
                    </svg>
                    <span>{{ restaurant.rating }}</span>
                    <span class="restaurant-card__reviews">({{ restaurant.reviewCount }})</span>
                </div>
            </div>

            <div class="restaurant-card__info">
                <span>{{ restaurant.cuisine }}</span>
                <span class="dot-separator"></span>
                <span>{{ restaurant.priceRange }}</span>
                <span class="dot-separator"></span>
                <span>{{ restaurant.distance }} km</span>
            </div>

            <div class="restaurant-card__delivery-info">
                <div v-if="restaurant.deliveryFee === 0" class="restaurant-card__free-delivery">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Envío gratis
                </div>
                <div v-else class="restaurant-card__fee">
                    Envío: ${{ restaurant.deliveryFee.toFixed(2) }}
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
    </router-link>
</template>

<script setup>
defineProps({
    restaurant: {
        type: Object,
        required: true
    }
});
</script>

<style lang="scss" scoped>
// Variables
$primary-color: #06C167; // Color principal de Uber Eats
$black: #000000;
$white: #FFFFFF;
$light-gray: #F6F6F6;
$medium-gray: #EEEEEE;
$dark-gray: #545454;
$text-primary: #000000;
$text-secondary: #757575;
$success-color: #06C167;
$warning-color: #FF8000;
$border-radius: 16px;
$box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
$transition: all 0.2s ease;

.restaurant-card {
    display: flex;
    flex-direction: column;
    background-color: $white;
    border-radius: $border-radius;
    overflow: hidden;
    box-shadow: $box-shadow;
    cursor: pointer;
    transition: $transition;
    text-decoration: none;
    color: inherit;
    height: 100%;

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);

        .restaurant-card__image {
            transform: scale(1.05);
        }
    }

    &__image-wrapper {
        position: relative;
        height: 176px;
        overflow: hidden;
    }

    &__image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
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
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 600;

        &--new {
            background-color: $success-color;
            color: $white;
        }

        &--featured {
            background-color: $warning-color;
            color: $white;
        }
    }

    &__delivery-time {
        position: absolute;
        bottom: 12px;
        right: 12px;
        background-color: rgba(0, 0, 0, 0.7);
        color: $white;
        border-radius: 4px;
        padding: 4px 8px;
        font-size: 12px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 4px;
    }

    &__content {
        padding: 16px;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
    }

    &__header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 8px;
    }

    &__name {
        font-size: 18px;
        font-weight: 700;
        color: $text-primary;
        margin: 0;
    }

    &__rating {
        display: flex;
        align-items: center;
        gap: 4px;
        font-weight: 600;
        font-size: 14px;
        color: $text-primary;
    }

    &__reviews {
        color: $text-secondary;
        font-weight: 400;
        font-size: 13px;
    }

    &__info {
        margin-bottom: 12px;
        color: $text-secondary;
        font-size: 14px;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 4px;
    }

    &__delivery-info {
        margin-top: auto;
        font-size: 14px;
        margin-bottom: 8px;
    }

    &__free-delivery {
        color: $success-color;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 4px;
    }

    &__fee {
        color: $text-secondary;
    }

    &__promo {
        background: linear-gradient(to right, #fff8e1, #ffffff);
        padding: 10px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        color: #b45309;
        margin-top: 8px;

        svg {
            color: #f59e0b;
            flex-shrink: 0;
        }
    }
}

// Dot separator
.dot-separator {
    width: 4px;
    height: 4px;
    background-color: $medium-gray;
    border-radius: 50%;
    display: inline-block;
}
</style>