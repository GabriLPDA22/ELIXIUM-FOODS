<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast" tag="div">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'toast',
            `toast--${toast.type}`
          ]"
        >
          <div class="toast__icon">
            <span v-if="toast.type === 'success'">✅</span>
            <span v-else-if="toast.type === 'error'">❌</span>
            <span v-else-if="toast.type === 'warning'">⚠️</span>
            <span v-else-if="toast.type === 'info'">ℹ️</span>
            <span v-else>🎉</span>
          </div>

          <div class="toast__content">
            <h4 v-if="toast.title" class="toast__title">{{ toast.title }}</h4>
            <p class="toast__message">{{ toast.message }}</p>
          </div>

          <button
            @click="removeToast(toast.id)"
            class="toast__close"
          >
            ×
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'academy';
  title?: string;
  message: string;
  duration?: number;
}

const toasts = ref<Toast[]>([]);

const addToast = (toast: Omit<Toast, 'id'>) => {
  const id = Date.now().toString();
  const newToast = {
    ...toast,
    id,
    duration: toast.duration || 4000
  };

  toasts.value.push(newToast);

  // Auto remove after duration
  setTimeout(() => {
    removeToast(id);
  }, newToast.duration);
};

const removeToast = (id: string) => {
  const index = toasts.value.findIndex(toast => toast.id === id);
  if (index > -1) {
    toasts.value.splice(index, 1);
  }
};

// Expose methods globally
const useToast = () => ({
  success: (message: string, title?: string) => addToast({ type: 'success', message, title }),
  error: (message: string, title?: string) => addToast({ type: 'error', message, title }),
  warning: (message: string, title?: string) => addToast({ type: 'warning', message, title }),
  info: (message: string, title?: string) => addToast({ type: 'info', message, title }),
  academy: (message: string, title?: string) => addToast({ type: 'academy', message, title })
});

onMounted(() => {
  // Make toast globally available
  window.useToast = useToast;
});

defineExpose({ useToast });
</script>

<style lang="scss" scoped>
.toast-container {
  position: fixed;
  top: 2rem;
  right: 2rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 400px;

  @media (max-width: 768px) {
    top: 1rem;
    right: 1rem;
    left: 1rem;
    max-width: none;
  }
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-left: 4px solid;
  backdrop-filter: blur(10px);
  min-width: 300px;

  @media (max-width: 768px) {
    min-width: auto;
  }

  &--success {
    border-left-color: #10b981;
    background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  }

  &--error {
    border-left-color: #ef4444;
    background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%);
  }

  &--warning {
    border-left-color: #f59e0b;
    background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  }

  &--info {
    border-left-color: #3b82f6;
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  }

  &--academy {
    border-left-color: #FF416C;
    background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%);
  }
}

.toast__icon {
  font-size: 1.25rem;
  flex-shrink: 0;
  line-height: 1;
}

.toast__content {
  flex: 1;
  min-width: 0;
}

.toast__title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
  line-height: 1.2;
}

.toast__message {
  font-size: 0.875rem;
  color: #4b5563;
  margin: 0;
  line-height: 1.4;
}

.toast__close {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #9ca3af;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  flex-shrink: 0;
  transition: color 0.2s ease;

  &:hover {
    color: #6b7280;
  }
}

// Animations
.toast-enter-active {
  transition: all 0.3s ease-out;
}

.toast-leave-active {
  transition: all 0.3s ease-in;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>
