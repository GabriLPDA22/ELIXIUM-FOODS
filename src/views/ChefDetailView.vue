<!-- views/ChefDetailView.vue -->
<template>
  <div class="chef-detail-view" v-if="chef">
    <!-- Hero Section del Chef -->
    <section class="chef-hero">
      <div class="chef-hero__container">
        <div class="chef-hero__content">
          <div class="chef-hero__image-container">
            <img :src="chef.imageUrl" :alt="chef.name" class="chef-hero__image" />
            <div class="chef-hero__rating">
              <div class="rating-stars">
                <span class="stars">⭐⭐⭐⭐⭐</span>
                <span class="rating-value">{{ chef.rating }}</span>
              </div>
              <div class="rating-reviews">{{ chef.totalReviews }} reseñas</div>
            </div>
          </div>

          <div class="chef-hero__info">
            <h1 class="chef-hero__name">{{ chef.name }}</h1>
            <p class="chef-hero__specialty">{{ chef.specialty }}</p>
            <div class="chef-hero__meta">
              <div class="meta-item">
                <span class="meta-item__icon">👨‍🍳</span>
                <span class="meta-item__text">{{ chef.experience }} de experiencia</span>
              </div>
              <div class="meta-item">
                <span class="meta-item__icon">📍</span>
                <span class="meta-item__text">{{ chef.location }}</span>
              </div>
            </div>

            <!-- Social Links -->
            <div class="chef-hero__social" v-if="chef.social">
              <h3 class="social-title">Síguelo en:</h3>
              <div class="social-links">
                <a
                  v-if="chef.social.instagram"
                  :href="`https://instagram.com/${chef.social.instagram.replace('@', '')}`"
                  class="social-link social-link--instagram"
                  target="_blank"
                >
                  <span class="social-icon">📷</span>
                  <span class="social-text">{{ chef.social.instagram }}</span>
                </a>
                <a
                  v-if="chef.social.tiktok"
                  :href="`https://tiktok.com/${chef.social.tiktok.replace('@', '')}`"
                  class="social-link social-link--tiktok"
                  target="_blank"
                >
                  <span class="social-icon">🎵</span>
                  <span class="social-text">{{ chef.social.tiktok }}</span>
                </a>
                <a
                  v-if="chef.social.youtube"
                  :href="`https://youtube.com/@${chef.social.youtube}`"
                  class="social-link social-link--youtube"
                  target="_blank"
                >
                  <span class="social-icon">📺</span>
                  <span class="social-text">{{ chef.social.youtube }}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Bio Section -->
    <section class="chef-bio">
      <div class="chef-bio__container">
        <h2 class="section-title">
          <span class="section-title__icon">📖</span>
          Sobre {{ chef.name.split(' ')[1] }}
        </h2>
        <div class="bio-content">
          <p class="bio-text">{{ chef.bio }}</p>
        </div>
      </div>
    </section>

    <!-- Platos Signature -->
    <section class="signature-dishes">
      <div class="signature-dishes__container">
        <h2 class="section-title">
          <span class="section-title__icon">🍽️</span>
          Platos Signature
        </h2>
        <div class="dishes-grid">
          <div
            v-for="(dish, index) in chef.signature_dishes"
            :key="index"
            class="dish-card"
          >
            <div class="dish-card__icon">{{ getDishIcon(dish) }}</div>
            <h3 class="dish-card__name">{{ dish }}</h3>
            <p class="dish-card__description">
              {{ getDishDescription(dish) }}
            </p>
            <div class="dish-card__badge">Signature</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Logros y Reconocimientos -->
    <section class="achievements" v-if="chef.achievements.length > 0">
      <div class="achievements__container">
        <h2 class="section-title">
          <span class="section-title__icon">🏆</span>
          Logros y Reconocimientos
        </h2>
        <div class="achievements-grid">
          <div
            v-for="(achievement, index) in chef.achievements"
            :key="index"
            class="achievement-card"
          >
            <div class="achievement-card__icon">{{ getAchievementIcon(achievement) }}</div>
            <h3 class="achievement-card__title">{{ achievement }}</h3>
            <div class="achievement-card__year">{{ getAchievementYear(achievement) }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Restaurantes Afiliados -->
    <section class="restaurants" v-if="chef.restaurant_affiliations.length > 0">
      <div class="restaurants__container">
        <h2 class="section-title">
          <span class="section-title__icon">🏪</span>
          Dónde Encontrar Su Cocina
        </h2>
        <div class="restaurants-grid">
          <div
            v-for="(restaurant, index) in chef.restaurant_affiliations"
            :key="index"
            class="restaurant-card"
            @click="searchRestaurant(restaurant)"
          >
            <div class="restaurant-card__icon">🍽️</div>
            <h3 class="restaurant-card__name">{{ restaurant }}</h3>
            <p class="restaurant-card__description">
              Experimenta la magia culinaria de {{ chef.name.split(' ')[1] }} en este increíble restaurante
            </p>
            <div class="restaurant-card__action">
              <span class="action-text">Ver en App</span>
              <span class="action-arrow">→</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="chef-cta">
      <div class="chef-cta__container">
        <div class="cta-content">
          <h2 class="cta-title">¿Te ha gustado conocer a {{ chef.name.split(' ')[1] }}?</h2>
          <p class="cta-subtitle">
            Descubre los platos de {{ chef.name.split(' ')[1] }} y otros increíbles chefs en nuestra app
          </p>
          <div class="cta-buttons">
            <SpectacularButton
              text="Ver Restaurantes"
              variant="primary"
              size="large"
              icon="🍽️"
              @click="goToRestaurants"
            />
            <SpectacularButton
              text="Ver Más Chefs"
              variant="chefs"
              size="large"
              icon="👨‍🍳"
              @click="goToChefs"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Navegación entre chefs -->
    <section class="chef-navigation" v-if="otherChefs.length > 0">
      <div class="chef-navigation__container">
        <h3 class="navigation-title">Otros Chefs Increíbles</h3>
        <div class="chefs-carousel">
          <div
            v-for="otherChef in otherChefs"
            :key="otherChef.id"
            class="mini-chef-card"
            @click="navigateToChef(otherChef.slug)"
          >
            <img :src="otherChef.imageUrl" :alt="otherChef.name" class="mini-chef-card__image" />
            <div class="mini-chef-card__content">
              <h4 class="mini-chef-card__name">{{ otherChef.name }}</h4>
              <p class="mini-chef-card__specialty">{{ otherChef.specialty }}</p>
              <div class="mini-chef-card__rating">
                <span class="stars">⭐</span>
                <span class="rating">{{ otherChef.rating }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>

  <!-- Loading o Error States -->
  <div v-else class="chef-not-found">
    <div class="not-found-content">
      <div class="not-found-icon">😔</div>
      <h2>Chef no encontrado</h2>
      <p>Lo sentimos, no pudimos encontrar información sobre este chef.</p>
      <SpectacularButton
        text="Ver Todos los Chefs"
        variant="primary"
        @click="goToChefs"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { chefsData, type Chef } from '@/data/chefsData'
import SpectacularButton from '@/components/common/SpectacularButton.vue'

const route = useRoute()
const router = useRouter()

// Estados reactivos
const chef = ref<Chef | null>(null)

// Computed properties
const otherChefs = computed(() => {
  return chefsData
    .filter(c => c.id !== chef.value?.id)
    .slice(0, 4)
})

// Métodos
const loadChef = () => {
  const chefSlug = route.params.slug as string
  const foundChef = chefsData.find(c => c.slug === chefSlug)
  chef.value = foundChef || null
}

const getDishIcon = (dish: string): string => {
  const icons: Record<string, string> = {
    'paella': '🥘',
    'gazpacho': '🍅',
    'arroz': '🍚',
    'tarta': '🍰',
    'nigiri': '🍣',
    'ramen': '🍜',
    'tempura': '🍤',
    'mochi': '🍡',
    'chocolate': '🍫',
    'macarons': '🧁',
    'croissant': '🥐',
    'torrija': '🍞',
    'ceviche': '🐟',
    'risotto': '🍚',
    'burger': '🍔',
    'cheesecake': '🍰'
  }

  for (const [key, icon] of Object.entries(icons)) {
    if (dish.toLowerCase().includes(key)) {
      return icon
    }
  }
  return '🍽️'
}

const getDishDescription = (dish: string): string => {
  const descriptions: Record<string, string> = {
    'Paella de Mariscos Deconstruida': 'Una reinterpretación moderna del clásico valenciano con técnicas vanguardistas',
    'Gazpacho de Remolacha con Caviar de Aceitunas': 'Refrescante y elegante, perfecto para el verano mediterráneo',
    'Arroz Meloso de Bogavante y Azafrán': 'La esencia del mar en cada grano de arroz',
    'Tarta de Limón con Merengue de Albahaca': 'Un postre que despierta todos los sentidos',
    'Nigiri de Atún Rojo con Tomate Confitado': 'Fusión perfecta entre Japón y el Mediterráneo',
    'Ramen de Jamón Ibérico y Miso': 'Tradición japonesa con sabores ibéricos',
    'Tempura de Verduras de Temporada': 'Ligereza y sabor en cada bocado',
    'Mochi de Manchego y Membrillo': 'Dulce encuentro entre culturas'
  }

  return descriptions[dish] || 'Una creación única que refleja la maestría culinaria'
}

const getAchievementIcon = (achievement: string): string => {
  if (achievement.includes('Michelin')) return '⭐'
  if (achievement.includes('Chef')) return '👨‍🍳'
  if (achievement.includes('Mejor')) return '🏆'
  if (achievement.includes('libro') || achievement.includes('Autora')) return '📚'
  if (achievement.includes('Medalla')) return '🥇'
  if (achievement.includes('Premio')) return '🏅'
  if (achievement.includes('Sol Repsol')) return '☀️'
  if (achievement.includes('Champion')) return '🏆'
  return '🏆'
}

const getAchievementYear = (achievement: string): string => {
  const yearMatch = achievement.match(/\b(19|20)\d{2}\b/)
  return yearMatch ? yearMatch[0] : ''
}

const navigateToChef = (slug: string) => {
  router.push(`/chefs/${slug}`)
}

const searchRestaurant = (restaurantName: string) => {
  // Aquí implementarías la búsqueda del restaurante
  router.push(`/search?q=${encodeURIComponent(restaurantName)}`)
}

const goToRestaurants = () => {
  router.push('/restaurants')
}

const goToChefs = () => {
  router.push('/chefs')
}

// Lifecycle
onMounted(() => {
  loadChef()
})

// Watch route changes para manejar navegación entre chefs
import { watch } from 'vue'
watch(() => route.params.slug, () => {
  loadChef()
})
</script>

<style lang="scss" scoped>
.chef-detail-view {
  min-height: 100vh;
}

.chef-hero {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  padding: 8rem 2rem 4rem;
  color: white;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 200px),
      radial-gradient(circle at 80% 60%, rgba(255, 255, 255, 0.1) 0%, transparent 200px);
    z-index: 0;
  }

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
    z-index: 2;
  }

  &__content {
    display: grid;
    grid-template-columns: 1fr;
    gap: 3rem;
    align-items: center;

    @media (min-width: 992px) {
      grid-template-columns: auto 1fr;
      gap: 4rem;
    }
  }

  &__image-container {
    position: relative;
    text-align: center;
  }

  &__image {
    width: 250px;
    height: 250px;
    border-radius: 50%;
    object-fit: cover;
    border: 6px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);

    @media (min-width: 768px) {
      width: 300px;
      height: 300px;
    }
  }

  &__rating {
    position: absolute;
    bottom: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.7);
    border-radius: 20px;
    padding: 0.75rem 1rem;
    backdrop-filter: blur(10px);
    text-align: center;
  }

  &__info {
    text-align: center;

    @media (min-width: 992px) {
      text-align: left;
    }
  }

  &__name {
    font-size: 3rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
    line-height: 1.1;

    @media (min-width: 768px) {
      font-size: 3.5rem;
    }
  }

  &__specialty {
    font-size: 1.5rem;
    font-weight: 600;
    color: #FFC837;
    margin-bottom: 2rem;
  }

  &__meta {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 2rem;

    @media (min-width: 768px) {
      flex-direction: row;
      gap: 2rem;
    }
  }

  &__social {
    margin-top: 2rem;
  }
}

