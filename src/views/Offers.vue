<!-- views/Offers.vue -->
<template>
  <div class="offers-page">
    <!-- Hero section -->
    <section class="hero">
      <div class="hero__animated-bg">
        <div class="hero__floating-element hero__floating-element--1">🎯</div>
        <div class="hero__floating-element hero__floating-element--2">💎</div>
        <div class="hero__floating-element hero__floating-element--3">🔥</div>
        <div class="hero__floating-element hero__floating-element--4">⚡</div>
        <div class="hero__floating-element hero__floating-element--5">🎁</div>
        <div class="hero__floating-element hero__floating-element--6">💸</div>
      </div>
      
      <div class="container">
        <div class="hero__content">
          <h1 class="hero__title">
            Ofertas <span class="hero__title-highlight">Increíbles</span>
          </h1>
          <p class="hero__subtitle">Descuentos exclusivos que harán que tu dinero rinda más</p>

          <div class="hero__stats">
            <div class="hero__stat">
              <div class="hero__stat-number">{{ offersStats.totalActive }}</div>
              <div class="hero__stat-label">Ofertas Activas</div>
            </div>
            <div class="hero__stat">
              <div class="hero__stat-number">{{ offersStats.maxDiscount }}%</div>
              <div class="hero__stat-label">Descuento Máximo</div>
            </div>
            <div class="hero__stat">
              <div class="hero__stat-number">{{ offersStats.expiringToday }}</div>
              <div class="hero__stat-label">Expiran Hoy</div>
            </div>
            <div class="hero__stat">
              <div class="hero__stat-number">{{ offersStats.totalRestaurants }}</div>
              <div class="hero__stat-label">Restaurantes</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories section -->
    <section class="categories-section">
      <div class="container">
        <div class="categories-scroll">
          <button v-if="showLeftScroll && !isMobile" @click="scrollCategories('left')"
            class="categories-scroll__arrow categories-scroll__arrow--left" aria-label="Ver filtros anteriores">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <div class="categories-scroll__container" ref="categoriesContainer">
            <div v-for="filter in filterOptions" :key="filter.id" class="category-item"
              :class="{ 'category-item--active': selectedFilters.includes(filter.id) }"
              @click="toggleFilter(filter.id)">
              <div class="category-item__icon">
                <span v-if="filter.icon">{{ filter.icon }}</span>
              </div>
              <span class="category-item__name">{{ filter.label }}</span>
              <span v-if="filter.count > 0" class="category-item__count">{{ filter.count }}</span>
            </div>
          </div>

          <button v-if="showRightScroll && !isMobile" @click="scrollCategories('right')"
            class="categories-scroll__arrow categories-scroll__arrow--right" aria-label="Ver más filtros">
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
                <option value="priority">Recomendadas</option>
                <option value="discount">Mayor Descuento</option>
                <option value="expiry">Expiran Pronto</option>
                <option value="popular">Más Populares</option>
                <option value="recent">Más Recientes</option>
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
                placeholder="Buscar ofertas..." 
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

    <!-- Offers section -->
    <section class="offers-section">
      <div class="container">
        <!-- Loader -->
        <div v-if="loading" class="loading-state">
          <div class="loading-state__spinner"></div>
          <p class="loading-state__text">Cargando ofertas increíbles...</p>
        </div>

        <!-- Empty state -->
        <div v-else-if="filteredOffers.length === 0" class="empty-state">
          <div class="empty-state__icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"
              stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h3 class="empty-state__title">No encontramos ofertas</h3>
          <p class="empty-state__text">Intenta con otros filtros o una nueva búsqueda</p>
          <button @click="resetFilters" class="empty-state__button">Reiniciar filtros</button>
        </div>

        <!-- Results -->
        <div v-else>
          <div class="results-header">
            <span class="results-header__count">
              Mostrando {{ paginationInfo.start }}-{{ paginationInfo.end }} de {{ paginationInfo.total }} ofertas
            </span>
          </div>

          <!-- Grid con overflow y altura fija -->
          <div class="offers-grid-container">
            <div class="offers-grid">
              <div v-for="offer in paginatedOffers" :key="offer.id" class="offer-card" @click="goToRestaurant(offer.restaurantId)">
                <div class="offer-card__image-wrapper">
                  <img :src="offer.productImageUrl || defaultProductImage" :alt="offer.productName" class="offer-card__image">
                  
                  <div class="offer-card__overlay"></div>

                  <div class="offer-card__badges">
                    <span v-if="isHotOffer(offer)" class="offer-card__badge offer-card__badge--hot">
                      <span class="offer-card__badge-icon">🔥</span>
                      HOT
                    </span>
                    <span v-if="isExpiringOffer(offer)" class="offer-card__badge offer-card__badge--expiring">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      Expira pronto
                    </span>
                  </div>

                  <div class="offer-card__discount">
                    {{ formatDiscount(offer.discountType, offer.discountValue) }}
                  </div>
                </div>

                <div class="offer-card__content">
                  <div class="offer-card__header">
                    <h3 class="offer-card__name">{{ offer.name }}</h3>
                    <div class="offer-card__timer">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      <span>{{ getTimeRemaining(offer.endDate) || 'Limitado' }}</span>
                    </div>
                  </div>

                  <p class="offer-card__description">{{ offer.description }}</p>

                  <div class="offer-card__info">
                    <span class="offer-card__restaurant">{{ offer.restaurantName }}</span>
                    <span class="offer-card__separator">•</span>
                    <span class="offer-card__product">{{ offer.productName }}</span>
                  </div>

                  <div v-if="hasConditions(offer)" class="offer-card__conditions">
                    <div v-if="offer.minimumOrderAmount > 0" class="offer-card__condition">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="1" x2="12" y2="23"></line>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                      </svg>
                      Mínimo ${{ offer.minimumOrderAmount }}
                    </div>
                    <div v-if="offer.minimumQuantity > 1" class="offer-card__condition">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                      </svg>
                      Mín. {{ offer.minimumQuantity }} unidades
                    </div>
                  </div>

                  <div class="offer-card__footer">
                    <div v-if="offer.remainingUses > 0 && offer.remainingUses <= 10" class="offer-card__stock">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="8.5" cy="7" r="4"></circle>
                        <line x1="20" y1="8" x2="20" y2="14"></line>
                        <line x1="23" y1="11" x2="17" y2="11"></line>
                      </svg>
                      Solo {{ offer.remainingUses }} disponibles
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

