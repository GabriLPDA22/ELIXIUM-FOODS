<!-- src/components/feature/profile/AddressList.vue -->
<template>
    <div class="address-list">
        <div class="address-list__header">
            <h2 class="address-list__title">Mis direcciones</h2>
            <button @click="showAddAddressForm = true" class="address-list__add-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <span>Agregar dirección</span>
            </button>
        </div>

        <div v-if="loading" class="address-list__loading">
            <div class="address-list__loading-spinner"></div>
            <p>Cargando direcciones...</p>
        </div>

        <div v-else-if="addresses.length === 0" class="address-list__empty">
            <div class="address-list__empty-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"
                    stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                </svg>
            </div>
            <h3 class="address-list__empty-title">No tienes direcciones guardadas</h3>
            <p class="address-list__empty-text">Agrega una dirección para agilizar tus compras</p>
            <button @click="showAddAddressForm = true" class="address-list__empty-btn">Agregar dirección</button>
        </div>

        <div v-else class="address-list__container">
            <div v-for="address in addresses" :key="address.id"
                :class="['address-card', { 'address-card--default': address.isDefault }]"
                @click="onSelectAddress(address)">
                <div class="address-card__content">
                    <h3 class="address-card__title">{{ address.name }}</h3>
                    <p class="address-card__address">{{ address.street }} {{ address.number }}</p>
                    <p class="address-card__details">{{ address.neighborhood }}, {{ address.city }}, {{ address.state
                        }}, CP {{ address.zipCode }}</p>
                    <p class="address-card__phone" v-if="address.phone">Tel: {{ address.phone }}</p>
                    <div class="address-card__badge" v-if="address.isDefault">Predeterminada</div>
                </div>
                <div class="address-card__actions">
                    <button class="address-card__action-btn address-card__action-btn--edit"
                        @click.stop="editAddress(address)">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button class="address-card__action-btn address-card__action-btn--delete"
                        @click.stop="openDeleteConfirmation(address)">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2">
                            </path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                    </button>
                    <button class="address-card__action-btn address-card__action-btn--default"
                        @click.stop="setAsDefault(address)" v-if="!address.isDefault">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <!-- Modal para agregar/editar dirección -->
        <div v-if="showAddressForm" class="modal">
            <div class="modal__backdrop" @click="closeAddressForm"></div>
            <div class="modal__container">
                <div class="modal__header">
                    <h3>{{ isEditing ? 'Editar dirección' : 'Agregar nueva dirección' }}</h3>
                    <button class="modal__close" @click="closeAddressForm">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="modal__body">
                    <form @submit.prevent="saveAddress" class="address-form">
                        <div class="address-form__field">
                            <label for="name">Nombre de la dirección</label>
                            <input id="name" v-model="addressForm.name" type="text"
                                placeholder="Ej: Casa, Trabajo, Gimnasio" required>
                        </div>

                        <div class="address-form__row">
                            <div class="address-form__field address-form__field--large">
                                <label for="street">Calle</label>
                                <input id="street" v-model="addressForm.street" type="text"
                                    placeholder="Nombre de la calle" required>
                            </div>
                            <div class="address-form__field address-form__field--small">
                                <label for="number">Número</label>
                                <input id="number" v-model="addressForm.number" type="text" placeholder="Número ext."
                                    required>
                            </div>
                        </div>

                        <div class="address-form__field">
                            <label for="interior">Número Interior (opcional)</label>
                            <input id="interior" v-model="addressForm.interior" type="text"
                                placeholder="Depto, Piso, Interior">
                        </div>

                        <div class="address-form__field">
                            <label for="neighborhood">Colonia/Barrio</label>
                            <input id="neighborhood" v-model="addressForm.neighborhood" type="text"
                                placeholder="Nombre de la colonia" required>
                        </div>

                        <div class="address-form__row">
                            <div class="address-form__field">
                                <label for="city">Ciudad</label>
                                <input id="city" v-model="addressForm.city" type="text" placeholder="Ciudad" required>
                            </div>
                            <div class="address-form__field">
                                <label for="state">Estado</label>
                                <input id="state" v-model="addressForm.state" type="text" placeholder="Estado" required>
                            </div>
                        </div>

                        <div class="address-form__row">
                            <div class="address-form__field">
                                <label for="zipCode">Código Postal</label>
                                <input id="zipCode" v-model="addressForm.zipCode" type="text" placeholder="CP" required>
                            </div>
                            <div class="address-form__field">
                                <label for="phone">Teléfono (opcional)</label>
                                <input id="phone" v-model="addressForm.phone" type="tel"
                                    placeholder="Teléfono de contacto">
                            </div>
                        </div>

                        <div class="address-form__field address-form__field--checkbox">
                            <input id="isDefault" v-model="addressForm.isDefault" type="checkbox">
                            <label for="isDefault">Establecer como dirección predeterminada</label>
                        </div>

                        <div class="address-form__actions">
                            <button type="button" class="address-form__button address-form__button--cancel"
                                @click="closeAddressForm">Cancelar</button>
                            <button type="submit" class="address-form__button address-form__button--save">
                                {{ isEditing ? 'Guardar cambios' : 'Guardar dirección' }}
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
                    <h3>Eliminar dirección</h3>
                    <button class="modal__close" @click="closeDeleteConfirmation">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="modal__body">
                    <p class="modal__confirmation-text">
                        ¿Estás seguro que deseas eliminar esta dirección? Esta acción no se puede deshacer.
                    </p>
                    <div class="modal__actions">
                        <button class="modal__button modal__button--cancel"
                            @click="closeDeleteConfirmation">Cancelar</button>
                        <button class="modal__button modal__button--delete" @click="deleteAddress">Eliminar</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, defineEmits, defineProps } from 'vue';

