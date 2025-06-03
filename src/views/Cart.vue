<template>
  <div class="cart-page">
    <div class="container">
      <!-- Empty cart state -->
      <div v-if="isEmpty" class="empty-cart">
        <div class="empty-cart__icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"
            stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
        </div>
        <h2 class="empty-cart__title">Tu carrito está vacío</h2>
        <p class="empty-cart__text">
          Añade elementos de tus restaurantes favoritos para empezar tu pedido
        </p>
        <router-link to="/restaurants" class="empty-cart__button">
          Explorar restaurantes
        </router-link>
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
                    <p class="cart-restaurant__delivery">
                      Tiempo estimado de entrega: {{ deliveryTime }} min
                    </p>
                  </div>
                </div>
                <router-link v-if="restaurantId" :to="`/restaurant/${restaurantId}`" class="cart-restaurant__link">
                  <span>Añadir más productos</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </router-link>
              </div>

              <!-- Cart item list CON LÓGICA CORRECTA DEL CHECKOUT -->
              <div class="cart-item-list">
                <div v-for="item in processedCartItems" :key="item.id" class="cart-item">
                  <div class="cart-item__image">
                    <!-- Etiqueta de descuento -->
                    <div v-if="item.appliedOffer" class="cart-item__discount-badge">
                      {{ getDiscountBadgeText(item) }}
                    </div>
                    <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.name" />
                    <div v-else class="cart-item__placeholder">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"
                        stroke-linecap="round" stroke-linejoin="round">
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
                        <span v-if="item.appliedOffer.isAutoDetected">DESCUENTO APLICADO</span>
                        <span v-else>OFERTA APLICADA</span>
                      </div>
                      <div class="cart-item__pricing">
                        <span class="cart-item__original-price">
                          ${{ item.originalPrice.toFixed(2) }}
                        </span>
                        <span class="cart-item__discounted-price">
                          ${{ item.finalPrice.toFixed(2) }}
                        </span>
                        <span class="cart-item__savings">
                          (Ahorras ${{ (item.originalPrice - item.finalPrice).toFixed(2) }})
                        </span>
                      </div>
                    </div>
                    <div v-else class="cart-item__price">
                      ${{ item.finalPrice.toFixed(2) }}
                    </div>

                    <div class="cart-item__actions">
                      <div class="cart-item__quantity">
                        <button class="cart-item__quantity-btn" @click="decrementItem(item.id)">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                        </button>
                        <span>{{ item.quantity || 0 }}</span>
                        <button class="cart-item__quantity-btn" @click="incrementItem(item.id)">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                        </button>
                      </div>

                      <button class="cart-item__remove" @click="removeItem(item.id)">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                          stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4
                               a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
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
                <button class="cart-actions__clear" @click="showClearCartConfirm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4
                         a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                  Vaciar carrito
                </button>
              </div>
            </div>
          </div>

          <!-- Order summary section CON LÓGICA CORRECTA DEL CHECKOUT -->
          <div class="order-summary">
            <div class="order-summary__header">
              <h3 class="order-summary__title">Resumen del pedido</h3>
            </div>

            <div class="order-summary__content">
              <!-- Mostramos el subtotal original (antes de ofertas) -->
              <div class="order-summary__row">
                <span>Subtotal </span>
                <span>${{ cartTotals.originalSubtotal.toFixed(2) }}</span>
              </div>
              <!-- Ahorros por ofertas -->
              <div v-if="cartTotals.totalOfferSavings > 0" class="order-summary__row order-summary__row--savings">
                <span>Ahorros por ofertas</span>
                <span>− ${{ cartTotals.totalOfferSavings.toFixed(2) }}</span>
              </div>
              <!-- Costo de envío -->
              <div class="order-summary__row">
                <span>Costo de envío</span>
                <span v-if="deliveryFee > 0">${{ deliveryFee.toFixed(2) }}</span>
                <span v-else class="free-delivery">Gratis</span>
              </div>
              <!-- Total final (subtotal con ofertas + envío) -->
              <div class="order-summary__row order-summary__total">
                <span>Total</span>
                <span>${{ finalTotal.toFixed(2) }}</span>
              </div>

              <button @click="proceedToCheckout" class="checkout-button" :disabled="!canCheckout">
                <span>Proceder al pago</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- ✅ Diálogo de confirmación personalizado -->
    <ConfirmDialog :visible="showConfirmDialog" :title="confirmDialog.title" :message="confirmDialog.message"
      :confirm-text="confirmDialog.confirmText" :cancel-text="confirmDialog.cancelText"
      @confirm="confirmDialog.onConfirm" @cancel="hideConfirmDialog" />

    <!-- ✅ Componente de notificaciones -->
    <ToastNotification ref="toastRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';
