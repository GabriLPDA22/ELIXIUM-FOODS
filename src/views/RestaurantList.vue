<!-- views/RestaurantList.vue - Version 2.0 -->
<template>
  <div class="restaurant-list-page">
    <!-- Hero section compacto -->
    <section class="hero">
      <div class="hero__animated-bg">
        <div class="hero__floating-element hero__floating-element--1">🍕</div>
        <div class="hero__floating-element hero__floating-element--2">🍔</div>
        <div class="hero__floating-element hero__floating-element--3">🍜</div>
        <div class="hero__floating-element hero__floating-element--4">🌮</div>
        <div class="hero__floating-element hero__floating-element--5">🥗</div>
        <div class="hero__floating-element hero__floating-element--6">🍣</div>
      </div>
      
      <div class="container">
        <div class="hero__content">
          <h1 class="hero__title">
            Descubre restaurantes <span class="hero__title-highlight">increíbles</span>
          </h1>
          <p class="hero__subtitle">Encuentra tu comida favorita entregada directamente a tu puerta</p>

          <div class="hero__popular-tags">
            <span class="hero__popular-label">Popular:</span>
            <div class="hero__tags">
              <button v-for="tag in ['Pizza', 'Hamburguesa', 'Sushi', 'Tacos']" :key="tag" @click="searchQuery = tag"
                class="hero__tag">
                {{ tag }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories section - SIN STICKY -->
    <section class="categories-section">
      <div class="container">
        <!-- Solo mostrar flechas en desktop -->
        <div class="categories-scroll">
          <button v-if="showLeftScroll && !isMobile" @click="scrollCategories('left')"
            class="categories-scroll__arrow categories-scroll__arrow--left" aria-label="Ver categorías anteriores">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <div class="categories-scroll__container" ref="categoriesContainer">
            <div v-for="category in categories" :key="category.id" class="category-item"
              :class="{ 'category-item--active': selectedCategory === category.id }"
              @click="selectCategory(category.id)">
              <div class="category-item__icon">
                <span v-if="getCategoryIcon(category.id)">{{ getCategoryIcon(category.id) }}</span>
                <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
              </div>
              <span class="category-item__name">{{ category.name }}</span>
            </div>
          </div>

          <button v-if="showRightScroll && !isMobile" @click="scrollCategories('right')"
            class="categories-scroll__arrow categories-scroll__arrow--right" aria-label="Ver más categorías">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </section>

    <!-- Filters section -->
    <section class="filters-section">
      <div class="container">
        <div class="filters-row">
          <div class="filter-group">
            <span class="filter-group__label">Ordenar por:</span>
            <div class="filter-select">
              <select v-model="sortBy" class="filter-select__control">
                <option value="popularity">Más Popular</option>
                <option value="rating">Mejor Valorados</option>
                <option value="delivery">Tiempo de Entrega</option>
                <option value="price">Precio: Bajo a Alto</option>
              </select>
              <svg class="filter-select__arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>

          <div class="filter-group">
            <span class="filter-group__label">Buscar:</span>
            <div class="filter-search">
              <div class="filter-search__icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="Buscar restaurantes..." 
                class="filter-search__input"
              >
              <button v-if="searchQuery" @click="searchQuery = ''" class="filter-search__clear">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Restaurant list - CON OVERFLOW COMPACTO -->
    <section class="restaurants-section">
      <div class="container">
        <!-- Loader -->
        <div v-if="loading" class="loading-state">
          <div class="loading-state__spinner"></div>
          <p class="loading-state__text">Buscando los mejores restaurantes para ti</p>
        </div>

        <!-- Empty state -->
        <div v-else-if="filteredRestaurants.length === 0" class="empty-state">
          <div class="empty-state__icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"
              stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 12H2M16 6l6 6-6 6M8 18l-6-6 6-6"></path>
            </svg>
          </div>
          <h3 class="empty-state__title">No encontramos restaurantes</h3>
          <p class="empty-state__text">Intenta con otros filtros o una nueva búsqueda</p>
          <button @click="resetFilters" class="empty-state__button">Reiniciar filtros</button>
        </div>

        <!-- Results -->
        <div v-else>
          <div class="results-header">
            <span class="results-header__count">
              Mostrando {{ paginationInfo.start }}-{{ paginationInfo.end }} de {{ paginationInfo.total }} restaurantes
            </span>
          </div>

          <!-- Grid con overflow y altura fija -->
          <div class="restaurant-grid-container">
            <div class="restaurant-grid">
              <div v-for="restaurant in paginatedRestaurants" :key="restaurant.id" class="restaurant-card" @click="goToRestaurant(restaurant.id)">
                <div class="restaurant-card__image-wrapper">
                  <img :src="restaurant.coverImageUrl" :alt="restaurant.name" class="restaurant-card__image">
                  
                  <div class="restaurant-card__overlay"></div>

                  <div class="restaurant-card__badges">
                    <span v-if="isNew(restaurant)" class="restaurant-card__badge restaurant-card__badge--new">
                      <span class="restaurant-card__badge-icon">✨</span>
                      Nuevo
                    </span>
                    <span v-if="isFastDelivery(restaurant)" class="restaurant-card__badge restaurant-card__badge--fast">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                      </svg>
                      Rápido
                    </span>
                  </div>

                  <div class="restaurant-card__delivery-time">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                      stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    {{ restaurant.estimatedDeliveryTime }} min
                  </div>
                </div>

                <div class="restaurant-card__content">
                  <div class="restaurant-card__header">
                    <h3 class="restaurant-card__name">{{ restaurant.name }}</h3>
                    <div class="restaurant-card__rating">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#FFCC00" stroke="#FFCC00" stroke-width="0.5"
                        stroke-linecap="round" stroke-linejoin="round">
                        <polygon
                          points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2">
                        </polygon>
                      </svg>
                      <span>{{ restaurant.averageRating }}</span>
                      <span class="restaurant-card__reviews">({{ restaurant.reviewCount || 0 }})</span>
                    </div>
                  </div>

                  <div class="restaurant-card__info">
                    <span class="restaurant-card__cuisine">{{ getTipoName(restaurant.tipo) }}</span>
                    <span class="restaurant-card__separator">•</span>
                    <span class="restaurant-card__distance">{{ restaurant.distance || '1.0' }} km</span>
                  </div>

                  <div class="restaurant-card__delivery-info">
                    <div v-if="restaurant.deliveryFee === 0" class="restaurant-card__free-delivery">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Envío gratis
                    </div>
                    <div v-else class="restaurant-card__fee">
                      Envío: ${{ restaurant.deliveryFee.toFixed(2) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Paginación -->
          <div v-if="totalPages > 1" class="pagination">
            <button 
              @click="previousPage" 
              :disabled="currentPage === 1"
              class="pagination__button pagination__button--prev"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              Anterior
            </button>

            <div class="pagination__pages">
              <template v-for="page in getVisiblePages()" :key="page">
                <button 
                  v-if="page !== '...'"
                  @click="goToPage(page)"
                  :class="['pagination__page', { 'pagination__page--active': page === currentPage }]"
                >
                  {{ page }}
                </button>
                <span v-else class="pagination__dots">...</span>
              </template>
            </div>

            <button 
              @click="nextPage" 
              :disabled="currentPage === totalPages"
              class="pagination__button pagination__button--next"
            >
              Siguiente
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { restaurantService } from '@/services/restaurantService';

// Router
const router = useRouter();

// Estado
const restaurants = ref([]);
const loading = ref(true);
const searchQuery = ref('');
const selectedCategory = ref('all');
const sortBy = ref('popularity');

// Paginación
const currentPage = ref(1);
const itemsPerPage = 8;

// Mobile detection
const isMobile = ref(false);

// Categorías
const categories = [
  { id: 'all', name: 'Todos' },
  { id: 1, name: 'Americana' },
  { id: 2, name: 'Italiana' },
  { id: 3, name: 'Mexicana' },
  { id: 4, name: 'Asiática' },
  { id: 5, name: 'Fast Food' },
  { id: 6, name: 'Saludable' },
  { id: 7, name: 'Postres' },
  { id: 8, name: 'Vegana' }
];

// Iconos para categorías
const getCategoryIcon = (categoryId) => {
  const icons = {
    1: '🍔',
    2: '🍕',
    3: '🌮',
    4: '🍜',
    5: '🍟',
    6: '🥗',
    7: '🍦',
    8: '🥑'
  };
  return icons[categoryId] || '';
};

// Obtener nombre del tipo de restaurante
const getTipoName = (tipo) => {
  const category = categories.find(c => c.id === tipo);
  return category ? category.name : 'Variado';
};

// Obtener restaurantes
const fetchRestaurants = async () => {
  loading.value = true;
  
  try {
    let data;
    
    if (selectedCategory.value !== 'all') {
      data = await restaurantService.getRestaurantsByTipo(selectedCategory.value);
    } else {
      data = await restaurantService.getAllRestaurants();
    }
    
    restaurants.value = data;
  } catch (error) {
    console.error('Error al cargar restaurantes:', error);
  } finally {
    loading.value = false;
  }
};

// Filtrar restaurantes
const filteredRestaurants = computed(() => {
  let result = restaurants.value;
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(restaurant => 
      restaurant.name.toLowerCase().includes(query) || 
      (restaurant.description && restaurant.description.toLowerCase().includes(query))
    );
  }
  
  if (sortBy.value === 'rating') {
    result = [...result].sort((a, b) => b.averageRating - a.averageRating);
  } else if (sortBy.value === 'delivery') {
    result = [...result].sort((a, b) => a.estimatedDeliveryTime - b.estimatedDeliveryTime);
  } else if (sortBy.value === 'price') {
    result = [...result].sort((a, b) => a.deliveryFee - b.deliveryFee);
  }
  
  return result;
});

// Paginación computada
const totalPages = computed(() => Math.ceil(filteredRestaurants.value.length / itemsPerPage));

const paginatedRestaurants = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredRestaurants.value.slice(start, end);
});

