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

// =================== ROUTER GUARD ARREGLADO ===================
router.beforeEach(async (to, from, next) => {
  console.log('🛡️ Router Guard - Navegando a:', to.path)

  const authStore = useAuthStore()

  // ✅ FORZAR INICIALIZACIÓN DEL STORE
  if (!authStore.user && localStorage.getItem('authToken')) {
    console.log('🔄 Inicializando auth store desde router guard...')
    authStore.initializeAuth()
  }

  console.log('👤 Estado del auth store:')
  console.log('├── user:', authStore.user)
  console.log('├── token:', authStore.token ? 'Present' : 'Missing')
  console.log('├── isAuthenticated:', authStore.isAuthenticated)
  console.log('├── isAdmin:', authStore.isAdmin)
  console.log('└── localStorage token:', localStorage.getItem('authToken'))

  // =================== RUTAS QUE REQUIEREN AUTENTICACIÓN ===================
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isGuestOnly = to.matched.some(record => record.meta.guest)
  const requiresRole = to.meta.requiresRole as string[]

  if (requiresAuth) {
    console.log('🔐 Ruta requiere autenticación')

    // ✅ VERIFICAR MÚLTIPLES CONDICIONES
    const hasToken = !!localStorage.getItem('authToken')
    const hasUser = !!authStore.user
    const isStoreAuthenticated = authStore.isAuthenticated

    console.log('🔍 Verificando autenticación:')
    console.log('├── hasToken:', hasToken)
    console.log('├── hasUser:', hasUser)
    console.log('└── isStoreAuthenticated:', isStoreAuthenticated)

    // Si no hay token en localStorage, definitivamente no está autenticado
    if (!hasToken) {
      console.log('❌ No hay token, redirigiendo a login')
      return next({
        name: 'login',
        query: { returnUrl: to.fullPath }
      })
    }

    // Si hay token pero no hay usuario en el store, intentar restaurar
    if (hasToken && !hasUser) {
      console.log('🔄 Hay token pero no usuario, restaurando...')
      authStore.initializeAuth()

      // Dar un momento para que se inicialice
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    // Verificar de nuevo después de intentar restaurar
    if (!authStore.user) {
      console.log('❌ No se pudo restaurar usuario, redirigiendo a login')
      return next({
        name: 'login',
        query: { returnUrl: to.fullPath }
      })
    }

    // ✅ VERIFICAR ROLES SI SE REQUIEREN
    if (requiresRole && requiresRole.length > 0) {
      const userRole = authStore.user.role
      console.log('👑 Verificando rol requerido:', requiresRole, 'vs rol actual:', userRole)

      if (!requiresRole.includes(userRole)) {
        console.log('❌ Usuario no tiene el rol requerido')
        return next({
          path: '/unauthorized',
          query: {
            error: 'insufficient_permissions',
            required: requiresRole.join(', '),
            current: userRole
          }
        })
      }
    }

    console.log('✅ Autenticación y autorización correctas')
    return next()
  }

  // =================== RUTAS SOLO PARA INVITADOS ===================
  if (isGuestOnly) {
    console.log('👻 Ruta solo para invitados')

    const hasToken = !!localStorage.getItem('authToken')
    const hasUser = !!authStore.user

    if (hasToken && hasUser) {
      console.log('👤 Usuario ya autenticado, redirigiendo a home')
      return next({ name: 'home' })
    }

    return next()
  }

  // =================== RUTAS PÚBLICAS ===================
  console.log('🌍 Ruta pública, permitiendo acceso')
  next()
})

// =================== AFTER GUARD PARA DEBUG ===================
router.afterEach((to, from) => {
  console.log('✅ Navegación completada a:', to.path)
})

export default router