import { restaurantService } from '@/services/restaurantService';
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue';
import ToastNotification from '@/components/ui/ToastNotification.vue';

// ============= INTERFACES (MISMAS DEL CHECKOUT) =============
interface ProcessedCartItem {
  id: number;
  productId: number;
  name: string;
  imageUrl?: string;
  originalPrice: number;
  finalPrice: number;
  quantity: number;
  appliedOffer?: unknown | { isAutoDetected: boolean };
}

const router = useRouter();
const cartStore = useCartStore();
const authStore = useAuthStore();

// ============= ESTADOS BÁSICOS =============
const deliveryFee = ref(0);
const restaurantData = ref<{ id: number; name: string; deliveryFee: number } | null>(null);
const loadingRestaurantData = ref(false);

// ✅ Estados para diálogo de confirmación
const showConfirmDialog = ref(false);
const confirmDialog = reactive({
  title: '',
  message: '',
  confirmText: 'Confirmar',
  cancelText: 'Cancelar',
  onConfirm: () => { }
});

// ✅ Referencia al componente de toast
const toastRef = ref<InstanceType<typeof ToastNotification>>();

// ============= COMPUTED BÁSICOS DEL CARRITO =============
const isEmpty = computed(() => cartStore.isEmpty);
const cartItems = computed(() =>
  cartStore.items as Array<{
    id: number;
    name: string;
    originalPrice?: number;
    price?: number;
    quantity: number;
    appliedOffer?: unknown;
    restaurantId: number;
    imageUrl?: string;
  }>
);
const restaurantId = computed(() => cartStore.restaurantId);
const restaurantName = computed(() => cartStore.restaurantName || 'Restaurante');
const deliveryTime = ref(25);

// ============= LÓGICA ROBUSTA DEL CHECKOUT (COPIADA EXACTA) =============

// Helper: obtener precio robusto del producto (MISMA FUNCIÓN DEL CHECKOUT pero más robusta)
const getProductPrice = (product: any): number => {
  const priceFields = ['originalPrice', 'basePrice', 'price', 'unitPrice', 'salePrice', 'cost'];
  for (let field of priceFields) {
    if (
      product[field] !== null &&
      product[field] !== undefined &&
      product[field] !== ''
    ) {
      const testPrice =
        typeof product[field] === 'number'
          ? product[field]
          : parseFloat(product[field]);
      if (!isNaN(testPrice) && testPrice > 0) {
        return testPrice;
      }
    }
  }
  return 9.99; // Precio por defecto si no se encuentra ninguno válido
};

