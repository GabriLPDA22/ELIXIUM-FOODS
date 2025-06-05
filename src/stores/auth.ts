import { defineStore } from 'pinia'
import axios, { type AxiosError } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5290/api'

export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  role: string
  phoneNumber?: string
  businessId?: number
  photoURL?: string
  googleId?: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  phoneNumber: string
  role: string
}

export interface LoginData {
  email: string
  password: string
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
  businessId?: number
  photoURL?: string
  googleId?: string
}

// Configurar axios
axios.defaults.baseURL = API_BASE_URL
axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.timeout = 15000

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: localStorage.getItem('authToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    loading: false,
    error: null as string | null,
    isAuthenticated: false,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token && !!state.user,
    userRole: (state) => state.user?.role || null,
    userName: (state) => (state.user ? `${state.user.firstName} ${state.user.lastName}` : null),
    isAdmin: (state) => state.user?.role === 'Admin',
    isBusiness: (state) => state.user?.role === 'Business',
    isCustomer: (state) => state.user?.role === 'Customer',
    isDeliveryPerson: (state) => state.user?.role === 'DeliveryPerson',

    userInitials: (state) => {
      if (!state.user) return 'U'
      const firstName = state.user.firstName || 'U'
      const lastName = state.user.lastName || ''
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
    },

    userProfileImage: (state) => {
      return state.user?.photoURL || null
    },

    isGoogleUser: (state) => !!state.user?.googleId,
  },

  actions: {
    // =================== FUNCIÓN PARA GUARDAR DATOS COMPLETOS ===================
    saveAuthData(authData: AuthResponse) {
      // Guardar tokens
      this.token = authData.token!
      this.refreshToken = authData.refreshToken || null

      // Obtener usuario existente para preservar foto si es necesario
      const existingUser = this.user

      // Crear objeto usuario completo
      const newUserData = {
        id: authData.userId!,
        email: authData.email!,
        firstName: authData.firstName!,
        lastName: authData.lastName!,
        role: authData.role!,
        businessId: authData.businessId,
        photoURL: authData.photoURL,
        googleId: authData.googleId,
      }

      // NUEVA LÓGICA: Preservar foto existente si el login no incluye una nueva foto
      // Esto aplica tanto para usuarios Google como usuarios normales
      if (
        existingUser &&
        existingUser.email === newUserData.email &&
        existingUser.photoURL &&
        (!newUserData.photoURL || newUserData.photoURL === '')
      ) {
        newUserData.photoURL = existingUser.photoURL
      }

      // Crear objeto usuario completo
      this.user = newUserData

      // ✅ GUARDAR TODO EN LOCALSTORAGE
      localStorage.setItem('authToken', this.token)
      localStorage.setItem('user', JSON.stringify(this.user))

      if (this.refreshToken) {
        localStorage.setItem('refreshToken', this.refreshToken)
      }

      // Marcar como autenticado
      this.isAuthenticated = true

      // Configurar axios
      this.setupAxiosDefaults()
    },

    // =================== FUNCIÓN PARA INICIALIZAR DESDE LOCALSTORAGE ===================
    initializeFromStorage() {
      const savedToken = localStorage.getItem('authToken')
      const savedUser = localStorage.getItem('user')
      const savedRefreshToken = localStorage.getItem('refreshToken')

      if (savedToken && savedUser) {
        try {
          this.token = savedToken
          this.refreshToken = savedRefreshToken
          this.user = JSON.parse(savedUser)
          this.isAuthenticated = true
          this.setupAxiosDefaults()
        } catch (error) {
          console.error('❌ Error parseando usuario desde localStorage:', error)
          this.clearAuthData()
        }
      }
    },

    // =================== FUNCIÓN PARA LIMPIAR DATOS ===================
    clearAuthData() {
      this.user = null
      this.token = null
      this.refreshToken = null
      this.isAuthenticated = false
      this.error = null

      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      localStorage.removeItem('refreshToken')

      delete axios.defaults.headers.common['Authorization']
    },

    async register(registerData: RegisterData): Promise<boolean> {
      this.loading = true
      this.error = null

      try {
        const response = await axios.post<AuthResponse>('/auth/register', {
          email: registerData.email,
          password: registerData.password,
          firstName: registerData.firstName,
          lastName: registerData.lastName,
          phoneNumber: registerData.phoneNumber,
          role: registerData.role || 'Customer',
        })

        if (response.data.success && response.data.token) {
          this.saveAuthData(response.data)
          return true
        } else {
          this.error = response.data.message || 'Error en el registro'
          return false
        }
      } catch (error: any) {
        if (error.response?.data?.message) {
          this.error = error.response.data.message
        } else if (error.response?.status === 400) {
          this.error = 'Datos de registro inválidos'
        } else if (error.response?.status === 409) {
          this.error = 'El email ya está registrado'
        } else {
          this.error = 'Error de conexión con el servidor'
        }
        return false
      } finally {
        this.loading = false
      }
    },

    async login(loginData: LoginData): Promise<boolean> {
      this.loading = true
      this.error = null

      try {
        const response = await axios.post<AuthResponse>('/auth/login', {
          email: loginData.email,
          password: loginData.password,
        })

        if (response.data.success && response.data.token) {
          this.saveAuthData(response.data)

          // NUEVA LÓGICA: Después del login exitoso, cargar la información completa del perfil
          // para asegurar que tenemos la foto de perfil actualizada
          try {
            await this.loadCompleteUserProfile()
          } catch (profileError) {
            console.warn('⚠️ No se pudo cargar el perfil completo, pero el login fue exitoso:', profileError)
          }

          return true
        } else {
          this.error = response.data.message || 'Credenciales incorrectas'
          return false
        }
      } catch (error: any) {
        if (error.response?.data?.message) {
          this.error = error.response.data.message
        } else if (error.response?.status === 401) {
          this.error = 'Email o contraseña incorrectos'
        } else {
          this.error = 'Error de conexión con el servidor'
        }
        return false
      } finally {
        this.loading = false
      }
    },

    async loginWithGoogle(googleToken: string): Promise<boolean> {
      this.loading = true
      this.error = null

      try {
        const response = await axios.post<AuthResponse>('/auth/google-login', {
          idToken: googleToken,
        })
        if (response.data.success && response.data.token) {
          // ✅ USAR LA FUNCIÓN DE GUARDAR DATOS
          this.saveAuthData(response.data)
          return true
        } else {
          this.error = response.data.message || 'Error en login con Google'
          console.error('❌ Error en respuesta:', this.error)
          return false
        }
      } catch (error: any) {
        console.error('💥 Error en login con Google:', error)

        if (error.response?.data?.message) {
          this.error = error.response.data.message
        } else if (error.response?.status === 400) {
          this.error = 'Token de Google inválido'
        } else {
          this.error = 'Error de conexión con el servidor'
        }
        return false
      } finally {
        this.loading = false
      }
    },

    // NUEVO MÉTODO: Cargar información completa del perfil después del login
    async loadCompleteUserProfile(): Promise<void> {
      if (!this.token || !this.user) return

      try {
        const response = await axios.get('/auth/me', {
          headers: { Authorization: `Bearer ${this.token}` },
        })

        if (response.data.success && response.data.data) {
          const completeUserData = response.data.data

          // Actualizar solo los campos que pueden haber cambiado, preservando lo que ya tenemos
          if (this.user) {
            this.user = {
              ...this.user,
              ...completeUserData,
              // Preservar foto de Google si ya la tenemos y no viene una nueva
              photoURL: completeUserData.photoURL || this.user.photoURL || null
            }

            localStorage.setItem('user', JSON.stringify(this.user))
          }
        }
      } catch (error) {
        console.warn('⚠️ Error cargando perfil completo:', error)
        // No lanzar el error, el login ya fue exitoso
      }
    },

    async logout() {
      try {
        if (this.token) {
          await axios.post(
            '/auth/logout',
            {},
            {
              headers: { Authorization: `Bearer ${this.token}` },
            }
          )
        }
      } catch (error) {
        console.error('⚠️ Error en logout del servidor:', error)
      } finally {
        this.clearAuthData()
      }
    },

    async checkAuth() {
      const token = localStorage.getItem('authToken')

      if (!token) {
        console.log('❌ No hay token')
        return false
      }

      try {
        const response = await axios.get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.data.success) {
          this.user = response.data.data
          this.token = token
          this.isAuthenticated = true
          this.setupAxiosDefaults()
          return true
        }
      } catch (error) {
        console.error('❌ Error verificando auth:', error)
        this.logout()
      }

      return false
    },

    setupAxiosDefaults() {
      if (this.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
      }
    },

    clearError() {
      this.error = null
    },

    updateUserProfile(updates: Partial<User>) {
      if (this.user) {
        // PROTECCIÓN: No permitir sobrescribir foto de usuario de Google con datos vacíos
        if (this.isGoogleUser && updates.photoURL === '' && this.user.photoURL) {
          const { photoURL, ...safeUpdates } = updates // Remover photoURL para evitar sobrescritura
          this.user = { ...this.user, ...safeUpdates }
        } else {
          this.user = { ...this.user, ...updates }
        }

        localStorage.setItem('user', JSON.stringify(this.user))
      }
    },

    // Añadir este nuevo método para manejo específico de fotos
    updateProfilePhoto(photoURL: string | null) {
      if (!this.user) return

      // PROTECCIÓN: No permitir cambio de foto para usuarios de Google
      if (this.isGoogleUser) {
        console.warn('⚠️ Intento de cambiar foto de usuario de Google bloqueado')
        return
      }

      this.user.photoURL = photoURL || ''
      localStorage.setItem('user', JSON.stringify(this.user))
    },

    // Añadir este método para sincronizar fotos de Google
    syncGooglePhoto(googlePhotoURL: string) {
      if (!this.user || !this.isGoogleUser) return
      this.user.photoURL = googlePhotoURL
      localStorage.setItem('user', JSON.stringify(this.user))
    },

    // =================== INICIALIZAR (llamar desde main.ts) ===================
    initializeAuth() {
      this.initializeFromStorage()
    },
  },
})
