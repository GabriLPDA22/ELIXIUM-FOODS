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

      <div class="form-section">
        <h3 class="section-title">Foto de Perfil</h3>
        <p class="section-description">
          {{ isGoogleUser ? 'Tu foto de perfil de Google se sincroniza automáticamente' : 'Esta foto aparecerá en tu perfil y pedidos' }}
        </p>

        <div v-if="uploading" class="upload-loading">
          <div class="upload-spinner"></div>
          <p>Subiendo foto...</p>
        </div>

        <div class="photo-uploader">
          <div class="photo-preview" :class="{ 'photo-preview--google': isGoogleUser }">
            <img v-if="localUserInfo.photoURL" :src="localUserInfo.photoURL" alt="Foto de perfil" />
            <div v-else class="photo-placeholder">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div v-if="isGoogleUser" class="google-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" class="google-icon">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </div>
          </div>

          <div v-if="!isGoogleUser" class="photo-actions">
            <label class="upload-btn" :class="{ 'upload-btn--disabled': uploading }">
              {{ uploading ? 'Subiendo...' : 'Cambiar Foto' }}
              <input type="file" accept="image/*" @change="handlePhotoUpload" class="file-input"
                :disabled="uploading" />
            </label>
            <button v-if="localUserInfo.photoURL && !uploading" @click="showDeleteConfirm" type="button"
              class="remove-btn">
              Eliminar
            </button>
          </div>

          <div v-else class="google-photo-notice">
            <div class="google-notice-content">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 6v6l4 2"></path>
              </svg>
              <span>Tu foto se sincroniza automáticamente desde tu cuenta de Google</span>
            </div>
          </div>
        </div>
      </div>

      <div class="form-divider"></div>

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

    <!-- ✅ NUEVO: Diálogo de confirmación personalizado -->
    <ConfirmDialog
      :visible="showConfirmDialog"
      :title="confirmDialog.title"
      :message="confirmDialog.message"
      :confirm-text="confirmDialog.confirmText"
      :cancel-text="confirmDialog.cancelText"
      @confirm="confirmDialog.onConfirm"
      @cancel="hideConfirmDialog"
    />

    <!-- ✅ NUEVO: Componente de notificaciones -->
    <ToastNotification ref="toastRef" />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch, computed } from 'vue';
import userService, { type UserProfile } from '@/services/userService';
import { ImageService } from '@/services/imageService';
import { useAuthStore } from '@/stores/auth';
// ✅ NUEVOS: Importar componentes UI personalizados
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue';
import ToastNotification from '@/components/ui/ToastNotification.vue';

const authStore = useAuthStore();

const loading = ref(false);
const saving = ref(false);
const uploading = ref(false);
const error = ref('');
const updateSuccess = ref(false);
const originalUserInfo = ref<UserProfile | null>(null);

// ✅ NUEVOS: Estados para diálogo de confirmación
const showConfirmDialog = ref(false);
const confirmDialog = reactive({
  title: '',
  message: '',
  confirmText: 'Confirmar',
  cancelText: 'Cancelar',
  onConfirm: () => {}
});

// ✅ NUEVO: Referencia al componente de toast
const toastRef = ref<InstanceType<typeof ToastNotification>>();

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

// Computed property to check if the user is a Google user
const isGoogleUser = computed(() => authStore.isGoogleUser);

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
}

// ✅ NUEVOS: Métodos para manejar UI personalizada
const showToast = () => {
  return toastRef.value?.useToast() || {
    success: (msg: string) => console.log('✅', msg),
    error: (msg: string) => console.error('❌', msg),
    warning: (msg: string) => console.warn('⚠️', msg),
    info: (msg: string) => console.info('ℹ️', msg)
  };
};

const hideConfirmDialog = () => {
  showConfirmDialog.value = false;
};

const showDeleteConfirm = () => {
  if (isGoogleUser.value) {
    showToast().warning(
      'No puedes eliminar la foto de perfil de una cuenta de Google',
      'Cuenta de Google'
    );
    return;
  }

  confirmDialog.title = 'Eliminar foto de perfil';
  confirmDialog.message = '¿Estás seguro de que quieres eliminar tu foto de perfil? Esta acción no se puede deshacer.';
  confirmDialog.confirmText = 'Eliminar';
  confirmDialog.cancelText = 'Cancelar';
  confirmDialog.onConfirm = async () => {
    hideConfirmDialog();
    await removePhoto();
  };
  showConfirmDialog.value = true;
};

