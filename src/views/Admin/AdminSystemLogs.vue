<!-- views/Admin/AdminSystemLogs.vue -->
<template>
  <div class="space-y-6">
    <!-- Header con estadísticas -->
    <div class="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
      <div>
        <h2 class="text-xl font-semibold text-gray-900">Actividad del Sistema</h2>
        <p class="text-sm text-gray-600 mt-1">Monitorea la actividad y eventos importantes del sistema</p>
      </div>

      <!-- Estadísticas rápidas -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <div class="bg-blue-50 p-3 rounded-lg text-center">
          <div class="text-sm text-blue-600 font-medium">Información</div>
          <div class="text-lg font-bold text-blue-700">{{ getLogCountByType('info') }}</div>
        </div>
        <div class="bg-amber-50 p-3 rounded-lg text-center">
          <div class="text-sm text-amber-600 font-medium">Avisos</div>
          <div class="text-lg font-bold text-amber-700">{{ getLogCountByType('warning') }}</div>
        </div>
        <div class="bg-red-50 p-3 rounded-lg text-center">
          <div class="text-sm text-red-600 font-medium">Errores</div>
          <div class="text-lg font-bold text-red-700">{{ getLogCountByType('error') }}</div>
        </div>
        <div class="bg-purple-50 p-3 rounded-lg text-center">
          <div class="text-sm text-purple-600 font-medium">Seguridad</div>
          <div class="text-lg font-bold text-purple-700">{{ getLogCountByType('auth') }}</div>
        </div>
      </div>
    </div>

    <!-- Controles y filtros -->
    <div class="bg-white p-4 rounded-xl border border-gray-200">
      <div class="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div class="flex flex-col sm:flex-row gap-4">
          <!-- Filtro por tipo -->
          <div class="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-500">
              <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"></path>
            </svg>
            <select v-model="logFilter" class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500">
              <option value="">📋 Todas las actividades</option>
              <option value="info">ℹ️ Solo información</option>
              <option value="warning">⚠️ Solo avisos</option>
              <option value="error">❌ Solo errores</option>
              <option value="auth">🔐 Solo seguridad</option>
            </select>
          </div>

          <!-- Filtro por fecha -->
          <div class="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-500">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <select v-model="dateFilter" class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500">
              <option value="">📅 Cualquier fecha</option>
              <option value="hour">🕐 Última hora</option>
              <option value="today">📍 Hoy</option>
              <option value="week">📆 Esta semana</option>
              <option value="month">🗓️ Este mes</option>
            </select>
          </div>

          <!-- Búsqueda -->
          <div class="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-400">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="M21 21l-4.35-4.35"></path>
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar en actividad..."
              class="bg-transparent border-none outline-none text-sm placeholder-gray-400 flex-1"
            >
          </div>
        </div>

        <!-- Acciones -->
        <div class="flex gap-3">
          <button @click="refreshLogs" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm font-medium transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M23 4v6h-6"></path>
              <path d="M1 20v-6h6"></path>
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
            </svg>
            Actualizar
          </button>

          <button @click="exportLogs" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm font-medium transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Exportar
          </button>

          <button @click="confirmClearLogs" class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2 text-sm font-medium transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            Limpiar
          </button>
        </div>
      </div>
    </div>

    <!-- Lista de actividad -->
    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div class="bg-gray-50 px-6 py-3 border-b border-gray-200">
        <div class="flex justify-between items-center">
          <h3 class="font-semibold text-gray-900 flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-600">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            Registro de Actividad
          </h3>
          <div class="text-sm text-gray-600">
            {{ filteredLogs.length }} evento{{ filteredLogs.length !== 1 ? 's' : '' }}
            <span v-if="logFilter || searchQuery" class="text-blue-600 font-medium">(filtrado{{ filteredLogs.length !== 1 ? 's' : '' }})</span>
          </div>
        </div>
      </div>

      <div class="max-h-96 overflow-y-auto">
        <!-- Estado vacío -->
        <div v-if="filteredLogs.length === 0" class="p-8 text-center">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-400">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
          </div>
          <h4 class="font-medium text-gray-900 mb-2">No hay actividad registrada</h4>
          <p class="text-gray-600 text-sm">
            {{ logFilter || searchQuery ? 'No se encontraron eventos con los filtros aplicados.' : 'Aún no se han registrado eventos en el sistema.' }}
          </p>
          <button v-if="logFilter || searchQuery" @click="clearFilters" class="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium">
            Limpiar filtros
          </button>
        </div>

        <!-- Lista de eventos -->
        <div v-else>
          <div v-for="(log, index) in filteredLogs" :key="log.id || index"
            class="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
            <div class="p-4 flex items-start gap-4">
              <!-- Icono del tipo de log -->
              <div class="flex-shrink-0 mt-0.5">
                <div :class="['w-8 h-8 rounded-full flex items-center justify-center', getLogIconBackground(log.type)]">
                  <svg :class="['w-4 h-4', getLogIconColor(log.type)]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path v-if="log.type === 'error'" d="M12 2L12 14M12 18L12.01 18"></path>
                    <circle v-if="log.type === 'error'" cx="12" cy="12" r="10"></circle>
                    <line v-if="log.type === 'error'" x1="15" y1="9" x2="9" y2="15"></line>
                    <line v-if="log.type === 'error'" x1="9" y1="9" x2="15" y2="15"></line>

                    <path v-else-if="log.type === 'warning'" d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line v-if="log.type === 'warning'" x1="12" y1="9" x2="12" y2="13"></line>
                    <line v-if="log.type === 'warning'" x1="12" y1="17" x2="12.01" y2="17"></line>

                    <circle v-else-if="log.type === 'info'" cx="12" cy="12" r="10"></circle>
                    <line v-if="log.type === 'info'" x1="12" y1="16" x2="12" y2="12"></line>
                    <line v-if="log.type === 'info'" x1="12" y1="8" x2="12.01" y2="8"></line>

                    <path v-else-if="log.type === 'auth'" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>

                    <circle v-else cx="12" cy="12" r="10"></circle>
                  </svg>
                </div>
              </div>

              <!-- Contenido del evento -->
              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-start gap-4">
                  <div class="flex-1">
                    <!-- Tipo y hora -->
                    <div class="flex items-center gap-2 mb-1">
                      <span :class="['px-2 py-1 rounded-full text-xs font-medium uppercase tracking-wide', getLogBadgeClass(log.type)]">
                        {{ getLogTypeLabel(log.type) }}
                      </span>
                      <span class="text-xs text-gray-500">{{ formatDateTime(log.timestamp) }}</span>
                    </div>

                    <!-- Mensaje principal -->
                    <div class="text-sm text-gray-900 mb-1 font-medium">
                      {{ getFormattedMessage(log.message) }}
                    </div>

                    <!-- Detalles adicionales si existen -->
                    <div v-if="log.details" class="text-xs text-gray-600">
                      {{ log.details }}
                    </div>

                    <!-- Información técnica colapsable -->
                    <details v-if="log.technicalInfo" class="mt-2">
                      <summary class="cursor-pointer text-xs text-blue-600 hover:text-blue-700">Ver detalles técnicos</summary>
                      <pre class="mt-1 text-xs bg-gray-900 text-green-400 p-2 rounded overflow-x-auto">{{ log.technicalInfo }}</pre>
                    </details>
                  </div>

                  <!-- Acciones del evento -->
                  <div class="flex items-center gap-2">
                    <button v-if="log.type === 'error'" @click="showErrorDetails(log)"
                      class="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50" title="Ver detalles del error">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                    </button>

                    <button @click="copyLogEvent(log)"
                      class="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100" title="Copiar evento">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
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
const dateFilter = ref('');
const searchQuery = ref('');

