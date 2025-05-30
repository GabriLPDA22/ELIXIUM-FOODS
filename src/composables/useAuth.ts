// src/composables/useAuth.ts
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'

export function useAuth() {
  const authStore = useAuthStore()

  // Crear función wrapper para mantener compatibilidad
  const isAuthenticated = computed(() => authStore.isAuthenticated)

  return {
    authStore,
    user: computed(() => authStore.user),
    token: computed(() => authStore.token),
    isAuthenticated,
    // Métodos del store
    login: authStore.login,
    loginWithGoogle: authStore.loginWithGoogle,
    logout: authStore.logout,
    checkAuth: authStore.checkAuth
  }
}
