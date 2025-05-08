<!-- components/common/UButton.vue -->
<template>
    <button class="u-button" :class="[
        `u-button--${variant}`,
        `u-button--${size}`,
        { 'u-button--rounded': rounded },
        { 'u-button--full-width': fullWidth },
        { 'u-button--elevated': elevated },
        { 'u-button--disabled': disabled || loading },
        { 'u-button--icon-only': iconOnly }
    ]" :disabled="disabled || loading" @click="onClick">
        <div class="u-button__content">
            <div v-if="loading" class="u-button__loader">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <circle class="u-button__loader-circle" cx="12" cy="12" r="10" fill="none" stroke="currentColor"
                        stroke-width="3"></circle>
                </svg>
            </div>

            <span v-if="!loading && leftIcon" class="u-button__icon u-button__icon--left">
                <span class="u-button__icon-content">{{ leftIcon }}</span>
            </span>

            <span v-if="!iconOnly" class="u-button__text">
                <slot></slot>
            </span>

            <span v-if="!loading && rightIcon" class="u-button__icon u-button__icon--right">
                <span class="u-button__icon-content">{{ rightIcon }}</span>
            </span>

            <span v-if="iconOnly && !loading && icon" class="u-button__icon-only">
                <span class="u-button__icon-content">{{ icon }}</span>
            </span>
        </div>
    </button>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
    variant: {
        type: String,
        default: 'primary',
        validator: (value: string) => ['primary', 'secondary', 'accent', 'outline', 'ghost', 'danger', 'success', 'warning', 'info'].includes(value)
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
    elevated: {
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
    },
    icon: {
        type: String,
        default: ''
    },
    iconOnly: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['click'])

const onClick = (event: MouseEvent) => {
    emit('click', event)
}
</script>

<style lang="scss" scoped>
$primary: #FF416C;
$primary-darker: #e42f5a;
$primary-gradient: linear-gradient(to right, #FF416C, #FF4B2B);

$secondary: #0652DD;
$secondary-darker: #0548c3;
$secondary-gradient: linear-gradient(to right, #0652DD, #12CBC4);

$accent: #FFA502;
$accent-darker: #e69401;
$accent-gradient: linear-gradient(to right, #FFA502, #FF6B2B);

$success: #20BF6B;
$success-darker: #199055;
$success-gradient: linear-gradient(to right, #20BF6B, #0ED573);

$warning: #F7B731;
$warning-darker: #e0a116;
$warning-gradient: linear-gradient(to right, #F7B731, #FFAA00);

$danger: #EB3B5A;
$danger-darker: #d62a49;
$danger-gradient: linear-gradient(to right, #EB3B5A, #FC5C65);

$info: #45AAF2;
$info-darker: #1a98f0;
$info-gradient: linear-gradient(to right, #45AAF2, #2D98DA);

.u-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    font-weight: 600;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-family: inherit;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
    padding: 0;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.1);
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    &:hover::before {
        opacity: 1;
    }

    &:focus {
        outline: none;
    }

    &:focus-visible {
        box-shadow: 0 0 0 3px rgba($primary, 0.4);
    }

    &:active {
        transform: translateY(1px);
    }

    &__content {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        padding: 0 20px;

        .u-button--small & {
            padding: 0 16px;
        }

        .u-button--large & {
            padding: 0 24px;
        }

        .u-button--icon-only & {
            padding: 0;
        }
    }

    // Variants
    &--primary {
        background: $primary-gradient;
        color: white;

        &:active {
            background: $primary-darker;
        }
    }

    &--secondary {
        background: $secondary-gradient;
        color: white;

        &:active {
            background: $secondary-darker;
        }
    }

    &--accent {
        background: $accent-gradient;
        color: white;

        &:active {
            background: $accent-darker;
        }
    }

    &--success {
        background: $success-gradient;
        color: white;

        &:active {
            background: $success-darker;
        }
    }

    &--warning {
        background: $warning-gradient;
        color: white;

        &:active {
            background: $warning-darker;
        }
    }

    &--danger {
        background: $danger-gradient;
        color: white;

        &:active {
            background: $danger-darker;
        }
    }

    &--info {
        background: $info-gradient;
        color: white;

        &:active {
            background: $info-darker;
        }
    }

    &--outline {
        background-color: transparent;
        box-shadow: inset 0 0 0 2px $primary;
        color: $primary;

        &:hover {
            background-color: rgba($primary, 0.05);
        }

        &:active {
            background-color: rgba($primary, 0.1);
        }
    }

    &--ghost {
        background-color: transparent;
        color: $primary;

        &:hover {
            background-color: rgba($primary, 0.05);
        }

        &:active {
            background-color: rgba($primary, 0.1);
        }
    }

    // Sizes
    &--small {
        height: 36px;
        font-size: 0.875rem;

        &.u-button--icon-only {
            width: 36px;
        }
    }

    &--medium {
        height: 44px;
        font-size: 1rem;

        &.u-button--icon-only {
            width: 44px;
        }
    }

    &--large {
        height: 52px;
        font-size: 1.125rem;

        &.u-button--icon-only {
            width: 52px;
        }
    }

    // Modifiers
    &--rounded {
        border-radius: 50px;
    }

    &--elevated {
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);

        &:hover {
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
            transform: translateY(-2px);
        }

        &:active {
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            transform: translateY(0);
        }
    }

    &--full-width {
        width: 100%;
    }

    &--disabled {
        opacity: 0.6;
        cursor: not-allowed;
        box-shadow: none !important;

        &:hover,
        &:active {
            transform: none;
            background: inherit;

            &::before {
                opacity: 0;
            }
        }
    }

    &--icon-only {
        border-radius: 50%;
    }

    // Elements
    &__text {
        position: relative;
        z-index: 1;
        line-height: 1;
    }

    &__icon {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        z-index: 1;

        &-content {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        &--left {
            margin-right: 8px;
        }

        &--right {
            margin-left: 8px;
        }
    }

    &__icon-only {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        z-index: 1;
    }

    &__loader {
        width: 24px;
        height: 24px;
        margin-right: 8px;
        position: relative;

        svg {
            animation: rotate 1.4s linear infinite;
            transform-origin: center center;
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
        }

        &-circle {
            stroke-dasharray: 80;
            stroke-dashoffset: 60;
            animation: dash 2.4s ease-in-out infinite;
        }
    }
}

@keyframes rotate {
    100% {
        transform: rotate(360deg);
    }
}

@keyframes dash {
    0% {
        stroke-dashoffset: 60;
    }

    50% {
        stroke-dashoffset: 20;
    }

    100% {
        stroke-dashoffset: 60;
    }
}
</style>