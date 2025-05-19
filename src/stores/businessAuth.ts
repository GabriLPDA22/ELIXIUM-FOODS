// src/stores/businessAuth.ts (versión de prueba)
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Business } from '@/types/business'

export const useBusinessAuthStore = defineStore('businessAuth', () => {
  // Estado
  const business = ref<Business | null>(null)
  const token = ref<string | null>(localStorage.getItem('business_token') || sessionStorage.getItem('business_token'))
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value)
  const businessId = computed(() => business.value?.id || null)
  const businessName = computed(() => business.value?.name || '')
  const businessRole = computed(() => business.value?.role || 'restaurant')

  // Acciones
  async function login(email: string, password: string, remember: boolean = false) {
    loading.value = true
    error.value = null

    try {
      // MODO DE PRUEBA: Simular la respuesta del backend
      // En un entorno de producción, esto sería una llamada real a la API

      // Añadir un pequeño retraso para simular la petición a la red
      await new Promise(resolve => setTimeout(resolve, 800))

      // Credenciales de prueba
      const validCredentials = [
        { email: 'test@restaurante.com', password: 'Test1234!' },
        { email: 'demo@restaurante.com', password: 'Demo1234!' }
      ]

      // Comprobar si las credenciales son válidas
      const isValid = validCredentials.some(
        cred => cred.email === email && cred.password === password
      )

      if (!isValid) {
        throw new Error('Credenciales incorrectas')
      }

      // Simular la respuesta exitosa con un token y datos del negocio
      const mockResponse = {
        token: 'mock-token-12345-abcde',
        business: {
          id: 1,
          name: email.split('@')[0] === 'test' ? 'Restaurante Test' : 'Restaurante Demo',
          email: email,
          phone: '+34 612 345 678',
          address: 'Calle Ejemplo, 123',
          city: 'Madrid',
          postalCode: '28001',
          description: 'Restaurante de prueba para desarrollo',
          logoUrl: null,
          coverImageUrl: null,
          role: 'restaurant',
          status: 'active',
          categories: [1, 2],
          averageRating: 4.5,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }

      // Almacenar datos de autenticación
      token.value = mockResponse.token
      business.value = mockResponse.business as Business

      // Guardar token en localStorage si remember es true
      if (remember) {
        localStorage.setItem('business_token', token.value)
      } else {
        sessionStorage.setItem('business_token', token.value)
      }

      return true
    } catch (err: any) {
      console.error('Error de login:', err)
      error.value = err.message || 'Error de autenticación'
      throw new Error(error.value)
    } finally {
      loading.value = false
    }
  }

  async function register(businessData: Partial<Business>, password: string) {
    loading.value = true
    error.value = null

    try {
      // Simular el registro en modo prueba
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Generar ID aleatorio para el nuevo negocio
      const newId = Math.floor(Math.random() * 1000) + 10

      // Crear respuesta mock
      const mockResponse = {
        token: `mock-token-${newId}-${Date.now()}`,
        business: {
          id: newId,
          name: businessData.name || 'Nuevo Restaurante',
          email: businessData.email || 'nuevo@restaurante.com',
          phone: businessData.phone || '',
          address: businessData.address || '',
          city: businessData.city || '',
          postalCode: businessData.postalCode || '',
          description: businessData.description || '',
          logoUrl: businessData.logoUrl || null,
          coverImageUrl: businessData.coverImageUrl || null,
          role: 'restaurant',
          status: 'active',
          categories: businessData.categories || [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }

      // Almacenar datos de autenticación
      token.value = mockResponse.token
      business.value = mockResponse.business as Business

      localStorage.setItem('business_token', token.value)

      return true
    } catch (err: any) {
      console.error('Error de registro:', err)
      error.value = err.message || 'Error en el registro'
      throw new Error(error.value)
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    // Simular petición al backend
    await new Promise(resolve => setTimeout(resolve, 300))

    // Limpiar estado
    business.value = null
    token.value = null
    localStorage.removeItem('business_token')
    sessionStorage.removeItem('business_token')
  }

  async function checkAuth() {
    // Si no hay token, no hay nada que verificar
    if (!token.value) return false

    loading.value = true

    try {
      // Simulación de verificación de token
      await new Promise(resolve => setTimeout(resolve, 500))

      // Verificar si el token tiene el formato correcto (en este caso, cualquier token que comience con mock-)
      if (!token.value.startsWith('mock-token-')) {
        throw new Error('Token inválido')
      }

      // Si no existiera un business value previo, crear uno de prueba
      if (!business.value) {
        business.value = {
          id: 1,
          name: 'Restaurante Recuperado',
          email: 'recuperado@restaurante.com',
          phone: '+34 612 345 678',
          address: 'Calle Recuperada, 123',
          city: 'Madrid',
          postalCode: '28001',
          description: 'Restaurante recuperado por token',
          logoUrl: null,
          coverImageUrl: null,
          role: 'restaurant',
          status: 'active',
          categories: [1, 2, 3],
          averageRating: 4.2,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }

      return true
    } catch (err) {
      // Si el token es inválido, limpiar estado
      business.value = null
      token.value = null
      localStorage.removeItem('business_token')
      sessionStorage.removeItem('business_token')
      return false
    } finally {
      loading.value = false
    }
  }

  async function updateBusinessProfile(updatedData: Partial<Business>) {
    if (!token.value || !business.value) {
      throw new Error('No hay sesión activa')
    }

    loading.value = true

    try {
      // Simular actualización
      await new Promise(resolve => setTimeout(resolve, 800))

      // Actualizar datos locales
      business.value = {
        ...business.value,
        ...updatedData,
        updatedAt: new Date().toISOString()
      }

      return business.value
    } catch (err: any) {
      error.value = err.message || 'Error al actualizar perfil'
      throw new Error(error.value)
    } finally {
      loading.value = false
    }
  }

  // Inicializar - verificar autenticación al cargar
  function init() {
    // Si hay un token guardado, verificar su validez
    if (token.value) {
      checkAuth()
    }
  }

  return {
    // Estado
    business,
    token,
    loading,
    error,

    // Getters
    isAuthenticated,
    businessId,
    businessName,
    businessRole,

    // Acciones
    login,
    register,
    logout,
    checkAuth,
    updateBusinessProfile,
    init
  }
})
