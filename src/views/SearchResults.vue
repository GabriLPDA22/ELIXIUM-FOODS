<template>
  <div class="search-results-page">
    <section class="search-header">
      <div class="container">
        <div class="search-header__content">
          <div class="search-header__info">
            <h1 class="search-header__title">
              Resultados para: <span class="search-header__query">"{{ searchQuery }}"</span>
            </h1>
            <p v-if="!isLoadingResults" class="search-header__count">
              {{ totalResults }} resultados encontrados
            </p>
          </div>
          <div class="search-header__search">
            <SearchBox
              :placeholder="'Buscar restaurantes, platos, cocinas...'"
              :button-text="'Buscar'"
              @search="handleNewSearch"
            />
          </div>
        </div>
      </div>
    </section>

    <section class="filters-section">
      <div class="container">
        <div class="filters-row">
          <div class="filter-group">
            <span class="filter-group__label">Mostrar:</span>
            <div class="filter-tabs">
              <button
                v-for="tab in resultTabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="['filter-tab', { 'filter-tab--active': activeTab === tab.id }]"
              >
                <span class="filter-tab__icon">{{ tab.icon }}</span>
                <span class="filter-tab__text">{{ tab.label }}</span>
                <span v-if="tab.count" class="filter-tab__count">{{ tab.count }}</span>
              </button>
            </div>
          </div>
          <div class="filter-group">
            <span class="filter-group__label">Ordenar por:</span>
            <div class="filter-select">
              <select v-model="sortBy" class="filter-select__control">
                <option value="relevance">Relevancia</option>
                <option value="rating">Mejor Valorados</option>
                <option value="delivery">Tiempo de Entrega</option>
                <option value="price">Precio</option>
              </select>
              <svg class="filter-select__arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="results-section">
      <div class="container">
        <div v-if="isLoadingResults" class="loading-state">
          <div class="loading-state__spinner"></div>
          <p class="loading-state__text">Buscando los mejores resultados para ti...</p>
        </div>
        <div v-else-if="hasError" class="error-state">
          <div class="error-state__icon">⚠️</div>
          <h3 class="error-state__title">Oops! Algo salió mal</h3>
          <p class="error-state__text">No pudimos realizar la búsqueda. Por favor, intenta de nuevo.</p>
          <button @click="performSearch" class="error-state__button">Reintentar</button>
        </div>
        <div v-else-if="totalResults === 0" class="empty-state">
          <div class="empty-state__icon">🔍</div>
          <h3 class="empty-state__title">No encontramos resultados</h3>
          <p class="empty-state__text">
            Intenta con términos diferentes o explora nuestras categorías populares
          </p>
          <div class="empty-state__suggestions">
            <span class="empty-state__suggestions-label">Sugerencias:</span>
            <div class="empty-state__tags">
              <button
                v-for="suggestion in popularSearchSuggestions"
                :key="suggestion"
                @click="handleNewSearch(suggestion)"
                class="empty-state__tag"
              >
                {{ suggestion }}
              </button>
            </div>
          </div>
        </div>
        <div v-else class="results-content">
          <div v-if="activeTab === 'all'" class="results-grid">
            <div v-if="filteredResults.restaurants.length > 0" class="results-section-group">
              <h2 class="results-section-title">
                <span class="results-section-icon">🍽️</span>
                Restaurantes ({{ filteredResults.restaurants.length }})
              </h2>
              <div class="restaurant-grid">
                <RestaurantCard
                  v-for="restaurant in filteredResults.restaurants.slice(0, showAllRestaurants ? undefined : 6)"
                  :key="`restaurant-${restaurant.id}`"
                  :restaurant="restaurant"
                  @click="goToRestaurant(restaurant.id)"
                />
              </div>
              <button
                v-if="filteredResults.restaurants.length > 6 && !showAllRestaurants"
                @click="showAllRestaurants = true"
                class="show-more-button"
              >
                Ver todos los restaurantes ({{ filteredResults.restaurants.length }})
              </button>
            </div>
            <div v-if="filteredResults.products.length > 0" class="results-section-group">
              <h2 class="results-section-title">
                <span class="results-section-icon">🍕</span>
                Productos ({{ filteredResults.products.length }})
              </h2>
              <div class="product-grid">
                <ProductCard
                  v-for="product in filteredResults.products.slice(0, showAllProducts ? undefined : 8)"
                  :key="`product-${product.id}`"
                  :product="product"
                  @click="goToProduct(product)"
                />
              </div>
              <button
                v-if="filteredResults.products.length > 8 && !showAllProducts"
                @click="showAllProducts = true"
                class="show-more-button"
              >
                Ver todos los productos ({{ filteredResults.products.length }})
              </button>
            </div>
          </div>
          <div v-if="activeTab === 'restaurants'" class="restaurant-grid">
            <RestaurantCard
              v-for="restaurant in filteredResults.restaurants"
              :key="`restaurant-${restaurant.id}`"
              :restaurant="restaurant"
              @click="goToRestaurant(restaurant.id)"
            />
          </div>
          <div v-if="activeTab === 'products'" class="product-grid">
            <ProductCard
              v-for="product in filteredResults.products"
              :key="`product-${product.id}`"
              :product="product"
              @click="goToProduct(product)"
            />
          </div>
        </div>
      </div>
    </section>

    <ProductRestaurantSelectionModal
      v-if="showProductRestaurantModal"
      :product="selectedProductForModal"
      :offerings="restaurantOfferingsForProduct"
      :is-loading-initial-offerings="isLoadingOfferingsForModal"
      :error-initial-offerings="errorOfferingsForModal"
      @select="navigateToSelectedRestaurantProduct"
      @close="showProductRestaurantModal = false"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SearchBox from '@/components/common/SearchBox.vue';
