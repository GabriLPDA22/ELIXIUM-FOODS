<template>
  <div class="search-box" ref="searchBoxRef">
    <div class="search-box__container">
      <div class="search-box__input-wrapper">
        <div class="search-box__icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <input
          type="text"
          v-model="searchQuery"
          @input="handleInput"
          @focus="handleFocus"
          @keydown="handleKeydown"
          :placeholder="placeholder"
          class="search-box__input"
          autocomplete="off"
        />
        <button
          v-if="searchQuery"
          @click="clearSearch"
          class="search-box__clear"
          type="button"
          aria-label="Limpiar búsqueda"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <button
        @click="performSearch"
        :disabled="!searchQuery.trim()"
        class="search-box__button"
        type="button"
      >
        <span v-if="!isSearching">{{ buttonText }}</span>
        <div v-else class="search-box__spinner"></div>
        <svg v-if="!isSearching" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-box__button-arrow">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>
    </div>
    <transition name="dropdown">
      <div v-if="showSuggestions && (suggestions.length > 0 || popularSearches.length > 0 || quickCategories.length > 0)"
           class="search-box__dropdown">
        <div v-if="suggestions.length > 0" class="suggestion-group">
          <div class="suggestion-group__header">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            Sugerencias
          </div>
          <button
            v-for="(suggestion, index) in suggestions.slice(0, 5)"
            :key="`suggestion-${index}`"
            @click="selectSuggestion(suggestion)"
            :class="['suggestion-item', { 'suggestion-item--active': selectedIndex === index }]"
          >
            <span class="suggestion-item__text">{{ suggestion }}</span>
          </button>
        </div>
        <div v-if="!searchQuery && popularSearches.length > 0" class="suggestion-group">
          <div class="suggestion-group__header">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="20" y1="8" x2="20" y2="14"></line>
              <line x1="23" y1="11" x2="17" y2="11"></line>
            </svg>
            Búsquedas populares
          </div>
          <button
            v-for="(popular, index) in popularSearches.slice(0, 6)"
            :key="`popular-${index}`"
            @click="selectSuggestion(popular)"
            class="suggestion-item suggestion-item--popular"
          >
            <span class="suggestion-item__icon">🔥</span>
            <span class="suggestion-item__text">{{ popular }}</span>
          </button>
        </div>
        <div v-if="!searchQuery && quickCategories.length > 0" class="suggestion-group">
          <div class="suggestion-group__header">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20l-3.5-3-3.5 3V2Z"></path>
            </svg>
            Explorar categorías
          </div>
          <div class="category-grid">
            <button
              v-for="category in quickCategories"
              :key="category.id"
              @click="searchByCategory(category)"
              class="category-quick"
            >
              <span class="category-quick__icon">{{ category.icon }}</span>
              <span class="category-quick__name">{{ category.name }}</span>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { searchService } from '@/services/searchService';

interface Props {
  placeholder?: string;
  buttonText?: string;
  autoFocus?: boolean;
  size?: 'default' | 'large';
}

interface Category {
  id: number;
  name: string;
  icon: string;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Buscar restaurantes, platos, cocinas...',
  buttonText: 'Buscar',
  autoFocus: false,
  size: 'default'
});

const emit = defineEmits<{
  search: [query: string];
  focus: [];
  blur: [];
}>();

const router = useRouter();
const searchBoxRef = ref<HTMLElement>();
const searchQuery = ref('');
const suggestions = ref<string[]>([]);
const popularSearches = ref<string[]>([]);
const showSuggestions = ref(false);
const selectedIndex = ref(-1);
const isSearching = ref(false);
const debounceTimer = ref<ReturnType<typeof setTimeout>>();

const quickCategories: Category[] = [
  { id: 1, name: 'Americano', icon: '🍔' },
  { id: 2, name: 'Italiano', icon: '🍕' },
  { id: 3, name: 'Mexicano', icon: '🌮' },
  { id: 4, name: 'Asiático', icon: '🍜' },
  { id: 5, name: 'Fast Food', icon: '🍟' },
  { id: 6, name: 'Saludable', icon: '🥗' }
];

const handleInput = () => {
  selectedIndex.value = -1;
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value);
  }
  debounceTimer.value = setTimeout(async () => {
    if (searchQuery.value.trim().length >= 2) {
      try {
        suggestions.value = await searchService.getSuggestions(searchQuery.value);
      } catch (error) {
        console.error('Error al obtener sugerencias:', error);
        suggestions.value = [];
      }
    } else {
      suggestions.value = [];
    }
  }, 300);
};

const handleFocus = () => {
  showSuggestions.value = true;
  emit('focus');
  if (!searchQuery.value && popularSearches.value.length === 0) {
    loadPopularSearches();
  }
};

