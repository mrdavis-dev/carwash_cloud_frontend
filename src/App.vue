<script setup>
import { ref } from 'vue';
import Navbar from './components/Navbar.vue';
import ActiveWashes from './components/ActiveWashes.vue';
import RegisterModal from './components/RegisterModal.vue';
import ClientsPage from './components/ClientsPage.vue';
import { useCarWash } from './useCarWash.js';

// Usamos el composable para obtener toda la lógica y el estado.
const {
  assignments,
  employees,
  pointsPerWash,
  newCarAssignment,
  message,
  showModal,
  registerAndAssign,
  completeAssignment,
} = useCarWash();

// Estado de navegación
const currentSection = ref('home');

const closeModal = () => {
  showModal.value = false; // Actualiza el estado de showModal
};

const handleNavigation = (section) => {
  currentSection.value = section;
};
</script>

<template>
    <Navbar @navigate="handleNavigation" />
    <div id="app" class="flex flex-col items-center min-h-screen bg-gray-100 px-4 md:px-8">

        <!-- Mensajes de Alerta -->
        <div v-if="message" :class="['p-4 rounded-lg mb-6 text-white font-semibold', message.type === 'success' ? 'bg-green-500' : 'bg-red-500']" role="alert">
            {{ message.text }}
        </div>

        <!-- Contenido principal basado en la sección activa -->
        <div class="flex flex-col items-center w-full pt-16">
            <!-- Página de inicio (ActiveWashes) -->
            <ActiveWashes
                v-if="currentSection === 'home'"
                :assignments="assignments"
                :pointsPerWash="pointsPerWash"
                :completeAssignment="completeAssignment"
            />
            
            <!-- Página de clientes -->
            <ClientsPage v-if="currentSection === 'clients'" />
            
            <!-- Página de servicios (placeholder) -->
            <div v-if="currentSection === 'services'" class="text-center py-12 max-w-2xl">
                <div class="text-6xl mb-4">🚿</div>
                <h2 class="text-3xl font-bold mb-4 text-gray-800">Servicios</h2>
                <p class="text-gray-600 text-lg">Página de servicios en construcción...</p>
                <div class="mt-8 p-6 bg-white rounded-lg shadow-md">
                    <h3 class="text-xl font-semibold mb-3">Próximamente:</h3>
                    <ul class="text-left space-y-2 text-gray-700">
                        <li>• Gestión de tipos de lavado</li>
                        <li>• Precios y promociones</li>
                        <li>• Configuración de servicios</li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- Botón de Acción Flotante (FAB) - solo visible en inicio -->
        <button 
            v-if="currentSection === 'home'"
            @click="showModal = true"
            class="fixed bottom-6 right-6 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl transition duration-300 transform hover:scale-105 z-50 focus:outline-none"
            aria-label="Registrar nuevo lavado"
        >
            <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
        </button>

        <!-- Modal para Registrar y Asignar Lavado -->
        <RegisterModal
            :showModal="showModal"
            :newCarAssignment="newCarAssignment"
            :employees="employees"
            :registerAndAssign="registerAndAssign"
            :closeModal="closeModal"
        />

    </div>
</template>

<style>
body {
    font-family: 'Inter', sans-serif;
    background-color: #f7f7f7;
    /* Necesario para que el FAB funcione correctamente */
    min-height: 100vh; 
}
.card {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06);
}
</style>
