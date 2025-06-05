<template>
  <div class="business-dashboard">
    <!-- Loading state -->
    <div v-if="isLoadingBusiness" class="business-dashboard__loading">
      <div class="business-dashboard__loading-content">
        <div class="business-dashboard__spinner"></div>
        <h3>Cargando tu negocio...</h3>
        <p>Por favor espera mientras verificamos tus datos.</p>
      </div>
    </div>

    <!-- Error state: No business found -->
    <div v-else-if="!business && hasCheckedBusiness" class="business-dashboard__no-business">
      <div class="business-dashboard__no-business-content">
        <div class="business-dashboard__no-business-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </div>
        <h2>No tienes un negocio asignado</h2>
        <p>Para acceder al dashboard de negocios, necesitas tener un negocio registrado y asignado a tu cuenta.</p>
        <div class="business-dashboard__no-business-actions">
          <router-link to="/business-register" class="business-dashboard__btn business-dashboard__btn--primary">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Registrar Nuevo Negocio
          </router-link>
          <button @click="refreshBusiness" class="business-dashboard__btn business-dashboard__btn--secondary"
            :disabled="isLoadingBusiness">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2">
              <polyline points="23 4 23 10 17 10"></polyline>
              <polyline points="1 20 1 14 7 14"></polyline>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>
            Verificar de nuevo
          </button>
          <router-link to="/" class="business-dashboard__btn business-dashboard__btn--outline">
            Volver al inicio
          </router-link>
        </div>
      </div>
    </div>

    <!-- Normal dashboard content -->
    <template v-else-if="business">
      <div class="business-dashboard__sidebar" :class="{ 'business-dashboard__sidebar--open': isSidebarOpen }">
        <div class="business-dashboard__sidebar-header">
          <div class="business-dashboard__logo">
            <img :src="business?.logoUrl || '/images/restaurant-placeholder.png'"
              :alt="`Logo de ${business?.name || 'Mi Negocio'}`" class="business-dashboard__logo-img" />
            <h2 class="business-dashboard__restaurant-name">{{ business?.name || 'Mi Negocio' }}</h2>
          </div>
          <button @click="toggleSidebar" class="business-dashboard__close-sidebar">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="business-dashboard__icon">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <nav class="business-dashboard__nav">
          <router-link :to="{ name: 'business-dashboard' }" class="business-dashboard__nav-item"
            exact-active-class="business-dashboard__nav-item--active">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="business-dashboard__nav-icon">
              <rect x="3" y="3" width="7" height="9"></rect>
              <rect x="14" y="3" width="7" height="5"></rect>
              <rect x="14" y="12" width="7" height="9"></rect>
              <rect x="3" y="16" width="7" height="5"></rect>
            </svg>
            <span>Dashboard</span>
          </router-link>

          <router-link :to="{ name: 'business-products' }" class="business-dashboard__nav-item"
            exact-active-class="business-dashboard__nav-item--active">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="business-dashboard__nav-icon">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            <span>Productos</span>
          </router-link>

          <router-link :to="{ name: 'business-orders' }" class="business-dashboard__nav-item"
            exact-active-class="business-dashboard__nav-item--active">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="business-dashboard__nav-icon">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span>Pedidos</span>
          </router-link>

          <router-link :to="{ name: 'business-promotions' }" class="business-dashboard__nav-item"
            exact-active-class="business-dashboard__nav-item--active">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="business-dashboard__nav-icon">
              <polyline points="20 12 20 22 4 22 4 12"></polyline>
              <rect x="2" y="7" width="20" height="5"></rect>
              <line x1="12" y1="22" x2="12" y2="7"></line>
              <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
              <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
            </svg>
            <span>Promociones</span>
          </router-link>

          <router-link :to="{ name: 'business-analytics' }" class="business-dashboard__nav-item"
            exact-active-class="business-dashboard__nav-item--active">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="business-dashboard__nav-icon">
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="14"></line>
              <line x1="0" y1="20" x2="24" y2="20"></line>
            </svg>
            <span>Analíticas</span>
          </router-link>

          <router-link :to="{ name: 'business-settings' }" class="business-dashboard__nav-item"
            exact-active-class="business-dashboard__nav-item--active">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="business-dashboard__nav-icon">
              <circle cx="12" cy="12" r="3"></circle>
              <path
                d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z">
              </path>
            </svg>
            <span>Ajustes</span>
          </router-link>
          <router-link :to="{ name: 'home' }" class="business-dashboard__nav-item"
            exact-active-class="business-dashboard__nav-item--active">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="business-dashboard__nav-icon">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9,22 9,12 15,12 15,22"></polyline>
            </svg>
            <span>Volver a la Home</span>
          </router-link>
        </nav>

        <div class="business-dashboard__sidebar-footer">
          <button @click="logout" class="business-dashboard__logout-btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="business-dashboard__nav-icon">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Cerrar sesión</span>
          </button>
        </div>
      </div>

      <div class="business-dashboard__main">
        <header class="business-dashboard__header">
          <button @click="toggleSidebar" class="business-dashboard__menu-toggle">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="business-dashboard__icon">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <div class="business-dashboard__header-title">
            <h1>{{ currentPageTitle }}</h1>
          </div>
          <div class="business-dashboard__header-actions">
            <div class="business-dashboard__user-menu">
              <div class="business-dashboard__user-info">
                <span class="business-dashboard__user-name">
                  {{ business?.name || 'Mi Negocio' }}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main class="business-dashboard__content">
          <router-view />
        </main>
      </div>
    </template>

    <!-- Toast Notification Component -->
    <ToastNotification ref="toastRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { api } from '@/services/api'
