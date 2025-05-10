<!-- src/views/Unauthorized.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4">
    <div class="max-w-lg w-full">
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 scale-95 animate-scale">
        <!-- Header -->
        <div class="bg-gradient-to-r from-red-500 to-pink-500 p-8 text-center">
          <div class="inline-flex items-center justify-center w-24 h-24 bg-white/20 rounded-full mb-4 animate-bounce">
            <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="20" stroke-width="3"/>
              <path d="M18 18l12 12m0-12L18 30" stroke-width="3" stroke-linecap="round"/>
            </svg>
          </div>
          <h1 class="text-5xl font-bold text-white mb-2">401</h1>
          <h2 class="text-xl text-white/90">Acceso Denegado</h2>
        </div>

        <!-- Content -->
        <div class="p-8">
          <p class="text-gray-600 text-center mb-8">
            No tienes permisos para acceder al panel de administración.
            Solo los administradores pueden acceder a esta sección.
          </p>

          <!-- User info -->
          <div v-if="currentUser" class="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 class="font-semibold text-gray-900 mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              Tu información de usuario
            </h3>

            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-500">Nombre:</span>
                <span class="font-medium">{{ currentUser.firstName }} {{ currentUser.lastName }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Email:</span>
                <span class="font-medium">{{ currentUser.email }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Rol actual:</span>
                <span :class="getRoleBadgeClass(currentUser.role)">
                  {{ currentUser.role }}
                </span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="space-y-4">
            <router-link
              to="/"
              class="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center font-medium"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
              Volver al inicio
            </router-link>

            <button
              @click="logout"
              class="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center font-medium"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              Cerrar sesión
            </button>
          </div>

          <!-- Help section -->
          <div class="mt-8 pt-6 border-t border-gray-200 text-center">
            <p class="text-sm text-gray-500 mb-2">¿Necesitas acceso de administrador?</p>
            <a
              href="mailto:admin@elixiumfoods.com"
              class="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
            >
              Contactar al administrador
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const currentUser = computed(() => authStore.user);

const logout = async () => {
  await authStore.logout();
  router.push('/login');
};

const getRoleBadgeClass = (role: string) => {
  const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';

  switch (role) {
    case 'Admin':
      return `${baseClasses} bg-blue-100 text-blue-800`;
    case 'Customer':
      return `${baseClasses} bg-green-100 text-green-800`;
    case 'Restaurant':
      return `${baseClasses} bg-purple-100 text-purple-800`;
    case 'DeliveryPerson':
      return `${baseClasses} bg-yellow-100 text-yellow-800`;
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`;
  }
};
</script>

<style scoped>
@keyframes scale {
  0% {
    transform: scale(0.95);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-scale {
  animation: scale 0.5s ease-out forwards;
}
</style>