.rating-stars {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;

  .stars {
    color: #FFC837;
    font-size: 0.9rem;
  }

  .rating-value {
    font-weight: 700;
    font-size: 1.1rem;
  }
}

.rating-reviews {
  font-size: 0.8rem;
  opacity: 0.8;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &__icon {
    font-size: 1.2rem;
  }

  &__text {
    font-size: 1rem;
    opacity: 0.9;
  }
}

.social-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.social-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.social-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-2px);
  }

  .social-icon {
    font-size: 1.1rem;
  }

  .social-text {
    font-weight: 600;
    font-size: 0.9rem;
  }
}

.chef-bio,
.signature-dishes,
.achievements,
.restaurants {
  padding: 4rem 2rem;

  &:nth-child(even) {
    background: #f8f9fa;
  }

  &__container {
    max-width: 1200px;
    margin: 0 auto;
  }
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 2rem;

  &__icon {
    font-size: 1.5rem;
  }
}

.bio-content {
  max-width: 800px;
}

.bio-text {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #4a5568;
  text-align: justify;
}

.dishes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.dish-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  text-align: center;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }

  &__icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  &__name {
    font-size: 1.3rem;
    font-weight: 700;
    color: #2d3748;
    margin-bottom: 1rem;
  }

  &__description {
    color: #718096;
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  &__badge {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: linear-gradient(135deg, #f093fb, #f5576c);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
  }
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.achievement-card {
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  text-align: center;
  border-left: 4px solid #f093fb;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
  }

  &__icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  &__title {
    font-size: 1rem;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 0.5rem;
    line-height: 1.4;
  }

  &__year {
    color: #f093fb;
    font-weight: 700;
    font-size: 1.1rem;
  }
}

.restaurants-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.restaurant-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  text-align: center;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }

  &__icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  &__name {
    font-size: 1.5rem;
    font-weight: 700;
    color: #2d3748;
    margin-bottom: 1rem;
  }

  &__description {
    color: #718096;
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }

  &__action {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    color: #f093fb;
    font-weight: 600;
  }
}

