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

export interface Address {
  id: number
  name?: string
  street: string
  number?: string
  interior?: string
  neighborhood?: string
  city: string
  state: string
  zipCode: string
  phone?: string
  latitude?: number
  longitude?: number
  isDefault?: boolean
  userId?: number
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
}

export interface Category {
  id: number
  name: string
  description: string
  menuId: number
  products: Product[]
}

export interface Product {
  id: number
  name: string
  description: string
  price: number
  imageUrl: string
  isAvailable: boolean
  categoryId: number
  categoryName: string
  restaurantId: number
}

export interface OrderItem {
  id: number
  orderId: number
  productId: number
  productName: string
  productDescription: string
  productImageUrl: string
  quantity: number
  unitPrice: number
  subtotal: number
}

export interface Payment {
  id: number
  orderId: number
  paymentMethod: string
  status: string
  transactionId: string
  amount: number
  paymentDate: string
}

export interface Order {
  id: number
  userId: number
  userFullName: string
  restaurantId: number
  restaurantName: string
  deliveryAddressId: number
  deliveryAddress: string
  deliveryPersonId?: number
  deliveryPersonName?: string
  subtotal: number
  deliveryFee: number
  tax: number
  total: number
  status: string
  estimatedDeliveryTime: string
  createdAt: string
  updatedAt: string
  orderItems: OrderItem[]
  payment: Payment
}
