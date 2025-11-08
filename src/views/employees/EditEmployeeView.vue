<template>
  <AppLayout>
    <div class="max-w-2xl mx-auto">
      <!-- Loading State -->
      <div v-if="initialLoading" class="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>

      <!-- Content -->
      <div v-else>
        <!-- Header -->
        <div class="mb-8">
          <router-link to="/employees" class="text-primary-600 hover:text-primary-700 flex items-center mb-4">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Volver a Empleados
          </router-link>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Editar Empleado</h1>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Actualiza la información del empleado
          </p>
        </div>

        <!-- Form Card -->
        <div class="card">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Name -->
            <div>
              <label for="name" class="label">
                Nombre Completo <span class="text-red-500">*</span>
              </label>
              <input id="name" v-model="form.name" type="text" required class="input"
                :class="{ 'border-red-500': errors.name }" placeholder="Ej: Juan Pérez" />
              <p v-if="errors.name" class="error-message">{{ errors.name }}</p>
            </div>

            <!-- Role -->
            <div>
              <label for="role" class="label">Puesto/Rol</label>
              <input id="role" v-model="form.role" type="text" class="input"
                :class="{ 'border-red-500': errors.role }" placeholder="Ej: Lavador, Supervisor, Cajero" />
              <p v-if="errors.role" class="error-message">{{ errors.role }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Opcional: especifica el puesto o rol del empleado
              </p>
            </div>

            <!-- Phone -->
            <div>
              <label for="phone" class="label">Teléfono</label>
              <input id="phone" v-model="form.phone" type="tel" class="input"
                :class="{ 'border-red-500': errors.phone }" placeholder="Ej: 5551234567" />
              <p v-if="errors.phone" class="error-message">{{ errors.phone }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Opcional: número de contacto del empleado
              </p>
            </div>

            <!-- Error General -->
            <div v-if="errors.general" class="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg">
              <p class="text-sm text-red-800 dark:text-red-200">{{ errors.general }}</p>
            </div>

            <!-- Actions -->
            <div class="flex justify-end space-x-4">
              <router-link to="/employees" class="btn btn-secondary">
                Cancelar
              </router-link>
              <button type="submit" :disabled="loading" class="btn btn-primary">
                <span v-if="loading" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                  </svg>
                  Guardando...
                </span>
                <span v-else>Actualizar Empleado</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { employeesApi } from '@/api/employees'
import { useToastStore } from '@/stores/toast'
import AppLayout from '@/components/AppLayout.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const router = useRouter()
const route = useRoute()
const toastStore = useToastStore()

const employeeId = Number(route.params.id)
const initialLoading = ref(true)
const loading = ref(false)

const form = reactive({
  name: '',
  role: '',
  phone: '',
})

const errors = reactive({
  name: '',
  role: '',
  phone: '',
  general: '',
})

const resetErrors = () => {
  errors.name = ''
  errors.role = ''
  errors.phone = ''
  errors.general = ''
}

const loadEmployee = async () => {
  try {
    const employee = await employeesApi.getById(employeeId)
    form.name = employee.name
    form.role = employee.role || ''
    form.phone = employee.phone || ''
  } catch (err) {
    toastStore.error('Error al cargar el empleado')
    router.push('/employees')
  } finally {
    initialLoading.value = false
  }
}

const validateForm = () => {
  resetErrors()
  let isValid = true

  if (!form.name.trim()) {
    errors.name = 'El nombre es requerido'
    isValid = false
  } else if (form.name.trim().length < 3) {
    errors.name = 'El nombre debe tener al menos 3 caracteres'
    isValid = false
  }

  if (form.phone && !/^\d{10}$/.test(form.phone.replace(/\s|-/g, ''))) {
    errors.phone = 'El teléfono debe tener 10 dígitos'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  loading.value = true
  resetErrors()

  try {
    const data = {
      name: form.name.trim(),
      ...(form.role.trim() && { role: form.role.trim() }),
      ...(form.phone.trim() && { phone: form.phone.trim() }),
    }

    await employeesApi.update(employeeId, data)
    toastStore.success('Empleado actualizado exitosamente')
    router.push('/employees')
  } catch (err) {
    errors.general = err instanceof Error ? err.message : 'Error al actualizar el empleado'
    toastStore.error('Error al actualizar el empleado')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadEmployee()
})
</script>
