<template>
  <div class="business-products">
    <div class="business-products__header">
      <div class="business-products__header-left">
        <h1 class="business-products__title">Gestión de Productos</h1>
        <p class="business-products__subtitle">Administra tu menú y mantén actualizada tu carta</p>
      </div>
      <button @click="showAddModal = true" class="business-products__add-btn">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        <span>Añadir Producto</span>
      </button>
    </div>

    <div class="business-products__tools">
      <div class="business-products__search">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round" class="business-products__search-icon">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Buscar productos..."
          class="business-products__search-input"
        />
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="business-products__search-clear"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="business-products__filters">
        <div class="business-products__filter">
          <select v-model="categoryFilter" class="business-products__select">
            <option value="">Todas las categorías</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>

        <div class="business-products__filter">
          <select v-model="sortOption" class="business-products__select">
            <option value="name_asc">Nombre (A-Z)</option>
            <option value="name_desc">Nombre (Z-A)</option>
            <option value="price_asc">Precio (Menor a Mayor)</option>
            <option value="price_desc">Precio (Mayor a Menor)</option>
            <option value="newest">Más recientes</option>
          </select>
        </div>

        <div class="business-products__filter business-products__filter--view">
          <button
            @click="viewMode = 'grid'"
            :class="['business-products__view-btn', { 'business-products__view-btn--active': viewMode === 'grid' }]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
          </button>
          <button
            @click="viewMode = 'list'"
            :class="['business-products__view-btn', { 'business-products__view-btn--active': viewMode === 'list' }]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round">
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <line x1="3" y1="6" x2="3.01" y2="6"></line>
              <line x1="3" y1="12" x2="3.01" y2="12"></line>
              <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="business-products__loading">
      <div class="business-products__spinner"></div>
      <p>Cargando productos...</p>
    </div>

    <div v-else-if="filteredProducts.length === 0" class="business-products__empty">
      <div class="business-products__empty-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 6L6 18"></path>
          <path d="M6 6l12 12"></path>
        </svg>
      </div>
      <h3>No se encontraron productos</h3>
      <p v-if="searchQuery || categoryFilter">
        No hay resultados para los filtros seleccionados. Prueba con otros criterios.
      </p>
      <p v-else>
        ¡Comienza a añadir productos a tu menú!
      </p>
      <button @click="showAddModal = true" class="business-products__empty-button">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Añadir Primer Producto
      </button>
    </div>

    <div v-else-if="viewMode === 'grid'" class="business-products__grid">
      <div v-for="product in filteredProducts" :key="product.id" class="business-products__card">
        <div class="business-products__card-image">
          <img :src="product.imageUrl || '/images/product-placeholder.png'" :alt="product.name" loading="lazy">
          <div class="business-products__card-overlay">
            <div class="business-products__card-actions">
              <button @click="editProduct(product)" class="business-products__action-btn business-products__action-btn--edit">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                <span>Editar</span>
              </button>
              <button @click="confirmDelete(product)" class="business-products__action-btn business-products__action-btn--delete">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
                <span>Eliminar</span>
              </button>
            </div>
          </div>
          <div :class="['business-products__availability', product.available ? 'business-products__availability--available' : 'business-products__availability--unavailable']">
            {{ product.available ? 'Disponible' : 'No disponible' }}
          </div>
        </div>
        <div class="business-products__card-content">
          <div class="business-products__card-category">{{ getCategoryName(product.categoryId) }}</div>
          <h3 class="business-products__card-title">{{ product.name }}</h3>
          <p class="business-products__card-description">{{ truncateText(product.description, 80) }}</p>
          <div class="business-products__card-footer">
            <div class="business-products__price-container">
              <span class="business-products__price">{{ formatPrice(product.price) }}</span>
              <span v-if="product.originalPrice && product.originalPrice > product.price" class="business-products__original-price">
                {{ formatPrice(product.originalPrice) }}
              </span>
            </div>
            <div class="business-products__card-toggle">
              <button
                @click="toggleProductAvailability(product)"
                :class="[
                  'business-products__toggle-btn',
                  product.available ? 'business-products__toggle-btn--on' : 'business-products__toggle-btn--off'
                ]"
              >
                <span class="business-products__toggle-slider"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="business-products__list">
      <table class="business-products__table">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in filteredProducts" :key="product.id" class="business-products__row">
            <td class="business-products__cell business-products__cell--image">
              <img
                :src="product.imageUrl || '/images/product-placeholder.png'"
                :alt="product.name"
                class="business-products__thumbnail"
                loading="lazy"
              >
            </td>
            <td class="business-products__cell">
              <div class="business-products__product-name">{{ product.name }}</div>
            </td>
            <td class="business-products__cell">
              <div class="business-products__category-badge">{{ getCategoryName(product.categoryId) }}</div>
            </td>
            <td class="business-products__cell">
              <div class="business-products__price-info">
                <span class="business-products__price-value">{{ formatPrice(product.price) }}</span>
                <span v-if="product.originalPrice && product.originalPrice > product.price" class="business-products__price-original">
                  {{ formatPrice(product.originalPrice) }}
                </span>
              </div>
            </td>
            <td class="business-products__cell">
              <div class="business-products__toggle-container">
                <button
                  @click="toggleProductAvailability(product)"
                  :class="[
                    'business-products__toggle-btn',
                    product.available ? 'business-products__toggle-btn--on' : 'business-products__toggle-btn--off'
                  ]"
                >
                  <span class="business-products__toggle-slider"></span>
                </button>
                <span class="business-products__toggle-label">
                  {{ product.available ? 'Disponible' : 'No disponible' }}
                </span>
              </div>
            </td>
            <td class="business-products__cell business-products__cell--actions">
              <div class="business-products__table-actions">
                <button @click="editProduct(product)" class="business-products__table-btn business-products__table-btn--edit">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
                <button @click="confirmDelete(product)" class="business-products__table-btn business-products__table-btn--delete">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginación -->
    <div v-if="totalPages > 1" class="business-products__pagination">
      <button
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="business-products__pagination-btn"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        Anterior
      </button>

      <div class="business-products__pagination-pages">
        <button
          v-for="page in paginationButtons"
          :key="page"
          @click="page === '...' ? null : changePage(page)"
          :class="[
            'business-products__page-btn',
            { 'business-products__page-btn--active': page === currentPage,
              'business-products__page-btn--disabled': page === '...' }
          ]"
        >
          {{ page }}
        </button>
      </div>

      <button
        @click="changePage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="business-products__pagination-btn"
      >
        Siguiente
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>

    <!-- Modal para añadir/editar producto -->
    <div v-if="showAddModal || showEditModal" class="business-products__modal">
      <div class="business-products__modal-backdrop" @click="closeModals"></div>
      <div class="business-products__modal-container">
        <div class="business-products__modal-header">
          <h3 class="business-products__modal-title">
            {{ showEditModal ? 'Editar Producto' : 'Añadir Nuevo Producto' }}
          </h3>
          <button @click="closeModals" class="business-products__modal-close">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="business-products__modal-body">
          <form @submit.prevent="submitProductForm" class="business-products__form">
            <div class="business-products__form-group">
              <label for="productName" class="business-products__form-label">Nombre del producto *</label>
              <input
                type="text"
                id="productName"
                v-model="productForm.name"
                class="business-products__form-input"
                placeholder="Ej: Hamburguesa Clásica"
                required
              />
            </div>

            <div class="business-products__form-row">
              <div class="business-products__form-group">
                <label for="productCategory" class="business-products__form-label">Categoría *</label>
                <select
                  id="productCategory"
                  v-model="productForm.categoryId"
                  class="business-products__form-select"
                  required
                >
                  <option value="">Selecciona una categoría</option>
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>
              <div class="business-products__form-group">
                <label for="productAvailability" class="business-products__form-label">Disponibilidad *</label>
                <div class="business-products__availability-options">
                  <label class="business-products__radio-label">
                    <input type="radio" v-model="productForm.available" :value="true">
                    <span>Disponible</span>
                  </label>
                  <label class="business-products__radio-label">
                    <input type="radio" v-model="productForm.available" :value="false">
                    <span>No disponible</span>
                  </label>
                </div>
              </div>
            </div>

            <div class="business-products__form-row">
              <div class="business-products__form-group">
                <label for="productPrice" class="business-products__form-label">Precio (€) *</label>
                <input
                  type="number"
                  id="productPrice"
                  v-model="productForm.price"
                  class="business-products__form-input"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  required
                />
              </div>
              <div class="business-products__form-group">
                <label for="productOriginalPrice" class="business-products__form-label">
                  Precio original (€)
                  <span class="business-products__form-hint">(para mostrar descuento)</span>
                </label>
                <input
                  type="number"
                  id="productOriginalPrice"
                  v-model="productForm.originalPrice"
                  class="business-products__form-input"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div class="business-products__form-group">
              <label for="productDescription" class="business-products__form-label">Descripción *</label>
              <textarea
                id="productDescription"
                v-model="productForm.description"
                class="business-products__form-textarea"
                placeholder="Describe tu producto..."
                rows="4"
                required
              ></textarea>
            </div>

            <div class="business-products__form-group">
              <label class="business-products__form-label">Imagen del producto</label>
              <div class="business-products__image-upload">
                <div class="business-products__image-preview">
                  <img
                    v-if="imagePreview"
                    :src="imagePreview"
                    alt="Vista previa"
                    class="business-products__preview-img"
                  />
                  <div v-else class="business-products__placeholder">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <span>Selecciona una imagen</span>
                  </div>
                </div>
                <div class="business-products__upload-actions">
                  <input
                    type="file"
                    ref="fileInput"
                    accept="image/*"
                    @change="handleFileChange"
                    class="business-products__file-input"
                  />
                  <button
                    type="button"
                    @click="triggerFileInput"
                    class="business-products__upload-btn"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    Subir imagen
                  </button>
                  <button
                    v-if="imagePreview"
                    type="button"
                    @click="removeImage"
                    class="business-products__remove-btn"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                    Eliminar
                  </button>
                </div>
              </div>
            </div>

            <div class="business-products__form-divider"></div>

            <div class="business-products__form-group">
              <label class="business-products__form-label">Opciones avanzadas</label>
              <div class="business-products__accordion" @click="toggleAdvancedOptions">
                <span>{{ showAdvancedOptions ? 'Ocultar opciones avanzadas' : 'Mostrar opciones avanzadas' }}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  :class="{ 'business-products__rotate-icon': showAdvancedOptions }"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>

            <div v-if="showAdvancedOptions" class="business-products__advanced-options">
              <div class="business-products__form-row">
                <div class="business-products__form-group">
                  <label for="productSKU" class="business-products__form-label">SKU</label>
                  <input
                    type="text"
                    id="productSKU"
                    v-model="productForm.sku"
                    class="business-products__form-input"
                    placeholder="Código de referencia interno"
                  />
                </div>
                <div class="business-products__form-group">
                  <label for="productStock" class="business-products__form-label">Stock</label>
                  <input
                    type="number"
                    id="productStock"
                    v-model="productForm.stock"
                    class="business-products__form-input"
                    min="0"
                    placeholder="Cantidad disponible"
                  />
                </div>
              </div>

              <div class="business-products__form-group">
                <label for="productTags" class="business-products__form-label">Etiquetas</label>
                <input
                  type="text"
                  id="productTags"
                  v-model="productForm.tags"
                  class="business-products__form-input"
                  placeholder="Separadas por comas (ej: vegetariano, sin gluten, picante)"
                />
              </div>

              <div class="business-products__form-group business-products__form-group--checkbox">
                <label class="business-products__checkbox-label">
                  <input type="checkbox" v-model="productForm.featured" class="business-products__form-checkbox">
                  <span>Destacar producto en la portada</span>
                </label>
              </div>
            </div>

            <div class="business-products__form-actions">
              <button
                type="button"
                @click="closeModals"
                class="business-products__form-btn business-products__form-btn--cancel"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="business-products__form-btn business-products__form-btn--submit"
                :disabled="formSubmitting"
              >
                <span v-if="formSubmitting" class="business-products__btn-spinner"></span>
                <span v-else>{{ showEditModal ? 'Guardar cambios' : 'Añadir producto' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación para eliminar -->
    <div v-if="showDeleteModal" class="business-products__modal">
      <div class="business-products__modal-backdrop" @click="showDeleteModal = false"></div>
      <div class="business-products__modal-container business-products__modal-container--small">
        <div class="business-products__modal-header">
          <h3 class="business-products__modal-title">
            Eliminar Producto
          </h3>
          <button @click="showDeleteModal = false" class="business-products__modal-close">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="business-products__modal-body">
          <div class="business-products__delete-warning">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="business-products__warning-icon">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <div class="business-products__warning-content">
              <h4>¿Estás seguro de que deseas eliminar este producto?</h4>
              <p v-if="productToDelete">
                <strong>{{ productToDelete.name }}</strong> se eliminará permanentemente y ya no estará disponible para los clientes.
              </p>
              <p class="business-products__warning-notice">Esta acción no se puede deshacer.</p>
            </div>
          </div>
        </div>

        <div class="business-products__modal-footer">
          <button
            @click="showDeleteModal = false"
            class="business-products__form-btn business-products__form-btn--cancel"
          >
            Cancelar
          </button>
          <button
            @click="deleteProduct"
            class="business-products__form-btn business-products__form-btn--delete"
            :disabled="deleteLoading"
          >
            <span v-if="deleteLoading" class="business-products__btn-spinner"></span>
            <span v-else>Eliminar</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { api } from '@/services/api';

// Interfaces
interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  isAvailable: boolean;
  categoryId: number;
  categoryName?: string;
  restaurantName?: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
}

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// Estados principales
const business = ref(null);
const restaurants = ref([]);
const loading = ref(false);
const isRefreshing = ref(false);
const products = ref<Product[]>([]);
const categories = ref<Category[]>([]);

// Estados de UI
const searchQuery = ref('');
const categoryFilter = ref('');
const sortOption = ref('name_asc');
const viewMode = ref('grid');
const currentPage = ref(1);
const itemsPerPage = ref(12);

// Estados del modal
const showAddModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const showAdvancedOptions = ref(false);
const formSubmitting = ref(false);
const deleteLoading = ref(false);
const productToDelete = ref<Product | null>(null);
const imagePreview = ref('');

// Formulario del producto
const productForm = reactive({
  id: undefined,
  name: '',
  description: '',
  price: 0,
  originalPrice: null,
  categoryId: 0,
  available: true,
  imageUrl: '',
  sku: '',
  stock: null,
  tags: '',
  featured: false
});

const shouldOpenNewProductModal = computed(() => {
  return route.name === 'business-products-new' || route.query.openModal === 'true';
});

// Computed properties
const filteredProducts = computed(() => {
  let result = [...products.value];

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    );
  }

  if (categoryFilter.value) {
    result = result.filter(product => product.categoryId === parseInt(categoryFilter.value));
  }

  // Aplicar ordenamiento
  switch (sortOption.value) {
    case 'name_desc':
      result.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case 'price_asc':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      result.sort((a, b) => b.price - a.price);
      break;
    default: // name_asc
      result.sort((a, b) => a.name.localeCompare(b.name));
  }

  return result;
});

