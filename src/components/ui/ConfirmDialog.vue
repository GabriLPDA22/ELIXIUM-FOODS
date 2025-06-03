<template>
  <Teleport to="body">
    <!-- Fondo semitransparente -->
    <div v-if="visible" class="confirm-overlay">
      <!-- Caja del diálogo -->
      <div class="confirm-dialog">
        <!-- Título -->
        <h3 class="confirm-title">{{ title }}</h3>
        <!-- Mensaje -->
        <p class="confirm-message">{{ message }}</p>
        <!-- Botones -->
        <div class="confirm-buttons">
          <!-- Botón Cancelar -->
          <button @click="onCancel" class="btn-cancel">
            {{ cancelText }}
          </button>
          <!-- Botón Confirmar -->
          <button @click="onConfirm" class="btn-confirm">
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

interface Props {
  visible: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const onConfirm = () => {
  emit('confirm')
}

const onCancel = () => {
  emit('cancel')
}
</script>

<style scoped>
/* Fondo semitransparente */
.confirm-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

/* Caja del diálogo */
.confirm-dialog {
  background-color: #ffffff;
  border-radius: 1rem; /* 16px de radio */
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  max-width: 400px;
  width: 90%;
  padding: 24px;
  box-sizing: border-box;
}

/* Título */
.confirm-title {
  margin: 0 0 12px 0;
  font-size: 1.125rem; /* 18px */
  font-weight: 600;
  color: #333333;
}

/* Mensaje */
.confirm-message {
  margin: 0 0 20px 0;
  font-size: 1rem; /* 16px */
  line-height: 1.5;
  color: #555555;
}

/* Contenedor de botones */
.confirm-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* Botón Cancelar */
.btn-cancel {
  background-color: #f5f5f5;
  color: #333333;
  border: 1px solid #cccccc;
  border-radius: 0.75rem; /* 12px */
  padding: 8px 16px;
  font-size: 0.9375rem; /* 15px */
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.btn-cancel:hover {
  background-color: #e0e0e0;
}

/* Botón Confirmar */
.btn-confirm {
  background-color: #ff497c; /* color rosa intenso similar al de Toast */
  color: #ffffff;
  border: none;
  border-radius: 0.75rem; /* 12px */
  padding: 8px 16px;
  font-size: 0.9375rem; /* 15px */
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.btn-confirm:hover {
  background-color: #e63d70; /* un tono ligeramente más oscuro al pasar el ratón */
}
</style>
