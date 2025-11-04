import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: () => {
      const authStore = useAuthStore()
      return authStore.isAuthenticated ? '/cars' : '/login'
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () => import('@/views/auth/SignupView.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/cars',
    name: 'Cars',
    component: () => import('@/views/cars/CarsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/cars/new',
    name: 'NewCar',
    component: () => import('@/views/cars/NewCarView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/cars/:plate',
    name: 'CarDetail',
    component: () => import('@/views/cars/CarDetailView.vue'),
    meta: { requiresAuth: true },
    props: true,
  },
  {
    path: '/assignments',
    name: 'Assignments',
    component: () => import('@/views/assignments/AssignmentsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/assignments/new',
    name: 'NewAssignment',
    component: () => import('@/views/assignments/NewAssignmentView.vue'),
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guard para proteger rutas
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.meta.requiresAuth

  if (requiresAuth && !authStore.isAuthenticated) {
    // Si la ruta requiere autenticación y el usuario no está autenticado,
    // redirigir a login
    next('/login')
  } else if (!requiresAuth && authStore.isAuthenticated && (to.path === '/login' || to.path === '/signup')) {
    // Si el usuario ya está autenticado y trata de ir a login/signup,
    // redirigir a cars
    next('/cars')
  } else {
    // Permitir navegación
    next()
  }
})

export default router
