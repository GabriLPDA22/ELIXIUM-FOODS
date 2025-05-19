<!-- src/views/BusinessPromotions.vue -->
<template>
  <div class="business-promotions">
    <div class="business-promotions__header">
      <h1 class="business-promotions__title">Gestión de Promociones</h1>
      <button @click="openNewPromotionModal" class="business-promotions__add-btn">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        <span>Nueva Promoción</span>
      </button>
    </div>

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
        <p>Cargando promociones...</p>
      </div>

      <!-- Empty state -->
      <div v-else-if="filteredPromotions.length === 0" class="business-promotions__empty">
        <div class="business-promotions__empty-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <path
              d="M20 12v-2a2 2 0 0 0-2-2H8l3.293-3.293a1 1 0 1 0-1.414-1.414l-5 5a1 1 0 0 0 0 1.414l5 5a1 1 0 0 0 1.414-1.414L8 12h10a2 2 0 0 0 2-2z" />
          </svg>
        </div>
        <h3>No hay promociones</h3>
        <p v-if="activeTab === 'active'">No tienes promociones activas actualmente</p>
        <p v-else-if="activeTab === 'scheduled'">No tienes promociones programadas</p>
        <p v-else-if="activeTab === 'expired'">No tienes promociones expiradas</p>
        <p v-else>No tienes promociones creadas</p>
        <button @click="openNewPromotionModal" class="business-promotions__empty-button">
          Crear Nueva Promoción
        </button>
      </div>

      <!-- Promotions grid -->
      <div v-else class="business-promotions__grid">
        <div v-for="promotion in filteredPromotions" :key="promotion.id" class="business-promotions__card">
          <div class="business-promotions__card-banner" :style="{ backgroundColor: getPromotionColor(promotion.type) }">
            <span class="business-promotions__card-type">{{ getPromotionTypeLabel(promotion.type) }}</span>
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
                <span class="business-promotions__item-value">
                  {{ formatDate(promotion.startDate) }} - {{ formatDate(promotion.endDate) }}
                </span>
              </div>

              <div class="business-promotions__card-item" v-if="promotion.minimumOrderValue > 0">
                <span class="business-promotions__item-label">Pedido mínimo:</span>
                <span class="business-promotions__item-value">{{ formatCurrency(promotion.minimumOrderValue) }}</span>
              </div>

              <div class="business-promotions__card-item">
                <span class="business-promotions__item-label">Código:</span>
                <span class="business-promotions__item-value promotion-code">{{ promotion.code }}</span>
              </div>

              <div class="business-promotions__card-item" v-if="promotion.usageLimit > 0">
                <span class="business-promotions__item-label">Usos:</span>
                <span class="business-promotions__item-value">{{ promotion.usageCount }} / {{ promotion.usageLimit
                  }}</span>
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

    <!-- New/Edit Promotion Modal -->
    <div v-if="showPromotionModal" class="business-promotions__modal" @click="closeModal">
      <div class="business-promotions__modal-content" @click.stop>
        <div class="business-promotions__modal-header">
          <h2 class="business-promotions__modal-title">
            {{ editingPromotion ? 'Editar Promoción' : 'Nueva Promoción' }}
          </h2>
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
                  class="business-promotions__form-input" placeholder="Ej. Descuento de bienvenida" required>
              </div>

              <div class="business-promotions__form-group">
                <label for="promotionType" class="business-promotions__form-label">Tipo de promoción*</label>
                <select id="promotionType" v-model="promotionForm.type" class="business-promotions__form-select"
                  required>
                  <option value="discount">Descuento General</option>
                  <option value="welcome">Bienvenida</option>
                  <option value="seasonal">Temporada</option>
                  <option value="loyalty">Fidelización</option>
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
                <select id="discountType" v-model="promotionForm.discountType" class="business-promotions__form-select"
                  required>
                  <option value="percentage">Porcentaje (%)</option>
                  <option value="fixed">Importe fijo (€)</option>
                </select>
              </div>

              <div class="business-promotions__form-group">
                <label for="discountValue" class="business-promotions__form-label">
                  {{ promotionForm.discountType === 'percentage' ? 'Porcentaje de descuento*' : 'Importe de descuento*'
                  }}
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
                <label for="promotionCode" class="business-promotions__form-label">Código promocional*</label>
                <div class="business-promotions__code-input">
                  <input type="text" id="promotionCode" v-model="promotionForm.code"
                    class="business-promotions__form-input" placeholder="Ej. WELCOME20" required>
                  <button type="button" @click="generateCode" class="business-promotions__generate-btn">
                    Generar
                  </button>
                </div>
              </div>

              <div class="business-promotions__form-group">
                <label for="minimumOrderValue" class="business-promotions__form-label">Pedido mínimo (€)</label>
                <input type="number" id="minimumOrderValue" v-model="promotionForm.minimumOrderValue"
                  class="business-promotions__form-input" placeholder="Ej. 15.00" min="0" step="0.01">
              </div>
            </div>

            <div class="business-promotions__form-row">
              <div class="business-promotions__form-group">
                <label for="usageLimit" class="business-promotions__form-label">Límite de usos (0 = sin límite)</label>
                <input type="number" id="usageLimit" v-model="promotionForm.usageLimit"
                  class="business-promotions__form-input" placeholder="Ej. 100" min="0" step="1">
              </div>

              <div class="business-promotions__form-group">
                <label for="promotionStatus" class="business-promotions__form-label">Estado*</label>
                <select id="promotionStatus" v-model="promotionForm.status" class="business-promotions__form-select"
                  required>
                  <option value="active">Activa</option>
                  <option value="inactive">Inactiva</option>
                  <option value="scheduled">Programada</option>
                </select>
              </div>
            </div>

            <div class="business-promotions__modal-footer">
              <button type="button" @click="closeModal"
                class="business-promotions__modal-btn business-promotions__modal-btn--secondary">
                Cancelar
              </button>
              <button type="submit" class="business-promotions__modal-btn business-promotions__modal-btn--primary">
                {{ editingPromotion ? 'Guardar Cambios' : 'Crear Promoción' }}
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
          <button @click="confirmAction" class="business-promotions__modal-btn" :class="confirmationActionClass">
            {{ confirmationAction }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Estado
const loading = ref(true)
const promotions = ref([])
const activeTab = ref('all')
const showPromotionModal = ref(false)
const editingPromotion = ref(null)
const showConfirmation = ref(false)
const pendingAction = ref(null)
const pendingPromotionId = ref(null)
const confirmationTitle = ref('')
const confirmationMessage = ref('')
const confirmationAction = ref('')
const confirmationActionClass = ref('')

// Formulario para nueva/editar promoción
const promotionForm = ref({
  id: null,
  name: '',
  description: '',
  type: 'discount',
  discountType: 'percentage',
  discountValue: null,
  startDate: new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD
  endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0], // Un mes después
  code: '',
  minimumOrderValue: 0,
  usageLimit: 0,
  usageCount: 0,
  status: 'active'
})

