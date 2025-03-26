<!-- components/layout/UHeader.vue -->
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
                    <span class="u-header__logo-icon">🍽️</span>
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

                <div class="u-header__nav-logo">
                    <span class="u-header__logo-icon">🍽️</span>
                    <span class="u-header__logo-text">Elixium Foods</span>
                </div>

                <div class="u-header__nav-links">
                    <router-link to="/" class="u-header__nav-link" @click="closeMobileMenu">
                        <span class="u-header__nav-link-icon">🏠</span>
                        <span class="u-header__nav-link-text">Inicio</span>
                    </router-link>
                    <router-link to="/restaurants" class="u-header__nav-link" @click="closeMobileMenu">
                        <span class="u-header__nav-link-icon">🍔</span>
                        <span class="u-header__nav-link-text">Restaurantes</span>
                    </router-link>
                    <router-link to="/special-offers" class="u-header__nav-link" @click="closeMobileMenu">
                        <span class="u-header__nav-link-icon">🏷️</span>
                        <span class="u-header__nav-link-text">Ofertas</span>
                    </router-link>
                    <router-link to="/about" class="u-header__nav-link" @click="closeMobileMenu">
                        <span class="u-header__nav-link-icon">ℹ️</span>
                        <span class="u-header__nav-link-text">Nosotros</span>
                    </router-link>
                </div>

                <div class="u-header__nav-footer">
                    <button class="u-header__nav-button">
                        <span>Iniciar Sesión</span>
                    </button>
                </div>
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
                        <path d="M9 20a1 1 0 1 0 0 2 1 1 0 1 0 0-2z"></path>
                        <path d="M20 20a1 1 0 1 0 0 2 1 1 0 1 0 0-2z"></path>
                        <path d="M1 1h4l2.6 13.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6L23 5H6"></path>
                    </svg>
                    <span class="u-header__cart-count">3</span>
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
    z-index: 1000;
    transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.05);

    &--scrolled {
        box-shadow: 0 5px 30px rgba(0, 0, 0, 0.1);
        background-color: rgba(255, 255, 255, 0.98);
    }

    &__container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        max-width: 1400px;
        margin: 0 auto;
        padding: 0.75rem 2rem;
    }

    &__menu-toggle {
        display: none;
        width: 40px;
        height: 40px;
        border-radius: 10px;
        background-color: white;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        cursor: pointer;
        color: #1e293b;
        transition: all 0.3s ease;
        align-items: center;
        justify-content: center;

        &:hover {
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            color: #FF416C;
        }

        @media (max-width: 992px) {
            display: flex;
        }
    }

    &__logo {
        flex: 0 0 auto;

        @media (max-width: 992px) {
            flex: 1;
            text-align: center;
        }
    }

    &__logo-link {
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    &__logo-icon {
        font-size: 1.5rem;
    }

    &__logo-text {
        font-size: 1.5rem;
        font-weight: 800;
        background: linear-gradient(to right, #FF416C, #FF4B2B);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        letter-spacing: -0.03em;
    }

    &__navigation {
        display: flex;
        align-items: center;
        margin: 0 2rem;

        @media (max-width: 992px) {
            position: fixed;
            top: 0;
            left: -320px;
            width: 300px;
            height: 100vh;
            background-color: white;
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
            padding: 1.5rem;
            box-shadow: 0 0 30px rgba(0, 0, 0, 0.1);
            z-index: 1010;
            transition: left 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
            margin: 0;
            overflow-y: auto;

            &--active {
                left: 0;
            }
        }
    }

    &__nav-close {
        display: none;

        @media (max-width: 992px) {
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            top: 1rem;
            right: 1rem;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background-color: #f1f5f9;
            cursor: pointer;
            color: #64748b;
            transition: all 0.2s ease;

            &:hover {
                background-color: #e2e8f0;
                color: #1e293b;
            }
        }
    }

    &__nav-logo {
        display: none;

        @media (max-width: 992px) {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid #f1f5f9;
            width: 100%;
        }
    }

    &__nav-links {
        display: flex;
        align-items: center;
        gap: 1rem;

        @media (max-width: 992px) {
            flex-direction: column;
            align-items: flex-start;
            width: 100%;
            gap: 0;
        }
    }

    &__nav-link {
        text-decoration: none;
        color: #1e293b;
        font-weight: 500;
        position: relative;
        padding: 0.75rem 1rem;
        border-radius: 10px;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;

        &-icon {
            display: none;

            @media (max-width: 992px) {
                display: inline-block;
                font-size: 1.2rem;
            }
        }

        &:hover {
            color: #FF416C;
            background-color: rgba(#FF416C, 0.05);
        }

        &.router-link-active {
            color: #FF416C;
            background-color: rgba(#FF416C, 0.08);
            font-weight: 600;
        }

        @media (max-width: 992px) {
            width: 100%;
            padding: 0.9rem 1rem;
            border-radius: 10px;

            &:not(:last-child) {
                border-bottom: 1px solid #f8fafc;
            }
        }
    }

    &__nav-footer {
        display: none;

        @media (max-width: 992px) {
            display: flex;
            width: 100%;
            margin-top: auto;
            padding-top: 1.5rem;
            border-top: 1px solid #f1f5f9;
        }
    }

    &__nav-button {
        width: 100%;
        padding: 0.9rem;
        border: none;
        border-radius: 10px;
        background: linear-gradient(to right, #FF416C, #FF4B2B);
        color: white;
        font-weight: 600;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.3s ease;
        font-family: inherit;

        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(#FF416C, 0.3);
        }
    }

    &__overlay {
        display: none;

        @media (max-width: 992px) {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(15, 23, 42, 0.5);
            backdrop-filter: blur(3px);
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
        gap: 0.5rem;
    }

    &__action-btn {
        background: none;
        border: none;
        cursor: pointer;
        width: 42px;
        height: 42px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #1e293b;
        border-radius: 10px;
        transition: all 0.3s ease;
        position: relative;
        text-decoration: none;
        background-color: white;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);

        &:hover {
            color: #FF416C;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            transform: translateY(-2px);
        }

        &:active {
            transform: translateY(0);
        }
    }

    &__cart-count {
        position: absolute;
        top: -5px;
        right: -5px;
        background: linear-gradient(135deg, #FF416C, #FF4B2B);
        color: white;
        border-radius: 10px;
        min-width: 20px;
        height: 20px;
        font-size: 0.7rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        box-shadow: 0 2px 5px rgba(#FF416C, 0.3);
        padding: 0 6px;
    }
}
</style>