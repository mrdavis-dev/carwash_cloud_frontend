# Ejemplos de Uso - Carwash Cloud API

Este documento contiene ejemplos de cómo interactuar con la API del backend desde el frontend.

## 🔐 Autenticación

### Registrar un nuevo negocio

```typescript
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const result = await authStore.signup({
  business_name: 'Lavado El Brillante',
  username: 'admin',
  password: 'securepass123'
})

if (result.success) {
  console.log('Negocio creado con ID:', result.businessId)
}
```

### Login

```typescript
const result = await authStore.login({
  username: 'admin',
  password: 'securepass123'
})

if (result.success) {
  // Usuario autenticado, el token se guarda automáticamente
  router.push('/cars')
}
```

### Logout

```typescript
authStore.logout()
router.push('/login')
```

## 🚗 Gestión de Autos

### Obtener lista de autos

```typescript
import { carsApi } from '@/api/cars'

const cars = await carsApi.getCars()
// Retorna: Car[]
```

### Registrar un nuevo auto

```typescript
const newCar = await carsApi.createCar({
  plate: 'ABC123',
  car_type: 'Sedan',
  owner_name: 'Juan Pérez',
  owner_phone: '555-1234'
})

console.log('Puntos iniciales:', newCar.loyalty_points) // 0
```

### Obtener detalle de un auto

```typescript
const car = await carsApi.getCarByPlate('ABC123')
console.log(car.loyalty_points) // Puntos acumulados
```

### Obtener historial de servicios

```typescript
const history = await carsApi.getCarHistory('ABC123')

history.forEach(service => {
  console.log(`${service.service_type} - ${service.points_earned} puntos`)
  console.log(`Atendido por: ${service.employee_name}`)
})
```

## 📋 Gestión de Asignaciones

### Listar asignaciones activas

```typescript
import { assignmentsApi } from '@/api/assignments'

const assignments = await assignmentsApi.getAssignments()

// Filtrar solo pendientes
const pending = assignments.filter(a => a.status === 'Pending')
```

### Crear una nueva asignación

```typescript
const assignment = await assignmentsApi.createAssignment({
  car_plate: 'ABC123',
  employee_name: 'Carlos López',
  service_type: 'Completo' // Básico, Completo, Premium, Express
})

console.log('Asignación creada:', assignment.id)
console.log('Estado:', assignment.status) // 'Pending'
```

### Completar una asignación

```typescript
const completed = await assignmentsApi.completeAssignment(assignmentId)

console.log('Estado:', completed.status) // 'Completed'
console.log('Puntos ganados:', completed.points_earned)
// Los puntos ya se sumaron automáticamente al auto
```

## 🔔 Notificaciones Toast

### Mostrar notificaciones

```typescript
import { useToastStore } from '@/stores/toast'

const toastStore = useToastStore()

// Éxito
toastStore.success('Auto registrado exitosamente')

// Error
toastStore.error('No se pudo completar la asignación')

// Advertencia
toastStore.warning('Este auto ya tiene una asignación activa')

// Información
toastStore.info('Sesión cerrada correctamente')
```

## 🎯 Composables Personalizados

### useCars (ejemplo de composable)

```typescript
// src/composables/useCars.ts
import { ref } from 'vue'
import { carsApi } from '@/api/cars'
import { useToastStore } from '@/stores/toast'
import type { Car } from '@/types'

export function useCars() {
  const cars = ref<Car[]>([])
  const loading = ref(false)
  const error = ref('')
  const toastStore = useToastStore()

  const loadCars = async () => {
    loading.value = true
    error.value = ''
    
    try {
      cars.value = await carsApi.getCars()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error'
      toastStore.error(error.value)
    } finally {
      loading.value = false
    }
  }

  return {
    cars,
    loading,
    error,
    loadCars
  }
}
```

Uso en componente:

```vue
<script setup lang="ts">
import { onMounted } from 'vue'
import { useCars } from '@/composables/useCars'

const { cars, loading, loadCars } = useCars()

onMounted(() => {
  loadCars()
})
</script>
```

## 🔄 Manejo de Estados de Asignaciones

```typescript
type AssignmentStatus = 'Pending' | 'Washing' | 'Completed'

const getStatusBadge = (status: AssignmentStatus) => {
  const badges = {
    Pending: 'badge-pending',
    Washing: 'badge-washing',
    Completed: 'badge-completed'
  }
  return badges[status]
}
```

## 🎨 Clases CSS Útiles

```vue
<!-- Botones -->
<button class="btn btn-primary">Primario</button>
<button class="btn btn-secondary">Secundario</button>
<button class="btn btn-success">Éxito</button>
<button class="btn btn-danger">Peligro</button>

<!-- Inputs -->
<input type="text" class="input" />

<!-- Cards -->
<div class="card">
  Contenido de la tarjeta
</div>

<!-- Badges -->
<span class="badge badge-pending">Pendiente</span>
<span class="badge badge-washing">Lavando</span>
<span class="badge badge-completed">Completado</span>

<!-- Labels -->
<label class="label">Campo requerido *</label>

<!-- Mensajes de error -->
<p class="error-message">Este campo es obligatorio</p>
```

## 📊 Sistema de Puntos

```typescript
const servicePoints = {
  'Básico': 10,
  'Completo': 20,
  'Premium': 30,
  'Express': 5
}

// Calcular puntos totales
const totalPoints = assignments
  .filter(a => a.status === 'Completed')
  .reduce((sum, a) => sum + (a.points_earned || 0), 0)

// Verificar cliente frecuente
const isFrequentClient = car.loyalty_points >= 50
```

## 🔍 Búsqueda y Filtrado

```typescript
// Filtrar autos por placa
const searchCars = (query: string, cars: Car[]) => {
  const q = query.toLowerCase()
  return cars.filter(car => 
    car.plate.toLowerCase().includes(q) ||
    car.owner_name.toLowerCase().includes(q)
  )
}

// Ordenar por puntos (mayor a menor)
const sortedByPoints = [...cars].sort((a, b) => 
  b.loyalty_points - a.loyalty_points
)
```

## 📅 Formato de Fechas

```typescript
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Uso
formatDate('2024-01-15T10:30:00')
// Retorna: "15 de enero de 2024, 10:30"
```

## ⚠️ Manejo de Errores

```typescript
try {
  await carsApi.createCar(carData)
  toastStore.success('Auto creado')
} catch (err) {
  if (err instanceof Error) {
    // Error conocido
    toastStore.error(err.message)
  } else {
    // Error desconocido
    toastStore.error('Ocurrió un error inesperado')
  }
}
```

## 🔐 Verificar Autenticación en Componente

```typescript
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Verificar si está autenticado
if (!authStore.isAuthenticated) {
  router.push('/login')
}

// Obtener datos del usuario
const username = authStore.currentUser?.username
const businessId = authStore.businessId
```

## 🎯 Tips de Performance

```vue
<!-- Lazy loading de componentes -->
<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const HeavyComponent = defineAsyncComponent(
  () => import('@/components/HeavyComponent.vue')
)
</script>

<!-- Usar v-show en lugar de v-if para toggles frecuentes -->
<div v-show="isVisible">Contenido</div>

<!-- Usar keys en v-for -->
<div v-for="car in cars" :key="car.plate">
  {{ car.plate }}
</div>
```

---

Para más información, consulta el [README.md](./README.md) principal.
