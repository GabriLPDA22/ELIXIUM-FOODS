<!-- src/views/AdminPanel.vue -->
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
                <p class="text-2xl font-semibold text-gray-900">{{ stats.totalUsers }}</p>
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
                <p class="text-2xl font-semibold text-gray-900">{{ stats.activeOrders }}</p>
                <p class="ml-2 text-sm text-gray-600">{{ stats.completedOrders }} completados hoy</p>
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
                <p class="text-2xl font-semibold text-gray-900">{{ stats.totalRestaurants }}</p>
                <p class="ml-2 text-sm text-green-600">{{ stats.activeRestaurants }} activos</p>
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
                <p class="text-2xl font-semibold text-gray-900">€{{ stats.todayRevenue }}</p>
                <p class="ml-2 text-sm text-green-600">+{{ stats.revenueGrowth }}% vs ayer</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs principales -->
      <div class="bg-white rounded-xl shadow-md mb-8">
        <div class="border-b border-gray-200">
          <div class="flex">
            <button v-for="tab in mainTabs" :key="tab.id" @click="activeTab = tab.id" :class="[
              'px-6 py-4 font-medium text-sm transition-colors',
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
          <!-- Tab: Gestión de Usuarios -->
          <div v-if="activeTab === 'users'" class="space-y-6">
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-semibold text-gray-900">Gestión de Usuarios</h2>
              <button @click="addUser" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                <span class="mr-1">+</span> Nuevo Usuario
              </button>
            </div>

            <!-- Filtros y búsqueda -->
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="flex flex-wrap gap-4">
                <div class="flex-1 min-w-[300px]">
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input v-model="userSearch" type="text" placeholder="Buscar usuarios..."
                      class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                </div>
                <select v-model="userFilter"
                  class="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Todos</option>
                  <option value="Admin">Administradores</option>
                  <option value="Customer">Clientes</option>
                  <option value="Restaurant">Restaurantes</option>
                  <option value="DeliveryPerson">Repartidores</option>
                </select>
                <button @click="searchUsers"
                  class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                  Buscar
                </button>
              </div>
            </div>

            <!-- Tabla de usuarios -->
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registro
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.id }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div>
                          <div class="text-sm font-medium text-gray-900">
                            {{ user.firstName }} {{ user.lastName }}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.email }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="[
                        'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                        getRoleBadgeColor(user.role)
                      ]">
                        {{ user.role }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ formatDate(user.createdAt) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div class="flex gap-2">
                        <button @click="editUser(user)" class="text-indigo-600 hover:text-indigo-900">
                          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button @click="deleteUser(user.id)" class="text-red-600 hover:text-red-900">
                          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Paginación -->
            <div class="flex items-center justify-between">
              <div class="text-sm text-gray-700">
                Página <span class="font-medium">{{ currentPage }}</span> de <span class="font-medium">{{ totalPages
                  }}</span>
              </div>
              <div class="flex gap-2">
                <button @click="previousPage" :disabled="currentPage === 1"
                  class="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
                  ← Anterior
                </button>
                <button @click="nextPage" :disabled="currentPage >= totalPages"
                  class="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
                  Siguiente →
                </button>
              </div>
            </div>
          </div>

          <!-- Tab: Restaurantes -->
          <div v-if="activeTab === 'restaurants'" class="space-y-6">
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-semibold text-gray-900">Gestión de Restaurantes</h2>
              <button @click="addRestaurant" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                <span class="mr-1">+</span> Nuevo Restaurante
              </button>
            </div>

            <!-- Filtros y búsqueda para restaurantes -->
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="flex flex-wrap gap-4">
                <div class="flex-1 min-w-[300px]">
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input v-model="restaurantSearch" type="text" placeholder="Buscar restaurantes..."
                      class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                </div>
                <button @click="searchRestaurants"
                  class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                  Buscar
                </button>
              </div>
            </div>

            <!-- Tabla de restaurantes -->
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Calificación</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Propietario</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="restaurant in filteredRestaurants" :key="restaurant.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ restaurant.id }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div>
                          <div class="text-sm font-medium text-gray-900">
                            {{ restaurant.name }}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{{ restaurant.description }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ restaurant.averageRating }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="[
                        'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                        restaurant.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      ]">
                        {{ restaurant.isOpen ? 'Abierto' : 'Cerrado' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ restaurant.owner ? `${restaurant.owner.firstName} ${restaurant.owner.lastName}` : 'No asignado' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div class="flex gap-2">
                        <button @click="editRestaurant(restaurant)" class="text-indigo-600 hover:text-indigo-900">
                          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button @click="deleteRestaurant(restaurant.id)" class="text-red-600 hover:text-red-900">
                          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Tab: Pedidos -->
          <div v-if="activeTab === 'orders'" class="space-y-6">
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-semibold text-gray-900">Gestión de Pedidos</h2>
            </div>

            <!-- Filtros y búsqueda para pedidos -->
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="flex flex-wrap gap-4">
                <div class="flex-1 min-w-[300px]">
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input v-model="orderSearch" type="text" placeholder="Buscar pedidos por ID o cliente..."
                      class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                </div>
                <select v-model="orderStatusFilter"
                  class="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Todos los estados</option>
                  <option value="Pending">Pendiente</option>
                  <option value="Accepted">Aceptado</option>
                  <option value="Preparing">Preparando</option>
                  <option value="ReadyForPickup">Listo para recoger</option>
                  <option value="OnTheWay">En camino</option>
                  <option value="Delivered">Entregado</option>
                  <option value="Cancelled">Cancelado</option>
                </select>
                <button @click="searchOrders"
                  class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                  Buscar
                </button>
              </div>
            </div>

            <!-- Tabla de pedidos -->
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Restaurante</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="order in filteredOrders" :key="order.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ order.id }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Usuario desconocido' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ order.restaurant.name }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">€{{ order.total.toFixed(2) }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="[
                        'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                        getOrderStatusColor(order.status)
                      ]">
                        {{ getOrderStatusLabel(order.status) }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ formatDate(order.createdAt) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div class="flex gap-2">
                        <button @click="viewOrderDetails(order)" class="text-blue-600 hover:text-blue-900">
                          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button @click="updateOrderStatus(order)" class="text-indigo-600 hover:text-indigo-900">
                          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Usuario -->
    <div v-if="showUserModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl max-w-md w-full mx-4 overflow-hidden">
        <div class="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">{{ editingUser.id ? 'Editar' : 'Crear' }} Usuario</h3>
          <button @click="closeUserModal" class="text-gray-400 hover:text-gray-500">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveUser" class="p-6">
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nombre:</label>
              <input v-model="editingUser.firstName" type="text" required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Apellido:</label>
              <input v-model="editingUser.lastName" type="text" required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
            </div>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Email:</label>
            <input v-model="editingUser.email" type="email" required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña:</label>
            <input v-model="editingUser.password" type="password" :required="!editingUser.id"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
            <p class="text-sm text-gray-500 mt-1">{{ editingUser.id ? 'Dejar en blanco para mantener la contraseña actual' : 'Ingrese la contraseña para el nuevo usuario' }}</p>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono:</label>
            <input v-model="editingUser.phoneNumber" type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Rol:</label>
            <select v-model="editingUser.role" required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
              <option value="Admin">Administrador</option>
              <option value="Customer">Cliente</option>
              <option value="Restaurant">Restaurante</option>
              <option value="DeliveryPerson">Repartidor</option>
            </select>
          </div>

          <div class="flex justify-end gap-4">
            <button type="button" @click="closeUserModal"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              {{ editingUser.id ? 'Actualizar' : 'Crear' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de Restaurante -->
    <div v-if="showRestaurantModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl max-w-2xl w-full mx-4 overflow-hidden">
        <div class="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">{{ editingRestaurant.id ? 'Editar' : 'Crear' }} Restaurante</h3>
          <button @click="closeRestaurantModal" class="text-gray-400 hover:text-gray-500">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveRestaurant" class="p-6 max-h-[80vh] overflow-y-auto">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nombre:</label>
              <input v-model="editingRestaurant.name" type="text" required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Propietario:</label>
              <select v-model="editingRestaurant.userId" required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                <option v-for="owner in restaurantOwners" :key="owner.id" :value="owner.id">
                  {{ owner.firstName }} {{ owner.lastName }}
                </option>
              </select>
            </div>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Descripción:</label>
            <textarea v-model="editingRestaurant.description" rows="3" required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">URL del Logo:</label>
              <input v-model="editingRestaurant.logoUrl" type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">URL de Imagen de Portada:</label>
              <input v-model="editingRestaurant.coverImageUrl" type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tipo:</label>
              <select v-model="editingRestaurant.tipo" required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                <option value="1">Comida Rápida</option>
                <option value="2">Italiana</option>
                <option value="3">Asiática</option>
                <option value="4">Mexicana</option>
                <option value="5">Vegetariana</option>
                <option value="6">Postres</option>
                <option value="7">Mariscos</option>
                <option value="8">Bebidas</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tarifa de Envío:</label>
              <input v-model.number="editingRestaurant.deliveryFee" type="number" step="0.01" required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tiempo Estimado de Entrega (min):</label>
              <input v-model.number="editingRestaurant.estimatedDeliveryTime" type="number" required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Estado:</label>
              <div class="mt-2">
                <label class="inline-flex items-center">
                  <input type="checkbox" v-model="editingRestaurant.isOpen" class="rounded border-gray-300 text-blue-600">
                  <span class="ml-2">Restaurante Abierto</span>
                </label>
              </div>
            </div>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Dirección:</label>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs text-gray-500 mb-1">Calle:</label>
                <input v-model="editingRestaurant.address.street" type="text" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
              </div>
              <div>
                <label class="block text-xs text-gray-500 mb-1">Número:</label>
                <input v-model="editingRestaurant.address.number" type="text" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
              </div>
              <div>
                <label class="block text-xs text-gray-500 mb-1">Ciudad:</label>
                <input v-model="editingRestaurant.address.city" type="text" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
              </div>
              <div>
                <label class="block text-xs text-gray-500 mb-1">Estado/Provincia:</label>
                <input v-model="editingRestaurant.address.state" type="text" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
              </div>
              <div>
                <label class="block text-xs text-gray-500 mb-1">Código Postal:</label>
                <input v-model="editingRestaurant.address.zipCode" type="text" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
              </div>
              <div>
                <label class="block text-xs text-gray-500 mb-1">Teléfono:</label>
                <input v-model="editingRestaurant.address.phone" type="text" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-4">
            <button type="button" @click="closeRestaurantModal"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              {{ editingRestaurant.id ? 'Actualizar' : 'Crear' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de Detalles de Pedido -->
    <div v-if="showOrderModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl max-w-4xl w-full mx-4 overflow-hidden">
        <div class="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">Detalles del Pedido #{{ selectedOrder?.id }}</h3>
          <button @click="closeOrderModal" class="text-gray-400 hover:text-gray-500">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div v-if="selectedOrder" class="p-6 max-h-[80vh] overflow-y-auto">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="bg-gray-50 p-4 rounded-lg">
              <h4 class="font-medium text-gray-900 mb-2">Información del Cliente</h4>
              <p><span class="text-gray-600">Nombre:</span> {{ selectedOrder.user.firstName }} {{ selectedOrder.user.lastName }}</p>
              <p><span class="text-gray-600">Email:</span> {{ selectedOrder.user.email }}</p>
              <p><span class="text-gray-600">Teléfono:</span> {{ selectedOrder.user.phoneNumber }}</p>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
              <h4 class="font-medium text-gray-900 mb-2">Información del Restaurante</h4>
              <p><span class="text-gray-600">Nombre:</span> {{ selectedOrder.restaurant.name }}</p>
              <p><span class="text-gray-600">Teléfono:</span> {{ selectedOrder.restaurant.address?.phone }}</p>
            </div>
          </div>

          <div class="mb-6">
            <div class="bg-gray-50 p-4 rounded-lg">
              <h4 class="font-medium text-gray-900 mb-2">Dirección de Entrega</h4>
              <p>{{ selectedOrder.deliveryAddress.street }} {{ selectedOrder.deliveryAddress.number }}</p>
              <p>{{ selectedOrder.deliveryAddress.city }}, {{ selectedOrder.deliveryAddress.state }} {{ selectedOrder.deliveryAddress.zipCode }}</p>
              <p><span class="text-gray-600">Teléfono:</span> {{ selectedOrder.deliveryAddress.phone }}</p>
            </div>
          </div>

          <div class="mb-6">
            <h4 class="font-medium text-gray-900 mb-2">Productos</h4>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Producto</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cantidad</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precio</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subtotal</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="item in selectedOrder.orderItems" :key="item.id">
                    <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {{ item.product.name }}
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {{ item.quantity }}
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      €{{ item.unitPrice.toFixed(2) }}
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      €{{ item.subtotal.toFixed(2) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="bg-gray-50 p-4 rounded-lg">
              <h4 class="font-medium text-gray-900 mb-2">Resumen de Pago</h4>
              <div class="flex justify-between mb-1">
                <span class="text-gray-600">Subtotal:</span>
                <span>€{{ selectedOrder.subtotal.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between mb-1">
                <span class="text-gray-600">Envío:</span>
                <span>€{{ selectedOrder.deliveryFee.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between mb-1">
                <span class="text-gray-600">Impuestos:</span>
                <span>€{{ selectedOrder.tax.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between font-bold mt-2 pt-2 border-t">
                <span>Total:</span>
                <span>€{{ selectedOrder.total.toFixed(2) }}</span>
              </div>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
              <h4 class="font-medium text-gray-900 mb-2">Estado y Fechas</h4>
              <p><span class="text-gray-600">Estado:</span> <span
                  :class="getOrderStatusTextColor(selectedOrder.status)">{{ getOrderStatusLabel(selectedOrder.status) }}</span>
              </p>
              <p><span class="text-gray-600">Creado:</span> {{ formatDateTime(selectedOrder.createdAt) }}</p>
              <p><span class="text-gray-600">Última actualización:</span> {{ formatDateTime(selectedOrder.updatedAt) }}</p>
              <p><span class="text-gray-600">Entrega estimada:</span> {{ formatDateTime(selectedOrder.estimatedDeliveryTime) }}
              </p>
            </div>
          </div>

          <div class="border-t pt-4">
            <h4 class="font-medium text-gray-900 mb-2">Actualizar Estado</h4>
            <div class="flex gap-2">
              <select v-model="newOrderStatus"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                <option value="Pending">Pendiente</option>
                <option value="Accepted">Aceptado</option>
                <option value="Preparing">Preparando</option>
                <option value="ReadyForPickup">Listo para recoger</option>
                <option value="OnTheWay">En camino</option>
                <option value="Delivered">Entregado</option>
                <option value="Cancelled">Cancelado</option>
              </select>
              <button @click="saveOrderStatus"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                Actualizar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '@/services/api';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

// Estados
const refreshing = ref(false);
const alerts = ref([]);

// Estadísticas
const stats = reactive({
  totalUsers: 0,
  activeUsers: 0,
  activeOrders: 0,
  completedOrders: 0,
  totalRestaurants: 0,
  activeRestaurants: 0,
  todayRevenue: 0,
  userGrowth: 0,
  revenueGrowth: 0
});

// Tabs principales
const activeTab = ref('users');
const mainTabs = [
  { id: 'users', name: 'Usuarios', icon: '👥' },
  { id: 'restaurants', name: 'Restaurantes', icon: '🍽️' },
  { id: 'orders', name: 'Pedidos', icon: '📦' }
];

// Usuarios
const users = ref([]);
const userSearch = ref('');
const userFilter = ref('');
const currentPage = ref(1);
const usersPerPage = 10;
const showUserModal = ref(false);
const editingUser = reactive({
  id: null,
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  phoneNumber: '',
  role: 'Customer'
});

// Restaurantes
const restaurants = ref([]);
const restaurantSearch = ref('');
const showRestaurantModal = ref(false);
const restaurantOwners = ref([]);
const editingRestaurant = reactive({
  id: null,
  name: '',
  description: '',
  logoUrl: '',
  coverImageUrl: '',
  averageRating: 0,
  isOpen: true,
  deliveryFee: 2.99,
  estimatedDeliveryTime: 30,
  tipo: 1,
  userId: null,
  address: {
    name: '',
    street: '',
    number: '',
    interior: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    latitude: null,
    longitude: null,
    isDefault: true
  }
});

// Pedidos
const orders = ref([]);
const orderSearch = ref('');
const orderStatusFilter = ref('');
const showOrderModal = ref(false);
const selectedOrder = ref(null);
const newOrderStatus = ref('');

// Computed
const filteredUsers = computed(() => {
  let filtered = [...users.value];

  if (userSearch.value) {
    filtered = filtered.filter(user =>
      user.firstName.toLowerCase().includes(userSearch.value.toLowerCase()) ||
      user.lastName.toLowerCase().includes(userSearch.value.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearch.value.toLowerCase())
    );
  }

  if (userFilter.value) {
    filtered = filtered.filter(user => user.role === userFilter.value);
  }

  const start = (currentPage.value - 1) * usersPerPage;
  const end = start + usersPerPage;
  return filtered.slice(start, end);
});

const totalPages = computed(() => {
  let filtered = [...users.value];

  if (userSearch.value) {
    filtered = filtered.filter(user =>
      user.firstName.toLowerCase().includes(userSearch.value.toLowerCase()) ||
      user.lastName.toLowerCase().includes(userSearch.value.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearch.value.toLowerCase())
    );
  }

  if (userFilter.value) {
    filtered = filtered.filter(user => user.role === userFilter.value);
  }

  return Math.ceil(filtered.length / usersPerPage);
});

const filteredRestaurants = computed(() => {
  if (!restaurantSearch.value) return restaurants.value;
  
  return restaurants.value.filter(restaurant =>
    restaurant.name.toLowerCase().includes(restaurantSearch.value.toLowerCase()) ||
    restaurant.description.toLowerCase().includes(restaurantSearch.value.toLowerCase())
  );
});

const filteredOrders = computed(() => {
  let filtered = [...orders.value];
  
  if (orderSearch.value) {
    filtered = filtered.filter(order =>
      order.id.toString().includes(orderSearch.value) ||
      (order.user && `${order.user.firstName} ${order.user.lastName}`.toLowerCase().includes(orderSearch.value.toLowerCase())) ||
      (order.restaurant && order.restaurant.name.toLowerCase().includes(orderSearch.value.toLowerCase()))
    );
  }
  
  if (orderStatusFilter.value) {
    filtered = filtered.filter(order => order.status === orderStatusFilter.value);
  }
  
  return filtered;
});

// Lifecycle hooks
onMounted(async () => {
  await checkAuthorization();
  await refreshAllData();
});

// Métodos
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
  } catch (error) {
    console.error('Error verificando autorización:', error);
    router.push('/unauthorized');
  }
};

const refreshAllData = async () => {
  refreshing.value = true;
  try {
    await Promise.all([
      fetchStats(),
      fetchUsers(),
      fetchRestaurants(),
      fetchOrders(),
      fetchRestaurantOwners()
    ]);
    addAlert('Datos actualizados correctamente', 'success');
  } catch (error) {
    console.error('Error refrescando datos:', error);
    addAlert('Error al actualizar algunos datos', 'error');
  } finally {
    refreshing.value = false;
  }
};

const fetchStats = async () => {
  try {
    // Conteo de usuarios
    const userResponse = await api.get('/api/Users');
    stats.totalUsers = userResponse.data.length;
    
    // Conteo de restaurantes
    const restaurantResponse = await api.get('/api/Restaurants');
    const allRestaurants = restaurantResponse.data;
    stats.totalRestaurants = allRestaurants.length;
    stats.activeRestaurants = allRestaurants.filter(r => r.isOpen).length;
    
    // Conteo de pedidos
    try {
      const ordersResponse = await api.get('/api/Orders');
      const allOrders = ordersResponse.data;
      
      // Pedidos activos (no entregados ni cancelados)
      stats.activeOrders = allOrders.filter(o => 
        o.status !== 'Delivered' && o.status !== 'Cancelled'
      ).length;
      
      // Pedidos completados hoy
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      stats.completedOrders = allOrders.filter(o => {
        const orderDate = new Date(o.createdAt);
        return o.status === 'Delivered' && orderDate >= today;
      }).length;
      
      // Ingresos del día
      stats.todayRevenue = allOrders
        .filter(o => {
          const orderDate = new Date(o.createdAt);
          return orderDate >= today;
        })
        .reduce((sum, order) => sum + order.total, 0)
        .toFixed(2);
      
      // Calcular crecimiento (simulado)
      stats.userGrowth = 5; // Valor simulado
      stats.revenueGrowth = 8; // Valor simulado
    } catch (error) {
      console.log('Error al obtener pedidos:', error);
    }
  } catch (error) {
    console.error('Error fetchStats:', error);
    addAlert('Error al obtener estadísticas', 'error');
  }
};

const fetchUsers = async () => {
  try {
    const response = await api.get('/api/Users');
    users.value = response.data.map(user => ({
      ...user,
      isActive: true // Asumimos que todos los usuarios están activos
    }));
  } catch (error) {
    console.error('Error fetchUsers:', error);
    addAlert('Error al obtener usuarios', 'error');
  }
};

const fetchRestaurants = async () => {
  try {
    const response = await api.get('/api/Restaurants');
    restaurants.value = response.data;
  } catch (error) {
    console.error('Error fetchRestaurants:', error);
    addAlert('Error al obtener restaurantes', 'error');
  }
};

const fetchOrders = async () => {
  try {
    const response = await api.get('/api/Orders');
    orders.value = response.data;
  } catch (error) {
    console.error('Error fetchOrders:', error);
    addAlert('Error al obtener pedidos', 'error');
  }
};

const fetchRestaurantOwners = async () => {
  try {
    // Obtener usuarios con rol de Restaurant
    const response = await api.get('/api/Users/byRole/Restaurant');
    restaurantOwners.value = response.data;
  } catch (error) {
    console.error('Error fetchRestaurantOwners:', error);
    addAlert('Error al obtener propietarios de restaurantes', 'error');
  }
};

// User Management Methods
const addUser = () => {
  Object.assign(editingUser, {
    id: null,
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    role: 'Customer'
  });
  showUserModal.value = true;
};

const editUser = (user) => {
  // Crear una copia para no modificar el original directamente
  const userCopy = { ...user };
  // No incluir la contraseña al editar
  userCopy.password = '';
  Object.assign(editingUser, userCopy);
  showUserModal.value = true;
};

const saveUser = async () => {
  try {
    // Preparar el objeto de datos según si es crear o actualizar
    const userData = {
      firstName: editingUser.firstName,
      lastName: editingUser.lastName,
      email: editingUser.email,
      phoneNumber: editingUser.phoneNumber,
      role: editingUser.role
    };

    if (!editingUser.id) {
      // Para creación, necesitamos incluir la contraseña
      userData.password = editingUser.password;
    }

    if (editingUser.id) {
      // Actualizar usuario (usando el endpoint de update)
      await api.put(`/api/Users/${editingUser.id}`, userData);
      
      // Si se proporcionó una nueva contraseña, actualizarla
      if (editingUser.password) {
        await api.put(`/api/Users/${editingUser.id}/password`, {
          currentPassword: "defaultAdminPassword", // Esto debería ser reemplazado por una implementación real
          newPassword: editingUser.password
        });
      }
      
      addAlert('Usuario actualizado correctamente', 'success');
    } else {
      // Crear usuario (usando el endpoint de registro)
      await api.post('/api/Users', userData);
      addAlert('Usuario creado correctamente', 'success');
    }

    showUserModal.value = false;
    await fetchUsers();
  } catch (error) {
    console.error('Error al guardar usuario:', error);
    addAlert(`Error al guardar usuario: ${error.response?.data?.message || error.message}`, 'error');
  }
};

const deleteUser = async (userId) => {
  if (!confirm('¿Está seguro de eliminar este usuario? Esta acción no se puede deshacer.')) {
    return;
  }
  
  try {
    await api.delete(`/api/Users/${userId}`);
    addAlert('Usuario eliminado correctamente', 'success');
    await fetchUsers();
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    addAlert('Error al eliminar usuario', 'error');
  }
};

// Restaurant Management Methods
const addRestaurant = () => {
  Object.assign(editingRestaurant, {
    id: null,
    name: '',
    description: '',
    logoUrl: '',
    coverImageUrl: '',
    averageRating: 0,
    isOpen: true,
    deliveryFee: 2.99,
    estimatedDeliveryTime: 30,
    tipo: 1,
    userId: restaurantOwners.value.length > 0 ? restaurantOwners.value[0].id : null,
    address: {
      name: '',
      street: '',
      number: '',
      interior: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: '',
      phone: '',
      latitude: null,
      longitude: null,
      isDefault: true
    }
  });
  showRestaurantModal.value = true;
};

const editRestaurant = (restaurant) => {
  // Crear copia profunda para evitar referencia directa
  const restaurantCopy = JSON.parse(JSON.stringify(restaurant));
  Object.assign(editingRestaurant, restaurantCopy);
  showRestaurantModal.value = true;
};

const saveRestaurant = async () => {
  try {
    const restaurantData = {
      name: editingRestaurant.name,
      description: editingRestaurant.description,
      logoUrl: editingRestaurant.logoUrl,
      coverImageUrl: editingRestaurant.coverImageUrl,
      isOpen: editingRestaurant.isOpen,
      deliveryFee: parseFloat(editingRestaurant.deliveryFee),
      estimatedDeliveryTime: parseInt(editingRestaurant.estimatedDeliveryTime),
      tipo: parseInt(editingRestaurant.tipo),
      userId: editingRestaurant.userId
    };

    const addressData = {
      name: editingRestaurant.name,
      street: editingRestaurant.address.street,
      number: editingRestaurant.address.number,
      interior: editingRestaurant.address.interior || '',
      neighborhood: editingRestaurant.address.neighborhood || '',
      city: editingRestaurant.address.city,
      state: editingRestaurant.address.state,
      zipCode: editingRestaurant.address.zipCode,
      phone: editingRestaurant.address.phone,
      isDefault: true
    };

    if (editingRestaurant.id) {
      // Actualizar restaurante existente
      await api.put(`/api/Restaurants/${editingRestaurant.id}`, {
        ...restaurantData,
        address: addressData
      });
      addAlert('Restaurante actualizado correctamente', 'success');
    } else {
      // Crear nuevo restaurante
      const response = await api.post('/api/Restaurants', {
        ...restaurantData,
        address: addressData
      });
      addAlert('Restaurante creado correctamente', 'success');
    }

    showRestaurantModal.value = false;
    await fetchRestaurants();
  } catch (error) {
    console.error('Error al guardar restaurante:', error);
    addAlert(`Error al guardar restaurante: ${error.response?.data?.message || error.message}`, 'error');
  }
};

const deleteRestaurant = async (restaurantId) => {
  if (!confirm('¿Está seguro de eliminar este restaurante? Esta acción no se puede deshacer.')) {
    return;
  }
  
  try {
    await api.delete(`/api/Restaurants/${restaurantId}`);
    addAlert('Restaurante eliminado correctamente', 'success');
    await fetchRestaurants();
  } catch (error) {
    console.error('Error al eliminar restaurante:', error);
    addAlert('Error al eliminar restaurante', 'error');
  }
};

// Order Management Methods
const viewOrderDetails = async (order) => {
  try {
    // Obtener detalles completos del pedido
    const response = await api.get(`/api/Orders/${order.id}`);
    selectedOrder.value = response.data;
    newOrderStatus.value = response.data.status;
    showOrderModal.value = true;
  } catch (error) {
    console.error('Error al obtener detalles del pedido:', error);
    addAlert('Error al obtener detalles del pedido', 'error');
  }
};

const updateOrderStatus = (order) => {
  selectedOrder.value = order;
  newOrderStatus.value = order.status;
  showOrderModal.value = true;
};

const saveOrderStatus = async () => {
  try {
    await api.put(`/api/Orders/${selectedOrder.value.id}/status`, {
      status: newOrderStatus.value
    });
    
    // Actualizar el estado en la lista de pedidos
    const orderIndex = orders.value.findIndex(o => o.id === selectedOrder.value.id);
    if (orderIndex !== -1) {
      orders.value[orderIndex].status = newOrderStatus.value;
    }
    
    // Actualizar el estado en el pedido seleccionado
    selectedOrder.value.status = newOrderStatus.value;
    
    addAlert('Estado del pedido actualizado correctamente', 'success');
  } catch (error) {
    console.error('Error al actualizar estado del pedido:', error);
    addAlert('Error al actualizar estado del pedido', 'error');
  }
};

const closeUserModal = () => {
  showUserModal.value = false;
};

const closeRestaurantModal = () => {
  showRestaurantModal.value = false;
};

const closeOrderModal = () => {
  showOrderModal.value = false;
  selectedOrder.value = null;
};

// Search and Pagination
const searchUsers = () => {
  currentPage.value = 1;
};

const searchRestaurants = () => {
  // La búsqueda se realiza mediante computed
};

const searchOrders = () => {
  // La búsqueda se realiza mediante computed
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

// Utility Methods
const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('es-ES');
};

const formatDateTime = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleString('es-ES');
};

const getRoleBadgeColor = (role) => {
  const colors = {
    'Admin': 'bg-blue-100 text-blue-800',
    'Customer': 'bg-green-100 text-green-800',
    'Restaurant': 'bg-purple-100 text-purple-800',
    'DeliveryPerson': 'bg-yellow-100 text-yellow-800'
  };
  return colors[role] || 'bg-gray-100 text-gray-800';
};

const getOrderStatusColor = (status) => {
  const colors = {
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Accepted': 'bg-blue-100 text-blue-800',
    'Preparing': 'bg-purple-100 text-purple-800',
    'ReadyForPickup': 'bg-indigo-100 text-indigo-800',
    'OnTheWay': 'bg-orange-100 text-orange-800',
    'Delivered': 'bg-green-100 text-green-800',
    'Cancelled': 'bg-red-100 text-red-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

const getOrderStatusTextColor = (status) => {
  const colors = {
    'Pending': 'text-yellow-600',
    'Accepted': 'text-blue-600',
    'Preparing': 'text-purple-600',
    'ReadyForPickup': 'text-indigo-600',
    'OnTheWay': 'text-orange-600',
    'Delivered': 'text-green-600',
    'Cancelled': 'text-red-600'
  };
  return colors[status] || 'text-gray-600';
};

const getOrderStatusLabel = (status) => {
  const labels = {
    'Pending': 'Pendiente',
    'Accepted': 'Aceptado',
    'Preparing': 'Preparando',
    'ReadyForPickup': 'Listo para recoger',
    'OnTheWay': 'En camino',
    'Delivered': 'Entregado',
    'Cancelled': 'Cancelado'
  };
  return labels[status] || status;
};

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

const exportUserData = async () => {
  try {
    // Obtener todos los usuarios
    const response = await api.get('/api/Users');
    const userData = response.data;
    
    // Crear CSV
    let csvContent = 'ID,Nombre,Apellido,Email,Teléfono,Rol,Fecha de Registro\n';
    
    userData.forEach(user => {
      const row = [
        user.id,
        user.firstName,
        user.lastName,
        user.email,
        user.phoneNumber,
        user.role,
        formatDate(user.createdAt)
      ];
      csvContent += row.join(',') + '\n';
    });
    
    // Crear y descargar el archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `usuarios_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    addAlert('Datos exportados correctamente', 'success');
  } catch (error) {
    console.error('Error al exportar datos:', error);
    addAlert('Error al exportar datos', 'error');
  }
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