<template>
  <div class="restaurant-detail-page">
    <!-- Error message -->
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
      <router-link to="/" class="error-button">Volver a la lista de restaurantes</router-link>
    </div>

    <!-- Loader -->
    <div v-else-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p class="loading-text">Cargando información del restaurante</p>
    </div>

    <template v-else-if="restaurant">
      <!-- Hero section with restaurant cover and basic info -->
      <section class="restaurant-hero" :style="{ backgroundImage: `url(${restaurant.coverImageUrl})` }">
        <div class="restaurant-hero__overlay"></div>
        <div class="container">
          <div class="restaurant-hero__content">
            <div class="restaurant-hero__logo">
              <img :src="restaurant.logoUrl" :alt="restaurant.name" />
            </div>
            <div class="restaurant-hero__info">
              <h1 class="restaurant-hero__name">{{ restaurant.name }}</h1>
              <div class="restaurant-hero__tags">
                <span>{{ restaurant.cuisines || 'Variada' }}</span>
                <span class="dot-separator"></span>
                <span>{{ restaurant.priceRange || '$$' }}</span>
                <span class="dot-separator"></span>
                <span>{{ restaurant.distance || '1.2' }} km</span>
              </div>
              <div class="restaurant-hero__rating">
                <span class="restaurant-hero__rating-score">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#FFCC00" stroke="#FFCC00" stroke-width="0.5"
                    stroke-linecap="round" stroke-linejoin="round">
                    <polygon
                      points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2">
                    </polygon>
                  </svg>
                  {{ safeNumber(restaurant.averageRating, 0).toFixed(1) }}
                </span>
                <span class="restaurant-hero__rating-count">({{ safeNumber(restaurant.reviewCount, 0) }}
                  opiniones)</span>
              </div>
              <div class="restaurant-hero__delivery">
                <div class="delivery-info">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span>{{ safeNumber(restaurant.estimatedDeliveryTime, 30) }} min</span>
                </div>
                <div class="delivery-info">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="2" x2="12" y2="6"></line>
                    <line x1="12" y1="18" x2="12" y2="22"></line>
                    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                    <line x1="2" y1="12" x2="6" y2="12"></line>
                    <line x1="18" y1="12" x2="22" y2="12"></line>
                    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                  </svg>
                  <span v-if="safeNumber(restaurant.deliveryFee, 0) > 0">${{ safeNumber(restaurant.deliveryFee,
                    0).toFixed(2) }} de
                    envío</span>
                  <span v-else class="free-delivery">Envío gratis</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Menu category navigation -->
      <section class="category-nav">
        <div class="container">
          <div class="category-scroll">
            <div class="category-scroll__container" ref="categoriesContainer">
              <button v-for="category in menuCategories" :key="category.id" class="category-nav__item"
                :class="{ 'category-nav__item--active': activeCategory === category.id }"
                @click="scrollToCategory(category.id)">
                {{ category.name }}
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Main content with menu items and cart -->
      <section class="restaurant-content">
        <div class="container">
          <div class="restaurant-content__wrapper">
            <!-- Menu sections -->
            <div class="menu-sections">
              <!-- Menu sections -->
              <div v-for="category in menuCategories" :key="category.id" :id="`category-${category.id}`"
                class="menu-section" ref="menuSections">
                <h2 class="menu-section__title">{{ category.name }}</h2>

                <div class="menu-items">
                  <div v-for="item in category.items" :key="item.id" class="menu-item">
                    <div class="menu-item__content">
                      <h3 class="menu-item__name">{{ item.name || 'Producto' }}</h3>
                      <p class="menu-item__description">{{ item.description || '' }}</p>
                      <div class="menu-item__price">
                        ${{ getProductPrice(item) > 0 ? getProductPrice(item).toFixed(2) : 'Precio no disponible' }}
                      </div>
                      <div v-if="item.popular" class="menu-item__badge">Popular</div>
                    </div>
                    <div class="menu-item__image">
                      <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.name">
                      <div v-else class="menu-item__no-image"></div>
                     <button class="menu-item__add" @click="addToCart(item)" :disabled="getProductPrice(item) <= 0">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                          stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
                  <button v-if="cartItems.length > 0" class="cart__clear" @click="clearCart">
                    Vaciar carrito
                  </button>
                </div>

                <div v-if="cartItems.length === 0" class="cart__empty">
                  <div class="cart__empty-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"
                      stroke-linecap="round" stroke-linejoin="round">
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
                    <div v-for="(item, index) in cartItems" :key="item.id" class="cart-item">
                      <div class="cart-item__quantity">
                        <button class="cart-item__quantity-btn" @click="decrementItem(item.id)">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                        </button>
                        <span>{{ safeNumber(item.quantity, 0) }}</span>
                        <button class="cart-item__quantity-btn" @click="incrementItem(item.id)">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                        </button>
                      </div>

                      <div class="cart-item__details">
                        <div class="cart-item__name">{{ item.name || 'Producto' }}</div>
                        <button class="cart-item__remove" @click="removeItem(item.id)">
                          Eliminar
                        </button>
                      </div>

                      <div class="cart-item__price">${{ (safeNumber(item.price, 0) * safeNumber(item.quantity,
                        0)).toFixed(2) }}
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
                      <span v-if="safeNumber(restaurant.deliveryFee, 0) > 0">${{
                        safeNumber(restaurant.deliveryFee, 0).toFixed(2) }}</span>
                      <span v-else class="free-delivery">Gratis</span>
                    </div>
                    <div class="cart__row cart__row--total">
                      <span>Total</span>
                      <span>${{ total.toFixed(2) }}</span>
                    </div>
                  </div>

                  <button class="cart__checkout-btn" @click="proceedToCheckout" :disabled="cartItems.length === 0">
                    {{ cartItems.length > 0 ? 'Realizar pedido' : 'Agrega productos' }}
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
const activeCategory = ref('')

