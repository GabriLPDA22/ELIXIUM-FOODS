// src/composables/useTutorial.ts
import { ref, onMounted, onUnmounted } from 'vue'
import { useTutorialStore } from '@/stores/tutorial'
import { tutorialService } from '@/services/tutorialService'

export function useTutorial() {
  const tutorialStore = useTutorialStore()
  const isReady = ref(false)

  // Función para inicializar tutorial en una página específica
  const initPageTutorial = (pageName: 'home' | 'restaurant' | 'checkout') => {
    onMounted(async () => {
      // Esperar un poco para que los elementos se rendericen
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Verificar si debe mostrar el tutorial de esta página
      switch (pageName) {
        case 'home':
          if (!tutorialStore.hasSeenTutorial('hasSeenMainApp')) {
            tutorialStore.checkAndShowIntroPrompt()
          }
          break
        case 'restaurant':
          // Mostrar tutorial de restaurante si es la primera vez
          if (
            !tutorialStore.hasSeenTutorial('hasSeenRestaurant') &&
            tutorialStore.hasSeenTutorial('hasSeenMainApp')
          ) {
            showPageTutorial('restaurant')
          }
          break
        case 'checkout':
          // Mostrar tutorial de checkout si es la primera vez
          if (!tutorialStore.hasSeenTutorial('hasSeenCheckout')) {
            showPageTutorial('checkout')
          }
          break
      }

      isReady.value = true
    })
  }

  // Mostrar tutorial de página específica con demora
  const showPageTutorial = async (tourName: keyof typeof tutorialService.tours, delay = 3000) => {
    // Esperar que el usuario se familiarice con la página
    setTimeout(async () => {
      if (tutorialService.areElementsAvailable(tourName)) {
        const shouldShow = confirm(`¿Te gustaría un tour rápido de esta sección?`)
        if (shouldShow) {
          tutorialStore.startTutorial(tourName)
        } else {
          // Marcar como visto aunque no lo haya tomado
          switch (tourName) {
            case 'restaurant':
              tutorialStore.markTutorialAsSeen('hasSeenRestaurant')
              break
            case 'checkout':
              tutorialStore.markTutorialAsSeen('hasSeenCheckout')
              break
          }
        }
      }
    }, delay)
  }

  // Función para añadir atributos de tutorial a elementos
  const addTourAttribute = (element: string) => {
    return {
      'data-tour': element,
    }
  }

  // Función para mostrar tutorial manualmente
  const showTutorial = (tourName: keyof typeof tutorialService.tours) => {
    tutorialStore.startTutorial(tourName)
  }

  // Función para destacar un elemento
  const highlightElement = (
    selector: string,
    options?: {
      title?: string
      description?: string
    }
  ) => {
    return tutorialStore.highlightElement(selector, options)
  }

  // Función para verificar si un tutorial ha sido visto
  const hasSeen = (
    tutorialName: 'hasSeenIntro' | 'hasSeenMainApp' | 'hasSeenRestaurant' | 'hasSeenCheckout'
  ) => {
    return tutorialStore.hasSeenTutorial(tutorialName)
  }

  // Función para resetear todos los tutoriales (útil para desarrollo)
  const resetAllTutorials = () => {
    tutorialStore.resetTutorials()
  }

  // Función para esperar elementos y luego ejecutar tutorial
  const waitAndShowTutorial = async (
    tourName: keyof typeof tutorialService.tours,
    requiredElements?: string[],
    maxWait = 5000
  ) => {
    const elements =
      requiredElements || tutorialService.tours[tourName].steps.map((step) => step.element)

    const elementsReady = await tutorialService.waitForElements(elements, maxWait)

    if (elementsReady) {
      tutorialStore.startTutorial(tourName)
    } else {
      console.warn(
        `Elementos no disponibles para el tutorial "${tourName}" después de ${maxWait}ms`
      )
    }
  }

  return {
    // Estado
    isReady,
    isPlaying: tutorialStore.isPlaying,

    // Métodos de inicialización
    initPageTutorial,

    // Métodos de control
    showTutorial,
    showPageTutorial,
    waitAndShowTutorial,
    highlightElement,

    // Utilidades
    addTourAttribute,
    hasSeen,
    resetAllTutorials,

    // Acceso directo al store
    tutorialStore,
  }
}

// Composable específico para elementos de la página principal
export function useHomeTutorial() {
  const tutorial = useTutorial()

  onMounted(() => {
    tutorial.initPageTutorial('home')
  })

  return {
    ...tutorial,
    // Atributos específicos para home
    searchBarAttrs: tutorial.addTourAttribute('search-bar'),
    categoriesAttrs: tutorial.addTourAttribute('categories'),
    popularRestaurantsAttrs: tutorial.addTourAttribute('popular-restaurants'),
    cartButtonAttrs: tutorial.addTourAttribute('cart-button'),
    userMenuAttrs: tutorial.addTourAttribute('user-menu'),
  }
}

// Composable específico para página de restaurante
export function useRestaurantTutorial() {
  const tutorial = useTutorial()

  onMounted(() => {
    tutorial.initPageTutorial('restaurant')
  })

  return {
    ...tutorial,
    // Atributos específicos para restaurant
    restaurantInfoAttrs: tutorial.addTourAttribute('restaurant-info'),
    menuCategoriesAttrs: tutorial.addTourAttribute('menu-categories'),
    addToCartAttrs: tutorial.addTourAttribute('add-to-cart'),
  }
}

// Composable específico para checkout
export function useCheckoutTutorial() {
  const tutorial = useTutorial()

  onMounted(() => {
    tutorial.initPageTutorial('checkout')
  })

  return {
    ...tutorial,
    // Atributos específicos para checkout
    deliveryAddressAttrs: tutorial.addTourAttribute('delivery-address'),
    paymentMethodAttrs: tutorial.addTourAttribute('payment-method'),
    orderSummaryAttrs: tutorial.addTourAttribute('order-summary'),
  }
}
