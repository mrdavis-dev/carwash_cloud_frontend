import axiosInstance from './axiosInstance'
import type { 
  LoginRequest, 
  LoginResponse, 
  SignupRequest, 
  SignupResponse 
} from '@/types'

export const authApi = {
  /**
   * Login de usuario - Envía credentials como form-urlencoded
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    // El endpoint requiere form-urlencoded, no JSON
    const formData = new URLSearchParams()
    formData.append('username', credentials.username)
    formData.append('password', credentials.password)

    const response = await axiosInstance.post<LoginResponse>('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    return response.data
  },

  /**
   * Registro de nuevo negocio y usuario
   */
  async signup(data: SignupRequest): Promise<SignupResponse> {
    const response = await axiosInstance.post<SignupResponse>('/auth/signup', data)
    return response.data
  },
}
