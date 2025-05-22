import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/restaurants',
    name: 'restaurants',
    component: () => import('@/views/RestaurantList.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/restaurant/:id',
    redirect: (to) => ({ path: `/restaurants/${to.params.id}` }),
  },
  {
    path: '/restaurants/:id',
    name: 'restaurant-detail',
    component: () => import('@/views/RestaurantDetail.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('@/views/Cart.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: () => import('@/views/Checkout.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/orders',
    name: 'orders',
    component: () => import('@/views/Orders.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/orders/:id',
    name: 'order-detail',
    component: () => import('@/views/OrderDetail.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutUs.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/special-offers',
    name: 'offers',
    component: () => import('@/views/Offers.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/profile',
    name: 'user-profile',
    component: () => import('@/views/UserProfile.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
    meta: { guest: true },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/Register.vue'),
    meta: { guest: true },
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('@/views/ForgotPassword.vue'),
    meta: { guest: true },
  },
  {
    path: '/unauthorized',
    name: 'unauthorized',
    component: () => import('@/views/Unauthorized.vue'),
  },
  {
    path: '/admin',
    name: 'admin-panel',
    component: () => import('@/views/AdminPanel.vue'),
    meta: {
      requiresAuth: true,
      requiresRole: ['Admin']
    }
  },
  {
    path: '/business/dashboard',
    component: () => import('@/views/BusinessDashboard.vue'),
        children: [
      {
        path: '',
        name: 'business-dashboard',
        component: () => import('@/views/BusinessHome.vue')
      },
      {
        path: 'products',
        name: 'business-products',
        component: () => import('@/views/BusinessProducts.vue')
      },
      {
        path: 'orders',
        name: 'business-orders',
        component: () => import('@/views/BusinessOrders.vue')
      },
      {
        path: 'promotions',
        name: 'business-promotions',
        component: () => import('@/views/BusinessPromotions.vue')
      },
      {
        path: 'analytics',
        name: 'business-analytics',
        component: () => import('@/views/BusinessAnalytics.vue')
      },
      {
        path: 'settings',
        name: 'business-settings',
        component: () => import('@/views/BusinessSettings.vue')
      }
    ]
  },
  {
    path: '/business/unauthorized',
    name: 'business-unauthorized',
    component: () => import('@/views/BusinessUnauthorized.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFound.vue'),
  },
]

export default routes
