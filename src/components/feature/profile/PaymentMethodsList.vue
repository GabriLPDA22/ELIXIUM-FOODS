<!-- src/components/feature/profile/PaymentMethodsList.vue - CON VALIDACIONES CONDICIONALES -->
<template>
  <div class="payment-methods-list">
    <div class="payment-methods-list__header">
      <h2 class="payment-methods-list__title">Mis métodos de pago</h2>
      <button @click="openCreateModal" class="payment-methods-list__add-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        <span>Agregar método de pago</span>
      </button>
    </div>

    <div v-if="loading" class="payment-methods-list__loading">
      <div class="payment-methods-list__loading-spinner"></div>
      <p>Cargando métodos de pago...</p>
    </div>

    <div v-else-if="error" class="payment-methods-list__error">
      <div class="payment-methods-list__error-icon">❌</div>
      <h3 class="payment-methods-list__error-title">Error al cargar métodos de pago</h3>
      <p class="payment-methods-list__error-text">{{ error }}</p>
      <button @click="fetchPaymentMethods" class="payment-methods-list__error-btn">Intentar de nuevo</button>
    </div>

    <div v-else-if="paymentMethods.length === 0" class="payment-methods-list__empty">
      <div class="payment-methods-list__empty-icon">💳</div>
      <h3 class="payment-methods-list__empty-title">No tienes métodos de pago guardados</h3>
      <p class="payment-methods-list__empty-text">Agrega un método de pago para agilizar tus compras</p>
      <button @click="openCreateModal" class="payment-methods-list__empty-btn">Agregar método de pago</button>
    </div>

    <div v-else class="payment-methods-list__container">
      <div v-for="paymentMethod in paymentMethods" :key="paymentMethod.id"
        :class="['payment-card', { 'payment-card--default': paymentMethod.isDefault }]">
        <div class="payment-card__content">
          <div class="payment-card__header">
            <div class="payment-card__icon">
              <!-- Visa Icon -->
              <svg v-if="paymentMethod.type?.toLowerCase() === 'visa'" width="24" height="16" viewBox="0 0 48 32" fill="none">
                <rect width="48" height="32" rx="4" fill="#1434CB"/>
                <path d="M18.5 22L21.3 10H24.7L21.9 22H18.5ZM15.4 10L12.8 18.8L12.5 17.2L11.5 12.3C11.3 11.5 10.6 10.1 9.6 10H4.1L4 10.3C5.5 10.6 7.1 11.2 8.4 12L10.7 22H14.2L19.8 10H15.4ZM43.6 22H46.7L44.1 10H41.2C40.4 10 39.8 10.4 39.5 11.1L34.4 22H37.9L38.7 20H43L43.4 22H43.6ZM39.8 17.2L41.4 13.4L42.4 17.2H39.8ZM33.1 13.4C33.1 12.1 31.9 11.2 29.8 11.2C27.6 11.2 25.9 12.2 25.9 13.7C25.9 14.8 26.9 15.4 27.6 15.8C28.4 16.2 28.7 16.5 28.7 16.9C28.7 17.5 28 17.8 27.3 17.8C26.3 17.8 25.8 17.6 25.2 17.3L24.8 17.1L24.4 19.6C24.9 19.8 25.8 20 26.8 20C29.2 20 30.8 19 30.9 17.4C30.9 16.5 30.3 15.8 29 15.2C28.4 14.9 28 14.6 28 14.2C28 13.8 28.5 13.4 29.6 13.4C30.4 13.4 31 13.6 31.5 13.8L31.7 13.9L32.1 11.5C31.6 11.3 30.9 11.2 30 11.2L33.1 13.4Z" fill="white"/>
              </svg>

              <!-- Mastercard Icon -->
              <svg v-else-if="paymentMethod.type?.toLowerCase() === 'mastercard'" width="24" height="16" viewBox="0 0 48 32" fill="none">
                <rect width="48" height="32" rx="4" fill="#000000"/>
                <circle cx="18" cy="16" r="10" fill="#FF5F00"/>
                <circle cx="30" cy="16" r="10" fill="#EB001B"/>
                <circle cx="24" cy="16" r="10" fill="#F79E1B"/>
              </svg>

              <!-- PayPal Icon -->
              <svg v-else-if="paymentMethod.type?.toLowerCase() === 'paypal'" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm1.565-3.2c.027-.17.186-.3.358-.3h.93c1.49 0 2.823-.178 3.909-.6 1.086-.42 1.942-1.05 2.56-1.933.618-.885.987-1.997 1.09-3.342.103-1.345-.15-2.543-.759-3.59-.61-1.048-1.6-1.69-2.97-1.928-.27-.047-.56-.07-.87-.07H9.947c-.345 0-.63.199-.686.48L7.641 18.137z" fill="#253B80"/>
                <path d="M23.048 7.667c-.028.179-.06.362-.096.55-1.237 6.351-5.469 8.545-10.874 8.545H9.966c-.618 0-1.14.429-1.24 1.007l-.73 4.995-.31 2.042c-.058.38.193.72.566.72h4.78c.434 0 .802-.31.87-.73l.037-.2.73-4.71.045-.244c.058-.43.434-.73.87-.73h.548c3.934 0 7.022-1.59 7.93-6.189.38-1.92.18-3.53-.7-4.69-.297-.39-.67-.71-1.115-.952z" fill="#179BD7"/>
                <path d="M21.754 7.151c-.189-.28-.404-.54-.655-.773-1.565-1.496-4.198-2.18-7.803-2.18H8.465c-.618 0-1.141.429-1.24 1.007L4.939 15.6c-.071.445.264.85.718.85h5.194l1.206-7.639-.037.037c.099-.578.622-1.007 1.24-1.007h2.831c3.605 0 6.238.684 7.803 2.18.251.233.466.493.655.773.387.6.622 1.282.748 2.027.007-.053.011-.106.015-.159L23.048 7.667z" fill="#222D65"/>
              </svg>

              <!-- Generic Credit Card Icon -->
              <svg v-else width="24" height="16" viewBox="0 0 48 32" fill="none">
                <rect width="48" height="32" rx="4" fill="#6B7280" stroke="#D1D5DB"/>
                <rect x="4" y="8" width="40" height="4" fill="#374151"/>
                <rect x="4" y="18" width="12" height="2" fill="#9CA3AF"/>
                <rect x="4" y="22" width="8" height="2" fill="#9CA3AF"/>
                <rect x="36" y="18" width="8" height="6" fill="#D1D5DB"/>
              </svg>
            </div>
            <div class="payment-card__type">{{ getPaymentTypeLabel(paymentMethod.type) }}</div>
          </div>
          <h3 class="payment-card__title">{{ paymentMethod.nickname }}</h3>
          <p class="payment-card__details">{{ getPaymentMethodDescription(paymentMethod) }}</p>
          <div class="payment-card__badge" v-if="paymentMethod.isDefault">Predeterminado</div>
        </div>

        <div class="payment-card__actions">
          <button class="payment-card__action-btn payment-card__action-btn--edit"
            @click="openEditModal(paymentMethod)" title="Editar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
          <button class="payment-card__action-btn payment-card__action-btn--delete"
            @click="openDeleteConfirmation(paymentMethod)" title="Eliminar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2">
              </path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
          <button v-if="!paymentMethod.isDefault" class="payment-card__action-btn payment-card__action-btn--default"
            @click="setAsDefault(paymentMethod)" title="Establecer como predeterminado">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal para agregar/editar método de pago -->
    <div v-if="showModal" class="modal">
      <div class="modal__backdrop" @click="closeModal"></div>
      <div class="modal__container">
        <div class="modal__header">
          <h3>{{ isEditing ? 'Editar método de pago' : 'Agregar nuevo método de pago' }}</h3>
          <button class="modal__close" @click="closeModal">❌</button>
        </div>
        <div class="modal__body">
          <form @submit.prevent="savePaymentMethod" class="payment-form">
            <div v-if="formError" class="payment-form__error">
              ❌ {{ formError }}
            </div>

            <div class="payment-form__field">
              <label for="nickname">Nombre del método de pago *</label>
              <input
                id="nickname"
                v-model="paymentForm.nickname"
                type="text"
                placeholder="Ej: Tarjeta personal, PayPal trabajo"
                required
                maxlength="100"
              >
            </div>

            <div class="payment-form__field">
              <label for="type">Tipo de pago *</label>
              <select id="type" v-model="paymentForm.type" required @change="onPaymentTypeChange">
                <option value="">Selecciona un tipo</option>
                <option value="visa">Visa</option>
                <option value="mastercard">Mastercard</option>
                <option value="paypal">PayPal</option>
                <option value="other">Otro tipo de tarjeta</option>
              </select>
            </div>

            <!-- Campos para tarjetas -->
            <div v-if="isCardType(paymentForm.type)" class="payment-form__card-section">
              <h4>Información de la tarjeta</h4>

              <div class="payment-form__field">
                <label for="cardNumber">Número de tarjeta *</label>
                <input
                  id="cardNumber"
                  v-model="paymentForm.cardNumber"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  maxlength="19"
                  @input="formatCardNumber"
                  required
                >
              </div>

              <div class="payment-form__row">
                <div class="payment-form__field">
                  <label for="expiryDate">Fecha de vencimiento *</label>
                  <input
                    id="expiryDate"
                    v-model="paymentForm.expiryDate"
                    type="text"
                    placeholder="MM/AA"
                    maxlength="5"
                    @input="formatExpiryDate"
                    required
                  >
                  <small>Formato: MM/AA (ej: 12/25)</small>
                </div>
                <div class="payment-form__field">
                  <label for="cvv">CVV *</label>
                  <input
                    id="cvv"
                    v-model="paymentForm.cvv"
                    type="text"
                    placeholder="123"
                    maxlength="4"
                    required
                  >
                </div>
              </div>

              <div class="payment-form__field">
                <label for="cardholderName">Nombre del titular *</label>
                <input
                  id="cardholderName"
                  v-model="paymentForm.cardholderName"
                  type="text"
                  placeholder="Como aparece en la tarjeta"
                  required
                  maxlength="100"
                >
              </div>
            </div>

            <!-- Campos para PayPal -->
            <div v-if="paymentForm.type === 'paypal'" class="payment-form__paypal-section">
              <h4>Información de PayPal</h4>

              <div class="payment-form__field">
                <label for="paypalEmail">Email de PayPal *</label>
                <input
                  id="paypalEmail"
                  v-model="paymentForm.payPalEmail"
                  type="email"
                  placeholder="tu@email.com"
                  required
                  maxlength="255"
                >
              </div>
            </div>

            <div class="payment-form__field payment-form__field--checkbox">
              <input id="isDefault" v-model="paymentForm.isDefault" type="checkbox">
              <label for="isDefault">Establecer como método predeterminado</label>
            </div>

            <div class="payment-form__security-note">
              🔒 Tus datos de pago están protegidos con encriptación de nivel bancario
            </div>

            <div class="payment-form__actions">
              <button type="button" class="payment-form__button payment-form__button--cancel" @click="closeModal">
                Cancelar
              </button>
              <button type="submit" class="payment-form__button payment-form__button--save" :disabled="formSaving">
                <span v-if="formSaving">Guardando...</span>
                <span v-else>{{ isEditing ? 'Guardar cambios' : 'Guardar método' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación para eliminar -->
    <div v-if="showDeleteModal" class="modal">
      <div class="modal__backdrop" @click="closeDeleteModal"></div>
      <div class="modal__container modal__container--confirmation">
        <div class="modal__header">
          <h3>Eliminar método de pago</h3>
          <button class="modal__close" @click="closeDeleteModal">❌</button>
        </div>
        <div class="modal__body">
          <p class="modal__confirmation-text">
            ¿Estás seguro que deseas eliminar "{{ paymentToDelete?.nickname }}"?
            Esta acción no se puede deshacer.
          </p>
          <div class="modal__actions">
            <button class="modal__button modal__button--cancel" @click="closeDeleteModal">Cancelar</button>
            <button class="modal__button modal__button--delete" @click="confirmDelete" :disabled="deleteLoading">
              <span v-if="deleteLoading">Eliminando...</span>
              <span v-else>Eliminar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { paymentService, type PaymentMethodInfo } from '@/services/paymentService';

const emit = defineEmits(['update']);

// Estado
const loading = ref(false);
const error = ref('');
const paymentMethods = ref<PaymentMethodInfo[]>([]);
const showModal = ref(false);
const showDeleteModal = ref(false);
const isEditing = ref(false);
const paymentToEdit = ref<PaymentMethodInfo | null>(null);
const paymentToDelete = ref<PaymentMethodInfo | null>(null);
const formError = ref('');
const formSaving = ref(false);
const deleteLoading = ref(false);

// Formulario
const paymentForm = ref({
  id: undefined as number | undefined,
  nickname: '',
  type: '',
  cardNumber: '',
  expiryDate: '',
  cvv: '',
  cardholderName: '',
  payPalEmail: '',
  isDefault: false
});

// ===== MÉTODOS UTILITARIOS =====
const resetForm = () => {
  paymentForm.value = {
    id: undefined,
    nickname: '',
    type: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    payPalEmail: '',
    isDefault: false
  };
  formError.value = '';
};

const getPaymentTypeLabel = (type: string): string => {
  const types: Record<string, string> = {
    visa: 'Visa',
    mastercard: 'Mastercard',
    paypal: 'PayPal',
    other: 'Otro'
  };
  return types[type?.toLowerCase()] || 'Desconocido';
};

const getPaymentMethodDescription = (paymentMethod: PaymentMethodInfo): string => {
  return paymentService.getPaymentMethodDescription(paymentMethod);
};

const isCardType = (type: string): boolean => {
  return ['visa', 'mastercard', 'other'].includes(type?.toLowerCase());
};

// 🔍 LIMPIAR CAMPOS CUANDO CAMBIA EL TIPO
const onPaymentTypeChange = () => {
  // Limpiar campos específicos cuando cambia el tipo
  paymentForm.value.cardNumber = '';
  paymentForm.value.expiryDate = '';
  paymentForm.value.cvv = '';
  paymentForm.value.cardholderName = '';
  paymentForm.value.payPalEmail = '';
  formError.value = '';
};

const formatCardNumber = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const formatted = paymentService.formatCardNumber(input.value);
  paymentForm.value.cardNumber = formatted;
};

const formatExpiryDate = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const formatted = paymentService.formatExpiryDate(input.value);
  paymentForm.value.expiryDate = formatted;
};

