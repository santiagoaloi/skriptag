import Vue from 'vue';
import Router from 'vue-router';
import { getUserState } from '@/firebase/firebase';

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default'),
    children: [
      {
        path: '',
        name: 'Default',
        component: () => import(/* webpackChunkName: 'homepage' */ '@/views/home'),
      },
      {
        path: '/Deny',
        name: 'deny',
        component: () => import(/* webpackChunkName: 'unauthorized' */ '@/views/deny'),
      },

      {
        path: '/Login',
        name: 'login',

        component: () => import(/* webpackChunkName: 'login-page' */ '@/views/login'),
      },
      {
        path: '/Signup',
        name: 'signup',

        component: () => import(/* webpackChunkName: 'signup-page' */ '@/views/signup'),
      },

      {
        path: '/Profile',
        name: 'profile',
        meta: {
          requiresAuth: true,
        },
        component: () => import(/* webpackChunkName: 'profile-page' */ '@/views/profile'),
      },
      {
        path: '/:catchAll(.*)*',
        name: 'Notfound',
        component: () => import(/* webpackChunkName: '404-page' */ '@/views/four'),
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
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const isAuth = await getUserState();

  // If the route requires the user to be authenticated and it is not,
  // Show the unauthorized view.
  if (requiresAuth && !isAuth) {
    next('/deny');
    return;
  }
  // Unprotected routes are all routable.
  next();
});

export default router;
