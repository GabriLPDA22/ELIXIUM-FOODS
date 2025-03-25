<!-- components/feature/home/PopularRestaurantsSection.vue -->
<template>
    <section class="popular-restaurants">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">Popular Restaurants</h2>
                <router-link to="/restaurants" class="section-link">
                    <span>View All</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                </router-link>
            </div>

            <div class="popular-restaurants__grid">
                <restaurant-card v-for="restaurant in popularRestaurants" :key="restaurant.id"
                    :restaurant="restaurant" />
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import RestaurantCard from '@/components/feature/restaurant/RestaurantCard.vue'

const popularRestaurants = [
    {
        id: 1,
        name: 'Burger Kingdom',
        cuisine: 'American',
        priceRange: '$$',
        rating: 4.8,
        reviewCount: 324,
        deliveryTime: 25,
        deliveryFee: 2.99,
        distance: 1.2,
        featured: true,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
        id: 2,
        name: 'Pizza Paradise',
        cuisine: 'Italian',
        priceRange: '$$',
        rating: 4.6,
        reviewCount: 215,
        deliveryTime: 30,
        deliveryFee: 1.99,
        distance: 0.8,
        featured: false,
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
        id: 3,
        name: 'Sushi Supreme',
        cuisine: 'Japanese',
        priceRange: '$$$',
        rating: 4.9,
        reviewCount: 187,
        deliveryTime: 35,
        deliveryFee: 3.99,
        distance: 1.5,
        featured: false,
        image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
        id: 4,
        name: 'Taco Temple',
        cuisine: 'Mexican',
        priceRange: '$',
        rating: 4.5,
        reviewCount: 264,
        deliveryTime: 20,
        deliveryFee: 0,
        distance: 0.6,
        featured: true,
        image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    }
]
</script>

<style lang="scss" scoped>
.popular-restaurants {
    padding: 6rem 0;
    background-color: white;
}

.container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 3rem;
}

.section-title {
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0;
    position: relative;
    padding-bottom: 1rem;

    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 80px;
        height: 4px;
        background: linear-gradient(to right, #FF6B6B, #FF8E53);
        border-radius: 4px;
    }
}

.section-link {
    display: flex;
    align-items: center;
    color: #FF6B6B;
    text-decoration: none;
    font-weight: 600;
    font-size: 1.1rem;
    transition: transform 0.3s;

    span {
        margin-right: 0.5rem;
    }

    svg {
        transition: transform 0.3s;
    }

    &:hover {
        transform: translateX(3px);

        svg {
            transform: translateX(3px);
        }
    }
}

.popular-restaurants__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
}

@media (max-width: 768px) {
    .section-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
    }

    .section-title {
        font-size: 2rem;
    }
}
</style>