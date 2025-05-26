<!-- views/AdminPanel.vue -->
<template>
  <div class="admin-panel min-h-screen bg-gray-50">
    <!-- Header con gradiente -->
    <div class="bg-gradient-to-r from-blue-500 to-pink-500 text-white py-8 px-4">
      <div class="max-w-7xl mx-auto">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold">Panel de Administración</h1>
            <p class="text-blue-100 mt-1">Gestión completa del sistema</p>
          </div>
          <div class="flex gap-4">
            <button @click="refreshAllData" :disabled="refreshing"
              class="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center gap-2 transition disabled:opacity-50">
              <svg v-if="refreshing" class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none">
                </circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              <span v-if="!refreshing">🔄 Actualizar</span>
              <span v-else>Actualizando...</span>
            </button>
            <button @click="exportUserData" class="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg">
              📥 Exportar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Alertas flotantes -->
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <div v-for="alert in alerts" :key="alert.id" :class="[
        'rounded-lg shadow-lg p-4 flex items-center justify-between min-w-[300px]',
        alert.type === 'success' ? 'bg-green-500 text-white' : '',
        alert.type === 'error' ? 'bg-red-500 text-white' : '',
        alert.type === 'warning' ? 'bg-yellow-500 text-white' : '',
        alert.type === 'info' ? 'bg-blue-500 text-white' : ''
      ]" style="animation: slideIn 0.3s ease-out;">
        <div class="flex items-center gap-2">
          <span>{{ alert.icon }}</span>
          <span>{{ alert.message }}</span>
        </div>
        <button @click="dismissAlert(alert.id)" class="ml-4 hover:opacity-75">
          ×
        </button>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="max-w-7xl mx-auto p-6">
      <!-- Estadísticas -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 bg-blue-100 rounded-full">
              <svg class="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">USUARIOS TOTALES</p>
              <div class="flex items-baseline">
                <p class="text-2xl font-semibold text-gray-900">{{ users.length }}</p>
                <p class="ml-2 text-sm text-green-600">+{{ stats.userGrowth }}% este mes</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 bg-green-100 rounded-full">
              <svg class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">PEDIDOS ACTIVOS</p>
              <div class="flex items-baseline">
                <p class="text-2xl font-semibold text-gray-900">{{ getActiveOrdersCount() }}</p>
                <p class="ml-2 text-sm text-gray-600">{{ getCompletedOrdersToday() }} completados hoy</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 bg-purple-100 rounded-full">
              <svg class="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">RESTAURANTES</p>
              <div class="flex items-baseline">
                <p class="text-2xl font-semibold text-gray-900">{{ restaurants.length }}</p>
                <p class="ml-2 text-sm text-green-600">{{ getActiveRestaurantsCount() }} activos</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 bg-yellow-100 rounded-full">
              <svg class="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m-3-1h6M9.7 15.7L12 18l2.3-2.3" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">INGRESOS HOY</p>
              <div class="flex items-baseline">
                <p class="text-2xl font-semibold text-gray-900">€{{ getTodayRevenue() }}</p>
                <p class="ml-2 text-sm text-green-600">+{{ stats.revenueGrowth }}% vs ayer</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs principales -->
      <div class="bg-white rounded-xl shadow-md mb-8">
        <div class="border-b border-gray-200">
          <div class="flex overflow-x-auto">
            <button v-for="tab in mainTabs" :key="tab.id" @click="activeTab = tab.id" :class="[
              'px-6 py-4 font-medium text-sm transition-colors whitespace-nowrap',
              activeTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700'
            ]">
              <span class="mr-2">{{ tab.icon }}</span>
              {{ tab.name }}
            </button>
          </div>
        </div>

        <div class="p-6">
          <!-- Tab: Dashboard principal -->
          <div v-if="activeTab === 'dashboard'" class="space-y-6">
            <!-- Gráficas del Dashboard -->
            <DashboardCharts :totalUsers="users.length" :orders="orders" :restaurants="restaurants" />
          </div>

          <!-- Tabs de componentes -->
          <AdminUsers v-if="activeTab === 'users'" :users="users" @refresh="refreshAllData" @update="updateStats"
            @add-alert="addAlert" @view-user-secret="handleViewUserSecret" @go-to-jwt-debug="handleGoToJWTDebug" />

          <AdminBusinesses v-if="activeTab === 'businesses'" :businesses="businesses" @refresh="refreshAllData"
            @update="updateStats" @add-alert="addAlert" @view-restaurants="handleViewBusinessRestaurants"
            @edit-restaurant="handleEditRestaurant" />

          <AdminRestaurants v-if="activeTab === 'restaurants'" :restaurants="restaurants"
            :restaurantOwners="restaurantOwners" :businesses="businesses" :filterByBusinessId="activeFilterBusinessId"
            :restaurantToEdit="restaurantToEdit" @refresh="refreshAllData" @update="updateStats" @add-alert="addAlert"
            @restaurant-edit-opened="restaurantToEdit = null" />

          <AdminCategories v-if="activeTab === 'categories'" :categories="categories" :businesses="businesses"
            @refresh="refreshAllData" @update="updateStats" @add-alert="addAlert" />

          <AdminProducts v-if="activeTab === 'products'" :products="products" :categories="categories"
            :businesses="businesses" @refresh="refreshAllData" @update="updateStats" @add-alert="addAlert" />

          <AdminOrders v-if="activeTab === 'orders'" :orders="orders" :deliveryPersons="deliveryPersons"
            @refresh="refreshOrders" @update="updateStats" @add-alert="addAlert" />

          <AdminJwtDebug v-if="activeTab === 'jwt'" :users="users" @add-alert="addAlert" />

          <AdminLogs v-if="activeTab === 'logs'" :logs="logs" @add-alert="addAlert" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '@/services/api';