// Métodos para manejo de foto de perfil
const handlePhotoUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file || uploading.value) return;

  // Prevenir cambio de foto para usuarios de Google
  if (isGoogleUser.value) {
    showToast().warning(
      'Tu foto de perfil se sincroniza automáticamente desde Google y no se puede cambiar aquí',
      'Cuenta de Google'
    );
    // Clear the file input immediately
    (event.target as HTMLInputElement).value = '';
    return;
  }

  try {
    uploading.value = true;

    // Validar imagen
    const validation = ImageService.validateImage(file);
    if (!validation.valid) {
      showToast().error(validation.errors.join('\n'), 'Error de validación');
      return;
    }

    // Subir imagen usando el servicio
    const result = await ImageService.uploadFile(file, 'users');

    if (result.imageUrl) {
      // Actualizar la URL de la foto localmente
      localUserInfo.photoURL = result.imageUrl;

      // Guardar inmediatamente en el servidor
      await updatePhotoURL(result.imageUrl);

      showToast().success('Foto de perfil actualizada correctamente');
    }
  } catch (err: any) {
    console.error('Error subiendo foto:', err);
    showToast().error(
      err.response?.data?.message || err.message || 'Error desconocido al subir la imagen',
      'Error al subir imagen'
    );
  } finally {
    uploading.value = false;
    // Limpiar el input
    (event.target as HTMLInputElement).value = '';
  }
};

const removePhoto = async () => {
  // Prevenir eliminación de foto para usuarios de Google (doble verificación)
  if (isGoogleUser.value) {
    showToast().warning(
      'No puedes eliminar la foto de perfil de una cuenta de Google',
      'Cuenta de Google'
    );
    return;
  }

  try {
    uploading.value = true;

    // Eliminar la imagen del servidor si existe una URL
    if (localUserInfo.photoURL) {
      try {
        await ImageService.delete(localUserInfo.photoURL);
      } catch (deleteError) {
        console.warn('Error eliminando imagen del storage:', deleteError);
        // Continuar aunque falle la eliminación del storage
      }
    }

    // Actualizar el perfil sin foto
    localUserInfo.photoURL = '';
    await updatePhotoURL('');

    showToast().success('Foto de perfil eliminada correctamente');
  } catch (err: any) {
    console.error('Error eliminando foto:', err);
    showToast().error('Error al eliminar la foto de perfil', 'Error');
  } finally {
    uploading.value = false;
  }
};

const updatePhotoURL = async (photoURL: string) => {
  // No permitir actualización de foto para usuarios de Google
  if (isGoogleUser.value && photoURL !== localUserInfo.photoURL) {
    // If the photoURL passed is different from the current one, it means an attempt to change
    throw new Error('No se puede modificar la foto de perfil de una cuenta de Google');
  }

  try {
    const dataToUpdate: Partial<UserProfile> = {
      firstName: localUserInfo.firstName,
      lastName: localUserInfo.lastName,
      phoneNumber: localUserInfo.phoneNumber,
      birthdate: localUserInfo.birthdate || null,
      bio: localUserInfo.bio || null,
      dietaryPreferences: localUserInfo.dietaryPreferences || [],
      // Only update photoURL if NOT a Google user, otherwise keep the existing photoURL from the store
      photoURL: isGoogleUser.value ? authStore.user?.photoURL || null : (photoURL || null),
    };

    const updatedUserData = await userService.updateUserProfile(dataToUpdate);

    // Update the auth store (without overwriting Google's photo if it's a Google user)
    if (authStore.user) {
      authStore.user.firstName = updatedUserData.firstName;
      authStore.user.lastName = updatedUserData.lastName;
      (authStore.user as any).phoneNumber = updatedUserData.phoneNumber;

      // Only update photoURL if NOT a Google user
      if (!isGoogleUser.value) {
        authStore.user.photoURL = updatedUserData.photoURL;
      }

      localStorage.setItem('user', JSON.stringify(authStore.user));
    }

    // Update local data
    Object.assign(localUserInfo, updatedUserData);
    originalUserInfo.value = JSON.parse(JSON.stringify(localUserInfo));
  } catch (error) {
    console.error('Error actualizando foto en el perfil:', error);
    throw error;
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
      // photoURL is handled by updatePhotoURL specifically, or kept as is if Google user
      photoURL: isGoogleUser.value ? authStore.user?.photoURL || null : localUserInfo.photoURL || null,
    };

    console.log('Enviando estos datos para actualizar perfil:', dataToUpdate);
    const updatedUserData = await userService.updateUserProfile(dataToUpdate);

    if (authStore.user) {
      authStore.user.firstName = updatedUserData.firstName;
      authStore.user.lastName = updatedUserData.lastName;
      (authStore.user as any).phoneNumber = updatedUserData.phoneNumber;
      // Only update photoURL in store if NOT a Google user or if it was explicitly changed (and not a Google user)
      if (!isGoogleUser.value) {
          authStore.user.photoURL = updatedUserData.photoURL;
      }
      localStorage.setItem('user', JSON.stringify(authStore.user));
    }
    Object.assign(localUserInfo, updatedUserData);
    originalUserInfo.value = JSON.parse(JSON.stringify(localUserInfo));

    // ✅ NUEVO: Usar toast en lugar de variable local
    showToast().success('Los cambios se han guardado correctamente', 'Perfil actualizado');

  } catch (err: any) {
    console.error('Error al guardar información del usuario (UserInfo.vue):', err);
    showToast().error(err.message || 'Error al guardar los cambios', 'Error al guardar');
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

// ✅ ELIMINADOS: Métodos showSuccess y showError (ahora usamos toast)

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
  min-height: 200px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-top-color: #FF416C;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.error-icon {
  color: #ef4444;
  margin-bottom: 1rem;
}

