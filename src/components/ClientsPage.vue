<template>
  <div class="w-full max-w-6xl mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">👥 Clientes</h1>
      <div class="text-sm text-gray-500">
        Total: {{ clients.length }} clientes
      </div>
    </div>

    <!-- Barra de búsqueda -->
    <div class="mb-6">
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Buscar por nombre, teléfono o placa..."
        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
      >
    </div>

    <!-- Lista de clientes -->
    <div class="grid gap-4">
      <div v-if="loading" class="text-center text-gray-500 py-8">
        Cargando clientes...
      </div>
      
      <div v-if="error" class="text-red-600 bg-red-50 p-4 rounded-lg">
        {{ error }}
      </div>

      <template v-for="client in filteredClients" :key="client.id">
        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <h3 class="text-xl font-semibold text-gray-800">{{ client.name }}</h3>
                <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  ID: {{ client.id }}
                </span>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div class="flex items-center gap-2">
                  <span class="text-gray-500">📞</span>
                  <span class="text-gray-700">{{ client.phone || 'Sin teléfono' }}</span>
                </div>
                
                <div class="flex items-center gap-2">
                  <span class="text-gray-500">🚗</span>
                  <span class="text-gray-700">{{ client.plate }}</span>
                </div>
                
                <div class="flex items-center gap-2">
                  <span class="text-gray-500">�</span>
                  <span class="text-gray-700">{{ client.carType }}</span>
                </div>
                
                <div class="flex items-center gap-2">
                  <span class="text-gray-500">🏆</span>
                  <span class="font-semibold text-green-600">{{ client.points || 0 }} puntos</span>
                </div>
              </div>
              
              <div v-if="client.lastWash" class="mt-2 text-xs text-gray-500">
                Último lavado: {{ formatDate(client.lastWash) }}
              </div>
            </div>

            <div class="flex items-center gap-3 ml-4">
              <button 
                @click="copyPhone(client.phone)" 
                v-if="client.phone"
                title="Copiar teléfono"
                class="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
              >
                📞
              </button>
              
              <button 
                @click="openHistory(client)" 
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Ver Historial
              </button>
            </div>
          </div>
        </div>
      </template>

      <div v-if="!loading && filteredClients.length === 0 && !searchTerm" class="text-center text-gray-500 py-12 bg-gray-50 rounded-lg">
        <div class="text-4xl mb-4">📋</div>
        <p>No hay clientes registrados todavía.</p>
      </div>
      
      <div v-if="!loading && filteredClients.length === 0 && searchTerm" class="text-center text-gray-500 py-12 bg-gray-50 rounded-lg">
        <div class="text-4xl mb-4">🔍</div>
        <p>No se encontraron clientes con "{{ searchTerm }}"</p>
      </div>
    </div>

    <!-- Modal de historial -->
    <ClientHistory
      v-if="showHistory"
      :client="selectedClient"
      @close="showHistory = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import ClientHistory from './ClientHistory.vue';

// Estados reactivos
const clients = ref([]);
const loading = ref(false);
const error = ref('');
const showHistory = ref(false);
const selectedClient = ref(null);
const searchTerm = ref('');

// Computed para filtrar clientes
const filteredClients = computed(() => {
  if (!searchTerm.value) return clients.value;
  
  const term = searchTerm.value.toLowerCase();
  return clients.value.filter(client => 
    client.name.toLowerCase().includes(term) ||
    (client.phone && client.phone.includes(term)) ||
    (client.plate && client.plate.toLowerCase().includes(term))
  );
});

// Funciones
const fetchClients = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    const API_URL = 'https://carwashcloudapi-production.up.railway.app';
    // const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    // console.log('Fetching from:', `${API_URL}/cars/`); // Para debug
    const response = await fetch(`${API_URL}/cars/`);
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const carsData = await response.json();
    
    // Obtener assignments para calcular totalWashes
    const assignmentsResponse = await fetch(`${API_URL}/assignments/`);
    const assignmentsData = assignmentsResponse.ok ? await assignmentsResponse.json() : [];
    
    console.log('Assignments data for totalWashes calculation:', assignmentsData); // Para debug
    
    // Mapear datos de cars a formato de clientes
    clients.value = carsData.map(car => {
      // Contar assignments completados para esta placa (case insensitive)
      const completedAssignments = assignmentsData.filter(assignment => {
        const plateMatch = assignment.car_plate === car.plate;
        const statusMatch = assignment.status && assignment.status.toLowerCase() === 'completed';
        console.log(`Checking assignment for ${car.plate}:`, {
          assignment,
          plateMatch,
          statusMatch,
          actualStatus: assignment.status
        }); // Para debug
        return plateMatch && statusMatch;
      });
      
      console.log(`Total completed assignments for ${car.plate}:`, completedAssignments.length); // Para debug
      
      return {
        id: car._id,
        name: car.owner_name,
        phone: car.owner_phone,
        points: car.loyalty_points || 0,
        plate: car.plate,
        carType: car.car_type,
        // Calculamos totalWashes basado en assignments completados
        totalWashes: completedAssignments.length,
        // No tenemos lastWash en los datos actuales, lo dejamos undefined por ahora
        lastWash: undefined
      };
    });
  } catch (e) {
    console.error('Error al cargar clientes:', e);
    error.value = 'Error al cargar clientes: ' + (e.message || 'Error desconocido');
  } finally {
    loading.value = false;
  }
};

const openHistory = (client) => {
  console.log('Opening history for client:', client); // Para debug
  console.log('Client plate:', client.plate); // Verificar que la placa esté presente
  selectedClient.value = client;
  showHistory.value = true;
};

const copyPhone = async (phone) => {
  if (!phone) return;
  
  try {
    await navigator.clipboard.writeText(phone);
    // Aquí podrías mostrar una notificación de éxito
  } catch (error) {
    // Fallback para navegadores que no soportan clipboard API
    console.log('Teléfono:', phone);
  }
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

// Cargar datos al montar el componente
onMounted(() => {
  fetchClients();
});
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>