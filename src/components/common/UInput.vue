<!-- components/common/UInput.vue -->
<template>
    <div class="u-input-wrapper" :class="{ 'u-input-wrapper--error': error, 'u-input-wrapper--focused': focused }">
        <label v-if="label" class="u-input-label" :for="id">{{ label }}</label>

        <div class="u-input-container">
            <span v-if="leftIcon" class="u-input-icon u-input-icon--left">{{ leftIcon }}</span>

            <input :id="id" class="u-input"
                :class="{ 'u-input--with-left-icon': leftIcon, 'u-input--with-right-icon': rightIcon || clearable }"
                :type="type" :value="modelValue" :placeholder="placeholder" :disabled="disabled" :readonly="readonly"
                :required="required" @input="updateValue" @focus="focused = true" @blur="focused = false" />

            <span v-if="clearable && modelValue" class="u-input-icon u-input-icon--clear" @click="clearInput">
                ✕
            </span>

            <span v-else-if="rightIcon" class="u-input-icon u-input-icon--right">{{ rightIcon }}</span>
        </div>

        <div v-if="error" class="u-input-error">{{ error }}</div>
        <div v-else-if="helperText" class="u-input-helper">{{ helperText }}</div>
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

const emit = defineEmits(['update:modelValue', 'clear'])

const focused = ref(false)

const updateValue = (event: Event) => {
    emit('update:modelValue', (event.target as HTMLInputElement).value)
}

const clearInput = () => {
    emit('update:modelValue', '')
    emit('clear')
}
</script>

<style lang="scss" scoped>
.u-input-wrapper {
    margin-bottom: 1.5rem;

    &--focused {
        .u-input-label {
            color: #FF6B6B;
        }

        .u-input {
            border-color: #FF6B6B;
            box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.15);
        }
    }

    &--error {
        .u-input-label {
            color: #f44336;
        }

        .u-input {
            border-color: #f44336;

            &:focus {
                box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.15);
            }
        }
    }
}

.u-input-label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    font-size: 0.9rem;
    color: #333;
    transition: color 0.2s;
}

.u-input-container {
    position: relative;
    display: flex;
    align-items: center;
}

.u-input {
    width: 100%;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    transition: all 0.2s;
    background-color: white;

    &:focus {
        outline: none;
        border-color: #FF6B6B;
    }

    &:disabled {
        background-color: #f5f5f5;
        cursor: not-allowed;
        opacity: 0.7;
    }

    &--with-left-icon {
        padding-left: 2.5rem;
    }

    &--with-right-icon {
        padding-right: 2.5rem;
    }
}

.u-input-icon {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;

    &--left {
        left: 0.75rem;
    }

    &--right {
        right: 0.75rem;
    }

    &--clear {
        right: 0.75rem;
        cursor: pointer;
        font-size: 0.8rem;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background-color: #ccc;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.2s;

        &:hover {
            background-color: #999;
        }
    }
}

.u-input-error {
    margin-top: 0.5rem;
    color: #f44336;
    font-size: 0.8rem;
}

.u-input-helper {
    margin-top: 0.5rem;
    color: #777;
    font-size: 0.8rem;
}
</style>