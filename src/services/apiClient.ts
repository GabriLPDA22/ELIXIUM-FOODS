// src/services/apiClient.ts
import axios from 'axios'

// Configura la instancia de axios con opciones predeterminadas
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos
})

// Interceptor para agregar token a las solicitudes
apiClient.interceptors.request.use(
  (config) => {
    // Buscar token en localStorage o sessionStorage
    const token =
      localStorage.getItem('token') ||
      localStorage.getItem('business_token') ||
      sessionStorage.getItem('token') ||
      sessionStorage.getItem('business_token')

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar respuestas
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejar errores de autenticación (401)
    if (error.response && error.response.status === 401) {
      // Limpiar tokens y redirigir al login si es necesario
      localStorage.removeItem('token')
      localStorage.removeItem('business_token')
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('business_token')

      // Puedes redirigir al login aquí si tienes acceso al router
      // o emitir un evento que el componente App o Layout pueda escuchar
    }

    return Promise.reject(error)
  }
)

// Exportar la instancia configurada
export default apiClient
