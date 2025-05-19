<!-- src/views/BusinessForgotPassword.vue -->
<template>
  <div class="business-forgot-password">
    <div class="business-forgot-password__container">
      <div class="business-forgot-password__logo">
        <span class="business-forgot-password__logo-icon">🍽️</span>
        <span class="business-forgot-password__logo-text">Elixium Foods</span>
        <div class="business-forgot-password__logo-subtitle">BUSINESS PORTAL</div>
      </div>

      <h1 class="business-forgot-password__title">Recupera tu contraseña</h1>
      <p class="business-forgot-password__subtitle">
        Introduce tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
      </p>

      <form @submit.prevent="handleForgotPassword" class="business-forgot-password__form">
        <div class="business-forgot-password__form-group">
          <label for="email" class="business-forgot-password__label">Email de negocio</label>
          <input
            type="email"
            id="email"
            v-model="email"
            class="business-forgot-password__input"
            placeholder="restaurant@email.com"
            required
          />
        </div>

        <button
          type="submit"
          class="business-forgot-password__button"
          :disabled="loading"
        >
          <span v-if="loading" class="business-forgot-password__spinner"></span>
          <span v-else>Enviar instrucciones</span>
        </button>
      </form>

      <div v-if="successMessage" class="business-forgot-password__success">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round" class="business-forgot-password__success-icon">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <p>{{ successMessage }}</p>
      </div>

      <div v-if="errorMessage" class="business-forgot-password__error">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round" class="business-forgot-password__error-icon">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <p>{{ errorMessage }}</p>
      </div>

      <div class="business-forgot-password__links">
        <router-link to="/business/login" class="business-forgot-password__back-link">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Volver al inicio de sesión
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const handleForgotPassword = async () => {
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    // En un caso real, aquí llamaríamos a una API para solicitar el restablecimiento de contraseña
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulación de llamada a API

    // Simulamos una respuesta exitosa
    successMessage.value = `Hemos enviado un enlace de recuperación a ${email.value}. Por favor, revisa tu bandeja de entrada.`
    email.value = '' // Limpiamos el campo de email
  } catch (err: any) {
    errorMessage.value = err.message || 'Ha ocurrido un error. Inténtalo de nuevo más tarde.'
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.business-forgot-password {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f7f7f7;

  &__container {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    padding: 40px;
    width: 100%;
    max-width: 420px;
    text-align: center;
  }

  &__logo {
    margin-bottom: 24px;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
  }

  &__logo-icon {
    font-size: 36px;
    margin-bottom: 8px;
  }

  &__logo-text {
    font-size: 28px;
    font-weight: 800;
    background: linear-gradient(to right, #FF416C, #FF4B2B);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    letter-spacing: -0.03em;
  }

  &__logo-subtitle {
    font-size: 12px;
    letter-spacing: 1px;
    font-weight: 600;
    color: #757575;
    margin-top: 4px;
  }

  &__title {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 12px;
    color: #333;
  }

  &__subtitle {
    font-size: 14px;
    color: #666;
    margin-bottom: 24px;
    line-height: 1.5;
  }

  &__form {
    text-align: left;
    margin-bottom: 20px;
  }

  &__form-group {
    margin-bottom: 20px;
    position: relative;
  }

  &__label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 8px;
    color: #333;
  }

  &__input {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
    transition: border-color 0.2s;

    &:focus {
      border-color: #FF416C;
      outline: none;
      box-shadow: 0 0 0 2px rgba(255, 65, 108, 0.2);
    }
  }

  &__button {
    width: 100%;
    padding: 14px;
    background-color: #06a98d;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
    position: relative;
    margin-top: 16px;

    &:hover {
      background-color: #058a73;
    }

    &:disabled {
      background-color: #88d8ca;
      cursor: not-allowed;
    }
  }

  &__spinner {
    display: inline-block;
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 0.8s linear infinite;
  }

  &__success, &__error {
    margin: 20px 0;
    padding: 14px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    text-align: left;

    p {
      margin: 0 0 0 12px;
      font-size: 14px;
      line-height: 1.5;
    }
  }

  &__success {
    background-color: #ecfdf5;
    color: #059669;

    &-icon {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
      color: #059669;
    }
  }

  &__error {
    background-color: #fef2f2;
    color: #dc2626;

    &-icon {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
      color: #dc2626;
    }
  }

  &__links {
    margin-top: 24px;
    display: flex;
    justify-content: center;
  }

  &__back-link {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #06a98d;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }

    svg {
      width: 16px;
      height: 16px;
      margin-right: 6px;
    }
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