import authService from '@/services/authService';
import { useAuthStore } from '@/stores/auth';
import DashboardCharts from '@/components/DashboardCharts.vue';
import AdminUsers from '@/views/admin/AdminUsers.vue';
import AdminBusinesses from '@/views/admin/AdminBusinesses.vue';
import AdminRestaurants from '@/views/admin/AdminRestaurants.vue';
import AdminCategories from '@/views/admin/AdminCategories.vue';
import AdminProducts from '@/views/admin/AdminProducts.vue';
import AdminOrders from '@/views/admin/AdminOrders.vue';
import AdminJwtDebug from '@/views/admin/AdminJwtDebug.vue';
import AdminLogs from '@/views/admin/AdminLogs.vue';

const router = useRouter();
const authStore = useAuthStore();

// Estados
const refreshing = ref(false);
const activeTab = ref('dashboard');
const alerts = ref([]);
const activeFilterBusinessId = ref(null);
const restaurantToEdit = ref(null); // 🆕 NUEVO: Estado para el restaurante a editar

// Datos principales
const users = ref([]);
const restaurants = ref([]);
const businesses = ref([]);
const categories = ref([]);
const products = ref([]);
const orders = ref([]);
const logs = ref([]);
const restaurantOwners = ref([]);
const deliveryPersons = ref([]);

// Estadísticas calculadas dinámicamente
const stats = reactive({
  userGrowth: 0,
  revenueGrowth: 0
});

// Tabs principales
const mainTabs = [
  { id: 'dashboard', name: 'Dashboard', icon: '📊' },
  { id: 'users', name: 'Usuarios', icon: '👥' },
  { id: 'businesses', name: 'Negocios', icon: '🏢' },
  { id: 'restaurants', name: 'Restaurantes', icon: '🍽️' },
  { id: 'categories', name: 'Categorías', icon: '📂' },
  { id: 'products', name: 'Productos', icon: '🛒' },
  { id: 'orders', name: 'Pedidos', icon: '📦' },
  { id: 'jwt', name: 'JWT Debug', icon: '🔐' },
  { id: 'logs', name: 'Logs', icon: '📝' }
];

// Lifecycle hooks
onMounted(async () => {
  await checkAuthorization();
  await refreshAllData();
});

// Métodos para calcular estadísticas desde los datos reales
const getActiveOrdersCount = () => {
  return orders.value.filter(order =>
    !['Delivered', 'Cancelled'].includes(order.status)
  ).length;
};

