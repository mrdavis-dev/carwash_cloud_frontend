import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Toast, ToastType } from '@/types'

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([])
  let nextId = 1

  /**
   * Muestra un nuevo toast
   */
  function show(message: string, type: ToastType = 'info', duration: number = 5000) {
    const toast: Toast = {
      id: nextId++,
      message,
      type,
      duration,
    }

    toasts.value.push(toast)

    // Auto-remover después de la duración especificada
    if (duration > 0) {
      setTimeout(() => {
        remove(toast.id)
      }, duration)
    }

    return toast.id
  }

  /**
   * Remueve un toast por ID
   */
  function remove(id: number) {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  /**
   * Muestra un toast de éxito
   */
  function success(message: string, duration?: number) {
    return show(message, 'success', duration)
  }

  /**
   * Muestra un toast de error
   */
  function error(message: string, duration?: number) {
    return show(message, 'error', duration)
  }

  /**
   * Muestra un toast de advertencia
   */
  function warning(message: string, duration?: number) {
    return show(message, 'warning', duration)
  }

  /**
   * Muestra un toast informativo
   */
  function info(message: string, duration?: number) {
    return show(message, 'info', duration)
  }

  /**
   * Limpia todos los toasts
   */
  function clear() {
    toasts.value = []
  }

  return {
    toasts,
    show,
    remove,
    success,
    error,
    warning,
    info,
    clear,
  }
})
