<!-- views/ChefsView.vue -->
<template>
  <div class="chefs-view">
    <!-- Hero Section -->
    <section class="chefs-hero">
      <div class="chefs-hero__container">
        <div class="chefs-hero__content">
          <h1 class="chefs-hero__title">
            Conoce a Nuestros <span class="chefs-hero__title-highlight">Chefs</span>
          </h1>
          <p class="chefs-hero__subtitle">
            Los mejores profesionales culinarios de Zaragoza unidos para ofrecerte experiencias gastronómicas únicas
          </p>

          <!-- Filtros de categorías -->
          <div class="chefs-hero__filters">
            <button
              v-for="category in chefCategories"
              :key="category.id"
              :class="['filter-btn', { 'filter-btn--active': activeFilter === category.id }]"
              @click="setActiveFilter(category.id)"
            >
              <span class="filter-btn__icon">{{ category.icon }}</span>
              <span class="filter-btn__text">{{ category.name }}</span>
            </button>
          </div>
        </div>

        <div class="chefs-hero__visual">
          <div class="chefs-hero__floating-elements">
            <div class="floating-element floating-element--1">👨‍🍳</div>
            <div class="floating-element floating-element--2">🍽️</div>
            <div class="floating-element floating-element--3">⭐</div>
            <div class="floating-element floating-element--4">🔥</div>
            <div class="floating-element floating-element--5">🥘</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Chefs Grid -->
    <section class="chefs-grid">
      <div class="chefs-grid__container">
        <!-- Chefs Destacados -->
        <div class="featured-chefs" v-if="featuredChefs.length > 0">
          <h2 class="section-title">
            <span class="section-title__icon">⭐</span>
            Chefs Destacados
          </h2>

          <div class="featured-chefs__grid">
            <div
              v-for="chef in featuredChefs"
              :key="chef.id"
              class="chef-card chef-card--featured"
              @click="navigateToChef(chef.slug)"
            >
              <div class="chef-card__image-container">
                <img :src="chef.imageUrl" :alt="chef.name" class="chef-card__image" />
                <div class="chef-card__badge">Destacado</div>
                <div class="chef-card__rating">
                  <span class="chef-card__stars">⭐</span>
                  <span class="chef-card__rating-value">{{ chef.rating }}</span>
                  <span class="chef-card__reviews">({{ chef.totalReviews }})</span>
                </div>
              </div>

              <div class="chef-card__content">
                <h3 class="chef-card__name">{{ chef.name }}</h3>
                <p class="chef-card__specialty">{{ chef.specialty }}</p>
                <p class="chef-card__experience">{{ chef.experience }} de experiencia</p>
                <p class="chef-card__location">📍 {{ chef.location }}</p>

                <div class="chef-card__signature-dishes">
                  <h4 class="chef-card__dishes-title">Platos Signature:</h4>
                  <div class="chef-card__dishes-list">
                    <span
                      v-for="(dish, index) in chef.signature_dishes.slice(0, 2)"
                      :key="index"
                      class="chef-card__dish"
                    >
                      {{ dish }}
                    </span>
                  </div>
                </div>

                <div class="chef-card__social" v-if="chef.social">
                  <a
                    v-if="chef.social.instagram"
                    :href="`https://instagram.com/${chef.social.instagram.replace('@', '')}`"
                    class="chef-card__social-link"
                    target="_blank"
                  >
                    📷
                  </a>
                  <a
                    v-if="chef.social.tiktok"
                    :href="`https://tiktok.com/${chef.social.tiktok.replace('@', '')}`"
                    class="chef-card__social-link"
                    target="_blank"
                  >
                    🎵
                  </a>
                  <a
                    v-if="chef.social.youtube"
                    :href="`https://youtube.com/@${chef.social.youtube}`"
                    class="chef-card__social-link"
                    target="_blank"
                  >
                    📺
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Todos los Chefs -->
        <div class="all-chefs">
          <h2 class="section-title">
            <span class="section-title__icon">👨‍🍳</span>
            {{ activeFilterName === 'Todos' ? 'Todos los Chefs' : activeFilterName }}
          </h2>

          <div class="all-chefs__grid">
            <div
              v-for="chef in filteredChefs"
              :key="chef.id"
              class="chef-card"
              @click="navigateToChef(chef.slug)"
            >
              <div class="chef-card__image-container">
                <img :src="chef.imageUrl" :alt="chef.name" class="chef-card__image" />
                <div class="chef-card__rating">
                  <span class="chef-card__stars">⭐</span>
                  <span class="chef-card__rating-value">{{ chef.rating }}</span>
                  <span class="chef-card__reviews">({{ chef.totalReviews }})</span>
                </div>
              </div>

              <div class="chef-card__content">
                <h3 class="chef-card__name">{{ chef.name }}</h3>
                <p class="chef-card__specialty">{{ chef.specialty }}</p>
                <p class="chef-card__experience">{{ chef.experience }} de experiencia</p>
                <p class="chef-card__location">📍 {{ chef.location }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="chefs-cta">
      <div class="chefs-cta__container">
        <h2 class="chefs-cta__title">¿Eres Chef Profesional?</h2>
        <p class="chefs-cta__subtitle">
          Únete a nuestra comunidad de chefs y lleva tu talento culinario a miles de hogares en Zaragoza
        </p>
        <SpectacularButton
          text="Únete Como Chef"
          variant="chefs"
          size="large"
          icon="👨‍🍳"
          @click="navigateToChefSignup"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { chefsData, chefCategories, type Chef } from '@/data/chefsData'
import SpectacularButton from '@/components/common/SpectacularButton.vue'

const router = useRouter()

// Estados reactivos
const activeFilter = ref('todos')

// Computed properties
const featuredChefs = computed(() =>
  chefsData.filter(chef => chef.featured)
)

const filteredChefs = computed(() => {
  if (activeFilter.value === 'todos') {
    return chefsData.filter(chef => !chef.featured)
  }

  return chefsData.filter(chef => !chef.featured)
})

const activeFilterName = computed(() => {
  if (activeFilter.value === 'todos') return 'Todos'
  const category = chefCategories.find(cat => cat.id === activeFilter.value)
  return category?.name || 'Todos'
})

// Métodos
const setActiveFilter = (filterId: string) => {
  activeFilter.value = filterId
}

const navigateToChef = (slug: string) => {
  router.push(`/chefs/${slug}`)
}

const navigateToChefSignup = () => {
  router.push('/chef-signup')
}

// Agregar categoría "todos" al principio
const allCategories = computed(() => [
  { id: 'todos', name: 'Todos', icon: '👨‍🍳', description: 'Todos nuestros chefs' },
  ...chefCategories
])
</script>

<style lang="scss" scoped>
.chefs-view {
  min-height: 100vh;
}

.chefs-hero {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  padding: 8rem 2rem 6rem;
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
    max-width: 1400px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr;
    gap: 3rem;
    position: relative;
    z-index: 2;

    @media (min-width: 992px) {
      grid-template-columns: 1fr 1fr;
      align-items: center;
    }
  }

  &__content {
    text-align: center;

    @media (min-width: 992px) {
      text-align: left;
    }
  }

  &__title {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 1rem;
    line-height: 1.1;

    @media (min-width: 768px) {
      font-size: 3rem;
    }

    @media (min-width: 992px) {
      font-size: 3.5rem;
    }

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
        opacity: 0.7;
      }
    }
  }

  &__subtitle {
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 2rem;
    line-height: 1.6;
    max-width: 500px;

    @media (min-width: 992px) {
      margin: 0 0 2rem 0;
    }
  }

  &__filters {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    justify-content: center;

    @media (min-width: 992px) {
      justify-content: flex-start;
    }
  }

  &__visual {
    position: relative;
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__floating-elements {
    position: relative;
    width: 100%;
    height: 100%;
  }
}

