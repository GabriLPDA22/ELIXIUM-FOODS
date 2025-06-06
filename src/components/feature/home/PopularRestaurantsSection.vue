<!-- components/feature/home/PopularRestaurantsSection.vue -->
<template>
  <section class="popular-restaurants">
    <div class="container">
      <div class="popular-restaurants__heading">
        <div>
          <h2 class="popular-restaurants__title">Restaurantes Populares</h2>
          <p class="popular-restaurants__description">Descubre los lugares favoritos de nuestra comunidad</p>
        </div>
        <router-link to="/restaurants" class="popular-restaurants__all-link">
          <span>Ver todos</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </router-link>
      </div>

      <div v-if="loading" class="popular-restaurants__loading">
        <div class="loading-spinner"></div>
        <p>Cargando restaurantes populares...</p>
      </div>

      <div v-else-if="error" class="popular-restaurants__error">
        <div class="popular-restaurants__error-icon">⚠️</div>
        <h3>Error al cargar restaurantes</h3>
        <p>{{ error }}</p>
        <button @click="fetchPopularRestaurants" class="retry-button">Intentar de nuevo</button>
      </div>

      <div v-else-if="restaurants.length === 0" class="popular-restaurants__empty">
        <div class="popular-restaurants__empty-icon">🍽️</div>
        <h3>No hay restaurantes disponibles</h3>
        <p>No se encontraron restaurantes populares en este momento.</p>
      </div>

      <!-- AQUÍ SÍ USO EL COMPONENTE RestaurantCard -->
      <div v-else class="restaurant-grid">
        <RestaurantCard v-for="restaurant in restaurants" :key="restaurant.id" :restaurant="restaurant" />
      </div>

      <div v-if="!loading && restaurants.length > 0" class="popular-restaurants__cta">
        <div class="cta-card">
          <div class="cta-card__content">
            <h3 class="cta-card__title">¿Tienes hambre?</h3>
            <p class="cta-card__text">Descubre más restaurantes y encuentra tu nueva comida favorita</p>
            <router-link to="/restaurants" class="cta-card__button">
              Explorar todos los restaurantes
            </router-link>
          </div>
          <div class="cta-card__decoration">
            <div class="cta-card__circle"></div>
            <div class="cta-card__circle"></div>
            <div class="cta-card__circle"></div>
            <span class="cta-card__emoji">🍽️</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '@/services/api'
import RestaurantCard from '@/components/feature/restaurant/RestaurantCard.vue'

// Estado
const loading = ref(true)
const error = ref<string | null>(null)
const restaurants = ref([])

// Simulación de estado para testing (hasta que tengas el backend listo)
const simulateRestaurantStatus = (restaurant: any) => {
  // Simular algunos restaurantes cerrados aleatoriamente
  const isClosed = Math.random() > 0.7 // 30% de probabilidad de estar cerrado
  const now = new Date()
  const hour = now.getHours()

  return {
    ...restaurant,
    isCurrentlyOpen: !isClosed && hour >= 11 && hour <= 23,
    isOpen: !isClosed && hour >= 11 && hour <= 23, // Backup
    statusMessage: isClosed || hour < 11 || hour > 23
      ? (hour < 11 ? 'Abre a las 11:00' : hour > 23 ? 'Abre mañana' : 'Cerrado temporalmente')
      : 'Abierto ahora',
    // Asegurar valores por defecto
    averageRating: restaurant.averageRating || (4.2 + Math.random() * 0.8),
    reviewCount: restaurant.reviewCount || Math.floor(Math.random() * 200) + 50,
    estimatedDeliveryTime: restaurant.estimatedDeliveryTime || (20 + Math.floor(Math.random() * 20)),
    deliveryFee: restaurant.deliveryFee ?? (Math.random() > 0.3 ? 0 : 2.99 + Math.random() * 2),
    distance: restaurant.distance || (0.8 + Math.random() * 2.5),
    // Simular características especiales
    featured: Math.random() > 0.8, // 20% destacados
    isNew: Math.random() > 0.9, // 10% nuevos
    promoText: Math.random() > 0.85 ? '20% OFF primer pedido' : null,
    // Ensure image URLs
    coverImageUrl: restaurant.coverImageUrl || restaurant.logoUrl || '/placeholder-restaurant.jpg',
    logoUrl: restaurant.logoUrl || restaurant.coverImageUrl || '/placeholder-restaurant.jpg'
  }
}

const generatePlaceholderImage = (restaurantName: string): string => {
  // Generar una imagen placeholder consistente
  const colors = ['FF6B6B', '4ECDC4', '45B7D1', 'FFA07A', '98D8C8', 'F7DC6F', 'BB8FCE']
  const colorIndex = restaurantName.length % colors.length
  const color = colors[colorIndex]
  const encodedName = encodeURIComponent(restaurantName.substring(0, 2).toUpperCase())

  return `https://via.placeholder.com/400x300/${color}/FFFFFF?text=${encodedName}`
}

// Cargar solo restaurantes populares limitados (EFICIENTE)
const fetchPopularRestaurants = async () => {
  loading.value = true
  error.value = null

  try {

    // Llamar al endpoint específico de populares con límite
    const response = await api.get('/api/Restaurants/popular', {
      params: {
        limit: 6, // Solo cargar 6 restaurantes
        includeStatus: true // Incluir información de estado
      }
    })

    if (response.data && Array.isArray(response.data)) {
      // Procesar cada restaurante con simulación de estado
      restaurants.value = response.data.map(restaurant => simulateRestaurantStatus(restaurant))
    } else {
      throw new Error('Respuesta inválida del servidor')
    }
  } catch (err: any) {
    console.error('❌ Error al cargar restaurantes populares:', err)
    error.value = err.response?.data?.message || err.message || 'Error al cargar restaurantes'
    restaurants.value = []
  } finally {
    loading.value = false
  }
}

