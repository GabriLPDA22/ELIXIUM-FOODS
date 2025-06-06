<!-- src/views/ForgotPassword.vue -->
<template>
  <div class="forgot-password-view">
    <div class="forgot-password-background">
      <div class="forgot-password-background__shape forgot-password-background__shape--1"></div>
      <div class="forgot-password-background__shape forgot-password-background__shape--2"></div>
      <div class="forgot-password-background__shape forgot-password-background__shape--3"></div>
      <div class="forgot-password-background__shape forgot-password-background__shape--4"></div>
      <div class="forgot-password-background__shape forgot-password-background__shape--5"></div>
      <div class="forgot-password-background__shape forgot-password-background__shape--6"></div>
    </div>

    <section class="forgot-password-content">
      <div class="container">
        <div class="forgot-password-card">
          <div class="forgot-password-card__header">
            <div class="forgot-password-card__icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <h2 class="forgot-password-card__title">Recuperar Contraseña</h2>
            <p class="forgot-password-card__subtitle">Te enviaremos instrucciones para restablecer tu contraseña</p>
          </div>

          <form @submit.prevent="handleResetPassword" class="forgot-password-form">
            <div v-if="error" class="forgot-password-form__alert">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{{ error }}</span>
            </div>

            <div v-if="successMessage" class="forgot-password-form__success">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span>{{ successMessage }}</span>
            </div>

            <div class="forgot-password-form__group">
              <label for="email" class="forgot-password-form__label">Email</label>
              <div class="forgot-password-form__input-wrapper">
                <svg class="forgot-password-form__icon" width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <input v-model="email" type="email" id="email" class="forgot-password-form__input"
                  placeholder="tu@email.com" required />
              </div>
            </div>

            <div class="forgot-password-form__submit">
              <button type="submit" class="forgot-password-form__button" :disabled="loading">
                <div v-if="loading" class="forgot-password-form__spinner"></div>
                <span v-else>Enviar Instrucciones</span>
              </button>
            </div>
          </form>

          <div class="forgot-password-card__footer">
            <p class="forgot-password-card__back">
              <router-link to="/login" class="forgot-password-card__back-link">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Volver al inicio de sesión
              </router-link>
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import authService from '@/services/authService';

const router = useRouter();

// Estado para el formulario
const email = ref('');
const loading = ref(false);
const error = ref('');
const successMessage = ref('');

