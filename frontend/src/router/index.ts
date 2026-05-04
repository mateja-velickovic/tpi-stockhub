import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/',
      component: () => import('@/components/layout/AppLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'Dashboard',
          component: () => import('@/views/DashboardView.vue'),
        },
        {
          path: 'products',
          name: 'Products',
          component: () => import('@/views/ProductsView.vue'),
        },
        {
          path: 'categories',
          name: 'Categories',
          component: () => import('@/views/CategoriesView.vue'),
        },
        {
          path: 'stock-movements',
          name: 'StockMovements',
          component: () => import('@/views/StockMovementsView.vue'),
        },
      ],
    },
  ],
});

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token');
  if (to.meta.requiresAuth && !token) {
    next('/login');
  } else if (to.path === '/login' && token) {
    next('/');
  } else {
    next();
  }
});

export default router;
