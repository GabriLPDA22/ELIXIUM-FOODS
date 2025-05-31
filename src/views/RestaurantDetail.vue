<template>
  <div class="restaurant-detail-page">
    <!-- Error message -->
    <div v-if="error" class="error-container">
      <div class="error-container__icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <h2 class="error-container__title">Error al cargar el restaurante</h2>
      <p class="error-container__message">{{ error }}</p>
      <router-link to="/" class="error-container__button">Volver a la lista de restaurantes</router-link>
    </div>

    <!-- Loader -->
    <div v-else-if="loading" class="loading-container">
      <div class="loading-container__spinner"></div>
      <p class="loading-container__text">Cargando información del restaurante</p>
    </div>

    <template v-else-if="restaurant">
      <!-- Hero section limpio con solo la foto -->
      <section class="restaurant-hero" :style="{ backgroundImage: `url(${restaurant.coverImageUrl})` }">
        <div class="restaurant-hero__overlay"></div>
        
        <div class="container">
          <div class="restaurant-hero__content">
            <div class="restaurant-hero__logo-wrapper">
              <div class="restaurant-hero__logo">
                <img :src="restaurant.logoUrl" :alt="restaurant.name" />
              </div>
            </div>
            
            <div class="restaurant-hero__info">
              <div class="restaurant-hero__badge-container">
                <span v-if="restaurant.isOpen" class="restaurant-hero__status restaurant-hero__status--open">
                  <span class="restaurant-hero__status-dot"></span>
                  Abierto ahora
                </span>
                <span v-else class="restaurant-hero__status restaurant-hero__status--closed">
                  <span class="restaurant-hero__status-dot"></span>
                  Cerrado
                </span>
              </div>

              <h1 class="restaurant-hero__name">{{ restaurant.name }}</h1>
              
              <div class="restaurant-hero__meta">
                <div class="restaurant-hero__rating-wrapper">
                  <div class="restaurant-hero__rating">
                    <div class="restaurant-hero__stars">
                      <svg v-for="i in 5" :key="i" width="16" height="16" viewBox="0 0 24 24" 
                           :class="i <= Math.floor(safeNumber(restaurant.averageRating, 0)) ? 'star--filled' : 'star--empty'"
                           fill="currentColor" stroke="currentColor" stroke-width="0.5">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    </div>
                    <span class="restaurant-hero__rating-score">
                      {{ safeNumber(restaurant.averageRating, 0).toFixed(1) }}
                    </span>
                    <span class="restaurant-hero__rating-count">({{ safeNumber(restaurant.reviewCount, 0) }} opiniones)</span>
                  </div>
                </div>

                <div class="restaurant-hero__delivery-stats">
                  <div class="restaurant-hero__stat">
                    <div class="restaurant-hero__stat-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                    </div>
                    <span>{{ safeNumber(restaurant.estimatedDeliveryTime, 30) }}-{{ safeNumber(restaurant.estimatedDeliveryTime, 30) + 15 }} min</span>
                  </div>
                  
                  <div class="restaurant-hero__stat">
                    <div class="restaurant-hero__stat-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 17H7A5 5 0 0 1 7 7h2m0 10v-5a3 3 0 0 1 3-3m0 0a3 3 0 0 1 3 3v5m0-10V7a5 5 0 0 1 5 5v5"></path>
                      </svg>
                    </div>
                    <span v-if="safeNumber(restaurant.deliveryFee, 0) > 0">
                      ${{ safeNumber(restaurant.deliveryFee, 0).toFixed(2) }} envío
                    </span>
                    <span v-else class="restaurant-hero__free-delivery">Envío gratis</span>
                  </div>
                </div>
              </div>

              <p v-if="restaurant.description" class="restaurant-hero__description">
                {{ restaurant.description }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Ofertas activas del restaurante -->
      <section v-if="activeOffers.length > 0" class="offers-section">
        <div class="container">
          <h2 class="offers-section__title">🔥 Ofertas especiales</h2>
          <div class="offers-grid">
            <div v-for="offer in activeOffers" :key="offer.id" class="offer-card">
              <div class="offer-card__badge">
                <span v-if="offer.discountType === 'percentage'">{{ offer.discountValue }}% OFF</span>
                <span v-else>${{ offer.discountValue }} OFF</span>
              </div>
              <div class="offer-card__content">
                <h3 class="offer-card__name">{{ offer.name }}</h3>
                <p class="offer-card__description">{{ offer.description }}</p>
                <div class="offer-card__conditions">
                  <span v-if="offer.minimumOrderAmount > 0">Pedido mín: ${{ offer.minimumOrderAmount }}</span>
                  <span v-if="offer.minimumQuantity > 1">Cant. mín: {{ offer.minimumQuantity }}</span>
                  <span v-if="offer.usageLimit > 0">{{ offer.remainingUses }} usos disponibles</span>
                </div>
              </div>
              <div class="offer-card__product" v-if="offer.productName">
                <span class="offer-card__product-name">{{ offer.productName }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Category filters que filtran en lugar de hacer scroll -->
      <section class="category-filters">
        <div class="container">
          <div class="category-filters__wrapper">
            <button 
              class="category-filter"
              :class="{ 'category-filter--active': selectedCategoryFilter === 'all' }"
              @click="filterByCategory('all')">
              <span class="category-filter__text">Todos</span>
              <span class="category-filter__count">({{ menuItems.length }})</span>
            </button>
            <button 
              v-for="category in menuCategories" 
              :key="category.id" 
              class="category-filter"
              :class="{ 'category-filter--active': selectedCategoryFilter === category.id }"
              @click="filterByCategory(category.id)">
              <span class="category-filter__text">{{ category.name }}</span>
              <span class="category-filter__count">({{ category.items.length }})</span>
            </button>
          </div>
        </div>
      </section>

      <!-- Main content con menú filtrado y cart sidebar -->
      <section class="restaurant-content">
        <div class="container">
          <div class="restaurant-content__wrapper">
            <!-- Menu items filtrados -->
            <div class="menu-sections">
              <div class="menu-section">
                <div class="menu-section__header">
                  <h2 class="menu-section__title">
                    {{ selectedCategoryFilter === 'all' ? 'Todos los productos' : getSelectedCategoryName() }}
                  </h2>
                  <div class="menu-section__count">{{ filteredMenuItems.length }} productos</div>
                </div>

                <div class="menu-items">
                  <div v-for="item in filteredMenuItems" :key="item.id" class="menu-item">
                    <div class="menu-item__content">
                      <div class="menu-item__header">
                        <h3 class="menu-item__name">{{ item.name || 'Producto' }}</h3>
                        <div class="menu-item__price-wrapper">
                          <span class="menu-item__price">
                            ${{ getProductPrice(item) > 0 ? getProductPrice(item).toFixed(2) : 'N/A' }}
                          </span>
                        </div>
                      </div>
                      
                      <p v-if="item.description" class="menu-item__description">{{ item.description }}</p>
                      
                      <div class="menu-item__tags" v-if="item.isVegetarian || item.isSpicy || item.isNew">
                        <span v-if="item.isVegetarian" class="menu-item__tag menu-item__tag--vegetarian">🌱 Vegetariano</span>
                        <span v-if="item.isSpicy" class="menu-item__tag menu-item__tag--spicy">🌶️ Picante</span>
                        <span v-if="item.isNew" class="menu-item__tag menu-item__tag--new">✨ Nuevo</span>
                      </div>
                    </div>

                    <div class="menu-item__image-wrapper">
                      <div class="menu-item__image">
                        <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.name">
                        <div v-else class="menu-item__no-image">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                            <polyline points="21 15 16 10 5 21"></polyline>
                          </svg>
                        </div>
                      </div>
                      
                      <button class="menu-item__add-btn" 
                              @click="addToCart(item)" 
                              :disabled="getProductPrice(item) <= 0 || !item.isAvailable">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Cart sidebar elegante y estático -->
            <div class="cart-sidebar">
              <div class="cart">
                <div class="cart__header">
                  <div class="cart__header-content">
                    <h2 class="cart__title">
                      <span class="cart__title-icon">🛒</span>
                      Tu pedido
                    </h2>
                    <button v-if="cartItems.length > 0" class="cart__clear" @click="clearCart">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                  
                  <div v-if="cartItems.length > 0" class="cart__restaurant-info">
                    <div class="cart__restaurant-logo">{{ restaurant.name[0] }}</div>
                    <div class="cart__restaurant-details">
                      <span class="cart__restaurant-name">{{ restaurant.name }}</span>
                      <span class="cart__delivery-time">{{ safeNumber(restaurant.estimatedDeliveryTime, 30) }} min aprox.</span>
                    </div>
                  </div>
                </div>

                <div v-if="cartItems.length === 0" class="cart__empty">
                  <div class="cart__empty-icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                      <circle cx="9" cy="21" r="1"></circle>
                      <circle cx="20" cy="21" r="1"></circle>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                  </div>
                  <h3 class="cart__empty-title">Tu carrito está vacío</h3>
                  <p class="cart__empty-text">Agrega deliciosos productos para empezar tu pedido</p>
                </div>

                <div v-else class="cart__content">
                  <div class="cart__items">
                    <div v-for="(item, index) in cartItems" :key="item.id" class="cart-item">
                      <div class="cart-item__quantity-controls">
                        <button class="cart-item__quantity-btn cart-item__quantity-btn--minus" @click="decrementItem(item.id)">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                        </button>
                        <span class="cart-item__quantity">{{ safeNumber(item.quantity, 0) }}</span>
                        <button class="cart-item__quantity-btn cart-item__quantity-btn--plus" @click="incrementItem(item.id)">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                        </button>
                      </div>

                      <div class="cart-item__details">
                        <h4 class="cart-item__name">{{ item.name || 'Producto' }}</h4>
                        <div class="cart-item__actions">
                          <button class="cart-item__remove" @click="removeItem(item.id)">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                            Eliminar
                          </button>
                        </div>
                      </div>

                      <div class="cart-item__price-info">
                        <div class="cart-item__unit-price">${{ safeNumber(item.price, 0).toFixed(2) }}</div>
                        <div class="cart-item__total-price">${{ (safeNumber(item.price, 0) * safeNumber(item.quantity, 0)).toFixed(2) }}</div>
                      </div>
                    </div>
                  </div>

                  <div class="cart__summary">
                    <div class="cart__summary-row">
                      <span>Subtotal</span>
                      <span>${{ subtotal.toFixed(2) }}</span>
                    </div>
                    <div class="cart__summary-row">
                      <span>Costo de envío</span>
                      <span v-if="safeNumber(restaurant.deliveryFee, 0) > 0">
                        ${{ safeNumber(restaurant.deliveryFee, 0).toFixed(2) }}
                      </span>
                      <span v-else class="cart__free-delivery">¡Gratis!</span>
                    </div>
                    <div class="cart__summary-row cart__summary-row--total">
                      <span>Total</span>
                      <span>${{ total.toFixed(2) }}</span>
                    </div>
                  </div>

                  <button class="cart__checkout-btn" @click="proceedToCheckout" :disabled="cartItems.length === 0">
                    <span class="cart__checkout-icon">🚀</span>
                    <span>{{ cartItems.length > 0 ? 'Realizar pedido' : 'Agrega productos' }}</span>
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
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
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

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { restaurantService, type RestaurantDetail, type MenuCategory, type MenuItem } from '@/services/restaurantService'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'

// Router y route
const route = useRoute()
const router = useRouter()

// Stores
const cartStore = useCartStore()
const authStore = useAuthStore()

// Estado
const loading = ref(true)
const error = ref<string | null>(null)
const restaurantId = ref<number | null>(null)
const restaurant = ref<RestaurantDetail | null>(null)
const menuItems = ref<MenuItem[]>([])
const menuCategories = ref<MenuCategory[]>([])
const selectedCategoryFilter = ref<string | number>('all') // Para filtrar, no para scroll
const activeOffers = ref<any[]>([]) // Para las ofertas activas

// Helper function for safe numbers
const safeNumber = (value: any, defaultValue: number = 0): number => {
  if (value === null || value === undefined || value === '') {
    return defaultValue;
  }
  const num = typeof value === 'number' ? value : parseFloat(value);
  return isNaN(num) ? defaultValue : num;
};

// Función para obtener el precio real del producto
const getProductPrice = (product: any): number => {
  const priceFields = ['price', 'unitPrice', 'basePrice', 'salePrice', 'cost'];

  for (let field of priceFields) {
    if (product[field] !== null && product[field] !== undefined && product[field] !== '') {
      const testPrice = typeof product[field] === 'number' ? product[field] : parseFloat(product[field]);
      if (!isNaN(testPrice) && testPrice > 0) {
        return testPrice;
      }
    }
  }
  return 0;
};

// Computed para productos filtrados
const filteredMenuItems = computed(() => {
  if (selectedCategoryFilter.value === 'all') {
    return menuItems.value;
  }
  
  return menuItems.value.filter(item => {
    return item.categoryId === selectedCategoryFilter.value;
  });
});

// Función para obtener el nombre de la categoría seleccionada
const getSelectedCategoryName = () => {
  const category = menuCategories.value.find(cat => cat.id === selectedCategoryFilter.value);
  return category ? category.name : 'Productos';
};

// Función para filtrar por categoría
const filterByCategory = (categoryId: string | number) => {
  selectedCategoryFilter.value = categoryId;
};

// Computed properties del carrito
const cartItems = computed(() => {
  return cartStore.items.filter(item => item.restaurantId === restaurantId.value)
})

const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => {
    const price = safeNumber(item.price);
    const quantity = safeNumber(item.quantity);
    return sum + (price * quantity);
  }, 0);
});

