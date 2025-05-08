<!-- views/RestaurantDetail.vue -->
<template>
    <div class="restaurant-detail-page">
        <!-- Debug info (solo para desarrollo) -->
        <div v-if="error" class="error-container">
            <div class="error-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
            </div>
            <h2 class="error-title">Error al cargar el restaurante</h2>
            <p class="error-message">{{ error }}</p>
            <p class="error-id">ID del restaurante: {{ restaurantId }}</p>
            <router-link to="/" class="error-button">Volver a la lista de restaurantes</router-link>
        </div>

        <!-- Loader -->
        <div v-else-if="loading" class="loading-container">
            <div class="loading-spinner"></div>
            <p class="loading-text">Cargando información del restaurante</p>
        </div>

        <template v-else-if="restaurant">
            <!-- Hero section with restaurant cover and basic info -->
            <section class="restaurant-hero" :style="{ backgroundImage: `url(${restaurant.coverImage})` }">
                <div class="restaurant-hero__overlay"></div>
                <div class="container">
                    <div class="restaurant-hero__content">
                        <div class="restaurant-hero__logo">
                            <img :src="restaurant.logo" :alt="restaurant.name" />
                        </div>
                        <div class="restaurant-hero__info">
                            <h1 class="restaurant-hero__name">{{ restaurant.name }}</h1>
                            <div class="restaurant-hero__tags">
                                <span>{{ restaurant.cuisine }}</span>
                                <span class="dot-separator"></span>
                                <span>{{ restaurant.priceRange }}</span>
                                <span class="dot-separator"></span>
                                <span>{{ restaurant.distance }} km</span>
                            </div>
                            <div class="restaurant-hero__rating">
                                <span class="restaurant-hero__rating-score">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#FFCC00" stroke="#FFCC00"
                                        stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round">
                                        <polygon
                                            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2">
                                        </polygon>
                                    </svg>
                                    {{ restaurant.rating }}
                                </span>
                                <span class="restaurant-hero__rating-count">({{ restaurant.reviewCount }}
                                    opiniones)</span>
                                <button class="rating-button">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path
                                            d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z">
                                        </path>
                                    </svg>
                                    Opiniones
                                </button>
                            </div>
                            <div class="restaurant-hero__delivery">
                                <div class="delivery-info">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <polyline points="12 6 12 12 16 14"></polyline>
                                    </svg>
                                    <span>{{ restaurant.deliveryTime }} min</span>
                                </div>
                                <div class="delivery-info">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <line x1="12" y1="2" x2="12" y2="6"></line>
                                        <line x1="12" y1="18" x2="12" y2="22"></line>
                                        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                                        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                                        <line x1="2" y1="12" x2="6" y2="12"></line>
                                        <line x1="18" y1="12" x2="22" y2="12"></line>
                                        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                                        <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                                    </svg>
                                    <span v-if="restaurant.deliveryFee > 0">${{ restaurant.deliveryFee.toFixed(2) }} de
                                        envío</span>
                                    <span v-else class="free-delivery">Envío gratis</span>
                                </div>
                            </div>
                            <div class="restaurant-hero__actions">
                                <button class="action-button">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path
                                            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z">
                                        </path>
                                    </svg>
                                    Favorito
                                </button>
                                <button class="action-button">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                                        <polyline points="16 6 12 2 8 6"></polyline>
                                        <line x1="12" y1="2" x2="12" y2="15"></line>
                                    </svg>
                                    Compartir
                                </button>
                                <a :href="`https://maps.google.com/?q=${restaurant.address}`" target="_blank"
                                    class="action-button">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                        <circle cx="12" cy="10" r="3"></circle>
                                    </svg>
                                    Mapa
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Menu category navigation -->
            <section class="category-nav">
                <div class="container">
                    <div class="category-scroll">
                        <button v-if="showLeftScroll" @click="scrollCategories('left')"
                            class="category-scroll__arrow category-scroll__arrow--left"
                            aria-label="Ver categorías anteriores">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="15 18 9 12 15 6"></polyline>
                            </svg>
                        </button>

                        <div class="category-scroll__container" ref="categoriesContainer">
                            <button v-for="category in menuCategories" :key="category.id" class="category-nav__item"
                                :class="{ 'category-nav__item--active': activeCategory === category.id }"
                                @click="scrollToCategory(category.id)">
                                {{ category.name }}
                            </button>
                        </div>

                        <button v-if="showRightScroll" @click="scrollCategories('right')"
                            class="category-scroll__arrow category-scroll__arrow--right"
                            aria-label="Ver más categorías">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </button>
                    </div>
                </div>
            </section>

            <!-- Main content with menu items and cart -->
            <section class="restaurant-content">
                <div class="container">
                    <div class="restaurant-content__wrapper">
                        <!-- Menu sections -->
                        <div class="menu-sections">
                            <!-- Promo cards -->
                            <div class="promo-cards">
                                <div class="promo-card">
                                    <div class="promo-card__content">
                                        <h3 class="promo-card__title">Envío gratis en tu primer pedido</h3>
                                        <p class="promo-card__text">Usa el código: BIENVENIDO</p>
                                    </div>
                                    <div class="promo-card__image">
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="1" stroke-linecap="round"
                                            stroke-linejoin="round">
                                            <rect x="1" y="3" width="15" height="13" rx="2" ry="2"></rect>
                                            <circle cx="16" cy="16" r="7"></circle>
                                            <line x1="16" y1="12" x2="16" y2="20"></line>
                                            <line x1="12" y1="16" x2="20" y2="16"></line>
                                        </svg>
                                    </div>
                                </div>
                                <div class="promo-card">
                                    <div class="promo-card__content">
                                        <h3 class="promo-card__title">10% de descuento</h3>
                                        <p class="promo-card__text">Pedidos mayores a $300</p>
                                    </div>
                                    <div class="promo-card__image">
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="1" stroke-linecap="round"
                                            stroke-linejoin="round">
                                            <line x1="19" y1="5" x2="5" y2="19"></line>
                                            <circle cx="6.5" cy="6.5" r="2.5"></circle>
                                            <circle cx="17.5" cy="17.5" r="2.5"></circle>
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <!-- Menu sections -->
                            <div v-for="category in menuCategories" :key="category.id" :id="category.id"
                                class="menu-section" ref="menuSections">
                                <h2 class="menu-section__title">{{ category.name }}</h2>

                                <div class="menu-items">
                                    <div v-for="item in category.items" :key="item.id" class="menu-item">
                                        <div class="menu-item__content">
                                            <h3 class="menu-item__name">{{ item.name }}</h3>
                                            <p class="menu-item__description">{{ item.description }}</p>
                                            <div class="menu-item__price">${{ item.price.toFixed(2) }}</div>
                                            <div v-if="item.popular" class="menu-item__badge">Popular</div>
                                        </div>
                                        <div class="menu-item__image">
                                            <img v-if="item.image" :src="item.image" :alt="item.name">
                                            <div v-else class="menu-item__no-image"></div>
                                            <button class="menu-item__add" @click="addToCart(item)">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                                    stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                                    stroke-linejoin="round">
                                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Cart sidebar -->
                        <div class="cart-sidebar">
                            <div class="cart">
                                <div class="cart__header">
                                    <h2 class="cart__title">Tu pedido</h2>
                                    <button v-if="cart.items.length > 0" class="cart__clear" @click="clearCart">
                                        Vaciar carrito
                                    </button>
                                </div>

                                <div v-if="cart.items.length === 0" class="cart__empty">
                                    <div class="cart__empty-icon">
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="1" stroke-linecap="round"
                                            stroke-linejoin="round">
                                            <circle cx="9" cy="21" r="1"></circle>
                                            <circle cx="20" cy="21" r="1"></circle>
                                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6">
                                            </path>
                                        </svg>
                                    </div>
                                    <p class="cart__empty-text">Tu carrito está vacío</p>
                                    <p class="cart__empty-subtext">Agrega elementos para empezar tu pedido</p>
                                </div>

                                <div v-else>
                                    <div class="cart__items">
                                        <div v-for="(item, index) in cart.items" :key="index" class="cart-item">
                                            <div class="cart-item__quantity">
                                                <button class="cart-item__quantity-btn" @click="decrementItem(index)">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                                        stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                                        stroke-linejoin="round">
                                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                                    </svg>
                                                </button>
                                                <span>{{ item.quantity }}</span>
                                                <button class="cart-item__quantity-btn" @click="incrementItem(index)">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                                        stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                                        stroke-linejoin="round">
                                                        <line x1="12" y1="5" x2="12" y2="19"></line>
                                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                                    </svg>
                                                </button>
                                            </div>

                                            <div class="cart-item__details">
                                                <div class="cart-item__name">{{ item.name }}</div>
                                                <button class="cart-item__remove" @click="removeItem(index)">
                                                    Eliminar
                                                </button>
                                            </div>

                                            <div class="cart-item__price">${{ (item.price * item.quantity).toFixed(2) }}
                                            </div>
                                        </div>
                                    </div>

                                    <div class="cart__summary">
                                        <div class="cart__row">
                                            <span>Subtotal</span>
                                            <span>${{ subtotal.toFixed(2) }}</span>
                                        </div>
                                        <div class="cart__row">
                                            <span>Costo de envío</span>
                                            <span v-if="restaurant.deliveryFee > 0">${{
                                                restaurant.deliveryFee.toFixed(2) }}</span>
                                            <span v-else class="free-delivery">Gratis</span>
                                        </div>
                                        <div class="cart__row cart__row--total">
                                            <span>Total</span>
                                            <span>${{ total.toFixed(2) }}</span>
                                        </div>
                                    </div>

                                    <button class="cart__checkout-btn">
                                        Realizar pedido
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </template>

        <!-- Not found state -->
        <div v-else-if="!loading && !restaurant && !error" class="not-found">
            <div class="not-found__icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"
                    stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
            </div>
            <h2 class="not-found__title">Restaurante no encontrado</h2>
            <p class="not-found__text">El restaurante que buscas no existe o ya no está disponible</p>
            <router-link to="/" class="not-found__button">Volver a la página principal</router-link>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PopularTag from '@/components/ui/PopularTag.vue';

