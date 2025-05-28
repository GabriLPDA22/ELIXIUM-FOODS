<template>
  <div class="user-info-component">
    <div class="form-header">
      <h2 class="form-title">Mi Información Personal</h2>
      <p class="form-description">Administra tu información personal y preferencias de contacto</p>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Cargando información del usuario...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <div class="error-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <p>{{ error }}</p>
      <button @click="loadUserInfo" class="retry-button">Intentar de nuevo</button>
    </div>

    <form v-else @submit.prevent="saveInfo" class="user-info-form">
      <div v-if="updateSuccess" class="success-message">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <span>Los cambios se han guardado correctamente</span>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="firstName">Nombre</label>
          <input type="text" id="firstName" v-model="localUserInfo.firstName" placeholder="Tu nombre" required>
        </div>
        <div class="form-group">
          <label for="lastName">Apellido</label>
          <input type="text" id="lastName" v-model="localUserInfo.lastName" placeholder="Tu apellido" required>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="localUserInfo.email" placeholder="tu@email.com" required readonly>
          <small class="email-note">El email no se puede modificar</small>
        </div>
        <div class="form-group">
          <label for="phoneNumber">Teléfono</label>
          <input type="tel" id="phoneNumber" v-model="localUserInfo.phoneNumber" placeholder="+34 XXX XXX XXX">
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
            <button type="button" v-for="pref in dietaryPreferencesOptions" :key="pref.id" :class="[
              'dietary-preference-tag',
              {
                'dietary-preference-tag--active': localUserInfo.dietaryPreferences?.includes(pref.id),
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
        <button type="button" class="cancel-button" @click="resetForm" :disabled="saving">Cancelar</button>
        <button type="submit" class="save-button" :disabled="saving">
          <span v-if="saving" class="save-spinner"></span>
          <span v-else>Guardar cambios</span>
        </button>
      </div>
    </form>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted, watch } from 'vue';
import userService, { type UserProfile } from '@/services/userService';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const loading = ref(false);
const saving = ref(false);
const error = ref('');
const updateSuccess = ref(false);
const originalUserInfo = ref<UserProfile | null>(null);

const localUserInfo = reactive<UserProfile>({
  id: authStore.user?.id || 0,
  firstName: authStore.user?.firstName || '',
  lastName: authStore.user?.lastName || '',
  email: authStore.user?.email || '',
  phoneNumber: (authStore.user as any)?.phoneNumber || '',
  photoURL: authStore.user?.photoURL || '',
  birthdate: '',
  bio: '',
  dietaryPreferences: [],
});

const dietaryPreferencesOptions = [
  { id: 'vegetarian', label: 'Vegetariano', icon: '🥗' },
  { id: 'vegan', label: 'Vegano', icon: '🌱' },
  { id: 'glutenFree', label: 'Sin Gluten', icon: '🌾' },
  { id: 'lactoseFree', label: 'Sin Lactosa', icon: '🥛' },
  { id: 'nutFree', label: 'Sin Frutos Secos', icon: '🥜' },
  { id: 'pescatarian', label: 'Pescatariano', icon: '🐟' },
  { id: 'keto', label: 'Keto', icon: '🥩' },
  { id: 'paleo', label: 'Paleo', icon: '🍖' }
];

const toggleDietaryPreference = (prefId: string) => {
  if (!localUserInfo.dietaryPreferences) {
    localUserInfo.dietaryPreferences = [];
  }
  const index = localUserInfo.dietaryPreferences.indexOf(prefId);
  if (index === -1) {
    localUserInfo.dietaryPreferences.push(prefId);
  } else {
    localUserInfo.dietaryPreferences.splice(index, 1);
  }
};

const loadUserInfo = async () => {
  if (!authStore.isAuthenticated) {
      error.value = "Usuario no autenticado.";
      return;
  }
  loading.value = true;
  error.value = '';
  try {
    const userDataFromApi = await userService.getCurrentUser();
    const mergedData: UserProfile = {
        id: userDataFromApi.id || localUserInfo.id,
        firstName: userDataFromApi.firstName || localUserInfo.firstName,
        lastName: userDataFromApi.lastName || localUserInfo.lastName,
        email: userDataFromApi.email || localUserInfo.email,
        phoneNumber: userDataFromApi.phoneNumber || localUserInfo.phoneNumber,
        photoURL: userDataFromApi.photoURL || localUserInfo.photoURL,
        birthdate: userDataFromApi.birthdate ? new Date(userDataFromApi.birthdate).toISOString().split('T')[0] : '',
        bio: userDataFromApi.bio || '',
        dietaryPreferences: userDataFromApi.dietaryPreferences || [],
        createdAt: userDataFromApi.createdAt
    };
    Object.assign(localUserInfo, mergedData);
    originalUserInfo.value = JSON.parse(JSON.stringify(localUserInfo));
  } catch (err: any) {
    console.error('Error al cargar información del usuario (UserInfo.vue):', err);
    error.value = err.message || 'No se pudo cargar la información del usuario.';
  } finally {
    loading.value = false;
  }
};

