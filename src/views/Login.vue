<!-- src/views/Login.vue - ARREGLADO -->
<template>
  <div class="login-view">
    <div class="login-background">
      <div class="login-background__shape login-background__shape--1"></div>
      <div class="login-background__shape login-background__shape--2"></div>
      <div class="login-background__shape login-background__shape--3"></div>
      <div class="login-background__shape login-background__shape--4"></div>
      <div class="login-background__shape login-background__shape--5"></div>
      <div class="login-background__shape login-background__shape--6"></div>
    </div>

    <section class="login-content">
      <div class="container">
        <div class="login-card">
          <div class="login-card__header">
            <h2 class="login-card__title">Iniciar Sesión</h2>
            <p class="login-card__subtitle">Ingresa tus datos para acceder a tu cuenta</p>
          </div>

          <form @submit.prevent="handleLogin" class="login-form">
            <div v-if="error" class="login-form__alert">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{{ error }}</span>
            </div>

            <div v-if="successMessage" class="login-form__success">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span>{{ successMessage }}</span>
            </div>

            <div class="login-form__group">
              <label for="email" class="login-form__label">Email</label>
              <div class="login-form__input-wrapper">
                <svg class="login-form__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <input v-model="loginForm.email" type="email" id="email" class="login-form__input" placeholder="tu@email.com" required />
              </div>
            </div>

            <div class="login-form__group">
              <div class="login-form__label-row">
                <label for="password" class="login-form__label">Contraseña</label>
                <router-link to="/forgot-password" class="login-form__forgot">¿Olvidaste tu contraseña?</router-link>
              </div>
              <div class="login-form__input-wrapper">
                <svg class="login-form__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <input v-model="loginForm.password" :type="showPassword ? 'text' : 'password'" id="password" class="login-form__input" placeholder="••••••••" required />
                <button type="button" class="login-form__toggle-password" @click="togglePassword">
                  <svg v-if="!showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                </button>
              </div>
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
            <!-- 🚀 CAMBIO: Usar el botón oficial que funciona -->
            <div id="google-signin-button"></div>
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

declare global {
  interface Window {
    google: any;
  }
}

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// Google Client ID
const GOOGLE_CLIENT_ID = '385291527056-q394iq6ki0uts61ra7ctomfohrqanusf.apps.googleusercontent.com';

// Estado del formulario
const loginForm = reactive({
  email: '',
  password: ''
});

const showPassword = ref(false);
const loading = ref(false);
const error = ref('');
const successMessage = ref('');

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

// Cargar script de Google
const loadGoogleScript = () => {
  return new Promise((resolve) => {
    if (window.google) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = () => resolve(true);
    document.head.appendChild(script);
  });
};

// 🚀 ARREGLADO: Inicializar Google OAuth con FedCM desactivado
const initializeGoogleAuth = () => {
  if (window.google) {
    // ✅ CONFIGURACIÓN CORRECTA
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleCallback,
      // 🔥 ESTA LÍNEA ARREGLA TODO
      use_fedcm_for_prompt: false
    });

    // ✅ RENDERIZAR BOTÓN OFICIAL (como en la versión que funciona)
    window.google.accounts.id.renderButton(
      document.getElementById('google-signin-button'),
      {
        theme: 'outline',
        size: 'large',
        width: 300,
        text: 'signin_with'
      }
    );

    console.log('✅ Google Sign-In inicializado correctamente');
  }
};

// Callback de Google - MEJORADO
const handleGoogleCallback = async (response: any) => {
  try {
    loading.value = true;
    error.value = '';
    console.log('📨 Token de Google recibido');

    const loginSuccess = await authStore.loginWithGoogle(response.credential);

    if (loginSuccess) {
      successMessage.value = '¡Login con Google exitoso!';
      console.log('✅ Login exitoso');

      setTimeout(() => {
        const returnUrl = route.query.returnUrl?.toString() || '/';
        router.replace(returnUrl); // Redirigir a home
      }, 1500);
    } else {
      error.value = authStore.error || 'Error en login con Google';
      console.error('❌ Error en login:', authStore.error);
    }
  } catch (err: any) {
    console.error('❌ Error procesando Google login:', err);
    error.value = err.message || 'Error procesando login con Google';
  } finally {
    loading.value = false;
  }
};

