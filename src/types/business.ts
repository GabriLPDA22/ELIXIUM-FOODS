// src/types/business.ts
export interface Business {
  id: number
  name: string
  email: string
  phone?: string
  address?: string
  city?: string
  postalCode?: string
  description?: string
  logoUrl?: string
  coverImageUrl?: string
  role: string // 'restaurant' | 'admin' | 'partner'
  status: string // 'active' | 'pending' | 'suspended'
  categories?: number[]
  openingHours?: OpeningHours
  minOrderAmount?: number
  deliveryFee?: number
  averageRating?: number
  createdAt: string
  updatedAt: string
}

export interface OpeningHours {
  monday?: DaySchedule
  tuesday?: DaySchedule
  wednesday?: DaySchedule
  thursday?: DaySchedule
  friday?: DaySchedule
  saturday?: DaySchedule
  sunday?: DaySchedule
}

export interface DaySchedule {
  open: boolean
  periods: TimePeriod[]
}

export interface TimePeriod {
  start: string // formato HH:MM
  end: string // formato HH:MM
}