const route = useRoute();
const router = useRouter();

// Estado
const loading = ref(true);
const restaurant = ref(null);
const error = ref(null);
const restaurantId = ref('');
const activeCategory = ref('');
const menuCategories = ref([]);
const cart = ref({
    items: []
});

// Referencias para el scroll
const categoriesContainer = ref(null);
const menuSections = ref([]);
const showLeftScroll = ref(false);
const showRightScroll = ref(true);

// Calcular subtotal y total del carrito
const subtotal = computed(() => {
    return cart.value.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
});

const total = computed(() => {
    const deliveryFee = restaurant.value ? restaurant.value.deliveryFee : 0;
    return subtotal.value + deliveryFee;
});

// Cargar datos del restaurante (simulado)
const fetchRestaurantData = async () => {
    loading.value = true;
    error.value = null;

    try {
        // Obtener el ID del restaurante de los parámetros de ruta
        restaurantId.value = route.params.id;

        // Validar que el ID sea válido
        if (!restaurantId.value) {
            throw new Error('ID de restaurante no encontrado en la URL');
        }

        // ID convertido a número para validación
        const id = parseInt(restaurantId.value);

        if (isNaN(id)) {
            throw new Error('ID de restaurante inválido');
        }

        // Simulación de API con timeout para demostrar carga
        const data = await new Promise((resolve, reject) => {
            setTimeout(() => {
                // Validar si el restaurante existe en nuestros datos (simulado)
                // Aquí podemos añadir una condición para simular restaurantes no encontrados
                if (id === 999) {
                    reject(new Error('Restaurante no encontrado en la base de datos'));
                    return;
                }

                // Datos simulados del restaurante
                resolve({
                    restaurant: {
                        id: id,
                        name: 'Burger Kingdom',
                        cuisine: 'Americana',
                        priceRange: '$$',
                        rating: 4.8,
                        reviewCount: 324,
                        deliveryTime: 25,
                        deliveryFee: 2.99,
                        distance: 1.2,
                        address: "Calle Principal 123, Ciudad",
                        coverImage: 'https://images.unsplash.com/photo-1542574271-7f3b92e6c821?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
                        logo: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                    },
                    menuCategories: [
                        {
                            id: 'burgers',
                            name: 'Hamburguesas',
                            items: [
                                {
                                    id: 1,
                                    name: 'Clásica Burger',
                                    description: 'Hamburguesa de carne con queso, lechuga, tomate y nuestra salsa especial',
                                    price: 89.99,
                                    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                                    popular: true
                                },
                                {
                                    id: 2,
                                    name: 'Doble Cheese Burger',
                                    description: 'Doble carne, triple queso, tocino y cebolla caramelizada',
                                    price: 119.99,
                                    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                                    popular: true
                                },
                                {
                                    id: 3,
                                    name: 'Burger Vegetariana',
                                    description: 'Hamburguesa a base de plantas con queso, lechuga y tomate',
                                    price: 99.99,
                                    image: 'https://images.unsplash.com/photo-1550317138-10000687a72b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
                                }
                            ]
                        },
                        {
                            id: 'sides',
                            name: 'Acompañamientos',
                            items: [
                                {
                                    id: 4,
                                    name: 'Papas Fritas',
                                    description: 'Papas fritas crujientes con sal marina',
                                    price: 39.99,
                                    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                                    popular: true
                                },
                                {
                                    id: 5,
                                    name: 'Aros de Cebolla',
                                    description: 'Aros de cebolla fritos con nuestra mezcla especial de especias',
                                    price: 49.99,
                                    image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
                                }
                            ]
                        },
                        {
                            id: 'drinks',
                            name: 'Bebidas',
                            items: [
                                {
                                    id: 6,
                                    name: 'Refresco',
                                    description: 'Coca-Cola, Sprite, Fanta o agua mineral',
                                    price: 29.99,
                                    image: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
                                },
                                {
                                    id: 7,
                                    name: 'Malteada',
                                    description: 'Malteada cremosa de chocolate, vainilla o fresa',
                                    price: 49.99,
                                    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                                    popular: true
                                }
                            ]
                        },
                        {
                            id: 'desserts',
                            name: 'Postres',
                            items: [
                                {
                                    id: 8,
                                    name: 'Brownie con Helado',
                                    description: 'Brownie caliente con helado de vainilla y salsa de chocolate',
                                    price: 59.99,
                                    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
                                },
                                {
                                    id: 9,
                                    name: 'Pastel de Queso',
                                    description: 'Clásico pastel de queso con salsa de frutos rojos',
                                    price: 69.99,
                                    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
                                }
                            ]
                        }
                    ]
                });
            }, 1500);
        });

        // Asignar datos
        restaurant.value = data.restaurant;
        menuCategories.value = data.menuCategories;

        // Establecer la primera categoría como activa
        if (menuCategories.value.length > 0) {
            activeCategory.value = menuCategories.value[0].id;
        }

    } catch (err) {
        console.error('Error al cargar el restaurante:', err);
        error.value = err.message || 'Error al cargar los datos del restaurante';
        restaurant.value = null;
    } finally {
        loading.value = false;
    }
};

