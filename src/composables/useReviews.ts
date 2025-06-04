// ===== COMPOSABLE MEJORADO =====

// src/composables/useReviews.ts
import { computed } from 'vue'
import { useReviewStore } from '@/stores/reviewStore'
import type { Review, CreateReviewDto, UpdateReviewDto, ReviewFilter } from '@/types/review'

export function useReviews() {
  const reviewStore = useReviewStore()

  // Computed properties from store
  const reviews = computed(() => reviewStore.reviews)
  const userReviews = computed(() => reviewStore.userReviews)
  const loading = computed(() => reviewStore.loading)
  const error = computed(() => reviewStore.error)

  // Methods that use store actions
  const getRestaurantReviews = async (restaurantId: number, filter?: ReviewFilter) => {
    return await reviewStore.fetchRestaurantReviews(restaurantId, filter)
  }

  const getProductReviews = async (productId: number, filter?: ReviewFilter) => {
    return await reviewStore.fetchProductReviews(productId, filter)
  }

  const getRestaurantReviewSummary = async (restaurantId: number) => {
    return await reviewStore.fetchRestaurantSummary(restaurantId)
  }

  const getProductReviewSummary = async (productId: number) => {
    return await reviewStore.fetchProductSummary(productId)
  }

  const getUserReviews = async (userId: number, filter?: ReviewFilter) => {
    return await reviewStore.fetchUserReviews(userId, filter)
  }

  const createReview = async (reviewData: CreateReviewDto) => {
    return await reviewStore.createReview(reviewData)
  }

  const updateReview = async (reviewId: number, reviewData: UpdateReviewDto) => {
    return await reviewStore.updateReview(reviewId, reviewData)
  }

  const deleteReview = async (reviewId: number) => {
    await reviewStore.deleteReview(reviewId)
  }

  const markAsHelpful = async (reviewId: number) => {
    await reviewStore.markAsHelpful(reviewId)
  }

  const canReviewRestaurant = async (restaurantId: number) => {
    return await reviewStore.canReviewRestaurant(restaurantId)
  }

  const canReviewProduct = async (productId: number) => {
    return await reviewStore.canReviewProduct(productId)
  }

  // Computed getters
  const getRestaurantSummary = (restaurantId: number) => {
    return reviewStore.getRestaurantSummary(restaurantId)
  }

  const getProductSummary = (productId: number) => {
    return reviewStore.getProductSummary(productId)
  }

  const getReviewsByRestaurant = (restaurantId: number) => {
    return reviewStore.getReviewsByRestaurant(restaurantId)
  }

  const getReviewsByProduct = (productId: number) => {
    return reviewStore.getReviewsByProduct(productId)
  }

  const getUserReviewForRestaurant = (userId: number, restaurantId: number) => {
    return reviewStore.getUserReviewForRestaurant(userId, restaurantId)
  }

  const getUserReviewForProduct = (userId: number, productId: number) => {
    return reviewStore.getUserReviewForProduct(userId, productId)
  }

  // Statistics computed
  const averageRating = computed(() => {
    if (reviews.value.length === 0) return 0
    const total = reviews.value.reduce((sum, review) => sum + review.rating, 0)
    return total / reviews.value.length
  })

  const ratingDistribution = computed(() => {
    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    reviews.value.forEach(review => {
      distribution[review.rating]++
    })
    return distribution
  })

  const totalReviews = computed(() => reviews.value.length)

  return {
    // State
    reviews,
    userReviews,
    loading,
    error,
    
    // Actions
    getRestaurantReviews,
    getProductReviews,
    getRestaurantReviewSummary,
    getProductReviewSummary,
    getUserReviews,
    createReview,
    updateReview,
    deleteReview,
    markAsHelpful,
    canReviewRestaurant,
    canReviewProduct,
    
    // Getters
    getRestaurantSummary,
    getProductSummary,
    getReviewsByRestaurant,
    getReviewsByProduct,
    getUserReviewForRestaurant,
    getUserReviewForProduct,
    
    // Statistics
    averageRating,
    ratingDistribution,
    totalReviews,
    
    // Utilities
    clearError: reviewStore.clearError,
    clearReviews: reviewStore.clearReviews,
    clearSummaries: reviewStore.clearSummaries
  }
}
