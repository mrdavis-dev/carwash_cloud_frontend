import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { jwtDecode } from 'jwt-decode'
import { authApi } from '@/api/auth'
import type { 
  LoginRequest, 
  SignupRequest, 
  User, 
  DecodedToken 
} from '@/types'

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref<string | null>(localStorage.getItem('access_token'))
  const user = ref<User | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const currentUser = computed(() => user.value)
  const businessId = computed(() => user.value?.business_id)

  /**
   * Decodifica el token JWT y carga los datos del usuario
   */
  function loadUserFromToken() {
    if (!token.value) {
      user.value = null
      return
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token.value)
      
      // Verificar si el token ha expirado
      const currentTime = Date.now() / 1000
      if (decoded.exp < currentTime) {
        logout()
        return
      }

      user.value = {
        username: decoded.sub,
        business_id: decoded.business_id,
      }
    } catch (error) {
      console.error('Error al decodificar token:', error)
      logout()
    }
  }

  /**
   * Realiza el login del usuario
   */
  async function login(credentials: LoginRequest) {
    try {
      console.log('🔐 Attempting login...')
      const response = await authApi.login(credentials)
      
      console.log('✅ Login response received:', {
        hasAccessToken: !!response.access_token,
        tokenLength: response.access_token?.length,
      })
      
      // Guardar token en localStorage
      token.value = response.access_token
      localStorage.setItem('access_token', response.access_token)
      
      console.log('💾 Token saved to localStorage')
      
      // Cargar datos del usuario desde el token
      loadUserFromToken()
      
      console.log('👤 User loaded:', {
        hasUser: !!user.value,
        username: user.value?.username,
        businessId: user.value?.business_id,
      })
      
      return { success: true }
    } catch (error) {
      console.error('❌ Login error:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error al iniciar sesión' 
      }
    }
  }

  /**
   * Registra un nuevo negocio y usuario
   */
  async function signup(data: SignupRequest) {
    try {
      const response = await authApi.signup(data)
      
      return { 
        success: true, 
        message: response.msg,
        businessId: response.business_id 
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error al registrarse' 
      }
    }
  }

  /**
   * Cierra la sesión del usuario
   */
  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
  }

  // Cargar usuario al inicializar si existe token
  if (token.value) {
    loadUserFromToken()
  }

  return {
    // State
    token,
    user,
    // Getters
    isAuthenticated,
    currentUser,
    businessId,
    // Actions
    login,
    signup,
    logout,
    loadUserFromToken,
  }
})
