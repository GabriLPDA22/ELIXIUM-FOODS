<template>
    <div class="restaurants-page">
        <!-- Header section -->
        <header class="header">
            <div class="container">
                <h1 class="header__title">Find your favorite restaurant</h1>
                <div class="search-bar">
                    <input type="text" v-model="searchQuery" placeholder="Search restaurants..."
                        class="search-bar__input">
                    <button class="search-bar__button">
                        <span class="search-bar__icon">🔍</span>
                    </button>
                </div>
            </div>
        </header>

        <!-- Filter section with improved carousel -->
        <section class="filters">
            <div class="container">
                <div class="filters__wrapper">
                    <div class="filters__carousel">
                        <div class="category-scroll">
                            <div class="category-scroll__gradient category-scroll__gradient--left"
                                v-if="showLeftScroll"></div>
                            <div class="category-scroll__container" ref="categoriesContainer">
                                <button v-for="category in categories" :key="category.id"
                                    :class="['category-button', { 'category-button--active': selectedCategory === category.id }]"
                                    @click="selectCategory(category.id)">
                                    {{ category.name }}
                                </button>
                            </div>
                            <div class="category-scroll__gradient category-scroll__gradient--right"
                                v-if="showRightScroll"></div>
                            <button class="category-scroll__arrow category-scroll__arrow--left"
                                @click="scrollCategories('left')" v-if="showLeftScroll"
                                aria-label="Previous categories">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </button>
                            <button class="category-scroll__arrow category-scroll__arrow--right"
                                @click="scrollCategories('right')" v-if="showRightScroll" aria-label="Next categories">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div class="filters__sort">
                        <select v-model="sortBy" class="sort-select">
                            <option value="popularity">Most Popular</option>
                            <option value="rating">Highest Rated</option>
                            <option value="delivery">Delivery Time</option>
                            <option value="price">Price</option>
                        </select>
                    </div>
                </div>
            </div>
        </section>

        <!-- Restaurant list section -->
        <section class="restaurant-list">
            <div class="container">
                <div v-if="loading" class="loading-state">
                    <div class="loading-spinner"></div>
                    <p>Finding the best restaurants for you...</p>
                </div>

                <div v-else-if="filteredRestaurants.length === 0" class="empty-state">
                    <p>No restaurants found matching your criteria.</p>
                    <button @click="resetFilters" class="reset-button">Reset Filters</button>
                </div>

                <div v-else class="restaurant-grid">
                    <div v-for="restaurant in filteredRestaurants" :key="restaurant.id" class="restaurant-card"
                        @click="goToRestaurant(restaurant.id)">
                        <div class="restaurant-card__image">
                            <img :src="restaurant.coverImage" :alt="restaurant.name">
                            <span class="restaurant-card__delivery-time">{{ restaurant.deliveryTime }} min</span>
                        </div>
                        <div class="restaurant-card__content">
                            <div class="restaurant-card__header">
                                <h3 class="restaurant-card__name">{{ restaurant.name }}</h3>
                                <div class="restaurant-card__rating">
                                    <span class="restaurant-card__stars">★ {{ restaurant.rating }}</span>
                                    <span class="restaurant-card__reviews">({{ restaurant.reviewCount }})</span>
                                </div>
                            </div>
                            <div class="restaurant-card__info">
                                <div class="restaurant-card__cuisine">{{ restaurant.cuisine }}</div>
                                <div class="restaurant-card__price">{{ restaurant.priceRange }}</div>
                            </div>
                            <div class="restaurant-card__footer">
                                <span class="restaurant-card__distance">{{ restaurant.distance }} miles away</span>
                                <span class="restaurant-card__fee">Delivery: ${{ restaurant.deliveryFee }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// State
const restaurants = ref([]);
const loading = ref(true);
const searchQuery = ref('');
const selectedCategory = ref(null);
const sortBy = ref('popularity');

// Categories
const categories = [
    { id: 'all', name: 'All' },
    { id: 'american', name: 'American' },
    { id: 'italian', name: 'Italian' },
    { id: 'mexican', name: 'Mexican' },
    { id: 'asian', name: 'Asian' },
    { id: 'fastfood', name: 'Fast Food' },
    { id: 'healthy', name: 'Healthy' }
];

// Fetch restaurants (simulated)
const fetchRestaurants = async () => {
    loading.value = true;

    // Simulate API call
    setTimeout(() => {
        restaurants.value = [
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
                coverImage: 'https://images.unsplash.com/photo-1542574271-7f3b92e6c821?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
                logo: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                category: 'american'
            },
            {
                id: 2,
                name: 'Pizza Paradise',
                cuisine: 'Italian',
                priceRange: '$$',
                rating: 4.6,
                reviewCount: 258,
                deliveryTime: 35,
                deliveryFee: 3.99,
                distance: 2.5,
                coverImage: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
                logo: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                category: 'italian'
            },
            {
                id: 3,
                name: 'Taco Town',
                cuisine: 'Mexican',
                priceRange: '$',
                rating: 4.4,
                reviewCount: 187,
                deliveryTime: 20,
                deliveryFee: 1.99,
                distance: 0.8,
                coverImage: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
                logo: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                category: 'mexican'
            },
            {
                id: 4,
                name: 'Sushi Supreme',
                cuisine: 'Japanese',
                priceRange: '$$$',
                rating: 4.9,
                reviewCount: 412,
                deliveryTime: 40,
                deliveryFee: 4.99,
                distance: 3.2,
                coverImage: 'https://images.unsplash.com/photo-1553621042-f6e147245754?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
                logo: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                category: 'asian'
            },
            {
                id: 5,
                name: 'Green Leaf',
                cuisine: 'Vegetarian',
                priceRange: '$$',
                rating: 4.7,
                reviewCount: 156,
                deliveryTime: 30,
                deliveryFee: 2.49,
                distance: 1.8,
                coverImage: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
                logo: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                category: 'healthy'
            },
            {
                id: 6,
                name: 'Chicken Shack',
                cuisine: 'Fast Food',
                priceRange: '$',
                rating: 4.3,
                reviewCount: 289,
                deliveryTime: 15,
                deliveryFee: 1.49,
                distance: 0.5,
                coverImage: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
                logo: 'https://images.unsplash.com/photo-1547716752-9e0568b8f169?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                category: 'fastfood'
            },
            {
                id: 7,
                name: 'Pasta Palace',
                cuisine: 'Italian',
                priceRange: '$$',
                rating: 4.5,
                reviewCount: 201,
                deliveryTime: 35,
                deliveryFee: 3.49,
                distance: 2.7,
                coverImage: 'https://images.unsplash.com/photo-1481931098730-318b6f776db0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
                logo: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                category: 'italian'
            },
            {
                id: 8,
                name: 'Breakfast Bliss',
                cuisine: 'American',
                priceRange: '$$',
                rating: 4.7,
                reviewCount: 178,
                deliveryTime: 25,
                deliveryFee: 2.99,
                distance: 1.6,
                coverImage: 'https://images.unsplash.com/photo-1496412705862-e0088f16f791?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
                logo: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                category: 'american'
            }
        ];
        loading.value = false;
    }, 1000);
};

