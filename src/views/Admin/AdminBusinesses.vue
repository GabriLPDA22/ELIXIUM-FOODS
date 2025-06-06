<!-- views/Admin/AdminBusinesses.vue -->
<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-semibold text-gray-900">Gestión de Negocios</h2>
      <button @click="addBusiness" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
        <span class="mr-1">+</span> Nuevo Negocio
      </button>
    </div>

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
            <input v-model="businessSearch" type="text" placeholder="Buscar negocios..."
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>
        <select v-model="businessTypeFilter"
          class="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
          <option value="">Todos los tipos</option>
          <option value="Restaurant">Restaurante</option>
          <option value="Retail">Comercio</option>
          <option value="Franchise">Franquicia</option>
          <option value="Other">Otro</option>
        </select>
        <button @click="searchBusinesses"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          Buscar
        </button>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email Contacto
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario Asignado
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Restaurantes</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="business in filteredBusinesses" :key="business.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ business.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="h-10 w-10 flex-shrink-0">
                  <img v-if="business.logoUrl" :src="business.logoUrl" class="h-10 w-10 rounded-full" alt="Logo" />
                  <div v-else class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                    🏢
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">{{ business.name }}</div>
                  <div class="text-sm text-gray-500 truncate max-w-[200px]">{{ business.description }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ business.contactEmail }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ business.userEmail || business.userId ||
              'N/A' }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="getBusinessTypeBadgeColor(business.businessType)">
                {{ business.businessType }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="['px-2 inline-flex text-xs leading-5 font-semibold rounded-full', business.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800']">
                {{ business.isActive ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <div class="flex items-center">
                <span class="text-indigo-600 font-semibold">{{ business.restaurants ? business.restaurants.length : 0
                }}</span>
                <button @click="viewBusinessRestaurants(business)" class="ml-2 text-blue-600 hover:text-blue-900">
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div class="flex gap-2">
                <button @click="editBusiness(business)" class="text-indigo-600 hover:text-indigo-900">
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button @click="toggleBusinessStatus(business)"
                  :class="business.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'">
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </button>
                <button @click="confirmDelete(business)" class="text-red-600 hover:text-red-900">
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

    <div class="flex items-center justify-between">
      <div class="text-sm text-gray-700">
        Página <span class="font-medium">{{ businessPage }}</span> de <span class="font-medium">{{ totalBusinessPages
        }}</span>
      </div>
      <div class="flex gap-2">
        <button @click="previousBusinessPage" :disabled="businessPage === 1"
          class="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
          ← Anterior
        </button>
        <button @click="nextBusinessPage" :disabled="businessPage >= totalBusinessPages"
          class="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
          Siguiente →
        </button>
      </div>
    </div>

    <div v-if="showBusinessModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl max-w-2xl w-full mx-4 overflow-hidden">
        <div class="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">
            {{ editingBusiness.id ? 'Editar' : 'Crear' }} Negocio
          </h3>
          <button @click="closeBusinessModal" class="text-gray-400 hover:text-gray-500">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveBusiness" class="p-6">
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nombre:</label>
              <input v-model="editingBusiness.name" type="text" required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Negocio:</label>
              <select v-model="editingBusiness.businessType" required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                <option value="Restaurant">Restaurante</option>
                <option value="Retail">Comercio</option>
                <option value="Franchise">Franquicia</option>
                <option value="Other">Otro</option>
              </select>
            </div>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Descripción:</label>
            <textarea v-model="editingBusiness.description" rows="2"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email de contacto:</label>
              <input v-model="editingBusiness.contactEmail" type="email" required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono de contacto:</label>
              <input v-model="editingBusiness.contactPhone" type="text" required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">CIF/NIF:</label>
              <input v-model="editingBusiness.taxId" type="text" required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Logo URL:</label>
              <input v-model="editingBusiness.logoUrl" type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
            </div>
          </div>

          <!-- 🆕 NUEVO: Campo de autocompletado para usuario -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Usuario Asignado:</label>
            <div class="relative">
              <input v-model="userSearchQuery" @input="searchUsers" @focus="showUserDropdown = true"
                @blur="hideUserDropdownDelayed" type="text" placeholder="Buscar usuario por nombre o email..."
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                autocomplete="off">

              <!-- Dropdown de usuarios -->
              <div v-if="showUserDropdown && filteredUsers.length > 0"
                class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                <div v-for="user in filteredUsers" :key="user.id" @mousedown="selectUser(user)"
                  class="px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0">
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="text-sm font-medium text-gray-900">
                        {{ user.firstName }} {{ user.lastName }}
                      </div>
                      <div class="text-xs text-gray-500">{{ user.email }}</div>
                    </div>
                    <span class="px-2 py-1 text-xs rounded-full" :class="getRoleBadgeColor(user.role)">
                      {{ user.role }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Usuario seleccionado -->
              <div v-if="selectedUser" class="mt-2 p-3 bg-blue-50 rounded-md flex items-center justify-between">
                <div class="flex items-center">
                  <div class="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span class="text-blue-600 text-sm font-medium">
                      {{ selectedUser.firstName.charAt(0) }}{{ selectedUser.lastName.charAt(0) }}
                    </span>
                  </div>
                  <div class="ml-3">
                    <div class="text-sm font-medium text-gray-900">
                      {{ selectedUser.firstName }} {{ selectedUser.lastName }}
                    </div>
                    <div class="text-xs text-gray-500">{{ selectedUser.email }}</div>
                  </div>
                </div>
                <button @click="clearSelectedUser" type="button" class="text-gray-400 hover:text-red-500">
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <!-- Mensaje si no hay usuarios -->
              <div v-if="showUserDropdown && userSearchQuery && filteredUsers.length === 0"
                class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-3">
                <div class="text-sm text-gray-500 text-center">
                  No se encontraron usuarios con "{{ userSearchQuery }}"
                </div>
              </div>
            </div>
          </div>

          <div class="mb-6">
            <label class="flex items-center">
              <input type="checkbox" v-model="editingBusiness.isActive" class="mr-2">
              <span class="text-sm text-gray-700">Negocio activo</span>
            </label>
          </div>

          <div class="flex justify-end gap-4">
            <button type="button" @click="closeBusinessModal"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              {{ editingBusiness.id ? 'Actualizar' : 'Crear' }}
            </button>
          </div>
        </form>
      </div>
    </div>

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
            <p class="text-sm text-gray-600 mb-2">¿Estás seguro de que deseas eliminar el siguiente negocio?</p>
            <div class="bg-gray-50 p-4 rounded-lg text-sm">
              <strong>Negocio:</strong> {{ itemToDelete?.name }}
            </div>
            <p class="text-sm text-red-600 mt-2">Esta acción no se puede deshacer y eliminará todos los restaurantes
              asociados.</p>
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

    <div v-if="showBusinessRestaurantsModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl max-w-4xl w-full mx-4 overflow-hidden">
        <div class="bg-indigo-50 px-6 py-4 border-b border-indigo-200 flex justify-between items-center">
          <h3 class="text-lg font-medium text-indigo-900">
            Restaurantes de {{ selectedBusiness?.name }}
          </h3>
          <button @click="closeBusinessRestaurantsModal" class="text-gray-400 hover:text-gray-500">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-6">
          <div class="mb-4 flex justify-between items-center">
            <div>
              <p class="text-sm text-gray-600">Total: <span class="font-semibold">{{
                selectedBusiness?.restaurants?.length || 0 }} restaurantes</span></p>
            </div>
            <button @click="addRestaurantToBusiness"
              class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
              <span class="mr-1">+</span> Añadir Restaurante
            </button>
          </div>
          <div v-if="!selectedBusiness?.restaurants || selectedBusiness.restaurants.length === 0"
            class="text-center py-8 bg-gray-50 rounded-lg">
            <p class="text-gray-500">Este negocio no tiene restaurantes asociados</p>
          </div>
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valoración
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="restaurant in selectedBusiness.restaurants" :key="restaurant.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ restaurant.id }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="h-8 w-8 flex-shrink-0">
                        <img v-if="restaurant.logoUrl" :src="restaurant.logoUrl" class="h-8 w-8 rounded-full"
                          alt="Logo" />
                        <div v-else
                          class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                          🍽️
                        </div>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{ restaurant.name }}</div>
                        <div class="text-sm text-gray-500 truncate max-w-[200px]">{{ restaurant.description }}</div>
                      </div>
                    </div>
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
                      <span>{{ restaurant.averageRating?.toFixed(1) || '0.0' }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex gap-2">
                      <button @click="editRestaurant(restaurant)" class="text-indigo-600 hover:text-indigo-900">
                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button @click="unlinkRestaurant(restaurant)" class="text-red-600 hover:text-red-900">
                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            d="M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18zm-3-6l6-6m0 6l-6-6" />
                        </svg>
                      </button>

                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="flex justify-end mt-6">
            <button @click="closeBusinessRestaurantsModal"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { api } from '@/services/api';

const props = defineProps({
  businesses: {
    type: Array,
    required: true,
    default: () => []
  }
});

const emit = defineEmits(['refresh', 'update', 'add-alert', 'view-restaurants', 'edit-restaurant']);

const businessSearch = ref('');
const businessTypeFilter = ref('');
const businessPage = ref(1);
const businessesPerPage = 10;
const showBusinessModal = ref(false);
const showConfirmDelete = ref(false);
const showBusinessRestaurantsModal = ref(false);
const itemToDelete = ref(null);
const selectedBusiness = ref(null);

// 🆕 Estados para autocompletado de usuarios
const userSearchQuery = ref('');
const availableUsers = ref([]);
const filteredUsers = ref([]);
const selectedUser = ref(null);
const showUserDropdown = ref(false);
let hideDropdownTimeout = null;

const editingBusiness = reactive({
  id: null,
  name: '',
  description: '',
  logoUrl: '',
  contactEmail: '',
  contactPhone: '',
  taxId: '',
  businessType: 'Restaurant',
  isActive: true,
  userId: null
});

// Cargar usuarios disponibles al montar el componente
onMounted(async () => {
  await fetchAvailableUsers();
});

// 🆕 Función para cargar usuarios disponibles
const fetchAvailableUsers = async () => {
  try {
    const response = await api.get('/api/Users');
    availableUsers.value = response.data || [];
  } catch (error) {
    console.error('Error al cargar usuarios:', error);
    emit('add-alert', 'Error al cargar usuarios', 'error');
  }
};

// 🆕 Función para buscar usuarios mientras escribe
const searchUsers = () => {
  if (!userSearchQuery.value.trim()) {
    filteredUsers.value = [];
    return;
  }

  const query = userSearchQuery.value.toLowerCase();
  filteredUsers.value = availableUsers.value.filter(user =>
    user.firstName.toLowerCase().includes(query) ||
    user.lastName.toLowerCase().includes(query) ||
    user.email.toLowerCase().includes(query) ||
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(query)
  ).slice(0, 10); // Limitar a 10 resultados
};

// 🆕 Función para seleccionar un usuario
const selectUser = (user) => {
  selectedUser.value = user;
  editingBusiness.userId = user.id;
  userSearchQuery.value = `${user.firstName} ${user.lastName}`;
  showUserDropdown.value = false;
};

// 🆕 Función para limpiar usuario seleccionado
const clearSelectedUser = () => {
  selectedUser.value = null;
  editingBusiness.userId = null;
  userSearchQuery.value = '';
  filteredUsers.value = [];
};

// 🆕 Función para ocultar dropdown con delay
const hideUserDropdownDelayed = () => {
  hideDropdownTimeout = setTimeout(() => {
    showUserDropdown.value = false;
  }, 200);
};

// Watch para actualizar la búsqueda en tiempo real
watch(userSearchQuery, () => {
  searchUsers();
});

const filteredBusinesses = computed(() => {
  let filtered = [...props.businesses];
  if (businessSearch.value) {
    const searchTerm = businessSearch.value.toLowerCase();
    filtered = filtered.filter(business =>
      business.name.toLowerCase().includes(searchTerm) ||
      business.description?.toLowerCase().includes(searchTerm) ||
      business.contactEmail?.toLowerCase().includes(searchTerm)
    );
  }
  if (businessTypeFilter.value) {
    filtered = filtered.filter(business =>
      business.businessType === businessTypeFilter.value
    );
  }
  const start = (businessPage.value - 1) * businessesPerPage;
  const end = start + businessesPerPage;
  return filtered.slice(start, end);
});

const totalBusinessPages = computed(() => {
  let filtered = [...props.businesses];
  if (businessSearch.value) {
    const searchTerm = businessSearch.value.toLowerCase();
    filtered = filtered.filter(business =>
      business.name.toLowerCase().includes(searchTerm) ||
      business.description?.toLowerCase().includes(searchTerm) ||
      business.contactEmail?.toLowerCase().includes(searchTerm)
    );
  }
  if (businessTypeFilter.value) {
    filtered = filtered.filter(business =>
      business.businessType === businessTypeFilter.value
    );
  }
  return Math.ceil(filtered.length / businessesPerPage) || 1;
});

const addBusiness = () => {
  Object.assign(editingBusiness, {
    id: null,
    name: '',
    description: '',
    logoUrl: '',
    contactEmail: '',
    contactPhone: '',
    taxId: '',
    businessType: 'Restaurant',
    isActive: true,
    userId: null
  });

  // 🆕 Limpiar estado del autocompletado
  clearSelectedUser();

  showBusinessModal.value = true;
};

const editBusiness = (business) => {
  Object.assign(editingBusiness, {
    id: business.id,
    name: business.name,
    description: business.description || '',
    logoUrl: business.logoUrl || '',
    contactEmail: business.contactEmail || '',
    contactPhone: business.contactPhone || '',
    taxId: business.taxId || '',
    businessType: business.businessType || 'Restaurant',
    isActive: business.isActive !== false,
    userId: business.userId || null
  });

  // 🆕 Si hay usuario asignado, buscarlo y seleccionarlo
  if (business.userId) {
    const user = availableUsers.value.find(u => u.id === business.userId);
    if (user) {
      selectUser(user);
    }
  } else {
    clearSelectedUser();
  }

  showBusinessModal.value = true;
};

const saveBusiness = async () => {
  try {
    const businessData = {
      name: editingBusiness.name,
      description: editingBusiness.description,
      logoUrl: editingBusiness.logoUrl,
      contactEmail: editingBusiness.contactEmail,
      contactPhone: editingBusiness.contactPhone,
      taxId: editingBusiness.taxId,
      businessType: editingBusiness.businessType,
      isActive: editingBusiness.isActive,
      userId: editingBusiness.userId
    };

    if (editingBusiness.id) {
      await api.put(`/api/Business/${editingBusiness.id}`, businessData);
      const index = props.businesses.findIndex(b => b.id === editingBusiness.id);
      if (index !== -1) {
        Object.assign(props.businesses[index], businessData);
        // Añadir información del usuario para mostrar en la tabla
        if (selectedUser.value) {
          props.businesses[index].userEmail = selectedUser.value.email;
        }
      }
      emit('add-alert', 'Negocio actualizado correctamente', 'success');
    } else {
      const response = await api.post('/api/Business', businessData);
      if (response.data) {
        // Añadir información del usuario para mostrar en la tabla
        if (selectedUser.value) {
          response.data.userEmail = selectedUser.value.email;
        }
        props.businesses.push(response.data);
      }
      emit('add-alert', 'Negocio creado correctamente', 'success');
    }
    closeBusinessModal();
    emit('update');
  } catch (error) {
    console.error('Error al guardar negocio:', error);
    emit('add-alert', 'Error al guardar negocio: ' + (error.response?.data?.message || error.response?.data || error.message), 'error');
  }
};

const closeBusinessModal = () => {
  showBusinessModal.value = false;
  clearSelectedUser();
};

const toggleBusinessStatus = async (business) => {
  try {
    const newStatus = !business.isActive;
    await api.put(`/api/Business/${business.id}`, {
      name: business.name,
      description: business.description,
      logoUrl: business.logoUrl,
      contactEmail: business.contactEmail,
      contactPhone: business.contactPhone,
      taxId: business.taxId,
      businessType: business.businessType,
      isActive: newStatus,
      userId: business.userId
    });
    business.isActive = newStatus;
    emit('add-alert', `Negocio ${newStatus ? 'activado' : 'desactivado'} correctamente`, 'success');
  } catch (error) {
    console.error('Error al cambiar estado del negocio:', error);
    emit('add-alert', 'Error al cambiar estado del negocio', 'error');
  }
};

const confirmDelete = (business) => {
  itemToDelete.value = business;
  showConfirmDelete.value = true;
};

const cancelDelete = () => {
  showConfirmDelete.value = false;
  itemToDelete.value = null;
};

const handleDelete = async () => {
  if (!itemToDelete.value) return;
  try {
    await api.delete(`/api/Business/${itemToDelete.value.id}`);
    const index = props.businesses.findIndex(b => b.id === itemToDelete.value.id);
    if (index !== -1) {
      props.businesses.splice(index, 1);
    }
    showConfirmDelete.value = false;
    emit('add-alert', 'Negocio eliminado correctamente', 'success');
    emit('update');
  } catch (error) {
    console.error('Error al eliminar negocio:', error);
    emit('add-alert', 'Error al eliminar negocio', 'error');
  } finally {
    itemToDelete.value = null;
  }
};

const viewBusinessRestaurants = async (business) => {
  selectedBusiness.value = JSON.parse(JSON.stringify(business));
  try {
    const response = await api.get(`/api/Restaurants/business/${business.id}`);
    if (response.data && Array.isArray(response.data)) {
      selectedBusiness.value.restaurants = response.data;
    }
  } catch (error) {
    console.error('Error al cargar restaurantes del negocio:', error);
    if (!selectedBusiness.value.restaurants) {
      selectedBusiness.value.restaurants = [];
    }
    emit('add-alert', 'Error al cargar algunos restaurantes', 'warning');
  }
  showBusinessRestaurantsModal.value = true;
};

const closeBusinessRestaurantsModal = () => {
  showBusinessRestaurantsModal.value = false;
  selectedBusiness.value = null;
};

const addRestaurantToBusiness = () => {
  if (!selectedBusiness.value) return;
  emit('view-restaurants', {
    action: 'add',
    businessId: selectedBusiness.value.id,
    businessName: selectedBusiness.value.name
  });
  closeBusinessRestaurantsModal();
};

const editRestaurant = (restaurant) => {
  emit('edit-restaurant', restaurant);
  closeBusinessRestaurantsModal();
};

const unlinkRestaurant = async (restaurant) => {
  if (!confirm(`¿Estás seguro de que quieres desvincular el restaurante "${restaurant.name}" de este negocio?`)) {
    return;
  }
  try {
    await api.put(`/api/Restaurants/${restaurant.id}`, {
      ...restaurant,
      businessId: null
    });
    if (selectedBusiness.value && selectedBusiness.value.restaurants) {
      const index = selectedBusiness.value.restaurants.findIndex(r => r.id === restaurant.id);
      if (index !== -1) {
        selectedBusiness.value.restaurants.splice(index, 1);
      }
    }
    emit('add-alert', 'Restaurante desvinculado correctamente', 'success');
    emit('update');
  } catch (error) {
    console.error('Error al desvincular restaurante:', error);
    emit('add-alert', 'Error al desvincular restaurante', 'error');
  }
};

const searchBusinesses = () => {
  businessPage.value = 1;
};

const previousBusinessPage = () => {
  if (businessPage.value > 1) {
    businessPage.value--;
  }
};

const nextBusinessPage = () => {
  if (businessPage.value < totalBusinessPages.value) {
    businessPage.value++;
  }
};

const getBusinessTypeBadgeColor = (type) => {
  const colors = {
    'Restaurant': 'bg-blue-100 text-blue-800',
    'Retail': 'bg-green-100 text-green-800',
    'Franchise': 'bg-purple-100 text-purple-800',
    'Other': 'bg-gray-100 text-gray-800'
  };
  return colors[type] || 'bg-gray-100 text-gray-800';
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
</script>
