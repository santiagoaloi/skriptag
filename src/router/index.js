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
        name: '404',
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

// Router guards.

router.beforeEach(async (to, from, next) => {
  const isAuth = await getUserState();
  const isLoginPageAndAuthenticated = to.matched.some((record) => record.name === 'login' && isAuth);
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  // If the route requires the user to be authenticated and it is not,
  // Show the unauthorized view.
  if (requiresAuth && !isAuth) {
    next('/deny');
    return;
  }

  // If the user navigates to the login page and it's already authenticated
  // route to the profile page.
  if (isLoginPageAndAuthenticated) {
    next('/profile');
    return;
  }
  // Unprotected routes are all routable.
  next();
});

export default router;
