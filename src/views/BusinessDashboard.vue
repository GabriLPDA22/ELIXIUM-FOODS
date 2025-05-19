<template>
  <div class="business-dashboard">
    <div class="business-dashboard__sidebar" :class="{ 'business-dashboard__sidebar--open': isSidebarOpen }">
      <div class="business-dashboard__sidebar-header">
        <div class="business-dashboard__logo">
          <img :src="business?.logoUrl || '/images/restaurant-placeholder.png'" alt="Logo del restaurante"
            class="business-dashboard__logo-img" />
          <h2 class="business-dashboard__restaurant-name">{{ business?.name || 'Mi Restaurante' }}</h2>
        </div>
        <button @click="toggleSidebar" class="business-dashboard__close-sidebar">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round" class="business-dashboard__icon">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <nav class="business-dashboard__nav">
        <router-link :to="{ name: 'business-dashboard' }" class="business-dashboard__nav-item"
          exact-active-class="business-dashboard__nav-item--active">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round" class="business-dashboard__nav-icon">
            <rect x="3" y="3" width="7" height="9"></rect>
            <rect x="14" y="3" width="7" height="5"></rect>
            <rect x="14" y="12" width="7" height="9"></rect>
            <rect x="3" y="16" width="7" height="5"></rect>
          </svg>
          <span>Dashboard</span>
        </router-link>

        <router-link :to="{ name: 'business-products' }" class="business-dashboard__nav-item"
          exact-active-class="business-dashboard__nav-item--active">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round" class="business-dashboard__nav-icon">
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
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round" class="business-dashboard__nav-icon">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <span>Pedidos</span>
        </router-link>

        <router-link :to="{ name: 'business-promotions' }" class="business-dashboard__nav-item"
          exact-active-class="business-dashboard__nav-item--active">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round" class="business-dashboard__nav-icon">
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
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round" class="business-dashboard__nav-icon">
            <line x1="18" y1="20" x2="18" y2="10"></line>
            <line x1="12" y1="20" x2="12" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="14"></line>
            <line x1="0" y1="20" x2="24" y2="20"></line>
          </svg>
          <span>Analíticas</span>
        </router-link>

        <router-link :to="{ name: 'business-settings' }" class="business-dashboard__nav-item"
          exact-active-class="business-dashboard__nav-item--active">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round" class="business-dashboard__nav-icon">
            <circle cx="12" cy="12" r="3"></circle>
            <path
              d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z">
            </path>
          </svg>
          <span>Ajustes</span>
        </router-link>
      </nav>

      <div class="business-dashboard__sidebar-footer">
        <button @click="logout" class="business-dashboard__logout-btn">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round" class="business-dashboard__nav-icon">
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
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round" class="business-dashboard__icon">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <div class="business-dashboard__header-title">
          <h1>{{ currentPageTitle }}</h1>
        </div>
        <div class="business-dashboard__header-actions">
          <div class="business-dashboard__notifications">
            <button class="business-dashboard__notification-btn">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="business-dashboard__icon">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <span class="business-dashboard__notification-badge">3</span>
            </button>
          </div>
          <div class="business-dashboard__user-menu">
            <div class="business-dashboard__user-info">
              <span class="business-dashboard__user-name">
                {{ business?.name }}
              </span>
              <span class="business-dashboard__user-role">
                {{ businessRoleLabel }}
              </span>
            </div>
            <div class="business-dashboard__user-avatar">
              <img :src="business?.logoUrl || '/images/restaurant-placeholder.png'" alt="Logo"
                class="business-dashboard__avatar-img" />
            </div>
          </div>
        </div>
      </header>

      <main class="business-dashboard__content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBusinessAuthStore } from '@/stores/businessAuth'

const route = useRoute()
const router = useRouter()
const businessAuthStore = useBusinessAuthStore()

const isSidebarOpen = ref(false)

const business = computed(() => businessAuthStore.business)

const businessRoleLabel = computed(() => {
  const role = businessAuthStore.businessRole
  switch (role) {
    case 'admin': return 'Administrador';
    case 'partner': return 'Partner';
    case 'restaurant': default: return 'Restaurante';
  }
})