<script setup lang="ts">
import { ref, computed, onMounted, watch, onUnmounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { productOfferService, offerUtils, type ProductOfferDto } from '@/services/productOfferService';

// Router
const router = useRouter();

// Estado
const offers = ref<ProductOfferDto[]>([]);
const loading = ref(true);
const searchQuery = ref('');
const selectedFilters = ref<string[]>(['all']);
const sortBy = ref('priority');

// Paginación
const currentPage = ref(1);
const itemsPerPage = 8;

// Mobile detection
const isMobile = ref(false);

// Imagen por defecto
const defaultProductImage = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

// Filtros disponibles
const filterOptions = ref([
  { id: 'all', label: 'Todas', icon: '🏷️', count: 0 },
  { id: 'percentage', label: 'Porcentaje', icon: '📊', count: 0 },
  { id: 'fixed', label: 'Descuento fijo', icon: '💰', count: 0 },
  { id: 'hot', label: 'Destacadas', icon: '🔥', count: 0 },
  { id: 'expiring', label: 'Expiran pronto', icon: '⏰', count: 0 },
  { id: 'no-minimum', label: 'Sin mínimo', icon: '🎯', count: 0 },
  { id: 'limited', label: 'Stock limitado', icon: '📦', count: 0 }
]);

// Estadísticas computadas
const offersStats = computed(() => {
  if (!offers.value.length) {
    return { totalActive: 0, maxDiscount: 0, expiringToday: 0, totalRestaurants: 0 };
  }
  
  const activeOffers = offers.value.filter(offer => offerUtils.isOfferActive(offer));
  const maxDiscount = Math.max(...activeOffers.map(offer => 
    offer.discountType === 'percentage' ? offer.discountValue : 0
  ), 0);
  
  const today = new Date().toDateString();
  const expiringToday = activeOffers.filter(offer => 
    new Date(offer.endDate).toDateString() === today
  ).length;
  
  const uniqueRestaurants = new Set(activeOffers.map(offer => offer.restaurantId));
  
  return {
    totalActive: activeOffers.length,
    maxDiscount,
    expiringToday,
    totalRestaurants: uniqueRestaurants.size
  };
});

// Ofertas filtradas
const filteredOffers = computed(() => {
  let result = [...offers.value];
  
  // Solo ofertas activas
  result = result.filter(offer => offerUtils.isOfferActive(offer));
  
  // Aplicar búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(offer => 
      offer.name.toLowerCase().includes(query) ||
      offer.description.toLowerCase().includes(query) ||
      offer.restaurantName.toLowerCase().includes(query) ||
      offer.productName.toLowerCase().includes(query)
    );
  }
  
  // Aplicar filtros
  if (!selectedFilters.value.includes('all')) {
    result = result.filter(offer => {
      return selectedFilters.value.some(filter => {
        switch (filter) {
          case 'percentage':
            return offer.discountType === 'percentage';
          case 'fixed':
            return offer.discountType === 'fixed';
          case 'hot':
            return isHotOffer(offer);
          case 'expiring':
            return isExpiringOffer(offer);
          case 'no-minimum':
            return offer.minimumOrderAmount === 0;
          case 'limited':
            return offer.remainingUses > 0 && offer.remainingUses <= 10;
          default:
            return true;
        }
      });
    });
  }
  
  // Aplicar ordenamiento
  result.sort((a, b) => {
    switch (sortBy.value) {
      case 'priority':
        return offerUtils.getOfferPriority(b) - offerUtils.getOfferPriority(a);
      case 'discount':
        const aDiscount = a.discountType === 'percentage' ? a.discountValue : a.discountValue * 5;
        const bDiscount = b.discountType === 'percentage' ? b.discountValue : b.discountValue * 5;
        return bDiscount - aDiscount;
      case 'expiry':
        return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
      case 'popular':
        return (b.usageCount || 0) - (a.usageCount || 0);
      case 'recent':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });
  
  return result;
});

