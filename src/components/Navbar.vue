<template>
  <!-- Botón para abrir el menú -->
  <button @click="toggleMenu" class="absolute top-4 left-4 text-black p-4 z-40">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  </button>
  <!-- Menú desplegable -->
  <ul v-if="menuOpen" class="absolute top-16 left-4 bg-blue-600 text-white flex flex-col space-y-2 p-4 rounded-lg shadow-lg z-40">
    <li>
      <button @click="navigateTo('home')" class="hover:underline text-left w-full">
        🏠 Inicio
      </button>
    </li>
    <li>
      <button @click="navigateTo('services')" class="hover:underline text-left w-full">
        🚿 Servicios
      </button>
    </li>
    <li>
      <button @click="navigateTo('clients')" class="hover:underline text-left w-full">
        👥 Clientes
      </button>
    </li>
  </ul>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'MenuButton',
  emits: ['navigate'],
  setup(props, { emit }) {
    const menuOpen = ref(false);

    const toggleMenu = () => {
      menuOpen.value = !menuOpen.value;
    };

    const navigateTo = (section) => {
      emit('navigate', section);
      menuOpen.value = false; // Cerrar el menú después de navegar
    };

    return { menuOpen, toggleMenu, navigateTo };
  },
};
</script>

<style scoped>

</style>