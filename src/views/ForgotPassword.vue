<!-- src/views/ForgotPassword.vue -->
<template>
    <div class="forgot-password-view">
      <!-- Header con fondo degradado y ondas -->
      <section class="forgot-password-header">
        <div class="container">
          <div class="forgot-password-header__content">
            <h1 class="forgot-password-header__title">Recupera tu acceso</h1>
            <p class="forgot-password-header__subtitle">Te enviaremos instrucciones para restablecer tu contraseña</p>
          </div>
        </div>
        <div class="forgot-password-header__wave">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#ffffff" fill-opacity="1"
              d="M0,192L40,181.3C80,171,160,149,240,149.3C320,149,400,171,480,176C560,181,640,171,720,144C800,117,880,75,960,69.3C1040,64,1120,96,1200,117.3C1280,139,1360,149,1400,154.7L1440,160L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z">
            </path>
          </svg>
        </div>
      </section>
  
      <!-- Contenido principal con formulario de recuperación -->
      <section class="forgot-password-content">
        <div class="container">
          <div class="forgot-password-card">
            <div class="forgot-password-card__decoration">
              <div class="forgot-password-card__circles">
                <div class="forgot-password-card__circle forgot-password-card__circle--1"></div>
                <div class="forgot-password-card__circle forgot-password-card__circle--2"></div>
                <div class="forgot-password-card__circle forgot-password-card__circle--3"></div>
              </div>
              <div class="forgot-password-card__emoji">🔐</div>
            </div>
  
            <div class="forgot-password-card__header">
              <h2 class="forgot-password-card__title">Recuperar Contraseña</h2>
              <p class="forgot-password-card__subtitle">Ingresa tu email para recibir instrucciones</p>
            </div>
  
            <form @submit.prevent="handleResetPassword" class="forgot-password-form">
              <div v-if="error" class="forgot-password-form__alert">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>{{ error }}</span>
              </div>
  
              <div v-if="successMessage" class="forgot-password-form__success">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span>{{ successMessage }}</span>
              </div>
  
              <div class="forgot-password-form__group">
                <label for="email" class="forgot-password-form__label">Email</label>
                <div class="forgot-password-form__input-wrapper">
                  <svg class="forgot-password-form__icon" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
              <p class="forgot-password-card__links">
                <router-link to="/login" class="forgot-password-card__link">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
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
  import { api } from '@/services/api';
  
  const router = useRouter();
  
  // Estado para el formulario
  const email = ref('');
  const loading = ref(false);
  const error = ref('');
  const successMessage = ref('');
  
