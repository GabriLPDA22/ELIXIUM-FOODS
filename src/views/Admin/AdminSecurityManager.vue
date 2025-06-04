<!-- views/Admin/AdminSecurityManager.vue -->
<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-semibold text-gray-900">🔐 Control de Seguridad</h2>
        <p class="text-sm text-gray-600 mt-1">Gestiona la seguridad, autenticación y claves de acceso del sistema</p>
      </div>
      <div class="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-blue-600">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
        <span class="text-sm font-medium text-blue-700">Sistema Protegido</span>
      </div>
    </div>

    <!-- Sub-tabs más amigables -->
    <div class="border-b border-gray-200 mt-4">
      <div class="flex">
        <button v-for="tab in securityTabs" :key="tab.id" @click="activeTab = tab.id" :class="[
          'px-4 py-2 font-medium text-sm transition-colors flex items-center gap-2',
          activeTab === tab.id
            ? 'text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-500 hover:text-gray-700'
        ]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path :d="tab.iconPath"></path>
          </svg>
          {{ tab.name }}
        </button>
      </div>
    </div>

    <!-- Estado de la Sesión -->
    <div v-if="activeTab === 'session'" class="space-y-6 mt-6">
      <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
        <h3 class="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-blue-600">
            <path d="M9 12l2 2 4-4"></path>
            <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path>
            <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"></path>
            <path d="M3 12h6m12 0h6"></path>
          </svg>
          Estado de tu Sesión Actual
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div class="text-sm text-gray-600 mb-1">Credenciales</div>
            <div :class="['font-semibold text-lg', securityState.hasCredentials ? 'text-green-600' : 'text-red-600']">
              {{ securityState.hasCredentials ? '✓ Válidas' : '✗ Inválidas' }}
            </div>
            <div class="text-xs text-gray-500 mt-1">
              {{ securityState.hasCredentials ? 'Tu sesión está activa' : 'Necesitas iniciar sesión' }}
            </div>
          </div>

          <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div class="text-sm text-gray-600 mb-1">Renovación Automática</div>
            <div :class="['font-semibold text-lg', securityState.autoRenewal ? 'text-green-600' : 'text-amber-600']">
              {{ securityState.autoRenewal ? '✓ Activa' : '⚠ Limitada' }}
            </div>
            <div class="text-xs text-gray-500 mt-1">
              {{ securityState.autoRenewal ? 'Tu sesión se renueva automáticamente' : 'Deberás volver a iniciar sesión' }}
            </div>
          </div>

          <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div class="text-sm text-gray-600 mb-1">Estado de Seguridad</div>
            <div :class="['font-semibold text-lg', getSecurityStatusClass()]">
              {{ getSecurityStatus() }}
            </div>
            <div class="text-xs text-gray-500 mt-1">
              {{ getSecurityDescription() }}
            </div>
          </div>
        </div>
      </div>

      <!-- Clave de Acceso para copiar -->
      <div v-if="securityState.hasCredentials" class="bg-white p-6 rounded-xl border border-gray-200">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-gray-900 flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-600">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
            🔑 Clave de Acceso para APIs
          </h3>
          <button @click="copyFullAccessKey" class="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            Copiar Clave Completa
          </button>
        </div>

        <div class="bg-gray-900 text-green-400 p-4 rounded-lg relative">
          <pre class="text-sm overflow-x-auto whitespace-pre-wrap break-all font-mono">{{ formatAccessKeyForDisplay(getCurrentAccessKey()) }}</pre>
          <div class="absolute top-2 right-2 flex gap-2">
            <button @click="toggleAccessKeyVisibility"
              class="text-white opacity-75 hover:opacity-100 p-1 rounded hover:bg-gray-700"
              :title="showFullAccessKey ? 'Ocultar clave' : 'Mostrar clave completa'">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path v-if="showFullAccessKey" d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <path v-else d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle v-if="!showFullAccessKey" cx="12" cy="12" r="3"></circle>
                <line v-if="showFullAccessKey" x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            </button>
            <button @click="copyFullAccessKey" class="text-white opacity-75 hover:opacity-100 p-1 rounded hover:bg-gray-700">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
          </div>
        </div>

        <div class="mt-3 text-xs text-gray-600">
          <p><strong>🚀 Para usar en Postman o herramientas similares:</strong></p>
          <p>Header: <code class="bg-gray-100 px-1 rounded font-mono">Authorization: Bearer [tu-clave-de-acceso]</code></p>
          <p class="mt-1 text-gray-500">💡 Copia la clave completa de arriba y pégala donde dice [tu-clave-de-acceso]</p>
        </div>
      </div>

      <!-- Información detallada de la sesión -->
      <div v-if="securityState.sessionInfo" class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="font-semibold text-gray-900 flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-600">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            Detalles de tu Sesión
          </h3>
          <button @click="copySessionInfo" class="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            Copiar Info
          </button>
        </div>

        <div class="bg-gray-50 p-4 rounded-lg">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-white p-3 rounded border">
              <h4 class="font-medium text-gray-900 mb-2 text-sm">Información de Usuario</h4>
              <div class="space-y-1 text-xs">
                <div><span class="text-gray-600">Email:</span> <span class="font-mono">{{ securityState.sessionInfo.email || 'No disponible' }}</span></div>
                <div><span class="text-gray-600">Rol:</span> <span class="font-semibold text-blue-600">{{ securityState.sessionInfo.role || 'Usuario' }}</span></div>
                <div><span class="text-gray-600">ID:</span> <span class="font-mono text-gray-500">{{ securityState.sessionInfo.userId || 'N/A' }}</span></div>
              </div>
            </div>
            <div class="bg-white p-3 rounded border">
              <h4 class="font-medium text-gray-900 mb-2 text-sm">Información de Sesión</h4>
              <div class="space-y-1 text-xs">
                <div><span class="text-gray-600">Iniciada:</span> <span class="font-mono">{{ formatDateTime(securityState.sessionInfo.issuedAt) }}</span></div>
                <div><span class="text-gray-600">Expira:</span> <span class="font-mono">{{ formatDateTime(securityState.sessionInfo.expiresAt) }}</span></div>
                <div><span class="text-gray-600">Tiempo restante:</span> <span class="font-semibold" :class="getTimeRemainingClass()">{{ getTimeRemaining() }}</span></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Acciones de mantenimiento -->
        <div class="bg-white p-6 rounded-xl border border-gray-200">
          <h4 class="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-600">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            Herramientas de Mantenimiento
          </h4>
          <div class="flex flex-wrap gap-3">
            <button @click="validateSession" :disabled="loading"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 text-sm font-medium transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 12l2 2 4-4"></path>
                <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path>
                <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"></path>
                <path d="M3 12h6m12 0h6"></path>
              </svg>
              {{ loading ? 'Verificando...' : 'Verificar Estado' }}
            </button>
            <button @click="renewSession" :disabled="loading"
              class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2 text-sm font-medium transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M23 4v6h-6"></path>
                <path d="M1 20v-6h6"></path>
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
              </svg>
              {{ loading ? 'Renovando...' : 'Renovar Sesión' }}
            </button>
            <button @click="clearSession"
              class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2 text-sm font-medium transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Acceso de Usuarios -->
    <div v-if="activeTab === 'userAccess'" class="space-y-6 mt-6">
      <div class="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl">
        <h3 class="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-purple-600">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="8.5" cy="7" r="4"></circle>
            <line x1="20" y1="8" x2="20" y2="14"></line>
            <line x1="23" y1="11" x2="17" y2="11"></line>
          </svg>
          Gestión de Acceso por Usuario
        </h3>
        <p class="text-sm text-gray-600">Busca y verifica el acceso de usuarios específicos</p>
      </div>

      <div class="bg-white p-6 rounded-xl border border-gray-200">
        <div class="flex gap-4 mb-6">
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">Buscar usuario por email</label>
            <input v-model="userSearchQuery" type="email" placeholder="ejemplo@correo.com"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div class="flex items-end">
            <button @click="searchUserAccess" :disabled="!userSearchQuery"
              class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 font-medium">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="M21 21l-4.35-4.35"></path>
              </svg>
              Buscar
            </button>
          </div>
        </div>

        <!-- Resultado de búsqueda de usuario -->
        <div v-if="selectedUserAccess" class="bg-gray-50 p-6 rounded-lg border">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h4 class="font-semibold text-gray-900 text-lg">
                {{ selectedUserAccess.user.firstName }} {{ selectedUserAccess.user.lastName }}
              </h4>
              <p class="text-gray-600">{{ selectedUserAccess.user.email }}</p>
            </div>
            <div class="text-right">
              <span :class="['px-3 py-1 rounded-full text-sm font-medium',
                selectedUserAccess.hasValidAccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800']">
                {{ selectedUserAccess.hasValidAccess ? '✓ Acceso Válido' : '✗ Sin Acceso' }}
              </span>
              <div class="text-xs text-gray-500 mt-1">
                Verificado {{ formatDateTime(new Date()) }}
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div class="bg-white p-3 rounded border">
              <div class="text-sm text-gray-600 mb-1">Estado del Usuario</div>
              <div class="font-semibold" :class="selectedUserAccess.user.isActive ? 'text-green-600' : 'text-red-600'">
                {{ selectedUserAccess.user.isActive ? 'Activo' : 'Inactivo' }}
              </div>
            </div>
            <div class="bg-white p-3 rounded border">
              <div class="text-sm text-gray-600 mb-1">Rol</div>
              <div class="font-mono text-sm text-gray-800">
                {{ selectedUserAccess.user.role || 'Usuario' }}
              </div>
            </div>
          </div>

          <div class="flex gap-3">
            <button @click="testUserAccess(selectedUserAccess)"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm font-medium">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 12l2 2 4-4"></path>
                <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path>
                <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"></path>
                <path d="M3 12h6m12 0h6"></path>
              </svg>
              Probar Acceso
            </button>
            <button @click="simulateUserLogin(selectedUserAccess.user)"
              class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2 text-sm font-medium">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                <polyline points="10 17 15 12 10 7"></polyline>
                <line x1="15" y1="12" x2="3" y2="12"></line>
              </svg>
              Acceder como Usuario
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Diagnósticos del Sistema -->
    <div v-if="activeTab === 'diagnostics'" class="space-y-6 mt-6">
      <div class="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-xl">
        <h3 class="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-green-600">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
          </svg>
          Diagnósticos y Pruebas
        </h3>
        <p class="text-sm text-gray-600">Ejecuta pruebas para verificar el correcto funcionamiento del sistema</p>
      </div>

      <div class="bg-white p-6 rounded-xl border border-gray-200">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email de Prueba</label>
            <input v-model="testCredentials.email" type="email" placeholder="admin@ejemplo.com"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Contraseña de Prueba</label>
            <input v-model="testCredentials.password" type="password" placeholder="••••••••"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button @click="testLogin" :disabled="loading"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 text-sm font-medium">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
              <polyline points="10 17 15 12 10 7"></polyline>
              <line x1="15" y1="12" x2="3" y2="12"></line>
            </svg>
            {{ loading ? 'Probando...' : 'Probar Inicio de Sesión' }}
          </button>

          <button @click="testUserEndpoint" :disabled="loading"
            class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2 text-sm font-medium">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="20" y1="8" x2="20" y2="14"></line>
              <line x1="23" y1="11" x2="17" y2="11"></line>
            </svg>
            {{ loading ? 'Probando...' : 'Probar Acceso Usuario' }}
          </button>

          <button @click="testAdminEndpoint" :disabled="loading"
            class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2 text-sm font-medium">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
            </svg>
            {{ loading ? 'Probando...' : 'Probar Acceso Admin' }}
          </button>
        </div>
      </div>

      <!-- Resultados de diagnóstico -->
      <div v-if="diagnosticResult" class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div class="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h4 class="font-semibold flex items-center gap-2">
            <span v-if="diagnosticResult.success" class="text-green-600">✅</span>
            <span v-else class="text-red-600">❌</span>
            Resultado del Diagnóstico
          </h4>
          <div class="text-sm text-gray-500">
            Estado: <span class="font-mono">{{ diagnosticResult.status || 'N/A' }}</span>
          </div>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div class="text-sm text-gray-600 mb-1">Estado</div>
              <div :class="['font-semibold', diagnosticResult.success ? 'text-green-600' : 'text-red-600']">
                {{ diagnosticResult.success ? 'Exitoso' : 'Error' }}
              </div>
            </div>
            <div>
              <div class="text-sm text-gray-600 mb-1">Mensaje</div>
              <div class="font-medium text-gray-800">
                {{ diagnosticResult.message || diagnosticResult.error || 'Sin mensaje' }}
              </div>
            </div>
          </div>
          <details class="mt-4">
            <summary class="cursor-pointer text-sm text-gray-600 hover:text-gray-800">Ver detalles técnicos</summary>
            <pre class="mt-2 text-xs bg-gray-900 text-green-400 p-3 rounded overflow-x-auto">{{ JSON.stringify(diagnosticResult, null, 2) }}</pre>
          </details>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '@/services/api';
