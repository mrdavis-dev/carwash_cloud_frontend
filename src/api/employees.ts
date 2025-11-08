import axiosInstance from './axiosInstance'
import type { 
  Employee, 
  CreateEmployeeRequest, 
  UpdateEmployeeRequest 
} from '@/types'

export const employeesApi = {
  /**
   * Obtener todos los empleados del negocio
   */
  async getAll(): Promise<Employee[]> {
    const response = await axiosInstance.get<Employee[]>('/employees')
    return response.data
  },

  /**
   * Obtener un empleado por ID
   */
  async getById(id: number): Promise<Employee> {
    const response = await axiosInstance.get<Employee>(`/employees/${id}`)
    return response.data
  },

  /**
   * Crear un nuevo empleado
   */
  async create(data: CreateEmployeeRequest): Promise<Employee> {
    const response = await axiosInstance.post<Employee>('/employees', data)
    return response.data
  },

  /**
   * Actualizar un empleado existente
   */
  async update(id: number, data: UpdateEmployeeRequest): Promise<Employee> {
    const response = await axiosInstance.put<Employee>(`/employees/${id}`, data)
    return response.data
  },

  /**
   * Eliminar un empleado
   */
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`/employees/${id}`)
  },
}
