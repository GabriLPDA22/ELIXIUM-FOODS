// src/stores/homeStore.ts
import { defineStore } from 'pinia'
import { categoryService, type Category } from '@/services/categoryService'
import { restaurantService, type RestaurantCard } from '@/services/restaurantService'

interface HomeState {
  categories: Category[]
  popularRestaurants: RestaurantCard[]
  isLoading: boolean
  error: string | null
}

export const useHomeStore = defineStore('home', {
  state: (): HomeState => ({
    categories: [],
    popularRestaurants: [],
    isLoading: false,
    error: null,
  }),

  actions: {
    async fetchCategories() {
      try {
        this.isLoading = true
        this.error = null
        this.categories = await categoryService.getAllCategories()
      } catch (error) {
        this.error = 'Error al cargar las categorías'
        console.error('Error fetching categories:', error)
      } finally {
        this.isLoading = false
      }
    },

    async fetchPopularRestaurants() {
      try {
        this.isLoading = true
        this.error = null
        this.popularRestaurants = await restaurantService.getPopularRestaurants(8)
      } catch (error) {
        this.error = 'Error al cargar los restaurantes populares'
        console.error('Error fetching popular restaurants:', error)
      } finally {
        this.isLoading = false
      }
    },

    async initialize() {
      await Promise.all([this.fetchCategories(), this.fetchPopularRestaurants()])
    },
  },
})
