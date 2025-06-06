// src/services/authDebugger.ts
import { api } from './api'

export const authDebugger = {
  /**
   * Prueba un login directo y devuelve el resultado completo
   */
  async testLogin(email: string, password: string) {
    try {
      const response = await api.post('/api/Auth/login', { email, password })
      // Si hay token, verificar que sea un JWT válido
      if (response.data?.token) {
        const isValidJwt = response.data.token.split('.').length === 3
        // Solo configurar si es un JWT válido
        if (isValidJwt) {
          localStorage.setItem('token', response.data.token)
          api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
        } else {
          console.warn('⚠️ El token recibido no tiene formato JWT válido')
        }

        // Guardar refreshToken por separado
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken)
        }
      }

      return {
        success: !!response.data?.token,
        data: response.data,
        headers: response.headers,
        tokenValid: response.data?.token ? response.data.token.split('.').length === 3 : false,
      }
    } catch (error: any) {
      console.error('Error en test login:', error)
      return {
        success: false,
        status: error.response?.status,
        error: error.response?.data || error.message,
      }
    }
  },

  /**
   * Prueba un endpoint protegido para verificar la autenticación
   */
  async testProtectedEndpoint() {
    const token = localStorage.getItem('token')

    try {
      const isValidJwt = token ? token.split('.').length === 3 : false
      console.log(
        `Probando endpoint protegido con token: ${token ? token.substring(0, 20) + '...' : 'No (ausente)'}`
      )
      const response = await api.get('/api/Users/me', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      })

      return {
        success: true,
        status: response.status,
        data: response.data,
      }
    } catch (error: any) {
      console.error('Error en test endpoint:', error)
      return {
        success: false,
        status: error.response?.status,
        error: error.response?.data || error.message,
      }
    }
  },

  /**
   * Decodifica y analiza el token JWT actual
   */
  getTokenInfo() {
    const token = localStorage.getItem('token')

    if (!token) {
      return null
    }

    try {
      const parts = token.split('.')
      if (parts.length !== 3) {
        return { error: 'Formato de token inválido, no es un JWT válido' }
      }

      const header = JSON.parse(atob(parts[0]))
      const payload = JSON.parse(atob(parts[1]))

      // Verificar expiración
      const now = Math.floor(Date.now() / 1000)
      const isExpired = payload.exp && payload.exp < now

      return {
        header,
        payload,
        isExpired,
        expiresIn: payload.exp ? new Date(payload.exp * 1000).toLocaleString() : 'No definido',
        raw: token,
      }
    } catch (error) {
      return { error: 'Error al decodificar token', details: error }
    }
  },

  /**
   * Verifica el estado actual de la autenticación
   */
  checkAuthState() {
    const token = localStorage.getItem('token')
    const refreshToken = localStorage.getItem('refreshToken')
    const user = localStorage.getItem('user')
    const authHeader = api.defaults.headers?.common?.['Authorization']

    return {
      hasToken: !!token,
      hasRefreshToken: !!refreshToken,
      hasUser: !!user,
      hasAuthHeader: !!authHeader,
      tokenInfo: this.getTokenInfo(),
      user: user ? JSON.parse(user) : null,
      tokenIsJwt: token ? token.split('.').length === 3 : false,
    }
  },

  /**
   * Limpia todos los datos de autenticación
   */
  clearAuth() {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')

    if (api.defaults.headers?.common) {
      delete api.defaults.headers.common['Authorization']
    }

    return { success: true, message: 'Datos de autenticación eliminados' }
  },

  /**
   * Intenta refrescar el token usando el refreshToken
   */
  async testRefreshToken() {
    const refreshToken = localStorage.getItem('refreshToken')

    if (!refreshToken) {
      return { success: false, message: 'No hay refreshToken almacenado' }
    }

    try {
      const response = await api.post('/api/Auth/refresh-token', { refreshToken })

      if (response.data?.success && response.data?.token) {
        // Actualizar token en localStorage
        localStorage.setItem('token', response.data.token)

        // Actualizar refreshToken si se devolvió uno nuevo
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken)
        }

        // Actualizar header de autorización
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`

        return {
          success: true,
          newToken: response.data.token.substring(0, 20) + '...',
          isJwt: response.data.token.split('.').length === 3,
          data: response.data,
        }
      }

      return {
        success: false,
        message: 'Error al refrescar token',
        data: response.data,
      }
    } catch (error: any) {
      return {
        success: false,
        message: 'Error en la solicitud de refresco',
        error: error.response?.data || error.message,
      }
    }
  },
}

export default authDebugger