// Procesar cada ítem del carrito con precios robustos y detección automática de descuentos
const processedCartItems = computed<ProcessedCartItem[]>(() => {
  if (!cartItems.value.length) return [];
  return cartItems.value.map(item => {
    // 1. Obtener precio original (sin descuento)
    const originalPrice = item.originalPrice && item.originalPrice > 0
      ? item.originalPrice
      : getProductPrice(item);

    // 2. Obtener precio final (con descuento si aplica)
    const finalPrice = item.price && item.price > 0
      ? item.price
      : originalPrice;

    // 3. Detectar automáticamente si hay descuento aplicado
    const hasDiscount = originalPrice > finalPrice && (originalPrice - finalPrice) > 0.01;
    const detectedOffer = hasDiscount ? { isAutoDetected: true } : null;

    // Debug para verificar precios
    console.log(`🛒 ${item.name}: Original=${originalPrice}, Final=${finalPrice}, HasDiscount=${hasDiscount}`);
    if (hasDiscount) {
      const percentage = Math.round(((originalPrice - finalPrice) / originalPrice) * 100);
      console.log(`  💰 Descuento detectado: ${percentage}% OFF (ahorras ${(originalPrice - finalPrice).toFixed(2)})`);
    }

    return {
      id:            item.id,
      productId:     item.id,
      name:          item.name || 'Producto',
      imageUrl:      item.imageUrl,
      originalPrice,
      finalPrice,
      quantity:      item.quantity || 1,
      appliedOffer:  item.appliedOffer || detectedOffer
    };
  });
});

// Cálculo de totales (MISMA LÓGICA DEL CHECKOUT)
const cartTotals = computed(() => {
  const originalSubtotal = processedCartItems.value.reduce((sum, item) => {
    return sum + item.originalPrice * item.quantity;
  }, 0);

  const subtotalWithOffers = processedCartItems.value.reduce((sum, item) => {
    return sum + item.finalPrice * item.quantity;
  }, 0);

  // 🔄 Redondear ahorros hacia ARRIBA para beneficiar al cliente (IGUAL QUE CHECKOUT)
  const rawSavings = originalSubtotal - subtotalWithOffers;
  const totalOfferSavings = rawSavings > 0 ? Math.ceil(rawSavings * 100) / 100 : 0;

  return {
    originalSubtotal,
    subtotalWithOffers,
    totalOfferSavings
  };
});

// Total final incluyendo envío (IGUAL QUE CHECKOUT)
const finalTotal = computed(() => {
  return cartTotals.value.subtotalWithOffers + deliveryFee.value;
});

// ============= COMPUTEDS ADICIONALES =============
const restaurantInitials = computed(() => {
  const name = restaurantName.value;
  if (!name || name === 'Restaurante') return 'R';
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
});

const canCheckout = computed(() => {
  return !isEmpty.value && authStore.isAuthenticated && cartTotals.value.subtotalWithOffers > 0;
});

// ============= MÉTODOS PARA MOSTRAR DESCUENTOS =============
const getDiscountBadgeText = (item: ProcessedCartItem): string => {
  if (!item.appliedOffer) return '';

  const savings = item.originalPrice - item.finalPrice;
  const percentage = Math.round((savings / item.originalPrice) * 100);

  return `${percentage}% OFF`;
};

// ============= MÉTODOS UI =============
const showToast = () => {
  return toastRef.value?.useToast() || {
    success: (msg: string, title?: string) => console.log('✅', title || '', msg),
    error: (msg: string, title?: string) => console.error('❌', title || '', msg),
    warning: (msg: string, title?: string) => console.warn('⚠️', title || '', msg),
    info: (msg: string, title?: string) => console.info('ℹ️', title || '', msg)
  };
};

const hideConfirmDialog = () => {
  showConfirmDialog.value = false;
};

const showClearCartConfirm = () => {
  confirmDialog.title = 'Vaciar carrito';
  confirmDialog.message = '¿Estás seguro de que deseas eliminar todos los productos de tu carrito? Esta acción no se puede deshacer.';
  confirmDialog.confirmText = 'Vaciar carrito';
  confirmDialog.cancelText = 'Cancelar';
  confirmDialog.onConfirm = () => {
    hideConfirmDialog();
    clearCart();
  };
  showConfirmDialog.value = true;
};

