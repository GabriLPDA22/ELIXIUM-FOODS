<!-- CategoryInfoModal.vue -->
<template>
  <Transition name="modal-overlay">
    <div
      v-if="isVisible"
      class="category-modal-overlay"
      @click="closeModal"
    >
      <Transition name="modal-content">
        <div
          v-if="isVisible && categoryData"
          class="category-modal"
          @click.stop
        >
          <!-- Header -->
          <div class="category-modal__header">
            <button
              class="category-modal__close"
              @click="closeModal"
              aria-label="Cerrar modal"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="category-modal__content">
            <!-- Hero Section -->
            <div class="category-modal__hero">
              <div class="category-modal__hero-content">
                <div class="category-modal__icon">{{ categoryData.icon }}</div>
                <h2 class="category-modal__title">{{ categoryData.title }}</h2>
                <p class="category-modal__subtitle">{{ categoryData.subtitle }}</p>
              </div>
              <div class="category-modal__hero-image">
                <img :src="categoryData.imageUrl" :alt="categoryData.title" />
                <div class="category-modal__hero-overlay"></div>
              </div>
            </div>

            <!-- Description -->
            <div class="category-modal__description">
              <p>{{ categoryData.description }}</p>
            </div>

            <!-- Stats -->
            <div class="category-modal__stats">
              <div
                v-for="stat in categoryData.stats"
                :key="stat.label"
                class="category-modal__stat"
              >
                <span class="stat-value">{{ stat.value }}</span>
                <span class="stat-label">{{ stat.label }}</span>
              </div>
            </div>

            <!-- Features -->
            <div class="category-modal__features">
              <h3 class="features-title">¿Por qué elegir {{ categoryData.title.toLowerCase() }}?</h3>
              <div class="features-grid">
                <div
                  v-for="feature in categoryData.features"
                  :key="feature.title"
                  class="feature-card"
                >
                  <div class="feature-icon">{{ feature.icon }}</div>
                  <h4 class="feature-title">{{ feature.title }}</h4>
                  <p class="feature-description">{{ feature.description }}</p>
                </div>
              </div>
            </div>

            <!-- Benefits -->
            <div class="category-modal__benefits">
              <h3 class="benefits-title">Beneficios de elegir local</h3>
              <div class="benefits-grid">
                <div
                  v-for="benefit in categoryData.benefits"
                  :key="benefit"
                  class="benefit-item"
                >
                  <span class="benefit-check">✅</span>
                  <span class="benefit-text">{{ benefit }}</span>
                </div>
              </div>
            </div>

            <!-- Commitment -->
            <div class="category-modal__commitment">
              <div class="commitment-icon">🌱</div>
              <div class="commitment-content">
                <h3 class="commitment-title">Nuestro Compromiso</h3>
                <p class="commitment-text">{{ categoryData.commitment }}</p>
              </div>
            </div>

            <!-- CTA -->
            <div class="category-modal__cta">
              <router-link
                :to="categoryData.ctaLink"
                class="category-modal__cta-button"
                @click="closeModal"
              >
                {{ categoryData.ctaText }}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
              </router-link>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import type { CategoryInfo } from '@/data/categoriesData';

interface Props {
  isVisible: boolean;
  categoryData: CategoryInfo | null;
}

interface Emits {
  (e: 'close'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const closeModal = () => {
  emit('close');
};

// Prevenir scroll del body cuando el modal está abierto
watch(() => props.isVisible, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

// Cerrar modal con Escape
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.isVisible) {
    closeModal();
  }
};

document.addEventListener('keydown', handleKeydown);
</script>

<style lang="scss" scoped>
.category-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  overflow-y: auto;
}