const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / itemsPerPage.value);
});

const paginationButtons = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;
  const buttons = [];

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      buttons.push(i);
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) buttons.push(i);
      buttons.push('...');
      buttons.push(total);
    } else if (current >= total - 3) {
      buttons.push(1);
      buttons.push('...');
      for (let i = total - 4; i <= total; i++) buttons.push(i);
    } else {
      buttons.push(1);
      buttons.push('...');
      for (let i = current - 1; i <= current + 1; i++) buttons.push(i);
      buttons.push('...');
      buttons.push(total);
    }
  }

  return buttons;
});

// Watchers
watch([searchQuery, categoryFilter, sortOption], () => {
  currentPage.value = 1;
});

// Cargar business usando la misma lógica que BusinessHome.vue
const loadBusiness = async () => {
  try {
    const userId = authStore.user?.id;
    if (!userId) {
      console.error('No se encontró userId en authStore');
      return;
    }

    console.log('Cargando business para userId:', userId);
    const response = await api.get(`/api/Business/user/${userId}`);
    if (response.data) {
      business.value = response.data;
      console.log('Business cargado:', business.value);
    } else {
      console.error('No se encontró business para este usuario');
      business.value = null;
    }
  } catch (error) {
    console.error('Error cargando business:', error);
    business.value = null;
  }
};

