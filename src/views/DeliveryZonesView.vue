<!-- views/DeliveryZonesView.vue -->
<template>
  <div class="delivery-zones-view">
    <!-- Hero Section -->
    <section class="delivery-hero">
      <div class="delivery-hero__container">
        <div class="delivery-hero__content">
          <h1 class="delivery-hero__title">
            Zonas de <span class="delivery-hero__title-highlight">Entrega</span>
          </h1>
          <p class="delivery-hero__subtitle">
            Llevamos la mejor comida de Zaragoza directamente a tu puerta. Descubre si entregamos en tu zona y los tiempos estimados.
          </p>

          <!-- Buscador de código postal -->
          <div class="delivery-hero__search">
            <div class="postal-search">
              <input
                v-model="searchPostalCode"
                type="text"
                placeholder="Introduce tu código postal (ej: 50001)"
                class="postal-search__input"
                @input="searchZone"
              />
              <button class="postal-search__btn" @click="searchZone">
                <span class="postal-search__icon">🔍</span>
                Buscar
              </button>
            </div>

            <!-- Resultado de búsqueda -->
            <div v-if="searchResult" class="search-result">
              <div v-if="searchResult.found" class="search-result__success">
                <div class="search-result__icon">✅</div>
                <div class="search-result__content">
                  <h3>¡Entregamos en {{ searchResult.zone?.name }}!</h3>
                  <p>
                    Tiempo estimado: {{ searchResult.zone?.estimatedTime.min }}-{{ searchResult.zone?.estimatedTime.max }} min
                    | Gastos de envío: {{ searchResult.zone?.deliveryFee === 0 ? 'GRATIS' : `${searchResult.zone?.deliveryFee}€` }}
                  </p>
                  <p v-if="searchResult.zone?.freeDeliveryMinimum">
                    Envío gratis a partir de {{ searchResult.zone?.freeDeliveryMinimum }}€
                  </p>
                </div>
              </div>

              <div v-else class="search-result__not-found">
                <div class="search-result__icon">😔</div>
                <div class="search-result__content">
                  <h3>Aún no llegamos a esa zona</h3>
                  <p>Pero estamos expandiéndonos constantemente. ¡Pronto estaremos contigo!</p>
                  <button class="notify-btn" @click="openNotifyModal">
                    🔔 Notifícame cuando lleguéis
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="delivery-hero__visual">
          <div class="delivery-hero__bike">
            <div class="bike-animation">
              <div class="bike">🛵</div>
              <div class="delivery-path"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Ciudades Section -->
    <section class="cities-section">
      <div class="cities-section__container">
        <h2 class="section-title">
          <span class="section-title__icon">🏙️</span>
          Ciudades Disponibles
        </h2>

        <div class="cities-grid">
          <div
            v-for="city in sortedCities"
            :key="city.id"
            :class="['city-card', `city-card--${city.status}`]"
            @click="city.status === 'active' ? selectCity(city.id) : null"
          >
            <div class="city-card__image-container">
              <img :src="city.imageUrl" :alt="city.name" class="city-card__image" />
              <div :class="['city-card__status', `city-card__status--${city.status}`]">
                <span v-if="city.status === 'active'">🟢 Activo</span>
                <span v-else-if="city.status === 'coming_soon'">🟡 Próximamente</span>
                <span v-else>🔵 Planificado</span>
              </div>
            </div>

            <div class="city-card__content">
              <h3 class="city-card__name">{{ city.name }}</h3>
              <p class="city-card__province">{{ city.province }}</p>
              <p class="city-card__description">{{ city.description }}</p>

              <div v-if="city.status === 'active'" class="city-card__stats">
                <div class="stat">
                  <span class="stat__value">{{ city.totalZones }}</span>
                  <span class="stat__label">Zonas</span>
                </div>
                <div class="stat">
                  <span class="stat__value">{{ city.totalRestaurants }}</span>
                  <span class="stat__label">Restaurantes</span>
                </div>
              </div>

              <div v-else-if="city.status === 'coming_soon'" class="city-card__launch">
                <div class="launch-date">
                  <span class="launch-date__icon">📅</span>
                  <span class="launch-date__text">{{ formatLaunchDate(city.launchDate) }}</span>
                </div>
              </div>

              <div v-else class="city-card__planned">
                <p class="planned-text">En nuestros planes de expansión</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Zonas de Zaragoza -->
    <section v-if="selectedCity === 'zaragoza'" class="zones-section">
      <div class="zones-section__container">
        <h2 class="section-title">
          <span class="section-title__icon">📍</span>
          Zonas de Entrega en Zaragoza
        </h2>

        <div class="zones-filters">
          <button
            v-for="coverage in coverageTypes"
            :key="coverage.id"
            :class="['coverage-filter', { 'coverage-filter--active': activeCoverage === coverage.id }]"
            @click="setActiveCoverage(coverage.id)"
          >
            <span class="coverage-filter__icon">{{ coverage.icon }}</span>
            <span class="coverage-filter__text">{{ coverage.name }}</span>
          </button>
        </div>

        <div class="zones-grid">
          <div
            v-for="zone in filteredZones"
            :key="zone.id"
            :class="['zone-card', `zone-card--${zone.coverage}`]"
          >
            <div class="zone-card__header">
              <h3 class="zone-card__name">{{ zone.name }}</h3>
              <div :class="['zone-card__coverage', `zone-card__coverage--${zone.coverage}`]">
                <span v-if="zone.coverage === 'complete'">🟢 Cobertura Completa</span>
                <span v-else-if="zone.coverage === 'partial'">🟡 Cobertura Parcial</span>
                <span v-else>🔴 Cobertura Limitada</span>
              </div>
            </div>

            <div class="zone-card__details">
              <div class="detail-item">
                <span class="detail-item__icon">⏱️</span>
                <span class="detail-item__text">{{ zone.estimatedTime.min }}-{{ zone.estimatedTime.max }} min</span>
              </div>

              <div class="detail-item">
                <span class="detail-item__icon">💰</span>
                <span class="detail-item__text">
                  {{ zone.deliveryFee === 0 ? 'Envío GRATIS' : `${zone.deliveryFee}€ de envío` }}
                </span>
              </div>

              <div class="detail-item" v-if="zone.freeDeliveryMinimum">
                <span class="detail-item__icon">🎁</span>
                <span class="detail-item__text">Gratis desde {{ zone.freeDeliveryMinimum }}€</span>
              </div>

              <div class="detail-item">
                <span class="detail-item__icon">🍽️</span>
                <span class="detail-item__text">{{ zone.restaurantCount }} restaurantes</span>
              </div>
            </div>

            <div class="zone-card__postal-codes">
              <h4 class="zone-card__postal-title">Códigos Postales:</h4>
              <div class="postal-codes-list">
                <span
                  v-for="code in zone.postalCodes"
                  :key="code"
                  class="postal-code"
                >
                  {{ code }}
                </span>
              </div>
            </div>

            <div class="zone-card__landmarks">
              <h4 class="zone-card__landmarks-title">Lugares de Referencia:</h4>
              <div class="landmarks-list">
                <span
                  v-for="landmark in zone.landmarks.slice(0, 3)"
                  :key="landmark"
                  class="landmark"
                >
                  📍 {{ landmark }}
                </span>
              </div>
            </div>

            <div v-if="zone.specialNotes" class="zone-card__notes">
              <div class="special-note">
                <span class="special-note__icon">ℹ️</span>
                <span class="special-note__text">{{ zone.specialNotes }}</span>
              </div>
            </div>

            <div class="zone-card__cuisines">
              <h4 class="zone-card__cuisines-title">Cocinas Populares:</h4>
              <div class="cuisines-list">
                <span
                  v-for="cuisine in zone.popularCuisines.slice(0, 4)"
                  :key="cuisine"
                  class="cuisine-tag"
                >
                  {{ cuisine }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="delivery-cta">
      <div class="delivery-cta__container">
        <h2 class="delivery-cta__title">¿No llega la comida a tu zona?</h2>
        <p class="delivery-cta__subtitle">
          Estamos creciendo rápidamente por toda Aragón. Déjanos tu información y te avisaremos en cuanto lleguemos a tu área.
        </p>
        <button
          @click="openNotifyModal"
          class="delivery-cta__button"
        >
          🔔 Notificarme Cuando Lleguen
        </button>
      </div>
    </section>

    <!-- MODAL DE NOTIFICACIÓN -->
    <div
      v-if="showNotifyModal"
      class="notify-modal-overlay"
      @click="closeNotifyModal"
    >
      <div
        class="notify-modal"
        @click.stop
      >
        <!-- Header del Modal -->
        <div class="notify-modal__header">
          <h3 class="notify-modal__title">🔔 Te avisaremos cuando lleguemos</h3>
          <button
            @click="closeNotifyModal"
            class="notify-modal__close"
            aria-label="Cerrar modal"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Contenido del Modal -->
        <div class="notify-modal__content">
          <p class="notify-modal__description">
            Déjanos tu email y código postal. Serás el primero en saberlo cuando lleguemos a tu zona.
          </p>

          <form @submit.prevent="submitNotification" class="notify-modal__form">
            <div class="notify-modal__form-group">
              <label class="notify-modal__label">Email *</label>
              <input
                v-model="notificationForm.email"
                type="email"
                required
                class="notify-modal__input"
                placeholder="tu@email.com"
              />
            </div>

            <div class="notify-modal__form-group">
              <label class="notify-modal__label">Código Postal *</label>
              <input
                v-model="notificationForm.postalCode"
                type="text"
                required
                class="notify-modal__input"
                placeholder="50001"
                maxlength="5"
              />
            </div>

            <div class="notify-modal__form-group">
              <label class="notify-modal__label">Ciudad</label>
              <input
                v-model="notificationForm.city"
                type="text"
                class="notify-modal__input"
                placeholder="Tu ciudad"
              />
            </div>

            <div class="notify-modal__form-group">
              <label class="notify-modal__label">
                <input
                  v-model="notificationForm.acceptMarketing"
                  type="checkbox"
                  class="notify-modal__checkbox"
                />
                Quiero recibir ofertas y promociones especiales
              </label>
            </div>

            <div class="notify-modal__actions">
              <button
                type="button"
                @click="closeNotifyModal"
                class="notify-modal__btn notify-modal__btn--secondary"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="isSubmittingNotification"
                class="notify-modal__btn notify-modal__btn--primary"
              >
                <span v-if="!isSubmittingNotification">📧 Notificarme</span>
                <span v-else>Enviando...</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Beneficios extra -->
        <div class="notify-modal__benefits">
          <h4 class="notify-modal__benefits-title">Al apuntarte obtienes:</h4>
          <div class="notify-modal__benefits-list">
            <div class="notify-modal__benefit">
              <span class="notify-modal__benefit-icon">🎯</span>
              <span class="notify-modal__benefit-text">Serás el primero en saberlo</span>
            </div>
            <div class="notify-modal__benefit">
              <span class="notify-modal__benefit-icon">💰</span>
              <span class="notify-modal__benefit-text">Descuento especial de lanzamiento</span>
            </div>
            <div class="notify-modal__benefit">
              <span class="notify-modal__benefit-icon">🚚</span>
              <span class="notify-modal__benefit-text">Primeras 3 entregas gratis</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TOAST NOTIFICATION -->
    <Transition name="toast">
      <div
        v-if="showToast"
        :class="[
          'toast-notification',
          `toast-notification--${toastType}`
        ]"
      >
        <div class="toast-notification__content">
          <div class="toast-notification__icon">
            <span v-if="toastType === 'success'">🎉</span>
            <span v-else-if="toastType === 'error'">❌</span>
            <span v-else>ℹ️</span>
          </div>
          <div class="toast-notification__message">
            {{ toastMessage }}
          </div>
          <button
            @click="closeToast"
            class="toast-notification__close"
            aria-label="Cerrar notificación"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Barra de progreso -->
        <div class="toast-notification__progress">
          <div class="toast-notification__progress-bar"></div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { deliveryZones, cityInfo, type DeliveryZone } from '@/data/deliveryZonesData'