// Ofertas paginadas
const paginatedOffers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredOffers.value.slice(start, end);
});

// Total de páginas
const totalPages = computed(() => Math.ceil(filteredOffers.value.length / itemsPerPage));

// Info de paginación
const paginationInfo = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage.value * itemsPerPage, filteredOffers.value.length);
  return { start, end, total: filteredOffers.value.length };
});

// Obtener ofertas del backend
const fetchOffers = async () => {
  loading.value = true;
  try {
    const data = await productOfferService.getActiveOffers();
    offers.value = data;
    updateFilterCounts();
  } catch (error) {
    console.error('Error al cargar ofertas:', error);
    offers.value = [];
  } finally {
    loading.value = false;
  }
};

// Actualizar contadores de filtros
const updateFilterCounts = () => {
  const activeOffers = offers.value.filter(offer => offerUtils.isOfferActive(offer));
  
  filterOptions.value.forEach(filter => {
    switch (filter.id) {
      case 'all':
        filter.count = activeOffers.length;
        break;
      case 'percentage':
        filter.count = activeOffers.filter(offer => offer.discountType === 'percentage').length;
        break;
      case 'fixed':
        filter.count = activeOffers.filter(offer => offer.discountType === 'fixed').length;
        break;
      case 'hot':
        filter.count = activeOffers.filter(offer => isHotOffer(offer)).length;
        break;
      case 'expiring':
        filter.count = activeOffers.filter(offer => isExpiringOffer(offer)).length;
        break;
      case 'no-minimum':
        filter.count = activeOffers.filter(offer => offer.minimumOrderAmount === 0).length;
        break;
      case 'limited':
        filter.count = activeOffers.filter(offer => offer.remainingUses > 0 && offer.remainingUses <= 10).length;
        break;
    }
  });
};

// Métodos de utilidad
const formatDiscount = (discountType: string, discountValue: number) => {
  return offerUtils.formatDiscount(discountType, discountValue);
};

const getTimeRemaining = (endDate: string) => {
  return offerUtils.getTimeRemaining(endDate);
};

const isHotOffer = (offer: ProductOfferDto) => {
  return offerUtils.isHotOffer(offer);
};

const isExpiringOffer = (offer: ProductOfferDto) => {
  return offerUtils.isExpiringOffer(offer);
};

const hasConditions = (offer: ProductOfferDto) => {
  return offer.minimumOrderAmount > 0 || offer.minimumQuantity > 1;
};

// Navegación
const goToRestaurant = (restaurantId: number) => {
  if (restaurantId) {
    router.push(`/restaurant/${restaurantId}`);
  }
};

// Filtros
const toggleFilter = (filterId: string) => {
  if (filterId === 'all') {
    selectedFilters.value = ['all'];
  } else {
    const index = selectedFilters.value.indexOf(filterId);
    if (index > -1) {
      selectedFilters.value.splice(index, 1);
      if (selectedFilters.value.length === 0) {
        selectedFilters.value = ['all'];
      }
    } else {
      selectedFilters.value = selectedFilters.value.filter(f => f !== 'all');
      selectedFilters.value.push(filterId);
    }
  }
  currentPage.value = 1;
};

const resetFilters = () => {
  searchQuery.value = '';
  selectedFilters.value = ['all'];
  sortBy.value = 'priority';
  currentPage.value = 1;
};

// Paginación
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    nextTick(() => {
      document.querySelector('.offers-section')?.scrollIntoView({ behavior: 'smooth' });
    });
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
  } else if (totalPages.value > 1) {
    rangeWithDots.push(totalPages.value);
  }

  return rangeWithDots.filter((page, index, arr) => arr.indexOf(page) === index);
};

// Scroll de categorías - Solo para desktop
const categoriesContainer = ref<HTMLElement | null>(null);
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

