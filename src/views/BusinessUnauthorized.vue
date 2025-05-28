<!-- src/views/BusinessUnauthorized.vue -->
<template>
  <div class="business-unauthorized">
    <div class="business-unauthorized__container">
      <div class="business-unauthorized__icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <h1 class="business-unauthorized__title">Acceso no autorizado</h1>
      <p class="business-unauthorized__message">
        No tienes permisos para acceder a esta sección del portal de restaurantes.
      </p>
      <div class="business-unauthorized__actions">
        <router-link to="/business/dashboard"
          class="business-unauthorized__button business-unauthorized__button--primary">
          Volver al Dashboard
        </router-link>
        <button @click="logout" class="business-unauthorized__button business-unauthorized__button--secondary">
          Cerrar sesión
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useBusinessAuthStore } from '@/stores/businessAuth'

const router = useRouter()
const businessAuthStore = useBusinessAuthStore()

const logout = async () => {
  await businessAuthStore.logout()
  router.push('/business/login')
}
</script>

<style lang="scss" scoped>
.business-unauthorized {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: #f8fafc;

  &__container {
    max-width: 500px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    padding: 3rem 2rem;
    text-align: center;
  }

  &__icon {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: #fef2f2;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.5rem;

    svg {
      width: 40px;
      height: 40px;
      color: #ef4444;
    }
  }

  &__title {
    font-size: 1.75rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 1rem;
  }

  &__message {
    font-size: 1.1rem;
    color: #64748b;
    margin-bottom: 2rem;
    line-height: 1.5;
  }

  &__actions {
    display: flex;
    gap: 1rem;
    justify-content: center;

    @media (max-width: 480px) {
      flex-direction: column;
    }
  }

  &__button {
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    font-size: 1rem;
    transition: all 0.2s ease;
    cursor: pointer;
    text-decoration: none;

    &--primary {
      background-color: #06a98d;
      color: white;
      border: none;

      &:hover {
        background-color: #058a73;
      }
    }

    &--secondary {
      background-color: white;
      color: #64748b;
      border: 1px solid #e2e8f0;

      &:hover {
        background-color: #f1f5f9;
        color: #1e293b;
      }
    }
  }
}
</style>