import authDebugger from '@/services/authDebugger';

// Props
const props = defineProps({
  users: {
    type: Array,
    required: true
  }
});

// Emits
const emit = defineEmits(['add-alert']);

const router = useRouter();

// Estados
const loading = ref(false);
const activeTab = ref('session');
const showFullAccessKey = ref(false);

// Estados de seguridad (renombrados)
const securityState = reactive({
  hasCredentials: false,
  autoRenewal: false,
  sessionInfo: null,
  isValid: false
});

const userSearchQuery = ref('');
const selectedUserAccess = ref(null);
const testCredentials = reactive({ email: '', password: '' });
const diagnosticResult = ref(null);

const securityTabs = [
  {
    id: 'session',
    name: 'Mi Sesión',
    iconPath: 'M9 12l2 2 4-4m6-2c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3m-6 0c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3m-6 0h6m12 0h6'
  },
  {
    id: 'userAccess',
    name: 'Acceso de Usuarios',
    iconPath: 'M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M8.5 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm11.5 1v6m3-3h-6'
  },
  {
    id: 'diagnostics',
    name: 'Diagnósticos',
    iconPath: 'M22 12h-4l-3 9L9 3l-3 9H2'
  }
];

// Ciclo de vida
onMounted(() => {
  checkSecurityState();
  // Actualizar cada 30 segundos
  const interval = setInterval(checkSecurityState, 30000);
  onBeforeUnmount(() => clearInterval(interval));
});

