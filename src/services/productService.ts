// src/services/productService.ts
import { api } from './api'

export interface Product {
  id: number
  name: string
  description: string
  basePrice: number
  price: number // Precio efectivo (puede ser diferente por restaurante)
  imageUrl: string
  isAvailable: boolean
  categoryId: number
  categoryName: string
  businessId: number
  businessName: string
  restaurantId?: number
  restaurantName?: string
  // Información específica del restaurante (si aplica)
  restaurantPrice?: number
  restaurantAvailability?: boolean
  stockQuantity?: number
}

export interface ProductSearchFilters {
  query?: string
  categoryId?: number
  restaurantId?: number
  minPrice?: number
  maxPrice?: number
  isAvailable?: boolean
  isVegetarian?: boolean
  isVegan?: boolean
  isGlutenFree?: boolean
}

export interface ProductCreateRequest {
  name: string
  description: string
  basePrice: number
  imageUrl?: string
  categoryId: number
  allergens?: string[]
  preparationTime?: number
  tags?: string[]
}

export interface ProductUpdateRequest extends Partial<ProductCreateRequest> {
  isAvailable?: boolean
}

// Helper function para números seguros
const safeNumber = (value: any, defaultValue: number = 0): number => {
  const num = typeof value === 'number' ? value : parseFloat(value);
  return isNaN(num) || num < 0 ? defaultValue : num;
};

// Helper para asegurar precios válidos
const ensureValidPrice = (price: any, fallback: number = 9.99): number => {
  const num = safeNumber(price, 0);
  return num > 0 ? num : fallback;
};

/**
 * Product Service - Maneja todas las operaciones relacionadas con productos
 */