const handleKeydown = (event: KeyboardEvent) => {
  const itemsInDropdown = suggestions.value.length + (!searchQuery.value && popularSearches.value.length > 0 ? popularSearches.value.length : 0);
  if (!showSuggestions.value || itemsInDropdown === 0) return;

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      selectedIndex.value = (selectedIndex.value + 1) % itemsInDropdown;
      break;
    case 'ArrowUp':
      event.preventDefault();
      selectedIndex.value = (selectedIndex.value - 1 + itemsInDropdown) % itemsInDropdown;
      break;
    case 'Enter':
      event.preventDefault();
      if (selectedIndex.value >= 0) {
        let selectedItem: string | undefined;
        if (suggestions.value.length > 0 && selectedIndex.value < suggestions.value.length) {
            selectedItem = suggestions.value[selectedIndex.value];
        } else if (!searchQuery.value && popularSearches.value.length > 0) {
            const popularIndex = selectedIndex.value - suggestions.value.length;
            if (popularIndex >= 0 && popularIndex < popularSearches.value.length) {
                 selectedItem = popularSearches.value[popularIndex];
            }
        }
        if (selectedItem) selectSuggestion(selectedItem);
      } else if (searchQuery.value.trim()) {
        performSearch();
      }
      break;
    case 'Escape':
      showSuggestions.value = false;
      selectedIndex.value = -1;
      break;
  }
};

const selectSuggestion = (suggestion: string) => {
  searchQuery.value = suggestion;
  showSuggestions.value = false;
  selectedIndex.value = -1;
  nextTick(() => {
    performSearch();
  });
};

const searchByCategory = (category: Category) => {
  showSuggestions.value = false;
  router.push({
    path: '/restaurants',
    query: { category: category.id.toString() }
  });
};

const clearSearch = () => {
  searchQuery.value = '';
  suggestions.value = [];
  selectedIndex.value = -1;
  const input = searchBoxRef.value?.querySelector('.search-box__input') as HTMLInputElement;
  input?.focus();
};

const performSearch = async () => {
  if (!searchQuery.value.trim()) return;
  isSearching.value = true;
  showSuggestions.value = false;
  try {
    emit('search', searchQuery.value.trim());
    await router.push({
      path: '/search',
      query: { q: searchQuery.value.trim() }
    });
  } catch (error) {
    console.error('Error al realizar búsqueda:', error);
  } finally {
    isSearching.value = false;
  }
};

const loadPopularSearches = async () => {
  try {
    popularSearches.value = await searchService.getPopularSearches();
  } catch (error) {
    console.error('Error al cargar búsquedas populares:', error);
    popularSearches.value = [];
  }
};

const handleClickOutside = (event: MouseEvent) => {
  if (searchBoxRef.value && !searchBoxRef.value.contains(event.target as Node)) {
    showSuggestions.value = false;
    emit('blur');
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  if (props.autoFocus) {
    nextTick(() => {
      const input = searchBoxRef.value?.querySelector('.search-box__input') as HTMLInputElement;
      input?.focus();
    });
  }
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value);
  }
});

watch(() => props.autoFocus, (newValue) => {
  if (newValue) {
    nextTick(() => {
      const input = searchBoxRef.value?.querySelector('.search-box__input') as HTMLInputElement;
      input?.focus();
    });
  }
});
</script>

<style lang="scss" scoped>
.search-box {
  position: relative;
  width: 100%;
  max-width: 700px; // Aumentado ligeramente para mejor aspecto en desktop
  margin: 2rem auto; // Añadido margen vertical para separación
  z-index: 100;
}

.search-box__container {
  display: flex;
  border-radius: 28px; // Ligeramente menos redondeado para un look más moderno
  overflow: hidden; // Para asegurar que los hijos no rompan el border-radius
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08); // Sombra más suave
  background: white;
  transition: box-shadow 0.3s ease;
  position: relative;

  &:hover,
  &:focus-within {
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
  }

  @media (max-width: 767px) {
    flex-direction: column;
    border-radius: 20px; // Bordes para móvil
  }
}

.search-box__input-wrapper {
  flex: 1;
  position: relative;
  display: flex; // Para alinear el icono y el input
  align-items: center; // Alinear verticalmente
  // No necesita su propio background si el container ya lo tiene
}

.search-box__icon {
  position: absolute; // Mantenemos absoluto para superponer si es necesario
  left: 1.2rem;
  top: 50%;
  transform: translateY(-50%);
  color: #FF416C;
  pointer-events: none; // Para que no interfiera con el click del input

  @media (max-width: 767px) {
    left: 1rem;
  }
}

