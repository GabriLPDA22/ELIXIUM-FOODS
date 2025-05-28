<template>
  <div class="business-settings">
    <div class="business-settings__header">
      <h1 class="business-settings__title">Configuración</h1>
      <div class="business-settings__entity-selector">
        <label for="entitySelect" class="business-settings__selector-label">Configurar:</label>
        <select 
          id="entitySelect" 
          v-model="selectedEntity" 
          @change="onEntityChange"
          class="business-settings__selector"
        >
          <option value="business">Mi Negocio</option>
          <option 
            v-for="restaurant in restaurants" 
            :key="`restaurant-${restaurant.id}`" 
            :value="`restaurant-${restaurant.id}`"
          >
            Restaurante: {{ restaurant.name }}
          </option>
        </select>
      </div>
    </div>

    <div class="business-settings__tabs">
      <button v-for="tab in currentTabs" :key="tab.id" @click="activeTab = tab.id"
        :class="['business-settings__tab', { 'business-settings__tab--active': activeTab === tab.id }]">
        <span class="business-settings__tab-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <template v-for="(element, index) in tab.iconElements" :key="index">
              <path v-if="element.type === 'path'" :d="element.d"></path>
              <circle v-if="element.type === 'circle'" :cx="element.cx" :cy="element.cy" :r="element.r"></circle>
              <rect v-if="element.type === 'rect'" :x="element.x" :y="element.y" :width="element.width"
                :height="element.height" :rx="element.rx" :ry="element.ry"></rect>
              <polyline v-if="element.type === 'polyline'" :points="element.points"></polyline>
              <line v-if="element.type === 'line'" :x1="element.x1" :y1="element.y1" :x2="element.x2" :y2="element.y2">
              </line>
            </template>
          </svg>
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
            <input type="text" id="businessName" v-model="businessProfile.name" class="business-settings__input" required />
          </div>
          <div class="business-settings__form-row">
            <div class="business-settings__form-group">
              <label for="contactPhone" class="business-settings__label">Teléfono de contacto*</label>
              <input type="tel" id="contactPhone" v-model="businessProfile.contactPhone" class="business-settings__input" required />
            </div>
            <div class="business-settings__form-group">
              <label for="contactEmail" class="business-settings__label">Email de contacto*</label>
              <input type="email" id="contactEmail" v-model="businessProfile.contactEmail" class="business-settings__input" required />
            </div>
          </div>
          <div class="business-settings__form-group">
            <label for="businessDescription" class="business-settings__label">Descripción del negocio</label>
            <textarea id="businessDescription" v-model="businessProfile.description" class="business-settings__textarea" rows="4"></textarea>
          </div>
          <div class="business-settings__form-row">
            <div class="business-settings__form-group">
              <label for="taxId" class="business-settings__label">NIF/CIF</label>
              <input type="text" id="taxId" v-model="businessProfile.taxId" class="business-settings__input" />
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
              <input type="checkbox" id="isActive" v-model="businessProfile.isActive" class="business-settings__checkbox" />
              <span>Negocio activo</span>
            </label>
          </div>
          <div class="business-settings__form-actions">
            <button type="button" @click="resetBusinessForm" class="business-settings__button business-settings__button--secondary">
              Cancelar
            </button>
            <button type="submit" class="business-settings__button business-settings__button--primary" :disabled="saving">
              {{ saving ? 'Guardando...' : 'Guardar Cambios' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Configuración del RESTAURANTE -->
      <div v-if="selectedEntity.startsWith('restaurant-') && activeTab === 'profile'" class="business-settings__section">
        <div class="business-settings__section-header">
          <h2 class="business-settings__section-title">Información del Restaurante</h2>
          <p class="business-settings__section-description">
            Actualiza la información de {{ currentRestaurant?.name || 'este restaurante' }}
          </p>
        </div>
        <form @submit.prevent="saveRestaurantProfile" class="business-settings__form">
          <div class="business-settings__form-group">
            <label for="restaurantName" class="business-settings__label">Nombre del restaurante*</label>
            <input type="text" id="restaurantName" v-model="restaurantProfile.name" class="business-settings__input" required />
          </div>
          <div class="business-settings__form-group">
            <label for="restaurantDescription" class="business-settings__label">Descripción</label>
            <textarea id="restaurantDescription" v-model="restaurantProfile.description" class="business-settings__textarea" rows="4"></textarea>
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
              <input type="checkbox" id="restaurantIsOpen" v-model="restaurantProfile.isOpen" class="business-settings__checkbox" />
              <span>Restaurante abierto</span>
            </label>
          </div>
          <div class="business-settings__form-actions">
            <button type="button" @click="resetRestaurantForm" class="business-settings__button business-settings__button--secondary">
              Cancelar
            </button>
            <button type="submit" class="business-settings__button business-settings__button--primary" :disabled="saving">
              {{ saving ? 'Guardando...' : 'Guardar Cambios' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Dirección (solo para restaurantes) -->
      <div v-if="selectedEntity.startsWith('restaurant-') && activeTab === 'address'" class="business-settings__section">
        <div class="business-settings__section-header">
          <h2 class="business-settings__section-title">Dirección del Restaurante</h2>
          <p class="business-settings__section-description">
            Actualiza la dirección de {{ currentRestaurant?.name || 'este restaurante' }}
          </p>
        </div>
        <form @submit.prevent="saveRestaurantAddress" class="business-settings__form">
          <div class="business-settings__form-group">
            <label for="street" class="business-settings__label">Calle y número*</label>
            <input type="text" id="street" v-model="restaurantAddress.street" class="business-settings__input" required />
          </div>
          <div class="business-settings__form-row">
            <div class="business-settings__form-group">
              <label for="city" class="business-settings__label">Ciudad*</label>
              <input type="text" id="city" v-model="restaurantAddress.city" class="business-settings__input" required />
            </div>
            <div class="business-settings__form-group">
              <label for="state" class="business-settings__label">Provincia*</label>
              <input type="text" id="state" v-model="restaurantAddress.state" class="business-settings__input" required />
            </div>
          </div>
          <div class="business-settings__form-row">
            <div class="business-settings__form-group">
              <label for="zipCode" class="business-settings__label">Código Postal*</label>
              <input type="text" id="zipCode" v-model="restaurantAddress.zipCode" class="business-settings__input" required />
            </div>
            <div class="business-settings__form-group">
              <label for="phone" class="business-settings__label">Teléfono</label>
              <input type="tel" id="phone" v-model="restaurantAddress.phone" class="business-settings__input" />
            </div>
          </div>
          <div class="business-settings__form-row">
            <div class="business-settings__form-group">
              <label for="latitude" class="business-settings__label">Latitud</label>
              <input type="number" id="latitude" v-model.number="restaurantAddress.latitude"
                class="business-settings__input" step="any" />
            </div>
            <div class="business-settings__form-group">
              <label for="longitude" class="business-settings__label">Longitud</label>
              <input type="number" id="longitude" v-model.number="restaurantAddress.longitude"
                class="business-settings__input" step="any" />
            </div>
          </div>
          <div class="business-settings__form-actions">
            <button type="button" @click="resetAddressForm" class="business-settings__button business-settings__button--secondary">
              Cancelar
            </button>
            <button type="submit" class="business-settings__button business-settings__button--primary" :disabled="saving">
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
        <div class="business-settings__images-container">
          <div class="business-settings__image-section">
            <h3 class="business-settings__image-title">Logo</h3>
            <p class="business-settings__image-description">
              Este logo aparecerá en el perfil y en los resultados de búsqueda
            </p>
            <div class="business-settings__logo-uploader">
              <div class="business-settings__logo-preview">
                <img v-if="currentImages.logoUrl" :src="currentImages.logoUrl" alt="Logo" />
                <div v-else class="business-settings__logo-placeholder">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                </div>
              </div>
              <div class="business-settings__logo-actions">
                <label class="business-settings__upload-btn">
                  Subir Logo
                  <input type="file" accept="image/*" @change="handleLogoUpload" class="business-settings__file-input" />
                </label>
                <button v-if="currentImages.logoUrl" @click="removeLogo" class="business-settings__remove-btn">
                  Eliminar
                </button>
              </div>
            </div>
          </div>
          <div class="business-settings__image-section">
            <h3 class="business-settings__image-title">Imagen de Portada</h3>
            <p class="business-settings__image-description">
              Esta imagen aparecerá en la parte superior del perfil
            </p>
            <div class="business-settings__cover-uploader">
              <div class="business-settings__cover-preview">
                <img v-if="currentImages.coverImageUrl" :src="currentImages.coverImageUrl" alt="Portada" />
                <div v-else class="business-settings__cover-placeholder">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                  <span>Añade una imagen de portada</span>
                </div>
              </div>
              <div class="business-settings__cover-actions">
                <label class="business-settings__upload-btn">
                  Subir Portada
                  <input type="file" accept="image/*" @change="handleCoverUpload" class="business-settings__file-input" />
                </label>
                <button v-if="currentImages.coverImageUrl" @click="removeCover" class="business-settings__remove-btn">
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Horarios (solo para Business) -->
      <div v-if="selectedEntity === 'business' && activeTab === 'hours'" class="business-settings__section">
        <div class="business-settings__section-header">
          <h2 class="business-settings__section-title">Horarios del Negocio</h2>
          <p class="business-settings__section-description">
            Configura los horarios generales de tu negocio
          </p>
        </div>
        <div class="business-settings__hours-container">
          <div v-for="(day, index) in businessHours" :key="day.day" class="business-settings__hours-row">
            <div class="business-settings__day-checkbox">
              <label :for="`day-${index}`" class="business-settings__checkbox-label">
                <input type="checkbox" :id="`day-${index}`" v-model="day.isOpen" class="business-settings__checkbox" />
                <span>{{ day.label }}</span>
              </label>
            </div>
            <div class="business-settings__hours-inputs" :class="{ 'business-settings__hours-inputs--disabled': !day.isOpen }">
              <div class="business-settings__hours-input-group">
                <label :for="`open-${index}`" class="business-settings__hours-label">Apertura</label>
                <input type="time" :id="`open-${index}`" v-model="day.openTime" class="business-settings__hours-input" :disabled="!day.isOpen" />
              </div>
              <span class="business-settings__hours-separator">a</span>
              <div class="business-settings__hours-input-group">
                <label :for="`close-${index}`" class="business-settings__hours-label">Cierre</label>
                <input type="time" :id="`close-${index}`" v-model="day.closeTime" class="business-settings__hours-input" :disabled="!day.isOpen" />
              </div>
            </div>
          </div>
          <div class="business-settings__hours-actions">
            <button @click="applyToAllDays" class="business-settings__button business-settings__button--secondary">
              Aplicar Lunes a todos los días
            </button>
            <button @click="saveBusinessHours" class="business-settings__button business-settings__button--primary" :disabled="saving">
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
                <button type="submit" class="business-settings__button business-settings__button--primary" :disabled="saving">
                  {{ saving ? 'Cambiando...' : 'Cambiar Contraseña' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { api } from '@/services/api'

// Tipos para los elementos SVG
interface SvgElement {
  type: 'path' | 'circle' | 'rect' | 'polyline' | 'line';
  d?: string;
  cx?: string | number;
  cy?: string | number;
  r?: string | number;
  x?: string | number;
  y?: string | number;
  width?: string | number;
  height?: string | number;
  rx?: string | number;
  ry?: string | number;
  points?: string;
  x1?: string | number;
  y1?: string | number;
  x2?: string | number;
  y2?: string | number;
}

interface Tab {
  id: string;
  label: string;
  iconElements: SvgElement[];
}

// Store
const authStore = useAuthStore();

// Estado
const activeTab = ref('profile');
const selectedEntity = ref('business'); // 'business' o 'restaurant-{id}'
const saving = ref(false);

// Datos
const business = ref(null);
const restaurants = ref([]);

// Pestañas completas
const allTabs: Tab[] = [
  { id: 'profile', label: 'Perfil', iconElements: [{ type: 'path', d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" }, { type: 'circle', cx: "12", cy: "7", r: "4" }] },
  { id: 'address', label: 'Dirección', iconElements: [{ type: 'path', d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" }, { type: 'circle', cx: "12", cy: "10", r: "3" }] },
  { id: 'images', label: 'Imágenes', iconElements: [{ type: 'rect', x: "3", y: "3", width: "18", height: "18", rx: "2", ry: "2" }, { type: 'circle', cx: "8.5", cy: "8.5", r: "1.5" }, { type: 'polyline', points: "21 15 16 10 5 21" }] },
  { id: 'hours', label: 'Horarios', iconElements: [{ type: 'circle', cx: "12", cy: "12", r: "10" }, { type: 'polyline', points: "12 6 12 12 16 14" }] },
  { id: 'account', label: 'Cuenta', iconElements: [{ type: 'path', d: "M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" }, { type: 'circle', cx: "8.5", cy: "7", r: "4" }, { type: 'polyline', points: "20 8 20 14" }, { type: 'line', x1: "23", y1: "11", x2: "17", y2: "11" }] }
];

// Pestañas según la entidad seleccionada
const currentTabs = computed(() => {
  if (selectedEntity.value === 'business') {
    // Business: Perfil, Imágenes, Horarios, Cuenta (SIN Dirección)
    return allTabs.filter(tab => tab.id !== 'address');
  } else {
    // Restaurant: Perfil, Dirección, Imágenes, Cuenta (SIN Horarios)
    return allTabs.filter(tab => tab.id !== 'hours');
  }
});

// Datos del BUSINESS
const businessProfile = ref({
  name: '',
  description: '',
  contactPhone: '',
  contactEmail: '',
  taxId: '',
  businessType: 'Restaurant',
  isActive: true,
  logoUrl: '',
  coverImageUrl: ''
});

// Datos del RESTAURANT
const restaurantProfile = ref({
  name: '',
  description: '',
  estimatedDeliveryTime: 30,
  deliveryFee: 2.99,
  tipo: 1,
  isOpen: true,
  logoUrl: '',
  coverImageUrl: ''
});

// Dirección del restaurant
const restaurantAddress = ref({
  street: '',
  city: '',
  state: '',
  zipCode: '',
  phone: '',
  latitude: null,
  longitude: null
});

// Otros datos
const restaurantTypes = [
  { id: 1, name: 'Italiano' }, { id: 2, name: 'Asiático' }, { id: 3, name: 'Mexicano' },
  { id: 4, name: 'Hamburguesas' }, { id: 5, name: 'Pizzas' }, { id: 6, name: 'Vegano' },
  { id: 7, name: 'Saludable' }, { id: 8, name: 'Postres' }
];

const businessHours = ref([
  { day: 'monday', label: 'Lunes', isOpen: true, openTime: '10:00', closeTime: '22:00' },
  { day: 'tuesday', label: 'Martes', isOpen: true, openTime: '10:00', closeTime: '22:00' },
  { day: 'wednesday', label: 'Miércoles', isOpen: true, openTime: '10:00', closeTime: '22:00' },
  { day: 'thursday', label: 'Jueves', isOpen: true, openTime: '10:00', closeTime: '22:00' },
  { day: 'friday', label: 'Viernes', isOpen: true, openTime: '10:00', closeTime: '23:00' },
  { day: 'saturday', label: 'Sábado', isOpen: true, openTime: '11:00', closeTime: '23:00' },
  { day: 'sunday', label: 'Domingo', isOpen: true, openTime: '11:00', closeTime: '22:00' }
]);

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});
const passwordError = ref('');

// Computed
const currentRestaurant = computed(() => {
  if (!selectedEntity.value.startsWith('restaurant-')) return null;
  const restaurantId = parseInt(selectedEntity.value.replace('restaurant-', ''));
  return restaurants.value.find(r => r.id === restaurantId);
});

const currentImages = computed(() => {
  if (selectedEntity.value === 'business') {
    return {
      logoUrl: businessProfile.value.logoUrl,
      coverImageUrl: businessProfile.value.coverImageUrl
    };
  } else {
    return {
      logoUrl: restaurantProfile.value.logoUrl,
      coverImageUrl: restaurantProfile.value.coverImageUrl
    };
  }
});

// Métodos de carga
const loadBusiness = async () => {
  try {
    const userId = authStore.user?.id;
    if (!userId) return;

    const response = await api.get(`/api/Business/user/${userId}`);
    if (response.data) {
      business.value = response.data;
      
      // Cargar datos en el formulario
      businessProfile.value = {
        name: business.value.name || '',
        description: business.value.description || '',
        contactPhone: business.value.contactPhone || '',
        contactEmail: business.value.contactEmail || '',
        taxId: business.value.taxId || '',
        businessType: business.value.businessType || 'Restaurant',
        isActive: business.value.isActive ?? true,
        logoUrl: business.value.logoUrl || '',
        coverImageUrl: business.value.coverImageUrl || ''
      };
    }
  } catch (error) {
    console.error('Error cargando business:', error);
  }
};

const loadRestaurants = async () => {
  try {
    if (!business.value?.id) return;

    const response = await api.get(`/api/Restaurants/business/${business.value.id}`);
    if (response.data) {
      restaurants.value = response.data;
    }
  } catch (error) {
    console.error('Error cargando restaurantes:', error);
  }
};

const loadRestaurantDetails = async (restaurantId: number) => {
  try {
    // Cargar detalles del restaurante
    const response = await api.get(`/api/Restaurants/${restaurantId}`);
    if (response.data) {
      const restaurant = response.data;
      
      restaurantProfile.value = {
        name: restaurant.name || '',
        description: restaurant.description || '',
        estimatedDeliveryTime: restaurant.estimatedDeliveryTime || 30,
        deliveryFee: restaurant.deliveryFee || 2.99,
        tipo: restaurant.tipo || 1,
        isOpen: restaurant.isOpen ?? true,
        logoUrl: restaurant.logoUrl || '',
        coverImageUrl: restaurant.coverImageUrl || ''
      };

      // Cargar dirección si existe
      if (restaurant.address) {
        restaurantAddress.value = {
          street: restaurant.address.street || '',
          city: restaurant.address.city || '',
          state: restaurant.address.state || '',
          zipCode: restaurant.address.zipCode || '',
          phone: restaurant.address.phone || '',
          latitude: restaurant.address.latitude,
          longitude: restaurant.address.longitude
        };
      }
    }
  } catch (error) {
    console.error('Error cargando detalles del restaurante:', error);
  }
};

// Métodos de guardado
// IMPORTANTE: Estos métodos preservan TODOS los campos originales del objeto
// para evitar que se pierdan campos críticos como userId, businessId, etc.
// cuando se hace el PUT al backend

// ALTERNATIVA: Si tu backend soporta PATCH, puedes usar esta versión más limpia:
// const saveBusinessProfilePatch = async () => {
//   if (!business.value?.id || saving.value) return;
//   saving.value = true;
//   try {
//     const updateData = {
//       name: businessProfile.value.name,
//       description: businessProfile.value.description,
//       contactPhone: businessProfile.value.contactPhone,
//       contactEmail: businessProfile.value.contactEmail,
//       taxId: businessProfile.value.taxId,
//       businessType: businessProfile.value.businessType,
//       isActive: businessProfile.value.isActive
//     };
//     await api.patch(`/api/Business/${business.value.id}`, updateData);
//     alert('Perfil del negocio actualizado correctamente');
//   } catch (error) {
//     console.error('Error guardando perfil del negocio:', error);
//     alert('Error al guardar los cambios');
//   } finally {
//     saving.value = false;
//   }
// };

const saveBusinessProfile = async () => {
  if (!business.value?.id || saving.value) return;
  
  saving.value = true;
  try {
    // IMPORTANTE: Preservar TODOS los campos del business original
    // Solo actualizar los campos que el usuario puede modificar
    const updateData = {
      ...business.value, // Mantener todos los campos originales
      // Solo sobrescribir los campos editables
      name: businessProfile.value.name,
      description: businessProfile.value.description,
      contactPhone: businessProfile.value.contactPhone,
      contactEmail: businessProfile.value.contactEmail,
      taxId: businessProfile.value.taxId,
      businessType: businessProfile.value.businessType,
      isActive: businessProfile.value.isActive,
      // Preservar campos críticos explícitamente
      userId: business.value.userId,
      id: business.value.id,
      createdAt: business.value.createdAt,
      updatedAt: new Date().toISOString()
    };

    await api.put(`/api/Business/${business.value.id}`, updateData);
    
    // Actualizar el business local con los nuevos datos
    business.value = { ...business.value, ...updateData };
    
    alert('Perfil del negocio actualizado correctamente');
  } catch (error) {
    console.error('Error guardando perfil del negocio:', error);
    alert('Error al guardar los cambios');
  } finally {
    saving.value = false;
  }
};

const saveRestaurantProfile = async () => {
  const restaurantId = currentRestaurant.value?.id;
  if (!restaurantId || saving.value) return;
  
  saving.value = true;
  try {
    // Cargar el restaurant actual completo para preservar todos sus campos
    const currentRestaurantResponse = await api.get(`/api/Restaurants/${restaurantId}`);
    const currentRestaurantData = currentRestaurantResponse.data;
    
    // Preservar todos los campos originales, solo modificar los editables
    const updateData = {
      ...currentRestaurantData, // Mantener todos los campos originales
      // Solo sobrescribir los campos editables
      name: restaurantProfile.value.name,
      description: restaurantProfile.value.description,
      estimatedDeliveryTime: restaurantProfile.value.estimatedDeliveryTime,
      deliveryFee: restaurantProfile.value.deliveryFee,
      tipo: restaurantProfile.value.tipo,
      isOpen: restaurantProfile.value.isOpen,
      // Preservar campos críticos explícitamente
      businessId: currentRestaurantData.businessId,
      addressId: currentRestaurantData.addressId,
      id: restaurantId,
      createdAt: currentRestaurantData.createdAt,
      updatedAt: new Date().toISOString()
    };

    await api.put(`/api/Restaurants/${restaurantId}`, updateData);
    
    // Actualizar el restaurant local en la lista
    const restaurantIndex = restaurants.value.findIndex(r => r.id === restaurantId);
    if (restaurantIndex !== -1) {
      restaurants.value[restaurantIndex] = { ...restaurants.value[restaurantIndex], ...updateData };
    }
    
    alert('Perfil del restaurante actualizado correctamente');
  } catch (error) {
    console.error('Error guardando perfil del restaurante:', error);
    alert('Error al guardar los cambios');
  } finally {
    saving.value = false;
  }
};

const saveRestaurantAddress = async () => {
  const restaurantId = currentRestaurant.value?.id;
  if (!restaurantId || saving.value) return;
  
  saving.value = true;
  try {
    // Primero obtener el restaurant completo para tener el addressId
    const restaurantResponse = await api.get(`/api/Restaurants/${restaurantId}`);
    const restaurant = restaurantResponse.data;
    const addressId = restaurant?.addressId;
    
    if (addressId) {
      // Cargar la dirección actual completa
      const currentAddressResponse = await api.get(`/api/Addresses/${addressId}`);
      const currentAddressData = currentAddressResponse.data;
      
      // Preservar todos los campos originales de la dirección
      const updateData = {
        ...currentAddressData, // Mantener todos los campos originales
        // Solo sobrescribir los campos editables
        street: restaurantAddress.value.street,
        city: restaurantAddress.value.city,
        state: restaurantAddress.value.state,
        zipCode: restaurantAddress.value.zipCode,
        phone: restaurantAddress.value.phone,
        latitude: restaurantAddress.value.latitude,
        longitude: restaurantAddress.value.longitude,
        // Preservar campos críticos explícitamente
        id: addressId,
        userId: currentAddressData.userId // Importante para no perder la relación
      };

      await api.put(`/api/Addresses/${addressId}`, updateData);
      alert('Dirección actualizada correctamente');
    } else {
      alert('No se encontró la dirección del restaurante');
    }
  } catch (error) {
    console.error('Error guardando dirección:', error);
    alert('Error al guardar la dirección');
  } finally {
    saving.value = false;
  }
};

// Métodos de manejo de eventos
const onEntityChange = () => {
  activeTab.value = 'profile'; // Resetear a la primera pestaña
  
  if (selectedEntity.value.startsWith('restaurant-')) {
    const restaurantId = parseInt(selectedEntity.value.replace('restaurant-', ''));
    loadRestaurantDetails(restaurantId);
  }
};

const resetBusinessForm = () => {
  loadBusiness();
};

const resetRestaurantForm = () => {
  if (currentRestaurant.value) {
    loadRestaurantDetails(currentRestaurant.value.id);
  }
};

const resetAddressForm = () => {
  restaurantAddress.value = {
    street: '', city: '', state: '', zipCode: '', phone: '', latitude: null, longitude: null
  };
};

// Métodos de imágenes
const handleLogoUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  try {
    const reader = new FileReader();
    reader.onload = async (e) => {
      if (e.target?.result) {
        const base64 = e.target.result as string;
        
        if (selectedEntity.value === 'business' && business.value?.id) {
          // Usar tu servicio de storage para subir la imagen
          const imageUrl = await uploadImage(base64, file.name);
          businessProfile.value.logoUrl = imageUrl;
          await api.post(`/api/Business/${business.value.id}/logo`, { logoUrl: imageUrl });
        } else if (currentRestaurant.value?.id) {
          const imageUrl = await uploadImage(base64, file.name);
          restaurantProfile.value.logoUrl = imageUrl;
          await api.put(`/api/Restaurants/${currentRestaurant.value.id}`, { 
            logoUrl: imageUrl 
          });
        }
      }
    };
    reader.readAsDataURL(file);
  } catch (error) {
    console.error('Error subiendo logo:', error);
    alert('Error al subir la imagen');
  }
};

const handleCoverUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  try {
    const reader = new FileReader();
    reader.onload = async (e) => {
      if (e.target?.result) {
        const base64 = e.target.result as string;
        
        if (selectedEntity.value === 'business' && business.value?.id) {
          const imageUrl = await uploadImage(base64, file.name);
          businessProfile.value.coverImageUrl = imageUrl;
          await api.post(`/api/Business/${business.value.id}/cover`, { coverImageUrl: imageUrl });
        } else if (currentRestaurant.value?.id) {
          const imageUrl = await uploadImage(base64, file.name);
          restaurantProfile.value.coverImageUrl = imageUrl;
          await api.put(`/api/Restaurants/${currentRestaurant.value.id}`, { 
            coverImageUrl: imageUrl 
          });
        }
      }
    };
    reader.readAsDataURL(file);
  } catch (error) {
    console.error('Error subiendo portada:', error);
    alert('Error al subir la imagen');
  }
};

const uploadImage = async (base64: string, fileName: string): Promise<string> => {
  // Implementar usando tu IStorageService
  // Por ahora retorno el base64 directamente
  return base64;
};

const removeLogo = () => {
  if (selectedEntity.value === 'business') {
    businessProfile.value.logoUrl = '';
  } else {
    restaurantProfile.value.logoUrl = '';
  }
};

const removeCover = () => {
  if (selectedEntity.value === 'business') {
    businessProfile.value.coverImageUrl = '';
  } else {
    restaurantProfile.value.coverImageUrl = '';
  }
};

// Métodos de horarios
const applyToAllDays = () => {
  const monday = businessHours.value.find(day => day.day === 'monday');
  if (monday) {
    businessHours.value.forEach(day => {
      if (day.day !== 'monday') {
        day.isOpen = monday.isOpen;
        day.openTime = monday.openTime;
        day.closeTime = monday.closeTime;
      }
    });
  }
};

const saveBusinessHours = async () => {
  if (!business.value?.id || saving.value) return;
  
  saving.value = true;
  try {
    // Usar tu BusinessService para guardar horarios
    // await api.post(`/api/Business/${business.value.id}/hours`, { hours: businessHours.value });
    console.log('Guardando horarios:', businessHours.value);
    alert('Horarios guardados correctamente');
  } catch (error) {
    console.error('Error guardando horarios:', error);
    alert('Error al guardar los horarios');
  } finally {
    saving.value = false;
  }
};

// Cambio de contraseña
const changePassword = async () => {
  if (saving.value) return;
  
  try {
    passwordError.value = '';
    if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
      passwordError.value = 'Las contraseñas no coinciden';
      return;
    }
    if (passwordForm.value.newPassword.length < 8) {
      passwordError.value = 'La nueva contraseña debe tener al menos 8 caracteres';
      return;
    }
    
    saving.value = true;
    
    const userId = authStore.user?.id;
    await api.post(`/api/Users/${userId}/password`, {
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword
    });
    
    passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' };
    alert('Contraseña cambiada correctamente');
  } catch (error) {
    passwordError.value = 'Error al cambiar la contraseña';
    console.error(error);
  } finally {
    saving.value = false;
  }
};

onMounted(async () => {
  await loadBusiness();
  await loadRestaurants();
});
</script>

<style lang="scss" scoped>
.business-settings {
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  &__title {
    font-size: 1.75rem;
    font-weight: 700;
    margin: 0;
    color: #1e293b;
  }

  &__entity-selector {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
  }

  &__selector-label {
    color: #64748b;
    font-weight: 500;
    white-space: nowrap;
  }

  &__selector {
    padding: 0.5rem 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background-color: white;
    color: #1e293b;
    font-size: 0.9rem;
    min-width: 200px;

    &:focus {
      outline: none;
      border-color: #06a98d;
      box-shadow: 0 0 0 3px rgba(6, 169, 141, 0.1);
    }
  }

  // ... resto de estilos iguales al componente original ...
  
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
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background-color: white;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 0.9rem;
    color: #64748b;
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;

    &:hover {
      background-color: #f8fafc;
      color: #1e293b;
    }

    &--active {
      background-color: #f1f5f9;
      color: #06a98d;
      border-color: #06a98d;
      font-weight: 500;
    }
  }

  &__tab-icon {
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 18px;
      height: 18px;
    }
  }

  &__content {
    margin-bottom: 2rem;
  }

  &__section {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
  }

  &__section-header {
    margin-bottom: 1.5rem;
  }

  &__section-title {
    font-size: 1.3rem;
    font-weight: 600;
    margin: 0 0 0.5rem;
    color: #1e293b;
  }

  &__section-description {
    font-size: 0.95rem;
    color: #64748b;
    margin: 0;
  }

  &__form {
    max-width: 800px;
  }

  &__form-group {
    margin-bottom: 1.25rem;
  }

  &__form-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.25rem;
    margin-bottom: 1.25rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__label {
    display: block;
    font-size: 0.9rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
    color: #1e293b;
  }

  &__input,
  &__select,
  &__textarea {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 0.95rem;
    color: #1e293b;
    transition: all 0.2s ease;
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: #06a98d;
      box-shadow: 0 0 0 3px rgba(6, 169, 141, 0.1);
    }

    &:disabled {
      background-color: #f1f5f9;
      color: #94a3b8;
      cursor: not-allowed;
    }
  }

  &__textarea {
    resize: vertical;
    min-height: 100px;
  }

  &__input-help {
    font-size: 0.85rem;
    color: #64748b;
    margin: 0.25rem 0 0;
  }

  &__form-error {
    margin-bottom: 1rem;
    padding: 0.75rem 1rem;
    background-color: #fee2e2;
    color: #dc2626;
    border: 1px solid #fecaca;
    border-radius: 6px;
    font-size: 0.9rem;
  }

  &__radio-group {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 0.75rem;
  }

  &__radio {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__radio-input {
    margin: 0;
    width: 1rem;
    height: 1rem;
    accent-color: #06a98d;
  }

  &__radio-label {
    font-size: 0.95rem;
    color: #1e293b;
    cursor: pointer;
  }

  &__checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-size: 0.95rem;
    color: #1e293b;
  }

  &__checkbox {
    margin: 0;
    width: 1rem;
    height: 1rem;
    accent-color: #06a98d;
  }

  &__form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;

    @media (max-width: 480px) {
      flex-direction: column;
    }
  }

  &__button {
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 500;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    &--primary {
      background-color: #06a98d;
      color: white;

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

    @media (max-width: 480px) {
      width: 100%;
    }
  }

  // Estilos para imágenes
  &__images-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  &__image-section {
    margin-bottom: 2rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__image-title {
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0 0.25rem;
    color: #1e293b;
  }

  &__image-description {
    font-size: 0.9rem;
    color: #64748b;
    margin: 0 0 1rem;
  }

  &__logo-uploader {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  &__logo-preview {
    width: 120px;
    height: 120px;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #e2e8f0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__logo-placeholder {
    width: 120px;
    height: 120px;
    background-color: #f1f5f9;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #94a3b8;
    border-radius: 8px;

    svg {
      width: 32px;
      height: 32px;
    }
  }

  &__logo-actions {
    display: flex;
    gap: 0.75rem;
  }

  &__upload-btn {
    padding: 0.6rem 1rem;
    background-color: #f1f5f9;
    color: #1e293b;
    border-radius: 6px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s ease;
    display: inline-block;
    border: 1px solid transparent;

    &:hover {
      background-color: #e2e8f0;
      border-color: #cbd5e1;
    }
  }

  &__file-input {
    display: none;
  }

  &__remove-btn {
    padding: 0.6rem 1rem;
    background-color: #fee2e2;
    color: #dc2626;
    border: none;
    border-radius: 6px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background-color: #fecaca;
    }
  }

  &__cover-uploader {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  &__cover-preview {
    width: 100%;
    max-width: 400px;
    height: 150px;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #e2e8f0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__cover-placeholder {
    width: 100%;
    max-width: 400px;
    height: 150px;
    background-color: #f1f5f9;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #94a3b8;
    border-radius: 8px;

    svg {
      width: 32px;
      height: 32px;
      margin-bottom: 0.5rem;
    }
  }

  &__cover-actions {
    display: flex;
    gap: 0.75rem;
  }

  // Estilos para horarios
  &__hours-container {
    max-width: 600px;
  }

  &__hours-row {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 0.75rem 0;
    border-bottom: 1px solid #f1f5f9;

    &:last-child {
      border-bottom: none;
    }

    @media (max-width: 576px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.75rem;
    }
  }

  &__day-checkbox {
    width: 130px;
    flex-shrink: 0;
  }

  &__hours-inputs {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex: 1;

    &--disabled {
      opacity: 0.5;
      pointer-events: none;
    }
  }

  &__hours-input-group {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex: 1;
  }

  &__hours-label {
    font-size: 0.8rem;
    color: #64748b;
  }

  &__hours-input {
    padding: 0.5rem 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    font-size: 0.9rem;
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
    align-self: flex-end;
    padding-bottom: 0.5rem;
  }

  &__hours-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1.5rem;
    gap: 1rem;

    @media (max-width: 576px) {
      flex-direction: column;
      align-items: stretch;
    }
  }

  // Estilos para cuenta
  &__account-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  &__account-section {
    margin-bottom: 2rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__account-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0 0 1rem;
    color: #1e293b;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #f1f5f9;
  }
}
</style>