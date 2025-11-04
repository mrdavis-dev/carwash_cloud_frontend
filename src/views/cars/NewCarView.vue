<template>
  <AppLayout>
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-6">
        <router-link to="/cars" class="text-primary-600 hover:text-primary-700 flex items-center">
          <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a la lista
        </router-link>
      </div>

      <div class="card">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Registrar Nuevo Auto</h1>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label for="plate" class="label">Placa *</label>
            <input
              id="plate"
              v-model="form.plate"
              type="text"
              required
              class="input uppercase"
              :class="{ 'border-red-500': errors.plate }"
              placeholder="ABC123"
            />
            <p v-if="errors.plate" class="error-message">{{ errors.plate }}</p>
          </div>

          <div>
            <label for="car_type" class="label">Tipo de Vehículo *</label>
            <select
              id="car_type"
              v-model="form.car_type"
              required
              class="input"
              :class="{ 'border-red-500': errors.car_type }"
            >
              <option value="">Seleccionar...</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Camioneta">Camioneta</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Deportivo">Deportivo</option>
              <option value="Van">Van</option>
              <option value="Otro">Otro</option>
            </select>
            <p v-if="errors.car_type" class="error-message">{{ errors.car_type }}</p>
          </div>

          <div>
            <label for="owner_name" class="label">Nombre del Propietario *</label>
            <input
              id="owner_name"
              v-model="form.owner_name"
              type="text"
              required
              class="input"
              :class="{ 'border-red-500': errors.owner_name }"
              placeholder="Juan Pérez"
            />
            <p v-if="errors.owner_name" class="error-message">{{ errors.owner_name }}</p>
          </div>

          <div>
            <label for="owner_phone" class="label">Teléfono del Propietario *</label>
            <input
              id="owner_phone"
              v-model="form.owner_phone"
              type="tel"
              required
              class="input"
              :class="{ 'border-red-500': errors.owner_phone }"
              placeholder="555-1234"
            />
            <p v-if="errors.owner_phone" class="error-message">{{ errors.owner_phone }}</p>
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
              <span v-if="loading">Guardando...</span>
              <span v-else>Registrar Auto</span>
            </button>
            <router-link to="/cars" class="btn btn-secondary">
              Cancelar
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { carsApi } from '@/api/cars'
import { useToastStore } from '@/stores/toast'
import AppLayout from '@/components/AppLayout.vue'

const router = useRouter()
const toastStore = useToastStore()

const loading = ref(false)
const form = reactive({
  plate: '',
  car_type: '',
  owner_name: '',
  owner_phone: '',
})

const errors = reactive({
  plate: '',
  car_type: '',
  owner_name: '',
  owner_phone: '',
  general: '',
})

const resetErrors = () => {
  errors.plate = ''
  errors.car_type = ''
  errors.owner_name = ''
  errors.owner_phone = ''
  errors.general = ''
}

const validateForm = () => {
  resetErrors()
  let isValid = true

  if (!form.plate.trim()) {
    errors.plate = 'La placa es requerida'
    isValid = false
  }

  if (!form.car_type) {
    errors.car_type = 'El tipo de vehículo es requerido'
    isValid = false
  }

  if (!form.owner_name.trim()) {
    errors.owner_name = 'El nombre del propietario es requerido'
    isValid = false
  }

  if (!form.owner_phone.trim()) {
    errors.owner_phone = 'El teléfono es requerido'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  loading.value = true
  resetErrors()

  try {
    await carsApi.createCar({
      plate: form.plate.toUpperCase(),
      car_type: form.car_type,
      owner_name: form.owner_name,
      owner_phone: form.owner_phone,
    })

    toastStore.success('Auto registrado exitosamente')
    router.push('/cars')
  } catch (err) {
    errors.general = err instanceof Error ? err.message : 'Error al registrar el auto'
    toastStore.error(errors.general)
  } finally {
    loading.value = false
  }
}
</script>