.search-box__input {
  width: 100%;
  border: none;
  outline: none;
  padding: 1.2rem 3rem 1.2rem 3.5rem; // Ajustado padding
  font-size: 1rem;
  font-weight: 500;
  color: #1e293b;
  background: transparent;
  line-height: 1.5; // Mejorar alineación vertical del texto

  @media (max-width: 767px) {
    padding: 1.1rem 2.8rem 1.1rem 3.2rem; // Padding ajustado para móvil
    font-size: 0.95rem;
  }
  &::placeholder {
    color: #94a3b8;
    font-weight: 400;
  }
}

.search-box__clear {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 0.4rem; // Área de toque ligeramente mayor
  border-radius: 50%;
  transition: all 0.2s ease;
  z-index: 2;

  &:hover {
    background-color: rgba(255, 65, 108, 0.1);
    color: #FF416C;
  }
  svg { // Asegurar tamaño del icono
    display: block;
  }
}

.search-box__button {
  background: linear-gradient(to right, #FF416C, #FF4B2B);
  color: white;
  border: none;
  padding: 1.2rem 1.8rem; // Padding ajustado
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease, opacity 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem; // Espacio entre texto e icono
  line-height: 1.5; // Coincidir con input

  @media (max-width: 767px) {
    width: 100%; // Ocupar todo el ancho en móvil
    padding: 1.1rem 1.5rem;
    font-size: 0.95rem;
    // border-radius ya se maneja por el contenedor padre en modo columna
  }

  &:hover:not(:disabled) {
    background: linear-gradient(to right, #FF416C #FF4B2B, 5%);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .search-box__button-arrow { // Clase específica para la flecha
    transition: transform 0.3s ease;
  }

  &:hover:not(:disabled) .search-box__button-arrow {
    transform: translateX(3px);
  }
}

.search-box__spinner {
  width: 18px; // Ligeramente más grande
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite; // Un poco más rápido
}

.search-box__dropdown {
  position: absolute;
  top: calc(100% + 10px); // Un poco más de espacio
  left: 0;
  right: 0;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12); // Sombra consistente
  z-index: 105; // Asegurar que esté encima de .search-box pero debajo de otros modales si los hubiera
  max-height: 220px; // Ligeramente menor
  overflow-y: auto;
  border: 1px solid #e9ecef; // Borde más suave

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: #f8fafc;
    border-radius: 0 16px 16px 0;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
}

.suggestion-group {
  padding: 0.5rem 0; // Reducido padding vertical
  &:not(:last-child) {
    border-bottom: 1px solid #f1f5f9;
  }
  &__header {
    display: flex;
    align-items: center;
    gap: 0.6rem; // Ajustado gap
    padding: 0.6rem 1rem; // Ajustado padding
    font-size: 0.7rem; // Ligeramente más pequeño
    font-weight: 600;
    color: #475569; // Color más oscuro para mejor contraste
    text-transform: uppercase;
    letter-spacing: 0.06em; // Ajustado espaciado
    svg { // Iconos en header un poco más pequeños
        width: 13px;
        height: 13px;
    }
  }
}

.suggestion-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 1rem; // Ajustado padding
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
  font-size: 0.875rem; // Tamaño de fuente base
  color: #334155;

  &:hover,
  &--active {
    background-color: #fff слой; // Usar un color más sutil, ej: #f8f9fa o el color primario muy diluido
    color: #e63946; // Color de hover/active más fuerte
  }
  &__icon {
    font-size: 0.875rem; // Coincidir con texto
    margin-right: 0.25rem; // Pequeño ajuste
  }
  &__text {
    flex: 1;
    font-weight: 500;
  }
  &--popular {
    .suggestion-item__text {
      color: #1e293b; // Texto popular un poco más oscuro
    }
    &:hover .suggestion-item__text,
    &--active .suggestion-item__text {
      color: #e63946;
    }
  }
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); // Ajustado minmax
  gap: 0.6rem; // Ajustado gap
  padding: 0.5rem 1rem 0.75rem; // Ajustado padding
}

.category-quick {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  padding: 0.6rem 0.4rem; // Ajustado padding
  background: #f8fafc;
  border: 1px solid #e9ecef; // Borde más suave
  border-radius: 12px; // Ligeramente más redondeado
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  min-height: 75px; // Ajustada altura

  &:hover {
    border-color: #FF6B2B;
    background-color: #fff7ed;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 107, 43, 0.15); // Sombra más pronunciada en hover
  }
  &__icon {
    font-size: 1.3rem; // Ajustado tamaño
  }
  &__name {
    font-size: 0.7rem; // Ligeramente más pequeño para más espacio
    font-weight: 500;
    color: #475569;
    text-align: center;
    line-height: 1.3; // Mejorado line-height
  }
  &:hover &__name {
    color: #FF6B2B;
  }
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease; // Transición más simple
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px); // Movimiento sutil
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
