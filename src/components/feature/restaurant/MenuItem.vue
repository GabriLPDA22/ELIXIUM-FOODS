<!-- components/feature/restaurant/MenuItem.vue -->
<template>
    <div class="menu-item">
        <div class="menu-item__image-container">
            <img v-if="item.image" :src="item.image" :alt="item.name" class="menu-item__image">
            <div v-else class="menu-item__no-image"></div>

            <!-- Etiqueta Popular rediseñada -->
            <div v-if="item.popular" class="menu-item__badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round" class="menu-item__badge-icon">
                    <path d="M12 2L14.4 8.5H21l-5.1 5.5 2 7L12 16l-5.9 5 2-7L3 8.5h6.6z"></path>
                </svg>
                <span>Popular</span>
            </div>
        </div>

        <div class="menu-item__content">
            <h3 class="menu-item__name">{{ item.name }}</h3>
            <p class="menu-item__description">{{ item.description }}</p>

            <div class="menu-item__footer">
                <div class="menu-item__price">${{ item.price.toFixed(2) }}</div>
                <button class="menu-item__add-btn" @click="$emit('addToCart', item)">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    item: {
        type: Object,
        required: true
    }
});

defineEmits(['addToCart']);
</script>

<style lang="scss" scoped>
// Variables
$primary-color: #06C167; // Color principal de Uber Eats
$accent-color: #FF8000; // Color para etiquetas como "Popular"
$background-color: #FFFFFF;
$text-primary: #1E293B;
$text-secondary: #64748B;
$border-radius: 12px;
$box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
$transition: all 0.25s ease;

.menu-item {
    position: relative;
    display: flex;
    background-color: $background-color;
    border-radius: $border-radius;
    overflow: hidden;
    box-shadow: $box-shadow;
    transition: $transition;
    cursor: pointer;

    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);

        .menu-item__add-btn {
            opacity: 1;
            transform: translateY(0);
        }

        .menu-item__image {
            transform: scale(1.05);
        }
    }

    @media (max-width: 768px) {
        flex-direction: column;
    }

    &__image-container {
        position: relative;
        width: 100px;
        height: 100px;
        flex-shrink: 0;
        overflow: hidden;

        @media (max-width: 768px) {
            width: 100%;
            height: 160px;
        }
    }

    &__image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
    }

    &__no-image {
        width: 100%;
        height: 100%;
        background-color: #f3f4f6;
        display: flex;
        align-items: center;
        justify-content: center;

        &::before {
            content: '🍽️';
            font-size: 24px;
        }
    }

    &__badge {
        position: absolute;
        top: 8px;
        left: 8px;
        background-color: $accent-color;
        color: white;
        font-size: 12px;
        font-weight: 600;
        padding: 4px 8px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        gap: 4px;
        box-shadow: 0 2px 6px rgba($accent-color, 0.3);

        &-icon {
            color: white;
        }
    }

    &__content {
        flex: 1;
        padding: 16px;
        display: flex;
        flex-direction: column;
    }

    &__name {
        font-size: 16px;
        font-weight: 600;
        color: $text-primary;
        margin: 0 0 4px;
    }

    &__description {
        font-size: 14px;
        color: $text-secondary;
        margin: 0 0 12px;
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        flex: 1;
    }

    &__footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: auto;
    }

    &__price {
        font-weight: 600;
        color: $text-primary;
        font-size: 15px;
    }

    &__add-btn {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background-color: $primary-color;
        color: white;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: $transition;
        opacity: 0.85;
        transform: translateY(4px);

        &:hover {
            background-color: $primary-color;
            transform: scale(1.1) translateY(0);
        }

        @media (max-width: 768px) {
            opacity: 1;
            transform: translateY(0);
        }
    }
}
</style>