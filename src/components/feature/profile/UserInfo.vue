<!-- src/components/feature/profile/UserInfo.vue -->
<template>
    <div class="user-info-component">
        <div class="form-header">
            <h2 class="form-title">Mi Información Personal</h2>
            <p class="form-description">Administra tu información personal y preferencias de contacto</p>
        </div>

        <form @submit.prevent="saveInfo" class="user-info-form">
            <div class="form-row">
                <div class="form-group">
                    <label for="firstName">Nombre</label>
                    <input type="text" id="firstName" v-model="localUserInfo.firstName" placeholder="Tu nombre"
                        required>
                </div>
                <div class="form-group">
                    <label for="lastName">Apellido</label>
                    <input type="text" id="lastName" v-model="localUserInfo.lastName" placeholder="Tu apellido"
                        required>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" v-model="localUserInfo.email" placeholder="tu@email.com" required>
                </div>
                <div class="form-group">
                    <label for="phone">Teléfono</label>
                    <input type="tel" id="phone" v-model="localUserInfo.phone" placeholder="+34 XXX XXX XXX">
                </div>
            </div>

            <div class="form-row">
                <div class="form-group form-group--full">
                    <label for="birthdate">Fecha de nacimiento</label>
                    <input type="date" id="birthdate" v-model="localUserInfo.birthdate">
                </div>
            </div>

            <div class="form-divider"></div>

            <div class="form-row">
                <div class="form-group form-group--full">
                    <label>Preferencias nutricionales</label>
                    <div class="dietary-preferences">
                        <button type="button" v-for="pref in dietaryPreferences" :key="pref.id" :class="[
                            'dietary-preference-tag',
                            {
                                'dietary-preference-tag--active': localUserInfo.dietaryPreferences.includes(pref.id),
                            },
                        ]" @click="toggleDietaryPreference(pref.id)">
                            <span class="dietary-preference-icon">{{ pref.icon }}</span>
                            <span>{{ pref.label }}</span>
                        </button>
                    </div>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group form-group--full">
                    <label for="bio">Sobre mí (opcional)</label>
                    <textarea id="bio" v-model="localUserInfo.bio" rows="4"
                        placeholder="Cuéntanos un poco sobre ti..."></textarea>
                </div>
            </div>

            <div class="form-row form-actions">
                <button type="submit" class="save-button">Guardar cambios</button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';

const props = defineProps({
    userInfo: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['update']);

const localUserInfo = reactive({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthdate: '',
    bio: '',
    dietaryPreferences: [] as string[]
});

// Dietary preferences options
const dietaryPreferences = [
    { id: 'vegetarian', label: 'Vegetariano', icon: '🥗' },
    { id: 'vegan', label: 'Vegano', icon: '🌱' },
    { id: 'glutenFree', label: 'Sin Gluten', icon: '🌾' },
    { id: 'lactoseFree', label: 'Sin Lactosa', icon: '🥛' },
    { id: 'nutFree', label: 'Sin Frutos Secos', icon: '🥜' },
    { id: 'pescatarian', label: 'Pescatariano', icon: '🐟' },
    { id: 'keto', label: 'Keto', icon: '🥩' },
    { id: 'paleo', label: 'Paleo', icon: '🍖' }
];

// Initialize with props
onMounted(() => {
    Object.assign(localUserInfo, props.userInfo);
});

// Watch for prop changes
watch(() => props.userInfo, (newVal) => {
    Object.assign(localUserInfo, newVal);
}, { deep: true });

// Toggle dietary preference
const toggleDietaryPreference = (prefId: string) => {
    const index = localUserInfo.dietaryPreferences.indexOf(prefId);
    if (index === -1) {
        localUserInfo.dietaryPreferences.push(prefId);
    } else {
        localUserInfo.dietaryPreferences.splice(index, 1);
    }
};

// Save user info
const saveInfo = () => {
    emit('update', { ...localUserInfo });
};
</script>

<style lang="scss" scoped>
.user-info-component {
    width: 100%;
}

.form-header {
    margin-bottom: 2rem;
}

.form-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 0.5rem;
    color: #1e293b;
}

.form-description {
    color: #64748b;
    margin: 0;
}

.user-info-form {
    width: 100%;
}

.form-row {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 1.5rem;

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 1rem;
    }
}

.form-group {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    &--full {
        width: 100%;
    }

    label {
        font-weight: 600;
        color: #1e293b;
    }

    input,
    textarea {
        padding: 0.75rem 1rem;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        font-size: 1rem;
        transition: all 0.3s ease;

        &:focus {
            outline: none;
            border-color: #FF416C;
            box-shadow: 0 0 0 3px rgba(#FF416C, 0.1);
        }
    }

    textarea {
        resize: vertical;
    }
}

.form-divider {
    height: 1px;
    background-color: #e2e8f0;
    margin: 2rem 0;
}

.dietary-preferences {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
}

.dietary-preference-tag {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1.25rem;
    border: 1px solid #e2e8f0;
    border-radius: 50px;
    background-color: white;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        border-color: #FF416C;
        color: #FF416C;
    }

    &--active {
        background: linear-gradient(to right, #FF416C, #FF4B2B);
        color: white;
        border-color: transparent;

        &:hover {
            color: white;
            box-shadow: 0 5px 15px rgba(#FF416C, 0.2);
        }
    }

    &-icon {
        font-size: 1.2rem;
    }
}

.form-actions {
    margin-top: 2rem;
    display: flex;
    justify-content: flex-end;
}

.save-button {
    padding: 0.75rem 2rem;
    background: linear-gradient(to right, #FF416C, #FF4B2B);
    color: white;
    border: none;
    border-radius: 50px;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(#FF416C, 0.3);
    }

    &:active {
        transform: translateY(0);
    }
}
</style>