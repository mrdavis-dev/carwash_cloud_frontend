<template>
  <div class="fixed inset-0 z-50 flex items-start justify-center pt-8 px-4">
    <!-- Overlay -->
    <div class="absolute inset-0 bg-black opacity-50" @click="close"></div>

    <!-- Modal -->
    <div class="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden z-60 relative">
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
        <div class="flex items-start justify-between">
          <div>
            <h2 class="text-2xl font-bold mb-1">{{ client?.name }}</h2>
            <div class="text-blue-100 text-sm space-y-1">
              <div v-if="client?.phone">📞 {{ client.phone }}</div>
              <div class="flex items-center gap-4">
                <span class="flex items-center gap-1">
                  🏆 <strong>{{ client?.points || 0 }}</strong> puntos
                </span>
                <span class="flex items-center gap-1">
                  🚗 <strong>{{ history.length }}</strong> lavados
                </span>
              </div>
            </div>
          </div>
          <button 
            @click="close" 
            class="text-blue-100 hover:text-white text-xl font-bold p-2 hover:bg-blue-800 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6 overflow-y-auto max-h-[60vh]">
        <!-- Loading state -->
        <div v-if="loading" class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p class="text-gray-500">Cargando historial...</p>
        </div>

        <!-- Error state -->
        <div v-if="error" class="text-red-600 bg-red-50 p-4 rounded-lg mb-4">
          <strong>Error:</strong> {{ error }}
        </div>

        <!-- Empty state -->
        <div v-if="!loading && history.length === 0" class="text-center py-12">
          <div class="text-6xl mb-4">📋</div>
          <h3 class="text-lg font-medium text-gray-600 mb-2">Sin historial</h3>
          <p class="text-gray-500">Este cliente no tiene registros de lavados todavía.</p>
        </div>

        <!-- History list -->
        <div v-if="history.length > 0" class="space-y-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-800">Historial de Lavados</h3>
            <div class="text-sm text-gray-500">
              Ordenado por fecha (más reciente primero)
            </div>
          </div>

          <div 
            v-for="(entry, index) in historySorted" 
            :key="entry.id || index"
            class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <!-- Fecha y hora -->
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-sm font-medium text-gray-800">
                    {{ formatDate(entry.date) }}
                  </span>
                  <span class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    #{{ entry.id || (index + 1) }}
                  </span>
                </div>

                <!-- Detalles del lavado -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-black">
                  <div class="flex items-center gap-2">
                    <span class="text-gray-500">🚗</span>
                    <span class="font-medium">{{ entry.car_plate || 'N/A' }}</span>
                  </div>
                  
                  <div class="flex items-center gap-2">
                    <span class="text-gray-500">👨‍🔧</span>
                    <span>{{ entry.employee_name || 'Sin asignar' }}</span>
                  </div>
                  
                  <div class="flex items-center gap-2">
                    <span class="text-gray-500">�</span>
                    <span>{{ entry.service_type || 'Lavado' }}</span>
                  </div>
                  
                  <div class="flex items-center gap-2">
                    <span class="text-gray-500">📋</span>
                    <span class="capitalize">{{ entry.status || 'Completado' }}</span>
                  </div>
                </div>

                <!-- Notas adicionales -->
                <div v-if="entry.notes" class="mt-2 text-sm text-gray-600 italic">
                  "{{ entry.notes }}"
                </div>
              </div>

              <!-- Puntos ganados -->
              <div class="ml-4 text-right">
                <div class="text-lg font-bold text-green-600">
                  +{{ entry.points || 1 }}
                </div>
                <div class="text-xs text-gray-500">puntos</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="bg-gray-50 px-6 py-4 border-t">
        <div class="flex justify-between items-center">
          <div class="text-sm text-gray-600">
            <strong>Total:</strong> {{ history.length }} {{ history.length === 1 ? 'lavado' : 'lavados' }} 
            • <strong>{{ totalPoints }}</strong> puntos acumulados
          </div>
          <button 
            @click="close"
            class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

// Props
const props = defineProps({
  client: {
    type: Object,
    required: true
  }
});

// Emits
const emit = defineEmits(['close']);

// Estados reactivos
const history = ref([]);
const loading = ref(false);
const error = ref('');

// Ya no necesitamos datos mock, usamos la API real

// Funciones
const fetchHistory = async (plate) => {
  if (!plate) {
    console.warn('fetchHistory called without plate');
    return;
  }
  
  loading.value = true;
  error.value = '';
  
  try {
    const API_URL = 'https://carwashcloudapi-production.up.railway.app';
    // const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    
    console.log('Fetching history for plate:', plate);
    const response = await fetch(`${API_URL}/cars/${plate}/history`);
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('History data received:', data); // Para debug
    
    // Mapear los datos de la API a la estructura que espera el componente
    const mappedHistory = data.map(entry => ({
      id: entry.id,
      date: entry.created_at || new Date().toISOString(),
      car_plate: entry.car_plate,
      employee_name: entry.employee_name,
      car_type: props.client?.carType || 'No especificado',
      status: entry.status,
      points: entry.points_earned || 1,
      service_type: entry.service_type || 'Lavado',
      notes: entry.notes || ''
    }));
    
    // Actualizar el historial de forma segura
    history.value = mappedHistory;
  } catch (e) {
    console.error('Error al cargar historial:', e);
    error.value = 'Error al cargar historial: ' + (e.message || 'Error desconocido');
    history.value = []; // Limpiar historial en caso de error
  } finally {
    loading.value = false;
  }
};

const close = () => {
  emit('close');
};

const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
};

// Computed
const historySorted = computed(() => {
  return [...history.value].sort((a, b) => new Date(b.date) - new Date(a.date));
});

const totalPoints = computed(() => {
  return history.value.reduce((total, entry) => total + (entry.points || 0), 0);
});

// Watchers
watch(() => props.client, (newClient, oldClient) => {
  console.log('ClientHistory received client:', newClient); // Para debug
  
  // Evitar llamadas duplicadas
  if (newClient && newClient.plate && newClient.plate !== oldClient?.plate) {
    console.log('Starting fetchHistory for plate:', newClient.plate); // Para debug
    fetchHistory(newClient.plate);
  } else if (!newClient?.plate) {
    console.warn('Client has no plate:', newClient); // Para debug
  }
}, { immediate: true });
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>