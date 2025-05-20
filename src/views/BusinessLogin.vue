<template>
  <div class="business-login">
    <div class="business-login__container">
      <div class="business-login__logo">
        <span class="business-login__logo-icon">🍽️</span>
        <span class="business-login__logo-text">Elixium Foods</span>
        <div class="business-login__logo-subtitle">BUSINESS PORTAL</div>
      </div>

      <h1 class="business-login__title">Bienvenido de nuevo</h1>
      <p class="business-login__subtitle">Accede a tu portal de gestión</p>

      <form @submit.prevent="handleLogin" class="business-login__form">
        <div class="business-login__form-group">
          <label for="email" class="business-login__label">Email</label>
          <div class="business-login__input-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="business-login__input-icon">
              <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <input type="email" id="email" v-model="form.email" class="business-login__input"
              placeholder="tu-email@ejemplo.com" required autocomplete="email" />
          </div>
        </div>

        <div class="business-login__form-group">
          <div class="business-login__label-wrapper">
            <label for="password" class="business-login__label">Contraseña</label>
            <router-link to="/business/forgot-password" class="business-login__forgot">
              ¿Olvidaste tu contraseña?
            </router-link>
          </div>
          <div class="business-login__input-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="business-login__input-icon">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <input :type="showPassword ? 'text' : 'password'" id="password" v-model="form.password"
              class="business-login__input" placeholder="********" required autocomplete="current-password" />
            <button type="button" class="business-login__password-toggle" @click="showPassword = !showPassword"
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
        </div>

        <div class="business-login__form-group business-login__form-group--checkbox">
          <label class="business-login__checkbox-label">
            <input type="checkbox" v-model="form.remember" class="business-login__checkbox" />
            <span class="business-login__checkbox-text">Mantener sesión iniciada</span>
          </label>
        </div>

        <div v-if="error" class="business-login__error">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <p>{{ error }}</p>
        </div>

        <button type="submit" class="business-login__button" :disabled="loading">
          <span v-if="loading" class="business-login__spinner"></span>
          <span v-else>Iniciar sesión</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { api } from '@/services/api';

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const form = reactive({
  email: '',
  password: '',
  remember: false
})

const loading = ref(false)
const error = ref('')
const showPassword = ref(false)

const handleLogin = async () => {
  try {
    loading.value = true;
    error.value = '';

    // Usar el objeto correcto para la API
    const loginResult = await authStore.login({
      email: form.email,
      password: form.password
    });

    // Si no hay un método isAuthenticated, verificar el token
    if (loginResult && authStore.token && authStore.user && authStore.user.id) {
      const userId = authStore.user.id;

      try {
        const response = await api.get(`/api/Business/user/${userId}`);

        if (response.data && response.data.id) {
          const businessId = response.data.id;

          // Navegación forzada - esto siempre funcionará
          window.location.href = `/business/dashboard/${businessId}`;
          return;
        } else {
          error.value = 'Este usuario no está asociado a ningún negocio.';
          await authStore.logout();
        }
      } catch (apiError) {
        console.error("Error obteniendo datos de negocio:", apiError);
        error.value = 'No se pudo verificar la información del negocio.';
        await authStore.logout();
      }
    } else {
      error.value = 'Error de autenticación. Verifica tus credenciales.';
    }
  } catch (loginErr) {
    console.error("Error completo de login:", loginErr);
    error.value = 'Error al iniciar sesión. Verifica tus credenciales.';
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.business-login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f7f7f7;
  padding: 1.5rem;

  &__container {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    padding: 2.5rem;
    width: 100%;
    max-width: 420px;
    text-align: center;
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
    margin-bottom: 1.5rem;
  }

  &__form-group {
    margin-bottom: 1.5rem;
    position: relative;

    &--checkbox {
      margin-bottom: 1.25rem;
    }
  }

  &__label-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  &__label {
    display: block;
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #1e293b;
  }

  &__input-wrapper {
    position: relative;
  }

  &__input-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    width: 18px;
    height: 18px;
    color: #94a3b8;
  }

  &__input {
    width: 100%;
    padding: 0.875rem 1rem 0.875rem 2.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.2s ease;
    background-color: #f8fafc;
    color: #1e293b;

    &:focus {
      border-color: #FF416C;
      outline: none;
      box-shadow: 0 0 0 3px rgba(255, 65, 108, 0.1);
      background-color: white;
    }

    &::placeholder {
      color: #94a3b8;
    }
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

  &__forgot {
    font-size: 0.85rem;
    color: #06a98d;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  &__checkbox-label {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  &__checkbox {
    margin-right: 0.5rem;
    width: 16px;
    height: 16px;
    accent-color: #06a98d;
  }

  &__checkbox-text {
    font-size: 0.9rem;
    color: #64748b;
  }

  &__error {
    margin-bottom: 1.25rem;
    padding: 0.75rem;
    background-color: #fee2e2;
    color: #dc2626;
    border-radius: 8px;
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    font-size: 0.9rem;
    text-align: left;

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

  &__button {
    width: 100%;
    padding: 0.875rem;
    background: linear-gradient(to right, #06a98d, #058a73);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: linear-gradient(to right, #058a73, #047c67);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(5, 138, 115, 0.2);
    }

    &:active {
      transform: translateY(0);
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: translateY(0);
      box-shadow: none;
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
    margin-right: 0.5rem;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 480px) {
  .business-login {
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
      font-size: 0.95rem;
    }
  }
}
</style>
