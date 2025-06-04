<!-- src/views/UserProfile.vue -->
<template>
  <div class="profile-view">
    <!-- Header con fondo degradado -->
    <div class="profile-header">
      <div class="container">
        <ProfileHeader @edit="openEditProfileModal" />
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="profile-content">
      <div class="container">
        <div class="profile-tabs">
          <button v-for="tab in availableTabs" :key="tab.id" @click="changeTab(tab.id)"
            :class="['profile-tab', { 'profile-tab--active': activeTab === tab.id }]">
            <span class="profile-tab__icon" v-html="tab.icon"></span>
            <span class="profile-tab__text">{{ tab.label }}</span>
            <span v-if="tab.count !== undefined" class="profile-tab__count">{{ tab.count }}</span>
          </button>
        </div>

        <div class="profile-section">
          <!-- Información personal (Mi Perfil) -->
          <div v-if="activeTab === 'info'" class="profile-panel">
            <UserInfo :userInfo="userInfo" @update="handleUserInfoUpdate" />
          </div>

          <!-- Direcciones -->
          <div v-if="activeTab === 'addresses'" class="profile-panel">
            <AddressList @update="handleAddressesUpdate" />
          </div>

          <!-- Métodos de pago -->
          <div v-if="activeTab === 'payment-methods'" class="profile-panel">
            <PaymentMethodsList @update="handlePaymentMethodsUpdate" />
          </div>

          <!-- Historial de pedidos -->
          <div v-if="activeTab === 'orders'" class="profile-panel">
            <div v-if="loadingOrders" class="loading-orders">
              <div class="loading-spinner"></div>
              <span>Cargando pedidos...</span>
            </div>

            <div v-else-if="ordersError" class="orders-error">
              <div class="orders-error__icon">⚠️</div>
              <h3>Error al cargar pedidos</h3>
              <p>{{ ordersError }}</p>
              <button @click="loadUserOrders" class="retry-button">Intentar de nuevo</button>
            </div>

            <div v-else-if="userOrders.length === 0" class="no-orders">
              <div class="no-orders__icon">📦</div>
              <h3>No tienes pedidos aún</h3>
              <p>Cuando hagas tu primer pedido, aparecerá aquí.</p>
              <router-link to="/" class="browse-button">Explorar restaurantes</router-link>
            </div>

            <div v-else class="orders-list">
              <h3 class="orders-section-title">Tus pedidos recientes</h3>
              <div class="orders-grid">
                <div v-for="order in userOrders.slice(0, 5)" :key="order.id" class="order-card"
                     @click="$router.push(`/orders/${order.id}`)">
                  <div class="order-card__header">
                    <div class="order-card__restaurant">{{ order.restaurantName }}</div>
                    <div class="order-card__status" :class="getOrderStatusClass(order.status)">
                      {{ getOrderStatusText(order.status) }}
                    </div>
                  </div>

                  <div class="order-card__items">
                    <div class="order-card__items-count">{{ order.orderItems?.length || 0 }} productos</div>
                    <div class="order-card__date">{{ formatOrderDate(order.createdAt) }}</div>
                  </div>

                  <div class="order-card__footer">
                    <div class="order-card__total">${{ order.total.toFixed(2) }}</div>
                    <div class="order-card__arrow">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="userOrders.length > 5" class="view-all-orders">
                <router-link to="/orders" class="view-all-button">
                  Ver todos los pedidos ({{ userOrders.length }})
                </router-link>
              </div>
            </div>
          </div>

          <!-- Mis Reseñas -->
          <div v-if="activeTab === 'reviews'" class="profile-panel">
            <UserReviewsTab :user-id="userInfo.id" />
          </div>

          <!-- Configuración (solo para usuarios no-Google) -->
          <div v-if="activeTab === 'settings'" class="profile-panel">
            <div class="settings-section">
              <h2 class="settings-title">Seguridad</h2>

              <!-- Solo mostrar cambio de contraseña si NO es usuario de Google -->
              <div v-if="!isGoogleUser" class="settings-card">
                <h3 class="settings-card__title">Cambiar contraseña</h3>
                <p class="settings-card__description">
                  Actualiza tu contraseña regularmente para mantener tu cuenta segura.
                </p>
                <button @click="showPasswordModal = true" class="settings-card__button">
                  Cambiar contraseña
                </button>
              </div>

              <!-- Mensaje para usuarios de Google -->
              <div v-else class="settings-card settings-card--info">
                <h3 class="settings-card__title">Cuenta de Google</h3>
                <p class="settings-card__description">
                  Tu cuenta está vinculada con Google. La seguridad y contraseña se gestionan directamente desde tu cuenta de Google.
                </p>
                <div class="google-account-badge">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Cuenta de Google
                </div>
              </div>

              <!-- Otras configuraciones podrían ir aquí -->
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para cambiar contraseña (solo para usuarios no-Google) -->
    <div v-if="showPasswordModal && !isGoogleUser" class="modal">
      <div class="modal__backdrop" @click="showPasswordModal = false"></div>
      <div class="modal__container modal__container--small">
        <div class="modal__header">
          <h3>Cambiar contraseña</h3>
          <button class="modal__close" @click="showPasswordModal = false">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="modal__body">
          <form @submit.prevent="changePassword" class="password-form">
            <div v-if="passwordError" class="password-form__error">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{{ passwordError }}</span>
            </div>

            <div v-if="passwordSuccess" class="password-form__success">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span>{{ passwordSuccess }}</span>
            </div>

            <div class="password-form__field">
              <label for="currentPassword">Contraseña actual</label>
              <input type="password" id="currentPassword" v-model="passwordForm.currentPassword"
                     placeholder="Ingresa tu contraseña actual" required />
            </div>

            <div class="password-form__field">
              <label for="newPassword">Nueva contraseña</label>
              <input type="password" id="newPassword" v-model="passwordForm.newPassword"
                     placeholder="Ingresa tu nueva contraseña" required minlength="8" />
              <div class="field-hint">La contraseña debe tener al menos 8 caracteres</div>
            </div>

            <div class="password-form__field">
              <label for="confirmPassword">Confirmar nueva contraseña</label>
              <input type="password" id="confirmPassword" v-model="passwordForm.confirmPassword"
                     placeholder="Confirma tu nueva contraseña" required />
            </div>

            <div class="password-form__actions">
              <button type="button" class="form-button form-button--cancel" @click="showPasswordModal = false">
                Cancelar
              </button>
              <button type="submit" class="form-button form-button--save" :disabled="passwordLoading">
                <div v-if="passwordLoading" class="button-spinner"></div>
                <span v-else>Guardar</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useOrderStore } from '@/stores/orderStore';
