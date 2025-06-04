// ===== TIPOS TYPESCRIPT =====

// src/types/review.ts
export interface Review {
  id: number
  userId: number
  userName: string
  userAvatarUrl: string
  restaurantId: number
  restaurantName: string
  productId?: number
  productName?: string
  rating: number
  comment: string
  imageUrl?: string
  isVerifiedPurchase: boolean
  isHelpful: boolean
  helpfulCount: number
  createdAt: string
  updatedAt: string
  timeAgo: string
}

export interface ReviewStats {
  totalReviews: number
  averageRating: number
  ratingDistribution: Record<number, number>
  recentReviews: number
}

export interface RestaurantReviewSummary {
  restaurantId: number
  restaurantName: string
  stats: ReviewStats
  recentReviews: Review[]
}

export interface ProductReviewSummary {
  productId: number
  productName: string
  restaurantId: number
  restaurantName: string
  stats: ReviewStats
  recentReviews: Review[]
}

export interface CreateReviewDto {
  restaurantId: number
  productId?: number
  rating: number
  comment: string
  imageUrl?: string
}

export interface UpdateReviewDto {
  rating: number
  comment: string
  imageUrl?: string
}

export interface ReviewFilter {
  rating?: number
  verifiedOnly?: boolean
  withImages?: boolean
  dateFrom?: string
  dateTo?: string
  sortBy?: 'newest' | 'oldest' | 'highest_rating' | 'lowest_rating' | 'most_helpful'
  page?: number
  pageSize?: number
}


