<template>
  <nav class="bg-white dark:bg-gray-800 shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <router-link to="/" class="flex items-center space-x-2">
            <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span class="text-xl font-bold text-gray-900 dark:text-white">Carwash Cloud</span>
          </router-link>
        </div>

        <div v-if="authStore.isAuthenticated" class="flex items-center space-x-4">
          <router-link
            to="/cars"
            class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            :class="isActive('/cars') ? 'bg-gray-100 dark:bg-gray-700' : ''"
          >
            Autos
          </router-link>
          <router-link
            to="/assignments"
            class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            :class="isActive('/assignments') ? 'bg-gray-100 dark:bg-gray-700' : ''"
          >
            Asignaciones
          </router-link>

          <div class="flex items-center space-x-3 border-l border-gray-300 dark:border-gray-600 pl-4">
            <span class="text-sm text-gray-600 dark:text-gray-300">
              {{ authStore.currentUser?.username }}
            </span>
            <button
              @click="handleLogout"
              class="btn btn-secondary text-sm"
            >
              Salir
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const toastStore = useToastStore()

const isActive = (path: string) => {
  return route.path.startsWith(path)
}

const handleLogout = () => {
  authStore.logout()
  toastStore.info('Sesión cerrada correctamente')
  router.push('/login')
}
</script>
