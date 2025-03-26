<!-- components/feature/home/PopularRestaurantsSection.vue -->
<template>
    <section class="popular-restaurants">
        <div class="container">
            <div class="popular-restaurants__heading">
                <div>
                    <h2 class="popular-restaurants__title">Restaurantes Populares</h2>
                    <p class="popular-restaurants__description">Descubre los lugares favoritos de nuestra comunidad</p>
                </div>
                <router-link to="/restaurants" class="popular-restaurants__all-link">
                    <span>Ver todos</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                </router-link>
            </div>

            <div class="restaurant-grid">
                <restaurant-card v-for="restaurant in popularRestaurants" :key="restaurant.id"
                    :restaurant="restaurant" />
            </div>

            <div class="popular-restaurants__cta">
                <div class="cta-card">
                    <div class="cta-card__content">
                        <h3 class="cta-card__title">¿Tienes hambre?</h3>
                        <p class="cta-card__text">Descubre más restaurantes y encuentra tu nueva comida favorita</p>
                        <router-link to="/restaurants" class="cta-card__button">
                            Explorar restaurantes
                        </router-link>
                    </div>
                    <div class="cta-card__decoration">
                        <div class="cta-card__circle"></div>
                        <div class="cta-card__circle"></div>
                        <div class="cta-card__circle"></div>
                        <span class="cta-card__emoji">🍽️</span>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import RestaurantCard from '@/components/feature/restaurant/RestaurantCard.vue'

// Muestra datos mejorados para restaurantes
const popularRestaurants = [
    {
        id: 1,
        name: 'Burger Kingdom',
        cuisine: 'Americana',
        priceRange: '$$',
        rating: 4.8,
        reviewCount: 324,
        deliveryTime: 25,
        deliveryFee: 2.99,
        distance: 1.2,
        featured: true,
        isNew: false,
        promoText: 'Envío gratis en tu primer pedido',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
        id: 2,
        name: 'Pizza Paradise',
        cuisine: 'Italiana',
        priceRange: '$$',
        rating: 4.6,
        reviewCount: 215,
        deliveryTime: 30,
        deliveryFee: 1.99,
        distance: 0.8,
        featured: false,
        isNew: true,
        promoText: '15% de descuento en tu primera compra',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
        id: 3,
        name: 'Sushi Supreme',
        cuisine: 'Japonesa',
        priceRange: '$$$',
        rating: 4.9,
        reviewCount: 187,
        deliveryTime: 35,
        deliveryFee: 3.99,
        distance: 1.5,
        featured: false,
        isNew: false,
        promoText: 'Compra 1 rollo, lleva el 2do a mitad de precio',
        image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
        id: 4,
        name: 'Taco Temple',
        cuisine: 'Mexicana',
        priceRange: '$',
        rating: 4.5,
        reviewCount: 264,
        deliveryTime: 20,
        deliveryFee: 0,
        distance: 0.6,
        featured: true,
        isNew: false,
        promoText: 'Envío gratuito todo el mes',
        image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    }
]
</script>

<style lang="scss" scoped>
.popular-restaurants {
    padding: 7rem 0;
    background-color: #ffffff;
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 100%;
        background: radial-gradient(at top left, rgba(#FFA502, 0.05), transparent 60%);
        pointer-events: none;
        z-index: 0;
    }

    .container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 0 2rem;
        position: relative;
        z-index: 1;
    }

    &__heading {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 3rem;

        @media (max-width: 768px) {
            flex-direction: column;
            gap: 1rem;
        }
    }

    &__title {
        font-size: 2.75rem;
        font-weight: 800;
        margin-bottom: 1rem;
        background: linear-gradient(to right, #FFA502, #FF6B2B);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        display: inline-block;
        position: relative;

        @media (max-width: 768px) {
            font-size: 2.25rem;
        }
    }

    &__description {
        color: #64748b;
        font-size: 1.2rem;
        max-width: 550px;

        @media (max-width: 768px) {
            font-size: 1.1rem;
        }
    }

    &__all-link {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #0652DD;
        text-decoration: none;
        font-weight: 600;
        font-size: 1.1rem;
        transition: all 0.3s ease;
        padding: 0.5rem 0;
        border-bottom: 2px solid transparent;

        svg {
            transition: transform 0.3s ease;
        }

        &:hover {
            color: #FF416C;
            border-bottom-color: #FF416C;

            svg {
                transform: translateX(4px);
            }
        }
    }

    &__cta {
        margin-top: 4rem;
    }
}

.restaurant-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 2rem;

    @media (max-width: 480px) {
        grid-template-columns: 1fr;
    }
}

.cta-card {
    background: linear-gradient(135deg, #0652DD, #12CBC4);
    color: white;
    border-radius: 20px;
    overflow: hidden;
    padding: 3rem;
    display: flex;
    justify-content: space-between;
    position: relative;
    box-shadow: 0 20px 40px rgba(#0652DD, 0.15);

    &__content {
        max-width: 60%;
        position: relative;
        z-index: 2;

        @media (max-width: 768px) {
            max-width: 100%;
        }
    }

    &__title {
        font-size: 2.5rem;
        font-weight: 800;
        margin-bottom: 1rem;

        @media (max-width: 768px) {
            font-size: 2rem;
        }
    }

    &__text {
        font-size: 1.2rem;
        opacity: 0.9;
        margin-bottom: 2rem;
        line-height: 1.6;

        @media (max-width: 768px) {
            font-size: 1.1rem;
        }
    }

    &__button {
        display: inline-block;
        background: white;
        color: #0652DD;
        text-decoration: none;
        padding: 1rem 2rem;
        border-radius: 50px;
        font-weight: 600;
        font-size: 1.1rem;
        transition: all 0.3s ease;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);

        &:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
            background: #f8f9fa;
        }
    }

    &__decoration {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        width: 40%;
        overflow: hidden;

        @media (max-width: 768px) {
            opacity: 0.2;
            width: 100%;
        }
    }

    &__circle {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);

        &:nth-child(1) {
            width: 200px;
            height: 200px;
            top: -50px;
            right: -50px;
        }

        &:nth-child(2) {
            width: 150px;
            height: 150px;
            bottom: 0;
            right: 100px;
        }

        &:nth-child(3) {
            width: 100px;
            height: 100px;
            top: 50%;
            right: 50px;
            transform: translateY(-50%);
        }
    }

    &__emoji {
        position: absolute;
        font-size: 80px;
        top: 50%;
        right: 150px;
        transform: translateY(-50%);
        filter: drop-shadow(0 5px 15px rgba(0, 0, 0, 0.2));

        @media (max-width: 992px) {
            right: 50px;
        }
    }
}

@media (max-width: 768px) {
    .popular-restaurants {
        padding: 5rem 0;

        .container {
            padding: 0 1.5rem;
        }
    }

    .cta-card {
        padding: 2rem;
    }
}
</style>