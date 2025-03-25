<!-- components/feature/home/CategoriesSection.vue -->
<template>
    <section class="categories">
        <div class="container">
            <h2 class="section-title">Explore Food Categories</h2>

            <div class="categories__grid">
                <router-link v-for="category in categories" :key="category.id" :to="`/category/${category.id}`"
                    class="category-card">
                    <div class="category-card__image-wrapper">
                        <div class="category-card__image">{{ category.icon }}</div>
                    </div>
                    <h3 class="category-card__title">{{ category.name }}</h3>
                    <span class="category-card__count">{{ category.restaurantCount }} Places</span>
                </router-link>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
const categories = [
    { id: 1, name: 'Burgers', icon: '🍔', restaurantCount: 42 },
    { id: 2, name: 'Pizza', icon: '🍕', restaurantCount: 37 },
    { id: 3, name: 'Sushi', icon: '🍣', restaurantCount: 24 },
    { id: 4, name: 'Salads', icon: '🥗', restaurantCount: 18 },
    { id: 5, name: 'Chicken', icon: '🍗', restaurantCount: 31 },
    { id: 6, name: 'Mexican', icon: '🌮', restaurantCount: 28 },
    { id: 7, name: 'Italian', icon: '🍝', restaurantCount: 22 },
    { id: 8, name: 'Desserts', icon: '🍦', restaurantCount: 19 }
]
</script>

<style lang="scss" scoped>
.categories {
    padding: 6rem 0;
    background-color: #f9f9f9;
}

.container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
}

.section-title {
    text-align: center;
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 3rem;
    position: relative;

    &::after {
        content: '';
        display: block;
        width: 80px;
        height: 4px;
        background: linear-gradient(to right, #FF6B6B, #FF8E53);
        margin: 1rem auto 0;
        border-radius: 4px;
    }
}

.categories__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 2rem;
}

.category-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    text-decoration: none;
    color: inherit;
    transition: transform 0.3s;

    &:hover {
        transform: translateY(-10px);

        .category-card__image {
            transform: scale(1.1);
        }
    }

    &__image-wrapper {
        width: 100%;
        height: 120px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 16px;
        background-color: white;
        margin-bottom: 1.2rem;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
        overflow: hidden;
    }

    &__image {
        font-size: 3rem;
        transition: transform 0.3s;
    }

    &__title {
        font-size: 1.2rem;
        font-weight: 600;
        margin: 0 0 0.5rem;
        color: #333;
    }

    &__count {
        font-size: 0.9rem;
        color: #777;
    }
}
</style>