<!-- src/components/DashboardCharts.vue -->
<template>
  <div class="dashboard-charts">
    <!-- Gráficas para el dashboard -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Gráfica de usuarios nuevos por mes -->
      <div class="bg-white rounded-xl shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Nuevos usuarios por mes</h3>
        <div class="h-64">
          <canvas ref="usersChart"></canvas>
        </div>
      </div>

      <!-- Gráfica de pedidos por estado -->
      <div class="bg-white rounded-xl shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Pedidos por estado</h3>
        <div class="h-64">
          <canvas ref="ordersStatusChart"></canvas>
        </div>
      </div>

      <!-- Gráfica de restaurantes por estado -->
      <div class="bg-white rounded-xl shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Estado de restaurantes</h3>
        <div class="h-64">
          <canvas ref="restaurantStatusChart"></canvas>
        </div>
      </div>

      <!-- Gráfica de ingresos por día -->
      <div class="bg-white rounded-xl shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Ingresos últimos 7 días</h3>
        <div class="h-64">
          <canvas ref="revenueChart"></canvas>
        </div>
      </div>
    </div>

    <!-- Tabla de estadísticas adicionales -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <!-- Métricas de usuarios -->
      <div class="bg-white rounded-xl shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Métricas de usuarios</h3>
        <div class="space-y-4">
          <div class="flex justify-between items-center border-b pb-2">
            <span class="text-gray-600">Total de usuarios:</span>
            <span class="font-semibold text-blue-600">{{ totalUsers }}</span>
          </div>
          <div class="flex justify-between items-center border-b pb-2">
            <span class="text-gray-600">Clientes:</span>
            <span class="font-semibold text-blue-600">{{ customerCount }}</span>
          </div>
          <div class="flex justify-between items-center border-b pb-2">
            <span class="text-gray-600">Propietarios:</span>
            <span class="font-semibold text-blue-600">{{ businessOwnerCount }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600">Repartidores:</span>
            <span class="font-semibold text-blue-600">{{ deliveryPersonCount }}</span>
          </div>
        </div>
      </div>

      <!-- Rendimiento de pedidos -->
      <div class="bg-white rounded-xl shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Rendimiento de pedidos</h3>
        <div class="space-y-4">
          <div class="flex justify-between items-center border-b pb-2">
            <span class="text-gray-600">Pedidos totales:</span>
            <span class="font-semibold text-purple-600">{{ orders.length }}</span>
          </div>
          <div class="flex justify-between items-center border-b pb-2">
            <span class="text-gray-600">Pedidos completados:</span>
            <span class="font-semibold text-green-600">{{ completedOrdersCount }}</span>
          </div>
          <div class="flex justify-between items-center border-b pb-2">
            <span class="text-gray-600">Pedidos cancelados:</span>
            <span class="font-semibold text-red-600">{{ cancelledOrdersCount }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600">Ticket promedio:</span>
            <span class="font-semibold text-purple-600">€{{ avgOrderValue.toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- KPIs financieros -->
    <div class="bg-white rounded-xl shadow-md p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">KPIs financieros</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-gray-50 p-4 rounded-lg">
          <div class="text-sm text-gray-600 mb-1">Ingresos totales</div>
          <div class="text-2xl font-semibold text-indigo-600">€{{ totalRevenue.toFixed(2) }}</div>
          <div class="text-xs text-green-500 mt-1">{{ orders.length }} pedidos</div>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg">
          <div class="text-sm text-gray-600 mb-1">Ticket medio</div>
          <div class="text-2xl font-semibold text-indigo-600">€{{ avgOrderValue.toFixed(2) }}</div>
          <div class="text-xs text-blue-500 mt-1">Por pedido</div>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg">
          <div class="text-sm text-gray-600 mb-1">Restaurantes activos</div>
          <div class="text-2xl font-semibold text-indigo-600">{{ activeRestaurantsCount }}</div>
          <div class="text-xs text-green-500 mt-1">De {{ restaurants.length }} totales</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, onBeforeUnmount, nextTick } from 'vue';
import Chart from 'chart.js/auto';

// Referencias para los canvas de las gráficas
const usersChart = ref(null);
const ordersStatusChart = ref(null);
const restaurantStatusChart = ref(null);
const revenueChart = ref(null);

// Propiedades para recibir datos del componente padre
const props = defineProps({
  totalUsers: {
    type: Number,
    default: 0
  },
  orders: {
    type: Array,
    default: () => []
  },
  restaurants: {
    type: Array,
    default: () => []
  },
  users: {
    type: Array,
    default: () => []
  },
  businesses: {
    type: Array,
    default: () => []
  }
});

// Referencias a las instancias de Chart.js
let userChartInstance = null;
let ordersStatusChartInstance = null;
let restaurantStatusChartInstance = null;
let revenueChartInstance = null;

// Calcular estadísticas basadas en los datos recibidos
const customerCount = computed(() => {
  return props.users.filter(user =>
    user.role === 'Customer' || user.role === 'User' || !user.role
  ).length;
});

const businessOwnerCount = computed(() => {
  return props.users.filter(user =>
    user.role === 'Restaurant' || user.role === 'Business' || user.role === 'Admin'
  ).length;
});

const deliveryPersonCount = computed(() => {
  return props.users.filter(user => user.role === 'DeliveryPerson').length;
});

const completedOrdersCount = computed(() => {
  return props.orders.filter(order =>
    order.status === 'Delivered' || order.status === 'Completed'
  ).length;
});

const cancelledOrdersCount = computed(() => {
  return props.orders.filter(order =>
    order.status === 'Cancelled' || order.status === 'Canceled'
  ).length;
});

const activeRestaurantsCount = computed(() => {
  return props.restaurants.filter(restaurant => restaurant.isOpen).length;
});

const totalRevenue = computed(() => {
  if (props.orders.length === 0) return 0;
  return props.orders.reduce((sum, order) => {
    // Manejar diferentes formas de representar el total
    const total = order.total || order.totalAmount || order.price || 0;
    return sum + (typeof total === 'number' ? total : parseFloat(total) || 0);
  }, 0);
});

const avgOrderValue = computed(() => {
  if (props.orders.length === 0) return 0;
  return totalRevenue.value / props.orders.length;
});

// Datos para las gráficas basados en datos reales
const getUsersData = () => {
  if (props.users.length === 0) {
    return {
      labels: ['Sin datos'],
      datasets: [{
        label: 'Usuarios',
        data: [0],
        borderColor: 'rgb(203, 213, 225)',
        backgroundColor: 'rgba(203, 213, 225, 0.5)',
        tension: 0.3
      }]
    };
  }

  // Agrupar usuarios por mes de creación
  const monthlyUsers = {};
  const last6Months = [];
  const now = new Date();

  // Generar últimos 6 meses
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
    last6Months.push(key);
    monthlyUsers[key] = 0;
  }

  // Contar usuarios por mes
  props.users.forEach(user => {
    if (user.createdAt) {
      const userDate = new Date(user.createdAt);
      const key = userDate.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
      if (monthlyUsers.hasOwnProperty(key)) {
        monthlyUsers[key]++;
      }
    }
  });

  return {
    labels: last6Months,
    datasets: [{
      label: 'Nuevos usuarios',
      data: last6Months.map(month => monthlyUsers[month]),
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
      tension: 0.3
    }]
  };
};

const getOrderStatusData = () => {
  if (props.orders.length === 0) {
    return {
      labels: ['Sin pedidos'],
      datasets: [{
        data: [1],
        backgroundColor: ['#e2e8f0'],
        borderWidth: 0
      }]
    };
  }

  // Contar pedidos por estado
  const statusCounts = {};
  const statusLabels = {
    'Pending': 'Pendiente',
    'Accepted': 'Aceptado',
    'Preparing': 'Preparando',
    'Ready': 'Listo',
    'ReadyForPickup': 'Listo para recoger',
    'OnTheWay': 'En camino',
    'Delivered': 'Entregado',
    'Completed': 'Completado',
    'Cancelled': 'Cancelado',
    'Canceled': 'Cancelado'
  };

  props.orders.forEach(order => {
    const status = order.status || 'Unknown';
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });

  const labels = Object.keys(statusCounts).map(status => statusLabels[status] || status);
  const data = Object.values(statusCounts);
  const colors = [
    '#fbbf24', '#3b82f6', '#8b5cf6', '#0ea5e9', '#10b981', '#ef4444', '#f97316'
  ];

  return {
    labels: labels,
    datasets: [{
      data: data,
      backgroundColor: colors.slice(0, data.length),
      borderWidth: 1
    }]
  };
};

const getRestaurantStatusData = () => {
  if (props.restaurants.length === 0) {
    return {
      labels: ['Sin restaurantes'],
      datasets: [{
        data: [1],
        backgroundColor: ['#e2e8f0'],
        borderWidth: 0
      }]
    };
  }

  const openCount = props.restaurants.filter(r => r.isOpen).length;
  const closedCount = props.restaurants.length - openCount;

  return {
    labels: ['Abiertos', 'Cerrados'],
    datasets: [{
      data: [openCount, closedCount],
      backgroundColor: ['#10b981', '#ef4444'],
      borderWidth: 1
    }]
  };
};

const getRevenueData = () => {
  if (props.orders.length === 0) {
    return {
      labels: ['Sin datos'],
      datasets: [{
        label: 'Ingresos',
        data: [0],
        borderColor: 'rgb(203, 213, 225)',
        backgroundColor: 'rgba(203, 213, 225, 0.5)',
        tension: 0.2,
        fill: true
      }]
    };
  }

  // Agrupar ingresos por día de los últimos 7 días
  const dailyRevenue = {};
  const last7Days = [];
  const now = new Date();

  // Generar últimos 7 días
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const key = date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
    last7Days.push(key);
    dailyRevenue[key] = 0;
  }

  // Sumar ingresos por día
  props.orders.forEach(order => {
    if (order.createdAt) {
      const orderDate = new Date(order.createdAt);
      const key = orderDate.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
      if (dailyRevenue.hasOwnProperty(key)) {
        const total = order.total || order.totalAmount || order.price || 0;
        dailyRevenue[key] += (typeof total === 'number' ? total : parseFloat(total) || 0);
      }
    }
  });

  return {
    labels: last7Days,
    datasets: [{
      label: 'Ingresos (€)',
      data: last7Days.map(day => dailyRevenue[day]),
      borderColor: 'rgb(76, 175, 80)',
      backgroundColor: 'rgba(76, 175, 80, 0.5)',
      tension: 0.2,
      fill: true
    }]
  };
};

// Opciones comunes para los gráficos
const getChartOptions = (title, type = 'default') => {
  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false
      },
    },
  };

  if (type === 'doughnut') {
    return {
      ...baseOptions,
      plugins: {
        ...baseOptions.plugins,
        legend: {
          position: 'bottom',
        }
      }
    };
  }

  if (type === 'currency') {
    return {
      ...baseOptions,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return '€' + value.toFixed(2);
            }
          }
        }
      }
    };
  }

  return {
    ...baseOptions,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };
};

