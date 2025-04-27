<!-- src/views/Register.vue -->
<template>
    <div class="register-view">
      <!-- Header con fondo degradado y ondas -->
      <section class="register-header">
        <div class="container">
          <div class="register-header__content">
            <h1 class="register-header__title">Únete a Elixium Foods</h1>
            <p class="register-header__subtitle">Crea tu cuenta para disfrutar de deliciosa comida a domicilio</p>
          </div>
        </div>
        <div class="register-header__wave">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#ffffff" fill-opacity="1"
              d="M0,192L40,181.3C80,171,160,149,240,149.3C320,149,400,171,480,176C560,181,640,171,720,144C800,117,880,75,960,69.3C1040,64,1120,96,1200,117.3C1280,139,1360,149,1400,154.7L1440,160L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z">
            </path>
          </svg>
        </div>
      </section>
  
      <!-- Contenido principal con formulario de registro -->
      <section class="register-content">
        <div class="container">
          <div class="register-card">
            <div class="register-card__decoration">
              <div class="register-card__circles">
                <div class="register-card__circle register-card__circle--1"></div>
                <div class="register-card__circle register-card__circle--2"></div>
                <div class="register-card__circle register-card__circle--3"></div>
              </div>
              <div class="register-card__emoji">🍽️</div>
            </div>
  
            <div class="register-card__header">
              <h2 class="register-card__title">Regístrate</h2>
              <p class="register-card__subtitle">Crea tu cuenta en segundos</p>
            </div>
  
            <form @submit.prevent="handleRegister" class="register-form">
              <div v-if="error" class="register-form__alert">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>{{ error }}</span>
              </div>
  
              <div v-if="successMessage" class="register-form__success">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span>{{ successMessage }}</span>
              </div>
  
              <div class="register-form__row">
                <div class="register-form__group">
                  <label for="firstName" class="register-form__label">Nombre</label>
                  <div class="register-form__input-wrapper">
                    <svg class="register-form__icon" width="20" height="20" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <input v-model="registerForm.firstName" type="text" id="firstName" class="register-form__input"
                      placeholder="Nombre" required />
                  </div>
                </div>
  
                <div class="register-form__group">
                  <label for="lastName" class="register-form__label">Apellido</label>
                  <div class="register-form__input-wrapper">
                    <svg class="register-form__icon" width="20" height="20" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <input v-model="registerForm.lastName" type="text" id="lastName" class="register-form__input"
                      placeholder="Apellido" required />
                  </div>
                </div>
              </div>
  
              <div class="register-form__group">
                <label for="email" class="register-form__label">Email</label>
                <div class="register-form__input-wrapper">
                  <svg class="register-form__icon" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <input v-model="registerForm.email" type="email" id="email" class="register-form__input"
                    placeholder="tu@email.com" required />
                </div>
              </div>
  
              <div class="register-form__group">
                <label for="phoneNumber" class="register-form__label">Teléfono</label>
                <div class="register-form__input-wrapper">
                  <svg class="register-form__icon" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <input v-model="registerForm.phoneNumber" type="tel" id="phoneNumber" class="register-form__input"
                    placeholder="+34 612 345 678" required />
                </div>
              </div>
  
              <div class="register-form__group">
                <label for="password" class="register-form__label">Contraseña</label>
                <div class="register-form__input-wrapper">
                  <svg class="register-form__icon" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <input v-model="registerForm.password" :type="showPassword ? 'text' : 'password'" id="password"
                    class="register-form__input" placeholder="********" required />
                  <button type="button" class="register-form__toggle-password" @click="togglePassword"
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
  
              <div class="register-form__group">
                <label for="confirmPassword" class="register-form__label">Confirmar Contraseña</label>
                <div class="register-form__input-wrapper">
                  <svg class="register-form__icon" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <input v-model="confirmPassword" :type="showPassword ? 'text' : 'password'" id="confirmPassword"
                    class="register-form__input" placeholder="********" required />
                </div>
              </div>
  
              <div class="register-form__group register-form__group--checkbox">
                <label class="register-form__checkbox">
                  <input type="checkbox" v-model="agreeTerms" required />
                  <span class="register-form__checkbox-mark"></span>
                  <span>He leído y acepto los <a href="#" class="register-form__link">Términos y Condiciones</a> y la <a
                      href="#" class="register-form__link">Política de Privacidad</a></span>
                </label>
              </div>
  
              <div class="register-form__submit">
                <button type="submit" class="register-form__button" :disabled="loading || !agreeTerms">
                  <div v-if="loading" class="register-form__spinner"></div>
                  <span v-else>Crear Cuenta</span>
                </button>
              </div>
            </form>
  
            <div class="register-separator">
              <span class="register-separator__text">O regístrate con</span>
            </div>
  
            <div class="social-register">
              <button type="button" class="social-register__button social-register__button--google">
                <svg width="20" height="20" viewBox="0 0 24 24" class="social-register__icon">
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
                <span>Google</span>
              </button>
              <button type="button" class="social-register__button social-register__button--facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2" class="social-register__icon">
                  <path
                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Facebook</span>
              </button>
              <button type="button" class="social-register__button social-register__button--apple">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="black" class="social-register__icon">
                  <path
                    d="M16.25 2c0.41 2.03-0.53 3.75-1.53 4.91-1 1.16-2.38 2.09-4.25 2.09-0.19-1.91 0.53-3.47 1.53-4.62 1-1.16 2.75-2.09 4.25-2.38zM12 8.5c1.28 0 3.38 0.5 5 2.03-0.84 0.5-1.5 1.19-1.97 2.03-0.47 0.84-0.75 1.84-0.75 2.97 0 1 0.22 1.97 0.66 2.94-0.66 0.19-1.28 0.28-1.94 0.28-2.16 0-4.16-0.94-5.72-2.59 1.66-2.84 2.44-5.91 2.47-6.25 0.03-0.34 0.05-0.85 0.05-1.18 0-0.8-0.41-1.4-1.22-1.4-0.28 0-0.72 0.19-1.03 0.53-0.31 0.34-0.75 0.94-0.75 1.88 0 0.85 0.38 1.47 0.84 1.59-0.41 1.72-1.44 4.59-2.19 6.22-0.75-0.59-1.28-1.37-1.69-2.22 0.41-0.53 0.75-1.23 0.75-2.03 0-1.03-0.56-1.97-1.75-1.97s-1.75 0.94-1.75 1.97c0 0.8 0.28 1.5 0.75 2.03-0.41 0.85-0.97 1.62-1.69 2.22-0.75-1.62-1.78-4.5-2.19-6.22 0.47-0.12 0.84-0.75 0.84-1.59 0-0.94-0.44-1.53-0.75-1.88-0.31-0.34-0.75-0.53-1.03-0.53-0.81 0-1.22 0.59-1.22 1.4 0 0.34 0.03 0.85 0.05 1.18 0.03 0.34 0.8 3.41 2.47 6.25-1.56 1.66-3.56 2.59-5.72 2.59-0.66 0-1.28-0.09-1.94-0.28 0.44-0.97 0.66-1.94 0.66-2.94 0-1.13-0.28-2.13-0.75-2.97-0.47-0.84-1.13-1.53-1.97-2.03 1.63-1.53 3.72-2.03 5-2.03z" />
              </svg>
              <span>Apple</span>
            </button>
          </div>

          <div class="register-card__footer">
            <p class="register-card__login">
              ¿Ya tienes una cuenta?
              <router-link to="/login" class="register-card__login-link">Inicia sesión</router-link>
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

