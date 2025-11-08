// Tipos de autenticación
export interface LoginRequest {
  username: string
  password: string
}

export interface SignupRequest {
  business_name: string
  username: string
  password: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
}

export interface SignupResponse {
  msg: string
  business_id: number
}

export interface DecodedToken {
  sub: string // username
  business_id: number
  exp: number
}

// Tipos de Auto
export interface Car {
  plate: string
  car_type: string
  owner_name: string
  owner_phone: string
  loyalty_points: number
  business_id: number
}

export interface CreateCarRequest {
  plate: string
  car_type: string
  owner_name: string
  owner_phone: string
}

// Tipos de Asignación
export type AssignmentStatus = 'Pending' | 'Washing' | 'Completed'
export type ServiceType = 'Básico' | 'Completo' | 'Premium' | 'Express'

export interface Assignment {
  id?: number
  _id?: string  // MongoDB ID
  car_plate: string
  employee_name: string
  service_type: ServiceType
  status: AssignmentStatus
  created_at: string
  completed_at?: string
  points_earned?: number
  business_id: number
}

export interface CreateAssignmentRequest {
  car_plate: string
  employee_name: string
  service_type: ServiceType
}

// Historial de asignaciones completadas
export interface AssignmentHistory extends Assignment {
  points_earned: number
  completed_at: string
}

// Usuario
export interface User {
  username: string
  business_id: number
}

// Empleados
export interface Employee {
  id: number
  name: string
  role?: string
  phone?: string
  business_id: number
  created_at?: string
}

export interface CreateEmployeeRequest {
  name: string
  role?: string
  phone?: string
}

export interface UpdateEmployeeRequest {
  name?: string
  role?: string
  phone?: string
}

// Toast notifications
export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: number
  message: string
  type: ToastType
  duration?: number
}
