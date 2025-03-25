<!-- components/layout/UHeader.vue -->
<template>
    <header class="u-header" :class="{ 'u-header--scrolled': scrolled }">
        <div class="u-header__container">
            <div class="u-header__logo">
                <router-link to="/" class="u-header__logo-link">
                    <div class="u-header__logo-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 18H20M4 6H20H4ZM4 12H20H4Z" stroke="url(#paint0_linear)" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round" />
                            <defs>
                                <linearGradient id="paint0_linear" x1="4" y1="12" x2="20" y2="12"
                                    gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#FF6B6B" />
                                    <stop offset="1" stop-color="#FF8E53" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <h1 class="u-header__title">Elixium Foods</h1>
                </router-link>
            </div>

            <nav class="u-header__nav">
                <ul class="u-header__nav-list">
                    <li class="u-header__nav-item">
                        <router-link to="/" class="u-header__nav-link">Home</router-link>
                    </li>
                    <li class="u-header__nav-item">
                        <router-link to="/restaurants" class="u-header__nav-link">Restaurants</router-link>
                    </li>
                    <li class="u-header__nav-item">
                        <router-link to="/special-offers" class="u-header__nav-link">Special Offers</router-link>
                    </li>
                </ul>
            </nav>

            <div class="u-header__actions">
                <button class="u-header__icon-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </button>
                <router-link to="/cart" class="u-header__icon-btn u-header__cart-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    <span class="u-header__cart-count">0</span>
                </router-link>
                <router-link to="/profile" class="u-header__icon-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                </router-link>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const scrolled = ref(false)

const handleScroll = () => {
    scrolled.value = window.scrollY > 20
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})
</script>

<style lang="scss" scoped>
.u-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background-color: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);

    &--scrolled {
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
        background-color: rgba(255, 255, 255, 0.95);
    }

    &__container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem 2rem;
        max-width: 1400px;
        margin: 0 auto;
    }

    &__logo-link {
        display: flex;
        align-items: center;
        text-decoration: none;
        color: inherit;
    }

    &__logo-icon {
        margin-right: 0.75rem;
    }

    &__title {
        font-size: 1.5rem;
        font-weight: 700;
        margin: 0;
        background: linear-gradient(135deg, #FF6B6B, #FF8E53);
        -webkit-background-clip: text;
        color: transparent;
        background-clip: text;
        letter-spacing: -0.5px;
    }

    &__nav-list {
        display: flex;
        list-style: none;
        padding: 0;
        margin: 0;
    }

    &__nav-item {
        margin: 0 1.2rem;
    }

    &__nav-link {
        position: relative;
        text-decoration: none;
        color: #333;
        font-weight: 500;
        padding: 0.5rem 0;
        transition: color 0.3s;

        &::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 0;
            height: 2px;
            background: linear-gradient(to right, #FF6B6B, #FF8E53);
            transition: width 0.3s ease;
        }

        &.router-link-active,
        &:hover {
            color: #FF6B6B;

            &::after {
                width: 100%;
            }
        }
    }

    &__actions {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    &__icon-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: none;
        background: transparent;
        color: #333;
        cursor: pointer;
        transition: all 0.3s;
        text-decoration: none;

        &:hover {
            background: rgba(255, 107, 107, 0.1);
            color: #FF6B6B;
            transform: translateY(-2px);
        }
    }

    &__cart-btn {
        position: relative;
    }

    &__cart-count {
        position: absolute;
        top: 0;
        right: 0;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: linear-gradient(135deg, #FF6B6B, #FF8E53);
        color: white;
        font-size: 0.7rem;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 5px rgba(255, 107, 107, 0.5);
    }
}

@media (max-width: 768px) {
    .u-header {
        &__nav {
            display: none; // Implementaríamos un menú hamburguesa para móvil
        }

        &__title {
            font-size: 1.3rem;
        }
    }
}
</style>