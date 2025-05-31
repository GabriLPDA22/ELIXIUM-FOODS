// src/router/index.ts - ARREGLADO SIN CONFLICTOS
import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { useAuthStore } from '@/stores/auth'
import { isTokenValid } from '@/services/api'

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

// =================== ROUTER GUARD MEJORADO ===================
router.beforeEach(async (to, from, next) => {
  console.log('🛡️ Router Guard - Navegando a:', to.path)

  const authStore = useAuthStore()

  // ✅ OBTENER TOKEN CONSISTENTEMENTE
  const getAuthToken = () => {
    return localStorage.getItem('authToken') || localStorage.getItem('token');
  };

  const authToken = getAuthToken();

  console.log('🔍 Estado inicial del auth:', {
    path: to.path,
    hasToken: !!authToken,
    tokenValid: authToken ? isTokenValid() : false,
    userInStore: !!authStore.user,
    storeAuthenticated: authStore.isAuthenticated
  });

  // ✅ INICIALIZAR STORE SI HAY TOKEN VÁLIDO PERO NO HAY USER
  if (authToken && isTokenValid() && !authStore.user) {
    console.log('🔄 Token válido encontrado, inicializando store...');
    try {
      authStore.initializeAuth();
      // Dar tiempo para que se inicialice
      await new Promise(resolve => setTimeout(resolve, 50));
    } catch (error) {
      console.error('❌ Error inicializando auth store:', error);
    }
  }

  // ✅ LIMPIAR TOKEN INVÁLIDO
  if (authToken && !isTokenValid()) {
    console.log('🧹 Token inválido detectado, limpiando...');
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    authStore.logout?.(false); // No redirigir desde aquí
  }

  // =================== VERIFICAR REQUISITOS DE RUTA ===================
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isGuestOnly = to.matched.some(record => record.meta.guest);
  const requiresRole = to.meta.requiresRole as string[];

  console.log('📋 Requisitos de ruta:', {
    requiresAuth,
    isGuestOnly,
    requiresRole
  });

  // =================== RUTAS QUE REQUIEREN AUTENTICACIÓN ===================
  if (requiresAuth) {
    console.log('🔐 Ruta requiere autenticación');

    // Verificar múltiples condiciones de autenticación
    const validToken = authToken && isTokenValid();
    const hasValidUser = authStore.user && authStore.isAuthenticated;

    console.log('🔍 Verificación de autenticación:', {
      validToken,
      hasValidUser,
      finalAuth: validToken && hasValidUser
    });

    // Si no está autenticado, redirigir al login
    if (!validToken || !hasValidUser) {
      console.log('❌ Autenticación fallida, redirigiendo a login');

      return next({
        name: 'login',
        query: { returnUrl: to.fullPath }
      });
    }

    // ✅ VERIFICAR ROLES SI SE REQUIEREN
    if (requiresRole && requiresRole.length > 0) {
      const userRole = authStore.user?.role;
      console.log('👑 Verificando rol requerido:', requiresRole, 'vs rol actual:', userRole);

      if (!userRole || !requiresRole.includes(userRole)) {
        console.log('❌ Usuario no tiene el rol requerido');
        return next({
          path: '/unauthorized',
          query: {
            error: 'insufficient_permissions',
            required: requiresRole.join(', '),
            current: userRole || 'none'
          }
        });
      }
    }

    console.log('✅ Autenticación y autorización correctas');
    return next();
  }

  // =================== RUTAS SOLO PARA INVITADOS ===================
  if (isGuestOnly) {
    console.log('👻 Ruta solo para invitados');

    const validToken = authToken && isTokenValid();
    const hasValidUser = authStore.user && authStore.isAuthenticated;

    if (validToken && hasValidUser) {
      console.log('👤 Usuario ya autenticado, redirigiendo');

      // Verificar si hay returnUrl en la query
      const returnUrl = to.query.returnUrl as string;

      if (returnUrl) {
        try {
          const decodedUrl = decodeURIComponent(returnUrl);
          console.log('🔀 Redirigiendo a returnUrl:', decodedUrl);
          return next(decodedUrl);
        } catch (error) {
          console.error('❌ Error decodificando returnUrl:', error);
        }
      }

      // Fallback a home
      return next({ name: 'home' });
    }

    return next();
  }

  // =================== RUTAS PÚBLICAS ===================
  console.log('🌍 Ruta pública, permitiendo acceso');
  next();
});

// =================== AFTER GUARD PARA DEBUG ===================
router.afterEach((to, from) => {
  console.log('✅ Navegación completada:', {
    to: to.path,
    from: from.path,
    query: to.query
  });
});

export default router
