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
    userName: (state) => state.user ? `${state.user.firstName} ${state.user.lastName}` : null,
    isAdmin: (state) => state.user?.role === 'Admin',
    isBusiness: (state) => state.user?.role === 'Business',
    isCustomer: (state) => state.user?.role === 'Customer',
    isDeliveryPerson: (state) => state.user?.role === 'DeliveryPerson',
  },

  actions: {
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
          role: registerData.role || 'Customer'
        })

        if (response.data.success && response.data.token) {
          this.token = response.data.token
          this.refreshToken = response.data.refreshToken || null

          localStorage.setItem('authToken', this.token)
          if (this.refreshToken) {
            localStorage.setItem('refreshToken', this.refreshToken)
          }

          this.user = {
            id: response.data.userId!,
            email: response.data.email!,
            firstName: response.data.firstName!,
            lastName: response.data.lastName!,
            role: response.data.role!,
            phoneNumber: registerData.phoneNumber,
            businessId: response.data.businessId,
          }

          this.isAuthenticated = true
          this.setupAxiosDefaults()
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
          this.token = response.data.token
          this.refreshToken = response.data.refreshToken || null

          localStorage.setItem('authToken', this.token)
          if (this.refreshToken) {
            localStorage.setItem('refreshToken', this.refreshToken)
          }

          this.user = {
            id: response.data.userId!,
            email: response.data.email!,
            firstName: response.data.firstName!,
            lastName: response.data.lastName!,
            role: response.data.role!,
            businessId: response.data.businessId,
          }

          this.isAuthenticated = true
          this.setupAxiosDefaults()
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

    async logout() {
      try {
        if (this.token) {
          await axios.post('/auth/logout', {}, {
            headers: { Authorization: `Bearer ${this.token}` },
          })
        }
      } catch (error) {
        // Ignorar errores del logout en servidor
      } finally {
        this.user = null
        this.token = null
        this.refreshToken = null
        this.isAuthenticated = false
        this.error = null

        localStorage.removeItem('authToken')
        localStorage.removeItem('refreshToken')

        delete axios.defaults.headers.common['Authorization']
      }
    },

    async checkAuth() {
      const token = localStorage.getItem('authToken')

      if (!token) {
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
        this.logout()
      }

      return false
    },

    async refreshAuthToken(): Promise<boolean> {
      if (!this.refreshToken) {
        return false
      }

      try {
        const response = await axios.post<AuthResponse>('/auth/refresh-token', {
          refreshToken: this.refreshToken,
        })

        if (response.data.success && response.data.token) {
          this.token = response.data.token
          localStorage.setItem('authToken', this.token)
          this.setupAxiosDefaults()
          return true
        }
      } catch (error) {
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
  },
})