// ===== MÉTODOS CRUD =====
const openCreateModal = () => {
  resetForm();
  isEditing.value = false;
  showModal.value = true;
};

const openEditModal = (paymentMethod: PaymentMethodInfo) => {
  resetForm();
  isEditing.value = true;
  paymentToEdit.value = { ...paymentMethod };

  paymentForm.value = {
    id: paymentMethod.id,
    nickname: paymentMethod.nickname,
    type: paymentMethod.type,
    cardNumber: '',
    expiryDate: paymentMethod.expiryMonth && paymentMethod.expiryYear
      ? `${paymentMethod.expiryMonth.toString().padStart(2, '0')}/${paymentMethod.expiryYear.toString().slice(-2)}`
      : '',
    cvv: '',
    cardholderName: paymentMethod.cardholderName || '',
    payPalEmail: paymentMethod.payPalEmail || '',
    isDefault: paymentMethod.isDefault
  };

  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  isEditing.value = false;
  paymentToEdit.value = null;
  resetForm();
};

const savePaymentMethod = async () => {
  formSaving.value = true;
  formError.value = '';

  try {
    console.log('💾 Guardando método de pago:', paymentForm.value);

    // 🔍 VALIDACIÓN CONDICIONAL ANTES DE ENVIAR
    const paymentType = paymentForm.value.type.toLowerCase();

    if (paymentType === 'paypal') {
      if (!paymentForm.value.payPalEmail?.trim()) {
        formError.value = 'El email de PayPal es requerido';
        return;
      }
    } else if (['visa', 'mastercard', 'other'].includes(paymentType)) {
      if (!paymentForm.value.cardNumber?.trim()) {
        formError.value = 'El número de tarjeta es requerido';
        return;
      }
      if (!paymentForm.value.expiryDate?.trim()) {
        formError.value = 'La fecha de vencimiento es requerida';
        return;
      }
      if (!paymentForm.value.cvv?.trim()) {
        formError.value = 'El CVV es requerido';
        return;
      }
      if (!paymentForm.value.cardholderName?.trim()) {
        formError.value = 'El nombre del titular es requerido';
        return;
      }
    }

    const paymentData = {
      nickname: paymentForm.value.nickname,
      type: paymentForm.value.type,
      cardNumber: paymentForm.value.cardNumber,
      expiryDate: paymentForm.value.expiryDate,
      cvv: paymentForm.value.cvv,
      cardholderName: paymentForm.value.cardholderName,
      payPalEmail: paymentForm.value.payPalEmail,
      isDefault: paymentForm.value.isDefault
    };

    if (isEditing.value && paymentForm.value.id) {
      // Actualizar método existente
      await paymentService.updatePaymentMethod(paymentForm.value.id, paymentData);
    } else {
      // Crear nuevo método
      await paymentService.addPaymentMethod(paymentData);
    }

    // Recargar lista y cerrar modal
    await fetchPaymentMethods();
    closeModal();
    emit('update', paymentMethods.value);

  } catch (err: any) {
    console.error('❌ Error al guardar método de pago:', err);
    formError.value = err.message || 'Error al guardar el método de pago';
  } finally {
    formSaving.value = false;
  }
};

