// src/services/authService.ts
import { api } from './api'
import { useAuthStore } from '@/stores/auth'

export const authService = {
  // Verificar si el token actual es válido
  async verifyToken(): Promise<boolean> {
    try {
      const token = localStorage.getItem('token')
      if (!token) return false

      // Verificar formato JWT
      const isValidFormat = token.split('.').length === 3
      if (!isValidFormat) {
        console.warn("⚠️ El token almacenado no tiene formato JWT válido")
        return false
      }
      // Hacer una solicitud a un endpoint protegido
      const response = await api.get('/api/Users/me')
      return response.status === 200
    } catch (error) {
      console.error('Error al verificar el token:', error)
      return false
    }
  },

  // Obtener un token JWT fresco usando el refreshToken
  async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) return false
      const response = await api.post('/api/Auth/refresh-token', { refreshToken })

      if (response.data?.success && response.data?.token) {
        // Actualizar token en localStorage y headers
        localStorage.setItem('token', response.data.token)
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`

        // Si hay un nuevo refreshToken, actualizarlo también
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken)
        }
        console.log('Token refrescado exitosamente')
        return true
      }
      return false
    } catch (error) {
      console.error('Error al refrescar el token:', error)
      return false
    }
  },

  // Solicitar restablecimiento de contraseña
  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post('/api/Auth/forgot-password', {
        email: email.trim()
      })

      if (response.data?.success) {
        return {
          success: true,
          message: response.data.message || 'Se han enviado las instrucciones a tu correo electrónico.'
        }
      } else {
        return {
          success: false,
          message: response.data?.message || 'Error al procesar la solicitud.'
        }
      }
    } catch (error: any) {
      console.error('Error en forgot password:', error)

      // Manejar diferentes tipos de errores
      if (error.response?.status === 404) {
        return {
          success: false,
          message: 'No se encontró una cuenta con este correo electrónico.'
        }
      } else if (error.response?.status === 429) {
        return {
          success: false,
          message: 'Demasiadas solicitudes. Intenta nuevamente en unos minutos.'
        }
      } else {
        return {
          success: false,
          message: error.response?.data?.message || 'Error de conexión. Verifica tu conexión a internet.'
        }
      }
    }
  },

  // Restablecer contraseña con token - CORREGIDO con email
  async resetPassword(token: string, email: string, newPassword: string, confirmPassword?: string): Promise<{ success: boolean; message: string }> {
    try {
      // Validación básica del frontend
      if (!token || !email || !newPassword) {
        return {
          success: false,
          message: 'Todos los campos son requeridos.'
        }
      }

      if (newPassword.length < 6) {
        return {
          success: false,
          message: 'La contraseña debe tener al menos 6 caracteres.'
        }
      }

      if (confirmPassword && newPassword !== confirmPassword) {
        return {
          success: false,
          message: 'Las contraseñas no coinciden.'
        }
      }

      const response = await api.post('/api/Auth/reset-password', {
        token: token,
        email: email,        // ← CAMPO AGREGADO
        newPassword: newPassword
      })

      if (response.data?.success) {
        return {
          success: true,
          message: response.data.message || 'Contraseña restablecida exitosamente. Ya puedes iniciar sesión.'
        }
      } else {
        return {
          success: false,
          message: response.data?.message || 'Error al restablecer la contraseña.'
        }
      }
    } catch (error: any) {
      console.error('Error en reset password:', error)

      if (error.response?.status === 400) {
        return {
          success: false,
          message: error.response?.data?.message || 'Token inválido o expirado.'
        }
      } else if (error.response?.status === 404) {
        return {
          success: false,
          message: 'No se encontró una cuenta asociada a este enlace.'
        }
      } else {
        return {
          success: false,
          message: error.response?.data?.message || 'Error al restablecer la contraseña.'
        }
      }
    }
  },

  // Extraer email de la URL de reset
  extractEmailFromResetUrl(url?: string): string | null {
    try {
      const urlToCheck = url || window.location.href
      const urlObj = new URL(urlToCheck)
      const email = urlObj.searchParams.get('email')
      return email
    } catch (error) {
      console.error('Error extrayendo email de URL:', error)
      return null
    }
  },

  // Extraer token de la URL de reset
  extractTokenFromResetUrl(url?: string): string | null {
    try {
      const urlToCheck = url || window.location.href
      const urlObj = new URL(urlToCheck)
      const token = urlObj.searchParams.get('token')
      return token
    } catch (error) {
      console.error('Error extrayendo token de URL:', error)
      return null
    }
  },

  // Extraer ambos parámetros de la URL actual
  extractResetParamsFromCurrentUrl(): { token: string | null; email: string | null } {
    return {
      token: this.extractTokenFromResetUrl(),
      email: this.extractEmailFromResetUrl()
    }
  },

  // Validar que los parámetros de reset sean válidos
  validateResetParams(token: string | null, email: string | null): { isValid: boolean; message: string } {
    if (!token) {
      return {
        isValid: false,
        message: 'Token de restablecimiento no encontrado en la URL.'
      }
    }

    if (!email) {
      return {
        isValid: false,
        message: 'Email no encontrado en la URL de restablecimiento.'
      }
    }

    // Validar formato de email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return {
        isValid: false,
        message: 'El email en la URL no tiene un formato válido.'
      }
    }

    // Validar que el token tenga una longitud mínima
    if (token.length < 20) {
      return {
        isValid: false,
        message: 'El token de restablecimiento parece ser inválido.'
      }
    }

    return {
      isValid: true,
      message: 'Parámetros válidos.'
    }
  },

  // Depurar headers actuales de axios
  debugHeaders(): void {
    const token = localStorage.getItem('token')
    if (token) {
    }
  },

  // Obtener cabecera de autorización para solicitudes
  getAuthHeader(): string | null {
    const token = localStorage.getItem('token')
    return token ? `Bearer ${token}` : null
  },

  // Limpiar datos de autenticación
  clearAuthData(): void {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    delete api.defaults.headers.common['Authorization']
  },

  // Verificar si hay datos de autenticación
  hasAuthData(): boolean {
    const token = localStorage.getItem('token')
    const refreshToken = localStorage.getItem('refreshToken')
    return !!(token && refreshToken)
  }
}

export default authService
