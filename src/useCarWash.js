import { ref, onMounted, reactive } from 'vue';

const API_URL = 'https://carwashcloudapi-production.up.railway.app';

// Este es un "composable" de Vue.
// Encapsula la lógica y el estado para que puedan ser reutilizados.
export function useCarWash() {
    // Datos reactivos
    const assignments = ref([]);
    const employees = ref(['Juan', 'Maria', 'Pedro', 'Ana']); // Empleados predefinidos
    const pointsPerWash = 1;
    
    // Estado del Modal
    const showModal = ref(false); 

    // Formulario para nuevo auto y asignación
    const newCarAssignment = reactive({
        owner_name: '',
        owner_phone: '',
        plate: '',
        car_type: '',
        employee_name: '' 
    });

    // Mensajes de usuario
    const message = ref(null);

    // Función para mostrar mensajes
    const showMessage = (text, type = 'success') => {
        message.value = { text, type };
        setTimeout(() => {
            message.value = null;
        }, 4000);
    };

    // --- Funciones de la API ---
    
    const fetchAssignments = async () => {
        try {
            const response = await fetch(`${API_URL}/assignments/`);
            if (!response.ok) throw new Error('Error al cargar asignaciones.');
            const data = await response.json();
            // Mapear _id a id
            assignments.value = data.map(task => ({ ...task, id: task._id }));
        } catch (error) {
            showMessage('No se pudo conectar al API. Asegúrate de que el servidor de FastAPI esté corriendo en el puerto 8000.', 'error');
            console.error('Error fetching assignments:', error);
        }
    };

    const registerAndAssign = async () => {
        const carData = {
            plate: newCarAssignment.plate.toUpperCase(),
            car_type: newCarAssignment.car_type,
            owner_name: newCarAssignment.owner_name,
            owner_phone: newCarAssignment.owner_phone
        };

        const assignmentData = {
            car_plate: newCarAssignment.plate.toUpperCase(),
            employee_name: newCarAssignment.employee_name
        };

        try {
            // Intentamos registrar el auto. La API debería manejar si ya existe.
            await fetch(`${API_URL}/cars/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(carData),
            });
            
            // Creamos la asignación
            const assignmentResponse = await fetch(`${API_URL}/assignments/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(assignmentData),
            });
            
            if (!assignmentResponse.ok) {
                const assignmentResult = await assignmentResponse.json();
                throw new Error(assignmentResult.detail || 'Error al asignar el lavado.');
            }

            showMessage(`ÉXITO: Lavado asignado a ${assignmentData.employee_name}.`, 'success');

            // Limpiar formulario y recargar
            Object.assign(newCarAssignment, {
                owner_name: '', owner_phone: '', plate: '', car_type: '', employee_name: ''
            });
            
            showModal.value = false;
            fetchAssignments();

        } catch (error) {
            showMessage(`Error: ${error.message}`, 'error');
            console.error('Operation error:', error);
        }
    };

    const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id);

    const completeAssignment = async (assignmentId, carPlate) => {
        console.log('Assignment ID recibido:', assignmentId);
        if (!isValidObjectId(assignmentId)) {
            showMessage('Error: ID de asignación inválido.', 'error');
            console.error('Invalid assignment ID:', assignmentId);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/assignments/${assignmentId}/complete`, {
                method: 'PUT'
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.detail || 'Error al completar la asignación.');
            }
            
            const result = await response.json();
            showMessage(`Lavado completado para ${carPlate}. Puntos totales: ${result.loyalty_points}`, 'success');
            fetchAssignments();

        } catch (error) {
            showMessage(`Error: ${error.message}`, 'error');
            console.error('Completion error:', error);
        }
    };

    // Cargar datos iniciales
    onMounted(fetchAssignments);

    // Devolvemos todo lo que el template necesita
    return {
        assignments,
        employees,
        pointsPerWash,
        newCarAssignment,
        message,
        showModal,
        registerAndAssign,
        completeAssignment,
    };
}
