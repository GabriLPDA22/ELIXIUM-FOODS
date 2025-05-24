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

        <!-- ✅ NUEVO: Modal del sistema de tutorial -->
        <TutorialModal />
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import UHeader from '@/components/layout/UHeader.vue'
import UFooter from '@/components/layout/UFooter.vue'
// ✅ NUEVO: Importar componente y store del tutorial
import TutorialModal from '@/components/TutorialModal.vue'
import { useTutorialStore } from '@/stores/tutorial'

// ✅ NUEVO: Inicializar el sistema de tutorial
const tutorialStore = useTutorialStore()

onMounted(() => {
    // Esperar un poco para que la página cargue completamente
    setTimeout(() => {
        // Verificar si debe mostrar el prompt de tutorial
        tutorialStore.checkAndShowIntroPrompt()
    }, 2000) // 2 segundos después de que la app carga
})
</script>

<style lang="scss">
// Fuentes personalizadas - podrías importar una fuente desde Google Fonts
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

// Variables globales
:root {
    --primary: #FF416C;
    --primary-dark: #E3305A;
    --primary-gradient: linear-gradient(to right, #FF416C, #FF4B2B);

    --secondary: #0652DD;
    --secondary-dark: #0543B5;
    --secondary-gradient: linear-gradient(to right, #0652DD, #12CBC4);

    --accent: #FFA502;
    --accent-dark: #E5940C;

    --dark: #1e293b;
    --medium: #64748b;
    --light: #f8fafc;
    --white: #ffffff;

    --success: #10b981;
    --warning: #f59e0b;
    --error: #ef4444;
    --info: #3b82f6;

    --border-radius-sm: 8px;
    --border-radius: 12px;
    --border-radius-lg: 16px;
    --border-radius-xl: 24px;

    --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.05);
    --shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
    --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.12);
    --shadow-xl: 0 20px 40px rgba(0, 0, 0, 0.15);

    --transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
}

// Reset y estilos base
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html {
    font-size: 16px;
    scroll-behavior: smooth;

    @media (max-width: 768px) {
        font-size: 15px;
    }

    @media (max-width: 480px) {
        font-size: 14px;
    }
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: var(--dark);
    background-color: var(--light);
    line-height: 1.6;
    overflow-x: hidden;
}

// Estructura principal
.app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;

    &__content {
        flex: 1;
        margin-top: 70px; // Altura del header
        min-height: calc(100vh - 70px); // Asegura que cubra el espacio restante
    }
}

// Scrollbar personalizado
::-webkit-scrollbar {
    width: 10px;
    height: 10px;
}

::-webkit-scrollbar-track {
    background-color: #f1f5f9;
    border-radius: 10px;
}

::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
    transition: background 0.3s ease;

    &:hover {
        background: #94a3b8;
    }
}

// Animaciones de transición para router-view
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(10px);
}

// Espaciado por defecto para container
.container {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;

    @media (max-width: 768px) {
        padding: 0 1.5rem;
    }

    @media (max-width: 480px) {
        padding: 0 1rem;
    }
}

// Títulos y tipografía
h1,
h2,
h3,
h4,
h5,
h6 {
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 1rem;
}

h1 {
    font-size: 3rem;

    @media (max-width: 768px) {
        font-size: 2.5rem;
    }

    @media (max-width: 480px) {
        font-size: 2rem;
    }
}

h2 {
    font-size: 2.25rem;

    @media (max-width: 768px) {
        font-size: 1.85rem;
    }
}

h3 {
    font-size: 1.5rem;

    @media (max-width: 768px) {
        font-size: 1.35rem;
    }
}

p {
    margin-bottom: 1rem;
}

// Enlaces
a {
    color: var(--primary);
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
        color: var(--primary-dark);
    }
}

// Botones generales
button {
    cursor: pointer;
    font-family: inherit;
}

// Imágenes
img {
    max-width: 100%;
    height: auto;
}

// Estados de accesibilidad y focus
:focus {
    outline: 2px solid rgba(var(--primary), 0.5);
    outline-offset: 2px;
}

// Utilidades
.text-gradient {
    background: var(--primary-gradient);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
}

.text-center {
    text-align: center;
}

.text-right {
    text-align: right;
}

.hidden {
    display: none !important;
}

.visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
}

/* ✅ NUEVO: Estilos personalizados para el tutorial */
.driver-popover {
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-xl);
    font-family: inherit;
}

.driver-popover-title {
    font-weight: 600;
    font-size: 1.1rem;
}

.driver-popover-description {
    font-size: 0.95rem;
    line-height: 1.5;
}

.driver-popover-next-btn,
.driver-popover-prev-btn,
.driver-popover-close-btn {
    border-radius: var(--border-radius-sm);
    font-weight: 500;
    transition: var(--transition);
}

.driver-popover-next-btn {
    background: var(--primary-gradient) !important;
    border: none !important;
}

.driver-popover-next-btn:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow);
}

// Estilos para dark mode (podría implementarse después)
@media (prefers-color-scheme: dark) {
    :root {
    }
}


</style>
