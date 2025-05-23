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
          <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id; handleTabChange(tab.id)"
            :class="['profile-tab', { 'profile-tab--active': activeTab === tab.id }]">
            <span class="profile-tab__icon" v-html="tab.icon"></span>
            <span class="profile-tab__text">{{ tab.label }}</span>
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
                <div
                  v-for="order in userOrders.slice(0, 5)"
                  :key="order.id"
                  class="order-card"
                  @click="$router.push(`/orders/${order.id}`)"
                >
                  <div class="order-card__header">
                    <div class="order-card__restaurant">{{ order.restaurantName }}</div>
                    <div class="order-card__status" :class="getOrderStatusClass(order.status)">
                      {{ getOrderStatusText(order.status) }}
                    </div>
                  </div>

                  <div class="order-card__items">
                    <div class="order-card__items-count">
                      {{ order.orderItems?.length || 0 }} productos
                    </div>
                    <div class="order-card__date">
                      {{ formatOrderDate(order.createdAt) }}
                    </div>
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

          <!-- Configuración -->
          <div v-if="activeTab === 'settings'" class="profile-panel">
            <div class="settings-section">
              <h2 class="settings-title">Seguridad</h2>
              <div class="settings-card">
                <h3 class="settings-card__title">Cambiar contraseña</h3>
                <p class="settings-card__description">
                  Actualiza tu contraseña regularmente para mantener tu cuenta segura.
                </p>
                <button @click="showPasswordModal = true" class="settings-card__button">
                  Cambiar contraseña
                </button>
              </div>

              <!-- Más configuraciones pueden ir aquí -->
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para cambiar contraseña -->
    <div v-if="showPasswordModal" class="modal">
      <div class="modal__backdrop" @click="showPasswordModal = false"></div>
      <div class="modal__container modal__container--small">
        <div class="modal__header">
          <h3>Cambiar contraseña</h3>
          <button class="modal__close" @click="showPasswordModal = false">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="modal__body">
          <form @submit.prevent="changePassword" class="password-form">
            <div v-if="passwordError" class="password-form__error">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{{ passwordError }}</span>
            </div>

            <div v-if="passwordSuccess" class="password-form__success">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
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
              <div class="password-form__hint">
                La contraseña debe tener al menos 8 caracteres
              </div>
            </div>

            <div class="password-form__field">
              <label for="confirmPassword">Confirmar nueva contraseña</label>
              <input type="password" id="confirmPassword" v-model="passwordForm.confirmPassword"
                placeholder="Confirma tu nueva contraseña" required />
            </div>

            <div class="password-form__actions">
              <button type="button" class="password-form__button password-form__button--cancel"
                @click="showPasswordModal = false">
                Cancelar
              </button>
              <button type="submit" class="password-form__button password-form__button--save"
                :disabled="passwordLoading">
                <div v-if="passwordLoading" class="password-form__spinner"></div>
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
import { ref, reactive, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useOrderStore } from '@/stores/orderStore';
import ProfileHeader from '@/components/feature/profile/ProfileHeader.vue';
import UserInfo from '@/components/feature/profile/UserInfo.vue';
import AddressList from '@/components/feature/profile/AddressList.vue';
import userService, { type UserProfile } from '@/services/userService';
import { OrderStatus } from '@/services/orderService';
import type { OrderResponse } from '@/services/orderService';

const authStore = useAuthStore();
const orderStore = useOrderStore();

// Estado
const activeTab = ref('info');
const showPasswordModal = ref(false);
const passwordLoading = ref(false);
const passwordError = ref('');
const passwordSuccess = ref('');

// Estados de pedidos
const userOrders = ref<OrderResponse[]>([]);
const loadingOrders = ref(false);
const ordersError = ref('');

// Formulario de contraseña
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

// Pestañas disponibles
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
    id: 'orders',
    label: 'Pedidos',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10 5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>'
  },
  {
    id: 'settings',
    label: 'Configuración',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>'
  }
];

