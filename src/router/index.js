import Vue from 'vue';
import Router from 'vue-router';
import { isEmpty } from 'lodash';
import { auth } from '@/firebase/firebase';

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default'),
    children: [
      {
        path: '',
        name: 'Default',
        component: () => import('@/views/home'),
      },
      {
        path: '/Deny',
        name: 'Deny',
        component: () => import('@/views/deny'),
      },
      {
        path: '/Profile',
        name: 'profile',
        meta: {
          requiresAuth: true,
        },
        component: () => import('@/views/profile'),
      },
    ],
  },
];

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  linkActiveClass: 'active',
  routes,
  scrollBehavior: (to, _, savedPosition) => {
    if (to.hash) return { selector: to.hash };
    if (savedPosition) return savedPosition;
    return { x: 0, y: 0 };
  },
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth && isEmpty(auth.currentUser))) {
    next('/deny');
    return;
  }
  next();
});

export default router;
