// src/stores/cart.ts

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CartItem, Product, ProductOffer } from '@/types'
import { offerService } from '@/services/offerService'

export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref<CartItem[]>([])
  const restaurantId = ref<number | null>(null)
  const restaurantName = ref<string>('')
  const estimatedDeliveryTime = ref<number>(30)
  const activeOffers = ref<ProductOffer[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isEmpty = computed(() => items.value.length === 0)

  const itemCount = computed(() =>
    items.value.reduce((total, item) => total + item.quantity, 0)
  )

  const originalSubtotal = computed(() =>
    items.value.reduce((total, item) => total + (item.originalPrice * item.quantity), 0)
  )

  const subtotalWithOffers = computed(() =>
    items.value.reduce((total, item) => total + (item.price * item.quantity), 0)
  )

  const totalSavings = computed(() => {
    const rawSavings = originalSubtotal.value - subtotalWithOffers.value;
    return rawSavings > 0 ? Math.ceil(rawSavings * 100) / 100 : 0;
  })

  const cartSummary = computed(() => ({
    originalSubtotal: originalSubtotal.value,
    subtotalWithOffers: subtotalWithOffers.value,
    totalSavings: totalSavings.value,
    itemCount: itemCount.value
  }))

  // Actions

  /**
   * Agrega un producto al carrito
   */
  async function addToCart(product: Product, quantity: number = 1): Promise<void> {
    try {
      loading.value = true
      error.value = null

      // Verificar si es un restaurante diferente
      if (restaurantId.value && restaurantId.value !== product.restaurantId) {
        throw new Error('No puedes agregar productos de diferentes restaurantes')
      }

      // Establecer información del restaurante si es el primer producto
      if (!restaurantId.value) {
        restaurantId.value = product.restaurantId || 0
        restaurantName.value = product.restaurantName || 'Restaurante'

        // Cargar ofertas activas del restaurante
        if (restaurantId.value) {
          await loadActiveOffers(restaurantId.value)
        }
      }

      const originalPrice = getProductPrice(product)
      const existingItemIndex = items.value.findIndex(item => item.productId === product.id)

      if (existingItemIndex !== -1) {
        // Actualizar cantidad del producto existente
        items.value[existingItemIndex].quantity += quantity
      } else {
        // Agregar nuevo producto
        const newItem: CartItem = {
          id: product.id,
          productId: product.id,
          name: product.name,
          price: originalPrice, // Se actualizará con ofertas
          originalPrice,
          imageUrl: product.imageUrl || '',
          restaurantId: product.restaurantId || restaurantId.value || 0,
          restaurantName: product.restaurantName || restaurantName.value,
          categoryId: product.categoryId,
          isAvailable: product.isAvailable,
          description: product.description,
          businessId: product.businessId,
          businessName: product.restaurantName || restaurantName.value,
          quantity
        }

        items.value.push(newItem)
      }

      // Recalcular precios con ofertas
      await recalculateCartPrices()

      console.log('✅ Producto agregado al carrito:', {
        product: product.name,
        quantity,
        originalPrice,
        totalItems: itemCount.value
      })

    } catch (err: any) {
      error.value = err.message
      console.error('❌ Error agregando al carrito:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Actualiza la cantidad de un producto en el carrito
   */
  async function updateQuantity(productId: number, newQuantity: number): Promise<void> {
    try {
      if (newQuantity <= 0) {
        await removeItem(productId)
        return
      }

      const itemIndex = items.value.findIndex(item => item.productId === productId)
      if (itemIndex !== -1) {
        items.value[itemIndex].quantity = newQuantity
        await recalculateCartPrices()

        console.log('✅ Cantidad actualizada:', {
          productId,
          newQuantity,
          totalItems: itemCount.value
        })
      }
    } catch (err: any) {
      error.value = err.message
      console.error('❌ Error actualizando cantidad:', err)
      throw err
    }
  }

  /**
   * Incrementa la cantidad de un producto
   */
  async function incrementItem(productId: number): Promise<void> {
    const item = items.value.find(item => item.productId === productId)
    if (item) {
      await updateQuantity(productId, item.quantity + 1)
    }
  }

  /**
   * Decrementa la cantidad de un producto
   */
  async function decrementItem(productId: number): Promise<void> {
    const item = items.value.find(item => item.productId === productId)
    if (item) {
      await updateQuantity(productId, Math.max(0, item.quantity - 1))
    }
  }

  /**
   * Elimina un producto del carrito
   */
  async function removeItem(productId: number): Promise<void> {
    try {
      const itemIndex = items.value.findIndex(item => item.productId === productId)
      if (itemIndex !== -1) {
        const removedItem = items.value[itemIndex]
        items.value.splice(itemIndex, 1)

        // Si el carrito queda vacío, limpiar información del restaurante
        if (items.value.length === 0) {
          clearRestaurantInfo()
        } else {
          await recalculateCartPrices()
        }

        console.log('✅ Producto eliminado del carrito:', removedItem.name)
      }
    } catch (err: any) {
      error.value = err.message
      console.error('❌ Error eliminando del carrito:', err)
      throw err
    }
  }

  /**
   * Vacía completamente el carrito
   */
  function clearCart(): void {
    items.value = []
    clearRestaurantInfo()
    console.log('✅ Carrito vaciado')
  }

  /**
   * Carga las ofertas activas de un restaurante
   */
  async function loadActiveOffers(restaurantIdParam: number): Promise<void> {
    try {
      activeOffers.value = await offerService.getActiveOffersByRestaurant(restaurantIdParam)
      console.log('✅ Ofertas cargadas:', activeOffers.value.length)
    } catch (err: any) {
      console.error('❌ Error cargando ofertas:', err)
      activeOffers.value = []
    }
  }

  /**
   * Recalcula los precios del carrito aplicando ofertas
   */
  async function recalculateCartPrices(): Promise<void> {
    if (!restaurantId.value || items.value.length === 0) return

    try {
      const currentSubtotal = originalSubtotal.value

      // Procesar cada item para aplicar ofertas
      for (const item of items.value) {
        const applicableOffers = activeOffers.value.filter(offer =>
          offer.productId === item.productId &&
          offer.status === 'active' &&
          isOfferValid(offer) &&
          item.quantity >= offer.minimumQuantity &&
          currentSubtotal >= offer.minimumOrderAmount
        )

        // Aplicar la mejor oferta
        if (applicableOffers.length > 0) {
          const bestOffer = findBestOffer(item.originalPrice, applicableOffers)
          if (bestOffer) {
            item.price = calculateDiscountedPrice(item.originalPrice, bestOffer)
            item.appliedOffer = bestOffer
          } else {
            item.price = item.originalPrice
            item.appliedOffer = undefined
          }
        } else {
          item.price = item.originalPrice
          item.appliedOffer = undefined
        }
      }

      console.log('✅ Precios recalculados:', {
        original: originalSubtotal.value,
        withOffers: subtotalWithOffers.value,
        savings: totalSavings.value
      })

    } catch (err: any) {
      console.error('❌ Error recalculando precios:', err)
      // En caso de error, usar precios originales
      items.value.forEach(item => {
        item.price = item.originalPrice
        item.appliedOffer = undefined
      })
    }
  }

  /**
   * Valida el carrito antes del checkout
   */
  async function validateCart(): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = []

    if (isEmpty.value) {
      errors.push('El carrito está vacío')
    }

    if (!restaurantId.value) {
      errors.push('No se ha seleccionado un restaurante')
    }

    // Verificar disponibilidad de productos
    const unavailableItems = items.value.filter(item => !item.isAvailable)
    if (unavailableItems.length > 0) {
      errors.push(`Los siguientes productos no están disponibles: ${unavailableItems.map(i => i.name).join(', ')}`)
    }

    // Verificar precios mínimos
    const invalidPriceItems = items.value.filter(item => item.price <= 0)
    if (invalidPriceItems.length > 0) {
      errors.push(`Los siguientes productos tienen precios inválidos: ${invalidPriceItems.map(i => i.name).join(', ')}`)
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  /**
   * Obtiene un item del carrito por ID de producto
   */
  function getCartItem(productId: number): CartItem | undefined {
    return items.value.find(item => item.productId === productId)
  }

  /**
   * Verifica si un producto está en el carrito
   */
  function isInCart(productId: number): boolean {
    return items.value.some(item => item.productId === productId)
  }

  /**
   * Obtiene la cantidad de un producto en el carrito
   */
  function getItemQuantity(productId: number): number {
    const item = items.value.find(item => item.productId === productId)
    return item?.quantity || 0
  }

  // Helper functions

  /**
   * Obtiene el precio real de un producto
   */
  function getProductPrice(product: Product): number {
    if (product.restaurantPrice && product.restaurantPrice > 0) {
      return product.restaurantPrice
    }
    return product.basePrice || 0
  }

  /**
   * Verifica si una oferta es válida
   */
  function isOfferValid(offer: ProductOffer): boolean {
    const now = new Date()
    const startDate = new Date(offer.startDate)
    const endDate = new Date(offer.endDate)

    return (
      offer.status === 'active' &&
      startDate <= now &&
      endDate >= now &&
      (offer.usageLimit === 0 || offer.usageCount < offer.usageLimit)
    )
  }

  /**
   * Encuentra la mejor oferta para un precio dado
   */
  function findBestOffer(originalPrice: number, offers: ProductOffer[]): ProductOffer | undefined {
    let bestOffer: ProductOffer | undefined
    let lowestPrice = originalPrice

    for (const offer of offers) {
      const discountedPrice = calculateDiscountedPrice(originalPrice, offer)
      if (discountedPrice < lowestPrice) {
        lowestPrice = discountedPrice
        bestOffer = offer
      }
    }

    return bestOffer
  }

  /**
   * Calcula el precio con descuento
   */
  function calculateDiscountedPrice(originalPrice: number, offer: ProductOffer): number {
    if (!isOfferValid(offer)) return originalPrice

    let discountedPrice: number

    if (offer.discountType === 'percentage' || offer.discountType === '%') {
      discountedPrice = originalPrice * (1 - offer.discountValue / 100)
    } else {
      discountedPrice = Math.max(0.01, originalPrice - offer.discountValue)
    }

    return Math.max(0.01, discountedPrice)
  }

  /**
   * Limpia la información del restaurante
   */
  function clearRestaurantInfo(): void {
    restaurantId.value = null
    restaurantName.value = ''
    estimatedDeliveryTime.value = 30
    activeOffers.value = []
    error.value = null
  }

  /**
   * Formatea el badge de una oferta
   */
  function formatOfferBadge(offer: ProductOffer): string {
    if (offer.discountType === 'percentage' || offer.discountType === '%') {
      return `${offer.discountValue}% OFF`
    } else {
      return `$${offer.discountValue.toFixed(2)} OFF`
    }
  }

  return {
    // State
    items,
    restaurantId,
    restaurantName,
    estimatedDeliveryTime,
    activeOffers,
    loading,
    error,

    // Getters
    isEmpty,
    itemCount,
    originalSubtotal,
    subtotalWithOffers,
    totalSavings,
    cartSummary,

    // Actions
    addToCart,
    updateQuantity,
    incrementItem,
    decrementItem,
    removeItem,
    clearCart,
    loadActiveOffers,
    recalculateCartPrices,
    validateCart,
    getCartItem,
    isInCart,
    getItemQuantity,
    formatOfferBadge
  }
})