<!-- views/admin/AdminUsers.vue -->
<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-semibold text-gray-900">Gestión de Usuarios</h2>
      <button @click="addUser" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
        <span class="mr-1">+</span> Nuevo Usuario
      </button>
    </div>

    <!-- Filtros simplificados -->
    <div class="bg-gray-50 p-4 rounded-lg">
      <div class="flex flex-wrap gap-4 items-center">
        <!-- Búsqueda -->
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

        <!-- Filtro por rol -->
        <select v-model="userFilter"
          class="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
          <option value="">Todos los roles</option>
          <option value="Admin">Administradores</option>
          <option value="Customer">Clientes</option>
          <option value="Restaurant">Restaurantes</option>
          <option value="DeliveryPerson">Repartidores</option>
          <option value="Business">Business</option>
        </select>

        <!-- Filtro por estado -->
        <select v-model="statusFilter"
          class="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
          <option value="">Todos los estados</option>
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
        </select>

        <button @click="searchUsers" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          Buscar
        </button>

        <div class="text-sm text-gray-600">
          Mostrando {{ filteredUsers.length }} de {{ totalUsers }} usuarios
        </div>
      </div>
    </div>

    <!-- Tabla de usuarios -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th @click="setSortBy('id')"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
              ID
              <span v-if="sortBy === 'id'" class="ml-1">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
            </th>
            <th @click="setSortBy('firstName')"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
              Nombre
              <span v-if="sortBy === 'firstName'" class="ml-1">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
            </th>
            <th @click="setSortBy('email')"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
              Email
              <span v-if="sortBy === 'email'" class="ml-1">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
            </th>
            <th @click="setSortBy('role')"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
              Rol
              <span v-if="sortBy === 'role'" class="ml-1">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
            <th @click="setSortBy('createdAt')"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
              Registro
              <span v-if="sortBy === 'createdAt'" class="ml-1">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clave Secreta
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="user in paginatedUsers" :key="user.id" class="hover:bg-gray-50">
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
              <button @click="showUserSecret(user)" class="text-blue-600 hover:text-blue-900 p-1"
                title="Ver clave secreta">
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
                <button @click="editUser(user)" class="text-indigo-600 hover:text-indigo-900" title="Editar">
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button @click="toggleUserStatus(user)"
                  :class="user.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'"
                  :title="user.isActive ? 'Desactivar' : 'Activar'">
                  <!-- Icono 'desactivar' (círculo + X) -->
                  <svg v-if="user.isActive" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                      d="M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18zm-3-6l6-6m0 6l-6-6" />
                  </svg>

                  <!-- Icono 'activar' (círculo + check) -->
                  <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>

              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginación simplificada -->
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
            <input v-model="editingUser.email" type="email" required :disabled="editingUser.id"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100">
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
              <option value="Business">Business</option>
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
            <button type="submit" :disabled="loading"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
              {{ loading ? 'Guardando...' : (editingUser.id ? 'Actualizar' : 'Crear') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de Clave Secreta -->
    <div v-if="showSecretModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl max-w-2xl w-full mx-4 overflow-hidden">
        <div class="bg-blue-50 px-6 py-4 border-b border-blue-200 flex justify-between items-center">
          <h3 class="text-lg font-medium text-blue-900">
            🔐 Clave Secreta de {{ selectedUserForSecret?.firstName }} {{ selectedUserForSecret?.lastName }}
          </h3>
          <button @click="closeSecretModal" class="text-gray-400 hover:text-gray-500">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="p-6">
          <div class="mb-4">
            <div class="bg-gray-50 p-4 rounded-lg text-sm">
              <strong>Usuario:</strong> {{ selectedUserForSecret?.firstName }} {{ selectedUserForSecret?.lastName }}<br>
              <strong>Email:</strong> {{ selectedUserForSecret?.email }}<br>
              <strong>Rol:</strong> {{ selectedUserForSecret?.role }}<br>
              <strong>ID:</strong> {{ selectedUserForSecret?.id }}
            </div>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Token JWT (simulado):</label>
            <div class="bg-gray-900 text-green-400 p-4 rounded-lg relative">
              <pre
                class="text-sm overflow-x-auto whitespace-pre-wrap break-all">{{ generateMockJWT(selectedUserForSecret) }}</pre>
              <button @click="copyToClipboard(generateMockJWT(selectedUserForSecret))"
                class="absolute top-2 right-2 text-white opacity-75 hover:opacity-100 bg-gray-700 px-2 py-1 rounded text-xs">
                📋 Copiar
              </button>
            </div>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Información del Token:</label>
            <div class="bg-gray-50 p-4 rounded-lg text-sm">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <strong>Algoritmo:</strong> HS256<br>
                  <strong>Tipo:</strong> JWT<br>
                  <strong>Emisor:</strong> UberEats-API
                </div>
                <div>
                  <strong>Expiración:</strong> 2 horas<br>
                  <strong>Emitido:</strong> {{ new Date().toLocaleString() }}<br>
                  <strong>Estado:</strong> <span class="text-green-600">Válido</span>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-4">
            <button @click="goToJWTDebug" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              🔧 Ir a ManagerSecurity
            </button>
            <button @click="closeSecretModal"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación de eliminación -->
    <div v-if="showConfirmDelete" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl max-w-md w-full mx-4 overflow-hidden">
        <div class="bg-red-50 px-6 py-4 border-b border-red-200 flex justify-between items-center">
          <h3 class="text-lg font-medium text-red-600">Confirmar Eliminación</h3>
          <button @click="cancelDelete" class="text-gray-400 hover:text-gray-500">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="p-6">
          <div class="mb-6">
            <p class="text-sm text-gray-600 mb-2">¿Estás seguro de que deseas eliminar el siguiente usuario?</p>
            <div class="bg-gray-50 p-4 rounded-lg text-sm">
              <strong>Usuario:</strong> {{ itemToDelete?.firstName }} {{ itemToDelete?.lastName }} ({{
                itemToDelete?.email }})
            </div>
            <p class="text-sm text-red-600 mt-2">Esta acción no se puede deshacer.</p>
          </div>

          <div class="flex justify-end gap-4">
            <button @click="cancelDelete"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
              Cancelar
            </button>
            <button @click="handleDelete" :disabled="loading"
              class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50">
              {{ loading ? 'Eliminando...' : 'Eliminar' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { api } from '@/services/api';

// Props
const props = defineProps({
  users: {
    type: Array,
    required: true
  }
});

// Emits
const emit = defineEmits(['refresh', 'update', 'add-alert', 'view-user-secret', 'go-to-jwt-debug']);

// Estados simplificados
const userSearch = ref('');
const userFilter = ref('');
const statusFilter = ref('');
const sortBy = ref('id');
const sortDirection = ref('asc');
const currentPage = ref(1);
const usersPerPage = 10;

// Estados de UI
const loading = ref(false);
const showUserModal = ref(false);
const showConfirmDelete = ref(false);
const showSecretModal = ref(false);
const selectedUserForSecret = ref(null);
const itemToDelete = ref(null);

const editingUser = reactive({
  id: null,
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  role: 'Customer',
  isActive: true,
  password: ''
});

// Computed para los usuarios filtrados (simplificado)
const filteredUsers = computed(() => {
  let filtered = [...props.users];

  // Filtro por búsqueda
  if (userSearch.value) {
    const search = userSearch.value.toLowerCase();
    filtered = filtered.filter(user =>
      user.firstName.toLowerCase().includes(search) ||
      user.lastName.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search)
    );
  }

  // Filtro por rol
  if (userFilter.value) {
    filtered = filtered.filter(user => user.role === userFilter.value);
  }

  // Filtro por estado
  if (statusFilter.value) {
    filtered = filtered.filter(user => {
      if (statusFilter.value === 'active') return user.isActive !== false;
      if (statusFilter.value === 'inactive') return user.isActive === false;
      return true;
    });
  }

  // Ordenación
  filtered.sort((a, b) => {
    let valueA = a[sortBy.value];
    let valueB = b[sortBy.value];

    // Manejo especial para fechas
    if (sortBy.value === 'createdAt' || sortBy.value === 'updatedAt') {
      valueA = new Date(valueA || 0);
      valueB = new Date(valueB || 0);
    }

    // Manejo especial para strings
    if (typeof valueA === 'string') {
      valueA = valueA.toLowerCase();
      valueB = valueB.toLowerCase();
    }

    if (valueA < valueB) return sortDirection.value === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortDirection.value === 'asc' ? 1 : -1;
    return 0;
  });

  return filtered;
});

// Computed para la paginación
const totalUsers = computed(() => props.users.length);
const totalPages = computed(() => Math.ceil(filteredUsers.value.length / usersPerPage));

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * usersPerPage;
  const end = start + usersPerPage;
  return filteredUsers.value.slice(start, end);
});

// Métodos simplificados
const searchUsers = async () => {
  currentPage.value = 1;
  console.log('🔍 Iniciando búsqueda de usuarios...');
  console.log('📊 Filtros aplicados:', {
    búsqueda: userSearch.value,
    rol: userFilter.value,
    estado: statusFilter.value
  });

  emit('refresh');
};

// Método para ordenación
const setSortBy = (field) => {
  if (sortBy.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = field;
    sortDirection.value = 'asc';
  }
};

// Métodos de usuario
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
    isActive: user.isActive !== undefined ? user.isActive : true,
    password: ''
  });
  showUserModal.value = true;
};