const total = computed(() => {
  const deliveryFee = restaurant.value ? safeNumber(restaurant.value.deliveryFee) : 0;
  return subtotal.value + deliveryFee;
});

// Función para cargar ofertas activas del restaurante
const fetchActiveOffers = async () => {
  if (!restaurantId.value) return;
  
  try {
    // Llamada a la API para obtener ofertas activas
    const response = await fetch(`/api/restaurants/${restaurantId.value}/offers/active`);
    if (response.ok) {
      const offers = await response.json();
      activeOffers.value = offers;
      console.log('✅ Ofertas activas cargadas:', offers);
    }
  } catch (error) {
    console.error('❌ Error cargando ofertas:', error);
    // No mostramos error al usuario, simplemente no mostramos ofertas
  }
};

// Cargar datos del restaurante
const fetchRestaurantData = async () => {
  loading.value = true
  error.value = null

  try {
    const routeId = route.params.id
    if (!routeId) {
      throw new Error('ID de restaurante no encontrado en la URL')
    }

    const id = parseInt(routeId as string)
    restaurantId.value = id

    if (isNaN(id)) {
      throw new Error('ID de restaurante inválido')
    }

    const restaurantData = await restaurantService.getRestaurantById(id)
    restaurant.value = restaurantData

    const products = await restaurantService.getProductsByRestaurant(id)

    menuItems.value = products.map((product, index) => {
      const processedProduct = {
        ...product,
        name: product.name || 'Producto sin nombre',
        description: product.description || '',
        imageUrl: product.imageUrl || '',
        isAvailable: product.isAvailable !== false
      };
      return processedProduct;
    });

    menuCategories.value = restaurantService.organizeProductsByCategory(menuItems.value)

    // Cargar ofertas activas después de cargar el restaurante
    await fetchActiveOffers();

  } catch (err: any) {
    console.error('❌ Error al cargar el restaurante:', err)
    error.value = err.message || 'Error al cargar los datos del restaurante'
    restaurant.value = null
  } finally {
    loading.value = false
  }
}

