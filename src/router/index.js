import Vue from 'vue';
import Router from 'vue-router';
import { doc, onSnapshot } from 'firebase/firestore';
import { getUserState, myFS } from '@/firebase/firebase';

import { store } from '@/store';

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default'),
    children: [
      {
        path: '',
        name: 'Default',
        component: () => import(/* webpackChunkName: 'home-page' */ '@/views/home'),
      },
      {
        path: '/Deny',
        name: 'deny',
        component: () => import(/* webpackChunkName: 'unauthorized-page' */ '@/views/deny'),
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
  routes,
});

// Router guards to deny access to protected routes.
router.beforeEach(async (to, from, next) => {
  // wait for firebase init before route guards can be applied.
  // if a user is authenticated , the user object will be returned in isAuth.
  const isAuth = await getUserState();

  // user unique ID.
  const uuid = isAuth?.uid;

  if (isAuth) {
    const PROFILE_COLLECTION = 'users'; // name of the FS collection of user profile docs
    const docRef = doc(myFS, PROFILE_COLLECTION, uuid);
    onSnapshot(docRef, (docSnap) => {
      const profileData = docSnap.data();
      store.set('authentication/profile', profileData);
    });
  }

  const isLoginPageAndAuthenticated = to.matched.some((record) => record.name === 'login' && isAuth);
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  // If the route requires the user to be authenticated and it is not,
  // route to the unauthorized view.
  if (requiresAuth && !isAuth) {
    next('/deny');
    return;
  }

  // If the user navigates to the login page and it's already authenticated,
  // route to the profile page instead.
  if (isLoginPageAndAuthenticated) {
    next('/profile');
    return;
  }
  // Unprotected routes are all routable.
  next();
});

export default router;
