<!-- src/views/BusinessRegister.vue -->
<template>
  <div class="business-register">
    <div class="business-register__container">
      <div class="business-register__logo">
        <span class="business-register__logo-icon">🍽️</span>
        <span class="business-register__logo-text">Elixium Foods</span>
        <div class="business-register__logo-subtitle">BUSINESS PORTAL</div>
      </div>

      <h1 class="business-register__title">Únete como restaurante</h1>
      <p class="business-register__subtitle">Crea tu cuenta y empieza a vender con nosotros</p>

      <form @submit.prevent="handleRegister" class="business-register__form">
        <div class="business-register__form-step" v-if="currentStep === 1">
          <h2 class="business-register__step-title">Información del restaurante</h2>

          <div class="business-register__form-group">
            <label for="restaurantName" class="business-register__label">Nombre del restaurante *</label>
            <input type="text" id="restaurantName" v-model="form.restaurantName" class="business-register__input"
              placeholder="Ej: Pizzería Roma" required />
          </div>

          <div class="business-register__form-group">
            <label for="email" class="business-register__label">Email del negocio *</label>
            <input type="email" id="email" v-model="form.email" class="business-register__input"
              placeholder="negocio@empresa.com" required />
          </div>

          <div class="business-register__form-group">
            <label for="phone" class="business-register__label">Teléfono *</label>
            <input type="tel" id="phone" v-model="form.phone" class="business-register__input"
              placeholder="+34 XXX XXX XXX" required />
          </div>

          <div class="business-register__form-group">
            <label for="restaurantType" class="business-register__label">Tipo de cocina *</label>
            <select id="restaurantType" v-model="form.restaurantType" class="business-register__select" required>
              <option value="">Selecciona un tipo</option>
              <option value="1">Italiana</option>
              <option value="2">Asiática</option>
              <option value="3">Mexicana</option>
              <option value="4">Hamburguesas</option>
              <option value="5">Pizzas</option>
              <option value="6">Vegana</option>
              <option value="7">Saludable</option>
              <option value="8">Postres</option>
            </select>
          </div>

          <div class="business-register__form-actions">
            <button type="button" class="business-register__button business-register__button--next" @click="nextStep"
              :disabled="!canContinueStep1">
              Continuar
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="business-register__button-icon">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>

        <div class="business-register__form-step" v-if="currentStep === 2">
          <h2 class="business-register__step-title">Dirección del restaurante</h2>

          <div class="business-register__form-group">
            <label for="address" class="business-register__label">Dirección *</label>
            <input type="text" id="address" v-model="form.address" class="business-register__input"
              placeholder="Calle, número, piso, etc." required />
          </div>

          <div class="business-register__form-row">
            <div class="business-register__form-group">
              <label for="city" class="business-register__label">Ciudad *</label>
              <input type="text" id="city" v-model="form.city" class="business-register__input" placeholder="Ej: Madrid"
                required />
            </div>

            <div class="business-register__form-group">
              <label for="postalCode" class="business-register__label">Código Postal *</label>
              <input type="text" id="postalCode" v-model="form.postalCode" class="business-register__input"
                placeholder="Ej: 28001" required />
            </div>
          </div>

          <div class="business-register__form-actions business-register__form-actions--split">
            <button type="button" class="business-register__button business-register__button--back" @click="prevStep">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="business-register__button-icon">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              Atrás
            </button>

            <button type="button" class="business-register__button business-register__button--next" @click="nextStep"
              :disabled="!canContinueStep2">
              Continuar
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="business-register__button-icon">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>

        <div class="business-register__form-step" v-if="currentStep === 3">
          <h2 class="business-register__step-title">Crea tu cuenta</h2>

          <div class="business-register__form-row">
            <div class="business-register__form-group">
              <label for="firstName" class="business-register__label">Nombre *</label>
              <input type="text" id="firstName" v-model="form.firstName" class="business-register__input"
                placeholder="Tu nombre" required />
            </div>

            <div class="business-register__form-group">
              <label for="lastName" class="business-register__label">Apellidos *</label>
              <input type="text" id="lastName" v-model="form.lastName" class="business-register__input"
                placeholder="Tus apellidos" required />
            </div>
          </div>

          <div class="business-register__form-group">
            <label for="password" class="business-register__label">Contraseña *</label>
            <div class="business-register__input-wrapper">
              <input :type="showPassword ? 'text' : 'password'" id="password" v-model="form.password"
                class="business-register__input" placeholder="Mínimo 8 caracteres" minlength="8" required />
              <button type="button" class="business-register__password-toggle" @click="showPassword = !showPassword"
                tabindex="-1">
                <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path
                    d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24">
                  </path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
            </div>
            <p class="business-register__password-requirements">
              La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, un número y un carácter
              especial.
            </p>
          </div>

          <div class="business-register__form-group business-register__form-group--checkbox">
            <label class="business-register__checkbox-label">
              <input type="checkbox" v-model="form.terms" class="business-register__checkbox" required />
              <span class="business-register__checkbox-text">
                Acepto los <a href="#" class="business-register__link">Términos y Condiciones</a> y la <a href="#"
                  class="business-register__link">Política de Privacidad</a>
              </span>
            </label>
          </div>

          <div v-if="error" class="business-register__error">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p>{{ error }}</p>
          </div>

          <div class="business-register__form-actions business-register__form-actions--split">
            <button type="button" class="business-register__button business-register__button--back" @click="prevStep">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="business-register__button-icon">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              Atrás
            </button>

            <button type="submit" class="business-register__button business-register__button--submit"
              :disabled="loading || !canSubmit">
              <span v-if="loading" class="business-register__spinner"></span>
              <span v-else>
                Crear cuenta
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  class="business-register__button-icon">
                  <path d="M5 12h14"></path>
                  <path d="M12 5l7 7-7 7"></path>
                </svg>
              </span>
            </button>
          </div>
        </div>
      </form>

      <div class="business-register__progress">
        <div class="business-register__progress-steps">
          <div v-for="step in 3" :key="step" :class="[
            'business-register__progress-step',
            { 'business-register__progress-step--active': currentStep >= step }
          ]" @click="goToStep(step)">
            <span>{{ step }}</span>
          </div>
        </div>
        <div class="business-register__progress-bar">
          <div class="business-register__progress-indicator" :style="{ width: progressWidth }"></div>
        </div>
      </div>

      <div class="business-register__login">
        ¿Ya tienes una cuenta?
        <router-link to="/business/login" class="business-register__login-link">
          Iniciar sesión
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBusinessAuthStore } from '@/stores/businessAuth'