// Función para agregar al carrito
const addToCart = async (item: MenuItem) => {
  if (!item || !item.id) {
    console.error('❌ Item inválido');
    return;
  }

  const realPrice = getProductPrice(item);

  if (realPrice <= 0) {
    alert('Este producto no tiene un precio válido o no está disponible.');
    return;
  }

  if (item.isAvailable === false) {
    alert('Este producto no está disponible en este momento.');
    return;
  }

  if (cartStore.restaurantId && cartStore.restaurantId !== restaurantId.value) {
    if (confirm(`Tu carrito contiene elementos de "${cartStore.restaurantName}". ¿Deseas vaciarlo para pedir de "${restaurant.value?.name}"?`)) {
      cartStore.clearCart()
    } else {
      return
    }
  }

  const cartItem = {
    id: item.id,
    productId: item.id,
    name: item.name || 'Producto',
    price: realPrice,
    imageUrl: item.imageUrl || '',
    restaurantId: restaurantId.value || 0,
    restaurantName: restaurant.value?.name || '',
    categoryId: item.categoryId || 0,
    isAvailable: true,
    description: item.description || '',
    businessId: restaurant.value?.businessId || restaurantId.value || 0,
    businessName: restaurant.value?.name || '',
    quantity: 1
  }

  try {
    const success = await cartStore.addToCart(cartItem, 1);
    if (!success) {
      alert(cartStore.error || 'No se pudo agregar el producto al carrito.');
    }
  } catch (exceptionError) {
    alert('Ocurrió un error al agregar el producto al carrito.');
  }
}

