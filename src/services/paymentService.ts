// src/services/paymentService.ts - ARREGLADO CON VALIDACIONES CONDICIONALES
import { api } from './api'

export interface PaymentMethodInfo {
  id: number
  nickname: string
  type: string
  lastFourDigits?: string
  expiryMonth?: number
  expiryYear?: number
  cardholderName?: string
  payPalEmail?: string
  isDefault: boolean
  createdAt: string
}

export interface CreatePaymentMethodRequest {
  nickname: string
  type: string
  cardNumber?: string
  expiryDate?: string
  cvv?: string
  cardholderName?: string
  payPalEmail?: string
  isDefault: boolean
}

class PaymentService {
  private basePath = '/api/PaymentMethods'

  async getUserPaymentMethods(): Promise<PaymentMethodInfo[]> {
    try {
      console.log('🔄 Fetching payment methods...')
      const response = await api.get(this.basePath)

      console.log('📦 GET Response status:', response.status)
      console.log('📦 GET Response data (raw):', response.data)
      console.log('📦 GET Response data (JSON):', JSON.stringify(response.data, null, 2))

      // 🔍 VERIFICAR TODAS LAS POSIBLES ESTRUCTURAS DE RESPUESTA PARA GET
      const responseData = response.data;

      console.log('🔍 Verificando estructura de respuesta GET...');
      console.log('📦 Response keys:', responseData ? Object.keys(responseData) : 'No keys');
      console.log('📦 Success property:', responseData?.Success, typeof responseData?.Success);
      console.log('📦 success property (lowercase):', responseData?.success, typeof responseData?.success);
      console.log('📦 Data property:', responseData?.Data, typeof responseData?.Data);
      console.log('📦 data property (lowercase):', responseData?.data, typeof responseData?.data);

      // 🔍 VERIFICAR MÚLTIPLES FORMATOS DE RESPUESTA POSIBLES PARA GET
      const isSuccess = responseData?.Success === true || responseData?.success === true;
      const methodsData = responseData?.Data || responseData?.data || [];

      console.log('🔍 GET Analysis:', {
        isSuccess,
        hasMethodsData: !!methodsData,
        methodsDataType: typeof methodsData,
        methodsDataLength: Array.isArray(methodsData) ? methodsData.length : 'Not array',
        methodsDataIsArray: Array.isArray(methodsData)
      });

      if (isSuccess && Array.isArray(methodsData)) {
        console.log('✅ Payment methods loaded successfully:', methodsData.length)
        console.log('📋 Methods data:', methodsData)
        return methodsData
      } else if (isSuccess && !Array.isArray(methodsData)) {
        console.warn('⚠️ Success is true but Data is not an array:', {
          methodsData,
          type: typeof methodsData
        });
        return []
      } else if (!isSuccess) {
        console.warn('⚠️ Success is false:', responseData);
        return []
      } else {
        console.warn('⚠️ Unexpected response format:', responseData)
        return []
      }
    } catch (error: any) {
      console.error('❌ Error fetching payment methods:', error)

      if (error.response) {
        console.error('❌ GET Error response status:', error.response.status);
        console.error('❌ GET Error response data:', error.response.data);
      }

      throw new Error(error.response?.data?.Message || error.response?.data?.message || 'Error al cargar métodos de pago')
    }
  }