// Información del usuario
const userInfo = reactive<UserProfile>({
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  birthdate: '',
  bio: '',
  dietaryPreferences: [],
  photoURL: '',
});

// Métodos
const loadUserData = () => {
  // Cargar información básica del usuario desde el store
  if (authStore.user) {
    userInfo.firstName = authStore.user.firstName;
    userInfo.lastName = authStore.user.lastName;
    userInfo.email = authStore.user.email;
    userInfo.phoneNumber = authStore.user.phoneNumber || '';
  }
};

const handleTabChange = async (tabId: string) => {
  if (tabId === 'orders' && userOrders.value.length === 0 && !loadingOrders.value) {
    await loadUserOrders();
  }
};

const loadUserOrders = async () => {
  if (!authStore.isAuthenticated()) return;

  try {
    loadingOrders.value = true;
    ordersError.value = '';

    await orderStore.fetchOrders();
    userOrders.value = orderStore.orderHistory;
  } catch (error: any) {
    console.error('Error loading user orders:', error);
    ordersError.value = error.message || 'Error al cargar los pedidos';
  } finally {
    loadingOrders.value = false;
  }
};

const getOrderStatusClass = (status: OrderStatus): string => {
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

const getOrderStatusText = (status: OrderStatus): string => {
  switch (status) {
    case OrderStatus.PENDING:
      return 'Pendiente';
    case OrderStatus.ACCEPTED:
      return 'Aceptado';
    case OrderStatus.PREPARING:
      return 'Preparando';
    case OrderStatus.READY_FOR_PICKUP:
      return 'Listo';
    case OrderStatus.ON_THE_WAY:
      return 'En camino';
    case OrderStatus.DELIVERED:
      return 'Entregado';
    case OrderStatus.CANCELLED:
      return 'Cancelado';
    default:
      return status;
  }
};

const formatOrderDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

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
      year: diffDays > 365 ? 'numeric' : undefined
    });
  }
};

const openEditProfileModal = () => {
  activeTab.value = 'info';
  setTimeout(() => {
    document.querySelector('.profile-panel')?.scrollIntoView({ behavior: 'smooth' });
  }, 100);
};

const handleUserInfoUpdate = (updatedInfo: UserProfile) => {
  Object.assign(userInfo, updatedInfo);
};

const handleAddressesUpdate = () => {
  console.log('Direcciones actualizadas');
};

const changePassword = async () => {
  passwordError.value = '';
  passwordSuccess.value = '';

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordError.value = 'Las contraseñas no coinciden';
    return;
  }

  passwordLoading.value = true;

  try {
    const success = await userService.changePassword(
      passwordForm.currentPassword,
      passwordForm.newPassword
    );

    if (success) {
      passwordSuccess.value = 'Contraseña actualizada correctamente';

      passwordForm.currentPassword = '';
      passwordForm.newPassword = '';
      passwordForm.confirmPassword = '';

      setTimeout(() => {
        showPasswordModal.value = false;
        passwordSuccess.value = '';
      }, 2000);
    } else {
      passwordError.value = 'No se pudo actualizar la contraseña';
    }
  } catch (err: any) {
    console.error('Error al cambiar contraseña:', err);
    passwordError.value = err.response?.data?.message || 'Error al cambiar la contraseña';
  } finally {
    passwordLoading.value = false;
  }
};

// Inicialización
onMounted(async () => {
  loadUserData();
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

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: $text-light;
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

// Loading orders
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

  &__hint {
    margin-top: 0.5rem;
    font-size: 0.85rem;
    color: $text-light;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;
  }

  &__button {
    padding: 0.75rem 1.5rem;
    border-radius: 50px;
    font-weight: 600;
    cursor: pointer;
    transition: $transition;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;

    &--cancel {
      background-color: $light;
      color: $text;
      border: 1px solid $border;

      &:hover {
        background-color: white;
      }
    }

    &--save {
      background: $primary-gradient;
      color: white;
      border: none;

      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba($primary, 0.3);
      }

      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }
    }
  }

  &__spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s linear infinite;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
