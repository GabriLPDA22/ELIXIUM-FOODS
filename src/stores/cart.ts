// src/stores/cart.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Product } from '@/types';

export interface CartItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  restaurantId: number;
  restaurantName?: string;
}

export const useCartStore = defineStore('cart', () => {
  // Estado
  const items = ref<CartItem[]>([]);
  const restaurantId = ref<number | null>(null);
  const restaurantName = ref<string | null>(null);
  
  // Getters
  const itemCount = computed(() => {
    return items.value.reduce((acc, item) => acc + item.quantity, 0);
  });
  
  const totalAmount = computed(() => {
    return items.value.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  });
  
  const isEmpty = computed(() => items.value.length === 0);
  
  // Acciones
  const addToCart = (product: Product, quantity: number = 1) => {
    // Si la canasta tiene elementos de un restaurante diferente, preguntar si desea vaciar la canasta
    if (restaurantId.value !== null && restaurantId.value !== product.restaurantId) {
      const confirmClear = confirm(
        `Tu canasta contiene elementos de ${restaurantName.value}. ¿Deseas vaciar tu canasta para pedir de este nuevo restaurante?`
      );
      
      if (confirmClear) {
        clearCart();
      } else {
        return false;
      }
    }
    
    // Establecer restaurantId si es la primera vez
    if (restaurantId.value === null) {
      restaurantId.value = product.restaurantId;
      restaurantName.value = product.categoryName; // Deberíamos tener el nombre del restaurante pero usamos category por ahora
    }
    
    // Buscar si el producto ya está en el carrito
    const existingItem = items.value.find(item => item.productId === product.id);
    
    if (existingItem) {
      // Actualizar cantidad si ya existe
      existingItem.quantity += quantity;
    } else {
      // Agregar nuevo item
      const newItem: CartItem = {
        id: Date.now(), // ID temporal único
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        imageUrl: product.imageUrl,
        restaurantId: product.restaurantId,
      };
      
      items.value.push(newItem);
    }
    
    // Persistir en localStorage
    saveCart();
    return true;
  };
  
  const updateQuantity = (itemId: number, quantity: number) => {
    const item = items.value.find(item => item.id === itemId);
    
    if (item) {
      if (quantity <= 0) {
        // Eliminar item si la cantidad es cero o negativa
        removeItem(itemId);
      } else {
        // Actualizar cantidad
        item.quantity = quantity;
        saveCart();
      }
    }
  };
  
  const removeItem = (itemId: number) => {
    const index = items.value.findIndex(item => item.id === itemId);
    
    if (index !== -1) {
      items.value.splice(index, 1);
      
      // Si no quedan items, resetear el restaurantId
      if (items.value.length === 0) {
        restaurantId.value = null;
        restaurantName.value = null;
      }
      
      saveCart();
    }
  };
  
  const clearCart = () => {
    items.value = [];
    restaurantId.value = null;
    restaurantName.value = null;
    saveCart();
  };
  
  // Persistencia local
  const saveCart = () => {
    localStorage.setItem('cart', JSON.stringify({
      items: items.value,
      restaurantId: restaurantId.value,
      restaurantName: restaurantName.value
    }));
  };
  
  const loadCart = () => {
    const savedCart = localStorage.getItem('cart');
    
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        items.value = cartData.items || [];
        restaurantId.value = cartData.restaurantId || null;
        restaurantName.value = cartData.restaurantName || null;
      } catch (err) {
        console.error('Error loading cart from localStorage:', err);
        clearCart();
      }
    }
  };
  
  // Inicializar cargando datos guardados
  loadCart();
  
  return {
    // Estado
    items,
    restaurantId,
    restaurantName,
    
    // Getters
    itemCount,
    totalAmount,
    isEmpty,
    
    // Acciones
    addToCart,
    updateQuantity,
    removeItem,
    clearCart
  };
});