// Login normal - MEJORADO
const handleLogin = async () => {
  try {
    loading.value = true;
    error.value = '';
    console.log('🔐 Iniciando login normal');

    const success = await authStore.login({
      email: loginForm.email,
      password: loginForm.password
    });

    if (success) {
      successMessage.value = '¡Login exitoso!';
      console.log('✅ Login normal exitoso');

      setTimeout(() => {
        const returnUrl = route.query.returnUrl?.toString() || '/';
        router.replace(returnUrl); // Redirigir a home
      }, 1500);
    } else {
      error.value = authStore.error || 'Credenciales inválidas';
      console.error('❌ Error en login:', authStore.error);
    }
  } catch (err: any) {
    console.error('❌ Error en login:', err);
    error.value = err.message || 'Error en el login';
  } finally {
    loading.value = false;
  }
};

// Inicializar - MEJORADO
onMounted(async () => {
  console.log('🔄 Inicializando Login...');

  // Verificar si ya está autenticado
  if (authStore.isAuthenticated) {
    console.log('👤 Usuario ya autenticado, redirigiendo...');
    const returnUrl = route.query.returnUrl?.toString() || '/';
    router.replace(returnUrl);
    return;
  }

  try {
    // Cargar Google OAuth
    console.log('📦 Cargando Google Sign-In...');
    await loadGoogleScript();

    // Dar tiempo para que se cargue
    setTimeout(() => {
      initializeGoogleAuth();
    }, 200);

  } catch (initError) {
    console.error('❌ Error en inicialización:', initError);
    error.value = 'Error inicializando Google Sign-In';
  }
});
</script>

