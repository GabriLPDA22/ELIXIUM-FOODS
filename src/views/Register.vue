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
            <div v-if="error" class="alert alert--error">
              <span>{{ error }}</span>
            </div>

            <div v-if="successMessage" class="alert alert--success">
              <span>{{ successMessage }}</span>
            </div>

            <div class="register-form__row">
              <div class="register-form__group">
                <label for="firstName" class="register-form__label">Nombre</label>
                <input
                  v-model="registerForm.firstName"
                  type="text"
                  id="firstName"
                  class="register-form__input"
                  placeholder="Tu nombre"
                  required
                />
              </div>

              <div class="register-form__group">
                <label for="lastName" class="register-form__label">Apellido</label>
                <input
                  v-model="registerForm.lastName"
                  type="text"
                  id="lastName"
                  class="register-form__input"
                  placeholder="Tu apellido"
                  required
                />
              </div>
            </div>

            <div class="register-form__group">
              <label for="email" class="register-form__label">Email</label>
              <input
                v-model="registerForm.email"
                type="email"
                id="email"
                class="register-form__input"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div class="register-form__group">
              <label for="phoneNumber" class="register-form__label">Teléfono</label>
              <input
                v-model="registerForm.phoneNumber"
                type="tel"
                id="phoneNumber"
                class="register-form__input"
                placeholder="+34 612 345 678"
                required
              />
            </div>

            <div class="register-form__group">
              <label for="password" class="register-form__label">Contraseña</label>
              <input
                v-model="registerForm.password"
                type="password"
                id="password"
                class="register-form__input"
                placeholder="••••••••"
                required
                minlength="6"
              />
            </div>

            <div class="register-form__group">
              <label for="confirmPassword" class="register-form__label">Confirmar Contraseña</label>
              <input
                v-model="confirmPassword"
                type="password"
                id="confirmPassword"
                class="register-form__input"
                placeholder="••••••••"
                required
              />
            </div>

            <div class="register-form__group register-form__group--checkbox">
              <label class="register-form__checkbox">
                <input type="checkbox" v-model="agreeTerms" required />
                <span class="register-form__checkbox-mark"></span>
                <span>Acepto los términos y condiciones</span>
              </label>
            </div>

            <div class="register-form__submit">
              <button
                type="submit"
                class="register-form__button"
                :disabled="loading || !isFormValid"
              >
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
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const registerForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  password: '',
  role: 'Customer'
})

const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')
const successMessage = ref('')
const agreeTerms = ref(false)

const isFormValid = computed(() => {
  return registerForm.firstName &&
         registerForm.lastName &&
         registerForm.email &&
         registerForm.phoneNumber &&
         registerForm.password &&
         registerForm.password === confirmPassword.value &&
         agreeTerms.value
})

const handleRegister = async () => {
  error.value = ''
  successMessage.value = ''
  authStore.clearError()

  if (registerForm.password !== confirmPassword.value) {
    error.value = 'Las contraseñas no coinciden'
    return
  }

  if (registerForm.password.length < 6) {
    error.value = 'La contraseña debe tener al menos 6 caracteres'
    return
  }

  if (!agreeTerms.value) {
    error.value = 'Debes aceptar los términos y condiciones'
    return
  }

  try {
    loading.value = true

    const success = await authStore.register({
      email: registerForm.email,
      password: registerForm.password,
      firstName: registerForm.firstName,
      lastName: registerForm.lastName,
      phoneNumber: registerForm.phoneNumber,
      role: registerForm.role
    })

    if (success) {
      successMessage.value = '¡Registro exitoso! Redirigiendo...'

      setTimeout(() => {
        router.push('/')
      }, 2000)
    } else {
      error.value = authStore.error || 'Error en el registro'
    }
  } catch (err: any) {
    error.value = 'Error inesperado. Por favor, inténtalo de nuevo.'
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
$primary: #FF416C;
$primary-light: #FF4B2B;
$accent: #FFC837;
$accent-orange: #FF8008;
$card-bg: rgba(30, 41, 59, 0.95);

.register-view {
  background: linear-gradient(135deg, $primary, $primary-light);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
  position: relative;
  overflow: hidden;
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

.register-content {
  position: relative;
  z-index: 20;
  width: 100%;

  .container {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }
}

.register-card {
  width: 100%;
  max-width: 500px;
  background: $card-bg;
  backdrop-filter: blur(20px);
  border-radius: 16px;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);

  &__header {
    text-align: center;
    margin-bottom: 2rem;
  }

  &__title {
    font-size: 1.75rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    background: linear-gradient(to right, $accent, $accent-orange);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  &__subtitle {
    color: rgba(255, 255, 255, 0.7);
    font-size: 1rem;
  }

  &__footer {
    text-align: center;
    margin-top: 2rem;
  }

  &__login {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.7);
    margin: 0;
  }

  &__login-link {
    background: linear-gradient(to right, $accent, $accent-orange);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    font-weight: 600;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

.alert {
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;

  &--error {
    background: rgba(239, 68, 68, 0.15);
    color: #ef4444;
    border: 1px solid rgba(239, 68, 68, 0.3);
  }

  &--success {
    background: rgba(34, 197, 94, 0.15);
    color: #22c55e;
    border: 1px solid rgba(34, 197, 94, 0.3);
  }
}

.register-form {
  &__row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;

    @media (max-width: 576px) {
      grid-template-columns: 1fr;
    }
  }

  &__group {
    margin-bottom: 1.25rem;

    &--checkbox {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
    }
  }

  &__label {
    display: block;
    font-weight: 500;
    color: white;
    margin-bottom: 0.375rem;
    font-size: 0.875rem;
  }

  &__input {
    width: 100%;
    padding: 0.875rem 1.25rem;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 8px;
    font-size: 1rem;
    background: rgba(255, 255, 255, 0.05);
    color: white;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: $accent;
      box-shadow: 0 0 0 2px rgba(255, 200, 55, 0.2);
      background: rgba(255, 255, 255, 0.08);
    }

    &::placeholder {
      color: rgba(255, 255, 255, 0.4);
    }
  }

  &__checkbox {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    cursor: pointer;
    user-select: none;
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.875rem;
    line-height: 1.4;

    input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;

      &:checked ~ .register-form__checkbox-mark {
        background-color: $accent;
        border-color: $accent;

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
    padding: 0.875rem 1.25rem;
    background: linear-gradient(135deg, $primary, $primary-light);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(255, 65, 108, 0.4);
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

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
  25% { transform: translateY(-12px) rotate(30deg) scale(1.02); }
  50% { transform: translateY(-25px) rotate(60deg) scale(1); }
  75% { transform: translateY(-12px) rotate(90deg) scale(0.98); }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .register-card {
    margin: 1rem;
    padding: 1.5rem;
  }
}
</style>