const emit = defineEmits(['select-address', 'update']);

const props = defineProps({
    checkoutMode: {
        type: Boolean,
        default: false
    }
});

// Estado
const loading = ref(false);
const addresses = ref([
    {
        id: 1,
        name: 'Casa',
        street: 'Calle Principal',
        number: '123',
        interior: '',
        neighborhood: 'Centro',
        city: 'Ciudad de México',
        state: 'CDMX',
        zipCode: '06000',
        phone: '555-123-4567',
        isDefault: true
    },
    {
        id: 2,
        name: 'Trabajo',
        street: 'Av. Reforma',
        number: '456',
        interior: 'Piso 8',
        neighborhood: 'Juárez',
        city: 'Ciudad de México',
        state: 'CDMX',
        zipCode: '06600',
        phone: '555-987-6543',
        isDefault: false
    }
]);
const showAddressForm = ref(false);
const showAddAddressForm = ref(false);
const isEditing = ref(false);
const addressToEdit = ref(null);
const showDeleteConfirmation = ref(false);
const addressToDelete = ref(null);

// Formulario
const addressForm = ref({
    id: null,
    name: '',
    street: '',
    number: '',
    interior: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    isDefault: false
});

// Computed properties
const showAddressFormComputed = computed({
    get: () => showAddressForm.value || showAddAddressForm.value,
    set: (value) => {
        showAddressForm.value = value;
        if (!value) {
            showAddAddressForm.value = false;
        }
    }
});

// Métodos
const resetForm = () => {
    addressForm.value = {
        id: null,
        name: '',
        street: '',
        number: '',
        interior: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: '',
        phone: '',
        isDefault: false
    };
};

const editAddress = (address) => {
    isEditing.value = true;
    addressToEdit.value = { ...address };
    addressForm.value = { ...address };
    showAddressForm.value = true;
};

const saveAddress = () => {
    if (isEditing.value) {
        // Actualizar dirección existente
        const index = addresses.value.findIndex(a => a.id === addressForm.value.id);
        if (index !== -1) {
            // Si la nueva dirección se marca como predeterminada, desmarcar la anterior
            if (addressForm.value.isDefault && !addresses.value[index].isDefault) {
                const prevDefaultIndex = addresses.value.findIndex(a => a.isDefault);
                if (prevDefaultIndex !== -1) {
                    addresses.value[prevDefaultIndex].isDefault = false;
                }
            }
            addresses.value[index] = { ...addressForm.value };
        }
    } else {
        // Crear nueva dirección
        const newId = Math.max(0, ...addresses.value.map(a => a.id)) + 1;
        const newAddress = { ...addressForm.value, id: newId };

        // Si es la primera dirección o se marca como predeterminada, desmarcar la anterior
        if (newAddress.isDefault || addresses.value.length === 0) {
            addresses.value.forEach(a => {
                a.isDefault = false;
            });
            newAddress.isDefault = true;
        }

        addresses.value.push(newAddress);
    }

    closeAddressForm();
    emit('update', addresses.value);
};