// Inicialización
onMounted(() => {
  fetchPopularRestaurants()
})
</script>

<style lang="scss" scoped>
.popular-restaurants {
  padding: 5rem 0;
  background-color: #ffffff;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    background: radial-gradient(at top left, rgba(#FFA502, 0.05), transparent 60%);
    pointer-events: none;
    z-index: 0;
  }

  .container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
    position: relative;
    z-index: 1;
  }

  &__heading {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 3rem;

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 1rem;
    }
  }

  &__title {
    font-size: 2.75rem;
    font-weight: 800;
    margin-bottom: 1rem;
    background: linear-gradient(to right, #FFA502, #FF6B2B);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    display: inline-block;
    position: relative;

    @media (max-width: 768px) {
      font-size: 2.25rem;
    }
  }

  &__description {
    color: #64748b;
    font-size: 1.2rem;
    max-width: 550px;

    @media (max-width: 768px) {
      font-size: 1.1rem;
    }
  }

  &__loading {
    text-align: center;
    padding: 4rem 0;

    .loading-spinner {
      width: 50px;
      height: 50px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #FFA502;
      border-radius: 50%;
      margin: 0 auto 1rem;
      animation: spin 1s linear infinite;
    }

    p {
      color: #64748b;
      font-size: 1.1rem;
      font-weight: 500;
    }
  }

  &__error {
    text-align: center;
    padding: 4rem 0;

    &-icon {
      font-size: 4rem;
      margin-bottom: 1.5rem;
    }

    h3 {
      color: #1e293b;
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0 0 0.5rem;
    }

    p {
      color: #64748b;
      font-size: 1.1rem;
      margin: 0 0 1.5rem;
    }

    .retry-button {
      background: #FFA502;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: #FF6B2B;
        transform: translateY(-2px);
      }
    }
  }

  &__empty {
    text-align: center;
    padding: 4rem 0;

    &-icon {
      font-size: 4rem;
      margin-bottom: 1.5rem;
      opacity: 0.5;
    }

    h3 {
      color: #1e293b;
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0 0 0.5rem;
    }

    p {
      color: #64748b;
      font-size: 1.1rem;
      margin: 0;
    }
  }

  &__all-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #0652DD;
    text-decoration: none;
    font-weight: 600;
    font-size: 1.1rem;
    transition: all 0.3s ease;
    padding: 0.5rem 0;
    border-bottom: 2px solid transparent;

    svg {
      transition: transform 0.3s ease;
    }

    &:hover {
      color: #FF416C;
      border-bottom-color: #FF416C;

      svg {
        transform: translateX(4px);
      }
    }
  }

  &__cta {
    margin-top: 4rem;
  }
}

// Grid optimizado para 6 restaurantes
.restaurant-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  max-width: 1200px; // Limitar ancho para mejor distribución con 6 elementos
  margin: 0 auto;

  @media (min-width: 1400px) {
    grid-template-columns: repeat(3, 1fr); // 3 columnas en pantallas grandes
  }

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr); // 2 columnas en tablets
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr; // 1 columna en móvil
    gap: 1.5rem;
  }
}

// CTA Card
.cta-card {
  background: linear-gradient(135deg, #0652DD, #12CBC4);
  color: white;
  border-radius: 20px;
  overflow: hidden;
  padding: 3rem;
  display: flex;
  justify-content: space-between;
  position: relative;
  box-shadow: 0 20px 40px rgba(#0652DD, 0.15);

  @media (max-width: 768px) {
    padding: 2rem;
  }

  &__content {
    max-width: 60%;
    position: relative;
    z-index: 2;

    @media (max-width: 768px) {
      max-width: 100%;
    }
  }

  &__title {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 1rem;

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  &__text {
    font-size: 1.2rem;
    opacity: 0.9;
    margin-bottom: 2rem;
    line-height: 1.6;

    @media (max-width: 768px) {
      font-size: 1.1rem;
    }
  }

  &__button {
    display: inline-block;
    background: white;
    color: #0652DD;
    text-decoration: none;
    padding: 1rem 2rem;
    border-radius: 50px;
    font-weight: 600;
    font-size: 1.1rem;
    transition: all 0.3s ease;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
      background: #f8f9fa;
    }
  }

  &__decoration {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 40%;
    overflow: hidden;

    @media (max-width: 768px) {
      opacity: 0.2;
      width: 100%;
    }
  }

  &__circle {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);

    &:nth-child(1) {
      width: 200px;
      height: 200px;
      top: -50px;
      right: -50px;
    }

    &:nth-child(2) {
      width: 150px;
      height: 150px;
      bottom: 0;
      right: 100px;
    }

    &:nth-child(3) {
      width: 100px;
      height: 100px;
      top: 50%;
      right: 50px;
      transform: translateY(-50%);
    }
  }

  &__emoji {
    position: absolute;
    font-size: 80px;
    top: 50%;
    right: 150px;
    transform: translateY(-50%);
    filter: drop-shadow(0 5px 15px rgba(0, 0, 0, 0.2));

    @media (max-width: 992px) {
      right: 50px;
    }
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .popular-restaurants {
    padding: 5rem 0;

    .container {
      padding: 0 1.5rem;
    }
  }
}
</style>