import { useReviews } from '@/composables/useReviews';
import ProfileHeader from '@/components/feature/profile/ProfileHeader.vue';
import UserInfo from '@/components/feature/profile/UserInfo.vue';
import AddressList from '@/components/feature/profile/AddressList.vue';
import PaymentMethodsList from '@/components/feature/profile/PaymentMethodsList.vue';
import UserReviewsTab from '@/components/profile/UserReviewsTab.vue';
import userService, { type UserProfile } from '@/services/userService';
import { OrderStatus } from '@/services/orderService';
import type { OrderResponse } from '@/services/orderService';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const orderStore = useOrderStore();
const { getUserReviews } = useReviews();

// Estado general
const activeTab = ref('info');
const showPasswordModal = ref(false);
const passwordLoading = ref(false);
const passwordError = ref('');
const passwordSuccess = ref('');

// Estados de pedidos
const userOrders = ref<OrderResponse[]>([]);
const loadingOrders = ref(false);
const ordersError = ref('');

// Estado de reseñas
const userReviewsCount = ref(0);

// Formularios
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

// Detectar si es usuario de Google
const isGoogleUser = computed(() => {
  if (!authStore.user) return false;

  // Múltiples formas de detectar usuario de Google
  // Ajusta según tu implementación específica
  return (
    // Opción 1: Si tienes un campo provider
    (authStore.user as any)?.provider === 'google' ||
    (authStore.user as any)?.authProvider === 'google' ||

    // Opción 2: Si el email contiene información de Google OAuth
    (authStore.user as any)?.authMethod === 'google' ||

    // Opción 3: Si no hay password_hash (usuarios locales tienen password)
    (authStore.user as any)?.isGoogleAuth === true ||

    // Opción 4: Verificar por el campo photoURL de Google
    (authStore.user?.photoURL && authStore.user.photoURL.includes('googleusercontent.com')) ||

    // Opción 5: Verificar si existe un campo específico de Google ID
    !!(authStore.user as any)?.googleId
  );
});