import RestaurantCard from '@/components/feature/restaurant/RestaurantCard.vue';
import ProductCard from '@/components/cards/ProductCard.vue';
import ProductRestaurantSelectionModal from '@/components/modals/ProductRestaurantSelectionModal.vue';
import {
  searchService,
  type SearchResults,
  type SearchRestaurant,
  type SearchProduct,
  type RestaurantProductOfferingDto as BaseRestaurantProductOfferingDto,
} from '@/services/searchService';

interface RestaurantProductOfferingDto extends BaseRestaurantProductOfferingDto {
  restaurantLogoUrl?: string;
}

const route = useRoute();
const router = useRouter();

const searchQuery = ref<string>('');
const searchResults = ref<SearchResults>({
  restaurants: [],
  products: [],
  totalResults: 0,
  query: '',
});
const isLoadingResults = ref<boolean>(false);
const hasError = ref<boolean>(false);
const activeTab = ref<'all' | 'restaurants' | 'products'>('all');
const sortBy = ref<'relevance' | 'rating' | 'delivery' | 'price'>('relevance');
const showAllRestaurants = ref<boolean>(false);
const showAllProducts = ref<boolean>(false);
const popularSearchSuggestions = ref<string[]>([]);

const showProductRestaurantModal = ref<boolean>(false);
const selectedProductForModal = ref<SearchProduct | null>(null);
const restaurantOfferingsForProduct = ref<RestaurantProductOfferingDto[]>([]);
const isLoadingOfferingsForModal = ref<boolean>(false);
const errorOfferingsForModal = ref<string | null>(null);

const resultTabs = computed(() => [
  {
    id: 'all',
    label: 'Todos',
    icon: '🔍',
    count: searchResults.value.totalResults,
  },
  {
    id: 'restaurants',
    label: 'Restaurantes',
    icon: '🍽️',
    count: searchResults.value.restaurants.length,
  },
  {
    id: 'products',
    label: 'Productos',
    icon: '🍕',
    count: searchResults.value.products.length,
  },
]);

const totalResults = computed<number>(() => searchResults.value.totalResults);

const filteredResults = computed<{
  restaurants: SearchRestaurant[];
  products: SearchProduct[];
}>(() => {
  const restaurantsCopy = [...(searchResults.value.restaurants || [])];
  const productsCopy = [...(searchResults.value.products || [])];

  if (sortBy.value === 'rating') {
    restaurantsCopy.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
  } else if (sortBy.value === 'delivery') {
    restaurantsCopy.sort((a, b) => (a.estimatedDeliveryTime || 0) - (b.estimatedDeliveryTime || 0));
  } else if (sortBy.value === 'price') {
    restaurantsCopy.sort((a, b) => (a.deliveryFee || 0) - (b.deliveryFee || 0));
    productsCopy.sort(
      (a, b) =>
        ((a.restaurantPrice ?? a.basePrice ?? 0) as number) -
        ((b.restaurantPrice ?? b.basePrice ?? 0) as number)
    );
  }

  return {
    restaurants: restaurantsCopy,
    products: productsCopy,
  };
});

