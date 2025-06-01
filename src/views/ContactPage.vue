<template>
  <div class="contact-page">
    <div class="container">
      <div class="contact-container">
        <h1 class="page-title">Ponte en Contacto con Nosotros</h1>
        <p class="page-subtitle">
          ¿Tienes alguna pregunta, sugerencia o simplemente quieres saludar? Nos encantaría escucharte.
          Completa el formulario o utiliza nuestros otros canales de contacto.
        </p>

        <div class="contact-content-wrapper">
          <div class="form-section">
            <form @submit.prevent="handleSubmit" class="contact-form" v-if="!formSubmitted">
              <div class="form-group">
                <label for="fullName" class="form-label">Nombre Completo <span class="required">*</span></label>
                <input type="text" id="fullName" v-model="formData.fullName" class="form-input" required placeholder="Tu nombre y apellidos">
                <span v-if="errors.fullName" class="error-message">{{ errors.fullName }}</span>
              </div>

              <div class="form-group">
                <label for="email" class="form-label">Tu Email <span class="required">*</span></label>
                <input type="email" id="email" v-model="formData.email" class="form-input" required placeholder="tuemail@ejemplo.com">
                <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
              </div>

              <div class="form-group">
                <label for="subject" class="form-label">Asunto</label>
                <input type="text" id="subject" v-model="formData.subject" class="form-input" placeholder="Ej: Consulta sobre un pedido">
              </div>

              <div class="form-group">
                <label for="message" class="form-label">Tu Mensaje <span class="required">*</span></label>
                <textarea id="message" v-model="formData.message" class="form-textarea" rows="5" required placeholder="Escribe aquí tu consulta o mensaje..."></textarea>
                <span v-if="errors.message" class="error-message">{{ errors.message }}</span>
              </div>

              <div class="form-actions">
                <button type="submit" class="cta-button submit-btn" :disabled="isSubmitting">
                  <span v-if="isSubmitting">Enviando Mensaje...</span>
                  <span v-else>Enviar Mensaje</span>
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
              <h2 class="success-title">¡Mensaje Enviado!</h2>
              <p class="success-message">
                Gracias por ponerte en contacto. Hemos recibido tu mensaje y te responderemos lo antes posible.
              </p>
              <router-link :to="{ name: 'home' }" class="cta-button back-home-btn">Volver al Inicio</router-link>
            </div>
          </div>

          <div class="info-section">
            <h3 class="info-title">Otros Canales</h3>
            <div class="info-item">
              <span class="info-icon">📧</span>
              <div>
                <h4>Email Directo</h4>
                <p>Para consultas generales, puedes escribirnos a: <a href="mailto:soporte@elixiumfoods.com">soporte@elixiumfoods.com</a></p>
              </div>
            </div>
            <div class="info-item">
              <span class="info-icon">📞</span>
              <div>
                <h4>Atención Telefónica</h4>
                <p>Llámanos al: <a href="tel:+34900123456">+34 900 123 456</a> (L-V de 9:00 a 18:00)</p>
              </div>
            </div>
            <div class="info-item">
              <span class="info-icon">📍</span>
              <div>
                <h4>Nuestra Oficina (Visitas con cita previa)</h4>
                <p>Elixium Foods HQ<br>Calle Ficticia 123, Planta 4<br>28080 Madrid, España</p>
              </div>
            </div>
            <div class="info-item">
              <span class="info-icon">📱</span>
              <div>
                <h4>Síguenos</h4>
                <div class="social-links-contact">
                    <a href="#" aria-label="Facebook" class="social-link-item"><svg width="20" height="20" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" fill="currentColor"/></svg></a>
                    <a href="#" aria-label="Twitter" class="social-link-item"><svg width="20" height="20" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" fill="currentColor"/></svg></a>
                    <a href="#" aria-label="Instagram" class="social-link-item"><svg width="20" height="20" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" fill="currentColor"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

interface ContactFormData {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactFormErrors {
  fullName?: string;
  email?: string;
  message?: string;
}

const formData = reactive<ContactFormData>({
  fullName: '',
  email: '',
  subject: '',
  message: '',
});

const errors = reactive<ContactFormErrors>({});
const isSubmitting = ref(false);
const formSubmitted = ref(false);

const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

const validateForm = (): boolean => {
  errors.fullName = '';
  errors.email = '';
  errors.message = '';
  let isValid = true;

  if (!formData.fullName.trim()) {
    errors.fullName = 'Tu nombre completo es obligatorio.';
    isValid = false;
  }
  if (!formData.email.trim()) {
    errors.email = 'Tu email es obligatorio.';
    isValid = false;
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Por favor, introduce un email válido.';
    isValid = false;
  }
  if (!formData.message.trim()) {
    errors.message = 'El mensaje no puede estar vacío.';
    isValid = false;
  }
  return isValid;
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }
  isSubmitting.value = true;

  console.log('Datos del formulario de contacto (simulación):', JSON.parse(JSON.stringify(formData)));
  await new Promise(resolve => setTimeout(resolve, 1500));

  isSubmitting.value = false;
  formSubmitted.value = true;
};
</script>

<style lang="scss" scoped>
.contact-page {
  padding: 3rem 0 4rem;
  background-color: var(--light);
  min-height: calc(100vh - 70px);
}

.container {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.contact-container {
  background-color: var(--white);
  padding: 2.5rem;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);

  @media (max-width: 992px) {
    padding: 2rem;
  }
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
  margin-bottom: 3rem;
  line-height: 1.6;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.contact-content-wrapper {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
}

.form-section {
}

.contact-form {
  width: 100%;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.25rem;
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
  min-height: 120px;
}

.error-message {
  font-size: 0.8rem;
  color: var(--error);
  margin-top: 0.25rem;
}

.form-actions {
  margin-top: 1.5rem;
}

.cta-button.submit-btn {
  background: var(--primary-gradient);
  color: var(--white);
  padding: 0.9rem 2rem;
  font-size: 1rem;
  width: 100%;

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

.info-section {
  padding-top: 0.5rem;
  @media (max-width: 992px) {
    border-top: 1px solid #e2e8f0;
    padding-top: 2rem;
    margin-top: 1rem;
  }
}

.info-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--dark);
  margin-bottom: 1.5rem;
}

.info-item {
  margin-bottom: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;

  .info-icon {
    font-size: 1.3rem;
    color: var(--primary);
    margin-top: 0.1rem;
    line-height: 1;
  }

  div { // Contenedor para h4 y p para que el gap del flex padre funcione bien
    display: flex;
    flex-direction: column;
  }

  h4 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--dark);
    margin: 0 0 0.25rem 0;
  }

  p {
    font-size: 0.9rem;
    color: var(--medium);
    line-height: 1.5;
    margin: 0;
    a {
      color: var(--primary);
      text-decoration: underline;
      &:hover {
        color: var(--primary-dark);
      }
    }
  }
}

.social-links-contact {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.25rem;

  .social-link-item {
    color: var(--medium);
    display: inline-block;
    transition: color 0.2s ease;
    svg {
      width: 22px;
      height: 22px;
    }
    &:hover {
      color: var(--primary);
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