const incrementItem = async (itemId: number) => {
  const item = cartItems.value.find(item => item.id === itemId)
  if (item) {
    await cartStore.updateQuantity(itemId, safeNumber(item.quantity) + 1)
  }
}

const decrementItem = async (itemId: number) => {
  const item = cartItems.value.find(item => item.id === itemId)
  if (item) {
    const currentQuantity = safeNumber(item.quantity);
    if (currentQuantity > 1) {
      await cartStore.updateQuantity(itemId, currentQuantity - 1)
    } else {
      cartStore.removeItem(itemId)
    }
  }
}

const removeItem = (itemId: number) => {
  cartStore.removeItem(itemId)
}

const clearCart = () => {
  if (confirm('¿Estás seguro de que deseas vaciar tu carrito?')) {
    cartStore.clearCart()
  }
}

const proceedToCheckout = () => {
  if (!authStore.isAuthenticated) {
    alert('Por favor, inicia sesión para continuar con tu pedido.');
    router.push('/login');
    return;
  }

  if (cartItems.value.length === 0) {
    alert('Tu carrito está vacío. Agrega productos antes de continuar.');
    return;
  }

  router.push('/checkout');
}

// Handler para cambio de ruta
watch(() => route.params.id, (newId, oldId) => {
  if (newId && newId !== oldId) {
    fetchRestaurantData()
  }
}, { immediate: false })