const currentPageTitle = computed(() => {
  // Los nombres de ruta deben coincidir con los definidos en routes.ts
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

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const logout = async () => {
  await businessAuthStore.logout()
  router.push({ name: 'business-login' }) // Usar nombre de ruta es más seguro
}

onMounted(async () => {
  // Considera si esta lógica es necesaria aquí si ya tienes guardias globales robustas.
  // Podría ser útil si el usuario llega directamente a una página del dashboard
  // sin pasar por una transición de ruta que active la guardia global (ej. refresco de página).
  if (!businessAuthStore.isAuthenticated) { // Asumiendo que 'isAuthenticated' es una propiedad/getter reactivo
    try {
      const isAuth = await businessAuthStore.checkAuth()
      if (!isAuth) {
        router.push({ name: 'business-login' })
      }
    } catch (error) {
      console.error("Error en checkAuth de BusinessDashboard:", error)
      router.push({ name: 'business-login' })
    }
  }
})
</script>

<style lang="scss" scoped>
/* Tus estilos .business-dashboard ... se mantienen igual */
.business-dashboard {
  display: flex;
  width: 100%;
  min-height: 100vh;
  background-color: #f8fafc; // Ejemplo de color de fondo

  // Variables CSS (ejemplo, defínelas donde corresponda, ej. globalmente o en este scope)
  --white: #fff;
  --primary: #ff416c; // Color rosa de ejemplo
  --medium: #6c757d;
  --dark: #343a40;
  --shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  --transition: all 0.3s ease-in-out;
  --border-radius-sm: 6px;


  &__sidebar {
    width: 260px;
    background-color: var(--white);
    border-right: 1px solid #e2e8f0;
    height: 100vh;
    position: fixed; // O 'sticky' si el header principal no es fijo
    top: 0;
    left: 0;
    z-index: 1001; // Asegurar que esté por encima del contenido principal
    display: flex;
    flex-direction: column;
    transition: transform 0.3s ease;

    @media (max-width: 992px) {
      // Breakpoint para ocultar/mostrar sidebar
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
    max-width: 160px; // Ajusta según sea necesario
  }

  &__close-sidebar {
    display: none; // Oculto por defecto
    background: none;
    border: none;
    color: var(--medium);
    cursor: pointer;

    @media (max-width: 992px) {
      // Visible solo en móvil para cerrar
      display: block;
    }
  }

  &__nav {
    flex-grow: 1; // Permite que la navegación ocupe el espacio restante
    padding: 1.5rem 0;
    overflow-y: auto; // Para scroll si hay muchos ítems
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
    border-left: 3px solid transparent; // Para el indicador activo

    &:hover {
      background-color: rgba(0, 0, 0, 0.03);
      color: var(--dark);
    }

    // Estilo para el enlace activo
    &.business-dashboard__nav-item--active {
      // Vue Router usa 'router-link-exact-active' por defecto
      background-color: rgba(255, 65, 108, 0.08); // Color primario con opacidad
      color: var(--primary);
      border-left-color: var(--primary);
      font-weight: 600;

      .business-dashboard__nav-icon {
        color: var(--primary);
      }
    }
  }

  &__nav-icon {
    width: 1.2rem; // 20px
    height: 1.2rem; // 20px
    flex-shrink: 0; // Evita que el ícono se encoja
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
      background-color: #fef2f2; // Un rojo claro para el hover de logout
      color: #ef4444; // Rojo
      border-color: #fecaca;
    }
  }

  &__main {
    flex-grow: 1; // Ocupa el resto del espacio
    margin-left: 260px; // Mismo ancho que la sidebar
    transition: margin-left 0.3s ease;


    @media (max-width: 992px) {
      margin-left: 0;
      width: 100%; // Asegurar que ocupe todo el ancho si la sidebar está oculta
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
    position: sticky; // Header fijo al hacer scroll
    top: 0;
    z-index: 1000; // Debajo de la sidebar si es fija y se superpone
  }

  &__menu-toggle {
    background: none;
    border: none;
    color: var(--medium);
    cursor: pointer;
    display: none; // Oculto en desktop

    @media (max-width: 992px) {
      // Visible solo en móvil/tablet para abrir sidebar
      display: block;
    }
  }

  &__icon {
    // Icono general
    width: 1.5rem; // 24px
    height: 1.5rem; // 24px
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

  &__notifications {
    position: relative;
  }

  &__notification-btn {
    background: none;
    border: none;
    color: var(--medium);
    cursor: pointer;
    position: relative; // Para el badge

    &:hover {
      color: var(--dark);
    }
  }

  &__notification-badge {
    position: absolute;
    top: -5px;
    right: -5px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background-color: var(--primary);
    color: var(--white);
    font-size: 0.75rem; // 12px
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1; // Para centrar el número si es de un solo dígito
  }

  &__user-menu {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer; // Si es un dropdown
  }

  &__user-info {
    text-align: right;
    display: none; // Oculto en móvil por defecto

    @media (min-width: 768px) {
      // Visible en pantallas más grandes
      display: block;
    }
  }

  &__user-name {
    display: block;
    font-weight: 600;
    font-size: 0.9rem;
    color: var(--dark);
    max-width: 150px; // Evitar que nombres largos rompan el layout
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__user-role {
    color: var(--medium);
    font-size: 0.8rem;
  }

  &__user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 8px; // O 50% para círculo
    overflow: hidden;
    background-color: #f1f5f9; // Color de fondo por si la imagen no carga
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover; // Asegura que la imagen cubra el área sin distorsionarse
  }

  &__content {
    // Área principal donde se renderiza el <router-view />
    padding: 1.5rem;

    @media (max-width: 768px) {
      padding: 1rem;
    }
  }
}
</style>