// Estados reactivos
const searchPostalCode = ref('')
const searchResult = ref<{ found: boolean; zone?: DeliveryZone } | null>(null)
const selectedCity = ref('zaragoza')
const activeCoverage = ref('all')

// Estados del modal
const showNotifyModal = ref(false)
const isSubmittingNotification = ref(false)
const notificationForm = ref({
  email: '',
  postalCode: '',
  city: '',
  acceptMarketing: false
})

// Estados del toast
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success') // 'success', 'error', 'info'

// Tipos de cobertura para filtros
const coverageTypes = [
  { id: 'all', name: 'Todas las Zonas', icon: '🗺️' },
  { id: 'complete', name: 'Cobertura Completa', icon: '🟢' },
  { id: 'partial', name: 'Cobertura Parcial', icon: '🟡' },
  { id: 'limited', name: 'Cobertura Limitada', icon: '🔴' }
]

// Computed properties
const sortedCities = computed(() => {
  return [...cityInfo].sort((a, b) => {
    if (a.status === 'active' && b.status !== 'active') return -1
    if (a.status !== 'active' && b.status === 'active') return 1
    if (a.status === 'coming_soon' && b.status === 'planned') return -1
    if (a.status === 'planned' && b.status === 'coming_soon') return 1
    return 0
  })
})