<style lang="scss" scoped>
// Variables - COLORES NARANJA/AMARILLO ORIGINALES
$login-primary: #FF416C;
$login-primary-light: #FF4B2B;
$login-accent: #FFC837;
$login-accent-orange: #FF8008;
$login-primary-gradient: linear-gradient(135deg, #FF416C, #FF4B2B);
$login-accent-gradient: linear-gradient(to right, #FFC837, #FF8008);
$login-card-bg: rgba(30, 41, 59, 0.95);

.login-view {
  background: $login-primary-gradient;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 0;
  position: relative;
  overflow: hidden;
  min-height: 100vh;
}

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

.login-content {
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

.login-card {
  width: 100%;
  max-width: 400px;
  background: $login-card-bg;
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
    background: $login-accent-gradient;
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

  &__register {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
    margin: 0;
  }

  &__register-link {
    background: $login-accent-gradient;
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

.login-form {
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
  }

  &__label-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;
  }

  &__label {
    font-weight: 500;
    color: white;
    font-size: 14px;
  }

  &__forgot {
    font-size: 12px;
    color: $login-accent;
    text-decoration: none;

    &:hover {
      color: $login-accent-orange;
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
    padding: 14px 20px 14px 48px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 8px;
    font-size: 16px;
    background: rgba(255, 255, 255, 0.05);
    color: white;

    &:focus {
      outline: none;
      border-color: $login-accent;
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
      color: $login-accent;
      background: rgba(255, 200, 55, 0.15);
    }
  }

  &__button {
    width: 100%;
    padding: 14px 20px;
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

.login-separator {
  display: flex;
  align-items: center;
  margin: 24px 0;
  color: rgba(255, 255, 255, 0.5);

  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  }

  &::before { margin-right: 16px; }
  &::after { margin-left: 16px; }

  &__text {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
  }
}

.social-login {
  width: 100%;
  display: flex;
  justify-content: center;

  // 🚀 NUEVO ESTILO PERSONALIZADO PARA GOOGLE
  #google-signin-button {
    width: 100%;
    display: flex;
    justify-content: center;

    // Estilo completamente personalizado
    :global(.gsi-material-button) {
      width: 100% !important;
      height: 52px !important;
      border-radius: 12px !important;
      border: 2px solid transparent !important;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05)) !important;
      backdrop-filter: blur(20px) !important;
      position: relative !important;
      overflow: hidden !important;
      transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1) !important;

      // Gradiente de borde animado
      &::before {
        content: '' !important;
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        border-radius: 12px !important;
        padding: 2px !important;
        background: linear-gradient(45deg, $login-accent, $login-accent-orange, $login-primary, $login-accent) !important;
        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0) !important;
        mask-composite: exclude !important;
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0) !important;
        -webkit-mask-composite: source-out !important;
        opacity: 0 !important;
        transition: opacity 0.3s ease !important;
      }

      &:hover {
        transform: translateY(-2px) scale(1.02) !important;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08)) !important;
        box-shadow:
          0 10px 30px rgba(255, 200, 55, 0.3),
          0 5px 15px rgba(255, 128, 8, 0.2),
          inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;

        &::before {
          opacity: 1 !important;
        }
      }

      &:active {
        transform: translateY(-1px) scale(1.01) !important;
        transition: all 0.1s ease !important;
      }
    }

    // Contenido del botón
    :global(.gsi-material-button .gsi-material-button-contents) {
      height: 100% !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 14px !important;
      padding: 0 24px !important;
      position: relative !important;
      z-index: 2 !important;
    }

    // Ícono de Google más grande y con sombra
    :global(.gsi-material-button .gsi-material-button-icon) {
      width: 22px !important;
      height: 22px !important;
      margin: 0 !important;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1)) !important;
      transition: transform 0.3s ease !important;
    }

    :global(.gsi-material-button:hover .gsi-material-button-icon) {
      transform: rotate(5deg) scale(1.05) !important;
    }

    // Texto personalizado con efectos
    :global(.gsi-material-button .gsi-material-button-content-wrapper) {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      height: 100% !important;
    }

    :global(.gsi-material-button .gsi-material-button-content) {
      color: white !important;
      font-size: 16px !important;
      font-weight: 600 !important;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      text-transform: none !important;
      letter-spacing: 0.5px !important;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1) !important;
      position: relative !important;

      // Efecto de brillo en el texto
      &::after {
        content: '' !important;
        position: absolute !important;
        top: 0 !important;
        left: -100% !important;
        width: 100% !important;
        height: 100% !important;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent) !important;
        transition: left 0.5s ease !important;
      }
    }

    :global(.gsi-material-button:hover .gsi-material-button-content::after) {
      left: 100% !important;
    }

    // Estados de accesibilidad mejorados
    :global(.gsi-material-button:focus) {
      outline: none !important;
      box-shadow:
        0 0 0 3px rgba(255, 200, 55, 0.5),
        0 10px 30px rgba(255, 200, 55, 0.3) !important;
    }

    // Pulso sutil en el botón
    :global(.gsi-material-button) {
      animation: pulse-glow 3s ease-in-out infinite !important;
    }

    @keyframes pulse-glow {
      0%, 100% {
        box-shadow: 0 2px 10px rgba(255, 200, 55, 0.1);
      }
      50% {
        box-shadow: 0 2px 15px rgba(255, 200, 55, 0.2);
      }
    }

    // Efecto de partículas (opcional)
    :global(.gsi-material-button::after) {
      content: '' !important;
      position: absolute !important;
      top: 50% !important;
      left: 50% !important;
      width: 0 !important;
      height: 0 !important;
      border-radius: 50% !important;
      background: radial-gradient(circle, rgba(255, 200, 55, 0.3), transparent) !important;
      transform: translate(-50%, -50%) !important;
      transition: all 0.3s ease !important;
      pointer-events: none !important;
      z-index: 1 !important;
    }

    :global(.gsi-material-button:hover::after) {
      width: 200px !important;
      height: 200px !important;
      opacity: 0 !important;
    }
  }
}
</style>