const paginationInfo = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage.value * itemsPerPage, filteredRestaurants.value.length);
  return { start, end, total: filteredRestaurants.value.length };
});

// Métodos
const selectCategory = (categoryId) => {
  selectedCategory.value = categoryId;
  currentPage.value = 1;
  fetchRestaurants();
};

const resetFilters = () => {
  searchQuery.value = '';
  selectedCategory.value = 'all';
  sortBy.value = 'popularity';
  currentPage.value = 1;
  fetchRestaurants();
};

const goToRestaurant = (restaurantId) => {
  router.push(`/restaurant/${restaurantId}`);
};

// Funciones de paginación
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    document.querySelector('.restaurants-section').scrollIntoView({ behavior: 'smooth' });
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    goToPage(currentPage.value + 1);
  }
};

const previousPage = () => {
  if (currentPage.value > 1) {
    goToPage(currentPage.value - 1);
  }
};

const getVisiblePages = () => {
  const delta = 2;
  const range = [];
  const rangeWithDots = [];

  for (let i = Math.max(2, currentPage.value - delta);
       i <= Math.min(totalPages.value - 1, currentPage.value + delta);
       i++) {
    range.push(i);
  }

  if (currentPage.value - delta > 2) {
    rangeWithDots.push(1, '...');
  } else {
    rangeWithDots.push(1);
  }

  rangeWithDots.push(...range);

  if (currentPage.value + delta < totalPages.value - 1) {
    rangeWithDots.push('...', totalPages.value);
  } else {
    rangeWithDots.push(totalPages.value);
  }

  return rangeWithDots;
};

