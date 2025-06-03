<template>
  <div class="business-setup">
    <div class="business-setup__container">
      <div class="business-setup__header">
        <div class="business-setup__logo">
          <img src="/logo.png" alt="Logo" class="business-setup__logo-img" />
        </div>
        <h1 class="business-setup__title">Configura tu Negocio</h1>
        <p class="business-setup__subtitle">
          Antes de acceder al dashboard, necesitamos configurar tu negocio
        </p>
      </div>

      <div class="business-setup__content">
        <div class="business-setup__options">
          <!-- Opción 1: Registrar nuevo negocio -->
          <div class="business-setup__option">
            <div class="business-setup__option-icon business-setup__option-icon--new">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </div>
            <div class="business-setup__option-content">
              <h3>Registrar Nuevo Negocio</h3>
              <p>Crea un nuevo restaurante o negocio de comida desde cero</p>
              <router-link to="/business-register" class="business-setup__btn business-setup__btn--primary">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                Crear Negocio
              </router-link>
            </div>
          </div>

          <!-- Opción 2: Solicitar acceso a negocio existente -->
          <div class="business-setup__option">
            <div class="business-setup__option-icon business-setup__option-icon--existing">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div class="business-setup__option-content">
              <h3>Unirse a Negocio Existente</h3>
              <p>Solicita acceso para gestionar un restaurante ya registrado</p>
              <button @click="showContactForm = true" class="business-setup__btn business-setup__btn--secondary">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22 6 12 13 2 6"></polyline>
                </svg>
                Solicitar Acceso
              </button>
            </div>
          </div>

          <!-- Opción 3: Contactar soporte -->
          <div class="business-setup__option">
            <div class="business-setup__option-icon business-setup__option-icon--help">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <div class="business-setup__option-content">
              <h3>¿Necesitas Ayuda?</h3>
              <p>Contacta con nuestro equipo de soporte para recibir asistencia</p>
              <router-link to="/contact" class="business-setup__btn business-setup__btn--outline">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                Contactar Soporte
              </router-link>
            </div>
          </div>
        </div>

        <!-- Información adicional -->
        <div class="business-setup__info">
          <div class="business-setup__info-card">
            <h4>¿Por qué necesito un negocio asignado?</h4>
            <ul>
              <li>Para gestionar productos y menús específicos</li>
              <li>Para recibir y procesar pedidos</li>
              <li>Para acceder a estadísticas y analíticas</li>
              <li>Para configurar horarios y zonas de entrega</li>
            </ul>
          </div>
        </div>

        <!-- Acción para volver -->
        <div class="business-setup__footer">
          <router-link to="/" class="business-setup__back-link">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            Volver al inicio
          </router-link>
        </div>
      </div>
    </div>

    <!-- Modal de contacto -->
    <div v-if="showContactForm" class="business-setup__modal" @click.self="showContactForm = false">
      <div class="business-setup__modal-content">
        <div class="business-setup__modal-header">
          <h3>Solicitar Acceso a Negocio</h3>
          <button @click="showContactForm = false" class="business-setup__modal-close">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="business-setup__modal-body">
          <form @submit.prevent="submitContactForm" class="business-setup__contact-form">
            <div class="business-setup__form-field">
              <label>Nombre del Negocio</label>
              <input
                type="text"
                v-model="contactForm.businessName"
                placeholder="Nombre del restaurante o negocio"
                required
              />
            </div>
            <div class="business-setup__form-field">
              <label>Tu Rol</label>
              <select v-model="contactForm.role" required>
                <option value="">Selecciona tu rol</option>
                <option value="owner">Propietario</option>
                <option value="manager">Gerente</option>
                <option value="employee">Empleado</option>
                <option value="other">Otro</option>
              </select>
            </div>
            <div class="business-setup__form-field">
              <label>Mensaje (opcional)</label>
              <textarea
                v-model="contactForm.message"
                placeholder="Explica tu situación o proporciona más detalles..."
                rows="4"
              ></textarea>
            </div>
            <div class="business-setup__form-actions">
              <button type="button" @click="showContactForm = false" class="business-setup__btn business-setup__btn--outline">
                Cancelar
              </button>
              <button type="submit" class="business-setup__btn business-setup__btn--primary" :disabled="isSubmitting">
                <span v-if="isSubmitting">Enviando...</span>
                <span v-else>Enviar Solicitud</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Estados
const showContactForm = ref(false)
const isSubmitting = ref(false)

// Formulario de contacto
const contactForm = reactive({
  businessName: '',
  role: '',
  message: ''
})

