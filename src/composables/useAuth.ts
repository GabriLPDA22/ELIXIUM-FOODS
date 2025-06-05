// src/composables/useAuth.ts
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()

  // =================== GETTERS REACTIVOS ===================
  const user = computed(() => authStore.user)
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const isLoggedIn = computed(() => authStore.isLoggedIn)
  const loading = computed(() => authStore.loading)
  const error = computed(() => authStore.error)

  // Información del usuario
  const userName = computed(() => authStore.userName)
  const userInitials = computed(() => authStore.userInitials)
  const userProfileImage = computed(() => authStore.userProfileImage)
  const userRole = computed(() => authStore.userRole)

  // Verificaciones de rol
  const isAdmin = computed(() => authStore.isAdmin)
  const isBusiness = computed(() => authStore.isBusiness)
  const isCustomer = computed(() => authStore.isCustomer)
  const isDeliveryPerson = computed(() => authStore.isDeliveryPerson)
  const isGoogleUser = computed(() => authStore.isGoogleUser)



  const forceRefreshAuth = () => {
    authStore.initializeAuth()
  }

  // =================== FUNCIONES DE NAVEGACIÓN SEGURA ===================
  const requireAuth = async (): Promise<boolean> => {
    if (!isAuthenticated.value) {
      console.log('❌ Usuario no autenticado, redirigiendo a login')
      await router.push('/login')
      return false
    }
    return true
  }

  const requireAdmin = async (): Promise<boolean> => {
    if (!isAuthenticated.value) {
      console.log('❌ Usuario no autenticado para admin')
      await router.push('/login')
      return false
    }

    if (!isAdmin.value) {
      console.log('❌ Usuario no es admin:', {
        user: authStore.user,
        role: authStore.userRole,
        isAdmin: authStore.isAdmin,
      })

      await router.push({
        path: '/',
        query: {
          error: 'access_denied',
          message: 'Necesitas permisos de administrador',
        },
      })
      return false
    }
    return true
  }

  const requireBusiness = async (): Promise<boolean> => {
    if (!isAuthenticated.value) {
      await router.push('/login')
      return false
    }

    if (!isBusiness.value && !isAdmin.value) {
      await router.push({
        path: '/',
        query: {
          error: 'access_denied',
          message: 'Necesitas permisos de negocio',
        },
      })
      return false
    }

    return true
  }

  const redirectIfAuthenticated = async (redirectTo: string = '/'): Promise<boolean> => {
    if (isAuthenticated.value) {
      await router.push(redirectTo)
      return true
    }
    return false
  }

  // =================== FUNCIONES DE AUTENTICACIÓN ===================
  const login = async (credentials: { email: string; password: string }): Promise<boolean> => {
    const success = await authStore.login(credentials)
    if (success) {
    } else {
      console.log('❌ Login fallido:', authStore.error)
    }

    return success
  }

  const loginWithGoogle = async (googleToken: string): Promise<boolean> => {
    const success = await authStore.loginWithGoogle(googleToken)
    if (success) {
    } else {
      console.log('❌ Login con Google fallido:', authStore.error)
    }

    return success
  }

  const register = async (data: any): Promise<boolean> => {
    const success = await authStore.register(data)
    if (success) {
    } else {
      console.log('❌ Registro fallido:', authStore.error)
    }

    return success
  }
  const logout = async (): Promise<void> => {
    await authStore.logout()
    await router.push('/login')
  }

  const checkAuth = async (): Promise<boolean> => {
    const isValid = await authStore.checkAuth()
    if (isValid) {
    } else {
      console.log('❌ Autenticación inválida')
    }
    return isValid
  }

  // =================== FUNCIONES UTILITARIAS ===================
  const clearError = (): void => {
    authStore.clearError()
  }

  const hasRole = (role: string): boolean => {
    return authStore.user?.role === role
  }

  const hasAnyRole = (roles: string[]): boolean => {
    return authStore.user ? roles.includes(authStore.user.role) : false
  }

  const isOwner = (resourceUserId: number): boolean => {
    return authStore.user?.id === resourceUserId
  }

  const canAccess = (resourceUserId?: number, requiredRole?: string): boolean => {
    if (!authStore.user) return false

    // Los administradores pueden acceder a todo
    if (isAdmin.value) return true

    // Si hay un userId específico, verificar propiedad
    if (resourceUserId && isOwner(resourceUserId)) return true

    // Si hay un rol requerido, verificarlo
    if (requiredRole && hasRole(requiredRole)) return true

    return false
  }

  const getAvatarUrl = (size: number = 40): string => {
    if (userProfileImage.value) {
      return userProfileImage.value
    }

    const initials = userInitials.value
    return `https://ui-avatars.com/api/?name=${initials}&size=${size}&background=FF416C&color=fff&rounded=true&bold=true`
  }

  const getDisplayName = (): string => {
    if (!user.value) return 'Usuario'

    const fullName = userName.value
    if (fullName && fullName.trim()) {
      return fullName
    }

    return user.value.email.split('@')[0]
  }

  // =================== AUTO-INICIALIZACIÓN ===================
  // Asegurar que el store esté inicializado
  if (!authStore.isAuthenticated && authStore.token) {
    authStore.initializeAuth()
  }

  return {
    // Estado
    user,
    isAuthenticated,
    isLoggedIn,
    loading,
    error,

    // Información del usuario
    userName,
    userInitials,
    userProfileImage,
    userRole,

    // Verificaciones de rol
    isAdmin,
    isBusiness,
    isCustomer,
    isDeliveryPerson,
    isGoogleUser,

    // Acciones de autenticación
    login,
    loginWithGoogle,
    register,
    logout,
    checkAuth,

    // Navegación segura
    requireAuth,
    requireAdmin,
    requireBusiness,
    redirectIfAuthenticated,

    // Utilidades
    clearError,
    hasRole,
    hasAnyRole,
    isOwner,
    canAccess,
    getAvatarUrl,
    getDisplayName,
    forceRefreshAuth,

    // Store directo (por si necesitas acceso completo)
    authStore,
  }
}
