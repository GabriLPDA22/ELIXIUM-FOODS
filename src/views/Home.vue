<!-- views/Home.vue -->
<template>
  <div class="home">
    <hero-section />
    <how-it-works-section />
    <categories-section :categories="homeStore.categories" :is-loading="homeStore.isLoading" />
    <popular-restaurants-section :restaurants="homeStore.popularRestaurants" :is-loading="homeStore.isLoading" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useHomeStore } from '@/stores/homeStore'
import HeroSection from '@/components/feature/home/HeroSection.vue'
import HowItWorksSection from '@/components/feature/home/HowItWorksSection.vue'
import CategoriesSection from '@/components/feature/home/CategoriesSection.vue'
import PopularRestaurantsSection from '@/components/feature/home/PopularRestaurantsSection.vue'

const homeStore = useHomeStore()

onMounted(() => {
  homeStore.initialize()
})
</script>

<style lang="scss" scoped></style>
