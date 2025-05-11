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

      <!-- Gráfica de ventas por día de la semana -->
      <div class="bg-white rounded-xl shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Ventas por día de la semana</h3>
        <div class="h-64">
          <canvas ref="salesChart"></canvas>
        </div>
      </div>

      <!-- Gráfica de pedidos por estado -->
      <div class="bg-white rounded-xl shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Pedidos por estado</h3>
        <div class="h-64">
          <canvas ref="ordersStatusChart"></canvas>
        </div>
      </div>

      <!-- Gráfica de restaurantes por categoría -->
      <div class="bg-white rounded-xl shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Restaurantes por categoría</h3>
        <div class="h-64">
          <canvas ref="restaurantCategoryChart"></canvas>
        </div>
      </div>
    </div>

    <!-- Análisis de ingresos mensuales -->
    <div class="bg-white rounded-xl shadow-md p-6 mb-8">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Ingresos mensuales</h3>
      <div class="h-64">
        <canvas ref="revenueChart"></canvas>
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
            <span class="text-gray-600">Restaurantes:</span>
            <span class="font-semibold text-blue-600">{{ restaurantUserCount }}</span>
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
            <span class="text-gray-600">Tiempo medio de entrega:</span>
            <span class="font-semibold text-purple-600">{{ avgDeliveryTime }} min</span>
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
          <div class="text-xs text-green-500 mt-1">+{{ revenueIncrease }}% vs mes anterior</div>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg">
          <div class="text-sm text-gray-600 mb-1">Ticket medio</div>
          <div class="text-2xl font-semibold text-indigo-600">€{{ avgOrderValue.toFixed(2) }}</div>
          <div class="text-xs text-green-500 mt-1">+{{ avgOrderIncrease }}% vs mes anterior</div>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg">
          <div class="text-sm text-gray-600 mb-1">Ventas por restaurante</div>
          <div class="text-2xl font-semibold text-indigo-600">{{ ordersPerRestaurant.toFixed(1) }}</div>
          <div class="text-xs text-green-500 mt-1">+{{ restaurantOrderIncrease }}% vs mes anterior</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import Chart from 'chart.js/auto';

// Referencias para los canvas de las gráficas
const usersChart = ref(null);
const salesChart = ref(null);
const ordersStatusChart = ref(null);
const restaurantCategoryChart = ref(null);
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
  }
});

// Referencias a las instancias de Chart.js
let userChartInstance = null;
let salesChartInstance = null;
let ordersStatusChartInstance = null;
let restaurantCategoryChartInstance = null;
let revenueChartInstance = null;

// Calcular estadísticas basadas en los datos recibidos
const customerCount = computed(() => {
  // Suponiendo que users es un array de objetos con propiedad role
  return 156; // Valor de ejemplo, en un caso real se calcularía dinámicamente
});

const restaurantUserCount = computed(() => {
  return props.restaurants.length || 42; // Usar valor real o ejemplo
});

const deliveryPersonCount = computed(() => {
  return 24; // Valor de ejemplo
});

const completedOrdersCount = computed(() => {
  return props.orders.filter(order => order.status === 'Delivered').length || 675;
});

const cancelledOrdersCount = computed(() => {
  return props.orders.filter(order => order.status === 'Cancelled').length || 55;
});

const avgDeliveryTime = computed(() => {
  // En un caso real, calcularías esto basado en los tiempos de entrega
  return 28;
});

const totalRevenue = computed(() => {
  if (props.orders.length) {
    return props.orders.reduce((sum, order) => sum + order.total, 0);
  }
  return 82450.75; // Valor de ejemplo
});

const avgOrderValue = computed(() => {
  if (props.orders.length) {
    return totalRevenue.value / props.orders.length;
  }
  return 24.35; // Valor de ejemplo
});

const ordersPerRestaurant = computed(() => {
  if (props.restaurants.length) {
    return props.orders.length / props.restaurants.length;
  }
  return 14.8; // Valor de ejemplo
});

// Valores de ejemplo para incrementos
const revenueIncrease = 8.2;
const avgOrderIncrease = 3.5;
const restaurantOrderIncrease = 6.7;

// Datos para las gráficas
const getNewUsersData = () => {
  return {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [{
      label: 'Nuevos usuarios',
      data: [25, 32, 41, 37, 45, 52],
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
      tension: 0.3
    }]
  };
};

const getSalesByDayData = () => {
  return {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [{
      label: 'Ventas diarias (€)',
      data: [1450, 1782, 1695, 2105, 2540, 3250, 2870],
      backgroundColor: 'rgba(103, 58, 183, 0.5)',
      borderColor: 'rgb(103, 58, 183)',
      borderWidth: 1
    }]
  };
};

