<!-- components/ui/FilterChips.vue -->
<template>
    <div class="categories-scroll">
      <button 
        v-if="showLeftScroll" 
        @click="scrollCategories('left')" 
        class="categories-scroll__arrow categories-scroll__arrow--left" 
        aria-label="Ver categorías anteriores"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      
      <div class="categories-scroll__container" ref="categoriesContainer">
        <div 
          v-for="category in categories" 
          :key="category.id"
          class="category-item"
          :class="{ 'category-item--active': modelValue === category.id }"
          @click="$emit('update:modelValue', category.id)"
        >
          <div class="category-item__icon">
            <span v-if="category.icon">{{ category.icon }}</span>
            <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
          </div>
          <span class="category-item__name">{{ category.name }}</span>
        </div>
      </div>
      
      <button 
        v-if="showRightScroll" 
        @click="scrollCategories('right')" 
        class="categories-scroll__arrow categories-scroll__arrow--right" 
        aria-label="Ver más categorías"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue';
  
  const props = defineProps({
    categories: {
      type: Array,
      required: true
    },
    modelValue: {
      type: String,
      required: true
    }
  });
  
  defineEmits(['update:modelValue']);
  
  // Scroll state
  const categoriesContainer = ref(null);
  const showLeftScroll = ref(false);
  const showRightScroll = ref(true);
  
  // Check scroll position and update indicators
  const checkScrollPosition = () => {
    if (!categoriesContainer.value) return;
  
    const container = categoriesContainer.value;
    showLeftScroll.value = container.scrollLeft > 10;
    showRightScroll.value = container.scrollLeft < (container.scrollWidth - container.clientWidth - 10);
  };
  
  // Scroll categories left or right
  const scrollCategories = (direction) => {
    if (!categoriesContainer.value) return;
  
    const container = categoriesContainer.value;
    const scrollAmount = container.offsetWidth * 0.75;
  
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  
    // Update scroll indicators after scrolling
    setTimeout(checkScrollPosition, 300);
  };
  
  // Scroll to active category when it changes
  watch(() => props.modelValue, (newVal) => {
    if (!categoriesContainer.value) return;
    
    // Find the index of the active category
    const index = props.categories.findIndex(cat => cat.id === newVal);
    if (index === -1) return;
    
    // Find the element and scroll it into view
    const container = categoriesContainer.value;
    const items = container.querySelectorAll('.category-item');
    if (items[index]) {
      items[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      // Update scroll indicators after scrolling
      setTimeout(checkScrollPosition, 300);
    }
  }, { immediate: false });
  
  onMounted(() => {
    if (categoriesContainer.value) {
      // Check initial scroll state
      checkScrollPosition();
      
      // Add scroll event listener
      categoriesContainer.value.addEventListener('scroll', checkScrollPosition);
      
      // Check again after content has fully loaded
      setTimeout(checkScrollPosition, 300);
    }
  });
  </script>
  
  <style lang="scss" scoped>
  // Variables
  $primary-color: #06C167; // Color principal de Uber Eats
  $black: #000000;
  $white: #FFFFFF;
  $light-gray: #F6F6F6;
  $medium-gray: #EEEEEE;
  $dark-gray: #545454;
  $text-primary: #000000;
  $text-secondary: #757575;
  $transition: all 0.2s ease;
  
  // Categories scroll
  .categories-scroll {
    position: relative;
    display: flex;
    align-items: center;
    
    &__container {
      display: flex;
      gap: 12px;
      overflow-x: auto;
      scrollbar-width: none;
      -ms-overflow-style: none;
      padding: 4px 0;
      scroll-behavior: smooth;
      
      &::-webkit-scrollbar {
        display: none;
      }
    }
    
    &__arrow {
      position: absolute;
      z-index: 2;
      background-color: $white;
      border: 1px solid $medium-gray;
      color: $text-primary;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: $transition;
      
      &:hover {
        background-color: $light-gray;
      }
      
      &--left {
        left: 0;
      }
      
      &--right {
        right: 0;
      }
    }
  }
  
  // Category item
  .category-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    min-width: 80px;
    cursor: pointer;
    transition: $transition;
    
    &__icon {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background-color: $light-gray;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      transition: $transition;
      position: relative;
      overflow: hidden;
      
      &::after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 50%;
        border: 2px solid transparent;
        transition: $transition;
      }
    }
    
    &__name {
      font-size: 12px;
      font-weight: 500;
      color: $text-secondary;
      transition: $transition;
    }
    
    &:hover {
      .category-item__icon {
        background-color: $medium-gray;
      }
    }
    
    &--active {
      .category-item__icon {
        background-color: #EDFCF2;
        
        &::after {
          border-color: $primary-color;
        }
      }
      
      .category-item__name {
        color: $primary-color;
        font-weight: 600;
      }
    }
  }
  </style>