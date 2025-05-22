<!-- views/admin/AdminCategories.vue -->
<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-semibold text-gray-900">Gestión de Categorías</h2>
      <button @click="addCategory" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
        <span class="mr-1">+</span> Nueva Categoría
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
            <input v-model="categorySearch" type="text" placeholder="Buscar categorías..."
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>
        <select v-model="businessFilter"
          class="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
          <option value="">Todos los negocios</option>
          <option v-for="business in businesses" :key="business.id" :value="business.id">
            {{ business.name }}
          </option>
        </select>
        <button @click="searchCategories"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          Buscar
        </button>
      </div>
    </div>

    <!-- Tabla de categorías -->
    <div class="overflow-x-auto">
      <div v-if="isLoading" class="text-center py-8 bg-gray-50 rounded-lg">
        <p class="text-gray-500">Cargando categorías...</p>
      </div>
      <div v-else-if="filteredCategories.length === 0" class="text-center py-8 bg-gray-50 rounded-lg">
        <p class="text-gray-500">No hay categorías que coincidan con los criterios de búsqueda</p>
      </div>
      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Negocio</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Productos</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="category in filteredCategories" :key="category.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ category.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ category.name }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500 max-w-xs truncate">{{ category.description }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ getBusinessName(category.businessId) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <div class="flex items-center">
                <span class="text-indigo-600 font-semibold">{{ category.products ? category.products.length : 0
                  }}</span>
                <button @click="viewCategoryProducts(category)" class="ml-2 text-blue-600 hover:text-blue-900">
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
                <button @click="editCategory(category)" class="text-indigo-600 hover:text-indigo-900">
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button @click="confirmDelete(category)" class="text-red-600 hover:text-red-900">
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
    <div v-if="!isLoading && filteredCategories.length > 0" class="flex items-center justify-between">
      <div class="text-sm text-gray-700">
        Página <span class="font-medium">{{ categoryPage }}</span> de <span class="font-medium">{{ totalCategoryPages
          }}</span>
      </div>
      <div class="flex gap-2">
        <button @click="previousCategoryPage" :disabled="categoryPage === 1"
          class="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
          ← Anterior
        </button>
        <button @click="nextCategoryPage" :disabled="categoryPage >= totalCategoryPages"
          class="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
          Siguiente →
        </button>
      </div>
    </div>

    <!-- Modal de Categoría -->
    <div v-if="showCategoryModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl max-w-md w-full mx-4 overflow-hidden">
        <div class="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">
            {{ editingCategory.id ? 'Editar' : 'Crear' }} Categoría
          </h3>
          <button @click="closeCategoryModal" class="text-gray-400 hover:text-gray-500">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveCategory" class="p-6">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre:</label>
            <input v-model="editingCategory.name" type="text" required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Descripción:</label>
            <textarea v-model="editingCategory.description" rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"></textarea>
          </div>

          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-1">Negocio:</label>
            <select v-model="editingCategory.businessId" required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
              <option value="">Seleccionar negocio</option>
              <option v-for="business in businesses" :key="business.id" :value="business.id">
                {{ business.name }}
              </option>
            </select>
          </div>

          <div class="flex justify-end gap-4">
            <button type="button" @click="closeCategoryModal"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit" :disabled="isSaving"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
              {{ isSaving ? 'Guardando...' : (editingCategory.id ? 'Actualizar' : 'Crear') }}
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
            <p class="text-sm text-gray-600 mb-2">¿Estás seguro de que deseas eliminar la siguiente categoría?</p>
            <div v-if="itemToDelete" class="bg-gray-50 p-4 rounded-lg text-sm">
              <strong>Categoría:</strong> {{ itemToDelete.name }}<br>
              <strong>Negocio:</strong> {{ getBusinessName(itemToDelete.businessId) }}<br>
              <strong>Productos:</strong> {{ itemToDelete.products ? itemToDelete.products.length : 0 }}
            </div>
            <p class="text-sm text-red-600 mt-2">Esta acción eliminará también todos los productos asociados y no se
              puede deshacer.</p>
          </div>

          <div class="flex justify-end gap-4">
            <button @click="cancelDelete"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
              Cancelar
            </button>
            <button @click="handleDelete" :disabled="isDeleting"
              class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50">
              {{ isDeleting ? 'Eliminando...' : 'Eliminar' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { api } from '@/services/api';

// Props
const props = defineProps({
  categories: {
    type: Array,
    required: true,
    default: () => []
  },
  businesses: {
    type: Array,
    required: true,
    default: () => []
  }
});

// Emits
const emit = defineEmits(['refresh', 'update', 'add-alert']);

// Estados
const isLoading = ref(false);
const isSaving = ref(false);
const isDeleting = ref(false);
const categorySearch = ref('');
const businessFilter = ref('');
const categoryPage = ref(1);
const categoriesPerPage = 10;
const showCategoryModal = ref(false);
const showConfirmDelete = ref(false);
const itemToDelete = ref(null);

const editingCategory = reactive({
  id: null,
  name: '',
  description: '',
  businessId: ''
});

// Computed
const filteredCategories = computed(() => {
  let filtered = [...props.categories];

  if (categorySearch.value) {
    const searchTerm = categorySearch.value.toLowerCase();
    filtered = filtered.filter(category =>
      category.name.toLowerCase().includes(searchTerm) ||
      category.description?.toLowerCase().includes(searchTerm)
    );
  }

  if (businessFilter.value) {
    filtered = filtered.filter(category =>
      category.businessId === parseInt(businessFilter.value)
    );
  }

  const start = (categoryPage.value - 1) * categoriesPerPage;
  const end = start + categoriesPerPage;
  return filtered.slice(start, end);
});

const totalCategoryPages = computed(() => {
  let filtered = [...props.categories];

  if (categorySearch.value) {
    const searchTerm = categorySearch.value.toLowerCase();
    filtered = filtered.filter(category =>
      category.name.toLowerCase().includes(searchTerm) ||
      category.description?.toLowerCase().includes(searchTerm)
    );
  }

  if (businessFilter.value) {
    filtered = filtered.filter(category =>
      category.businessId === parseInt(businessFilter.value)
    );
  }

  return Math.ceil(filtered.length / categoriesPerPage) || 1;
});

// Métodos
const addCategory = () => {
  Object.assign(editingCategory, {
    id: null,
    name: '',
    description: '',
    businessId: ''
  });
  showCategoryModal.value = true;
};

const editCategory = (category) => {
  Object.assign(editingCategory, {
    id: category.id,
    name: category.name,
    description: category.description || '',
    businessId: category.businessId
  });
  showCategoryModal.value = true;
};

const saveCategory = async () => {
  if (!editingCategory.name.trim() || !editingCategory.businessId) {
    emit('add-alert', 'Por favor completa todos los campos requeridos', 'warning');
    return;
  }

  isSaving.value = true;
  try {
    const categoryData = {
      name: editingCategory.name.trim(),
      description: editingCategory.description.trim(),
      businessId: parseInt(editingCategory.businessId)
    };

    if (editingCategory.id) {
      // Actualizar categoría existente
      await api.put(`/api/Categories/${editingCategory.id}`, categoryData);

      // Actualizar en la lista local
      const index = props.categories.findIndex(c => c.id === editingCategory.id);
      if (index !== -1) {
        Object.assign(props.categories[index], categoryData);
      }

      emit('add-alert', 'Categoría actualizada correctamente', 'success');
    } else {
      // Crear nueva categoría
      const response = await api.post('/api/Categories', categoryData);

      if (response.data) {
        props.categories.push(response.data);
      }

      emit('add-alert', 'Categoría creada correctamente', 'success');
    }

    closeCategoryModal();
    emit('update');
  } catch (error) {
    console.error('Error al guardar categoría:', error);
    emit('add-alert', 'Error al guardar categoría: ' + (error.response?.data?.message || error.message), 'error');
  } finally {
    isSaving.value = false;
  }
};

const closeCategoryModal = () => {
  showCategoryModal.value = false;
  Object.assign(editingCategory, {
    id: null,
    name: '',
    description: '',
    businessId: ''
  });
};

const viewCategoryProducts = (category) => {
  emit('add-alert', `Ver productos de la categoría "${category.name}" - Funcionalidad próximamente`, 'info');
};

// Métodos para el manejo de la eliminación
const confirmDelete = (category) => {
  itemToDelete.value = { ...category };
  showConfirmDelete.value = true;
};

const cancelDelete = () => {
  showConfirmDelete.value = false;
  itemToDelete.value = null;
};

const handleDelete = async () => {
  if (!itemToDelete.value) return;

  isDeleting.value = true;
  try {
    await api.delete(`/api/Categories/${itemToDelete.value.id}`);

    // Eliminar de la lista local
    const index = props.categories.findIndex(c => c.id === itemToDelete.value.id);
    if (index !== -1) {
      props.categories.splice(index, 1);
    }

    showConfirmDelete.value = false;
    emit('add-alert', 'Categoría eliminada con éxito', 'success');
    emit('update');
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    emit('add-alert', 'Error al eliminar categoría: ' + (error.response?.data?.message || error.message), 'error');
  } finally {
    isDeleting.value = false;
    itemToDelete.value = null;
  }
};

// Métodos de búsqueda y paginación
const searchCategories = () => {
  categoryPage.value = 1;
};

const previousCategoryPage = () => {
  if (categoryPage.value > 1) {
    categoryPage.value--;
  }
};

const nextCategoryPage = () => {
  if (categoryPage.value < totalCategoryPages.value) {
    categoryPage.value++;
  }
};

// Utilidades
const getBusinessName = (businessId) => {
  const business = props.businesses.find(b => b.id === businessId);
  return business ? business.name : 'N/A';
};
</script>
