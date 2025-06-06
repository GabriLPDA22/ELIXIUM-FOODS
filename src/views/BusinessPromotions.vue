<!-- src/views/BusinessPromotions.vue -->
<template>
  <div class="business-promotions">
    <!-- Header con selector de restaurante -->
    <div class="business-promotions__header">
      <div class="business-promotions__title-section">
        <h1 class="business-promotions__title">Gestión de Promociones</h1>
        <p class="business-promotions__subtitle">Administra las ofertas y descuentos de tus restaurantes</p>
      </div>

      <!-- Restaurant Selector -->
      <div class="business-promotions__restaurant-selector">
        <label for="restaurantSelect" class="business-promotions__selector-label">Restaurante:</label>
        <select
          id="restaurantSelect"
          v-model="selectedRestaurantId"
          @change="onRestaurantChange"
          class="business-promotions__selector"
          :disabled="loadingRestaurants"
        >
          <option value="" disabled>{{ loadingRestaurants ? 'Cargando...' : 'Selecciona un restaurante' }}</option>
          <option v-for="restaurant in restaurants" :key="restaurant.id" :value="restaurant.id">
            {{ restaurant.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Restaurant Info Card (si hay uno seleccionado) -->
    <div v-if="selectedRestaurant" class="business-promotions__restaurant-info">
      <div class="business-promotions__restaurant-card">
        <img
          v-if="selectedRestaurant.logoUrl"
          :src="selectedRestaurant.logoUrl"
          :alt="selectedRestaurant.name"
          class="business-promotions__restaurant-logo"
        >
        <div class="business-promotions__restaurant-details">
          <h3 class="business-promotions__restaurant-name">{{ selectedRestaurant.name }}</h3>
          <p class="business-promotions__restaurant-description">{{ selectedRestaurant.description }}</p>
          <div class="business-promotions__restaurant-stats">
            <span class="business-promotions__stat">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              {{ selectedRestaurant.averageRating?.toFixed(1) || 'N/A' }}
            </span>
            <span class="business-promotions__stat">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              {{ selectedRestaurant.estimatedDeliveryTime || 0 }} min
            </span>
            <span class="business-promotions__stat" :class="{ 'business-promotions__stat--open': selectedRestaurant.isOpen }">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"></path>
              </svg>
              {{ selectedRestaurant.isOpen ? 'Abierto' : 'Cerrado' }}
            </span>
          </div>
        </div>
        <button @click="openNewPromotionModal" class="business-promotions__add-btn" :disabled="!selectedRestaurantId">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>Nueva Promoción</span>
        </button>
      </div>
    </div>

    <!-- Mensaje si no hay restaurante seleccionado -->
    <div v-if="!selectedRestaurantId && !loadingRestaurants" class="business-promotions__no-selection">
      <div class="business-promotions__no-selection-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      </div>
      <h3>Selecciona un restaurante</h3>
      <p>Elige un restaurante para ver y gestionar sus promociones</p>
    </div>

    <!-- Contenido de promociones (solo si hay restaurante seleccionado) -->
    <div v-if="selectedRestaurantId">
      <!-- Tabs -->
      <div class="business-promotions__tabs">
        <button v-for="tab in tabs" :key="tab.value" @click="activeTab = tab.value"
          :class="['business-promotions__tab', { 'business-promotions__tab--active': activeTab === tab.value }]">
          {{ tab.label }}
          <span class="business-promotions__tab-count">{{ getPromotionsCount(tab.value) }}</span>
        </button>
      </div>

      <!-- Content -->
      <div class="business-promotions__content">
        <!-- Loading state -->
        <div v-if="loading" class="business-promotions__loading">
          <div class="business-promotions__spinner"></div>
          <p>Cargando promociones de {{ selectedRestaurant?.name }}...</p>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="business-promotions__error">
          <div class="business-promotions__error-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
          <h3>Error cargando promociones</h3>
          <p>{{ error }}</p>
          <button @click="loadPromotions" class="business-promotions__retry-button">
            Intentar de nuevo
          </button>
        </div>

        <!-- Empty state -->
        <div v-else-if="filteredPromotions.length === 0" class="business-promotions__empty">
          <div class="business-promotions__empty-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
            </svg>
          </div>
          <h3>No hay promociones {{ getEmptyStateText() }}</h3>
          <p>{{ getEmptyStateDescription() }}</p>
          <button @click="openNewPromotionModal" class="business-promotions__empty-button">
            Crear Nueva Promoción
          </button>
        </div>

        <!-- Promotions grid -->
        <div v-else class="business-promotions__grid">
          <div v-for="promotion in filteredPromotions" :key="promotion.id" class="business-promotions__card">
            <div class="business-promotions__card-banner" :style="{ backgroundColor: getPromotionColor(promotion.discountType) }">
              <span class="business-promotions__card-type">{{ getPromotionTypeLabel(promotion.discountType) }}</span>
            </div>

            <div class="business-promotions__card-content">
              <div class="business-promotions__card-header">
                <h3 class="business-promotions__card-title">{{ promotion.name }}</h3>
                <div
                  :class="['business-promotions__card-status', `business-promotions__card-status--${promotion.status}`]">
                  {{ getStatusLabel(promotion.status) }}
                </div>
              </div>

              <p class="business-promotions__card-description">{{ promotion.description }}</p>

              <!-- Product info with enhanced display -->
              <div class="business-promotions__card-product">
                <img v-if="promotion.productImageUrl" :src="promotion.productImageUrl" :alt="promotion.productName" class="business-promotions__product-image">
                <div class="business-promotions__product-info">
                  <span class="business-promotions__product-name">{{ promotion.productName }}</span>
                  <span class="business-promotions__discount-badge" :class="getDiscountBadgeClass(promotion)">
                    {{ offerUtils.formatDiscount(promotion.discountType, promotion.discountValue) }}
                  </span>
                </div>
                <!-- Hot offer indicator -->
                <div v-if="offerUtils.isHotOffer(promotion)" class="business-promotions__hot-badge">
                  🔥 HOT
                </div>
              </div>

              <div class="business-promotions__card-details">
                <div class="business-promotions__card-item">
                  <span class="business-promotions__item-label">Descuento:</span>
                  <span class="business-promotions__item-value">
                    {{ promotion.discountType === 'percentage' ? `${promotion.discountValue}%` :
                      `${formatCurrency(promotion.discountValue)}` }}
                  </span>
                </div>

                <div class="business-promotions__card-item">
                  <span class="business-promotions__item-label">Validez:</span>
                  <div class="business-promotions__validity-info">
                    <span class="business-promotions__item-value">
                      {{ formatDate(promotion.startDate) }} - {{ formatDate(promotion.endDate) }}
                    </span>
                    <span v-if="getTimeRemaining(promotion)" class="business-promotions__time-remaining" :class="{ 'business-promotions__time-remaining--urgent': offerUtils.isExpiringOffer(promotion) }">
                      ⏰ {{ getTimeRemaining(promotion) }}
                    </span>
                  </div>
                </div>

                <div class="business-promotions__card-item" v-if="promotion.minimumOrderAmount > 0">
                  <span class="business-promotions__item-label">Pedido mínimo:</span>
                  <span class="business-promotions__item-value">{{ formatCurrency(promotion.minimumOrderAmount) }}</span>
                </div>

                <div class="business-promotions__card-item" v-if="promotion.minimumQuantity > 1">
                  <span class="business-promotions__item-label">Cantidad mínima:</span>
                  <span class="business-promotions__item-value">{{ promotion.minimumQuantity }}</span>
                </div>

                <div class="business-promotions__card-item" v-if="promotion.usageLimit > 0">
                  <span class="business-promotions__item-label">Usos:</span>
                  <div class="business-promotions__usage-info">
                    <span class="business-promotions__item-value">{{ promotion.usageCount }} / {{ promotion.usageLimit }}</span>
                    <div class="business-promotions__usage-bar">
                      <div class="business-promotions__usage-progress" :style="{ width: `${(promotion.usageCount / promotion.usageLimit) * 100}%` }"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="business-promotions__card-actions">
              <button @click="editPromotion(promotion)"
                class="business-promotions__action-btn business-promotions__action-btn--edit">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                <span>Editar</span>
              </button>

              <button v-if="promotion.status === 'active'" @click="deactivatePromotion(promotion)"
                class="business-promotions__action-btn business-promotions__action-btn--deactivate">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                </svg>
                <span>Desactivar</span>
              </button>

              <button v-if="promotion.status === 'inactive'" @click="activatePromotion(promotion)"
                class="business-promotions__action-btn business-promotions__action-btn--activate">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span>Activar</span>
              </button>

              <button @click="duplicatePromotion(promotion)"
                class="business-promotions__action-btn business-promotions__action-btn--duplicate">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                <span>Duplicar</span>
              </button>

              <button @click="deletePromotion(promotion)"
                class="business-promotions__action-btn business-promotions__action-btn--delete">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
                <span>Eliminar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- New/Edit Promotion Modal -->
    <div v-if="showPromotionModal" class="business-promotions__modal" @click="closeModal">
      <div class="business-promotions__modal-content" @click.stop>
        <div class="business-promotions__modal-header">
          <h2 class="business-promotions__modal-title">
            {{ editingPromotion ? 'Editar Promoción' : 'Nueva Promoción' }}
          </h2>
          <span class="business-promotions__modal-restaurant">{{ selectedRestaurant?.name }}</span>
          <button @click="closeModal" class="business-promotions__modal-close">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="business-promotions__modal-body">
          <form @submit.prevent="savePromotion" class="business-promotions__form">
            <div class="business-promotions__form-row">
              <div class="business-promotions__form-group">
                <label for="promotionName" class="business-promotions__form-label">Nombre de la promoción*</label>
                <input type="text" id="promotionName" v-model="promotionForm.name"
                  class="business-promotions__form-input" placeholder="Ej. Descuento especial pizza" required>
              </div>

              <div class="business-promotions__form-group">
                <label for="productSelect" class="business-promotions__form-label">Producto*</label>
                <select id="productSelect" v-model="promotionForm.productId" class="business-promotions__form-select" required>
                  <option value="">Seleccionar producto</option>
                  <option v-for="product in availableProducts" :key="product.id" :value="product.id">
                    {{ product.name }} - {{ formatCurrency(product.price || product.basePrice || 0) }}
                  </option>
                </select>
              </div>
            </div>

            <div class="business-promotions__form-group">
              <label for="promotionDescription" class="business-promotions__form-label">Descripción</label>
              <textarea id="promotionDescription" v-model="promotionForm.description"
                class="business-promotions__form-textarea" placeholder="Describe brevemente esta promoción"></textarea>
            </div>

            <div class="business-promotions__form-row">
              <div class="business-promotions__form-group">
                <label for="discountType" class="business-promotions__form-label">Tipo de descuento*</label>
                <select id="discountType" v-model="promotionForm.discountType" class="business-promotions__form-select" required>
                  <option value="percentage">Porcentaje (%)</option>
                  <option value="fixed">Importe fijo (€)</option>
                </select>
              </div>

              <div class="business-promotions__form-group">
                <label for="discountValue" class="business-promotions__form-label">
                  {{ promotionForm.discountType === 'percentage' ? 'Porcentaje de descuento*' : 'Importe de descuento*' }}
                </label>
                <input type="number" id="discountValue" v-model="promotionForm.discountValue"
                  class="business-promotions__form-input"
                  :placeholder="promotionForm.discountType === 'percentage' ? 'Ej. 15' : 'Ej. 5.99'"
                  :min="promotionForm.discountType === 'percentage' ? 1 : 0.01"
                  :step="promotionForm.discountType === 'percentage' ? 1 : 0.01"
                  :max="promotionForm.discountType === 'percentage' ? 100 : null" required>
              </div>
            </div>

            <div class="business-promotions__form-row">
              <div class="business-promotions__form-group">
                <label for="startDate" class="business-promotions__form-label">Fecha de inicio*</label>
                <input type="date" id="startDate" v-model="promotionForm.startDate"
                  class="business-promotions__form-input" required>
              </div>

              <div class="business-promotions__form-group">
                <label for="endDate" class="business-promotions__form-label">Fecha de fin*</label>
                <input type="date" id="endDate" v-model="promotionForm.endDate" class="business-promotions__form-input"
                  :min="promotionForm.startDate" required>
              </div>
            </div>

            <div class="business-promotions__form-row">
              <div class="business-promotions__form-group">
                <label for="minimumOrderValue" class="business-promotions__form-label">Pedido mínimo (€)</label>
                <input type="number" id="minimumOrderValue" v-model="promotionForm.minimumOrderAmount"
                  class="business-promotions__form-input" placeholder="Ej. 15.00" min="0" step="0.01">
              </div>

              <div class="business-promotions__form-group">
                <label for="minimumQuantity" class="business-promotions__form-label">Cantidad mínima</label>
                <input type="number" id="minimumQuantity" v-model="promotionForm.minimumQuantity"
                  class="business-promotions__form-input" placeholder="Ej. 2" min="1" step="1">
              </div>
            </div>

            <div class="business-promotions__form-row">
              <div class="business-promotions__form-group">
                <label for="usageLimit" class="business-promotions__form-label">Límite de usos (0 = sin límite)</label>
                <input type="number" id="usageLimit" v-model="promotionForm.usageLimit"
                  class="business-promotions__form-input" placeholder="Ej. 100" min="0" step="1">
              </div>
            </div>

            <div class="business-promotions__modal-footer">
              <button type="button" @click="closeModal"
                class="business-promotions__modal-btn business-promotions__modal-btn--secondary">
                Cancelar
              </button>
              <button type="submit" class="business-promotions__modal-btn business-promotions__modal-btn--primary"
                :disabled="submitting">
                {{ submitting ? 'Guardando...' : (editingPromotion ? 'Guardar Cambios' : 'Crear Promoción') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showConfirmation" class="business-promotions__modal" @click="cancelConfirmation">
      <div class="business-promotions__modal-content business-promotions__modal-content--small" @click.stop>
        <div class="business-promotions__modal-header">
          <h2 class="business-promotions__modal-title">{{ confirmationTitle }}</h2>
          <button @click="cancelConfirmation" class="business-promotions__modal-close">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="business-promotions__modal-body">
          <p class="business-promotions__confirmation-message">{{ confirmationMessage }}</p>
        </div>

        <div class="business-promotions__modal-footer">
          <button @click="cancelConfirmation"
            class="business-promotions__modal-btn business-promotions__modal-btn--secondary">
            Cancelar
          </button>
          <button @click="confirmAction" class="business-promotions__modal-btn" :class="confirmationActionClass"
            :disabled="submitting">
            {{ submitting ? 'Procesando...' : confirmationAction }}
          </button>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <ToastNotification ref="toastNotification" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { promotionsService, type CreateProductOfferDto } from '@/services/promotionsService'
import { productOfferService, type ProductOfferDto, offerUtils } from '@/services/productOfferService'
import { productService, type Product } from '@/services/productService'
import { restaurantService, type RestaurantCard } from '@/services/restaurantService'
import { useAuthStore } from '@/stores/auth'
import ToastNotification from '@/components/ui/ToastNotification.vue'

// Auth store to get business info
const authStore = useAuthStore()

// Toast notification ref
const toastNotification = ref()

// Estado reactivo
const loadingRestaurants = ref(true)
const loading = ref(false)
const error = ref<string | null>(null)
const submitting = ref(false)
const restaurants = ref<RestaurantCard[]>([])
const selectedRestaurantId = ref<number | null>(null)
const promotions = ref<ProductOfferDto[]>([])
const availableProducts = ref<Product[]>([])
const activeTab = ref('all')
const showPromotionModal = ref(false)
const editingPromotion = ref<ProductOfferDto | null>(null)
const showConfirmation = ref(false)
const pendingAction = ref<string | null>(null)
const pendingPromotionId = ref<number | null>(null)
const confirmationTitle = ref('')
const confirmationMessage = ref('')
const confirmationAction = ref('')
const confirmationActionClass = ref('')

// Formulario para nueva/editar promoción
const promotionForm = ref({
  id: null as number | null,
  name: '',
  description: '',
  discountType: 'percentage',
  discountValue: 0,
  startDate: new Date().toISOString().split('T')[0],
  endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
  minimumOrderAmount: 0,
  minimumQuantity: 1,
  usageLimit: 0,
  productId: null as number | null
})

// Datos de pestañas
const tabs = [
  { label: 'Todas', value: 'all' },
  { label: 'Activas', value: 'active' },
  { label: 'Inactivas', value: 'inactive' },
  { label: 'Expiradas', value: 'expired' }
]

// Computed para obtener el restaurante seleccionado
const selectedRestaurant = computed(() => {
  if (!selectedRestaurantId.value) return null
  return restaurants.value.find(r => r.id === selectedRestaurantId.value) || null
})

// Cargar datos iniciales
onMounted(async () => {
  await loadRestaurants()
})

// Watch para cargar datos cuando cambia el restaurante seleccionado
watch(selectedRestaurantId, async (newRestaurantId) => {
  if (newRestaurantId) {
    await Promise.all([
      loadPromotions(),
      loadAvailableProducts()
    ])
  } else {
    promotions.value = []
    availableProducts.value = []
  }
})

// Cargar restaurantes del business
const loadRestaurants = async () => {
  try {
    loadingRestaurants.value = true
    error.value = null

    // Usar el método disponible en tu restaurantService
    const data = await restaurantService.getAllRestaurants()
    restaurants.value = data

    // Auto-seleccionar el primer restaurante si solo hay uno
    if (data.length === 1) {
      selectedRestaurantId.value = data[0].id
    }
  } catch (err: any) {
    error.value = err.message || 'Error cargando restaurantes'
    console.error('Error loading restaurants:', err)
  } finally {
    loadingRestaurants.value = false
  }
}

// Manejar cambio de restaurante
const onRestaurantChange = () => {
  activeTab.value = 'all' // Reset tab when changing restaurant
}

// Cargar promociones del backend
const loadPromotions = async () => {
  if (!selectedRestaurantId.value) return

  try {
    loading.value = true
    error.value = null
    const data = await promotionsService.getOffersByRestaurant(selectedRestaurantId.value)
    promotions.value = data
  } catch (err: any) {
    error.value = err.message || 'Error cargando promociones'
    console.error('Error loading promotions:', err)
  } finally {
    loading.value = false
  }
}

// Cargar productos disponibles
const loadAvailableProducts = async () => {
  if (!selectedRestaurantId.value) return

  try {
    const data = await productService.getProductsByRestaurant(selectedRestaurantId.value)
    availableProducts.value = data
  } catch (err: any) {
    console.error('Error loading products:', err)
  }
}

// Filtrar promociones según la pestaña activa
const filteredPromotions = computed(() => {
  if (activeTab.value === 'all') {
    return promotions.value
  } else if (activeTab.value === 'active') {
    return promotions.value.filter(p => p.status === 'active')
  } else if (activeTab.value === 'inactive') {
    return promotions.value.filter(p => p.status === 'inactive')
  } else if (activeTab.value === 'expired') {
    const today = new Date()
    return promotions.value.filter(p =>
      p.status === 'expired' || new Date(p.endDate) < today
    )
  }
  return promotions.value
})

// Obtener conteo de promociones por pestaña
const getPromotionsCount = (tabValue: string) => {
  if (tabValue === 'all') {
    return promotions.value.length
  } else if (tabValue === 'active') {
    return promotions.value.filter(p => p.status === 'active').length
  } else if (tabValue === 'inactive') {
    return promotions.value.filter(p => p.status === 'inactive').length
  } else if (tabValue === 'expired') {
    const today = new Date()
    return promotions.value.filter(p =>
      p.status === 'expired' || new Date(p.endDate) < today
    ).length
  }
  return 0
}

// Obtener texto de estado vacío
const getEmptyStateText = () => {
  switch (activeTab.value) {
    case 'active': return 'activas'
    case 'inactive': return 'inactivas'
    case 'expired': return 'expiradas'
    default: return ''
  }
}

// Obtener descripción de estado vacío
const getEmptyStateDescription = () => {
  const restaurantName = selectedRestaurant.value?.name || 'este restaurante'
  switch (activeTab.value) {
    case 'active': return `${restaurantName} no tiene promociones activas actualmente`
    case 'inactive': return `${restaurantName} no tiene promociones inactivas`
    case 'expired': return `${restaurantName} no tiene promociones expiradas`
    default: return `${restaurantName} no tiene promociones creadas aún`
  }
}

// Obtener tiempo restante usando offerUtils
const getTimeRemaining = (promotion: ProductOfferDto) => {
  return offerUtils.getTimeRemaining(promotion.endDate)
}

// Obtener clase de badge de descuento
const getDiscountBadgeClass = (promotion: ProductOfferDto) => {
  return {
    'business-promotions__discount-badge--percentage': promotion.discountType === 'percentage',
    'business-promotions__discount-badge--fixed': promotion.discountType === 'fixed',
    'business-promotions__discount-badge--hot': offerUtils.isHotOffer(promotion)
  }
}

// Formatear fechas
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Formatear moneda
const formatCurrency = (value: number) => {
  return value.toFixed(2).replace('.', ',') + ' €'
}

// Obtener etiqueta de tipo de promoción
const getPromotionTypeLabel = (type: string) => {
  switch (type) {
    case 'percentage':
      return 'Porcentaje'
    case 'fixed':
      return 'Importe fijo'
    default:
      return type
  }
}

// Obtener color de fondo para el tipo de promoción
const getPromotionColor = (type: string) => {
  switch (type) {
    case 'percentage':
      return '#3b82f6' // Azul
    case 'fixed':
      return '#10b981' // Verde
    default:
      return '#64748b' // Gris
  }
}

// Obtener etiqueta de estado
const getStatusLabel = (status: string) => {
  switch (status) {
    case 'active':
      return 'Activa'
    case 'inactive':
      return 'Inactiva'
    case 'scheduled':
      return 'Programada'
    case 'expired':
      return 'Expirada'
    default:
      return status
  }
}

// Abrir modal para nueva promoción
const openNewPromotionModal = () => {
  if (!selectedRestaurantId.value) return

  editingPromotion.value = null
  promotionForm.value = {
    id: null,
    name: '',
    description: '',
    discountType: 'percentage',
    discountValue: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
    minimumOrderAmount: 0,
    minimumQuantity: 1,
    usageLimit: 0,
    productId: null
  }
  showPromotionModal.value = true
}

// Editar promoción existente
const editPromotion = (promotion: ProductOfferDto) => {
  editingPromotion.value = promotion
  promotionForm.value = {
    id: promotion.id,
    name: promotion.name,
    description: promotion.description,
    discountType: promotion.discountType,
    discountValue: promotion.discountValue,
    startDate: new Date(promotion.startDate).toISOString().split('T')[0],
    endDate: new Date(promotion.endDate).toISOString().split('T')[0],
    minimumOrderAmount: promotion.minimumOrderAmount,
    minimumQuantity: promotion.minimumQuantity,
    usageLimit: promotion.usageLimit,
    productId: promotion.productId
  }
  showPromotionModal.value = true
}

// Cerrar modal
const closeModal = () => {
  showPromotionModal.value = false
  editingPromotion.value = null
}

// Guardar promoción (nueva o editada)
const savePromotion = async () => {
  if (!promotionForm.value.productId || !selectedRestaurantId.value) {
    toastNotification.value?.useToast().error('Por favor selecciona un producto')
    return
  }

  try {
    submitting.value = true

    const promotionData: CreateProductOfferDto = {
      name: promotionForm.value.name,
      description: promotionForm.value.description,
      discountType: promotionForm.value.discountType,
      discountValue: promotionForm.value.discountValue,
      minimumOrderAmount: promotionForm.value.minimumOrderAmount,
      minimumQuantity: promotionForm.value.minimumQuantity,
      startDate: promotionForm.value.startDate,
      endDate: promotionForm.value.endDate,
      usageLimit: promotionForm.value.usageLimit,
      productId: promotionForm.value.productId
    }

    if (editingPromotion.value) {
      // Actualizar promoción existente
      await promotionsService.updateOffer(selectedRestaurantId.value, editingPromotion.value.id, promotionData)
    } else {
      // Crear nueva promoción
      await promotionsService.createOffer(selectedRestaurantId.value, promotionData)
    }

    // Recargar promociones
    await loadPromotions()
    showPromotionModal.value = false
  } catch (err: any) {
    toastNotification.value?.useToast().error(err.message || 'Error guardando promoción')
  } finally {
    submitting.value = false
  }
}

// Desactivar promoción
const deactivatePromotion = (promotion: ProductOfferDto) => {
  confirmationTitle.value = 'Desactivar Promoción'
  confirmationMessage.value = `¿Estás seguro de que quieres desactivar la promoción "${promotion.name}"?`
  confirmationAction.value = 'Desactivar'
  confirmationActionClass.value = 'business-promotions__modal-btn--warning'
  pendingAction.value = 'deactivate'
  pendingPromotionId.value = promotion.id
  showConfirmation.value = true
}

// Activar promoción
const activatePromotion = (promotion: ProductOfferDto) => {
  confirmationTitle.value = 'Activar Promoción'
  confirmationMessage.value = `¿Estás seguro de que quieres activar la promoción "${promotion.name}"?`
  confirmationAction.value = 'Activar'
  confirmationActionClass.value = 'business-promotions__modal-btn--success'
  pendingAction.value = 'activate'
  pendingPromotionId.value = promotion.id
  showConfirmation.value = true
}

// Duplicar promoción
const duplicatePromotion = (promotion: ProductOfferDto) => {
  editingPromotion.value = null
  promotionForm.value = {
    id: null,
    name: `${promotion.name} (Copia)`,
    description: promotion.description,
    discountType: promotion.discountType,
    discountValue: promotion.discountValue,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
    minimumOrderAmount: promotion.minimumOrderAmount,
    minimumQuantity: promotion.minimumQuantity,
    usageLimit: promotion.usageLimit,
    productId: promotion.productId
  }
  showPromotionModal.value = true
}

// Eliminar promoción
const deletePromotion = (promotion: ProductOfferDto) => {
  confirmationTitle.value = 'Eliminar Promoción'
  confirmationMessage.value = `¿Estás seguro de que quieres eliminar la promoción "${promotion.name}"? Esta acción no se puede deshacer.`
  confirmationAction.value = 'Eliminar'
  confirmationActionClass.value = 'business-promotions__modal-btn--danger'
  pendingAction.value = 'delete'
  pendingPromotionId.value = promotion.id
  showConfirmation.value = true
}

// Cancelar confirmación
const cancelConfirmation = () => {
  showConfirmation.value = false
  pendingAction.value = null
  pendingPromotionId.value = null
}

// Confirmar acción pendiente
const confirmAction = async () => {
  if (!pendingPromotionId.value || !pendingAction.value || !selectedRestaurantId.value) return

  try {
    submitting.value = true

    if (pendingAction.value === 'deactivate') {
      await promotionsService.deactivateOffer(selectedRestaurantId.value, pendingPromotionId.value)
    } else if (pendingAction.value === 'activate') {
      await promotionsService.activateOffer(selectedRestaurantId.value, pendingPromotionId.value)
    } else if (pendingAction.value === 'delete') {
      await promotionsService.deleteOffer(selectedRestaurantId.value, pendingPromotionId.value)
    }

    // Recargar promociones
    await loadPromotions()
    showConfirmation.value = false
    pendingAction.value = null
    pendingPromotionId.value = null
  } catch (err: any) {
    toastNotification.value?.useToast().error(err.message || 'Error procesando acción')
  } finally {
    submitting.value = false
  }
}
</script>

<style lang="scss" scoped>
.business-promotions {
  padding: 1rem;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 2rem;
    gap: 2rem;

    @media (max-width: 1024px) {
      flex-direction: column;
      align-items: stretch;
      gap: 1.5rem;
    }
  }

  &__title-section {
    flex-grow: 1;
  }

  &__title {
    font-size: 2rem;
    font-weight: 700;
    margin: 0 0 0.5rem;
    color: #1e293b;
  }

  &__subtitle {
    font-size: 1rem;
    color: #64748b;
    margin: 0;
  }

  &__restaurant-selector {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-width: 280px;

    @media (max-width: 1024px) {
      min-width: 0;
    }
  }

  &__selector-label {
    font-size: 0.9rem;
    font-weight: 500;
    color: #1e293b;
  }

  &__selector {
    padding: 0.75rem 1rem;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    font-size: 1rem;
    color: #1e293b;
    background-color: white;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: #06a98d;
      box-shadow: 0 0 0 3px rgba(6, 169, 141, 0.1);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  &__restaurant-info {
    margin-bottom: 2rem;
  }

  &__restaurant-card {
    background: linear-gradient(135deg, #06a98d 0%, #058a73 100%);
    border-radius: 16px;
    padding: 1.5rem;
    color: white;
    display: flex;
    align-items: center;
    gap: 1.5rem;
    box-shadow: 0 8px 25px rgba(6, 169, 141, 0.2);

    @media (max-width: 768px) {
      flex-direction: column;
      text-align: center;
    }
  }

  &__restaurant-logo {
    width: 80px;
    height: 80px;
    border-radius: 12px;
    object-fit: cover;
    border: 3px solid rgba(255, 255, 255, 0.2);
    flex-shrink: 0;
  }

  &__restaurant-details {
    flex-grow: 1;
  }

  &__restaurant-name {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 0.5rem;
  }

  &__restaurant-description {
    font-size: 1rem;
    opacity: 0.9;
    margin: 0 0 1rem;
    line-height: 1.5;
  }

  &__restaurant-stats {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  &__stat {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    font-weight: 500;

    svg {
      width: 16px;
      height: 16px;
    }

    &--open {
      color: #10f981;
    }
  }

  &__add-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 12px;
    padding: 0.75rem 1.25rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    backdrop-filter: blur(10px);
    flex-shrink: 0;

    &:hover:not(:disabled) {
      background-color: rgba(255, 255, 255, 0.3);
      border-color: rgba(255, 255, 255, 0.5);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    svg {
      width: 20px;
      height: 20px;
    }

    @media (max-width: 768px) {
      width: 100%;
      justify-content: center;
    }
  }

  &__no-selection {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 1rem;
    text-align: center;
  }

  &__no-selection-icon {
    width: 80px;
    height: 80px;
    background-color: #f1f5f9;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #94a3b8;
    margin-bottom: 1.5rem;

    svg {
      width: 36px;
      height: 36px;
    }
  }

  &__no-selection h3 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0 0 0.5rem;
    color: #1e293b;
  }

  &__no-selection p {
    color: #64748b;
    margin: 0;
    max-width: 400px;
  }

  &__tabs {
    display: flex;
    overflow-x: auto;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    padding-bottom: 0.25rem;
    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &__tab {
    background: none;
    border: none;
    padding: 0.75rem 1.25rem;
    border-radius: 100px;
    font-size: 0.9rem;
    font-weight: 500;
    color: #64748b;
    cursor: pointer;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s ease;

    &:hover {
      background-color: #f1f5f9;
      color: #1e293b;
    }

    &--active {
      background-color: #f1f5f9;
      color: #1e293b;
      font-weight: 600;

      .business-promotions__tab-count {
        background-color: #06a98d;
        color: white;
      }
    }
  }

  &__tab-count {
    background-color: #e2e8f0;
    color: #64748b;
    font-size: 0.75rem;
    font-weight: 600;
    min-width: 22px;
    height: 22px;
    border-radius: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 6px;
  }

  &__content {
    min-height: 300px;
  }

  &__loading,
  &__empty,
  &__error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1rem;
    text-align: center;
  }

  &__spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #f1f5f9;
    border-radius: 50%;
    border-top-color: #06a98d;
    animation: spinner 1s linear infinite;
    margin-bottom: 1rem;
  }

  &__error-icon,
  &__empty-icon {
    width: 60px;
    height: 60px;
    background-color: #f1f5f9;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #94a3b8;
    margin-bottom: 1rem;

    svg {
      width: 28px;
      height: 28px;
    }
  }

  &__error-icon {
    background-color: #fee2e2;
    color: #dc2626;
  }

  &__empty h3,
  &__error h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0 0 0.5rem;
    color: #1e293b;
  }

  &__empty p,
  &__error p {
    color: #64748b;
    margin: 0 0 1.5rem;
    max-width: 400px;
  }

  &__empty-button,
  &__retry-button {
    background-color: #06a98d;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 0.75rem 1.25rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background-color: #058a73;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1.5rem;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  &__card {
    background-color: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    transition: all 0.3s ease;
    border: 1px solid #f1f5f9;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1);
    }
  }

  &__card-banner {
    height: 8px;
    width: 100%;
  }

  &__card-type {
    display: none;
  }

  &__card-content {
    padding: 1.5rem;
    flex-grow: 1;
  }

  &__card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
    gap: 1rem;
  }

  &__card-title {
    font-size: 1.2rem;
    font-weight: 600;
    margin: 0;
    color: #1e293b;
    line-height: 1.3;
  }

  &__card-status {
    font-size: 0.75rem;
    font-weight: 500;
    padding: 0.25rem 0.5rem;
    border-radius: 6px;
    flex-shrink: 0;

    &--active {
      background-color: #dcfce7;
      color: #16a34a;
    }

    &--inactive {
      background-color: #f1f5f9;
      color: #64748b;
    }

    &--scheduled {
      background-color: #dbeafe;
      color: #2563eb;
    }

    &--expired {
      background-color: #fee2e2;
      color: #dc2626;
    }
  }

  &__card-description {
    font-size: 0.9rem;
    color: #64748b;
    margin: 0 0 1.25rem;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__card-product {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.25rem;
    padding: 0.75rem;
    background-color: #f8fafc;
    border-radius: 8px;
    position: relative;
  }

  &__product-image {
    width: 40px;
    height: 40px;
    border-radius: 6px;
    object-fit: cover;
    flex-shrink: 0;
  }

  &__product-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex-grow: 1;
  }

  &__product-name {
    font-size: 0.9rem;
    font-weight: 500;
    color: #1e293b;
  }

  &__discount-badge {
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.125rem 0.375rem;
    border-radius: 4px;
    width: fit-content;

    &--percentage {
      background-color: #dbeafe;
      color: #2563eb;
    }

    &--fixed {
      background-color: #dcfce7;
      color: #16a34a;
    }

    &--hot {
      background-color: #fee2e2;
      color: #dc2626;
      animation: pulse 2s infinite;
    }
  }

  &__hot-badge {
    position: absolute;
    top: -5px;
    right: -5px;
    background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
    color: white;
    font-size: 0.6rem;
    font-weight: 700;
    padding: 0.125rem 0.25rem;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    animation: pulse 2s infinite;
  }

  &__card-details {
    margin-bottom: 1rem;
  }

  &__card-item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 0.5rem 0;
    border-bottom: 1px solid #f1f5f9;
    font-size: 0.9rem;
    gap: 1rem;

    &:last-child {
      border-bottom: none;
    }
  }

  &__item-label {
    color: #64748b;
    font-weight: 500;
    flex-shrink: 0;
  }

  &__item-value {
    font-weight: 500;
    color: #1e293b;
    text-align: right;
  }

  &__validity-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    align-items: flex-end;
  }

  &__time-remaining {
    font-size: 0.75rem;
    color: #10b981;
    font-weight: 500;

    &--urgent {
      color: #ef4444;
      animation: blink 1s infinite;
    }
  }

  &__usage-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    align-items: flex-end;
    min-width: 120px;
  }

  &__usage-bar {
    width: 100%;
    height: 4px;
    background-color: #e2e8f0;
    border-radius: 2px;
    overflow: hidden;
  }

  &__usage-progress {
    height: 100%;
    background: linear-gradient(90deg, #10b981, #059669);
    transition: width 0.3s ease;
  }

  &__card-actions {
    padding: 1rem 1.5rem;
    border-top: 1px solid #f1f5f9;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  &__action-btn {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.5rem 0.75rem;
    border-radius: 8px;
    border: none;
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    svg {
      width: 16px;
      height: 16px;
    }

    &--edit {
      background-color: #f1f5f9;
      color: #475569;

      &:hover {
        background-color: #e2e8f0;
      }
    }

    &--deactivate {
      background-color: #fef3c7;
      color: #d97706;

      &:hover {
        background-color: #fde68a;
      }
    }

    &--activate {
      background-color: #dcfce7;
      color: #16a34a;

      &:hover {
        background-color: #bbf7d0;
      }
    }

    &--duplicate {
      background-color: #e0e7ff;
      color: #4f46e5;

      &:hover {
        background-color: #c7d2fe;
      }
    }

    &--delete {
      background-color: #fee2e2;
      color: #dc2626;

      &:hover {
        background-color: #fecaca;
      }
    }
  }

  &__modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
  }

  &__modal-content {
    background-color: white;
    border-radius: 16px;
    max-width: 800px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;

    &--small {
      max-width: 480px;
    }
  }

  &__modal-header {
    padding: 1.5rem 2rem;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 10;
    gap: 1rem;
  }

  &__modal-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
    color: #1e293b;
  }

  &__modal-restaurant {
    font-size: 0.9rem;
    color: #06a98d;
    font-weight: 500;
    background-color: #f0fdfa;
    padding: 0.25rem 0.5rem;
    border-radius: 6px;
  }

  &__modal-close {
    background: none;
    border: none;
    padding: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #64748b;
    cursor: pointer;
    border-radius: 6px;

    &:hover {
      background-color: #f1f5f9;
      color: #1e293b;
    }

    svg {
      width: 20px;
      height: 20px;
    }
  }

  &__modal-body {
    padding: 2rem;
    flex-grow: 1;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  &__form-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
  }

  &__form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__form-label {
    font-size: 0.9rem;
    font-weight: 500;
    color: #1e293b;
  }

  &__form-input,
  &__form-select,
  &__form-textarea {
    padding: 0.75rem 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    font-size: 0.95rem;
    color: #1e293b;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: #06a98d;
      box-shadow: 0 0 0 3px rgba(6, 169, 141, 0.1);
    }
  }

  &__form-textarea {
    resize: vertical;
    min-height: 100px;
  }

  &__modal-footer {
    padding: 1.5rem 2rem;
    border-top: 1px solid #e2e8f0;
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    position: sticky;
    bottom: 0;
    background-color: white;
    z-index: 10;
  }

  &__modal-btn {
    padding: 0.75rem 1.5rem;
    border-radius: 10px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    &--primary {
      background-color: #06a98d;
      color: white;
      border: none;

      &:hover:not(:disabled) {
        background-color: #058a73;
      }
    }

    &--secondary {
      background-color: white;
      color: #64748b;
      border: 1px solid #e2e8f0;

      &:hover:not(:disabled) {
        background-color: #f1f5f9;
        color: #1e293b;
      }
    }

    &--danger {
      background-color: #ef4444;
      color: white;
      border: none;

      &:hover:not(:disabled) {
        background-color: #dc2626;
      }
    }

    &--warning {
      background-color: #f59e0b;
      color: white;
      border: none;

      &:hover:not(:disabled) {
        background-color: #d97706;
      }
    }

    &--success {
      background-color: #10b981;
      color: white;
      border: none;

      &:hover:not(:disabled) {
        background-color: #059669;
      }
    }
  }

  &__confirmation-message {
    text-align: center;
    margin: 1.5rem 0 2rem;
    color: #1e293b;
    line-height: 1.5;
  }
}

@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes blink {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0.3;
  }
}
</style>
