<!-- src/views/Cart.vue - ACTUALIZADO CON CÁLCULO DE DESCUENTOS -->
<template>
  <div class="cart-page">
    <div class="container">
      <!-- Empty cart state -->
      <div v-if="isEmpty" class="empty-cart">
        <div class="empty-cart__icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
        </div>
        <h2 class="empty-cart__title">Tu carrito está vacío</h2>
        <p class="empty-cart__text">Añade elementos de tus restaurantes favoritos para empezar tu pedido</p>
        <router-link to="/" class="empty-cart__button">Explorar restaurantes</router-link>
      </div>

      <!-- Cart with items -->
      <template v-else>
        <h1 class="cart-page__title">Mi carrito</h1>

        <div class="cart-wrapper">
          <!-- Cart items section -->
          <div class="cart-items">
            <div class="cart-restaurant">
              <div class="cart-restaurant__header">
                <div class="cart-restaurant__info">
                  <div class="cart-restaurant__logo">
                    <span>{{ restaurantInitials }}</span>
                  </div>
                  <div>
                    <h3 class="cart-restaurant__name">{{ restaurantName }}</h3>
                    <p class="cart-restaurant__delivery">Tiempo estimado de entrega: {{ deliveryTime }} min</p>
                  </div>
                </div>
                <router-link v-if="restaurantId" :to="`/restaurant/${restaurantId}`" class="cart-restaurant__link">
                  <span>Añadir más productos</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </router-link>
              </div>

              <!-- Cart item list CON OFERTAS -->
              <div class="cart-item-list">
                <div v-for="item in processedCartItems" :key="item.id" class="cart-item">
                  <div class="cart-item__image">
                    <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.name" />
                    <div v-else class="cart-item__placeholder">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                      </svg>
                    </div>
                  </div>

                  <div class="cart-item__details">
                    <div class="cart-item__name">{{ item.name || 'Producto' }}</div>
                    
                    <!-- Mostrar precio con descuento si aplica -->
                    <div v-if="item.appliedOffer" class="cart-item__price-with-offer">
                      <div class="cart-item__offer-badge">
                        {{ formatOfferBadge(item.appliedOffer) }}
                      </div>
                      <div class="cart-item__pricing">
                        <span class="cart-item__original-price">${{ item.originalPrice.toFixed(2) }}</span>
                        <span class="cart-item__discounted-price">${{ item.finalPrice.toFixed(2) }}</span>
                      </div>
                    </div>
                    <div v-else class="cart-item__price">
                      ${{ item.finalPrice.toFixed(2) }}
                    </div>

                    <div class="cart-item__actions">
                      <div class="cart-item__quantity">
                        <button class="cart-item__quantity-btn" @click="decrementItem(item.id)">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                        </button>
                        <span>{{ item.quantity || 0 }}</span>
                        <button class="cart-item__quantity-btn" @click="incrementItem(item.id)">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                        </button>
                      </div>

                      <button class="cart-item__remove" @click="removeItem(item.id)">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </div>

                  <div class="cart-item__subtotal">
                    ${{ (item.finalPrice * item.quantity).toFixed(2) }}
                  </div>
                </div>
              </div>

              <div class="cart-actions">
                <button class="cart-actions__clear" @click="clearCart">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                  Vaciar carrito
                </button>
              </div>
            </div>
          </div>

          <!-- Order summary section CON DESCUENTOS -->
          <div class="order-summary">
            <div class="order-summary__header">
              <h3 class="order-summary__title">Resumen del pedido</h3>
            </div>

            <div class="order-summary__content">
              <div class="order-summary__row">
                <span>Subtotal</span>
                <span>${{ calculatedTotals.subtotal.toFixed(2) }}</span>
              </div>
              <!-- Mostrar ahorros por ofertas -->
              <div v-if="calculatedTotals.totalOfferSavings > 0" class="order-summary__row order-summary__row--savings">
                <span>Ahorros por ofertas</span>
                <span>-${{ calculatedTotals.totalOfferSavings.toFixed(2) }}</span>
              </div>
              <div class="order-summary__row">
                <span>Costo de envío</span>
                <span v-if="deliveryFee > 0">${{ deliveryFee.toFixed(2) }}</span>
                <span v-else class="free-delivery">Gratis</span>
              </div>
              <div class="order-summary__row">
                <span>Impuestos</span>
                <span>${{ calculatedTotals.tax.toFixed(2) }}</span>
              </div>
              <div class="order-summary__row order-summary__total">
                <span>Total</span>
                <span>${{ calculatedTotals.total.toFixed(2) }}</span>
              </div>

              <div class="promocode">
                <input type="text" class="promocode__input" placeholder="Código promocional" v-model="promoCode" />
                <button class="promocode__button" @click="applyPromoCode" :disabled="applyingPromo">
                  <span v-if="!applyingPromo">Aplicar</span>
                  <span v-else>...</span>
                </button>
              </div>

              <div v-if="promoMessage" class="promo-message" :class="{ 'promo-message--error': !promoSuccess }">
                {{ promoMessage }}
              </div>

              <button @click="proceedToCheckout" class="checkout-button" :disabled="!canCheckout">
                <span>Proceder al pago</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';