const filteredZones = computed(() => {
  const zones = deliveryZones.filter(zone => zone.city.toLowerCase() === selectedCity.value)

  if (activeCoverage.value === 'all') {
    return zones
  }

  return zones.filter(zone => zone.coverage === activeCoverage.value)
})

// Métodos
const searchZone = () => {
  if (!searchPostalCode.value.trim()) {
    searchResult.value = null
    return
  }

  const foundZone = deliveryZones.find(zone =>
    zone.postalCodes.includes(searchPostalCode.value.trim())
  )

  searchResult.value = {
    found: !!foundZone,
    zone: foundZone
  }
}

const selectCity = (cityId: string) => {
  selectedCity.value = cityId
  // Scroll suavemente a la sección de zonas
  const zonesSection = document.querySelector('.zones-section')
  if (zonesSection) {
    zonesSection.scrollIntoView({ behavior: 'smooth' })
  }
}

const setActiveCoverage = (coverage: string) => {
  activeCoverage.value = coverage
}

const formatLaunchDate = (dateString?: string) => {
  if (!dateString) return 'Fecha por confirmar'

  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long'
  })
}

// Métodos del Modal
const openNotifyModal = () => {
  showNotifyModal.value = true
  document.body.style.overflow = 'hidden' // Bloquear scroll del body
}