// Datos de pestañas
const tabs = [
  { label: 'Todas', value: 'all' },
  { label: 'Activas', value: 'active' },
  { label: 'Programadas', value: 'scheduled' },
  { label: 'Expiradas', value: 'expired' }
]

// Cargar promociones (simulación)
onMounted(async () => {
  // Simular una llamada API
  setTimeout(() => {
    promotions.value = [
      {
        id: 1,
        name: 'Descuento de Bienvenida',
        description: 'Descuento especial para nuevos clientes en su primer pedido',
        type: 'welcome',
        discountType: 'percentage',
        discountValue: 15,
        startDate: new Date(2023, 3, 1),
        endDate: new Date(2023, 8, 30),
        code: 'WELCOME15',
        minimumOrderValue: 20,
        usageLimit: 100,
        usageCount: 42,
        status: 'active'
      },
      {
        id: 2,
        name: 'Envío Gratis',
        description: 'Envío gratuito en todos los pedidos superiores a 30€',
        type: 'discount',
        discountType: 'fixed',
        discountValue: 5,
        startDate: new Date(2023, 4, 1),
        endDate: new Date(2023, 5, 30),
        code: 'FREESHIP',
        minimumOrderValue: 30,
        usageLimit: 0,
        usageCount: 86,
        status: 'active'
      },
      {
        id: 3,
        name: 'Descuento de Verano',
        description: 'Disfruta del verano con un 20% de descuento en todos los platos',
        type: 'seasonal',
        discountType: 'percentage',
        discountValue: 20,
        startDate: new Date(2023, 5, 21),
        endDate: new Date(2023, 8, 21),
        code: 'SUMMER20',
        minimumOrderValue: 25,
        usageLimit: 0,
        usageCount: 12,
        status: 'scheduled'
      },
      {
        id: 4,
        name: 'Descuento de Primavera',
        description: 'Celebra la primavera con un 10% de descuento',
        type: 'seasonal',
        discountType: 'percentage',
        discountValue: 10,
        startDate: new Date(2023, 2, 21),
        endDate: new Date(2023, 4, 31),
        code: 'SPRING10',
        minimumOrderValue: 15,
        usageLimit: 500,
        usageCount: 368,
        status: 'expired'
      },
      {
        id: 5,
        name: 'Cliente Fiel',
        description: 'Descuento especial para clientes habituales',
        type: 'loyalty',
        discountType: 'percentage',
        discountValue: 25,
        startDate: new Date(2023, 4, 1),
        endDate: new Date(2023, 11, 31),
        code: 'LOYALTY25',
        minimumOrderValue: 40,
        usageLimit: 200,
        usageCount: 73,
        status: 'inactive'
      }
    ]
    loading.value = false
  }, 1000)
})