// Helpers para badges
const isNew = (restaurant) => {
  if (!restaurant.createdAt) return false;
  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
  return new Date(restaurant.createdAt) > twoMonthsAgo;
};

const isFastDelivery = (restaurant) => {
  return restaurant.estimatedDeliveryTime <= 20;
};

// Navegación en carrusel - Solo para desktop
const categoriesContainer = ref(null);
const showLeftScroll = ref(false);
const showRightScroll = ref(true);

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

const checkScrollPosition = () => {
  if (!categoriesContainer.value || isMobile.value) return;

  const container = categoriesContainer.value;
  showLeftScroll.value = container.scrollLeft > 10;
  showRightScroll.value = container.scrollLeft < (container.scrollWidth - container.clientWidth - 10);
};

const scrollCategories = (direction) => {
  if (!categoriesContainer.value || isMobile.value) return;

  const container = categoriesContainer.value;
  const scrollAmount = container.offsetWidth * 0.75;

  if (direction === 'left') {
    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  } else {
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }

  setTimeout(checkScrollPosition, 300);
};

// Inicialización
onMounted(() => {
  fetchRestaurants();
  checkMobile();
  
  window.addEventListener('resize', checkMobile);

  setTimeout(() => {
    if (categoriesContainer.value) {
      checkScrollPosition();
      categoriesContainer.value.addEventListener('scroll', checkScrollPosition);
    }
  }, 300);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});

