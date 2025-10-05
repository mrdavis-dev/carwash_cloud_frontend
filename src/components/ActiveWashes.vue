<template>
  <div class="card bg-white p-6 rounded-xl border border-gray-200 mx-auto px-4 md:px-8 max-w-4xl w-full">
    <h2 class="text-3xl font-bold mb-6 text-orange-600 border-b pb-2">
      📋 Lavados Activos ({{ assignments.length }})
    </h2>
    <div class="space-y-4">
      <div v-if="!assignments.length" class="p-6 bg-gray-100 rounded-lg text-center text-gray-500 italic font-medium">
        ¡No hay autos en la fila! Presiona el botón flotante (+) para registrar y asignar un nuevo lavado.
      </div>
      <div
        v-for="task in assignments"
        :key="task.id"
        class="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg shadow-md flex flex-col md:flex-row justify-between items-start md:items-center"
      >
        <div class="mb-2 md:mb-0">
          <p class="text-lg font-semibold text-gray-800">
            Placa: <span class="text-yellow-700">{{ task.car_plate }}</span>
          </p>
          <p class="text-sm text-gray-600">
            Asignado a: <span class="font-medium">{{ task.employee_name }}</span>
          </p>
          <p class="text-xs text-gray-500">
            Estado: <span class="uppercase font-bold">{{ task.status }}</span>
          </p>
        </div>
        <button
          @click="openConfirm(task)"
          :disabled="task.status === 'Completed'"
          class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full transition duration-200 text-sm disabled:opacity-50"
        >
          Marcar como Terminado
        </button>
      </div>
    </div>
    
    <ConfirmComplete
      v-if="showConfirm"
      :task="selectedTask"
      :pointsPerWash="pointsPerWash"
      @close="showConfirm = false"
      @confirm="handleConfirm"
    />
  
  </div>
</template>

<script>
import ConfirmComplete from './completeAssignment.vue';
export default {
  name: 'ActiveWashes',
  components: { ConfirmComplete },
  props: {
    assignments: {
      type: Array,
      required: true,
    },
    pointsPerWash: {
      type: Number,
      required: true,
    },
    completeAssignment: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      showConfirm: false,
      selectedTask: null,
    };
  },
  methods: {
    openConfirm(task) {
      this.selectedTask = task;
      this.showConfirm = true;
    },
    async handleConfirm(task) {
      // cierra modal y delega la acción al padre
      this.showConfirm = false;
      this.selectedTask = null;
      try {
        // llama a la función recibida por props (puede ser async)
        await this.completeAssignment(task.id, task.car_plate);
      } catch (err) {
        console.error('Error completing assignment:', err);
      }
    },
  },
};
</script>

<style scoped>
.card {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06);
}
</style>