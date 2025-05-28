<!-- views/admin/AdminLogs.vue -->
<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-semibold text-gray-900">Logs del Sistema</h2>
      <div class="flex gap-4">
        <select v-model="logFilter" class="px-3 py-2 border border-gray-300 rounded-md">
          <option value="">Todos los logs</option>
          <option value="info">Información</option>
          <option value="warning">Advertencias</option>
          <option value="error">Errores</option>
          <option value="auth">Autenticación</option>
        </select>
        <button @click="clearLogs" class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
          Limpiar Logs
        </button>
      </div>
    </div>

    <div class="bg-gray-900 rounded-lg overflow-hidden">
      <div class="max-h-96 overflow-y-auto">
        <div v-for="log in filteredLogs" :key="log.id"
          :class="['p-3 border-b border-gray-800 font-mono text-sm', getLogClass(log.type)]">
          <div class="flex items-start gap-4">
            <span class="text-gray-400 shrink-0">{{ formatDateTime(log.timestamp) }}</span>
            <span class="uppercase font-bold shrink-0" :class="getLogLabelClass(log.type)">{{ log.type }}</span>
            <span class="text-gray-300">{{ log.message }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// Props
const props = defineProps({
  logs: {
    type: Array,
    required: true
  }
});

// Emits
const emit = defineEmits(['add-alert']);

// Estados
const logFilter = ref('');

// Computed
const filteredLogs = computed(() => {
  if (!logFilter.value) return props.logs;
  return props.logs.filter(log => log.type === logFilter.value);
});

// Métodos
const clearLogs = async () => {
  if (confirm('¿Estás seguro de que quieres limpiar todos los logs?')) {
    try {
      // Aquí podríamos hacer una llamada a la API para limpiar los logs
      // Pero como es simulado, solo notificamos
      emit('add-alert', 'Logs limpiados correctamente', 'success');
    } catch (error) {
      emit('add-alert', 'Error al limpiar logs', 'error');
    }
  }
};

// Utilidades
const getLogClass = (type) => {
  const classes = {
    'error': 'text-red-400',
    'warning': 'text-yellow-400',
    'info': 'text-green-400',
    'auth': 'text-blue-400'
  };
  return classes[type] || 'text-gray-400';
};

const getLogLabelClass = (type) => {
  const classes = {
    'error': 'text-red-500',
    'warning': 'text-yellow-500',
    'info': 'text-green-500',
    'auth': 'text-blue-500'
  };
  return classes[type] || 'text-gray-500';
};

const formatDateTime = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleString('es-ES');
};
</script>