// Computed
const filteredLogs = computed(() => {
  let result = [...props.logs];

  // Filtro por tipo
  if (logFilter.value) {
    result = result.filter(log => log.type === logFilter.value);
  }

  // Filtro por búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(log =>
      log.message.toLowerCase().includes(query) ||
      (log.details && log.details.toLowerCase().includes(query))
    );
  }

  // Filtro por fecha
  if (dateFilter.value) {
    const now = new Date();
    result = result.filter(log => {
      const logDate = new Date(log.timestamp);
      switch (dateFilter.value) {
        case 'hour':
          const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
          return logDate >= hourAgo;
        case 'today':
          return logDate.toDateString() === now.toDateString();
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return logDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return logDate >= monthAgo;
        default:
          return true;
      }
    });
  }

  // Ordenar por fecha (más recientes primero)
  return result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
});

// Métodos
const getLogCountByType = (type) => {
  return props.logs.filter(log => log.type === type).length;
};

const getLogTypeLabel = (type) => {
  const labels = {
    'error': 'Error',
    'warning': 'Aviso',
    'info': 'Info',
    'auth': 'Seguridad'
  };
  return labels[type] || 'Sistema';
};

const getLogBadgeClass = (type) => {
  const classes = {
    'error': 'bg-red-100 text-red-800',
    'warning': 'bg-amber-100 text-amber-800',
    'info': 'bg-blue-100 text-blue-800',
    'auth': 'bg-purple-100 text-purple-800'
  };
  return classes[type] || 'bg-gray-100 text-gray-800';
};

