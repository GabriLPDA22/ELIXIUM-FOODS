<!-- components/ui/SearchFilters.vue -->
<template>
    <div class="search-filters">
        <div class="filters-row">
            <div class="sort-filter">
                <span class="filter-label">Ordenar por:</span>
                <div class="select-wrapper">
                    <select v-model="sortValue" class="select-control" @change="emitSortChange">
                        <option v-for="option in sortOptions" :key="option.value" :value="option.value">
                            {{ option.label }}
                        </option>
                    </select>
                    <svg class="select-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </div>
            </div>

            <div class="price-filter">
                <span class="filter-label">Precio:</span>
                <div class="price-buttons">
                    <button v-for="price in ['$', '$$', '$$$', '$$$$']" :key="price" class="price-button"
                        :class="{ 'price-button--active': selectedPrices.includes(price) }" @click="togglePrice(price)">
                        {{ price }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
    initialSort: {
        type: String,
        default: 'popularity'
    },
    initialPrices: {
        type: Array,
        default: () => []
    }
});

const emit = defineEmits(['update:sort', 'update:prices']);

// Sort options
const sortOptions = [
    { label: 'Más Popular', value: 'popularity' },
    { label: 'Mejor Valorados', value: 'rating' },
    { label: 'Tiempo de Entrega', value: 'delivery' },
    { label: 'Precio: Bajo a Alto', value: 'price' }
];

// Local state
const sortValue = ref(props.initialSort);
const selectedPrices = ref([...props.initialPrices]);

// Emitters
const emitSortChange = () => {
    emit('update:sort', sortValue.value);
};

const togglePrice = (price) => {
    if (selectedPrices.value.includes(price)) {
        selectedPrices.value = selectedPrices.value.filter(p => p !== price);
    } else {
        selectedPrices.value.push(price);
    }
    emit('update:prices', selectedPrices.value);
};

// Watch for prop changes
watch(() => props.initialSort, (newVal) => {
    sortValue.value = newVal;
}, { immediate: true });

watch(() => props.initialPrices, (newVal) => {
    selectedPrices.value = [...newVal];
}, { immediate: true, deep: true });
</script>

<style lang="scss" scoped>
// Variables
$primary-color: #06C167; // Color principal de Uber Eats
$black: #000000;
$white: #FFFFFF;
$light-gray: #F6F6F6;
$medium-gray: #EEEEEE;
$dark-gray: #545454;
$text-primary: #000000;
$text-secondary: #757575;
$border-radius: 8px;
$transition: all 0.2s ease;

// Filters row
.filters-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
    }
}

// Filter label
.filter-label {
    font-size: 14px;
    color: $text-secondary;
    margin-right: 8px;
}

// Sort filter
.sort-filter {
    display: flex;
    align-items: center;
}

// Select wrapper
.select-wrapper {
    position: relative;
}

// Select control
.select-control {
    appearance: none;
    background-color: $white;
    border: 1px solid $medium-gray;
    border-radius: $border-radius;
    padding: 8px 32px 8px 12px;
    font-size: 14px;
    color: $text-primary;
    cursor: pointer;

    &:focus {
        outline: none;
        border-color: $primary-color;
    }
}

// Select arrow
.select-arrow {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: $text-secondary;
}

// Price filter
.price-filter {
    display: flex;
    align-items: center;
}

// Price buttons
.price-buttons {
    display: flex;
    gap: 8px;
}

// Price button
.price-button {
    background-color: $white;
    border: 1px solid $medium-gray;
    color: $text-primary;
    font-size: 14px;
    min-width: 40px;
    height: 40px;
    border-radius: $border-radius;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: $transition;

    &:hover {
        background-color: $light-gray;
    }

    &--active {
        background-color: $primary-color;
        border-color: $primary-color;
        color: $white;

        &:hover {
            background-color: darken($primary-color, 5%);
        }
    }
}
</style>