const router = useRouter()
const businessAuthStore = useBusinessAuthStore()

const currentStep = ref(1)
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

const form = reactive({
  restaurantName: '',
  email: '',
  phone: '',
  restaurantType: '',
  address: '',
  city: '',
  postalCode: '',
  firstName: '',
  lastName: '',
  password: '',
  terms: false
})

const progressWidth = computed(() => {
  return `${((currentStep.value - 1) / 2) * 100}%`
})

const canContinueStep1 = computed(() => {
  return form.restaurantName && form.email && form.phone && form.restaurantType
})

const canContinueStep2 = computed(() => {
  return form.address && form.city && form.postalCode
})

const canSubmit = computed(() => {
  return form.firstName && form.lastName && form.password && form.password.length >= 8 && form.terms
})

const goToStep = (step: number) => {
  // Solo permitir ir a pasos completados o al siguiente paso
  if (step < currentStep.value || (step === currentStep.value + 1 &&
    ((currentStep.value === 1 && canContinueStep1.value) ||
      (currentStep.value === 2 && canContinueStep2.value)))) {
    currentStep.value = step
  }
}

const nextStep = () => {
  if (currentStep.value < 3) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const handleRegister = async () => {
  try {
    loading.value = true
    error.value = ''

    // Call register method from store
    await businessAuthStore.register({
      name: form.restaurantName,
      email: form.email,
      phone: form.phone,
      address: form.address,
      city: form.city,
      postalCode: form.postalCode,
      firstName: form.firstName,
      lastName: form.lastName,
      password: form.password,
      type: form.restaurantType
    })

    // If registration is successful, show success message and redirect to login
    alert('¡Registro exitoso! Por favor, revisa tu email para verificar tu cuenta.')
    router.push('/business/login')
  } catch (err: any) {
    error.value = err.message || 'Error en el registro. Por favor, inténtalo de nuevo.'
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.business-register {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f7f7f7;
  padding: 2rem;

  &__container {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    padding: 2.5rem;
    width: 100%;
    max-width: 600px;
    text-align: center;
    position: relative;
  }

  &__logo {
    margin-bottom: 2rem;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
  }

  &__logo-icon {
    font-size: 40px;
    margin-bottom: 0.75rem;
  }

  &__logo-text {
    font-size: 32px;
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
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: #1e293b;
  }

  &__subtitle {
    color: #64748b;
    font-size: 1rem;
    margin-bottom: 2rem;
  }

  &__form {
    text-align: left;
    margin-bottom: 2rem;
  }

  &__form-step {
    animation: fadeIn 0.3s ease;
  }

  &__step-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 1.5rem;
    position: relative;
    padding-bottom: 0.75rem;

    &:after {
      content: "";
      position: absolute;
      left: 0;
      bottom: 0;
      width: 40px;
      height: 3px;
      background: linear-gradient(to right, #06a98d, #058a73);
      border-radius: 3px;
    }
  }

  &__form-group {
    margin-bottom: 1.5rem;
    position: relative;

    &--checkbox {
      margin-top: 2rem;
    }
  }

  &__form-row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;

    @media (max-width: 480px) {
      grid-template-columns: 1fr;
    }
  }

  &__label {
    display: block;
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #1e293b;
  }

  &__input,
  &__select {
    width: 100%;
    padding: 0.875rem 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.2s ease;
    background-color: #f8fafc;
    color: #1e293b;

    &:focus {
      border-color: #06a98d;
      outline: none;
      box-shadow: 0 0 0 3px rgba(6, 169, 141, 0.1);
      background-color: white;
    }

    &::placeholder {
      color: #94a3b8;
    }
  }

  &__select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 1rem center;
    background-size: 1rem;
    padding-right: 2.5rem;
  }

  &__input-wrapper {
    position: relative;
  }

  &__password-toggle {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #94a3b8;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 18px;
      height: 18px;
    }

    &:hover {
      color: #64748b;
    }
  }

  &__password-requirements {
    margin-top: 0.5rem;
    font-size: 0.8rem;
    color: #64748b;
  }

  &__checkbox-label {
    display: flex;
    align-items: flex-start;
    cursor: pointer;
  }

  &__checkbox {
    margin-right: 0.75rem;
    width: 18px;
    height: 18px;
    accent-color: #06a98d;
    margin-top: 0.15rem;
  }

  &__checkbox-text {
    font-size: 0.9rem;
    color: #64748b;
    line-height: 1.4;
  }

  &__link {
    color: #06a98d;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  &__error {
    margin-bottom: 1.5rem;
    padding: 0.75rem;
    background-color: #fee2e2;
    color: #dc2626;
    border-radius: 8px;
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    font-size: 0.9rem;

    svg {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
      margin-top: 0.15rem;
    }

    p {
      margin: 0;
    }
  }

  &__form-actions {
    margin-top: 2rem;
    display: flex;
    justify-content: flex-end;

    &--split {
      justify-content: space-between;
    }
  }

  &__button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.875rem 1.5rem;
    border-radius: 8px;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;

    &-icon {
      width: 16px;
      height: 16px;
    }

    &--next,
    &--submit {
      background: linear-gradient(to right, #06a98d, #058a73);
      color: white;
      border: none;

      &:hover:not(:disabled) {
        background: linear-gradient(to right, #058a73, #047c67);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(6, 169, 141, 0.15);
      }

      &:active:not(:disabled) {
        transform: translateY(0);
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }

    &--back {
      background-color: white;
      color: #64748b;
      border: 1px solid #e2e8f0;

      &:hover {
        background-color: #f8fafc;
        color: #1e293b;
      }
    }
  }

  &__spinner {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 0.8s linear infinite;
  }

  &__progress {
    margin: 1.5rem 0;
  }

  &__progress-steps {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.75rem;
  }

  &__progress-step {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background-color: #f1f5f9;
    color: #64748b;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.85rem;
    font-weight: 600;
    position: relative;
    cursor: pointer;
    transition: all 0.2s ease;

    &--active {
      background-color: #06a98d;
      color: white;
    }

    &:not(:last-child):after {
      content: "";
      position: absolute;
      top: 50%;
      left: 100%;
      height: 2px;
      width: calc(100% - 20px);
      background-color: #f1f5f9;
      z-index: 0;
    }

    &--active:not(:last-child):after {
      background-color: #06a98d;
    }
  }

  &__progress-bar {
    height: 4px;
    background-color: #f1f5f9;
    border-radius: 2px;
    overflow: hidden;
    margin: 0 14px;
  }

  &__progress-indicator {
    height: 100%;
    background: linear-gradient(to right, #06a98d, #058a73);
    border-radius: 2px;
    transition: width 0.3s ease;
  }

  &__login {
    font-size: 0.9rem;
    color: #64748b;
    margin-top: 1.5rem;
  }

  &__login-link {
    color: #06a98d;
    font-weight: 600;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .business-register {
    padding: 1rem;

    &__container {
      padding: 1.5rem;
      border-radius: 10px;
    }

    &__logo-icon {
      font-size: 36px;
    }

    &__logo-text {
      font-size: 28px;
    }

    &__title {
      font-size: 22px;
    }

    &__subtitle {
      font-size: 0.9rem;
    }
  }
}
</style>