import type { CartItem } from '@/stores/cart';

// ============= INTERFACES PARA OFERTAS =============
interface ProductOffer {
  id: number
  name: string
  description: string
  discountType: '%' | 'fixed'
  discountValue: number
  minimumOrderAmount: number
  minimumQuantity: number
  startDate: string
  endDate: string
  usageLimit: number
  usageCount: number
  status: string
  restaurantId: number
  restaurantName: string
  productId: number
  productName: string
  productImageUrl: string
}

interface ProcessedCartItem {
  id: number
  productId: number
  name: string
  imageUrl: string
  originalPrice: number
  finalPrice: number
  quantity: number
  appliedOffer?: ProductOffer
}

const router = useRouter();
const cartStore = useCartStore();
const authStore = useAuthStore();

// Estado
const promoCode = ref('');
const applyingPromo = ref(false);
const promoMessage = ref('');
const promoSuccess = ref(false);

// ============= ESTADO PARA OFERTAS =============
const activeOffers = ref<ProductOffer[]>([]);
const loadingOffers = ref(false);

// Computed properties
const isEmpty = computed(() => cartStore.isEmpty);
const cartItems = computed(() => cartStore.items);
const restaurantId = computed(() => cartStore.restaurantId);
const restaurantName = computed(() => cartStore.restaurantName || 'Restaurante');
const deliveryTime = ref(cartStore.estimatedDeliveryTime || 25);

// ============= LÓGICA DE OFERTAS (COPIADA DE RESTAURANTDETAIL) =============

// Helper function para números seguros
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

// Función para obtener oferta aplicable a un producto
const getApplicableOffer = (product: any, currentSubtotal: number): ProductOffer | null => {
  if (!activeOffers.value.length) {
    return null;
  }
  
  // Buscar ofertas para este producto específico
  const productOffers = activeOffers.value.filter(offer => {
    const matchesProduct = offer.productId === product.id || offer.productId === product.productId;
    const meetsMinimumAmount = currentSubtotal >= offer.minimumOrderAmount;
    const isActive = offer.status === 'active';
    
    return matchesProduct && meetsMinimumAmount && isActive;
  });
  
  if (!productOffers.length) return null;
  
  // Devolver la mejor oferta (mayor descuento)
  const bestOffer = productOffers.reduce((best, current) => {
    const originalPrice = getProductPrice(product);
    const bestDiscount = best.discountType === '%' ? 
      (originalPrice * best.discountValue / 100) : 
      best.discountValue;
      
    const currentDiscount = current.discountType === '%' ? 
      (originalPrice * current.discountValue / 100) : 
      current.discountValue;
      
    return currentDiscount > bestDiscount ? current : best;
  });
  
  return bestOffer;
};

// Función para calcular precio con descuento
const calculateDiscountedPrice = (product: any, offer: ProductOffer | null): number => {
  const originalPrice = getProductPrice(product);
  
  if (!offer) {
    return originalPrice;
  }
  
  let discountedPrice: number;
  
  if (offer.discountType === '%') {
    discountedPrice = originalPrice * (1 - offer.discountValue / 100);
  } else {
    discountedPrice = Math.max(0, originalPrice - offer.discountValue);
  }
  
  return discountedPrice;
};

// ============= PRODUCTOS PROCESADOS CON OFERTAS =============
const processedCartItems = computed((): ProcessedCartItem[] => {
  if (!cartItems.value.length) return [];
  
  // Calcular subtotal actual para validar ofertas
  const currentSubtotal = cartItems.value.reduce((sum, item) => {
    return sum + (getProductPrice(item) * item.quantity);
  }, 0);
  
  return cartItems.value.map(item => {
    const originalPrice = getProductPrice(item);
    const offer = getApplicableOffer(item, currentSubtotal);
    const finalPrice = offer ? calculateDiscountedPrice(item, offer) : originalPrice;
    
    return {
      id: item.id,
      productId: item.productId || item.id,
      name: item.name || 'Producto',
      imageUrl: item.imageUrl || '',
      originalPrice,
      finalPrice,
      quantity: item.quantity,
      appliedOffer: offer || undefined
    };
  });
});