// Cargar restaurantes del business
const loadRestaurants = async () => {
  try {
    if (!business.value?.id) {
      console.log('No hay businessId disponible');
      return;
    }

    console.log('Cargando restaurantes para businessId:', business.value.id);
    const response = await api.get(`/api/Restaurants/business/${business.value.id}`);
    if (response.data && response.data.length > 0) {
      restaurants.value = response.data;
      console.log('Restaurantes cargados:', restaurants.value.length);
    } else {
      console.log('No se encontraron restaurantes para este business');
      restaurants.value = [];
    }
  } catch (error) {
    console.error('Error cargando restaurantes:', error);
    restaurants.value = [];
  }
};

// Cargar productos de todos los restaurantes
const loadProducts = async () => {
  if (!restaurants.value.length) {
    console.log('No hay restaurantes disponibles');
    products.value = [];
    return;
  }

  loading.value = true;
  
  try {
    const allProducts: Product[] = [];
    
    for (const restaurant of restaurants.value) {
      try {
        console.log('Cargando productos del restaurante:', restaurant.id);
        const productsResponse = await api.get(`/api/Products/Restaurant/${restaurant.id}`);
        if (productsResponse.data) {
          const restaurantProducts = productsResponse.data.map((product: any) => ({
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            imageUrl: product.imageUrl,
            isAvailable: product.isAvailable ?? true,
            available: product.isAvailable ?? true, // Alias para compatibilidad
            categoryId: product.categoryId,
            categoryName: product.categoryName,
            restaurantName: restaurant.name,
            originalPrice: product.originalPrice
          }));
          allProducts.push(...restaurantProducts);
        }
      } catch (error) {
        console.error(`Error cargando productos del restaurante ${restaurant.id}:`, error);
      }
    }
    
    products.value = allProducts;
    console.log('Total productos cargados:', products.value.length);
  } catch (error) {
    console.error('Error cargando productos:', error);
    products.value = [];
  } finally {
    loading.value = false;
  }
};

