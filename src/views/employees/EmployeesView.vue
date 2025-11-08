<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Empleados</h1>
          <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Gestiona el personal de tu negocio
          </p>
        </div>
        <router-link to="/employees/new" class="btn btn-primary">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Nuevo Empleado
        </router-link>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="card bg-red-50 dark:bg-red-900/30">
        <p class="text-red-800 dark:text-red-200">{{ error }}</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="employees.length === 0" class="card text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z">
          </path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No hay empleados</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Comienza agregando tu primer empleado
        </p>
        <div class="mt-6">
          <router-link to="/employees/new" class="btn btn-primary">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Agregar Empleado
          </router-link>
        </div>
      </div>

      <!-- Employees Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="employee in employees" :key="employee.id" class="card hover:shadow-lg transition-shadow">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ employee.name }}
              </h3>
              <p v-if="employee.role" class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {{ employee.role }}
              </p>
              <p v-if="employee.phone" class="text-sm text-gray-500 dark:text-gray-500 mt-1">
                📱 {{ employee.phone }}
              </p>
            </div>
            
            <!-- Actions -->
            <div class="flex space-x-2">
              <router-link :to="`/employees/${employee.id}/edit`"
                class="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                title="Editar">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                  </path>
                </svg>
              </router-link>
              <button @click="confirmDelete(employee)"
                class="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                title="Eliminar">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                  </path>
                </svg>
              </button>
            </div>
          </div>
          
          <div v-if="employee.created_at" class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p class="text-xs text-gray-500 dark:text-gray-500">
              Creado: {{ formatDate(employee.created_at) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div v-if="showDeleteModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click.self="showDeleteModal = false">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Confirmar Eliminación
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            ¿Estás seguro de que deseas eliminar a <strong>{{ employeeToDelete?.name }}</strong>?
            Esta acción no se puede deshacer.
          </p>
          <div class="flex justify-end space-x-3">
            <button @click="showDeleteModal = false" class="btn btn-secondary" :disabled="deleting">
              Cancelar
            </button>
            <button @click="deleteEmployee" class="btn bg-red-600 hover:bg-red-700 text-white" :disabled="deleting">
              <span v-if="deleting">Eliminando...</span>
              <span v-else>Eliminar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { employeesApi } from '@/api/employees'
import { useToastStore } from '@/stores/toast'
import type { Employee } from '@/types'
import AppLayout from '@/components/AppLayout.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const toastStore = useToastStore()

const employees = ref<Employee[]>([])
const loading = ref(false)
const error = ref('')
const showDeleteModal = ref(false)
const employeeToDelete = ref<Employee | null>(null)
const deleting = ref(false)

const loadEmployees = async () => {
  loading.value = true
  error.value = ''
  try {
    employees.value = await employeesApi.getAll()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error al cargar empleados'
    toastStore.error('Error al cargar empleados')
  } finally {
    loading.value = false
  }
}

const confirmDelete = (employee: Employee) => {
  employeeToDelete.value = employee
  showDeleteModal.value = true
}

const deleteEmployee = async () => {
  if (!employeeToDelete.value) return

  deleting.value = true
  try {
    await employeesApi.delete(employeeToDelete.value.id)
    toastStore.success('Empleado eliminado exitosamente')
    showDeleteModal.value = false
    employeeToDelete.value = null
    await loadEmployees()
  } catch (err) {
    toastStore.error('Error al eliminar empleado')
  } finally {
    deleting.value = false
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

onMounted(() => {
  loadEmployees()
})
</script>
