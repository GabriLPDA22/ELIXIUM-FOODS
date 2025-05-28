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

      console.log('Verificando token JWT:', token.substring(0, 20) + '...')

      // Hacer una solicitud a un endpoint protegido
      const response = await api.get('/api/Users/me')
      console.log('Respuesta de verificación de token:', response.data)

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

      console.log('Intentando refrescar token usando refreshToken')

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

  // Depurar headers actuales de axios
  debugHeaders(): void {
    console.log('Headers de API configurados:', api.defaults.headers)
    console.log('Token en localStorage:', localStorage.getItem('token'))

    const token = localStorage.getItem('token')
    if (token) {
      console.log('¿El token tiene formato JWT?', token.split('.').length === 3)
    }

    console.log('RefreshToken en localStorage:', localStorage.getItem('refreshToken'))
  },

  // Obtener cabecera de autorización para solicitudes
  getAuthHeader(): string | null {
    const token = localStorage.getItem('token')
    return token ? `Bearer ${token}` : null
  },
}

export default authService
