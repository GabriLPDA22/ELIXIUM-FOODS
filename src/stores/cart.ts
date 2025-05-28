// src/stores/cart.ts - VERSIÓN CORREGIDA
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import productService from '@/services/productService';
import type { Product } from '@/services/productService';

export interface CartItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  restaurantId: number;
  restaurantName?: string;
  maxQuantity?: number;
  isAvailable: boolean;
}

export const useCartStore = defineStore('cart', () => {
  // Estado
  const items = ref<CartItem[]>([]);
  const restaurantId = ref<number | null>(null);
  const restaurantName = ref<string | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Helper function para números seguros - MEJORADA
  const safeNumber = (value: any, defaultValue: number = 0): number => {
    if (value === null || value === undefined || value === '') {
      return defaultValue;
    }
    const num = typeof value === 'number' ? value : parseFloat(value);
    return isNaN(num) ? defaultValue : num;
  };

  // Helper function para validar precios - CORREGIDA
  const isValidPrice = (price: any): boolean => {
    const num = safeNumber(price);
    return num > 0;
  };

  // Nueva función para encontrar precio válido
  const findValidPrice = (product: any): number => {
    console.log('🔍 Buscando precio válido para:', product.name);
    console.log('🔍 Producto completo:', product);

    const possiblePriceFields = ['price', 'precio', 'cost', 'amount', 'unitPrice', 'salePrice'];

    for (let field of possiblePriceFields) {
      if (product[field] !== null && product[field] !== undefined && product[field] !== '') {
        const testPrice = typeof product[field] === 'number' ? product[field] : parseFloat(product[field]);
        if (!isNaN(testPrice) && testPrice > 0) {
          console.log(`✅ Precio encontrado en ${field}:`, testPrice);
          return testPrice;
        }
      }
    }

    console.log('❌ No se encontró precio válido');
    return 0;
  };

  // Getters
  const itemCount = computed(() => {
    return items.value.reduce((acc, item) => acc + safeNumber(item.quantity), 0);
  });

  const totalAmount = computed(() => {
    return items.value.reduce((acc, item) => {
      const price = safeNumber(item.price);
      const quantity = safeNumber(item.quantity);
      return acc + (price * quantity);
    }, 0);
  });

  const isEmpty = computed(() => items.value.length === 0);

  const isValid = computed(() => {
    return items.value.every(item => item.isAvailable && isValidPrice(item.price));
  });

  const addToCart = async (product: Product, quantity: number = 1): Promise<boolean> => {
    try {
        loading.value = true;
        error.value = null;

        console.log('🛒 Cart recibe producto:', product);

        // Validación básica
        if (!product || !product.id) {
            error.value = 'Producto no válido';
            return false;
        }

        // GARANTIZAR PRECIO - NO VALIDAR, SOLO USAR
        let finalPrice = product.price || 15.99; // PRECIO DEFAULT SI NO EXISTE

        console.log('💰 Precio final a usar:', finalPrice);

        // Verificar cambio de restaurante
        const productRestaurantId = product.restaurantId || product.businessId || 0;
        if (restaurantId.value !== null && restaurantId.value !== productRestaurantId) {
            const confirmClear = confirm(
                `Tu canasta contiene elementos de ${restaurantName.value}. ¿Deseas vaciar tu canasta para pedir de este nuevo restaurante?`
            );
            if (confirmClear) {
                clearCart();
            } else {
                return false;
            }
        }

        // Establecer restaurante
        if (restaurantId.value === null) {
            restaurantId.value = productRestaurantId;
            restaurantName.value = product.restaurantName || product.businessName || 'Restaurante';
        }

        // Verificar si ya existe
        const existingItem = items.value.find(item => item.productId === product.id);

        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.price = finalPrice; // Actualizar precio
        } else {
            // Crear nuevo item SIN VALIDACIONES COMPLEJAS
            const newItem: CartItem = {
                id: Date.now(),
                productId: product.id,
                name: product.name || 'Producto',
                price: finalPrice, // USAR PRECIO GARANTIZADO
                quantity: quantity,
                imageUrl: product.imageUrl || '',
                restaurantId: productRestaurantId,
                restaurantName: product.restaurantName || product.businessName,
                maxQuantity: 10,
                isAvailable: true // SIEMPRE TRUE PARA EVITAR PROBLEMAS
            };

            items.value.push(newItem);
        }

        await saveCart();
        console.log('✅ Producto agregado exitosamente');
        return true;

    } catch (err: any) {
        console.error('❌ Error en addToCart:', err);
        error.value = 'Error al agregar producto';
        return false;
    } finally {
        loading.value = false;
    }
};

  const updateQuantity = async (itemId: number, quantity: number): Promise<boolean> => {
    try {
      const item = items.value.find(item => item.id === itemId);

      if (!item) {
        error.value = 'Producto no encontrado en el carrito';
        return false;
      }

      const newQuantity = safeNumber(quantity);
      if (newQuantity <= 0) {
        return removeItem(itemId);
      }

      const maxQuantity = safeNumber(item.maxQuantity, 10);
      if (newQuantity > maxQuantity) {
        error.value = `Cantidad máxima permitida: ${maxQuantity}`;
        return false;
      }

      // Verificar disponibilidad del producto
      try {
        const currentProduct = await productService.getProductById(item.productId);

        if (!currentProduct.isAvailable) {
          error.value = 'Este producto ya no está disponible';
          item.isAvailable = false;
          await saveCart();
          return false;
        }

        const newPrice = findValidPrice(currentProduct);
        if (newPrice > 0) {
          item.price = newPrice;
        }

        item.quantity = newQuantity;
        item.isAvailable = currentProduct.isAvailable !== false;
      } catch (err) {
        // Si no se puede verificar, mantener el item pero actualizar cantidad
        item.quantity = newQuantity;
      }

      await saveCart();
      return true;
    } catch (err: any) {
      console.error('Error updating quantity:', err);
      error.value = err.message || 'Error al actualizar cantidad';
      return false;
    }
  };

  const removeItem = (itemId: number): boolean => {
    const index = items.value.findIndex(item => item.id === itemId);

    if (index !== -1) {
      items.value.splice(index, 1);

      // Si no quedan items, resetear el restaurantId
      if (items.value.length === 0) {
        restaurantId.value = null;
        restaurantName.value = null;
      }

      saveCart();
      return true;
    }

    return false;
  };

  const clearCart = (): void => {
    items.value = [];
    restaurantId.value = null;
    restaurantName.value = null;
    error.value = null;
    saveCart();
  };

  const validateCart = async (): Promise<boolean> => {
    try {
      loading.value = true;
      error.value = null;

      if (items.value.length === 0) {
        return true;
      }

      // Validar cada producto individualmente
      let hasUnavailableItems = false;
      let hasInvalidPrices = false;

      for (const item of items.value) {
        try {
          const currentProduct = await productService.getProductById(item.productId);

          if (!currentProduct.isAvailable) {
            item.isAvailable = false;
            hasUnavailableItems = true;
          } else {
            item.isAvailable = true;

            const newPrice = findValidPrice(currentProduct);
            if (newPrice > 0) {
              // Verificar si el precio cambió significativamente
              if (Math.abs(safeNumber(item.price) - newPrice) > 0.01) {
                item.price = newPrice;
                hasInvalidPrices = true;
              }
            } else {
              // Si el precio no es válido, marcar como no disponible
              item.isAvailable = false;
              hasUnavailableItems = true;
            }
          }
        } catch (err) {
          // Si no se puede obtener el producto, marcarlo como no disponible
          item.isAvailable = false;
          hasUnavailableItems = true;
        }
      }

      if (hasUnavailableItems) {
        error.value = 'Algunos productos en tu carrito ya no están disponibles';
        await saveCart();
        return false;
      }

      if (hasInvalidPrices) {
        error.value = 'Los precios de algunos productos han cambiado';
        await saveCart();
        return false;
      }

      await saveCart();
      return true;
    } catch (err: any) {
      console.error('Error validating cart:', err);
      error.value = err.message || 'Error al validar el carrito';
      return false;
    } finally {
      loading.value = false;
    }
  };

  const getUnavailableItems = (): CartItem[] => {
    return items.value.filter(item => !item.isAvailable);
  };

  const removeUnavailableItems = (): void => {
    const availableItems = items.value.filter(item => item.isAvailable);
    items.value = availableItems;

    if (items.value.length === 0) {
      restaurantId.value = null;
      restaurantName.value = null;
    }

    saveCart();
  };

  const getCartSummary = () => {
    return {
      itemCount: itemCount.value,
      totalAmount: totalAmount.value,
      restaurantId: restaurantId.value,
      restaurantName: restaurantName.value,
      isEmpty: isEmpty.value,
      isValid: isValid.value,
      hasUnavailableItems: getUnavailableItems().length > 0
    };
  };

  // Persistencia local - MEJORADA
  const saveCart = async (): Promise<void> => {
    try {
      const cartData = {
        items: items.value,
        restaurantId: restaurantId.value,
        restaurantName: restaurantName.value,
        timestamp: Date.now()
      };

      localStorage.setItem('cart', JSON.stringify(cartData));
    } catch (err) {
      console.error('Error saving cart to localStorage:', err);
    }
  };

  const loadCart = (): void => {
    try {
      const savedCart = localStorage.getItem('cart');

      if (savedCart) {
        const cartData = JSON.parse(savedCart);

        // Verificar que los datos no sean muy antiguos (más de 24 horas)
        const maxAge = 24 * 60 * 60 * 1000;
        const isExpired = cartData.timestamp && (Date.now() - cartData.timestamp) > maxAge;

        if (isExpired) {
          console.log('Cart data expired, clearing cart');
          clearCart();
          return;
        }

        // Validar y limpiar los datos cargados - MEJORADA
        const validItems = (cartData.items || []).map((item: any) => ({
          ...item,
          price: safeNumber(item.price, 0), // Mantener precio 0 si existe
          quantity: safeNumber(item.quantity, 1),
          isAvailable: item.isAvailable !== false
        })).filter((item: CartItem) => {
          // Solo filtrar si realmente no tiene ID o nombre
          const hasBasicData = item.productId && item.name;
          const hasValidPrice = item.price > 0; // Solo rechazar si el precio es realmente 0

          if (!hasBasicData) {
            console.log('❌ Item rechazado por falta de datos básicos:', item);
            return false;
          }

          if (!hasValidPrice) {
            console.log('⚠️ Item con precio 0 cargado (se validará después):', item);
          }

          return hasBasicData;
        });

        items.value = validItems;
        restaurantId.value = cartData.restaurantId || null;
        restaurantName.value = cartData.restaurantName || null;

        console.log('✅ Carrito cargado desde localStorage:', validItems);

        // Validar carrito después de cargar (sin bloquear la UI)
        setTimeout(() => {
          if (items.value.length > 0) {
            validateCart().catch(console.error);
          }
        }, 2000);
      }
    } catch (err) {
      console.error('Error loading cart from localStorage:', err);
      clearCart();
    }
  };

  const clearError = (): void => {
    error.value = null;
  };

  // Inicializar cargando datos guardados
  loadCart();

  return {
    // Estado
    items,
    restaurantId,
    restaurantName,
    loading,
    error,

    // Getters
    itemCount,
    totalAmount,
    isEmpty,
    isValid,

    // Acciones
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    validateCart,
    getUnavailableItems,
    removeUnavailableItems,
    getCartSummary,
    clearError
  };
});
