// src/router/auth-guard.ts
import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export const requireAuth = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore()

  // Verificar si el usuario está autenticado
  if (!authStore.isAuthenticated()) {
    // Intentar verificar la autenticación con el backend
    const isAuthenticated = await authStore.checkAuth()
    if (!isAuthenticated) {
      // Redirigir al login con la ruta original como returnUrl
      return next({
        path: '/login',
        query: { returnUrl: to.fullPath },
      })
    }
  }

  // Si requiere un rol específico y el usuario no lo tiene
  if (to.meta.requiresRole && !to.meta.requiresRole.includes(authStore.user?.role)) {
    return next({ path: '/unauthorized' })
  }

  next()
}
