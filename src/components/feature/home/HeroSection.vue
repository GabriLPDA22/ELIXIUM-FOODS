<!-- components/feature/home/HeroSection.vue -->
<template>
  <section class="hero">
    <div class="hero__animated-bg">
      <!-- Iconos animados de comida -->
      <div class="hero__food-icon hero__food-icon--1">🍕</div>
      <div class="hero__food-icon hero__food-icon--2">🍔</div>
      <div class="hero__food-icon hero__food-icon--3">🍜</div>
      <div class="hero__food-icon hero__food-icon--4">🌮</div>
      <div class="hero__food-icon hero__food-icon--5">🥗</div>
      <div class="hero__food-icon hero__food-icon--6">🥐</div>
      <div class="hero__food-icon hero__food-icon--7">🍣</div>
    </div>

    <div class="hero__container">
      <div class="hero__content">
        <h1 class="hero__title">
          Descubre los mejores <span class="hero__title-highlight">restaurantes</span>
        </h1>
        <p class="hero__subtitle">
          Encuentra fácilmente los restaurantes y platos que más te gustan en tu zona
        </p>

        <!-- Componente de búsqueda mejorado -->
        <div class="hero__search-container">
          <SearchBox
            :placeholder="'Buscar restaurantes, platos, cocinas...'"
            :button-text="'Buscar'"
            :auto-focus="false"
            size="large"
            @search="handleSearch"
          />
        </div>

        <!-- Botones con funcionalidad de modal -->
        <div class="hero__badges">
          <button
            class="hero__badge hero__badge--clickable"
            @click="openCategoryModal('restaurants')"
            aria-label="Información sobre restaurantes locales"
          >
            <span class="hero__badge-icon">🍽️</span>
            <span class="hero__badge-text">Restaurantes</span>
            <span class="hero__badge-info">ℹ️</span>
          </button>
          <button
            class="hero__badge hero__badge--clickable"
            @click="openCategoryModal('delivery')"
            aria-label="Información sobre delivery sostenible"
          >
            <span class="hero__badge-icon">🚚</span>
            <span class="hero__badge-text">Delivery</span>
            <span class="hero__badge-info">ℹ️</span>
          </button>
          <button
            class="hero__badge hero__badge--clickable"
            @click="openCategoryModal('chefs')"
            aria-label="Información sobre chefs locales"
          >
            <span class="hero__badge-icon">👨‍🍳</span>
            <span class="hero__badge-text">Chefs</span>
            <span class="hero__badge-info">ℹ️</span>
          </button>
        </div>
      </div>

      <div class="hero__image-container">
        <div class="hero__image">
          <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
               alt="Deliciosa comida" />
        </div>
      </div>
    </div>

    <div class="hero__wave">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path fill="#ffffff" fill-opacity="1"
          d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,106.7C672,85,768,75,864,90.7C960,107,1056,149,1152,154.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
        </path>
      </svg>
    </div>

    <!-- Modal de información de categorías -->
    <CategoryInfoModal
      :is-visible="isModalVisible"
      :category-data="selectedCategoryData"
      @close="closeModal"
    />
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import SearchBox from '@/components/common/SearchBox.vue'
import CategoryInfoModal from '@/components/modals/CategoryInfoModal.vue'
import { categoriesData, type CategoryInfo } from '@/data/categoriesData'

const router = useRouter()

// Estado del componente
const address = ref('')
const isModalVisible = ref(false)
const selectedCategoryId = ref<string | null>(null)

// Computed para obtener los datos de la categoría seleccionada
const selectedCategoryData = computed((): CategoryInfo | null => {
  if (!selectedCategoryId.value) return null
  return categoriesData.find(category => category.id === selectedCategoryId.value) || null
})

// Manejo de búsqueda
const handleSearch = async (query: string) => {
  try {
    // Navegar a la página de resultados de búsqueda
    await router.push({
      path: '/search',
      query: { q: query }
    })
  } catch (error) {
    console.error('Error al navegar a resultados de búsqueda:', error)
  }
}

// Manejo del modal
const openCategoryModal = (categoryId: string) => {
  selectedCategoryId.value = categoryId
  isModalVisible.value = true
}

const closeModal = () => {
  isModalVisible.value = false
  // Pequeño delay para limpiar la categoría después de la animación
  setTimeout(() => {
    selectedCategoryId.value = null
  }, 300)
}
</script>