// Validación de email
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Manejar la solicitud de restablecimiento
const handleResetPassword = async () => {
  try {
    loading.value = true;
    error.value = '';
    successMessage.value = '';

    // Validaciones del lado del cliente
    const emailValue = email.value.trim();

    if (!emailValue) {
      error.value = 'Por favor ingresa tu correo electrónico.';
      return;
    }

    if (!isValidEmail(emailValue)) {
      error.value = 'Por favor ingresa un correo electrónico válido.';
      return;
    }

    console.log('Enviando solicitud de restablecimiento de contraseña para:', emailValue);

    // Llamar al servicio de autenticación
    const result = await authService.forgotPassword(emailValue);

    if (result.success) {
      // Mostrar mensaje de éxito
      successMessage.value = result.message;

      // Limpiar el campo de email después de enviar
      email.value = '';

      // Opcional: redirigir después de unos segundos
      setTimeout(() => {
        router.push('/login');
      }, 8000); // 8 segundos para que el usuario pueda leer el mensaje

    } else {
      error.value = result.message;
    }

  } catch (err: any) {
    console.error('Error inesperado al solicitar restablecimiento:', err);
    error.value = 'Ha ocurrido un error inesperado. Por favor, intenta nuevamente.';
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
$forgot-primary: #FF416C;
$forgot-primary-light: #FF4B2B;
$forgot-accent: #FFC837;
$forgot-accent-orange: #FF8008;
$forgot-primary-gradient: linear-gradient(135deg, #FF416C, #FF4B2B);
$forgot-accent-gradient: linear-gradient(to right, #FFC837, #FF8008);
$forgot-card-bg: rgba(30, 41, 59, 0.95);

.forgot-password-view {
  background: $forgot-primary-gradient;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 0;
  position: relative;
  overflow: hidden;
  min-height: 100vh;
}

.forgot-password-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 1;

  &__shape {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(15px);
    animation: float 8s ease-in-out infinite;

    &--1 { width: 350px; height: 350px; top: -175px; left: -125px; animation-delay: 0s; }
    &--2 { width: 280px; height: 280px; top: -80px; right: -100px; animation-delay: 1.5s; }
    &--3 { width: 220px; height: 220px; bottom: -80px; left: 8%; animation-delay: 3s; }
    &--4 { width: 180px; height: 180px; bottom: -60px; right: 12%; animation-delay: 4.5s; }
    &--5 { width: 140px; height: 140px; top: 25%; left: -70px; animation-delay: 2s; }
    &--6 { width: 160px; height: 160px; top: 65%; right: -80px; animation-delay: 5.5s; }
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
  25% { transform: translateY(-12px) rotate(30deg) scale(1.02); }
  50% { transform: translateY(-25px) rotate(60deg) scale(1); }
  75% { transform: translateY(-12px) rotate(90deg) scale(0.98); }
}

.forgot-password-content {
  position: relative;
  z-index: 20;
  width: 100%;

  .container {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
  }
}

.forgot-password-card {
  width: 100%;
  max-width: 420px;
  background: $forgot-card-bg;
  backdrop-filter: blur(20px);
  border-radius: 16px;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  padding: 32px;
  border: 1px solid rgba(255, 255, 255, 0.1);

  &__header {
    text-align: center;
    margin-bottom: 24px;
  }

  &__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, rgba(255, 200, 55, 0.2), rgba(255, 128, 8, 0.15));
    border-radius: 50%;
    margin-bottom: 16px;
    background: $forgot-accent-gradient;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    border: 2px solid rgba(255, 200, 55, 0.3);
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 32px rgba(255, 200, 55, 0.15);
    
    svg {
      color: $forgot-accent;
      filter: drop-shadow(0 2px 4px rgba(255, 128, 8, 0.3));
    }
  }

  &__title {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 8px;
    background: $forgot-accent-gradient;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    text-shadow: none;
  }

  &__subtitle {
    color: rgba(255, 255, 255, 0.7);
    font-size: 16px;
    line-height: 1.5;
  }

  &__footer {
    text-align: center;
    margin-top: 24px;
  }

  &__back {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
    margin: 0;
  }

  &__back-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: $forgot-accent-gradient;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;

    &:hover {
      filter: brightness(1.1);
      text-decoration: underline;
      transform: translateX(-2px);
    }

    svg {
      color: $forgot-accent;
      transition: all 0.3s ease;
    }

    &:hover svg {
      color: $forgot-accent-orange;
      transform: translateX(-2px);
    }
  }
}

.forgot-password-form {
  &__alert {
    background: rgba(239, 68, 68, 0.15);
    color: #ef4444;
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    border: 1px solid rgba(239, 68, 68, 0.3);
  }

  &__success {
    background: rgba(34, 197, 94, 0.15);
    color: #22c55e;
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 24px;
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 14px;
    border: 1px solid rgba(34, 197, 94, 0.3);
    line-height: 1.5;
  }

  &__group {
    margin-bottom: 24px;
  }

  &__label {
    display: block;
    font-weight: 500;
    color: white;
    margin-bottom: 6px;
    font-size: 14px;
  }

  &__input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  &__icon {
    position: absolute;
    left: 16px;
    color: rgba(255, 255, 255, 0.5);
    z-index: 2;
    width: 18px;
    height: 18px;
  }

  &__input {
    width: 100%;
    padding: 14px 20px 14px 48px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 8px;
    font-size: 16px;
    background: rgba(255, 255, 255, 0.05);
    color: white;

    &:focus {
      outline: none;
      border-color: $forgot-accent;
      box-shadow: 0 0 0 2px rgba(255, 200, 55, 0.2);
      background: rgba(255, 255, 255, 0.08);
    }

    &::placeholder {
      color: rgba(255, 255, 255, 0.4);
    }
  }

  &__submit {
    margin-top: 8px;
  }

  &__button {
    width: 100%;
    padding: 14px 20px;
    background: $forgot-primary-gradient;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(255, 65, 108, 0.4);
      filter: brightness(1.05);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
  }

  &__spinner {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s linear infinite;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

// Responsive
@media (max-width: 480px) {
  .forgot-password-card {
    padding: 24px 20px;
    margin: 16px;
  }

  .forgot-password-card__title {
    font-size: 24px;
  }

  .forgot-password-card__subtitle {
    font-size: 14px;
  }
}
</style>