// Inicialización
onMounted(async () => {
  await fetchRestaurantData()
})
</script>

<style lang="scss" scoped>
// Variables elegantes
$primary-gradient: linear-gradient(135deg, #FF416C, #FF4B2B);
$secondary-gradient: linear-gradient(135deg, #667eea, #764ba2);
$success-gradient: linear-gradient(135deg, #06C167, #04A653);
$warning-gradient: linear-gradient(135deg, #FFC837, #FF8008);
$light-gradient: linear-gradient(135deg, #f8fafc, #e2e8f0);

$white: #FFFFFF;
$light-gray: #F8FAFC;
$medium-gray: #E2E8F0;
$dark-gray: #64748B;
$text-primary: #1E293B;
$text-secondary: #64748B;
$border-radius: 16px;
$border-radius-sm: 8px;
$transition: all 0.3s ease;
$shadow-elevated: 0 20px 40px rgba(0, 0, 0, 0.1);
$shadow-medium: 0 10px 25px rgba(0, 0, 0, 0.08);
$shadow-soft: 0 4px 16px rgba(0, 0, 0, 0.06);

// Container
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
}

.restaurant-detail-page {
  background: linear-gradient(to bottom, $white, $light-gray);
  min-height: 100vh;
}

// Loading container elegante
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6rem 0;
  background: $primary-gradient;
  min-height: 100vh;
  color: white;

  &__spinner {
    width: 60px;
    height: 60px;
    border: 4px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    border-top-color: white;
    animation: spinner 1.2s linear infinite;
    margin-bottom: 2rem;
  }

  &__text {
    font-size: 1.2rem;
    font-weight: 600;
    opacity: 0.9;
    text-align: center;
    max-width: 400px;
  }

  @keyframes spinner {
    to { transform: rotate(360deg); }
  }
}

// Hero section limpio - solo foto
.restaurant-hero {
  position: relative;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  padding: 8rem 0 4rem;
  color: white;
  overflow: hidden;
  min-height: 60vh;

  &__overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(0, 0, 0, 0.7) 0%,
      rgba(255, 65, 108, 0.3) 30%,
      rgba(255, 75, 43, 0.4) 70%,
      rgba(0, 0, 0, 0.8) 100%
    );
    z-index: 1;
  }

  &__content {
    position: relative;
    z-index: 2;
    display: flex;
    gap: 3rem;
    align-items: center;

    @media (max-width: 768px) {
      flex-direction: column;
      text-align: center;
      gap: 2rem;
    }
  }

  &__logo-wrapper {
    position: relative;
  }

  &__logo {
    width: 150px;
    height: 150px;
    border-radius: 25px;
    overflow: hidden;
    border: 4px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    box-shadow: $shadow-elevated;
    position: relative;
    transition: $transition;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    @media (max-width: 768px) {
      width: 120px;
      height: 120px;
    }
  }

  &__info {
    flex: 1;
  }

  &__badge-container {
    margin-bottom: 1rem;
  }

  &__status {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 25px;
    font-size: 0.9rem;
    font-weight: 600;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);

    &--open {
      background: rgba(6, 193, 103, 0.9);
      color: white;
    }

    &--closed {
      background: rgba(239, 68, 68, 0.9);
      color: white;
    }

    &-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: currentColor;
    }
  }

  &__name {
    font-size: 3rem;
    font-weight: 800;
    margin: 0 0 1.5rem;
    line-height: 1.1;
    letter-spacing: -0.02em;
    text-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);

    @media (max-width: 768px) {
      font-size: 2.2rem;
      margin-bottom: 1rem;
    }
  }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    margin-bottom: 1.5rem;

    @media (max-width: 768px) {
      justify-content: center;
      gap: 1.5rem;
    }
  }

  &__rating-wrapper {
    display: flex;
    align-items: center;
  }

  &__rating {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: rgba(255, 255, 255, 0.15);
    padding: 0.75rem 1.25rem;
    border-radius: 15px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  &__stars {
    display: flex;
    gap: 2px;

    .star--filled {
      color: #FFC837;
    }

    .star--empty {
      color: rgba(255, 255, 255, 0.3);
    }
  }

  &__rating-score {
    font-weight: 700;
    font-size: 1.1rem;
  }

  &__rating-count {
    opacity: 0.8;
    font-size: 0.9rem;
  }

  &__delivery-stats {
    display: flex;
    gap: 1.5rem;

    @media (max-width: 768px) {
      gap: 1rem;
    }
  }

  &__stat {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(255, 255, 255, 0.15);
    padding: 0.75rem 1.25rem;
    border-radius: 15px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    font-weight: 600;
    font-size: 0.95rem;
  }

  &__stat-icon {
    opacity: 0.9;
  }

  &__free-delivery {
    color: #22C55E;
    font-weight: 700;
  }

  &__description {
    font-size: 1.1rem;
    line-height: 1.6;
    opacity: 0.9;
    max-width: 600px;
    margin: 0;

    @media (max-width: 768px) {
      font-size: 1rem;
    }
  }
}