const closeNotifyModal = () => {
  showNotifyModal.value = false
  document.body.style.overflow = '' // Restaurar scroll del body
  // Limpiar formulario
  notificationForm.value = {
    email: '',
    postalCode: '',
    city: '',
    acceptMarketing: false
  }
}

const submitNotification = async () => {
  isSubmittingNotification.value = true

  try {
    // Aquí enviarías los datos al backend
    console.log('Enviando notificación:', notificationForm.value)

    // Simular envío
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Mostrar éxito con toast personalizado
    showToastMessage('¡Perfecto! Te notificaremos cuando lleguemos a tu zona 🎉', 'success')
    closeNotifyModal()

  } catch (error) {
    console.error('Error al enviar notificación:', error)
    showToastMessage('Error al enviar. Por favor, inténtalo de nuevo.', 'error')
  } finally {
    isSubmittingNotification.value = false
  }
}

// Método para mostrar toast
const showToastMessage = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true

  // Auto-ocultar después de 4 segundos
  setTimeout(() => {
    showToast.value = false
  }, 4000)
}

// Método para cerrar toast manualmente
const closeToast = () => {
  showToast.value = false
}

// Cerrar modal con ESC
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && showNotifyModal.value) {
    closeNotifyModal()
  }
}

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = '' // Asegurar que el scroll se restaure
})
</script>

<style lang="scss" scoped>
.delivery-zones-view {
  min-height: 100vh;
}

