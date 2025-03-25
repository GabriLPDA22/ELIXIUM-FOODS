<!-- src/App.vue -->
<template>
    <div class="app">
        <UHeader />
        <main class="app__content">
            <router-view v-slot="{ Component }">
                <transition name="fade" mode="out-in">
                    <component :is="Component" />
                </transition>
            </router-view>
        </main>
        <UFooter />
    </div>
</template>

<script setup lang="ts">
import UHeader from '@/components/layout/UHeader.vue'
import UFooter from '@/components/layout/UFooter.vue'
</script>

<style lang="scss">
// Global reset and base styles
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #333;
    background-color: #fff;
    line-height: 1.6;
}

.app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;

    &__content {
        flex: 1;
        margin-top: 4rem; // Adjust based on header height
        padding-top: 1rem;
    }
}

// Route transition animations
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

// Accessibility and focus states
:focus {
    outline: 2px solid #FF6B6B;
    outline-offset: 2px;
}

// Responsive typography
html {
    font-size: 16px;

    @media (max-width: 768px) {
        font-size: 14px;
    }
}
</style>