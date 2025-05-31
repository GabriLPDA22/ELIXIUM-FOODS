// src/services/paymentService.ts
import api from './api';

export enum PaymentMethod {
  CARD = 'card',
  PAYPAL = 'paypal',
  WALLET = 'wallet',
  CASH = 'cash'
}

export interface PaymentMethodInfo {
  id: number;
  name: string;
  type: PaymentMethod;
  cardType?: string;
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  createdAt: string;
}

export interface CreatePaymentMethodRequest {
  name: string;
  type: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardholderName?: string;
  paypalEmail?: string;
  isDefault: boolean;
}

class PaymentService {
  private basePath = '/api/payment-methods';

  async getUserPaymentMethods(): Promise<PaymentMethodInfo[]> {
    try {
      // Simulación de datos - reemplazar con llamada real al backend
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: 1,
              name: 'Tarjeta personal',
              type: PaymentMethod.CARD,
              cardType: 'visa',
              last4: '1234',
              expiryMonth: 12,
              expiryYear: 2025,
              isDefault: true,
              createdAt: '2024-01-15T10:00:00Z'
            },
            {
              id: 2,
              name: 'PayPal personal',
              type: PaymentMethod.PAYPAL,
              isDefault: false,
              createdAt: '2024-02-20T14:30:00Z'
            }
          ]);
        }, 1000);
      });

      // Implementación real comentada:
      /*
      const response = await api.get(this.basePath);
      return response.data;
      */
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      throw new Error('No se pudieron cargar los métodos de pago');
    }
  }

  async addPaymentMethod(data: CreatePaymentMethodRequest): Promise<PaymentMethodInfo> {
    try {
      // Simulación - reemplazar con llamada real
      return new Promise((resolve) => {
        setTimeout(() => {
          const newMethod: PaymentMethodInfo = {
            id: Date.now(),
            name: data.name,
            type: data.type as PaymentMethod,
            cardType: data.cardNumber ? this.detectCardType(data.cardNumber) : undefined,
            last4: data.cardNumber ? data.cardNumber.slice(-4) : undefined,
            expiryMonth: data.expiryDate ? parseInt(data.expiryDate.split('/')[0]) : undefined,
            expiryYear: data.expiryDate ? parseInt('20' + data.expiryDate.split('/')[1]) : undefined,
            isDefault: data.isDefault,
            createdAt: new Date().toISOString()
          };
          resolve(newMethod);
        }, 1000);
      });

      // Implementación real comentada:
      /*
      const response = await api.post(this.basePath, data);
      return response.data;
      */
    } catch (error) {
      console.error('Error adding payment method:', error);
      throw new Error('No se pudo agregar el método de pago');
    }
  }

  async setDefaultPaymentMethod(id: number): Promise<boolean> {
    try {
      // Simulación - reemplazar con llamada real
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 500);
      });

      // Implementación real comentada:
      /*
      await api.patch(`${this.basePath}/${id}/default`);
      return true;
      */
    } catch (error) {
      console.error('Error setting default payment method:', error);
      return false;
    }
  }

  async deletePaymentMethod(id: number): Promise<boolean> {
    try {
      // Simulación - reemplazar con llamada real
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 1000);
      });

      // Implementación real comentada:
      /*
      await api.delete(`${this.basePath}/${id}`);
      return true;
      */
    } catch (error) {
      console.error('Error deleting payment method:', error);
      return false;
    }
  }

  formatCardNumber(cardNumber: string): string {
    // Remover espacios y caracteres no numéricos
    const cleaned = cardNumber.replace(/\s+/g, '').replace(/[^0-9]/gi, '');

    // Formatear en grupos de 4
    const groups = cleaned.match(/.{1,4}/g) || [];
    return groups.join(' ').slice(0, 19); // Máximo 16 dígitos + 3 espacios
  }

  detectCardType(cardNumber: string): string {
    const cleaned = cardNumber.replace(/\s+/g, '');

    if (cleaned.match(/^4[0-9]{12}(?:[0-9]{3})?$/)) {
      return 'visa';
    } else if (cleaned.match(/^5[1-5][0-9]{14}$/)) {
      return 'mastercard';
    } else if (cleaned.match(/^3[47][0-9]{13}$/)) {
      return 'amex';
    }

    return 'generic';
  }

  getCardTypeName(cardType: string): string {
    const types: Record<string, string> = {
      visa: 'Visa',
      mastercard: 'Mastercard',
      amex: 'American Express',
      generic: 'Tarjeta'
    };
    return types[cardType] || 'Tarjeta';
  }

  validateCardNumber(cardNumber: string): boolean {
    const cleaned = cardNumber.replace(/\s+/g, '');
    return /^[0-9]{13,19}$/.test(cleaned);
  }

  validateExpiryDate(expiryDate: string): boolean {
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      return false;
    }

    const [month, year] = expiryDate.split('/').map(Number);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    if (month < 1 || month > 12) {
      return false;
    }

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return false;
    }

    return true;
  }
}

export const paymentService = new PaymentService();
export default paymentService;
