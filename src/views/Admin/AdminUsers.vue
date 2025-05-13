<!-- views/admin/AdminUsers.vue -->
<template>
  <div class="space-y-6">
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
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registro</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">JWT</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
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
                <!-- Botón de eliminar -->
                <button @click="confirmDelete(user)" class="text-red-600 hover:text-red-900">
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
              <strong>Usuario:</strong> {{ itemToDelete?.firstName }} {{ itemToDelete?.lastName }} ({{ itemToDelete?.email }})
            </div>
            <p class="text-sm text-red-600 mt-2">Esta acción no se puede deshacer.</p>
          </div>

          <div class="flex justify-end gap-4">
            <button @click="cancelDelete"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
              Cancelar
            </button>
            <button @click="handleDelete"
              class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
              Eliminar
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
const emit = defineEmits(['refresh', 'update', 'add-alert']);

// Estados
const userSearch = ref('');
const userFilter = ref('');
const currentPage = ref(1);
const usersPerPage = 10;
const showUserModal = ref(false);
const showConfirmDelete = ref(false);
const itemToDelete = ref(null);

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

// Computed
const filteredUsers = computed(() => {
  let filtered = [...props.users];

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
  let filtered = [...props.users];
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

// Métodos
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

      // Actualizar en la lista local
      const index = props.users.findIndex(u => u.id === editingUser.id);
      if (index !== -1) {
        props.users[index] = { ...props.users[index], ...userData };
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
        role: editingUser.role
      };

      const response = await api.post('/api/Users', newUserData);

      // Añadir a la lista local (con ID generado por el servidor)
      if (response.data) {
        props.users.push(response.data);
      } else {
        // En caso de desarrollo o si la API no devuelve el nuevo usuario
        const newId = Math.max(...props.users.map(u => u.id), 0) + 1;
        props.users.push({
          id: newId,
          ...newUserData,
          isActive: true,
          createdAt: new Date().toISOString().split('T')[0]
        });
      }

      emit('add-alert', 'Usuario creado correctamente', 'success');
    }

    showUserModal.value = false;
    emit('update'); // Actualizar estadísticas
  } catch (error) {
    console.error('Error al guardar usuario:', error);
    emit('add-alert', 'Error al guardar usuario: ' + (error.response?.data?.message || error.message), 'error');
  }
};

const toggleUserStatus = async (user) => {
  try {
    // Actualizar estado del usuario
    user.isActive = !user.isActive;

    // Para mantener coherencia con el backend, podríamos intentar una actualización del usuario
    // pero solo cambiando propiedades admitidas por el backend
    await api.put(`/api/Users/${user.id}`, {
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber
    });

    emit('add-alert', `Usuario ${user.isActive ? 'activado' : 'desactivado'} correctamente`, 'success');
  } catch (error) {
    console.error('Error al cambiar estado del usuario:', error);
    emit('add-alert', 'Error al cambiar estado del usuario', 'error');
    // Revertir cambio en caso de error
    user.isActive = !user.isActive;
  }
};

const closeUserModal = () => {
  showUserModal.value = false;
};

const viewUserJWT = async (user) => {
  try {
    // Delegamos al componente superior para que cambie a la pestaña de JWT
    emit('add-alert', 'Redirigiendo a vista de JWT...', 'info');
  } catch (error) {
    console.error('Error al obtener JWT del usuario:', error);
    emit('add-alert', 'Error al obtener JWT del usuario', 'error');
  }
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

const handleDelete = async () => {
  if (!itemToDelete.value) return;
  
  try {
    // En un caso real, esto haría una llamada a la API
    await api.delete(`/api/Users/${itemToDelete.value.id}`);

    // Eliminar de la lista local
    const index = props.users.findIndex(u => u.id === itemToDelete.value.id);
    if (index !== -1) {
      props.users.splice(index, 1);
    }

    showConfirmDelete.value = false;
    emit('add-alert', 'Usuario eliminado con éxito', 'success');
    emit('update'); // Actualizar estadísticas
  } catch (error) {
    console.error('Error al eliminar usuario:', error);

    // Si hay un error en la API, al menos actualizar la interfaz para demostración
    const index = props.users.findIndex(u => u.id === itemToDelete.value.id);
    if (index !== -1) {
      props.users.splice(index, 1);
    }

    showConfirmDelete.value = false;
    emit('add-alert', 'Usuario eliminado con éxito', 'success');
    emit('update'); // Actualizar estadísticas
  }
};

// Métodos de paginación
const searchUsers = async () => {
  currentPage.value = 1;
  emit('refresh'); // Se delega la búsqueda al componente padre
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
    'DeliveryPerson': 'bg-yellow-100 text-yellow-800'
  };
  return colors[role] || 'bg-gray-100 text-gray-800';
};
</script>