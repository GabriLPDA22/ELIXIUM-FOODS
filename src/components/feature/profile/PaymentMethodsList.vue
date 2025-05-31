<!-- src/components/feature/profile/PaymentMethodsList.vue -->
<template>
  <div class="payment-methods-list">
    <div class="payment-methods-list__header">
      <h2 class="payment-methods-list__title">Mis métodos de pago</h2>
      <button @click="showAddPaymentForm = true" class="payment-methods-list__add-btn">
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
      <div class="payment-methods-list__error-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <h3 class="payment-methods-list__error-title">Error al cargar métodos de pago</h3>
      <p class="payment-methods-list__error-text">{{ error }}</p>
      <button @click="fetchPaymentMethods" class="payment-methods-list__error-btn">Intentar de nuevo</button>
    </div>

    <div v-else-if="paymentMethods.length === 0" class="payment-methods-list__empty">
      <div class="payment-methods-list__empty-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
          <line x1="1" y1="10" x2="23" y2="10"></line>
        </svg>
      </div>
      <h3 class="payment-methods-list__empty-title">No tienes métodos de pago guardados</h3>
      <p class="payment-methods-list__empty-text">Agrega un método de pago para agilizar tus compras</p>
      <button @click="showAddPaymentForm = true" class="payment-methods-list__empty-btn">Agregar método de pago</button>
    </div>

    <div v-else class="payment-methods-list__container">
      <div v-for="paymentMethod in paymentMethods" :key="paymentMethod.id"
        :class="['payment-card', { 'payment-card--default': paymentMethod.isDefault }]">
        <div class="payment-card__content">
          <div class="payment-card__header">
            <div class="payment-card__icon">
              <svg v-if="paymentMethod.cardType === 'visa'" width="32" height="32" viewBox="0 0 24 24" fill="none">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" stroke="currentColor" stroke-width="2" />
                <line x1="1" y1="10" x2="23" y2="10" stroke="currentColor" stroke-width="2" />
                <text x="2" y="18" font-size="4" fill="currentColor">VISA</text>
              </svg>
              <svg v-else-if="paymentMethod.cardType === 'mastercard'" width="32" height="32" viewBox="0 0 24 24" fill="none">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" stroke="currentColor" stroke-width="2" />
                <line x1="1" y1="10" x2="23" y2="10" stroke="currentColor" stroke-width="2" />
                <text x="2" y="18" font-size="4" fill="currentColor">MC</text>
              </svg>
              <svg v-else-if="paymentMethod.type === 'paypal'" width="32" height="32" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
                <text x="6" y="16" font-size="6" fill="currentColor">PP</text>
              </svg>
              <svg v-else width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <line x1="1" y1="10" x2="23" y2="10"></line>
              </svg>
            </div>
            <div class="payment-card__type">{{ getPaymentTypeLabel(paymentMethod.type) }}</div>
          </div>
          <h3 class="payment-card__title">{{ paymentMethod.name }}</h3>
          <p class="payment-card__details">
            {{ getPaymentMethodDescription(paymentMethod) }}
          </p>
          <div class="payment-card__badge" v-if="paymentMethod.isDefault">Predeterminado</div>
        </div>
        <div class="payment-card__actions">
          <button class="payment-card__action-btn payment-card__action-btn--edit"
            @click="editPaymentMethod(paymentMethod)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
          <button class="payment-card__action-btn payment-card__action-btn--delete"
            @click="openDeleteConfirmation(paymentMethod)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2 2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
          <button class="payment-card__action-btn payment-card__action-btn--default"
            @click="setAsDefault(paymentMethod)" v-if="!paymentMethod.isDefault">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal para agregar/editar método de pago -->
    <div v-if="showPaymentForm" class="modal">
      <div class="modal__backdrop" @click="closePaymentForm"></div>
      <div class="modal__container">
        <div class="modal__header">
          <h3>{{ isEditing ? 'Editar método de pago' : 'Agregar nuevo método de pago' }}</h3>
          <button class="modal__close" @click="closePaymentForm">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="modal__body">
          <form @submit.prevent="savePaymentMethod" class="payment-form">
            <div v-if="formError" class="payment-form__error">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{{ formError }}</span>
            </div>

            <div class="payment-form__field">
              <label for="nickname">Nombre del método de pago</label>
              <input id="nickname" v-model="paymentForm.nickname" type="text"
                placeholder="Ej: Tarjeta personal, Tarjeta de trabajo" required>
            </div>

            <div class="payment-form__field">
              <label for="type">Tipo de pago</label>
              <select id="type" v-model="paymentForm.type" required>
                <option value="">Selecciona un tipo</option>
                <option value="card">Tarjeta de crédito/débito</option>
                <option value="paypal">PayPal</option>
                <option value="wallet">Monedero digital</option>
              </select>
            </div>

            <div v-if="paymentForm.type === 'card'" class="payment-form__card-section">
              <div class="payment-form__field">
                <label for="cardNumber">Número de tarjeta</label>
                <input id="cardNumber" v-model="paymentForm.cardNumber" type="text" placeholder="1234 5678 9012 3456"
                  maxlength="19" @input="formatCardNumber" required>
              </div>

              <div class="payment-form__row">
                <div class="payment-form__field">
                  <label for="expiryDate">Fecha de vencimiento</label>
                  <input id="expiryDate" v-model="paymentForm.expiryDate" type="text" placeholder="MM/AA" maxlength="5"
                    @input="formatExpiryDate" required>
                </div>
                <div class="payment-form__field">
                  <label for="cvv">CVV</label>
                  <input id="cvv" v-model="paymentForm.cvv" type="text" placeholder="123" maxlength="4" required>
                </div>
              </div>

              <div class="payment-form__field">
                <label for="cardholderName">Nombre del titular</label>
                <input id="cardholderName" v-model="paymentForm.cardholderName" type="text"
                  placeholder="Como aparece en la tarjeta" required>
              </div>
            </div>

            <div v-if="paymentForm.type === 'paypal'" class="payment-form__paypal-section">
              <div class="payment-form__field">
                <label for="paypalEmail">Email de PayPal</label>
                <input id="paypalEmail" v-model="paymentForm.paypalEmail" type="email" placeholder="tu@email.com"
                  required>
              </div>
            </div>

            <div class="payment-form__field payment-form__field--checkbox">
              <input id="isDefault" v-model="paymentForm.isDefault" type="checkbox">
              <label for="isDefault">Establecer como método predeterminado</label>
            </div>

            <div class="payment-form__security-note">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              <span>Tus datos de pago están protegidos con encriptación de nivel bancario</span>
            </div>

            <div class="payment-form__actions">
              <button type="button" class="payment-form__button payment-form__button--cancel"
                @click="closePaymentForm">Cancelar</button>
              <button type="submit" class="payment-form__button payment-form__button--save" :disabled="formSaving">
                <div v-if="formSaving" class="payment-form__spinner"></div>
                <span v-else>{{ isEditing ? 'Guardar cambios' : 'Guardar método' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación para eliminar -->
    <div v-if="showDeleteConfirmation" class="modal">
      <div class="modal__backdrop" @click="closeDeleteConfirmation"></div>
      <div class="modal__container modal__container--confirmation">
        <div class="modal__header">
          <h3>Eliminar método de pago</h3>
          <button class="modal__close" @click="closeDeleteConfirmation">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="modal__body">
          <p class="modal__confirmation-text">
            ¿Estás seguro que deseas eliminar este método de pago? Esta acción no se puede deshacer.
          </p>
          <div class="modal__actions">
            <button class="modal__button modal__button--cancel" @click="closeDeleteConfirmation">Cancelar</button>
            <button class="modal__button modal__button--delete" @click="deletePaymentMethod" :disabled="deleteLoading">
              <div v-if="deleteLoading" class="modal__button-spinner"></div>
              <span v-else>Eliminar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { paymentService, type PaymentMethodInfo, PaymentMethod } from '@/services/paymentService';

const emit = defineEmits(['update']);

// Estado
const loading = ref(false);
const error = ref('');
const paymentMethods = ref<PaymentMethodInfo[]>([]);
const showPaymentForm = ref(false);
const showAddPaymentForm = ref(false);
const isEditing = ref(false);
const paymentToEdit = ref<PaymentMethodInfo | null>(null);
const showDeleteConfirmation = ref(false);
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
  paypalEmail: '',
  isDefault: false
});