// Watchers
watch(searchQuery, () => {
  currentPage.value = 1;
});

watch(sortBy, () => {
  currentPage.value = 1;
});
</script>

<style lang="scss" scoped>
.restaurant-list-page {
  background: linear-gradient(to bottom, #ffffff, #f8fafc);
  min-height: 100vh;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
}

// Hero section - MÁS COMPACTO
.hero {
  position: relative;
  padding: 4rem 0 3rem;
  background: linear-gradient(135deg, #FF416C, #FF4B2B);
  overflow: hidden;
  color: white;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-image:
      radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.15) 0%, transparent 200px),
      radial-gradient(circle at 80% 60%, rgba(255, 255, 255, 0.1) 0%, transparent 200px);
    z-index: 1;
  }

  &__animated-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    z-index: 0;
  }

  &__floating-element {
    position: absolute;
    font-size: 1.5rem;
    opacity: 0.15;
    animation: float 15s infinite ease-in-out;

    &--1 { top: 10%; left: 5%; animation-delay: 0s; }
    &--2 { top: 70%; left: 10%; animation-delay: 2s; }
    &--3 { top: 20%; left: 85%; animation-delay: 4s; }
    &--4 { top: 80%; left: 80%; animation-delay: 6s; }
    &--5 { top: 30%; left: 50%; animation-delay: 8s; }
    &--6 { top: 60%; left: 20%; animation-delay: 10s; }

    @media (max-width: 768px) {
      font-size: 1.2rem;
      opacity: 0.1;
    }
  }

  &__content {
    position: relative;
    z-index: 2;
    text-align: center;
    max-width: 700px;
    margin: 0 auto;
  }

  &__title {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 1rem;
    line-height: 1.1;
    letter-spacing: -0.03em;

    &-highlight {
      background: linear-gradient(to right, #FFC837, #FF8008);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        height: 6px;
        width: 100%;
        bottom: -2px;
        left: 0;
        background: linear-gradient(to right, #FFC837, #FF8008);
        border-radius: 3px;
        opacity: 0.6;
      }
    }

    @media (max-width: 768px) {
      font-size: 2rem;
      margin-bottom: 0.8rem;
    }
  }

  &__subtitle {
    font-size: 1.1rem;
    opacity: 0.9;
    margin-bottom: 1.5rem;
    line-height: 1.6;

    @media (max-width: 768px) {
      font-size: 1rem;
      margin-bottom: 1.2rem;
    }
  }

  &__popular-tags {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1rem;

    @media (max-width: 768px) {
      gap: 0.5rem;
    }
  }

  &__popular-label {
    font-size: 0.9rem;
    opacity: 0.8;
    margin-right: 0.5rem;
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
  }

  &__tag {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    padding: 0.4rem 0.8rem;
    border-radius: 50px;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);

    &:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-2px);
    }

    @media (max-width: 768px) {
      padding: 0.3rem 0.6rem;
      font-size: 0.75rem;
    }
  }

  @media (max-width: 768px) {
    padding: 3rem 0 2rem;
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(3deg); }
}