const setAsDefault = (address) => {
    addresses.value.forEach(a => {
        a.isDefault = a.id === address.id;
    });
    emit('update', addresses.value);
};

const openDeleteConfirmation = (address) => {
    addressToDelete.value = address;
    showDeleteConfirmation.value = true;
};

const closeDeleteConfirmation = () => {
    addressToDelete.value = null;
    showDeleteConfirmation.value = false;
};

const deleteAddress = () => {
    if (addressToDelete.value) {
        const isDefault = addressToDelete.value.isDefault;
        addresses.value = addresses.value.filter(a => a.id !== addressToDelete.value.id);

        // Si eliminamos la dirección predeterminada, establecer la primera como predeterminada
        if (isDefault && addresses.value.length > 0) {
            addresses.value[0].isDefault = true;
        }

        closeDeleteConfirmation();
        emit('update', addresses.value);
    }
};

const closeAddressForm = () => {
    showAddressFormComputed.value = false;
    isEditing.value = false;
    addressToEdit.value = null;
    resetForm();
};

const onSelectAddress = (address) => {
    if (props.checkoutMode) {
        emit('select-address', address);
    }
};

// Observar cambios en showAddAddressForm para sincronizar con showAddressForm
// y preparar el formulario para agregar dirección
watch(showAddAddressForm, (newVal) => {
    if (newVal) {
        isEditing.value = false;
        resetForm();
        showAddressForm.value = true;
    }
});

// Cargar direcciones (simulado)
const fetchAddresses = async () => {
    loading.value = true;
    try {
        // Simular carga desde API
        await new Promise(resolve => setTimeout(resolve, 500));
        // En una implementación real, aquí se cargarían las direcciones desde el backend
        loading.value = false;
    } catch (error) {
        console.error("Error al cargar direcciones:", error);
        loading.value = false;
    }
};

// Inicialización
onMounted(() => {
    fetchAddresses();
});
</script>

<style lang="scss" scoped>
// Variables
$primary: #FF416C;
$primary-gradient: linear-gradient(to right, #FF416C, #FF4B2B);
$secondary: #0652DD;
$secondary-gradient: linear-gradient(to right, #0652DD, #12CBC4);
$accent: #FFA502;
$dark: #1e293b;
$light: #f8fafc;
$text: #1e293b;
$text-light: #64748b;
$border: #e2e8f0;
$border-radius: 12px;
$transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);

.address-list {
    &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
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
        padding: 0.6rem 1.2rem;
        border-radius: 50px;
        cursor: pointer;
        transition: $transition;
        font-size: 0.95rem;
        font-weight: 600;

        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba($primary, 0.2);
        }
    }

    &__container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
    }

    &__loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 3rem;
        color: $text-light;

        &-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid $border;
            border-top-color: $primary;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 1rem;
        }
    }

    &__empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 3rem;
        background-color: white;
        border-radius: $border-radius;
        border: 1px dashed $border;
        text-align: center;

        &-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 80px;
            height: 80px;
            background-color: $light;
            border-radius: 50%;
            margin-bottom: 1.5rem;
            color: $primary;
        }

        &-title {
            font-size: 1.25rem;
            font-weight: 600;
            margin: 0 0 0.5rem;
            color: $dark;
        }

        &-text {
            color: $text-light;
            margin: 0 0 1.5rem;
        }

        &-btn {
            background: $primary-gradient;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 50px;
            cursor: pointer;
            transition: $transition;
            font-weight: 600;
            font-size: 1rem;

            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba($primary, 0.2);
            }
        }
    }
}