.chef-cta {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  padding: 4rem 2rem;
  text-align: center;
  color: white;

  &__container {
    max-width: 800px;
    margin: 0 auto;
  }
}

.cta-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.cta-subtitle {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  line-height: 1.6;
}

.cta-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

.chef-navigation {
  padding: 3rem 2rem;
  background: #f8f9fa;

  &__container {
    max-width: 1200px;
    margin: 0 auto;
  }
}

.navigation-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 2rem;
  text-align: center;
}

.chefs-carousel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.mini-chef-card {
  background: white;
  border-radius: 15px;
  padding: 1rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  text-align: center;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
  }

  &__image {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    margin: 0 auto 1rem;
  }

  &__name {
    font-size: 1rem;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 0.25rem;
  }

  &__specialty {
    font-size: 0.8rem;
    color: #718096;
    margin-bottom: 0.5rem;
  }

  &__rating {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    font-size: 0.8rem;
    color: #4a5568;
  }
}

.chef-not-found {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.not-found-content {
  text-align: center;
  max-width: 400px;

  .not-found-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  h2 {
    font-size: 2rem;
    font-weight: 700;
    color: #2d3748;
    margin-bottom: 1rem;
  }

  p {
    color: #718096;
    margin-bottom: 2rem;
    line-height: 1.6;
  }
}

@media (max-width: 768px) {
  .chef-hero {
    padding: 6rem 1rem 3rem;

    &__name {
      font-size: 2.5rem;
    }

    &__specialty {
      font-size: 1.2rem;
    }

    &__meta {
      align-items: center;
    }
  }

  .dishes-grid {
    grid-template-columns: 1fr;
  }

  .achievements-grid {
    grid-template-columns: 1fr;
  }

  .restaurants-grid {
    grid-template-columns: 1fr;
  }

  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }

  .chefs-carousel {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
