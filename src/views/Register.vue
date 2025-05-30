<!-- src/views/Register.vue -->
<template>
  <div class="register-view">
    <div class="register-background">
      <div class="register-background__shape register-background__shape--1"></div>
      <div class="register-background__shape register-background__shape--2"></div>
      <div class="register-background__shape register-background__shape--3"></div>
      <div class="register-background__shape register-background__shape--4"></div>
      <div class="register-background__shape register-background__shape--5"></div>
      <div class="register-background__shape register-background__shape--6"></div>
    </div>

    <section class="register-content">
      <div class="container">
        <div class="register-card">
          <div class="register-card__header">
            <h2 class="register-card__title">Únete a Elixium Foods</h2>
            <p class="register-card__subtitle">Crea tu cuenta para disfrutar de deliciosa comida a domicilio</p>
          </div>

          <form @submit.prevent="handleRegister" class="register-form">
            <div v-if="error" class="register-form__alert">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{{ error }}</span>
            </div>

            <div v-if="successMessage" class="register-form__success">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span>{{ successMessage }}</span>
            </div>

            <div class="register-form__row">
              <div class="register-form__group">
                <label for="firstName" class="register-form__label">Nombre</label>
                <div class="register-form__input-wrapper">
                  <svg class="register-form__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <input v-model="registerForm.firstName" type="text" id="firstName" class="register-form__input" placeholder="Nombre" required />
                </div>
              </div>

              <div class="register-form__group">
                <label for="lastName" class="register-form__label">Apellido</label>
                <div class="register-form__input-wrapper">
                  <svg class="register-form__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <input v-model="registerForm.lastName" type="text" id="lastName" class="register-form__input" placeholder="Apellido" required />
                </div>
              </div>
            </div>

            <div class="register-form__group">
              <label for="email" class="register-form__label">Email</label>
              <div class="register-form__input-wrapper">
                <svg class="register-form__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <input v-model="registerForm.email" type="email" id="email" class="register-form__input" placeholder="tu@email.com" required />
              </div>
            </div>

            <div class="register-form__group">
              <label for="phoneNumber" class="register-form__label">Teléfono</label>
              <div class="register-form__input-wrapper">
                <svg class="register-form__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <input v-model="registerForm.phoneNumber" type="tel" id="phoneNumber" class="register-form__input" placeholder="+34 612 345 678" required />
              </div>
            </div>

            <div class="register-form__group">
              <label for="password" class="register-form__label">Contraseña</label>
              <div class="register-form__input-wrapper">
                <svg class="register-form__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <input v-model="registerForm.password" :type="showPassword ? 'text' : 'password'" id="password" class="register-form__input" placeholder="••••••••" required />
                <button type="button" class="register-form__toggle-password" @click="togglePassword" :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'">
                  <svg v-if="!showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                </button>
              </div>
            </div>

            <div class="register-form__group">
              <label for="confirmPassword" class="register-form__label">Confirmar Contraseña</label>
              <div class="register-form__input-wrapper">
                <svg class="register-form__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <input v-model="confirmPassword" :type="showPassword ? 'text' : 'password'" id="confirmPassword" class="register-form__input" placeholder="••••••••" required />
              </div>
            </div>

            <div class="register-form__group register-form__group--checkbox">
              <label class="register-form__checkbox">
                <input type="checkbox" v-model="agreeTerms" required />
                <span class="register-form__checkbox-mark"></span>
                <span>He leído y acepto los <a href="/terms-and-conditions" target="_blank" class="register-form__link">Términos y Condiciones</a> y la <a href="/privacy-policy" target="_blank" class="register-form__link">Política de Privacidad</a></span>
              </label>
            </div>

            <div class="register-form__submit">
              <button type="submit" class="register-form__button" :disabled="loading || !agreeTerms">
                <div v-if="loading" class="register-form__spinner"></div>
                <span v-else>Crear Cuenta</span>
              </button>
            </div>
          </form>

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
// Variables - Colores consistentes con Login.vue
$register-primary: #FF416C;
$register-primary-light: #FF4B2B;
$register-accent: #FFC837;
$register-accent-orange: #FF8008;
$register-primary-gradient: linear-gradient(135deg, #FF416C, #FF4B2B);
$register-accent-gradient: linear-gradient(to right, #FFC837, #FF8008);
$register-card-bg: rgba(30, 41, 59, 0.95);

.register-view {
  background: $register-primary-gradient;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 0;
  position: relative;
  overflow: hidden;
  min-height: 100vh;
}

.register-background {
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

.register-content {
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

.register-card {
  width: 100%;
  max-width: 500px;
  background: $register-card-bg;
  backdrop-filter: blur(20px);
  border-radius: 16px;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  padding: 32px;
  border: 1px solid rgba(255, 255, 255, 0.1);

  &__header {
    text-align: center;
    margin-bottom: 24px;
  }

  &__title {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 8px;
    background: $register-accent-gradient;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    text-shadow: none;
  }

  &__subtitle {
    color: rgba(255, 255, 255, 0.7);
    font-size: 16px;
  }

  &__footer {
    text-align: center;
    margin-top: 24px;
  }

  &__login {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
    margin: 0;
  }

  &__login-link {
    background: $register-accent-gradient;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    font-weight: 600;
    text-decoration: none;

    &:hover {
      filter: brightness(1.1);
      text-decoration: underline;
    }
  }
}

.register-form {
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

  &__row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;

    @media (max-width: 576px) {
      grid-template-columns: 1fr;
      gap: 0;
    }
  }

  &__group {
    margin-bottom: 20px;

    &--checkbox {
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }
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
      border-color: $register-accent;
      box-shadow: 0 0 0 2px rgba(255, 200, 55, 0.2);
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
    z-index: 2;
    padding: 4px;
    border-radius: 4px;

    &:hover {
      color: $register-accent;
      background: rgba(255, 200, 55, 0.15);
    }
  }

  &__link {
    color: $register-accent;
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: $register-accent-orange;
      text-decoration: underline;
    }
  }

  &__checkbox {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    cursor: pointer;
    user-select: none;
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
    line-height: 1.4;

    input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;

      &:checked ~ .register-form__checkbox-mark {
        background-color: $register-accent;
        border-color: $register-accent;

        &:after {
          display: block;
        }
      }
    }
  }

  &__checkbox-mark {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 4px;
    display: inline-block;
    position: relative;
    transition: all 0.3s ease;
    flex-shrink: 0;
    margin-top: 2px;

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

  &__button {
    width: 100%;
    padding: 14px 20px;
    background: $register-primary-gradient;
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
</style>