// Computed properties
const showPaymentFormComputed = computed({
  get: () => showPaymentForm.value || showAddPaymentForm.value,
  set: (value) => {
    showPaymentForm.value = value;
    if (!value) {
      showAddPaymentForm.value = false;
    }
  }
});

// Métodos
const resetForm = () => {
  paymentForm.value = {
    id: undefined,
    nickname: '',
    type: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    paypalEmail: '',
    isDefault: false
  };
  formError.value = '';
};

const getPaymentTypeLabel = (type: string): string => {
  switch (type) {
    case PaymentMethod.CARD:
      return 'Tarjeta';
    case PaymentMethod.PAYPAL:
      return 'PayPal';
    case PaymentMethod.WALLET:
      return 'Monedero';
    case PaymentMethod.CASH:
      return 'Efectivo';
    default:
      return 'Desconocido';
  }
};

const getPaymentMethodDescription = (paymentMethod: PaymentMethodInfo): string => {
  if (paymentMethod.type === PaymentMethod.PAYPAL) {
    return paymentMethod.name.includes('@') ? paymentMethod.name : 'Cuenta PayPal';
  }

  if (paymentMethod.type === PaymentMethod.CARD && paymentMethod.last4) {
    const expiry = paymentMethod.expiryMonth && paymentMethod.expiryYear
      ? ` • Vence ${paymentMethod.expiryMonth.toString().padStart(2, '0')}/${paymentMethod.expiryYear.toString().slice(-2)}`
      : '';
    return `Termina en ${paymentMethod.last4}${expiry}`;
  }

  return paymentMethod.name;
};

