<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Asignaciones Activas</h1>
        <router-link to="/assignments/new" class="btn btn-primary">
          <svg class="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Nueva Asignación
        </router-link>
      </div>

      <!-- Loading -->
      <LoadingSpinner v-if="loading" :loading="true" message="Cargando asignaciones..." />

      <!-- Error -->
      <div v-else-if="error" class="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg">
        <p class="text-red-800 dark:text-red-200">{{ error }}</p>
      </div>

      <!-- Lista de asignaciones -->
      <div v-else-if="assignments.length > 0" class="space-y-4">
        <div v-for="assignment in assignments" :key="assignment.id || assignment._id" class="card">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-3">
                <span :class="[
                  'badge',
                  assignment.status === 'Pending' ? 'badge-pending' :
                    assignment.status === 'Washing' ? 'badge-washing' :
                      'badge-completed'
                ]">
                  {{ assignment.status }}
                </span>
                <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                  {{ assignment.car_plate }}
                </h3>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div class="flex items-center">
                  <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span class="text-gray-700 dark:text-gray-300">
                    Empleado: <span class="font-medium">{{ assignment.employee_name }}</span>
                  </span>
                </div>

                <div class="flex items-center">
                  <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span class="text-gray-700 dark:text-gray-300">
                    Servicio: <span class="font-medium">{{ assignment.service_type }}</span>
                  </span>
                </div>

                <div class="flex items-center">
                  <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span class="text-gray-700 dark:text-gray-300">
                    Creado: {{ formatDate(assignment.created_at) }}
                  </span>
                </div>
              </div>
            </div>

            <div class="flex flex-col gap-2 ml-4">
              <button v-if="assignment.status !== 'Completed'" @click="showCompleteModal(assignment)"
                class="btn btn-success text-sm whitespace-nowrap">
                <svg class="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Completar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="text-center py-12">
        <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p class="text-gray-600 dark:text-gray-400">No hay asignaciones activas</p>
        <router-link to="/assignments/new" class="btn btn-primary mt-4">
          Crear Primera Asignación
        </router-link>
      </div>

      <!-- Modal de confirmación -->
      <div v-if="confirmModal.show"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
        @click.self="confirmModal.show = false">
        <div class="card max-w-md w-full">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Completar Asignación
          </h3>
          <p class="text-gray-700 dark:text-gray-300 mb-6">
            ¿Estás seguro de que deseas marcar esta asignación como completada?
            Esto sumará puntos de lealtad al auto <strong>{{ confirmModal.assignment?.car_plate }}</strong>.
          </p>
          <div class="flex gap-4">
            <button @click="completeAssignment" :disabled="completing" class="btn btn-success flex-1">
              {{ completing ? 'Completando...' : 'Sí, Completar' }}
            </button>
            <button @click="confirmModal.show = false" :disabled="completing" class="btn btn-secondary">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { assignmentsApi } from '@/api/assignments'
import { useToastStore } from '@/stores/toast'
import type { Assignment } from '@/types'
import AppLayout from '@/components/AppLayout.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const toastStore = useToastStore()

const assignments = ref<Assignment[]>([])
const loading = ref(false)
const completing = ref(false)
const error = ref('')

const confirmModal = reactive({
  show: false,
  assignment: null as Assignment | null,
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('es-ES', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const loadAssignments = async () => {
  loading.value = true
  error.value = ''

  try {
    assignments.value = await assignmentsApi.getAssignments()
    // Debug: verificar estructura de los datos
    if (assignments.value.length > 0) {
      console.log('Primera asignación:', assignments.value[0])
      console.log('IDs disponibles:', {
        id: assignments.value[0].id,
        _id: assignments.value[0]._id
      })
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error al cargar las asignaciones'
    toastStore.error(error.value)
  } finally {
    loading.value = false
  }
}

const showCompleteModal = (assignment: Assignment) => {
  confirmModal.assignment = assignment
  confirmModal.show = true
}

const completeAssignment = async () => {
  if (!confirmModal.assignment) return

  completing.value = true

  try {
    // Usar _id si existe, sino id
    const assignmentId = confirmModal.assignment._id || confirmModal.assignment.id

    if (!assignmentId) {
      throw new Error('ID de asignación no encontrado')
    }

    await assignmentsApi.completeAssignment(assignmentId)
    toastStore.success('Asignación completada exitosamente')
    confirmModal.show = false
    confirmModal.assignment = null
    // Recargar lista
    await loadAssignments()
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Error al completar la asignación'
    toastStore.error(errorMsg)
  } finally {
    completing.value = false
  }
}

onMounted(() => {
  loadAssignments()
})
</script>
