<!-- components/feature/home/CategoriesSection.vue -->
<template>
  <section class="categories">
    <div class="container">
      <div class="categories__heading">
        <h2 class="categories__title">Explora por Categorías</h2>
        <p class="categories__description">Descubre las mejores opciones gastronómicas agrupadas por categorías
        </p>
      </div>

      <div v-if="isLoading" class="categories__loading">
        <div class="loading-spinner"></div>
        <p>Cargando categorías...</p>
      </div>

      <div v-else-if="categories.length === 0" class="categories__empty">
        <p>No hay categorías disponibles en este momento.</p>
      </div>

      <div v-else class="categories__grid">
        <router-link v-for="category in categories" :key="category.id" :to="`/category/${category.id}`"
          class="category-card">
          <div class="category-card__image-wrapper">
            <div class="category-card__gradient-bg"></div>
            <div class="category-card__icon">{{ getCategoryIcon(category.name) }}</div>
            <div class="category-card__circles">
              <span class="category-card__circle"></span>
              <span class="category-card__circle"></span>
              <span class="category-card__circle"></span>
            </div>
          </div>
          <div class="category-card__content">
            <h3 class="category-card__title">{{ category.name }}</h3>
            <span class="category-card__count">{{ category.products?.length || 0 }} productos</span>
          </div>
          <div class="category-card__arrow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14"></path>
              <path d="M12 5l7 7-7 7"></path>
            </svg>
          </div>
        </router-link>
      </div>

      <div class="categories__more">
        <router-link to="/categories" class="categories__more-link">
          Ver todas las categorías
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { type Category } from '@/services/categoryService'

interface Props {
  categories: Category[]
  isLoading: boolean
}

const props = defineProps<Props>()

// Función para asignar iconos a las categorías
const getCategoryIcon = (categoryName: string): string => {
  const categoryIcons: Record<string, string> = {
    'Hamburguesas': '🍔',
    'Pizza': '🍕',
    'Sushi': '🍣',
    'Ensaladas': '🥗',
    'Pollo': '🍗',
    'Mexicana': '🌮',
    'Italiana': '🍝',
    'Postres': '🍦',
    'Pasta': '🍜',
    'Vegetariana': '🥕',
    'Saludable': '🌱',
    'Cafe': '☕',
    'Bebidas': '🥤',
    'Mariscos': '🦐',
    'Parrilla': '🔥',
    'Comida China': '🥡',
    'Comida Mexicana': '🌯',
    'Comida Rapida': '🍔',
    'Asiatica': '🍜',
    'Sopas': '🍲',
    'Snacks': '🍿',
    // Valor por defecto
    'default': '🍽️'
  }

  // Buscar el icono por coincidencia parcial o devolver el icono por defecto
  const matchingKey = Object.keys(categoryIcons).find(key =>
    categoryName.toLowerCase().includes(key.toLowerCase())
  )

  return matchingKey ? categoryIcons[matchingKey] : categoryIcons['default']
}
</script>