// Funciones de interacción con el carrito
const addToCart = (item) => {
    const existingItemIndex = cart.value.items.findIndex(cartItem => cartItem.id === item.id);

    if (existingItemIndex >= 0) {
        // Si el item ya está en el carrito, incrementar cantidad
        cart.value.items[existingItemIndex].quantity += 1;
    } else {
        // Si no, añadirlo con cantidad 1
        cart.value.items.push({
            ...item,
            quantity: 1
        });
    }
};

const incrementItem = (index) => {
    cart.value.items[index].quantity += 1;
};

const decrementItem = (index) => {
    if (cart.value.items[index].quantity > 1) {
        cart.value.items[index].quantity -= 1;
    } else {
        removeItem(index);
    }
};

const removeItem = (index) => {
    cart.value.items.splice(index, 1);
};

const clearCart = () => {
    cart.value.items = [];
};

// Navegación de categorías
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

    // Actualizar indicadores de scroll
    setTimeout(checkScrollPosition, 300);
};

// Scroll a la categoría seleccionada en el menú
const scrollToCategory = (categoryId) => {
    activeCategory.value = categoryId;

    nextTick(() => {
        const section = document.getElementById(categoryId);
        if (section) {
            // Calcular offset para el header
            const navHeight = document.querySelector('.category-nav')?.offsetHeight || 0;
            const topOffset = section.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

            window.scrollTo({
                top: topOffset,
                behavior: 'smooth'
            });
        }
    });
};

