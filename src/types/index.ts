// src/types/index.ts

export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  role: string
  phoneNumber?: string
  birthdate?: string
  bio?: string
  dietaryPreferences?: string[]
  photoURL?: string
  createdAt?: Date
  addresses?: Address[]
}

export interface Restaurant {
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
  // Additional fields for enhanced functionality
  businessId?: number
  categories?: Category[]
  hours?: RestaurantHour[]
}

export interface RestaurantHour {
  id: number
  dayOfWeek: string
  isOpen: boolean
  openTime: string
  closeTime: string
  restaurantId: number
}

export interface RestaurantStatus {
  isCurrentlyOpen: boolean
  status: string
  statusMessage: string
  hours?: RestaurantHour[]
}

export interface Category {
  id: number
  name: string
  description: string
  businessId: number
  products?: Product[]
}

export interface Product {
  id: number
  name: string
  description: string
  basePrice: number
  imageUrl: string
  isAvailable: boolean
  categoryId: number
  businessId: number

  // Restaurant-specific fields
  restaurantId?: number
  restaurantName?: string
  restaurantPrice?: number
  restaurantProductIsAvailable?: boolean
  stockQuantity?: number
}

export interface ProductOffer {
  id: number
  name: string
  description: string
  discountType: 'percentage' | 'fixed' | '%'
  discountValue: number
  minimumOrderAmount: number
  minimumQuantity: number
  startDate: string
  endDate: string
  usageLimit: number
  usageCount: number
  status: 'active' | 'inactive' | 'expired'
  restaurantId: number
  restaurantName: string
  productId: number
  productName: string
  productImageUrl: string
  createdAt: string
  updatedAt: string
  isActive: boolean
  isExpired: boolean
  remainingUses: number
}

export interface CartItem {
  id: number
  productId: number
  name: string
  price: number
  originalPrice: number
  imageUrl: string
  restaurantId: number
  restaurantName: string
  categoryId: number
  isAvailable: boolean
  description: string
  businessId: number
  businessName: string
  quantity: number
  appliedOffer?: ProductOffer
}

export interface Address {
  id: number
  name: string
  street: string
  number: string
  interior?: string
  neighborhood?: string
  city: string
  state: string
  zipCode: string
  phone: string
  latitude?: number
  longitude?: number
  isDefault: boolean
  userId?: number
}

export interface PaymentMethod {
  id: number
  nickname: string
  type: 'visa' | 'mastercard' | 'paypal' | 'other'
  lastFourDigits?: string
  expiryMonth?: number
  expiryYear?: number
  cardholderName?: string
  payPalEmail?: string
  isDefault: boolean
  isActive: boolean
  userId: number
}

export interface OrderItem {
  id?: number
  productId: number
  productName: string
  quantity: number
  unitPrice: number
  subtotal: number
  productImageUrl?: string
}

export interface Order {
  id: number
  subtotal: number
  deliveryFee: number
  total: number
  status: OrderStatus
  estimatedDeliveryTime: string
  createdAt: string
  updatedAt: string
  userId: number
  restaurantId: number
  restaurantName: string
  deliveryAddressId: number
  deliveryAddress?: Address
  deliveryPersonId?: number
  orderItems: OrderItem[]
  payment?: Payment
}

export interface Payment {
  id: number
  paymentMethod: string
  status: 'Pending' | 'Completed' | 'Failed' | 'Refunded'
  transactionId?: string
  amount: number
  paymentDate: string
  orderId: number
}

export enum OrderStatus {
  PENDING = 'Pending',
  ACCEPTED = 'Accepted',
  PREPARING = 'Preparing',
  READY_FOR_PICKUP = 'ReadyForPickup',
  ON_THE_WAY = 'OnTheWay',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled'
}

export interface CreateOrderRequest {
  restaurantId: number
  deliveryAddressId: number
  items: {
    productId: number
    quantity: number
    name?: string
    price?: number
  }[]
  paymentMethod: string
  deliveryInstructions?: string
  promoCode?: string
  scheduledDeliveryTime?: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  errors?: string[]
}

export interface PaginatedResponse<T> {
  data: T[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}
