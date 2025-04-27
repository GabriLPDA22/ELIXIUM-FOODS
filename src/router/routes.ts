// src/router/routes.ts
import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/restaurants',
    name: 'restaurants',
    component: () => import('@/views/RestaurantList.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/restaurant/:id',
    redirect: to => ({ path: `/restaurants/${to.params.id}` })
  },
  {
    path: '/restaurants/:id',
    name: 'restaurant-detail',
    component: () => import('@/views/RestaurantDetail.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/profile',
    name: 'user-profile',
    component: () => import('@/views/UserProfile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
    meta: { guest: true }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/Register.vue'),
    meta: { guest: true }
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('@/views/ForgotPassword.vue'),
    meta: { guest: true }
  }
]

export default routes