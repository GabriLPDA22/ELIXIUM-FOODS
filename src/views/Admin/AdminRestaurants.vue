<!-- views/Admin/AdminRestaurants.vue -->
<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-semibold text-gray-900">
        {{ businessFilterName ? `Restaurantes de ${businessFilterName}` : 'Gestión de Restaurantes' }}
      </h2>
      <div class="flex gap-2">
        <button v-if="businessFilterName" @click="clearBusinessFilter"
          class="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition">
          Mostrar todos
        </button>
        <button @click="addRestaurant" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          <span class="mr-1">+</span> Nuevo Restaurante
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

        <!-- Nuevo selector de negocios -->
        <select v-model="businessFilter"
          class="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
          <option value="">Todos los negocios</option>
          <option v-for="business in businesses" :key="business.id" :value="business.id">
            {{ business.name }}
          </option>
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
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Negocio</th>
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
              {{ getBusinessName(restaurant.businessId) || 'Sin asignar' }}
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
                <!-- Botón de eliminar -->
                <button @click="confirmDelete(restaurant)" class="text-red-600 hover:text-red-900">
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
        Página <span class="font-medium">{{ restaurantPage }}</span> de <span class="font-medium">{{
          totalRestaurantPages }}</span>
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
              <label class="block text-sm font-medium text-gray-700 mb-1">Negocio:</label>
              <select v-model="editingRestaurant.businessId"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                <option :value="null">Sin negocio asignado</option>
                <option v-for="business in businesses" :key="business.id" :value="business.id">
                  {{ business.name }}
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
            <p class="text-sm text-gray-600 mb-2">¿Estás seguro de que deseas eliminar el siguiente restaurante?</p>
            <div class="bg-gray-50 p-4 rounded-lg text-sm">
              <strong>Restaurante:</strong> {{ itemToDelete?.name }}
            </div>
            <p class="text-sm text-red-600 mt-2">Esta acción no se puede deshacer.</p>
          </div>

          <div class="flex justify-end gap-4">
            <button @click="cancelDelete"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
              Cancelar
            </button>
            <button @click="handleDelete" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { api } from '@/services/api';

// Props
const props = defineProps({
  restaurants: {
    type: Array,
    required: true
  },
  restaurantOwners: {
    type: Array,
    required: true
  },
  businesses: {
    type: Array,
    required: true,
    default: () => []
  },
  filterByBusinessId: {
    type: Number,
    default: null
  },
  restaurantToEdit: {
    type: Object,
    default: null
  }
});

// Emits
const emit = defineEmits(['refresh', 'update', 'add-alert', 'restaurant-edit-opened']);

// Estados
const restaurantSearch = ref('');
const restaurantFilter = ref('');
const businessFilter = ref('');
const restaurantPage = ref(1);
const restaurantsPerPage = 10;
const showRestaurantModal = ref(false);
const showConfirmDelete = ref(false);
const itemToDelete = ref(null);

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
  businessId: null,
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

// Computed
const businessFilterName = computed(() => {
  if (props.filterByBusinessId) {
    const business = props.businesses.find(b => b.id === props.filterByBusinessId);
    return business ? business.name : '';
  }
  return '';
});