// Cargar categorías de todos los restaurantes
const loadCategories = async () => {
  if (!restaurants.value.length) {
    categories.value = [];
    return;
  }

  try {
    const allCategories: Category[] = [];
    
    for (const restaurant of restaurants.value) {
      try {
        // Obtener el restaurante con detalles (menús y categorías)
        const restaurantResponse = await api.get(`/api/Restaurants/${restaurant.id}`);
        if (restaurantResponse.data && restaurantResponse.data.menus) {
          for (const menu of restaurantResponse.data.menus) {
            if (menu.categories) {
              allCategories.push(...menu.categories);
            }
          }
        }
      } catch (error) {
        console.error(`Error cargando categorías del restaurante ${restaurant.id}:`, error);
      }
    }
    
    // Eliminar duplicados por ID
    const uniqueCategories = allCategories.filter((category, index, self) => 
      index === self.findIndex(c => c.id === category.id)
    );
    
    categories.value = uniqueCategories;
    console.log('Categorías cargadas:', categories.value.length);
  } catch (error) {
    console.error('Error cargando categorías:', error);
    categories.value = [];
  }
};

// Funciones auxiliares
const formatPrice = (value: number) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(value);
};

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

const getCategoryName = (categoryId: number) => {
  const category = categories.value.find(c => c.id === categoryId);
  return category ? category.name : 'Sin categoría';
};