.delivery-hero {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  padding: 8rem 2rem 6rem;
  color: white;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 200px),
      radial-gradient(circle at 80% 60%, rgba(255, 255, 255, 0.1) 0%, transparent 200px);
    z-index: 0;
  }

  &__container {
    max-width: 1400px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr;
    gap: 3rem;
    position: relative;
    z-index: 2;

    @media (min-width: 992px) {
      grid-template-columns: 1fr 1fr;
      align-items: center;
    }
  }

  &__content {
    text-align: center;

    @media (min-width: 992px) {
      text-align: left;
    }
  }

  &__title {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 1rem;
    line-height: 1.1;

    @media (min-width: 768px) {
      font-size: 3rem;
    }

    @media (min-width: 992px) {
      font-size: 3.5rem;
    }

    &-highlight {
      background: linear-gradient(to right, #FFC837, #FF8008);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        height: 6px;
        width: 100%;
        bottom: -2px;
        left: 0;
        background: linear-gradient(to right, #FFC837, #FF8008);
        border-radius: 3px;
        opacity: 0.7;
      }
    }
  }

  &__subtitle {
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 2rem;
    line-height: 1.6;
    max-width: 500px;

    @media (min-width: 992px) {
      margin: 0 0 2rem 0;
    }
  }

  &__search {
    margin-top: 1.5rem;
  }

  &__visual {
    position: relative;
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__bike {
    width: 100%;
    height: 100%;
    position: relative;
  }
}

.postal-search {
  display: flex;
  gap: 0.75rem;
  max-width: 500px;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }

  &__input {
    flex: 1;
    padding: 1rem 1.5rem;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 50px;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    font-size: 1rem;
    backdrop-filter: blur(10px);

    &::placeholder {
      color: rgba(255, 255, 255, 0.7);
    }

    &:focus {
      outline: none;
      border-color: rgba(255, 255, 255, 0.5);
      background: rgba(255, 255, 255, 0.15);
    }
  }

  &__btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 1.5rem;
    background: rgba(255, 255, 255, 0.2);
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50px;
    color: white;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);

    &:hover {
      background: rgba(255, 255, 255, 0.3);
      border-color: rgba(255, 255, 255, 0.5);
      transform: translateY(-2px);
    }
  }
}