const getCompletedOrdersToday = () => {
  const today = new Date().toISOString().split('T')[0];
  return orders.value.filter(order =>
    order.status === 'Delivered' &&
    order.createdAt && order.createdAt.startsWith(today)
  ).length;
};

const getActiveRestaurantsCount = () => {
  return restaurants.value.filter(restaurant => restaurant.isOpen).length;
};

const getTodayRevenue = () => {
  const today = new Date().toISOString().split('T')[0];
  const todayRevenue = orders.value
    .filter(order => order.createdAt && order.createdAt.startsWith(today))
    .reduce((total, order) => total + (order.total || 0), 0);

  return todayRevenue.toFixed(2);
};

const updateStats = () => {
  // Calcular crecimiento de usuarios (simulado - en producción calcularías vs mes anterior)
  stats.userGrowth = Math.floor(Math.random() * 10) + 1;
  stats.revenueGrowth = Math.floor(Math.random() * 15) + 1;
};

// Métodos de autorización
const checkAuthorization = async () => {
  try {
    if (!authStore.isAuthenticated()) {
      router.push('/login');
      return;
    }

    if (!authStore.isAdmin()) {
      router.push('/unauthorized');
      return;
    }

    const isValid = await authService.verifyToken();
    if (!isValid) {
      const refreshed = await authService.refreshToken();
      if (!refreshed) {
        router.push('/login');
        return;
      }
    }
  } catch (error) {
    console.error('Error verificando autorización:', error);
    router.push('/unauthorized');
  }
};

// Métodos de carga de datos
const refreshAllData = async () => {
  refreshing.value = true;
  try {
    await Promise.all([
      fetchUsers(),
      fetchBusinesses(),
      fetchRestaurants(),
      fetchCategories(),
      fetchProducts(),
      fetchOrders(),
      fetchLogs()
    ]);

    updateStats();
    addAlert('Datos actualizados correctamente', 'success');
  } catch (error) {
    console.error('Error refrescando datos:', error);
    addAlert('Error al actualizar algunos datos', 'error');
  } finally {
    refreshing.value = false;
  }
};

const fetchUsers = async () => {
  try {
    const response = await api.get('/api/Users');
    users.value = response.data || [];

    // Filtrar usuarios por rol
    restaurantOwners.value = users.value.filter(user =>
      user.role === 'Restaurant' || user.role === 'Admin' || user.role === 'Business'
    );

    deliveryPersons.value = users.value.filter(user =>
      user.role === 'DeliveryPerson'
    );
  } catch (error) {
    console.error('Error fetchUsers:', error);
    addAlert('Error al obtener usuarios', 'error');
    users.value = [];
    restaurantOwners.value = [];
    deliveryPersons.value = [];
  }
};

const fetchBusinesses = async () => {
  try {
    const response = await api.get('/api/Business');
    businesses.value = response.data || [];
  } catch (error) {
    console.error('Error fetchBusinesses:', error);
    addAlert('Error al obtener negocios', 'error');
    businesses.value = [];
  }
};

const fetchRestaurants = async () => {
  try {
    const response = await api.get('/api/Restaurants');
    restaurants.value = response.data || [];
  } catch (error) {
    console.error('Error fetchRestaurants:', error);
    addAlert('Error al obtener restaurantes', 'error');
    restaurants.value = [];
  }
};

const fetchCategories = async () => {
  try {
    const response = await api.get('/api/Categories');
    categories.value = response.data || [];
  } catch (error) {
    console.error('Error fetchCategories:', error);
    addAlert('Error al obtener categorías', 'error');
    categories.value = [];
  }
};

const fetchProducts = async () => {
  try {
    const response = await api.get('/api/Products');
    products.value = response.data || [];
  } catch (error) {
    console.error('Error fetchProducts:', error);
    addAlert('Error al obtener productos', 'error');
    products.value = [];
  }
};

const fetchOrders = async () => {
  try {
    const response = await api.get('/api/Orders');
    orders.value = response.data || [];
  } catch (error) {
    console.error('Error fetchOrders:', error);
    addAlert('Error al obtener pedidos', 'error');
    orders.value = [];
  }
};

