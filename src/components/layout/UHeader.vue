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
                    <div v-if="isAuthenticated">
                        <div class="u-header__nav-user">
                            <span class="u-header__nav-user-greeting">Hola, {{ userFirstName }}</span>
                        </div>
                        <div class="u-header__nav-actions">
                            <router-link to="/profile" class="u-header__nav-button u-header__nav-button--outline"
                                @click="closeMobileMenu">
                                <span>Mi Perfil</span>
                            </router-link>
                            <button @click="handleLogout" class="u-header__nav-button">
                                <span>Cerrar Sesión</span>
                            </button>
                        </div>
                    </div>
                    <div v-else>
                        <router-link to="/login" class="u-header__nav-button" @click="closeMobileMenu">
                            <span>Iniciar Sesión</span>
                        </router-link>
                    </div>
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
                    <span class="u-header__cart-count">{{ cartItemCount }}</span>
                </router-link>

                <!-- BOTÓN DE PERFIL CON FOTO -->
                <div v-if="isAuthenticated" class="u-header__user-menu">
                    <button class="u-header__action-btn u-header__profile-btn" @click="toggleUserMenu">
                        <!-- Foto de perfil o avatar con iniciales -->
                        <div class="u-header__profile-avatar">
                            <img
                                v-if="userProfileImage"
                                :src="userProfileImage"
                                :alt="`Foto de ${userFirstName}`"
                                class="u-header__profile-image"
                                @error="onImageError"
                            />
                            <div
                                v-else
                                class="u-header__profile-initials"
                                :class="{ 'u-header__profile-initials--google': isGoogleUser }"
                            >
                                {{ userInitials }}
                            </div>
                        </div>
                    </button>

                    <div class="u-header__user-dropdown" v-if="userMenuOpen">
                        <div class="u-header__user-dropdown-header">
                            <!-- Avatar en el dropdown también -->
                            <div class="u-header__dropdown-avatar">
                                <img
                                    v-if="userProfileImage"
                                    :src="userProfileImage"
                                    :alt="`Foto de ${userFirstName}`"
                                    class="u-header__dropdown-image"
                                    @error="onImageError"
                                />
                                <div
                                    v-else
                                    class="u-header__dropdown-initials"
                                    :class="{ 'u-header__dropdown-initials--google': isGoogleUser }"
                                >
                                    {{ userInitials }}
                                </div>
                            </div>
                            <div class="u-header__dropdown-info">
                                <span class="u-header__user-dropdown-greeting">Hola, {{ userFirstName }}</span>
                                <span class="u-header__user-dropdown-email">{{ userEmail }}</span>
                                <span v-if="isGoogleUser" class="u-header__user-dropdown-badge">
                                    <svg width="12" height="12" viewBox="0 0 24 24" class="google-icon">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                    </svg>
                                    Google
                                </span>
                            </div>
                        </div>
                        <div class="u-header__user-dropdown-divider"></div>
                        <ul class="u-header__user-dropdown-menu">
                            <li>
                                <router-link to="/profile" class="u-header__user-dropdown-item" @click="closeUserMenu">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                    <span>Mi Perfil</span>
                                </router-link>
                            </li>
                            <li>
                                <router-link to="/orders" class="u-header__user-dropdown-item" @click="closeUserMenu">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                                        <path d="M2 17l10 5 10-5"></path>
                                        <path d="M2 12l10 5 10-5"></path>
                                    </svg>
                                    <span>Mis Pedidos</span>
                                </router-link>
                            </li>
                            <li>
                                <router-link to="/addresses" class="u-header__user-dropdown-item" @click="closeUserMenu">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                        <circle cx="12" cy="10" r="3"></circle>
                                    </svg>
                                    <span>Mis Direcciones</span>
                                </router-link>
                            </li>
                            <li>
                                <router-link to="/settings" class="u-header__user-dropdown-item" @click="closeUserMenu">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <circle cx="12" cy="12" r="3"></circle>
                                        <path
                                            d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z">
                                        </path>
                                    </svg>
                                    <span>Configuración</span>
                                </router-link>
                            </li>
                        </ul>
                        <div class="u-header__user-dropdown-divider"></div>
                        <button class="u-header__user-dropdown-logout" @click="handleLogout">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                <polyline points="16 17 21 12 16 7"></polyline>
                                <line x1="21" y1="12" x2="9" y2="12"></line>
                            </svg>
                            <span>Cerrar Sesión</span>
                        </button>
                    </div>
                </div>
                <router-link v-else to="/login" class="u-header__action-btn u-header__profile-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                        <polyline points="10 17 15 12 10 7"></polyline>
                        <line x1="15" y1="12" x2="3" y2="12"></line>
                    </svg>
                </router-link>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useCartStore } from '@/stores/cart';

const router = useRouter();
const authStore = useAuthStore();
const cartStore = useCartStore();

const mobileMenuOpen = ref(false);
const scrolled = ref(false);
const userMenuOpen = ref(false);

// Computed properties usando el AuthStore actualizado
const isAuthenticated = computed(() => authStore.isAuthenticated);
const userFirstName = computed(() => authStore.user?.firstName || '');
const userEmail = computed(() => authStore.user?.email || '');
const cartItemCount = computed(() => cartStore?.itemCount || 0);

// NUEVOS: Computed para foto de perfil
const userProfileImage = computed(() => authStore.userProfileImage);
const userInitials = computed(() => authStore.userInitials);
const isGoogleUser = computed(() => authStore.isGoogleUser);