.search-result {
  max-width: 500px;
  margin-top: 1rem;

  &__success {
    display: flex;
    gap: 1rem;
    padding: 1.5rem;
    background: rgba(34, 197, 94, 0.2);
    border: 2px solid rgba(34, 197, 94, 0.3);
    border-radius: 20px;
    backdrop-filter: blur(10px);
  }

  &__not-found {
    display: flex;
    gap: 1rem;
    padding: 1.5rem;
    background: rgba(239, 68, 68, 0.2);
    border: 2px solid rgba(239, 68, 68, 0.3);
    border-radius: 20px;
    backdrop-filter: blur(10px);
  }

  &__icon {
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  &__content {
    h3 {
      font-size: 1.1rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    p {
      font-size: 0.9rem;
      opacity: 0.9;
      margin-bottom: 0.5rem;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

.notify-btn {
  margin-top: 0.75rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }
}

.bike-animation {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .bike {
    font-size: 4rem;
    animation: bike-bounce 3s ease-in-out infinite;
  }

  .delivery-path {
    position: absolute;
    bottom: 20%;
    left: 10%;
    right: 10%;
    height: 2px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 1px;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 30%;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 1px;
      animation: path-progress 3s ease-in-out infinite;
    }
  }
}

.cities-section, .zones-section {
  padding: 4rem 2rem;
  background: #f8f9fa;

  &__container {
    max-width: 1400px;
    margin: 0 auto;
  }
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 2rem;

  &__icon {
    font-size: 1.5rem;
  }
}

.cities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.city-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &--active {
    cursor: pointer;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    }
  }

  &--coming_soon {
    border: 2px solid #f59e0b;
  }

  &--planned {
    opacity: 0.7;
    border: 2px solid #6b7280;
  }

  &__image-container {
    position: relative;
    height: 200px;
    overflow: hidden;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__status {
    position: absolute;
    top: 1rem;
    right: 1rem;
    padding: 0.6rem 1.2rem;
    border-radius: 25px;
    font-size: 0.85rem;
    font-weight: 700;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

    &--active {
      background: #22c55e;
      color: white;
      border: 2px solid #16a34a;
    }

    &--coming_soon {
      background: #f59e0b;
      color: white;
      border: 2px solid #d97706;
    }

    &--planned {
      background: #6b7280;
      color: white;
      border: 2px solid #4b5563;
    }
  }

  &__content {
    padding: 1.5rem;
  }

  &__name {
    font-size: 1.5rem;
    font-weight: 700;
    color: #2d3748;
    margin-bottom: 0.25rem;
  }

  &__province {
    color: #718096;
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }

  &__description {
    color: #4a5568;
    margin-bottom: 1rem;
    line-height: 1.5;
  }

  &__stats {
    display: flex;
    gap: 2rem;
  }

  &__launch {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__planned {
    color: #718096;
    font-style: italic;
  }
}

.stat {
  text-align: center;

  &__value {
    display: block;
    font-size: 1.5rem;
    font-weight: 700;
    color: #4facfe;
  }

  &__label {
    font-size: 0.8rem;
    color: #718096;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
}

.launch-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  background: #f59e0b;
  border: 2px solid #d97706;
  border-radius: 25px;
  color: white;
  font-weight: 700;
  font-size: 0.9rem;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.zones-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.coverage-filter {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 50px;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover, &--active {
    background: #4facfe;
    border-color: #4facfe;
    color: white;
    transform: translateY(-2px);
  }

  &__icon {
    font-size: 1rem;
  }

  &__text {
    font-weight: 600;
    font-size: 0.9rem;
  }
}

.zones-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 2rem;
}

.zone-card {
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
  }

  &--complete {
    border-left: 4px solid #10b981;
  }

  &--partial {
    border-left: 4px solid #f59e0b;
  }

  &--limited {
    border-left: 4px solid #ef4444;
  }

  &__header {
    margin-bottom: 1rem;
  }

  &__name {
    font-size: 1.3rem;
    font-weight: 700;
    color: #2d3748;
    margin-bottom: 0.5rem;
  }

  &__coverage {
    display: inline-flex;
    align-items: center;
    padding: 0.4rem 1rem;
    border-radius: 25px;
    font-size: 0.85rem;
    font-weight: 700;
    border: 2px solid;

    &--complete {
      background: #22c55e;
      color: white;
      border-color: #16a34a;
    }

    &--partial {
      background: #f59e0b;
      color: white;
      border-color: #d97706;
    }

    &--limited {
      background: #ef4444;
      color: white;
      border-color: #dc2626;
    }
  }

  &__details {
    margin-bottom: 1rem;
  }

  &__postal-title,
  &__landmarks-title,
  &__cuisines-title {
    font-size: 0.9rem;
    font-weight: 600;
    color: #4a5568;
    margin-bottom: 0.5rem;
  }

  &__postal-codes,
  &__landmarks,
  &__cuisines {
    margin-bottom: 1rem;
  }

  &__notes {
    margin-bottom: 1rem;
  }
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;

  &__icon {
    font-size: 1rem;
    width: 20px;
  }

  &__text {
    font-size: 0.9rem;
    color: #4a5568;
  }
}

.postal-codes-list,
.landmarks-list,
.cuisines-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.postal-code,
.landmark,
.cuisine-tag {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.postal-code {
  background: #e0f2fe;
  color: #0369a1;
}

.landmark {
  background: #f3e8ff;
  color: #7c3aed;
}

.cuisine-tag {
  background: #ecfdf5;
  color: #059669;
}

.special-note {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 10px;

  &__icon {
    font-size: 1rem;
    flex-shrink: 0;
    margin-top: 0.1rem;
  }

  &__text {
    font-size: 0.85rem;
    color: #92400e;
    line-height: 1.4;
  }
}

.delivery-cta {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 4rem 2rem;
  text-align: center;
  color: white;

  &__container {
    max-width: 800px;
    margin: 0 auto;
  }

  &__title {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }

  &__subtitle {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    opacity: 0.9;
    line-height: 1.6;
  }

  &__button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 2rem;
    background: rgba(255, 255, 255, 0.2);
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50px;
    color: white;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);

    &:hover {
      background: rgba(255, 255, 255, 0.3);
      border-color: rgba(255, 255, 255, 0.5);
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    }
  }
}

// ESTILOS DEL MODAL
.notify-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
  backdrop-filter: blur(5px);
  animation: modal-overlay-enter 0.3s ease;
}

