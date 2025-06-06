<!-- src/views/ResetPassword.vue -->
<template>
  <div class="reset-password-view">
    <div class="reset-password-background">
      <div class="reset-password-background__shape reset-password-background__shape--1"></div>
      <div class="reset-password-background__shape reset-password-background__shape--2"></div>
      <div class="reset-password-background__shape reset-password-background__shape--3"></div>
      <div class="reset-password-background__shape reset-password-background__shape--4"></div>
      <div class="reset-password-background__shape reset-password-background__shape--5"></div>
      <div class="reset-password-background__shape reset-password-background__shape--6"></div>
    </div>

    <section class="reset-password-content">
      <div class="container">
        <div class="reset-password-card">
          <div class="reset-password-card__header">
            <div class="reset-password-card__icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 1v6l4-4m-4 4l-4-4"></path>
                <path d="M12 8a3 3 0 1 0 3 3 4 4 0 0 1-6 0 3 3 0 0 0 3-3z"></path>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              </svg>
            </div>
            <h2 class="reset-password-card__title">Nueva Contraseña</h2>
            <p class="reset-password-card__subtitle">Crea una nueva contraseña segura para tu cuenta</p>
          </div>

          <!-- Token inválido o expirado -->
          <div v-if="tokenError" class="reset-password-form__alert">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <div>
              <strong>Enlace inválido o expirado</strong><br>
              {{ tokenError }}<br>
              <router-link to="/forgot-password" class="reset-password-form__link">
                Solicitar nuevo enlace
              </router-link>
            </div>
          </div>

          <!-- Formulario de reset -->
          <form v-else @submit.prevent="handleResetPassword" class="reset-password-form">
            <div v-if="error" class="reset-password-form__alert">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{{ error }}</span>
            </div>

            <div v-if="successMessage" class="reset-password-form__success">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span>{{ successMessage }}</span>
            </div>

            <div class="reset-password-form__group">
              <label for="password" class="reset-password-form__label">Nueva Contraseña</label>
              <div class="reset-password-form__input-wrapper">
                <svg class="reset-password-form__icon" width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <input v-model="newPassword" :type="showPassword ? 'text' : 'password'" id="password"
                  class="reset-password-form__input" placeholder="Ingresa tu nueva contraseña" required
                  :disabled="loading" minlength="6" />
                <button type="button" class="reset-password-form__toggle-password" @click="togglePassword"
                  :disabled="loading">
                  <svg v-if="!showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2">
                    <path
                      d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24">
                    </path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                </button>
              </div>
            </div>

            <div class="reset-password-form__group">
              <label for="confirmPassword" class="reset-password-form__label">Confirmar Contraseña</label>
              <div class="reset-password-form__input-wrapper">
                <svg class="reset-password-form__icon" width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <input v-model="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" id="confirmPassword"
                  class="reset-password-form__input" placeholder="Confirma tu nueva contraseña" required
                  :disabled="loading" minlength="6" />
                <button type="button" class="reset-password-form__toggle-password" @click="toggleConfirmPassword"
                  :disabled="loading">
                  <svg v-if="!showConfirmPassword" width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2">
                    <path
                      d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24">
                    </path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Indicador de fortaleza de contraseña -->
            <div v-if="newPassword" class="reset-password-form__strength">
              <div class="reset-password-form__strength-label">Fortaleza de la contraseña:</div>
              <div class="reset-password-form__strength-bar">
                <div class="reset-password-form__strength-fill"
                  :class="`reset-password-form__strength-fill--${passwordStrength.level}`"
                  :style="{ width: `${passwordStrength.score * 25}%` }"></div>
              </div>
              <div class="reset-password-form__strength-text">{{ passwordStrength.text }}</div>
            </div>

            <div class="reset-password-form__submit">
              <button type="submit" class="reset-password-form__button" :disabled="loading || !isFormValid">
                <div v-if="loading" class="reset-password-form__spinner"></div>
                <span v-else>Restablecer Contraseña</span>
              </button>
            </div>
          </form>

          <div class="reset-password-card__footer">
            <p class="reset-password-card__back">
              <router-link to="/login" class="reset-password-card__back-link">
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
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import authService from '@/services/authService';

