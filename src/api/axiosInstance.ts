import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios'
import router from '@/router'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Crear instancia de axios con configuración base
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor de request para inyectar el token JWT
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token')
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor de response para manejar errores globalmente
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Si recibimos 401 (Unauthorized), limpiar token y redirigir a login
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      router.push('/login')
    }

    // Manejar otros errores
    const errorMessage = error.response?.data 
      ? (error.response.data as any).detail || (error.response.data as any).message || 'Error en la solicitud'
      : error.message || 'Error de conexión'

    return Promise.reject(new Error(errorMessage))
  }
)

export default axiosInstance
