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
            @add-alert="addAlert" />

          <!-- Nuevo componente para Business -->
          <AdminBusinesses v-if="activeTab === 'businesses'" :businesses="businesses" @refresh="refreshAllData"
            @update="updateStats" @add-alert="addAlert" @view-restaurants="handleViewBusinessRestaurants"
            @edit-restaurant="handleEditRestaurant" />

          <AdminRestaurants v-if="activeTab === 'restaurants'" :restaurants="restaurants"
            :restaurantOwners="restaurantOwners" :businesses="businesses" :filterByBusinessId="activeFilterBusinessId"
            @refresh="refreshAllData" @update="updateStats" @add-alert="addAlert" />

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
import { ref, reactive, onMounted, computed, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '@/services/api';
import authService from '@/services/authService';
import { useAuthStore } from '@/stores/auth';
import DashboardCharts from '@/components/DashboardCharts.vue';
import AdminUsers from '@/views/admin/AdminUsers.vue';
import AdminBusinesses from '@/views/admin/AdminBusinesses.vue';
import AdminRestaurants from '@/views/admin/AdminRestaurants.vue';
import AdminOrders from '@/views/admin/AdminOrders.vue';
import AdminJwtDebug from '@/views/admin/AdminJwtDebug.vue';
import AdminLogs from '@/views/admin/AdminLogs.vue';

const router = useRouter();
const authStore = useAuthStore();

// Estados
const refreshing = ref(false);
const activeTab = ref('dashboard'); // Mostrar el dashboard por defecto
const alerts = ref([]);
const activeFilterBusinessId = ref(null);

// Datos compartidos
const users = ref([]);
const restaurants = ref([]);
const businesses = ref([]); // Nuevo array para negocios
const orders = ref([]);
const logs = ref([]);
const restaurantOwners = ref([]);
const deliveryPersons = ref([]);

// Estadísticas
const stats = reactive({
  userGrowth: 5,      // Estos podrían ser calculados con datos históricos
  revenueGrowth: 8    // o mantenerse como ejemplos estáticos
});

// Tabs principales
const mainTabs = [
  { id: 'dashboard', name: 'Dashboard', icon: '📊' },
  { id: 'users', name: 'Usuarios', icon: '👥' },
  { id: 'businesses', name: 'Negocios', icon: '🏢' }, // Nueva tab para negocios
  { id: 'restaurants', name: 'Restaurantes', icon: '🍽️' },
  { id: 'orders', name: 'Pedidos', icon: '📦' },
  { id: 'jwt', name: 'JWT Debug', icon: '🔐' },
  { id: 'logs', name: 'Logs', icon: '📝' }
];

// Lifecycle hooks
onMounted(async () => {
  await checkAuthorization();
  await refreshAllData();
});

// MÉTODOS PARA CALCULAR ESTADÍSTICAS DESDE LOS DATOS REALES
// Obtener el número de pedidos activos (no entregados ni cancelados)
const getActiveOrdersCount = () => {
  return orders.value.filter(order =>
    !['Delivered', 'Cancelled'].includes(order.status)
  ).length;
};

// Obtener el número de pedidos completados hoy
const getCompletedOrdersToday = () => {
  const today = new Date().toISOString().split('T')[0];
  return orders.value.filter(order =>
    order.status === 'Delivered' &&
    order.createdAt && order.createdAt.startsWith(today)
  ).length;
};

// Obtener el número de restaurantes activos
const getActiveRestaurantsCount = () => {
  return restaurants.value.filter(restaurant => restaurant.isOpen).length;
};

// Calcular los ingresos de hoy
const getTodayRevenue = () => {
  const today = new Date().toISOString().split('T')[0];
  const todayRevenue = orders.value
    .filter(order => order.createdAt && order.createdAt.startsWith(today))
    .reduce((total, order) => total + order.total, 0);

  return todayRevenue.toFixed(2);
};

// Método para actualizar estadísticas basado en datos reales
const updateStats = () => {
  // Las estadísticas se calculan en tiempo real basadas en los datos actuales
};

// Métodos de carga de datos
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

const refreshAllData = async () => {
  refreshing.value = true;
  try {
    await Promise.all([
      fetchUsers(),
      fetchBusinesses(), // Añadir carga de negocios
      fetchRestaurants(),
      fetchOrders(),
      fetchLogs()
    ]);

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
    // Obtener usuarios del backend
    const response = await api.get('/api/Users');

    // Si no hay datos (por ejemplo, en desarrollo o si la API falla),
    // usar datos de ejemplo para demostración
    if (!response.data || response.data.length === 0) {
      users.value = [
        { id: 1, firstName: 'Juan', lastName: 'García', email: 'juan@example.com', role: 'Customer', isActive: true, createdAt: '2024-04-12' },
        { id: 2, firstName: 'María', lastName: 'López', email: 'maria@example.com', role: 'Customer', isActive: true, createdAt: '2024-04-10' },
        { id: 3, firstName: 'Carlos', lastName: 'Martínez', email: 'carlos@example.com', role: 'Restaurant', isActive: true, createdAt: '2024-03-22' },
        { id: 4, firstName: 'Ana', lastName: 'Rodríguez', email: 'ana@example.com', role: 'Admin', isActive: true, createdAt: '2024-02-15' },
        { id: 5, firstName: 'Pedro', lastName: 'Sánchez', email: 'pedro@example.com', role: 'DeliveryPerson', isActive: false, createdAt: '2024-01-05' },
      ];
    } else {
      users.value = response.data.map(user => ({
        ...user,
        isActive: true // Asumimos que todos los usuarios están activos por defecto
      }));
    }

    // Filtrar los usuarios que son dueños de restaurantes para el selector
    restaurantOwners.value = users.value.filter(user =>
      user.role === 'Restaurant' || user.role === 'Admin'
    );

    // Y los usuarios que son repartidores
    deliveryPersons.value = users.value.filter(user =>
      user.role === 'DeliveryPerson'
    );
  } catch (error) {
    console.error('Error fetchUsers:', error);
    addAlert('Error al obtener usuarios', 'error');

    // Si hay un error, usamos datos de ejemplo para demostración
    users.value = [
      { id: 1, firstName: 'Juan', lastName: 'García', email: 'juan@example.com', role: 'Customer', isActive: true, createdAt: '2024-04-12' },
      { id: 2, firstName: 'María', lastName: 'López', email: 'maria@example.com', role: 'Customer', isActive: true, createdAt: '2024-04-10' },
      { id: 3, firstName: 'Carlos', lastName: 'Martínez', email: 'carlos@example.com', role: 'Restaurant', isActive: true, createdAt: '2024-03-22' },
      { id: 4, firstName: 'Ana', lastName: 'Rodríguez', email: 'ana@example.com', role: 'Admin', isActive: true, createdAt: '2024-02-15' },
      { id: 5, firstName: 'Pedro', lastName: 'Sánchez', email: 'pedro@example.com', role: 'DeliveryPerson', isActive: false, createdAt: '2024-01-05' },
    ];

    restaurantOwners.value = users.value.filter(user =>
      user.role === 'Restaurant' || user.role === 'Admin'
    );

    deliveryPersons.value = users.value.filter(user =>
      user.role === 'DeliveryPerson'
    );
  }
};

// Nuevo método para cargar negocios
const fetchBusinesses = async () => {
  try {
    // Obtener negocios del backend
    const response = await api.get('/api/Business');

    // Si no hay datos, usar datos de ejemplo
    if (!response.data || response.data.length === 0) {
      businesses.value = [
        {
          id: 1,
          name: 'Food Enterprises',
          description: 'Grupo de restaurantes de comida rápida',
          contactEmail: 'contact@foodenterprises.com',
          contactPhone: '123-456-7890',
          taxId: 'B12345678',
          businessType: 'Restaurant',
          isActive: true,
          createdAt: '2024-01-10',
          updatedAt: '2024-04-15',
          restaurants: [
            {
              id: 1,
              name: 'Burger King',
              description: 'Fast food restaurant',
              tipo: 1,
              isOpen: true,
              averageRating: 4.2
            },
            {
              id: 2,
              name: 'Pizza Hut',
              description: 'Pizza restaurant',
              tipo: 2,
              isOpen: true,
              averageRating: 4.5
            }
          ]
        },
        {
          id: 2,
          name: 'Gourmet Group',
          description: 'Restaurantes gourmet',
          contactEmail: 'info@gourmetgroup.com',
          contactPhone: '987-654-3210',
          taxId: 'B87654321',
          businessType: 'Restaurant',
          isActive: true,
          createdAt: '2024-02-15',
          updatedAt: '2024-04-10',
          restaurants: [
            {
              id: 3,
              name: 'Taco Bell',
              description: 'Mexican food',
              tipo: 4,
              isOpen: false,
              averageRating: 3.8
            }
          ]
        }
      ];
    } else {
      businesses.value = response.data;
    }
  } catch (error) {
    console.error('Error fetchBusinesses:', error);
    addAlert('Error al obtener negocios', 'error');

    // Si hay un error, usamos datos de ejemplo
    businesses.value = [
      {
        id: 1,
        name: 'Food Enterprises',
        description: 'Grupo de restaurantes de comida rápida',
        contactEmail: 'contact@foodenterprises.com',
        contactPhone: '123-456-7890',
        taxId: 'B12345678',
        businessType: 'Restaurant',
        isActive: true,
        createdAt: '2024-01-10',
        updatedAt: '2024-04-15',
        restaurants: [
          {
            id: 1,
            name: 'Burger King',
            description: 'Fast food restaurant',
            tipo: 1,
            isOpen: true,
            averageRating: 4.2
          },
          {
            id: 2,
            name: 'Pizza Hut',
            description: 'Pizza restaurant',
            tipo: 2,
            isOpen: true,
            averageRating: 4.5
          }
        ]
      },
      {
        id: 2,
        name: 'Gourmet Group',
        description: 'Restaurantes gourmet',
        contactEmail: 'info@gourmetgroup.com',
        contactPhone: '987-654-3210',
        taxId: 'B87654321',
        businessType: 'Restaurant',
        isActive: true,
        createdAt: '2024-02-15',
        updatedAt: '2024-04-10',
        restaurants: [
          {
            id: 3,
            name: 'Taco Bell',
            description: 'Mexican food',
            tipo: 4,
            isOpen: false,
            averageRating: 3.8
          }
        ]
      }
    ];
  }
};

const fetchRestaurants = async () => {
  try {
    // Obtener restaurantes del backend
    const response = await api.get('/api/Restaurants');

    // Si no hay datos, usar datos de ejemplo
    if (!response.data || response.data.length === 0) {
      restaurants.value = [
        {
          id: 1,
          name: 'Burger King',
          description: 'Fast food restaurant',
          owner: { firstName: 'Carlos', lastName: 'Martínez' },
          tipo: 1,
          isOpen: true,
          averageRating: 4.2,
          createdAt: '2024-01-15',
          logoUrl: 'https://via.placeholder.com/40',
          businessId: 1
        },
        {
          id: 2,
          name: 'Pizza Hut',
          description: 'Pizza restaurant',
          owner: { firstName: 'Laura', lastName: 'González' },
          tipo: 2,
          isOpen: true,
          averageRating: 4.5,
          createdAt: '2024-02-10',
          logoUrl: 'https://via.placeholder.com/40',
          businessId: 1
        },
        {
          id: 3,
          name: 'Taco Bell',
          description: 'Mexican food',
          owner: { firstName: 'Miguel', lastName: 'Torres' },
          tipo: 4,
          isOpen: false,
          averageRating: 3.8,
          createdAt: '2024-03-05',
          logoUrl: 'https://via.placeholder.com/40',
          businessId: 2
        },
      ];
    } else {
      restaurants.value = response.data;
    }
  } catch (error) {
    console.error('Error fetchRestaurants:', error);
    addAlert('Error al obtener restaurantes', 'error');

    // Si hay un error, usamos datos de ejemplo
    restaurants.value = [
      {
        id: 1,
        name: 'Burger King',
        description: 'Fast food restaurant',
        owner: { firstName: 'Carlos', lastName: 'Martínez' },
        tipo: 1,
        isOpen: true,
        averageRating: 4.2,
        createdAt: '2024-01-15',
        logoUrl: 'https://via.placeholder.com/40',
        businessId: 1
      },
      {
        id: 2,
        name: 'Pizza Hut',
        description: 'Pizza restaurant',
        owner: { firstName: 'Laura', lastName: 'González' },
        tipo: 2,
        isOpen: true,
        averageRating: 4.5,
        createdAt: '2024-02-10',
        logoUrl: 'https://via.placeholder.com/40',
        businessId: 1
      },
      {
        id: 3,
        name: 'Taco Bell',
        description: 'Mexican food',
        owner: { firstName: 'Miguel', lastName: 'Torres' },
        tipo: 4,
        isOpen: false,
        averageRating: 3.8,
        createdAt: '2024-03-05',
        logoUrl: 'https://via.placeholder.com/40',
        businessId: 2
      },
    ];
  }
};

const fetchOrders = async () => {
  try {
    // Obtener pedidos del backend
    const response = await api.get('/api/Orders');

    // Si no hay datos, usar datos de ejemplo
    if (!response.data || response.data.length === 0) {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

      orders.value = [
        {
          id: 101,
          user: { firstName: 'Juan', lastName: 'García', email: 'juan@example.com' },
          restaurant: { name: 'Burger King' },
          total: 25.50,
          status: 'Delivered',
          deliveryPerson: { firstName: 'Pedro', lastName: 'Sánchez' },
          createdAt: `${today}T14:35:00`
        },
        {
          id: 102,
          user: { firstName: 'María', lastName: 'López', email: 'maria@example.com' },
          restaurant: { name: 'Pizza Hut' },
          total: 32.75,
          status: 'Preparing',
          deliveryPerson: null,
          createdAt: `${today}T10:15:00`
        },
        {
          id: 103,
          user: { firstName: 'Ana', lastName: 'Rodríguez', email: 'ana@example.com' },
          restaurant: { name: 'Taco Bell' },
          total: 18.25,
          status: 'Cancelled',
          deliveryPerson: null,
          createdAt: `${yesterday}T20:45:00`
        },
      ];
    } else {
      orders.value = response.data;
    }
  } catch (error) {
    console.error('Error fetchOrders:', error);
    addAlert('Error al obtener pedidos', 'error');

    // Si hay un error, usamos datos de ejemplo
    const today = new Date().toISOString().split('T')[0];

    orders.value = [
      {
        id: 101,
        user: { firstName: 'Juan', lastName: 'García', email: 'juan@example.com' },
        restaurant: { name: 'Burger King' },
        total: 25.50,
        status: 'Delivered',
        deliveryPerson: { firstName: 'Pedro', lastName: 'Sánchez' },
        createdAt: `${today}T14:35:00`
      },
      {
        id: 102,
        user: { firstName: 'María', lastName: 'López', email: 'maria@example.com' },
        restaurant: { name: 'Pizza Hut' },
        total: 32.75,
        status: 'Preparing',
        deliveryPerson: null,
        createdAt: `${today}T10:15:00`
      },
      {
        id: 103,
        user: { firstName: 'Ana', lastName: 'Rodríguez', email: 'ana@example.com' },
        restaurant: { name: 'Taco Bell' },
        total: 18.25,
        status: 'Cancelled',
        deliveryPerson: null,
        createdAt: `${today}T20:45:00`
      },
    ];
  }
};

const fetchLogs = async () => {
  try {
    // Para los logs, simulamos datos ya que no hay endpoint específico
    logs.value = [
      {
        id: 1,
        timestamp: new Date(),
        type: 'info',
        message: 'Sistema iniciado correctamente'
      },
      {
        id: 2,
        timestamp: new Date(),
        type: 'auth',
        message: 'Nuevo inicio de sesión de administrador'
      },
      {
        id: 3,
        timestamp: new Date(),
        type: 'warning',
        message: 'Intento fallido de inicio de sesión'
      },
      {
        id: 4,
        timestamp: new Date(),
        type: 'error',
        message: 'Error en la conexión con la base de datos'
      },
      {
        id: 5,
        timestamp: new Date(),
        type: 'info',
        message: 'Nuevo restaurante registrado: Pizza Hut'
      },
    ];
  } catch (error) {
    console.error('Error fetchLogs:', error);
    addAlert('Error al obtener logs', 'error');
  }
};

// Función para mostrar una notificación
const addAlert = (message, type = 'info') => {
  const alert = {
    id: Date.now(),
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
  activeTab.value = 'restaurants';
  addAlert(`Mostrando restaurantes de ${data.businessName}`, 'info');
};

const handleEditRestaurant = (restaurant) => {
  activeTab.value = 'restaurants';
  // Aquí podrías emitir un evento o establecer un estado para que el componente de restaurantes sepa que debe abrir el modal de edición
  addAlert(`Editando restaurante ${restaurant.name}`, 'info');
};

// Exportar datos
const exportUserData = async () => {
  try {
    // Crear datos CSV
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

    // Crear blob y descargar
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

@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }

  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

.admin-panel {
  font-family: 'Inter', sans-serif;
}

/* Override para asegurar que los estilos se apliquen */
.bg-gradient-to-r {
  background-image: linear-gradient(to right, #3b82f6, #ec4899);
}

/* Estilos adicionales para mejorar la apariencia */
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}

/* Estilos para el modal */
@media (max-width: 640px) {
  .modal-container {
    margin: 1rem;
  }
}
</style>
