// src/services/imageService.js
import { api } from './api';

export class ImageService {
  
  /**
   * Sube una imagen usando base64
   * @param {string} base64Image - Imagen en formato base64
   * @param {string} fileName - Nombre del archivo
   * @param {string} folder - Carpeta donde guardar (productos, usuarios, restaurantes, etc.)
   */
  static async uploadBase64(base64Image, fileName = 'image', folder = 'general') {
    try {
      const response = await api.post('/api/Images/upload/base64', {
        base64Image,
        fileName,
        folder
      });
      
      return response.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  /**
   * Sube una imagen usando FormData
   * @param {File} file - Archivo de imagen
   * @param {string} folder - Carpeta donde guardar
   */
  static async uploadFile(file, folder = 'general') {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post(`/api/Images/upload?folder=${folder}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  /**
   * Sube múltiples imágenes
   * @param {FileList} files - Lista de archivos
   * @param {string} folder - Carpeta donde guardar
   */
  static async uploadMultiple(files, folder = 'general') {
    try {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('files', file);
      });
      
      const response = await api.post(`/api/Images/upload/multiple?folder=${folder}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error uploading multiple files:', error);
      throw error;
    }
  }

  /**
   * Elimina una imagen
   * @param {string} imageUrl - URL de la imagen a eliminar
   */
  static async delete(imageUrl) {
    try {
      const response = await api.delete(`/api/images?imageUrl=${encodeURIComponent(imageUrl)}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }

  /**
   * Convierte un archivo a base64
   * @param {File} file - Archivo a convertir
   */
  static fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Redimensiona una imagen antes de subirla
   * @param {File} file - Archivo de imagen
   * @param {number} maxWidth - Ancho máximo
   * @param {number} maxHeight - Alto máximo
   * @param {number} quality - Calidad (0-1)
   */
  static async resizeImage(file, maxWidth = 800, maxHeight = 600, quality = 0.8) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calcular nuevas dimensiones manteniendo proporción
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Dibujar imagen redimensionada
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convertir a base64
        const base64 = canvas.toDataURL('image/jpeg', quality);
        resolve(base64);
      };
      
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Valida si un archivo es una imagen válida
   * @param {File} file - Archivo a validar
   * @param {number} maxSize - Tamaño máximo en bytes (default: 10MB)
   */
  static validateImage(file, maxSize = 10 * 1024 * 1024) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'];
    
    const errors = [];
    
    if (!file) {
      errors.push('No se ha seleccionado ningún archivo');
    } else {
      if (!allowedTypes.includes(file.type)) {
        errors.push(`Tipo de archivo no válido: ${file.type}. Tipos permitidos: ${allowedTypes.join(', ')}`);
      }
      
      if (file.size > maxSize) {
        errors.push(`Archivo muy grande: ${(file.size / 1024 / 1024).toFixed(2)}MB. Máximo permitido: ${(maxSize / 1024 / 1024).toFixed(2)}MB`);
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Obtiene información de una imagen
   * @param {File} file - Archivo de imagen
   */
  static async getImageInfo(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();
      
      reader.onload = (e) => {
        img.onload = () => {
          resolve({
            name: file.name,
            size: file.size,
            type: file.type,
            width: img.width,
            height: img.height,
            aspectRatio: img.width / img.height,
            sizeFormatted: (file.size / 1024 / 1024).toFixed(2) + ' MB'
          });
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}