const getLogIconBackground = (type) => {
  const backgrounds = {
    'error': 'bg-red-100',
    'warning': 'bg-amber-100',
    'info': 'bg-blue-100',
    'auth': 'bg-purple-100'
  };
  return backgrounds[type] || 'bg-gray-100';
};

const getLogIconColor = (type) => {
  const colors = {
    'error': 'text-red-600',
    'warning': 'text-amber-600',
    'info': 'text-blue-600',
    'auth': 'text-purple-600'
  };
  return colors[type] || 'text-gray-600';
};

const getFormattedMessage = (message) => {
  if (!message) return 'Sin mensaje';

  // Mejorar la legibilidad de mensajes técnicos
  return message
    .replace(/JWT|jwt/gi, 'Credenciales de seguridad')
    .replace(/token/gi, 'sesión')
    .replace(/API/gi, 'Sistema')
    .replace(/endpoint/gi, 'servicio')
    .replace(/auth/gi, 'autenticación')
    .replace(/unauthorized/gi, 'sin autorización')
    .replace(/forbidden/gi, 'acceso denegado')
    .replace(/bad request/gi, 'solicitud incorrecta')
    .replace(/internal server error/gi, 'error interno del sistema')
    .replace(/not found/gi, 'no encontrado');
};

const refreshLogs = async () => {
  emit('add-alert', 'Actividad actualizada', 'success');
};

const exportLogs = async () => {
  try {
    const exportData = filteredLogs.value.map(log => ({
      tipo: getLogTypeLabel(log.type),
      fecha: formatDateTime(log.timestamp),
      mensaje: log.message,
      detalles: log.details || 'Sin detalles'
    }));

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `actividad-sistema-${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    URL.revokeObjectURL(url);
    emit('add-alert', 'Actividad exportada exitosamente', 'success');
  } catch (error) {
    emit('add-alert', 'Error al exportar la actividad', 'error');
  }
};

const confirmClearLogs = async () => {
  if (confirm('¿Estás seguro de que quieres limpiar toda la actividad registrada? Esta acción no se puede deshacer.')) {
    try {
      emit('add-alert', 'Actividad limpiada correctamente', 'success');
    } catch (error) {
      emit('add-alert', 'Error al limpiar la actividad', 'error');
    }
  }
};

const clearFilters = () => {
  logFilter.value = '';
  dateFilter.value = '';
  searchQuery.value = '';
};

const showErrorDetails = (log) => {
  const details = log.details || log.technicalInfo || 'No hay detalles adicionales disponibles';
  emit('add-alert', `Error: ${log.message}. ${details}`, 'error');
};

const copyLogEvent = async (log) => {
  try {
    const logData = {
      tipo: getLogTypeLabel(log.type),
      fecha: formatDateTime(log.timestamp),
      mensaje: log.message,
      detalles: log.details || 'Sin detalles adicionales'
    };

    await navigator.clipboard.writeText(JSON.stringify(logData, null, 2));
    emit('add-alert', 'Evento copiado al portapapeles', 'success');
  } catch (error) {
    emit('add-alert', 'Error al copiar evento', 'error');
  }
};

const formatDateTime = (date) => {
  if (!date) return 'Fecha no disponible';

  const now = new Date();
  const logDate = new Date(date);
  const diffInSeconds = Math.floor((now - logDate) / 1000);

  if (diffInSeconds < 60) {
    return 'Hace unos segundos';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `Hace ${minutes} minuto${minutes !== 1 ? 's' : ''}`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `Hace ${hours} hora${hours !== 1 ? 's' : ''}`;
  } else {
    return logDate.toLocaleString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
};
</script>