.address-card {
    position: relative;
    border-radius: $border-radius;
    background-color: white;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    padding: 1.5rem;
    border: 1px solid $border;
    transition: $transition;
    overflow: hidden;
    cursor: pointer;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);

        .address-card__actions {
            opacity: 1;
            transform: translateY(0);
        }
    }

    &--default {
        border: 2px solid $primary;
        box-shadow: 0 5px 15px rgba($primary, 0.1);

        &::before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 0;
            height: 0;
            border-style: solid;
            border-width: 0 40px 40px 0;
            border-color: transparent $primary transparent transparent;
        }
    }

    &__content {
        min-height: 140px;
    }

    &__title {
        font-size: 1.1rem;
        font-weight: 700;
        margin: 0 0 0.5rem;
        color: $dark;
    }

    &__address {
        font-weight: 500;
        margin: 0 0 0.25rem;
        color: $text;
    }

    &__details {
        color: $text-light;
        margin: 0 0 0.25rem;
        font-size: 0.9rem;
    }

    &__phone {
        color: $text-light;
        margin: 0.5rem 0 0;
        font-size: 0.9rem;
    }

    &__badge {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        background: rgba($primary, 0.1);
        color: $primary;
        border-radius: 50px;
        font-size: 0.75rem;
        font-weight: 600;
        margin-top: 0.75rem;
    }

    &__actions {
        display: flex;
        gap: 0.5rem;
        background: rgba(white, 0.95);
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 0.75rem;
        transition: $transition;
        opacity: 0;
        transform: translateY(100%);
        backdrop-filter: blur(4px);
        justify-content: flex-end;
        border-top: 1px solid $border;
    }

    &__action-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        cursor: pointer;
        transition: $transition;
        border: none;

        &--edit {
            background-color: rgba($secondary, 0.1);
            color: $secondary;

            &:hover {
                background-color: $secondary;
                color: white;
            }
        }

        &--delete {
            background-color: rgba($primary, 0.1);
            color: $primary;

            &:hover {
                background-color: $primary;
                color: white;
            }
        }

        &--default {
            background-color: rgba($accent, 0.1);
            color: $accent;

            &:hover {
                background-color: $accent;
                color: white;
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

    &__backdrop {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
    }

    &__container {
        position: relative;
        background-color: white;
        border-radius: $border-radius;
        width: 90%;
        max-width: 600px;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        z-index: 1001;

        &--confirmation {
            max-width: 450px;
        }
    }

    &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.25rem 1.5rem;
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

        &:hover {
            color: $dark;
        }
    }

    &__body {
        padding: 1.5rem;
    }

    &__confirmation-text {
        margin: 0 0 1.5rem;
        color: $text;
        text-align: center;
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

        &--cancel {
            background-color: $light;
            color: $text;
            border: 1px solid $border;

            &:hover {
                background-color: darken($light, 5%);
            }
        }

        &--delete {
            background: $primary-gradient;
            color: white;
            border: none;

            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba($primary, 0.2);
            }
        }
    }
}

.address-form {
    &__field {
        margin-bottom: 1.25rem;

        label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: $dark;
            font-size: 0.95rem;
        }

        input[type="text"],
        input[type="tel"] {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 1px solid $border;
            border-radius: 8px;
            font-size: 1rem;
            color: $dark;
            transition: $transition;

            &:focus {
                outline: none;
                border-color: $primary;
                box-shadow: 0 0 0 3px rgba($primary, 0.1);
            }

            &::placeholder {
                color: #a0aec0;
            }
        }

        &--large {
            flex: 3;
        }

        &--small {
            flex: 1;
        }

        &--checkbox {
            display: flex;
            align-items: center;
            gap: 0.5rem;

            input[type="checkbox"] {
                margin: 0;
            }

            label {
                margin: 0;
                cursor: pointer;
            }
        }
    }

    &__row {
        display: flex;
        gap: 1rem;

        @media (max-width: 768px) {
            flex-direction: column;
            gap: 0;
        }
    }

    &__actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        margin-top: 1.5rem;
    }

    &__button {
        padding: 0.75rem 1.5rem;
        border-radius: 50px;
        font-weight: 600;
        cursor: pointer;
        transition: $transition;
        font-size: 1rem;

        &--cancel {
            background-color: $light;
            color: $text;
            border: 1px solid $border;

            &:hover {
                background-color: darken($light, 5%);
            }
        }

        &--save {
            background: $primary-gradient;
            color: white;
            border: none;

            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba($primary, 0.2);
            }
        }
    }
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>