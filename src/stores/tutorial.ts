// src/stores/tutorial.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { tutorialService } from '@/services/tutorialService'

interface TutorialPreferences {
  hasSeenIntro: boolean
  hasSeenMainApp: boolean
  hasSeenRestaurant: boolean
  hasSeenCheckout: boolean
  showTutorialPrompts: boolean
  lastPromptDate?: string
  tutorialVersion: string
}

export const useTutorialStore = defineStore('tutorial', () => {
  // Estado
  const preferences = ref<TutorialPreferences>({
    hasSeenIntro: false,
    hasSeenMainApp: false,
    hasSeenRestaurant: false,
    hasSeenCheckout: false,
    showTutorialPrompts: true,
    tutorialVersion: '1.0.0',
  })

  const showIntroModal = ref(false)
  const isPlaying = ref(false)
  const currentTour = ref<string | null>(null)

  // Getters
  const shouldShowIntroPrompt = computed(() => {
    // No mostrar si ya vio la intro o si deshabilitó los prompts
    if (preferences.value.hasSeenIntro || !preferences.value.showTutorialPrompts) {
      return false
    }

    // No mostrar más de una vez por día
    const lastPrompt = preferences.value.lastPromptDate
    if (lastPrompt) {
      const lastPromptDate = new Date(lastPrompt)
      const today = new Date()
      const diffTime = today.getTime() - lastPromptDate.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays < 1) {
        return false
      }
    }

    return true
  })

  const hasSeenTutorial = (tutorialName: keyof TutorialPreferences) => {
    return preferences.value[tutorialName] === true
  }

  // Acciones
  const loadPreferences = () => {
    const saved = localStorage.getItem('tutorial_preferences')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        preferences.value = { ...preferences.value, ...parsed }

        // Verificar si hay una nueva versión del tutorial
        if (parsed.tutorialVersion !== preferences.value.tutorialVersion) {
          // Resetear algunos flags para nueva versión
          preferences.value.hasSeenMainApp = false
          preferences.value.tutorialVersion = '1.0.0'
          savePreferences()
        }
      } catch (error) {
        console.error('Error loading tutorial preferences:', error)
      }
    }
  }

  const savePreferences = () => {
    localStorage.setItem('tutorial_preferences', JSON.stringify(preferences.value))
  }

  const markTutorialAsSeen = (tutorialName: keyof TutorialPreferences) => {
    if (tutorialName in preferences.value) {
      ;(preferences.value as any)[tutorialName] = true
      savePreferences()
    }
  }

  const updateLastPromptDate = () => {
    preferences.value.lastPromptDate = new Date().toISOString()
    savePreferences()
  }

  const setShowTutorialPrompts = (show: boolean) => {
    preferences.value.showTutorialPrompts = show
    savePreferences()
  }

  const showIntroPrompt = () => {
    if (shouldShowIntroPrompt.value) {
      showIntroModal.value = true
      updateLastPromptDate()
    }
  }

  const hideIntroPrompt = () => {
    showIntroModal.value = false
  }

  const startTutorial = async (tutorialName: keyof typeof tutorialService.tours) => {
    if (isPlaying.value) {
      console.warn('Ya hay un tutorial en progreso')
      return
    }

    isPlaying.value = true
    currentTour.value = tutorialName
    hideIntroPrompt()

    try {
      // Esperar un poco para que los elementos se rendericen
      await new Promise((resolve) => setTimeout(resolve, 500))

      tutorialService.startTour(tutorialName, () => {
        // Callback cuando el tutorial termina
        isPlaying.value = false
        currentTour.value = null

        // Marcar como visto según el tipo de tutorial
        switch (tutorialName) {
          case 'mainApp':
            markTutorialAsSeen('hasSeenMainApp')
            markTutorialAsSeen('hasSeenIntro')
            break
          case 'restaurant':
            markTutorialAsSeen('hasSeenRestaurant')
            break
          case 'checkout':
            markTutorialAsSeen('hasSeenCheckout')
            break
        }
      })
    } catch (error) {
      console.error('Error starting tutorial:', error)
      isPlaying.value = false
      currentTour.value = null
    }
  }

  const skipTutorial = () => {
    markTutorialAsSeen('hasSeenIntro')
    markTutorialAsSeen('hasSeenMainApp')
    hideIntroPrompt()
  }

  const resetTutorials = () => {
    preferences.value = {
      hasSeenIntro: false,
      hasSeenMainApp: false,
      hasSeenRestaurant: false,
      hasSeenCheckout: false,
      showTutorialPrompts: true,
      tutorialVersion: '1.0.0',
    }
    savePreferences()
  }

  const disableTutorialPrompts = () => {
    setShowTutorialPrompts(false)
    hideIntroPrompt()
  }

  // Auto-mostrar prompt de introducción cuando sea apropiado
  const checkAndShowIntroPrompt = () => {
    // Esperar un poco después de que la página cargue
    setTimeout(() => {
      if (shouldShowIntroPrompt.value) {
        showIntroPrompt()
      }
    }, 2000) // 2 segundos de delay
  }

  // Funciones para elementos específicos
  const highlightElement = (
    selector: string,
    options?: {
      title?: string
      description?: string
    }
  ) => {
    return tutorialService.highlightElement(selector, options)
  }

  // Inicializar al crear el store
  loadPreferences()

  return {
    // Estado
    preferences,
    showIntroModal,
    isPlaying,
    currentTour,

    // Getters
    shouldShowIntroPrompt,
    hasSeenTutorial,

    // Acciones
    loadPreferences,
    savePreferences,
    markTutorialAsSeen,
    showIntroPrompt,
    hideIntroPrompt,
    startTutorial,
    skipTutorial,
    resetTutorials,
    disableTutorialPrompts,
    checkAndShowIntroPrompt,
    highlightElement,
    setShowTutorialPrompts,
  }
})
