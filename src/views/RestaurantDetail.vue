<template>
    <div class="restaurant-page">
        <!-- Hero section with restaurant cover image -->
        <div class="hero" :style="{ backgroundImage: `url(${restaurant.coverImage})` }">
            <div class="hero__overlay"></div>
            <div class="hero__content container">
                <div class="restaurant-badge">
                    <div class="restaurant-badge__logo" v-if="restaurant.logo">
                        <img :src="restaurant.logo" :alt="restaurant.name">
                    </div>
                    <div class="restaurant-badge__info">
                        <h1 class="restaurant-badge__name">{{ restaurant.name }}</h1>
                        <div class="restaurant-badge__meta">
                            <span class="badge badge--cuisine">{{ restaurant.cuisine }}</span>
                            <span class="badge badge--price">{{ restaurant.priceRange }}</span>
                            <div class="rating">
                                <span class="rating__stars">★ {{ restaurant.rating }}</span>
                                <span class="rating__count">({{ restaurant.reviewCount }})</span>
                            </div>
                        </div>
                        <div class="restaurant-badge__details">
                            <div class="detail-item">
                                <span class="detail-item__icon">🕒</span>
                                <span class="detail-item__text">{{ restaurant.deliveryTime }} min</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-item__icon">🚚</span>
                                <span class="detail-item__text">${{ restaurant.deliveryFee }} delivery</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-item__icon">📍</span>
                                <span class="detail-item__text">{{ restaurant.distance }} miles away</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Sticky navigation -->
        <nav class="menu-nav">
            <div class="container">
                <ul class="menu-nav__list">
                    <li v-for="(category, index) in menuCategories" :key="index" class="menu-nav__item">
                        <a href="#" @click.prevent="scrollToSection(category.name)" class="menu-nav__link">
                            {{ category.name }}
                        </a>
                    </li>
                </ul>
            </div>
        </nav>

        <!-- Menu content -->
        <div class="container">
            <div class="menu-content">
                <div v-for="(category, index) in menuCategories" :key="index" class="menu-section"
                    :id="category.name.replace(/\s+/g, '-').toLowerCase()">
                    <h2 class="menu-section__title">{{ category.name }}</h2>
                    <p class="menu-section__description" v-if="category.description">{{ category.description }}</p>

                    <div class="menu-grid">
                        <div v-for="item in category.items" :key="item.id" class="menu-card">
                            <div class="menu-card__image" v-if="item.image">
                                <img :src="item.image" :alt="item.name">
                            </div>
                            <div class="menu-card__content">
                                <h3 class="menu-card__name">{{ item.name }}</h3>
                                <p class="menu-card__description">{{ item.description }}</p>
                                <div class="menu-card__footer">
                                    <span class="menu-card__price">${{ item.price.toFixed(2) }}</span>
                                    <button class="menu-card__add-btn" @click="addToCart(item)">Add</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  
  <script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// Sample restaurant data (would typically come from an API)
const restaurant = {
    id: 1,
    name: 'Burger Kingdom',
    cuisine: 'American',
    priceRange: '$$',
    rating: 4.8,
    reviewCount: 324,
    deliveryTime: 25,
    deliveryFee: 2.99,
    distance: 1.2,
    coverImage: 'https://images.unsplash.com/photo-1542574271-7f3b92e6c821?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    logo: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
};

// Enhanced menu categories with descriptions
const menuCategories = [
    {
        name: 'Popular Items',
        description: 'Our most loved dishes that customers can\'t get enough of.',
        items: [
            {
                id: 1,
                name: 'Classic Burger',
                description: 'Our signature burger with cheese, lettuce, tomato, pickles and special sauce.',
                price: 9.99,
                image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
            },
            {
                id: 2,
                name: 'Chicken Tenders',
                description: 'Crispy fried chicken tenders served with your choice of dipping sauce.',
                price: 7.99,
                image: 'https://images.unsplash.com/photo-1562967914-608f82629710?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
            }
        ]
    },
    {
        name: 'Sides',
        description: 'Perfect companions to complete your meal.',
        items: [
            {
                id: 6,
                name: 'French Fries',
                description: 'Crispy golden fries seasoned with our special blend of spices.',
                price: 3.99,
                image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
            },
            {
                id: 7,
                name: 'Onion Rings',
                description: 'Crispy, golden-brown onion rings with a side of dipping sauce.',
                price: 4.99,
                image: 'https://images.unsplash.com/photo-1575224526242-5661a6c1f505?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
            }
        ]
    }
];

// Cart functionality
const cart = ref([]);

const addToCart = (item) => {
    const existingItem = cart.value.find(cartItem => cartItem.id === item.id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.value.push({
            ...item,
            quantity: 1
        });
    }

    console.log('Added to cart:', item.name);
    console.log('Current cart:', cart.value);
};

// Scroll to menu section
const scrollToSection = (sectionName) => {
    const sectionId = sectionName.replace(/\s+/g, '-').toLowerCase();
    const element = document.getElementById(sectionId);

    if (element) {
        // Offset for sticky nav
        const navHeight = document.querySelector('.menu-nav').offsetHeight;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - navHeight - 20;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
};

// Handle sticky navigation
onMounted(() => {
    console.log('Restaurant Detail Component Mounted');
    console.log('Restaurant ID from route:', route.params.id);

    const nav = document.querySelector('.menu-nav');
    const navTop = nav.offsetTop;

    window.addEventListener('scroll', () => {
        if (window.scrollY >= navTop) {
            nav.classList.add('menu-nav--sticky');
        } else {
            nav.classList.remove('menu-nav--sticky');
        }
    });
});
</script>
  
<style lang="scss" scoped>
// Variables
$primary-color: #ff4757;
$secondary-color: #ff7f50;
$dark-color: #2f3542;
$light-color: #f1f2f6;
$accent-color: #ffa502;
$text-color: #333;
$text-light: #666;
$border-radius: 12px;
$box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
$transition: all 0.3s ease;

// Global styles
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;
}