// ✅ CORREGIDO: Cambiar endpoint de /api/Users a /api/User
const saveUser = async () => {
  loading.value = true;
  try {
    if (editingUser.id) {
      // Actualizar usuario existente
      const userData = {
        firstName: editingUser.firstName,
        lastName: editingUser.lastName,
        phoneNumber: editingUser.phoneNumber,
        role: editingUser.role,
        isActive: editingUser.isActive
      };

      console.log(`🔄 Actualizando usuario ${editingUser.id}...`, userData);
      const response = await api.put(`/api/User/${editingUser.id}`, userData);

      // Actualizar en la lista local
      const index = props.users.findIndex(u => u.id === editingUser.id);
      if (index !== -1) {
        // Mantener datos existentes y aplicar cambios
        Object.assign(props.users[index], { ...props.users[index], ...userData });
        console.log('✅ Usuario actualizado en lista local');
      }

      emit('add-alert', 'Usuario actualizado correctamente', 'success');
    } else {
      // Crear nuevo usuario
      const newUserData = {
        email: editingUser.email,
        password: editingUser.password,
        firstName: editingUser.firstName,
        lastName: editingUser.lastName,
        phoneNumber: editingUser.phoneNumber,
        role: editingUser.role,
        isActive: editingUser.isActive
      };

      console.log('📝 Creando nuevo usuario...', { ...newUserData, password: '[HIDDEN]' });
      const response = await api.post('/api/User', newUserData);

      // Manejar diferentes estructuras de respuesta
      let createdUser;
      if (response.data?.data) {
        createdUser = response.data.data;
      } else if (response.data) {
        createdUser = response.data;
      }

      if (createdUser) {
        props.users.push(createdUser);
        console.log('✅ Usuario creado y añadido a lista local');
      }

      emit('add-alert', 'Usuario creado correctamente', 'success');
    }

    showUserModal.value = false;
    emit('update');

  } catch (error) {
    console.error('❌ Error al guardar usuario:', error);
    console.error('Details:', {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    });

    const errorMessage = error.response?.data?.message ||
                        error.response?.data?.errors?.join(', ') ||
                        error.message ||
                        'Error desconocido';

    emit('add-alert', 'Error al guardar usuario: ' + errorMessage, 'error');
  } finally {
    loading.value = false;
  }
};

