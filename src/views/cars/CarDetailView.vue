<template>
  <AppLayout>
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-6">
        <router-link to="/cars" class="text-primary-600 hover:text-primary-700 flex items-center">
          <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a la lista
        </router-link>
      </div>

      <!-- Loading -->
      <LoadingSpinner v-if="loading" :loading="true" message="Cargando información..." />

      <!-- Error -->
      <div v-else-if="error" class="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg">
        <p class="text-red-800 dark:text-red-200">{{ error }}</p>
      </div>

      <!-- Detalle del auto -->
      <div v-else-if="car">
        <div class="card mb-6">
          <div class="flex items-start justify-between mb-6">
            <div>
              <h1 class="text-4xl font-bold text-gray-900 dark:text-white">
                {{ car.plate }}
              </h1>
              <p class="text-lg text-gray-600 dark:text-gray-400 mt-1">{{ car.car_type }}</p>
            </div>
            <div class="text-right">
              <span class="text-4xl font-bold text-primary-600">{{ car.loyalty_points }}</span>
              <p class="text-sm text-gray-500">puntos de lealtad</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Propietario</p>
                <p class="font-medium text-gray-900 dark:text-white">{{ car.owner_name }}</p>
              </div>
            </div>

            <div class="flex items-center">
              <svg class="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Teléfono</p>
                <p class="font-medium text-gray-900 dark:text-white">{{ car.owner_phone }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Historial -->
        <div class="card">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Historial de Servicios</h2>
            <button
              @click="loadHistory"
              class="btn btn-secondary text-sm"
              :disabled="loadingHistory"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Actualizar
            </button>
          </div>

          <LoadingSpinner v-if="loadingHistory" :loading="true" />

          <div v-else-if="history.length > 0" class="space-y-4">
            <div
              v-for="item in history"
              :key="item.id"
              class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <span class="badge badge-completed">{{ item.status }}</span>
                    <span class="font-semibold text-gray-900 dark:text-white">{{ item.service_type }}</span>
                  </div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Atendido por: <span class="font-medium">{{ item.employee_name }}</span>
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {{ formatDate(item.completed_at!) }}
                  </p>
                </div>
                <div class="text-right">
                  <span class="text-2xl font-bold text-green-600">+{{ item.points_earned }}</span>
                  <p class="text-xs text-gray-500">puntos</p>
                </div>
              </div>
            </div>

            <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div class="flex justify-between items-center">
                <span class="text-lg font-semibold text-gray-900 dark:text-white">Total de servicios:</span>
                <span class="text-2xl font-bold text-primary-600">{{ history.length }}</span>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-8">
            <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p class="text-gray-600 dark:text-gray-400">No hay servicios registrados para este auto</p>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { carsApi } from '@/api/cars'
import { useToastStore } from '@/stores/toast'
import type { Car, AssignmentHistory } from '@/types'
import AppLayout from '@/components/AppLayout.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const props = defineProps<{
  plate: string
}>()

const toastStore = useToastStore()

const car = ref<Car | null>(null)
const history = ref<AssignmentHistory[]>([])
const loading = ref(false)
const loadingHistory = ref(false)
const error = ref('')

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const loadCar = async () => {
  loading.value = true
  error.value = ''

  try {
    car.value = await carsApi.getCarByPlate(props.plate)
    await loadHistory()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error al cargar el auto'
    toastStore.error(error.value)
  } finally {
    loading.value = false
  }
}

const loadHistory = async () => {
  loadingHistory.value = true

  try {
    history.value = await carsApi.getCarHistory(props.plate)
  } catch (err) {
    toastStore.error('Error al cargar el historial')
  } finally {
    loadingHistory.value = false
  }
}

onMounted(() => {
  loadCar()
})
</script>