.floating-element {
  position: absolute;
  font-size: 2rem;
  opacity: 0.3;
  animation: float 6s ease-in-out infinite;

  &--1 { top: 20%; left: 10%; animation-delay: 0s; }
  &--2 { top: 60%; left: 80%; animation-delay: 1s; }
  &--3 { top: 10%; left: 70%; animation-delay: 2s; }
  &--4 { top: 80%; left: 20%; animation-delay: 3s; }
  &--5 { top: 40%; left: 50%; animation-delay: 4s; }
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover, &--active {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.4);
    transform: translateY(-2px);
  }

  &__icon {
    font-size: 1.1rem;
  }

  &__text {
    font-weight: 600;
    font-size: 0.9rem;
    white-space: nowrap;
  }
}

.chefs-grid {
  padding: 4rem 2rem;
  background: #f8f9fa;

  &__container {
    max-width: 1400px;
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

.featured-chefs {
  margin-bottom: 4rem;

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 2rem;
  }
}

.all-chefs {
  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }
}

.chef-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }

  &--featured {
    border: 2px solid #f093fb;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: linear-gradient(45deg, #f093fb, #f5576c, #4facfe);
      border-radius: 22px;
      z-index: -1;
      animation: gradient-border 3s ease infinite;
    }

    .chef-card__image-container {
      height: 280px;
    }
  }

  &__image-container {
    position: relative;
    height: 240px;
    overflow: hidden;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
    transition: transform 0.3s ease;

    .chef-card:hover & {
      transform: scale(1.05);
    }
  }

  &__badge {
    position: absolute;
    top: 1rem;
    left: 1rem;
    background: linear-gradient(135deg, #f093fb, #f5576c);
    color: white;
    padding: 0.4rem 1rem;
    border-radius: 25px;
    font-size: 0.85rem;
    font-weight: 700;
    box-shadow: 0 4px 12px rgba(240, 147, 251, 0.4);
  }

  &__rating {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 0.4rem 1rem;
    border-radius: 25px;
    display: flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.85rem;
    font-weight: 600;
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  &__content {
    padding: 1.5rem;
  }

  &__name {
    font-size: 1.3rem;
    font-weight: 700;
    color: #2d3748;
    margin-bottom: 0.5rem;
  }

  &__specialty {
    color: #f093fb;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  &__experience {
    color: #718096;
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
  }

  &__location {
    color: #718096;
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }

  &__signature-dishes {
    margin-bottom: 1rem;
  }

  &__dishes-title {
    font-size: 0.9rem;
    font-weight: 600;
    color: #4a5568;
    margin-bottom: 0.5rem;
  }

  &__dishes-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  &__dish {
    background: #f7fafc;
    color: #4a5568;
    padding: 0.25rem 0.5rem;
    border-radius: 10px;
    font-size: 0.8rem;
  }

  &__social {
    display: flex;
    gap: 0.5rem;
  }

  &__social-link {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f7fafc;
    border-radius: 50%;
    text-decoration: none;
    font-size: 1rem;
    transition: all 0.3s ease;

    &:hover {
      background: #f093fb;
      transform: translateY(-2px);
    }
  }
}

.chefs-cta {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  padding: 4rem 2rem;
  text-align: center;
  color: white;

  &__container {
    max-width: 800px;
    margin: 0 auto;
  }

  &__title {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }

  &__subtitle {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    opacity: 0.9;
    line-height: 1.6;
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

@keyframes gradient-border {
  0%, 100% { background-size: 200% 200%; background-position: 0% 50%; }
  50% { background-size: 200% 200%; background-position: 100% 50%; }
}

@media (max-width: 768px) {
  .chefs-hero {
    padding: 6rem 1rem 4rem;

    &__title {
      font-size: 2rem;
    }

    &__subtitle {
      font-size: 1rem;
    }
  }

  .featured-chefs__grid {
    grid-template-columns: 1fr;
  }

  .all-chefs__grid {
    grid-template-columns: 1fr;
  }

  .chef-card--featured {
    min-width: unset;
  }

  .chef-card {
    &__image-container {
      height: 220px;
    }

    &--featured .chef-card__image-container {
      height: 260px;
    }
  }
}
</style>
