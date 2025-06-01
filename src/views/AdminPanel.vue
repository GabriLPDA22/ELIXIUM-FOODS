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
            <DashboardCharts
              :totalUsers="users.length"
              :orders="orders"
              :restaurants="restaurants"
              :users="users"
              :businesses="businesses"
            />
          </div>

          <!-- Tabs de componentes -->
          <AdminUsers v-if="activeTab === 'users'" :users="users" @refresh="refreshAllData" @update="updateStats"
            @add-alert="addAlert" @view-user-secret="handleViewUserSecret" @go-to-security-manager="handleGoToSecurityManager" />

          <AdminBusinesses v-if="activeTab === 'businesses'" :businesses="businesses" @refresh="refreshAllData"
            @update="updateStats" @add-alert="addAlert" @view-restaurants="handleViewBusinessRestaurants"
            @edit-restaurant="handleEditRestaurant" />

          <AdminRestaurants v-if="activeTab === 'restaurants'" :restaurants="restaurants"
            :restaurantOwners="restaurantOwners" :businesses="businesses" :filterByBusinessId="activeFilterBusinessId"
            :restaurantToEdit="restaurantToEdit" @refresh="refreshAllData" @update="updateStats" @add-alert="addAlert"
            @restaurant-edit-opened="restaurantToEdit = null" />

          <AdminCategories v-if="activeTab === 'categories'" :categories="categories" :businesses="businesses"
            @refresh="refreshAllData" @update="updateStats" @add-alert="addAlert"
            @view-category-products="handleViewCategoryProducts" />

          <AdminProducts v-if="activeTab === 'products'" :products="products" :categories="categories"
            :businesses="businesses" :filterByCategoryId="activeFilterCategoryId"
            :filterByBusinessId="activeFilterBusinessId" @refresh="refreshAllData" @update="updateStats"
            @add-alert="addAlert" @clear-filters="handleClearProductFilters" @view-restaurants="handleViewProductRestaurants" />

          <AdminOrders v-if="activeTab === 'orders'" :orders="orders" :deliveryPersons="deliveryPersons"
            @refresh="refreshOrders" @update="updateStats" @add-alert="addAlert" />

          <AdminSecurityManager v-if="activeTab === 'security'" :users="users" @add-alert="addAlert" />

          <AdminSystemLogs v-if="activeTab === 'logs'" :logs="logs" @add-alert="addAlert" />
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
import AdminSecurityManager from '@/views/admin/AdminSecurityManager.vue';
import AdminSystemLogs from '@/views/admin/AdminSystemLogs.vue';

const router = useRouter();
const authStore = useAuthStore();

// Estados
const refreshing = ref(false);
const activeTab = ref('dashboard');
const alerts = ref([]);
const activeFilterBusinessId = ref(null);
const restaurantToEdit = ref(null);
const activeFilterCategoryId = ref(null);

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

// Tabs principales - NOMBRES AMIGABLES
const mainTabs = [
  { id: 'dashboard', name: 'Dashboard', icon: '📊' },
  { id: 'users', name: 'Usuarios', icon: '👥' },
  { id: 'businesses', name: 'Negocios', icon: '🏢' },
  { id: 'restaurants', name: 'Restaurantes', icon: '🍽️' },
  { id: 'categories', name: 'Categorías', icon: '📂' },
  { id: 'products', name: 'Productos', icon: '🛒' },
  { id: 'orders', name: 'Pedidos', icon: '📦' },
  { id: 'security', name: 'Seguridad', icon: '🔐' },
  { id: 'logs', name: 'Actividad', icon: '📝' }
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
    // CORREGIDO: usar como computed, no como función
    if (!authStore.isAuthenticated) {
      router.push('/login');
      return;
    }

    // CORREGIDO: usar como computed, no como función
    if (!authStore.isAdmin) {
      console.log('Usuario no es admin. Rol actual:', authStore.user?.role);
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

    console.log('✅ Autorización de admin verificada exitosamente');
    console.log('Usuario admin:', authStore.user?.firstName, authStore.user?.lastName);
  } catch (error) {
    console.error('Error verificando autorización:', error);
    router.push('/unauthorized');
  }
};

