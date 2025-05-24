<!-- src/components/TutorialModal.vue -->
<template>
  <div v-if="tutorialStore.showIntroModal"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click.self="handleBackdropClick">
    <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden transform transition-all">
      <!-- Header -->
      <div class="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 text-white">
        <div class="flex items-center space-x-3">
          <div class="text-3xl">🍕</div>
          <div>
            <h3 class="text-xl font-bold">¡Bienvenido a Elixium-Foods!</h3>
            <p class="text-orange-100 text-sm">Tu plataforma de comida favorita</p>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6">
        <div class="text-center mb-6">
          <div class="text-6xl mb-4">🎯</div>
          <h4 class="text-lg font-semibold text-gray-900 mb-2">
            ¿Te gustaría un tour rápido?
          </h4>
          <p class="text-gray-600 text-sm leading-relaxed">
            Te mostraremos las funciones principales de la app para que puedas empezar a pedir tu comida favorita de
            inmediato.
          </p>
        </div>

        <!-- Benefits -->
        <div class="space-y-3 mb-6">
          <div class="flex items-center space-x-3 text-sm">
            <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <span class="text-gray-700">Aprende a buscar restaurantes</span>
          </div>
          <div class="flex items-center space-x-3 text-sm">
            <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <span class="text-gray-700">Descubre cómo hacer pedidos</span>
          </div>
          <div class="flex items-center space-x-3 text-sm">
            <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <span class="text-gray-700">Conoce todas las funciones</span>
          </div>
        </div>

        <!-- Timer info -->
        <div class="bg-gray-50 rounded-lg p-3 mb-6 text-center">
          <div class="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Solo toma 1-2 minutos</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="space-y-3">
          <button @click="startTutorial" :disabled="tutorialStore.isPlaying"
            class="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
            <span v-if="!tutorialStore.isPlaying" class="flex items-center justify-center space-x-2">
              <span>🚀</span>
              <span>¡Sí, empezar el tour!</span>
            </span>
            <span v-else class="flex items-center justify-center space-x-2">
              <div class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>Iniciando...</span>
            </span>
          </button>

          <button @click="skipTutorial" :disabled="tutorialStore.isPlaying"
            class="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
            No gracias, exploraré por mi cuenta
          </button>
        </div>

        <!-- Footer options -->
        <div class="mt-4 pt-4 border-t border-gray-100">
          <div class="flex items-center justify-between text-xs text-gray-500">
            <button @click="disableTutorialPrompts" class="hover:text-gray-700 transition-colors">
              No mostrar más prompts
            </button>
            <button @click="tutorialStore.hideIntroPrompt()" class="hover:text-gray-700 transition-colors">
              Recordar más tarde
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTutorialStore } from '@/stores/tutorial'

const tutorialStore = useTutorialStore()

const startTutorial = () => {
  tutorialStore.startTutorial('mainApp')
}

const skipTutorial = () => {
  tutorialStore.skipTutorial()
}

const disableTutorialPrompts = () => {
  tutorialStore.disableTutorialPrompts()
}

const handleBackdropClick = () => {
  // Solo cerrar si no hay tutorial corriendo
  if (!tutorialStore.isPlaying) {
    tutorialStore.hideIntroPrompt()
  }
}
</script>

<style scoped>
/* Animaciones personalizadas */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* Evitar scroll del body cuando el modal está abierto */
.modal-open {
  overflow: hidden;
}
</style>
