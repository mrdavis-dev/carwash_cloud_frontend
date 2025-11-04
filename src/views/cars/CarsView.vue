<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Autos Registrados</h1>
        <router-link to="/cars/new" class="btn btn-primary">
          <svg class="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Auto
        </router-link>
      </div>

      <!-- Buscador -->
      <div class="mb-6">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar por placa..."
          class="input max-w-md"
        />
      </div>

      <!-- Loading -->
      <LoadingSpinner v-if="loading" :loading="true" message="Cargando autos..." />

      <!-- Error -->
      <div v-else-if="error" class="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg">
        <p class="text-red-800 dark:text-red-200">{{ error }}</p>
      </div>

      <!-- Lista de autos -->
      <div v-else-if="filteredCars.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="car in filteredCars"
          :key="car.plate"
          class="card hover:shadow-lg transition-shadow cursor-pointer"
          @click="router.push(`/cars/${car.plate}`)"
        >
          <div class="flex items-start justify-between mb-4">
            <div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                {{ car.plate }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ car.car_type }}</p>
            </div>
            <div class="flex flex-col items-end">
              <span class="text-2xl font-bold text-primary-600">
                {{ car.loyalty_points }}
              </span>
              <span class="text-xs text-gray-500">puntos</span>
            </div>
          </div>

          <div class="space-y-2">
            <div class="flex items-center text-sm">
              <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span class="text-gray-700 dark:text-gray-300">{{ car.owner_name }}</span>
            </div>
            <div class="flex items-center text-sm">
              <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span class="text-gray-700 dark:text-gray-300">{{ car.owner_phone }}</span>
            </div>
          </div>

          <!-- Insignia de cliente frecuente -->
          <div v-if="car.loyalty_points >= 50" class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <span class="badge bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
              ⭐ Cliente Frecuente
            </span>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="text-center py-12">
        <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="text-gray-600 dark:text-gray-400">
          {{ searchQuery ? 'No se encontraron autos con esa placa' : 'No hay autos registrados' }}
        </p>
        <router-link v-if="!searchQuery" to="/cars/new" class="btn btn-primary mt-4">
          Registrar Primer Auto
        </router-link>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { carsApi } from '@/api/cars'
import { useToastStore } from '@/stores/toast'
import type { Car } from '@/types'
import AppLayout from '@/components/AppLayout.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const router = useRouter()
const toastStore = useToastStore()

const cars = ref<Car[]>([])
const loading = ref(false)
const error = ref('')
const searchQuery = ref('')

const filteredCars = computed(() => {
  if (!searchQuery.value) return cars.value
  
  const query = searchQuery.value.toLowerCase()
  return cars.value.filter(car => 
    car.plate.toLowerCase().includes(query)
  )
})

const loadCars = async () => {
  loading.value = true
  error.value = ''
  
  try {
    cars.value = await carsApi.getCars()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error al cargar los autos'
    toastStore.error(error.value)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadCars()
})
</script>