// Filtrar promociones según la pestaña activa
const filteredPromotions = computed(() => {
  if (activeTab.value === 'all') {
    return promotions.value
  } else if (activeTab.value === 'active') {
    return promotions.value.filter(p => p.status === 'active')
  } else if (activeTab.value === 'scheduled') {
    return promotions.value.filter(p => p.status === 'scheduled')
  } else if (activeTab.value === 'expired') {
    // Mostrar las promociones expiradas o con fechas pasadas
    const today = new Date()
    return promotions.value.filter(p =>
      p.status === 'expired' ||
      (new Date(p.endDate) < today && p.status !== 'scheduled')
    )
  }
  return promotions.value
})

// Obtener conteo de promociones por pestaña
const getPromotionsCount = (tabValue) => {
  if (tabValue === 'all') {
    return promotions.value.length
  } else if (tabValue === 'active') {
    return promotions.value.filter(p => p.status === 'active').length
  } else if (tabValue === 'scheduled') {
    return promotions.value.filter(p => p.status === 'scheduled').length
  } else if (tabValue === 'expired') {
    const today = new Date()
    return promotions.value.filter(p =>
      p.status === 'expired' ||
      (new Date(p.endDate) < today && p.status !== 'scheduled')
    ).length
  }
  return 0
}

// Formatear fechas
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Formatear moneda
const formatCurrency = (value) => {
  return value.toFixed(2).replace('.', ',') + ' €'
}

// Obtener etiqueta de tipo de promoción
const getPromotionTypeLabel = (type) => {
  switch (type) {
    case 'discount':
      return 'Descuento'
    case 'welcome':
      return 'Bienvenida'
    case 'seasonal':
      return 'Temporada'
    case 'loyalty':
      return 'Fidelización'
    default:
      return type
  }
}

// Obtener color de fondo para el tipo de promoción
const getPromotionColor = (type) => {
  switch (type) {
    case 'discount':
      return '#3b82f6' // Azul
    case 'welcome':
      return '#10b981' // Verde
    case 'seasonal':
      return '#8b5cf6' // Púrpura
    case 'loyalty':
      return '#f59e0b' // Ámbar
    default:
      return '#64748b' // Gris
  }
}

