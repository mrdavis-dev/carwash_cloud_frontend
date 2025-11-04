import axiosInstance from './axiosInstance'
import type { 
  Assignment, 
  CreateAssignmentRequest 
} from '@/types'

export const assignmentsApi = {
  /**
   * Obtener lista de asignaciones pendientes (no completadas)
   */
  async getAssignments(): Promise<Assignment[]> {
    const response = await axiosInstance.get<Assignment[]>('/assignments/')
    return response.data
  },

  /**
   * Crear una nueva asignación
   */
  async createAssignment(assignment: CreateAssignmentRequest): Promise<Assignment> {
    const response = await axiosInstance.post<Assignment>('/assignments/', assignment)
    return response.data
  },

  /**
   * Completar una asignación existente
   */
  async completeAssignment(id: number | string): Promise<Assignment> {
    const response = await axiosInstance.put<Assignment>(`/assignments/${id}/complete`)
    return response.data
  },
}
