<!-- views/RestaurantList.vue -->
<template>
    <div class="restaurants-page">
      <!-- Header section with search bar -->
      <header class="header">
        <div class="container">
          <h1 class="header__title">Descubre restaurantes increíbles</h1>
          <p class="header__subtitle">Encuentra tu comida favorita entregada a tu puerta</p>
          
          <div class="search-bar">
            <div class="search-bar__input-wrapper">
              <svg class="search-bar__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input type="text" v-model="searchQuery" placeholder="Buscar restaurantes o tipos de comida..." 
                class="search-bar__input">
            </div>
            <button class="search-bar__button">
              <span>Buscar</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
          
          <div class="header__popular-searches">
            <span class="header__popular-label">Popular:</span>
            <div class="header__popular-tags">
              <button class="popular-tag" @click="searchQuery = 'Pizza'">Pizza</button>
              <button class="popular-tag" @click="searchQuery = 'Hamburguesa'">Hamburguesa</button>
              <button class="popular-tag" @click="searchQuery = 'Sushi'">Sushi</button>
              <button class="popular-tag" @click="searchQuery = 'Tacos'">Tacos</button>
            </div>
          </div>
        </div>
        
        <div class="header__wave">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#ffffff" fill-opacity="1" 
              d="M0,96L48,90.7C96,85,192,75,288,101.3C384,128,480,192,576,197.3C672,203,768,149,864,117.3C960,85,1056,75,1152,96C1248,117,1344,171,1392,197.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
            </path>
          </svg>
        </div>
      </header>
  
      <!-- Filter section with categories -->
      <section class="filters">
        <div class="container">
          <div class="filters__wrapper">
            <div class="filters__categories">
              <div class="category-scroll">
                <div class="category-scroll__gradient category-scroll__gradient--left" v-if="showLeftScroll"></div>
                <div class="category-scroll__container" ref="categoriesContainer">
                  <button v-for="category in categories" :key="category.id"
                    :class="['category-button', { 'category-button--active': selectedCategory === category.id }]"
                    @click="selectCategory(category.id)">
                    <span class="category-button__icon" v-if="getCategoryIcon(category.id)">{{ getCategoryIcon(category.id) }}</span>
                    <span>{{ category.name }}</span>
                  </button>
                </div>
                <div class="category-scroll__gradient category-scroll__gradient--right" v-if="showRightScroll"></div>
                <button class="category-scroll__arrow category-scroll__arrow--left"
                  @click="scrollCategories('left')" v-if="showLeftScroll"
                  aria-label="Categorías anteriores">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M15 18L9 12L15 6" />
                  </svg>
                </button>
                <button class="category-scroll__arrow category-scroll__arrow--right"
                  @click="scrollCategories('right')" v-if="showRightScroll" 
                  aria-label="Más categorías">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 6L15 12L9 18" />
                  </svg>
                </button>
              </div>
            </div>
  
            <div class="filters__extra">
              <div class="filter-option">
                <label class="filter-label">Ordenar por:</label>
                <div class="filter-select-wrapper">
                  <select v-model="sortBy" class="filter-select">
                    <option value="popularity">Más Popular</option>
                    <option value="rating">Mejor Valorados</option>
                    <option value="delivery">Tiempo de Entrega</option>
                    <option value="price">Precio</option>
                  </select>
                  <div class="filter-select-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                      stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                </div>
              </div>
              
              <div class="filter-option">
                <label class="filter-label">Precio:</label>
                <div class="price-filter">
                  <button 
                    v-for="price in ['$', '$$', '$$$', '$$$$']" 
                    :key="price"
                    class="price-filter__button"
                    :class="{ 'price-filter__button--active': priceFilter.includes(price) }"
                    @click="togglePriceFilter(price)"
                  >
                    {{ price }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Restaurant list section -->
      <section class="restaurant-list">
        <div class="container">
          <div v-if="loading" class="loading-state">
            <div class="loading-spinner"></div>
            <h3 class="loading-state__title">Buscando los mejores restaurantes para ti...</h3>
            <p class="loading-state__text">Esto solo tomará un momento</p>
          </div>
  
          <div v-else-if="filteredRestaurants.length === 0" class="empty-state">
            <div class="empty-state__icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 12H2M16 6l6 6-6 6M8 18l-6-6 6-6"></path>
              </svg>
            </div>
            <h3 class="empty-state__title">No encontramos restaurantes con esos criterios</h3>
            <p class="empty-state__text">Intenta con otros filtros o búsquedas</p>
            <button @click="resetFilters" class="empty-state__button">Reiniciar filtros</button>
          </div>
  
          <div v-else>
            <div class="restaurant-list__header">
              <h2 class="restaurant-list__title">{{ getResultsTitle() }}</h2>
              <p class="restaurant-list__count">{{ filteredRestaurants.length }} restaurantes encontrados</p>
            </div>
            
            <div class="restaurant-grid">
              <div v-for="restaurant in filteredRestaurants" :key="restaurant.id" 
                class="restaurant-card" @click="goToRestaurant(restaurant.id)">
                <div class="restaurant-card__image">
                  <img :src="restaurant.coverImage" :alt="restaurant.name">
                  
                  <div class="restaurant-card__badges">
                    <span v-if="isNew(restaurant)" class="restaurant-card__badge restaurant-card__badge--new">Nuevo</span>
                    <span v-if="isFastDelivery(restaurant)" class="restaurant-card__badge restaurant-card__badge--fast">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                      </svg>
                      Rápido
                    </span>
                  </div>
                  
                  <div class="restaurant-card__delivery-info">
                    <div class="restaurant-card__delivery-time">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      {{ restaurant.deliveryTime }} min
                    </div>
                    <div class="restaurant-card__delivery-fee">
                      <span v-if="restaurant.deliveryFee > 0">Envío: ${{ restaurant.deliveryFee }}</span>
                      <span v-else class="restaurant-card__free-delivery">Envío Gratis</span>
                    </div>
                  </div>
                </div>
                
                <div class="restaurant-card__content">
                  <div class="restaurant-card__header">
                    <h3 class="restaurant-card__name">{{ restaurant.name }}</h3>
                    <div class="restaurant-card__rating">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#FFC107" stroke="#FFC107" 
                        stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                      <span>{{ restaurant.rating }}</span>
                      <span class="restaurant-card__reviews">({{ restaurant.reviewCount }})</span>
                    </div>
                  </div>
                  
                  <div class="restaurant-card__info">
                    <span class="restaurant-card__cuisine">{{ restaurant.cuisine }}</span>
                    <span class="restaurant-card__price">{{ restaurant.priceRange }}</span>
                    <span class="restaurant-card__distance">{{ restaurant.distance }} km</span>
                  </div>
                  
                  <div class="restaurant-card__tags">
                    <span class="restaurant-card__tag" v-if="restaurant.deliveryFee === 0">Envío Gratis</span>
                    <span class="restaurant-card__tag" v-if="restaurant.deliveryTime <= 20">Entrega Rápida</span>
                    <span class="restaurant-card__tag" v-if="restaurant.rating >= 4.8">Muy Valorado</span>
                  </div>
                  
                  <div class="restaurant-card__view">
                    <span>Ver restaurante</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                      stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="restaurant-list__footer">
              <button class="load-more-button" v-if="hasMoreRestaurants">
                <span>Cargar más restaurantes</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, watch } from 'vue';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  
  // Estado
  const restaurants = ref([]);
  const loading = ref(true);
  const searchQuery = ref('');
  const selectedCategory = ref('all');
  const sortBy = ref('popularity');
  const priceFilter = ref([]);
  const hasMoreRestaurants = ref(false);
  
  // Categorías mejoradas con iconos
  const categories = [
    { id: 'all', name: 'Todos' },
    { id: 'american', name: 'Americana' },
    { id: 'italian', name: 'Italiana' },
    { id: 'mexican', name: 'Mexicana' },
    { id: 'asian', name: 'Asiática' },
    { id: 'fastfood', name: 'Fast Food' },
    { id: 'healthy', name: 'Saludable' },
    { id: 'dessert', name: 'Postres' },
    { id: 'vegan', name: 'Vegana' }
  ];
  
  // Iconos para categorías
  const getCategoryIcon = (categoryId) => {
    const icons = {
      'american': '🍔',
      'italian': '🍕',
      'mexican': '🌮',
      'asian': '🍜',
      'fastfood': '🍟',
      'healthy': '🥗',
      'dessert': '🍦',
      'vegan': '🥑'
    };
    return icons[categoryId] || '';
  };
  
  // Obtener restaurantes (simulado)
  const fetchRestaurants = async () => {
    loading.value = true;
  
    // Simulación de API
    setTimeout(() => {
      restaurants.value = [
        {
          id: 1,
          name: 'Burger Kingdom',
          cuisine: 'Americana',
          priceRange: '$$',
          rating: 4.8,
          reviewCount: 324,
          deliveryTime: 25,
          deliveryFee: 2.99,
          distance: 1.2,
          coverImage: 'https://images.unsplash.com/photo-1542574271-7f3b92e6c821?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          logo: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          category: 'american',
          createdAt: new Date('2023-05-15')
        },
        {
          id: 2,
          name: 'Pizza Paradise',
          cuisine: 'Italiana',
          priceRange: '$$',
          rating: 4.6,
          reviewCount: 258,
          deliveryTime: 35,
          deliveryFee: 3.99,
          distance: 2.5,
          coverImage: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          logo: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          category: 'italian',
          createdAt: new Date('2023-08-01')
        },
        {
          id: 3,
          name: 'Taco Town',
          cuisine: 'Mexicana',
          priceRange: '$',
          rating: 4.4,
          reviewCount: 187,
          deliveryTime: 20,
          deliveryFee: 1.99,
          distance: 0.8,
          coverImage: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          logo: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          category: 'mexican',
          createdAt: new Date('2023-03-27')
        },
        {
          id: 4,
          name: 'Sushi Supreme',
          cuisine: 'Japonesa',
          priceRange: '$$$',
          rating: 4.9,
          reviewCount: 412,
          deliveryTime: 40,
          deliveryFee: 4.99,
          distance: 3.2,
          coverImage: 'https://images.unsplash.com/photo-1553621042-f6e147245754?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          logo: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          category: 'asian',
          createdAt: new Date('2022-12-15')
        },
        {
          id: 5,
          name: 'Green Leaf',
          cuisine: 'Vegetariana',
          priceRange: '$$',
          rating: 4.7,
          reviewCount: 156,
          deliveryTime: 30,
          deliveryFee: 2.49,
          distance: 1.8,
          coverImage: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          logo: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          category: 'healthy',
          createdAt: new Date('2023-07-10')
        },
        {
          id: 6,
          name: 'Chicken Shack',
          cuisine: 'Fast Food',
          priceRange: '$',
          rating: 4.3,
          reviewCount: 289,
          deliveryTime: 15,
          deliveryFee: 0,
          distance: 0.5,
          coverImage: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          logo: 'https://images.unsplash.com/photo-1547716752-9e0568b8f169?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          category: 'fastfood',
          createdAt: new Date('2023-09-25')
        },
        {
          id: 7,
          name: 'Pasta Palace',
          cuisine: 'Italiana',
          priceRange: '$$',
          rating: 4.5,
          reviewCount: 201,
          deliveryTime: 35,
          deliveryFee: 3.49,
          distance: 2.7,
          coverImage: 'https://images.unsplash.com/photo-1481931098730-318b6f776db0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          logo: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          category: 'italian',
          createdAt: new Date('2023-01-18')
        },
        {
          id: 8,
          name: 'Breakfast Bliss',
          cuisine: 'Americana',
          priceRange: '$$',
          rating: 4.7,
          reviewCount: 178,
          deliveryTime: 25,
          deliveryFee: 0,
          distance: 1.6,
          coverImage: 'https://images.unsplash.com/photo-1496412705862-e0088f16f791?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          logo: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          category: 'american',
          createdAt: new Date('2023-11-05')
        }
      ];
      
      // Simulando que hay más restaurantes
      hasMoreRestaurants.value = true;
      
      loading.value = false;
    }, 1500);
  };
  
  // Filtrar restaurantes
  const filteredRestaurants = computed(() => {
    let result = [...restaurants.value];
  
    // Filtrar por búsqueda
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(restaurant =>
        restaurant.name.toLowerCase().includes(query) ||
        restaurant.cuisine.toLowerCase().includes(query)
      );
    }
  
    // Filtrar por categoría
    if (selectedCategory.value && selectedCategory.value !== 'all') {
      result = result.filter(restaurant => restaurant.category === selectedCategory.value);
    }
    
    // Filtrar por precio
    if (priceFilter.value.length > 0) {
      result = result.filter(restaurant => priceFilter.value.includes(restaurant.priceRange));
    }
  
    // Ordenar restaurantes
    switch (sortBy.value) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'delivery':
        result.sort((a, b) => a.deliveryTime - b.deliveryTime);
        break;
      case 'price':
        result.sort((a, b) => a.priceRange.length - b.priceRange.length);
        break;
      default: // popularity
        result.sort((a, b) => b.reviewCount - a.reviewCount);
    }
  
    return result;
  });
  
  // Métodos
  const selectCategory = (categoryId) => {
    selectedCategory.value = categoryId;
  };
  
  const togglePriceFilter = (price) => {
    if (priceFilter.value.includes(price)) {
      priceFilter.value = priceFilter.value.filter(p => p !== price);
    } else {
      priceFilter.value.push(price);
    }
  };
  
  const resetFilters = () => {
    searchQuery.value = '';
    selectedCategory.value = 'all';
    sortBy.value = 'popularity';
    priceFilter.value = [];
  };
  
  const goToRestaurant = (restaurantId) => {
    router.push(`/restaurant/${restaurantId}`);
  };
  
  const getResultsTitle = () => {
    if (selectedCategory.value === 'all' && !searchQuery.value) {
      return 'Restaurantes populares';
    } else if (selectedCategory.value !== 'all') {
      const category = categories.find(c => c.id === selectedCategory.value);
      return `Restaurantes ${category ? category.name : ''}`;
    } else if (searchQuery.value) {
      return `Resultados para "${searchQuery.value}"`;
    }
    return 'Restaurantes';
  };
  
  // Helpers para badges
  const isNew = (restaurant) => {
    // Considera nuevo si tiene menos de 2 meses
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
    return restaurant.createdAt > twoMonthsAgo;
  };
  
  const isFastDelivery = (restaurant) => {
    return restaurant.deliveryTime <= 20;
  };
  
  // Navegación en carrusel
  const categoriesContainer = ref(null);
  const showLeftScroll = ref(false);
  const showRightScroll = ref(true);
  
  const checkScrollPosition = () => {
    if (!categoriesContainer.value) return;
  
    const container = categoriesContainer.value;
    showLeftScroll.value = container.scrollLeft > 10;
    showRightScroll.value = container.scrollLeft < (container.scrollWidth - container.clientWidth - 10);
  };
  
  const scrollCategories = (direction) => {
    if (!categoriesContainer.value) return;
  
    const container = categoriesContainer.value;
    const scrollAmount = container.offsetWidth * 0.75;
  
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  
    // Update scroll indicators after scrolling
    setTimeout(checkScrollPosition, 300);
  };
  
  // Observar cambios en los filtros para recargar
  watch([searchQuery, selectedCategory, sortBy, priceFilter], () => {
    if (!loading.value) {
      // En una aplicación real, esto cargaría desde el backend
      // El timeout simula una carga de datos
      loading.value = true;
      setTimeout(() => {
        loading.value = false;
      }, 500);
    }
  }, { deep: true });
  
  // Inicialización al montar
  onMounted(() => {
    selectCategory('all'); // Categoría por defecto
    fetchRestaurants();
  
    // Verificar indicadores de scroll
    setTimeout(() => {
      if (categoriesContainer.value) {
        checkScrollPosition();
        categoriesContainer.value.addEventListener('scroll', checkScrollPosition);
      }
    }, 300);
  });
  </script>
  
  <style lang="scss" scoped>
  // Variables
  $primary: #FF416C;
  $primary-gradient: linear-gradient(to right, #FF416C, #FF4B2B);
  $secondary: #0652DD;
  $secondary-gradient: linear-gradient(to right, #0652DD, #12CBC4);
  $accent: #FFA502;
  $dark: #1e293b;
  $light: #f8fafc;
  $text: #1e293b;
  $text-light: #64748b;
  $border: #e2e8f0;
  $border-radius: 16px;
  $transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  
  // Container
  .container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
    
    @media (max-width: 768px) {
      padding: 0 1.5rem;
    }
  }
  
  // Header
  .header {
    background: $primary-gradient;
    color: white;
    padding: 5rem 0 8rem;
    text-align: center;
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: 
        radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
      z-index: 1;
    }
  
    &__title {
      font-size: 3.5rem;
      font-weight: 800;
      margin-bottom: 1rem;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      position: relative;
      z-index: 2;
      
      @media (max-width: 768px) {
        font-size: 2.5rem;
      }
      
      @media (max-width: 480px) {
        font-size: 2rem;
      }
    }
    
    &__subtitle {
      font-size: 1.25rem;
      opacity: 0.9;
      margin-bottom: 2.5rem;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
      position: relative;
      z-index: 2;
      
      @media (max-width: 768px) {
        font-size: 1.1rem;
      }
    }
    
    &__popular-searches {
      margin-top: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      flex-wrap: wrap;
      position: relative;
      z-index: 2;
      
      @media (max-width: 768px) {
        flex-direction: column;
        gap: 0.5rem;
      }
    }
    
    &__popular-label {
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.95rem;
    }
    
    &__popular-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      justify-content: center;
    }
    
    &__wave {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      line-height: 0;
      z-index: 1;
      
      svg {
        width: 100%;
        height: auto;
      }
    }
  }
  
  // Popular tag
  .popular-tag {
    background-color: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    border-radius: 50px;
    padding: 0.35rem 1rem;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(5px);
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.25);
      transform: translateY(-2px);
    }
  }
  
  // Search bar
  .search-bar {
    display: flex;
    max-width: 700px;
    margin: 0 auto;
    border-radius: $border-radius;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
    position: relative;
    z-index: 10;
    
    @media (max-width: 768px) {
      flex-direction: column;
      gap: 0.5rem;
    }
    
    &__input-wrapper {
      flex: 1;
      position: relative;
      background-color: white;
      border-radius: $border-radius 0 0 $border-radius;
      overflow: hidden;
      
      @media (max-width: 768px) {
        border-radius: $border-radius;
      }
    }
    
    &__icon {
      position: absolute;
      left: 1.25rem;
      top: 50%;
      transform: translateY(-50%);
      color: $primary;
    }
    
    &__input {
      width: 100%;
      border: none;
      outline: none;
      padding: 1.25rem 1.25rem 1.25rem 3.25rem;
      font-size: 1.05rem;
      color: $dark;
      
      &::placeholder {
        color: #94a3b8;
      }
    }
    
    &__button {
      background: $secondary-gradient;
      color: white;
      border: none;
      padding: 0 2rem;
      font-weight: 600;
      font-size: 1.05rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      border-radius: 0 $border-radius $border-radius 0;
      transition: all 0.3s ease;
      
      svg {
        transition: transform 0.3s ease;
      }
      
      &:hover {
        box-shadow: 0 5px 15px rgba($secondary, 0.3);
        
        svg {
          transform: translateX(3px);
        }
      }
      
      @media (max-width: 768px) {
        border-radius: $border-radius;
        justify-content: center;
        padding: 1rem;
      }
    }
  }
  
  // Filters section
  .filters {
    background-color: white;
    padding: 1.5rem 0;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
    margin-top: -4rem;
    border-radius: $border-radius;
    margin-bottom: 2rem;
    
    &__wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1.5rem;
      
      @media (max-width: 992px) {
        flex-direction: column;
        align-items: stretch;
      }
    }
    
    &__categories {
      flex: 1;
      max-width: 70%;
      
      @media (max-width: 992px) {
        max-width: 100%;
      }
    }
    
    &__extra {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      
      @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
        width: 100%;
        gap: 1rem;
      }
    }
  }
  
  // Category scroll
  .category-scroll {
    position: relative;
    
    &__container {
      display: flex;
      gap: 0.75rem;
      overflow-x: auto;
      scrollbar-width: none;
      -webkit-overflow-scrolling: touch;
      scroll-behavior: smooth;
      padding: 0.5rem 0;
      
      &::-webkit-scrollbar {
        display: none;
      }
    }
    
    &__gradient {
      position: absolute;
      top: 0;
      height: 100%;
      width: 5rem;
      z-index: 1;
      pointer-events: none;
      
      &--left {
        left: 0;
        background: linear-gradient(to right, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0));
      }
      
      &--right {
        right: 0;
        background: linear-gradient(to left, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0));
      }
    }
    
    &__arrow {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: white;
      border: 1px solid $border;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 2;
      transition: all 0.3s ease;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
      
      &:hover {
        background-color: $primary;
        border-color: $primary;
        color: white;
        box-shadow: 0 5px 15px rgba($primary, 0.2);
      }
      
      &--left {
        left: 0.5rem;
      }
      
      &--right {
        right: 0.5rem;
      }
    }
  }
  
  // Category button
  .category-button {
    white-space: nowrap;
    padding: 0.6rem 1.2rem;
    border: 1px solid $border;
    background-color: white;
    color: $text;
    border-radius: 50px;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: $transition;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    &__icon {
      font-size: 1.2rem;
    }
    
    &:hover {
      border-color: $primary;
      color: $primary;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    }
    
    &--active {
      background: $primary-gradient;
      color: white;
      border-color: transparent;
      
      &:hover {
        color: white;
        box-shadow: 0 5px 15px rgba($primary, 0.2);
      }
    }
  }
  
  // Filter option
  .filter-option {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    
    @media (max-width: 768px) {
      width: 100%;
    }
  }
  
  .filter-label {
    font-size: 0.95rem;
    color: $text-light;
    font-weight: 500;
  }
  
  // Filter select
  .filter-select-wrapper {
    position: relative;
    
    @media (max-width: 768px) {
      flex: 1;
    }
  }
  
  .filter-select {
    appearance: none;
    padding: 0.6rem 2.5rem 0.6rem 1.2rem;
    border: 1px solid $border;
    border-radius: 50px;
    background-color: white;
    font-size: 0.95rem;
    color: $text;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:focus {
      outline: none;
      border-color: $primary;
      box-shadow: 0 0 0 3px rgba($primary, 0.1);
    }
    
    @media (max-width: 768px) {
      width: 100%;
    }
  }
  
  .filter-select-icon {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: $text-light;
    pointer-events: none;
  }
  
  // Price filter
  .price-filter {
    display: flex;
    gap: 0.25rem;
    
    &__button {
      min-width: 38px;
      height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid $border;
      background-color: white;
      color: $text;
      border-radius: 50px;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        border-color: $primary;
        color: $primary;
      }
      
      &--active {
        background: $primary-gradient;
        color: white;
        border-color: transparent;
        
        &:hover {
          color: white;
        }
      }
    }
  }
  
  // Restaurant list
  .restaurant-list {
    padding: 2rem 0 5rem;
    background-color: $light;
    min-height: 50vh;
    
    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      
      @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }
    }
    
    &__title {
      font-size: 2rem;
      font-weight: 800;
      color: $dark;
      margin: 0;
      
      @media (max-width: 768px) {
        font-size: 1.75rem;
      }
    }
    
    &__count {
      color: $text-light;
      font-size: 1rem;
    }
    
    &__footer {
      margin-top: 3rem;
      text-align: center;
    }
  }
  
  // Restaurant grid
  .restaurant-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 2rem;
    
    @media (max-width: 768px) {
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    }
    
    @media (max-width: 480px) {
      grid-template-columns: 1fr;
    }
  }
  
  // Restaurant card
  .restaurant-card {
    background-color: white;
    border-radius: $border-radius;
    overflow: hidden;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    transition: $transition;
    cursor: pointer;
    border: 1px solid rgba(0, 0, 0, 0.03);
    
    &:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 30px rgba(0, 0, 0, 0.1);
      
      .restaurant-card__image img {
        transform: scale(1.05);
      }
      
      .restaurant-card__view {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    &__image {
      height: 180px;
      position: relative;
      overflow: hidden;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
      }
    }
    
    &__badges {
      position: absolute;
      top: 1rem;
      left: 1rem;
      display: flex;
      gap: 0.5rem;
      z-index: 1;
    }
    
    &__badge {
      padding: 0.35rem 0.75rem;
      border-radius: 50px;
      font-size: 0.75rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.25rem;
      backdrop-filter: blur(4px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      
      &--new {
        background-color: rgba(16, 185, 129, 0.9);
        color: white;
      }
      
      &--fast {
        background-color: rgba(245, 158, 11, 0.9);
        color: white;
      }
    }
    
    &__delivery-info {
      position: absolute;
      bottom: 1rem;
      right: 1rem;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.5rem;
      z-index: 1;
    }
    
    &__delivery-time {
      background-color: rgba(0, 0, 0, 0.75);
      color: white;
      padding: 0.4rem 0.75rem;
      border-radius: 50px;
      font-size: 0.75rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.35rem;
      backdrop-filter: blur(4px);
    }
    
    &__delivery-fee {
      background-color: rgba(255, 255, 255, 0.9);
      color: $text;
      padding: 0.4rem 0.75rem;
      border-radius: 50px;
      font-size: 0.75rem;
      font-weight: 500;
      backdrop-filter: blur(4px);
    }
    
    &__free-delivery {
      color: #10b981;
      font-weight: 600;
    }
    
    &__content {
      padding: 1.5rem;
      position: relative;
    }
    
    &__header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.75rem;
    }
    
    &__name {
      font-size: 1.2rem;
      font-weight: 700;
      color: $dark;
      margin: 0 0 0.5rem;
    }
    
    &__rating {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-weight: 700;
      color: $dark;
    }
    
    &__reviews {
      font-weight: 400;
      color: $text-light;
      font-size: 0.8rem;
    }
    
    &__info {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-bottom: 1rem;
      
      span {
        color: $text-light;
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        
        &::after {
          content: '';
          display: inline-block;
          width: 3px;
          height: 3px;
          background-color: $border;
          border-radius: 50%;
          margin-left: 0.75rem;
        }
        
        &:last-child::after {
          display: none;
        }
      }
    }
    
    &__tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }
    
    &__tag {
      background-color: #f8fafc;
      color: $text-light;
      padding: 0.25rem 0.75rem;
      border-radius: 50px;
      font-size: 0.8rem;
      border: 1px solid $border;
    }
    
    &__view {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      background: $primary-gradient;
      color: white;
      padding: 0.6rem 1.2rem;
      border-radius: 50px;
      font-weight: 600;
      font-size: 0.9rem;
      margin-top: auto;
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.3s ease;
      
      svg {
        transition: transform 0.3s ease;
      }
      
      &:hover svg {
        transform: translateX(3px);
      }
    }
  }
  
  // Loading state
  .loading-state {
    text-align: center;
    padding: 3rem 1rem;
    
    &__title {
      font-size: 1.5rem;
      font-weight: 700;
      color: $dark;
      margin: 1rem 0 0.5rem;
    }
    
    &__text {
      color: $text-light;
      margin-bottom: 0;
    }
  
    .loading-spinner {
      display: inline-block;
      width: 64px;
      height: 64px;
      border: 4px solid rgba($primary, 0.1);
      border-radius: 50%;
      border-top-color: $primary;
      animation: spin 1s ease-in-out infinite;
    }
  
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  }
  
  // Empty state
  .empty-state {
    text-align: center;
    padding: 4rem 1rem;
    
    &__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 120px;
      height: 120px;
      background-color: #f8fafc;
      border-radius: 50%;
      margin: 0 auto 1.5rem;
      color: $text-light;
    }
    
    &__title {
      font-size: 1.5rem;
      font-weight: 700;
      color: $dark;
      margin: 0 0 0.5rem;
    }
    
    &__text {
      color: $text-light;
      margin-bottom: 2rem;
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
    }
    
    &__button {
      background: $primary-gradient;
      color: white;
      border: none;
      padding: 0.8rem 1.5rem;
      border-radius: 50px;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        box-shadow: 0 5px 15px rgba($primary, 0.3);
        transform: translateY(-2px);
      }
    }
  }
  
  // Load more button
  .load-more-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background-color: white;
    color: $primary;
    border: 1px solid $border;
    padding: 0.8rem 2rem;
    border-radius: 50px;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    
    svg {
      transition: transform 0.3s ease;
    }
    
    &:hover {
      background-color: #f8fafc;
      border-color: $primary;
      
      svg {
        transform: translateY(3px);
      }
    }
  }
</style>