export const productService = {
  /**
   * Obtener todos los productos
   */
  async getAllProducts(filters?: ProductSearchFilters): Promise<Product[]> {
    try {
      const params = new URLSearchParams()

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString())
          }
        })
      }

      const response = await api.get(`/api/Products?${params.toString()}`)
      return response.data.map((item: any) => ({
        ...item,
        basePrice: ensureValidPrice(item.basePrice),
        price: ensureValidPrice(item.price || item.basePrice),
        isAvailable: item.isAvailable !== false,
        name: item.name || 'Producto',
        description: item.description || '',
        imageUrl: item.imageUrl || '',
        categoryName: item.categoryName || 'Sin categoría',
        businessId: safeNumber(item.businessId),
        businessName: item.businessName || ''
      }))
    } catch (error: any) {
      console.error('Error fetching products:', error)
      throw new Error(error.response?.data?.message || 'Error al obtener productos')
    }
  },

  /**
   * Obtener un producto por ID
   */
  async getProductById(productId: number): Promise<Product> {
    try {
      const response = await api.get(`/api/Products/${productId}`)
      const product = response.data
      return {
        ...product,
        basePrice: ensureValidPrice(product.basePrice),
        price: ensureValidPrice(product.price || product.basePrice),
        isAvailable: product.isAvailable !== false,
        name: product.name || 'Producto',
        description: product.description || '',
        imageUrl: product.imageUrl || '',
        categoryName: product.categoryName || 'Sin categoría',
        businessId: safeNumber(product.businessId),
        businessName: product.businessName || ''
      }
    } catch (error: any) {
      console.error('Error fetching product:', error)
      throw new Error(error.response?.data?.message || 'Error al obtener el producto')
    }
  },

  /**
   * Obtener productos por restaurante
   */
  async getProductsByRestaurant(restaurantId: number): Promise<Product[]> {
    try {
      const response = await api.get(`/api/restaurants/${restaurantId}/products`)
      return response.data.map((item: any) => ({
        id: item.productId || item.id,
        name: item.productName || item.name || 'Producto',
        description: item.productDescription || item.description || '',
        basePrice: ensureValidPrice(item.basePrice),
        price: ensureValidPrice(item.price || item.basePrice),
        imageUrl: item.productImageUrl || item.imageUrl || '',
        isAvailable: item.isAvailable !== false,
        categoryId: safeNumber(item.categoryId),
        categoryName: item.categoryName || 'Sin categoría',
        businessId: safeNumber(item.businessId),
        businessName: item.businessName || '',
        restaurantId: restaurantId,
        restaurantName: item.restaurantName || '',
        restaurantPrice: ensureValidPrice(item.price),
        restaurantAvailability: item.isAvailable !== false,
        stockQuantity: safeNumber(item.stockQuantity)
      }))
    } catch (error: any) {
      console.error('Error fetching restaurant products:', error)
      throw new Error(error.response?.data?.message || 'Error al obtener productos del restaurante')
    }
  },

  /**
   * Obtener productos por categoría
   */
  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    try {
      const response = await api.get(`/api/Products/Category/${categoryId}`)
      return response.data.map((item: any) => ({
        ...item,
        basePrice: ensureValidPrice(item.basePrice),
        price: ensureValidPrice(item.price || item.basePrice),
        isAvailable: item.isAvailable !== false,
        name: item.name || 'Producto',
        description: item.description || '',
        imageUrl: item.imageUrl || '',
        categoryName: item.categoryName || 'Sin categoría',
        businessId: safeNumber(item.businessId),
        businessName: item.businessName || ''
      }))
    } catch (error: any) {
      console.error('Error fetching category products:', error)
      throw new Error(error.response?.data?.message || 'Error al obtener productos de la categoría')
    }
  },

  /**
   * Buscar productos
   */
  async searchProducts(
    query: string,
    filters?: Omit<ProductSearchFilters, 'query'>
  ): Promise<Product[]> {
    try {
      const params = new URLSearchParams()
      params.append('query', query)

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString())
          }
        })
      }

      const response = await api.get(`/api/Products/search?${params.toString()}`)
      return response.data.map((item: any) => ({
        ...item,
        basePrice: ensureValidPrice(item.basePrice),
        price: ensureValidPrice(item.price || item.basePrice),
        isAvailable: item.isAvailable !== false,
        name: item.name || 'Producto',
        description: item.description || '',
        imageUrl: item.imageUrl || '',
        categoryName: item.categoryName || 'Sin categoría',
        businessId: safeNumber(item.businessId),
        businessName: item.businessName || ''
      }))
    } catch (error: any) {
      console.error('Error searching products:', error)
      throw new Error(error.response?.data?.message || 'Error al buscar productos')
    }
  },

  /**
   * Crear un nuevo producto (solo para administradores)
   */
  async createProduct(productData: ProductCreateRequest): Promise<Product> {
    try {
      const response = await api.post('/api/Products', productData)
      const product = response.data
      return {
        ...product,
        basePrice: ensureValidPrice(product.basePrice),
        price: ensureValidPrice(product.price || product.basePrice),
        isAvailable: product.isAvailable !== false,
        name: product.name || 'Producto',
        description: product.description || '',
        imageUrl: product.imageUrl || '',
        categoryName: product.categoryName || 'Sin categoría',
        businessId: safeNumber(product.businessId),
        businessName: product.businessName || ''
      }
    } catch (error: any) {
      console.error('Error creating product:', error)
      throw new Error(error.response?.data?.message || 'Error al crear el producto')
    }
  },

  /**
   * Actualizar un producto existente
   */
  async updateProduct(productId: number, productData: ProductUpdateRequest): Promise<Product> {
    try {
      const response = await api.put(`/api/Products/${productId}`, productData)
      const product = response.data
      return {
        ...product,
        basePrice: ensureValidPrice(product.basePrice),
        price: ensureValidPrice(product.price || product.basePrice),
        isAvailable: product.isAvailable !== false,
        name: product.name || 'Producto',
        description: product.description || '',
        imageUrl: product.imageUrl || '',
        categoryName: product.categoryName || 'Sin categoría',
        businessId: safeNumber(product.businessId),
        businessName: product.businessName || ''
      }
    } catch (error: any) {
      console.error('Error updating product:', error)
      throw new Error(error.response?.data?.message || 'Error al actualizar el producto')
    }
  },

  /**
   * Eliminar un producto
   */
  async deleteProduct(productId: number): Promise<boolean> {
    try {
      const response = await api.delete(`/api/Products/${productId}`)
      return response.status === 204
    } catch (error: any) {
      console.error('Error deleting product:', error)
      throw new Error(error.response?.data?.message || 'Error al eliminar el producto')
    }
  }
}

export default productService