.category-modal {
  background: white;
  border-radius: 24px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    max-width: 100%;
    max-height: 95vh;
    margin: 0.5rem;
    border-radius: 16px;
  }

  &__header {
    position: sticky;
    top: 0;
    background: white;
    z-index: 10;
    padding: 1rem 1.5rem 0;
    display: flex;
    justify-content: flex-end;
    border-radius: 24px 24px 0 0;
  }

  &__close {
    background: rgba(0, 0, 0, 0.05);
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    color: #64748b;

    &:hover {
      background: rgba(255, 65, 108, 0.1);
      color: #FF416C;
      transform: rotate(90deg);
    }
  }

  &__content {
    padding: 0 2rem 2rem;

    @media (max-width: 768px) {
      padding: 0 1.5rem 1.5rem;
    }
  }

  &__hero {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    align-items: center;
    margin-bottom: 2rem;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
  }

  &__hero-content {
    text-align: left;

    @media (max-width: 768px) {
      text-align: center;
      order: 2;
    }
  }

  &__icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    display: block;
  }

  &__title {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 0.75rem;
    background: linear-gradient(135deg, #FF416C, #FF4B2B);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    line-height: 1.2;

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  &__subtitle {
    font-size: 1.25rem;
    color: #64748b;
    margin: 0;
    line-height: 1.4;
  }

  &__hero-image {
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    height: 250px;

    @media (max-width: 768px) {
      order: 1;
      height: 200px;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        135deg,
        rgba(255, 65, 108, 0.2),
        rgba(255, 75, 43, 0.1)
      );
    }
  }

  &__description {
    margin-bottom: 2rem;

    p {
      font-size: 1.1rem;
      line-height: 1.7;
      color: #475569;
      margin: 0;
    }
  }

  &__stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    margin-bottom: 3rem;

    @media (max-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  &__stat {
    text-align: center;
    padding: 1.5rem 1rem;
    background: linear-gradient(135deg, #f8fafc, #f1f5f9);
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    transition: transform 0.3s ease;

    &:hover {
      transform: translateY(-5px);
    }

    .stat-value {
      display: block;
      font-size: 1.75rem;
      font-weight: 800;
      background: linear-gradient(135deg, #FF416C, #FF4B2B);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      margin-bottom: 0.25rem;
    }

    .stat-label {
      font-size: 0.85rem;
      color: #64748b;
      font-weight: 500;
    }
  }

  &__features {
    margin-bottom: 3rem;

    .features-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      color: #1e293b;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }

    .feature-card {
      padding: 1.5rem;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      transition: all 0.3s ease;

      &:hover {
        border-color: #FF416C;
        box-shadow: 0 10px 25px rgba(255, 65, 108, 0.1);
        transform: translateY(-2px);
      }

      .feature-icon {
        font-size: 2rem;
        margin-bottom: 1rem;
      }

      .feature-title {
        font-size: 1.1rem;
        font-weight: 600;
        margin-bottom: 0.75rem;
        color: #1e293b;
      }

      .feature-description {
        color: #64748b;
        line-height: 1.5;
        margin: 0;
      }
    }
  }

  &__benefits {
    margin-bottom: 3rem;

    .benefits-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      color: #1e293b;
    }

    .benefits-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }

    .benefit-item {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 0.75rem;

      .benefit-check {
        font-size: 1rem;
        flex-shrink: 0;
        margin-top: 0.1rem;
      }

      .benefit-text {
        color: #475569;
        line-height: 1.5;
        font-size: 0.95rem;
      }
    }
  }

  &__commitment {
    display: flex;
    gap: 1rem;
    padding: 2rem;
    background: linear-gradient(135deg, rgba(255, 65, 108, 0.05), rgba(34, 197, 94, 0.05));
    border-radius: 16px;
    border-left: 4px solid #22c55e;
    margin-bottom: 2rem;

    .commitment-icon {
      font-size: 2.5rem;
      flex-shrink: 0;
    }

    .commitment-content {
      .commitment-title {
        font-size: 1.25rem;
        font-weight: 700;
        margin-bottom: 0.75rem;
        color: #1e293b;
      }

      .commitment-text {
        color: #475569;
        line-height: 1.6;
        margin: 0;
      }
    }
  }

  &__cta {
    text-align: center;
    margin-top: 1rem;
  }

  &__cta-button {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    background: linear-gradient(135deg, #FF416C, #FF4B2B);
    color: white;
    padding: 1rem 2rem;
    border-radius: 50px;
    text-decoration: none;
    font-weight: 600;
    font-size: 1.1rem;
    transition: all 0.3s ease;
    box-shadow: 0 10px 25px rgba(255, 65, 108, 0.3);

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 15px 35px rgba(255, 65, 108, 0.4);
    }

    svg {
      transition: transform 0.3s ease;
    }

    &:hover svg {
      transform: translateX(3px);
    }
  }
}

// Transitions
.modal-overlay-enter-active,
.modal-overlay-leave-active {
  transition: opacity 0.3s ease;
}

.modal-overlay-enter-from,
.modal-overlay-leave-to {
  opacity: 0;
}

.modal-content-enter-active,
.modal-content-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-content-enter-from,
.modal-content-leave-to {
  opacity: 0;
  transform: scale(0.8) translateY(50px);
}
</style>