// Referencias para el scroll
const categoriesContainer = ref<HTMLElement | null>(null)
const menuSections = ref<HTMLElement[]>([])

// Helper function for safe numbers
const safeNumber = (value: any, defaultValue: number = 0): number => {
  if (value === null || value === undefined || value === '') {
    return defaultValue;
  }
  const num = typeof value === 'number' ? value : parseFloat(value);
  return isNaN(num) ? defaultValue : num;
};

// Función corregida para obtener el precio real del producto
const getProductPrice = (product: any): number => {
  console.log('🔍 Obteniendo precio para:', product.name, product);

  // Prioridad de campos de precio
  const priceFields = ['price', 'unitPrice', 'basePrice', 'salePrice', 'cost'];

  for (let field of priceFields) {
    if (product[field] !== null && product[field] !== undefined && product[field] !== '') {
      const testPrice = typeof product[field] === 'number' ? product[field] : parseFloat(product[field]);
      if (!isNaN(testPrice) && testPrice > 0) {
        console.log(`✅ Precio encontrado en ${field}:`, testPrice);
        return testPrice;
      }
    }
  }

  console.log('❌ No se encontró precio válido para:', product.name);
  return 0;
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

// Cargar datos del restaurante desde el backend - CORREGIDA PARA NO MODIFICAR PRECIOS
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

    // Obtener datos del restaurante
    const restaurantData = await restaurantService.getRestaurantById(id)
    restaurant.value = restaurantData

    // Obtener productos del restaurante
    const products = await restaurantService.getProductsByRestaurant(id)

    console.log('🔍 Productos del backend:', products);

    // Procesar productos SIN MODIFICAR PRECIOS - MANTENER TAL COMO VIENEN
    menuItems.value = products.map((product, index) => {
      console.log(`🔍 Producto ${index + 1}:`, product);
      console.log(`🔍 Precio original de "${product.name}":`, product.price, typeof product.price);

      // MANTENER TODO TAL COMO VIENE DEL BACKEND
      const processedProduct = {
        ...product, // Mantener TODOS los campos tal como vienen
        name: product.name || 'Producto sin nombre',
        description: product.description || '',
        imageUrl: product.imageUrl || '',
        isAvailable: product.isAvailable !== false
        // NO TOCAR EL PRECIO AQUÍ - USAR TAL COMO VIENE
      };

      console.log(`✅ Producto procesado "${processedProduct.name}":`, {
        precioOriginal: product.price,
        precioFinal: processedProduct.price, // Será el mismo que el original si product.price existe
        disponible: processedProduct.isAvailable
      });

      return processedProduct;
    });

    console.log('✅ Todos los productos procesados:', menuItems.value);

    // Organizar productos por categorías
    menuCategories.value = restaurantService.organizeProductsByCategory(menuItems.value)

    // Establecer la primera categoría como activa
    if (menuCategories.value.length > 0) {
      activeCategory.value = menuCategories.value[0].id.toString()
    }

  } catch (err: any) {
    console.error('❌ Error al cargar el restaurante:', err)
    error.value = err.message || 'Error al cargar los datos del restaurante'
    restaurant.value = null
  } finally {
    loading.value = false
  }
}

