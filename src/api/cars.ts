import axiosInstance from './axiosInstance'
import type { 
  Car, 
  CreateCarRequest, 
  AssignmentHistory 
} from '@/types'

export const carsApi = {
  /**
   * Obtener lista de autos del negocio actual
   */
  async getCars(): Promise<Car[]> {
    const response = await axiosInstance.get<Car[]>('/cars/')
    return response.data
  },

  /**
   * Crear un nuevo auto
   */
  async createCar(car: CreateCarRequest): Promise<Car> {
    const response = await axiosInstance.post<Car>('/cars/', car)
    return response.data
  },

  /**
   * Obtener detalle de un auto específico
   */
  async getCarByPlate(plate: string): Promise<Car> {
    const response = await axiosInstance.get<Car>(`/cars/${plate}`)
    return response.data
  },

  /**
   * Obtener historial de asignaciones completadas para un auto
   */
  async getCarHistory(plate: string): Promise<AssignmentHistory[]> {
    const response = await axiosInstance.get<AssignmentHistory[]>(`/cars/${plate}/history`)
    return response.data
  },
}
