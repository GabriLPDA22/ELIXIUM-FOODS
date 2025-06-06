// ===== STORE DE PINIA =====

// src/stores/reviewStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  Review,
  CreateReviewDto,
  UpdateReviewDto,
  ReviewFilter,
  RestaurantReviewSummary,
  ProductReviewSummary
} from '@/types/review'
import { reviewService } from '@/services/reviewService'

export const useReviewStore = defineStore('review', () => {
  // State
  const reviews = ref<Review[]>([])
  const restaurantSummaries = ref<Map<number, RestaurantReviewSummary>>(new Map())
  const productSummaries = ref<Map<number, ProductReviewSummary>>(new Map())
  const userReviews = ref<Review[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const getRestaurantSummary = computed(() => {
    return (restaurantId: number) => restaurantSummaries.value.get(restaurantId)
  })

  const getProductSummary = computed(() => {
    return (productId: number) => productSummaries.value.get(productId)
  })

  const getReviewsByRestaurant = computed(() => {
    return (restaurantId: number) => reviews.value.filter(r => r.restaurantId === restaurantId)
  })

  const getReviewsByProduct = computed(() => {
    return (productId: number) => reviews.value.filter(r => r.productId === productId)
  })

  const getUserReviewForRestaurant = computed(() => {
    return (userId: number, restaurantId: number) =>
      reviews.value.find(r => r.userId === userId && r.restaurantId === restaurantId && !r.productId)
  })

  const getUserReviewForProduct = computed(() => {
    return (userId: number, productId: number) =>
      reviews.value.find(r => r.userId === userId && r.productId === productId)
  })

  // Actions
  const fetchRestaurantReviews = async (restaurantId: number, filter?: ReviewFilter) => {
    loading.value = true
    error.value = null
    try {
      const fetchedReviews = await reviewService.getRestaurantReviews(restaurantId, filter)

      // Update reviews array, avoiding duplicates
      fetchedReviews.forEach(newReview => {
        const existingIndex = reviews.value.findIndex(r => r.id === newReview.id)
        if (existingIndex !== -1) {
          reviews.value[existingIndex] = newReview
        } else {
          reviews.value.push(newReview)
        }
      })

      return fetchedReviews
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al cargar reseñas'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchProductReviews = async (productId: number, filter?: ReviewFilter) => {
    loading.value = true
    error.value = null
    try {
      const fetchedReviews = await reviewService.getProductReviews(productId, filter)

      // Update reviews array, avoiding duplicates
      fetchedReviews.forEach(newReview => {
        const existingIndex = reviews.value.findIndex(r => r.id === newReview.id)
        if (existingIndex !== -1) {
          reviews.value[existingIndex] = newReview
        } else {
          reviews.value.push(newReview)
        }
      })

      return fetchedReviews
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al cargar reseñas'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchRestaurantSummary = async (restaurantId: number) => {
    loading.value = true
    error.value = null
    try {
      const summary = await reviewService.getRestaurantReviewSummary(restaurantId)
      restaurantSummaries.value.set(restaurantId, summary)

      // Also update reviews with recent reviews from summary
      summary.recentReviews.forEach(review => {
        const existingIndex = reviews.value.findIndex(r => r.id === review.id)
        if (existingIndex !== -1) {
          reviews.value[existingIndex] = review
        } else {
          reviews.value.push(review)
        }
      })

      return summary
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al cargar resumen'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchProductSummary = async (productId: number) => {
    loading.value = true
    error.value = null
    try {
      const summary = await reviewService.getProductReviewSummary(productId)
      productSummaries.value.set(productId, summary)

      // Also update reviews with recent reviews from summary
      summary.recentReviews.forEach(review => {
        const existingIndex = reviews.value.findIndex(r => r.id === review.id)
        if (existingIndex !== -1) {
          reviews.value[existingIndex] = review
        } else {
          reviews.value.push(review)
        }
      })

      return summary
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al cargar resumen'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchUserReviews = async (userId: number, filter?: ReviewFilter) => {
    loading.value = true
    error.value = null
    try {
      const fetchedReviews = await reviewService.getUserReviews(userId, filter)
      userReviews.value = fetchedReviews
      return fetchedReviews
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al cargar reseñas del usuario'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createReview = async (reviewData: CreateReviewDto) => {
    loading.value = true
    error.value = null
    try {
      const newReview = await reviewService.createReview(reviewData)
      reviews.value.unshift(newReview)

      // Invalidate summaries to force reload
      if (reviewData.productId) {
        productSummaries.value.delete(reviewData.productId)
      }
      restaurantSummaries.value.delete(reviewData.restaurantId)

      return newReview
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al crear reseña'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateReview = async (reviewId: number, reviewData: UpdateReviewDto) => {
    loading.value = true
    error.value = null
    try {
      const updatedReview = await reviewService.updateReview(reviewId, reviewData)

      // Update in reviews array
      const index = reviews.value.findIndex(r => r.id === reviewId)
      if (index !== -1) {
        reviews.value[index] = updatedReview
      }

      // Update in userReviews if present
      const userIndex = userReviews.value.findIndex(r => r.id === reviewId)
      if (userIndex !== -1) {
        userReviews.value[userIndex] = updatedReview
      }

      // Invalidate summaries to force reload
      if (updatedReview.productId) {
        productSummaries.value.delete(updatedReview.productId)
      }
      restaurantSummaries.value.delete(updatedReview.restaurantId)

      return updatedReview
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al actualizar reseña'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteReview = async (reviewId: number) => {
    loading.value = true
    error.value = null
    try {
      const reviewToDelete = reviews.value.find(r => r.id === reviewId)

      await reviewService.deleteReview(reviewId)

      // Remove from arrays
      reviews.value = reviews.value.filter(r => r.id !== reviewId)
      userReviews.value = userReviews.value.filter(r => r.id !== reviewId)

      // Invalidate summaries to force reload
      if (reviewToDelete) {
        if (reviewToDelete.productId) {
          productSummaries.value.delete(reviewToDelete.productId)
        }
        restaurantSummaries.value.delete(reviewToDelete.restaurantId)
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al eliminar reseña'
      throw err
    } finally {
      loading.value = false
    }
  }

  const markAsHelpful = async (reviewId: number) => {
    try {
      await reviewService.markAsHelpful(reviewId)

      // Update helpful count locally
      const review = reviews.value.find(r => r.id === reviewId)
      if (review) {
        review.helpfulCount++
      }

      const userReview = userReviews.value.find(r => r.id === reviewId)
      if (userReview) {
        userReview.helpfulCount++
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al marcar como útil'
      throw err
    }
  }

  const canReviewRestaurant = async (restaurantId: number): Promise<boolean> => {
    try {
      return await reviewService.canReviewRestaurant(restaurantId)
    } catch (err) {
      return false
    }
  }

  const canReviewProduct = async (productId: number): Promise<boolean> => {
    try {
      return await reviewService.canReviewProduct(productId)
    } catch (err) {
      return false
    }
  }

  const clearError = () => {
    error.value = null
  }

  const clearReviews = () => {
    reviews.value = []
    userReviews.value = []
  }

  const clearSummaries = () => {
    restaurantSummaries.value.clear()
    productSummaries.value.clear()
  }

  return {
    // State
    reviews,
    userReviews,
    loading,
    error,

    // Getters
    getRestaurantSummary,
    getProductSummary,
    getReviewsByRestaurant,
    getReviewsByProduct,
    getUserReviewForRestaurant,
    getUserReviewForProduct,

    // Actions
    fetchRestaurantReviews,
    fetchProductReviews,
    fetchRestaurantSummary,
    fetchProductSummary,
    fetchUserReviews,
    createReview,
    updateReview,
    deleteReview,
    markAsHelpful,
    canReviewRestaurant,
    canReviewProduct,
    clearError,
    clearReviews,
    clearSummaries
  }
})