// Calculate order values with safe number handling y ofertas aplicadas
const deliveryFee = ref(cartStore.deliveryFee || 3.99);
const taxRate = 0.16;

// ============= TOTALES CALCULADOS CON OFERTAS =============
const calculatedTotals = computed(() => {
  const subtotalWithOffers = processedCartItems.value.reduce((sum, item) => {
    return sum + (item.finalPrice * item.quantity);
  }, 0);
  
  const originalSubtotal = processedCartItems.value.reduce((sum, item) => {
    return sum + (item.originalPrice * item.quantity);
  }, 0);
  
  const totalOfferSavings = originalSubtotal - subtotalWithOffers;
  const tax = subtotalWithOffers * taxRate;
  const total = subtotalWithOffers + deliveryFee.value + tax;
  
  return {
    subtotal: subtotalWithOffers,
    originalSubtotal,
    totalOfferSavings,
    tax,
    total
  };
});

// Restaurant initials for logo placeholder
const restaurantInitials = computed(() => {
  const name = restaurantName.value;
  if (!name || name === 'Restaurante') return 'R';

  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
});

// Validation
const canCheckout = computed(() => {
  return !isEmpty.value && authStore.isAuthenticated && calculatedTotals.value.subtotal > 0;
});

// ============= FUNCIONES AUXILIARES PARA OFERTAS =============
const formatOfferBadge = (offer: ProductOffer): string => {
  if (offer.discountType === '%') {
    return `${offer.discountValue}% OFF`;
  } else {
    return `$${offer.discountValue} OFF`;
  }
};