const performSearch = async (): Promise<void> => {
  const trimmedQuery = searchQuery.value.trim();
  if (!trimmedQuery) {
    searchResults.value = {
      restaurants: [],
      products: [],
      totalResults: 0,
      query: '',
    };
    return;
  }

  isLoadingResults.value = true;
  hasError.value = false;
  showAllRestaurants.value = false;
  showAllProducts.value = false;

  try {
    const results = await searchService.search({
      query: trimmedQuery,
      sortBy: sortBy.value,
    });

    searchResults.value = {
      restaurants: results.restaurants ?? [],
      products: results.products ?? [],
      totalResults: typeof results.totalResults === 'number' ? results.totalResults : ((results.restaurants?.length ?? 0) + (results.products?.length ?? 0)),
      query: trimmedQuery,
    };

    if (
      activeTab.value === 'restaurants' &&
      (searchResults.value.restaurants.length === 0 && searchResults.value.products.length > 0)
    ) {
      activeTab.value = 'products';
    }
  } catch (err) {
    console.error('Error en búsqueda:', err);
    hasError.value = true;
    searchResults.value = {
      restaurants: [],
      products: [],
      totalResults: 0,
      query: trimmedQuery,
    };
  } finally {
    isLoadingResults.value = false;
  }
};

const fetchPopularSuggestions = async (): Promise<void> => {
  try {
    popularSearchSuggestions.value = await searchService.getPopularSearches();
  } catch (err) {
    console.error('Error fetching popular search suggestions:', err);
    popularSearchSuggestions.value = [];
  }
};

const handleNewSearch = async (query: string): Promise<void> => {
  await router.replace({ path: '/search', query: { q: query.trim() } });
};

const goToRestaurant = (restaurantId: number): void => {
  router.push(`/restaurant/${restaurantId}`);
};

const goToProduct = async (product: SearchProduct): Promise<void> => {
  if (!product || product.id === undefined) return;

  if (product.restaurantId) {
    router.push(`/restaurant/${product.restaurantId}?product=${product.id}`);
    return;
  }

  selectedProductForModal.value = product;
  isLoadingOfferingsForModal.value = true;
  errorOfferingsForModal.value = null;
  restaurantOfferingsForProduct.value = [];
  showProductRestaurantModal.value = true;

  try {
    const offeringsData = await searchService.getRestaurantsForProduct(product.id);

    if (!offeringsData || offeringsData.length === 0) {
      restaurantOfferingsForProduct.value = [];
    } else if (offeringsData.length === 1) {
      showProductRestaurantModal.value = false;
      router.push(`/restaurant/${offeringsData[0].restaurantId}?product=${product.id}`);
    } else {
      restaurantOfferingsForProduct.value = offeringsData;
    }
  } catch (err) {
    console.error('Error fetching restaurants for product:', err);
    errorOfferingsForModal.value = 'No se pudieron cargar las opciones de restaurante.';
    restaurantOfferingsForProduct.value = [];
  } finally {
    isLoadingOfferingsForModal.value = false;
  }
};

const navigateToSelectedRestaurantProduct = (offering: BaseRestaurantProductOfferingDto): void => {
  showProductRestaurantModal.value = false;
  if (selectedProductForModal.value) {
    router.push(
      `/restaurant/${offering.restaurantId}?product=${selectedProductForModal.value.id}`
    );
  }
};

onMounted(() => {
  searchQuery.value = (route.query.q as string) || '';
  const initialSort = route.query.sortBy as string;
  if (initialSort && ['relevance', 'rating', 'delivery', 'price'].includes(initialSort)) {
    sortBy.value = initialSort as 'relevance' | 'rating' | 'delivery' | 'price';
  }

  if (searchQuery.value) {
    performSearch();
  }
  fetchPopularSuggestions();
});

watch(
  () => route.query.q,
  (newQueryValue: unknown) => {
    const currentRouteQ = newQueryValue as string | undefined;

    if (currentRouteQ === undefined) {
      if (searchQuery.value !== '') {
        searchQuery.value = '';
        searchResults.value = { restaurants: [], products: [], totalResults: 0, query: '' };
      }
    } else {
      if (currentRouteQ !== searchQuery.value) {
        searchQuery.value = currentRouteQ;
        performSearch();
      }
    }
  }
);

watch(
  sortBy,
  () => {
    if (searchQuery.value || searchResults.value.totalResults > 0) {
      performSearch();
    }
  }
);
</script>