const setAsDefault = async (paymentMethod: PaymentMethodInfo) => {
  if (!paymentMethod.id) return;

  try {
    await paymentService.setDefaultPaymentMethod(paymentMethod.id);
    await fetchPaymentMethods();
    emit('update', paymentMethods.value);
  } catch (err: any) {
    console.error('Error al establecer método predeterminado:', err);
  }
};

const openDeleteConfirmation = (paymentMethod: PaymentMethodInfo) => {
  paymentToDelete.value = paymentMethod;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  paymentToDelete.value = null;
  showDeleteModal.value = false;
  deleteLoading.value = false;
};

const confirmDelete = async () => {
  if (!paymentToDelete.value || !paymentToDelete.value.id) {
    closeDeleteModal();
    return;
  }

  deleteLoading.value = true;

  try {
    await paymentService.deletePaymentMethod(paymentToDelete.value.id);
    await fetchPaymentMethods();
    emit('update', paymentMethods.value);
    closeDeleteModal();
  } catch (err: any) {
    console.error('Error al eliminar método de pago:', err);
    closeDeleteModal();
  } finally {
    deleteLoading.value = false;
  }
};

// Cargar métodos de pago
const fetchPaymentMethods = async () => {
  loading.value = true;
  error.value = '';

  try {
    console.log('🔄 Iniciando carga de métodos de pago...');
    const methods = await paymentService.getUserPaymentMethods();
    paymentMethods.value = methods;
    console.log('✅ Métodos de pago cargados:', methods.length);
  } catch (err: any) {
    console.error("❌ Error al cargar métodos de pago:", err);
    error.value = err.message || 'No pudimos cargar tus métodos de pago';
    paymentMethods.value = [];
  } finally {
    loading.value = false;
  }
};