const fetchLogs = async () => {
  try {
    // Los logs son simulados ya que no hay endpoint específico
    logs.value = [
      {
        id: 1,
        timestamp: new Date(),
        type: 'info',
        message: 'Sistema iniciado correctamente'
      },
      {
        id: 2,
        timestamp: new Date(Date.now() - 300000),
        type: 'auth',
        message: 'Nuevo inicio de sesión de administrador'
      },
      {
        id: 3,
        timestamp: new Date(Date.now() - 600000),
        type: 'warning',
        message: 'Intento fallido de inicio de sesión'
      },
      {
        id: 4,
        timestamp: new Date(Date.now() - 900000),
        type: 'error',
        message: 'Error en la conexión con la base de datos'
      }
    ];
  } catch (error) {
    console.error('Error fetchLogs:', error);
    logs.value = [];
  }
};

// Función para mostrar una notificación
const addAlert = (message, type = 'info') => {
  const alert = {
    id: Date.now() + Math.random(), // Asegurar unicidad
    message,
    type,
    icon: {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    }[type] || 'ℹ️'
  };

  alerts.value.push(alert);

  setTimeout(() => {
    dismissAlert(alert.id);
  }, 5000);
};

const dismissAlert = (id) => {
  const index = alerts.value.findIndex(alert => alert.id === id);
  if (index !== -1) {
    alerts.value.splice(index, 1);
  }
};

// Método específico de órdenes para refrescarse independientemente
const refreshOrders = async () => {
  try {
    refreshing.value = true;
    await fetchOrders();
    addAlert('Pedidos actualizados correctamente', 'success');
  } catch (error) {
    console.error('Error al actualizar pedidos:', error);
    addAlert('Error al actualizar pedidos', 'error');
  } finally {
    refreshing.value = false;
  }
};

// Manejadores para interacción entre componentes
const handleViewBusinessRestaurants = (data) => {
  activeFilterBusinessId.value = data.businessId;
  restaurantToEdit.value = null; // 🆕 Limpiar restaurante a editar cuando se cambia de filtro
  activeTab.value = 'restaurants';
  addAlert(`Mostrando restaurantes de ${data.businessName}`, 'info');
};

// 🆕 NUEVO: Manejador para editar restaurante desde modal de negocio
const handleEditRestaurant = (restaurant) => {
  restaurantToEdit.value = restaurant;
  activeFilterBusinessId.value = restaurant.businessId; // Establecer filtro por negocio si aplica
  activeTab.value = 'restaurants';
  addAlert(`Editando restaurante: ${restaurant.name}`, 'info');
};

// Manejadores para JWT Debug
const handleViewUserSecret = (user) => {
  // Este manejador maneja cuando se hace clic en el ícono de clave secreta
  // pero se mantiene en el popup, no cambia de pestaña
  console.log('Ver clave secreta de:', user);
};

const handleGoToJWTDebug = (user) => {
  // Este manejador se ejecuta cuando se hace clic en "Ir a JWT Debug" en el popup
  activeTab.value = 'jwt';
  addAlert(`Cambiando a JWT Debug para ${user.firstName} ${user.lastName}`, 'info');

  // Opcional: Si necesitas pasar el usuario al componente JWT Debug
  // puedes usar un estado global o evento
  // selectedUserForJWT.value = user;
};

// Exportar datos
const exportUserData = async () => {
  try {
    const headers = ['ID', 'Email', 'Nombre', 'Apellido', 'Teléfono', 'Rol', 'Fecha de registro'];

    const csvRows = [];
    csvRows.push(headers.join(','));

    for (const user of users.value) {
      const row = [
        user.id,
        `"${user.email}"`,
        `"${user.firstName}"`,
        `"${user.lastName}"`,
        `"${user.phoneNumber || ''}"`,
        `"${user.role}"`,
        `"${formatDate(user.createdAt)}"`
      ];
      csvRows.push(row.join(','));
    }

    const csvContent = csvRows.join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `usuarios_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    addAlert('Datos exportados correctamente', 'success');
  } catch (error) {
    console.error('Error al exportar datos:', error);
    addAlert('Error al exportar datos', 'error');
  }
};

// Utilidades
const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('es-ES');
};
</script>

<style scoped>
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.admin-panel {
  font-family: 'Inter', sans-serif;
}
</style>
