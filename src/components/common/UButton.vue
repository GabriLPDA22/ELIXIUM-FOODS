<!-- components/common/UButton.vue -->
<template>
    <button class="u-button" :class="[
        `u-button--${variant}`,
        `u-button--${size}`,
        { 'u-button--rounded': rounded },
        { 'u-button--full-width': fullWidth },
        { 'u-button--disabled': disabled || loading }
    ]" :disabled="disabled || loading" @click="onClick">
        <span v-if="loading" class="u-button__loader"></span>
        <span v-if="!loading && leftIcon" class="u-button__icon u-button__icon--left">{{ leftIcon }}</span>
        <span class="u-button__text">
            <slot></slot>
        </span>
        <span v-if="!loading && rightIcon" class="u-button__icon u-button__icon--right">{{ rightIcon }}</span>
    </button>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
    variant: {
        type: String,
        default: 'primary',
        validator: (value: string) => ['primary', 'secondary', 'outline', 'ghost', 'danger'].includes(value)
    },
    size: {
        type: String,
        default: 'medium',
        validator: (value: string) => ['small', 'medium', 'large'].includes(value)
    },
    rounded: {
        type: Boolean,
        default: false
    },
    fullWidth: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    },
    loading: {
        type: Boolean,
        default: false
    },
    leftIcon: {
        type: String,
        default: ''
    },
    rightIcon: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['click'])

const onClick = (event: MouseEvent) => {
    emit('click', event)
}
</script>

<style lang="scss" scoped>
.u-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;

    &:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.3);
    }

    // Variants
    &--primary {
        background: linear-gradient(135deg, #FF6B6B, #FF8E53);
        color: white;

        &:hover {
            background: linear-gradient(135deg, darken(#FF6B6B, 5%), darken(#FF8E53, 5%));
        }
    }

    &--secondary {
        background-color: #333;
        color: white;

        &:hover {
            background-color: #444;
        }
    }

    &--outline {
        background-color: transparent;
        border: 2px solid #FF6B6B;
        color: #FF6B6B;

        &:hover {
            background-color: rgba(255, 107, 107, 0.1);
        }
    }

    &--ghost {
        background-color: transparent;
        color: #FF6B6B;

        &:hover {
            background-color: rgba(255, 107, 107, 0.1);
        }
    }

    &--danger {
        background-color: #f44336;
        color: white;

        &:hover {
            background-color: darken(#f44336, 5%);
        }
    }

    // Sizes
    &--small {
        height: 36px;
        padding: 0 16px;
        font-size: 0.875rem;
        border-radius: 6px;
    }

    &--medium {
        height: 44px;
        padding: 0 20px;
        font-size: 1rem;
        border-radius: 8px;
    }

    &--large {
        height: 52px;
        padding: 0 24px;
        font-size: 1.125rem;
        border-radius: 10px;
    }

    // Modifiers
    &--rounded {
        border-radius: 9999px;
    }

    &--full-width {
        width: 100%;
    }

    &--disabled {
        opacity: 0.6;
        cursor: not-allowed;

        &:hover {
            background: linear-gradient(135deg, #FF6B6B, #FF8E53);
        }
    }

    // Elements
    &__text {
        position: relative;
        z-index: 1;
    }

    &__icon {
        display: flex;
        align-items: center;
        position: relative;
        z-index: 1;

        &--left {
            margin-right: 8px;
        }

        &--right {
            margin-left: 8px;
        }
    }

    &__loader {
        width: 20px;
        height: 20px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: white;
        animation: spin 0.8s linear infinite;
        margin-right: 8px;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    // Ripple effect
    &::after {
        content: '';
        display: block;
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        pointer-events: none;
        background-image: radial-gradient(circle, #fff 10%, transparent 10.01%);
        background-repeat: no-repeat;
        background-position: 50%;
        transform: scale(10, 10);
        opacity: 0;
        transition: transform 0.5s, opacity 1s;
    }

    &:active::after {
        transform: scale(0, 0);
        opacity: 0.3;
        transition: 0s;
    }
}
</style>