// Inicialización
onMounted(() => {
  console.log('🚀 PaymentMethodsList mounted');
  fetchPaymentMethods();
});
</script>

<style lang="scss" scoped>
$primary: #FF416C;
$primary-gradient: linear-gradient(to right, #FF416C, #FF4B2B);
$dark: #1e293b;
$light: #f8fafc;
$text: #1e293b;
$text-light: #64748b;
$border: #e2e8f0;
$border-radius: 12px;
$transition: all 0.3s ease;

.payment-methods-list {
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 1rem;
    }
  }

  &__title {
    font-size: 1.5rem;
    font-weight: 700;
    color: $dark;
    margin: 0;
  }

  &__add-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: $primary-gradient;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 50px;
    cursor: pointer;
    transition: $transition;
    font-weight: 600;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba($primary, 0.3);
    }
  }

  &__loading, &__error, &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    text-align: center;
    background: white;
    border-radius: $border-radius;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }

  &__loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid $border;
    border-radius: 50%;
    border-top-color: $primary;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }

  &__error-icon, &__empty-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  &__error-title, &__empty-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0 0 0.5rem;
    color: $dark;
  }

  &__error-text, &__empty-text {
    color: $text-light;
    margin: 0 0 2rem;
  }

  &__error-btn, &__empty-btn {
    background: $primary-gradient;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 50px;
    font-weight: 600;
    cursor: pointer;
    transition: $transition;

    &:hover {
      transform: translateY(-2px);
    }
  }

  &__container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.5rem;
  }
}

