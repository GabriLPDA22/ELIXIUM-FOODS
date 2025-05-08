<!-- components/ui/SearchBar.vue -->
<template>
    <div class="search-container">
        <div class="search-bar">
            <svg class="search-bar__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
                :placeholder="placeholder" class="search-bar__input">
            <button v-if="modelValue" @click="$emit('update:modelValue', '')" class="search-bar__clear">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>

        <div v-if="showPopularTags && popularTags.length > 0" class="popular-searches">
            <span class="popular-searches__label">Popular:</span>
            <div class="popular-searches__tags">
                <button v-for="tag in popularTags" :key="tag" @click="$emit('update:modelValue', tag)"
                    class="popular-tag">
                    {{ tag }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    modelValue: {
        type: String,
        required: true
    },
    placeholder: {
        type: String,
        default: 'Buscar...'
    },
    popularTags: {
        type: Array,
        default: () => []
    },
    showPopularTags: {
        type: Boolean,
        default: true
    }
});

defineEmits(['update:modelValue']);
</script>

<style lang="scss" scoped>
// Variables
$primary-color: #06C167;
$black: #000000;
$white: #FFFFFF;
$light-gray: #F6F6F6;
$medium-gray: #EEEEEE;
$text-primary: #000000;
$text-secondary: #757575;
$transition: all 0.2s ease;

// Search container
.search-container {
    width: 100%;
}

// Search bar
.search-bar {
    position: relative;
    display: flex;
    align-items: center;
    background-color: $light-gray;
    border-radius: 24px;
    padding: 0 16px;
    transition: $transition;
    border: 2px solid transparent;

    &:focus-within {
        border-color: $primary-color;
        background-color: $white;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }

    &__icon {
        color: $text-secondary;
        margin-right: 12px;
    }

    &__input {
        flex: 1;
        height: 50px;
        border: none;
        background: transparent;
        font-size: 16px;
        color: $text-primary;
        width: 100%;

        &:focus {
            outline: none;
        }

        &::placeholder {
            color: $text-secondary;
        }
    }

    &__clear {
        background: none;
        border: none;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        color: $text-secondary;
        cursor: pointer;

        &:hover {
            background-color: rgba(0, 0, 0, 0.05);
        }
    }
}

// Popular searches
.popular-searches {
    margin-top: 16px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;

    &__label {
        font-size: 14px;
        color: $text-secondary;
    }

    &__tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }
}

// Popular tag
.popular-tag {
    background-color: $light-gray;
    border: none;
    color: $text-primary;
    padding: 8px 16px;
    border-radius: 100px;
    font-size: 14px;
    cursor: pointer;
    transition: $transition;

    &:hover {
        background-color: $medium-gray;
    }
}
</style>