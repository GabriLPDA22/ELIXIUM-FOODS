<template>
  <div class="business-settings">
    <div class="business-settings__header">
      <h1 class="business-settings__title">Configuración del Restaurante</h1>
    </div>

    <div class="business-settings__tabs">
      <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
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
      <div v-if="activeTab === 'profile'" class="business-settings__section">
        <div class="business-settings__section-header">
          <h2 class="business-settings__section-title">Información del Restaurante</h2>
          <p class="business-settings__section-description">
            Actualiza la información básica de tu restaurante visible para los clientes
          </p>
        </div>
        <form @submit.prevent="saveRestaurantProfile" class="business-settings__form">
          <div class="business-settings__form-group">
            <label for="restaurantName" class="business-settings__label">Nombre del restaurante*</label>
            <input type="text" id="restaurantName" v-model="restaurantProfile.name" class="business-settings__input"
              required />
          </div>
          <div class="business-settings__form-row">
            <div class="business-settings__form-group">
              <label for="phone" class="business-settings__label">Teléfono*</label>
              <input type="tel" id="phone" v-model="restaurantProfile.phone" class="business-settings__input"
                required />
            </div>
            <div class="business-settings__form-group">
              <label for="email" class="business-settings__label">Email*</label>
              <input type="email" id="email" v-model="restaurantProfile.email" class="business-settings__input"
                required />
            </div>
          </div>
          <div class="business-settings__form-group">
            <label for="description" class="business-settings__label">Descripción</label>
            <textarea id="description" v-model="restaurantProfile.description" class="business-settings__textarea"
              rows="4"></textarea>
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
              <input type="checkbox" id="isOpen" v-model="restaurantProfile.isOpen"
                class="business-settings__checkbox" />
              <span>Restaurante abierto</span>
            </label>
          </div>
          <div class="business-settings__form-actions">
            <button type="button" @click="resetForm"
              class="business-settings__button business-settings__button--secondary">
              Cancelar
            </button>
            <button type="submit" class="business-settings__button business-settings__button--primary">
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>

      <div v-if="activeTab === 'address'" class="business-settings__section">
        <div class="business-settings__section-header">
          <h2 class="business-settings__section-title">Dirección del Restaurante</h2>
          <p class="business-settings__section-description">
            Actualiza la dirección de tu restaurante para que los clientes puedan encontrarte
          </p>
        </div>
        <form @submit.prevent="saveRestaurantAddress" class="business-settings__form">
          <div class="business-settings__form-group">
            <label for="street" class="business-settings__label">Calle y número*</label>
            <input type="text" id="street" v-model="restaurantAddress.street" class="business-settings__input"
              required />
          </div>
          <div class="business-settings__form-row">
            <div class="business-settings__form-group">
              <label for="city" class="business-settings__label">Ciudad*</label>
              <input type="text" id="city" v-model="restaurantAddress.city" class="business-settings__input" required />
            </div>
            <div class="business-settings__form-group">
              <label for="state" class="business-settings__label">Provincia*</label>
              <input type="text" id="state" v-model="restaurantAddress.state" class="business-settings__input"
                required />
            </div>
          </div>
          <div class="business-settings__form-row">
            <div class="business-settings__form-group">
              <label for="zipCode" class="business-settings__label">Código Postal*</label>
              <input type="text" id="zipCode" v-model="restaurantAddress.zipCode" class="business-settings__input"
                required />
            </div>
            <div class="business-settings__form-group">
              <label for="country" class="business-settings__label">País*</label>
              <select id="country" v-model="restaurantAddress.country" class="business-settings__select" required>
                <option value="ES">España</option>
                <option value="PT">Portugal</option>
                <option value="FR">Francia</option>
                <option value="IT">Italia</option>
              </select>
            </div>
          </div>
          <div class="business-settings__form-group">
            <label class="business-settings__label">Ubicación en el mapa</label>
            <div class="business-settings__map-container">
              <div class="business-settings__map-placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                <span>Vista previa del mapa no disponible</span>
              </div>
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
            <button type="button" @click="resetAddressForm"
              class="business-settings__button business-settings__button--secondary">
              Cancelar
            </button>
            <button type="submit" class="business-settings__button business-settings__button--primary">
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>

      <div v-if="activeTab === 'images'" class="business-settings__section">
        <div class="business-settings__section-header">
          <h2 class="business-settings__section-title">Imágenes del Restaurante</h2>
          <p class="business-settings__section-description">
            Sube y gestiona las imágenes de tu restaurante para mostrar a los clientes
          </p>
        </div>
        <div class="business-settings__images-container">
          <div class="business-settings__image-section">
            <h3 class="business-settings__image-title">Logo del Restaurante</h3>
            <p class="business-settings__image-description">
              Este logo aparecerá en tu perfil y en los resultados de búsqueda
            </p>
            <div class="business-settings__logo-uploader">
              <div class="business-settings__logo-preview">
                <img v-if="restaurantProfile.logoUrl" :src="restaurantProfile.logoUrl" alt="Logo" />
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
                  <input type="file" accept="image/*" @change="handleLogoUpload"
                    class="business-settings__file-input" />
                </label>
                <button v-if="restaurantProfile.logoUrl" @click="removeRestaurantLogo"
                  class="business-settings__remove-btn">
                  Eliminar
                </button>
              </div>
            </div>
          </div>
          <div class="business-settings__image-section">
            <h3 class="business-settings__image-title">Imagen de Portada</h3>
            <p class="business-settings__image-description">
              Esta imagen aparecerá en la parte superior de tu perfil de restaurante
            </p>
            <div class="business-settings__cover-uploader">
              <div class="business-settings__cover-preview">
                <img v-if="restaurantProfile.coverImageUrl" :src="restaurantProfile.coverImageUrl" alt="Portada" />
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
                  <input type="file" accept="image/*" @change="handleCoverUpload"
                    class="business-settings__file-input" />
                </label>
                <button v-if="restaurantProfile.coverImageUrl" @click="removeRestaurantCover"
                  class="business-settings__remove-btn">
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'hours'" class="business-settings__section">
        <div class="business-settings__section-header">
          <h2 class="business-settings__section-title">Horarios del Restaurante</h2>
          <p class="business-settings__section-description">
            Configura los horarios de apertura y cierre de tu restaurante
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
            <div class="business-settings__hours-inputs"
              :class="{ 'business-settings__hours-inputs--disabled': !day.isOpen }">
              <div class="business-settings__hours-input-group">
                <label :for="`open-${index}`" class="business-settings__hours-label">Apertura</label>
                <input type="time" :id="`open-${index}`" v-model="day.openTime" class="business-settings__hours-input"
                  :disabled="!day.isOpen" />
              </div>
              <span class="business-settings__hours-separator">a</span>
              <div class="business-settings__hours-input-group">
                <label :for="`close-${index}`" class="business-settings__hours-label">Cierre</label>
                <input type="time" :id="`close-${index}`" v-model="day.closeTime" class="business-settings__hours-input"
                  :disabled="!day.isOpen" />
              </div>
            </div>
          </div>
          <div class="business-settings__hours-actions">
            <button @click="applyToAllDays" class="business-settings__button business-settings__button--secondary">
              Aplicar Lunes a todos los días
            </button>
            <button @click="saveBusinessHours" class="business-settings__button business-settings__button--primary">
              Guardar Horarios
            </button>
          </div>
        </div>
      </div>

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
                <button type="submit" class="business-settings__button business-settings__button--primary">
                  Cambiar Contraseña
                </button>
              </div>
            </form>
          </div>
          <div class="business-settings__account-section">
            <h3 class="business-settings__account-title">Notificaciones</h3>
            <div class="business-settings__notification-options">
              <div class="business-settings__notification-option">
                <label for="emailNotifications" class="business-settings__checkbox-label">
                  <input type="checkbox" id="emailNotifications" v-model="notifications.email"
                    class="business-settings__checkbox" />
                  <span>Recibir notificaciones por email</span>
                </label>
                <p class="business-settings__notification-description">
                  Te enviaremos emails sobre nuevos pedidos y actualizaciones importantes
                </p>
              </div>
              <div class="business-settings__notification-option">
                <label for="smsNotifications" class="business-settings__checkbox-label">
                  <input type="checkbox" id="smsNotifications" v-model="notifications.sms"
                    class="business-settings__checkbox" />
                  <span>Recibir notificaciones por SMS</span>
                </label>
                <p class="business-settings__notification-description">
                  Te enviaremos SMS sobre nuevos pedidos y actualizaciones importantes
                </p>
              </div>
              <div class="business-settings__notification-option">
                <label for="pushNotifications" class="business-settings__checkbox-label">
                  <input type="checkbox" id="pushNotifications" v-model="notifications.push"
                    class="business-settings__checkbox" />
                  <span>Recibir notificaciones push</span>
                </label>
                <p class="business-settings__notification-description">
                  Te enviaremos notificaciones push en tu navegador o aplicación
                </p>
              </div>
              <div class="business-settings__notification-actions">
                <button @click="saveNotificationPreferences"
                  class="business-settings__button business-settings__button--primary">
                  Guardar Preferencias
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue' // Añadido computed
import { useBusinessAuthStore } from '@/stores/businessAuth'

