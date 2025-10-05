<template>
  <div v-if="showModal" class="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative">
      <button @click="closeModal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
        <!-- Icono X -->
        <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <h2 class="text-2xl font-bold mb-6 text-blue-600 border-b pb-2">📝 Nuevo Cliente y Asignación</h2>

      <form @submit.prevent="registerAndAssign" class="space-y-4">
        <!-- Datos del Auto -->
        <input v-model="newCarAssignment.owner_name" placeholder="Nombre del Dueño" required class="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
        <input v-model="newCarAssignment.owner_phone" placeholder="Número de Celular" required class="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
        <input v-model="newCarAssignment.plate" placeholder="Placa del Auto (Ej: P3R512)" required class="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 uppercase">
        <select v-model="newCarAssignment.car_type" required class="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white">
          <option value="" disabled>Selecciona Tipo de Auto</option>
          <option value="Sedan">Sedán</option>
          <option value="SUV">SUV</option>
          <option value="Truck">Camioneta/Pick-up</option>
          <option value="Hatchback">Hatchback</option>
        </select>

        <div class="pt-2 border-t border-dashed">
          <!-- Asignación de Empleado -->
          <h3 class="text-lg font-semibold text-gray-700 mb-2">👨‍🔧 Asignar Empleado</h3>
          <select v-model="newCarAssignment.employee_name" required class="w-full p-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 bg-white">
            <option value="" disabled>Selecciona Empleado</option>
            <option v-for="employee in employees" :key="employee" :value="employee">{{ employee }}</option>
          </select>
        </div>

        <button type="submit" class="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200 mt-6">
          Registrar Auto y Asignar Lavado
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RegisterModal',
  props: {
    showModal: {
      type: Boolean,
      required: true,
    },
    newCarAssignment: {
      type: Object,
      required: true,
    },
    employees: {
      type: Array,
      required: true,
    },
    registerAndAssign: {
      type: Function,
      required: true,
    },
    closeModal: {
      type: Function,
      required: true,
    },
  },
};
</script>

<style scoped>
/* Puedes agregar estilos específicos aquí */
</style>