// Manejar error de imagen
const onImageError = (event: Event) => {
    const img = event.target as HTMLImageElement;
    // Si la imagen falla al cargar, ocultarla para mostrar las iniciales
    img.style.display = 'none';
    console.log('Error cargando imagen de perfil, mostrando iniciales');
};

const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value;
    userMenuOpen.value = false;

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

const toggleUserMenu = () => {
    userMenuOpen.value = !userMenuOpen.value;
};

const closeUserMenu = () => {
    userMenuOpen.value = false;
};

const handleLogout = () => {
    authStore.logout();
    userMenuOpen.value = false;
    closeMobileMenu();
    router.push('/');
};

const handleScroll = () => {
    scrolled.value = window.scrollY > 20;
};

// Cerrar menú de usuario al hacer clic fuera
const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (
        userMenuOpen.value &&
        !target.closest('.u-header__user-menu') &&
        !target.closest('.u-header__profile-btn')
    ) {
        closeUserMenu();
    }
};

// Eventos para detectar scroll y clicks
onMounted(() => {
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
    document.removeEventListener('click', handleClickOutside);
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
            flex-direction: column;
            width: 100%;
            margin-top: auto;
            padding-top: 1.5rem;
            border-top: 1px solid #f1f5f9;
        }
    }

    &__nav-user {
        margin-bottom: 1rem;
        text-align: center;
    }

    &__nav-user-greeting {
        font-weight: 600;
        color: #1e293b;
        font-size: 1.1rem;
    }

    &__nav-actions {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
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
        text-decoration: none;
        text-align: center;

        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(#FF416C, 0.3);
        }

        &--outline {
            background: transparent;
            border: 2px solid #FF416C;
            color: #FF416C;

            &:hover {
                background-color: rgba(#FF416C, 0.05);
            }
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

    &__user-menu {
        position: relative;
    }

    // ESTILOS PARA FOTO DE PERFIL
    &__profile-avatar {
        position: relative;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    &__profile-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
    }

    &__profile-initials {
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #64748b, #475569);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: 600;
        border-radius: 50%;

        &--google {
            background: linear-gradient(135deg, #4285F4, #34A853);
        }
    }

    &__dropdown-avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0; // No permitir que se encoja
    }

    &__dropdown-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
    }

    &__dropdown-initials {
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #64748b, #475569);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        font-weight: 600;
        border-radius: 50%;

        &--google {
            background: linear-gradient(135deg, #4285F4, #34A853);
        }
    }

    &__dropdown-info {
        flex: 1;
        min-width: 0; // Importante para que el contenido pueda encogerse
        overflow: hidden; // Evitar desbordamiento
    }

    // DROPDOWN CORREGIDO PARA EMAILS LARGOS
    &__user-dropdown {
        position: absolute;
        top: calc(100% + 0.75rem);
        right: 0;
        width: 320px; // Aumentado de 280px a 320px para emails largos
        background-color: white;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        padding: 1rem;
        z-index: 1001;
        animation: scaleIn 0.2s ease forwards;
        transform-origin: top right;

        // En móviles, hacer el dropdown responsive
        @media (max-width: 480px) {
            width: calc(100vw - 32px);
            right: -16px;
            left: 16px;
        }

        &::before {
            content: '';
            position: absolute;
            top: -6px;
            right: 16px;
            width: 12px;
            height: 12px;
            background-color: white;
            transform: rotate(45deg);
            border-radius: 2px;
        }

        &-header {
            display: flex;
            align-items: flex-start; // Cambiar a flex-start para alinear mejor
            margin-bottom: 0.75rem;
            gap: 12px; // Espacio consistente entre avatar e info
        }

        &-greeting {
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 0.25rem;
            font-size: 16px;
            line-height: 1.2;

            // Evitar que el nombre se corte
            word-wrap: break-word;
            hyphens: auto;
        }

        &-email {
            font-size: 13px; // Reducir un poco el tamaño
            color: #64748b;
            margin-bottom: 6px;
            line-height: 1.3;

            // Manejar emails largos con ellipsis
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: 100%;

            // En móviles, permitir que se rompa en múltiples líneas
            @media (max-width: 480px) {
                white-space: normal;
                word-break: break-all;
                line-height: 1.4;
            }
        }

        &-badge {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 3px 8px; // Aumentar padding ligeramente
            background: rgba(66, 133, 244, 0.1);
            color: #4285F4;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 500;
            margin-top: 2px;

            .google-icon {
                width: 12px;
                height: 12px;
                flex-shrink: 0; // Evitar que el icono se deforme
            }
        }

        &-divider {
            height: 1px;
            background-color: #f1f5f9;
            margin: 0.75rem 0; // Aumentar espacio
        }

        &-menu {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        &-item {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.75rem;
            border-radius: 8px;
            color: #1e293b;
            text-decoration: none;
            transition: background-color 0.3s ease;
            font-size: 14px;

            &:hover {
                background-color: #f8fafc;
            }

            svg {
                color: #64748b;
                flex-shrink: 0; // Evitar que los iconos se deformen
            }
        }

        &-logout {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
            width: 100%;
            padding: 0.75rem;
            margin-top: 0.75rem; // Aumentar espacio
            background-color: #fee2e2;
            color: #ef4444;
            border: none;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: inherit;
            font-size: 14px;

            &:hover {
                background-color: #fecaca;
            }

            svg {
                stroke: #ef4444;
                flex-shrink: 0;
            }
        }
    }
}

@keyframes scaleIn {
    0% {
        opacity: 0;
        transform: scale(0.95);
    }
    100% {
        opacity: 1;
        transform: scale(1);
    }
}
</style>