// Función corregida para agregar al carrito - USA EL PRECIO REAL
const addToCart = async (item: MenuItem) => {
  console.log('🛒 Intentando agregar:', item);

  if (!item || !item.id) {
    console.error('❌ Item inválido');
    return;
  }

  // USAR EL PRECIO REAL DEL PRODUCTO - NO FALLBACK
  const realPrice = getProductPrice(item);

  if (realPrice <= 0) {
    alert('Este producto no tiene un precio válido o no está disponible.'); // Mensaje más claro
    console.error('❌ Producto sin precio válido:', item);
    return;
  }

  console.log(`✅ Usando precio real: $${realPrice}`);

  // Verificar disponibilidad (aunque getProductPrice ya podría implicar esto si precio es 0)
  if (item.isAvailable === false) { // Chequeo explícito
    alert('Este producto no está disponible en este momento.');
    return;
  }

  // Verificar cambio de restaurante
  if (cartStore.restaurantId && cartStore.restaurantId !== restaurantId.value) {
    if (confirm(`Tu carrito contiene elementos de "${cartStore.restaurantName}". ¿Deseas vaciarlo para pedir de "${restaurant.value?.name}"?`)) {
      cartStore.clearCart()
    } else {
      return
    }
  }

  // Crear item con el precio REAL
  const cartItem = {
    id: item.id, // Usar el ID del producto como ID del item en el carrito para unicidad
    productId: item.id,
    name: item.name || 'Producto',
    price: realPrice, // PRECIO REAL
    imageUrl: item.imageUrl || '',
    restaurantId: restaurantId.value || 0, // Asegurar que restaurantId.value no sea null
    restaurantName: restaurant.value?.name || '',
    categoryId: item.categoryId || 0,
    isAvailable: true, // Si llega aquí, está disponible para agregar
    description: item.description || '',
    businessId: restaurant.value?.businessId || restaurantId.value || 0, // Usar businessId del restaurante si existe
    businessName: restaurant.value?.name || '',
    quantity: 1
  }

  console.log('🛒 CartItem a agregar:', cartItem);

  try {
    // addToCart en cartStore podría necesitar el restaurantId explícitamente si no lo deduce del item
    const success = await cartStore.addToCart(cartItem, 1);
    if (success) {
      console.log('✅ Agregado exitosamente al carrito:', item.name);
    } else {
      console.error('❌ Error del store al agregar al carrito:', cartStore.error);
      alert(cartStore.error || 'No se pudo agregar el producto al carrito.');
    }
  } catch (exceptionError) { // Renombrar para evitar conflicto con la variable 'error' del estado
    console.error('❌ Excepción al agregar al carrito:', exceptionError);
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
      // Si la cantidad es 1 y se decrementa, eliminar el item
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
  // Accede a isAuthenticated como una propiedad, no como una función
  if (!authStore.isAuthenticated) {
    alert('Por favor, inicia sesión para continuar con tu pedido.'); // Mensaje al usuario
    router.push('/login'); // Redirigir a login
    return;
  }

  if (cartItems.value.length === 0) {
    alert('Tu carrito está vacío. Agrega productos antes de continuar.'); // Mensaje al usuario
    return; // No hacer nada si el carrito está vacío
  }

  // Si está autenticado y el carrito no está vacío, proceder al checkout
  router.push('/checkout');
}

// Navegación de categorías
const scrollToCategory = (categoryId: string | number) => {
  activeCategory.value = categoryId.toString()

  nextTick(() => {
    const section = document.getElementById(`category-${categoryId}`)
    if (section) {
      const navElement = document.querySelector('.category-nav') as HTMLElement | null;
      const navHeight = navElement ? navElement.clientHeight : 0;
      // Considerar también el offset del header principal si es sticky
      const headerOffset = (document.querySelector('header.main-header') as HTMLElement | null)?.clientHeight || 0;
      const topOffset = section.getBoundingClientRect().top + window.pageYOffset - navHeight - headerOffset - 20; // Ajuste adicional de 20px

      window.scrollTo({
        top: topOffset,
        behavior: 'smooth'
      })
    }
  })
}

// Observer para detectar qué sección es visible
const setupIntersectionObserver = () => {
  if (!('IntersectionObserver' in window)) return

  const navElement = document.querySelector('.category-nav') as HTMLElement | null;
  const navHeight = navElement ? navElement.clientHeight : 0;
  const headerOffset = (document.querySelector('header.main-header') as HTMLElement | null)?.clientHeight || 0;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const categoryId = entry.target.id.replace('category-', '')
        activeCategory.value = categoryId
      }
    })
  }, {
    rootMargin: `-${navHeight + headerOffset + 10}px 0px -50% 0px`, // Ajustar el rootMargin
    threshold: 0 // Detectar apenas entre en la zona
  })

  // Re-seleccionar las secciones dentro de nextTick o después de que se rendericen
  nextTick(() => {
    const sections = document.querySelectorAll('.menu-section');
    if (sections.length > 0) {
        sections.forEach(section => observer.observe(section as HTMLElement));
    } else {
        console.warn("No se encontraron .menu-section para el IntersectionObserver");
    }
  });
}