const scrollCategories = (direction: 'left' | 'right') => {
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

// Watchers
watch(searchQuery, () => {
  currentPage.value = 1;
});

watch(sortBy, () => {
  currentPage.value = 1;
});

// Inicialización
onMounted(() => {
  fetchOffers();
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
</script>

<style lang="scss" scoped>
.offers-page {
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

// Hero section - Consistente con RestaurantList pero temático de ofertas
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

  &__stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    max-width: 600px;
    margin: 0 auto;

    @media (max-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
      gap: 0.8rem;
    }
  }

  &__stat {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 1.5rem 1rem;
    text-align: center;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }

    &-number {
      font-size: 2rem;
      font-weight: 800;
      line-height: 1;
      margin-bottom: 0.5rem;
      background: linear-gradient(to right, #ffffff, #FFC837);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;

      @media (max-width: 768px) {
        font-size: 1.5rem;
      }
    }

    &-label {
      font-size: 0.8rem;
      opacity: 0.9;
      font-weight: 600;

      @media (max-width: 768px) {
        font-size: 0.7rem;
      }
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

// Categories section - SIN STICKY, igual que RestaurantList
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
  min-width: 90px;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0.8rem 0.4rem;
  border-radius: 12px;
  position: relative;

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

  &__count {
    position: absolute;
    top: 0.3rem;
    right: 0.3rem;
    background: linear-gradient(135deg, #FF416C, #FF4B2B);
    color: white;
    font-size: 0.6rem;
    font-weight: 700;
    padding: 0.2rem 0.4rem;
    border-radius: 10px;
    min-width: 16px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(255, 65, 108, 0.3);
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

// Filters section - Igual que RestaurantList
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

// Offers section - Igual estructura que RestaurantList
.offers-section {
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

// Container con overflow igual que RestaurantList
.offers-grid-container {
  max-height: 80vh;
  overflow-y: auto;
  border-radius: 15px;
  background: white;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;

  // Scroll personalizado con colores del tema
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

.offers-grid {
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

// Offer cards - Similar a restaurant cards pero adaptado para ofertas
.offer-card {
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

    .offer-card__image {
      transform: scale(1.05);
      filter: brightness(1.1) contrast(1.02);
    }

    .offer-card__name {
      color: #FF416C;
    }
  }

  &__image-wrapper {
    position: relative;
    height: 140px;
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

    &--hot {
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(220, 38, 38, 0.9));
      color: white;
      box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
    }

    &--expiring {
      background: linear-gradient(135deg, rgba(251, 146, 60, 0.9), rgba(249, 115, 22, 0.9));
      color: white;
      box-shadow: 0 2px 8px rgba(251, 146, 60, 0.3);
    }

    &-icon {
      font-size: 0.7rem;
    }
  }

  &__discount {
    position: absolute;
    bottom: 0.8rem;
    right: 0.8rem;
    background: linear-gradient(135deg, #FF416C, #FF4B2B);
    color: white;
    border-radius: 50px;
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
    font-weight: 800;
    box-shadow: 0 4px 15px rgba(255, 65, 108, 0.4);
    border: 2px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
  }

  &__content {
    padding: 1rem;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.8rem;
    gap: 0.8rem;
  }

  &__name {
    font-size: 1rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
    line-height: 1.3;
    flex: 1;
    transition: color 0.3s ease;
  }

  &__timer {
    display: flex;
    align-items: center;
    gap: 0.2rem;
    font-weight: 600;
    font-size: 0.7rem;
    color: #64748b;
    flex-shrink: 0;
    background: rgba(255, 65, 108, 0.1);
    padding: 0.3rem 0.6rem;
    border-radius: 50px;
  }

  &__description {
    color: #64748b;
    font-size: 0.8rem;
    margin-bottom: 0.8rem;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
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

  &__restaurant,
  &__product {
    white-space: nowrap;
  }

  &__restaurant {
    font-weight: 600;
    color: #1e293b;
  }

  &__conditions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-bottom: 0.8rem;
  }

  &__condition {
    display: flex;
    align-items: center;
    gap: 0.2rem;
    font-size: 0.7rem;
    color: #64748b;
    background: rgba(255, 65, 108, 0.1);
    padding: 0.2rem 0.5rem;
    border-radius: 50px;
  }

  &__footer {
    margin-top: auto;
  }

  &__stock {
    display: flex;
    align-items: center;
    gap: 0.2rem;
    font-size: 0.7rem;
    color: #059669;
    font-weight: 600;
    background: rgba(5, 150, 105, 0.1);
    padding: 0.3rem 0.6rem;
    border-radius: 50px;
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

// Loading y Empty states - Igual que RestaurantList
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

// Paginación - Igual que RestaurantList
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