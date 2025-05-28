// src/composables/useImageUpload.js
import { ref, computed } from 'vue';
import { ImageService } from '@/services/imageService';

export function useImageUpload(options = {}) {
  const uploading = ref(false);
  const uploadProgress = ref(0);
  const uploadedImages = ref([]);
  const errors = ref([]);

  const {
    maxFileSize = 10 * 1024 * 1024, // 10MB
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    maxFiles = 10,
    autoResize = false,
    resizeOptions = { maxWidth: 800, maxHeight: 600, quality: 0.8 }
  } = options;

  const hasErrors = computed(() => errors.value.length > 0);
  const hasImages = computed(() => uploadedImages.value.length > 0);
  const isValidFile = (file) => {
    return ImageService.validateImage(file, maxFileSize);
  };

  const uploadSingle = async (imageData, fileName, folder) => {
    uploading.value = true;
    uploadProgress.value = 0;
    errors.value = [];

    try {
      let result;
      
      if (typeof imageData === 'string') {
        // Base64
        result = await ImageService.uploadBase64(imageData, fileName, folder);
      } else {
        // File object
        const validation = isValidFile(imageData);
        if (!validation.valid) {
          throw new Error(validation.errors.join(', '));
        }

        // Redimensionar si está habilitado
        if (autoResize) {
          const resizedBase64 = await ImageService.resizeImage(
            imageData, 
            resizeOptions.maxWidth, 
            resizeOptions.maxHeight, 
            resizeOptions.quality
          );
          result = await ImageService.uploadBase64(resizedBase64, fileName || imageData.name, folder);
        } else {
          result = await ImageService.uploadFile(imageData, folder);
        }
      }
      
      uploadProgress.value = 100;
      uploadedImages.value.push(result);
      return result;
    } catch (error) {
      errors.value.push(error.message);
      throw error;
    } finally {
      uploading.value = false;
    }
  };

  const uploadMultiple = async (files, folder) => {
    uploading.value = true;
    uploadProgress.value = 0;
    errors.value = [];

    try {
      if (files.length > maxFiles) {
        throw new Error(`Máximo ${maxFiles} archivos permitidos`);
      }

      // Validar todos los archivos
      const validationErrors = [];
      Array.from(files).forEach((file, index) => {
        const validation = isValidFile(file);
        if (!validation.valid) {
          validationErrors.push(`Archivo ${index + 1}: ${validation.errors.join(', ')}`);
        }
      });

      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join('\n'));
      }

      const result = await ImageService.uploadMultiple(files, folder);
      
      uploadProgress.value = 100;
      uploadedImages.value.push(...result.images);
      
      return result;
    } catch (error) {
      errors.value.push(error.message);
      throw error;
    } finally {
      uploading.value = false;
    }
  };

  const deleteImage = async (imageUrl) => {
    try {
      const result = await ImageService.delete(imageUrl);
      
      // Remover de la lista local
      uploadedImages.value = uploadedImages.value.filter(
        img => img.imageUrl !== imageUrl
      );
      
      return result;
    } catch (error) {
      errors.value.push(`Error eliminando imagen: ${error.message}`);
      throw error;
    }
  };

  const clearErrors = () => {
    errors.value = [];
  };

  const reset = () => {
    uploading.value = false;
    uploadProgress.value = 0;
    uploadedImages.value = [];
    errors.value = [];
  };

  const getImageInfo = async (file) => {
    try {
      return await ImageService.getImageInfo(file);
    } catch (error) {
      errors.value.push(`Error obteniendo información de imagen: ${error.message}`);
      throw error;
    }
  };

  return {
    // Estado
    uploading,
    uploadProgress,
    uploadedImages,
    errors,
    hasErrors,
    hasImages,
    
    // Métodos
    uploadSingle,
    uploadMultiple,
    deleteImage,
    clearErrors,
    reset,
    isValidFile,
    getImageInfo
  };
}