// Obtener etiqueta de estado
const getStatusLabel = (status) => {
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
  editingPromotion.value = null
  // Resetear el formulario
  promotionForm.value = {
    id: null,
    name: '',
    description: '',
    type: 'discount',
    discountType: 'percentage',
    discountValue: null,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
    code: '',
    minimumOrderValue: 0,
    usageLimit: 0,
    usageCount: 0,
    status: 'active'
  }
  showPromotionModal.value = true
}

// Editar promoción existente
const editPromotion = (promotion) => {
  editingPromotion.value = promotion
  // Cargar datos de la promoción en el formulario
  promotionForm.value = {
    id: promotion.id,
    name: promotion.name,
    description: promotion.description,
    type: promotion.type,
    discountType: promotion.discountType,
    discountValue: promotion.discountValue,
    startDate: new Date(promotion.startDate).toISOString().split('T')[0],
    endDate: new Date(promotion.endDate).toISOString().split('T')[0],
    code: promotion.code,
    minimumOrderValue: promotion.minimumOrderValue,
    usageLimit: promotion.usageLimit,
    usageCount: promotion.usageCount,
    status: promotion.status
  }
  showPromotionModal.value = true
}

// Cerrar modal
const closeModal = () => {
  showPromotionModal.value = false
  editingPromotion.value = null
}

// Generar código aleatorio
const generateCode = () => {
  const prefix = promotionForm.value.type.toUpperCase().substring(0, 3)
  const value = promotionForm.value.discountType === 'percentage' ?
    Math.round(promotionForm.value.discountValue || 10) :
    'SAVE'
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  promotionForm.value.code = `${prefix}${value}${random}`
}

// Guardar promoción (nueva o editada)
const savePromotion = () => {
  if (editingPromotion.value) {
    // Actualizar promoción existente
    const index = promotions.value.findIndex(p => p.id === editingPromotion.value.id)
    if (index !== -1) {
      // Convertir fechas de string a Date
      const updatedPromotion = {
        ...promotionForm.value,
        startDate: new Date(promotionForm.value.startDate),
        endDate: new Date(promotionForm.value.endDate)
      }
      promotions.value[index] = updatedPromotion
    }
  } else {
    // Crear nueva promoción
    const newPromotion = {
      ...promotionForm.value,
      id: Math.max(0, ...promotions.value.map(p => p.id)) + 1,
      startDate: new Date(promotionForm.value.startDate),
      endDate: new Date(promotionForm.value.endDate),
      usageCount: 0
    }
    promotions.value.push(newPromotion)
  }
  showPromotionModal.value = false
}

// Desactivar promoción
const deactivatePromotion = (promotion) => {
  confirmationTitle.value = 'Desactivar Promoción'
  confirmationMessage.value = `¿Estás seguro de que quieres desactivar la promoción "${promotion.name}"?`
  confirmationAction.value = 'Desactivar'
  confirmationActionClass.value = 'business-promotions__modal-btn--warning'
  pendingAction.value = 'deactivate'
  pendingPromotionId.value = promotion.id
  showConfirmation.value = true
}

// Activar promoción
const activatePromotion = (promotion) => {
  confirmationTitle.value = 'Activar Promoción'
  confirmationMessage.value = `¿Estás seguro de que quieres activar la promoción "${promotion.name}"?`
  confirmationAction.value = 'Activar'
  confirmationActionClass.value = 'business-promotions__modal-btn--success'
  pendingAction.value = 'activate'
  pendingPromotionId.value = promotion.id
  showConfirmation.value = true
}

// Duplicar promoción
const duplicatePromotion = (promotion) => {
  const newPromotion = {
    ...promotion,
    id: Math.max(0, ...promotions.value.map(p => p.id)) + 1,
    name: `${promotion.name} (Copia)`,
    code: `${promotion.code}_COPY`,
    usageCount: 0
  }
  promotions.value.push(newPromotion)
}