.notify-modal {
  background: white;
  border-radius: 20px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  animation: modal-enter 0.3s ease;
}

.notify-modal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.5rem 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.notify-modal__title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
}

.notify-modal__close {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: #718096;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    background: #f7fafc;
    color: #2d3748;
  }
}

.notify-modal__content {
  padding: 1.5rem;
}

.notify-modal__description {
  color: #4a5568;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.notify-modal__form {
  margin-bottom: 1.5rem;
}

.notify-modal__form-group {
  margin-bottom: 1rem;
}

.notify-modal__label {
  display: block;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.notify-modal__input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4facfe;
    box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.1);
  }
}

.notify-modal__checkbox {
  margin-right: 0.5rem;
}

.notify-modal__actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.notify-modal__btn {
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;

  &--secondary {
    background: #f7fafc;
    color: #4a5568;
    border-color: #e2e8f0;

    &:hover {
      background: #edf2f7;
      border-color: #cbd5e0;
    }
  }

  &--primary {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    color: white;

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(79, 172, 254, 0.3);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
  }
}

.notify-modal__benefits {
  padding: 1rem 1.5rem 1.5rem;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

.notify-modal__benefits-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
}

.notify-modal__benefits-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.notify-modal__benefit {
  display: flex;
  align-items: center;
  gap: 0.75rem;

  &-icon {
    font-size: 1.2rem;
    flex-shrink: 0;
  }

  &-text {
    font-size: 0.85rem;
    color: #4a5568;
  }
}

@keyframes modal-overlay-enter {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes modal-enter {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes bike-bounce {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(2deg); }
}

@keyframes path-progress {
  0% { width: 0%; }
  50% { width: 60%; }
  100% { width: 30%;   }
}

// ESTILOS DEL TOAST
.toast-notification {
  position: fixed;
  top: 2rem;
  right: 2rem;
  z-index: 10000;
  max-width: 400px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  border-left: 4px solid;

  &--success {
    border-left-color: #10b981;
  }

  &--error {
    border-left-color: #ef4444;
  }

  &--info {
    border-left-color: #3b82f6;
  }

  &__content {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1.25rem;
  }

  &__icon {
    font-size: 1.5rem;
    flex-shrink: 0;
    margin-top: 0.1rem;
  }

  &__message {
    flex: 1;
    font-size: 0.95rem;
    font-weight: 500;
    color: #2d3748;
    line-height: 1.5;
  }

  &__close {
    background: none;
    border: none;
    padding: 0.25rem;
    cursor: pointer;
    color: #64748b;
    border-radius: 50%;
    transition: all 0.2s ease;
    flex-shrink: 0;

    &:hover {
      background: #f1f5f9;
      color: #374151;
    }
  }

  &__progress {
    position: relative;
    height: 3px;
    background: #f1f5f9;
  }

  &__progress-bar {
    height: 100%;
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    animation: toast-progress 4s linear forwards;
  }
}

// Transiciones del toast
.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.95);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.95);
}

@keyframes toast-progress {
  from { width: 100%; }
  to { width: 0%; }
}

@media (max-width: 768px) {
  .delivery-hero {
    padding: 6rem 1rem 4rem;

    &__title {
      font-size: 2rem;
    }

    &__subtitle {
      font-size: 1rem;
    }
  }

  .cities-grid {
    grid-template-columns: 1fr;
  }

  .zones-grid {
    grid-template-columns: 1fr;
  }

  .postal-search {
    flex-direction: column;
  }

  .zones-filters {
    justify-content: center;
  }

  .notify-modal {
    margin: 1rem;
    max-height: calc(100vh - 2rem);
  }

  .notify-modal__actions {
    flex-direction: column;
  }

  .toast-notification {
    top: 1rem;
    right: 1rem;
    left: 1rem;
    max-width: none;
  }
}
</style>