// Pestañas disponibles (filtradas según tipo de usuario)
const tabs = [
  {
    id: 'info',
    label: 'Mi Perfil',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>'
  },
  {
    id: 'addresses',
    label: 'Direcciones',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>'
  },
  {
    id: 'payment-methods',
    label: 'Métodos de pago',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>'
  },
  {
    id: 'orders',
    label: 'Pedidos',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10 5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>'
  },
  {
    id: 'reviews',
    label: 'Mis Reseñas',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>',
    count: userReviewsCount.value
  },
  {
    id: 'settings',
    label: 'Configuración',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>'
  }
];

// Tabs disponibles según el tipo de usuario
const availableTabs = computed(() => {
  // Siempre mostrar todas las pestañas, incluyendo reviews
  return tabs.map(tab => ({
    ...tab,
    count: tab.id === 'reviews' ? userReviewsCount.value : tab.count
  }));
});

// Información del usuario
const userInfo = reactive<UserProfile>({
  id: authStore.user?.id || 0,
  firstName: authStore.user?.firstName || '',
  lastName: authStore.user?.lastName || '',
  email: authStore.user?.email || '',
  phoneNumber: (authStore.user as any)?.phoneNumber || '',
  birthdate: '',
  bio: '',
  dietaryPreferences: [],
  photoURL: authStore.user?.photoURL || '',
});

// Métodos de cambio de pestaña con actualización de URL
const changeTab = async (tabId: string) => {
  activeTab.value = tabId;

  // Actualizar la URL sin recargar la página
  await router.replace({
    path: '/profile',
    query: tabId !== 'info' ? { tab: tabId } : {}
  });

  if (tabId === 'orders' && userOrders.value.length === 0 && !loadingOrders.value) {
    await loadUserOrders();
  }

  if (tabId === 'reviews' && userReviewsCount.value === 0) {
    await loadUserReviewsCount();
  }
};

// Inicializar pestaña desde query parameter
const initializeTabFromQuery = () => {
  const tabFromQuery = route.query.tab as string;
  if (tabFromQuery && tabs.some(tab => tab.id === tabFromQuery)) {
    activeTab.value = tabFromQuery;
  } else {
    activeTab.value = 'info';
  }
};

// Métodos de gestión de pestañas
const handleTabChange = async (tabId: string) => {
  await changeTab(tabId);
};

// Métodos de carga de datos
const loadUserData = () => {
  if (authStore.user) {
    userInfo.id = authStore.user.id;
    userInfo.firstName = authStore.user.firstName;
    userInfo.lastName = authStore.user.lastName;
    userInfo.email = authStore.user.email;
    userInfo.phoneNumber = (authStore.user as any)?.phoneNumber || '';
    userInfo.photoURL = authStore.user.photoURL || '';
  }
};

const loadUserOrders = async () => {
  if (!authStore.isAuthenticated) {
    console.log("Usuario no autenticado, no se cargarán los pedidos.");
    return;
  }

  try {
    loadingOrders.value = true;
    ordersError.value = '';
    await orderStore.fetchOrders();
    userOrders.value = orderStore.orderHistory;
  } catch (error: any) {
    console.error('Error loading user orders:', error);
    ordersError.value = error.response?.data?.message || error.message || 'No se pudieron cargar los pedidos.';
  } finally {
    loadingOrders.value = false;
  }
};

// Cargar conteo de reseñas del usuario
const loadUserReviewsCount = async () => {
  if (!authStore.user?.id) return;
  
  try {
    const reviews = await getUserReviews(authStore.user.id);
    userReviewsCount.value = reviews.length;
  } catch (error) {
    console.error('Error loading user reviews count:', error);
    userReviewsCount.value = 0;
  }
};

// Métodos de gestión de métodos de pago
const handlePaymentMethodsUpdate = () => {
  console.log('Lista de métodos de pago actualizada');
};

