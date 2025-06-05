// src/types/review.ts

export interface Review {
  id: number
  userId: number
  userName: string
  userAvatarUrl?: string
  restaurantId: number
  restaurantName: string
  productId?: number
  productName?: string
  rating: number
  comment: string
  imageUrl?: string
  isVerifiedPurchase: boolean
  helpfulCount: number
  isHelpful?: boolean
  createdAt: string
  updatedAt: string
  timeAgo: string
}

export interface CreateReviewDto {
  restaurantId: number
  productId?: number
  rating: number
  comment: string
  imageUrl?: string
}

export interface UpdateReviewDto {
  rating?: number
  comment?: string
  imageUrl?: string
}

export interface ReviewFilter {
  rating?: number
  verifiedOnly?: boolean
  withImages?: boolean
  sortBy?: 'newest' | 'oldest' | 'highest_rating' | 'lowest_rating' | 'most_helpful'
  page?: number
  pageSize?: number
}

export interface ReviewStats {
  averageRating: number
  totalReviews: number
  recentReviews: number
  ratingDistribution: Record<number, number>
}

export interface RestaurantReviewSummary {
  stats: ReviewStats
  recentReviews: Review[]
}

export interface ProductReviewSummary {
  stats: ReviewStats
  recentReviews: Review[]
}