// Observer para detectar qué sección es visible
const setupIntersectionObserver = () => {
    // Asegurarse de que el navegador soporte IntersectionObserver
    if (!('IntersectionObserver' in window)) {
        console.warn('IntersectionObserver no es soportado en este navegador');
        return;
    }

    // Asegurarse de que el elemento exista antes de obtener su altura
    const navElement = document.querySelector('.category-nav');
    const navHeight = navElement ? navElement.offsetHeight : 0;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                activeCategory.value = entry.target.id;

                // Scroll a la categoría activa en el menú de navegación
                const activeButton = categoriesContainer.value?.querySelector(`.category-nav__item--active`);
                if (activeButton) {
                    activeButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                }
            }
        });
    }, {
        rootMargin: `-${navHeight + 10}px 0px -${window.innerHeight - navHeight - 200}px 0px`,
        threshold: 0
    });

    // Observar todas las secciones del menú
    if (menuSections.value && menuSections.value.length > 0) {
        menuSections.value.forEach(section => {
            if (section) observer.observe(section);
        });
    }
};

// Handler para cambio de ruta
watch(() => route.params.id, (newId, oldId) => {
    if (newId !== oldId) {
        fetchRestaurantData();
    }
}, { immediate: false });

// Inicialización
onMounted(async () => {
    await fetchRestaurantData();

    nextTick(() => {
        // Configurar observer después de que el DOM se haya actualizado
        if (menuSections.value && menuSections.value.length > 0) {
            setupIntersectionObserver();
        }

        // Comprobar los indicadores de scroll
        setTimeout(() => {
            if (categoriesContainer.value) {
                checkScrollPosition();
                categoriesContainer.value.addEventListener('scroll', checkScrollPosition);
            }
        }, 300);
    });
})
</script>

