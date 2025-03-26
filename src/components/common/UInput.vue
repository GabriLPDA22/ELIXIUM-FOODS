<!-- components/common/UInput.vue -->
<template>
    <div class="u-input-wrapper" :class="{
        'u-input-wrapper--error': error,
        'u-input-wrapper--focused': focused,
        'u-input-wrapper--filled': !!modelValue,
        'u-input-wrapper--disabled': disabled
    }">
        <label v-if="label" class="u-input-label" :for="id">{{ label }}</label>

        <div class="u-input-container">
            <span v-if="leftIcon" class="u-input-icon u-input-icon--left">
                <span class="u-input-icon__content">{{ leftIcon }}</span>
            </span>

            <input :id="id" class="u-input" :class="{
                'u-input--with-left-icon': leftIcon,
                'u-input--with-right-icon': rightIcon || clearable
            }" :type="type" :value="modelValue" :placeholder="placeholder" :disabled="disabled" :readonly="readonly"
                :required="required" @input="updateValue" @focus="handleFocus" @blur="handleBlur" />

            <span v-if="clearable && modelValue" class="u-input-icon u-input-icon--clear" @click="clearInput"
                @mousedown.prevent>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </span>

            <span v-else-if="rightIcon" class="u-input-icon u-input-icon--right">
                <span class="u-input-icon__content">{{ rightIcon }}</span>
            </span>
        </div>

        <div v-if="error" class="u-input-message u-input-message--error">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {{ error }}
        </div>
        <div v-else-if="helperText" class="u-input-message u-input-message--helper">{{ helperText }}</div>
    </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref } from 'vue'

const props = defineProps({
    modelValue: {
        type: [String, Number],
        default: ''
    },
    label: {
        type: String,
        default: ''
    },
    placeholder: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: 'text'
    },
    id: {
        type: String,
        default: () => `input-${Math.random().toString(36).substring(2, 9)}`
    },
    disabled: {
        type: Boolean,
        default: false
    },
    readonly: {
        type: Boolean,
        default: false
    },
    required: {
        type: Boolean,
        default: false
    },
    error: {
        type: String,
        default: ''
    },
    helperText: {
        type: String,
        default: ''
    },
    leftIcon: {
        type: String,
        default: ''
    },
    rightIcon: {
        type: String,
        default: ''
    },
    clearable: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['update:modelValue', 'clear', 'focus', 'blur'])

const focused = ref(false)

const updateValue = (event: Event) => {
    emit('update:modelValue', (event.target as HTMLInputElement).value)
}

const clearInput = () => {
    emit('update:modelValue', '')
    emit('clear')
}

const handleFocus = (event: FocusEvent) => {
    focused.value = true
    emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
    focused.value = false
    emit('blur', event)
}
</script>

<style lang="scss" scoped>
$primary: #FF416C;
$primary-gradient: linear-gradient(to right, #FF416C, #FF4B2B);
$error: #EB3B5A;
$text-dark: #1e293b;
$text-light: #64748b;
$border: #e2e8f0;

.u-input-wrapper {
    margin-bottom: 1.5rem;
    transition: all 0.2s ease;

    &--disabled {
        opacity: 0.6;
        cursor: not-allowed;

        .u-input-container,
        .u-input-label,
        .u-input-icon {
            cursor: not-allowed;
        }
    }

    &--focused:not(.u-input-wrapper--error) {
        .u-input-label {
            color: $primary;
        }

        .u-input-container {
            border-color: $primary;
            box-shadow: 0 0 0 3px rgba($primary, 0.1);
            background-color: white;
        }

        .u-input-icon {
            color: $primary;
        }
    }

    &--error {
        .u-input-label {
            color: $error;
        }

        .u-input-container {
            border-color: $error;
            background-color: rgba($error, 0.02);

            &:focus-within {
                box-shadow: 0 0 0 3px rgba($error, 0.1);
            }
        }

        .u-input-icon {
            color: $error;
        }
    }

    &--filled:not(.u-input-wrapper--focused):not(.u-input-wrapper--error) {
        .u-input-container {
            border-color: #cbd5e1;
        }
    }
}

.u-input-label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    font-size: 0.9rem;
    color: $text-dark;
    transition: color 0.2s;
}

.u-input-container {
    position: relative;
    display: flex;
    align-items: center;
    background-color: #f8fafc;
    border: 1px solid $border;
    border-radius: 12px;
    transition: all 0.2s ease;
    overflow: hidden;

    &:hover:not(:focus-within) {
        border-color: #cbd5e1;
    }
}

.u-input {
    width: 100%;
    height: 48px;
    padding: 0 1rem;
    font-size: 1rem;
    border: none;
    background: transparent;
    color: $text-dark;
    transition: all 0.2s;
    font-family: inherit;

    &:focus {
        outline: none;
    }

    &:disabled {
        cursor: not-allowed;
    }

    &--with-left-icon {
        padding-left: 2.75rem;
    }

    &--with-right-icon {
        padding-right: 2.75rem;
    }

    &::placeholder {
        color: #94a3b8;
        font-weight: 400;
    }
}

.u-input-icon {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $text-light;
    transition: all 0.2s ease;

    &__content {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    &--left {
        left: 1rem;
    }

    &--right {
        right: 1rem;
    }

    &--clear {
        right: 1rem;
        cursor: pointer;
        color: #94a3b8;
        padding: 5px;
        border-radius: 50%;
        background-color: #f1f5f9;
        transition: all 0.2s ease;

        &:hover {
            background-color: #e2e8f0;
            color: $text-dark;
        }
    }
}

.u-input-message {
    margin-top: 0.5rem;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &--error {
        color: $error;
    }

    &--helper {
        color: $text-light;
    }
}
</style>