// Categories section - SIN STICKY
.categories-section {
  background-color: white;
  padding: 1.5rem 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
}

.categories-scroll {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  &__container {
    display: flex;
    gap: 0.8rem;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    padding: 0.5rem 0;
    scroll-behavior: smooth;
    justify-content: center;
    align-items: center;

    &::-webkit-scrollbar {
      display: none;
    }

    @media (max-width: 768px) {
      justify-content: flex-start;
      padding: 0.5rem 1rem;
      gap: 1rem;
    }
  }

  &__arrow {
    position: absolute;
    z-index: 2;
    background: linear-gradient(135deg, #FF416C, #FF4B2B);
    color: white;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
    box-shadow: 0 3px 10px rgba(255, 65, 108, 0.3);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(255, 65, 108, 0.4);
    }

    &--left {
      left: 0;
    }

    &--right {
      right: 0;
    }

    // Ocultar en móvil
    @media (max-width: 768px) {
      display: none;
    }
  }
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  min-width: 80px;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0.8rem 0.4rem;
  border-radius: 12px;

  &__icon {
    width: 50px;
    height: 50px;
    border-radius: 15px;
    background: linear-gradient(135deg, #f8fafc, #e2e8f0);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    transition: all 0.3s ease;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);

    svg {
      color: #64748b;
    }

    @media (max-width: 768px) {
      width: 45px;
      height: 45px;
      font-size: 18px;
    }
  }

  &__name {
    font-size: 0.8rem;
    font-weight: 600;
    color: #64748b;
    transition: all 0.3s ease;
    text-align: center;

    @media (max-width: 768px) {
      font-size: 0.75rem;
    }
  }

  &:hover {
    transform: translateY(-3px);

    .category-item__icon {
      background: linear-gradient(135deg, rgba(255, 65, 108, 0.1), rgba(255, 75, 43, 0.1));
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }

    .category-item__name {
      color: #FF416C;
    }
  }

  &--active {
    .category-item__icon {
      background: linear-gradient(135deg, #FF416C, #FF4B2B);
      box-shadow: 0 5px 15px rgba(255, 65, 108, 0.3);

      svg {
        color: white;
      }
    }

    .category-item__name {
      color: #FF416C;
      font-weight: 700;
    }
  }
}

// Filters section
.filters-section {
  background-color: white;
  padding: 1rem 0;
  border-bottom: 1px solid #f1f5f9;
}

.filters-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 1rem;

  &__label {
    font-size: 0.85rem;
    color: #64748b;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    justify-content: space-between;
  }
}

.filter-select {
  position: relative;

  &__control {
    appearance: none;
    background: white;
    border: 2px solid #e2e8f0;
    border-radius: 10px;
    padding: 0.6rem 2.5rem 0.6rem 0.8rem;
    font-size: 0.85rem;
    color: #1e293b;
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: 160px;

    &:focus {
      outline: none;
      border-color: #FF416C;
      box-shadow: 0 0 0 3px rgba(255, 65, 108, 0.1);
    }

    &:hover {
      border-color: #FF416C;
    }
  }

  &__arrow {
    position: absolute;
    right: 0.8rem;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: #64748b;
  }
}

.filter-search {
  position: relative;
  display: flex;
  align-items: center;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  padding: 0 0.8rem;
  transition: all 0.3s ease;
  min-width: 250px;

  &:focus-within {
    border-color: #FF416C;
    box-shadow: 0 0 0 3px rgba(255, 65, 108, 0.1);
  }

  &:hover {
    border-color: #FF416C;
  }

  &__icon {
    color: #64748b;
    margin-right: 0.6rem;
    flex-shrink: 0;
    transition: color 0.3s ease;

    .filter-search:focus-within & {
      color: #FF416C;
    }
  }

  &__input {
    flex: 1;
    height: 38px;
    border: none;
    background: transparent;
    font-size: 0.85rem;
    color: #1e293b;

    &:focus {
      outline: none;
    }

    &::placeholder {
      color: #94a3b8;
    }
  }

  &__clear {
    background: none;
    border: none;
    padding: 0.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: #64748b;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-left: 0.4rem;

    &:hover {
      background-color: rgba(255, 65, 108, 0.1);
      color: #FF416C;
    }
  }

  @media (max-width: 768px) {
    min-width: auto;
    width: 100%;
  }
}

// Restaurants section - CON OVERFLOW
.restaurants-section {
  padding: 2rem 0;
}

.results-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 1.5rem;

  &__count {
    color: #64748b;
    font-size: 0.85rem;
    font-weight: 500;
  }
}

