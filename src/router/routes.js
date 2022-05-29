import { store } from '@/store';

export default [
  {
    path: '',
    name: 'Default',
    component: () => import(/* webpackChunkName: 'home-page' */ '@/views/home'),
  },

  {
    path: '/logout',
    name: 'logout',
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
              return;
            }
            next();
          }, 400);
        },
        children: [
          {
            path: '/Profile/skriptag-edit/users',
            name: 'skriptag-edit-users',
            meta: {
              requiresAuth: true,
              title: 'Users',
            },
            component: () => import(/* webpackChunkName: 'profile-skriptag-edit-users' */ '@/views/profile/users/users.vue'),
          },

          {
            path: '/Profile/skriptag-edit/roles',
            name: 'skriptag-edit-roles',
            meta: {
              requiresAuth: true,
              title: 'Roles',
            },
            component: () => import(/* webpackChunkName: 'profile-skriptag-edit-roles' */ '@/views/profile/roles/roles.vue'),
          },

          {
            path: '/Profile/skriptag-edit/capabilities',
            name: 'skriptag-edit-capabilities',
            meta: {
              requiresAuth: true,
              title: 'Capabilities',
            },
            component: () =>
              import(
                /* webpackChunkName: 'profile-skriptag-edit-capabilities' */ '@/views/profile/capabilities/capabilities.vue'
              ),
          },
        ],
      },
      {
        path: '/Profile/profile-edit',
        name: 'profile-edit',
        meta: {
          requiresAuth: true,
          title: 'basic profile information',
        },

        component: () => import(/* webpackChunkName: 'profile-profile-edit' */ '@/views/profile/Profile-edit'),
      },
      {
        path: '/Profile/account-edit',
        name: 'account-edit',
        meta: {
          requiresAuth: true,
          title: 'account details',
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