  async addPaymentMethod(data: CreatePaymentMethodRequest): Promise<PaymentMethodInfo> {
    try {
      console.log('=== INICIO DEBUG FRONTEND ===')
      console.log('🔄 Adding payment method:', data)

      // 🔍 VALIDACIONES CONDICIONALES SEGÚN TIPO DE PAGO
      this.validatePaymentMethodData(data);

      // ✅ PREPARAR PAYLOAD CONDICIONAL SEGÚN TIPO
      const payload = this.buildPayloadForType(data);

      console.log('📤 Payload final que se envía al backend:', payload)
      console.log('📤 Payload as JSON:', JSON.stringify(payload, null, 2))

      console.log('🌐 Enviando POST a:', this.basePath)

      const response = await api.post(this.basePath, payload)

      console.log('📦 Response status:', response.status)
      console.log('📦 Response data (raw):', response.data)
      console.log('📦 Response data (JSON):', JSON.stringify(response.data, null, 2))

      // 🔍 VERIFICAR TODAS LAS POSIBLES ESTRUCTURAS DE RESPUESTA
      const responseData = response.data;

      console.log('🔍 Verificando estructura de respuesta...');
      console.log('📦 Response keys:', responseData ? Object.keys(responseData) : 'No keys');
      console.log('📦 Success property:', responseData?.Success, typeof responseData?.Success);
      console.log('📦 success property (lowercase):', responseData?.success, typeof responseData?.success);
      console.log('📦 Data property:', responseData?.Data, typeof responseData?.Data);
      console.log('📦 data property (lowercase):', responseData?.data, typeof responseData?.data);
      console.log('📦 Message property:', responseData?.Message, typeof responseData?.Message);
      console.log('📦 message property (lowercase):', responseData?.message, typeof responseData?.message);

      console.log('=== FIN DEBUG FRONTEND ===')

      // 🔍 VERIFICAR MÚLTIPLES FORMATOS DE RESPUESTA POSIBLES
      const isSuccess = responseData?.Success === true || responseData?.success === true;
      const paymentMethodData = responseData?.Data || responseData?.data;
      const errorMessage = responseData?.Message || responseData?.message || 'Error al crear el método de pago';

      if (isSuccess && paymentMethodData) {
        console.log('✅ Payment method created successfully');
        return paymentMethodData;
      } else if (isSuccess && !paymentMethodData) {
        console.error('❌ Success is true but no payment method data:', responseData);
        throw new Error('Respuesta del servidor incompleta: faltan datos del método de pago');
      } else {
        console.error('❌ Request failed:', {
          success: isSuccess,
          hasData: !!paymentMethodData,
          fullResponse: responseData
        });
        throw new Error(errorMessage);
      }

    } catch (error: any) {
      console.log('=== ERROR DEBUG FRONTEND ===')
      console.error('❌ Error completo:', error)

      if (error.response) {
        console.error('❌ Response status:', error.response.status);
        console.error('❌ Response data:', error.response.data);

        const message = error.response.data?.Message ||
                       error.response.data?.message ||
                       `Error del servidor (${error.response.status})`;
        throw new Error(message);
      } else if (error.request) {
        console.error('❌ No response received:', error.request);
        throw new Error('No se pudo conectar con el servidor');
      } else {
        console.error('❌ Request setup error:', error.message);
        throw new Error(error.message || 'Error inesperado al crear método de pago');
      }
    }
  }

  // 🔍 VALIDACIONES CONDICIONALES POR TIPO DE PAGO
  private validatePaymentMethodData(data: CreatePaymentMethodRequest): void {
    if (!data.nickname?.trim()) {
      throw new Error('El nombre del método de pago es requerido');
    }

    if (!data.type?.trim()) {
      throw new Error('El tipo de método de pago es requerido');
    }

    const type = data.type.toLowerCase();

    if (type === 'paypal') {
      // Para PayPal solo necesitamos email
      if (!data.payPalEmail?.trim()) {
        throw new Error('El email de PayPal es requerido');
      }
      if (!this.isValidEmail(data.payPalEmail)) {
        throw new Error('El email de PayPal no tiene un formato válido');
      }
    } else if (['visa', 'mastercard', 'other'].includes(type)) {
      // Para tarjetas necesitamos datos de tarjeta
      if (!data.cardNumber?.trim()) {
        throw new Error('El número de tarjeta es requerido');
      }
      if (!data.expiryDate?.trim()) {
        throw new Error('La fecha de vencimiento es requerida');
      }
      if (!data.cvv?.trim()) {
        throw new Error('El CVV es requerido');
      }
      if (!data.cardholderName?.trim()) {
        throw new Error('El nombre del titular es requerido');
      }

      // Validaciones específicas de tarjeta
      if (!this.isValidCardNumber(data.cardNumber)) {
        throw new Error('El número de tarjeta no es válido');
      }
      if (!this.isValidExpiryDate(data.expiryDate)) {
        throw new Error('La fecha de vencimiento no es válida (formato MM/AA)');
      }
      if (!this.isValidCVV(data.cvv)) {
        throw new Error('El CVV debe tener 3 o 4 dígitos');
      }
    } else {
      throw new Error('Tipo de método de pago no válido');
    }
  }

  // 🔍 CONSTRUIR PAYLOAD SEGÚN TIPO DE PAGO
  private buildPayloadForType(data: CreatePaymentMethodRequest) {
    const basePayload = {
      Nickname: data.nickname.trim(),
      Type: data.type.toLowerCase(),
      IsDefault: Boolean(data.isDefault)
    };

    if (data.type.toLowerCase() === 'paypal') {
      return {
        ...basePayload,
        PayPalEmail: data.payPalEmail?.trim() || '',
        // Campos de tarjeta como string vacío para PayPal
        CardNumber: '',
        ExpiryDate: '',
        CVV: '',
        CardholderName: ''
      };
    } else {
      return {
        ...basePayload,
        CardNumber: data.cardNumber?.trim() || '',
        ExpiryDate: data.expiryDate?.trim() || '',
        CVV: data.cvv?.trim() || '',
        CardholderName: data.cardholderName?.trim() || '',
        // PayPal email como string vacío para tarjetas
        PayPalEmail: ''
      };
    }
  }

