// src/composables/useReviews.ts
import { computed } from 'vue'
import { useReviewStore } from '@/stores/reviewStore'
import type {
  Review,
  CreateReviewDto,
  UpdateReviewDto,
  ReviewFilter,
  RestaurantReviewSummary,
  ProductReviewSummary
} from '@/types/review'

export const useReviews = () => {
  const reviewStore = useReviewStore()

  // Computed properties
  const loading = computed(() => reviewStore.loading)
  const error = computed(() => reviewStore.error)
  const reviews = computed(() => reviewStore.reviews)
  const userReviews = computed(() => reviewStore.userReviews)

  // Restaurant reviews
  const getRestaurantReviews = async (restaurantId: number, filter?: ReviewFilter): Promise<Review[]> => {
    return await reviewStore.fetchRestaurantReviews(restaurantId, filter)
  }

  const getRestaurantReviewSummary = async (restaurantId: number): Promise<RestaurantReviewSummary> => {
    return await reviewStore.fetchRestaurantSummary(restaurantId)
  }

  // Product reviews
  const getProductReviews = async (productId: number, filter?: ReviewFilter): Promise<Review[]> => {
    return await reviewStore.fetchProductReviews(productId, filter)
  }

  const getProductReviewSummary = async (productId: number): Promise<ProductReviewSummary> => {
    return await reviewStore.fetchProductSummary(productId)
  }

  // User reviews
  const getUserReviews = async (userId: number, filter?: ReviewFilter): Promise<Review[]> => {
    return await reviewStore.fetchUserReviews(userId, filter)
  }

  // Create, update, delete
  const createReview = async (reviewData: CreateReviewDto): Promise<Review> => {
    return await reviewStore.createReview(reviewData)
  }

  const updateReview = async (reviewId: number, reviewData: UpdateReviewDto): Promise<Review> => {
    return await reviewStore.updateReview(reviewId, reviewData)
  }

  const deleteReview = async (reviewId: number): Promise<void> => {
    return await reviewStore.deleteReview(reviewId)
  }

  // Helper functions
  const markAsHelpful = async (reviewId: number): Promise<void> => {
    return await reviewStore.markAsHelpful(reviewId)
  }

  const canReviewRestaurant = async (restaurantId: number): Promise<boolean> => {
    return await reviewStore.canReviewRestaurant(restaurantId)
  }

  const canReviewProduct = async (productId: number): Promise<boolean> => {
    return await reviewStore.canReviewProduct(productId)
  }

  // Utility functions
  const clearError = () => {
    reviewStore.clearError()
  }

  const clearReviews = () => {
    reviewStore.clearReviews()
  }

  return {
    // State
    loading,
    error,
    reviews,
    userReviews,

    // Restaurant methods
    getRestaurantReviews,
    getRestaurantReviewSummary,

    // Product methods
    getProductReviews,
    getProductReviewSummary,

    // User methods
    getUserReviews,

    // CRUD methods
    createReview,
    updateReview,
    deleteReview,

    // Helper methods
    markAsHelpful,
    canReviewRestaurant,
    canReviewProduct,

    // Utility methods
    clearError,
    clearReviews
  }
}