// NUEVO: Container con overflow
.restaurant-grid-container {
  max-height: 80vh;
  overflow-y: auto;
  border-radius: 15px;
  background: white;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;

  // Scroll personalizado
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #FF416C, #FF4B2B);
    border-radius: 4px;
    
    &:hover {
      background: linear-gradient(135deg, #e63946, #FF4B2B);
    }
  }

  @media (max-width: 768px) {
    max-height: 70vh;
    padding: 1rem;
  }
}

.restaurant-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

// Restaurant cards - MÁS COMPACTAS
.restaurant-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  position: relative;
  transform-style: preserve-3d;

  &::before {
    content: '';
    position: absolute;
    inset: -1px;
    background: linear-gradient(45deg, 
      transparent 30%, 
      rgba(255, 65, 108, 0.1) 40%, 
      rgba(255, 75, 43, 0.15) 50%, 
      rgba(255, 65, 108, 0.1) 60%, 
      transparent 70%
    );
    border-radius: 16px;
    opacity: 0;
    transition: opacity 0.6s ease;
    z-index: -1;
    animation: shimmer 3s infinite ease-in-out;
    animation-play-state: paused;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, 
      rgba(255, 255, 255, 0.1) 0%, 
      transparent 50%, 
      rgba(255, 65, 108, 0.05) 100%
    );
    border-radius: 15px;
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
    z-index: 10;
  }

  &:hover {
    transform: translateY(-8px) rotateX(1deg) rotateY(-1deg);
    box-shadow: 
      0 15px 30px rgba(0, 0, 0, 0.15),
      0 0 0 1px rgba(255, 65, 108, 0.1),
      0 0 40px rgba(255, 65, 108, 0.15);

    &::before {
      opacity: 1;
      animation-play-state: running;
    }

    &::after {
      opacity: 1;
    }

    .restaurant-card__image {
      transform: scale(1.05);
      filter: brightness(1.1) contrast(1.02);
    }

    .restaurant-card__name {
      color: #FF416C;
    }
  }

  &__image-wrapper {
    position: relative;
    height: 140px; // Más compacto
    overflow: hidden;
    border-radius: 15px 15px 0 0;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  }

  &__overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, 
      rgba(0, 0, 0, 0) 0%, 
      rgba(0, 0, 0, 0.1) 50%,
      rgba(0, 0, 0, 0.2) 100%);
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  &__badges {
    position: absolute;
    top: 0.8rem;
    left: 0.8rem;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    z-index: 2;
  }

  &__badge {
    display: flex;
    align-items: center;
    gap: 0.2rem;
    padding: 0.25rem 0.6rem;
    border-radius: 50px;
    font-size: 0.65rem;
    font-weight: 600;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);

    &--new {
      background: linear-gradient(135deg, rgba(34, 197, 94, 0.9), rgba(16, 185, 129, 0.9));
      color: white;
      box-shadow: 0 2px 8px rgba(34, 197, 94, 0.3);
    }

    &--fast {
      background: linear-gradient(135deg, rgba(251, 146, 60, 0.9), rgba(249, 115, 22, 0.9));
      color: white;
      box-shadow: 0 2px 8px rgba(251, 146, 60, 0.3);
    }

    &-icon {
      font-size: 0.7rem;
    }
  }

  &__delivery-time {
    position: absolute;
    bottom: 0.8rem;
    right: 0.8rem;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    border-radius: 50px;
    padding: 0.4rem 0.8rem;
    font-size: 0.7rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  &__content {
    padding: 1rem; // Más compacto
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.8rem;
    gap: 0.8rem;
  }

  &__name {
    font-size: 1rem; // Más pequeño
    font-weight: 700;
    color: #1e293b;
    margin: 0;
    line-height: 1.3;
    flex: 1;
    transition: color 0.3s ease;
  }

  &__rating {
    display: flex;
    align-items: center;
    gap: 0.2rem;
    font-weight: 600;
    font-size: 0.8rem;
    color: #1e293b;
    flex-shrink: 0;
  }

  &__reviews {
    color: #64748b;
    font-weight: 400;
    font-size: 0.7rem;
  }

  &__info {
    margin-bottom: 0.8rem;
    color: #64748b;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    flex-wrap: wrap;
  }

  &__separator {
    color: #cbd5e1;
    font-weight: bold;
  }

  &__cuisine,
  &__distance {
    white-space: nowrap;
  }

  &__delivery-info {
    font-size: 0.8rem;
  }

  &__free-delivery {
    color: #059669;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.2rem;
  }

  &__fee {
    color: #64748b;
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

// Loading y Empty states
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;

  &__spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #f1f5f9;
    border-radius: 50%;
    border-top-color: #FF416C;
    animation: spinner 1s linear infinite;
    margin-bottom: 1rem;
  }

  &__text {
    color: #64748b;
    font-size: 1rem;
    font-weight: 500;
  }

  @keyframes spinner {
    to {
      transform: rotate(360deg);
    }
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
  text-align: center;

  &__icon {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #f8fafc, #e2e8f0);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #64748b;
    margin-bottom: 1.5rem;
  }

  &__title {
    font-size: 1.3rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 0.8rem;
  }

  &__text {
    color: #64748b;
    margin: 0 0 1.5rem;
    max-width: 350px;
    line-height: 1.6;
  }

  &__button {
    background: linear-gradient(135deg, #FF416C, #FF4B2B);
    color: white;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 50px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 3px 10px rgba(255, 65, 108, 0.3);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(255, 65, 108, 0.4);
    }
  }
}

// Paginación
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1.5rem 0;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.2rem;
  }

  &__button {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.6rem 1.2rem;
    background: white;
    border: 2px solid #e2e8f0;
    border-radius: 50px;
    color: #64748b;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.85rem;

    &:hover:not(:disabled) {
      border-color: #FF416C;
      color: #FF416C;
      transform: translateY(-2px);
      box-shadow: 0 3px 10px rgba(255, 65, 108, 0.2);
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }

  &__pages {
    display: flex;
    align-items: center;
    gap: 0.4rem;

    @media (max-width: 768px) {
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.6rem;
    }
  }

  &__page {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    border: 2px solid #e2e8f0;
    background: white;
    color: #64748b;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;

    &:hover {
      border-color: #FF416C;
      color: #FF416C;
      transform: translateY(-2px);
    }

    &--active {
      background: linear-gradient(135deg, #FF416C, #FF4B2B);
      border-color: transparent;
      color: white;
      box-shadow: 0 3px 10px rgba(255, 65, 108, 0.3);
      transform: translateY(-2px);

      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 5px 15px rgba(255, 65, 108, 0.4);
      }
    }
  }

  &__dots {
    color: #94a3b8;
    font-weight: 600;
    padding: 0 0.4rem;
    font-size: 1.1rem;
  }
}
</style>