// Métodos principales
const checkSecurityState = async () => {
  const state = authDebugger.checkAuthState();
  Object.assign(securityState, {
    hasCredentials: state.hasToken,
    autoRenewal: state.hasRefreshToken,
    sessionInfo: state.tokenInfo ? {
      email: state.tokenInfo.payload?.email,
      role: state.tokenInfo.payload?.role,
      userId: state.tokenInfo.payload?.nameid,
      issuedAt: state.tokenInfo.payload?.iat ? new Date(state.tokenInfo.payload.iat * 1000) : null,
      expiresAt: state.tokenInfo.payload?.exp ? new Date(state.tokenInfo.payload.exp * 1000) : null
    } : null,
    isValid: state.tokenInfo && !state.tokenInfo.isExpired
  });
};

const getCurrentAccessKey = () => {
  return localStorage.getItem('token') || '';
};

const formatAccessKeyForDisplay = (accessKey) => {
  if (!accessKey) return 'No hay clave de acceso disponible';

  if (showFullAccessKey.value) {
    return accessKey;
  } else {
    if (accessKey.length > 50) {
      return `${accessKey.substring(0, 20)}...[clave oculta]...${accessKey.substring(accessKey.length - 20)}`;
    }
    return accessKey;
  }
};

const toggleAccessKeyVisibility = () => {
  showFullAccessKey.value = !showFullAccessKey.value;
};