// Inicializar todas las gráficas
const initCharts = async () => {
  await nextTick();

  // Destruir cualquier instancia previa
  destroyCharts();

  // Verificar que los elementos existen
  if (!usersChart.value || !ordersStatusChart.value ||
    !restaurantStatusChart.value || !revenueChart.value) {
    console.warn('Elementos de canvas no disponibles');
    return;
  }

  try {
    // Gráfica de usuarios nuevos
    userChartInstance = new Chart(usersChart.value, {
      type: 'line',
      data: getUsersData(),
      options: getChartOptions('Crecimiento de usuarios')
    });

    // Gráfica de pedidos por estado
    ordersStatusChartInstance = new Chart(ordersStatusChart.value, {
      type: 'doughnut',
      data: getOrderStatusData(),
      options: getChartOptions('Distribución de pedidos', 'doughnut')
    });

    // Gráfica de restaurantes por estado
    restaurantStatusChartInstance = new Chart(restaurantStatusChart.value, {
      type: 'pie',
      data: getRestaurantStatusData(),
      options: getChartOptions('Estado de restaurantes', 'doughnut')
    });

    // Gráfica de ingresos
    revenueChartInstance = new Chart(revenueChart.value, {
      type: 'line',
      data: getRevenueData(),
      options: getChartOptions('Evolución de ingresos', 'currency')
    });
  } catch (error) {
    console.error('❌ Error inicializando gráficas:', error);
  }
};

// Destruir las instancias de Chart.js para evitar fugas de memoria
const destroyCharts = () => {
  if (userChartInstance) {
    userChartInstance.destroy();
    userChartInstance = null;
  }
  if (ordersStatusChartInstance) {
    ordersStatusChartInstance.destroy();
    ordersStatusChartInstance = null;
  }
  if (restaurantStatusChartInstance) {
    restaurantStatusChartInstance.destroy();
    restaurantStatusChartInstance = null;
  }
  if (revenueChartInstance) {
    revenueChartInstance.destroy();
    revenueChartInstance = null;
  }
};

// Observar cambios en las propiedades para actualizar las gráficas
watch([
  () => props.totalUsers,
  () => props.orders,
  () => props.restaurants,
  () => props.users,
  () => props.businesses
], async () => {
  await initCharts();
}, { deep: true });

// Inicializar las gráficas al montar el componente
onMounted(async () => {
  await nextTick();
  await initCharts();
});

// Limpiar al desmontar
onBeforeUnmount(() => {
  destroyCharts();
});
</script>

<style scoped>
.dashboard-charts {
  margin-bottom: 2rem;
}
</style>
