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
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registro
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">JWT</th>
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
                            <span v-if="user.isVerified" class="ml-1 text-green-600">✓</span>
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
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="[
                        'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                        user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      ]">
                        {{ user.isActive ? 'Activo' : 'Inactivo' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ formatDate(user.createdAt) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <button @click="viewUserJWT(user)" class="text-blue-600 hover:text-blue-900 p-1">
                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div class="flex gap-2">
                        <button @click="editUser(user)" class="text-indigo-600 hover:text-indigo-900">
                          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button @click="toggleUserStatus(user)"
                          :class="user.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'">
                          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
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
                Página <span class="font-medium">{{ currentPage }}</span> de <span class="font-medium">{{ totalPages }}</span>
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

          <!-- Tab: Gestión de Restaurantes -->
          <div v-if="activeTab === 'restaurants'" class="space-y-6">
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-semibold text-gray-900">Gestión de Restaurantes</h2>
              <button @click="addRestaurant" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                <span class="mr-1">+</span> Nuevo Restaurante
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
                    <input v-model="restaurantSearch" type="text" placeholder="Buscar restaurantes..."
                      class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                </div>
                <select v-model="restaurantFilter"
                  class="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Todos</option>
                  <option value="1">Hamburguesas</option>
                  <option value="2">Pizza</option>
                  <option value="3">Comida Rápida</option>
                  <option value="4">Mexicana</option>
                  <option value="5">China</option>
                  <option value="6">Italiana</option>
                  <option value="7">Postres</option>
                  <option value="8">Saludable</option>
                </select>
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
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Propietario</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valoración</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registro</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="restaurant in filteredRestaurants" :key="restaurant.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ restaurant.id }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="h-10 w-10 flex-shrink-0">
                          <img v-if="restaurant.logoUrl" :src="restaurant.logoUrl" class="h-10 w-10 rounded-full" alt="Logo" />
                          <div v-else class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                            🍽️
                          </div>
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">{{ restaurant.name }}</div>
                          <div class="text-sm text-gray-500 truncate max-w-[200px]">{{ restaurant.description }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ restaurant.owner?.firstName }} {{ restaurant.owner?.lastName }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                        :class="getRestaurantTypeBadgeColor(restaurant.tipo)">
                        {{ getRestaurantTypeName(restaurant.tipo) }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span
                        :class="['px-2 inline-flex text-xs leading-5 font-semibold rounded-full', restaurant.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800']">
                        {{ restaurant.isOpen ? 'Abierto' : 'Cerrado' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm">
                      <div class="flex items-center">
                        <span class="text-yellow-400 mr-1">★</span>
                        <span>{{ restaurant.averageRating.toFixed(1) }}</span>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ formatDate(restaurant.createdAt) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div class="flex gap-2">
                        <button @click="viewRestaurant(restaurant)" class="text-blue-600 hover:text-blue-900">
                          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button @click="editRestaurant(restaurant)" class="text-indigo-600 hover:text-indigo-900">
                          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button @click="toggleRestaurantStatus(restaurant)"
                          :class="restaurant.isOpen ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'">
                          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
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
                Página <span class="font-medium">{{ restaurantPage }}</span> de <span class="font-medium">{{ totalRestaurantPages }}</span>
              </div>
              <div class="flex gap-2">
                <button @click="previousRestaurantPage" :disabled="restaurantPage === 1"
                  class="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
                  ← Anterior
                </button>
                <button @click="nextRestaurantPage" :disabled="restaurantPage >= totalRestaurantPages"
                  class="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
                  Siguiente →
                </button>
              </div>
            </div>
          </div>

          <!-- Tab: Gestión de Pedidos -->
          <div v-if="activeTab === 'orders'" class="space-y-6">
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-semibold text-gray-900">Gestión de Pedidos</h2>
              <div class="flex gap-2">
                <button @click="refreshOrders" :disabled="refreshing"
                  class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
                  <span v-if="!refreshing">Actualizar</span>
                  <span v-else>Actualizando...</span>
                </button>
              </div>
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
                    <input v-model="orderSearch" type="text" placeholder="Buscar pedidos..."
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
                <input type="date" v-model="orderDateFilter"
                  class="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
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
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Repartidor</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="order in filteredOrders" :key="order.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ order.id }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">{{ order.user.firstName }} {{ order.user.lastName }}</div>
                      <div class="text-sm text-gray-500">{{ order.user.email }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">{{ order.restaurant.name }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      €{{ order.total.toFixed(2) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                        :class="getOrderStatusBadgeColor(order.status)">
                        {{ getOrderStatusText(order.status) }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div v-if="order.deliveryPerson">
                        <div class="text-sm font-medium text-gray-900">
                          {{ order.deliveryPerson.firstName }} {{ order.deliveryPerson.lastName }}
                        </div>
                      </div>
                      <div v-else class="text-sm text-gray-500">No asignado</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ formatDateTime(order.createdAt) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div class="flex gap-2">
                        <button @click="viewOrder(order)" class="text-blue-600 hover:text-blue-900">
                          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button v-if="canUpdateOrderStatus(order)" @click="updateOrderStatus(order)" class="text-indigo-600 hover:text-indigo-900">
                          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </button>
                        <button v-if="order.status !== 'Cancelled' && order.status !== 'Delivered'"
                          @click="cancelOrder(order)" class="text-red-600 hover:text-red-900">
                          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M6 18L18 6M6 6l12 12" />
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
                Página <span class="font-medium">{{ orderPage }}</span> de <span class="font-medium">{{ totalOrderPages }}</span>
              </div>
              <div class="flex gap-2">
                <button @click="previousOrderPage" :disabled="orderPage === 1"
                  class="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
                  ← Anterior
                </button>
                <button @click="nextOrderPage" :disabled="orderPage >= totalOrderPages"
                  class="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
                  Siguiente →
                </button>
              </div>
            </div>
          </div>

          <!-- Tab: JWT Debug -->
          <div v-if="activeTab === 'jwt'" class="space-y-6">
            <h2 class="text-xl font-semibold text-gray-900">Sistema de Autenticación JWT</h2>

            <!-- Sub-tabs -->
            <div class="border-b border-gray-200">
              <div class="flex">
                <button v-for="tab in jwtTabs" :key="tab.id" @click="activeJwtTab = tab.id" :class="[
                  'px-4 py-2 font-medium text-sm transition-colors',
                  activeJwtTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                ]">
                  {{ tab.name }}
                </button>
              </div>
            </div>

            <!-- Estado Global -->
            <div v-if="activeJwtTab === 'global'" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="bg-gray-50 p-4 rounded-lg">
                  <div class="text-sm text-gray-600">Token almacenado</div>
                  <div :class="['font-medium', jwtState.token ? 'text-green-600' : 'text-red-600']">
                    {{ jwtState.token ? 'Sí' : 'No' }}
                  </div>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <div class="text-sm text-gray-600">RefreshToken</div>
                  <div :class="['font-medium', jwtState.refreshToken ? 'text-green-600' : 'text-red-600']">
                    {{ jwtState.refreshToken ? 'Sí' : 'No' }}
                  </div>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <div class="text-sm text-gray-600">Estado</div>
                  <div :class="['font-medium', getTokenStatusClass()]">
                    {{ getTokenStatus() }}
                  </div>
                </div>
              </div>

              <!-- Token actual -->
              <div v-if="jwtState.tokenInfo" class="space-y-4">
                <h3 class="font-medium text-gray-900">Token Actual</h3>
                <div class="bg-gray-900 text-green-400 p-4 rounded-lg relative">
                  <pre
                    class="text-sm overflow-x-auto whitespace-pre-wrap break-all">{{ formatToken(jwtState.tokenInfo.raw) }}</pre>
                  <button @click="copyToken(jwtState.tokenInfo.raw)"
                    class="absolute top-2 right-2 text-white opacity-75 hover:opacity-100">
                    📋
                  </button>
                </div>

                <!-- Detalles del token -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="bg-gray-50 p-4 rounded-lg">
                    <h4 class="font-medium text-gray-900 mb-2">Header</h4>
                    <pre
                      class="text-sm bg-white p-2 rounded border overflow-x-auto">{{ JSON.stringify(jwtState.tokenInfo.header, null, 2) }}</pre>
                  </div>
                  <div class="bg-gray-50 p-4 rounded-lg">
                    <h4 class="font-medium text-gray-900 mb-2">Payload</h4>
                    <pre
                      class="text-sm bg-white p-2 rounded border overflow-x-auto">{{ JSON.stringify(jwtState.tokenInfo.payload, null, 2) }}</pre>
                  </div>
                </div>

                <!-- Acciones -->
                <div class="flex gap-4">
                  <button @click="testVerifyToken" :disabled="loading"
                    class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                    Verificar Token
                  </button>
                  <button @click="testRefreshToken" :disabled="loading"
                    class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50">
                    Refrescar Token
                  </button>
                  <button @click="clearAuth" class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                    Limpiar Auth
                  </button>
                </div>
              </div>
            </div>

            <!-- JWT por Usuario -->
            <div v-if="activeJwtTab === 'userTokens'" class="space-y-6">
              <div class="flex gap-4">
                <input v-model="userTokenSearch" type="text" placeholder="Buscar usuario por email..."
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                <button @click="searchUserToken" :disabled="!userTokenSearch"
                  class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                  Buscar JWT
                </button>
              </div>

              <!-- Resultado de búsqueda -->
              <div v-if="selectedUserToken" class="bg-gray-50 p-6 rounded-lg">
                <div class="flex justify-between items-center mb-4">
                  <h3 class="font-medium text-gray-900">
                    JWT de {{ selectedUserToken.user.firstName }} {{ selectedUserToken.user.lastName }}
                  </h3>
                  <span
                    :class="['px-2 py-1 rounded text-sm font-medium', selectedUserToken.isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800']">
                    {{ selectedUserToken.isValid ? 'Token Válido' : 'Token Expirado' }}
                  </span>
                </div>

                <div class="bg-gray-900 text-green-400 p-4 rounded-lg relative mb-4">
                  <pre class="text-sm overflow-x-auto whitespace-pre-wrap break-all">{{ selectedUserToken.token }}</pre>
                  <button @click="copyToken(selectedUserToken.token)"
                    class="absolute top-2 right-2 text-white opacity-75 hover:opacity-100">
                    📋
                  </button>
                </div>

                <div class="flex gap-4">
                  <button @click="testUserToken(selectedUserToken.token)"
                    class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Probar Token
                  </button>
                  <button @click="loginAsUser(selectedUserToken.user)"
                    class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                    Iniciar como Usuario
                  </button>
                </div>
              </div>
            </div>

            <!-- Pruebas -->
            <div v-if="activeJwtTab === 'test'" class="space-y-6">
              <div class="bg-gray-50 p-6 rounded-lg">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Email:</label>
                    <input v-model="testCredentials.email" type="email" placeholder="correo@ejemplo.com"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña:</label>
                    <input v-model="testCredentials.password" type="password" placeholder="••••••••"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md" />
                  </div>
                </div>

                <div class="flex gap-4">
                  <button @click="testLogin" :disabled="loading"
                    class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                    {{ loading ? 'Probando...' : 'Probar Login' }}
                  </button>
                  <button @click="testProtectedEndpoint" :disabled="loading"
                    class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50">
                    {{ loading ? 'Probando...' : 'Probar Endpoint Protegido' }}
                  </button>
                  <button @click="testAdminEndpoint" :disabled="loading"
                    class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50">
                    {{ loading ? 'Probando...' : 'Probar Endpoint Admin' }}
                  </button>
                </div>
              </div>

              <!-- Resultados de prueba -->
              <div v-if="testResult" class="bg-gray-50 rounded-lg overflow-hidden">
                <div class="bg-white px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                  <h3 class="font-medium">Resultado {{ testResult.success ? '✅' : '❌' }}</h3>
                  <div class="text-sm text-gray-500">Status: {{ testResult.status || 'N/A' }}</div>
                </div>
                <pre
                  class="p-4 text-sm bg-gray-900 text-green-400 overflow-x-auto">{{ JSON.stringify(testResult, null, 2) }}</pre>
              </div>
            </div>
          </div>

          <!-- Tab: Logs -->
          <div v-if="activeTab === 'logs'" class="space-y-6">
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-semibold text-gray-900">Logs del Sistema</h2>
              <div class="flex gap-4">
                <select v-model="logFilter" class="px-3 py-2 border border-gray-300 rounded-md">
                  <option value="">Todos los logs</option>
                  <option value="info">Información</option>
                  <option value="warning">Advertencias</option>
                  <option value="error">Errores</option>
                  <option value="auth">Autenticación</option>
                </select>
                <button @click="clearLogs" class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                  Limpiar Logs
                </button>
              </div>
            </div>

            <div class="bg-gray-900 rounded-lg overflow-hidden">
              <div class="max-h-96 overflow-y-auto">
                <div v-for="log in filteredLogs" :key="log.id"
                  :class="['p-3 border-b border-gray-800 font-mono text-sm', getLogClass(log.type)]">
                  <div class="flex items-start gap-4">
                    <span class="text-gray-400 shrink-0">{{ formatDateTime(log.timestamp) }}</span>
                    <span class="uppercase font-bold shrink-0" :class="getLogLabelClass(log.type)">{{ log.type }}</span>
                    <span class="text-gray-300">{{ log.message }}</span>
                  </div>
                </div>
              </div>
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

          <div v-if="!editingUser.id" class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña:</label>
            <input v-model="editingUser.password" type="password" :required="!editingUser.id"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
          </div>

          <div class="mb-6">
            <label class="flex items-center">
              <input type="checkbox" v-model="editingUser.isActive" class="mr-2">
              <span class="text-sm text-gray-700">Usuario activo</span>
            </label>
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
          <h3 class="text-lg font-medium text-gray-900">
            {{ editingRestaurant.id ? 'Editar' : 'Crear' }} Restaurante
          </h3>
          <button @click="closeRestaurantModal" class="text-gray-400 hover:text-gray-500">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveRestaurant" class="p-6">
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nombre:</label>
              <input v-model="editingRestaurant.name" type="text" required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tarifa de entrega (€):</label>
              <input v-model="editingRestaurant.deliveryFee" type="number" step="0.01" min="0" required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
            </div>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Descripción:</label>
            <textarea v-model="editingRestaurant.description" rows="2"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
             <label class="block text-sm font-medium text-gray-700 mb-1">Propietario:</label>
              <select v-model="editingRestaurant.userId" required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                <option v-for="user in restaurantOwners" :key="user.id" :value="user.id">
                  {{ user.firstName }} {{ user.lastName }} ({{ user.email }})
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tipo:</label>
              <select v-model="editingRestaurant.tipo" required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                <option value="1">Hamburguesas</option>
                <option value="2">Pizza</option>
                <option value="3">Comida Rápida</option>
                <option value="4">Mexicana</option>
                <option value="5">China</option>
                <option value="6">Italiana</option>
                <option value="7">Postres</option>
                <option value="8">Saludable</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Logo URL:</label>
              <input v-model="editingRestaurant.logoUrl" type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Imagen de portada URL:</label>
              <input v-model="editingRestaurant.coverImageUrl" type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
            </div>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Tiempo estimado de entrega (min):</label>
            <input v-model="editingRestaurant.estimatedDeliveryTime" type="number" min="5" max="120" required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
          </div>

          <!-- Datos de dirección -->
          <div class="mb-4 border-t border-gray-200 pt-4">
            <h4 class="text-md font-medium text-gray-900 mb-2">Dirección</h4>

            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Calle:</label>
                <input v-model="editingRestaurant.address.street" type="text" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Número:</label>
                <input v-model="editingRestaurant.address.number" type="text" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
              </div>
            </div>

            <div class="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Ciudad:</label>
                <input v-model="editingRestaurant.address.city" type="text" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Código Postal:</label>
                <input v-model="editingRestaurant.address.zipCode" type="text" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono:</label>
                <input v-model="editingRestaurant.address.phone" type="text" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
              </div>
            </div>
          </div>

          <div class="mb-6">
            <label class="flex items-center">
              <input type="checkbox" v-model="editingRestaurant.isOpen" class="mr-2">
              <span class="text-sm text-gray-700">Restaurante abierto</span>
            </label>
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

    <!-- Modal de detalles de Pedido -->
    <div v-if="showOrderModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl max-w-3xl w-full mx-4 overflow-hidden">
        <div class="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">
            Detalles del Pedido #{{ viewingOrder.id }}
          </h3>
          <button @click="closeOrderModal" class="text-gray-400 hover:text-gray-500">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="p-6">
          <div class="mb-6">
            <div class="flex justify-between mb-3">
              <div>
                <h4 class="text-lg font-semibold">Información General</h4>
              </div>
              <span class="px-3 py-1 inline-flex text-sm font-semibold rounded-full"
                :class="getOrderStatusBadgeColor(viewingOrder.status)">
                {{ getOrderStatusText(viewingOrder.status) }}
              </span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-gray-50 p-4 rounded-lg">
                <div class="mb-3">
                  <span class="text-sm text-gray-500">Cliente:</span>
                  <p class="font-medium">{{ viewingOrder.user?.firstName }} {{ viewingOrder.user?.lastName }}</p>
                  <p class="text-sm text-gray-600">{{ viewingOrder.user?.email }}</p>
                </div>
                <div class="mb-3">
                  <span class="text-sm text-gray-500">Restaurante:</span>
                  <p class="font-medium">{{ viewingOrder.restaurant?.name }}</p>
                </div>
                <div>
                  <span class="text-sm text-gray-500">Repartidor:</span>
                  <p v-if="viewingOrder.deliveryPerson" class="font-medium">
                    {{ viewingOrder.deliveryPerson?.firstName }} {{ viewingOrder.deliveryPerson?.lastName }}
                  </p>
                  <p v-else class="text-gray-600">No asignado</p>
                </div>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg">
                <div class="mb-3">
                  <span class="text-sm text-gray-500">Fecha del pedido:</span>
                  <p class="font-medium">{{ formatDateTime(viewingOrder.createdAt) }}</p>
                </div>
                <div class="mb-3">
                  <span class="text-sm text-gray-500">Entrega estimada:</span>
                  <p class="font-medium">{{ formatDateTime(viewingOrder.estimatedDeliveryTime) }}</p>
                </div>
                <div>
                  <span class="text-sm text-gray-500">Dirección de entrega:</span>
                  <p class="font-medium">
                    {{ viewingOrder.deliveryAddress?.street }} {{ viewingOrder.deliveryAddress?.number }},
                    {{ viewingOrder.deliveryAddress?.city }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Resumen de artículos -->
          <div class="mb-6">
            <h4 class="text-lg font-semibold mb-3">Detalles del pedido</h4>
            <div class="bg-gray-50 rounded-lg overflow-hidden">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-100">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="item in viewingOrder.orderItems" :key="item.id">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {{ item.product.name }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {{ item.quantity }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      €{{ item.unitPrice.toFixed(2) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                      €{{ item.subtotal.toFixed(2) }}
                    </td>
                  </tr>
                </tbody>
                <tfoot class="bg-gray-50">
                  <tr>
                    <td colspan="3" class="px-6 py-3 text-right text-sm font-medium text-gray-500">Subtotal:</td>
                    <td class="px-6 py-3 text-right text-sm font-medium text-gray-900">€{{ viewingOrder.subtotal.toFixed(2) }}</td>
                  </tr>
                  <tr>
                    <td colspan="3" class="px-6 py-3 text-right text-sm font-medium text-gray-500">Gastos de envío:</td>
                    <td class="px-6 py-3 text-right text-sm font-medium text-gray-900">€{{ viewingOrder.deliveryFee.toFixed(2) }}</td>
                  </tr>
                  <tr>
                    <td colspan="3" class="px-6 py-3 text-right text-sm font-medium text-gray-500">Impuestos:</td>
                    <td class="px-6 py-3 text-right text-sm font-medium text-gray-900">€{{ viewingOrder.tax.toFixed(2) }}</td>
                  </tr>
                  <tr class="bg-gray-100">
                    <td colspan="3" class="px-6 py-3 text-right text-base font-semibold text-gray-900">Total:</td>
                    <td class="px-6 py-3 text-right text-base font-semibold text-gray-900">€{{ viewingOrder.total.toFixed(2) }}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <!-- Información de pago -->
          <div v-if="viewingOrder.payment" class="mb-6">
            <h4 class="text-lg font-semibold mb-3">Información de pago</h4>
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span class="text-sm text-gray-500">Método de pago:</span>
                  <p class="font-medium">{{ viewingOrder.payment.paymentMethod }}</p>
                </div>
                <div>
                  <span class="text-sm text-gray-500">Estado:</span>
                  <p class="font-medium capitalize">{{ viewingOrder.payment.status }}</p>
                </div>
                <div>
                  <span class="text-sm text-gray-500">Fecha:</span>
                  <p class="font-medium">{{ formatDateTime(viewingOrder.payment.paymentDate) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Acciones del pedido -->
          <div class="flex justify-end gap-4">
            <button @click="closeOrderModal" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              Cerrar
            </button>
            <button v-if="canUpdateOrderStatus(viewingOrder)" @click="showUpdateOrderStatusModal(viewingOrder)"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Actualizar Estado
            </button>
            <button v-if="viewingOrder.status !== 'Cancelled' && viewingOrder.status !== 'Delivered'"
              @click="cancelOrder(viewingOrder)" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              Cancelar Pedido
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para actualizar estado del pedido -->
    <div v-if="showUpdateStatusModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl max-w-md w-full mx-4 overflow-hidden">
        <div class="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">Actualizar Estado de Pedido</h3>
          <button @click="closeUpdateStatusModal" class="text-gray-400 hover:text-gray-500">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="p-6">
          <div class="mb-4">
            <p class="text-sm text-gray-600 mb-2">Pedido #{{ updatingOrder.id }} para {{ updatingOrder.user?.firstName }} {{ updatingOrder.user?.lastName }}</p>
            <p class="text-sm text-gray-600 mb-4">Estado actual: <span class="font-semibold">{{ getOrderStatusText(updatingOrder.status) }}</span></p>

            <label class="block text-sm font-medium text-gray-700 mb-1">Nuevo estado:</label>
            <select v-model="newOrderStatus" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
              <option v-for="status in availableOrderStatuses" :key="status.value" :value="status.value">
                {{ status.label }}
              </option>
            </select>
          </div>

          <div v-if="newOrderStatus === 'OnTheWay' && !updatingOrder.deliveryPersonId" class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Asignar repartidor:</label>
            <select v-model="selectedDeliveryPerson" required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
              <option value="">Seleccionar repartidor</option>
              <option v-for="deliveryPerson in deliveryPersons" :key="deliveryPerson.id" :value="deliveryPerson.id">
                {{ deliveryPerson.firstName }} {{ deliveryPerson.lastName }}
              </option>
            </select>
          </div>

          <div class="flex justify-end gap-4 mt-6">
            <button @click="closeUpdateStatusModal" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
              Cancelar
            </button>
            <button @click="submitOrderStatusUpdate" :disabled="isUpdatingOrderStatus || (newOrderStatus === 'OnTheWay' && !selectedDeliveryPerson && !updatingOrder.deliveryPersonId)"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
              {{ isUpdatingOrderStatus ? 'Actualizando...' : 'Actualizar estado' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '@/services/api';
import authDebugger from '@/services/authDebugger';
import authService from '@/services/authService';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

// Estados
const refreshing = ref(false);
const loading = ref(false);
const alerts = ref([]);

// Estadísticas
const stats = reactive({
  totalUsers: 0,
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
  { id: 'orders', name: 'Pedidos', icon: '📦' },
  { id: 'jwt', name: 'JWT Debug', icon: '🔐' },
  { id: 'logs', name: 'Logs', icon: '📝' }
];

// JWT Debug
const activeJwtTab = ref('global');
const jwtState = reactive({
  token: null,
  refreshToken: null,
  tokenInfo: null,
  isValid: false
});

const userTokenSearch = ref('');
const selectedUserToken = ref(null);
const testCredentials = reactive({ email: '', password: '' });
const testResult = ref(null);

const jwtTabs = [
  { id: 'global', name: 'Estado Global' },
  { id: 'userTokens', name: 'JWT por Usuario' },
  { id: 'test', name: 'Pruebas' }
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
  phoneNumber: '',
  role: 'Customer',
  isActive: true,
  password: '' // Solo para crear nuevo usuario
});

// Restaurantes
const restaurants = ref([]);
const restaurantSearch = ref('');
const restaurantFilter = ref('');
const restaurantPage = ref(1);
const restaurantsPerPage = 10;
const showRestaurantModal = ref(false);
const editingRestaurant = reactive({
  id: null,
  name: '',
  description: '',
  logoUrl: '',
  coverImageUrl: '',
  isOpen: true,
  deliveryFee: 2.50,
  estimatedDeliveryTime: 30,
  averageRating: 0,
  tipo: 1,
  userId: null,
  address: {
    street: '',
    number: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    isDefault: true
  }
});
const restaurantOwners = ref([]);

// Pedidos
const orders = ref([]);
const orderSearch = ref('');
const orderStatusFilter = ref('');
const orderDateFilter = ref('');
const orderPage = ref(1);
const ordersPerPage = 10;
const showOrderModal = ref(false);
const viewingOrder = reactive({
  id: null,
  user: null,
  restaurant: null,
  deliveryAddress: null,
  deliveryPerson: null,
  status: '',
  subtotal: 0,
  deliveryFee: 0,
  tax: 0,
  total: 0,
  estimatedDeliveryTime: '',
  createdAt: '',
  updatedAt: '',
  orderItems: [],
  payment: null
});
// Estado del modal de actualización de estado de pedido
const showUpdateStatusModal = ref(false);
const updatingOrder = reactive({
  id: null,
  status: '',
  user: null,
  deliveryPersonId: null
});
const newOrderStatus = ref('');
const selectedDeliveryPerson = ref('');
const isUpdatingOrderStatus = ref(false);
const deliveryPersons = ref([]);

// Logs
const logs = ref([]);
const logFilter = ref('');

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
  let filtered = [...restaurants.value];

  if (restaurantSearch.value) {
    filtered = filtered.filter(restaurant =>
      restaurant.name.toLowerCase().includes(restaurantSearch.value.toLowerCase()) ||
      restaurant.description.toLowerCase().includes(restaurantSearch.value.toLowerCase())
    );
  }

  if (restaurantFilter.value) {
    filtered = filtered.filter(restaurant => restaurant.tipo.toString() === restaurantFilter.value);
  }

  const start = (restaurantPage.value - 1) * restaurantsPerPage;
  const end = start + restaurantsPerPage;
  return filtered.slice(start, end);
});

const totalRestaurantPages = computed(() => {
  let filtered = [...restaurants.value];

  if (restaurantSearch.value) {
    filtered = filtered.filter(restaurant =>
      restaurant.name.toLowerCase().includes(restaurantSearch.value.toLowerCase()) ||
      restaurant.description.toLowerCase().includes(restaurantSearch.value.toLowerCase())
    );
  }

  if (restaurantFilter.value) {
    filtered = filtered.filter(restaurant => restaurant.tipo.toString() === restaurantFilter.value);
  }

  return Math.ceil(filtered.length / restaurantsPerPage);
});

const filteredOrders = computed(() => {
  let filtered = [...orders.value];

  if (orderSearch.value) {
    const searchTerm = orderSearch.value.toLowerCase();
    filtered = filtered.filter(order =>
      order.id.toString().includes(searchTerm) ||
      (order.user && `${order.user.firstName} ${order.user.lastName}`.toLowerCase().includes(searchTerm)) ||
      (order.restaurant && order.restaurant.name.toLowerCase().includes(searchTerm))
    );
  }

  if (orderStatusFilter.value) {
    filtered = filtered.filter(order => order.status === orderStatusFilter.value);
  }

  if (orderDateFilter.value) {
    const searchDate = orderDateFilter.value;
    filtered = filtered.filter(order => order.createdAt.startsWith(searchDate));
  }

  const start = (orderPage.value - 1) * ordersPerPage;
  const end = start + ordersPerPage;
  return filtered.slice(start, end);
});

const totalOrderPages = computed(() => {
  let filtered = [...orders.value];

  if (orderSearch.value) {
    const searchTerm = orderSearch.value.toLowerCase();
    filtered = filtered.filter(order =>
      order.id.toString().includes(searchTerm) ||
      (order.user && `${order.user.firstName} ${order.user.lastName}`.toLowerCase().includes(searchTerm)) ||
      (order.restaurant && order.restaurant.name.toLowerCase().includes(searchTerm))
    );
  }

  if (orderStatusFilter.value) {
    filtered = filtered.filter(order => order.status === orderStatusFilter.value);
  }

  if (orderDateFilter.value) {
    const searchDate = orderDateFilter.value;
    filtered = filtered.filter(order => order.createdAt.startsWith(searchDate));
  }

  return Math.ceil(filtered.length / ordersPerPage);
});

const filteredLogs = computed(() => {
  if (!logFilter.value) return logs.value;
  return logs.value.filter(log => log.type === logFilter.value);
});

const availableOrderStatuses = computed(() => {
  const currentStatus = updatingOrder.status;

  // Definir las transiciones válidas para cada estado
  const validTransitions = {
    'Pending': [
      { value: 'Accepted', label: 'Aceptado' },
      { value: 'Cancelled', label: 'Cancelado' }
    ],
    'Accepted': [
      { value: 'Preparing', label: 'Preparando' },
      { value: 'Cancelled', label: 'Cancelado' }
    ],
    'Preparing': [
      { value: 'ReadyForPickup', label: 'Listo para recoger' },
      { value: 'Cancelled', label: 'Cancelado' }
    ],
    'ReadyForPickup': [
      { value: 'OnTheWay', label: 'En camino' },
      { value: 'Cancelled', label: 'Cancelado' }
    ],
    'OnTheWay': [
      { value: 'Delivered', label: 'Entregado' },
      { value: 'Cancelled', label: 'Cancelado' }
    ],
    'Delivered': [],  // Estado final
    'Cancelled': []   // Estado final
  };

  return validTransitions[currentStatus] || [];
});

// Lifecycle hooks
onMounted(async () => {
  await checkAuthorization();
  await refreshAllData();

  // Actualizar cada 30 segundos
  const interval = setInterval(checkJWTState, 30000);
  onBeforeUnmount(() => clearInterval(interval));
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
      fetchStats(),
      fetchUsers(),
      fetchRestaurants(),
      fetchOrders(),
      checkJWTState(),
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

const fetchStats = async () => {
  try {
    // Usar datos ya obtenidos para calcular estadísticas
    stats.totalUsers = users.value.length;
    stats.totalRestaurants = restaurants.value.length;
    stats.activeRestaurants = restaurants.value.filter(r => r.isOpen).length;

    // Calcular órdenes activas (no entregadas/canceladas)
    stats.activeOrders = orders.value.filter(order =>
      !['Delivered', 'Cancelled'].includes(order.status)
    ).length;

    // Contar órdenes completadas hoy
    const today = new Date().toISOString().split('T')[0];
    stats.completedOrders = orders.value.filter(order =>
      order.status === 'Delivered' &&
      order.updatedAt.startsWith(today)
    ).length;

    // Calcular ingresos del día
    stats.todayRevenue = orders.value
      .filter(order => order.createdAt.startsWith(today))
      .reduce((total, order) => total + order.total, 0);

    // Valores estáticos por ahora
    stats.userGrowth = 5;
    stats.revenueGrowth = 8;
  } catch (error) {
    console.error('Error fetchStats:', error);
    addAlert('Error al obtener estadísticas', 'error');
  }
};

const fetchUsers = async () => {
  try {
    // Obtener usuarios del backend
    const response = await api.get('/api/Users');
    users.value = response.data.map(user => ({
      ...user,
      isActive: true
    }));

    // También filtrar los usuarios que son dueños de restaurantes para el selector
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
  }
};

const fetchRestaurants = async () => {
  try {
    // Obtener restaurantes del backend
    const response = await api.get('/api/Restaurants');
    restaurants.value = response.data;
  } catch (error) {
    console.error('Error fetchRestaurants:', error);
    addAlert('Error al obtener restaurantes', 'error');
  }
};

const fetchOrders = async () => {
  try {
    // Obtener pedidos del backend
    const response = await api.get('/api/Orders');
    orders.value = response.data;
  } catch (error) {
    console.error('Error fetchOrders:', error);
    addAlert('Error al obtener pedidos', 'error');
  }
};

const fetchLogs = async () => {
  try {
    // Para los logs, vamos a simular datos ya que no hay endpoint específico
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
      }
    ];
  } catch (error) {
    console.error('Error fetchLogs:', error);
    addAlert('Error al obtener logs', 'error');
  }
};

const checkJWTState = async () => {
  const state = authDebugger.checkAuthState();
  Object.assign(jwtState, {
    token: state.hasToken ? localStorage.getItem('token') : null,
    refreshToken: state.hasRefreshToken ? localStorage.getItem('refreshToken') : null,
    tokenInfo: state.tokenInfo,
    isValid: state.tokenInfo && !state.tokenInfo.isExpired
  });
};

// JWT Methods
const testVerifyToken = async () => {
  loading.value = true;
  try {
    // Usar el endpoint de validación de token
    const response = await api.post('/api/Auth/validate-token', {
      token: localStorage.getItem('token')
    });

    const isValid = response.data.isValid;
    testResult.value = {
      success: isValid,
      message: isValid ? 'Token válido' : 'Token inválido o expirado',
      status: isValid ? 200 : 401
    };
    await checkJWTState();
  } catch (error) {
    testResult.value = {
      success: false,
      error: error.message,
      status: error.response?.status
    };
  } finally {
    loading.value = false;
  }
};

const testRefreshToken = async () => {
  loading.value = true;
  try {
    // Usar el endpoint de refresh token
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No hay refresh token almacenado');
    }

    const response = await api.post('/api/Auth/refresh-token', {
      refreshToken
    });

    if (response.data.success) {
      // Actualizar tokens en localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);

      testResult.value = {
        success: true,
        message: 'Token refrescado correctamente',
        token: response.data.token,
        refreshToken: response.data.refreshToken
      };

      addAlert('Token refrescado exitosamente', 'success');
    } else {
      testResult.value = {
        success: false,
        message: response.data.message
      };

      addAlert('Error al refrescar token: ' + response.data.message, 'error');
    }

    await checkJWTState();
  } catch (error) {
    testResult.value = {
      success: false,
      error: error.message
    };
    addAlert('Error al refrescar token', 'error');
  } finally {
    loading.value = false;
  }
};

const clearAuth = async () => {
  // Eliminar tokens del localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');

  // Limpiar headers de autorización en axios
  delete api.defaults.headers.common['Authorization'];

  testResult.value = {
    success: true,
    message: 'Datos de autenticación eliminados'
  };

  await checkJWTState();
  addAlert('Datos de autenticación eliminados', 'warning');
};

const searchUserToken = async () => {
  if (!userTokenSearch.value) return;

  try {
    // Buscar usuario por email
    const response = await api.get(`/api/Users/byRole/all?email=${userTokenSearch.value}`);

    if (response.data && response.data.length > 0) {
      const user = response.data[0];

      // Simulamos un token para este usuario
      // En una implementación real, obtendrías el token real del sistema
      selectedUserToken.value = {
        user,
        token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIke3VzZXIuaWR9IiwiZW1haWwiOiIke3VzZXIuZW1haWx9Iiwicm9sZSI6IiR7dXNlci5yb2xlfSIsIm5iZiI6MTcxNTM0MjM0NSwiZXhwIjoxNzE1MzQ5NTQ1LCJpYXQiOjE3MTUzNDIzNDV9.Gc8iwoJ6OyTOxlXeqmw8Z0xSGxCbA5c9VLfyUNLxsUw`,
        isValid: true
      };
    } else {
      addAlert('Usuario no encontrado', 'error');
      selectedUserToken.value = null;
    }
  } catch (error) {
    console.error('Error buscando JWT:', error);
    addAlert('Usuario no encontrado', 'error');
    selectedUserToken.value = null;
  }
};

const viewUserJWT = async (user) => {
  try {
    // Simular la obtención de un JWT para el usuario
    selectedUserToken.value = {
      user,
      token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIke3VzZXIuaWR9IiwiZW1haWwiOiIke3VzZXIuZW1haWx9Iiwicm9sZSI6IiR7dXNlci5yb2xlfSIsIm5iZiI6MTcxNTM0MjM0NSwiZXhwIjoxNzE1MzQ5NTQ1LCJpYXQiOjE3MTUzNDIzNDV9.Gc8iwoJ6OyTOxlXeqmw8Z0xSGxCbA5c9VLfyUNLxsUw`,
      isValid: true
    };
    activeTab.value = 'jwt';
    activeJwtTab.value = 'userTokens';
    userTokenSearch.value = user.email;
  } catch (error) {
    console.error('Error al obtener JWT del usuario:', error);
    addAlert('Error al obtener JWT del usuario', 'error');
  }
};

const copyToken = async (token) => {
  try {
    await navigator.clipboard.writeText(token);
    addAlert('Token copiado al portapapeles', 'success');
  } catch (error) {
    addAlert('Error al copiar token', 'error');
  }
};

const testUserToken = async (token) => {
  loading.value = true;
  try {
    // Probar un endpoint protegido con el token
    const response = await api.get('/api/Users/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    testResult.value = {
      success: true,
      status: response.status,
      data: response.data
    };

    addAlert('Token funcionó correctamente', 'success');
  } catch (error) {
    testResult.value = {
      success: false,
      status: error.response?.status,
      error: error.response?.data || error.message
    };

    addAlert('Error al usar el token', 'error');
  } finally {
    loading.value = false;
  }
};

const loginAsUser = async (user) => {
  if (!confirm(`¿Estás seguro de que quieres iniciar sesión como ${user.firstName} ${user.lastName}?`)) {
    return;
  }

  try {
    // Simular inicio de sesión como este usuario
    // Normalmente esto requeriría un endpoint específico
    const response = await api.post('/api/Auth/login', {
      email: user.email,
      password: 'admin123' // Esto es una simulación
    });

    if (response.data?.success && response.data?.token) {
      // Guardar token del admin para poder volver
      const adminToken = localStorage.getItem('token');
      sessionStorage.setItem('admin_token', adminToken);

      // Actualizar con el token del usuario
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

      addAlert(`Sesión iniciada como ${user.firstName} ${user.lastName}`, 'success');
      router.push('/');
    } else {
      addAlert('Error al iniciar sesión: ' + (response.data?.message || 'Credenciales inválidas'), 'error');
    }
  } catch (error) {
    addAlert('Error al iniciar sesión como usuario', 'error');
  }
};

// Test Methods
const testLogin = async () => {
  loading.value = true;
  testResult.value = null;

  try {
    // Usar el endpoint de login real
    const response = await api.post('/api/Auth/login', {
      email: testCredentials.email,
      password: testCredentials.password
    });

    if (response.data.success) {
      // Guardar tokens
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

      testResult.value = {
        success: true,
        message: 'Login exitoso',
        token: response.data.token,
        refreshToken: response.data.refreshToken,
        user: {
          id: response.data.userId,
          email: response.data.email,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          role: response.data.role
        }
      };

      addAlert('Login exitoso', 'success');
    } else {
      testResult.value = {
        success: false,
        message: response.data.message
      };

      addAlert('Login fallido: ' + response.data.message, 'error');
    }

    await checkJWTState();
  } catch (error) {
    console.error('Error al probar login:', error);
    testResult.value = {
      success: false,
      error: error.response?.data?.message || error.message,
      status: error.response?.status
    };

    addAlert('Error al iniciar sesión', 'error');
  } finally {
    loading.value = false;
  }
};

const testProtectedEndpoint = async () => {
  loading.value = true;
  testResult.value = null;

  try {
    // Probar endpoint protegido: obtener perfil actual
    const response = await api.get('/api/Users/me');

    testResult.value = {
      success: true,
      status: response.status,
      data: response.data
    };

    addAlert('Endpoint protegido accesible', 'success');
  } catch (error) {
    console.error('Error al probar endpoint:', error);
    testResult.value = {
      success: false,
      status: error.response?.status,
      error: error.response?.data || error.message
    };

    addAlert('Acceso denegado al endpoint', 'error');
  } finally {
    loading.value = false;
  }
};

const testAdminEndpoint = async () => {
  loading.value = true;
  testResult.value = null;

  try {
    // Probar endpoint que requiere rol Admin
    const response = await api.get('/api/Users');

    testResult.value = {
      success: true,
      status: response.status,
      data: response.data
    };

    addAlert('Endpoint de admin accesible', 'success');
  } catch (error) {
    console.error('Error al probar endpoint admin:', error);
    testResult.value = {
      success: false,
      status: error.response?.status,
      error: error.response?.data || error.message
    };

    addAlert('Acceso denegado al endpoint de admin', 'error');
  } finally {
    loading.value = false;
  }
};

// User Management Methods
const addUser = () => {
  Object.assign(editingUser, {
    id: null,
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    role: 'Customer',
    isActive: true,
    password: ''
  });
  showUserModal.value = true;
};

const editUser = (user) => {
  Object.assign(editingUser, {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phoneNumber: user.phoneNumber || '',
    role: user.role,
    isActive: user.isActive !== false,
    password: '' // No incluimos la contraseña al editar
  });
  showUserModal.value = true;
};

const saveUser = async () => {
  try {
    if (editingUser.id) {
      // Actualizar usuario existente
      const userData = {
        firstName: editingUser.firstName,
        lastName: editingUser.lastName,
        phoneNumber: editingUser.phoneNumber
      };

      await api.put(`/api/Users/${editingUser.id}`, userData);
      addAlert('Usuario actualizado correctamente', 'success');
    } else {
      // Crear nuevo usuario
      const newUserData = {
        email: editingUser.email,
        password: editingUser.password,
        firstName: editingUser.firstName,
        lastName: editingUser.lastName,
        phoneNumber: editingUser.phoneNumber,
        role: editingUser.role
      };

      await api.post('/api/Users', newUserData);
      addAlert('Usuario creado correctamente', 'success');
    }

    showUserModal.value = false;
    await fetchUsers();
  } catch (error) {
    console.error('Error al guardar usuario:', error);
    addAlert('Error al guardar usuario: ' + (error.response?.data?.message || error.message), 'error');
  }
};

const toggleUserStatus = async (user) => {
  try {
    // Actualizar estado del usuario
    // Esto es una simulación ya que no hay un endpoint específico para cambiar estado
    user.isActive = !user.isActive;

    // Para mantener coherencia con el backend, podríamos intentar una actualización del usuario
    // pero solo cambiando propiedades admitidas por el backend
    await api.put(`/api/Users/${user.id}`, {
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber
    });

    addAlert(`Usuario ${user.isActive ? 'activado' : 'desactivado'} correctamente`, 'success');
  } catch (error) {
    console.error('Error al cambiar estado del usuario:', error);
    addAlert('Error al cambiar estado del usuario', 'error');
    // Revertir cambio en caso de error
    user.isActive = !user.isActive;
  }
};

const closeUserModal = () => {
  showUserModal.value = false;
};

// Restaurant Management Methods
const addRestaurant = () => {
  // Asegurar que tengamos usuarios tipo Restaurant
  if (restaurantOwners.value.length === 0) {
    addAlert('No hay usuarios con rol de Restaurante disponibles. Crea uno primero.', 'warning');
    return;
  }

  Object.assign(editingRestaurant, {
    id: null,
    name: '',
    description: '',
    logoUrl: '',
    coverImageUrl: '',
    isOpen: true,
    deliveryFee: 2.50,
    estimatedDeliveryTime: 30,
    averageRating: 0,
    tipo: 1,
    userId: restaurantOwners.value[0].id, // Seleccionar el primero por defecto
    address: {
      street: '',
      number: '',
      city: '',
      state: '',
      zipCode: '',
      phone: '',
      isDefault: true
    }
  });
  showRestaurantModal.value = true;
};

const editRestaurant = (restaurant) => {
  Object.assign(editingRestaurant, {
    id: restaurant.id,
    name: restaurant.name,
    description: restaurant.description,
    logoUrl: restaurant.logoUrl,
    coverImageUrl: restaurant.coverImageUrl,
    isOpen: restaurant.isOpen,
    deliveryFee: restaurant.deliveryFee,
    estimatedDeliveryTime: restaurant.estimatedDeliveryTime,
    averageRating: restaurant.averageRating,
    tipo: restaurant.tipo,
    userId: restaurant.userId,
    address: { ...restaurant.address }
  });
  showRestaurantModal.value = true;
};

const saveRestaurant = async () => {
  try {
    if (editingRestaurant.id) {
      // Actualizar restaurante existente
      const restaurantData = {
        name: editingRestaurant.name,
        description: editingRestaurant.description,
        logoUrl: editingRestaurant.logoUrl,
        coverImageUrl: editingRestaurant.coverImageUrl,
        isOpen: editingRestaurant.isOpen,
        deliveryFee: editingRestaurant.deliveryFee,
        estimatedDeliveryTime: editingRestaurant.estimatedDeliveryTime,
        tipo: editingRestaurant.tipo
      };

      // Actualizar el restaurante
      await api.put(`/api/Restaurants/${editingRestaurant.id}`, restaurantData);
      addAlert('Restaurante actualizado correctamente', 'success');
    } else {
      // Crear nuevo restaurante
      const createRestaurantData = {
        name: editingRestaurant.name,
        description: editingRestaurant.description,
        logoUrl: editingRestaurant.logoUrl || '',
        coverImageUrl: editingRestaurant.coverImageUrl || '',
        isOpen: editingRestaurant.isOpen,
        deliveryFee: editingRestaurant.deliveryFee,
        estimatedDeliveryTime: editingRestaurant.estimatedDeliveryTime,
        tipo: editingRestaurant.tipo,
        userId: editingRestaurant.userId,
        address: {
          street: editingRestaurant.address.street,
          number: editingRestaurant.address.number,
          city: editingRestaurant.address.city,
          state: editingRestaurant.address.state || 'Madrid',
          zipCode: editingRestaurant.address.zipCode,
          phone: editingRestaurant.address.phone
        }
      };

      await api.post('/api/Restaurants', createRestaurantData);
      addAlert('Restaurante creado correctamente', 'success');
    }

    showRestaurantModal.value = false;
    await fetchRestaurants();
  } catch (error) {
    console.error('Error al guardar restaurante:', error);
    addAlert('Error al guardar restaurante: ' + (error.response?.data?.message || error.message), 'error');
  }
};

const viewRestaurant = (restaurant) => {
  // Aquí podrías abrir un modal con los detalles completos del restaurante
  // o redirigir a una página específica
  window.open(`/restaurant/${restaurant.id}`, '_blank');
};

const toggleRestaurantStatus = async (restaurant) => {
  try {
    // Cambiar el estado del restaurante
    restaurant.isOpen = !restaurant.isOpen;

    // Actualizar en el servidor
    await api.put(`/api/Restaurants/${restaurant.id}`, {
      name: restaurant.name,
      description: restaurant.description,
      isOpen: restaurant.isOpen
    });

    addAlert(`Restaurante ${restaurant.isOpen ? 'abierto' : 'cerrado'} correctamente`, 'success');
  } catch (error) {
    console.error('Error al cambiar estado del restaurante:', error);
    addAlert('Error al cambiar estado del restaurante', 'error');
    // Revertir en caso de error
    restaurant.isOpen = !restaurant.isOpen;
  }
};

const closeRestaurantModal = () => {
  showRestaurantModal.value = false;
};

// Order Management Methods
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

const viewOrder = (order) => {
  // Copiar los datos del pedido al objeto reactivo
  Object.assign(viewingOrder, order);
  showOrderModal.value = true;
};

const closeOrderModal = () => {
  showOrderModal.value = false;
};

const canUpdateOrderStatus = (order) => {
  // Un pedido puede ser actualizado si no está en un estado final (entregado o cancelado)
  return !['Delivered', 'Cancelled'].includes(order.status);
};

const updateOrderStatus = (order) => {
  // Inicializar el modal de actualización
  Object.assign(updatingOrder, {
    id: order.id,
    status: order.status,
    user: order.user,
    deliveryPersonId: order.deliveryPersonId
  });

  // Seleccionar el primer estado disponible por defecto
  if (availableOrderStatuses.value.length > 0) {
    newOrderStatus.value = availableOrderStatuses.value[0].value;
  }

  showUpdateStatusModal.value = true;
};

const showUpdateOrderStatusModal = (order) => {
  updateOrderStatus(order);
};

const closeUpdateStatusModal = () => {
  showUpdateStatusModal.value = false;
  newOrderStatus.value = '';
  selectedDeliveryPerson.value = '';
};

const submitOrderStatusUpdate = async () => {
  if (!newOrderStatus.value) {
    addAlert('Selecciona un estado', 'warning');
    return;
  }

  isUpdatingOrderStatus.value = true;

  try {
    // Preparar datos para la actualización
    const updateData = {
      status: newOrderStatus.value
    };

    // Si estamos asignando un repartidor
    if (newOrderStatus.value === 'OnTheWay' && !updatingOrder.deliveryPersonId && selectedDeliveryPerson.value) {
      updateData.deliveryPersonId = selectedDeliveryPerson.value;
    }

    // Enviar la actualización al servidor
    await api.put(`/api/Orders/${updatingOrder.id}/status`, updateData);

    // Actualizar el estado en la lista local
    const orderIndex = orders.value.findIndex(o => o.id === updatingOrder.id);
    if (orderIndex !== -1) {
      orders.value[orderIndex].status = newOrderStatus.value;
      if (updateData.deliveryPersonId) {
        orders.value[orderIndex].deliveryPersonId = updateData.deliveryPersonId;

        // Actualizar el repartidor asignado
        const deliveryPerson = deliveryPersons.value.find(dp => dp.id.toString() === updateData.deliveryPersonId.toString());
        if (deliveryPerson) {
          orders.value[orderIndex].deliveryPerson = deliveryPerson;
        }
      }
    }

    // Si el modal de detalles del pedido está abierto, actualizarlo también
    if (showOrderModal.value && viewingOrder.id === updatingOrder.id) {
      viewingOrder.status = newOrderStatus.value;
      if (updateData.deliveryPersonId) {
        viewingOrder.deliveryPersonId = updateData.deliveryPersonId;

        const deliveryPerson = deliveryPersons.value.find(dp => dp.id.toString() === updateData.deliveryPersonId.toString());
        if (deliveryPerson) {
          viewingOrder.deliveryPerson = deliveryPerson;
        }
      }
    }

    addAlert('Estado del pedido actualizado correctamente', 'success');
    closeUpdateStatusModal();
  } catch (error) {
    console.error('Error al actualizar estado del pedido:', error);
    addAlert('Error al actualizar estado: ' + (error.response?.data?.message || error.message), 'error');
  } finally {
    isUpdatingOrderStatus.value = false;
  }
};

const cancelOrder = async (order) => {
  if (!confirm(`¿Estás seguro de que quieres cancelar el pedido #${order.id}?`)) {
    return;
  }

  try {
    // Enviar la cancelación al servidor
    await api.put(`/api/Orders/${order.id}/status`, { status: 'Cancelled' });

    // Actualizar el estado en la lista local
    const orderIndex = orders.value.findIndex(o => o.id === order.id);
    if (orderIndex !== -1) {
      orders.value[orderIndex].status = 'Cancelled';
    }

    // Si el modal de detalles del pedido está abierto, actualizarlo también
    if (showOrderModal.value && viewingOrder.id === order.id) {
      viewingOrder.status = 'Cancelled';
    }

    addAlert('Pedido cancelado correctamente', 'success');
  } catch (error) {
    console.error('Error al cancelar pedido:', error);
    addAlert('Error al cancelar pedido: ' + (error.response?.data?.message || error.message), 'error');
  }
};

// Search and Pagination
const searchUsers = async () => {
  currentPage.value = 1;

  if (userFilter.value) {
    try {
      // Si hay un filtro de rol, usamos el endpoint específico
      const response = await api.get(`/api/Users/byRole/${userFilter.value}`);
      users.value = response.data.map(user => ({
        ...user,
        isActive: true // Asumimos que todos los usuarios están activos por defecto
      }));
    } catch (error) {
      console.error('Error al buscar usuarios por rol:', error);
      addAlert('Error al filtrar usuarios', 'error');
    }
  } else {
    // Si no hay filtro específico, recuperamos todos los usuarios
    await fetchUsers();
  }
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

const searchRestaurants = async () => {
  restaurantPage.value = 1;

  // Si hay un filtro de tipo, usar el endpoint especializado
  if (restaurantFilter.value) {
    try {
      const response = await api.get(`/api/Restaurants/tipo/${restaurantFilter.value}`);
      restaurants.value = response.data;
    } catch (error) {
      console.error('Error al filtrar restaurantes por tipo:', error);
      addAlert('Error al filtrar restaurantes', 'error');
    }
  } else if (restaurantSearch.value) {
    // Si hay término de búsqueda, usar el endpoint de búsqueda
    try {
      const response = await api.get(`/api/Restaurants/search?query=${restaurantSearch.value}`);
      restaurants.value = response.data;
    } catch (error) {
      console.error('Error al buscar restaurantes:', error);
      addAlert('Error al buscar restaurantes', 'error');
    }
  } else {
    // Si no hay filtros, recuperar todos
    await fetchRestaurants();
  }
};

const previousRestaurantPage = () => {
  if (restaurantPage.value > 1) {
    restaurantPage.value--;
  }
};

const nextRestaurantPage = () => {
  if (restaurantPage.value < totalRestaurantPages.value) {
    restaurantPage.value++;
  }
};

const searchOrders = async () => {
  orderPage.value = 1;
  await fetchOrders();

  // Aplicar filtros localmente ya que no hay endpoint especializado
  // La computada filteredOrders ya aplica estos filtros
};

const previousOrderPage = () => {
  if (orderPage.value > 1) {
    orderPage.value--;
  }
};

const nextOrderPage = () => {
  if (orderPage.value < totalOrderPages.value) {
    orderPage.value++;
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

const formatToken = (token) => {
  if (!token) return '';
  if (token.length > 50) {
    return `${token.substring(0, 20)}...${token.substring(token.length - 20)}`;
  }
  return token;
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

const getRestaurantTypeBadgeColor = (tipo) => {
  const colors = {
    1: 'bg-red-100 text-red-800', // Hamburguesas
    2: 'bg-yellow-100 text-yellow-800', // Pizza
    3: 'bg-orange-100 text-orange-800', // Comida Rápida
    4: 'bg-green-100 text-green-800', // Mexicana
    5: 'bg-blue-100 text-blue-800', // China
    6: 'bg-indigo-100 text-indigo-800', // Italiana
    7: 'bg-pink-100 text-pink-800', // Postres
    8: 'bg-purple-100 text-purple-800' // Saludable
  };
  return colors[tipo] || 'bg-gray-100 text-gray-800';
};

const getRestaurantTypeName = (tipo) => {
  const types = {
    1: 'Hamburguesas',
    2: 'Pizza',
    3: 'Comida Rápida',
    4: 'Mexicana',
    5: 'China',
    6: 'Italiana',
    7: 'Postres',
    8: 'Saludable'
  };
  return types[tipo] || 'Otro';
};

const getOrderStatusBadgeColor = (status) => {
  const colors = {
    'Pending': 'bg-gray-100 text-gray-800',
    'Accepted': 'bg-blue-100 text-blue-800',
    'Preparing': 'bg-indigo-100 text-indigo-800',
    'ReadyForPickup': 'bg-purple-100 text-purple-800',
    'OnTheWay': 'bg-yellow-100 text-yellow-800',
    'Delivered': 'bg-green-100 text-green-800',
    'Cancelled': 'bg-red-100 text-red-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

const getOrderStatusText = (status) => {
  const statuses = {
    'Pending': 'Pendiente',
    'Accepted': 'Aceptado',
    'Preparing': 'Preparando',
    'ReadyForPickup': 'Listo para recoger',
    'OnTheWay': 'En camino',
    'Delivered': 'Entregado',
    'Cancelled': 'Cancelado'
  };
  return statuses[status] || status;
};

const getTokenStatus = () => {
  if (jwtState.tokenInfo?.isExpired) return 'Expirado';
  if (jwtState.isValid) return 'Válido';
  return 'Inválido';
};

const getTokenStatusClass = () => {
  if (jwtState.tokenInfo?.isExpired) return 'text-red-600';
  if (jwtState.isValid) return 'text-green-600';
  return 'text-red-600';
};

const getLogClass = (type) => {
  const classes = {
    'error': 'text-red-400',
    'warning': 'text-yellow-400',
    'info': 'text-green-400',
    'auth': 'text-blue-400'
  };
  return classes[type] || 'text-gray-400';
};

const getLogLabelClass = (type) => {
  const classes = {
    'error': 'text-red-500',
    'warning': 'text-yellow-500',
    'info': 'text-green-500',
    'auth': 'text-blue-500'
  };
  return classes[type] || 'text-gray-500';
};

const clearLogs = async () => {
  if (confirm('¿Estás seguro de que quieres limpiar todos los logs?')) {
    try {
      // Aquí simplemente limpiamos los logs locales ya que no hay endpoint
      logs.value = [];
      addAlert('Logs limpiados correctamente', 'success');
    } catch (error) {
      addAlert('Error al limpiar logs', 'error');
    }
  }
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
    const users = response.data;

    // Convertir a CSV
    const headers = ['ID', 'Email', 'Nombre', 'Apellido', 'Teléfono', 'Rol', 'Fecha de registro'];

    const csvRows = [];
    csvRows.push(headers.join(','));

    for (const user of users) {
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