const router = useRouter();
const route = useRoute();

// Estado para el formulario
const newPassword = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const loading = ref(false);
const error = ref('');
const successMessage = ref('');
const tokenError = ref('');
const resetToken = ref('');
const resetEmail = ref(''); // ← AGREGADO

// Validación de contraseña
const passwordStrength = computed(() => {
  const password = newPassword.value;
  if (!password) return { score: 0, level: 'weak', text: '' };

  let score = 0;
  let requirements = [];

  // Longitud mínima
  if (password.length >= 8) {
    score++;
    requirements.push('✓ Mínimo 8 caracteres');
  } else {
    requirements.push('✗ Mínimo 8 caracteres');
  }

  // Mayúscula
  if (/[A-Z]/.test(password)) {
    score++;
    requirements.push('✓ Una mayúscula');
  } else {
    requirements.push('✗ Una mayúscula');
  }

  // Minúscula
  if (/[a-z]/.test(password)) {
    score++;
    requirements.push('✓ Una minúscula');
  } else {
    requirements.push('✗ Una minúscula');
  }

  // Número o símbolo
  if (/[\d\W]/.test(password)) {
    score++;
    requirements.push('✓ Un número o símbolo');
  } else {
    requirements.push('✗ Un número o símbolo');
  }

  const levels = ['weak', 'fair', 'good', 'strong'];
  const texts = ['Débil', 'Regular', 'Buena', 'Fuerte'];

  return {
    score,
    level: levels[Math.min(score, 3)],
    text: texts[Math.min(score, 3)],
    requirements
  };
});

// Validación del formulario
const isFormValid = computed(() => {
  return newPassword.value.length >= 6 &&
    newPassword.value === confirmPassword.value &&
    passwordStrength.value.score >= 2 &&
    resetToken.value &&
    resetEmail.value; // ← AGREGADO
});

// Alternar visibilidad de contraseña
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

// Manejar el restablecimiento de contraseña
const handleResetPassword = async () => {
  try {
    loading.value = true;
    error.value = '';
    successMessage.value = '';

    // Validaciones del lado del cliente
    if (newPassword.value !== confirmPassword.value) {
      error.value = 'Las contraseñas no coinciden.';
      return;
    }

    if (newPassword.value.length < 6) {
      error.value = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }

    if (passwordStrength.value.score < 2) {
      error.value = 'La contraseña es demasiado débil. Usa al menos 8 caracteres con mayúsculas, minúsculas y números.';
      return;
    }

    // ✅ LLAMAR AL SERVICIO CON LOS 3 PARÁMETROS REQUERIDOS
    const result = await authService.resetPassword(resetToken.value, resetEmail.value, newPassword.value, confirmPassword.value);

    if (result.success) {
      successMessage.value = result.message;

      // Limpiar campos
      newPassword.value = '';
      confirmPassword.value = '';

      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        router.push('/login');
      }, 3000);

    } else {
      error.value = result.message;
    }

  } catch (err: any) {
    console.error('Error inesperado al restablecer contraseña:', err);
    error.value = 'Ha ocurrido un error inesperado. Por favor, intenta nuevamente.';
  } finally {
    loading.value = false;
  }
};

// ✅ VERIFICAR TOKEN Y EMAIL AL MONTAR EL COMPONENTE
onMounted(() => {
  const token = route.query.token as string;
  const email = route.query.email as string;
  // Validar que tengamos ambos parámetros
  if (!token) {
    tokenError.value = 'No se proporcionó un token de restablecimiento válido en la URL.';
    return;
  }
  if (!email) {
    tokenError.value = 'No se proporcionó un email válido en la URL de restablecimiento.';
    return;
  }
  // Validar formato básico del email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    tokenError.value = 'El email en la URL no tiene un formato válido.';
    return;
  }

  resetToken.value = token;
  resetEmail.value = email;

  console.log('✅ Token y email válidos extraídos');
});
</script>