// Funciones de modal
const closeModals = () => {
  showAddModal.value = false;
  showEditModal.value = false;
  showDeleteModal.value = false;
  resetProductForm();
  if (route.name === 'business-products-new') {
    router.push({ name: 'business-products' });
  }
};

const resetProductForm = () => {
  Object.assign(productForm, {
    id: undefined,
    name: '',
    description: '',
    price: 0,
    originalPrice: null,
    categoryId: 0,
    available: true,
    imageUrl: '',
    sku: '',
    stock: null,
    tags: '',
    featured: false
  });
  imagePreview.value = '';
};

const editProduct = (product: Product) => {
  showEditModal.value = true;
  Object.assign(productForm, {
    ...product,
    available: product.isAvailable
  });
  imagePreview.value = product.imageUrl || '';
};

const confirmDelete = (product: Product) => {
  productToDelete.value = product;
  showDeleteModal.value = true;
};

const toggleProductAvailability = async (product: Product) => {
  try {
    const newAvailability = !product.isAvailable;
    // Aquí llamarías a tu API para actualizar la disponibilidad
    console.log(`Toggling availability for product ${product.id} to ${newAvailability}`);
    
    // Actualizar localmente
    product.isAvailable = newAvailability;
    product.available = newAvailability;
  } catch (error) {
    console.error('Error updating product availability:', error);
  }
};

const toggleAdvancedOptions = () => {
  showAdvancedOptions.value = !showAdvancedOptions.value;
};

// Manejo de archivos
const fileInput = ref(null);

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        imagePreview.value = e.target.result as string;
        productForm.imageUrl = e.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  }
};