const formatCardNumber = (event: Event) => {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');

  // Limitar a 16 dígitos
  if (value.length > 16) {
    value = value.substring(0, 16);
  }

  // Formatear en grupos de 4
  const formatted = paymentService.formatCardNumber(value);
  paymentForm.value.cardNumber = formatted;
};

const formatExpiryDate = (event: Event) => {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/\D/g, '');
  if (value.length >= 2) {
    value = value.substring(0, 2) + '/' + value.substring(2, 4);
  }
  paymentForm.value.expiryDate = value;
};

const editPaymentMethod = (paymentMethod: PaymentMethodInfo) => {
  if (!paymentMethod.id) {
    console.error('No se puede editar: método de pago sin ID válido');
    return;
  }

  isEditing.value = true;
  paymentToEdit.value = { ...paymentMethod };

  paymentForm.value = {
    id: paymentMethod.id,
    nickname: paymentMethod.name,
    type: paymentMethod.type,
    cardNumber: '', // No mostrar número completo por seguridad
    expiryDate: paymentMethod.expiryMonth && paymentMethod.expiryYear
      ? `${paymentMethod.expiryMonth.toString().padStart(2, '0')}/${paymentMethod.expiryYear.toString().slice(-2)}`
      : '',
    cvv: '',
    cardholderName: '',
    paypalEmail: paymentMethod.type === PaymentMethod.PAYPAL ? paymentMethod.name : '',
    isDefault: paymentMethod.isDefault
  };

  showPaymentForm.value = true;
};

