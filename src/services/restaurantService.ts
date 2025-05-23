// src/services/restaurantService.ts
import { api } from '@/services/api'

// Interfaces
export interface RestaurantCard {
  id: number
  name: string
  description: string
  logoUrl: string
  coverImageUrl: string
  averageRating: number
  isOpen: boolean
  deliveryFee: number
  estimatedDeliveryTime: number
  cuisine?: string
  reviewCount: number
  distance?: number
  featured: boolean
  isNew: boolean
  promoText?: string
  priceRange?: string
  orderCount: number
  tipo: number
}

export interface RestaurantDetail {
  id: number
  name: string
  description: string
  logoUrl: string
  coverImageUrl: string
  averageRating: number
  isOpen: boolean
  deliveryFee: number
  estimatedDeliveryTime: number
  userId: number
  ownerName: string
  address: Address
  createdAt: string
  updatedAt: string
  tipo: number
  // Campos adicionales para la vista
  reviewCount?: number
  distance?: number
  cuisines?: string
  priceRange?: string
}

export interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  imageUrl: string
  isAvailable: boolean
  categoryId: number
  categoryName: string
  restaurantId: number
  restaurantName: string
  restaurantLogo: string
  popular?: boolean
}

export interface MenuCategory {
  id: number | string
  name: string
  description?: string
  menuId?: number
  items: MenuItem[]
}

export interface Address {
  id: number
  street: string
  city: string
  state: string
  zipCode: string
  latitude?: number
  longitude?: number
}

// Servicios para los endpoints de restaurantes
export const restaurantService = {
  /**
   * Obtener todos los restaurantes
   */
  async getAllRestaurants(): Promise<RestaurantCard[]> {
    const response = await api.get('/api/Restaurants')
    return response.data
  },

  /**
   * Obtener restaurantes populares
   * @param limit Número máximo de restaurantes a devolver
   */
  async getPopularRestaurants(limit: number = 8): Promise<RestaurantCard[]> {
    const response = await api.get(`/api/Restaurants/popular?limit=${limit}`)
    return response.data
  },

  /**
   * Buscar restaurantes
   * @param query Término de búsqueda
   * @param cuisine Tipo de cocina
   */
  async searchRestaurants(query?: string, cuisine?: string): Promise<RestaurantCard[]> {
    const params = new URLSearchParams()
    if (query) params.append('query', query)
    if (cuisine) params.append('cuisine', cuisine)
    
    const response = await api.get(`/api/Restaurants/search?${params.toString()}`)
    return response.data
  },

  /**
   * Obtener restaurantes por tipo
   * @param tipo ID del tipo de restaurante (1-8)
   */
  async getRestaurantsByTipo(tipo: number): Promise<RestaurantCard[]> {
    const response = await api.get(`/api/Restaurants/tipo/${tipo}`)
    return response.data
  },

  /**
   * Obtener detalles de un restaurante específico
   * @param id ID del restaurante
   */
  async getRestaurantById(id: number): Promise<RestaurantDetail> {
    const response = await api.get(`/api/Restaurants/${id}`)
    return response.data
  },

  /**
   * Obtener productos por restaurante
   * @param restaurantId ID del restaurante
   */
  async getProductsByRestaurant(restaurantId: number): Promise<MenuItem[]> {
    const response = await api.get(`/api/Products/Restaurant/${restaurantId}`)
    return response.data
  },

  /**
   * Obtener productos por categoría
   * @param categoryId ID de la categoría
   */
  async getProductsByCategory(categoryId: number): Promise<MenuItem[]> {
    const response = await api.get(`/api/Products/Category/${categoryId}`)
    return response.data
  },

  /**
   * Organizar productos en categorías para el menú
   * @param products Lista de productos
   */
  organizeProductsByCategory(products: MenuItem[]): MenuCategory[] {
    // Agrupar productos por categoría
    const categoryMap = new Map<number, MenuCategory>()
    
    products.forEach(product => {
      if (!categoryMap.has(product.categoryId)) {
        categoryMap.set(product.categoryId, {
          id: product.categoryId,
          name: product.categoryName,
          items: []
        })
      }
      
      // Añadir el producto a su categoría
      // Marcar como popular los productos con ids bajos (simulación)
      const enrichedProduct = {
        ...product,
        popular: product.id % 3 === 0 // Simulación: marcar algunos productos como populares
      }
      
      categoryMap.get(product.categoryId)?.items.push(enrichedProduct)
    })
    
    // Convertir el mapa a un array
    return Array.from(categoryMap.values())
  }
}