.payment-card {
  position: relative;
  background: white;
  border: 2px solid $border;
  border-radius: $border-radius;
  padding: 1.5rem;
  transition: $transition;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    border-color: $primary;

    .payment-card__actions {
      opacity: 1;
    }
  }

  &--default {
    border-color: $primary;
    box-shadow: 0 4px 15px rgba($primary, 0.15);

    &::before {
      content: '⭐';
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 1.2rem;
    }
  }

  &__header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  &__icon {
    font-size: 1.5rem;
  }

  &__type {
    font-size: 0.85rem;
    color: $text-light;
    font-weight: 500;
    text-transform: uppercase;
  }

  &__title {
    font-size: 1.1rem;
    font-weight: 700;
    margin: 0 0 0.5rem;
    color: $dark;
  }

  &__details {
    color: $text-light;
    margin: 0 0 1rem;
    font-size: 0.95rem;
  }

  &__badge {
    display: inline-block;
    background: rgba($primary, 0.1);
    color: $primary;
    padding: 0.25rem 0.75rem;
    border-radius: 50px;
    font-size: 0.75rem;
    font-weight: 600;
  }

  &__actions {
    position: absolute;
    bottom: 0;
    right: 0;
    display: flex;
    gap: 0.5rem;
    padding: 1rem;
    opacity: 0;
    transition: $transition;
  }

  &__action-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    transition: $transition;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      color: currentColor;
      transition: $transition;
    }

    &--edit {
      background: rgba(#0ea5e9, 0.1);
      color: #0ea5e9;
      &:hover {
        background: #0ea5e9;
        color: white;
        transform: scale(1.1);
      }
    }

    &--delete {
      background: rgba(#ef4444, 0.1);
      color: #ef4444;
      &:hover {
        background: #ef4444;
        color: white;
        transform: scale(1.1);
      }
    }

    &--default {
      background: rgba(#f59e0b, 0.1);
      color: #f59e0b;
      &:hover {
        background: #f59e0b;
        color: white;
        transform: scale(1.1);
      }
    }
  }
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;

  &__backdrop {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
  }

  &__container {
    position: relative;
    background: white;
    border-radius: $border-radius;
    width: 100%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);

    &--confirmation {
      max-width: 400px;
    }
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid $border;

    h3 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 700;
      color: $dark;
    }
  }

  &__close {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.2rem;
    padding: 0.25rem;
  }

  &__body {
    padding: 1.5rem;
  }

  &__confirmation-text {
    margin: 0 0 2rem;
    color: $text;
    text-align: center;
    font-size: 1.1rem;
    line-height: 1.5;
  }

  &__actions {
    display: flex;
    justify-content: center;
    gap: 1rem;
  }

  &__button {
    padding: 0.75rem 1.5rem;
    border-radius: 50px;
    font-weight: 600;
    cursor: pointer;
    transition: $transition;

    &--cancel {
      background: $light;
      color: $text;
      border: 1px solid $border;

      &:hover {
        background: white;
      }
    }

    &--delete {
      background: linear-gradient(45deg, #ef4444, #dc2626);
      color: white;
      border: none;

      &:hover:not(:disabled) {
        transform: translateY(-2px);
      }

      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }
    }
  }
}

