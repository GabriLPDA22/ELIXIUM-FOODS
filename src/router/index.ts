import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes';
import { useAuthStore } from '@/stores/auth';
import { isTokenValid } from '@/services/api';

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (savedPosition) {
          resolve(savedPosition);
        } else {
          resolve({ top: 0, left: 0 });
        }
      }, 350);
    });
  }
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  const getAuthToken = () => {
    return localStorage.getItem('authToken') || localStorage.getItem('token');
  };

  const authToken = getAuthToken();

  if (authToken && isTokenValid() && !authStore.user) {
    try {
      authStore.initializeAuth();
      await new Promise(resolve => setTimeout(resolve, 50));
    } catch (error) {
      // En un entorno de producción, podrías querer registrar este error
      // en lugar de solo mostrarlo en la consola si se eliminan los console.log.
    }
  }

  if (authToken && !isTokenValid()) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    authStore.logout?.(false);
  }

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isGuestOnly = to.matched.some(record => record.meta.guest);
  const requiresRole = to.meta.requiresRole as string[];

  if (requiresAuth) {
    const validToken = authToken && isTokenValid();
    const hasValidUser = authStore.user && authStore.isAuthenticated;

    if (!validToken || !hasValidUser) {
      return next({
        name: 'login',
        query: { returnUrl: to.fullPath }
      });
    }

    if (requiresRole && requiresRole.length > 0) {
      const userRole = authStore.user?.role;
      if (!userRole || !requiresRole.includes(userRole)) {
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
    return next();
  }

  if (isGuestOnly) {
    const validToken = authToken && isTokenValid();
    const hasValidUser = authStore.user && authStore.isAuthenticated;

    if (validToken && hasValidUser) {
      const returnUrl = to.query.returnUrl as string;
      if (returnUrl) {
        try {
          const decodedUrl = decodeURIComponent(returnUrl);
          return next(decodedUrl);
        } catch (error) {
          // Manejo de error de decodificación
        }
      }
      return next({ name: 'home' });
    }
    return next();
  }

  next();
});

router.afterEach((to, from) => {
});

export default router;
