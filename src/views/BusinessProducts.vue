<template>
  <div class="business-products">
    <div class="business-products__header">
      <div class="business-products__header-left">
        <h1 class="business-products__title">Gestión de Productos</h1>
        <p class="business-products__subtitle">Administra tu menú y asigna productos a tus restaurantes</p>
      </div>
      <div class="business-products__header-actions">
        <button @click="showCategoryModal = true" class="business-products__secondary-btn">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
          </svg>
          <span>Gestionar Categorías</span>
        </button>
        <button @click="showAddModal = true" class="business-products__add-btn">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>Añadir Producto</span>
        </button>
      </div>
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
          <select v-model="statusFilter" class="business-products__select">
            <option value="">Todos los estados</option>
            <option value="assigned">Con restaurantes asignados</option>
            <option value="unassigned">Sin asignar</option>
            <option value="available">Disponibles</option>
            <option value="unavailable">No disponibles</option>
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
      <p v-if="searchQuery || categoryFilter || statusFilter">
        No hay resultados para los filtros seleccionados. Prueba con otros criterios.
      </p>
      <p v-else>
        ¡Comienza creando productos para tu negocio!
      </p>
      <button @click="showAddModal = true" class="business-products__empty-button">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Crear Primer Producto
      </button>
    </div>

    <div v-else-if="viewMode === 'grid'" class="business-products__grid">
      <div v-for="product in filteredProducts" :key="product.id" class="business-products__card">
        <div class="business-products__card-image">
          <img :src="product.imageUrl || '/images/product-placeholder.png'" :alt="product.name" loading="lazy">
          <div class="business-products__card-overlay">
            <div class="business-products__card-actions">
              <button @click="manageRestaurantAssignments(product)" class="business-products__action-btn business-products__action-btn--assign">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                <span>Restaurantes</span>
              </button>
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
          <div :class="['business-products__availability', product.isAvailable ? 'business-products__availability--available' : 'business-products__availability--unavailable']">
            {{ product.isAvailable ? 'Disponible' : 'No disponible' }}
          </div>
        </div>
        <div class="business-products__card-content">
          <div class="business-products__card-category">{{ getCategoryName(product.categoryId) }}</div>
          <h3 class="business-products__card-title">{{ product.name }}</h3>
          <p class="business-products__card-description">{{ truncateText(product.description, 80) }}</p>

          <!-- Información de restaurantes -->
          <div class="business-products__restaurants-info">
            <div class="business-products__restaurants-count">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <span>{{ getAssignedRestaurantsCount(product.id) }} de {{ restaurants.length }} restaurantes</span>
            </div>
            <div v-if="getAssignedRestaurantsCount(product.id) > 0" class="business-products__price-range">
              <span>{{ getPriceRange(product.id) }}</span>
            </div>
          </div>

          <div class="business-products__card-footer">
            <div class="business-products__price-container">
              <span class="business-products__price-label">Precio base:</span>
              <span class="business-products__price">{{ formatPrice(product.basePrice) }}</span>
            </div>
            <div class="business-products__card-toggle">
              <button
                @click="toggleProductAvailability(product)"
                :class="[
                  'business-products__toggle-btn',
                  product.isAvailable ? 'business-products__toggle-btn--on' : 'business-products__toggle-btn--off'
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
            <th>Precio Base</th>
            <th>Restaurantes</th>
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
                <span class="business-products__price-value">{{ formatPrice(product.basePrice) }}</span>
              </div>
            </td>
            <td class="business-products__cell">
              <div class="business-products__restaurants-cell">
                <span class="business-products__restaurants-count-text">
                  {{ getAssignedRestaurantsCount(product.id) }}/{{ restaurants.length }}
                </span>
                <button @click="manageRestaurantAssignments(product)" class="business-products__manage-btn">
                  Gestionar
                </button>
              </div>
            </td>
            <td class="business-products__cell">
              <div class="business-products__toggle-container">
                <button
                  @click="toggleProductAvailability(product)"
                  :class="[
                    'business-products__toggle-btn',
                    product.isAvailable ? 'business-products__toggle-btn--on' : 'business-products__toggle-btn--off'
                  ]"
                >
                  <span class="business-products__toggle-slider"></span>
                </button>
                <span class="business-products__toggle-label">
                  {{ product.isAvailable ? 'Disponible' : 'No disponible' }}
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
                <label for="productCategory" class="business-products__form-label">
                  Categoría *
                  <button
                    type="button"
                    @click="showQuickCategoryModal = true"
                    class="business-products__inline-btn"
                  >
                    + Nueva
                  </button>
                </label>
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
                    <input type="radio" v-model="productForm.isAvailable" :value="true">
                    <span>Disponible</span>
                  </label>
                  <label class="business-products__radio-label">
                    <input type="radio" v-model="productForm.isAvailable" :value="false">
                    <span>No disponible</span>
                  </label>
                </div>
              </div>
            </div>

            <div class="business-products__form-row">
              <div class="business-products__form-group">
                <label for="productPrice" class="business-products__form-label">Precio base (€) *</label>
                <input
                  type="number"
                  id="productPrice"
                  v-model="productForm.basePrice"
                  class="business-products__form-input"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  required
                />
                <small class="business-products__form-hint">
                  Este será el precio base. Podrás personalizar precios por restaurante después.
                </small>
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
                <span v-else>{{ showEditModal ? 'Guardar cambios' : 'Crear producto' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal para gestionar asignaciones de restaurantes -->
    <div v-if="showRestaurantModal" class="business-products__modal">
      <div class="business-products__modal-backdrop" @click="showRestaurantModal = false"></div>
      <div class="business-products__modal-container business-products__modal-container--wide">
        <div class="business-products__modal-header">
          <h3 class="business-products__modal-title">
            Gestionar Restaurantes: {{ selectedProduct?.name }}
          </h3>
          <button @click="showRestaurantModal = false" class="business-products__modal-close">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="business-products__modal-body">
          <div class="business-products__restaurant-assignments">
            <div class="business-products__product-info">
              <div class="business-products__product-summary">
                <img :src="selectedProduct?.imageUrl || '/images/product-placeholder.png'" :alt="selectedProduct?.name" class="business-products__product-thumb">
                <div>
                  <h4>{{ selectedProduct?.name }}</h4>
                  <p>Precio base: {{ formatPrice(selectedProduct?.basePrice) }}</p>
                  <p>Categoría: {{ getCategoryName(selectedProduct?.categoryId) }}</p>
                </div>
              </div>
            </div>

            <div class="business-products__assignments-list">
              <h4>Asignar a restaurantes:</h4>
              <div class="business-products__restaurant-items">
                <div v-for="restaurant in restaurants" :key="restaurant.id" class="business-products__restaurant-item">
                  <div class="business-products__restaurant-info">
                    <div class="business-products__restaurant-header">
                      <div class="business-products__restaurant-details">
                        <h5>{{ restaurant.name }}</h5>
                        <p>{{ restaurant.address?.city || 'Sin ubicación' }}</p>
                      </div>
                      <div class="business-products__assignment-toggle">
                        <button
                          @click="toggleRestaurantAssignment(restaurant.id)"
                          :class="[
                            'business-products__toggle-btn',
                            isAssignedToRestaurant(restaurant.id) ? 'business-products__toggle-btn--on' : 'business-products__toggle-btn--off'
                          ]"
                        >
                          <span class="business-products__toggle-slider"></span>
                        </button>
                        <span class="business-products__assignment-label">
                          {{ isAssignedToRestaurant(restaurant.id) ? 'Asignado' : 'Sin asignar' }}
                        </span>
                      </div>
                    </div>

                    <!-- Configuración específica del restaurante -->
                    <div v-if="isAssignedToRestaurant(restaurant.id)" class="business-products__restaurant-config">
                      <div class="business-products__config-row">
                        <div class="business-products__config-group">
                          <label class="business-products__config-label">Precio en este restaurante (€)</label>
                          <input
                            type="number"
                            :value="getRestaurantPrice(restaurant.id)"
                            @input="updateRestaurantPrice(restaurant.id, $event.target.value)"
                            class="business-products__config-input"
                            step="0.01"
                            min="0"
                            placeholder="Usar precio base"
                          />
                        </div>
                        <div class="business-products__config-group">
                          <label class="business-products__config-label">Stock disponible</label>
                          <input
                            type="number"
                            :value="getRestaurantStock(restaurant.id)"
                            @input="updateRestaurantStock(restaurant.id, $event.target.value)"
                            class="business-products__config-input"
                            min="0"
                            placeholder="Sin límite"
                          />
                        </div>
                      </div>
                      <div class="business-products__config-group">
                        <label class="business-products__config-label">Notas específicas</label>
                        <textarea
                          :value="getRestaurantNotes(restaurant.id)"
                          @input="updateRestaurantNotes(restaurant.id, $event.target.value)"
                          class="business-products__config-textarea"
                          rows="2"
                          placeholder="Notas o variaciones específicas para este restaurante..."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="business-products__modal-footer">
          <button
            @click="showRestaurantModal = false"
            class="business-products__form-btn business-products__form-btn--cancel"
          >
            Cancelar
          </button>
          <button
            @click="saveRestaurantAssignments"
            class="business-products__form-btn business-products__form-btn--submit"
            :disabled="assignmentsLoading"
          >
            <span v-if="assignmentsLoading" class="business-products__btn-spinner"></span>
            <span v-else>Guardar Asignaciones</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de gestión de categorías -->
    <div v-if="showCategoryModal" class="business-products__modal">
      <div class="business-products__modal-backdrop" @click="showCategoryModal = false"></div>
      <div class="business-products__modal-container business-products__modal-container--wide">
        <div class="business-products__modal-header">
          <h3 class="business-products__modal-title">Gestión de Categorías</h3>
          <button @click="showCategoryModal = false" class="business-products__modal-close">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="business-products__modal-body">
          <div class="business-products__categories-section">
            <div class="business-products__categories-header">
              <h4>Categorías Existentes</h4>
              <button @click="showAddCategoryForm = true" class="business-products__add-category-btn">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Nueva Categoría
              </button>
            </div>

            <div v-if="categories.length === 0" class="business-products__empty-categories">
              <p>No tienes categorías creadas aún.</p>
              <button @click="showAddCategoryForm = true" class="business-products__empty-button">
                Crear Primera Categoría
              </button>
            </div>

            <div v-else class="business-products__categories-list">
              <div v-for="category in categories" :key="category.id" class="business-products__category-item">
                <div class="business-products__category-info">
                  <h5 class="business-products__category-name">{{ category.name }}</h5>
                  <p class="business-products__category-desc">{{ category.description || 'Sin descripción' }}</p>
                  <span class="business-products__category-count">
                    {{ getProductCountByCategory(category.id) }} producto(s)
                  </span>
                </div>
                <div class="business-products__category-actions">
                  <button @click="editCategory(category)" class="business-products__category-btn business-products__category-btn--edit">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    Editar
                  </button>
                  <button
                    @click="confirmDeleteCategory(category)"
                    class="business-products__category-btn business-products__category-btn--delete"
                    :disabled="getProductCountByCategory(category.id) > 0"
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

            <!-- Formulario para añadir/editar categoría -->
            <div v-if="showAddCategoryForm || showEditCategoryForm" class="business-products__category-form">
              <div class="business-products__form-divider"></div>
              <h4>{{ showEditCategoryForm ? 'Editar Categoría' : 'Nueva Categoría' }}</h4>
              <form @submit.prevent="submitCategoryForm" class="business-products__form">
                <div class="business-products__form-row">
                  <div class="business-products__form-group">
                    <label class="business-products__form-label">Nombre *</label>
                    <input
                      type="text"
                      v-model="categoryForm.name"
                      class="business-products__form-input"
                      placeholder="Ej: Entrantes, Platos principales..."
                      required
                    />
                  </div>
                </div>
                <div class="business-products__form-group">
                  <label class="business-products__form-label">Descripción</label>
                  <textarea
                    v-model="categoryForm.description"
                    class="business-products__form-textarea"
                    placeholder="Descripción opcional de la categoría..."
                    rows="3"
                  ></textarea>
                </div>
                <div class="business-products__form-actions">
                  <button
                    type="button"
                    @click="cancelCategoryForm"
                    class="business-products__form-btn business-products__form-btn--cancel"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    class="business-products__form-btn business-products__form-btn--submit"
                    :disabled="categoryFormSubmitting"
                  >
                    <span v-if="categoryFormSubmitting" class="business-products__btn-spinner"></span>
                    <span v-else>{{ showEditCategoryForm ? 'Guardar' : 'Crear' }}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal rápido para crear categoría desde formulario de producto -->
    <div v-if="showQuickCategoryModal" class="business-products__modal">
      <div class="business-products__modal-backdrop" @click="showQuickCategoryModal = false"></div>
      <div class="business-products__modal-container business-products__modal-container--small">
        <div class="business-products__modal-header">
          <h3 class="business-products__modal-title">Nueva Categoría</h3>
          <button @click="showQuickCategoryModal = false" class="business-products__modal-close">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="business-products__modal-body">
          <form @submit.prevent="submitQuickCategory" class="business-products__form">
            <div class="business-products__form-group">
              <label class="business-products__form-label">Nombre *</label>
              <input
                type="text"
                v-model="quickCategoryForm.name"
                class="business-products__form-input"
                placeholder="Ej: Entrantes, Platos principales..."
                required
              />
            </div>
            <div class="business-products__form-group">
              <label class="business-products__form-label">Descripción</label>
              <textarea
                v-model="quickCategoryForm.description"
                class="business-products__form-textarea"
                placeholder="Descripción opcional..."
                rows="2"
              ></textarea>
            </div>
            <div class="business-products__form-actions">
              <button
                type="button"
                @click="showQuickCategoryModal = false"
                class="business-products__form-btn business-products__form-btn--cancel"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="business-products__form-btn business-products__form-btn--submit"
                :disabled="quickCategorySubmitting"
              >
                <span v-if="quickCategorySubmitting" class="business-products__btn-spinner"></span>
                <span v-else">Crear</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modales de confirmación de eliminación existentes... -->
    <div v-if="showDeleteModal" class="business-products__modal">
      <div class="business-products__modal-backdrop" @click="showDeleteModal = false"></div>
      <div class="business-products__modal-container business-products__modal-container--small">
        <div class="business-products__modal-header">
          <h3 class="business-products__modal-title">Eliminar Producto</h3>
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
                <strong>{{ productToDelete.name }}</strong> se eliminará de todos los restaurantes.
              </p>
              <p class="business-products__warning-notice">Esta acción no se puede deshacer.</p>
            </div>
          </div>
        </div>
        <div class="business-products__modal-footer">
          <button @click="showDeleteModal = false" class="business-products__form-btn business-products__form-btn--cancel">
            Cancelar
          </button>
          <button @click="deleteProduct" class="business-products__form-btn business-products__form-btn--delete" :disabled="deleteLoading">
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
import { ImageService } from '@/services/imageService';

interface Product {
  id?: number;
  name: string;
  description: string;
  basePrice: number;
  imageUrl?: string;
  isAvailable: boolean;
  categoryId: number;
  businessId?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
  businessId: number;
}

interface RestaurantAssignment {
  restaurantId: number;
  isAssigned: boolean;
  price?: number;
  stockQuantity?: number;
  notes?: string;
}

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// Estados principales
const business = ref(null);
const restaurants = ref([]);
const loading = ref(false);
const products = ref<Product[]>([]);
const categories = ref<Category[]>([]);
const restaurantProducts = ref({}); // Para almacenar asignaciones de productos por restaurante

// Estados de UI
const searchQuery = ref('');
const categoryFilter = ref('');
const statusFilter = ref('');
const sortOption = ref('name_asc');
const viewMode = ref('grid');

// Estados del modal de productos
const showAddModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const formSubmitting = ref(false);
const deleteLoading = ref(false);
const productToDelete = ref<Product | null>(null);
const imagePreview = ref('');

// Estados del modal de restaurantes
const showRestaurantModal = ref(false);
const selectedProduct = ref<Product | null>(null);
const restaurantAssignments = ref<RestaurantAssignment[]>([]);
const assignmentsLoading = ref(false);

// Estados del modal de categorías
const showCategoryModal = ref(false);
const showAddCategoryForm = ref(false);
const showEditCategoryForm = ref(false);
const showQuickCategoryModal = ref(false);
const showDeleteCategoryModal = ref(false);
const categoryFormSubmitting = ref(false);
const quickCategorySubmitting = ref(false);
const deleteCategoryLoading = ref(false);
const categoryToDelete = ref<Category | null>(null);

// Formularios
const productForm = reactive({
  id: undefined,
  name: '',
  description: '',
  basePrice: 0,
  categoryId: 0,
  isAvailable: true,
  imageUrl: ''
});

const categoryForm = reactive({
  id: undefined,
  name: '',
  description: ''
});

const quickCategoryForm = reactive({
  name: '',
  description: ''
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

  if (statusFilter.value) {
    switch (statusFilter.value) {
      case 'assigned':
        result = result.filter(product => getAssignedRestaurantsCount(product.id) > 0);
        break;
      case 'unassigned':
        result = result.filter(product => getAssignedRestaurantsCount(product.id) === 0);
        break;
      case 'available':
        result = result.filter(product => product.isAvailable);
        break;
      case 'unavailable':
        result = result.filter(product => !product.isAvailable);
        break;
    }
  }

  // Ordenamiento
  switch (sortOption.value) {
    case 'name_desc':
      result.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case 'price_asc':
      result.sort((a, b) => a.basePrice - b.basePrice);
      break;
    case 'price_desc':
      result.sort((a, b) => b.basePrice - a.basePrice);
      break;
    default:
      result.sort((a, b) => a.name.localeCompare(b.name));
  }

  return result;
});

// Cargar business
const loadBusiness = async () => {
  try {
    const userId = authStore.user?.id;
    if (!userId) return;

    const response = await api.get(`/api/Business/user/${userId}`);
    business.value = response.data || null;
  } catch (error) {
    console.error('Error cargando business:', error);
    business.value = null;
  }
};

// Cargar restaurantes del business
const loadRestaurants = async () => {
  try {
    if (!business.value?.id) return;

    const response = await api.get(`/api/Restaurants/business/${business.value.id}`);
    restaurants.value = response.data || [];
    console.log('Restaurantes cargados:', restaurants.value);
  } catch (error) {
    console.error('Error cargando restaurantes:', error);
    restaurants.value = [];
  }
};

// Cargar categorías del business
const loadCategories = async () => {
  try {
    if (!business.value?.id) return;

    const response = await api.get(`/api/categories/business/${business.value.id}`);
    categories.value = response.data || [];
    console.log('Categorías cargadas:', categories.value);
  } catch (error) {
    console.error('Error cargando categorías:', error);
    categories.value = [];
  }
};

// Cargar productos del business
const loadProducts = async () => {
  if (!business.value?.id) {
    products.value = [];
    return;
  }

  loading.value = true;

  try {
    // Cargar productos del business
    const response = await api.get(`/api/Products/Business/${business.value.id}`);
    products.value = response.data || [];
    // Cargar asignaciones de restaurantes para cada producto
    await loadRestaurantAssignments();
  } catch (error) {
    console.error('Error cargando productos:', error);
    products.value = [];
  } finally {
    loading.value = false;
  }
};

// Cargar asignaciones de productos a restaurantes
const loadRestaurantAssignments = async () => {
  const assignments = {};

  for (const restaurant of restaurants.value) {
    try {
      const response = await api.get(`/api/restaurants/${restaurant.id}/products`);
      assignments[restaurant.id] = response.data || [];
    } catch (error) {
      console.error(`Error cargando productos del restaurante ${restaurant.id}:`, error);
      assignments[restaurant.id] = [];
    }
  }

  restaurantProducts.value = assignments;
  console.log('Asignaciones cargadas:', restaurantProducts.value);
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

const getProductCountByCategory = (categoryId: number) => {
  return products.value.filter(p => p.categoryId === categoryId).length;
};

const getAssignedRestaurantsCount = (productId: number) => {
  let count = 0;
  for (const restaurantId in restaurantProducts.value) {
    const restaurantProductsList = restaurantProducts.value[restaurantId];
    if (restaurantProductsList.some(rp => rp.productId === productId)) {
      count++;
    }
  }
  return count;
};

const getPriceRange = (productId: number) => {
  const prices = [];
  const baseProduct = products.value.find(p => p.id === productId);

  if (!baseProduct) return '';

  for (const restaurantId in restaurantProducts.value) {
    const restaurantProductsList = restaurantProducts.value[restaurantId];
    const restaurantProduct = restaurantProductsList.find(rp => rp.productId === productId);
    if (restaurantProduct) {
      prices.push(restaurantProduct.price || baseProduct.basePrice);
    }
  }

  if (prices.length === 0) return '';

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  if (minPrice === maxPrice) {
    return formatPrice(minPrice);
  } else {
    return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
  }
};

// Funciones de modal de productos
const closeModals = () => {
  showAddModal.value = false;
  showEditModal.value = false;
  showDeleteModal.value = false;
  resetProductForm();
};

const resetProductForm = () => {
  Object.assign(productForm, {
    id: undefined,
    name: '',
    description: '',
    basePrice: 0,
    categoryId: 0,
    isAvailable: true,
    imageUrl: ''
  });
  imagePreview.value = '';
};

const editProduct = (product: Product) => {
  showEditModal.value = true;
  Object.assign(productForm, {
    id: product.id,
    name: product.name,
    description: product.description,
    basePrice: product.basePrice,
    categoryId: product.categoryId,
    isAvailable: product.isAvailable,
    imageUrl: product.imageUrl || ''
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
    await api.put(`/api/Products/${product.id}`, {
      ...product,
      isAvailable: newAvailability
    });
    product.isAvailable = newAvailability;
  } catch (error) {
    console.error('Error actualizando disponibilidad:', error);
    alert('Error al actualizar la disponibilidad del producto');
  }
};

// Manejo de archivos con ImageService
const fileInput = ref(null);

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileChange = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  // Validar imagen
  const validation = ImageService.validateImage(file, 5 * 1024 * 1024); // 5MB máximo
  if (!validation.valid) {
    alert('Archivo no válido:\n' + validation.errors.join('\n'));
    event.target.value = '';
    return;
  }

  try {
    // Convertir a base64 para preview
    const base64 = await ImageService.fileToBase64(file);
    imagePreview.value = base64;
    productForm.imageUrl = base64;
  } catch (error) {
    console.error('Error procesando imagen:', error);
    alert('Error al procesar la imagen');
    event.target.value = '';
  }
};

const removeImage = () => {
  imagePreview.value = '';
  productForm.imageUrl = '';
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

// Formulario de productos con ImageService
const submitProductForm = async () => {
  formSubmitting.value = true;

  try {
    const productData = {
      name: productForm.name,
      description: productForm.description,
      basePrice: productForm.basePrice,
      isAvailable: productForm.isAvailable,
      categoryId: productForm.categoryId,
      businessId: business.value.id
    };

    let productResponse;
    let productId;

    // Crear o actualizar el producto sin imagen primero
    if (showEditModal.value && productForm.id) {
      productResponse = await api.put(`/api/Products/${productForm.id}`, productData);
      productId = productForm.id;
    } else {
      productResponse = await api.post('/api/Products', productData);
      productId = productResponse.data.id;
    }

    // Si hay una imagen nueva, subirla usando ImageService
    if (productForm.imageUrl && productForm.imageUrl.startsWith('data:')) {
      try {
        const imageResult = await ImageService.uploadBase64(
          productForm.imageUrl,
          `product-${productId}`,
          'products'
        );

        // Actualizar el producto con la URL de la imagen de S3
        await api.put(`/api/Products/${productId}`, {
          ...productData,
          imageUrl: imageResult.imageUrl
        });
      } catch (imageError) {
        console.error('Error subiendo imagen:', imageError);
        alert('Producto guardado correctamente, pero hubo un error al subir la imagen. Puedes intentar subirla después editando el producto.');
      }
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
    // Eliminar imagen de S3 si existe
    if (productToDelete.value.imageUrl) {
      try {
        await ImageService.delete(productToDelete.value.imageUrl);
      } catch (imageError) {
        console.warn('No se pudo eliminar la imagen:', imageError);
      }
    }

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

// Funciones de gestión de restaurantes
const manageRestaurantAssignments = async (product: Product) => {
  selectedProduct.value = product;

  // Inicializar asignaciones
  restaurantAssignments.value = restaurants.value.map(restaurant => {
    const existingAssignment = restaurantProducts.value[restaurant.id]?.find(rp => rp.productId === product.id);

    return {
      restaurantId: restaurant.id,
      isAssigned: !!existingAssignment,
      price: existingAssignment?.price || product.basePrice,
      stockQuantity: existingAssignment?.stockQuantity || 0,
      notes: existingAssignment?.notes || ''
    };
  });

  showRestaurantModal.value = true;
};

const isAssignedToRestaurant = (restaurantId: number) => {
  const assignment = restaurantAssignments.value.find(a => a.restaurantId === restaurantId);
  return assignment?.isAssigned || false;
};

const toggleRestaurantAssignment = (restaurantId: number) => {
  const assignment = restaurantAssignments.value.find(a => a.restaurantId === restaurantId);
  if (assignment) {
    assignment.isAssigned = !assignment.isAssigned;

    // Si se desasigna, resetear valores
    if (!assignment.isAssigned) {
      assignment.price = selectedProduct.value?.basePrice;
      assignment.stockQuantity = 0;
      assignment.notes = '';
    }
  }
};

const getRestaurantPrice = (restaurantId: number) => {
  const assignment = restaurantAssignments.value.find(a => a.restaurantId === restaurantId);
  return assignment?.price || selectedProduct.value?.basePrice || 0;
};

const updateRestaurantPrice = (restaurantId: number, value: string) => {
  const assignment = restaurantAssignments.value.find(a => a.restaurantId === restaurantId);
  if (assignment) {
    assignment.price = parseFloat(value) || selectedProduct.value?.basePrice || 0;
  }
};

const getRestaurantStock = (restaurantId: number) => {
  const assignment = restaurantAssignments.value.find(a => a.restaurantId === restaurantId);
  return assignment?.stockQuantity || 0;
};

const updateRestaurantStock = (restaurantId: number, value: string) => {
  const assignment = restaurantAssignments.value.find(a => a.restaurantId === restaurantId);
  if (assignment) {
    assignment.stockQuantity = parseInt(value) || 0;
  }
};

const getRestaurantNotes = (restaurantId: number) => {
  const assignment = restaurantAssignments.value.find(a => a.restaurantId === restaurantId);
  return assignment?.notes || '';
};

const updateRestaurantNotes = (restaurantId: number, value: string) => {
  const assignment = restaurantAssignments.value.find(a => a.restaurantId === restaurantId);
  if (assignment) {
    assignment.notes = value;
  }
};

const saveRestaurantAssignments = async () => {
  if (!selectedProduct.value?.id) return;

  assignmentsLoading.value = true;

  try {
    for (const assignment of restaurantAssignments.value) {
      const restaurantId = assignment.restaurantId;
      const productId = selectedProduct.value.id;

      if (assignment.isAssigned) {
        // Asignar o actualizar producto en restaurante
        const assignmentData = {
          productId: productId,
          price: assignment.price,
          isAvailable: true,
          stockQuantity: assignment.stockQuantity,
          notes: assignment.notes
        };

        try {
          await api.put(`/api/restaurants/${restaurantId}/products/${productId}`, assignmentData);
        } catch (error) {
          // Si no existe, crear nuevo
          await api.post(`/api/restaurants/${restaurantId}/products`, assignmentData);
        }
      } else {
        // Desasignar producto del restaurante
        try {
          await api.delete(`/api/restaurants/${restaurantId}/products/${productId}`);
        } catch (error) {
          // Puede que no exista, continuar
        }
      }
    }

    // Recargar asignaciones
    await loadRestaurantAssignments();
    showRestaurantModal.value = false;
    alert('Asignaciones guardadas correctamente.');

  } catch (error) {
    console.error('Error guardando asignaciones:', error);
    alert('Error al guardar las asignaciones.');
  } finally {
    assignmentsLoading.value = false;
  }
};

// Funciones de categorías
const editCategory = (category: Category) => {
  showEditCategoryForm.value = true;
  showAddCategoryForm.value = false;
  Object.assign(categoryForm, {
    id: category.id,
    name: category.name,
    description: category.description || ''
  });
};

const confirmDeleteCategory = (category: Category) => {
  categoryToDelete.value = category;
  showDeleteCategoryModal.value = true;
};

const cancelCategoryForm = () => {
  showAddCategoryForm.value = false;
  showEditCategoryForm.value = false;
  Object.assign(categoryForm, {
    id: undefined,
    name: '',
    description: ''
  });
};

const submitCategoryForm = async () => {
  categoryFormSubmitting.value = true;

  try {
    const categoryData = {
      name: categoryForm.name,
      description: categoryForm.description,
      businessId: business.value.id
    };

    if (showEditCategoryForm.value && categoryForm.id) {
      await api.put(`/api/categories/${categoryForm.id}`, categoryData);
    } else {
      await api.post('/api/categories', categoryData);
    }

    await loadCategories();
    cancelCategoryForm();
    alert(`Categoría ${showEditCategoryForm.value ? 'actualizada' : 'creada'} correctamente.`);

  } catch (error) {
    console.error('Error al guardar categoría:', error);
    alert(`Error al ${showEditCategoryForm.value ? 'actualizar' : 'crear'} la categoría.`);
  } finally {
    categoryFormSubmitting.value = false;
  }
};

const submitQuickCategory = async () => {
  quickCategorySubmitting.value = true;

  try {
    const categoryData = {
      name: quickCategoryForm.name,
      description: quickCategoryForm.description,
      businessId: business.value.id
    };

    const response = await api.post('/api/categories', categoryData);

    await loadCategories();

    // Seleccionar automáticamente la nueva categoría en el formulario de producto
    if (response.data?.id) {
      productForm.categoryId = response.data.id;
    }

    showQuickCategoryModal.value = false;
    Object.assign(quickCategoryForm, { name: '', description: '' });
    alert('Categoría creada correctamente.');

  } catch (error) {
    console.error('Error al crear categoría:', error);
    alert('Error al crear la categoría.');
  } finally {
    quickCategorySubmitting.value = false;
  }
};

// Inicialización
onMounted(async () => {
  if (!authStore.isAuthenticated) {
    try {
      const isAuth = await authStore.checkAuth();
      if (!isAuth || (authStore.user?.role !== 'Business' && authStore.user?.role !== 'Admin')) {
        router.push('/login?redirect=/business/products');
        return;
      }
    } catch (error) {
      router.push('/login');
      return;
    }
  }

  try {
    await loadBusiness();
    if (!business.value) {
      router.push('/business/unauthorized');
      return;
    }

    await loadRestaurants();
    await Promise.all([loadProducts(), loadCategories()]);

    if (route.name === 'business-products-new' || route.query.openModal === 'true') {
      showAddModal.value = true;
    }
  } catch (error) {
    console.error('Error en inicialización:', error);
  }
});
</script>

<style lang="scss" scoped>
.business-products {
  // Variables CSS
  --primary: #06a98d;
  --primary-hover: #058a73;
  --secondary: #64748b;
  --border: #e2e8f0;
  --border-hover: #cbd5e0;
  --background: #f8fafc;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --text-muted: #94a3b8;
  --white: #ffffff;
  --red: #ef4444;
  --red-hover: #dc2626;
  --green: #10b981;
  --orange: #f59e0b;
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-hover: 0 4px 12px rgba(0, 0, 0, 0.1);
  --radius: 8px;
  --radius-lg: 12px;
  --transition: all 0.2s ease;

  // =================================
  // LAYOUT PRINCIPAL
  // =================================

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1.5rem;
    gap: 1rem;

    @media (max-width: 768px) {
      flex-direction: column;
    }
  }

  &__header-left {
    flex: 1;
  }

  &__header-actions {
    display: flex;
    gap: 0.75rem;
    flex-shrink: 0;

    @media (max-width: 768px) {
      width: 100%;
    }

    @media (max-width: 480px) {
      flex-direction: column;
    }
  }

  &__title {
    font-size: 1.75rem;
    font-weight: 700;
    margin: 0 0 0.25rem;
    color: var(--text-primary);
    line-height: 1.2;
  }

  &__subtitle {
    color: var(--text-secondary);
    margin: 0;
    font-size: 1rem;
    line-height: 1.4;
  }

  // =================================
  // BOTONES DEL HEADER
  // =================================

  &__secondary-btn,
  &__add-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border-radius: var(--radius);
    font-weight: 500;
    font-size: 0.95rem;
    cursor: pointer;
    transition: var(--transition);
    border: 1px solid;
    white-space: nowrap;

    svg {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
    }

    @media (max-width: 768px) {
      flex: 1;
      justify-content: center;
    }
  }

  &__secondary-btn {
    background-color: var(--white);
    color: var(--text-primary);
    border-color: var(--border);

    &:hover {
      background-color: var(--background);
      border-color: var(--border-hover);
    }
  }

  &__add-btn {
    background-color: var(--primary);
    color: var(--white);
    border-color: var(--primary);

    &:hover {
      background-color: var(--primary-hover);
      border-color: var(--primary-hover);
      transform: translateY(-1px);
      box-shadow: var(--shadow-hover);
    }

    &:active {
      transform: translateY(0);
    }
  }

  // =================================
  // HERRAMIENTAS Y FILTROS
  // =================================

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
      min-width: unset;
    }
  }

  &__search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    width: 18px;
    height: 18px;
    color: var(--text-muted);
    pointer-events: none;
  }

  &__search-input {
    width: 100%;
    padding: 0.75rem 2.5rem;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    font-size: 0.95rem;
    background-color: var(--white);
    transition: var(--transition);

    &:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(6, 169, 141, 0.1);
    }

    &::placeholder {
      color: var(--text-muted);
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
    color: var(--text-muted);
    cursor: pointer;
    border-radius: 50%;
    transition: var(--transition);

    svg {
      width: 16px;
      height: 16px;
    }

    &:hover {
      color: var(--text-secondary);
      background-color: var(--background);
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
    border: 1px solid var(--border);
    border-radius: var(--radius);
    font-size: 0.95rem;
    background-color: var(--white);
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    background-size: 1rem;
    transition: var(--transition);

    &:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(6, 169, 141, 0.1);
    }

    @media (max-width: 768px) {
      width: 100%;
      min-width: unset;
    }
  }

  &__filter--view {
    display: flex;
    align-items: center;
    border: 1px solid var(--border);
    border-radius: var(--radius);
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
    color: var(--text-muted);
    cursor: pointer;
    transition: var(--transition);

    svg {
      width: 18px;
      height: 18px;
    }

    &:hover {
      background-color: var(--background);
      color: var(--text-secondary);
    }

    &--active {
      background-color: #f1f5f9;
      color: var(--text-primary);
    }
  }

  // =================================
  // ESTADOS DE CARGA Y VACÍO
  // =================================

  &__loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    gap: 1rem;

    p {
      color: var(--text-secondary);
      font-size: 0.95rem;
    }
  }

  &__spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #f1f5f9;
    border-radius: 50%;
    border-top-color: var(--primary);
    animation: spinner 1s linear infinite;
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
        color: var(--text-muted);
      }
    }

    h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 0.75rem;
    }

    p {
      color: var(--text-secondary);
      margin: 0 0 1.5rem;
      max-width: 400px;
      line-height: 1.5;
    }
  }

  &__empty-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.25rem;
    background-color: var(--primary);
    color: var(--white);
    border: none;
    border-radius: var(--radius);
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);

    svg {
      width: 18px;
      height: 18px;
    }

    &:hover {
      background-color: var(--primary-hover);
      transform: translateY(-1px);
      box-shadow: var(--shadow-hover);
    }
  }

  // =================================
  // VISTA GRID
  // =================================

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 1.5rem;

    @media (max-width: 768px) {
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 1rem;
    }

    @media (max-width: 480px) {
      grid-template-columns: 1fr;
    }
  }

  &__card {
    background-color: var(--white);
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: var(--shadow);
    transition: var(--transition);
    height: 100%;
    display: flex;
    flex-direction: column;

    &:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-hover);

      .business-products__card-overlay {
        opacity: 1;
      }

      .business-products__card-image img {
        transform: scale(1.05);
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
  }

  &__card-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &__card-actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    justify-content: center;

    @media (max-width: 480px) {
      flex-direction: column;
      gap: 0.5rem;
    }
  }

  &__action-btn {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.5rem 0.75rem;
    border-radius: 6px;
    font-size: 0.8rem;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: var(--transition);
    white-space: nowrap;

    svg {
      width: 14px;
      height: 14px;
    }

    @media (max-width: 480px) {
      justify-content: center;
      padding: 0.6rem 1rem;
    }

    &--assign {
      background-color: var(--primary);
      color: var(--white);

      &:hover {
        background-color: var(--primary-hover);
      }
    }

    &--edit {
      background-color: var(--white);
      color: var(--text-primary);

      &:hover {
        background-color: var(--background);
      }
    }

    &--delete {
      background-color: var(--red);
      color: var(--white);

      &:hover {
        background-color: var(--red-hover);
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
    color: var(--text-secondary);
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    font-weight: 500;
  }

  &__card-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 0.5rem;
    line-height: 1.3;
  }

  &__card-description {
    font-size: 0.9rem;
    color: var(--text-secondary);
    line-height: 1.5;
    margin: 0 0 1rem;
    flex: 1;
  }

  // Información de restaurantes en cards
  &__restaurants-info {
    background-color: var(--background);
    border-radius: 6px;
    padding: 0.75rem;
    margin-bottom: 1rem;
    border: 1px solid var(--border);
  }

  &__restaurants-count {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    font-size: 0.85rem;
    color: var(--text-secondary);

    svg {
      width: 14px;
      height: 14px;
    }

    span {
      font-weight: 500;
    }
  }

  &__price-range {
    font-size: 0.8rem;
    color: var(--primary);
    font-weight: 600;
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

  &__price-label {
    font-size: 0.75rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.03em;
    margin-bottom: 0.25rem;
    display: block;
  }

  &__price {
    font-weight: 700;
    font-size: 1.1rem;
    color: var(--text-primary);
  }

  &__card-toggle {
    display: flex;
    align-items: center;
  }

  // =================================
  // VISTA LISTA/TABLA
  // =================================

  &__list {
    margin-bottom: 1.5rem;
    overflow-x: auto;
    background-color: var(--white);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow);
  }

  &__table {
    width: 100%;
    border-collapse: collapse;
    min-width: 800px;

    th {
      background-color: var(--background);
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      color: var(--text-primary);
      border-bottom: 1px solid var(--border);
      font-size: 0.9rem;
      white-space: nowrap;

      &:first-child {
        border-top-left-radius: var(--radius-lg);
      }

      &:last-child {
        border-top-right-radius: var(--radius-lg);
      }
    }
  }

  &__row {
    border-bottom: 1px solid var(--border);
    transition: var(--transition);

    &:hover {
      background-color: var(--background);
    }

    &:last-child {
      border-bottom: none;
    }
  }

  &__cell {
    padding: 1rem;
    font-size: 0.95rem;
    color: var(--text-primary);
    vertical-align: middle;

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
    color: var(--text-secondary);
    border-radius: 4px;
    font-size: 0.8rem;
  }

  &__price-info {
    display: flex;
    flex-direction: column;
  }

  &__price-value {
    font-weight: 600;
    color: var(--text-primary);
  }

  &__restaurants-cell {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__restaurants-count-text {
    font-size: 0.9rem;
    color: var(--text-secondary);
    font-weight: 500;
  }

  &__manage-btn {
    padding: 0.25rem 0.5rem;
    background-color: #f1f5f9;
    border: 1px solid var(--border);
    border-radius: 4px;
    font-size: 0.8rem;
    color: var(--text-primary);
    cursor: pointer;
    transition: var(--transition);
    align-self: flex-start;

    &:hover {
      background-color: var(--border);
      border-color: var(--border-hover);
    }
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
    transition: var(--transition);

    svg {
      width: 16px;
      height: 16px;
    }

    &--edit {
      background-color: #f1f5f9;
      color: var(--text-primary);

      &:hover {
        background-color: var(--background);
      }
    }

    &--delete {
      background-color: #fee2e2;
      color: var(--red);

      &:hover {
        background-color: #fecaca;
      }
    }
  }

  // =================================
  // TOGGLE SWITCHES
  // =================================

  &__toggle-btn {
    position: relative;
    width: 44px;
    height: 24px;
    border-radius: 12px;
    background-color: var(--border);
    border: none;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &--on {
      background-color: var(--primary);

      .business-products__toggle-slider {
        left: 22px;
      }
    }

    &--off {
      background-color: var(--border);

      .business-products__toggle-slider {
        left: 2px;
      }
    }
  }

  &__toggle-slider {
    position: absolute;
    top: 2px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: var(--white);
    transition: left 0.2s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }

  // =================================
  // MODALES
  // =================================

  &__modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    backdrop-filter: blur(2px);
  }

  &__modal-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    animation: fadeIn 0.2s ease;
  }

  &__modal-container {
    position: relative;
    background-color: var(--white);
    border-radius: var(--radius-lg);
    max-width: 700px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    z-index: 1001;
    display: flex;
    flex-direction: column;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    animation: slideUp 0.3s ease;

    &--small {
      max-width: 500px;
    }

    &--wide {
      max-width: 900px;
    }

    @media (max-width: 768px) {
      margin: 0.5rem;
      width: calc(100% - 1rem);
      max-height: calc(100vh - 1rem);
    }
  }

  &__modal-header {
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    background-color: var(--white);
    z-index: 10;
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  }

  &__modal-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
    color: var(--text-primary);
  }

  &__modal-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: none;
    border: none;
    border-radius: 6px;
    color: var(--text-secondary);
    cursor: pointer;
    transition: var(--transition);

    svg {
      width: 18px;
      height: 18px;
    }

    &:hover {
      background-color: #f1f5f9;
      color: var(--text-primary);
    }
  }

  &__modal-body {
    padding: 1.5rem;
    flex: 1;
  }

  &__modal-footer {
    padding: 1.25rem 1.5rem;
    border-top: 1px solid var(--border);
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    position: sticky;
    bottom: 0;
    background-color: var(--white);
    z-index: 10;
    border-radius: 0 0 var(--radius-lg) var(--radius-lg);

    @media (max-width: 480px) {
      flex-direction: column;
    }
  }

  // =================================
  // GESTIÓN DE RESTAURANTES
  // =================================

  &__restaurant-assignments {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  &__product-info {
    background-color: var(--background);
    border-radius: var(--radius);
    padding: 1rem;
    border: 1px solid var(--border);
  }

  &__product-summary {
    display: flex;
    align-items: flex-start;
    gap: 1rem;

    h4 {
      margin: 0 0 0.5rem;
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    p {
      margin: 0 0 0.25rem;
      font-size: 0.9rem;
      color: var(--text-secondary);
    }
  }

  &__product-thumb {
    width: 60px;
    height: 60px;
    border-radius: 6px;
    object-fit: cover;
    flex-shrink: 0;
  }

  &__assignments-list {
    h4 {
      margin: 0 0 1rem;
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
    }
  }

  &__restaurant-items {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__restaurant-item {
    background-color: var(--white);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
    transition: var(--transition);

    &:hover {
      border-color: var(--border-hover);
      box-shadow: var(--shadow);
    }
  }

  &__restaurant-info {
    padding: 1rem;
  }

  &__restaurant-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;

    @media (max-width: 640px) {
      flex-direction: column;
      gap: 1rem;
    }
  }

  &__restaurant-details {
    flex: 1;

    h5 {
      margin: 0 0 0.25rem;
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    p {
      margin: 0;
      font-size: 0.85rem;
      color: var(--text-secondary);
    }
  }

  &__assignment-toggle {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-shrink: 0;

    @media (max-width: 640px) {
      width: 100%;
      justify-content: space-between;
    }
  }

  &__assignment-label {
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--text-primary);
    white-space: nowrap;
  }

  &__restaurant-config {
    background-color: var(--background);
    border-radius: 6px;
    padding: 1rem;
    margin-top: 1rem;
    border: 1px solid var(--border);
    animation: slideDown 0.3s ease;
  }

  &__config-row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin-bottom: 1rem;

    @media (max-width: 640px) {
      grid-template-columns: 1fr;
    }
  }

  &__config-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__config-label {
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--text-primary);
  }

  &__config-input,
  &__config-textarea {
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--border);
    border-radius: 6px;
    font-size: 0.9rem;
    background-color: var(--white);
    transition: var(--transition);

    &:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(6, 169, 141, 0.1);
    }

    &::placeholder {
      color: var(--text-muted);
    }
  }

  &__config-textarea {
    resize: vertical;
    min-height: 60px;
  }

  // =================================
  // GESTIÓN DE CATEGORÍAS
  // =================================

  &__categories-section {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  &__categories-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h4 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--text-primary);
    }
  }

  &__add-category-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background-color: var(--primary);
    color: var(--white);
    border: none;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);

    svg {
      width: 14px;
      height: 14px;
    }

    &:hover {
      background-color: var(--primary-hover);
    }
  }

  &__empty-categories {
    text-align: center;
    padding: 2rem;
    color: var(--text-secondary);

    p {
      margin: 0 0 1rem;
    }
  }

  &__categories-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  &__category-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background-color: var(--background);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    transition: var(--transition);

    &:hover {
      border-color: var(--border-hover);
    }

    @media (max-width: 640px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }
  }

  &__category-info {
    flex: 1;

    h5 {
      margin: 0 0 0.25rem;
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    p {
      margin: 0 0 0.5rem;
      font-size: 0.9rem;
      color: var(--text-secondary);
    }
  }

  &__category-count {
    font-size: 0.8rem;
    color: var(--text-muted);
    background-color: var(--border);
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-weight: 500;
  }

  &__category-actions {
    display: flex;
    gap: 0.5rem;

    @media (max-width: 640px) {
      width: 100%;
      justify-content: flex-end;
    }
  }

  &__category-btn {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.5rem 0.75rem;
    font-size: 0.85rem;
    font-weight: 500;
    border: 1px solid;
    border-radius: 6px;
    cursor: pointer;
    transition: var(--transition);

    svg {
      width: 14px;
      height: 14px;
    }

    &--edit {
      background-color: var(--white);
      color: var(--text-primary);
      border-color: var(--border);

      &:hover {
        background-color: var(--background);
        border-color: var(--border-hover);
      }
    }

    &--delete {
      background-color: #fee2e2;
      color: var(--red);
      border-color: #fecaca;

      &:hover:not(:disabled) {
        background-color: #fecaca;
        border-color: #f87171;
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }

  &__category-form {
    padding-top: 1.5rem;

    h4 {
      margin: 0 0 1rem;
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
    }
  }

  // =================================
  // FORMULARIOS
  // =================================

  &__form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  &__form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__form-row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;

    @media (max-width: 640px) {
      grid-template-columns: 1fr;
    }
  }

  &__form-label {
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__form-hint {
    font-size: 0.8rem;
    color: var(--text-secondary);
    margin-top: 0.25rem;
  }

  &__inline-btn {
    background: none;
    border: none;
    color: var(--primary);
    font-size: 0.8rem;
    font-weight: 500;
    cursor: pointer;
    text-decoration: underline;
    margin-left: auto;

    &:hover {
      color: var(--primary-hover);
    }
  }

  &__form-input,
  &__form-select,
  &__form-textarea {
    padding: 0.75rem 1rem;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    font-size: 0.95rem;
    color: var(--text-primary);
    background-color: var(--white);
    transition: var(--transition);

    &:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(6, 169, 141, 0.1);
    }

    &::placeholder {
      color: var(--text-muted);
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
    min-height: 80px;
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
    color: var(--text-primary);
    cursor: pointer;

    input[type="radio"] {
      width: 16px;
      height: 16px;
      accent-color: var(--primary);
    }
  }

  &__form-divider {
    height: 1px;
    background-color: var(--border);
    margin: 0.5rem 0;
  }

  // =================================
  // SUBIDA DE IMÁGENES
  // =================================

  &__image-upload {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__image-preview {
    width: 100%;
    height: 200px;
    border: 2px dashed #cbd5e0;
    border-radius: var(--radius);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--background);
    transition: var(--transition);

    &:hover {
      border-color: var(--primary);
      background-color: rgba(6, 169, 141, 0.02);
    }
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
    color: var(--text-muted);
    text-align: center;

    svg {
      width: 48px;
      height: 48px;
      margin-bottom: 0.75rem;
      opacity: 0.5;
    }

    span {
      font-size: 0.9rem;
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

  &__upload-btn,
  &__remove-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1rem;
    border-radius: var(--radius);
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
    border: 1px solid;

    svg {
      width: 16px;
      height: 16px;
    }

    @media (max-width: 480px) {
      flex: 1;
      justify-content: center;
    }
  }

  &__upload-btn {
    background-color: #f1f5f9;
    border-color: var(--border);
    color: var(--text-primary);

    &:hover {
      background-color: var(--background);
      border-color: var(--border-hover);
    }
  }

  &__remove-btn {
    background-color: #fee2e2;
    border-color: #fecaca;
    color: var(--red);

    &:hover {
      background-color: #fecaca;
      border-color: #f87171;
    }
  }

  // =================================
  // BOTONES DE FORMULARIO
  // =================================

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
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 1.5rem;
    border-radius: var(--radius);
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
    border: 1px solid;
    min-width: 120px;

    &--cancel {
      background-color: var(--white);
      color: var(--text-secondary);
      border-color: var(--border);

      &:hover {
        background-color: var(--background);
        color: var(--text-primary);
        border-color: var(--border-hover);
      }
    }

    &--submit {
      background-color: var(--primary);
      color: var(--white);
      border-color: var(--primary);

      &:hover:not(:disabled) {
        background-color: var(--primary-hover);
        border-color: var(--primary-hover);
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }

    &--delete {
      background-color: var(--red);
      color: var(--white);
      border-color: var(--red);

      &:hover:not(:disabled) {
        background-color: var(--red-hover);
        border-color: var(--red-hover);
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
    border-top-color: var(--white);
    animation: spinner 1s linear infinite;
  }

  // =================================
  // ALERTAS Y WARNINGS
  // =================================

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
    color: var(--red);
    flex-shrink: 0;
  }

  &__warning-content {
    h4 {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 0.75rem;
    }

    p {
      margin: 0 0 0.5rem;
      color: var(--text-primary);
    }
  }

  &__warning-notice {
    color: var(--red) !important;
    font-weight: 500 !important;
  }
}

// =================================
// ANIMACIONES
// =================================

@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
    max-height: 0;
  }
  to {
    opacity: 1;
    transform: translateY(0);
    max-height: 200px;
  }
}
</style>
