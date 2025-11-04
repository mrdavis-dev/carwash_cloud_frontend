# Carwash Cloud - Sistema de Gestión de Lavado de Autos

Sistema moderno de gestión de lavado de autos construido con Vue 3, TypeScript, y Composition API. Incluye autenticación JWT, multi-tenancy, y sistema de puntos de lealtad.

## 🚀 Características

- ✅ **Autenticación JWT** con login y registro
- 🏢 **Multi-tenancy** por business_id
- 🚗 **Gestión de Autos** con registro y seguimiento
- 📋 **Asignaciones de Lavado** con estados (Pending, Washing, Completed)
- ⭐ **Sistema de Puntos de Lealtad** automático
- 📊 **Historial de Servicios** por auto
- 🎨 **UI Moderna** con TailwindCSS
- 🌙 **Dark Mode** ready
- 📱 **Responsive Design** mobile-first
- 🔔 **Toast Notifications** para feedback

## 🛠️ Tecnologías

- **Vue 3** con Composition API y `<script setup>`
- **TypeScript** para type safety
- **Pinia** para gestión de estado
- **Vue Router** con protección de rutas
- **Axios** con interceptores JWT
- **TailwindCSS** para estilos
- **Vite** como build tool
- **jwt-decode** para decodificar tokens

## 📋 Requisitos Previos

- Node.js 18+ y npm
- Backend FastAPI corriendo en `http://localhost:8000` (o configurar URL en `.env`)

## 🔧 Instalación

1. **Clonar el repositorio** (si aplica) o navegar a la carpeta del proyecto:

```bash
cd carwash_cloud
```

2. **Instalar dependencias**:

```bash
npm install
```

3. **Configurar variables de entorno**:

Copia el archivo `.env.example` a `.env` y ajusta la URL de tu API:

```bash
cp .env.example .env
```

Edita `.env`:

```env
VITE_API_URL=http://localhost:8000
```

## 🚀 Ejecutar en Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 🏗️ Build para Producción

```bash
npm run build
```

Los archivos optimizados se generarán en la carpeta `dist/`.

## 👀 Preview de Producción

```bash
npm run preview
```

## 📁 Estructura del Proyecto

```
carwash_cloud/
├── src/
│   ├── api/              # Servicios de API
│   │   ├── axiosInstance.ts
│   │   ├── auth.ts
│   │   ├── cars.ts
│   │   └── assignments.ts
│   ├── components/       # Componentes reutilizables
│   │   ├── AppLayout.vue
│   │   ├── AuthLayout.vue
│   │   ├── NavBar.vue
│   │   ├── ToastContainer.vue
│   │   └── LoadingSpinner.vue
│   ├── router/           # Configuración de rutas
│   │   └── index.ts
│   ├── stores/           # Stores de Pinia
│   │   ├── auth.ts
│   │   └── toast.ts
│   ├── types/            # Tipos TypeScript
│   │   └── index.ts
│   ├── views/            # Vistas/Páginas
│   │   ├── auth/
│   │   │   ├── LoginView.vue
│   │   │   └── SignupView.vue
│   │   ├── cars/
│   │   │   ├── CarsView.vue
│   │   │   ├── NewCarView.vue
│   │   │   └── CarDetailView.vue
│   │   └── assignments/
│   │       ├── AssignmentsView.vue
│   │       └── NewAssignmentView.vue
│   ├── App.vue
│   ├── main.ts
│   ├── style.css
│   └── vite-env.d.ts
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── .env.example
```

## 🔐 Flujo de Autenticación

1. **Signup**: Crear cuenta con nombre de negocio, usuario y contraseña
2. **Login**: Iniciar sesión con credenciales (envía form-urlencoded)
3. **Token JWT**: Se guarda en localStorage y se inyecta en cada request
4. **Auto-logout**: Si el token expira o se recibe 401
5. **Protected Routes**: Redirige a login si no está autenticado

## 📡 Endpoints de la API

### Auth (públicos)
- `POST /auth/signup` - Registrar negocio y usuario
- `POST /auth/login` - Login (form-urlencoded)

### Cars (requieren JWT)
- `GET /cars/` - Lista de autos del negocio
- `POST /cars/` - Crear nuevo auto
- `GET /cars/{plate}` - Detalle de auto
- `GET /cars/{plate}/history` - Historial de servicios

### Assignments (requieren JWT)
- `GET /assignments/` - Lista asignaciones activas
- `POST /assignments/` - Crear asignación
- `PUT /assignments/{id}/complete` - Completar asignación

## 🎯 Funcionalidades Principales

### Gestión de Autos
- Listar todos los autos registrados
- Buscar autos por placa
- Registrar nuevo auto con datos del propietario
- Ver detalle y historial completo de servicios
- Indicador visual de "Cliente Frecuente" (50+ puntos)

### Gestión de Asignaciones
- Listar asignaciones activas (no completadas)
- Crear nueva asignación seleccionando auto y empleado
- Completar asignación (suma puntos automáticamente)
- Estados visuales con badges (Pending, Washing, Completed)

### Sistema de Puntos
- Básico: 10 puntos
- Completo: 20 puntos
- Premium: 30 puntos
- Express: 5 puntos

Los puntos se acumulan automáticamente al completar asignaciones.

## 🎨 Personalización

### Colores Principales
Edita `tailwind.config.js` para cambiar la paleta de colores:

```js
theme: {
  extend: {
    colors: {
      primary: { /* tus colores */ }
    }
  }
}
```

### Logo y Marca
Edita `NavBar.vue` para cambiar el logo y nombre de la aplicación.

## 🐛 Troubleshooting

### Error de CORS
Asegúrate de que el backend FastAPI tenga configurado CORS correctamente:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Token expirado
Si recibes errores de autenticación, limpia localStorage y vuelve a hacer login:

```js
localStorage.clear()
```

### No se cargan los datos
Verifica que la API esté corriendo y que `VITE_API_URL` esté configurada correctamente en `.env`.

## 📝 Notas Importantes

- El endpoint `/auth/login` requiere `Content-Type: application/x-www-form-urlencoded`
- El `business_id` se extrae automáticamente del token JWT
- Todas las rutas excepto login/signup requieren autenticación
- Los errores 401 limpian automáticamente la sesión

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👨‍💻 Autor

Desarrollado con ❤️ para gestionar negocios de lavado de autos de manera eficiente.

---

**¿Necesitas ayuda?** Abre un issue en el repositorio o contacta al equipo de desarrollo.