<style lang="scss" scoped>
$reset-primary: #FF416C;
$reset-primary-light: #FF4B2B;
$reset-accent: #FFC837;
$reset-accent-orange: #FF8008;
$reset-primary-gradient: linear-gradient(135deg, #FF416C, #FF4B2B);
$reset-accent-gradient: linear-gradient(to right, #FFC837, #FF8008);
$reset-card-bg: rgba(30, 41, 59, 0.95);

.reset-password-view {
  background: $reset-primary-gradient;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 0;
  position: relative;
  overflow: hidden;
  min-height: 100vh;
}

.reset-password-background {
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
    }

    &--2 {
      width: 280px;
      height: 280px;
      top: -80px;
      right: -100px;
      animation-delay: 1.5s;
    }

    &--3 {
      width: 220px;
      height: 220px;
      bottom: -80px;
      left: 8%;
      animation-delay: 3s;
    }

    &--4 {
      width: 180px;
      height: 180px;
      bottom: -60px;
      right: 12%;
      animation-delay: 4.5s;
    }

    &--5 {
      width: 140px;
      height: 140px;
      top: 25%;
      left: -70px;
      animation-delay: 2s;
    }

    &--6 {
      width: 160px;
      height: 160px;
      top: 65%;
      right: -80px;
      animation-delay: 5.5s;
    }
  }
}

@keyframes float {

  0%,
  100% {
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

.reset-password-content {
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

.reset-password-card {
  width: 100%;
  max-width: 480px;
  background: $reset-card-bg;
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
    border: 2px solid rgba(255, 200, 55, 0.3);
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 32px rgba(255, 200, 55, 0.15);

    svg {
      color: $reset-accent;
      filter: drop-shadow(0 2px 4px rgba(255, 128, 8, 0.3));
    }
  }

  &__title {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 8px;
    background: $reset-accent-gradient;
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
    background: $reset-accent-gradient;
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
      color: $reset-accent;
      transition: all 0.3s ease;
    }

    &:hover svg {
      color: $reset-accent-orange;
      transform: translateX(-2px);
    }
  }
}

.reset-password-form {
  &__alert {
    background: rgba(239, 68, 68, 0.15);
    color: #ef4444;
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 24px;
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 14px;
    border: 1px solid rgba(239, 68, 68, 0.3);
    line-height: 1.5;
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

  &__link {
    background: $reset-accent-gradient;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    text-decoration: underline;
    font-weight: 500;

    &:hover {
      filter: brightness(1.1);
    }
  }

  &__group {
    margin-bottom: 20px;
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
    padding: 14px 50px 14px 48px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 8px;
    font-size: 16px;
    background: rgba(255, 255, 255, 0.05);
    color: white;

    &:focus {
      outline: none;
      border-color: $reset-accent;
      box-shadow: 0 0 0 2px rgba(255, 200, 55, 0.2);
      background: rgba(255, 255, 255, 0.08);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
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
    color: rgba(255, 255, 255, 0.5);
    cursor: pointer;
    padding: 4px;
    transition: color 0.3s ease;

    &:hover:not(:disabled) {
      color: $reset-accent;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  &__strength {
    margin-bottom: 20px;

    &-label {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 6px;
    }

    &-bar {
      width: 100%;
      height: 4px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 2px;
      overflow: hidden;
      margin-bottom: 4px;
    }

    &-fill {
      height: 100%;
      transition: all 0.3s ease;

      &--weak {
        background: #ef4444;
      }

      &--fair {
        background: #f59e0b;
      }

      &--good {
        background: #10b981;
      }

      &--strong {
        background: #22c55e;
      }
    }

    &-text {
      font-size: 12px;
      font-weight: 500;

      &.weak {
        color: #ef4444;
      }

      &.fair {
        color: #f59e0b;
      }

      &.good {
        color: #10b981;
      }

      &.strong {
        color: #22c55e;
      }
    }
  }

  &__submit {
    margin-top: 8px;
  }

  &__button {
    width: 100%;
    padding: 14px 20px;
    background: $reset-primary-gradient;
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
  to {
    transform: rotate(360deg);
  }
}

// Responsive
@media (max-width: 480px) {
  .reset-password-card {
    padding: 24px 20px;
    margin: 16px;
  }

  .reset-password-card__title {
    font-size: 24px;
  }

  .reset-password-card__subtitle {
    font-size: 14px;
  }
}
</style>