const savePaymentMethod = async () => {
  formSaving.value = true;
  formError.value = '';

  try {
    // Validaciones básicas
    if (!paymentForm.value.nickname || !paymentForm.value.type) {
      formError.value = 'Por favor completa todos los campos requeridos.';
      return;
    }

    if (paymentForm.value.type === 'card') {
      if (!paymentForm.value.cardNumber || !paymentForm.value.expiryDate ||
        !paymentForm.value.cvv || !paymentForm.value.cardholderName) {
        formError.value = 'Por favor completa todos los campos de la tarjeta.';
        return;
      }
    } else if (paymentForm.value.type === 'paypal') {
      if (!paymentForm.value.paypalEmail) {
        formError.value = 'Por favor ingresa tu email de PayPal.';
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
      paypalEmail: paymentForm.value.paypalEmail,
      isDefault: paymentForm.value.isDefault
    };

    if (isEditing.value && paymentForm.value.id) {
      // Para edición, necesitarías implementar updatePaymentMethod en el servicio
      console.log('Actualizando método de pago:', paymentData);
      // Recargar la lista después de editar
      await fetchPaymentMethods();
    } else {
      // Crear nuevo método
      await paymentService.addPaymentMethod(paymentData);
      // Recargar la lista completa para mantener consistencia
      await fetchPaymentMethods();
    }

    closePaymentForm();
    emit('update', paymentMethods.value);
  } catch (err: any) {
    console.error('Error al guardar método de pago:', err);
    formError.value = err.message || 'Error al guardar el método de pago. Por favor, intenta de nuevo.';
  } finally {
    formSaving.value = false;
  }
};

const setAsDefault = async (paymentMethod: PaymentMethodInfo) => {
  if (!paymentMethod.id) {
    console.error('No se puede establecer como predeterminado: ID inválido');
    return;
  }

  try {
    const success = await paymentService.setDefaultPaymentMethod(paymentMethod.id);
    if (success) {
      // Recargar la lista completa para mantener consistencia
      await fetchPaymentMethods();
      emit('update', paymentMethods.value);
    }
  } catch (err: any) {
    console.error('Error al establecer método predeterminado:', err);
  }
};

const openDeleteConfirmation = (paymentMethod: PaymentMethodInfo) => {
  if (!paymentMethod.id) {
    console.error('No se puede eliminar: método de pago sin ID válido');
    return;
  }

  paymentToDelete.value = paymentMethod;
  showDeleteConfirmation.value = true;
};

const closeDeleteConfirmation = () => {
  paymentToDelete.value = null;
  showDeleteConfirmation.value = false;
  deleteLoading.value = false;
};

const deletePaymentMethod = async () => {
  if (!paymentToDelete.value || !paymentToDelete.value.id) {
    console.error('No se puede eliminar: método de pago o ID inválido');
    closeDeleteConfirmation();
    return;
  }

  deleteLoading.value = true;

  try {
    const success = await paymentService.deletePaymentMethod(paymentToDelete.value.id);
    if (success) {
      // Recargar la lista completa para mantener consistencia
      await fetchPaymentMethods();
      emit('update', paymentMethods.value);
    }
    closeDeleteConfirmation();
  } catch (err: any) {
    console.error('Error al eliminar método de pago:', err);
    closeDeleteConfirmation();
  } finally {
    deleteLoading.value = false;
  }
};

const closePaymentForm = () => {
  showPaymentFormComputed.value = false;
  isEditing.value = false;
  paymentToEdit.value = null;
  resetForm();
};

// Cargar métodos de pago desde el servicio real
const fetchPaymentMethods = async () => {
  loading.value = true;
  error.value = '';

  try {
    const methods = await paymentService.getUserPaymentMethods();
    paymentMethods.value = methods;
  } catch (err: any) {
    console.error("Error al cargar métodos de pago:", err);
    error.value = err.message || 'No pudimos cargar tus métodos de pago. Por favor, intenta de nuevo.';
    paymentMethods.value = [];
  } finally {
    loading.value = false;
  }
};

// Observador para mostrar formulario
watch(showAddPaymentForm, (newVal) => {
  if (newVal) {
    isEditing.value = false;
    resetForm();
    showPaymentForm.value = true;
  }
});

// Inicialización
onMounted(() => {
  fetchPaymentMethods();
});
</script>

<style lang="scss" scoped>
// Variables
$primary: #FF416C;
$primary-gradient: linear-gradient(to right, #FF416C, #FF4B2B);
$secondary: #0652DD;
$accent: #FFA502;
$dark: #1e293b;
$light: #f8fafc;
$text: #1e293b;
$text-light: #64748b;
$border: #e2e8f0;
$border-radius: 12px;
$transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);

.payment-methods-list {
  padding: 1rem;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 1rem;
      align-items: stretch;
    }
  }

  &__title {
    font-size: 1.5rem;
    font-weight: 700;
    color: $dark;
    margin: 0;
  }

  &__add-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: $primary-gradient;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 50px;
    cursor: pointer;
    transition: $transition;
    font-size: 0.95rem;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba($primary, 0.2);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba($primary, 0.3);
    }

    @media (max-width: 768px) {
      width: 100%;
      justify-content: center;
    }
  }

  &__loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    text-align: center;
    border-radius: $border-radius;
    background: white;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);

    &-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid $border;
      border-radius: 50%;
      border-top-color: $primary;
      animation: spin 1s linear infinite;
      margin-bottom: 1.5rem;
    }

    p {
      color: $text-light;
      font-size: 1.1rem;
      margin: 0;
    }
  }

  &__error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    text-align: center;
    border-radius: $border-radius;
    background: white;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);

    &-icon {
      color: #ef4444;
      margin-bottom: 1rem;
    }

    &-title {
      color: $dark;
      margin: 0 0 0.5rem;
      font-size: 1.25rem;
      font-weight: 600;
    }

    &-text {
      color: $text-light;
      margin: 0 0 2rem;
    }

    &-btn {
      background: $light;
      border: 1px solid $border;
      color: $text;
      padding: 0.75rem 1.5rem;
      border-radius: 50px;
      font-weight: 600;
      cursor: pointer;
      transition: $transition;

      &:hover {
        background: $primary;
        color: white;
        border-color: $primary;
      }
    }
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    text-align: center;
    background: white;
    border-radius: $border-radius;
    border: 2px dashed $border;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);

    &-icon {
      color: $text-light;
      margin-bottom: 1.5rem;
    }

    &-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0 0 0.5rem;
      color: $dark;
    }

    &-text {
      color: $text-light;
      margin: 0 0 2rem;
      font-size: 1.1rem;
    }

    &-btn {
      background: $primary-gradient;
      color: white;
      border: none;
      padding: 1rem 2rem;
      border-radius: 50px;
      font-weight: 600;
      font-size: 1.1rem;
      cursor: pointer;
      transition: $transition;
      box-shadow: 0 4px 15px rgba($primary, 0.2);

      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 25px rgba($primary, 0.3);
      }
    }
  }

  &__container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.5rem;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
  }
}