.error-container p {
  color: #64748b;
  margin-bottom: 1.5rem;
}

.retry-button {
  padding: 0.75rem 1.5rem;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 50px;
  color: #1e293b;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #e2e8f0;
  }
}

.success-message {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background-color: rgba(#10b981, 0.1);
  color: #10b981;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.user-info-form {
  width: 100%;
}

// Estilos para la sección de foto de perfil
.form-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
  color: #1e293b;
}

.section-description {
  font-size: 0.95rem;
  color: #64748b;
  margin: 0 0 1.5rem;
  line-height: 1.5;
}

.upload-loading {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.25rem 1.5rem;
  background: linear-gradient(135deg, rgba(#FF416C, 0.1), rgba(#FF4B2B, 0.05));
  border: 2px solid rgba(#FF416C, 0.2);
  border-radius: 12px;
  color: #FF416C;
  font-weight: 500;
}

.upload-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(#FF416C, 0.2);
  border-radius: 50%;
  border-top-color: #FF416C;
  animation: spin 1s linear infinite;
}

.photo-uploader {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: flex-start;
}

.photo-preview {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #e2e8f0;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    border-color: #cbd5e1;
  }

  &--google {
    border-color: #4285F4;

    &:hover {
      border-color: #1a73e8;
    }
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.photo-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;

  svg {
    width: 48px;
    height: 48px;
  }
}

.photo-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.upload-btn {
  padding: 0.875rem 1.5rem;
  background: linear-gradient(to right, #FF416C, #FF4B2B);
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-block;
  text-decoration: none;

  &:hover:not(&--disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(#FF416C, 0.3);
  }

  &--disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
}

.file-input {
  display: none;
}

.remove-btn {
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #fef2f2, #fee2e2);
  color: #dc2626;
  border: 2px solid #fecaca;
  border-radius: 50px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: linear-gradient(135deg, #fee2e2, #fecaca);
    border-color: #f87171;
    transform: translateY(-1px);
  }
}

.google-badge {
  position: absolute;
  bottom: 5px;
  right: 5px;
  background: white;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border: 2px solid white;

  .google-icon {
    width: 18px;
    height: 18px;
  }
}

.google-photo-notice {
  background: rgba(66, 133, 244, 0.1);
  border: 1px solid rgba(66, 133, 244, 0.2);
  border-radius: 12px;
  padding: 1rem;
  margin-top: 1rem;
}

.google-notice-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #1a73e8;
  font-size: 0.9rem;
  font-weight: 500;

  svg {
    flex-shrink: 0;
    stroke: #1a73e8;
  }
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
    background-color: white;
    color: #1e293b;

    &:focus {
      outline: none;
      border-color: #FF416C;
      box-shadow: 0 0 0 3px rgba(#FF416C, 0.1);
    }

    &:read-only {
      background-color: #f8fafc;
      cursor: not-allowed;
      color: #64748b;
    }
  }

  textarea {
    resize: vertical;
    min-height: 80px;
  }

  .email-note {
    font-size: 0.8rem;
    color: #64748b;
    margin-top: 0.25rem;
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
  color: #1e293b;

  &:hover {
    border-color: #FF4B2B;
    color: #FF4B2B;
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
  gap: 1rem;
}

.cancel-button {
  padding: 0.75rem 1.5rem;
  background-color: #f1f5f9;
  border: 1px solid #e2e8f0;
  color: #64748b;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background-color: #e2e8f0;
    color: #1e293b;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
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
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 150px;

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
    background: #ccc;
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