import ToastNotification from '@/components/ui/ToastNotification.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// Toast ref
const toastRef = ref(null)

// Toast helper function
const showToast = (type: 'success' | 'error' | 'warning' | 'info', message: string, title?: string) => {
  if (toastRef.value) {
    toastRef.value.useToast()[type](message, title)
  }
}

const isSidebarOpen = ref(false)
const business = ref(null)
const isLoadingBusiness = ref(true)
const hasCheckedBusiness = ref(false)

const currentPageTitle = computed(() => {
  switch (route.name) {
    case 'business-dashboard': return 'Dashboard';
    case 'business-products': return 'Gestión de productos';
    case 'business-orders': return 'Pedidos';
    case 'business-promotions': return 'Promociones';
    case 'business-analytics': return 'Analíticas';
    case 'business-settings': return 'Ajustes';
    default: return 'Portal de Restaurantes';
  }
})

// MEJORADO: Cargar business con mejor manejo de errores
const loadBusiness = async () => {
  try {
    isLoadingBusiness.value = true
    const userId = authStore.user?.id

    if (!userId) {
      console.error('No se encontró ID de usuario')
      business.value = null
      showToast('error', 'No se encontró información del usuario', 'Error de sesión')
      return false
    }
    const response = await api.get(`/api/Business/user/${userId}`)

    if (response.data && response.data.id) {
      business.value = response.data
      showToast('success', `Bienvenido a ${response.data.name}`, '¡Carga exitosa!')
      return true
    } else {
      console.warn('⚠️ Usuario no tiene business asignado')
      business.value = null
      showToast('warning', 'No tienes un negocio asignado a tu cuenta', 'Acceso limitado')
      return false
    }
  } catch (error: any) {
    console.error('❌ Error cargando business:', error)
    business.value = null

    // Si es un 404, significa que no tiene business
    if (error.response?.status === 404) {
      showToast('info', 'No se encontró ningún negocio asociado a tu cuenta', 'Sin negocio')
      return false
    }

    // Para otros errores, mostrar en consola pero no redirigir inmediatamente
    console.error('Error de red o servidor:', error.message)
    showToast('error', 'Error al conectar con el servidor. Intenta de nuevo.', 'Error de conexión')
    return false
  } finally {
    isLoadingBusiness.value = false
    hasCheckedBusiness.value = true
  }
}

const refreshBusiness = async () => {
  hasCheckedBusiness.value = false
  showToast('info', 'Verificando información del negocio...', 'Verificando')
  await loadBusiness()
}

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const logout = async () => {
  showToast('info', 'Cerrando sesión...', 'Hasta pronto')
  await authStore.logout()
  router.push({ name: 'home' })
}

//  onMounted con verificaciones exhaustivas
onMounted(async () => {
  // 1. Verificar autenticación básica
  if (!authStore.isAuthenticated) {
    const isAuth = await authStore.checkAuth()
    if (!isAuth) {
      console.error('❌ Usuario no autenticado')
      showToast('error', 'Debes iniciar sesión para acceder', 'No autorizado')
      router.push('/login')
      return
    }
  }

  // 2. Verificar rol apropiado
  const userRole = authStore.user?.role
  if (userRole !== 'Business' && userRole !== 'Admin') {
    console.error(`❌ Rol inválido para business dashboard: ${userRole}`)
    showToast('error', 'No tienes permisos para acceder a esta sección', 'Acceso denegado')
    router.push('/unauthorized')
    return
  }
  // 3. Cargar y verificar business
  const hasBusiness = await loadBusiness()

  if (!hasBusiness) {
    console.log('⚠️ Usuario sin business - permaneciendo en dashboard para mostrar mensaje')
  }
})
</script>

