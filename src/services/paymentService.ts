// src/services/paymentService.ts
import { api } from '@/services/api'

export enum PaymentStatus {
  PENDING = 'Pending',
  PROCESSING = 'Processing',
  COMPLETED = 'Completed',
  FAILED = 'Failed',
  REFUNDED = 'Refunded',
  CANCELLED = 'Cancelled'
}

export enum PaymentMethod {
  CARD = 'card',
  PAYPAL = 'paypal',
  CASH = 'cash',
  WALLET = 'wallet'
}

export interface PaymentMethodInfo {
  id: number
  type: PaymentMethod
  name: string
  cardType?: 'visa' | 'mastercard' | 'amex' | 'generic'
  last4?: string
  expiryMonth?: number
  expiryYear?: number
  isDefault: boolean
  createdAt: string
}

export interface PaymentRequest {
  orderId: number
  paymentMethodId: number
  amount: number
}

export interface PaymentResponse {
  id: number
  orderId: number
  amount: number
  status: PaymentStatus
  paymentMethod: PaymentMethod
  transactionId?: string
  createdAt: string
  updatedAt: string
}

export interface RefundRequest {
  paymentId: number
  amount?: number // Si no se especifica, se reembolsa el total
  reason: string
}

export interface RefundResponse {
  id: number
  paymentId: number
  amount: number
  status: PaymentStatus
  reason: string
  createdAt: string
}

class PaymentService {
  /**
   * Obtener métodos de pago del usuario
   */
  async getUserPaymentMethods(): Promise<PaymentMethodInfo[]> {
    try {
      const response = await api.get('/api/PaymentMethods')
      return response.data
    } catch (error) {
      console.error('Error fetching payment methods:', error)

      // Datos simulados para desarrollo
      return this.generateMockPaymentMethods()
    }
  }

  /**
   * Añadir nuevo método de pago
   */
  async addPaymentMethod(paymentMethodData: any): Promise<PaymentMethodInfo> {
    try {
      const response = await api.post('/api/PaymentMethods', paymentMethodData)
      return response.data
    } catch (error: any) {
      console.error('Error adding payment method:', error)
      throw new Error(error.response?.data?.message || 'Error al añadir método de pago')
    }
  }

  /**
   * Eliminar método de pago
   */
  async deletePaymentMethod(paymentMethodId: number): Promise<boolean> {
    try {
      await api.delete(`/api/PaymentMethods/${paymentMethodId}`)
      return true
    } catch (error) {
      console.error('Error deleting payment method:', error)
      return false
    }
  }

  /**
   * Establecer método de pago como predeterminado
   */
  async setDefaultPaymentMethod(paymentMethodId: number): Promise<boolean> {
    try {
      await api.put(`/api/PaymentMethods/${paymentMethodId}/default`)
      return true
    } catch (error) {
      console.error('Error setting default payment method:', error)
      return false
    }
  }