// ============= MÉTODOS DEL CARRITO =============
const incrementItem = async (itemId: number) => {
  const item = cartItems.value.find((i) => i.id === itemId);
  if (item) {
    await cartStore.updateQuantity(itemId, (item.quantity || 0) + 1);
  }
};

const decrementItem = async (itemId: number) => {
  const item = cartItems.value.find((i) => i.id === itemId);
  if (item) {
    const currentQty = item.quantity || 0;
    if (currentQty > 1) {
      await cartStore.updateQuantity(itemId, currentQty - 1);
    } else {
      removeItem(itemId);
    }
  }
};

const removeItem = (itemId: number) => {
  cartStore.removeItem(itemId);
};

const clearCart = () => {
  cartStore.clearCart();
  showToast().success('Tu carrito ha sido vaciado correctamente', 'Carrito vaciado');
};

const proceedToCheckout = () => {
  if (!authStore.isAuthenticated) {
    showToast().warning(
      'Por favor, inicia sesión para continuar con tu pedido',
      'Autenticación requerida'
    );
    router.push({ name: 'Login', query: { redirect: '/cart' } });
    return;
  }
  if (!canCheckout.value) {
    if (isEmpty.value) {
      showToast().info('Tu carrito está vacío. Añade productos para continuar', 'Carrito vacío');
    } else if (cartTotals.value.subtotalWithOffers <= 0) {
      showToast().warning('El total de tu pedido debe ser mayor a cero', 'Total inválido');
    }
    return;
  }
  router.push('/checkout');
};

// ============= CARGAR DATOS DEL RESTAURANTE (MISMA LÓGICA DEL CHECKOUT) =============
const fetchRestaurantData = async () => {
  // Si restaurantId es null o 0, no llamamos a la API
  if (!restaurantId.value) {
    deliveryFee.value = 0;
    restaurantData.value = null;
    return;
  }

  try {
    loadingRestaurantData.value = true;
    const res = await restaurantService.getRestaurantById(restaurantId.value);
    restaurantData.value = {
      id:          res.id,
      name:        res.name,
      deliveryFee: res.deliveryFee
    };
    deliveryFee.value = res.deliveryFee;
  } catch (err: any) {
    console.error('Error cargando datos de restaurante:', err);
    deliveryFee.value = 0;
    restaurantData.value = null;
  } finally {
    loadingRestaurantData.value = false;
  }
};

// ============= LIFECYCLE =============
onMounted(async () => {
  // Asegurarnos de que el carrito esté cargado ANTES de calcular totales
  if (typeof cartStore.loadFromLocalStorage === 'function') {
    await cartStore.loadFromLocalStorage();
  }

  // Cargar datos del restaurante
  await fetchRestaurantData();

  if (!isEmpty.value) {
    try {
      await cartStore.validateCart();
    } catch (error) {
      console.error('Error validando carrito al montar:', error);
    }
  }
});
</script>