// Estado para el formulario
const registerForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  password: '',
  role: 'Customer' // Valor por defecto
});

const confirmPassword = ref('');
const showPassword = ref(false);
const loading = ref(false);
const error = ref('');
const successMessage = ref('');
const agreeTerms = ref(false);

// Mostrar u ocultar la contraseña
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

// Manejar el registro
const handleRegister = async () => {
  // Validar que las contraseñas coincidan
  if (registerForm.password !== confirmPassword.value) {
    error.value = 'Las contraseñas no coinciden';
    return;
  }

  try {
    loading.value = true;
    error.value = '';
    
    // Llamada a la API para registro
    const success = await authStore.register({
      email: registerForm.email,
      password: registerForm.password,
      firstName: registerForm.firstName,
      lastName: registerForm.lastName,
      phoneNumber: registerForm.phoneNumber,
      role: registerForm.role
    });

    if (success) {
      successMessage.value = '¡Registro exitoso! Redirigiendo...';
      
      // Redirigir después de un breve momento
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } else {
      error.value = authStore.error || 'Error en el registro. Por favor, inténtalo de nuevo.';
    }
  } catch (err: any) {
    console.error('Error de registro:', err);
    error.value = err.message || 'Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.';
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

// Register View
.register-view {
  min-height: 100vh;
  background-color: $light;
}

// Register Header
.register-header {
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

// Register Content
.register-content {
  padding: 0 0 5rem;
  margin-top: -5rem;
  position: relative;
  z-index: 5;
}

// Register Card
.register-card {
  max-width: 650px;
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

  &__login {
    font-size: 1rem;
    color: $text-light;
    margin: 0;
  }

  &__login-link {
    color: $primary;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;

    &:hover {
      text-decoration: underline;
    }
  }
}

// Register Form
.register-form {
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

  &__row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;

    @media (max-width: 576px) {
      grid-template-columns: 1fr;
      gap: 0;
    }
  }

  &__group {
    margin-bottom: 1.5rem;

    &--checkbox {
      display: flex;
      align-items: center;
    }
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

  &__toggle-password {
    position: absolute;
    right: 1rem;
    background: none;
    border: none;
    cursor: pointer;
    color: $text-light;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;

    &:hover {
      color: $dark;
    }
  }

  &__link {
    color: $primary;
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      text-decoration: underline;
    }
  }

  &__checkbox {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    user-select: none;
    color: $text-light;
    font-size: 0.95rem;

    input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;

      &:checked~.register-form__checkbox-mark {
        background-color: $primary;
        border-color: $primary;

        &:after {
          display: block;
        }
      }
    }
  }

  &__checkbox-mark {
    width: 18px;
    height: 18px;
    border: 2px solid $border;
    border-radius: 4px;
    display: inline-block;
    position: relative;
    transition: all 0.3s ease;

    &:after {
      content: "";
      position: absolute;
      display: none;
      left: 5px;
      top: 1px;
      width: 5px;
      height: 10px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
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

// Separator
.register-separator {
  display: flex;
  align-items: center;
  margin: 2rem 0;
  color: $text-light;
  position: relative;
  z-index: 2;

  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid $border;
  }

  &::before {
    margin-right: 1rem;
  }

  &::after {
    margin-left: 1rem;
  }

  &__text {
    font-size: 0.9rem;
  }
}

// Social Register
.social-register {
  display: flex;
  gap: 1rem;
  position: relative;
  z-index: 2;

  @media (max-width: 480px) {
    flex-direction: column;
  }

  &__button {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 0.75rem;
    border-radius: 10px;
    border: 1px solid $border;
    background-color: white;
    font-weight: 500;
    font-size: 0.95rem;
    color: $dark;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    }

    &--google:hover {
      background-color: #f8fafc;
      border-color: #f1f5f9;
    }

    &--facebook:hover {
      background-color: #f0f6ff;
      border-color: #dbeafe;
    }

    &--apple:hover {
      background-color: #f8fafc;
      border-color: #f1f5f9;
    }
  }

  &__icon {
    flex-shrink: 0;
  }
}
</style>