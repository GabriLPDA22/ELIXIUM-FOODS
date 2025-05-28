// src/stores/auth.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/services/api'
import authService from '@/services/authService'

export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  role: string
  businessId?: number
  photoURL?: string
  googleId?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface GoogleLoginResponse {
  success: boolean
  message: string
  token: string
  refreshToken: string
  userId: number
  email: string
  firstName: string
  lastName: string
  role: string
  businessId?: number
  photoURL?: string
  googleId?: string
}

export const useAuthStore = defineStore('auth', () => {
  // Estado
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const isAuthenticated = computed(() => !!token.value && !!user.value)

  // NUEVO: Computed para verificar si es admin
  const isAdmin = computed(() => {
    return user.value?.role === 'Admin'
  })

  // Computed para la foto de perfil
  const userProfileImage = computed(() => {
    if (user.value?.photoURL) {
      return user.value.photoURL
    }
    return null
  })

  // Computed para las iniciales del usuario
  const userInitials = computed(() => {
    if (!user.value) return 'U'

    const firstName = user.value.firstName || 'U'
    const lastName = user.value.lastName || ''

    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  })

  // Computed para verificar si es usuario de Google
  const isGoogleUser = computed(() => !!user.value?.googleId)

  // Inicializar estado desde localStorage
  const initializeAuth = () => {
    const savedToken = localStorage.getItem('token')
    const savedRefreshToken = localStorage.getItem('refreshToken')
    const savedUser = localStorage.getItem('user')

    if (savedToken && savedUser) {
      token.value = savedToken
      refreshToken.value = savedRefreshToken
      user.value = JSON.parse(savedUser)

      // Configurar header de autorización
      api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`
    }
  }

  // Guardar datos de autenticación
  const saveAuthData = (authData: {
    token: string
    refreshToken: string
    user: User
  }) => {
    token.value = authData.token
    refreshToken.value = authData.refreshToken
    user.value = authData.user

    // Guardar en localStorage
    localStorage.setItem('token', authData.token)
    localStorage.setItem('refreshToken', authData.refreshToken)
    localStorage.setItem('user', JSON.stringify(authData.user))

    // Configurar header de autorización
    api.defaults.headers.common['Authorization'] = `Bearer ${authData.token}`
  }

  // Login normal
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      loading.value = true
      error.value = null

      const response = await api.post('/api/Auth/login', credentials)

      if (response.data?.success) {
        const userData: User = {
          id: response.data.userId,
          email: response.data.email,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          role: response.data.role,
          businessId: response.data.businessId,
          photoURL: response.data.photoURL,
          googleId: response.data.googleId
        }

        saveAuthData({
          token: response.data.token,
          refreshToken: response.data.refreshToken,
          user: userData
        })

        console.log('Login exitoso:', userData)
        return true
      } else {
        error.value = response.data?.message || 'Error de autenticación'
        return false
      }
    } catch (err: any) {
      console.error('Error en login:', err)
      error.value = err.response?.data?.message || 'Error de conexión'
      return false
    } finally {
      loading.value = false
    }
  }

  // Login con Google
  const loginWithGoogle = async (googleToken: string): Promise<boolean> => {
    try {
      loading.value = true
      error.value = null

      console.log('Enviando token de Google al backend:', googleToken.substring(0, 50) + '...')

      const response = await api.post('/api/Auth/google-login', {
        idToken: googleToken
      })

      if (response.data?.success) {
        const userData: User = {
          id: response.data.userId,
          email: response.data.email,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          role: response.data.role,
          businessId: response.data.businessId,
          photoURL: response.data.photoURL,
          googleId: response.data.googleId
        }

        saveAuthData({
          token: response.data.token,
          refreshToken: response.data.refreshToken,
          user: userData
        })

        console.log('Login con Google exitoso:', userData)
        return true
      } else {
        error.value = response.data?.message || 'Error de autenticación con Google'
        return false
      }
    } catch (err: any) {
      console.error('Error en login con Google:', err)
      error.value = err.response?.data?.message || 'Error de conexión con Google'
      return false
    } finally {
      loading.value = false
    }
  }

  // Verificar autenticación
  const checkAuth = async (): Promise<boolean> => {
    try {
      if (!token.value) return false

      // Verificar token actual
      const isValid = await authService.verifyToken()

      if (isValid) {
        return true
      }

      // Si el token no es válido, intentar refrescar
      const refreshed = await authService.refreshToken()

      if (refreshed) {
        // Actualizar el token en el store
        const newToken = localStorage.getItem('token')
        if (newToken) {
          token.value = newToken
        }
        return true
      }

      // Si no se puede refrescar, cerrar sesión
      await logout()
      return false
    } catch (error) {
      console.error('Error verificando autenticación:', error)
      await logout()
      return false
    }
  }

  // Logout
  const logout = async () => {
    try {
      // Intentar revocar el token en el servidor
      if (refreshToken.value) {
        await api.post('/api/Auth/revoke-token', {
          refreshToken: refreshToken.value
        })
      }
    } catch (error) {
      console.error('Error revocando token:', error)
    } finally {
      // Limpiar estado local
      user.value = null
      token.value = null
      refreshToken.value = null
      error.value = null

      // Limpiar localStorage
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')

      // Limpiar header de autorización
      delete api.defaults.headers.common['Authorization']
    }
  }

  // Refrescar token
  const refreshAuthToken = async (): Promise<boolean> => {
    return await authService.refreshToken()
  }

  // Inicializar al crear el store
  initializeAuth()

  return {
    // Estado
    user,
    token,
    refreshToken,
    loading,
    error,

    // Computed
    isAuthenticated,
    isAdmin, // NUEVO: computed para verificar si es admin
    userProfileImage,
    userInitials,
    isGoogleUser,

    // Acciones
    login,
    loginWithGoogle,
    logout,
    checkAuth,
    refreshAuthToken,
    initializeAuth
  }
})
