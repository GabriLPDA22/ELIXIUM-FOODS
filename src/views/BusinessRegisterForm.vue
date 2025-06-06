<template>
  <div class="business-register-page">
    <div class="container">
      <div class="form-container">
        <h1 class="page-title">Únete a la Familia Elixium Foods</h1>
        <p class="page-subtitle">
          Completa el siguiente formulario y nuestro equipo se pondrá en contacto contigo a la brevedad para guiarte en los siguientes pasos.
        </p>

        <form @submit.prevent="handleSubmit" class="register-form" v-if="!formSubmitted">
          <div class="form-grid">
            <div class="form-group">
              <label for="restaurantName" class="form-label">Nombre del Restaurante <span class="required">*</span></label>
              <input type="text" id="restaurantName" v-model="formData.restaurantName" class="form-input" required placeholder="Ej: La Deliciosa Esquina">
              <span v-if="errors.restaurantName" class="error-message">{{ errors.restaurantName }}</span>
            </div>

            <div class="form-group">
              <label for="contactName" class="form-label">Tu Nombre (Contacto Principal) <span class="required">*</span></label>
              <input type="text" id="contactName" v-model="formData.contactName" class="form-input" required placeholder="Ej: Ana Pérez">
              <span v-if="errors.contactName" class="error-message">{{ errors.contactName }}</span>
            </div>

            <div class="form-group">
              <label for="email" class="form-label">Email de Contacto <span class="required">*</span></label>
              <input type="email" id="email" v-model="formData.email" class="form-input" required placeholder="tuemail@ejemplo.com">
              <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
            </div>

            <div class="form-group">
              <label for="phone" class="form-label">Teléfono de Contacto</label>
              <input type="tel" id="phone" v-model="formData.phone" class="form-input" placeholder="+34 123 456 789">
              <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
            </div>

            <div class="form-group full-width">
              <label for="city" class="form-label">Ciudad del Restaurante</label>
              <input type="text" id="city" v-model="formData.city" class="form-input" placeholder="Ej: Madrid, Barcelona">
            </div>

            <div class="form-group full-width">
              <label for="message" class="form-label">Mensaje Adicional (Opcional)</label>
              <textarea id="message" v-model="formData.message" class="form-textarea" rows="4" placeholder="Cuéntanos un poco más sobre tu negocio o si tienes alguna pregunta."></textarea>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="cta-button submit-btn" :disabled="isSubmitting">
              <span v-if="isSubmitting">Enviando...</span>
              <span v-else>Enviar Solicitud</span>
            </button>
          </div>
        </form>

        <div v-if="formSubmitted" class="submission-success">
          <div class="success-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M0 0h24v24H0z" fill="none"/>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h2 class="success-title">¡Solicitud Enviada!</h2>
          <p class="success-message">
            Gracias por tu interés en unirte a Elixium Foods. Hemos recibido tus datos y un miembro de nuestro equipo se pondrá en contacto contigo muy pronto.
          </p>
          <router-link :to="{ name: 'home' }" class="cta-button back-home-btn">Volver al Inicio</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

interface FormData {
  restaurantName: string;
  contactName: string;
  email: string;
  phone: string;
  city: string;
  message: string;
}

interface FormErrors {
  restaurantName?: string;
  contactName?: string;
  email?: string;
  phone?: string;
}

const router = useRouter();

const formData = reactive<FormData>({
  restaurantName: '',
  contactName: '',
  email: '',
  phone: '',
  city: '',
  message: '',
});

const errors = reactive<FormErrors>({});
const isSubmitting = ref(false);
const formSubmitted = ref(false);

const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

const validateForm = (): boolean => {
  errors.restaurantName = '';
  errors.contactName = '';
  errors.email = '';
  errors.phone = '';
  let isValid = true;

  if (!formData.restaurantName.trim()) {
    errors.restaurantName = 'El nombre del restaurante es obligatorio.';
    isValid = false;
  }
  if (!formData.contactName.trim()) {
    errors.contactName = 'Tu nombre es obligatorio.';
    isValid = false;
  }
  if (!formData.email.trim()) {
    errors.email = 'El email es obligatorio.';
    isValid = false;
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Por favor, introduce un email válido.';
    isValid = false;
  }

  return isValid;
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  isSubmitting.value = true;
  await new Promise(resolve => setTimeout(resolve, 1500));

  isSubmitting.value = false;
  formSubmitted.value = true;
};

</script>

<style lang="scss" scoped>
.business-register-page {
  padding: 3rem 0;
  background-color: var(--light);
  min-height: calc(100vh - 70px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.form-container {
  background-color: var(--white);
  padding: 2.5rem;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
}

.page-title {
  text-align: center;
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--dark);
  margin-bottom: 0.75rem;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
}

.page-subtitle {
  text-align: center;
  font-size: 1rem;
  color: var(--medium);
  margin-bottom: 2.5rem;
  line-height: 1.6;
}

.register-form {
  width: 100%;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

.form-group {
  display: flex;
  flex-direction: column;

  &.full-width {
    grid-column: 1 / -1;
  }
}

.form-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--dark);
  margin-bottom: 0.5rem;

  .required {
    color: var(--primary);
    margin-left: 0.25rem;
  }
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.8rem 1rem;
  font-size: 0.95rem;
  border: 1px solid #cbd5e1;
  border-radius: var(--border-radius-sm);
  background-color: var(--white);
  color: var(--dark);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(var(--primary), 0.15);
  }

  &::placeholder {
    color: #94a3b8;
    opacity: 0.8;
  }
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.error-message {
  font-size: 0.8rem;
  color: var(--error);
  margin-top: 0.25rem;
}

.form-actions {
  margin-top: 2rem;
  text-align: center;
}

.cta-button.submit-btn {
  background: var(--primary-gradient);
  color: var(--white);
  padding: 0.9rem 2.5rem;
  font-size: 1.05rem;
  min-width: 200px;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    background: var(--medium);
  }
}

.submission-success {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem 1rem;

  .success-icon {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background-color: rgba(var(--success), 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.5rem;
    animation: success-pop-in 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards;

    svg {
      color: var(--success);
      width: 40px;
      height: 40px;
    }
  }

  .success-title {
    font-size: 2rem;
    font-weight: 700;
    color: var(--dark);
    margin-bottom: 1rem;
    @media (max-width: 768px) {
      font-size: 1.75rem;
    }
  }

  .success-message {
    font-size: 1rem;
    color: var(--medium);
    margin-bottom: 2.5rem;
    line-height: 1.65;
    max-width: 550px;
    margin-left: auto;
    margin-right: auto;
  }

  .cta-button.back-home-btn {
    padding: 0.85rem 2.2rem;
    font-size: 1rem;
    background-color: var(--primary);
    color: var(--white);
    text-decoration: none;
    border-radius: var(--border-radius-xl, 2rem);
    transition: background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
    border: none;
    box-shadow: var(--shadow-sm, 0 2px 4px rgba(0,0,0,0.1));

    &:hover {
      background-color: var(--primary-dark);
      transform: translateY(-2px);
      box-shadow: var(--shadow, 0 4px 8px rgba(0,0,0,0.15));
    }
  }
}

@keyframes success-pop-in {
  0% {
    transform: scale(0.4);
    opacity: 0;
  }
  60% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
