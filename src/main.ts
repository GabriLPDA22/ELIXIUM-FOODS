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
app.mount('#app')
