<!-- views/admin/AdminJwtDebug.vue -->
<template>
  <div class="space-y-6">
    <h2 class="text-xl font-semibold text-gray-900">Sistema de Autenticación JWT</h2>

    <!-- Sub-tabs para JWT Debug -->
    <div class="border-b border-gray-200 mt-4">
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
    <div v-if="activeJwtTab === 'global'" class="space-y-6 mt-6">
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
    <div v-if="activeJwtTab === 'userTokens'" class="space-y-6 mt-6">
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
    <div v-if="activeJwtTab === 'test'" class="space-y-6 mt-6">
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
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '@/services/api';
import authDebugger from '@/services/authDebugger';
import authService from '@/services/authService';

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
const activeJwtTab = ref('global');

// JWT Debug (mantenemos la estructura base)
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

// Ciclo de vida
onMounted(() => {
  checkJWTState();
  // Actualizar cada 30 segundos
  const interval = setInterval(checkJWTState, 30000);
  onBeforeUnmount(() => clearInterval(interval));
});

// Métodos
const checkJWTState = async () => {
  const state = authDebugger.checkAuthState();
  Object.assign(jwtState, {
    token: state.hasToken ? localStorage.getItem('token') : null,
    refreshToken: state.hasRefreshToken ? localStorage.getItem('refreshToken') : null,
    tokenInfo: state.tokenInfo,
    isValid: state.tokenInfo && !state.tokenInfo.isExpired
  });
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

const formatToken = (token) => {
  if (!token) return '';
  if (token.length > 50) {
    return `${token.substring(0, 20)}...${token.substring(token.length - 20)}`;
  }
  return token;
};

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

      emit('add-alert', 'Token refrescado exitosamente', 'success');
    } else {
      testResult.value = {
        success: false,
        message: response.data.message
      };

      emit('add-alert', 'Error al refrescar token: ' + response.data.message, 'error');
    }

    await checkJWTState();
  } catch (error) {
    testResult.value = {
      success: false,
      error: error.message
    };
    emit('add-alert', 'Error al refrescar token', 'error');
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
  emit('add-alert', 'Datos de autenticación eliminados', 'warning');
};

const searchUserToken = async () => {
  if (!userTokenSearch.value) return;

  try {
    // Buscar usuario por email
    const matchingUsers = props.users.filter(user => 
      user.email.toLowerCase().includes(userTokenSearch.value.toLowerCase())
    );

    if (matchingUsers.length > 0) {
      const user = matchingUsers[0];

      // Simulamos un token para este usuario
      // En una implementación real, obtendrías el token real del sistema
      selectedUserToken.value = {
        user,
        token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIke3VzZXIuaWR9IiwiZW1haWwiOiIke3VzZXIuZW1haWx9Iiwicm9sZSI6IiR7dXNlci5yb2xlfSIsIm5iZiI6MTcxNTM0MjM0NSwiZXhwIjoxNzE1MzQ5NTQ1LCJpYXQiOjE3MTUzNDIzNDV9.Gc8iwoJ6OyTOxlXeqmw8Z0xSGxCbA5c9VLfyUNLxsUw`,
        isValid: true
      };
    } else {
      emit('add-alert', 'Usuario no encontrado', 'error');
      selectedUserToken.value = null;
    }
  } catch (error) {
    console.error('Error buscando JWT:', error);
    emit('add-alert', 'Usuario no encontrado', 'error');
    selectedUserToken.value = null;
  }
};

const copyToken = async (token) => {
  try {
    await navigator.clipboard.writeText(token);
    emit('add-alert', 'Token copiado al portapapeles', 'success');
  } catch (error) {
    emit('add-alert', 'Error al copiar token', 'error');
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

    emit('add-alert', 'Token funcionó correctamente', 'success');
  } catch (error) {
    testResult.value = {
      success: false,
      status: error.response?.status,
      error: error.response?.data || error.message
    };

    emit('add-alert', 'Error al usar el token', 'error');
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

      emit('add-alert', `Sesión iniciada como ${user.firstName} ${user.lastName}`, 'success');
      router.push('/');
    } else {
      emit('add-alert', 'Error al iniciar sesión: ' + (response.data?.message || 'Credenciales inválidas'), 'error');
    }
  } catch (error) {
    emit('add-alert', 'Error al iniciar sesión como usuario', 'error');
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

      emit('add-alert', 'Login exitoso', 'success');
    } else {
      testResult.value = {
        success: false,
        message: response.data.message
      };

      emit('add-alert', 'Login fallido: ' + response.data.message, 'error');
    }

    await checkJWTState();
  } catch (error) {
    console.error('Error al probar login:', error);
    testResult.value = {
      success: false,
      error: error.response?.data?.message || error.message,
      status: error.response?.status
    };

    emit('add-alert', 'Error al iniciar sesión', 'error');
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

    emit('add-alert', 'Endpoint protegido accesible', 'success');
  } catch (error) {
    console.error('Error al probar endpoint:', error);
    testResult.value = {
      success: false,
      status: error.response?.status,
      error: error.response?.data || error.message
    };

    emit('add-alert', 'Acceso denegado al endpoint', 'error');
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

    emit('add-alert', 'Endpoint de admin accesible', 'success');
  } catch (error) {
    console.error('Error al probar endpoint admin:', error);
    testResult.value = {
      success: false,
      status: error.response?.status,
      error: error.response?.data || error.message
    };

    emit('add-alert', 'Acceso denegado al endpoint de admin', 'error');
  } finally {
    loading.value = false;
  }
};

// Utilidades
const formatDateTime = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleString('es-ES');
};
</script>