  /**
   * Procesar pago
   */
  async processPayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    try {
      const response = await api.post('/api/Payments', paymentRequest)
      return response.data
    } catch (error: any) {
      console.error('Error processing payment:', error)
      throw new Error(error.response?.data?.message || 'Error al procesar el pago')
    }
  }

  /**
   * Obtener información de un pago
   */
  async getPaymentById(paymentId: number): Promise<PaymentResponse> {
    try {
      const response = await api.get(`/api/Payments/${paymentId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching payment:', error)
      throw new Error('Error al obtener información del pago')
    }
  }

  /**
   * Obtener pagos de un pedido
   */
  async getPaymentsByOrder(orderId: number): Promise<PaymentResponse[]> {
    try {
      const response = await api.get(`/api/Orders/${orderId}/payments`)
      return response.data
    } catch (error) {
      console.error('Error fetching order payments:', error)
      return []
    }
  }

  /**
   * Reembolsar pago
   */
  async refundPayment(refundRequest: RefundRequest): Promise<RefundResponse> {
    try {
      const response = await api.post('/api/Payments/refund', refundRequest)
      return response.data
    } catch (error: any) {
      console.error('Error processing refund:', error)
      throw new Error(error.response?.data?.message || 'Error al procesar el reembolso')
    }
  }

  /**
   * Obtener historial de pagos del usuario
   */
  async getUserPaymentHistory(): Promise<PaymentResponse[]> {
    try {
      const response = await api.get('/api/Payments/user')
      return response.data
    } catch (error) {
      console.error('Error fetching payment history:', error)
      return []
    }
  }

  /**
   * Validar método de pago
   */
  async validatePaymentMethod(paymentMethodId: number): Promise<boolean> {
    try {
      const response = await api.post(`/api/PaymentMethods/${paymentMethodId}/validate`)
      return response.data.isValid
    } catch (error) {
      console.error('Error validating payment method:', error)
      return false
    }
  }

  /**
   * Calcular fees de pago
   */
  async calculatePaymentFees(amount: number, paymentMethod: PaymentMethod): Promise<number> {
    try {
      const response = await api.get(`/api/Payments/fees?amount=${amount}&method=${paymentMethod}`)
      return response.data.fees
    } catch (error) {
      console.error('Error calculating payment fees:', error)

      // Fees simulados
      switch (paymentMethod) {
        case PaymentMethod.CARD:
          return amount * 0.029 // 2.9%
        case PaymentMethod.PAYPAL:
          return amount * 0.034 // 3.4%
        default:
          return 0
      }
    }
  }

  /**
   * Generar métodos de pago simulados para desarrollo
   */
  private generateMockPaymentMethods(): PaymentMethodInfo[] {
    return [
      {
        id: 1,
        type: PaymentMethod.CARD,
        name: '**** 1234',
        cardType: 'visa',
        last4: '1234',
        expiryMonth: 12,
        expiryYear: 2028,
        isDefault: true,
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 2,
        type: PaymentMethod.CARD,
        name: '**** 5678',
        cardType: 'mastercard',
        last4: '5678',
        expiryMonth: 8,
        expiryYear: 2027,
        isDefault: false,
        createdAt: '2024-01-15T00:00:00Z'
      },
      {
        id: 3,
        type: PaymentMethod.PAYPAL,
        name: 'PayPal (usuario@email.com)',
        isDefault: false,
        createdAt: '2024-02-01T00:00:00Z'
      }
    ]
  }

  /**
   * Obtener el nombre amigable del tipo de tarjeta
   */
  getCardTypeName(cardType: string): string {
    switch (cardType) {
      case 'visa':
        return 'Visa'
      case 'mastercard':
        return 'Mastercard'
      case 'amex':
        return 'American Express'
      default:
        return 'Tarjeta'
    }
  }

  /**
   * Obtener el texto del estado de pago
   */
  getPaymentStatusText(status: PaymentStatus): string {
    switch (status) {
      case PaymentStatus.PENDING:
        return 'Pendiente'
      case PaymentStatus.PROCESSING:
        return 'Procesando'
      case PaymentStatus.COMPLETED:
        return 'Completado'
      case PaymentStatus.FAILED:
        return 'Fallido'
      case PaymentStatus.REFUNDED:
        return 'Reembolsado'
      case PaymentStatus.CANCELLED:
        return 'Cancelado'
      default:
        return status
    }
  }

  /**
   * Formatear número de tarjeta
   */
  formatCardNumber(cardNumber: string): string {
    return cardNumber.replace(/(.{4})/g, '$1 ').trim()
  }

  /**
   * Detectar tipo de tarjeta por número
   */
  detectCardType(cardNumber: string): 'visa' | 'mastercard' | 'amex' | 'generic' {
    const number = cardNumber.replace(/\s/g, '')

    if (number.startsWith('4')) return 'visa'
    if (number.startsWith('5') || number.startsWith('2')) return 'mastercard'
    if (number.startsWith('3')) return 'amex'

    return 'generic'
  }
}

export const paymentService = new PaymentService()
