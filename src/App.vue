<!-- src/App.vue -->
<template>
    <div class="app">
        <UHeader />
        <main class="content-container">
            <router-view />
        </main>
        <UFooter />
    </div>
</template>

<script setup lang="ts">
import UHeader from '@/components/layout/UHeader.vue'
import UFooter from '@/components/layout/UFooter.vue'
</script>

<style lang="scss">
.app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.content-container {
    flex: 1;
    padding: 1rem;
}
</style>