// Métodos de gestión de pedidos
const getOrderStatusClass = (status: OrderStatus | string): string => {
  switch (status) {
    case OrderStatus.DELIVERED:
      return 'order-status--delivered';
    case OrderStatus.CANCELLED:
      return 'order-status--cancelled';
    case OrderStatus.ON_THE_WAY:
      return 'order-status--on-the-way';
    case OrderStatus.ACCEPTED:
    case OrderStatus.PREPARING:
    case OrderStatus.READY_FOR_PICKUP:
      return 'order-status--preparing';
    default:
      return 'order-status--pending';
  }
};

const getOrderStatusText = (status: OrderStatus | string): string => {
  const statusMap: Record<string, string> = {
    [OrderStatus.PENDING]: 'Pendiente',
    [OrderStatus.ACCEPTED]: 'Aceptado',
    [OrderStatus.PREPARING]: 'Preparando',
    [OrderStatus.READY_FOR_PICKUP]: 'Listo para recoger',
    [OrderStatus.ON_THE_WAY]: 'En camino',
    [OrderStatus.DELIVERED]: 'Entregado',
    [OrderStatus.CANCELLED]: 'Cancelado',
  };
  return statusMap[status] || status.toString();
};

const formatOrderDate = (dateString?: string): string => {
  if (!dateString) return 'Fecha desconocida';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Fecha inválida';

    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffTime < 0) {
      return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) +
             ` a las ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
    }

    if (diffDays === 0) {
      return `Hoy, ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `Ayer, ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays < 7) {
      return `Hace ${diffDays} días`;
    } else {
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: (now.getFullYear() !== date.getFullYear()) ? 'numeric' : undefined
      });
    }
  } catch (e) {
    console.error("Error formateando fecha:", dateString, e);
    return dateString;
  }
};

// Métodos de gestión de perfil
const openEditProfileModal = () => {
  changeTab('info');
  console.log("Intentando abrir modal de edición de perfil (lógica en UserInfo.vue)");
};

const handleUserInfoUpdate = (updatedInfo: UserProfile) => {
  Object.assign(userInfo, updatedInfo);
  if (authStore.user) {
    authStore.user.firstName = updatedInfo.firstName;
    authStore.user.lastName = updatedInfo.lastName;
    authStore.user.email = updatedInfo.email;
    authStore.user.photoURL = updatedInfo.photoURL;
  }
};

const handleAddressesUpdate = () => {
  console.log('Lista de direcciones actualizada');
};

// Métodos de gestión de contraseña (solo para usuarios no-Google)
const changePassword = async () => {
  if (isGoogleUser.value) {
    console.warn('Intento de cambio de contraseña en usuario de Google');
    return;
  }

  passwordError.value = '';
  passwordSuccess.value = '';

  if (!passwordForm.currentPassword || !passwordForm.newPassword) {
    passwordError.value = 'Todos los campos de contraseña son requeridos.';
    return;
  }
  if (passwordForm.newPassword.length < 8) {
    passwordError.value = 'La nueva contraseña debe tener al menos 8 caracteres.';
    return;
  }
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordError.value = 'Las nuevas contraseñas no coinciden.';
    return;
  }

  passwordLoading.value = true;

  try {
    const response = await userService.changePassword(
      passwordForm.currentPassword,
      passwordForm.newPassword
    );

    if (response && response.success) {
      passwordSuccess.value = response.message || 'Contraseña actualizada correctamente.';
      passwordForm.currentPassword = '';
      passwordForm.newPassword = '';
      passwordForm.confirmPassword = '';

      setTimeout(() => {
        showPasswordModal.value = false;
        passwordSuccess.value = '';
      }, 2500);
    } else {
      passwordError.value = response?.message || 'No se pudo actualizar la contraseña.';
    }
  } catch (err: any) {
    console.error('Error al cambiar contraseña:', err);
    passwordError.value = err.response?.data?.message || 'Error al conectar con el servidor.';
  } finally {
    passwordLoading.value = false;
  }
};

// Watch para cambios en la query
watch(() => route.query.tab, (newTab) => {
  if (newTab && typeof newTab === 'string' && tabs.some(tab => tab.id === newTab)) {
    activeTab.value = newTab;

    // Cargar datos específicos si es necesario
    if (newTab === 'orders' && userOrders.value.length === 0 && !loadingOrders.value) {
      loadUserOrders();
    }
    
    if (newTab === 'reviews' && userReviewsCount.value === 0) {
      loadUserReviewsCount();
    }
  }
}, { immediate: false });

// Inicialización
onMounted(async () => {
  initializeTabFromQuery();
  loadUserData();
  
  // Cargar conteo de reseñas inmediatamente
  await loadUserReviewsCount();

  if (activeTab.value === 'orders') {
    loadUserOrders();
  }
});
</script>

<style lang="scss" scoped>
// Variables
$primary: #FF416C;
$primary-gradient: linear-gradient(to right, #FF416C, #FF4B2B);
$secondary: #0652DD;
$secondary-gradient: linear-gradient(to right, #0652DD, #12CBC4);
$accent: #FFA502;
$dark: #1e293b;
$light: #f8fafc;
$text: #1e293b;
$text-light: #64748b;
$border: #e2e8f0;
$border-radius: 12px;
$transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);

// Contenedor y layout principal
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;

  @media (max-width: 768px) {
    padding: 0 1.5rem;
  }
}

.profile-view {
  min-height: 100vh;
  background-color: $light;
}

.profile-header {
  padding: 4rem 0;
  background: $primary-gradient;
  color: white;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
      radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
    z-index: 0;
  }

  .container {
    position: relative;
    z-index: 5;
  }
}

.profile-content {
  padding: 2rem 0 5rem;
}

.profile-tabs {
  display: flex;
  overflow-x: auto;
  gap: 0.5rem;
  margin-bottom: 2rem;
  background-color: white;
  padding: 0.5rem;
  border-radius: $border-radius;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);

  &::-webkit-scrollbar {
    height: 0;
    width: 0;
    display: none;
  }

  @media (max-width: 768px) {
    flex-wrap: nowrap;
    padding: 0.5rem;
  }
}

.profile-tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  background: none;
  border: none;
  color: $text;
  font-weight: 500;
  cursor: pointer;
  transition: $transition;
  white-space: nowrap;
  position: relative;

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: $text-light;
  }

  &__count {
    background: rgba($primary, 0.1);
    color: $primary;
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.2rem 0.5rem;
    border-radius: 10px;
    margin-left: 0.25rem;
    min-width: 1.2rem;
    text-align: center;
  }

  &:hover {
    background-color: rgba($primary, 0.05);
    color: $primary;

    .profile-tab__icon {
      color: $primary;
    }
  }

  &--active {
    background-color: rgba($primary, 0.1);
    color: $primary;
    font-weight: 600;

    .profile-tab__icon {
      color: $primary;
    }

    .profile-tab__count {
      background: $primary;
      color: white;
    }
  }

  @media (max-width: 768px) {
    padding: 0.7rem 1rem;
    font-size: 0.9rem;
  }
}

.profile-section {
  background-color: white;
  border-radius: $border-radius;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.profile-panel {
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
}

// Resto de estilos...
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;

  &__backdrop {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
  }

  &__container {
    position: relative;
    background-color: white;
    border-radius: $border-radius;
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    z-index: 1001;

    &--small {
      max-width: 450px;
    }
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid $border;

    h3 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 700;
      color: $dark;
    }
  }

  &__close {
    background: none;
    border: none;
    cursor: pointer;
    color: $text-light;
    transition: $transition;

    &:hover {
      color: $dark;
    }
  }

  &__body {
    padding: 1.5rem;
  }
}

// Loading orders, orders error, etc...
.loading-orders,
.orders-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  text-align: center;

  .loading-spinner {
    width: 32px;
    height: 32px;
    border: 2px solid $border;
    border-radius: 50%;
    border-top-color: $primary;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }
}

.orders-error {
  &__icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  h3 {
    color: $dark;
    margin: 0 0 0.5rem;
  }

  p {
    color: $text-light;
    margin: 0 0 1.5rem;
  }
}

.no-orders {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;

  &__icon {
    font-size: 4rem;
    margin-bottom: 1.5rem;
  }

  h3 {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 0.5rem;
    color: $dark;
  }

  p {
    color: $text-light;
    margin: 0 0 2rem;
  }
}

.browse-button,
.retry-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: $primary-gradient;
  color: white;
  text-decoration: none;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: $transition;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba($primary, 0.3);
  }
}

// Orders section
.orders-section-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 1.5rem;
  color: $dark;
}

.orders-grid {
  display: grid;
  gap: 1rem;
  margin-bottom: 2rem;
}

.order-card {
  background: white;
  border: 1px solid $border;
  border-radius: $border-radius;
  padding: 1.25rem;
  cursor: pointer;
  transition: $transition;

  &:hover {
    border-color: $primary;
    box-shadow: 0 4px 12px rgba($primary, 0.15);
    transform: translateY(-1px);
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
  }

  &__restaurant {
    font-weight: 600;
    color: $dark;
    font-size: 1.1rem;
  }

  &__status {
    font-size: 0.8rem;
    font-weight: 500;
    padding: 0.25rem 0.75rem;
    border-radius: 50px;

    &.order-status--delivered {
      background-color: rgba(#10b981, 0.1);
      color: #10b981;
    }

    &.order-status--cancelled {
      background-color: rgba(#ef4444, 0.1);
      color: #ef4444;
    }

    &.order-status--on-the-way {
      background-color: rgba(#f59e0b, 0.1);
      color: #f59e0b;
    }

    &.order-status--preparing {
      background-color: rgba(#3b82f6, 0.1);
      color: #3b82f6;
    }

    &.order-status--pending {
      background-color: rgba($text-light, 0.1);
      color: $text-light;
    }
  }

  &__items {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    font-size: 0.9rem;
    color: $text-light;
  }

  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__total {
    font-weight: 600;
    color: $dark;
    font-size: 1.1rem;
  }

  &__arrow {
    color: $primary;
    display: flex;
    align-items: center;
  }
}

.view-all-orders {
  text-align: center;
  padding-top: 1rem;
  border-top: 1px solid $border;
}

.view-all-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: white;
  color: $primary;
  text-decoration: none;
  border: 1px solid $primary;
  border-radius: 50px;
  font-weight: 600;
  transition: $transition;

  &:hover {
    background-color: rgba($primary, 0.05);
    transform: translateY(-1px);
  }
}

.settings-section {
  padding: 1rem 0;
}

.settings-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 1.5rem;
  color: $dark;
}

.settings-card {
  padding: 1.5rem;
  border: 1px solid $border;
  border-radius: $border-radius;
  margin-bottom: 1.5rem;

  &--info {
    background-color: rgba(#4285F4, 0.05);
    border-color: rgba(#4285F4, 0.2);
  }

  &__title {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0 0 0.5rem;
    color: $dark;
  }

  &__description {
    color: $text-light;
    margin: 0 0 1.5rem;
  }

  &__button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background-color: white;
    border: 1px solid $border;
    border-radius: 50px;
    color: $text;
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    transition: $transition;

    &:hover {
      background-color: $light;
      color: $primary;
      border-color: $primary;
    }
  }
}

.google-account-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: white;
  border: 1px solid rgba(#4285F4, 0.3);
  border-radius: 50px;
  color: #4285F4;
  font-weight: 500;
  font-size: 0.9rem;
}

.password-form {
  &__error {
    background-color: rgba(#ef4444, 0.1);
    color: #ef4444;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.95rem;
  }

  &__success {
    background-color: rgba(#10b981, 0.1);
    color: #10b981;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.95rem;
  }

  &__field {
    margin-bottom: 1.5rem;

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: $dark;
      font-size: 0.95rem;
    }

    input {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid $border;
      border-radius: 8px;
      font-size: 1rem;
      color: $dark;
      transition: $transition;

      &:focus {
        outline: none;
        border-color: $primary;
        box-shadow: 0 0 0 3px rgba($primary, 0.1);
      }
    }
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;
  }
}

.form-button {
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: $transition;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;

  &--cancel {
    background: $light;
    color: $text;
    border: 1px solid $border;

    &:hover {
      background: white;
      border-color: #cbd5e1;
    }
  }

  &--save {
    background: $primary-gradient;
    color: white;
    border: none;
    box-shadow: 0 4px 12px rgba($primary, 0.2);

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba($primary, 0.3);
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
    }
  }
}

.button-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
}

.field-hint {
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: $text-light;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>