<style lang="scss" scoped>
// Variables
$primary-color: #06C167; // Color principal de Uber Eats
$black: #000000;
$white: #FFFFFF;
$light-gray: #F6F6F6;
$medium-gray: #EEEEEE;
$dark-gray: #545454;
$text-primary: #000000;
$text-secondary: #757575;
$success-color: #06C167;
$warning-color: #FF8000;
$border-radius-sm: 8px;
$border-radius: 16px;
$box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
$transition: all 0.2s ease;

// Container
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;

    @media (max-width: 768px) {
        padding: 0 16px;
    }
}

.restaurant-detail-page {
    background-color: $light-gray;
    min-height: 100vh;
}

// Loading container
.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 100px 0;

    .loading-spinner {
        width: 48px;
        height: 48px;
        border: 3px solid $light-gray;
        border-radius: 50%;
        border-top-color: $primary-color;
        animation: spinner 1s linear infinite;
        margin-bottom: 16px;
    }

    .loading-text {
        color: $text-secondary;
        font-size: 16px;
    }

    @keyframes spinner {
        to {
            transform: rotate(360deg);
        }
    }
}

// Restaurant hero section
.restaurant-hero {
    position: relative;
    background-size: cover;
    background-position: center;
    padding: 160px 0 40px;
    color: $white;

    &__overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.8));
        z-index: 1;
    }

    &__content {
        position: relative;
        z-index: 2;
        display: flex;
        gap: 24px;

        @media (max-width: 768px) {
            flex-direction: column;
            align-items: center;
            text-align: center;
        }
    }

    &__logo {
        width: 120px;
        height: 120px;
        border-radius: $border-radius;
        overflow: hidden;
        flex-shrink: 0;
        box-shadow: $box-shadow;
        border: 3px solid $white;

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
        font-size: 36px;
        font-weight: 700;
        margin: 0 0 8px;

        @media (max-width: 768px) {
            font-size: 28px;
        }
    }

    &__tags {
        display: flex;
        align-items: center;
        gap: 4px;
        margin-bottom: 16px;
        flex-wrap: wrap;

        span {
            font-size: 16px;
            opacity: 0.9;
        }

        @media (max-width: 768px) {
            justify-content: center;
        }
    }

    &__rating {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 16px;

        @media (max-width: 768px) {
            justify-content: center;
        }
    }

    &__rating-score {
        display: flex;
        align-items: center;
        gap: 4px;
        font-weight: 600;
    }

    &__rating-count {
        opacity: 0.8;
        font-size: 14px;
    }

    &__delivery {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 20px;

        @media (max-width: 768px) {
            justify-content: center;
        }
    }

    &__actions {
        display: flex;
        gap: 12px;

        @media (max-width: 768px) {
            justify-content: center;
        }
    }
}

// Dot separator
.dot-separator {
    width: 4px;
    height: 4px;
    background-color: rgba(255, 255, 255, 0.6);
    border-radius: 50%;
    display: inline-block;
}

// Delivery info
.delivery-info {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;

    svg {
        opacity: 0.8;
    }
}

// Free delivery badge
.free-delivery {
    color: $success-color;
    font-weight: 600;
}