// Hero section
.hero {
    position: relative;
    height: 280px;
    background-size: cover;
    background-position: center;
    color: white;

    &__overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.7));
        z-index: 1;
    }

    &__content {
        position: relative;
        height: 100%;
        z-index: 2;
        display: flex;
        align-items: flex-end;
        padding-bottom: 2rem;
    }
}

// Restaurant badge
.restaurant-badge {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.95);
    padding: 1.5rem;
    border-radius: $border-radius;
    color: $text-color;
    box-shadow: $box-shadow;
    width: 100%;
    transform: translateY(50%);

    &__logo {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 1.5rem;
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    &__info {
        flex: 1;
    }

    &__name {
        font-size: 1.8rem;
        font-weight: 700;
        margin: 0 0 0.5rem;
        color: $dark-color;
    }

    &__meta {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 0.8rem;
        margin-bottom: 0.8rem;
    }

    &__details {
        display: flex;
        gap: 1.5rem;
        color: $text-light;
        font-size: 0.9rem;
    }
}

// Badges
.badge {
    padding: 0.3rem 0.8rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.03em;

    &--cuisine {
        background-color: #e3f2fd;
        color: #2196f3;
    }

    &--price {
        background-color: #fef6e4;
        color: #ffa000;
    }
}

// Rating
.rating {
    display: flex;
    align-items: center;

    &__stars {
        color: $accent-color;
        font-weight: 600;
        margin-right: 0.3rem;
    }

    &__count {
        color: $text-light;
        font-size: 0.8rem;
    }
}

// Detail item
.detail-item {
    display: flex;
    align-items: center;

    &__icon {
        margin-right: 0.4rem;
    }
}

// Menu navigation
.menu-nav {
    background-color: white;
    padding: 1rem 0;
    margin-top: 4rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    z-index: 10;

    &--sticky {
        position: sticky;
        top: 0;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        animation: slideDown 0.3s ease;
    }

    &__list {
        display: flex;
        gap: 1rem;
        list-style: none;
        padding: 0;
        margin: 0;
        overflow-x: auto;
        scrollbar-width: none;

        &::-webkit-scrollbar {
            display: none;
        }
    }

    &__link {
        padding: 0.5rem 1rem;
        font-weight: 500;
        color: $text-color;
        text-decoration: none;
        white-space: nowrap;
        border-radius: 20px;
        transition: $transition;

        &:hover,
        &.active {
            background-color: rgba($primary-color, 0.1);
            color: $primary-color;
        }
    }
}

// Menu content
.menu-content {
    padding: 3rem 0;
}

// Menu section
.menu-section {
    margin-bottom: 4rem;

    &__title {
        font-size: 1.8rem;
        font-weight: 700;
        margin: 0 0 0.5rem;
        color: $dark-color;
        position: relative;
        display: inline-block;

        &::after {
            content: '';
            position: absolute;
            bottom: -0.5rem;
            left: 0;
            width: 2.5rem;
            height: 0.2rem;
            background: linear-gradient(to right, $primary-color, $secondary-color);
            border-radius: 2px;
        }
    }

    &__description {
        color: $text-light;
        margin-bottom: 2rem;
        max-width: 600px;
    }
}

// Menu grid
.menu-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
}

// Menu card
.menu-card {
    background-color: white;
    border-radius: $border-radius;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    transition: $transition;
    display: flex;
    flex-direction: column;
    height: 100%;

    &:hover {
        transform: translateY(-4px);
        box-shadow: $box-shadow;
    }

    &__image {
        height: 180px;
        overflow: hidden;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
        }

        &:hover img {
            transform: scale(1.05);
        }
    }

    &__content {
        padding: 1.2rem;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
    }

    &__name {
        font-size: 1.1rem;
        font-weight: 600;
        margin: 0 0 0.5rem;
        color: $dark-color;
    }

    &__description {
        color: $text-light;
        font-size: 0.9rem;
        margin-bottom: auto;
        padding-bottom: 1rem;
        line-height: 1.5;
    }

    &__footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 0.5rem;
    }

    &__price {
        font-weight: 700;
        color: $dark-color;
        font-size: 1.1rem;
    }

    &__add-btn {
        background: linear-gradient(to right, $primary-color, $secondary-color);
        color: white;
        border: none;
        padding: 0.5rem 1.2rem;
        border-radius: 20px;
        font-weight: 600;
        cursor: pointer;
        transition: $transition;
        font-size: 0.9rem;

        &:hover {
            opacity: 0.9;
            transform: scale(1.05);
        }
    }
}

// Animations
@keyframes slideDown {
    from {
        transform: translateY(-100%);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

// Media queries
@media (max-width: 768px) {
    .hero {
        height: 220px;
    }

    .restaurant-badge {
        flex-direction: column;
        align-items: flex-start;
        text-align: center;

        &__logo {
            margin: 0 auto 1rem;
        }

        &__meta,
        &__details {
            justify-content: center;
            width: 100%;
        }

        &__name {
            text-align: center;
        }
    }

    .menu-section__title {
        font-size: 1.5rem;
    }

    .menu-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 480px) {
    .hero__content {
        padding-bottom: 1.5rem;
    }

    .restaurant-badge {
        padding: 1rem;

        &__details {
            flex-direction: column;
            gap: 0.5rem;
            align-items: center;
        }
    }

    .menu-nav{
        margin-top: 8rem;
    }

}
</style>