.payment-form {
  &__error {
    background: rgba(#ef4444, 0.1);
    color: #ef4444;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    border: 1px solid rgba(#ef4444, 0.2);
  }

  &__field {
    margin-bottom: 1.5rem;

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: $dark;
      font-size: 0.95rem;
    }

    input, select {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 2px solid $border;
      border-radius: 8px;
      font-size: 1rem;
      color: $dark;
      transition: $transition;

      &:focus {
        outline: none;
        border-color: $primary;
        box-shadow: 0 0 0 3px rgba($primary, 0.1);
      }
    }

    small {
      display: block;
      margin-top: 0.25rem;
      color: $text-light;
      font-size: 0.8rem;
    }

    &--checkbox {
      display: flex !important;
      align-items: center;
      gap: 0.75rem;

      input[type="checkbox"] {
        width: auto !important;
        margin: 0;
        transform: scale(1.2);
      }

      label {
        margin: 0 !important;
        font-weight: 500 !important;
        cursor: pointer;
      }
    }
  }

  &__row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;

    @media (max-width: 576px) {
      grid-template-columns: 1fr;
    }
  }

  &__card-section, &__paypal-section {
    background: rgba($primary, 0.02);
    border: 1px solid rgba($primary, 0.1);
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;

    h4 {
      margin: 0 0 1rem;
      color: $dark;
      font-size: 1.1rem;
    }

    .payment-form__field:last-child {
      margin-bottom: 0;
    }
  }

  &__security-note {
    background: rgba(#f59e0b, 0.1);
    border: 1px solid rgba(#f59e0b, 0.2);
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1.5rem;
    font-size: 0.9rem;
    color: #92400e;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid $border;

    @media (max-width: 576px) {
      flex-direction: column;
    }
  }

  &__button {
    padding: 0.75rem 1.5rem;
    border-radius: 50px;
    font-weight: 600;
    cursor: pointer;
    transition: $transition;
    font-size: 1rem;
    min-width: 120px;

    &--cancel {
      background: $light;
      color: $text;
      border: 1px solid $border;

      &:hover {
        background: white;
      }
    }

    &--save {
      background: $primary-gradient;
      color: white;
      border: none;

      &:hover:not(:disabled) {
        transform: translateY(-2px);
      }

      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }
    }
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