<style lang="scss" scoped>
.categories {
  padding: 7rem 0;
  background-color: #f8fafc;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(at top right, rgba(#FF416C, 0.05), transparent 70%);
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(at bottom left, rgba(#0652DD, 0.05), transparent 70%);
    pointer-events: none;
  }

  .container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
    position: relative;
    z-index: 2;
  }

  &__heading {
    text-align: center;
    max-width: 650px;
    margin: 0 auto 4rem;
  }

  &__title {
    font-size: 2.75rem;
    font-weight: 800;
    margin-bottom: 1rem;
    background: linear-gradient(to right, #FF416C, #FF4B2B);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    display: inline-block;
    position: relative;

    &::after {
      content: '';
      display: block;
      width: 40%;
      height: 4px;
      background: linear-gradient(to right, #FF416C, #FF4B2B);
      margin: 0.8rem auto 0;
      border-radius: 4px;
    }
  }

  &__description {
    color: #64748b;
    font-size: 1.2rem;
    max-width: 550px;
    margin: 0 auto;
  }

  &__loading {
    text-align: center;
    padding: 4rem 0;

    .loading-spinner {
      width: 50px;
      height: 50px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #FF416C;
      border-radius: 50%;
      margin: 0 auto 1rem;
      animation: spin 1s linear infinite;
    }
  }

  &__empty {
    text-align: center;
    padding: 4rem 0;
    color: #64748b;
    font-size: 1.1rem;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 2rem;
  }

  &__more {
    text-align: center;
    margin-top: 3rem;

    &-link {
      display: inline-flex;
      align-items: center;
      padding: 0.75rem 1.5rem;
      background: white;
      border-radius: 50px;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
      color: #FF416C;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.3s ease;

      svg {
        margin-left: 0.5rem;
        transition: transform 0.3s ease;
      }

      &:hover {
        background: linear-gradient(to right, #FF416C, #FF4B2B);
        color: white;
        transform: translateY(-3px);
        box-shadow: 0 8px 25px rgba(255, 65, 108, 0.3);

        svg {
          transform: translateX(4px);
        }
      }
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

.category-card {
  display: flex;
  flex-direction: column;
  position: relative;
  text-decoration: none;
  color: inherit;
  background-color: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  height: 100%;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);

    .category-card__circle {
      transform: scale(1.2);
      opacity: 0.15;
    }

    .category-card__icon {
      transform: scale(1.2) rotate(5deg);
    }

    .category-card__arrow {
      opacity: 1;
      transform: translateX(0);
    }
  }

  &__image-wrapper {
    height: 160px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }

  &__gradient-bg {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #FF416C, #FF4B2B);
    opacity: 0.85;
    transition: opacity 0.3s ease;

    .category-card:nth-child(2n) & {
      background: linear-gradient(135deg, #FFA502, #FF6B2B);
    }

    .category-card:nth-child(3n) & {
      background: linear-gradient(135deg, #0652DD, #12CBC4);
    }

    .category-card:nth-child(4n) & {
      background: linear-gradient(135deg, #9980FA, #FDA7DF);
    }

    .category-card:nth-child(5n) & {
      background: linear-gradient(135deg, #20BF6B, #0ED573);
    }
  }

  &__icon {
    font-size: 5rem;
    position: relative;
    z-index: 2;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    filter: drop-shadow(0 5px 10px rgba(0, 0, 0, 0.1));
  }

  &__circles {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
  }

  &__circle {
    position: absolute;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: white;
    opacity: 0.1;
    transition: all 0.4s ease;

    &:nth-child(1) {
      transform: translateX(-60px) translateY(-20px);
      width: 100px;
      height: 100px;
    }

    &:nth-child(2) {
      transform: translateX(60px) translateY(-10px) scale(0.8);
    }

    &:nth-child(3) {
      transform: translateY(50px) scale(1.2);
    }
  }

  &__content {
    padding: 1.5rem;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  &__title {
    font-size: 1.25rem;
    font-weight: 700;
    margin: 0 0 0.5rem;
    color: #1e293b;
  }

  &__count {
    font-size: 0.95rem;
    color: #64748b;
  }

  &__arrow {
    position: absolute;
    bottom: 1.5rem;
    right: 1.5rem;
    width: 32px;
    height: 32px;
    background: linear-gradient(to right, #FF416C, #FF4B2B);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    opacity: 0;
    transform: translateX(10px);
    transition: all 0.3s ease;

    .category-card:nth-child(2n) & {
      background: linear-gradient(to right, #FFA502, #FF6B2B);
    }

    .category-card:nth-child(3n) & {
      background: linear-gradient(to right, #0652DD, #12CBC4);
    }

    .category-card:nth-child(4n) & {
      background: linear-gradient(to right, #9980FA, #FDA7DF);
    }

    .category-card:nth-child(5n) & {
      background: linear-gradient(to right, #20BF6B, #0ED573);
    }
  }
}

@media (max-width: 768px) {
  .categories {
    padding: 5rem 0;

    &__title {
      font-size: 2.25rem;
    }

    &__description {
      font-size: 1.1rem;
    }

    &__grid {
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 1.5rem;
    }
  }

  .category-card {
    &__image-wrapper {
      height: 140px;
    }

    &__icon {
      font-size: 4rem;
    }
  }
}

@media (max-width: 480px) {
  .categories {
    padding: 4rem 0;

    .container {
      padding: 0 1.5rem;
    }

    &__grid {
      grid-template-columns: 1fr;
      max-width: 300px;
      margin: 0 auto;
    }
  }
}
</style>
