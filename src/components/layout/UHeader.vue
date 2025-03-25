<template>
    <header class="u-header" :class="{ 'u-header--scrolled': scrolled }">
        <div class="u-header__container">
            <div class="u-header__menu-toggle" @click="toggleMobileMenu">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
            </div>

            <div class="u-header__logo">
                <router-link to="/" class="u-header__logo-link">
                    <span class="u-header__logo-text">Elixium Foods</span>
                </router-link>
            </div>

            <nav class="u-header__navigation" :class="{ 'u-header__navigation--active': mobileMenuOpen }">
                <div class="u-header__nav-close" @click="toggleMobileMenu">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </div>
                <router-link to="/" class="u-header__nav-link" @click="closeMobileMenu">Home</router-link>
                <router-link to="/restaurants" class="u-header__nav-link"
                    @click="closeMobileMenu">Restaurants</router-link>
                <router-link to="/special-offers" class="u-header__nav-link" @click="closeMobileMenu">Special
                    Offers</router-link>
            </nav>

            <div class="u-header__overlay" :class="{ 'u-header__overlay--active': mobileMenuOpen }"
                @click="closeMobileMenu"></div>

            <div class="u-header__actions">
                <button class="u-header__action-btn u-header__search-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </button>
                <router-link to="/cart" class="u-header__action-btn u-header__cart-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    <span class="u-header__cart-count">0</span>
                </router-link>
                <router-link to="/profile" class="u-header__action-btn u-header__profile-btn">
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
import { ref, onMounted, onUnmounted } from 'vue';

const mobileMenuOpen = ref(false);
const scrolled = ref(false);

const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value;

    // Cuando el menú está abierto, prevenir el scroll en el body
    if (mobileMenuOpen.value) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
};

const closeMobileMenu = () => {
    mobileMenuOpen.value = false;
    document.body.style.overflow = '';
};

const handleScroll = () => {
    scrolled.value = window.scrollY > 20;
};

// Eventos para detectar scroll
onMounted(() => {
    window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
    document.body.style.overflow = ''; // Asegurarse de restaurar el scroll al desmontar
});
</script>

<style lang="scss" scoped>
.u-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background-color: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    z-index: 1000;
    transition: all 0.3s ease;

    &--scrolled {
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    }

    &__container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        max-width: 1400px;
        margin: 0 auto;
        padding: 1rem 2rem;
    }

    &__menu-toggle {
        display: none;
        cursor: pointer;
        color: #333;
        transition: color 0.3s;

        &:hover {
            color: #FF6B6B;
        }

        @media (max-width: 768px) {
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }

    &__logo {
        flex: 0 0 auto;

        @media (max-width: 768px) {
            flex: 1;
            text-align: center;
        }
    }

    &__logo-link {
        text-decoration: none;
        display: flex;
        align-items: center;
    }

    &__logo-text {
        font-size: 1.5rem;
        font-weight: 700;
        background: linear-gradient(to right, #FF6B6B, #FF8E53);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
    }

    &__navigation {
        display: flex;
        align-items: center;
        gap: 2rem;
        margin: 0 2rem;

        @media (max-width: 768px) {
            position: fixed;
            top: 0;
            left: -280px;
            width: 280px;
            height: 100vh;
            background-color: white;
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
            padding: 2rem 1.5rem;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
            z-index: 1010;
            transition: left 0.3s ease;
            margin: 0;

            &--active {
                left: 0;
            }
        }
    }

    &__nav-close {
        display: none;

        @media (max-width: 768px) {
            display: block;
            position: absolute;
            top: 1rem;
            right: 1rem;
            cursor: pointer;
            color: #333;

            &:hover {
                color: #FF6B6B;
            }
        }
    }

    &__nav-link {
        text-decoration: none;
        color: #333;
        font-weight: 500;
        position: relative;
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

        &:hover,
        &.router-link-active {
            color: #FF6B6B;

            &::after {
                width: 100%;
            }
        }

        @media (max-width: 768px) {
            display: block;
            width: 100%;
            padding: 1rem 0;
            border-bottom: 1px solid #f0f0f0;

            &:last-child {
                border-bottom: none;
            }
        }
    }

    &__overlay {
        display: none;

        @media (max-width: 768px) {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;

            &--active {
                opacity: 1;
                visibility: visible;
            }
        }
    }

    &__actions {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    &__action-btn {
        background: none;
        border: none;
        cursor: pointer;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #333;
        border-radius: 50%;
        transition: all 0.3s;
        position: relative;
        text-decoration: none;

        &:hover {
            background-color: rgba(255, 107, 107, 0.1);
            color: #FF6B6B;
            transform: translateY(-2px);
        }
    }

    &__cart-count {
        position: absolute;
        top: 0;
        right: 0;
        background: linear-gradient(135deg, #FF6B6B, #FF8E53);
        color: white;
        border-radius: 50%;
        width: 18px;
        height: 18px;
        font-size: 0.7rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        box-shadow: 0 2px 5px rgba(255, 107, 107, 0.5);
    }
}
</style>