<style lang="scss" scoped>
.business-dashboard {
  display: flex;
  width: 100%;
  min-height: 100vh;
  background-color: #f8fafc;

  --white: #fff;
  --primary: #ff416c;
  --medium: #6c757d;
  --dark: #343a40;
  --shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  --transition: all 0.3s ease-in-out;
  --border-radius-sm: 6px;

  /* Estados de carga y error */
  &__loading,
  &__no-business {
    width: 100%;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f8fafc;
  }

  &__loading-content,
  &__no-business-content {
    max-width: 400px;
    text-align: center;
    padding: 2rem;
  }

  &__spinner {
    width: 48px;
    height: 48px;
    border: 4px solid #e2e8f0;
    border-radius: 50%;
    border-top-color: var(--primary);
    animation: spin 1s linear infinite;
    margin: 0 auto 1.5rem;
  }

  &__no-business-icon {
    width: 80px;
    height: 80px;
    background-color: rgba(var(--primary), 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.5rem;
    color: var(--primary);

    svg {
      width: 40px;
      height: 40px;
    }
  }

  &__no-business-content {
    h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--dark);
      margin-bottom: 1rem;
    }

    p {
      color: var(--medium);
      line-height: 1.6;
      margin-bottom: 2rem;
    }
  }

  &__no-business-actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }

  &__btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 500;
    text-decoration: none;
    border: none;
    cursor: pointer;
    transition: var(--transition);
    font-size: 0.95rem;

    svg {
      width: 18px;
      height: 18px;
    }

    &--primary {
      background-color: var(--primary);
      color: white;

      &:hover {
        background-color: #e63946;
        transform: translateY(-1px);
      }
    }

    &--secondary {
      background-color: #6c757d;
      color: white;

      &:hover {
        background-color: #5a6268;
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }

    &--outline {
      background-color: transparent;
      color: var(--medium);
      border: 1px solid #dee2e6;

      &:hover {
        background-color: #f8f9fa;
        border-color: var(--medium);
      }
    }
  }

  /* Resto de estilos del sidebar y main (sin cambios) */
  &__sidebar {
    width: 260px;
    background-color: var(--white);
    border-right: 1px solid #e2e8f0;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1001;
    display: flex;
    flex-direction: column;
    transition: transform 0.3s ease;

    @media (max-width: 992px) {
      transform: translateX(-100%);
    }

    &--open {
      transform: translateX(0);
      box-shadow: var(--shadow);
    }
  }

  &__sidebar-header {
    padding: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #e2e8f0;
  }

  &__logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  &__logo-img {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    object-fit: cover;
  }

  &__restaurant-name {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--dark);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 160px;
    margin: 0;
  }

  &__close-sidebar {
    display: none;
    background: none;
    border: none;
    color: var(--medium);
    cursor: pointer;

    @media (max-width: 992px) {
      display: block;
    }
  }

  &__nav {
    flex-grow: 1;
    padding: 1.5rem 0;
    overflow-y: auto;
  }

  &__nav-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.85rem 1.5rem;
    color: var(--medium);
    text-decoration: none;
    transition: var(--transition);
    font-weight: 500;
    border-left: 3px solid transparent;

    &:hover {
      background-color: rgba(0, 0, 0, 0.03);
      color: var(--dark);
    }

    &.business-dashboard__nav-item--active {
      background-color: rgba(255, 65, 108, 0.08);
      color: var(--primary);
      border-left-color: var(--primary);
      font-weight: 600;

      .business-dashboard__nav-icon {
        color: var(--primary);
      }
    }
  }

  &__nav-icon {
    width: 1.2rem;
    height: 1.2rem;
    flex-shrink: 0;
  }

  &__sidebar-footer {
    padding: 1.5rem;
    border-top: 1px solid #e2e8f0;
  }

  &__logout-btn {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    padding: 0.75rem 1rem;
    border-radius: var(--border-radius-sm);
    border: 1px solid #e2e8f0;
    background-color: #fff;
    color: var(--dark);
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);

    &:hover {
      background-color: #fef2f2;
      color: #ef4444;
      border-color: #fecaca;
    }
  }

  &__main {
    flex-grow: 1;
    margin-left: 260px;
    transition: margin-left 0.3s ease;

    @media (max-width: 992px) {
      margin-left: 0;
      width: 100%;
    }
  }

  &__header {
    height: 70px;
    background-color: var(--white);
    border-bottom: 1px solid #e2e8f0;
    padding: 0 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 1000;
  }

  &__menu-toggle {
    background: none;
    border: none;
    color: var(--medium);
    cursor: pointer;
    display: none;

    @media (max-width: 992px) {
      display: block;
    }
  }

  &__icon {
    width: 1.5rem;
    height: 1.5rem;
  }

  &__header-title {
    h1 {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--dark);
      margin: 0;

      @media (max-width: 768px) {
        font-size: 1.25rem;
      }
    }
  }

  &__header-actions {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  &__user-menu {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
  }

  &__user-info {
    text-align: right;
    display: none;

    @media (min-width: 768px) {
      display: block;
    }
  }

  &__user-name {
    display: block;
    font-weight: 600;
    font-size: 0.9rem;
    color: var(--dark);
    max-width: 150px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__content {
    padding: 1.5rem;

    @media (max-width: 768px) {
      padding: 1rem;
    }
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
