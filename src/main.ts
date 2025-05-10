// src/main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/styles/main.css' // Usa CSS en lugar de SCSS para evitar warnings
// import './assets/styles/main.scss' // O esta opción si prefieres SCSS

const app = createApp(App)

app.use(createPinia())
app.use(router)

// La inicialización del auth ya se hace automáticamente en el store
// según el código que me mostraste, no necesitamos llamarlo aquí

app.mount('#app')
