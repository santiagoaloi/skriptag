import Vue from 'vue';
import Router from 'vue-router';
import { getUserState } from '@/firebase/firebase';
import allRoutes from './routes';
import { store } from '@/store';

const routes = [
  {
    path: '',
    component: () => import(/* webpackChunkName: 'layout-bundle' */ '@/layouts/default'),
    children: [...allRoutes],
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
  const isLogoutRoute = to.matched.some((record) => record.name === 'logout');
  const isLoginPageAndAuthenticated = to.matched.some((record) => record.name === 'login' && isAuth);
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  // If the user navigates to the login page and it's already authenticated,
  // route to the profile page instead.
  if (isLoginPageAndAuthenticated) {
    next('/profile');
    return;
  }

  // If the route requires the user to be authenticated and it is not,
  // route to the login page.
  if (requiresAuth && !isAuth) {
    next({ name: 'login' });
    return;
  }

  if (isLogoutRoute) {
    store.dispatch('authentication/logout');
    return;
  }

  next();
});

export default router;