.payment-card {
  position: relative;
  background: white;
  border: 2px solid $border;
  border-radius: $border-radius;
  padding: 1.5rem;
  transition: $transition;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    border-color: $primary;

    .payment-card__actions {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &--default {
    border-color: $primary;
    box-shadow: 0 4px 15px rgba($primary, 0.15);

    &::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 0 50px 50px 0;
      border-color: transparent $primary transparent transparent;
    }

    &::after {
      content: '✓';
      position: absolute;
      top: 8px;
      right: 8px;
      color: white;
      font-weight: bold;
      font-size: 0.9rem;
      z-index: 1;
    }
  }

  &__content {
    min-height: 120px;
    position: relative;
    z-index: 2;
  }

  &__header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 30px;
    border-radius: 6px;
    background: $light;
    border: 1px solid $border;
    color: $text-light;

    svg {
      max-width: 100%;
      max-height: 100%;
    }
  }

  &__type {
    font-size: 0.85rem;
    color: $text-light;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
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
    line-height: 1.4;
  }

  &__badge {
    display: inline-block;
    background: rgba($primary, 0.1);
    color: $primary;
    padding: 0.25rem 0.75rem;
    border-radius: 50px;
    font-size: 0.75rem;
    font-weight: 600;
    margin-top: 0.5rem;
  }

  &__actions {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    padding: 1rem;
    background: rgba(white, 0.95);
    backdrop-filter: blur(8px);
    border-top: 1px solid rgba($border, 0.5);
    opacity: 0;
    transform: translateY(100%);
    transition: $transition;
  }

  &__action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    transition: $transition;

    &--edit {
      background: rgba($secondary, 0.1);
      color: $secondary;

      &:hover {
        background: $secondary;
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
      background: rgba($accent, 0.1);
      color: $accent;

      &:hover {
        background: $accent;
        color: white;
        transform: scale(1.1);
      }
    }
  }
}