<style scoped lang="scss">
.cart-page {
  --color-primary: #05af5a;
  --color-primary-dark: #048a48;
  --color-white: #ffffff;
  --color-light: #f8fafc;
  --color-light-accent: #f1f5f9;
  --color-medium: #64748b;
  --color-dark: #1e293b;
  --color-border: #e2e8f0;
  --color-success: #05af5a;
  --color-danger: #ef4444;
  --border-radius: 8px;
  --border-radius-lg: 12px;
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  --transition: all 0.2s ease;
  --spacing-sm: 0.5rem;
  --spacing: 0.75rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  min-height: 100vh;
  background-color: var(--color-light);
  padding: var(--spacing-lg) 0;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--spacing-md);
  }

  // Empty cart state
  .empty-cart {
    background-color: var(--color-white);
    border-radius: var(--border-radius-lg);
    padding: 3rem var(--spacing-lg);
    text-align: center;
    box-shadow: var(--shadow);

    &__icon {
      width: 80px;
      height: 80px;
      margin: 0 auto var(--spacing-lg);
      background-color: var(--color-light-accent);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-medium);
    }

    &__title {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0 0 var(--spacing);
      color: var(--color-dark);
    }

    &__text {
      color: var(--color-medium);
      margin: 0 0 var(--spacing-xl);
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
    }

    &__button {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-sm);
      background-color: var(--color-primary);
      color: var(--color-white);
      text-decoration: none;
      padding: var(--spacing) var(--spacing-lg);
      border-radius: var(--border-radius);
      font-weight: 600;
      transition: var(--transition);

      &:hover {
        background-color: var(--color-primary-dark);
        transform: translateY(-1px);
      }
    }
  }

  // Page title
  &__title {
    font-size: 2rem;
    font-weight: 700;
    margin: 0 0 var(--spacing-xl);
    color: var(--color-dark);
  }

  // Cart wrapper
  .cart-wrapper {
    display: grid;
    grid-template-columns: 1fr 360px;
    gap: var(--spacing-xl);
    align-items: start;

    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
    }
  }

  // Cart items section
  .cart-items {
    background-color: var(--color-white);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow);
    overflow: hidden;
  }

  .cart-restaurant {
    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-lg);
      border-bottom: 1px solid var(--color-border);

      @media (max-width: 768px) {
        flex-direction: column;
        gap: var(--spacing-md);
        align-items: stretch;
      }
    }

    &__info {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
    }

    &__logo {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
      border-radius: var(--border-radius);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-white);
      font-weight: 700;
      font-size: 1.1rem;
    }

    &__name {
      font-size: 1.2rem;
      font-weight: 700;
      margin: 0 0 var(--spacing-sm);
      color: var(--color-dark);
    }

    &__delivery {
      font-size: 0.9rem;
      color: var(--color-medium);
      margin: 0;
    }

    &__link {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      color: var(--color-primary);
      text-decoration: none;
      font-weight: 500;
      font-size: 0.9rem;
      padding: var(--spacing-sm) var(--spacing);
      border-radius: var(--border-radius);
      transition: var(--transition);

      &:hover {
        background-color: rgba(5, 175, 90, 0.1);
      }

      @media (max-width: 768px) {
        justify-content: center;
      }
    }
  }

  // Cart item list
  .cart-item-list {
    display: flex;
    flex-direction: column;
  }

  .cart-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-lg);
    border-bottom: 1px solid var(--color-light-accent);

    &:last-child {
      border-bottom: none;
    }

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: stretch;
      gap: var(--spacing);
    }

    &__image {
      width: 80px;
      height: 80px;
      border-radius: var(--border-radius);
      overflow: hidden;
      flex-shrink: 0;
      position: relative;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      @media (max-width: 768px) {
        width: 100%;
        height: 120px;
      }
    }

    &__discount-badge {
      position: absolute;
      top: 8px;
      right: 8px;
      background: var(--color-success);
      color: var(--color-white);
      font-size: 0.7rem;
      font-weight: 700;
      padding: 4px 8px;
      border-radius: 20px;
      box-shadow: 0 2px 8px rgba(5, 175, 90, 0.4);
      z-index: 10;
      text-align: center;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      min-width: 40px;
      animation: discount-pulse 3s ease-in-out infinite;
    }

    &__placeholder {
      width: 100%;
      height: 100%;
      background-color: var(--color-light-accent);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-medium);
    }

    &__details {
      flex: 1;
      min-width: 0;
    }

    &__name {
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0 0 var(--spacing-sm);
      color: var(--color-dark);
    }

    &__price-with-offer {
      margin-bottom: var(--spacing);
    }

    &__offer-badge {
      display: inline-block;
      background-color: var(--color-success);
      color: var(--color-white);
      font-size: 0.75rem;
      font-weight: 600;
      padding: 2px 6px;
      border-radius: 4px;
      margin-bottom: var(--spacing-sm);
    }

    &__pricing {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      flex-wrap: wrap;
    }

    &__original-price {
      text-decoration: line-through;
      color: var(--color-medium);
      font-size: 0.9rem;
    }

    &__discounted-price {
      color: var(--color-success);
      font-weight: 600;
      font-size: 1.1rem;
    }

    &__savings {
      color: var(--color-success);
      font-size: 0.85rem;
      font-weight: 500;
    }

    &__price {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--color-dark);
      margin-bottom: var(--spacing);
    }

    &__actions {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);

      @media (max-width: 768px) {
        justify-content: space-between;
      }
    }

    &__quantity {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      background-color: var(--color-light-accent);
      border-radius: var(--border-radius);
      padding: var(--spacing-sm);

      span {
        min-width: 20px;
        text-align: center;
        font-weight: 600;
      }
    }

    &__quantity-btn {
      width: 28px;
      height: 28px;
      border: none;
      background-color: var(--color-white);
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: var(--transition);

      &:hover {
        background-color: var(--color-primary);
        color: var(--color-white);
      }
    }

    &__remove {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      background: none;
      border: none;
      color: var(--color-danger);
      cursor: pointer;
      font-size: 0.9rem;
      padding: var(--spacing-sm) var(--spacing);
      border-radius: var(--border-radius);
      transition: var(--transition);

      &:hover {
        background-color: rgba(239, 68, 68, 0.1);
      }
    }

    &__subtotal {
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--color-dark);
      min-width: 80px;
      text-align: right;

      @media (max-width: 768px) {
        text-align: center;
        font-size: 1.3rem;
      }
    }
  }

  // Cart actions
  .cart-actions {
    padding: var(--spacing-lg);
    border-top: 1px solid var(--color-border);
    background-color: var(--color-light);

    &__clear {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      background: none;
      border: 1px solid var(--color-border);
      color: var(--color-medium);
      padding: var(--spacing) var(--spacing-md);
      border-radius: var(--border-radius);
      cursor: pointer;
      font-size: 0.9rem;
      transition: var(--transition);

      &:hover {
        border-color: var(--color-danger);
        color: var(--color-danger);
        background-color: rgba(239, 68, 68, 0.05);
      }
    }
  }

  // Order summary
  .order-summary {
    background-color: var(--color-white);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow);
    position: sticky;
    top: var(--spacing-lg);

    &__header {
      padding: var(--spacing-lg) var(--spacing-lg) 0;
    }

    &__title {
      font-size: 1.2rem;
      font-weight: 700;
      margin: 0;
      color: var(--color-dark);
    }

    &__content {
      padding: var(--spacing-lg);
    }

    &__row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing) 0;
      border-bottom: 1px solid var(--color-light-accent);

      &:last-child {
        border-bottom: none;
      }

      &--savings {
        color: var(--color-success);
        font-weight: 500;
      }

      &--total {
        font-size: 1.2rem;
        font-weight: 700;
        color: var(--color-dark);
        border-top: 1px solid var(--color-border);
        margin-top: var(--spacing);
        padding-top: var(--spacing-md);
      }

      span:first-child {
        color: var(--color-medium);
      }

      span:last-child {
        font-weight: 600;
        color: var(--color-dark);
      }
    }

    .free-delivery {
      color: var(--color-success) !important;
      font-weight: 600 !important;
    }
  }

  // Checkout button
  .checkout-button {
    width: 100%;
    background-color: var(--color-primary);
    color: var(--color-white);
    border: none;
    border-radius: var(--border-radius);
    padding: var(--spacing-md) var(--spacing-lg);
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
    margin-top: var(--spacing-lg);

    &:hover:not(:disabled) {
      background-color: var(--color-primary-dark);
      transform: translateY(-1px);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
  }
}

// Animación para el badge de descuento
@keyframes discount-pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 2px 8px rgba(5, 175, 90, 0.4);
  }
  50% {
    transform: scale(1.02);
    box-shadow: 0 3px 12px rgba(5, 175, 90, 0.6);
  }
}
</style>
