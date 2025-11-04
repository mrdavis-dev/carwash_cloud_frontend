<template>
  <div 
    v-if="loading"
    class="flex items-center justify-center p-8"
  >
    <div class="flex flex-col items-center space-y-4">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      <p v-if="message" class="text-sm text-gray-600 dark:text-gray-400">
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  loading?: boolean
  message?: string
}>()
</script>