// Métodos de carga de datos CORREGIDOS
const refreshAllData = async () => {
  refreshing.value = true;
  console.log('🔄 Iniciando carga completa de datos del admin...');

  try {
    // Cargar datos secuencialmente para mejor debugging
    console.log('📝 Cargando usuarios...');
    await fetchUsers();

    console.log('🏢 Cargando negocios...');
    await fetchBusinesses();

    console.log('🍽️ Cargando restaurantes...');
    await fetchRestaurants();

    console.log('📂 Cargando categorías...');
    await fetchCategories();

    console.log('🛒 Cargando productos...');
    await fetchProducts();

    console.log('📦 Cargando pedidos...');
    await fetchOrders();

    console.log('📊 Cargando logs...');
    await fetchLogs();

    updateStats();

    console.log('✅ Todos los datos cargados exitosamente');
    console.log('📊 Resumen de datos:', {
      usuarios: users.value.length,
      negocios: businesses.value.length,
      restaurantes: restaurants.value.length,
      categorias: categories.value.length,
      productos: products.value.length,
      pedidos: orders.value.length
    });

    addAlert('Datos actualizados correctamente', 'success');
  } catch (error) {
    console.error('❌ Error refrescando datos:', error);
    addAlert('Error al actualizar algunos datos: ' + (error.message || 'Error desconocido'), 'error');
  } finally {
    refreshing.value = false;
  }
};

// ✅ CORREGIDO: Cambiar de /api/Users a /api/User
const fetchUsers = async () => {
  try {
    console.log('🔍 Fetching users from /api/User...');
    const response = await api.get('/api/User');

    // Manejar diferentes estructuras de respuesta
    if (response.data?.data) {
      users.value = response.data.data || [];
    } else if (Array.isArray(response.data)) {
      users.value = response.data;
    } else {
      users.value = response.data || [];
    }

    // Filtrar usuarios por rol
    restaurantOwners.value = users.value.filter(user =>
      user.role === 'Restaurant' || user.role === 'Admin' || user.role === 'Business'
    );

    deliveryPersons.value = users.value.filter(user =>
      user.role === 'DeliveryPerson'
    );

    console.log('✅ Usuarios cargados exitosamente:', {
      total: users.value.length,
      restaurantOwners: restaurantOwners.value.length,
      deliveryPersons: deliveryPersons.value.length
    });

  } catch (error) {
    console.error('❌ Error fetchUsers:', error);
    console.error('Details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url
    });

    addAlert('Error al obtener usuarios: ' + (error.response?.data?.message || error.message), 'error');
    users.value = [];
    restaurantOwners.value = [];
    deliveryPersons.value = [];
  }
};

const fetchBusinesses = async () => {
  try {
    console.log('🔍 Fetching businesses from /api/Business...');
    const response = await api.get('/api/Business');

    if (response.data?.data) {
      businesses.value = response.data.data || [];
    } else if (Array.isArray(response.data)) {
      businesses.value = response.data;
    } else {
      businesses.value = response.data || [];
    }

    console.log('✅ Negocios cargados:', businesses.value.length);
  } catch (error) {
    console.error('❌ Error fetchBusinesses:', error);
    addAlert('Error al obtener negocios: ' + (error.response?.data?.message || error.message), 'error');
    businesses.value = [];
  }
};

const fetchRestaurants = async () => {
  try {
    console.log('🔍 Fetching restaurants from /api/Restaurants...');
    const response = await api.get('/api/Restaurants');

    if (response.data?.data) {
      restaurants.value = response.data.data || [];
    } else if (Array.isArray(response.data)) {
      restaurants.value = response.data;
    } else {
      restaurants.value = response.data || [];
    }

    console.log('✅ Restaurantes cargados:', restaurants.value.length);
  } catch (error) {
    console.error('❌ Error fetchRestaurants:', error);
    addAlert('Error al obtener restaurantes: ' + (error.response?.data?.message || error.message), 'error');
    restaurants.value = [];
  }
};