// Tipos para los elementos SVG
interface SvgElement {
  type: 'path' | 'circle' | 'rect' | 'polyline' | 'line';
  d?: string; // para path
  cx?: string | number; // para circle
  cy?: string | number; // para circle
  r?: string | number;  // para circle
  x?: string | number; // para rect
  y?: string | number; // para rect
  width?: string | number; // para rect
  height?: string | number; // para rect
  rx?: string | number; // para rect
  ry?: string | number; // para rect
  points?: string; // para polyline
  x1?: string | number; // para line
  y1?: string | number; // para line
  x2?: string | number; // para line
  y2?: string | number; // para line
}

interface Tab {
  id: string;
  label: string;
  iconElements: SvgElement[];
}

// Store
const businessAuthStore = useBusinessAuthStore();

// Estado
const activeTab = ref('profile');

// Pestañas de configuración con estructura de icono corregida
const tabs: Tab[] = [
  { id: 'profile', label: 'Perfil', iconElements: [{ type: 'path', d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" }, { type: 'circle', cx: "12", cy: "7", r: "4" }] },
  { id: 'address', label: 'Dirección', iconElements: [{ type: 'path', d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" }, { type: 'circle', cx: "12", cy: "10", r: "3" }] },
  { id: 'images', label: 'Imágenes', iconElements: [{ type: 'rect', x: "3", y: "3", width: "18", height: "18", rx: "2", ry: "2" }, { type: 'circle', cx: "8.5", cy: "8.5", r: "1.5" }, { type: 'polyline', points: "21 15 16 10 5 21" }] },
  { id: 'hours', label: 'Horarios', iconElements: [{ type: 'circle', cx: "12", cy: "12", r: "10" }, { type: 'polyline', points: "12 6 12 12 16 14" }] },
  { id: 'account', label: 'Cuenta', iconElements: [{ type: 'path', d: "M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" }, { type: 'circle', cx: "8.5", cy: "7", r: "4" }, { type: 'polyline', points: "20 8 20 14" }, { type: 'line', x1: "23", y1: "11", x2: "17", y2: "11" }] }
];

// Definición de tipos para los datos del restaurante
interface RestaurantProfile {
  name: string;
  phone: string;
  email: string;
  description: string;
  estimatedDeliveryTime: number;
  deliveryFee: number;
  tipo: number; // Asumiendo que es un ID numérico
  isOpen: boolean;
  logoUrl: string | null;
  coverImageUrl: string | null;
}

interface RestaurantAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
}

interface BusinessHour {
  day: string;
  label: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface Notifications {
  email: boolean;
  sms: boolean;
  push: boolean;
}


// Datos del restaurante
const restaurantProfile = ref<RestaurantProfile>({
  name: '',
  phone: '',
  email: '',
  description: '',
  estimatedDeliveryTime: 30,
  deliveryFee: 2.99,
  tipo: 1,
  isOpen: true,
  logoUrl: null,
  coverImageUrl: null
});

// Dirección del restaurante
const restaurantAddress = ref<RestaurantAddress>({
  street: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'ES',
  latitude: null,
  longitude: null
});

const restaurantTypes = [
  { id: 1, name: 'Italiano' }, { id: 2, name: 'Asiático' }, { id: 3, name: 'Mexicano' },
  { id: 4, name: 'Hamburguesas' }, { id: 5, name: 'Pizzas' }, { id: 6, name: 'Vegano' },
  { id: 7, name: 'Saludable' }, { id: 8, name: 'Postres' }
];

const businessHours = ref<BusinessHour[]>([
  { day: 'monday', label: 'Lunes', isOpen: true, openTime: '10:00', closeTime: '22:00' },
  { day: 'tuesday', label: 'Martes', isOpen: true, openTime: '10:00', closeTime: '22:00' },
  { day: 'wednesday', label: 'Miércoles', isOpen: true, openTime: '10:00', closeTime: '22:00' },
  { day: 'thursday', label: 'Jueves', isOpen: true, openTime: '10:00', closeTime: '22:00' },
  { day: 'friday', label: 'Viernes', isOpen: true, openTime: '10:00', closeTime: '23:00' },
  { day: 'saturday', label: 'Sábado', isOpen: true, openTime: '11:00', closeTime: '23:00' },
  { day: 'sunday', label: 'Domingo', isOpen: true, openTime: '11:00', closeTime: '22:00' }
]);

const passwordForm = ref<PasswordForm>({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});
const passwordError = ref('');

const notifications = ref<Notifications>({
  email: true,
  sms: false,
  push: true
});

// Métodos
const loadRestaurantData = () => {
  if (businessAuthStore.business) {
    restaurantProfile.value = {
      name: businessAuthStore.business.name || 'Mi Restaurante Ejemplo',
      phone: businessAuthStore.business.phone || '',
      email: businessAuthStore.business.email || '',
      description: businessAuthStore.business.description || '',
      estimatedDeliveryTime: businessAuthStore.business.estimatedDeliveryTime || 30,
      deliveryFee: businessAuthStore.business.deliveryFee || 2.99,
      tipo: businessAuthStore.business.typeId || 1,
      isOpen: businessAuthStore.business.isOpen !== undefined ? businessAuthStore.business.isOpen : true,
      logoUrl: businessAuthStore.business.logoUrl || null,
      coverImageUrl: businessAuthStore.business.coverImageUrl || null,
    };
    // Cargar también restaurantAddress y businessHours si vienen del store
  }
};

const saveRestaurantProfile = async () => {
  try {
    // await businessAuthStore.updateBusinessProfile(restaurantProfile.value); // Envía el objeto completo
    console.log("Guardando perfil:", restaurantProfile.value);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulación
    alert('Perfil actualizado correctamente');
  } catch (err) {
    alert('Error al guardar los cambios');
    console.error(err);
  }
};

const resetForm = () => {
  loadRestaurantData();
};

const saveRestaurantAddress = async () => {
  try {
    console.log("Guardando dirección:", restaurantAddress.value);
    await new Promise(resolve => setTimeout(resolve, 500));
    alert('Dirección actualizada correctamente');
  } catch (err) {
    alert('Error al guardar la dirección');
    console.error(err);
  }
};

const resetAddressForm = () => {
  restaurantAddress.value = {
    street: '', city: '', state: '', zipCode: '', country: 'ES', latitude: null, longitude: null
  };
};

const handleLogoUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        restaurantProfile.value.logoUrl = e.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  }
};

const handleCoverUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        restaurantProfile.value.coverImageUrl = e.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  }
};

const removeRestaurantLogo = () => { restaurantProfile.value.logoUrl = null; };
const removeRestaurantCover = () => { restaurantProfile.value.coverImageUrl = null; };

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
  try {
    console.log("Guardando horarios:", businessHours.value);
    await new Promise(resolve => setTimeout(resolve, 500));
    alert('Horarios guardados correctamente');
  } catch (err) {
    alert('Error al guardar los horarios');
    console.error(err);
  }
};

const changePassword = async () => {
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
    console.log("Cambiando contraseña para:", passwordForm.value.currentPassword ? '********' : ''); // No loguear contraseñas
    await new Promise(resolve => setTimeout(resolve, 500));
    passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' };
    alert('Contraseña cambiada correctamente');
  } catch (err) {
    passwordError.value = 'Error al cambiar la contraseña';
    console.error(err);
  }
};

