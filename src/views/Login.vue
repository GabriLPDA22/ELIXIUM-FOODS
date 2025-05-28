<!-- src/views/Login.vue -->
<template>
  <div class="login-view">
    <!-- Fondo animado con círculos -->
    <div class="login-background">
      <div class="login-background__shape login-background__shape--1"></div>
      <div class="login-background__shape login-background__shape--2"></div>
      <div class="login-background__shape login-background__shape--3"></div>
      <div class="login-background__shape login-background__shape--4"></div>
      <div class="login-background__shape login-background__shape--5"></div>
      <div class="login-background__shape login-background__shape--6"></div>
    </div>

    <!-- Contenido principal con formulario de login -->
    <section class="login-content">
      <div class="container">
        <div class="login-card">
          <div class="login-card__header">
            <h2 class="login-card__title">Iniciar Sesión</h2>
            <p class="login-card__subtitle">Ingresa tus datos para acceder a tu cuenta</p>
          </div>

          <form @submit.prevent="handleLogin" class="login-form">
            <div v-if="error" class="login-form__alert">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{{ error }}</span>
            </div>

            <div v-if="successMessage" class="login-form__success">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span>{{ successMessage }}</span>
            </div>

            <div class="login-form__group">
              <label for="email" class="login-form__label">Email</label>
              <div class="login-form__input-wrapper">
                <svg class="login-form__icon" width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <input v-model="loginForm.email" type="email" id="email" class="login-form__input"
                  placeholder="tu@email.com" required />
              </div>
            </div>

            <div class="login-form__group">
              <div class="login-form__label-row">
                <label for="password" class="login-form__label">Contraseña</label>
                <router-link to="/forgot-password" class="login-form__forgot">¿Olvidaste tu contraseña?</router-link>
              </div>
              <div class="login-form__input-wrapper">
                <svg class="login-form__icon" width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <input v-model="loginForm.password" :type="showPassword ? 'text' : 'password'" id="password"
                  class="login-form__input" placeholder="••••••••" required />
                <button type="button" class="login-form__toggle-password" @click="togglePassword"
                  :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'">
                  <svg v-if="!showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path
                      d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24">
                    </path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                </button>
              </div>
            </div>

            <div class="login-form__group login-form__group--checkbox">
              <label class="login-form__checkbox">
                <input type="checkbox" v-model="loginForm.rememberMe" />
                <span class="login-form__checkbox-mark"></span>
                <span>Mantener sesión iniciada</span>
              </label>
            </div>

            <div class="login-form__submit">
              <button type="submit" class="login-form__button" :disabled="loading">
                <div v-if="loading" class="login-form__spinner"></div>
                <span v-else>Iniciar Sesión</span>
              </button>
            </div>
          </form>

          <div class="login-separator">
            <span class="login-separator__text">O inicia sesión con</span>
          </div>

          <div class="social-login">
            <button type="button" class="social-login__button social-login__button--google">
              <svg width="20" height="20" viewBox="0 0 24 24" class="social-login__icon">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4" />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853" />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05" />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335" />
              </svg>
              <span>Continuar con Google</span>
            </button>
          </div>

          <div class="login-card__footer">
            <p class="login-card__register">
              ¿No tienes una cuenta?
              <router-link to="/register" class="login-card__register-link">Regístrate</router-link>
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// Estado para el formulario
const loginForm = reactive({
  email: '',
  password: '',
  rememberMe: false
});

const showPassword = ref(false);
const loading = ref(false);
const error = ref('');
const successMessage = ref('');

// Mostrar u ocultar la contraseña
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

// Verificar si ya está autenticado al cargar
onMounted(() => {
  if (authStore.isAuthenticated()) {
    const returnUrl = route.query.returnUrl?.toString() || '/';
    router.push(returnUrl);
  }
});

