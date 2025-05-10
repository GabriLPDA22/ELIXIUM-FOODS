<!-- src/views/NotFound.vue -->
<template>
  <div class="not-found">
    <div class="not-found-content">
      <div class="not-found-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <h1>404</h1>
      <h2>Página no encontrada</h2>
      <p>Lo sentimos, la página que estás buscando no existe o ha sido movida.</p>
      <router-link to="/" class="back-button">Volver al inicio</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
// No se requiere lógica adicional
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8fafc;
  padding: 20px;
}

.not-found-content {
  text-align: center;
  max-width: 500px;
}

.not-found-icon {
  width: 80px;
  height: 80px;
  color: #ef4444;
  margin: 0 auto 20px;
}

h1 {
  font-size: 6rem;
  font-weight: 900;
  color: #ef4444;
  margin: 0;
  line-height: 1;
}

h2 {
  font-size: 2rem;
  color: #1e293b;
  margin: 10px 0 20px;
}

p {
  color: #64748b;
  margin-bottom: 30px;
  font-size: 1.1rem;
}

.back-button {
  display: inline-block;
  background: linear-gradient(to right, #FF416C, #FF4B2B);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s;
}

.back-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(255, 65, 108, 0.2);
}
</style>