// Sección de ofertas espectacular
.offers-section {
  background: linear-gradient(135deg, rgba(255, 65, 108, 0.05), rgba(255, 75, 43, 0.05));
  padding: 3rem 0;
  border-bottom: 1px solid rgba(255, 65, 108, 0.1);

  &__title {
    font-size: 2rem;
    font-weight: 800;
    text-align: center;
    margin: 0 0 2rem;
    background: $primary-gradient;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
}

.offers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  max-width: 1000px;
  margin: 0 auto;
}

.offer-card {
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  border: 2px solid transparent;
  background-clip: padding-box;
  box-shadow: $shadow-soft;
  transition: $transition;

  &:hover {
    transform: translateY(-5px);
    box-shadow: $shadow-elevated;
    border-color: rgba(255, 65, 108, 0.3);
  }

  &::before {
    content: '';
    position: absolute;
    inset: -2px;
    background: $primary-gradient;
    border-radius: 22px;
    opacity: 0.1;
    z-index: -1;
  }

  &__badge {
    position: absolute;
    top: -10px;
    right: 20px;
    background: $primary-gradient;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 25px;
    font-weight: 800;
    font-size: 0.9rem;
    box-shadow: $shadow-medium;
    transform: rotate(-5deg);
  }

  &__content {
    margin-top: 1rem;
  }

  &__name {
    font-size: 1.3rem;
    font-weight: 700;
    color: $text-primary;
    margin: 0 0 0.5rem;
  }

  &__description {
    color: $text-secondary;
    line-height: 1.5;
    margin: 0 0 1rem;
  }

  &__conditions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;

    span {
      background: rgba(100, 116, 139, 0.1);
      color: $text-secondary;
      padding: 0.25rem 0.75rem;
      border-radius: 15px;
      font-size: 0.8rem;
      font-weight: 600;
    }
  }

  &__product {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid $medium-gray;
  }

  &__product-name {
    font-weight: 600;
    color: $text-primary;
    font-size: 0.9rem;
  }
}

// Category filters elegantes (que filtran en lugar de scroll)
.category-filters {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.95));
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 65, 108, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 1.5rem 0;

  &__wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
  }
}

.category-filter {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: white;
  border: 2px solid $medium-gray;
  border-radius: 25px;
  color: $text-secondary;
  font-weight: 600;
  cursor: pointer;
  transition: $transition;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: $shadow-medium;
    border-color: #FF416C;
  }

  &--active {
    background: $primary-gradient;
    color: white;
    border-color: transparent;
    box-shadow: $shadow-medium;
    transform: translateY(-2px);

    .category-filter__count {
      background: rgba(255, 255, 255, 0.2);
      color: white;
    }
  }

  &__text {
    font-size: 0.9rem;
  }

  &__count {
    background: rgba(100, 116, 139, 0.1);
    color: $text-secondary;
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 0.7rem;
    font-weight: 700;
    transition: $transition;
  }
}

// Main content
.restaurant-content {
  padding: 3rem 0 4rem;

  &__wrapper {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 3rem;

    @media (max-width: 1200px) {
      grid-template-columns: 1fr 350px;
      gap: 2rem;
    }

    @media (max-width: 992px) {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
  }
}

// Menu sections
.menu-section {
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 3px solid;
    border-image: $primary-gradient 1;
  }

  &__title {
    font-size: 2rem;
    font-weight: 800;
    background: $primary-gradient;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    margin: 0;
  }

  &__count {
    background: $light-gradient;
    color: $text-secondary;
    padding: 0.5rem 1rem;
    border-radius: 25px;
    font-size: 0.9rem;
    font-weight: 600;
    border: 1px solid $medium-gray;
  }
}

// Menu items con hover sutil y border naranja grueso
.menu-items {
  display: grid;
  gap: 1.5rem;
}

