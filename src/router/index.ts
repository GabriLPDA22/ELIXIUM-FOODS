// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { useAuthStore } from '@/stores/auth'

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
  // Verificar si la ruta requiere autenticación
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isGuestOnly = to.matched.some(record => record.meta.guest)
  
  // Inicializar el store después del refresco de la página
  const authStore = useAuthStore()
  
  if (requiresAuth) {
    // Si la ruta requiere autenticación, verificar si el usuario está autenticado
    if (!authStore.isAuthenticated()) {
      // Redirigir al login con un parámetro de retorno
      next({ 
        name: 'login', 
        query: { returnUrl: to.fullPath } 
      })
    } else {
      // Si está autenticado, permitir la navegación
      next()
    }
  } else if (isGuestOnly && authStore.isAuthenticated()) {
    // Si la ruta es solo para visitantes (login, register) y el usuario ya está autenticado,
    // redirigir al inicio
    next({ name: 'home' })
  } else {
    // Para rutas que no requieren autenticación
    next()
  }
})

export default router