const fetchCategories = async () => {
  try {
    console.log('🔍 Fetching categories from /api/Categories...');
    const response = await api.get('/api/Categories');

    if (response.data?.data) {
      categories.value = response.data.data || [];
    } else if (Array.isArray(response.data)) {
      categories.value = response.data;
    } else {
      categories.value = response.data || [];
    }

    console.log('✅ Categorías cargadas:', categories.value.length);
  } catch (error) {
    console.error('❌ Error fetchCategories:', error);
    addAlert('Error al obtener categorías: ' + (error.response?.data?.message || error.message), 'error');
    categories.value = [];
  }
};

const fetchProducts = async () => {
  try {
    console.log('🔍 Fetching products from /api/Products...');
    const response = await api.get('/api/Products');

    if (response.data?.data) {
      products.value = response.data.data || [];
    } else if (Array.isArray(response.data)) {
      products.value = response.data;
    } else {
      products.value = response.data || [];
    }

    console.log('✅ Productos cargados:', products.value.length);
  } catch (error) {
    console.error('❌ Error fetchProducts:', error);
    addAlert('Error al obtener productos: ' + (error.response?.data?.message || error.message), 'error');
    products.value = [];
  }
};

const fetchOrders = async () => {
  try {
    console.log('🔍 Fetching orders from /api/Orders...');
    const response = await api.get('/api/Orders');

    if (response.data?.data) {
      orders.value = response.data.data || [];
    } else if (Array.isArray(response.data)) {
      orders.value = response.data;
    } else {
      orders.value = response.data || [];
    }

    console.log('✅ Pedidos cargados:', orders.value.length);
  } catch (error) {
    console.error('❌ Error fetchOrders:', error);
    addAlert('Error al obtener pedidos: ' + (error.response?.data?.message || error.message), 'error');
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

    console.log('✅ Logs simulados cargados:', logs.value.length);
  } catch (error) {
    console.error('❌ Error fetchLogs:', error);
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
  activeFilterCategoryId.value = null;
  restaurantToEdit.value = null;
  activeTab.value = 'restaurants';
  addAlert(`Mostrando restaurantes de ${data.businessName}`, 'info');
};

const handleViewCategoryProducts = (data) => {
  activeFilterCategoryId.value = data.categoryId;
  activeFilterBusinessId.value = data.businessId;
  activeTab.value = 'products';
  addAlert(`Mostrando productos de la categoría "${data.categoryName}"`, 'info');
};

const handleEditRestaurant = (restaurant) => {
  restaurantToEdit.value = restaurant;
  activeFilterBusinessId.value = restaurant.businessId; // Establecer filtro por negocio si aplica
  activeTab.value = 'restaurants';
  addAlert(`Editando restaurante: ${restaurant.name}`, 'info');
};

// Nuevo manejador para navegar desde productos a restaurantes
const handleViewProductRestaurants = (data) => {
  // Limpiar filtros previos y cambiar a la vista de restaurantes
  activeFilterBusinessId.value = null;
  activeFilterCategoryId.value = null;
  restaurantToEdit.value = null;
  activeTab.value = 'restaurants';

  // Mostrar alerta informativa
  addAlert(`Funcionalidad: Ver restaurantes que ofrecen "${data.productName}" - En desarrollo`, 'info');

  // TODO: Aquí podrías implementar un filtro específico para mostrar
  // solo los restaurantes que tienen este producto
  // Por ejemplo: activeFilterByProductId.value = data.productId;
};

// Manejadores para Control de Seguridad (antes JWT Debug)
const handleViewUserSecret = (user) => {
  // Este manejador maneja cuando se hace clic en el ícono de clave secreta
  // pero se mantiene en el popup, no cambia de pestaña
  console.log('Ver clave secreta de:', user);
};

const handleClearProductFilters = () => {
  activeFilterCategoryId.value = null;
  activeFilterBusinessId.value = null;
  addAlert('Filtros eliminados', 'info');
};

const handleGoToSecurityManager = (user) => {
  activeTab.value = 'security';
  addAlert(`Cambiando a Control de Seguridad para ${user.firstName} ${user.lastName}`, 'info');
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

// 🔧 FUNCIONES DE DEBUGGING AÑADIDAS
const debugEndpoints = async () => {
  console.log('🔍 === INICIANDO DEBUG DE ENDPOINTS ===');

  const endpoints = [
    { name: 'Users (singular)', url: '/api/User', method: 'GET' },
    { name: 'Users (plural)', url: '/api/Users', method: 'GET' },
    { name: 'Business', url: '/api/Business', method: 'GET' },
    { name: 'Restaurants', url: '/api/Restaurants', method: 'GET' },
    { name: 'Categories', url: '/api/Categories', method: 'GET' },
    { name: 'Products', url: '/api/Products', method: 'GET' },
    { name: 'Orders', url: '/api/Orders', method: 'GET' }
  ];

  const results = {};

  for (const endpoint of endpoints) {
    try {
      console.log(`🧪 Testing ${endpoint.name}: ${endpoint.method} ${endpoint.url}`);

      const response = await api.get(endpoint.url);

      results[endpoint.name] = {
        status: '✅ SUCCESS',
        statusCode: response.status,
        dataType: Array.isArray(response.data) ? 'array' : typeof response.data,
        dataLength: Array.isArray(response.data) ? response.data.length : 'N/A',
        hasData: response.data?.data ? 'Yes (nested)' : 'No (direct)',
        sample: Array.isArray(response.data) && response.data.length > 0 ?
          Object.keys(response.data[0]).slice(0, 5) :
          (response.data ? Object.keys(response.data).slice(0, 5) : [])
      };

      console.log(`✅ ${endpoint.name}: OK (${results[endpoint.name].dataLength} items)`);

    } catch (error) {
      results[endpoint.name] = {
        status: '❌ FAILED',
        statusCode: error.response?.status || 'No response',
        error: error.response?.data?.message || error.message,
        suggestion: error.response?.status === 404 ?
          'Verificar ruta en backend' :
          'Verificar autenticación'
      };

      console.error(`❌ ${endpoint.name}: ${error.response?.status || 'ERROR'}`);
    }
  }

  console.log('📊 === RESUMEN DE RESULTADOS ===');
  console.table(results);

  return results;
};

const debugAuth = () => {
  console.log('🔐 === DEBUG DE AUTENTICACIÓN ===');

  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');

  console.log('Token presente:', !!token);
  console.log('Refresh token presente:', !!refreshToken);
  console.log('Usuario autenticado:', authStore.isAuthenticated);
  console.log('Es admin:', authStore.isAdmin);
  console.log('Usuario actual:', authStore.user);

  if (token) {
    try {
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        console.log('Payload del token:', payload);
        console.log('Token expira:', new Date(payload.exp * 1000));
        console.log('Token expirado:', Date.now() > payload.exp * 1000);
      }
    } catch (error) {
      console.error('Error decodificando token:', error);
    }
  }
};

const debugDataState = () => {
  console.log('📊 === ESTADO DE LOS DATOS ===');
  console.log('Usuarios cargados:', users.value.length);
  console.log('Negocios cargados:', businesses.value.length);
  console.log('Restaurantes cargados:', restaurants.value.length);
  console.log('Categorías cargadas:', categories.value.length);
  console.log('Productos cargados:', products.value.length);
  console.log('Pedidos cargados:', orders.value.length);

  if (users.value.length > 0) {
    console.log('Muestra de usuario:', users.value[0]);
  }
  if (orders.value.length > 0) {
    console.log('Muestra de pedido:', orders.value[0]);
  }
};

const runFullDebug = async () => {
  console.clear();
  console.log('🚀 === INICIANDO DEBUG COMPLETO DEL ADMIN PANEL ===');

  debugAuth();
  await debugEndpoints();
  debugDataState();

  console.log('🔄 Probando carga de datos...');
  await refreshAllData();

  console.log('✅ Debug completo terminado');
};

// Exportar funciones de debug para uso en consola
if (typeof window !== 'undefined') {
  window.adminDebug = {
    endpoints: debugEndpoints,
    auth: debugAuth,
    data: debugDataState,
    full: runFullDebug
  };
  console.log('🛠️ Debug functions available at window.adminDebug');
}

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