.menu-item {
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  display: flex;
  gap: 1.5rem;
  cursor: pointer;
  transition: $transition;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
  box-shadow: $shadow-soft;

  &:hover {
    transform: translateY(-2px);
    box-shadow: $shadow-medium;
    // Fondo casi blanco con un pelin de color transparente
    background: rgba(255, 248, 245, 0.95);
    // Border grueso con gradiente naranja
    border: 4px solid;
    border-image: linear-gradient(135deg, #FF8A00, #FFC837, #FF6B35) 1;

    .menu-item__add-btn {
      opacity: 1;
      transform: scale(1);
    }

    .menu-item__image img {
      transform: scale(1.03);
    }

    // Los precios se mantienen visibles con mejor contraste
    .menu-item__price {
      text-shadow: 0 2px 8px rgba(255, 138, 0, 0.3);
      transform: scale(1.02);
    }
  }

  &__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
  }

  &__name {
    font-size: 1.3rem;
    font-weight: 700;
    color: $text-primary;
    margin: 0;
    line-height: 1.3;
  }

  &__price-wrapper {
    flex-shrink: 0;
  }

  &__price {
    font-size: 1.4rem;
    font-weight: 800;
    background: $primary-gradient;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    transition: $transition;
  }

  &__description {
    color: $text-secondary;
    line-height: 1.6;
    margin: 0;
    flex: 1;
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  &__tag {
    padding: 0.25rem 0.75rem;
    border-radius: 15px;
    font-size: 0.8rem;
    font-weight: 600;

    &--vegetarian {
      background: rgba(34, 197, 94, 0.1);
      color: #059669;
      border: 1px solid rgba(34, 197, 94, 0.2);
    }

    &--spicy {
      background: rgba(239, 68, 68, 0.1);
      color: #DC2626;
      border: 1px solid rgba(239, 68, 68, 0.2);
    }

    &--new {
      background: rgba(168, 85, 247, 0.1);
      color: #7C3AED;
      border: 1px solid rgba(168, 85, 247, 0.2);
    }
  }

  &__image-wrapper {
    position: relative;
    width: 140px;
    height: 140px;
    flex-shrink: 0;
  }

  &__image {
    width: 100%;
    height: 100%;
    border-radius: 15px;
    overflow: hidden;
    position: relative;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: $transition;
    }
  }

  &__no-image {
    width: 100%;
    height: 100%;
    background: $light-gradient;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $text-secondary;
    border-radius: 15px;
  }

  &__add-btn {
    position: absolute;
    bottom: -5px;
    right: -5px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: $primary-gradient;
    color: white;
    border: 3px solid white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0;
    transform: scale(0.8);
    transition: $transition;
    box-shadow: $shadow-medium;

    &:hover {
      transform: scale(1.1);
      box-shadow: $shadow-elevated;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: $medium-gray;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;

    &__image-wrapper {
      width: 100%;
      height: 200px;
    }
  }
}

// Cart sidebar elegante y estático (sin animaciones molestas)
.cart-sidebar {
  position: sticky;
  top: 120px;
  height: fit-content;

  @media (max-width: 992px) {
    position: static;
  }
}

.cart {
  background: linear-gradient(135deg, white 0%, rgba(248, 250, 252, 0.8) 100%);
  border-radius: 25px;
  overflow: hidden;
  box-shadow: $shadow-elevated;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 65, 108, 0.1);

  &__header {
    padding: 2rem 2rem 1rem;
    background: $primary-gradient;
    color: white;
    position: relative;

    &-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      z-index: 1;
    }
  }

  &__title {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1.4rem;
    font-weight: 800;
    margin: 0;

    &-icon {
      font-size: 1.5rem;
    }
  }

  &__clear {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    padding: 0.5rem;
    border-radius: 10px;
    cursor: pointer;
    transition: $transition;
    backdrop-filter: blur(10px);

    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }

  &__restaurant-info {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    position: relative;
    z-index: 1;
  }

  &__restaurant-logo {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.2);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1.1rem;
    border: 1px solid rgba(255, 255, 255, 0.3);
  }

  &__restaurant-details {
    flex: 1;
  }

  &__restaurant-name {
    display: block;
    font-weight: 700;
    font-size: 0.95rem;
  }

  &__delivery-time {
    display: block;
    opacity: 0.8;
    font-size: 0.8rem;
    margin-top: 0.25rem;
  }

  &__empty {
    padding: 3rem 2rem;
    text-align: center;
  }

  &__empty-icon {
    color: $text-secondary;
    margin-bottom: 1.5rem;
  }

  &__empty-title {
    font-size: 1.2rem;
    font-weight: 700;
    color: $text-primary;
    margin: 0 0 0.5rem;
  }

  &__empty-text {
    color: $text-secondary;
    line-height: 1.5;
    margin: 0;
  }

  &__content {
    padding: 0 0 2rem;
  }

  &__items {
    max-height: 400px;
    overflow-y: auto;
    padding: 1rem 2rem 0;
    
    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: rgba(226, 232, 240, 0.3);
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
      background: $primary-gradient;
      border-radius: 3px;
    }
  }

  &__summary {
    padding: 1.5rem 2rem;
    border-top: 2px solid $medium-gray;
    background: rgba(248, 250, 252, 0.5);
  }

  &__summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.75rem;
    font-size: 0.9rem;
    color: $text-secondary;

    &--total {
      font-size: 1.2rem;
      font-weight: 800;
      color: $text-primary;
      padding-top: 0.75rem;
      border-top: 1px solid $medium-gray;
      margin-top: 0.75rem;
    }
  }

  &__free-delivery {
    color: #06C167;
    font-weight: 700;
  }

  &__checkout-btn {
    width: calc(100% - 4rem);
    margin: 0 2rem 2rem;
    background: $primary-gradient;
    color: white;
    border: none;
    border-radius: 15px;
    padding: 1rem 1.5rem;
    font-size: 1.1rem;
    font-weight: 700;
    cursor: pointer;
    transition: $transition;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    box-shadow: $shadow-medium;

    &:hover:not(:disabled) {
      transform: translateY(-3px);
      box-shadow: $shadow-elevated;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }

    &-icon {
      font-size: 1.2rem;
    }
  }
}