// Handler para cambio de ruta
watch(() => route.params.id, (newId, oldId) => {
  if (newId && newId !== oldId) { // Asegurar que newId exista
    fetchRestaurantData()
    // Re-inicializar el observer si el restaurante cambia y las secciones se regeneran
    nextTick(() => {
        if (document.querySelectorAll('.menu-section').length > 0) {
            setupIntersectionObserver();
        }
    });
  }
}, { immediate: false }) // immediate: false para que no se ejecute al montar si onMounted ya lo hace

// Inicialización
onMounted(async () => {
  console.log('🚀 Montando componente RestaurantDetail para ID:', route.params.id);
  await fetchRestaurantData()

  // El IntersectionObserver se configura mejor después de que los datos están cargados y el DOM actualizado
  //  watch(menuCategories, (newCategories) => { // Observar cuando las categorías (y por ende las secciones) cambian
  //    if (newCategories.length > 0) {
  //      nextTick(() => {
  //        setupIntersectionObserver();
  //      });
  //    }
  //  }, { deep: true });

  // O, si prefieres llamarlo una vez después de fetchRestaurantData:
  if (menuCategories.value.length > 0) {
       nextTick(() => {
           setupIntersectionObserver();
       });
   }
})
</script>

<style lang="scss" scoped>
// Variables
$primary-color: #06C167;
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
      background-color: #059142;
      transform: scale(1.1);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background-color: $medium-gray;
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

    &:hover:not(:disabled) {
      background-color: #059142;
    }

    &:disabled {
      background-color: $medium-gray;
      cursor: not-allowed;
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

// Not found and Error states
.not-found,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 0;
  text-align: center;

  .not-found__icon,
  .error-icon {
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

  .not-found__title,
  .error-title {
    font-size: 24px;
    font-weight: 700;
    color: $text-primary;
    margin: 0 0 12px;
  }

  .not-found__text,
  .error-message {
    color: $text-secondary;
    margin: 0 0 24px;
    max-width: 500px;
  }

  .not-found__button,
  .error-button {
    background-color: $primary-color;
    color: $white;
    border: none;
    padding: 12px 24px;
    border-radius: $border-radius-sm;
    font-weight: 600;
    text-decoration: none;
    transition: $transition;

    &:hover {
      background-color: #059142;
    }
  }
}
</style>