const saveNotificationPreferences = async () => {
  try {
    console.log("Guardando preferencias de notificación:", notifications.value);
    await new Promise(resolve => setTimeout(resolve, 500));
    alert('Preferencias de notificación guardadas correctamente');
  } catch (err) {
    alert('Error al guardar las preferencias');
    console.error(err);
  }
};

onMounted(() => {
  loadRestaurantData();
});
</script>

<style lang="scss" scoped>
/* Tus estilos .business-settings... se mantienen igual */
.business-settings {
  &__header {
    margin-bottom: 1.5rem;
  }

  &__title {
    font-size: 1.75rem;
    font-weight: 700;
    margin: 0;
    color: #1e293b;
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

    @media (max-width: 768px) {
      // flex-wrap: wrap; // Puede causar problemas si hay muchos tabs, mejor scroll
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
    flex-shrink: 0; // Para que no se encojan en el scroll

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
      // Para que el último form-row no tenga margen inferior si es el último elemento del form
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
    box-sizing: border-box; // Para que padding no afecte el width total

    &:focus {
      outline: none;
      border-color: #06a98d;
      box-shadow: 0 0 0 3px rgba(6, 169, 141, 0.1);
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

    @media (max-width: 480px) {
      width: 100%;
    }
  }

  // Mapa
  &__map-container {
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    overflow: hidden;
    height: 200px;
    margin-bottom: 1rem;
  }

  &__map-placeholder {
    width: 100%;
    height: 100%;
    background-color: #f1f5f9;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #94a3b8;

    svg {
      width: 32px;
      height: 32px;
      margin-bottom: 0.5rem;
    }
  }

  // Imágenes
  &__images-container {
    // display: grid;
    // grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    // gap: 2rem;
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
    max-width: 400px; // Para que no sea demasiado ancho
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

  // Horarios
  &__hours-container {
    max-width: 600px;
  }

  &__hours-row {
    display: flex;
    align-items: center; // Alineación vertical
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
    width: 130px; // Un poco más de espacio
    flex-shrink: 0;
  }

  &__hours-inputs {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex: 1;

    &--disabled {
      opacity: 0.5;
      pointer-events: none; // Para que no se pueda interactuar
    }

    @media (max-width: 768px) {
      // flex-wrap: wrap; // Puede ser mejor que cada grupo esté en su línea
    }
  }

  &__hours-input-group {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex: 1; // Para que los inputs ocupen el espacio disponible
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
    width: 100%; // Para que ocupe el espacio del grupo
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
    // margin-top: 1.5rem; // No necesario si los labels están arriba
    color: #64748b;
    align-self: flex-end; // Alinear con la base de los inputs
    padding-bottom: 0.5rem; // Ajustar si es necesario
  }

  &__hours-actions {
    display: flex;
    justify-content: space-between;
    align-items: center; // Alineación vertical
    margin-top: 1.5rem;
    gap: 1rem;

    @media (max-width: 576px) {
      flex-direction: column;
      align-items: stretch; // Para que los botones ocupen todo el ancho
    }
  }

  // Cuenta
  &__account-container {
    // display: grid;
    // grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    // gap: 2rem;
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

  &__notification-options {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  &__notification-option {
    // margin-bottom: 0.5rem; No necesario si usamos gap en el padre
  }

  &__notification-description {
    font-size: 0.85rem;
    color: #64748b;
    margin: 0.25rem 0 0 1.75rem; // Alineado con el texto del checkbox
  }

  &__notification-actions {
    margin-top: 1.5rem;
  }
}
</style>
