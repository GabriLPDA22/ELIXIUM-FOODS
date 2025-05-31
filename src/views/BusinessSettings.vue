<template>
  <div class="business-settings">
    <div class="business-settings__header">
      <h1 class="business-settings__title">Configuración</h1>
      <div class="business-settings__entity-selector">
        <label for="entitySelect" class="business-settings__selector-label">Configurar:</label>
        <select id="entitySelect" v-model="selectedEntity" @change="onEntityChange" class="business-settings__selector">
          <option value="business">Mi Negocio</option>
          <option v-for="restaurant in restaurants" :key="`restaurant-${restaurant.id}`"
            :value="`restaurant-${restaurant.id}`">
            Restaurante: {{ restaurant.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="business-settings__loading">
      <div class="business-settings__spinner"></div>
      <p>Cargando configuración...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="business-settings__error">
      <div class="business-settings__error-icon">⚠️</div>
      <h3>Error al cargar</h3>
      <p>{{ error }}</p>
      <button @click="retryLoad" class="business-settings__button business-settings__button--primary">
        Reintentar
      </button>
    </div>

    <!-- Main content -->
    <div v-else>
      <div class="business-settings__tabs">
        <button v-for="tab in currentTabs" :key="tab.id" @click="activeTab = tab.id"
          :class="['business-settings__tab', { 'business-settings__tab--active': activeTab === tab.id }]">
          <span class="business-settings__tab-icon">
            <component :is="tab.icon" />
          </span>
          <span>{{ tab.label }}</span>
        </button>
      </div>

      <div class="business-settings__content">
        <!-- Configuración del BUSINESS -->
        <div v-if="selectedEntity === 'business' && activeTab === 'profile'" class="business-settings__section">
          <div class="business-settings__section-header">
            <h2 class="business-settings__section-title">Información del Negocio</h2>
            <p class="business-settings__section-description">
              Actualiza la información básica de tu negocio
            </p>
          </div>
          <form @submit.prevent="saveBusinessProfile" class="business-settings__form">
            <div class="business-settings__form-group">
              <label for="businessName" class="business-settings__label">Nombre del negocio*</label>
              <input type="text" id="businessName" v-model="businessProfile.name" class="business-settings__input"
                required />
            </div>
            <div class="business-settings__form-row">
              <div class="business-settings__form-group">
                <label for="contactPhone" class="business-settings__label">Teléfono de contacto*</label>
                <input type="tel" id="contactPhone" v-model="businessProfile.contactPhone"
                  class="business-settings__input" required />
              </div>
              <div class="business-settings__form-group">
                <label for="contactEmail" class="business-settings__label">Email de contacto*</label>
                <input type="email" id="contactEmail" v-model="businessProfile.contactEmail"
                  class="business-settings__input" required />
              </div>
            </div>
            <div class="business-settings__form-group">
              <label for="businessDescription" class="business-settings__label">Descripción del negocio</label>
              <textarea id="businessDescription" v-model="businessProfile.description" class="business-settings__textarea"
                rows="4" placeholder="Describe tu negocio..."></textarea>
            </div>
            <div class="business-settings__form-row">
              <div class="business-settings__form-group">
                <label for="taxId" class="business-settings__label">NIF/CIF</label>
                <input type="text" id="taxId" v-model="businessProfile.taxId" class="business-settings__input"
                  placeholder="12345678A" />
              </div>
              <div class="business-settings__form-group">
                <label for="businessType" class="business-settings__label">Tipo de negocio</label>
                <select id="businessType" v-model="businessProfile.businessType" class="business-settings__select">
                  <option value="Restaurant">Restaurante</option>
                  <option value="FastFood">Comida Rápida</option>
                  <option value="Cafe">Cafetería</option>
                  <option value="Bakery">Panadería</option>
                  <option value="Other">Otro</option>
                </select>
              </div>
            </div>
            <div class="business-settings__form-group">
              <label class="business-settings__label business-settings__checkbox-label">
                <input type="checkbox" id="isActive" v-model="businessProfile.isActive"
                  class="business-settings__checkbox" />
                <span>Negocio activo</span>
              </label>
            </div>
            <div class="business-settings__form-actions">
              <button type="button" @click="resetBusinessForm"
                class="business-settings__button business-settings__button--secondary">
                Cancelar
              </button>
              <button type="submit" class="business-settings__button business-settings__button--primary"
                :disabled="saving">
                {{ saving ? 'Guardando...' : 'Guardar Cambios' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Configuración del RESTAURANTE -->
        <div v-if="selectedEntity.startsWith('restaurant-') && activeTab === 'profile'"
          class="business-settings__section">
          <div class="business-settings__section-header">
            <h2 class="business-settings__section-title">Información del Restaurante</h2>
            <p class="business-settings__section-description">
              Actualiza la información de {{ currentRestaurant?.name || 'este restaurante' }}
            </p>
          </div>
          <form @submit.prevent="saveRestaurantProfile" class="business-settings__form">
            <div class="business-settings__form-group">
              <label for="restaurantName" class="business-settings__label">Nombre del restaurante*</label>
              <input type="text" id="restaurantName" v-model="restaurantProfile.name" class="business-settings__input"
                required />
            </div>
            <div class="business-settings__form-group">
              <label for="restaurantDescription" class="business-settings__label">Descripción</label>
              <textarea id="restaurantDescription" v-model="restaurantProfile.description"
                class="business-settings__textarea" rows="4" placeholder="Describe tu restaurante..."></textarea>
            </div>
            <div class="business-settings__form-row">
              <div class="business-settings__form-group">
                <label for="estimatedDeliveryTime" class="business-settings__label">Tiempo de entrega (min)*</label>
                <input type="number" id="estimatedDeliveryTime" v-model.number="restaurantProfile.estimatedDeliveryTime"
                  class="business-settings__input" min="0" required />
              </div>
              <div class="business-settings__form-group">
                <label for="deliveryFee" class="business-settings__label">Gastos de envío (€)*</label>
                <input type="number" id="deliveryFee" v-model.number="restaurantProfile.deliveryFee"
                  class="business-settings__input" min="0" step="0.01" required />
              </div>
            </div>
            <div class="business-settings__form-group">
              <label class="business-settings__label">Tipo de restaurante*</label>
              <div class="business-settings__radio-group">
                <div v-for="tipo in restaurantTypes" :key="tipo.id" class="business-settings__radio">
                  <input type="radio" :id="`tipo-${tipo.id}`" :value="tipo.id" v-model.number="restaurantProfile.tipo"
                    class="business-settings__radio-input" />
                  <label :for="`tipo-${tipo.id}`" class="business-settings__radio-label">{{ tipo.name }}</label>
                </div>
              </div>
            </div>
            <div class="business-settings__form-group">
              <label class="business-settings__label business-settings__checkbox-label">
                <input type="checkbox" id="restaurantIsOpen" v-model="restaurantProfile.isOpen"
                  class="business-settings__checkbox" />
                <span>Restaurante abierto</span>
              </label>
            </div>
            <div class="business-settings__form-actions">
              <button type="button" @click="resetRestaurantForm"
                class="business-settings__button business-settings__button--secondary">
                Cancelar
              </button>
              <button type="submit" class="business-settings__button business-settings__button--primary"
                :disabled="saving">
                {{ saving ? 'Guardando...' : 'Guardar Cambios' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Dirección (solo para restaurantes) -->
        <div v-if="selectedEntity.startsWith('restaurant-') && activeTab === 'address'"
          class="business-settings__section">
          <div class="business-settings__section-header">
            <h2 class="business-settings__section-title">Dirección del Restaurante</h2>
            <p class="business-settings__section-description">
              Actualiza la dirección de {{ currentRestaurant?.name || 'este restaurante' }}
            </p>
          </div>
          <form @submit.prevent="saveRestaurantAddress" class="business-settings__form">
            <div class="business-settings__form-group">
              <label for="street" class="business-settings__label">Calle y número*</label>
              <input type="text" id="street" v-model="restaurantAddress.street" class="business-settings__input"
                required placeholder="Calle Mayor, 123" />
            </div>
            <div class="business-settings__form-row">
              <div class="business-settings__form-group">
                <label for="city" class="business-settings__label">Ciudad*</label>
                <input type="text" id="city" v-model="restaurantAddress.city" class="business-settings__input" required
                  placeholder="Madrid" />
              </div>
              <div class="business-settings__form-group">
                <label for="state" class="business-settings__label">Provincia*</label>
                <input type="text" id="state" v-model="restaurantAddress.state" class="business-settings__input"
                  required placeholder="Madrid" />
              </div>
            </div>
            <div class="business-settings__form-row">
              <div class="business-settings__form-group">
                <label for="zipCode" class="business-settings__label">Código Postal*</label>
                <input type="text" id="zipCode" v-model="restaurantAddress.zipCode" class="business-settings__input"
                  required placeholder="28001" />
              </div>
              <div class="business-settings__form-group">
                <label for="phone" class="business-settings__label">Teléfono</label>
                <input type="tel" id="phone" v-model="restaurantAddress.phone" class="business-settings__input"
                  placeholder="+34 912 345 678" />
              </div>
            </div>
            <div class="business-settings__form-row">
              <div class="business-settings__form-group">
                <label for="latitude" class="business-settings__label">Latitud</label>
                <input type="number" id="latitude" v-model.number="restaurantAddress.latitude"
                  class="business-settings__input" step="any" placeholder="40.4168" />
              </div>
              <div class="business-settings__form-group">
                <label for="longitude" class="business-settings__label">Longitud</label>
                <input type="number" id="longitude" v-model.number="restaurantAddress.longitude"
                  class="business-settings__input" step="any" placeholder="-3.7038" />
              </div>
            </div>
            <div class="business-settings__form-actions">
              <button type="button" @click="resetAddressForm"
                class="business-settings__button business-settings__button--secondary">
                Cancelar
              </button>
              <button type="submit" class="business-settings__button business-settings__button--primary"
                :disabled="saving">
                {{ saving ? 'Guardando...' : 'Guardar Cambios' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Imágenes -->
        <div v-if="activeTab === 'images'" class="business-settings__section">
          <div class="business-settings__section-header">
            <h2 class="business-settings__section-title">
              Imágenes {{ selectedEntity === 'business' ? 'del Negocio' : 'del Restaurante' }}
            </h2>
            <p class="business-settings__section-description">
              Sube y gestiona las imágenes {{ selectedEntity === 'business' ? 'de tu negocio' : 'de este restaurante' }}
            </p>
          </div>

          <!-- Upload loading -->
          <div v-if="uploading" class="business-settings__upload-loading">
            <div class="business-settings__upload-spinner"></div>
            <p>Subiendo imagen...</p>
          </div>

          <div class="business-settings__images-container">
            <!-- Logo Section -->
            <div class="business-settings__image-section">
              <h3 class="business-settings__image-title">Logo</h3>
              <p class="business-settings__image-description">
                Este logo aparecerá en el perfil y en los resultados de búsqueda
              </p>
              <div class="business-settings__logo-uploader">
                <div class="business-settings__logo-preview">
                  <img v-if="currentImages.logoUrl" :src="currentImages.logoUrl" alt="Logo" />
                  <div v-else class="business-settings__logo-placeholder">
                    <UserIcon />
                  </div>
                </div>
                <div class="business-settings__logo-actions">
                  <label class="business-settings__upload-btn"
                    :class="{ 'business-settings__upload-btn--disabled': uploading }">
                    {{ uploading ? 'Subiendo...' : 'Subir Logo' }}
                    <input type="file" accept="image/*" @change="handleLogoUpload" class="business-settings__file-input"
                      :disabled="uploading" />
                  </label>
                  <button v-if="currentImages.logoUrl && !uploading" @click="removeLogo"
                    class="business-settings__remove-btn">
                    Eliminar
                  </button>
                </div>
              </div>
            </div>

            <!-- Cover Section -->
            <div class="business-settings__image-section">
              <h3 class="business-settings__image-title">Imagen de Portada</h3>
              <p class="business-settings__image-description">
                Esta imagen aparecerá en la parte superior del perfil
              </p>
              <div class="business-settings__cover-uploader">
                <div class="business-settings__cover-preview">
                  <img v-if="currentImages.coverImageUrl" :src="currentImages.coverImageUrl" alt="Portada" />
                  <div v-else class="business-settings__cover-placeholder">
                    <ImageIcon />
                    <span>Añade una imagen de portada</span>
                  </div>
                </div>
                <div class="business-settings__cover-actions">
                  <label class="business-settings__upload-btn"
                    :class="{ 'business-settings__upload-btn--disabled': uploading }">
                    {{ uploading ? 'Subiendo...' : 'Subir Portada' }}
                    <input type="file" accept="image/*" @change="handleCoverUpload" class="business-settings__file-input"
                      :disabled="uploading" />
                  </label>
                  <button v-if="currentImages.coverImageUrl && !uploading" @click="removeCover"
                    class="business-settings__remove-btn">
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Horarios -->
        <div v-if="activeTab === 'hours'" class="business-settings__section">
          <div class="business-settings__section-header">
            <h2 class="business-settings__section-title">
              Horarios {{ selectedEntity === 'business' ? 'del Negocio' : 'del Restaurante' }}
            </h2>
            <p class="business-settings__section-description">
              Configura los horarios de {{ selectedEntity === 'business' ? 'tu negocio' : currentRestaurant?.name || 'este restaurante' }}
            </p>
          </div>

          <div class="business-settings__hours-container">
            <div v-for="(day, index) in currentHours" :key="day.day" class="business-settings__hours-row">
              <div class="business-settings__day-checkbox">
                <label :for="`day-${index}`" class="business-settings__checkbox-label">
                  <input type="checkbox" :id="`day-${index}`" v-model="day.isOpen"
                    class="business-settings__checkbox" />
                  <span>{{ day.label }}</span>
                </label>
              </div>
              <div class="business-settings__hours-inputs"
                :class="{ 'business-settings__hours-inputs--disabled': !day.isOpen }">
                <div class="business-settings__hours-input-group">
                  <label :for="`open-${index}`" class="business-settings__hours-label">Apertura</label>
                  <input type="time" :id="`open-${index}`" v-model="day.openTime"
                    class="business-settings__hours-input" :disabled="!day.isOpen" />
                </div>
                <span class="business-settings__hours-separator">a</span>
                <div class="business-settings__hours-input-group">
                  <label :for="`close-${index}`" class="business-settings__hours-label">Cierre</label>
                  <input type="time" :id="`close-${index}`" v-model="day.closeTime"
                    class="business-settings__hours-input" :disabled="!day.isOpen" />
                </div>
              </div>
            </div>
            <div class="business-settings__hours-actions">
              <button @click="applyMondayToAll" class="business-settings__button business-settings__button--secondary">
                Aplicar Lunes a todos los días
              </button>
              <button @click="saveHours" class="business-settings__button business-settings__button--primary"
                :disabled="saving">
                {{ saving ? 'Guardando...' : 'Guardar Horarios' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Cuenta -->
        <div v-if="activeTab === 'account'" class="business-settings__section">
          <div class="business-settings__section-header">
            <h2 class="business-settings__section-title">Cuenta y Seguridad</h2>
            <p class="business-settings__section-description">
              Actualiza tu información de cuenta y ajustes de seguridad
            </p>
          </div>
          <div class="business-settings__account-container">
            <div class="business-settings__account-section">
              <h3 class="business-settings__account-title">Cambiar Contraseña</h3>
              <form @submit.prevent="changePassword" class="business-settings__form">
                <div class="business-settings__form-group">
                  <label for="currentPassword" class="business-settings__label">Contraseña actual*</label>
                  <input type="password" id="currentPassword" v-model="passwordForm.currentPassword"
                    class="business-settings__input" required />
                </div>
                <div class="business-settings__form-group">
                  <label for="newPassword" class="business-settings__label">Nueva contraseña*</label>
                  <input type="password" id="newPassword" v-model="passwordForm.newPassword"
                    class="business-settings__input" required minlength="8" />
                  <p class="business-settings__input-help">
                    La contraseña debe tener al menos 8 caracteres
                  </p>
                </div>
                <div class="business-settings__form-group">
                  <label for="confirmPassword" class="business-settings__label">Confirmar nueva contraseña*</label>
                  <input type="password" id="confirmPassword" v-model="passwordForm.confirmPassword"
                    class="business-settings__input" required />
                </div>
                <div v-if="passwordError" class="business-settings__form-error">
                  {{ passwordError }}
                </div>
                <div class="business-settings__form-actions">
                  <button type="submit" class="business-settings__button business-settings__button--primary"
                    :disabled="saving">
                    {{ saving ? 'Cambiando...' : 'Cambiar Contraseña' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, defineComponent, h } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { api } from '@/services/api'
import { ImageService } from '@/services/imageService'

// Tipos TypeScript
interface Business {
  id: number
  name: string
  description: string
  contactPhone: string
  contactEmail: string
  taxId: string
  businessType: string
  isActive: boolean
  logoUrl: string
  coverImageUrl: string
  userId: number
  createdAt: string
  updatedAt: string
}

interface Restaurant {
  id: number
  name: string
  description: string
  logoUrl: string
  coverImageUrl: string
  averageRating: number
  isOpen: boolean
  deliveryFee: number
  estimatedDeliveryTime: number
  tipo: number
  businessId: number
  addressId: number
  address?: Address
  createdAt: string
  updatedAt: string
}

interface Address {
  id: number
  street: string
  city: string
  state: string
  zipCode: string
  phone: string
  latitude: number | null
  longitude: number | null
}

interface BusinessHour {
  day: string
  label: string
  isOpen: boolean
  openTime: string
  closeTime: string
}

interface Tab {
  id: string
  label: string
  icon: any
}

// Iconos como componentes
const UserIcon = defineComponent(() => h('svg', {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, [
  h('path', { d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" }),
  h('circle', { cx: "12", cy: "7", r: "4" })
]))

const MapPinIcon = defineComponent(() => h('svg', {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2"
}, [
  h('path', { d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" }),
  h('circle', { cx: "12", cy: "10", r: "3" })
]))

const ImageIcon = defineComponent(() => h('svg', {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2"
}, [
  h('rect', { x: "3", y: "3", width: "18", height: "18", rx: "2", ry: "2" }),
  h('circle', { cx: "8.5", cy: "8.5", r: "1.5" }),
  h('polyline', { points: "21 15 16 10 5 21" })
]))

const ClockIcon = defineComponent(() => h('svg', {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2"
}, [
  h('circle', { cx: "12", cy: "12", r: "10" }),
  h('polyline', { points: "12 6 12 12 16 14" })
]))

const SettingsIcon = defineComponent(() => h('svg', {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2"
}, [
  h('path', { d: "M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" }),
  h('circle', { cx: "8.5", cy: "7", r: "4" }),
  h('polyline', { points: "20 8 20 14" }),
  h('line', { x1: "23", y1: "11", x2: "17", y2: "11" })
]))

// Store
const authStore = useAuthStore()

// Estado reactivo
const loading = ref(true)
const saving = ref(false)
const uploading = ref(false)
const error = ref<string | null>(null)
const activeTab = ref('profile')
const selectedEntity = ref('business')

// Datos
const business = ref<Business | null>(null)
const restaurants = ref<Restaurant[]>([])

// Pestañas
const allTabs: Tab[] = [
  { id: 'profile', label: 'Perfil', icon: UserIcon },
  { id: 'address', label: 'Dirección', icon: MapPinIcon },
  { id: 'images', label: 'Imágenes', icon: ImageIcon },
  { id: 'hours', label: 'Horarios', icon: ClockIcon },
  { id: 'account', label: 'Cuenta', icon: SettingsIcon }
]

const currentTabs = computed(() => {
  if (selectedEntity.value === 'business') {
    return allTabs.filter(tab => tab.id !== 'address')
  }
  return allTabs
})

// Formularios
const businessProfile = ref({
  name: '',
  description: '',
  contactPhone: '',
  contactEmail: '',
  taxId: '',
  businessType: 'Restaurant',
  isActive: true
})

const restaurantProfile = ref({
  name: '',
  description: '',
  estimatedDeliveryTime: 30,
  deliveryFee: 2.99,
  tipo: 1,
  isOpen: true
})

const restaurantAddress = ref({
  street: '',
  city: '',
  state: '',
  zipCode: '',
  phone: '',
  latitude: null as number | null,
  longitude: null as number | null
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordError = ref('')

// Datos adicionales
const restaurantTypes = [
  { id: 1, name: 'Italiano' }, { id: 2, name: 'Asiático' }, { id: 3, name: 'Mexicano' },
  { id: 4, name: 'Hamburguesas' }, { id: 5, name: 'Pizzas' }, { id: 6, name: 'Vegano' },
  { id: 7, name: 'Saludable' }, { id: 8, name: 'Postres' }
]

// Horarios
const businessHours = ref<BusinessHour[]>([
  { day: 'monday', label: 'Lunes', isOpen: true, openTime: '10:00', closeTime: '22:00' },
  { day: 'tuesday', label: 'Martes', isOpen: true, openTime: '10:00', closeTime: '22:00' },
  { day: 'wednesday', label: 'Miércoles', isOpen: true, openTime: '10:00', closeTime: '22:00' },
  { day: 'thursday', label: 'Jueves', isOpen: true, openTime: '10:00', closeTime: '22:00' },
  { day: 'friday', label: 'Viernes', isOpen: true, openTime: '10:00', closeTime: '23:00' },
  { day: 'saturday', label: 'Sábado', isOpen: true, openTime: '11:00', closeTime: '23:00' },
  { day: 'sunday', label: 'Domingo', isOpen: true, openTime: '11:00', closeTime: '22:00' }
])

const restaurantHours = ref<BusinessHour[]>([
  { day: 'monday', label: 'Lunes', isOpen: true, openTime: '10:00', closeTime: '22:00' },
  { day: 'tuesday', label: 'Martes', isOpen: true, openTime: '10:00', closeTime: '22:00' },
  { day: 'wednesday', label: 'Miércoles', isOpen: true, openTime: '10:00', closeTime: '22:00' },
  { day: 'thursday', label: 'Jueves', isOpen: true, openTime: '10:00', closeTime: '22:00' },
  { day: 'friday', label: 'Viernes', isOpen: true, openTime: '10:00', closeTime: '23:00' },
  { day: 'saturday', label: 'Sábado', isOpen: true, openTime: '11:00', closeTime: '23:00' },
  { day: 'sunday', label: 'Domingo', isOpen: true, openTime: '11:00', closeTime: '22:00' }
])

// Computed properties
const currentRestaurant = computed(() => {
  if (!selectedEntity.value.startsWith('restaurant-')) return null
  const restaurantId = parseInt(selectedEntity.value.replace('restaurant-', ''))
  return restaurants.value.find(r => r.id === restaurantId) || null
})

const currentImages = computed(() => {
  if (selectedEntity.value === 'business') {
    return {
      logoUrl: business.value?.logoUrl || '',
      coverImageUrl: business.value?.coverImageUrl || ''
    }
  } else {
    return {
      logoUrl: currentRestaurant.value?.logoUrl || '',
      coverImageUrl: currentRestaurant.value?.coverImageUrl || ''
    }
  }
})

const currentHours = computed(() => {
  return selectedEntity.value === 'business' ? businessHours.value : restaurantHours.value
})

// Métodos de carga de datos
const loadBusiness = async () => {
  try {
    const userId = authStore.user?.id
    if (!userId) throw new Error('Usuario no encontrado')

    const response = await api.get(`/api/Business/user/${userId}`)
    if (response.data) {
      business.value = response.data

      businessProfile.value = {
        name: business.value.name || '',
        description: business.value.description || '',
        contactPhone: business.value.contactPhone || '',
        contactEmail: business.value.contactEmail || '',
        taxId: business.value.taxId || '',
        businessType: business.value.businessType || 'Restaurant',
        isActive: business.value.isActive ?? true
      }
    }
  } catch (err: any) {
    console.error('Error cargando business:', err)
    throw new Error(err.response?.data?.message || 'Error cargando información del negocio')
  }
}

const loadRestaurants = async () => {
  try {
    if (!business.value?.id) return

    const response = await api.get(`/api/Restaurants/business/${business.value.id}`)
    restaurants.value = response.data || []
  } catch (err: any) {
    console.error('Error cargando restaurantes:', err)
    throw new Error('Error cargando restaurantes')
  }
}

const loadRestaurantDetails = async (restaurantId: number) => {
  try {
    const response = await api.get(`/api/Restaurants/${restaurantId}`)
    if (response.data) {
      const restaurant = response.data

      restaurantProfile.value = {
        name: restaurant.name || '',
        description: restaurant.description || '',
        estimatedDeliveryTime: restaurant.estimatedDeliveryTime || 30,
        deliveryFee: restaurant.deliveryFee || 2.99,
        tipo: restaurant.tipo || 1,
        isOpen: restaurant.isOpen ?? true
      }

      if (restaurant.address) {
        restaurantAddress.value = {
          street: restaurant.address.street || '',
          city: restaurant.address.city || '',
          state: restaurant.address.state || '',
          zipCode: restaurant.address.zipCode || '',
          phone: restaurant.address.phone || '',
          latitude: restaurant.address.latitude,
          longitude: restaurant.address.longitude
        }
      }

      // Resetear horarios del restaurante (puedes cargar desde API si existe)
      restaurantHours.value = [
        { day: 'monday', label: 'Lunes', isOpen: true, openTime: '10:00', closeTime: '22:00' },
        { day: 'tuesday', label: 'Martes', isOpen: true, openTime: '10:00', closeTime: '22:00' },
        { day: 'wednesday', label: 'Miércoles', isOpen: true, openTime: '10:00', closeTime: '22:00' },
        { day: 'thursday', label: 'Jueves', isOpen: true, openTime: '10:00', closeTime: '22:00' },
        { day: 'friday', label: 'Viernes', isOpen: true, openTime: '10:00', closeTime: '23:00' },
        { day: 'saturday', label: 'Sábado', isOpen: true, openTime: '11:00', closeTime: '23:00' },
        { day: 'sunday', label: 'Domingo', isOpen: true, openTime: '11:00', closeTime: '22:00' }
      ]
    }
  } catch (err: any) {
    console.error('Error cargando detalles del restaurante:', err)
    throw new Error('Error cargando detalles del restaurante')
  }
}

// Métodos de guardado
const saveBusinessProfile = async () => {
  if (!business.value?.id || saving.value) return

  saving.value = true
  try {
    const updateData = {
      ...business.value,
      name: businessProfile.value.name,
      description: businessProfile.value.description,
      contactPhone: businessProfile.value.contactPhone,
      contactEmail: businessProfile.value.contactEmail,
      taxId: businessProfile.value.taxId,
      businessType: businessProfile.value.businessType,
      isActive: businessProfile.value.isActive,
      updatedAt: new Date().toISOString()
    }

    await api.put(`/api/Business/${business.value.id}`, updateData)
    business.value = { ...business.value, ...updateData }

    showSuccess('Perfil del negocio actualizado correctamente')
  } catch (err: any) {
    console.error('Error guardando perfil del negocio:', err)
    showError('Error al guardar los cambios: ' + (err.response?.data?.message || 'Error desconocido'))
  } finally {
    saving.value = false
  }
}

const saveRestaurantProfile = async () => {
  const restaurantId = currentRestaurant.value?.id
  if (!restaurantId || saving.value) return

  saving.value = true
  try {
    const currentRestaurantResponse = await api.get(`/api/Restaurants/${restaurantId}`)
    const currentData = currentRestaurantResponse.data

    const updateData = {
      ...currentData,
      name: restaurantProfile.value.name,
      description: restaurantProfile.value.description,
      estimatedDeliveryTime: restaurantProfile.value.estimatedDeliveryTime,
      deliveryFee: restaurantProfile.value.deliveryFee,
      tipo: restaurantProfile.value.tipo,
      isOpen: restaurantProfile.value.isOpen,
      updatedAt: new Date().toISOString()
    }

    await api.put(`/api/Restaurants/${restaurantId}`, updateData)

    // Actualizar en la lista local
    const restaurantIndex = restaurants.value.findIndex(r => r.id === restaurantId)
    if (restaurantIndex !== -1) {
      restaurants.value[restaurantIndex] = { ...restaurants.value[restaurantIndex], ...updateData }
    }

    showSuccess('Perfil del restaurante actualizado correctamente')
  } catch (err: any) {
    console.error('Error guardando perfil del restaurante:', err)
    showError('Error al guardar los cambios: ' + (err.response?.data?.message || 'Error desconocido'))
  } finally {
    saving.value = false
  }
}

const saveRestaurantAddress = async () => {
  const restaurantId = currentRestaurant.value?.id
  if (!restaurantId || saving.value) return

  saving.value = true
  try {
    const restaurantResponse = await api.get(`/api/Restaurants/${restaurantId}`)
    const restaurant = restaurantResponse.data
    const addressId = restaurant?.addressId

    if (!addressId) {
      throw new Error('No se encontró la dirección del restaurante')
    }

    const currentAddressResponse = await api.get(`/api/Addresses/${addressId}`)
    const currentAddressData = currentAddressResponse.data

    const updateData = {
      ...currentAddressData,
      street: restaurantAddress.value.street,
      city: restaurantAddress.value.city,
      state: restaurantAddress.value.state,
      zipCode: restaurantAddress.value.zipCode,
      phone: restaurantAddress.value.phone,
      latitude: restaurantAddress.value.latitude,
      longitude: restaurantAddress.value.longitude
    }

    await api.put(`/api/Addresses/${addressId}`, updateData)
    showSuccess('Dirección actualizada correctamente')
  } catch (err: any) {
    console.error('Error guardando dirección:', err)
    showError('Error al guardar la dirección: ' + (err.response?.data?.message || 'Error desconocido'))
  } finally {
    saving.value = false
  }
}

// Métodos de imágenes - ARREGLADOS
const handleLogoUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file || uploading.value) return

  try {
    uploading.value = true

    // Validar imagen
    const validation = ImageService.validateImage(file)
    if (!validation.valid) {
      showError(validation.errors.join('\n'))
      return
    }

    // Subir imagen usando el servicio correcto
    const result = await ImageService.uploadFile(
      file,
      selectedEntity.value === 'business' ? 'business' : 'restaurants'
    )

    if (result.imageUrl) {
      if (selectedEntity.value === 'business' && business.value?.id) {
        // Actualizar business
        const updateData = {
          ...business.value,
          logoUrl: result.imageUrl,
          updatedAt: new Date().toISOString()
        }
        await api.put(`/api/Business/${business.value.id}`, updateData)
        business.value = updateData
      } else if (currentRestaurant.value?.id) {
        // Actualizar restaurant
        const currentResponse = await api.get(`/api/Restaurants/${currentRestaurant.value.id}`)
        const updateData = {
          ...currentResponse.data,
          logoUrl: result.imageUrl,
          updatedAt: new Date().toISOString()
        }
        await api.put(`/api/Restaurants/${currentRestaurant.value.id}`, updateData)

        // Actualizar en la lista
        const index = restaurants.value.findIndex(r => r.id === currentRestaurant.value!.id)
        if (index !== -1) {
          restaurants.value[index] = { ...restaurants.value[index], ...updateData }
        }
      }

      showSuccess('Logo subido correctamente')
    }
  } catch (err: any) {
    console.error('Error subiendo logo:', err)
    showError('Error al subir la imagen: ' + (err.response?.data?.message || err.message || 'Error desconocido'))
  } finally {
    uploading.value = false
    // Limpiar el input
    ;(event.target as HTMLInputElement).value = ''
  }
}

const handleCoverUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file || uploading.value) return

  try {
    uploading.value = true

    // Validar imagen
    const validation = ImageService.validateImage(file)
    if (!validation.valid) {
      showError(validation.errors.join('\n'))
      return
    }

    // Subir imagen usando el servicio correcto
    const result = await ImageService.uploadFile(
      file,
      selectedEntity.value === 'business' ? 'business' : 'restaurants'
    )

    if (result.imageUrl) {
      if (selectedEntity.value === 'business' && business.value?.id) {
        // Actualizar business
        const updateData = {
          ...business.value,
          coverImageUrl: result.imageUrl,
          updatedAt: new Date().toISOString()
        }
        await api.put(`/api/Business/${business.value.id}`, updateData)
        business.value = updateData
      } else if (currentRestaurant.value?.id) {
        // Actualizar restaurant
        const currentResponse = await api.get(`/api/Restaurants/${currentRestaurant.value.id}`)
        const updateData = {
          ...currentResponse.data,
          coverImageUrl: result.imageUrl,
          updatedAt: new Date().toISOString()
        }
        await api.put(`/api/Restaurants/${currentRestaurant.value.id}`, updateData)

        // Actualizar en la lista
        const index = restaurants.value.findIndex(r => r.id === currentRestaurant.value!.id)
        if (index !== -1) {
          restaurants.value[index] = { ...restaurants.value[index], ...updateData }
        }
      }

      showSuccess('Imagen de portada subida correctamente')
    }
  } catch (err: any) {
    console.error('Error subiendo portada:', err)
    showError('Error al subir la imagen: ' + (err.response?.data?.message || err.message || 'Error desconocido'))
  } finally {
    uploading.value = false
    // Limpiar el input
    ;(event.target as HTMLInputElement).value = ''
  }
}

const removeLogo = async () => {
  if (!confirm('¿Estás seguro de que quieres eliminar el logo?')) return

  try {
    uploading.value = true

    if (selectedEntity.value === 'business' && business.value?.id) {
      const updateData = {
        ...business.value,
        logoUrl: '',
        updatedAt: new Date().toISOString()
      }
      await api.put(`/api/Business/${business.value.id}`, updateData)
      business.value = updateData
    } else if (currentRestaurant.value?.id) {
      const currentResponse = await api.get(`/api/Restaurants/${currentRestaurant.value.id}`)
      const updateData = {
        ...currentResponse.data,
        logoUrl: '',
        updatedAt: new Date().toISOString()
      }
      await api.put(`/api/Restaurants/${currentRestaurant.value.id}`, updateData)

      const index = restaurants.value.findIndex(r => r.id === currentRestaurant.value!.id)
      if (index !== -1) {
        restaurants.value[index] = { ...restaurants.value[index], ...updateData }
      }
    }

    showSuccess('Logo eliminado correctamente')
  } catch (err: any) {
    console.error('Error eliminando logo:', err)
    showError('Error al eliminar el logo')
  } finally {
    uploading.value = false
  }
}

const removeCover = async () => {
  if (!confirm('¿Estás seguro de que quieres eliminar la imagen de portada?')) return

  try {
    uploading.value = true

    if (selectedEntity.value === 'business' && business.value?.id) {
      const updateData = {
        ...business.value,
        coverImageUrl: '',
        updatedAt: new Date().toISOString()
      }
      await api.put(`/api/Business/${business.value.id}`, updateData)
      business.value = updateData
    } else if (currentRestaurant.value?.id) {
      const currentResponse = await api.get(`/api/Restaurants/${currentRestaurant.value.id}`)
      const updateData = {
        ...currentResponse.data,
        coverImageUrl: '',
        updatedAt: new Date().toISOString()
      }
      await api.put(`/api/Restaurants/${currentRestaurant.value.id}`, updateData)

      const index = restaurants.value.findIndex(r => r.id === currentRestaurant.value!.id)
      if (index !== -1) {
        restaurants.value[index] = { ...restaurants.value[index], ...updateData }
      }
    }

    showSuccess('Imagen de portada eliminada correctamente')
  } catch (err: any) {
    console.error('Error eliminando portada:', err)
    showError('Error al eliminar la imagen de portada')
  } finally {
    uploading.value = false
  }
}

// Métodos de horarios
const applyMondayToAll = () => {
  const monday = currentHours.value.find(day => day.day === 'monday')
  if (monday) {
    currentHours.value.forEach(day => {
      if (day.day !== 'monday') {
        day.isOpen = monday.isOpen
        day.openTime = monday.openTime
        day.closeTime = monday.closeTime
      }
    })
  }
}

const saveHours = async () => {
  if (saving.value) return

  saving.value = true
  try {
    const entityName = selectedEntity.value === 'business' ? 'negocio' : 'restaurante'

    // Aquí puedes implementar el guardado real en el backend
    // Por ahora solo simulamos
    console.log(`Guardando horarios del ${entityName}:`, currentHours.value)

    // Simulamos una llamada a la API
    await new Promise(resolve => setTimeout(resolve, 1000))

    showSuccess(`Horarios del ${entityName} guardados correctamente`)
  } catch (err: any) {
    console.error('Error guardando horarios:', err)
    showError('Error al guardar los horarios')
  } finally {
    saving.value = false
  }
}

// Cambio de contraseña
const changePassword = async () => {
  if (saving.value) return

  try {
    passwordError.value = ''

    if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
      passwordError.value = 'Las contraseñas no coinciden'
      return
    }

    if (passwordForm.value.newPassword.length < 8) {
      passwordError.value = 'La nueva contraseña debe tener al menos 8 caracteres'
      return
    }

    saving.value = true

    const userId = authStore.user?.id
    await api.post(`/api/Users/${userId}/password`, {
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword
    })

    passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
    showSuccess('Contraseña cambiada correctamente')
  } catch (err: any) {
    passwordError.value = err.response?.data?.message || 'Error al cambiar la contraseña'
  } finally {
    saving.value = false
  }
}

// Métodos de manejo de eventos
const onEntityChange = () => {
  activeTab.value = 'profile'

  if (selectedEntity.value.startsWith('restaurant-')) {
    const restaurantId = parseInt(selectedEntity.value.replace('restaurant-', ''))
    loadRestaurantDetails(restaurantId).catch(err => {
      showError('Error cargando detalles del restaurante')
    })
  }
}

const resetBusinessForm = () => {
  if (business.value) {
    businessProfile.value = {
      name: business.value.name || '',
      description: business.value.description || '',
      contactPhone: business.value.contactPhone || '',
      contactEmail: business.value.contactEmail || '',
      taxId: business.value.taxId || '',
      businessType: business.value.businessType || 'Restaurant',
      isActive: business.value.isActive ?? true
    }
  }
}

const resetRestaurantForm = () => {
  if (currentRestaurant.value) {
    loadRestaurantDetails(currentRestaurant.value.id).catch(err => {
      showError('Error cargando datos del restaurante')
    })
  }
}

const resetAddressForm = () => {
  restaurantAddress.value = {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    latitude: null,
    longitude: null
  }
}

// Métodos de utilidad
const showSuccess = (message: string) => {
  alert(message) // Puedes reemplazar con tu sistema de notificaciones
}

const showError = (message: string) => {
  alert(message) // Puedes reemplazar con tu sistema de notificaciones
}

const retryLoad = async () => {
  error.value = null
  await loadInitialData()
}

const loadInitialData = async () => {
  loading.value = true
  error.value = null

  try {
    await loadBusiness()
    await loadRestaurants()
  } catch (err: any) {
    error.value = err.message || 'Error cargando datos'
  } finally {
    loading.value = false
  }
}

// Ciclo de vida
onMounted(() => {
  loadInitialData()
})

// Watchers
watch(selectedEntity, (newEntity) => {
  if (newEntity.startsWith('restaurant-')) {
    const restaurantId = parseInt(newEntity.replace('restaurant-', ''))
    loadRestaurantDetails(restaurantId).catch(err => {
      showError('Error cargando detalles del restaurante')
    })
  }
}, { immediate: false })
</script>

<style lang="scss" scoped>
.business-settings {
  padding: 1rem;
  margin: 0 auto;

  &__loading,
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
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }

  &__error-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    gap: 1rem;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: stretch;
    }
  }

  &__title {
    font-size: 2rem;
    font-weight: 700;
    margin: 0;
    color: #1e293b;
  }

  &__entity-selector {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.95rem;
  }

  &__selector-label {
    color: #64748b;
    font-weight: 500;
    white-space: nowrap;
  }

  &__selector {
    padding: 0.75rem 1rem;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    background-color: white;
    color: #1e293b;
    font-size: 0.95rem;
    min-width: 220px;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: #06a98d;
      box-shadow: 0 0 0 3px rgba(6, 169, 141, 0.1);
    }
  }

  &__tabs {
    display: flex;
    overflow-x: auto;
    gap: 0.5rem;
    margin-bottom: 2rem;
    padding-bottom: 0.25rem;
    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &__tab {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.5rem;
    background-color: white;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    font-size: 0.95rem;
    font-weight: 500;
    color: #64748b;
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;
    text-decoration: none;

    &:hover {
      background-color: #f8fafc;
      color: #1e293b;
      border-color: #cbd5e1;
    }

    &--active {
      background-color: #f0fdfa;
      color: #06a98d;
      border-color: #06a98d;
      font-weight: 600;
    }
  }

  &__tab-icon {
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 20px;
      height: 20px;
    }
  }

  &__content {
    margin-bottom: 2rem;
  }

  &__section {
    background-color: white;
    border-radius: 16px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    padding: 2rem;
    border: 1px solid #f1f5f9;
  }

  &__section-header {
    margin-bottom: 2rem;
  }

  &__section-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0 0 0.5rem;
    color: #1e293b;
  }

  &__section-description {
    font-size: 1rem;
    color: #64748b;
    margin: 0;
    line-height: 1.5;
  }

  &__form {
    max-width: 800px;
  }

  &__form-group {
    margin-bottom: 1.5rem;
  }

  &__form-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-bottom: 1.5rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__label {
    display: block;
    font-size: 0.95rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    color: #1e293b;
  }

  &__input,
  &__select,
  &__textarea {
    width: 100%;
    padding: 0.875rem 1.125rem;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    font-size: 1rem;
    color: #1e293b;
    transition: all 0.2s ease;
    box-sizing: border-box;
    background-color: white;

    &:focus {
      outline: none;
      border-color: #06a98d;
      box-shadow: 0 0 0 3px rgba(6, 169, 141, 0.1);
    }

    &:disabled {
      background-color: #f8fafc;
      color: #94a3b8;
      cursor: not-allowed;
    }

    &::placeholder {
      color: #94a3b8;
    }
  }

  &__textarea {
    resize: vertical;
    min-height: 120px;
    line-height: 1.5;
  }

  &__input-help {
    font-size: 0.875rem;
    color: #64748b;
    margin: 0.5rem 0 0;
    line-height: 1.4;
  }

  &__form-error {
    margin-bottom: 1.5rem;
    padding: 1rem 1.25rem;
    background-color: #fef2f2;
    color: #dc2626;
    border: 2px solid #fecaca;
    border-radius: 12px;
    font-size: 0.95rem;
    font-weight: 500;
  }

  &__radio-group {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }

  &__radio {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    background-color: white;
    transition: all 0.2s ease;
    cursor: pointer;

    &:hover {
      border-color: #cbd5e1;
      background-color: #f8fafc;
    }

    &:has(input:checked) {
      border-color: #06a98d;
      background-color: #f0fdfa;
    }
  }

  &__radio-input {
    margin: 0;
    width: 1.25rem;
    height: 1.25rem;
    accent-color: #06a98d;
  }

  &__radio-label {
    font-size: 0.95rem;
    color: #1e293b;
    cursor: pointer;
    font-weight: 500;
  }

  &__checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    font-size: 1rem;
    color: #1e293b;
    font-weight: 500;
  }

  &__checkbox {
    margin: 0;
    width: 1.25rem;
    height: 1.25rem;
    accent-color: #06a98d;
  }

  &__form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2.5rem;

    @media (max-width: 480px) {
      flex-direction: column;
    }
  }

  &__button {
    padding: 1rem 2rem;
    border-radius: 12px;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    &--primary {
      background-color: #06a98d;
      color: white;

      &:hover:not(:disabled) {
        background-color: #058a73;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(6, 169, 141, 0.25);
      }
    }

    &--secondary {
      background-color: white;
      color: #64748b;
      border: 2px solid #e2e8f0;

      &:hover:not(:disabled) {
        background-color: #f8fafc;
        color: #1e293b;
        border-color: #cbd5e1;
      }
    }

    @media (max-width: 480px) {
      width: 100%;
    }
  }

  // Estilos para imágenes
  &__upload-loading {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
    padding: 1.25rem 1.5rem;
    background: linear-gradient(135deg, #f0fdfa, #ccfbf1);
    border: 2px solid #06a98d;
    border-radius: 12px;
    color: #06a98d;
    font-weight: 500;
  }

  &__upload-spinner {
    width: 24px;
    height: 24px;
    border: 3px solid #ccfbf1;
    border-radius: 50%;
    border-top-color: #06a98d;
    animation: spin 1s linear infinite;
  }

  &__images-container {
    display: flex;
    flex-direction: column;
    gap: 3rem;
  }

  &__image-section {
    &:last-child {
      margin-bottom: 0;
    }
  }

  &__image-title {
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0 0 0.5rem;
    color: #1e293b;
  }

  &__image-description {
    font-size: 0.95rem;
    color: #64748b;
    margin: 0 0 1.5rem;
    line-height: 1.5;
  }

  &__logo-uploader {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    align-items: flex-start;
  }

  &__logo-preview {
    width: 150px;
    height: 150px;
    border-radius: 16px;
    overflow: hidden;
    border: 3px solid #e2e8f0;
    transition: all 0.2s ease;

    &:hover {
      border-color: #cbd5e1;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__logo-placeholder {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #f8fafc, #f1f5f9);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #94a3b8;

    svg {
      width: 48px;
      height: 48px;
    }
  }

  &__logo-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  &__upload-btn {
    padding: 0.875rem 1.5rem;
    background: linear-gradient(135deg, #f8fafc, #f1f5f9);
    color: #1e293b;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    display: inline-block;
    text-decoration: none;

    &:hover:not(&--disabled) {
      background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
      border-color: #cbd5e1;
      transform: translateY(-1px);
    }

    &--disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  &__file-input {
    display: none;
  }

  &__remove-btn {
    padding: 0.875rem 1.5rem;
    background: linear-gradient(135deg, #fef2f2, #fee2e2);
    color: #dc2626;
    border: 2px solid #fecaca;
    border-radius: 12px;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: linear-gradient(135deg, #fee2e2, #fecaca);
      border-color: #f87171;
      transform: translateY(-1px);
    }
  }

  &__cover-uploader {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    align-items: flex-start;
  }

  &__cover-preview {
    width: 100%;
    max-width: 500px;
    height: 200px;
    border-radius: 16px;
    overflow: hidden;
    border: 3px solid #e2e8f0;
    transition: all 0.2s ease;

    &:hover {
      border-color: #cbd5e1;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__cover-placeholder {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #f8fafc, #f1f5f9);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #94a3b8;
    gap: 0.75rem;

    svg {
      width: 48px;
      height: 48px;
    }

    span {
      font-size: 1rem;
      font-weight: 500;
    }
  }

  &__cover-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  // Estilos para horarios
  &__hours-container {
    max-width: 700px;
  }

  &__hours-row {
    display: flex;
    align-items: center;
    gap: 2rem;
    padding: 1.25rem 0;
    border-bottom: 1px solid #f1f5f9;

    &:last-child {
      border-bottom: none;
    }

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }
  }

  &__day-checkbox {
    width: 150px;
    flex-shrink: 0;

    @media (max-width: 768px) {
      width: 100%;
    }
  }

  &__hours-inputs {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex: 1;

    &--disabled {
      opacity: 0.5;
      pointer-events: none;
    }

    @media (max-width: 768px) {
      width: 100%;
    }
  }

  &__hours-input-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex: 1;
  }

  &__hours-label {
    font-size: 0.875rem;
    color: #64748b;
    font-weight: 500;
  }

  &__hours-input {
    padding: 0.75rem 1rem;
    border: 2px solid #e2e8f0;
    border-radius: 10px;
    font-size: 0.95rem;
    color: #1e293b;
    transition: all 0.2s ease;
    width: 100%;
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: #06a98d;
      box-shadow: 0 0 0 3px rgba(6, 169, 141, 0.1);
    }

    &:disabled {
      background-color: #f8fafc;
      cursor: not-allowed;
    }
  }

  &__hours-separator {
    color: #64748b;
    font-weight: 500;
    align-self: flex-end;
    padding-bottom: 0.75rem;
  }

  &__hours-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 2rem;
    gap: 1rem;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: stretch;
    }
  }

  // Estilos para cuenta
  &__account-container {
    display: flex;
    flex-direction: column;
    gap: 3rem;
  }

  &__account-section {
    &:last-child {
      margin-bottom: 0;
    }
  }

  &__account-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0 0 1.5rem;
    color: #1e293b;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid #f1f5f9;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
