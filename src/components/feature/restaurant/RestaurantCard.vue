<!-- components/feature/restaurant/RestaurantCard.vue -->
<template>
    <div class="restaurant-card" :class="{ 'restaurant-card--featured': restaurant.featured }">
        <div class="restaurant-card__image">
            <img :src="restaurant.image" :alt="restaurant.name" />
            <div v-if="restaurant.featured" class="restaurant-card__badge">Featured</div>
            <div v-if="restaurant.deliveryFee === 0" class="restaurant-card__tag">Free Delivery</div>
        </div>

        <div class="restaurant-card__content">
            <div class="restaurant-card__info">
                <h3 class="restaurant-card__name">{{ restaurant.name }}</h3>
                <div class="restaurant-card__meta">
                    <span class="restaurant-card__cuisine">{{ restaurant.cuisine }}</span>
                    <span class="restaurant-card__dot">•</span>
                    <span class="restaurant-card__price">{{ restaurant.priceRange }}</span>
                </div>
            </div>

            <div class="restaurant-card__rating">
                <div class="restaurant-card__stars">
                    <span class="restaurant-card__star">★</span>
                    <span>{{ restaurant.rating.toFixed(1) }}</span>
                </div>
                <div class="restaurant-card__reviews">({{ restaurant.reviewCount }})</div>
            </div>
        </div>

        <div class="restaurant-card__footer">
            <div class="restaurant-card__stat">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>{{ restaurant.deliveryTime }} min</span>
            </div>

            <div class="restaurant-card__stat">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path
                        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z">
                    </path>
                </svg>
                <span>{{ getDistanceText(restaurant.distance) }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Restaurant {
    id: number;
    name: string;
    cuisine: string;
    priceRange: string;
    rating: number;
    reviewCount: number;
    deliveryTime: number;
    deliveryFee: number;
    distance: number;
    featured: boolean;
    image: string;
}

const props = defineProps<{
    restaurant: Restaurant
}>()

const getDistanceText = (distance: number) => {
    return distance < 1 ? `${(distance * 1000).toFixed(0)} m` : `${distance.toFixed(1)} km`
}
</script>

<style lang="scss" scoped>
.restaurant-card {
    background-color: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;

    &:hover {
        transform: translateY(-10px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);

        .restaurant-card__image img {
            transform: scale(1.05);
        }
    }

    &--featured {
        box-shadow: 0 10px 30px rgba(255, 107, 107, 0.15);

        &:hover {
            box-shadow: 0 20px 40px rgba(255, 107, 107, 0.2);
        }
    }

    &__image {
        position: relative;
        height: 180px;
        overflow: hidden;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
    }

    &__badge {
        position: absolute;
        top: 1rem;
        left: 1rem;
        background: linear-gradient(135deg, #FF6B6B, #FF8E53);
        color: white;
        font-size: 0.8rem;
        font-weight: 600;
        padding: 0.3rem 0.8rem;
        border-radius: 50px;
        z-index: 1;
    }

    &__tag {
        position: absolute;
        bottom: 1rem;
        left: 1rem;
        background: rgba(0, 0, 0, 0.7);
        color: white;
        font-size: 0.75rem;
        font-weight: 500;
        padding: 0.3rem 0.8rem;
        border-radius: 50px;
        z-index: 1;
    }

    &__content {
        padding: 1.5rem;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #f0f0f0;
    }

    &__name {
        font-size: 1.2rem;
        font-weight: 600;
        margin: 0 0 0.5rem;
        color: #333;
    }

    &__meta {
        display: flex;
        align-items: center;
        color: #777;
        font-size: 0.9rem;
    }

    &__dot {
        margin: 0 0.5rem;
    }

    &__rating {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    }

    &__stars {
        display: flex;
        align-items: center;
        color: #333;
        font-weight: 600;
    }

    &__star {
        color: #FFD700;
        margin-right: 0.3rem;
    }

    &__reviews {
        font-size: 0.8rem;
        color: #777;
    }

    &__footer {
        padding: 1rem 1.5rem;
        display: flex;
        justify-content: space-between;
    }

    &__stat {
        display: flex;
        align-items: center;
        color: #777;
        font-size: 0.9rem;

        svg {
            margin-right: 0.5rem;
            color: #FF6B6B;
        }
    }
}
</style>