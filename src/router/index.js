import Vue from 'vue';
import Router from 'vue-router';
import { store } from '@/store';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior: (to, _, savedPosition) => {
    if (to.hash) return { selector: to.hash };
    if (savedPosition) return savedPosition;

    return { x: 0, y: 0 };
  },
  routes: [
    {
      path: '/',
      // Layouts allow you to define different
      // structures for different view
      // https://router.vuejs.org/guide/essentials/nested-routes.html#nested-routes
      component: () => import('@/layouts/default'),
      children: [
        {
          path: '',
          name: 'Default',
          component: () => import('@/views/home'),
        },
        {
          path: '/Profile',
          name: 'Profile',
          meta: {
            requiresAuth: true,
          },
          component: () => import('@/views/profile'),
        },
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = store.get('authentication/isLoggedIn');
  if (to.matched.some((record) => record.meta.requiresAuth) && !isLoggedIn) {
    next('/');
  }
  next();
});

export default router;