const copyFullAccessKey = async () => {
  try {
    const accessKey = getCurrentAccessKey();
    if (!accessKey) {
      emit('add-alert', 'No hay clave de acceso disponible para copiar', 'error');
      return;
    }

    await navigator.clipboard.writeText(accessKey);
    emit('add-alert', 'Clave de acceso copiada al portapapeles', 'success');
  } catch (error) {
    emit('add-alert', 'Error al copiar la clave de acceso', 'error');
  }
};

const getSecurityStatus = () => {
  if (!securityState.hasCredentials) return 'Sin Autenticar';
  if (securityState.sessionInfo?.expiresAt && new Date() > securityState.sessionInfo.expiresAt) return 'Sesión Expirada';
  if (securityState.isValid) return 'Seguro';
  return 'Verificación Requerida';
};

const getSecurityStatusClass = () => {
  const status = getSecurityStatus();
  if (status === 'Seguro') return 'text-green-600';
  if (status === 'Sin Autenticar' || status === 'Sesión Expirada') return 'text-red-600';
  return 'text-amber-600';
};

const getSecurityDescription = () => {
  const status = getSecurityStatus();
  const descriptions = {
    'Seguro': 'Tu sesión está activa y protegida',
    'Sin Autenticar': 'Necesitas iniciar sesión',
    'Sesión Expirada': 'Tu sesión ha caducado',
    'Verificación Requerida': 'Se requiere verificación adicional'
  };
  return descriptions[status] || 'Estado desconocido';
};

