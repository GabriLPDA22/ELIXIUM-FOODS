<!-- src/views/Offers.vue -->
<template>
    <div class="offers-view">
      <!-- Header con fondo degradado y ondas -->
      <section class="offers-header">
        <div class="container">
          <div class="offers-header__content">
            <h1 class="offers-header__title">Ofertas Especiales</h1>
            <p class="offers-header__subtitle">Descubre increíbles descuentos y promociones exclusivas</p>
          </div>
        </div>
        <div class="offers-header__wave">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#ffffff" fill-opacity="1"
              d="M0,192L40,181.3C80,171,160,149,240,149.3C320,149,400,171,480,176C560,181,640,171,720,144C800,117,880,75,960,69.3C1040,64,1120,96,1200,117.3C1280,139,1360,149,1400,154.7L1440,160L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z">
            </path>
          </svg>
        </div>
      </section>
  
      <!-- Filtros de ofertas -->
      <section class="offers-filters">
        <div class="container">
          <div class="offers-filters__wrapper">
            <button
              v-for="filter in filters"
              :key="filter.id"
              class="offers-filter-button"
              :class="{ 'offers-filter-button--active': activeFilter === filter.id }"
              @click="setActiveFilter(filter.id)">
              <span class="offers-filter-button__icon" v-html="filter.icon"></span>
              <span class="offers-filter-button__text">{{ filter.label }}</span>
            </button>
          </div>
        </div>
      </section>
  
      <!-- Ofertas destacadas -->
      <section class="featured-offers">
        <div class="container">
          <div class="featured-offers__header">
            <h2 class="featured-offers__title">Ofertas Destacadas</h2>
            <p class="featured-offers__subtitle">Aprovecha estas promociones por tiempo limitado</p>
          </div>
  
          <div class="featured-offers__carousel">
            <div class="featured-offers__cards">
              <div v-for="offer in featuredOffers" :key="offer.id" class="featured-offer-card">
                <div class="featured-offer-card__image">
                  <img :src="offer.image" :alt="offer.title" />
                  <div class="featured-offer-card__discount">
                    <span>{{ offer.discount }}</span>
                  </div>
                </div>
                <div class="featured-offer-card__content">
                  <h3 class="featured-offer-card__title">{{ offer.title }}</h3>
                  <p class="featured-offer-card__description">{{ offer.description }}</p>
                  <div class="featured-offer-card__restaurant">
                    <img :src="offer.restaurantLogo" :alt="offer.restaurantName" class="featured-offer-card__restaurant-logo" />
                    <span class="featured-offer-card__restaurant-name">{{ offer.restaurantName }}</span>
                  </div>
                  <div class="featured-offer-card__footer">
                    <div class="featured-offer-card__validity">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      <span>Válido hasta {{ offer.validUntil }}</span>
                    </div>
                    <button class="featured-offer-card__button">Ver oferta</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Ofertas por categoría -->
      <section class="offers-list">
        <div class="container">
          <div class="offers-list__header">
            <h2 class="offers-list__title">Todas las ofertas</h2>
            <div class="offers-list__sort">
              <span class="offers-list__sort-label">Ordenar por:</span>
              <div class="select-wrapper">
                <select v-model="sortBy" class="select-control">
                  <option value="discount">Mayor descuento</option>
                  <option value="expiry">Próximos a expirar</option>
                  <option value="popular">Más populares</option>
                </select>
                <svg class="select-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>
          </div>
  
          <div class="offers-grid">
            <div v-for="offer in filteredOffers" :key="offer.id" class="offer-card">
              <div class="offer-card__ribbon" v-if="offer.isHot">
                <span>HOT</span>
              </div>
              <div class="offer-card__image">
                <img :src="offer.image" :alt="offer.title" />
              </div>
              <div class="offer-card__content">
                <div class="offer-card__discount">{{ offer.discount }}</div>
                <h3 class="offer-card__title">{{ offer.title }}</h3>
                <p class="offer-card__description">{{ offer.description }}</p>
                <div class="offer-card__restaurant">
                  <img :src="offer.restaurantLogo" :alt="offer.restaurantName" class="offer-card__restaurant-logo" />
                  <span class="offer-card__restaurant-name">{{ offer.restaurantName }}</span>
                </div>
                <div class="offer-card__footer">
                  <div class="offer-card__code">
                    <span class="offer-card__code-label">Código:</span>
                    <span class="offer-card__code-value">{{ offer.code }}</span>
                    <button class="offer-card__code-copy" @click="copyCode(offer.code)">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                    </button>
                  </div>
                  <div class="offer-card__validity">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                      stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>Válido hasta {{ offer.validUntil }}</span>
                  </div>
                  <router-link :to="`/restaurant/${offer.restaurantId}`" class="offer-card__button">
                    Aprovechar oferta
                  </router-link>
                </div>
              </div>
            </div>
          </div>
  
          <div v-if="hasMoreOffers" class="load-more">
            <button @click="loadMoreOffers" class="load-more__button">
              <span>Cargar más ofertas</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </section>
  
      <!-- Regístrate para más ofertas -->
      <section class="signup-banner">
        <div class="container">
          <div class="signup-banner__content">
            <div class="signup-banner__text">
              <h2 class="signup-banner__title">¿Quieres más descuentos?</h2>
              <p class="signup-banner__description">
                Regístrate ahora y recibe ofertas exclusivas directamente en tu email
              </p>
            </div>
            <router-link to="/register" class="signup-banner__button">
              Crear cuenta
            </router-link>
          </div>
        </div>
      </section>
  
      <!-- Notificaciones de copia de código -->
      <div v-if="showCopyNotification" class="copy-notification">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <span>Código copiado al portapapeles</span>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  
  // Filtros
  const filters = [
    {
      id: 'all',
      label: 'Todas',
      icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>'
    },
    {
      id: 'delivery',
      label: 'Envío gratis',
      icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13" rx="2" ry="2"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>'
    },
    {
      id: 'discount',
      label: 'Descuentos',
      icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="5" x2="5" y2="19"></line><circle cx="6.5" cy="6.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle></svg>'
    },
    {
      id: 'new-users',
      label: 'Nuevos usuarios',
      icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>'
    },
    {
      id: 'exclusive',
      label: 'Exclusivas',
      icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>'
    }
  ];
  
  // Estado
  const activeFilter = ref('all');
  const sortBy = ref('discount');
  const showCopyNotification = ref(false);
  const hasMoreOffers = ref(true);
  
  // Datos simulados de ofertas destacadas
  const featuredOffers = ref([
    {
      id: 1,
      title: 'Combo Burger Premium',
      description: 'Burger con doble carne, papas y refresco a precio especial',
      discount: '-40%',
      restaurantName: 'Burger Kingdom',
      restaurantLogo: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      code: 'BURGERPREMIUM40',
      validUntil: '15 Junio',
      type: 'discount',
      isHot: true,
      restaurantId: 1
    },
    {
      id: 2,
      title: 'Envío Gratis en tu primera compra',
      description: 'Sin mínimo de compra, válido para cualquier restaurante',
      discount: 'GRATIS',
      restaurantName: 'Elixium Foods',
      restaurantLogo: 'https://images.unsplash.com/photo-1581976689013-d0341ea68391?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      image: 'https://images.unsplash.com/photo-1581976689013-d0341ea68391?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      code: 'NUEVOENVIO',
      validUntil: '31 Mayo',
      type: 'delivery',
      isHot: false,
      restaurantId: null
    },
    {
      id: 3,
      title: 'Pizza Familiar 2x1',
      description: 'Compra una pizza familiar y llévate otra gratis',
      discount: '2x1',
      restaurantName: 'Pizza Paradise',
      restaurantLogo: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      code: 'PIZZA2X1',
      validUntil: '10 Junio',
      type: 'discount',
      isHot: true,
      restaurantId: 2
    }
  ]);
  
  // Datos simulados de ofertas
  const allOffers = ref([
    {
      id: 1,
      title: 'Combo Burger Premium',
      description: 'Burger con doble carne, papas y refresco a precio especial',
      discount: '-40%',
      restaurantName: 'Burger Kingdom',
      restaurantLogo: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      code: 'BURGERPREMIUM40',
      validUntil: '15 Junio',
      type: 'discount',
      isHot: true,
      restaurantId: 1
    },
    {
      id: 2,
      title: 'Envío Gratis en tu primera compra',
      description: 'Sin mínimo de compra, válido para cualquier restaurante',
      discount: 'GRATIS',
      restaurantName: 'Elixium Foods',
      restaurantLogo: 'https://images.unsplash.com/photo-1581976689013-d0341ea68391?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      image: 'https://images.unsplash.com/photo-1581976689013-d0341ea68391?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      code: 'NUEVOENVIO',
      validUntil: '31 Mayo',
      type: 'delivery',
      isHot: false,
      restaurantId: null
    },
    {
      id: 3,
      title: 'Pizza Familiar 2x1',
      description: 'Compra una pizza familiar y llévate otra gratis',
      discount: '2x1',
      restaurantName: 'Pizza Paradise',
      restaurantLogo: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      code: 'PIZZA2X1',
      validUntil: '10 Junio',
      type: 'discount',
      isHot: true,
      restaurantId: 2
    },
    {
      id: 4,
      title: '20% en Sushi Premium',
      description: 'Descuento en todos los rolls premium de la carta',
      discount: '-20%',
      restaurantName: 'Sushi Supreme',
      restaurantLogo: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      code: 'SUSHI20',
      validUntil: '5 Junio',
      type: 'discount',
      isHot: false,
      restaurantId: 4
    },
    {
      id: 5,
      title: '50% en tu primera compra',
      description: 'Descuento exclusivo para nuevos usuarios',
      discount: '-50%',
      restaurantName: 'Elixium Foods',
      restaurantLogo: 'https://images.unsplash.com/photo-1581976689013-d0341ea68391?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      code: 'BIENVENIDO50',
      validUntil: '31 Mayo',
      type: 'new-users',
      isHot: true,
      restaurantId: null
    },
    {
      id: 6,
      title: 'Envío gratis en Tacos',
      description: 'Envío sin costo en pedidos superiores a $150',
      discount: 'Envío GRATIS',
      restaurantName: 'Taco Town',
      restaurantLogo: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      code: 'TACOGRATIS',
      validUntil: '20 Junio',
      type: 'delivery',
      isHot: false,
      restaurantId: 3
    },
    {
      id: 7,
      title: '25% en menú vegetariano',
      description: 'Descuento especial en todos los platos vegetarianos',
      discount: '-25%',
      restaurantName: 'Green Leaf',
      restaurantLogo: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      code: 'VEGGIE25',
      validUntil: '15 Junio',
      type: 'discount',
      isHot: false,
      restaurantId: 5
    },
    {
      id: 8,
      title: 'Postre gratis',
      description: 'Postre gratis en pedidos superiores a $250',
      discount: 'GRATIS',
      restaurantName: 'Breakfast Bliss',
      restaurantLogo: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      code: 'POSTREFREE',
      validUntil: '12 Junio',
      type: 'exclusive',
      isHot: false,
      restaurantId: 8
    }
  ]);
  
  // Ofertas filtradas
  const filteredOffers = computed(() => {
    let result = [...allOffers.value];
    
    // Filtrar por tipo
    if (activeFilter.value !== 'all') {
      result = result.filter(offer => offer.type === activeFilter.value);
    }
    
    // Ordenar
    if (sortBy.value === 'discount') {
      result.sort((a, b) => {
        // Primero los Hot
        if (a.isHot && !b.isHot) return -1;
        if (!a.isHot && b.isHot) return 1;
        
        // Luego por descuento
        const discountA = parseDiscount(a.discount);
        const discountB = parseDiscount(b.discount);
        return discountB - discountA;
      });
    } else if (sortBy.value === 'expiry') {
      // Simulación de ordenamiento por expiración
      const today = new Date();
      result.sort((a, b) => {
        // Comparación simulada basada en strings de fecha
        return a.validUntil.localeCompare(b.validUntil);
      });
    } else if (sortBy.value === 'popular') {
      // Primero los Hot, simulando popularidad
      result.sort((a, b) => {
        if (a.isHot && !b.isHot) return -1;
        if (!a.isHot && b.isHot) return 1;
        return 0;
      });
    }
    
    return result;
  });
  
  // Función para parsear descuentos
  const parseDiscount = (discount: string): number => {
    if (discount.includes('%')) {
      return parseInt(discount.replace(/[^0-9]/g, ''), 10);
    } else if (discount.includes('x')) {
      const parts = discount.split('x');
      return parseInt(parts[0], 10) * 50; // 2x1 equivale a 100%, 3x2 a 50%, etc.
    } else if (discount.toUpperCase().includes('GRATIS')) {
      return 100;
    }
    return 0;
  };
  
  // Funciones
  const setActiveFilter = (filterId: string) => {
    activeFilter.value = filterId;
  };
  
  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
      .then(() => {
        showCopyNotification.value = true;
        setTimeout(() => {
          showCopyNotification.value = false;
        }, 2000);
      })
      .catch(error => {
        console.error('Error al copiar el código: ', error);
      });
  };
  
  const loadMoreOffers = () => {
    // Simulación de carga de más ofertas
    // En una aplicación real, aquí se haría una llamada a la API
    setTimeout(() => {
      // Después de cargar todo, ya no hay más ofertas
      hasMoreOffers.value = false;
    }, 1000);
  };
  
  // Inicialización
  onMounted(() => {
    // Simulación de carga de datos
    // En una aplicación real, aquí se haría una llamada a la API
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
  $border-radius-sm: 8px;
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
  
  // Offers View
  .offers-view {
    min-height: 100vh;
    background-color: $light;
    padding-bottom: 60px;
  }
  
  // Offers Header
  .offers-header {
    background: $primary-gradient;
    color: white;
    padding: 6rem 0 8rem;
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
  
    &__content {
      position: relative;
      z-index: 5;
    }
  
    &__title {
      font-size: 3.5rem;
      font-weight: 800;
      margin-bottom: 1rem;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
      @media (max-width: 768px) {
        font-size: 2.5rem;
      }
  
      @media (max-width: 480px) {
        font-size: 2rem;
      }
    }
  
    &__subtitle {
    @media (max-width: 768px) {
      font-size: 1.1rem;
    }
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

// Filtros de ofertas
.offers-filters {
  background-color: $white;
  padding: 16px 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
  margin-top: -20px;

  &__wrapper {
    display: flex;
    overflow-x: auto;
    gap: 12px;
    padding: 4px 0;
    scrollbar-width: none;
    -ms-overflow-style: none;
    scroll-behavior: smooth;

    &::-webkit-scrollbar {
      display: none;
    }

    @media (max-width: 768px) {
      padding-bottom: 8px;
    }
  }
}

// Botón de filtro
.offers-filter-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 100px;
  border: 1px solid $border;
  background-color: $white;
  color: $text-light;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: $transition;
  white-space: nowrap;

  &__icon {
    display: flex;
    align-items: center;
    color: $text-light;
  }

  &:hover {
    background-color: $light;
    color: $text;
  }

  &--active {
    background-color: $primary;
    border-color: $primary;
    color: $white;

    .offers-filter-button__icon {
      color: $white;
    }

    &:hover {
      background-color: $primary;
      color: $white;
      transform: translateY(-2px);
    }
  }
}

// Ofertas destacadas
.featured-offers {
  padding: 40px 0;

  &__header {
    text-align: center;
    margin-bottom: 40px;
  }

  &__title {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 8px;

    @media (max-width: 768px) {
      font-size: 24px;
    }
  }

  &__subtitle {
    font-size: 16px;
    color: $text-light;

    @media (max-width: 768px) {
      font-size: 14px;
    }
  }

  &__carousel {
    position: relative;
    margin: 0 -8px;
    padding: 8px 0;
  }

  &__cards {
    display: flex;
    gap: 24px;
    overflow-x: auto;
    padding: 8px 8px 16px;
    scrollbar-width: none;
    -ms-overflow-style: none;
    scroll-behavior: smooth;

    &::-webkit-scrollbar {
      display: none;
    }
  }
}

// Tarjeta de oferta destacada
.featured-offer-card {
  flex: 0 0 auto;
  width: 400px;
  background-color: $white;
  border-radius: $border-radius;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: $transition;

  @media (max-width: 576px) {
    width: 300px;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }

  &__image {
    height: 200px;
    position: relative;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    &:hover img {
      transform: scale(1.05);
    }
  }

  &__discount {
    position: absolute;
    top: 16px;
    left: 16px;
    background-color: $primary;
    color: $white;
    font-weight: 700;
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 18px;
    box-shadow: 0 4px 8px rgba($primary, 0.3);
  }

  &__content {
    padding: 24px;
  }

  &__title {
    font-size: 20px;
    font-weight: 700;
    margin: 0 0 8px;
    color: $text;
  }

  &__description {
    font-size: 14px;
    color: $text-light;
    margin: 0 0 16px;
    line-height: 1.5;
  }

  &__restaurant {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 20px;
  }

  &__restaurant-logo {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
  }

  &__restaurant-name {
    font-weight: 600;
    font-size: 14px;
    color: $text;
  }

  &__footer {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__validity {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: $text-light;
  }

  &__button {
    background-color: $primary;
    color: $white;
    border: none;
    border-radius: 8px;
    padding: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: $transition;
    text-align: center;

    &:hover {
      background-color: #ff2952;
      transform: translateY(-2px);
    }
  }
}

// Ofertas lista
.offers-list {
  padding: 40px 0;
  background-color: $white;
  border-radius: $border-radius;
  margin-top: 40px;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }
  }

  &__title {
    font-size: 24px;
    font-weight: 700;
    margin: 0;

    @media (max-width: 768px) {
      font-size: 20px;
    }
  }

  &__sort {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__sort-label {
    font-size: 14px;
    color: $text-light;
  }
}

// Select wrapper
.select-wrapper {
  position: relative;
}

// Select control
.select-control {
  appearance: none;
  background-color: $white;
  border: 1px solid $border;
  border-radius: 8px;
  padding: 8px 32px 8px 12px;
  font-size: 14px;
  color: $text;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: $primary;
  }
}

// Select arrow
.select-arrow {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: $text-light;
}

// Offers grid
.offers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}

// Offer card
.offer-card {
  background-color: $white;
  border-radius: $border-radius;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  position: relative;
  transition: $transition;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }

  &__ribbon {
    position: absolute;
    top: 20px;
    right: -30px;
    transform: rotate(45deg);
    background-color: $accent;
    color: $white;
    font-weight: 700;
    padding: 4px 30px;
    font-size: 12px;
    text-transform: uppercase;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    z-index: 2;
  }

  &__image {
    height: 160px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    &:hover img {
      transform: scale(1.05);
    }
  }

  &__content {
    padding: 20px;
    position: relative;
  }

  &__discount {
    position: absolute;
    top: -20px;
    left: 20px;
    background-color: $primary;
    color: $white;
    font-weight: 700;
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 16px;
    box-shadow: 0 4px 8px rgba($primary, 0.3);
  }

  &__title {
    font-size: 18px;
    font-weight: 700;
    margin: 12px 0 8px;
    color: $text;
  }

  &__description {
    font-size: 14px;
    color: $text-light;
    margin: 0 0 16px;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__restaurant {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
  }

  &__restaurant-logo {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    object-fit: cover;
  }

  &__restaurant-name {
    font-weight: 600;
    font-size: 14px;
    color: $text;
  }

  &__code {
    display: flex;
    align-items: center;
    background-color: rgba($primary, 0.1);
    border-radius: 8px;
    padding: 8px 12px;
    margin-bottom: 12px;
    gap: 8px;
  }

  &__code-label {
    font-size: 12px;
    color: $text-light;
  }

  &__code-value {
    font-weight: 700;
    font-size: 14px;
    color: $primary;
    letter-spacing: 0.5px;
    flex: 1;
  }

  &__code-copy {
    background: none;
    border: none;
    padding: 0;
    color: $text-light;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: $transition;

    &:hover {
      color: $primary;
    }
  }

  &__validity {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: $text-light;
    margin-bottom: 16px;
  }

  &__button {
    display: block;
    width: 100%;
    background-color: $primary;
    color: $white;
    border: none;
    border-radius: 8px;
    padding: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: $transition;
    text-align: center;
    text-decoration: none;

    &:hover {
      background-color: #ff2952;
      transform: translateY(-2px);
    }
  }
}

// Load more
.load-more {
  text-align: center;
  margin-top: 40px;

  &__button {
    background-color: transparent;
    border: 1px solid $border;
    color: $text;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: $transition;

    &:hover {
      background-color: $light;
    }

    svg {
      transition: transform 0.3s ease;
    }

    &:hover svg {
      transform: translateY(3px);
    }
  }
}

// Signup banner
.signup-banner {
  margin-top: 60px;
  padding: 60px 0;
  background: $primary-gradient;
  border-radius: $border-radius;

  &__content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: $white;

    @media (max-width: 768px) {
      flex-direction: column;
      text-align: center;
      gap: 24px;
    }
  }

  &__text {
    max-width: 600px;
  }

  &__title {
    font-size: 28px;
    font-weight: 700;
    margin: 0 0 8px;

    @media (max-width: 768px) {
      font-size: 24px;
    }
  }

  &__description {
    font-size: 16px;
    opacity: 0.9;
    margin: 0;

    @media (max-width: 768px) {
      font-size: 14px;
    }
  }

  &__button {
    background-color: $white;
    color: $primary;
    font-weight: 700;
    padding: 12px 24px;
    border-radius: 50px;
    text-decoration: none;
    transition: $transition;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    }
  }
}

// Copy notification
.copy-notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: rgba($dark, 0.9);
  color: $white;
  padding: 12px 20px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  animation: fadeInOut 2s ease-in-out;
}

// Animaciones
@keyframes fadeInOut {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  20% {
    opacity: 1;
    transform: translateY(0);
  }
  80% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(20px);
  }
}
</style>