// Filter restaurants
const filteredRestaurants = computed(() => {
    let result = [...restaurants.value];

    // Filter by search query
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(restaurant =>
            restaurant.name.toLowerCase().includes(query) ||
            restaurant.cuisine.toLowerCase().includes(query)
        );
    }

    // Filter by category
    if (selectedCategory.value && selectedCategory.value !== 'all') {
        result = result.filter(restaurant => restaurant.category === selectedCategory.value);
    }

    // Sort restaurants
    switch (sortBy.value) {
        case 'rating':
            result.sort((a, b) => b.rating - a.rating);
            break;
        case 'delivery':
            result.sort((a, b) => a.deliveryTime - b.deliveryTime);
            break;
        case 'price':
            result.sort((a, b) => a.priceRange.length - b.priceRange.length);
            break;
        default: // popularity
            result.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    return result;
});

// Methods
const selectCategory = (categoryId) => {
    selectedCategory.value = categoryId;
};

const resetFilters = () => {
    searchQuery.value = '';
    selectedCategory.value = 'all';
    sortBy.value = 'popularity';
};

const goToRestaurant = (restaurantId) => {
    router.push(`/restaurant/${restaurantId}`);
};

// Carousel navigation state
const categoriesContainer = ref(null);
const showLeftScroll = ref(false);
const showRightScroll = ref(true);

const checkScrollPosition = () => {
    if (!categoriesContainer.value) return;

    const container = categoriesContainer.value;
    showLeftScroll.value = container.scrollLeft > 10;
    showRightScroll.value = container.scrollLeft < (container.scrollWidth - container.clientWidth - 10);
};

const scrollCategories = (direction) => {
    if (!categoriesContainer.value) return;

    const container = categoriesContainer.value;
    const scrollAmount = container.offsetWidth * 0.75;

    if (direction === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }

    // Update scroll indicators after scrolling
    setTimeout(checkScrollPosition, 300);
};

// Watch for changes to the container
onMounted(() => {
    selectCategory('all'); // Set default category
    fetchRestaurants();

    // Initial check for scroll indicators
    setTimeout(checkScrollPosition, 300);

    // Add scroll event listener
    if (categoriesContainer.value) {
        categoriesContainer.value.addEventListener('scroll', checkScrollPosition);
    }
});
</script>

<style lang="scss" scoped>
// Colors
$primary: #ff4757;
$secondary: #ff7f50;
$dark: #2f3542;
$light: #f7f7f7;
$text: #333;
$text-light: #666;
$border: #eaeaea;

// Mixins
@mixin card-shadow {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

@mixin hover-effect {
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
    }
}