const saveInfo = async () => {
  if (!authStore.isAuthenticated) {
      error.value = "No estás autenticado para guardar cambios.";
      return;
  }
  saving.value = true;
  updateSuccess.value = false;
  error.value = '';

  try {
    const dataToUpdate: Partial<UserProfile> = {
      firstName: localUserInfo.firstName,
      lastName: localUserInfo.lastName,
      phoneNumber: localUserInfo.phoneNumber,
      birthdate: localUserInfo.birthdate || null,
      bio: localUserInfo.bio || null,
      dietaryPreferences: localUserInfo.dietaryPreferences || [],
      photoURL: localUserInfo.photoURL || null,
    };

    console.log('Enviando estos datos para actualizar perfil:', dataToUpdate);
    const updatedUserData = await userService.updateUserProfile(dataToUpdate);

    if (authStore.user) {
      authStore.user.firstName = updatedUserData.firstName;
      authStore.user.lastName = updatedUserData.lastName;
      (authStore.user as any).phoneNumber = updatedUserData.phoneNumber;
      authStore.user.photoURL = updatedUserData.photoURL;
      localStorage.setItem('user', JSON.stringify(authStore.user));
    }
    Object.assign(localUserInfo, updatedUserData);
    originalUserInfo.value = JSON.parse(JSON.stringify(localUserInfo));

    updateSuccess.value = true;
    setTimeout(() => {
      updateSuccess.value = false;
    }, 3000);

  } catch (err: any) {
    console.error('Error al guardar información del usuario (UserInfo.vue):', err);
    error.value = err.message || 'Error al guardar los cambios.';
  } finally {
    saving.value = false;
  }
};

const resetForm = () => {
  if (originalUserInfo.value) {
    Object.assign(localUserInfo, JSON.parse(JSON.stringify(originalUserInfo.value)));
  }
  updateSuccess.value = false;
  error.value = '';
};

onMounted(() => {
  if (authStore.isAuthenticated) {
    loadUserInfo();
  } else {
    error.value = "Debes iniciar sesión para ver tu información de perfil.";
  }
});

watch(() => authStore.user, (newUser, oldUser) => {
    if (newUser && (!oldUser || newUser.id !== oldUser.id)) {
        loadUserInfo();
    } else if (!newUser && oldUser) {
        Object.assign(localUserInfo, {
          id: 0,
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          photoURL: '',
          birthdate: '',
          bio: '',
          dietaryPreferences: [],
        });
        originalUserInfo.value = null;
        error.value = "Has cerrado sesión.";
    }
}, { deep: true });
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

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  min-height: 200px; /* Para que no salte tanto el layout */
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0; /* $border */
  border-top-color: #FF416C; /* $primary */
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.error-icon {
  color: #ef4444; /* Color de error */
  margin-bottom: 1rem;
}

.error-container p {
  color: #64748b; /* $text-light */
  margin-bottom: 1.5rem;
}

.retry-button {
  padding: 0.75rem 1.5rem;
  background: #f1f5f9; /* Un gris claro */
  border: 1px solid #e2e8f0; /* $border */
  border-radius: 50px;
  color: #1e293b; /* $text */
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #e2e8f0; /* $border */
  }
}

.success-message {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background-color: rgba(#10b981, 0.1); /* Verde éxito con transparencia */
  color: #10b981; /* Verde éxito */
  border-radius: 8px;
  margin-bottom: 1.5rem;
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
    margin-bottom: 1rem;
  }
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  &--full {
    width: 100%; /* Ocupa todo el ancho si es el único en la fila */
  }

  label {
    font-weight: 600;
    color: #1e293b; /* $dark */
  }

  input,
  textarea {
    padding: 0.75rem 1rem;
    border: 1px solid #e2e8f0; /* $border */
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.3s ease;
    background-color: white;
    color: #1e293b; /* $text */

    &:focus {
      outline: none;
      border-color: #FF416C; /* $primary */
      box-shadow: 0 0 0 3px rgba(#FF416C, 0.1);
    }

    &:read-only {
      background-color: #f8fafc; /* $light */
      cursor: not-allowed;
      color: #64748b; /* $text-light */
    }
  }

  textarea {
    resize: vertical;
    min-height: 80px;
  }

  .email-note {
    font-size: 0.8rem;
    color: #64748b; /* $text-light */
    margin-top: 0.25rem;
  }
}

.form-divider {
  height: 1px;
  background-color: #e2e8f0; /* $border */
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
  border: 1px solid #e2e8f0; /* $border */
  border-radius: 50px;
  background-color: white;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #1e293b; /* $text */

  &:hover {
    border-color: #FF4B2B; /* $primary-hover or similar */
    color: #FF4B2B;
  }

  &--active {
    background: linear-gradient(to right, #FF416C, #FF4B2B); /* $primary-gradient */
    color: white;
    border-color: transparent;

    &:hover {
      color: white; // Mantener color en hover si está activo
      box-shadow: 0 5px 15px rgba(#FF416C, 0.2);
    }
  }

  &-icon {
    font-size: 1.2rem; // Ajustar si es necesario
  }
}

.form-actions {
  margin-top: 2rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.cancel-button {
  padding: 0.75rem 1.5rem;
  background-color: #f1f5f9; /* Gris claro */
  border: 1px solid #e2e8f0; /* $border */
  color: #64748b; /* $text-light */
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background-color: #e2e8f0; /* $border */
    color: #1e293b; /* $dark */
  }
   &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

.save-button {
  padding: 0.75rem 2rem;
  background: linear-gradient(to right, #FF416C, #FF4B2B); /* $primary-gradient */
  color: white;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 150px; /* Para que no cambie mucho de tamaño con el spinner */

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(#FF416C, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    background: #ccc; /* O un gris de deshabilitado */
  }
}

.save-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
