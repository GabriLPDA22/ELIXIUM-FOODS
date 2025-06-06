// ===== UTILS PARA REVIEWS =====

// src/utils/reviewUtils.ts
import type { Review, ReviewStats } from '@/types/review'

export const reviewUtils = {
  // Calcular tiempo relativo
  getTimeAgo(date: string | Date): string {
    const now = new Date()
    const reviewDate = new Date(date)
    const diffInMs = now.getTime() - reviewDate.getTime()
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
    const diffInWeeks = Math.floor(diffInDays / 7)
    const diffInMonths = Math.floor(diffInDays / 30)
    const diffInYears = Math.floor(diffInDays / 365)

    if (diffInMinutes < 1) return 'Hace un momento'
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`
    if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`
    if (diffInDays < 7) return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`
    if (diffInWeeks < 4) return `Hace ${diffInWeeks} semana${diffInWeeks > 1 ? 's' : ''}`
    if (diffInMonths < 12) return `Hace ${diffInMonths} mes${diffInMonths > 1 ? 'es' : ''}`
    return `Hace ${diffInYears} año${diffInYears > 1 ? 's' : ''}`
  },

  // Formatear rating para mostrar
  formatRating(rating: number): string {
    return rating.toFixed(1)
  },

  // Obtener texto descriptivo del rating
  getRatingText(rating: number): string {
    if (rating >= 4.5) return 'Excelente'
    if (rating >= 4.0) return 'Muy bueno'
    if (rating >= 3.5) return 'Bueno'
    if (rating >= 3.0) return 'Regular'
    if (rating >= 2.0) return 'Malo'
    return 'Muy malo'
  },

  // Obtener color para el rating
  getRatingColor(rating: number): string {
    if (rating >= 4.5) return 'text-green-600'
    if (rating >= 4.0) return 'text-green-500'
    if (rating >= 3.5) return 'text-yellow-500'
    if (rating >= 3.0) return 'text-orange-500'
    if (rating >= 2.0) return 'text-red-500'
    return 'text-red-600'
  },

  // Validar datos de reseña
  validateReviewData(data: { rating: number; comment: string; imageUrl?: string }): string[] {
    const errors: string[] = []

    if (data.rating < 1 || data.rating > 5) {
      errors.push('La calificación debe estar entre 1 y 5 estrellas')
    }

    const trimmedComment = data.comment.trim()
    if (trimmedComment.length < 10) {
      errors.push('El comentario debe tener al menos 10 caracteres')
    }
    if (trimmedComment.length > 1000) {
      errors.push('El comentario no puede exceder 1000 caracteres')
    }

    if (data.imageUrl && !this.isValidUrl(data.imageUrl)) {
      errors.push('La URL de la imagen no es válida')
    }

    return errors
  },

  // Validar URL
  isValidUrl(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  },

  // Calcular estadísticas de reseñas
  calculateStats(reviews: Review[]): ReviewStats {
    const totalReviews = reviews.length
    const averageRating = totalReviews > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
      : 0

    const ratingDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    reviews.forEach(review => {
      ratingDistribution[review.rating]++
    })

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const recentReviews = reviews.filter(review => 
      new Date(review.createdAt) >= thirtyDaysAgo
    ).length

    return {
      totalReviews,
      averageRating,
      ratingDistribution,
      recentReviews
    }
  },

  // Agrupar reseñas por rating
  groupByRating(reviews: Review[]): Record<number, Review[]> {
    return reviews.reduce((groups, review) => {
      const rating = review.rating
      if (!groups[rating]) {
        groups[rating] = []
      }
      groups[rating].push(review)
      return groups
    }, {} as Record<number, Review[]>)
  },

  // Filtrar reseñas
  filterReviews(reviews: Review[], filters: {
    rating?: number
    verifiedOnly?: boolean
    withImages?: boolean
    dateFrom?: Date
    dateTo?: Date
  }): Review[] {
    return reviews.filter(review => {
      if (filters.rating && review.rating !== filters.rating) return false
      if (filters.verifiedOnly && !review.isVerifiedPurchase) return false
      if (filters.withImages && !review.imageUrl) return false
      
      const reviewDate = new Date(review.createdAt)
      if (filters.dateFrom && reviewDate < filters.dateFrom) return false
      if (filters.dateTo && reviewDate > filters.dateTo) return false
      
      return true
    })
  },

  // Ordenar reseñas
  sortReviews(reviews: Review[], sortBy: string): Review[] {
    const sorted = [...reviews]
    
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      case 'highest_rating':
        return sorted.sort((a, b) => b.rating - a.rating || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      case 'lowest_rating':
        return sorted.sort((a, b) => a.rating - b.rating || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      case 'most_helpful':
        return sorted.sort((a, b) => b.helpfulCount - a.helpfulCount || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      default:
        return sorted
    }
  }
}