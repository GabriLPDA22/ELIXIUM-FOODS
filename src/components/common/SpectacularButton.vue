<!-- components/common/SpectacularButton.vue -->
<template>
  <button
    :class="buttonClasses"
    @click="handleClick"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <span class="button__content">
      <span class="button__icon" v-if="icon">{{ icon }}</span>
      <span class="button__text">{{ text }}</span>
      <span class="button__arrow">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 12L10 8L6 4"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
    </span>

    <!-- Efectos de partículas -->
    <div class="button__particles" v-if="isHovered">
      <div class="button__particle" v-for="n in 6" :key="n" :style="getParticleStyle(n)"></div>
    </div>

    <!-- Efecto de onda -->
    <div class="button__wave" :class="{ 'button__wave--active': isHovered }"></div>
  </button>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  text: string
  variant?: 'primary' | 'secondary' | 'chefs' | 'delivery'
  size?: 'small' | 'medium' | 'large'
  icon?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'medium',
  disabled: false
})

const emit = defineEmits<{
  click: []
}>()

const isHovered = ref(false)

const buttonClasses = computed(() => [
  'spectacular-button',
  `spectacular-button--${props.variant}`,
  `spectacular-button--${props.size}`,
  {
    'spectacular-button--disabled': props.disabled,
    'spectacular-button--hovered': isHovered.value
  }
])

const handleClick = () => {
  if (!props.disabled) {
    emit('click')
  }
}

const getParticleStyle = (index: number) => {
  const angle = (index * 60) * Math.PI / 180
  const distance = 30 + Math.random() * 20
  const x = Math.cos(angle) * distance
  const y = Math.sin(angle) * distance

  return {
    transform: `translate(${x}px, ${y}px)`,
    animationDelay: `${index * 0.1}s`,
    animationDuration: `${0.6 + Math.random() * 0.4}s`
  }
}
</script>

<style lang="scss" scoped>
.spectacular-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 2rem;
  border: none;
  border-radius: 50px;
  font-family: inherit;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  background: linear-gradient(135deg, #FF6B6B, #FF8E53);
  color: white;
  box-shadow:
    0 8px 25px rgba(255, 107, 107, 0.3),
    0 0 0 0 rgba(255, 107, 107, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.6s ease;
  }

  &:hover::before {
    left: 100%;
  }

  &:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow:
      0 15px 35px rgba(255, 107, 107, 0.4),
      0 0 0 8px rgba(255, 107, 107, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }

  &:active {
    transform: translateY(-1px) scale(0.98);
    transition: transform 0.1s ease;
  }

  // Variantes
  &--secondary {
    background: linear-gradient(135deg, #667eea, #764ba2);
    box-shadow:
      0 8px 25px rgba(102, 126, 234, 0.3),
      0 0 0 0 rgba(102, 126, 234, 0.4);

    &:hover {
      box-shadow:
        0 15px 35px rgba(102, 126, 234, 0.4),
        0 0 0 8px rgba(102, 126, 234, 0.1);
    }
  }

  &--chefs {
    background: linear-gradient(135deg, #f093fb, #f5576c);
    box-shadow:
      0 8px 25px rgba(240, 147, 251, 0.3),
      0 0 0 0 rgba(240, 147, 251, 0.4);

    &:hover {
      box-shadow:
        0 15px 35px rgba(240, 147, 251, 0.4),
        0 0 0 8px rgba(240, 147, 251, 0.1);
    }
  }

  &--delivery {
    background: linear-gradient(135deg, #4facfe, #00f2fe);
    box-shadow:
      0 8px 25px rgba(79, 172, 254, 0.3),
      0 0 0 0 rgba(79, 172, 254, 0.4);

    &:hover {
      box-shadow:
        0 15px 35px rgba(79, 172, 254, 0.4),
        0 0 0 8px rgba(79, 172, 254, 0.1);
    }
  }

  // Tamaños
  &--small {
    padding: 0.75rem 1.5rem;
    font-size: 0.875rem;
  }

  &--large {
    padding: 1.25rem 2.5rem;
    font-size: 1.125rem;
  }

  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
  }

  &__content {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__icon {
    font-size: 1.2em;
    animation: bounce 2s infinite;
  }

  &__text {
    font-weight: 600;
    white-space: nowrap;
  }

  &__arrow {
    display: flex;
    align-items: center;
    transition: transform 0.3s ease;

    .spectacular-button:hover & {
      transform: translateX(4px);
    }
  }

  &__particles {
    position: absolute;
    top: 50%;
    left: 50%;
    pointer-events: none;
    z-index: 1;
  }

  &__particle {
    position: absolute;
    width: 4px;
    height: 4px;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    animation: particle-float 1s ease-out forwards;
  }

  &__wave {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: all 0.6s ease;

    &--active {
      width: 300px;
      height: 300px;
    }
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-3px);
  }
  60% {
    transform: translateY(-2px);
  }
}

@keyframes particle-float {
  0% {
    opacity: 1;
    transform: translate(0, 0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(var(--tx, 0), var(--ty, 0)) scale(0);
  }
}

// Responsive
@media (max-width: 768px) {
  .spectacular-button {
    padding: 0.875rem 1.75rem;
    font-size: 0.95rem;

    &--small {
      padding: 0.625rem 1.25rem;
      font-size: 0.8rem;
    }

    &--large {
      padding: 1rem 2rem;
      font-size: 1rem;
    }

    &__icon {
      font-size: 1.1em;
    }
  }
}
</style>