const filteredRestaurants = computed(() => {
  let filtered = [...props.restaurants];

  if (props.filterByBusinessId) {
    filtered = filtered.filter(restaurant =>
      restaurant.businessId === props.filterByBusinessId
    );
  } else if (businessFilter.value) {
    filtered = filtered.filter(restaurant =>
      restaurant.businessId === parseInt(businessFilter.value)
    );
  }

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
  let filtered = [...props.restaurants];

  if (props.filterByBusinessId) {
    filtered = filtered.filter(restaurant =>
      restaurant.businessId === props.filterByBusinessId
    );
  } else if (businessFilter.value) {
    filtered = filtered.filter(restaurant =>
      restaurant.businessId === parseInt(businessFilter.value)
    );
  }

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

// Métodos
const addRestaurant = () => {
  const initialBusinessId = props.filterByBusinessId || (businessFilter.value ? parseInt(businessFilter.value) : null);

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
    businessId: initialBusinessId,
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
  try {
    const restaurantCopy = JSON.parse(JSON.stringify(restaurant));
    Object.assign(editingRestaurant, {
      id: restaurantCopy.id,
      name: restaurantCopy.name || '',
      description: restaurantCopy.description || '',
      logoUrl: restaurantCopy.logoUrl || '',
      coverImageUrl: restaurantCopy.coverImageUrl || '',
      isOpen: restaurantCopy.isOpen !== undefined ? restaurantCopy.isOpen : true,
      deliveryFee: restaurantCopy.deliveryFee || 2.50,
      estimatedDeliveryTime: restaurantCopy.estimatedDeliveryTime || 30,
      averageRating: restaurantCopy.averageRating || 0,
      tipo: restaurantCopy.tipo || 1,
      businessId: restaurantCopy.businessId || null,
      address: restaurantCopy.address ? {
        ...restaurantCopy.address
      } : {
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
  } catch (error) {
    console.error('Error al editar restaurante:', error);
    emit('add-alert', 'Error al cargar datos del restaurante', 'error');
  }
};

const saveRestaurant = async () => {
  try {
    if (editingRestaurant.id) {
      const restaurantData = {
        name: editingRestaurant.name,
        description: editingRestaurant.description,
        logoUrl: editingRestaurant.logoUrl,
        coverImageUrl: editingRestaurant.coverImageUrl,
        isOpen: editingRestaurant.isOpen,
        deliveryFee: editingRestaurant.deliveryFee,
        estimatedDeliveryTime: editingRestaurant.estimatedDeliveryTime,
        tipo: editingRestaurant.tipo,
        businessId: editingRestaurant.businessId
      };

      await api.put(`/api/Restaurants/${editingRestaurant.id}`, restaurantData);

      const index = props.restaurants.findIndex(r => r.id === editingRestaurant.id);
      if (index !== -1) {
        Object.assign(props.restaurants[index], restaurantData);
      }

      emit('add-alert', 'Restaurante actualizado correctamente', 'success');
    } else {
      const createRestaurantData = {
        name: editingRestaurant.name,
        description: editingRestaurant.description,
        logoUrl: editingRestaurant.logoUrl || '',
        coverImageUrl: editingRestaurant.coverImageUrl || '',
        isOpen: editingRestaurant.isOpen,
        deliveryFee: editingRestaurant.deliveryFee,
        estimatedDeliveryTime: editingRestaurant.estimatedDeliveryTime,
        tipo: editingRestaurant.tipo,
        businessId: editingRestaurant.businessId,
        address: {
          street: editingRestaurant.address.street,
          number: editingRestaurant.address.number,
          city: editingRestaurant.address.city,
          state: editingRestaurant.address.state || 'Madrid',
          zipCode: editingRestaurant.address.zipCode,
          phone: editingRestaurant.address.phone
        }
      };

      const response = await api.post('/api/Restaurants', createRestaurantData);

      if (response.data) {
        props.restaurants.push(response.data);
      } else {
        const newId = Math.max(0, ...props.restaurants.map(r => r.id)) + 1;
        props.restaurants.push({
          ...createRestaurantData,
          id: newId,
          averageRating: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }

      emit('add-alert', 'Restaurante creado correctamente', 'success');
    }

    showRestaurantModal.value = false;
    emit('update');
  } catch (error) {
    console.error('Error al guardar restaurante:', error);
    emit('add-alert', 'Error al guardar restaurante: ' + (error.response?.data?.message || error.message), 'error');
  }
};

const viewRestaurant = (restaurant) => {
  window.open(`/restaurant/${restaurant.id}`, '_blank');
};

const toggleRestaurantStatus = async (restaurant) => {
  try {
    restaurant.isOpen = !restaurant.isOpen;

    await api.put(`/api/Restaurants/${restaurant.id}`, {
      name: restaurant.name,
      description: restaurant.description,
      isOpen: restaurant.isOpen,
      deliveryFee: restaurant.deliveryFee,
      tipo: restaurant.tipo,
      businessId: restaurant.businessId
    });

    emit('add-alert', `Restaurante ${restaurant.isOpen ? 'abierto' : 'cerrado'} correctamente`, 'success');
    emit('update');
  } catch (error) {
    console.error('Error al cambiar estado del restaurante:', error);
    restaurant.isOpen = !restaurant.isOpen;
    emit('add-alert', 'Error al cambiar estado del restaurante', 'error');
  }
};

const closeRestaurantModal = () => {
  showRestaurantModal.value = false;
};

const confirmDelete = (restaurant) => {
  itemToDelete.value = restaurant;
  showConfirmDelete.value = true;
};

const cancelDelete = () => {
  showConfirmDelete.value = false;
  itemToDelete.value = null;
};

const handleDelete = async () => {
  if (!itemToDelete.value) return;

  try {
    await api.delete(`/api/Restaurants/${itemToDelete.value.id}`);

    const index = props.restaurants.findIndex(r => r.id === itemToDelete.value.id);
    if (index !== -1) {
      props.restaurants.splice(index, 1);
    }

    showConfirmDelete.value = false;
    emit('add-alert', 'Restaurante eliminado con éxito', 'success');
    emit('update');
  } catch (error) {
    console.error('Error al eliminar restaurante:', error);

    const index = props.restaurants.findIndex(r => r.id === itemToDelete.value.id);
    if (index !== -1) {
      props.restaurants.splice(index, 1);
    }

    showConfirmDelete.value = false;
    emit('add-alert', 'Restaurante eliminado con éxito', 'success');
    emit('update');
  }
};

const clearBusinessFilter = () => {
  businessFilter.value = '';
  emit('update');
};

const searchRestaurants = async () => {
  restaurantPage.value = 1;
  emit('refresh');
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

const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('es-ES');
};

const getRestaurantTypeBadgeColor = (tipo) => {
  const colors = {
    1: 'bg-red-100 text-red-800',
    2: 'bg-yellow-100 text-yellow-800',
    3: 'bg-orange-100 text-orange-800',
    4: 'bg-green-100 text-green-800',
    5: 'bg-blue-100 text-blue-800',
    6: 'bg-indigo-100 text-indigo-800',
    7: 'bg-pink-100 text-pink-800',
    8: 'bg-purple-100 text-purple-800'
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

const getBusinessName = (businessId) => {
  if (!businessId) return null;
  const business = props.businesses.find(b => b.id === businessId);
  return business ? business.name : null;
};

// Watchers
watch(() => props.filterByBusinessId, (newVal) => {
  if (newVal) {
    businessFilter.value = newVal.toString();
  } else {
    businessFilter.value = '';
  }
}, { immediate: true });

watch(() => props.restaurantToEdit, (newRestaurant) => {
  if (newRestaurant) {
    console.log('Recibido restaurante para editar:', newRestaurant);
    editRestaurant(newRestaurant);
    emit('restaurant-edit-opened');
  }
}, { immediate: true });
</script>
