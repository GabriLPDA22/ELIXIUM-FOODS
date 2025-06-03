<!-- src/views/BusinessUnauthorized.vue -->
<template>
  <div class="business-unauthorized">
    <div class="business-unauthorized__container">
      <div class="business-unauthorized__icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      </div>

      <h1 class="business-unauthorized__title">No tienes un negocio asignado</h1>

      <p class="business-unauthorized__message">
        Para acceder al dashboard de negocios necesitas tener un restaurante o negocio registrado y asignado a tu cuenta.
      </p>

      <div class="business-unauthorized__user-info">
        <div class="business-unauthorized__user-detail">
          <span class="business-unauthorized__label">Usuario:</span>
          <span class="business-unauthorized__value">{{ userEmail }}</span>
        </div>
      </div>

      <div class="business-unauthorized__help">
        <h3>¿Qué puedes hacer?</h3>
        <ul>
          <li>Registrar un nuevo restaurante o negocio</li>
          <li>Solicitar acceso a un negocio existente</li>
          <li>Contactar con nuestro equipo de soporte</li>
        </ul>
      </div>

      <div class="business-unauthorized__actions">
        <router-link to="/business-register"
          class="business-unauthorized__button business-unauthorized__button--primary">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Registrar Negocio
        </router-link>

        <router-link to="/contact"
          class="business-unauthorized__button business-unauthorized__button--secondary">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22 6 12 13 2 6"></polyline>
          </svg>
          Contactar Soporte
        </router-link>

        <router-link to="/"
          class="business-unauthorized__button business-unauthorized__button--outline">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          Volver al Inicio
        </router-link>
      </div>

      <div class="business-unauthorized__footer">
        <button @click="logout" class="business-unauthorized__logout">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Cambiar de cuenta
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const userEmail = computed(() => {
  return authStore.user?.email || 'No disponible'
})

const userRole = computed(() => {
  return authStore.user?.role || 'Desconocido'
})

const logout = async () => {
  try {
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
    // En caso de error, redirigir igual
    router.push('/login')
  }
}
</script>

<style lang="scss" scoped>
.business-unauthorized {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  &__container {
    max-width: 600px;
    background-color: white;
    border-radius: 16px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    padding: 3rem 2rem;
    text-align: center;
  }

  &__icon {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: rgba(59, 130, 246, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 2rem;
    color: #3b82f6;

    svg {
      width: 40px;
      height: 40px;
    }
  }

  &__title {
    font-size: 1.8rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 1rem;
  }

  &__message {
    font-size: 1.1rem;
    color: #64748b;
    margin-bottom: 2rem;
    line-height: 1.6;
  }

  &__user-info {
    background-color: #f8fafc;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    text-align: left;
  }

  &__user-detail {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__label {
    font-weight: 500;
    color: #64748b;
    font-size: 0.9rem;
  }

  &__value {
    font-weight: 600;
    color: #1e293b;
    font-size: 0.9rem;
  }

  &__help {
    background-color: #f0f9ff;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    text-align: left;

    h3 {
      font-size: 1.1rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 1rem;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        display: flex;
        align-items: center;
        padding: 0.5rem 0;
        color: #475569;
        font-size: 0.95rem;

        &::before {
          content: '✓';
          color: #10b981;
          font-weight: bold;
          margin-right: 0.75rem;
          font-size: 1.1rem;
        }
      }
    }
  }

  &__actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;

    @media (min-width: 480px) {
      flex-direction: row;
      justify-content: center;
      flex-wrap: wrap;
    }
  }

  &__button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 500;
    font-size: 0.95rem;
    text-decoration: none;
    transition: all 0.3s ease;
    white-space: nowrap;

    svg {
      width: 16px;
      height: 16px;
    }

    &--primary {
      background-color: #3b82f6;
      color: white;

      &:hover {
        background-color: #2563eb;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
      }
    }

    &--secondary {
      background-color: #10b981;
      color: white;

      &:hover {
        background-color: #059669;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
      }
    }

    &--outline {
      background-color: transparent;
      color: #64748b;
      border: 1px solid #cbd5e1;

      &:hover {
        background-color: #f1f5f9;
        border-color: #94a3b8;
        color: #475569;
      }
    }
  }

  &__footer {
    padding-top: 1.5rem;
    border-top: 1px solid #e2e8f0;
  }

  &__logout {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: none;
    border: none;
    color: #64748b;
    font-size: 0.9rem;
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.3s ease;

    svg {
      width: 16px;
      height: 16px;
    }

    &:hover {
      background-color: #fef2f2;
      color: #ef4444;
    }
  }
}
</style>
