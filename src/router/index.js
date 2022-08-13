import Vue from 'vue';
import Router from 'vue-router';
import { getUserState } from '@/firebase/firebase';
import allRoutes from './routes';
import { store } from '@/store';

const routes = [
  {
    path: '/',
    name: '/',
    redirect: { name: 'skriptag-homepage' },
    component: () => import(/* webpackChunkName: 'default-layout' */ '@/layouts/default'),
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
  const isLogoutRoute = to.matched.some((n) => n.name === 'logout');
  const isLoginPageAndAuthenticated = to.matched.some((n) => n.name === 'skriptag-login' && isAuth);
  const requiresAuth = to.matched.some((m) => m.meta.requiresAuth);
  const isFromPublicToPrivate = !from.meta.requiresAuth && to.meta.requiresAuth;
  const isFromPrivateToPublic = from.meta.requiresAuth && !to.meta.requiresAuth;

  // If the route requires the user to be authenticated and it is not,
  // route to the login page.
  if (requiresAuth && !isAuth) {
    next({ name: 'skriptag-login' });
    return;
  }

  // If the user navigates to the login page and it's already authenticated,
  // route to the profile page instead.
  if (isLoginPageAndAuthenticated) {
    next({ name: 'user-profile' });
    return;
  }

  if (isFromPublicToPrivate || isFromPrivateToPublic) {
    store.set('loaders/routeLoader', true);
  }

  if (isLogoutRoute) {
    store.dispatch('authentication/logout');
    return;
  }

  next();
});

router.afterEach(async () => {
  if (store.state.loaders.routeLoader) {
    setTimeout(() => {
      store.set('loaders/routeLoader', false);
    }, 1500);
  }
});

export default router;