  // 🔍 VALIDACIONES HELPER
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidCardNumber(cardNumber: string): boolean {
    const cleaned = cardNumber.replace(/\s+/g, '');
    return /^\d{13,19}$/.test(cleaned);
  }

  private isValidExpiryDate(expiryDate: string): boolean {
    const match = expiryDate.match(/^(\d{2})\/(\d{2})$/);
    if (!match) return false;

    const [, month, year] = match;
    const monthNum = parseInt(month);
    const yearNum = parseInt(`20${year}`);

    if (monthNum < 1 || monthNum > 12) return false;

    const now = new Date();
    const expiry = new Date(yearNum, monthNum - 1);
    return expiry > now;
  }

  private isValidCVV(cvv: string): boolean {
    return /^\d{3,4}$/.test(cvv);
  }

  async updatePaymentMethod(id: number, data: Partial<CreatePaymentMethodRequest>): Promise<PaymentMethodInfo> {
    try {
      const payload = {
        Nickname: data.nickname || '',
        CardholderName: data.cardholderName || '',
        PayPalEmail: data.payPalEmail || '',
        IsDefault: Boolean(data.isDefault)
      }

      const response = await api.put(`${this.basePath}/${id}`, payload)

      if (response.data && response.data.Success && response.data.Data) {
        return response.data.Data
      } else {
        throw new Error(response.data?.Message || 'Error al actualizar el método de pago')
      }

    } catch (error: any) {
      console.error('❌ Error updating payment method:', error)
      throw new Error(error.response?.data?.Message || 'Error al actualizar método de pago')
    }
  }

  async setDefaultPaymentMethod(id: number): Promise<boolean> {
    try {
      const response = await api.put(`${this.basePath}/${id}/default`)
      return response.data?.Success || false
    } catch (error: any) {
      console.error('❌ Error setting default payment method:', error)
      throw new Error(error.response?.data?.Message || 'Error al establecer método predeterminado')
    }
  }

  async deletePaymentMethod(id: number): Promise<boolean> {
    try {
      const response = await api.delete(`${this.basePath}/${id}`)
      return response.data?.Success || false
    } catch (error: any) {
      console.error('❌ Error deleting payment method:', error)
      throw new Error(error.response?.data?.Message || 'Error al eliminar método de pago')
    }
  }

  async getPaymentMethodById(id: number): Promise<PaymentMethodInfo | null> {
    try {
      const response = await api.get(`${this.basePath}/${id}`)
      if (response.data && response.data.Success && response.data.Data) {
        return response.data.Data
      } else {
        return null
      }
    } catch (error: any) {
      console.error('❌ Error fetching payment method:', error)
      return null
    }
  }

  // ===== MÉTODOS DE UTILIDAD =====
  formatCardNumber(cardNumber: string): string {
    const cleaned = cardNumber.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const groups = cleaned.match(/.{1,4}/g) || []
    return groups.join(' ').slice(0, 19)
  }

  formatExpiryDate(input: string): string {
    let value = input.replace(/\D/g, '')

    if (value.length > 4) {
      value = value.substring(0, 4)
    }

    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4)
    }

    return value
  }

  getPaymentMethodDescription(paymentMethod: PaymentMethodInfo): string {
    if (paymentMethod.type?.toLowerCase() === 'paypal') {
      return paymentMethod.payPalEmail || 'Cuenta PayPal'
    }

    if (paymentMethod.lastFourDigits) {
      const cardType = this.getCardTypeName(paymentMethod.type)
      const expiry = paymentMethod.expiryMonth && paymentMethod.expiryYear
        ? ` • Vence ${paymentMethod.expiryMonth.toString().padStart(2, '0')}/${paymentMethod.expiryYear.toString().slice(-2)}`
        : ''
      return `${cardType} •••• ${paymentMethod.lastFourDigits}${expiry}`
    }

    return paymentMethod.nickname
  }

  getCardTypeName(cardType: string): string {
    const types: Record<string, string> = {
      visa: 'Visa',
      mastercard: 'Mastercard',
      amex: 'American Express',
      paypal: 'PayPal',
      other: 'Tarjeta'
    }
    return types[cardType] || 'Tarjeta'
  }
}

export const paymentService = new PaymentService()
export default paymentService
