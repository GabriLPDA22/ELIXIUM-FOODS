// src/stores/auth.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/services/api'

// Interfaces
export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  role: string
  phoneNumber?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  phoneNumber: string
  role?: string
}

export interface AuthResponse {
  success: boolean
  message: string
  token?: string
  refreshToken?: string
  userId?: number
  email?: string
  firstName?: string
  lastName?: string
  role?: string
}

export const useAuthStore = defineStore('auth', () => {
  // Estado
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = () => !!token.value
  const isAdmin = () => user.value?.role === 'Admin'
  const isRestaurant = () => user.value?.role === 'Restaurant'
  const isDeliveryPerson = () => user.value?.role === 'DeliveryPerson'
  const isCustomer = () => user.value?.role === 'Customer'

  // Acciones
  const initialize = () => {
    // Cargar token y usuario desde localStorage al iniciar
    const savedToken = localStorage.getItem('token')
    const savedRefreshToken = localStorage.getItem('refreshToken')
    const savedUser = localStorage.getItem('user')

    if (savedToken) {
      token.value = savedToken

      // Verificar que el token tenga formato JWT válido
      const isValidJwtFormat = savedToken.split('.').length === 3

      if (!isValidJwtFormat) {
        console.warn('⚠️ El token almacenado no tiene formato JWT válido.')
      }

      // Configurar token en las cabeceras por defecto
      if (api.defaults.headers) {
        api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`
      }
    }

    if (savedRefreshToken) {
      refreshToken.value = savedRefreshToken
    }

    if (savedUser) {
      try {
        user.value = JSON.parse(savedUser)
      } catch (err) {
        console.error('Error parsing user from localStorage:', err)
        user.value = null
      }
    }
  }

  const login = async (credentials: LoginRequest): Promise<boolean> => {
    loading.value = true
    error.value = null

    try {
      const response = await api.post<AuthResponse>('/api/Auth/login', credentials)
      const data = response.data

      if (data.success && data.token) {
        // Verificar que el token tenga formato JWT válido
        const isValidJwtFormat = data.token.split('.').length === 3

        if (!isValidJwtFormat) {
          console.warn('⚠️ El servidor devolvió un token que no tiene formato JWT válido.')
        }

        // Guardar token JWT
        token.value = data.token
        localStorage.setItem('token', data.token)

        // Configurar token en las cabeceras por defecto
        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`

        // Guardar refresh token por separado
        if (data.refreshToken) {
          refreshToken.value = data.refreshToken
          localStorage.setItem('refreshToken', data.refreshToken)
        }

        // Guardar información del usuario
        user.value = {
          id: data.userId!,
          email: data.email!,
          firstName: data.firstName!,
          lastName: data.lastName!,
          role: data.role!,
        }
        localStorage.setItem('user', JSON.stringify(user.value))

        console.log('Login exitoso')
        console.log(`JWT guardado: ${data.token.substring(0, 20)}...`)
        if (data.refreshToken) {
          console.log(`RefreshToken guardado: ${data.refreshToken.substring(0, 20)}...`)
        }

        return true
      } else {
        error.value = data.message || 'Error en la autenticación'
        return false
      }
    } catch (err: any) {
      console.error('Login error:', err)
      error.value = err.response?.data?.message || 'Error en la conexión con el servidor'
      return false
    } finally {
      loading.value = false
    }
  }

  const register = async (userData: RegisterRequest): Promise<boolean> => {
    loading.value = true
    error.value = null

    try {
      const response = await api.post<AuthResponse>('/api/Auth/register', userData)
      const data = response.data

      if (data.success && data.token) {
        // Verificar que el token tenga formato JWT válido
        const isValidJwtFormat = data.token.split('.').length === 3

        if (!isValidJwtFormat) {
          console.warn('⚠️ El servidor devolvió un token que no tiene formato JWT válido.')
        }

        // Guardar token JWT
        token.value = data.token
        localStorage.setItem('token', data.token)

        // Configurar token en las cabeceras por defecto
        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`

        // Guardar refresh token por separado
        if (data.refreshToken) {
          refreshToken.value = data.refreshToken
          localStorage.setItem('refreshToken', data.refreshToken)
        }

        // Guardar información del usuario
        user.value = {
          id: data.userId!,
          email: data.email!,
          firstName: data.firstName!,
          lastName: data.lastName!,
          role: data.role!,
        }
        localStorage.setItem('user', JSON.stringify(user.value))

        console.log('Registro exitoso')
        console.log(`JWT guardado: ${data.token.substring(0, 20)}...`)
        if (data.refreshToken) {
          console.log(`RefreshToken guardado: ${data.refreshToken.substring(0, 20)}...`)
        }

        return true
      } else {
        error.value = data.message || 'Error en el registro'
        return false
      }
    } catch (err: any) {
      console.error('Register error:', err)
      error.value = err.response?.data?.message || 'Error en la conexión con el servidor'
      return false
    } finally {
      loading.value = false
    }
  }

  const refreshAccessToken = async (): Promise<boolean> => {
    if (!refreshToken.value) {
      console.warn('No hay refresh token disponible')
      return false
    }

    try {
      const response = await api.post<AuthResponse>('/api/Auth/refresh-token', {
        refreshToken: refreshToken.value
      })

      if (response.data.success && response.data.token) {
        // Actualizar tokens
        token.value = response.data.token
        localStorage.setItem('token', response.data.token)

        if (response.data.refreshToken) {
          refreshToken.value = response.data.refreshToken
          localStorage.setItem('refreshToken', response.data.refreshToken)
        }

        // Actualizar header de autorización
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`

        console.log('Token refrescado exitosamente')
        return true
      }

      return false
    } catch (err) {
      console.error('Error al refrescar token:', err)
      // Si hay error al refrescar, limpiar la sesión
      logout()
      return false
    }
  }

  const logout = () => {
    // Limpiar datos de autenticación
    user.value = null
    token.value = null
    refreshToken.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')

    // Eliminar token de las cabeceras
    if (api.defaults.headers) {
      delete api.defaults.headers.common['Authorization']
    }
  }

  const checkAuth = async (): Promise<boolean> => {
    // Si no hay token, no estamos autenticados
    if (!token.value) return false

    try {
      // Verificar si el token sigue siendo válido haciendo una petición al endpoint de usuario actual
      const response = await api.get('/api/Users/me')
      if (response.status === 200) {
        // Actualizar información del usuario si es necesario
        user.value = response.data
        localStorage.setItem('user', JSON.stringify(user.value))
        return true
      } else {
        // Si hay un error pero tenemos refresh token, intentar refrescar
        if (refreshToken.value) {
          return await refreshAccessToken()
        }

        // Si no hay refresh token o falló el refresco, hacer logout
        logout()
        return false
      }
    } catch (err) {
      console.error('Auth check error:', err)

      // Si hay un error pero tenemos refresh token, intentar refrescar
      if (refreshToken.value) {
        return await refreshAccessToken()
      }

      logout()
      return false
    }
  }

  // Inicializar al crear el store
  initialize()

  return {
    // Estado
    user,
    token,
    refreshToken,
    loading,
    error,

    // Getters
    isAuthenticated,
    isAdmin,
    isRestaurant,
    isDeliveryPerson,
    isCustomer,

    // Acciones
    login,
    register,
    logout,
    checkAuth,
    refreshAccessToken
  }
})
