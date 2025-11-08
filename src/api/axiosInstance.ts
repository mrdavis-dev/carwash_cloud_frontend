import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios'
import router from '@/router'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Log para debug - se verá en la consola del navegador
console.log('🔧 Configuración de API:', {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  API_URL,
  MODE: import.meta.env.MODE,
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,
})

// Crear instancia de axios con configuración base
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para agregar el token JWT a las peticiones
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // Log de requests para debug
    console.log('🌐 Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      fullURL: `${config.baseURL}${config.url}`,
      hasToken: !!token,
    })
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar errores de respuesta
axiosInstance.interceptors.response.use(
  (response) => {
    // Log de responses exitosas para debug
    console.log('✅ Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data,
      contentType: response.headers['content-type'],
    })
    
    // Verificar si la respuesta es HTML cuando esperamos JSON
    const contentType = response.headers['content-type']
    if (contentType && contentType.includes('text/html')) {
      console.error('⚠️ Recibido HTML en lugar de JSON. Verifica la URL del backend.')
      throw new Error('El servidor respondió con HTML. Verifica que la URL del backend sea correcta.')
    }
    
    return response
  },
  (error: AxiosError) => {
    // Log de errores para debug
    console.error('❌ Response Error:', {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data,
      message: error.message,
    })
    if (error.response?.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem('access_token')
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