// Funciones
const submitContactForm = async () => {
  isSubmitting.value = true

  try {
    // Aquí implementarías el envío del formulario
    // Por ejemplo, enviar email o crear ticket de soporte
    console.log('Enviando solicitud:', {
      user: authStore.user,
      ...contactForm
    })

    // Simular envío
    await new Promise(resolve => setTimeout(resolve, 2000))

    alert('Solicitud enviada correctamente. Te contactaremos pronto.')
    showContactForm.value = false

    // Resetear formulario
    contactForm.businessName = ''
    contactForm.role = ''
    contactForm.message = ''

  } catch (error) {
    console.error('Error enviando solicitud:', error)
    alert('Error al enviar la solicitud. Inténtalo de nuevo.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style lang="scss" scoped>
.business-setup {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;

  &__container {
    max-width: 800px;
    width: 100%;
    background: white;
    border-radius: 16px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  &__header {
    background: linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%);
    color: white;
    padding: 3rem 2rem;
    text-align: center;
  }

  &__logo-img {
    height: 40px;
    margin-bottom: 1rem;
  }

  &__title {
    font-size: 2rem;
    font-weight: 700;
    margin: 0 0 0.5rem;
  }

  &__subtitle {
    font-size: 1.1rem;
    opacity: 0.9;
    margin: 0;
  }

  &__content {
    padding: 2rem;
  }

  &__options {
    display: grid;
    gap: 1.5rem;
    margin-bottom: 2rem;

    @media (min-width: 768px) {
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    }
  }

  &__option {
    background: #f8fafc;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    padding: 1.5rem;
    text-align: center;
    transition: all 0.3s ease;

    &:hover {
      border-color: #cbd5e0;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }
  }

  &__option-icon {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem;

    svg {
      width: 28px;
      height: 28px;
    }

    &--new {
      background-color: rgba(34, 197, 94, 0.1);
      color: #22c55e;
    }

    &--existing {
      background-color: rgba(59, 130, 246, 0.1);
      color: #3b82f6;
    }

    &--help {
      background-color: rgba(245, 158, 11, 0.1);
      color: #f59e0b;
    }
  }

  &__option-content {
    h3 {
      font-size: 1.2rem;
      font-weight: 600;
      margin: 0 0 0.5rem;
      color: #1e293b;
    }

    p {
      color: #64748b;
      margin: 0 0 1.5rem;
      font-size: 0.9rem;
      line-height: 1.5;
    }
  }

  &__btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 500;
    text-decoration: none;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.9rem;

    svg {
      width: 16px;
      height: 16px;
    }

    &--primary {
      background-color: #ff416c;
      color: white;

      &:hover {
        background-color: #e63946;
        transform: translateY(-1px);
      }
    }

    &--secondary {
      background-color: #3b82f6;
      color: white;

      &:hover {
        background-color: #2563eb;
      }
    }

    &--outline {
      background-color: transparent;
      color: #64748b;
      border: 1px solid #cbd5e1;

      &:hover {
        background-color: #f1f5f9;
        border-color: #94a3b8;
      }
    }
  }

  &__info {
    background: #f8fafc;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 2rem;
  }

  &__info-card {
    h4 {
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0 0 1rem;
      color: #1e293b;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        padding: 0.5rem 0;
        color: #64748b;
        display: flex;
        align-items: center;

        &::before {
          content: '✓';
          color: #22c55e;
          font-weight: bold;
          margin-right: 0.75rem;
        }
      }
    }
  }

  &__footer {
    text-align: center;
    padding-top: 1rem;
    border-top: 1px solid #e2e8f0;
  }

  &__back-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: #64748b;
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.3s ease;

    &:hover {
      color: #475569;
    }

    svg {
      width: 16px;
      height: 16px;
    }
  }

  /* Modal */
  &__modal {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
  }

  &__modal-content {
    background: white;
    border-radius: 12px;
    width: 100%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
  }

  &__modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #e2e8f0;

    h3 {
      margin: 0;
      font-size: 1.2rem;
      font-weight: 600;
      color: #1e293b;
    }
  }

  &__modal-close {
    background: none;
    border: none;
    color: #64748b;
    cursor: pointer;
    padding: 0.5rem;

    &:hover {
      color: #475569;
    }

    svg {
      width: 20px;
      height: 20px;
    }
  }

  &__modal-body {
    padding: 1.5rem;
  }

  &__contact-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__form-field {
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #374151;
      font-size: 0.9rem;
    }

    input,
    select,
    textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 0.9rem;
      transition: border-color 0.3s ease;

      &:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }
    }

    textarea {
      resize: vertical;
    }
  }

  &__form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 1rem;
  }
}
</style>