// Action buttons
.action-button {
    background-color: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: $white;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: 100px;
    font-size: 14px;
    cursor: pointer;
    transition: $transition;
    text-decoration: none;

    &:hover {
        background-color: rgba(255, 255, 255, 0.25);
    }
}

// Rating button
.rating-button {
    background-color: transparent;
    border: none;
    color: $white;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px;
    border-radius: 100px;
    font-size: 14px;
    cursor: pointer;
    opacity: 0.8;
    transition: $transition;

    &:hover {
        opacity: 1;
        text-decoration: underline;
    }
}

// Category navigation
.category-nav {
    background-color: $white;
    padding: 0;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

    .category-scroll {
        position: relative;
        display: flex;
        align-items: center;

        &__container {
            display: flex;
            overflow-x: auto;
            scrollbar-width: none;
            -ms-overflow-style: none;
            scroll-behavior: smooth;

            &::-webkit-scrollbar {
                display: none;
            }
        }

        &__arrow {
            position: absolute;
            z-index: 2;
            background-color: $white;
            border: 1px solid $medium-gray;
            color: $text-primary;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: $transition;

            &:hover {
                background-color: $light-gray;
            }

            &--left {
                left: 0;
            }

            &--right {
                right: 0;
            }
        }
    }
}

// Category nav item
.category-nav__item {
    padding: 16px 20px;
    white-space: nowrap;
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    color: $text-secondary;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: $transition;

    &:hover {
        color: $text-primary;
    }

    &--active {
        color: $primary-color;
        border-bottom-color: $primary-color;
        font-weight: 600;
    }
}

// Restaurant content
.restaurant-content {
    padding: 40px 0 60px;

    &__wrapper {
        display: grid;
        grid-template-columns: 1fr 350px;
        gap: 32px;

        @media (max-width: 992px) {
            grid-template-columns: 1fr;
        }
    }
}

// Promo cards
.promo-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
    margin-bottom: 32px;
}

// Promo card
.promo-card {
    background: linear-gradient(to right, #f6f8fe, #ffffff);
    border-radius: $border-radius;
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border: 1px solid #e0e7ff;

    &__content {
        flex: 1;
    }

    &__title {
        margin: 0 0 4px;
        font-size: 16px;
        font-weight: 600;
        color: $text-primary;
    }

    &__text {
        margin: 0;
        font-size: 14px;
        color: $text-secondary;
    }

    &__image {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #6366f1;
        flex-shrink: 0;
    }
}

// Menu section
.menu-section {
    margin-bottom: 40px;
    scroll-margin-top: 70px;

    &__title {
        font-size: 20px;
        font-weight: 700;
        color: $text-primary;
        margin: 0 0 16px;
        padding-bottom: 8px;
        border-bottom: 1px solid $medium-gray;
    }
}

// Menu items
.menu-items {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;

    @media (max-width: 576px) {
        grid-template-columns: 1fr;
    }
}

// Menu item
.menu-item {
    background-color: $white;
    border-radius: $border-radius;
    overflow: hidden;
    display: flex;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    cursor: pointer;
    transition: $transition;
    position: relative;

    &:hover {
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);

        .menu-item__add {
            opacity: 1;
        }
    }

    &__content {
        padding: 16px;
        flex: 1;
    }

    &__name {
        font-size: 16px;
        font-weight: 600;
        margin: 0 0 4px;
        color: $text-primary;
    }

    &__description {
        font-size: 14px;
        color: $text-secondary;
        margin: 0 0 12px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    &__price {
        font-weight: 600;
        color: $text-primary;
    }

    &__badge {
        position: absolute;
        top: 8px;
        left: 8px;
        background-color: $warning-color;
        color: $white;
        font-size: 12px;
        font-weight: 600;
        padding: 2px 8px;
        border-radius: 100px;
        z-index: 1;
    }

    &__image {
        width: 100px;
        height: 100px;
        overflow: hidden;
        position: relative;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    &__no-image {
        width: 100%;
        height: 100%;
        background-color: $light-gray;
    }

    &__add {
        position: absolute;
        bottom: 8px;
        right: 8px;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background-color: $primary-color;
        color: $white;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        opacity: 0;
        transition: $transition;

        &:hover {
            background-color: darken($primary-color, 5%);
            transform: scale(1.1);
        }
    }
}

// Cart sidebar
.cart-sidebar {
    position: sticky;
    top: 70px;

    @media (max-width: 992px) {
        position: static;
    }
}

// Cart
.cart {
    background-color: $white;
    border-radius: $border-radius;
    box-shadow: $box-shadow;
    padding: 24px;

    &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
    }

    &__title {
        font-size: 20px;
        font-weight: 700;
        margin: 0;
        color: $text-primary;
    }

    &__clear {
        background: none;
        border: none;
        color: $text-secondary;
        font-size: 14px;
        cursor: pointer;

        &:hover {
            color: #f43f5e;
            text-decoration: underline;
        }
    }

    &__empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px 0;
        text-align: center;

        &-icon {
            width: 64px;
            height: 64px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: $light-gray;
            border-radius: 50%;
            color: $text-secondary;
            margin-bottom: 16px;
        }

        &-text {
            font-size: 16px;
            font-weight: 600;
            color: $text-primary;
            margin: 0 0 8px;
        }

        &-subtext {
            font-size: 14px;
            color: $text-secondary;
            margin: 0;
        }
    }

    &__items {
        margin-bottom: 24px;
        max-height: 400px;
        overflow-y: auto;
    }

    &__summary {
        border-top: 1px solid $medium-gray;
        padding-top: 16px;
        margin-bottom: 24px;
    }

    &__row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
        font-size: 14px;
        color: $text-secondary;

        &--total {
            font-size: 16px;
            font-weight: 600;
            color: $text-primary;
        }
    }

    &__checkout-btn {
        width: 100%;
        background-color: $primary-color;
        color: $white;
        border: none;
        border-radius: $border-radius-sm;
        padding: 12px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: $transition;

        &:hover {
            background-color: darken($primary-color, 5%);
        }
    }
}