const getOrderStatusData = () => {
  return {
    labels: ['Pendiente', 'Aceptado', 'Preparando', 'Listo', 'En camino', 'Entregado', 'Cancelado'],
    datasets: [{
      label: 'Pedidos por estado',
      data: [15, 28, 22, 12, 18, 675, 55],
      backgroundColor: [
        'rgba(158, 158, 158, 0.7)',
        'rgba(33, 150, 243, 0.7)',
        'rgba(76, 175, 80, 0.7)',
        'rgba(156, 39, 176, 0.7)',
        'rgba(255, 193, 7, 0.7)',
        'rgba(76, 175, 80, 0.7)',
        'rgba(244, 67, 54, 0.7)'
      ],
      borderColor: [
        'rgb(158, 158, 158)',
        'rgb(33, 150, 243)',
        'rgb(76, 175, 80)',
        'rgb(156, 39, 176)',
        'rgb(255, 193, 7)',
        'rgb(76, 175, 80)',
        'rgb(244, 67, 54)'
      ],
      borderWidth: 1
    }]
  };
};

const getRestaurantCategoryData = () => {
  return {
    labels: ['Hamburguesas', 'Pizza', 'Mexicana', 'China', 'Italiana', 'Saludable'],
    datasets: [{
      label: 'Distribución por categoría',
      data: [12, 9, 8, 7, 11, 9],
      backgroundColor: [
        'rgba(244, 67, 54, 0.7)',
        'rgba(255, 193, 7, 0.7)',
        'rgba(76, 175, 80, 0.7)',
        'rgba(33, 150, 243, 0.7)',
        'rgba(156, 39, 176, 0.7)',
        'rgba(0, 188, 212, 0.7)'
      ],
      borderColor: [
        'rgb(244, 67, 54)',
        'rgb(255, 193, 7)',
        'rgb(76, 175, 80)',
        'rgb(33, 150, 243)',
        'rgb(156, 39, 176)',
        'rgb(0, 188, 212)'
      ],
      borderWidth: 1
    }]
  };
};

const getMonthlyRevenueData = () => {
  return {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [{
      label: 'Ingresos mensuales (€)',
      data: [12500, 13800, 14500, 15200, 16950, 19500],
      borderColor: 'rgb(76, 175, 80)',
      backgroundColor: 'rgba(76, 175, 80, 0.5)',
      tension: 0.2,
      fill: true
    }]
  };
};

// Opciones comunes para los gráficos
const getChartOptions = (title) => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16
        }
      },
    },
  };
};

// Inicializar todas las gráficas
const initCharts = () => {
  // Destruir cualquier instancia previa
  destroyCharts();

  // Gráfica de usuarios nuevos
  userChartInstance = new Chart(usersChart.value, {
    type: 'line',
    data: getNewUsersData(),
    options: getChartOptions('Crecimiento de usuarios')
  });

  // Gráfica de ventas por día
  salesChartInstance = new Chart(salesChart.value, {
    type: 'bar',
    data: getSalesByDayData(),
    options: getChartOptions('Ventas por día de la semana')
  });

  // Gráfica de pedidos por estado
  ordersStatusChartInstance = new Chart(ordersStatusChart.value, {
    type: 'doughnut',
    data: getOrderStatusData(),
    options: getChartOptions('Distribución de pedidos')
  });

  // Gráfica de restaurantes por categoría
  restaurantCategoryChartInstance = new Chart(restaurantCategoryChart.value, {
    type: 'pie',
    data: getRestaurantCategoryData(),
    options: getChartOptions('Distribución por categoría')
  });

  // Gráfica de ingresos mensuales
  revenueChartInstance = new Chart(revenueChart.value, {
    type: 'line',
    data: getMonthlyRevenueData(),
    options: getChartOptions('Evolución de ingresos')
  });
};

// Destruir las instancias de Chart.js para evitar fugas de memoria
const destroyCharts = () => {
  if (userChartInstance) userChartInstance.destroy();
  if (salesChartInstance) salesChartInstance.destroy();
  if (ordersStatusChartInstance) ordersStatusChartInstance.destroy();
  if (restaurantCategoryChartInstance) restaurantCategoryChartInstance.destroy();
  if (revenueChartInstance) revenueChartInstance.destroy();
};

// Observar cambios en las propiedades para actualizar las gráficas
watch([() => props.totalUsers, () => props.orders, () => props.restaurants], () => {
  // En una implementación real, actualizarías los datos de las gráficas
  // basándote en los cambios en las propiedades
  initCharts();
});

// Inicializar las gráficas al montar el componente
onMounted(() => {
  // Esperar a que Vue renderice los elementos
  setTimeout(initCharts, 100);
});

// Limpiar al desmontar
const onBeforeUnmount = () => {
  destroyCharts();
};
</script>

<style scoped>
.dashboard-charts {
  margin-bottom: 2rem;
}
</style>