// Eliminar promoción
const deletePromotion = (promotion) => {
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
const confirmAction = () => {
  const promotionIndex = promotions.value.findIndex(p => p.id === pendingPromotionId.value)
  if (promotionIndex === -1) {
    return
  }

  if (pendingAction.value === 'deactivate') {
    promotions.value[promotionIndex].status = 'inactive'
  } else if (pendingAction.value === 'activate') {
    promotions.value[promotionIndex].status = 'active'
  } else if (pendingAction.value === 'delete') {
    promotions.value.splice(promotionIndex, 1)
  }

  showConfirmation.value = false
  pendingAction.value = null
  pendingPromotionId.value = null
}
</script>

<style lang="scss" scoped>
.business-promotions {
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    gap: 1rem;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  &__title {
    font-size: 1.75rem;
    font-weight: 700;
    margin: 0;
    color: #1e293b;
  }

  &__add-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: #06a98d;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 0.6rem 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background-color: #058a73;
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
    padding: 0.6rem 1rem;
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
    min-width: 20px;
    height: 20px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 6px;
  }

  &__content {
    min-height: 300px;
  }

  &__loading,
  &__empty {
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

  &__empty h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0 0 0.5rem;
    color: #1e293b;
  }

  &__empty p {
    color: #64748b;
    margin: 0 0 1.5rem;
    max-width: 400px;
  }

  &__empty-button {
    background-color: #06a98d;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 0.6rem 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background-color: #058a73;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.5rem;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  &__card {
    background-color: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
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
    padding: 1.25rem;
    flex-grow: 1;
  }

  &__card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.75rem;
  }

  &__card-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0;
    color: #1e293b;
  }

  &__card-status {
    font-size: 0.75rem;
    font-weight: 500;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;

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
    margin: 0 0 1rem;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__card-details {
    margin-bottom: 0.5rem;
  }

  &__card-item {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    border-bottom: 1px solid #f1f5f9;
    font-size: 0.9rem;

    &:last-child {
      border-bottom: none;
    }
  }

  &__item-label {
    color: #64748b;
  }

  &__item-value {
    font-weight: 500;
    color: #1e293b;

    &.promotion-code {
      font-family: monospace;
      background-color: #f1f5f9;
      padding: 0.1rem 0.3rem;
      border-radius: 4px;
    }
  }

  &__card-actions {
    padding: 1rem 1.25rem;
    border-top: 1px solid #f1f5f9;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  &__action-btn {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.4rem 0.6rem;
    border-radius: 6px;
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
    border-radius: 12px;
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
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 10;
  }

  &__modal-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
    color: #1e293b;
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
    border-radius: 4px;

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
    padding: 1.5rem;
    flex-grow: 1;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  &__form-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.25rem;
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
    padding: 0.6rem 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 0.95rem;
    color: #1e293b;

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

  &__code-input {
    display: flex;
    gap: 0.5rem;
  }

  &__generate-btn {
    background-color: #f1f5f9;
    color: #475569;
    border: none;
    border-radius: 8px;
    padding: 0 0.75rem;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background-color: #e2e8f0;
      color: #1e293b;
    }
  }

  &__modal-footer {
    padding: 1.25rem 1.5rem;
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
    padding: 0.6rem 1.25rem;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    &--primary {
      background-color: #06a98d;
      color: white;
      border: none;

      &:hover {
        background-color: #058a73;
      }
    }

    &--secondary {
      background-color: white;
      color: #64748b;
      border: 1px solid #e2e8f0;

      &:hover {
        background-color: #f1f5f9;
        color: #1e293b;
      }
    }

    &--danger {
      background-color: #ef4444;
      color: white;
      border: none;

      &:hover {
        background-color: #dc2626;
      }
    }

    &--warning {
      background-color: #f59e0b;
      color: white;
      border: none;

      &:hover {
        background-color: #d97706;
      }
    }

    &--success {
      background-color: #10b981;
      color: white;
      border: none;

      &:hover {
        background-color: #059669;
      }
    }
  }

  &__confirmation-message {
    text-align: center;
    margin: 1rem 0 2rem;
    color: #1e293b;
    line-height: 1.5;
  }
}

@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}
</style>