// Cart item
.cart-item {
    display: flex;
    align-items: flex-start;
    padding: 12px 0;
    border-bottom: 1px solid $light-gray;

    &:last-child {
        border-bottom: none;
    }

    &__quantity {
        display: flex;
        align-items: center;
        gap: 4px;
        margin-right: 12px;

        span {
            min-width: 24px;
            text-align: center;
            font-weight: 600;
        }
    }

    &__quantity-btn {
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        border: 1px solid $medium-gray;
        background-color: $white;
        color: $text-primary;
        cursor: pointer;
        transition: $transition;

        &:hover {
            background-color: $light-gray;
        }
    }

    &__details {
        flex: 1;
    }

    &__name {
        font-weight: 500;
        margin-bottom: 4px;
    }

    &__remove {
        background: none;
        border: none;
        color: $text-secondary;
        padding: 0;
        font-size: 12px;
        cursor: pointer;

        &:hover {
            color: #f43f5e;
            text-decoration: underline;
        }
    }

    &__price {
        font-weight: 600;
        margin-left: 12px;
    }
}

// Not found state
.not-found {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 100px 0;
    text-align: center;

    &__icon {
        width: 80px;
        height: 80px;
        background-color: $light-gray;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: $text-secondary;
        margin-bottom: 24px;
    }

    &__title {
        font-size: 24px;
        font-weight: 700;
        color: $text-primary;
        margin: 0 0 12px;
    }

    &__text {
        color: $text-secondary;
        margin: 0 0 24px;
        max-width: 500px;
    }

    &__button {
        background-color: $primary-color;
        color: $white;
        border: none;
        padding: 12px 24px;
        border-radius: $border-radius-sm;
        font-weight: 600;
        text-decoration: none;
        transition: $transition;

        &:hover {
            background-color: darken($primary-color, 5%);
        }
    }

    /* Estilos para el contenedor de error */
    .error-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 100px 24px;
        text-align: center;
    }

    .error-icon {
        width: 80px;
        height: 80px;
        background-color: #FEE2E2;
        color: #DC2626;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 24px;
    }

    .error-title {
        font-size: 24px;
        font-weight: 700;
        color: #111827;
        margin: 0 0 12px;
    }

    .error-message {
        color: #4B5563;
        margin: 0 0 8px;
        max-width: 500px;
    }

    .error-id {
        font-family: monospace;
        background-color: #F3F4F6;
        padding: 4px 12px;
        border-radius: 6px;
        margin: 12px 0 24px;
        font-size: 14px;
        color: #374151;
    }

    .error-button {
        background-color: #06C167;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 600;
        text-decoration: none;
        transition: all 0.2s ease;

        &:hover {
            background-color: #059655;
        }
    }

}
</style>