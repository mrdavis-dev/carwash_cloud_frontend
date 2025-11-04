<template>
  <AppLayout>
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-6">
        <router-link to="/assignments" class="text-primary-600 hover:text-primary-700 flex items-center">
          <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a asignaciones
        </router-link>
      </div>

      <div class="card">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Nueva Asignación</h1>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label for="car_plate" class="label">Auto (Placa) *</label>
            <input
              v-if="!loadingCars"
              id="car_plate"
              v-model="searchQuery"
              type="text"
              class="input mb-2"
              placeholder="Buscar por placa..."
              @focus="showDropdown = true"
            />
            <LoadingSpinner v-if="loadingCars" :loading="true" message="Cargando autos..." />
            
            <!-- Dropdown de autos -->
            <div
              v-if="showDropdown && filteredCars.length > 0"
              class="border border-gray-300 dark:border-gray-600 rounded-lg max-h-60 overflow-y-auto bg-white dark:bg-gray-800 shadow-lg"
            >
              <button
                v-for="car in filteredCars"
                :key="car.plate"
                type="button"
                @click="selectCar(car)"
                class="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b border-gray-200 dark:border-gray-700 last:border-b-0"
              >
                <div class="font-semibold text-gray-900 dark:text-white">{{ car.plate }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  {{ car.car_type }} - {{ car.owner_name }}
                </div>
              </button>
            </div>

            <!-- Auto seleccionado -->
            <div
              v-if="form.car_plate"
              class="mt-2 p-3 bg-primary-50 dark:bg-primary-900/30 rounded-lg border border-primary-200 dark:border-primary-800"
            >
              <div class="flex items-center justify-between">
                <div>
                  <div class="font-semibold text-primary-900 dark:text-primary-100">{{ form.car_plate }}</div>
                  <div class="text-sm text-primary-700 dark:text-primary-300">
                    {{ selectedCarInfo?.car_type }} - {{ selectedCarInfo?.owner_name }}
                  </div>
                </div>
                <button
                  type="button"
                  @click="clearSelection"
                  class="text-primary-600 hover:text-primary-700"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <p v-if="errors.car_plate" class="error-message">{{ errors.car_plate }}</p>
          </div>

          <div>
            <label for="employee_name" class="label">Empleado Asignado *</label>
            <input
              id="employee_name"
              v-model="form.employee_name"
              type="text"
              required
              class="input"
              :class="{ 'border-red-500': errors.employee_name }"
              placeholder="Nombre del empleado"
            />
            <p v-if="errors.employee_name" class="error-message">{{ errors.employee_name }}</p>
          </div>

          <div>
            <label for="service_type" class="label">Tipo de Servicio *</label>
            <select
              id="service_type"
              v-model="form.service_type"
              required
              class="input"
              :class="{ 'border-red-500': errors.service_type }"
            >
              <option value="">Seleccionar...</option>
              <option value="Básico">Básico (10 puntos)</option>
              <option value="Completo">Completo (20 puntos)</option>
              <option value="Premium">Premium (30 puntos)</option>
              <option value="Express">Express (5 puntos)</option>
            </select>
            <p v-if="errors.service_type" class="error-message">{{ errors.service_type }}</p>
          </div>

          <div v-if="errors.general" class="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg">
            <p class="text-sm text-red-800 dark:text-red-200">{{ errors.general }}</p>
          </div>

          <div class="flex gap-4">
            <button
              type="submit"
              :disabled="loading"
              class="btn btn-primary flex-1"
            >
              <span v-if="loading">Creando...</span>
              <span v-else>Crear Asignación</span>
            </button>
            <router-link to="/assignments" class="btn btn-secondary">
              Cancelar
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { carsApi } from '@/api/cars'
import { assignmentsApi } from '@/api/assignments'
import { useToastStore } from '@/stores/toast'
import type { Car, ServiceType } from '@/types'
import AppLayout from '@/components/AppLayout.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const router = useRouter()
const toastStore = useToastStore()

const cars = ref<Car[]>([])
const loadingCars = ref(false)
const loading = ref(false)
const showDropdown = ref(false)
const searchQuery = ref('')
const selectedCarInfo = ref<Car | null>(null)

const form = reactive({
  car_plate: '',
  employee_name: '',
  service_type: '' as ServiceType | '',
})

const errors = reactive({
  car_plate: '',
  employee_name: '',
  service_type: '',
  general: '',
})

const filteredCars = computed(() => {
  if (!searchQuery.value) return cars.value.slice(0, 10)
  
  const query = searchQuery.value.toLowerCase()
  return cars.value.filter(car => 
    car.plate.toLowerCase().includes(query) ||
    car.owner_name.toLowerCase().includes(query)
  ).slice(0, 10)
})

const selectCar = (car: Car) => {
  form.car_plate = car.plate
  selectedCarInfo.value = car
  searchQuery.value = ''
  showDropdown.value = false
}

const clearSelection = () => {
  form.car_plate = ''
  selectedCarInfo.value = null
  searchQuery.value = ''
}

const resetErrors = () => {
  errors.car_plate = ''
  errors.employee_name = ''
  errors.service_type = ''
  errors.general = ''
}

const validateForm = () => {
  resetErrors()
  let isValid = true

  if (!form.car_plate) {
    errors.car_plate = 'Debes seleccionar un auto'
    isValid = false
  }

  if (!form.employee_name.trim()) {
    errors.employee_name = 'El nombre del empleado es requerido'
    isValid = false
  }

  if (!form.service_type) {
    errors.service_type = 'El tipo de servicio es requerido'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  loading.value = true
  resetErrors()

  try {
    await assignmentsApi.createAssignment({
      car_plate: form.car_plate,
      employee_name: form.employee_name,
      service_type: form.service_type as ServiceType,
    })

    toastStore.success('Asignación creada exitosamente')
    router.push('/assignments')
  } catch (err) {
    errors.general = err instanceof Error ? err.message : 'Error al crear la asignación'
    toastStore.error(errors.general)
  } finally {
    loading.value = false
  }
}

const loadCars = async () => {
  loadingCars.value = true

  try {
    cars.value = await carsApi.getCars()
  } catch (err) {
    toastStore.error('Error al cargar los autos')
  } finally {
    loadingCars.value = false
  }
}

onMounted(() => {
  loadCars()
})

// Cerrar dropdown al hacer click fuera
document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement
  if (!target.closest('#car_plate')) {
    showDropdown.value = false
  }
})
</script>