// ✅ CORREGIDO: Mejorar toggle de estado de usuario
const toggleUserStatus = async (user) => {
  loading.value = true;
  try {
    console.log(`🔄 Cambiando estado de usuario ${user.id} de ${user.isActive} a ${!user.isActive}...`);

    // Preparar datos para actualización
    const userData = {
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber || '',
      role: user.role,
      isActive: !user.isActive // Toggle del estado
    };

    const response = await api.put(`/api/User/${user.id}`, userData);

    // Actualizar el usuario en la lista local
    const index = props.users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      Object.assign(props.users[index], userData);
      console.log('✅ Estado actualizado en lista local');
    }

    const statusText = userData.isActive ? 'activado' : 'desactivado';
    emit('add-alert', `Usuario ${statusText} correctamente`, 'success');
    emit('update');

  } catch (error) {
    console.error('❌ Error al cambiar estado del usuario:', error);

    const errorMessage = error.response?.data?.message ||
                        error.message ||
                        'Error desconocido al cambiar estado';

    emit('add-alert', 'Error al cambiar estado del usuario: ' + errorMessage, 'error');
  } finally {
    loading.value = false;
  }
};

// Método para mostrar la clave secreta
const showUserSecret = (user) => {
  selectedUserForSecret.value = user;
  showSecretModal.value = true;
};

