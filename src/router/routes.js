export default [
  {
    path: '',
    name: 'skriptag-homepage',
    meta: {
      keepAlive: true,
    },
    component: () => import(/* webpackChunkName: 'homepage' */ '@/views/home'),
  },

  {
    path: 'logout',
    name: 'logout',
  },

  {
    path: 'login',
    name: 'skriptag-login',
    meta: {
      keepAlive: true,
    },
    component: () => import(/* webpackChunkName: 'login-page' */ '@/views/login'),
  },

  {
    path: 'signup',
    name: 'skriptag-signup',
    meta: {
      keepAlive: true,
    },
    component: () => import(/* webpackChunkName: 'signup-page' */ '@/views/signup'),
  },

  {
    path: 'accountMgmt',
    name: 'skriptag-accountMgmt',
    component: () => import(/* webpackChunkName: 'account-mgmt' */ '@/views/account-mgmt'),
  },

  {
    path: 'privacy',
    name: 'skriptag-rivacy',
    meta: {
      keepAlive: true,
    },
    component: () => import(/* webpackChunkName: 'legal-privacy' */ '@/views/legal/Privacy'),
  },

  {
    path: 'profile',
    name: 'skriptag-profile',
    meta: {
      requiresAuth: true,
      keepAlive: true,
    },
    redirect: { name: 'skriptag-settings' },
    component: () => import(/* webpackChunkName: 'profile-page' */ '@/views/profile'),

    children: [
      {
        path: 'admin',
        name: 'skriptag-admin',
        meta: {
          title: 'Skriptag Edit',
          requiresAuth: true,
        },
        redirect: { name: 'users' },
        component: () => import(/* webpackChunkName: 'profile-skriptag-admin' */ '@/views/profile/Skriptag-edit'),

        children: [
          {
            path: 'users',
            name: 'skriptag-users',
            meta: {
              title: 'Users',
              requiresAuth: true,
            },
            component: () => import(/* webpackChunkName: 'profile-skriptag-admin-users' */ '@/views/profile/users/users.vue'),
          },

          {
            path: 'roles',
            name: 'skriptag-roles',
            meta: {
              title: 'Roles',
              requiresAuth: true,
            },
            component: () => import(/* webpackChunkName: 'profile-skriptag-admin-roles' */ '@/views/profile/roles/roles.vue'),
          },

          {
            path: 'capabilities',
            name: 'skriptag-capabilities',
            meta: {
              title: 'Capabilities',
              requiresAuth: true,
            },
            component: () =>
              import(
                /* webpackChunkName: 'profile-skriptag-admin-capabilities' */ '@/views/profile/capabilities/capabilities.vue'
              ),
          },
        ],
      },
      {
        path: 'public',
        name: 'skriptag-public',
        meta: {
          title: 'Basic Profile Information',
          requiresAuth: true,
          keepAlive: true,
        },

        component: () => import(/* webpackChunkName: 'profile-public-edit' */ '@/views/profile/Profile-edit'),
      },
      {
        path: 'account',
        name: 'skriptag-account',
        meta: {
          title: 'Account Details',
          requiresAuth: true,
          keepAlive: true,
        },
        component: () => import(/* webpackChunkName: 'profile-account-edit' */ '@/views/profile/Account-edit'),
      },
      {
        path: 'settings',
        name: 'skriptag-settings',
        meta: {
          requiresAuth: true,
          keepAlive: true,
        },
        component: () => import(/* webpackChunkName: 'profile-settings-cards' */ '@/views/profile/Profile-cards'),
      },
    ],
  },
];
