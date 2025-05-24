<!-- views/Home.vue -->
<template>
  <div class="home">
    <hero-section />
    <how-it-works-section />

    <!-- ✅ NUEVO: Sección de categorías con data-tour -->
    <div data-tour="categories">
      <categories-section
        :categories="homeStore.categories"
        :is-loading="homeStore.isLoading"
      />
    </div>

    <!-- ✅ NUEVO: Sección de restaurantes populares con data-tour -->
    <div data-tour="popular-restaurants">
      <popular-restaurants-section
        :restaurants="homeStore.popularRestaurants"
        :is-loading="homeStore.isLoading"
      />
    </div>

    <!-- ✅ NUEVO: Botón flotante para mostrar tutorial (opcional) -->
    <div
      v-if="!tutorialStore.hasSeenTutorial('hasSeenMainApp')"
      class="tutorial-helper"
    >
      <button
        @click="showTutorial"
        class="tutorial-helper__button"
        title="¿Necesitas ayuda? Ver tutorial"
      >
        🎯
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useHomeStore } from '@/stores/homeStore'
// ✅ NUEVO: Importar store del tutorial
import { useTutorialStore } from '@/stores/tutorial'
import HeroSection from '@/components/feature/home/HeroSection.vue'
import HowItWorksSection from '@/components/feature/home/HowItWorksSection.vue'
import CategoriesSection from '@/components/feature/home/CategoriesSection.vue'
import PopularRestaurantsSection from '@/components/feature/home/PopularRestaurantsSection.vue'

const homeStore = useHomeStore()
// ✅ NUEVO: Inicializar store del tutorial
const tutorialStore = useTutorialStore()

// ✅ NUEVO: Función para mostrar tutorial
const showTutorial = () => {
  tutorialStore.startTutorial('mainApp')
}

onMounted(async () => {
  // Inicializar datos del home
  await homeStore.initialize()

  // ✅ NUEVO: Verificar si mostrar tutorial después de que los datos se carguen
  setTimeout(() => {
    tutorialStore.checkAndShowIntroPrompt()
  }, 1500) // Esperar 1.5 segundos para que todo se renderice
})
</script>

<style lang="scss" scoped>
.home {
  position: relative;
}

/* ✅ NUEVO: Estilos para el botón de ayuda flotante */
.tutorial-helper {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 100;

  &__button {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: linear-gradient(135deg, #FF416C, #FF4B2B);
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(255, 65, 108, 0.3);
    transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      transform: translateY(-2px) scale(1.05);
      box-shadow: 0 8px 25px rgba(255, 65, 108, 0.4);
    }

    &:active {
      transform: translateY(0) scale(1);
    }

    /* Animación de pulso para llamar la atención */
    animation: pulse 2s infinite;
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 4px 20px rgba(255, 65, 108, 0.3);
  }
  50% {
    box-shadow: 0 4px 20px rgba(255, 65, 108, 0.6), 0 0 0 10px rgba(255, 65, 108, 0.1);
  }
  100% {
    box-shadow: 0 4px 20px rgba(255, 65, 108, 0.3);
  }
}

/* Responsivo para móvil */
@media (max-width: 768px) {
  .tutorial-helper {
    bottom: 1rem;
    right: 1rem;

    &__button {
      width: 48px;
      height: 48px;
      font-size: 1.25rem;
    }
  }
}
</style>
