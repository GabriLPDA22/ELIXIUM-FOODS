// src/services/tutorialService.ts
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'

export interface TutorialStep {
  element: string
  popover: {
    title: string
    description: string
    side?: 'left' | 'right' | 'top' | 'bottom'
    align?: 'start' | 'center' | 'end'
  }
}

export interface TutorialConfig {
  steps: TutorialStep[]
  options?: {
    animate?: boolean
    smoothScroll?: boolean
    allowClose?: boolean
    doneBtnText?: string
    closeBtnText?: string
    nextBtnText?: string
    prevBtnText?: string
  }
}

export const tutorialService = {
  // Configuración de tours disponibles
  tours: {
    // Tutorial principal de la aplicación
    mainApp: {
      steps: [
        {
          element: '[data-tour="search-bar"]',
          popover: {
            title: '🔍 ¡Encuentra tu comida ideal!',
            description: 'Escribe aquí el nombre de un restaurante, tipo de cocina o tu plato favorito. ¡Es súper fácil!',
            side: 'bottom',
            align: 'center'
          }
        },
        {
          element: '[data-tour="categories"]',
          popover: {
            title: '🍕 Explora por categorías',
            description: '¿No sabes qué pedir? Navega por nuestras categorías: pizza, sushi, hamburguesas, postres y mucho más.',
            side: 'bottom'
          }
        },
        {
          element: '[data-tour="popular-restaurants"]',
          popover: {
            title: '⭐ Los más populares',
            description: 'Estos son los restaurantes favoritos de otros usuarios. ¡Perfectos para empezar!',
            side: 'top'
          }
        },
        {
          element: '[data-tour="cart-button"]',
          popover: {
            title: '🛒 Tu carrito de compras',
            description: 'Aquí aparecerán todos los productos que vayas añadiendo. El número muestra cuántos tienes.',
            side: 'left'
          }
        },
        {
          element: '[data-tour="user-menu"]',
          popover: {
            title: '👤 Tu zona personal',
            description: 'Desde aquí puedes ver tu perfil, direcciones, historial de pedidos y repetir tus favoritos.',
            side: 'left'
          }
        }
      ],
      options: {
        animate: true,
        smoothScroll: true,
        allowClose: true,
        doneBtnText: '¡Perfecto, ya entendí! 🎉',
        closeBtnText: 'Salir',
        nextBtnText: 'Siguiente ✨',
        prevBtnText: '← Anterior'
      }
    } as TutorialConfig,

    // Tutorial para la página de restaurante
    restaurant: {
      steps: [
        {
          element: '[data-tour="restaurant-info"]',
          popover: {
            title: '🏪 Información del Restaurante',
            description: 'Aquí puedes ver la información del restaurante: calificaciones, tiempo de entrega y costo de envío.',
            side: 'bottom'
          }
        },
        {
          element: '[data-tour="menu-categories"]',
          popover: {
            title: '📋 Categorías del Menú',
            description: 'Navega por las diferentes categorías del menú para encontrar lo que buscas.',
            side: 'right'
          }
        },
        {
          element: '[data-tour="add-to-cart"]',
          popover: {
            title: '➕ Añadir al Carrito',
            description: 'Haz clic en estos botones para añadir productos a tu pedido. Puedes ajustar la cantidad antes de añadir.',
            side: 'top'
          }
        }
      ],
      options: {
        animate: true,
        smoothScroll: true,
        allowClose: true,
        doneBtnText: '¡Perfecto! 🍽️',
        closeBtnText: 'Cerrar',
        nextBtnText: 'Siguiente →',
        prevBtnText: '← Anterior'
      }
    } as TutorialConfig,

    // Tutorial para el proceso de checkout
    checkout: {
      steps: [
        {
          element: '[data-tour="delivery-address"]',
          popover: {
            title: '📍 Dirección de Entrega',
            description: 'Selecciona o añade una nueva dirección donde quieres recibir tu pedido.',
            side: 'bottom'
          }
        },
        {
          element: '[data-tour="payment-method"]',
          popover: {
            title: '💳 Método de Pago',
            description: 'Elige tu método de pago preferido: tarjeta, PayPal o efectivo contra entrega.',
            side: 'top'
          }
        },
        {
          element: '[data-tour="order-summary"]',
          popover: {
            title: '📄 Resumen del Pedido',
            description: 'Revisa tu pedido, cantidades y el total antes de confirmar la compra.',
            side: 'left'
          }
        }
      ],
      options: {
        animate: true,
        smoothScroll: true,
        allowClose: true,
        doneBtnText: '¡Listo para pedir! 🚀',
        closeBtnText: 'Cerrar',
        nextBtnText: 'Siguiente →',
        prevBtnText: '← Anterior'
      }
    } as TutorialConfig
  },

  // Iniciar un tour específico
  startTour(tourName: keyof typeof this.tours, onComplete?: () => void) {
    const tourConfig = this.tours[tourName]

    if (!tourConfig) {
      console.warn(`Tutorial "${tourName}" no encontrado`)
      return
    }

    // Verificar que todos los elementos existan antes de iniciar
    const missingElements = tourConfig.steps.filter(step => {
      return !document.querySelector(step.element)
    })

    if (missingElements.length > 0) {
      console.warn('Algunos elementos del tutorial no están disponibles:', missingElements.map(s => s.element))
      // Filtrar pasos con elementos faltantes
      tourConfig.steps = tourConfig.steps.filter(step =>
        document.querySelector(step.element)
      )
    }

    if (tourConfig.steps.length === 0) {
      console.warn('No hay pasos válidos para mostrar en este tutorial')
      return
    }

    const driverObj = driver({
      showProgress: true,
      progressText: 'Paso {{current}} de {{total}}',
      ...tourConfig.options,
      steps: tourConfig.steps,
      onDestroyed: () => {
        if (onComplete) {
          onComplete()
        }
      }
    })

    driverObj.drive()
    return driverObj
  },

  // Highlight de un elemento específico
  highlightElement(selector: string, options?: {
    title?: string
    description?: string
    showButtons?: boolean
  }) {
    const element = document.querySelector(selector)

    if (!element) {
      console.warn(`Elemento "${selector}" no encontrado para highlight`)
      return
    }

    const driverObj = driver({
      animate: true,
      showButtons: options?.showButtons ?? false,
      allowClose: true,
      popover: options ? {
        title: options.title || '',
        description: options.description || ''
      } : undefined
    })

    driverObj.highlight({
      element: selector,
      popover: options ? {
        title: options.title || '',
        description: options.description || ''
      } : undefined
    })

    return driverObj
  },

  // Verificar si elementos están disponibles
  areElementsAvailable(tourName: keyof typeof this.tours): boolean {
    const tourConfig = this.tours[tourName]
    if (!tourConfig) return false

    return tourConfig.steps.every(step =>
      document.querySelector(step.element) !== null
    )
  },

  // Esperar a que los elementos estén disponibles
  async waitForElements(selectors: string[], timeout = 5000): Promise<boolean> {
    const startTime = Date.now()

    while (Date.now() - startTime < timeout) {
      const allElementsExist = selectors.every(selector =>
        document.querySelector(selector) !== null
      )

      if (allElementsExist) {
        return true
      }

      // Esperar 100ms antes de verificar nuevamente
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    return false
  },

  // Obtener elementos disponibles para un tour
  getAvailableSteps(tourName: keyof typeof this.tours) {
    const tourConfig = this.tours[tourName]
    if (!tourConfig) return []

    return tourConfig.steps.filter(step =>
      document.querySelector(step.element) !== null
    )
  }
}

export default tutorialService
