<!-- views/Home.vue -->
<template>
    <div class="home">
        <hero-section />
        <how-it-works-section />
        <categories-section />
        <popular-restaurants-section />
    </div>
</template>

<script setup lang="ts">
import HeroSection from '@/components/feature/home/HeroSection.vue'
import HowItWorksSection from '@/components/feature/home/HowItWorksSection.vue'
import CategoriesSection from '@/components/feature/home/CategoriesSection.vue'
import PopularRestaurantsSection from '@/components/feature/home/PopularRestaurantsSection.vue'
</script>

<style lang="scss" scoped></style>