// Cart items elegantes y estáticos
.cart-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(226, 232, 240, 0.5);
  position: relative;

  &:last-child {
    border-bottom: none;
  }

  &__quantity-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: $light-gradient;
    border-radius: 12px;
    padding: 0.25rem;
    border: 1px solid $medium-gray;
  }

  &__quantity-btn {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    border: none;
    background: white;
    color: $text-primary;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: $transition;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

    &:hover {
      background: $primary-gradient;
      color: white;
    }

    &--minus:hover {
      background: linear-gradient(135deg, #EF4444, #DC2626);
    }

    &--plus:hover {
      background: $success-gradient;
    }
  }

  &__quantity {
    min-width: 24px;
    text-align: center;
    font-weight: 700;
    color: $text-primary;
  }

  &__details {
    flex: 1;
  }

  &__name {
    font-weight: 600;
    color: $text-primary;
    margin: 0 0 0.5rem;
    font-size: 0.95rem;
  }

  &__actions {
    margin-top: 0.25rem;
  }

  &__remove {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    background: none;
    border: none;
    color: $text-secondary;
    font-size: 0.8rem;
    cursor: pointer;
    transition: $transition;
    padding: 0.25rem 0.5rem;
    border-radius: 6px;

    &:hover {
      background: rgba(239, 68, 68, 0.1);
      color: #EF4444;
    }
  }

  &__price-info {
    text-align: right;
  }

  &__unit-price {
    font-size: 0.8rem;
    color: $text-secondary;
    margin-bottom: 0.25rem;
  }

  &__total-price {
    font-weight: 700;
    color: $text-primary;
    font-size: 1rem;
  }
}

// Error y Not found states elegantes
.error-container,
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6rem 2rem;
  text-align: center;
  background: $primary-gradient;
  min-height: 100vh;
  color: white;

  &__icon {
    width: 100px;
    height: 100px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 2rem;
    backdrop-filter: blur(10px);
    border: 2px solid rgba(255, 255, 255, 0.3);
  }

  &__title {
    font-size: 2.5rem;
    font-weight: 800;
    margin: 0 0 1rem;
    text-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  }

  &__message,
  &__text {
    font-size: 1.1rem;
    opacity: 0.9;
    margin: 0 0 2rem;
    max-width: 500px;
    line-height: 1.6;
  }

  &__button {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.3);
    padding: 1rem 2rem;
    border-radius: 15px;
    font-weight: 700;
    text-decoration: none;
    transition: $transition;
    backdrop-filter: blur(10px);

    &:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-3px);
      box-shadow: $shadow-elevated;
    }
  }
}

// Responsive
@media (max-width: 768px) {
  .restaurant-hero {
    padding: 4rem 0 3rem;
    
    &__name {
      font-size: 2rem;
    }
    
    &__meta {
      flex-direction: column;
      gap: 1rem;
    }
  }
  
  .menu-section__title {
    font-size: 1.5rem;
  }
  
  .menu-item {
    padding: 1rem;
    
    &__name {
      font-size: 1.1rem;
    }
    
    &__price {
      font-size: 1.2rem;
    }
  }
  
  .cart {
    border-radius: 15px;
    
    &__header {
      padding: 1.5rem;
    }
    
    &__title {
      font-size: 1.2rem;
    }
  }

  .offers-grid {
    grid-template-columns: 1fr;
  }

  .category-filters__wrapper {
    justify-content: flex-start;
    overflow-x: auto;
    padding: 0 1rem;
  }
}
</style>