const getTimeRemaining = () => {
  if (!securityState.sessionInfo?.expiresAt) return 'No disponible';

  const now = new Date();
  const expires = new Date(securityState.sessionInfo.expiresAt);
  const diff = expires - now;

  if (diff <= 0) return 'Expirada';

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

const getTimeRemainingClass = () => {
  if (!securityState.sessionInfo?.expiresAt) return 'text-gray-500';

  const now = new Date();
  const expires = new Date(securityState.sessionInfo.expiresAt);
  const diff = expires - now;
  const minutes = diff / (1000 * 60);

  if (minutes <= 0) return 'text-red-600';
  if (minutes < 30) return 'text-amber-600';
  return 'text-green-600';
};

// Acciones de mantenimiento
const validateSession = async () => {
  loading.value = true;
  try {
    const response = await api.post('/api/Auth/validate-token', {
      token: localStorage.getItem('token')
    });

    const isValid = response.data.isValid;
    diagnosticResult.value = {
      success: isValid,
      message: isValid ? 'Tu sesión está validada correctamente' : 'Tu sesión no es válida o ha expirado',
      status: isValid ? 200 : 401,
      details: 'Verificación de estado de sesión'
    };
    await checkSecurityState();
    emit('add-alert', diagnosticResult.value.message, isValid ? 'success' : 'error');
  } catch (error) {
    diagnosticResult.value = {
      success: false,
      error: error.message,
      status: error.response?.status,
      details: 'Error durante la verificación'
    };
    emit('add-alert', 'Error al verificar la sesión', 'error');
  } finally {
    loading.value = false;
  }
};

const renewSession = async () => {
  loading.value = true;
  try {
    const refreshKey = localStorage.getItem('refreshToken');
    if (!refreshKey) {
      throw new Error('No hay información de renovación disponible');
    }

    const response = await api.post('/api/Auth/refresh-token', { refreshToken: refreshKey });

    if (response.data.success) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);

      diagnosticResult.value = {
        success: true,
        message: 'Sesión renovada exitosamente',
        details: 'Nueva clave de acceso establecida'
      };

      emit('add-alert', 'Tu sesión ha sido renovada', 'success');
    } else {
      diagnosticResult.value = {
        success: false,
        message: response.data.message || 'No se pudo renovar la sesión'
      };
      emit('add-alert', 'Error al renovar la sesión', 'error');
    }

    await checkSecurityState();
  } catch (error) {
    diagnosticResult.value = {
      success: false,
      error: error.message
    };
    emit('add-alert', 'Error al renovar la sesión', 'error');
  } finally {
    loading.value = false;
  }
};

const clearSession = async () => {
  if (!confirm('¿Estás seguro de que quieres cerrar tu sesión actual?')) return;

  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  delete api.defaults.headers.common['Authorization'];

  diagnosticResult.value = {
    success: true,
    message: 'Sesión cerrada correctamente',
    details: 'Todas las credenciales han sido eliminadas'
  };

  await checkSecurityState();
  emit('add-alert', 'Sesión cerrada correctamente', 'warning');
};

// Gestión de usuarios
const searchUserAccess = async () => {
  if (!userSearchQuery.value) return;

  try {
    const matchingUsers = props.users.filter(user =>
      user.email.toLowerCase().includes(userSearchQuery.value.toLowerCase())
    );

    if (matchingUsers.length > 0) {
      const user = matchingUsers[0];
      selectedUserAccess.value = {
        user,
        hasValidAccess: user.isActive !== false
      };
    } else {
      emit('add-alert', 'Usuario no encontrado', 'error');
      selectedUserAccess.value = null;
    }
  } catch (error) {
    console.error('Error buscando usuario:', error);
    emit('add-alert', 'Error al buscar usuario', 'error');
    selectedUserAccess.value = null;
  }
};

const testUserAccess = async (userAccess) => {
  loading.value = true;
  try {
    diagnosticResult.value = {
      success: userAccess.hasValidAccess,
      message: userAccess.hasValidAccess ? 'El usuario tiene acceso válido' : 'El usuario no tiene acceso válido',
      details: `Prueba para ${userAccess.user.email}`
    };

    emit('add-alert', diagnosticResult.value.message, userAccess.hasValidAccess ? 'success' : 'error');
  } catch (error) {
    diagnosticResult.value = {
      success: false,
      error: error.message
    };
    emit('add-alert', 'Error al probar acceso', 'error');
  } finally {
    loading.value = false;
  }
};

