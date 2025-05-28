// src/router/auth-guards.ts
import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useBusinessAuthStore } from '@/stores/businessAuth'

// Guard para usuarios
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

// Guard para negocios (restaurantes, partners)
export const requireBusinessAuth = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const businessAuthStore = useBusinessAuthStore()

  // Verificar si el negocio está autenticado
  if (!businessAuthStore.isAuthenticated) {
    // Intentar verificar la autenticación con el backend
    const isAuthenticated = await businessAuthStore.checkAuth()
    if (!isAuthenticated) {
      // Redirigir al login de negocios con la ruta original como returnUrl
      return next({
        path: '/business/login',
        query: { returnUrl: to.fullPath },
      })
    }
  }

  // Si requiere un rol específico y el negocio no lo tiene
  if (to.meta.requiresBusinessRole && !to.meta.requiresBusinessRole.includes(businessAuthStore.businessRole)) {
    return next({ path: '/business/unauthorized' })
  }

  next()
}

// Guard para páginas de guest (donde no debe haber autenticación, como login/register)
export const redirectIfAuthenticated = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore()

  if (authStore.isAuthenticated()) {
    return next({ name: 'home' }) // Redirigir a home si ya está autenticado
  }

  next()
}

// Guard para páginas de business guest (login/register de negocios)
export const redirectIfBusinessAuthenticated = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const businessAuthStore = useBusinessAuthStore()

  if (businessAuthStore.isAuthenticated) {
    return next({ name: 'business-dashboard' }) // Redirigir al dashboard si ya está autenticado
  }

  next()
}
