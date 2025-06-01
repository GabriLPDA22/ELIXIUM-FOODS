import { RouteRecordRaw } from 'vue-router'; // Asegúrate de que createRouter y createWebHistory estén importados en tu main.ts o archivo de router principal

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
    path: '/search',
    name: 'search',
    component: () => import('@/views/SearchResults.vue'),
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
    path: '/reset-password',
    name: 'reset-password',
    component: () => import('@/views/ResetPassword.vue'),
    meta: { guest: true },
  },
  {
    path: '/terms-and-conditions',
    name: 'terms-and-conditions',
    component: () => import('@/views/TermsAndConditions.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/privacy-policy',
    name: 'privacy-policy',
    component: () => import('@/views/PrivacyPolicy.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/for-business',
    name: 'for-business',
    component: () => import('@/views/ForBusiness.vue'),
    meta: {
      requiresAuth: false,
      // hideHeaderFooter: true,
    }
  },
    // --- NUEVAS RUTAS DEL BLOG ---
  {
    path: '/blog',
    name: 'blog',
    component: () => import('@/views/BlogPage.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/blog/:slug',
    name: 'blog-post-detail',
    component: () => import('@/views/BlogPostDetailPage.vue'),
    meta: { requiresAuth: false },
    props: true
  },
   {
    path: '/centro-de-ayuda',
    name: 'help-center',
    component: () => import('@/views/HelpCenterPage.vue'),
    meta: { requiresAuth: false }
  },
    {
    path: '/empleos',
    name: 'careers',
    component: () => import('@/views/CareersPage.vue'),
    meta: { requiresAuth: false }
  },
    {
    path: '/faq',
    name: 'faq',
    component: () => import('@/views/FaqPage.vue'),
    meta: { requiresAuth: false }
  },
    {
    path: '/politica-de-cookies',
    name: 'cookie-policy',
    component: () => import('@/views/CookiePolicyPage.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/business-register',
    name: 'business-register',
    component: () => import('@/views/BusinessRegisterForm.vue'),
    meta: {
      requiresAuth: false,
      // hideHeaderFooter: true,
    }
  },
  {
    path: '/contact', // Ruta para la página de contacto
    name: 'contact',
    component: () => import('@/views/ContactPage.vue'),
    meta: { requiresAuth: false }
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
      requiresRole: ['Admin'],
      hideHeaderFooter: true,
    }
  },
  {
    path: '/business/dashboard',
    component: () => import('@/views/BusinessDashboard.vue'),
    meta: {
      requiresAuth: true,
      roles: ['Business', 'Admin'],
      hideHeaderFooter: true,
    },
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
    meta: {
        hideHeaderFooter: true,
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFound.vue'),
  },
];

export default routes;
