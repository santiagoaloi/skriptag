import { store } from '@/store';

export default [
  {
    path: '',
    name: 'Default',
    component: () => import(/* webpackChunkName: 'home-page' */ '@/views/home'),
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
    children: [
      {
        path: '/Profile/skriptag-edit',
        name: 'skriptag-edit',
        meta: {
          requiresAuth: true,
          title: 'skriptag edit',
        },
        component: () => import(/* webpackChunkName: 'profile-skriptag-edit' */ '@/views/profile/Skriptag-edit'),

        async beforeEnter(_to, _from, next) {
          setTimeout(() => {
            const isRoot = store.getters['authentication/isRoot'];
            if (!isRoot) {
              next('/profile');
            }
            next();
          }, 400);
        },
      },
      {
        path: '/Profile/profile-edit',
        name: 'profile-edit',
        meta: {
          requiresAuth: true,
          title: 'profile edit',
        },

        component: () => import(/* webpackChunkName: 'profile-profile-edit' */ '@/views/profile/Profile-edit'),
      },
      {
        path: '/Profile/account-edit',
        name: 'account-edit',
        meta: {
          requiresAuth: true,
          title: 'account edit',
        },

        component: () => import(/* webpackChunkName: 'profile-account-edit' */ '@/views/profile/Account-edit'),
      },
    ],
  },

  {
    path: '/:catchAll(.*)*',
    name: '404',
    component: () => import(/* webpackChunkName: '404-page' */ '@/views/four'),
  },
];