// Manejar la solicitud de restablecimiento
const handleResetPassword = async () => {
  try {
    loading.value = true;
    error.value = '';
    
    // Aquí se haría la petición al endpoint para restablecer la contraseña
    // Por ahora simulamos una respuesta exitosa
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Esta sería la implementación real para tu backend
    // const response = await api.post('/api/Auth/forgot-password', { email: email.value });
    
    // Mostrar mensaje de éxito
    successMessage.value = 'Hemos enviado un correo con instrucciones para restablecer tu contraseña.';
    
    // Limpiar el campo de email después de enviar
    email.value = '';
    
    // Opcional: redirigir después de unos segundos
    setTimeout(() => {
      router.push('/login');
    }, 5000);
    
  } catch (err: any) {
    console.error('Error al solicitar restablecimiento:', err);
    error.value = err.response?.data?.message || 'Ha ocurrido un error al procesar tu solicitud.';
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
// Variables
$primary: #FF416C;
$primary-gradient: linear-gradient(to right, #FF416C, #FF4B2B);
$secondary: #0652DD;
$secondary-gradient: linear-gradient(to right, #0652DD, #12CBC4);
$accent: #FFA502;
$dark: #1e293b;
$light: #f8fafc;
$text: #1e293b;
$text-light: #64748b;
$border: #e2e8f0;
$border-radius: 16px;
$transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);

// Container
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;

  @media (max-width: 768px) {
    padding: 0 1.5rem;
  }
}

// Forgot Password View
.forgot-password-view {
  min-height: 100vh;
  background-color: $light;
}

// Forgot Password Header
.forgot-password-header {
  background: $primary-gradient;
  color: white;
  padding: 6rem 0 8rem;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
      radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
    z-index: 1;
  }

  &__content {
    position: relative;
    z-index: 5;
  }

  &__title {
    font-size: 3.5rem;
    font-weight: 800;
    margin-bottom: 1rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    @media (max-width: 768px) {
      font-size: 2.5rem;
    }

    @media (max-width: 480px) {
      font-size: 2rem;
    }
  }

  &__subtitle {
    font-size: 1.25rem;
    opacity: 0.9;
    margin-bottom: 1rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;

    @media (max-width: 768px) {
      font-size: 1.1rem;
    }
  }

  &__wave {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    line-height: 0;
    z-index: 1;

    svg {
      width: 100%;
      height: auto;
    }
  }
}

// Forgot Password Content
.forgot-password-content {
  padding: 0 0 5rem;
  margin-top: -5rem;
  position: relative;
  z-index: 5;
}

// Forgot Password Card
.forgot-password-card {
  max-width: 550px;
  margin: 0 auto;
  background-color: white;
  border-radius: $border-radius;
  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.1);
  padding: 2.5rem;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }

  &__decoration {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    overflow: hidden;
    z-index: 0;
    pointer-events: none;
  }

  &__circles {
    position: relative;
    height: 100%;
  }

  &__circle {
    position: absolute;
    border-radius: 50%;
    opacity: 0.05;

    &--1 {
      width: 300px;
      height: 300px;
      background: $primary;
      top: -100px;
      left: -150px;
    }

    &--2 {
      width: 200px;
      height: 200px;
      background: $secondary;
      top: -50px;
      right: -100px;
    }

    &--3 {
      width: 250px;
      height: 250px;
      background: $accent;
      bottom: -100px;
      right: -50px;
    }
  }

  &__emoji {
    position: absolute;
    font-size: 150px;
    opacity: 0.05;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &__header {
    text-align: center;
    margin-bottom: 2rem;
    position: relative;
    z-index: 2;
  }

  &__title {
    font-size: 2rem;
    font-weight: 800;
    margin-bottom: 0.75rem;
    background: $primary-gradient;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    display: inline-block;
  }

  &__subtitle {
    color: $text-light;
    font-size: 1.1rem;
  }

  &__footer {
    text-align: center;
    margin-top: 2rem;
    position: relative;
  }

  &__links {
    font-size: 1rem;
    color: $text-light;
    margin: 0;
  }

  &__link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: $secondary;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.3s ease;

    &:hover {
      color: darken($secondary, 10%);
    }
  }
}

// Forgot Password Form
.forgot-password-form {
  position: relative;
  z-index: 2;

  &__alert {
    background-color: rgba(#ef4444, 0.1);
    color: #ef4444;
    padding: 1rem;
    border-radius: $border-radius;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.95rem;
  }

  &__success {
    background-color: rgba(#10b981, 0.1);
    color: #10b981;
    padding: 1rem;
    border-radius: $border-radius;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.95rem;
  }

  &__group {
    margin-bottom: 1.5rem;
  }

  &__label {
    display: block;
    font-weight: 600;
    color: $dark;
    margin-bottom: 0.5rem;
    font-size: 0.95rem;
  }

  &__input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  &__icon {
    position: absolute;
    left: 1rem;
    color: $text-light;
  }

  &__input {
    width: 100%;
    padding: 1rem 1rem 1rem 3rem;
    border: 1px solid $border;
    border-radius: 10px;
    font-size: 1rem;
    transition: all 0.3s ease;
    background-color: $light;

    &:focus {
      outline: none;
      border-color: $primary;
      box-shadow: 0 0 0 3px rgba($primary, 0.1);
      background-color: white;
    }

    &::placeholder {
      color: #a0aec0;
    }
  }

  &__submit {
    margin-top: 2rem;
  }

  &__button {
    width: 100%;
    padding: 1rem;
    background: $primary-gradient;
    color: white;
    border: none;
    border-radius: 10px;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba($primary, 0.3);
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }

  &__spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s linear infinite;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>