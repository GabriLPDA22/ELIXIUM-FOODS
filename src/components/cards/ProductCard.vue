<template>
  <div class="product-card" @click="$emit('click')">
    <div class="product-card__image-wrapper">
      <img
        :src="product.imageUrl"
        :alt="product.name"
        class="product-card__image"
      />
      <div class="product-card__overlay"></div>
      <div v-if="!product.isAvailable" class="product-card__unavailable">
        <span class="product-card__unavailable-text">No disponible</span>
      </div>
      <div class="product-card__price">
        €{{ formatPrice(product.basePrice) }}
      </div>
    </div>
    <div class="product-card__content">
      <div class="product-card__header">
        <h3 class="product-card__name">{{ product.name }}</h3>
        <div v-if="product.category" class="product-card__category">
          {{ product.category.name }}
        </div>
      </div>
      <p v-if="product.description" class="product-card__description">
        {{ truncateDescription(product.description, 80) }}
      </p>
      <div class="product-card__footer">
        <span class="product-card__business">
          ID Business: {{ product.businessId }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SearchProduct } from '@/services/searchService';

interface Props {
  product: SearchProduct;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  click: [];
}>();

const formatPrice = (price: number): string => {
  return price.toFixed(2);
};

const truncateDescription = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text || '';
  return text.substring(0, maxLength).trim() + '...';
};

</script>

<style lang="scss" scoped>
.product-card {
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
    }

    &::after {
      opacity: 1;
    }

    .product-card__image {
      transform: scale(1.05);
      filter: brightness(1.1) contrast(1.02);
    }

    .product-card__name {
      color: #FF416C;
    }
  }

  &__image-wrapper {
    position: relative;
    height: 160px;
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
    opacity: 1;
    transition: opacity 0.4s ease;
  }

  &__unavailable {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3;

    &-text {
      color: white;
      font-weight: 600;
      font-size: 0.9rem;
      padding: 0.5rem 1rem;
      background: rgba(220, 38, 38, 0.9);
      border-radius: 50px;
      backdrop-filter: blur(10px);
    }
  }

  &__price {
    position: absolute;
    bottom: 0.8rem;
    right: 0.8rem;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    border-radius: 50px;
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
    font-weight: 700;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    z-index: 2;
  }

  &__content {
    padding: 1rem;
  }

  &__header {
    margin-bottom: 0.8rem;
  }

  &__name {
    font-size: 1rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 0.4rem;
    line-height: 1.3;
    transition: color 0.3s ease;
  }

  &__category {
    font-size: 0.8rem;
    color: #FF416C;
    font-weight: 600;
    background: rgba(255, 65, 108, 0.1);
    padding: 0.2rem 0.6rem;
    border-radius: 50px;
    display: inline-block;
  }

  &__description {
    color: #64748b;
    font-size: 0.85rem;
    line-height: 1.5;
    margin: 0 0 0.8rem;
  }

  &__footer {
    font-size: 0.75rem;
    color: #94a3b8;
    padding-top: 0.5rem;
    border-top: 1px solid #e2e8f0;
  }

  &__business {
    font-style: italic;
  }
}

@media (max-width: 768px) {
  .product-card {
    &__image-wrapper {
      height: 140px;
    }
    &__content {
      padding: 0.8rem;
    }
    &__name {
      font-size: 0.9rem;
    }
    &__description {
      font-size: 0.8rem;
    }
  }
}
</style>