<style lang="scss" scoped>
.hero {
    position: relative;
    padding: 9rem 2rem 10rem;
    background: linear-gradient(135deg, #FF416C, #FF4B2B);
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-image:
            radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.12) 0%, transparent 200px),
            radial-gradient(circle at 80% 60%, rgba(255, 255, 255, 0.12) 0%, transparent 200px);
        z-index: 0;
    }

    &__container {
        position: relative;
        z-index: 2;
        max-width: 1400px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1fr;
        gap: 2rem;
        align-items: center;

        @media (min-width: 992px) {
            grid-template-columns: 1fr 1fr;
        }
    }

    &__content {
        max-width: 600px;
        z-index: 5;
        text-align: center;

        @media (min-width: 992px) {
            text-align: left;
        }
    }

    &__title {
        font-size: 2.4rem;
        font-weight: 800;
        color: white;
        margin: 0 0 1rem;
        line-height: 1.1;
        letter-spacing: -0.03em;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

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
                opacity: 0.5;
            }
        }

        @media (min-width: 768px) {
            font-size: 2.8rem;
            margin-bottom: 1.5rem;
            &-highlight::after {
                height: 8px;
                bottom: -4px;
            }
        }

        @media (min-width: 992px) {
            font-size: 3.5rem;
        }
    }

    &__subtitle {
        font-size: 1.1rem;
        color: rgba(255, 255, 255, 0.9);
        line-height: 1.6;
        margin: 0 auto 2rem;
        max-width: 90%;

        @media (min-width: 768px) {
            font-size: 1.25rem;
            max-width: 500px;
            margin: 0 0 2.5rem;
        }
    }

    &__search-container {
        position: relative;
        margin-bottom: 2rem;
        z-index: 10;

        @media (min-width: 768px) {
            margin-bottom: 2.5rem;
        }
    }

    &__badges {
        display: flex;
        flex-wrap: wrap;
        gap: 0.8rem;
        justify-content: center;
        position: relative;
        z-index: 5;

        @media (min-width: 992px) {
             justify-content: flex-start;
             gap: 1rem;
        }
    }

    &__badge {
        display: flex;
        align-items: center;
        background: rgba(255, 255, 255, 0.85);
        border-radius: 50px;
        padding: 0.6rem 1rem;
        backdrop-filter: blur(6px);
        border: 1px solid rgba(255, 255, 255, 0.85);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
        position: relative;

        &--clickable {
            cursor: pointer;
            border: none;
            background: rgba(255, 255, 255, 0.9);

            &:hover {
                transform: translateY(-5px);
                background: rgba(255, 255, 255, 0.98);
                border-color: rgba(255, 255, 255, 1);
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);

                .hero__badge-info {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            &:active {
                transform: translateY(-2px);
            }
        }

        &:hover:not(&--clickable) {
            transform: translateY(-3px);
            background: rgba(255, 255, 255, 0.95);
            border-color: rgba(255, 255, 255, 1);
        }

        &-icon {
            margin-right: 0.5rem;
            font-size: 1.1rem;
        }

        &-text {
            font-weight: 600;
            color: #FF416C;
            font-size: 0.85rem;
        }

        &-info {
            margin-left: 0.5rem;
            font-size: 0.7rem;
            opacity: 0;
            transform: translateX(-5px);
            transition: all 0.3s ease;
            color: #FF416C;
        }

        @media (min-width: 768px) {
            padding: 0.7rem 1.2rem;
            backdrop-filter: blur(8px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

            &-icon {
                font-size: 1.2rem;
            }

            &-text {
                font-size: 0.95rem;
            }

            &-info {
                font-size: 0.8rem;
            }
        }
    }

    &__image-container {
        position: relative;
        display: none;

        @media (min-width: 992px) {
            display: block;
        }
    }

    &__image {
        position: relative;
        width: 100%;
        height: 400px;
        border-radius: 30px;
        overflow: hidden;
        box-shadow: 0 30px 60px rgba(0, 0, 0, 0.25);
        transform: rotate(3deg);
        transition: transform 0.5s ease;

        &:hover {
            transform: rotate(0);
        }

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        &::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.4));
        }
    }

    &__wave {
        position: absolute;
        bottom: -1px;
        left: 0;
        width: 100%;
        line-height: 0;
        z-index: 1; /* Mantiene la onda por debajo de los badges */

        svg {
            display: block;
            width: 100%;
        }
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

    &__food-icon {
        position: absolute;
        font-size: 1.5rem;
        opacity: 0.2;
        animation: float 10s infinite ease-in-out;

        &--1 { top: 15%; left: 5%; font-size: 2rem; animation-delay: 0s; }
        &--2 { top: 75%; left: 15%; font-size: 1.8rem; animation-delay: 1s; }
        &--3 { top: 25%; left: 80%; font-size: 2.2rem; animation-delay: 2s; }
        &--4 { top: 85%; left: 90%; font-size: 1.6rem; animation-delay: 3s; }
        &--5 { top: 5%; left: 40%; font-size: 1.7rem; animation-delay: 4s; }
        &--6 { top: 40%; left: 92%; font-size: 1.5rem; animation-delay: 5s; }
        &--7 { top: 65%; left: 55%; font-size: 1.9rem; animation-delay: 6s; }

        @media (min-width: 768px) {
            font-size: 2rem;
            opacity: 0.25;
            &--1 { top: 20%; left: 10%; font-size: 3rem; }
            &--2 { top: 70%; left: 20%; font-size: 2.5rem; }
            &--3 { top: 30%; left: 75%; font-size: 2.8rem; }
            &--4 { top: 80%; left: 85%; font-size: 2.2rem; }
            &--5 { top: 10%; left: 45%; font-size: 2.4rem; }
            &--6 { top: 35%; left: 90%; font-size: 2rem; }
            &--7 { top: 60%; left: 50%; font-size: 2.6rem; }
        }
    }
}

@keyframes float {
    0%, 100% { transform: translateY(0) rotate(0); }
    50% { transform: translateY(-15px) rotate(5deg); }
}

@media (max-width: 767px) {
    .hero {
        padding: 6rem 1rem 8rem;
    }
}
</style>