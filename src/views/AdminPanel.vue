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
            <label class="block text-sm font-medium text-gray-700 mb-1">Rol:</label>
            <select v-model="editingUser.role" required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
              <option value="Admin">Administrador</option>
              <option value="Customer">Cliente</option>
              <option value="Restaurant">Restaurante</option>
              <option value="DeliveryPerson">Repartidor</option>
            </select>
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
  role: 'Customer',
  isActive: true
});

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

const filteredLogs = computed(() => {
  if (!logFilter.value) return logs.value;
  return logs.value.filter(log => log.type === logFilter.value);
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
    const response = await api.get('/api/admin/stats');
    Object.assign(stats, response.data);
  } catch (error) {
    console.error('Error fetchStats:', error);
    addAlert('Error al obtener estadísticas', 'error');
  }
};

const fetchUsers = async () => {
  try {
    const response = await api.get('/api/admin/users');
    users.value = response.data;
  } catch (error) {
    console.error('Error fetchUsers:', error);
    addAlert('Error al obtener usuarios', 'error');
  }
};

const fetchLogs = async () => {
  try {
    const response = await api.get('/api/admin/logs');
    logs.value = response.data;
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
    const isValid = await authService.verifyToken();
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
    const result = await authDebugger.testRefreshToken();
    testResult.value = result;
    await checkJWTState();

    if (result.success) {
      addAlert('Token refrescado exitosamente', 'success');
    } else {
      addAlert('Error al refrescar token', 'error');
    }
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
  const result = authDebugger.clearAuth();
  testResult.value = result;
  await checkJWTState();
  addAlert('Datos de autenticación eliminados', 'warning');
};

const searchUserToken = async () => {
  if (!userTokenSearch.value) return;

  try {
    const response = await api.get(`/api/admin/user-jwt/${userTokenSearch.value}`);
    selectedUserToken.value = response.data;
  } catch (error) {
    console.error('Error buscando JWT:', error);
    addAlert('Usuario no encontrado', 'error');
    selectedUserToken.value = null;
  }
};

const viewUserJWT = async (user) => {
  try {
    const response = await api.get(`/api/admin/user-jwt/${user.email}`);
    selectedUserToken.value = response.data;
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
    const response = await api.post('/api/admin/login-as-user', { userId: user.id });

    if (response.data?.token) {
      // Guardar token del admin para poder volver
      const adminToken = localStorage.getItem('token');
      sessionStorage.setItem('admin_token', adminToken);

      // Actualizar con el token del usuario
      localStorage.setItem('token', response.data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

      addAlert(`Sesión iniciada como ${user.firstName} ${user.lastName}`, 'success');
      router.push('/');
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
    const result = await authDebugger.testLogin(testCredentials.email, testCredentials.password);
    testResult.value = result;

    if (result.success) {
      addAlert('Login exitoso', 'success');
      await checkJWTState();
    } else {
      addAlert('Login fallido', 'error');
    }
  } catch (error) {
    console.error('Error al probar login:', error);
    testResult.value = {
      success: false,
      error: error.message
    };
  } finally {
    loading.value = false;
  }
};

const testProtectedEndpoint = async () => {
  loading.value = true;
  testResult.value = null;

  try {
    const result = await authDebugger.testProtectedEndpoint();
    testResult.value = result;

    if (result.success) {
      addAlert('Endpoint protegido accesible', 'success');
    } else {
      addAlert('Acceso denegado al endpoint', 'error');
    }
  } catch (error) {
    console.error('Error al probar endpoint:', error);
    testResult.value = {
      success: false,
      error: error.message
    };
  } finally {
    loading.value = false;
  }
};

const testAdminEndpoint = async () => {
  loading.value = true;
  testResult.value = null;

  try {
    const response = await api.get('/api/admin/test');

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
    role: 'Customer',
    isActive: true
  });
  showUserModal.value = true;
};

const editUser = (user) => {
  Object.assign(editingUser, user);
  showUserModal.value = true;
};

const saveUser = async () => {
  try {
    if (editingUser.id) {
      await api.put(`/api/admin/users/${editingUser.id}`, editingUser);
      addAlert('Usuario actualizado correctamente', 'success');
    } else {
      await api.post('/api/admin/users', editingUser);
      addAlert('Usuario creado correctamente', 'success');
    }

    showUserModal.value = false;
    await fetchUsers();
  } catch (error) {
    console.error('Error al guardar usuario:', error);
    addAlert('Error al guardar usuario', 'error');
  }
};

const toggleUserStatus = async (user) => {
  try {
    await api.patch(`/api/admin/users/${user.id}/status`, {
      isActive: !user.isActive
    });

    user.isActive = !user.isActive;
    addAlert(`Usuario ${user.isActive ? 'activado' : 'desactivado'} correctamente`, 'success');
  } catch (error) {
    console.error('Error al cambiar estado del usuario:', error);
    addAlert('Error al cambiar estado del usuario', 'error');
  }
};

const closeUserModal = () => {
  showUserModal.value = false;
};

// Search and Pagination
const searchUsers = async () => {
  currentPage.value = 1;
  await fetchUsers();
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
      await api.delete('/api/admin/logs');
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
    const response = await api.get('/api/admin/export-users', {
      responseType: 'blob'
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
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
