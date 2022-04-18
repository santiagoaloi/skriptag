export default [
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
    path: '/AccountMgmt',
    name: 'accountMgmt',

    component: () => import(/* webpackChunkName: 'account-mgmt' */ '@/views/account-mgmt'),
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
];