// Manejar el login
const handleLogin = async () => {
  try {
    loading.value = true;
    error.value = '';

    // Llamada a la API de autenticación
    const success = await authStore.login({
      email: loginForm.email,
      password: loginForm.password
    });

    if (success) {
      successMessage.value = '¡Inicio de sesión exitoso!';

      // Depuración - Mostrar token obtenido
      console.log('Login exitoso. Token obtenido:', localStorage.getItem('token'));
      console.log('Cabeceras configuradas:', authStore.token);

      // Redirigir después de un breve momento
      setTimeout(() => {
        const returnUrl = route.query.returnUrl?.toString() || '/';
        router.push(returnUrl);
      }, 1000);
    } else {
      error.value = authStore.error || 'Credenciales inválidas. Por favor, inténtalo de nuevo.';
    }
  } catch (err: any) {
    console.error('Error de login:', err);
    error.value = err.message || 'Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.';
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
// Variables básicas del login
$login-primary: #FF416C;
$login-primary-light: #FF6B9D;
$login-primary-gradient: linear-gradient(#eb3963 0%, rgb(175, 85, 85) 100%);
$login-secondary: #ff6b77;
$login-card-bg: rgba(30, 41, 59, 0.95);

// Login View con fondo degradado
.login-view {
  background: $login-primary-gradient;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 0;
  position: relative;
  overflow: hidden;
  
  @media (min-width: 768px) {
    padding: 24px 0;
  }
}

// Fondo animado con círculos
.login-background {
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

    &--1 {
      width: 350px;
      height: 350px;
      top: -175px;
      left: -125px;
      animation-delay: 0s;
      
      @media (max-width: 576px) {
        width: 250px;
        height: 250px;
        top: -125px;
        left: -75px;
      }
    }

    &--2 {
      width: 280px;
      height: 280px;
      top: -80px;
      right: -100px;
      animation-delay: 1.5s;
      
      @media (max-width: 576px) {
        width: 180px;
        height: 180px;
        right: -60px;
      }
    }

    &--3 {
      width: 220px;
      height: 220px;
      bottom: -80px;
      left: 8%;
      animation-delay: 3s;
      
      @media (max-width: 576px) {
        width: 160px;
        height: 160px;
        left: 3%;
      }
    }

    &--4 {
      width: 180px;
      height: 180px;
      bottom: -60px;
      right: 12%;
      animation-delay: 4.5s;
      
      @media (max-width: 576px) {
        width: 130px;
        height: 130px;
        right: 8%;
      }
    }

    &--5 {
      width: 140px;
      height: 140px;
      top: 25%;
      left: -70px;
      animation-delay: 2s;
      
      @media (max-width: 576px) {
        width: 110px;
        height: 110px;
      }
    }

    &--6 {
      width: 160px;
      height: 160px;
      top: 65%;
      right: -80px;
      animation-delay: 5.5s;
      
      @media (max-width: 576px) {
        width: 120px;
        height: 120px;
      }
    }
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg) scale(1);
  }
  25% {
    transform: translateY(-12px) rotate(30deg) scale(1.02);
  }
  50% {
    transform: translateY(-25px) rotate(60deg) scale(1);
  }
  75% {
    transform: translateY(-12px) rotate(90deg) scale(0.98);
  }
}

// Login Content
.login-content {
  position: relative;
  z-index: 20;
  width: 100%;
  
  .container {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    
    @media (min-width: 768px) {
      padding: 24px;
    }
  }
}

// Login Card
.login-card {
  width: 100%;
  max-width: 400px;
  background: $login-card-bg;
  backdrop-filter: blur(20px);
  border-radius: 16px;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  padding: 24px;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  @media (min-width: 576px) {
    max-width: 420px;
    padding: 32px;
  }
  
  @media (min-width: 768px) {
    max-width: 450px;
    padding: 40px;
  }

  &__header {
    text-align: center;
    margin-bottom: 24px;
    position: relative;
    z-index: 10;
  }

  &__title {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 8px;
    color: $login-primary;
    
    @media (min-width: 768px) {
      font-size: 32px;
    }
  }

  &__subtitle {
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
    line-height: 1.5;
    
    @media (min-width: 768px) {
      font-size: 16px;
    }
  }

  &__footer {
    text-align: center;
    margin-top: 24px;
    position: relative;
    z-index: 10;
  }

  &__register {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
    margin: 0;
    line-height: 1.5;
  }

  &__register-link {
    color: $login-primary;
    font-weight: 600;
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: $login-primary-light;
      text-decoration: underline;
    }
  }
}