// Generar JWT simulado
const generateMockJWT = (user) => {
  if (!user) return '';

  const header = btoa(JSON.stringify({
    "alg": "HS256",
    "typ": "JWT"
  }));

  const payload = btoa(JSON.stringify({
    "nameid": user.id.toString(),
    "email": user.email,
    "given_name": user.firstName,
    "family_name": user.lastName,
    "role": user.role,
    "nbf": Math.floor(Date.now() / 1000),
    "exp": Math.floor(Date.now() / 1000) + (2 * 60 * 60), // 2 horas
    "iat": Math.floor(Date.now() / 1000)
  }));

  const signature = btoa(`mock_signature_for_user_${user.id}`);

  return `${header}.${payload}.${signature}`;
};

// Copiar al portapapeles
const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    emit('add-alert', 'Token copiado al portapapeles', 'success');
  } catch (error) {
    emit('add-alert', 'Error al copiar token', 'error');
  }
};

// Ir a JWT Debug
const goToJWTDebug = () => {
  closeSecretModal();
  // Emitir evento específico para ir a JWT Debug
  emit('go-to-jwt-debug', selectedUserForSecret.value);
};

const closeUserModal = () => {
  showUserModal.value = false;
};

const closeSecretModal = () => {
  showSecretModal.value = false;
  selectedUserForSecret.value = null;
};

// Métodos para el manejo de la eliminación
const confirmDelete = (user) => {
  itemToDelete.value = user;
  showConfirmDelete.value = true;
};

const cancelDelete = () => {
  showConfirmDelete.value = false;
  itemToDelete.value = null;
};

// ✅ CORREGIDO: Cambiar endpoint de eliminación
const handleDelete = async () => {
  if (!itemToDelete.value) return;

  loading.value = true;
  try {
    console.log(`🗑️ Eliminando usuario ${itemToDelete.value.id}...`);

    await api.delete(`/api/User/${itemToDelete.value.id}`);

    const index = props.users.findIndex(u => u.id === itemToDelete.value.id);
    if (index !== -1) {
      props.users.splice(index, 1);
      console.log('✅ Usuario eliminado de lista local');
    }

    showConfirmDelete.value = false;
    itemToDelete.value = null;

    emit('add-alert', 'Usuario eliminado con éxito', 'success');
    emit('update');

  } catch (error) {
    console.error('❌ Error al eliminar usuario:', error);

    const errorMessage = error.response?.data?.message ||
                        error.message ||
                        'Error desconocido al eliminar usuario';

    emit('add-alert', 'Error al eliminar usuario: ' + errorMessage, 'error');
  } finally {
    loading.value = false;
  }
};

// Métodos de paginación
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

// Utilidades
const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('es-ES');
};

const getRoleBadgeColor = (role) => {
  const colors = {
    'Admin': 'bg-blue-100 text-blue-800',
    'Customer': 'bg-green-100 text-green-800',
    'Restaurant': 'bg-purple-100 text-purple-800',
    'DeliveryPerson': 'bg-yellow-100 text-yellow-800',
    'Business': 'bg-orange-100 text-orange-800'
  };
  return colors[role] || 'bg-gray-100 text-gray-800';
};

// 🔧 FUNCIÓN DE DEBUGGING para AdminUsers
const debugUserOperations = () => {
  console.log('🔍 === DEBUG ADMIN USERS ===');
  console.log('Total usuarios en props:', props.users.length);
  console.log('Usuarios filtrados:', filteredUsers.value.length);
  console.log('Usuarios paginados:', paginatedUsers.value.length);
  console.log('Filtros actuales:', {
    búsqueda: userSearch.value,
    rol: userFilter.value,
    estado: statusFilter.value,
    ordenación: `${sortBy.value} ${sortDirection.value}`
  });
  console.log('Paginación:', {
    página: currentPage.value,
    totalPáginas: totalPages.value,
    usuariosPorPágina: usersPerPage
  });

  if (props.users.length > 0) {
    console.log('Muestra de usuario:', props.users[0]);
  }
};

// Exportar función de debug
if (typeof window !== 'undefined') {
  window.debugAdminUsers = debugUserOperations;
  console.log('🛠️ Debug function available at window.debugAdminUsers()');
}
</script>
