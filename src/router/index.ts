// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { useAuthStore } from '@/stores/auth'
import { useBusinessAuthStore } from '@/stores/businessAuth'
import { requireAuth, requireBusinessAuth, redirectIfAuthenticated, redirectIfBusinessAuthenticated } from './auth-guards'

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navegación guard
router.beforeEach(async (to, from, next) => {
  // Verificar si la ruta requiere autenticación de usuario regular
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isGuestOnly = to.matched.some(record => record.meta.guest)

  // Verificar si la ruta requiere autenticación de negocio
  const requiresBusinessAuth = to.matched.some(record => record.meta.requiresBusinessAuth)
  const isBusinessGuestOnly = to.matched.some(record => record.meta.businessGuest)

  // Inicializar los stores después del refresco de la página
  const authStore = useAuthStore()
  const businessAuthStore = useBusinessAuthStore()

  // Rutas para usuarios regulares
  if (requiresAuth) {
    // Si la ruta requiere autenticación, verificar si el usuario está autenticado
    if (!authStore.isAuthenticated()) {
      // Redirigir al login con un parámetro de retorno
      next({
        name: 'login',
        query: { returnUrl: to.fullPath }
      })
    } else {
      // Si requiere un rol específico y el usuario no lo tiene
      if (to.meta.requiresRole && !to.meta.requiresRole.includes(authStore.user?.role)) {
        next({ path: '/unauthorized' })
      } else {
        // Si está autenticado y tiene el rol adecuado, permitir la navegación
        next()
      }
    }
  }
  // Rutas para empresas/restaurantes
  else if (requiresBusinessAuth) {
    // Si la ruta requiere autenticación de negocio, verificar si está autenticado
    if (!businessAuthStore.isAuthenticated) {
      // Intentar verificar la autenticación con el backend
      const isAuthenticated = await businessAuthStore.checkAuth()
      if (!isAuthenticated) {
        // Redirigir al login de negocios con la ruta original como returnUrl
        next({
          name: 'business-login',
          query: { returnUrl: to.fullPath },
        })
      } else {
        // Si requiere un rol específico y el negocio no lo tiene
        if (to.meta.requiresBusinessRole && !to.meta.requiresBusinessRole.includes(businessAuthStore.businessRole)) {
          next({ path: '/business/unauthorized' })
        } else {
          // Si está autenticado y tiene el rol adecuado, permitir la navegación
          next()
        }
      }
    } else {
      // Si está autenticado como negocio, verificar roles si es necesario
      if (to.meta.requiresBusinessRole && !to.meta.requiresBusinessRole.includes(businessAuthStore.businessRole)) {
        next({ path: '/business/unauthorized' })
      } else {
        next()
      }
    }
  }
  // Rutas para guest de usuarios regulares
  else if (isGuestOnly && authStore.isAuthenticated()) {
    // Si la ruta es solo para visitantes (login, register) y el usuario ya está autenticado,
    // redirigir al inicio
    next({ name: 'home' })
  }
  // Rutas para guest de negocios
  else if (isBusinessGuestOnly && businessAuthStore.isAuthenticated) {
    // Si la ruta es solo para visitantes de negocios y ya está autenticado,
    // redirigir al dashboard
    next({ name: 'business-dashboard' })
  }
  else {
    // Para rutas que no requieren autenticación
    next()
  }
})

export default router