const simulateUserLogin = async (user) => {
  if (!confirm(`¿Estás seguro de que quieres acceder como ${user.firstName} ${user.lastName}?`)) {
    return;
  }

  try {
    const response = await api.post('/api/Auth/login', {
      email: user.email,
      password: 'admin123' // Esto debería ser manejado de manera más segura
    });

    if (response.data?.success && response.data?.token) {
      const adminAccessKey = localStorage.getItem('token');
      sessionStorage.setItem('admin_access_key', adminAccessKey);

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

      emit('add-alert', `Ahora estás navegando como ${user.firstName} ${user.lastName}`, 'success');
      router.push('/');
    } else {
      emit('add-alert', 'Error al acceder como usuario: ' + (response.data?.message || 'Credenciales inválidas'), 'error');
    }
  } catch (error) {
    emit('add-alert', 'Error al cambiar de usuario', 'error');
  }
};

// Diagnósticos
const testLogin = async () => {
  loading.value = true;
  diagnosticResult.value = null;

  try {
    const response = await api.post('/api/Auth/login', {
      email: testCredentials.email,
      password: testCredentials.password
    });

    if (response.data.success) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

      diagnosticResult.value = {
        success: true,
        message: 'Inicio de sesión exitoso',
        user: {
          email: response.data.email,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          role: response.data.role
        },
        details: 'Credenciales validadas y clave de acceso generada correctamente'
      };

      emit('add-alert', 'Inicio de sesión exitoso', 'success');
    } else {
      diagnosticResult.value = {
        success: false,
        message: response.data.message || 'Credenciales incorrectas'
      };
      emit('add-alert', 'Error en el inicio de sesión', 'error');
    }

    await checkSecurityState();
  } catch (error) {
    diagnosticResult.value = {
      success: false,
      error: error.response?.data?.message || error.message,
      status: error.response?.status
    };
    emit('add-alert', 'Error al conectar con el sistema', 'error');
  } finally {
    loading.value = false;
  }
};

const testUserEndpoint = async () => {
  loading.value = true;
  diagnosticResult.value = null;

  try {
    const response = await api.get('/api/Users/me');
    diagnosticResult.value = {
      success: true,
      status: response.status,
      message: 'Acceso de usuario verificado correctamente',
      data: response.data
    };
    emit('add-alert', 'Sistema de usuarios funcionando', 'success');
  } catch (error) {
    diagnosticResult.value = {
      success: false,
      status: error.response?.status,
      error: error.response?.data || error.message,
      message: 'No se pudo acceder a la información de usuario'
    };
    emit('add-alert', 'Error en el sistema de usuarios', 'error');
  } finally {
    loading.value = false;
  }
};

const testAdminEndpoint = async () => {
  loading.value = true;
  diagnosticResult.value = null;

  try {
    const response = await api.get('/api/Users');
    diagnosticResult.value = {
      success: true,
      status: response.status,
      message: 'Acceso administrativo verificado correctamente',
      data: response.data
    };
    emit('add-alert', 'Permisos de administrador confirmados', 'success');
  } catch (error) {
    diagnosticResult.value = {
      success: false,
      status: error.response?.status,
      error: error.response?.data || error.message,
      message: 'No tienes permisos de administrador o hay un error'
    };
    emit('add-alert', 'Error en permisos administrativos', 'error');
  } finally {
    loading.value = false;
  }
};

// Utilidades
const copySessionInfo = async () => {
  try {
    const info = {
      email: securityState.sessionInfo?.email,
      role: securityState.sessionInfo?.role,
      expiresAt: securityState.sessionInfo?.expiresAt,
      timeRemaining: getTimeRemaining()
    };
    await navigator.clipboard.writeText(JSON.stringify(info, null, 2));
    emit('add-alert', 'Información de sesión copiada', 'success');
  } catch (error) {
    emit('add-alert', 'Error al copiar información', 'error');
  }
};

const formatDateTime = (date) => {
  if (!date) return 'No disponible';
  return new Date(date).toLocaleString('es-ES');
};
</script>