const removeImage = () => {
  imagePreview.value = '';
  productForm.imageUrl = '';
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

// Formulario
const submitProductForm = async () => {
  formSubmitting.value = true;
  
  try {
    const productData = {
      name: productForm.name,
      description: productForm.description,
      price: productForm.price,
      imageUrl: productForm.imageUrl || '',
      isAvailable: productForm.available,
      categoryId: productForm.categoryId
    };

    if (showEditModal.value && productForm.id) {
      await api.put(`/api/Products/${productForm.id}`, productData);
      console.log('Producto actualizado');
    } else {
      await api.post('/api/Products', productData);
      console.log('Producto creado');
    }

    await loadProducts();
    closeModals();
    alert(`Producto ${showEditModal.value ? 'actualizado' : 'creado'} correctamente.`);

  } catch (error) {
    console.error('Error guardando producto:', error);
    alert(`Error al ${showEditModal.value ? 'actualizar' : 'crear'} el producto.`);
  } finally {
    formSubmitting.value = false;
  }
};

const deleteProduct = async () => {
  if (!productToDelete.value?.id) return;

  deleteLoading.value = true;

  try {
    await api.delete(`/api/Products/${productToDelete.value.id}`);
    await loadProducts();
    showDeleteModal.value = false;
    productToDelete.value = null;
    alert('Producto eliminado correctamente.');
  } catch (error) {
    console.error('Error eliminando producto:', error);
    alert('Error al eliminar el producto.');
  } finally {
    deleteLoading.value = false;
  }
};

// Paginación
const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

// Inicialización
onMounted(async () => {
  console.log('BusinessProducts mounted');

  // Verificar autenticación
  if (!authStore.isAuthenticated()) {
    try {
      const isAuth = await authStore.checkAuth();
      if (!isAuth || (authStore.user?.role !== 'Business' && authStore.user?.role !== 'Admin')) {
        console.log('Usuario no autorizado, redirigiendo...');
        router.push('/login?redirect=/business/products');
        return;
      }
    } catch (error) {
      console.error("Error en checkAuth:", error);
      router.push('/login');
      return;
    }
  }

  console.log('Usuario autenticado:', authStore.user);

  // Cargar datos en secuencia
  try {
    await loadBusiness();
    if (!business.value) {
      console.error('No se pudo cargar el business');
      router.push('/business/unauthorized');
      return;
    }

    await loadRestaurants();
    if (!restaurants.value.length) {
      console.log('No se encontraron restaurantes');
      // No redirigir, simplemente mostrar mensaje vacío
    }

    await Promise.all([loadProducts(), loadCategories()]);

    // Abrir modal si se indica en la ruta
    if (shouldOpenNewProductModal.value) {
      showAddModal.value = true;
    }
  } catch (error) {
    console.error('Error en la inicialización:', error);
  }
});
</script>

<style lang="scss" scoped>
.business-products {
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1.5rem;

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 1rem;
    }
  }

  &__header-left {
    flex: 1;
  }

  &__title {
    font-size: 1.75rem;
    font-weight: 700;
    margin: 0 0 0.25rem;
    color: #1e293b;
  }

  &__subtitle {
    color: #64748b;
    margin: 0;
  }

  &__add-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background-color: #06a98d;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.2s ease;

    svg {
      width: 16px;
      height: 16px;
    }

    &:hover {
      background-color: #058a73;
      transform: translateY(-1px);
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    &:active {
      transform: translateY(0);
    }

    @media (max-width: 768px) {
      width: 100%;
      justify-content: center;
    }
  }

  &__tools {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1.5rem;

    @media (max-width: 768px) {
      flex-direction: column;
    }
  }

  &__search {
    position: relative;
    flex: 1;
    min-width: 280px;

    @media (max-width: 768px) {
      width: 100%;
    }
  }

  &__search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    width: 18px;
    height: 18px;
    color: #94a3b8;
  }

  &__search-input {
    width: 100%;
    padding: 0.75rem 2.5rem;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 0.95rem;
    background-color: white;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: #06a98d;
      box-shadow: 0 0 0 3px rgba(6, 169, 141, 0.1);
    }
  }

  &__search-clear {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    padding: 0.25rem;
    color: #94a3b8;
    cursor: pointer;

    svg {
      width: 16px;
      height: 16px;
    }

    &:hover {
      color: #64748b;
    }
  }

  &__filters {
    display: flex;
    gap: 0.75rem;

    @media (max-width: 768px) {
      width: 100%;
      justify-content: space-between;
    }

    @media (max-width: 480px) {
      flex-wrap: wrap;
    }
  }

  &__filter {
    @media (max-width: 480px) {
      flex: 1 0 calc(50% - 0.375rem);

      &--view {
        flex: 0 0 100%;
        margin-top: 0.75rem;
      }
    }
  }

  &__select {
    min-width: 180px;
    padding: 0.75rem 2rem 0.75rem 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 0.95rem;
    background-color: white;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    background-size: 1rem;

    &:focus {
      outline: none;
      border-color: #06a98d;
      box-shadow: 0 0 0 3px rgba(6, 169, 141, 0.1);
    }

    @media (max-width: 768px) {
      width: 100%;
    }
  }

  &__filter--view {
    display: flex;
    align-items: center;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    overflow: hidden;
  }

  &__view-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: none;
    border: none;
    color: #94a3b8;
    cursor: pointer;

    svg {
      width: 18px;
      height: 18px;
    }

    &:hover {
      background-color: #f8fafc;
      color: #64748b;
    }

    &--active {
      background-color: #f1f5f9;
      color: #1e293b;
    }
  }

  &__loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;

    &__spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #f1f5f9;
      border-radius: 50%;
      border-top-color: #06a98d;
      animation: spinner 1s linear infinite;
      margin-bottom: 1rem;
    }

    p {
      color: #64748b;
    }
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    text-align: center;
    padding: 2rem;

    &-icon {
      width: 64px;
      height: 64px;
      background-color: #f1f5f9;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.5rem;

      svg {
        width: 32px;
        height: 32px;
        color: #94a3b8;
      }
    }

    h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 0.75rem;
    }

    p {
      color: #64748b;
      margin: 0 0 1.5rem;
      max-width: 400px;
    }
  }

  &__empty-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.25rem;
    background-color: #06a98d;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    svg {
      width: 18px;
      height: 18px;
    }

    &:hover {
      background-color: #058a73;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1.5rem;

    @media (max-width: 640px) {
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 1rem;
    }
  }

  &__card {
    background-color: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    height: 100%;
    display: flex;
    flex-direction: column;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

      .business-products__card-overlay {
        opacity: 1;
      }
    }
  }

  &__card-image {
    height: 180px;
    position: relative;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    &:hover img {
      transform: scale(1.05);
    }
  }

  &__card-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &__card-actions {
    display: flex;
    gap: 0.75rem;
  }

  &__action-btn {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.5rem 0.75rem;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;

    svg {
      width: 16px;
      height: 16px;
    }

    &--edit {
      background-color: white;
      color: #1e293b;

      &:hover {
        background-color: #f8fafc;
      }
    }

    &--delete {
      background-color: #ef4444;
      color: white;

      &:hover {
        background-color: #dc2626;
      }
    }
  }

  &__availability {
    position: absolute;
    top: 0.75rem;
    left: 0.75rem;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 500;

    &--available {
      background-color: #dcfce7;
      color: #16a34a;
    }

    &--unavailable {
      background-color: #fee2e2;
      color: #dc2626;
    }
  }

  &__card-content {
    padding: 1.25rem;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  &__card-category {
    font-size: 0.8rem;
    color: #64748b;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  &__card-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 0.5rem;
    line-height: 1.3;
  }

  &__card-description {
    font-size: 0.9rem;
    color: #64748b;
    line-height: 1.5;
    margin: 0 0 1rem;
    flex: 1;
  }

  &__card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
  }

  &__price-container {
    display: flex;
    flex-direction: column;
  }

  &__price {
    font-weight: 700;
    font-size: 1.1rem;
    color: #1e293b;
  }

  &__original-price {
    font-size: 0.85rem;
    color: #94a3b8;
    text-decoration: line-through;
  }

  &__card-toggle {
    display: flex;
    align-items: center;
  }

  &__toggle-btn {
    position: relative;
    width: 40px;
    height: 22px;
    border-radius: 11px;
    background-color: #e2e8f0;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &--on {
      background-color: #06a98d;

      .business-products__toggle-slider {
        left: 20px;
      }
    }

    &--off {
      background-color: #e2e8f0;

      .business-products__toggle-slider {
        left: 2px;
      }
    }
  }

  &__toggle-slider {
    position: absolute;
    top: 2px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background-color: white;
    transition: left 0.2s ease;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  /* Lista de productos */
  &__list {
    margin-bottom: 1.5rem;
    overflow-x: auto;
  }

  &__table {
    width: 100%;
    border-collapse: collapse;

    th {
      background-color: #f8fafc;
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      color: #1e293b;
      border-bottom: 1px solid #e2e8f0;
      font-size: 0.9rem;
      white-space: nowrap;

      &:first-child {
        border-top-left-radius: 8px;
      }

      &:last-child {
        border-top-right-radius: 8px;
      }
    }
  }

  &__row {
    border-bottom: 1px solid #e2e8f0;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #f8fafc;
    }

    &:last-child {
      border-bottom: none;
    }
  }

  &__cell {
    padding: 1rem;
    font-size: 0.95rem;
    color: #1e293b;

    &--image {
      width: 60px;
      padding: 0.5rem 0.5rem 0.5rem 1rem;
    }

    &--actions {
      width: 100px;
      text-align: right;
      white-space: nowrap;
    }
  }

  &__thumbnail {
    width: 50px;
    height: 50px;
    border-radius: 6px;
    object-fit: cover;
  }

  &__product-name {
    font-weight: 500;
    max-width: 250px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__category-badge {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    background-color: #f1f5f9;
    color: #64748b;
    border-radius: 4px;
    font-size: 0.8rem;
  }

  &__price-info {
    display: flex;
    flex-direction: column;
  }

  &__price-value {
    font-weight: 600;
    color: #1e293b;
  }

  &__price-original {
    font-size: 0.85rem;
    color: #94a3b8;
    text-decoration: line-through;
  }

  &__toggle-container {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  &__toggle-label {
    font-size: 0.85rem;
    white-space: nowrap;
  }

  &__table-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
  }

  &__table-btn {
    width: 32px;
    height: 32px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;

    svg {
      width: 16px;
      height: 16px;
    }

    &--edit {
      background-color: #f1f5f9;
      color: #1e293b;

      &:hover {
        background-color: #e2e8f0;
      }
    }

    &--delete {
      background-color: #fee2e2;
      color: #ef4444;

      &:hover {
        background-color: #fecaca;
      }
    }
  }

  /* Paginación */
  &__pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 2rem;

    @media (max-width: 640px) {
      flex-direction: column;
      gap: 1rem;
      align-items: stretch;
    }
  }

  &__pagination-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1rem;
    background-color: white;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 0.9rem;
    color: #1e293b;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    svg {
      width: 16px;
      height: 16px;
    }

    &:hover:not(:disabled) {
      background-color: #f8fafc;
      border-color: #cbd5e0;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    @media (max-width: 640px) {
      width: 100%;
      justify-content: center;
    }
  }

  &__pagination-pages {
    display: flex;
    align-items: center;
    gap: 0.25rem;

    @media (max-width: 640px) {
      justify-content: center;
    }
  }

  &__page-btn {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    background-color: white;
    border: 1px solid #e2e8f0;
    font-size: 0.9rem;
    color: #1e293b;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover:not(&--active):not(&--disabled) {
      background-color: #f8fafc;
      border-color: #cbd5e0;
    }

    &--active {
      background-color: #06a98d;
      color: white;
      border-color: #06a98d;
      font-weight: 600;
    }

    &--disabled {
      background-color: white;
      border-color: #e2e8f0;
      cursor: default;
    }
  }

  /* Modales */
  &__modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }

  &__modal-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }

  &__modal-container {
    position: relative;
    background-color: white;
    border-radius: 12px;
    max-width: 700px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    z-index: 101;
    display: flex;
    flex-direction: column;

    &--small {
      max-width: 500px;
    }
  }

  &__modal-header {
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 10;
  }

  &__modal-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
    color: #1e293b;
  }

  &__modal-close {
    width: 32px;
    height: 32px;
    background: none;
    border: none;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #64748b;
    cursor: pointer;

    svg {
      width: 18px;
      height: 18px;
    }

    &:hover {
      background-color: #f1f5f9;
      color: #1e293b;
    }
  }

  &__modal-body {
    padding: 1.5rem;
  }

  /* Formulario */
  &__form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  &__form-group {
    &--checkbox {
      margin-top: 0.5rem;
    }
  }

  &__form-row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;

    @media (max-width: 640px) {
      grid-template-columns: 1fr;
      gap: 1.25rem;
    }
  }

  &__form-label {
    display: block;
    font-size: 0.9rem;
    font-weight: 500;
    color: #1e293b;
    margin-bottom: 0.5rem;
  }

  &__form-hint {
    font-weight: 400;
    color: #64748b;
    font-size: 0.8rem;
  }

  &__form-input,
  &__form-select,
  &__form-textarea {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 0.95rem;
    color: #1e293b;
    background-color: white;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: #06a98d;
      box-shadow: 0 0 0 3px rgba(6, 169, 141, 0.1);
    }
  }

  &__form-select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    background-size: 1rem;
    padding-right: 2.5rem;
  }

  &__form-textarea {
    resize: vertical;
    min-height: 100px;
  }

  &__availability-options {
    display: flex;
    gap: 1.5rem;
  }

  &__radio-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.95rem;
    color: #1e293b;
    cursor: pointer;

    input[type="radio"] {
      width: 16px;
      height: 16px;
      accent-color: #06a98d;
    }
  }

  &__checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.95rem;
    color: #1e293b;
    cursor: pointer;
  }

  &__form-checkbox {
    width: 16px;
    height: 16px;
    accent-color: #06a98d;
  }

  &__image-upload {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__image-preview {
    width: 100%;
    height: 200px;
    border: 1px dashed #cbd5e0;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__preview-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #94a3b8;

    svg {
      width: 48px;
      height: 48px;
      margin-bottom: 0.75rem;
      opacity: 0.5;
    }
  }

  &__upload-actions {
    display: flex;
    gap: 0.75rem;

    @media (max-width: 480px) {
      flex-direction: column;
    }
  }

  &__file-input {
    display: none;
  }

  &__upload-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1rem;
    background-color: #f1f5f9;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    color: #1e293b;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    svg {
      width: 16px;
      height: 16px;
    }

    &:hover {
      background-color: #e2e8f0;
    }

    @media (max-width: 480px) {
      flex: 1;
      justify-content: center;
    }
  }

  &__remove-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1rem;
    background-color: #fee2e2;
    border: 1px solid #fecaca;
    border-radius: 8px;
    color: #ef4444;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    svg {
      width: 16px;
      height: 16px;
    }

    &:hover {
      background-color: #fecaca;
    }

    @media (max-width: 480px) {
      flex: 1;
      justify-content: center;
    }
  }

  &__form-divider {
    height: 1px;
    background-color: #e2e8f0;
    margin: 0.5rem 0;
  }

  &__accordion {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    background-color: #f8fafc;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;

    svg {
      width: 18px;
      height: 18px;
      transition: transform 0.2s ease;
    }

    &:hover {
      background-color: #f1f5f9;
    }
  }

  &__rotate-icon {
    transform: rotate(180deg);
  }

  &__advanced-options {
    animation: slideDown 0.3s ease;
    margin-top: 0.75rem;
    padding: 1rem;
    background-color: #f8fafc;
    border-radius: 8px;
  }

  &__form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1.5rem;

    @media (max-width: 480px) {
      flex-direction: column;
    }
  }

  &__form-btn {
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    &--cancel {
      background-color: white;
      color: #64748b;
      border: 1px solid #e2e8f0;

      &:hover {
        background-color: #f8fafc;
        color: #1e293b;
      }
    }

    &--submit {
      background-color: #06a98d;
      color: white;
      border: none;
      min-width: 140px;
      display: inline-flex;
      align-items: center;
      justify-content: center;

      &:hover:not(:disabled) {
        background-color: #058a73;
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }

    &--delete {
      background-color: #ef4444;
      color: white;
      border: none;
      min-width: 140px;
      display: inline-flex;
      align-items: center;
      justify-content: center;

      &:hover:not(:disabled) {
        background-color: #dc2626;
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }

    @media (max-width: 480px) {
      width: 100%;
    }
  }

  &__btn-spinner {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spinner 1s linear infinite;
  }

  /* Modal de confirmación */
  &__delete-warning {
    display: flex;
    align-items: flex-start;
    gap: 1rem;

    @media (max-width: 480px) {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
  }

  &__warning-icon {
    width: 48px;
    height: 48px;
    color: #ef4444;
    flex-shrink: 0;
  }

  &__warning-content {
    h4 {
      font-size: 1.1rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 0.75rem;
    }

    p {
      margin: 0 0 0.5rem;
      color: #1e293b;
    }
  }

  &__warning-notice {
    color: #ef4444 !important;
    font-weight: 500 !important;
  }

  &__modal-footer {
    padding: 1.25rem 1.5rem;
    border-top: 1px solid #e2e8f0;
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    position: sticky;
    bottom: 0;
    background-color: white;
    z-index: 10;

    @media (max-width: 480px) {
      flex-direction: column;
    }
  }
}

/* Animaciones */
@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>