<style lang="scss" scoped>
.search-results-page {
  background: linear-gradient(to bottom, #ffffff, #f8fafc);
  min-height: 100vh;
}
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  @media (max-width: 768px) { padding: 0 1rem; }
}
.search-header {
  background: linear-gradient(135deg, #FF416C, #FF4B2B);
  color: white;
  padding: 2rem 0 3rem;
  &__content {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    @media (min-width: 768px) {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
  }
  &__info { flex: 1; }
  &__title {
    font-size: 1.8rem;
    font-weight: 800;
    margin: 0 0 0.5rem;
    line-height: 1.2;
    @media (min-width: 768px) { font-size: 2.2rem; }
  }
  &__query {
    color: #FFC837;
    background: rgba(255, 255, 255, 0.1);
    padding: 0.2rem 0.6rem;
    border-radius: 8px;
    backdrop-filter: blur(10px);
  }
  &__count {
    color: rgba(255, 255, 255, 0.9);
    font-size: 1rem;
    margin: 0;
  }
  &__search {
    flex-shrink: 0;
    width: 100%;
    max-width: 400px;
    @media (max-width: 767px) { max-width: none; }
  }
}
.filters-section {
  background: white;
  padding: 1.5rem 0;
  border-bottom: 1px solid #f1f5f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
}
.filters-row {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;
  }
}
.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    gap: 1rem;
  }
  &__label {
    font-size: 0.9rem;
    font-weight: 600;
    color: #64748b;
    white-space: nowrap;
  }
}
.filter-tabs {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding: 0.2rem 0;
  &::-webkit-scrollbar { display: none; }
}
.filter-tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  &:hover {
    border-color: #FF416C;
    color: #FF416C;
  }
  &--active {
    background: linear-gradient(135deg, #FF416C, #FF4B2B);
    border-color: transparent;
    color: white;
    box-shadow: 0 3px 10px rgba(255, 65, 108, 0.3);
  }
  &__icon { font-size: 0.9rem; }
  &__count {
    background: rgba(0, 0, 0, 0.1);
    color: inherit;
    padding: 0.1rem 0.4rem;
    border-radius: 50px;
    font-size: 0.7rem;
    font-weight: 700;
    .filter-tab--active & {
      background: rgba(255, 255, 255, 0.2);
    }
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
    &:hover { border-color: #FF416C; }
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
.results-section { padding: 2rem 0 4rem; }
.results-content { margin-top: 1rem; }
.results-section-group {
  margin-bottom: 3rem;
  &:last-child { margin-bottom: 0; }
}
.results-section-title {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 1.5rem;
  padding-bottom: 0.8rem;
  border-bottom: 2px solid #f1f5f9;
  &-icon { font-size: 1.3rem; }
}
.restaurant-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
  }
}
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }
}
.show-more-button {
  display: block;
  margin: 2rem auto 0;
  padding: 0.8rem 2rem;
  background: linear-gradient(135deg, #FF416C, #FF4B2B);
  color: white;
  border: none;
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
.loading-state, .error-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}
.loading-state {
  &__spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #f1f5f9;
    border-radius: 50%;
    border-top-color: #FF416C;
    animation: spin 1s linear infinite;
    margin-bottom: 1.5rem;
  }
  &__text {
    color: #64748b;
    font-size: 1.1rem;
    font-weight: 500;
  }
}
.error-state {
  &__icon { font-size: 3rem; margin-bottom: 1rem; }
  &__title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #dc2626;
    margin: 0 0 0.8rem;
  }
  &__text {
    color: #64748b;
    margin: 0 0 1.5rem;
    max-width: 400px;
    line-height: 1.6;
  }
  &__button {
    background: linear-gradient(135deg, #FF416C, #FF4B2B);
    color: white;
    border: none;
    padding: 0.8rem 1.8rem;
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
.empty-state {
  &__icon { font-size: 4rem; margin-bottom: 1.5rem; opacity: 0.6; }
  &__title {
    font-size: 1.8rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 1rem;
  }
  &__text {
    color: #64748b;
    margin: 0 0 2rem;
    max-width: 500px;
    line-height: 1.6;
    font-size: 1.1rem;
  }
  &__suggestions {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    @media (min-width: 768px) {
      flex-direction: row;
      gap: 1.5rem;
    }
  }
  &__suggestions-label {
    font-size: 0.9rem;
    font-weight: 600;
    color: #64748b;
  }
  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    justify-content: center;
  }
  &__tag {
    background: rgba(255, 65, 108, 0.1);
    color: #FF416C;
    border: 1px solid rgba(255, 65, 108, 0.2);
    padding: 0.4rem 0.8rem;
    border-radius: 50px;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    &:hover {
      background: rgba(255, 65, 108, 0.2);
      transform: translateY(-1px);
    }
  }
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
