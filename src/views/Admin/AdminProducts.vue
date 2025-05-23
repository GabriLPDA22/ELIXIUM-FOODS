<!-- views/admin/AdminProducts.vue -->
<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-semibold text-gray-900">Gestión de Productos</h2>
      <button @click="addProduct" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
        <span class="mr-1">+</span> Nuevo Producto
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
            <input v-model="productSearch" type="text" placeholder="Buscar productos..."
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
        <select v-model="categoryFilter"
          class="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
          <option value="">Todas las categorías</option>
          <option v-for="category in filteredCategoriesByBusiness" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
        <select v-model="availabilityFilter"
          class="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
          <option value="">Todos</option>
          <option value="true">Disponibles</option>
          <option value="false">No disponibles</option>
        </select>
        <button @click="searchProducts"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          Buscar
        </button>
      </div>
    </div>

    <!-- Tabla de productos -->
    <div class="overflow-x-auto">
      <div v-if="isLoading" class="text-center py-8 bg-gray-50 rounded-lg">
        <p class="text-gray-500">Cargando productos...</p>
      </div>
      <div v-else-if="filteredProducts.length === 0" class="text-center py-8 bg-gray-50 rounded-lg">
        <p class="text-gray-500">No hay productos que coincidan con los criterios de búsqueda</p>
      </div>
      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imagen</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Negocio</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio Base</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disponibilidad
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Restaurantes</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="product in filteredProducts" :key="product.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="h-12 w-12 flex-shrink-0">
                <img v-if="product.imageUrl" :src="product.imageUrl" class="h-12 w-12 rounded-lg object-cover"
                  :alt="product.name" />
                <div v-else class="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500">
                  🍽️
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
              <div class="text-sm text-gray-500 max-w-xs truncate">{{ product.description }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ product.categoryName || 'N/A' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ product.businessName || 'N/A' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              €{{ product.basePrice ? product.basePrice.toFixed(2) : '0.00' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="[
                'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                product.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              ]">
                {{ product.isAvailable ? 'Disponible' : 'No disponible' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <div class="flex items-center">
                <span class="text-indigo-600 font-semibold">{{ getRestaurantCount(product.id) }}</span>
                <button @click="viewProductRestaurants(product)" class="ml-2 text-blue-600 hover:text-blue-900">
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
                <button @click="editProduct(product)" class="text-indigo-600 hover:text-indigo-900">
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button @click="toggleProductAvailability(product)"
                  :class="product.isAvailable ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'">
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </button>
                <button @click="confirmDelete(product)" class="text-red-600 hover:text-red-900">
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
    <div v-if="!isLoading && filteredProducts.length > 0" class="flex items-center justify-between">
      <div class="text-sm text-gray-700">
        Página <span class="font-medium">{{ productPage }}</span> de <span class="font-medium">{{ totalProductPages
          }}</span>
      </div>
      <div class="flex gap-2">
        <button @click="previousProductPage" :disabled="productPage === 1"
          class="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
          ← Anterior
        </button>
        <button @click="nextProductPage" :disabled="productPage >= totalProductPages"
          class="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
          Siguiente →
        </button>
      </div>
    </div>

    <!-- Modal de Producto -->
    <div v-if="showProductModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl max-w-2xl w-full mx-4 overflow-hidden">
        <div class="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">
            {{ editingProduct.id ? 'Editar' : 'Crear' }} Producto
          </h3>
          <button @click="closeProductModal" class="text-gray-400 hover:text-gray-500">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveProduct" class="p-6">
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nombre:</label>
              <input v-model="editingProduct.name" type="text" required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Precio Base (€):</label>
              <input v-model="editingProduct.basePrice" type="number" step="0.01" min="0" required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
            </div>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Descripción:</label>
            <textarea v-model="editingProduct.description" rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Negocio:</label>
              <select v-model="selectedBusinessId" @change="onBusinessChange" required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                <option value="">Seleccionar negocio</option>
                <option v-for="business in businesses" :key="business.id" :value="business.id">
                  {{ business.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Categoría:</label>
              <select v-model="editingProduct.categoryId" required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                <option value="">Seleccionar categoría</option>
                <option v-for="category in availableCategoriesForBusiness" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">URL de imagen:</label>
            <input v-model="editingProduct.imageUrl" type="url"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
          </div>

          <div class="mb-6">
            <label class="flex items-center">
              <input type="checkbox" v-model="editingProduct.isAvailable" class="mr-2">
              <span class="text-sm text-gray-700">Producto disponible</span>
            </label>
          </div>

          <div class="flex justify-end gap-4">
            <button type="button" @click="closeProductModal"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit" :disabled="isSaving"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
              {{ isSaving ? 'Guardando...' : (editingProduct.id ? 'Actualizar' : 'Crear') }}
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
            <p class="text-sm text-gray-600 mb-2">¿Estás seguro de que deseas eliminar el siguiente producto?</p>
            <div v-if="itemToDelete" class="bg-gray-50 p-4 rounded-lg text-sm">
              <strong>Producto:</strong> {{ itemToDelete.name }}<br>
              <strong>Categoría:</strong> {{ itemToDelete.categoryName }}<br>
              <strong>Precio:</strong> €{{ itemToDelete.basePrice ? itemToDelete.basePrice.toFixed(2) : '0.00' }}
            </div>
            <p class="text-sm text-red-600 mt-2">Esta acción no se puede deshacer.</p>
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
import { ref, reactive, computed, watch } from 'vue';
import { api } from '@/services/api';

// Props
const props = defineProps({
  products: {
    type: Array,
    required: true,
    default: () => []
  },
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
const productSearch = ref('');
const businessFilter = ref('');
const categoryFilter = ref('');
const availabilityFilter = ref('');
const productPage = ref(1);
const productsPerPage = 10;
const showProductModal = ref(false);
const showConfirmDelete = ref(false);
const itemToDelete = ref(null);
const selectedBusinessId = ref('');

const editingProduct = reactive({
  id: null,
  name: '',
  description: '',
  basePrice: 0,
  imageUrl: '',
  isAvailable: true,
  categoryId: ''
});

// Computed
const filteredCategoriesByBusiness = computed(() => {
  if (!businessFilter.value) return props.categories;
  return props.categories.filter(category =>
    category.businessId === parseInt(businessFilter.value)
  );
});

const availableCategoriesForBusiness = computed(() => {
  if (!selectedBusinessId.value) return [];
  return props.categories.filter(category =>
    category.businessId === parseInt(selectedBusinessId.value)
  );
});

const filteredProducts = computed(() => {
  let filtered = [...props.products];

  if (productSearch.value) {
    const searchTerm = productSearch.value.toLowerCase();
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description?.toLowerCase().includes(searchTerm)
    );
  }

  if (businessFilter.value) {
    filtered = filtered.filter(product =>
      product.businessId === parseInt(businessFilter.value)
    );
  }

  if (categoryFilter.value) {
    filtered = filtered.filter(product =>
      product.categoryId === parseInt(categoryFilter.value)
    );
  }

  if (availabilityFilter.value !== '') {
    const isAvailable = availabilityFilter.value === 'true';
    filtered = filtered.filter(product => product.isAvailable === isAvailable);
  }

  const start = (productPage.value - 1) * productsPerPage;
  const end = start + productsPerPage;
  return filtered.slice(start, end);
});

const totalProductPages = computed(() => {
  let filtered = [...props.products];

  if (productSearch.value) {
    const searchTerm = productSearch.value.toLowerCase();
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description?.toLowerCase().includes(searchTerm)
    );
  }

  if (businessFilter.value) {
    filtered = filtered.filter(product =>
      product.businessId === parseInt(businessFilter.value)
    );
  }

  if (categoryFilter.value) {
    filtered = filtered.filter(product =>
      product.categoryId === parseInt(categoryFilter.value)
    );
  }

  if (availabilityFilter.value !== '') {
    const isAvailable = availabilityFilter.value === 'true';
    filtered = filtered.filter(product => product.isAvailable === isAvailable);
  }

  return Math.ceil(filtered.length / productsPerPage) || 1;
});

// Watchers
watch(businessFilter, () => {
  categoryFilter.value = '';
});

// Métodos
const addProduct = () => {
  Object.assign(editingProduct, {
    id: null,
    name: '',
    description: '',
    basePrice: 0,
    imageUrl: '',
    isAvailable: true,
    categoryId: ''
  });
  selectedBusinessId.value = '';
  showProductModal.value = true;
};

const editProduct = (product) => {
  Object.assign(editingProduct, {
    id: product.id,
    name: product.name,
    description: product.description || '',
    basePrice: product.basePrice || 0,
    imageUrl: product.imageUrl || '',
    isAvailable: product.isAvailable !== false,
    categoryId: product.categoryId
  });
  selectedBusinessId.value = product.businessId?.toString() || '';
  showProductModal.value = true;
};

const onBusinessChange = () => {
  editingProduct.categoryId = '';
};

const saveProduct = async () => {
  if (!editingProduct.name.trim() || !editingProduct.categoryId || editingProduct.basePrice <= 0) {
    emit('add-alert', 'Por favor completa todos los campos requeridos', 'warning');
    return;
  }

  isSaving.value = true;
  try {
    const productData = {
      name: editingProduct.name.trim(),
      description: editingProduct.description.trim(),
      basePrice: parseFloat(editingProduct.basePrice),
      imageUrl: editingProduct.imageUrl.trim(),
      isAvailable: editingProduct.isAvailable,
      categoryId: parseInt(editingProduct.categoryId)
    };

    if (editingProduct.id) {
      // Actualizar producto existente
      await api.put(`/api/Products/${editingProduct.id}`, productData);

      // Actualizar en la lista local
      const index = props.products.findIndex(p => p.id === editingProduct.id);
      if (index !== -1) {
        Object.assign(props.products[index], productData);
        // Actualizar campos calculados
        const category = props.categories.find(c => c.id === productData.categoryId);
        if (category) {
          props.products[index].categoryName = category.name;
          props.products[index].businessId = category.businessId;
          const business = props.businesses.find(b => b.id === category.businessId);
          if (business) {
            props.products[index].businessName = business.name;
          }
        }
      }

      emit('add-alert', 'Producto actualizado correctamente', 'success');
    } else {
      // Crear nuevo producto
      const response = await api.post('/api/Products', productData);

      if (response.data) {
        props.products.push(response.data);
      }

      emit('add-alert', 'Producto creado correctamente', 'success');
    }

    closeProductModal();
    emit('update');
  } catch (error) {
    console.error('Error al guardar producto:', error);
    emit('add-alert', 'Error al guardar producto: ' + (error.response?.data?.message || error.message), 'error');
  } finally {
    isSaving.value = false;
  }
};

const closeProductModal = () => {
  showProductModal.value = false;
  selectedBusinessId.value = '';
  Object.assign(editingProduct, {
    id: null,
    name: '',
    description: '',
    basePrice: 0,
    imageUrl: '',
    isAvailable: true,
    categoryId: ''
  });
};

const toggleProductAvailability = async (product) => {
  try {
    const updatedData = {
      name: product.name,
      description: product.description,
      basePrice: product.basePrice,
      imageUrl: product.imageUrl,
      isAvailable: !product.isAvailable,
      categoryId: product.categoryId
    };

    await api.put(`/api/Products/${product.id}`, updatedData);

    // Actualizar localmente
    product.isAvailable = !product.isAvailable;

    emit('add-alert', `Producto ${product.isAvailable ? 'habilitado' : 'deshabilitado'} correctamente`, 'success');
    emit('update');
  } catch (error) {
    console.error('Error al cambiar disponibilidad del producto:', error);
    emit('add-alert', 'Error al cambiar disponibilidad del producto', 'error');
  }
};

const viewProductRestaurants = (product) => {
  emit('add-alert', `Ver restaurantes que ofrecen "${product.name}" - Funcionalidad próximamente`, 'info');
};

const getRestaurantCount = (productId) => {
  // Esta función sería implementada cuando tengamos datos de RestaurantProducts
  return Math.floor(Math.random() * 5) + 1; // Simulado temporalmente
};

// Métodos para el manejo de la eliminación
const confirmDelete = (product) => {
  itemToDelete.value = { ...product };
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
    await api.delete(`/api/Products/${itemToDelete.value.id}`);

    // Eliminar de la lista local
    const index = props.products.findIndex(p => p.id === itemToDelete.value.id);
    if (index !== -1) {
      props.products.splice(index, 1);
    }

    showConfirmDelete.value = false;
    emit('add-alert', 'Producto eliminado con éxito', 'success');
    emit('update');
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    emit('add-alert', 'Error al eliminar producto: ' + (error.response?.data?.message || error.message), 'error');
  } finally {
    isDeleting.value = false;
    itemToDelete.value = null;
  }
};

// Métodos de búsqueda y paginación
const searchProducts = () => {
  productPage.value = 1;
};

const previousProductPage = () => {
  if (productPage.value > 1) {
    productPage.value--;
  }
};

const nextProductPage = () => {
  if (productPage.value < totalProductPages.value) {
    productPage.value++;
  }
};
</script>
