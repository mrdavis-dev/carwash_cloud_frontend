// ...existing code...
<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-black opacity-50" @click="onClose"></div>

    <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6 z-60">
      <h3 class="text-xl font-bold mb-2">Confirmar lavado</h3>
      <p class="text-sm text-gray-600 mb-4">
        ¿Qué deseas hacer con el lavado de la placa
        <span class="font-semibold">{{ task?.car_plate }}</span> ({{ task?.employee_name }})?
      </p>

      <div class="flex gap-3">
        <button
          @click="sendWhatsApp"
          class="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
        >
          Enviar WhatsApp
        </button>

        <button
          @click="confirmComplete"
          class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Marcar como listo (+{{ pointsPerWash }} pts)
        </button>
      </div>

      <button @click="onClose" class="mt-4 text-sm text-gray-500 hover:underline">Cancelar</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ConfirmComplete",
  props: {
    task: { type: Object, required: false },
    pointsPerWash: { type: Number, default: 0 }
  },
  emits: ["close", "confirm"],
  methods: {
    onClose() {
      this.$emit("close");
    },
    confirmComplete() {
      // Emitir confirm y dejar que el padre ejecute la acción
      this.$emit("confirm", this.task);
      this.onClose();
    },
    sendWhatsApp() {
      const t = this.task || {};
      const plate = t.car_plate || "";
      const employee = t.employee_name || "";
      const message = `Lavado completado: Placa ${plate}. Asignado a ${employee}. +${this.pointsPerWash} pts.`;
      const encoded = encodeURIComponent(message);
      // abre el diálogo de WhatsApp para que el usuario elija contacto
      window.open(`https://api.whatsapp.com/send?text=${encoded}`, "_blank");

      // Además de abrir WhatsApp, emitir confirm para marcar como listo y cerrar modal
      this.$emit("confirm", this.task);
      this.onClose();
    }
  }
};
</script>

<style scoped>
/* ...existing styles... */
</style>
// ...existing code...