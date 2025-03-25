<!-- components/feature/home/HeroSection.vue -->
<template>
    <section class="hero">
        <div class="hero__container">
            <div class="hero__content">
                <h1 class="hero__title">Discover Amazing Food Near You</h1>
                <p class="hero__subtitle">Order from the best local restaurants with easy, on-demand delivery</p>

                <div class="hero__search">
                    <div class="hero__search-input-wrapper">
                        <svg class="hero__search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <input v-model="address" type="text" class="hero__search-input"
                            placeholder="Enter your delivery address" />
                    </div>
                    <button class="hero__search-button">Find Food</button>
                </div>

                <div class="hero__badges">
                    <div class="hero__badge">
                        <div class="hero__badge-icon">⭐</div>
                        <span class="hero__badge-text">4.8 App Rating</span>
                    </div>
                    <div class="hero__badge">
                        <div class="hero__badge-icon">⚡</div>
                        <span class="hero__badge-text">Fast Delivery</span>
                    </div>
                    <div class="hero__badge">
                        <div class="hero__badge-icon">↩️</div>
                        <span class="hero__badge-text">Easy Returns</span>
                    </div>
                </div>
            </div>

            <div class="hero__food-categories">
                <div v-for="(category, index) in foodCategories" :key="category.name" class="hero__food-category"
                    :class="`hero__food-category--${index + 1}`">
                    <div class="hero__food-category-icon">{{ category.icon }}</div>
                    <div class="hero__food-category-name">{{ category.name }}</div>
                </div>
            </div>
        </div>

        <div class="hero__wave">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                <path fill="#ffffff" fill-opacity="1"
                    d="M0,160L48,165.3C96,171,192,181,288,176C384,171,480,149,576,144C672,139,768,149,864,170.7C960,192,1056,224,1152,224C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
                </path>
            </svg>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const address = ref('')

const foodCategories = [
    { icon: '🍕', name: 'Pizza' },
    { icon: '🍔', name: 'Burgers' },
    { icon: '🍣', name: 'Sushi' },
    { icon: '🌮', name: 'Tacos' },
    { icon: '🥗', name: 'Salads' }
]
</script>

<style lang="scss" scoped>
.hero {
    position: relative;
    padding: 8rem 2rem 12rem;
    background: linear-gradient(120deg, #FF6B6B, #FF8E53);
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-image:
            radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 200px),
            radial-gradient(circle at 80% 60%, rgba(255, 255, 255, 0.1) 0%, transparent 200px);
    }

    &__container {
        position: relative;
        z-index: 2;
        max-width: 1400px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 5rem;
    }

    &__content {
        max-width: 700px;
    }

    &__title {
        font-size: 4rem;
        font-weight: 800;
        color: white;
        margin: 0 0 1.5rem;
        line-height: 1.1;
        letter-spacing: -1px;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

        @media (max-width: 768px) {
            font-size: 3rem;
        }
    }

    &__subtitle {
        font-size: 1.25rem;
        color: rgba(255, 255, 255, 0.9);
        line-height: 1.6;
        margin: 0 0 2.5rem;
    }

    &__search {
        display: flex;
        margin-bottom: 2.5rem;
        max-width: 600px;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
    }

    &__search-input-wrapper {
        flex: 1;
        position: relative;
        background: white;
    }

    &__search-icon {
        position: absolute;
        left: 1rem;
        top: 50%;
        transform: translateY(-50%);
        color: #FF6B6B;
    }

    &__search-input {
        width: 100%;
        border: none;
        outline: none;
        padding: 1.2rem 1rem 1.2rem 2.5rem;
        font-size: 1rem;

        &::placeholder {
            color: #aaa;
        }
    }

    &__search-button {
        background: #333;
        color: white;
        border: none;
        padding: 0 2rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
            background: #444;
        }
    }

    &__badges {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
    }

    &__badge {
        display: flex;
        align-items: center;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50px;
        padding: 0.5rem 1rem;
        backdrop-filter: blur(5px);

        &-icon {
            margin-right: 0.5rem;
        }

        &-text {
            font-weight: 500;
            color: white;
            font-size: 0.9rem;
        }
    }

    &__food-categories {
        position: relative;
        width: 100%;
        height: 0;
    }

    &__food-category {
        position: absolute;
        background: white;
        border-radius: 16px;
        padding: 1rem;
        display: flex;
        align-items: center;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        animation: float 6s ease-in-out infinite;

        &--1 {
            top: -60px;
            right: 10%;
            animation-delay: 0s;
        }

        &--2 {
            top: -150px;
            right: 30%;
            animation-delay: 1s;
        }

        &--3 {
            top: -90px;
            right: 50%;
            animation-delay: 2s;
        }

        &--4 {
            top: -120px;
            right: 70%;
            animation-delay: 1.5s;
        }

        &--5 {
            top: -40px;
            right: 85%;
            animation-delay: 0.5s;
        }

        &-icon {
            font-size: 1.8rem;
            margin-right: 0.8rem;
        }

        &-name {
            font-weight: 600;
            color: #333;
        }
    }

    &__wave {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        line-height: 0;

        svg {
            display: block;
            width: 100%;
        }
    }
}

@keyframes float {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-20px);
    }
}

@media (max-width: 992px) {
    .hero {
        &__food-category {
            display: none;

            &--1,
            &--3 {
                display: flex;
            }
        }
    }
}

@media (max-width: 576px) {
    .hero {
        &__title {
            font-size: 2.5rem;
        }

        &__search {
            flex-direction: column;
        }

        &__search-button {
            padding: 1rem;
        }
    }
}
</style>