// Container
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
}

// Header
.header {
    background: linear-gradient(135deg, $primary, $secondary);
    color: white;
    padding: 3rem 0;
    text-align: center;

    &__title {
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 1.5rem;
    }
}

// Search bar
.search-bar {
    display: flex;
    max-width: 600px;
    margin: 0 auto;

    &__input {
        flex: 1;
        padding: 1rem;
        border: none;
        border-radius: 8px 0 0 8px;
        font-size: 1rem;

        &:focus {
            outline: none;
        }
    }

    &__button {
        background: white;
        border: none;
        border-radius: 0 8px 8px 0;
        padding: 0 1rem;
        cursor: pointer;
    }

    &__icon {
        font-size: 1.2rem;
    }
}

// Filters
.filters {
    background: white;
    padding: 1rem 0;
    border-bottom: 1px solid $border;
    position: sticky;
    top: 0;
    z-index: 10;

    &__wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    // Filters
    &__categories {
        display: flex;
        gap: 0.75rem;
        overflow-x: auto;
        padding: 0.5rem 0;
        scrollbar-width: none;
        -webkit-overflow-scrolling: touch;
        scroll-snap-type: x mandatory;
        scroll-behavior: smooth;
        position: relative;

        &::-webkit-scrollbar {
            display: none;
        }

        &::after {
            content: '';
            padding-right: 0.75rem;
        }
    }

    &__sort {
        margin-left: 1rem;
    }
}

// Category buttons with improved design
.category-button {
    padding: 0.6rem 1.2rem;
    border: none;
    border-radius: 20px;
    background: #f5f5f5;
    font-size: 0.875rem;
    font-weight: 500;
    color: $text;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);

    &:hover {
        background: #eeeeee;
        transform: translateY(-1px);
    }

    &--active {
        background: $primary;
        color: white;
        box-shadow: 0 3px 10px rgba($primary, 0.3);

        &:hover {
            background: $primary;
        }
    }
}

// Sort dropdown
.sort-select {
    padding: 0.5rem 1rem;
    border: 1px solid $border;
    border-radius: 8px;
    background: white;
    font-size: 0.875rem;
    color: $text;
    cursor: pointer;

    &:focus {
        outline: none;
        border-color: $primary;
    }
}

// Restaurant list
.restaurant-list {
    padding: 2rem 0;
    background: $light;
    min-height: 400px;
}

// Restaurant grid
.restaurant-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
}

// Restaurant card
.restaurant-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    @include card-shadow;
    @include hover-effect;
    cursor: pointer;

    &__image {
        position: relative;
        height: 180px;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    &__delivery-time {
        position: absolute;
        bottom: 0.75rem;
        right: 0.75rem;
        background: rgba(0, 0, 0, 0.7);
        color: white;
        font-size: 0.75rem;
        font-weight: 600;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
    }

    &__content {
        padding: 1rem;
    }

    &__header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 0.5rem;
    }

    &__name {
        font-size: 1.125rem;
        font-weight: 600;
        color: $dark;
        margin: 0;
    }

    &__rating {
        display: flex;
        align-items: center;
        white-space: nowrap;
    }

    &__stars {
        color: #ffa502;
        font-weight: 600;
        margin-right: 0.25rem;
    }

    &__reviews {
        font-size: 0.75rem;
        color: $text-light;
    }

    &__info {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 0.75rem;
    }

    &__cuisine {
        font-size: 0.875rem;
        color: $text-light;
    }

    &__price {
        font-size: 0.875rem;
        color: $text-light;
    }

    &__footer {
        display: flex;
        justify-content: space-between;
        font-size: 0.75rem;
        color: $text-light;
        border-top: 1px solid $border;
        padding-top: 0.75rem;
    }
}

// Loading state
.loading-state {
    text-align: center;
    padding: 2rem;

    .loading-spinner {
        display: inline-block;
        width: 40px;
        height: 40px;
        border: 3px solid rgba($primary, 0.3);
        border-radius: 50%;
        border-top-color: $primary;
        animation: spin 1s linear infinite;
        margin-bottom: 1rem;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    p {
        color: $text-light;
    }
}

// Empty state
.empty-state {
    text-align: center;
    padding: 3rem 1rem;

    p {
        color: $text-light;
        margin-bottom: 1rem;
    }

    .reset-button {
        background: $primary;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s ease;

        &:hover {
            background: $primary;
        }
    }
}

// Media queries
@media (max-width: 768px) {
    .header {
        padding: 2rem 0;

        &__title {
            font-size: 2rem;
        }
    }

    .filters__wrapper {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
    }

    .filters__carousel {
        max-width: 100%;
        width: 100%;
    }

    .filters__sort {
        margin-left: 0;
        width: 100%;

        .sort-select {
            width: 100%;
        }
    }

    .restaurant-grid {
        grid-template-columns: 1fr;
    }
}
</style>