// Login Form
.login-form {
  position: relative;
  z-index: 10;

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
    align-items: center;
    gap: 8px;
    font-size: 14px;
    border: 1px solid rgba(34, 197, 94, 0.3);
  }

  &__group {
    margin-bottom: 20px;

    &--checkbox {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin-bottom: 24px;
    }
  }

  &__label-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;
    flex-wrap: wrap;
    gap: 4px;
  }

  &__label {
    display: block;
    font-weight: 500;
    color: white;
    margin-bottom: 6px;
    font-size: 14px;
  }

  &__forgot {
    font-size: 12px;
    color: $login-secondary;
    text-decoration: none;
    transition: color 0.3s ease;
    white-space: nowrap;

    &:hover {
      color: $login-primary;
      text-decoration: underline;
    }
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
    padding: 12px 16px 12px 44px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 8px;
    font-size: 14px;
    transition: all 0.3s ease;
    background: rgba(255, 255, 255, 0.05);
    color: white;
    
    @media (min-width: 768px) {
      padding: 14px 20px 14px 48px;
      font-size: 16px;
    }

    &:focus {
      outline: none;
      border-color: $login-primary;
      box-shadow: 0 0 0 2px rgba($login-primary, 0.2);
      background: rgba(255, 255, 255, 0.08);
    }

    &::placeholder {
      color: rgba(255, 255, 255, 0.4);
    }
  }

  &__toggle-password {
    position: absolute;
    right: 16px;
    background: none;
    border: none;
    cursor: pointer;
    color: rgba(255, 255, 255, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    z-index: 2;
    padding: 4px;
    border-radius: 4px;
    width: 18px;
    height: 18px;

    &:hover {
      color: white;
      background: rgba($login-primary, 0.15);
    }
  }

  &__checkbox {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    user-select: none;
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;

    input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;

      &:checked ~ .login-form__checkbox-mark {
        background: $login-primary;
        border-color: $login-primary;

        &:after {
          display: block;
        }
      }
    }
  }

  &__checkbox-mark {
    width: 16px;
    height: 16px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 4px;
    display: inline-block;
    position: relative;
    transition: all 0.3s ease;
    background: rgba(255, 255, 255, 0.05);

    &:after {
      content: "";
      position: absolute;
      display: none;
      left: 4px;
      top: 1px;
      width: 4px;
      height: 8px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
  }

  &__submit {
    margin-top: 20px;
  }

  &__button {
    width: 100%;
    padding: 10px 16px;
    background: $login-primary-gradient;
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
    position: relative;
    overflow: hidden;
    
    @media (min-width: 768px) {
      padding: 12px 20px;
      font-size: 18px;
    }

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
      transition: left 0.5s;
    }

    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 10px 25px rgba($login-primary, 0.3);

      &::before {
        left: 100%;
      }
    }

    &:active:not(:disabled) {
      transform: translateY(0);
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
  to {
    transform: rotate(360deg);
  }
}

// Separator
.login-separator {
  display: flex;
  align-items: center;
  margin: 20px 0;
  color: rgba(255, 255, 255, 0.5);
  position: relative;
  z-index: 10;

  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  }

  &::before {
    margin-right: 16px;
  }

  &::after {
    margin-left: 16px;
  }

  &__text {
    font-size: 12px;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.5);
  }
}

// Social Login
.social-login {
  position: relative;
  z-index: 10;

  &__button {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 16px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    background: rgba(255, 255, 255, 0.05);
    font-weight: 500;
    font-size: 14px;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;

    @media (min-width: 768px) {
      padding: 12px 20px;
      font-size: 16px;
    }

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border-color: rgba($login-primary, 0.3);
      background: rgba(255, 255, 255, 0.08);
    }

    &:active {
      transform: translateY(0);
    }

    &--google:hover {
      border-color: #4285F4;
      
      .social-login__icon path[fill="#4285F4"] {
        filter: brightness(1.1);
      }
    }
  }

  &__icon {
    flex-shrink: 0;
    transition: transform 0.3s ease;
    width: 18px;
    height: 18px;
  }
}

// Accessibility
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

// Focus states
.login-form__input:focus,
.login-form__button:focus,
.social-login__button:focus,
.login-form__toggle-password:focus {
  outline: 2px solid $login-primary;
  outline-offset: 2px;
}
</style>