// Función para cargar ofertas activas del restaurante
const fetchActiveOffers = async (): Promise<void> => {
  if (!restaurantId.value) return;
  
  try {
    loadingOffers.value = true;
    const url = `http://localhost:5290/api/restaurants/${restaurantId.value}/offers/active`;
    
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    
    // Agregar token si está disponible
    if (authStore.token) {
      headers['Authorization'] = `Bearer ${authStore.token}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers
    });
    
    if (response.ok) {
      const offers = await response.json();
      activeOffers.value = offers || [];
      console.log('✅ Ofertas cargadas en cart:', offers.length);
    } else {
      activeOffers.value = [];
    }
  } catch (error) {
    console.error('❌ Error cargando ofertas en cart:', error);
    activeOffers.value = [];
  } finally {
    loadingOffers.value = false;
  }
};

// Methods
const incrementItem = async (itemId: number) => {
  const item = cartItems.value.find(item => item.id === itemId);
  if (item) {
    await cartStore.updateQuantity(itemId, safeNumber(item.quantity, 0) + 1);
  }
};

const decrementItem = async (itemId: number) => {
  const item = cartItems.value.find(item => item.id === itemId);
  if (item) {
    const currentQuantity = safeNumber(item.quantity, 0);
    if (currentQuantity > 1) {
      await cartStore.updateQuantity(itemId, currentQuantity - 1);
    } else {
      removeItem(itemId); // Si es 1 y decrementa, se elimina
    }
  }
};

const removeItem = (itemId: number) => {
  cartStore.removeItem(itemId);
};

const clearCart = () => {
  if (confirm('¿Estás seguro de que deseas vaciar tu carrito?')) {
    cartStore.clearCart();
  }
};

const applyPromoCode = async () => {
  const code = promoCode.value.trim();
  if (!code) {
    promoMessage.value = 'Por favor, ingresa un código promocional.';
    promoSuccess.value = false;
    return;
  }

  applyingPromo.value = true;
  promoMessage.value = '';

  try {
    // Simular validación de código promocional
    // Reemplazar con llamada real al servicio si es necesario
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulación

    // Ejemplo de simulación:
    if (code.toUpperCase() === 'DESCUENTO10') {
      promoMessage.value = '¡Descuento del 10% aplicado!';
      promoSuccess.value = true;
      // Aquí deberías actualizar el subtotal/total o aplicar el descuento en cartStore
    } else {
      promoMessage.value = 'El código promocional ingresado no es válido.';
      promoSuccess.value = false;
    }
  } catch (error) {
    console.error('Error applying promo code:', error);
    promoMessage.value = 'Ocurrió un error al validar el código.';
    promoSuccess.value = false;
  } finally {
    applyingPromo.value = false;
  }
};

const proceedToCheckout = () => {
  if (!authStore.isAuthenticated) {
    alert('Por favor, inicia sesión para continuar con tu pedido.');
    router.push({ name: 'Login', query: { redirect: '/cart' } });
    return;
  }

  if (!canCheckout.value) {
     if (isEmpty.value) {
        alert('Tu carrito está vacío.');
     } else if (calculatedTotals.value.subtotal <= 0) {
        alert('El total de tu pedido debe ser mayor a cero.');
     }
    return;
  }
  router.push('/checkout');
};

// Watcher para recalcular cuando cambien las ofertas
watch(activeOffers, () => {
  console.log('🔄 Ofertas actualizadas, recalculando precios del cart');
}, { deep: true });

// Watcher para cargar ofertas cuando cambie el restaurante
watch(restaurantId, async (newRestaurantId) => {
  if (newRestaurantId) {
    await fetchActiveOffers();
  }
}, { immediate: true });

// Inicialización
onMounted(async () => {
  console.log("Cart.vue mounted. Auth state:", authStore.isAuthenticated);
  
  // Cargar ofertas si hay un restaurante seleccionado
  if (restaurantId.value) {
    await fetchActiveOffers();
  }
  
  // Validar carrito si no está vacío
  if (!isEmpty.value) {
    try {
      await cartStore.validateCart();
    } catch (error) {
      console.error('Error validating cart on mount:', error);
    }
  }
});
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
$error-color: #ff4444;
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

.cart-page {
  background-color: $light-gray;
  min-height: 100vh;
  padding: 40px 0 60px;

  &__title {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 24px;
    color: $text-primary;
  }
}

// Empty cart
.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 60px 0;

  &__icon {
    width: 120px;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: $white;
    border-radius: 50%;
    color: $text-secondary;
    margin-bottom: 32px;
    box-shadow: $box-shadow;
  }

  &__title {
    font-size: 24px;
    font-weight: 700;
    color: $text-primary;
    margin: 0 0 12px;
  }

  &__text {
    font-size: 16px;
    color: $text-secondary;
    margin: 0 0 32px;
    max-width: 500px;
    line-height: 1.6;
  }

  &__button {
    background-color: $primary-color;
    color: $white;
    font-weight: 600;
    padding: 12px 24px;
    border-radius: $border-radius-sm;
    text-decoration: none;
    box-shadow: 0 4px 8px rgba(6, 193, 103, 0.2);
    transition: $transition;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(6, 193, 103, 0.3);
    }
  }
}

// Cart wrapper
.cart-wrapper {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 24px;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
}

// Cart items
.cart-items {
  background-color: $white;
  border-radius: $border-radius;
  box-shadow: $box-shadow;
  overflow: hidden;
}

// Cart restaurant
.cart-restaurant {
  padding: 24px;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }
  }

  &__info {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  &__logo {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    background-color: $primary-color;
    color: $white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 18px;
  }

  &__name {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 4px;
    color: $text-primary;
  }

  &__delivery {
    font-size: 14px;
    color: $text-secondary;
    margin: 0;
  }

  &__link {
    display: flex;
    align-items: center;
    gap: 8px;
    color: $primary-color;
    font-weight: 500;
    text-decoration: none;
    padding: 8px 12px;
    border-radius: 8px;
    transition: $transition;

    &:hover {
      background-color: rgba($primary-color, 0.1);
    }
  }
}

// Cart item list
.cart-item-list {
  border-top: 1px solid $light-gray;
  margin-bottom: 24px;
}

// Cart item CON OFERTAS
.cart-item {
  display: flex;
  padding: 16px 0;
  border-bottom: 1px solid $light-gray;

  @media (max-width: 576px) {
    flex-direction: column;
    gap: 16px;
  }

  &__image {
    width: 80px;
    height: 80px;
    border-radius: 8px;
    overflow: hidden;
    margin-right: 16px;
    flex-shrink: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__placeholder {
    width: 100%;
    height: 100%;
    background-color: $light-gray;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $text-secondary;
  }

  &__details {
    flex: 1;
  }

  &__name {
    font-weight: 500;
    margin-bottom: 8px;
    color: $text-primary;
  }

  // ============= ESTILOS PARA OFERTAS =============
  &__price-with-offer {
    margin-bottom: 16px;
  }

  &__offer-badge {
    background: linear-gradient(135deg, #059669, #10b981);
    color: white;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.7rem;
    font-weight: 700;
    display: inline-block;
    margin-bottom: 6px;
    box-shadow: 0 2px 4px rgba(5, 150, 105, 0.2);
    animation: pulse 2s infinite;
  }

  &__pricing {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__original-price {
    font-size: 14px;
    color: $text-secondary;
    text-decoration: line-through;
  }

  &__discounted-price {
    font-weight: 600;
    color: #059669;
    font-size: 16px;
  }

  &__price {
    color: $text-secondary;
    font-size: 14px;
    margin-bottom: 16px;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  &__quantity {
    display: flex;
    align-items: center;
    gap: 4px;

    span {
      min-width: 24px;
      text-align: center;
      font-weight: 600;
    }
  }

  &__quantity-btn {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    border: 1px solid $medium-gray;
    background-color: $white;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $text-primary;
    cursor: pointer;
    transition: $transition;

    &:hover {
      background-color: $light-gray;
    }
  }

  &__remove {
    display: flex;
    align-items: center;
    gap: 6px;
    background-color: transparent;
    border: none;
    color: $text-secondary;
    cursor: pointer;
    transition: $transition;
    padding: 6px 8px;
    border-radius: 6px;

    &:hover {
      color: $error-color;
      background-color: rgba($error-color, 0.1);
    }

    svg {
      stroke: currentColor;
    }
  }

  &__subtotal {
    font-weight: 600;
    color: $text-primary;
    margin-left: 16px;
    text-align: right;
    min-width: 70px;

    @media (max-width: 576px) {
      text-align: left;
      margin-left: 0;
    }
  }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

// Cart actions
.cart-actions {
  display: flex;
  justify-content: flex-end;

  &__clear {
    display: flex;
    align-items: center;
    gap: 8px;
    background-color: transparent;
    border: 1px solid $medium-gray;
    padding: 8px 16px;
    border-radius: 8px;
    color: $text-secondary;
    font-weight: 500;
    cursor: pointer;
    transition: $transition;

    &:hover {
      background-color: rgba($error-color, 0.1);
      border-color: $error-color;
      color: $error-color;
    }

    svg {
      stroke: currentColor;
    }
  }
}

// Order summary
.order-summary {
  background-color: $white;
  border-radius: $border-radius;
  box-shadow: $box-shadow;
  overflow: hidden;
  position: sticky;
  top: 24px;

  &__header {
    padding: 24px;
    border-bottom: 1px solid $light-gray;
  }

  &__title {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
    color: $text-primary;
  }

  &__content {
    padding: 24px;
  }

  &__row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
    font-size: 14px;
    color: $text-secondary;

    &:last-child {
      margin-bottom: 24px;
    }

    // ============= ESTILO PARA AHORROS =============
    &--savings {
      color: #059669;
      font-weight: 600;

      span:last-child {
        color: #059669;
      }
    }
  }

  &__total {
    padding-top: 16px;
    margin-top: 16px;
    border-top: 1px solid $light-gray;
    font-size: 18px;
    font-weight: 600;
    color: $text-primary;
  }
}

// Free delivery
.free-delivery {
  color: $success-color;
  font-weight: 600;
}

// Promocode
.promocode {
  display: flex;
  margin-bottom: 16px;

  &__input {
    flex: 1;
    height: 44px;
    padding: 0 16px;
    border: 1px solid $medium-gray;
    border-radius: 8px 0 0 8px;
    font-size: 14px;

    &:focus {
      outline: none;
      border-color: $primary-color;
    }
  }

  &__button {
    height: 44px;
    padding: 0 16px;
    background-color: $primary-color;
    border: none;
    border-radius: 0 8px 8px 0;
    color: $white;
    font-weight: 600;
    cursor: pointer;
    transition: $transition;

    &:hover:not(:disabled) {
      background-color: #059142;
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }
}

.promo-message {
  font-size: 14px;
  padding: 8px 12px;
  border-radius: 6px;
  margin-bottom: 16px;
  background-color: rgba($success-color, 0.1);
  color: $success-color;

  &--error {
    background-color: rgba($error-color, 0.1);
    color: $error-color;
  }
}

// Checkout button
.checkout-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 50px;
  background-color: $primary-color;
  border: none;
  border-radius: 8px;
  color: $white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: $transition;
  box-shadow: 0 4px 8px rgba(6, 193, 103, 0.2);

  &:hover:not(:disabled) {
    background-color: #059142;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(6, 193, 103, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
}
</style>