// MODALES
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
  animation: fadeIn 0.3s ease;

  &__backdrop {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
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
    z-index: 1001;
    animation: slideUp 0.3s ease;

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
    color: $text-light;
    transition: $transition;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;

    &:hover {
      background: rgba($text-light, 0.1);
      color: $dark;
    }
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
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 120px;

    &--cancel {
      background: $light;
      color: $text;
      border: 1px solid $border;

      &:hover {
        background: white;
        border-color: #cbd5e1;
      }
    }

    &--delete {
      background: linear-gradient(45deg, #ef4444, #dc2626);
      color: white;
      border: none;
      box-shadow: 0 4px 12px rgba(#ef4444, 0.2);

      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(#ef4444, 0.3);
      }

      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        transform: none;
      }
    }
  }

  &__button-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s linear infinite;
  }
}

// FORMULARIO
.payment-form {
  &__error {
    background: rgba(#ef4444, 0.1);
    color: #ef4444;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.95rem;
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

    input,
    select {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 2px solid $border;
      border-radius: 8px;
      font-size: 1rem;
      color: $dark;
      transition: $transition;
      background: white;

      &:focus {
        outline: none;
        border-color: $primary;
        box-shadow: 0 0 0 3px rgba($primary, 0.1);
      }

      &::placeholder {
        color: #9ca3af;
      }
    }

    &--checkbox {
      display: flex !important;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.5rem;

      input[type="checkbox"] {
        width: auto !important;
        margin: 0;
        transform: scale(1.2);
        accent-color: $primary;
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

  &__card-section,
  &__paypal-section {
    background: rgba($primary, 0.02);
    border: 1px solid rgba($primary, 0.1);
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;

    .payment-form__field:last-child {
      margin-bottom: 0;
    }
  }

  &__security-note {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: rgba($accent, 0.1);
    border: 1px solid rgba($accent, 0.2);
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1.5rem;
    font-size: 0.9rem;
    color: #cc7600;

    svg {
      color: $accent;
      flex-shrink: 0;
    }
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

      .payment-form__button {
        width: 100%;
      }
    }
  }

  &__button {
    padding: 0.75rem 1.5rem;
    border-radius: 50px;
    font-weight: 600;
    cursor: pointer;
    transition: $transition;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 120px;

    &--cancel {
      background: $light;
      color: $text;
      border: 1px solid $border;

      &:hover {
        background: white;
        border-color: #cbd5e1;
      }
    }

    &--save {
      background: $primary-gradient;
      color: white;
      border: none;
      box-shadow: 0 4px 12px rgba($primary, 0.2);

      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba($primary, 0.3);
      }

      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        transform: none;
      }
    }
  }

  &__spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s linear infinite;
  }
}

// ANIMACIONES
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
