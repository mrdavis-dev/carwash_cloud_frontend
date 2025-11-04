<template>
  <AuthLayout>
    <div>
      <div class="text-center mb-8">
        <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white">
          Crear Cuenta
        </h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          O
          <router-link to="/login" class="font-medium text-primary-600 hover:text-primary-500">
            inicia sesión
          </router-link>
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label for="business_name" class="label">Nombre del Negocio</label>
          <input
            id="business_name"
            v-model="form.business_name"
            type="text"
            required
            class="input"
            :class="{ 'border-red-500': errors.business_name }"
            placeholder="Ej: Lavado de Autos El Brillante"
          />
          <p v-if="errors.business_name" class="error-message">{{ errors.business_name }}</p>
        </div>

        <div>
          <label for="username" class="label">Usuario</label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            required
            class="input"
            :class="{ 'border-red-500': errors.username }"
            placeholder="Tu nombre de usuario"
          />
          <p v-if="errors.username" class="error-message">{{ errors.username }}</p>
        </div>

        <div>
          <label for="password" class="label">Contraseña</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            class="input"
            :class="{ 'border-red-500': errors.password }"
            placeholder="Mínimo 4 caracteres"
          />
          <p v-if="errors.password" class="error-message">{{ errors.password }}</p>
        </div>

        <div>
          <label for="confirmPassword" class="label">Confirmar Contraseña</label>
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            required
            class="input"
            :class="{ 'border-red-500': errors.confirmPassword }"
            placeholder="Repite tu contraseña"
          />
          <p v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</p>
        </div>

        <div v-if="errors.general" class="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg">
          <p class="text-sm text-red-800 dark:text-red-200">{{ errors.general }}</p>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="btn btn-primary w-full"
        >
          <span v-if="loading" class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creando cuenta...
          </span>
          <span v-else>Crear Cuenta</span>
        </button>
      </form>
    </div>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import AuthLayout from '@/components/AuthLayout.vue'

const router = useRouter()
const authStore = useAuthStore()
const toastStore = useToastStore()

const loading = ref(false)
const form = reactive({
  business_name: '',
  username: '',
  password: '',
  confirmPassword: '',
})

const errors = reactive({
  business_name: '',
  username: '',
  password: '',
  confirmPassword: '',
  general: '',
})

const resetErrors = () => {
  errors.business_name = ''
  errors.username = ''
  errors.password = ''
  errors.confirmPassword = ''
  errors.general = ''
}

const validateForm = () => {
  resetErrors()
  let isValid = true

  if (!form.business_name.trim()) {
    errors.business_name = 'El nombre del negocio es requerido'
    isValid = false
  }

  if (!form.username.trim()) {
    errors.username = 'El usuario es requerido'
    isValid = false
  } else if (form.username.length < 3) {
    errors.username = 'El usuario debe tener al menos 3 caracteres'
    isValid = false
  }

  if (!form.password) {
    errors.password = 'La contraseña es requerida'
    isValid = false
  } else if (form.password.length < 4) {
    errors.password = 'La contraseña debe tener al menos 4 caracteres'
    isValid = false
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = 'Debes confirmar tu contraseña'
    isValid = false
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Las contraseñas no coinciden'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  loading.value = true
  resetErrors()

  const result = await authStore.signup({
    business_name: form.business_name,
    username: form.username,
    password: form.password,
  })

  loading.value = false

  if (result.success) {
    toastStore.success('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión')
    router.push('/login')
  } else {
    errors.general = result.error || 'Error al crear la cuenta'
  }
}
</script>
