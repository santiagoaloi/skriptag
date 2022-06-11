export default [
  {
    path: '',
    name: '/',
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
          title: 'Skriptag Edit',
        },
        redirect: { name: 'skriptag-edit-users' },
        component: () => import(/* webpackChunkName: 'profile-skriptag-edit' */ '@/views/profile/Skriptag-edit'),

        children: [
          {
            path: 'users',
            name: 'skriptag-edit-users',
            meta: {
              requiresAuth: true,
              title: 'Users',
            },
            component: () => import(/* webpackChunkName: 'profile-skriptag-edit-users' */ '@/views/profile/users/users.vue'),
          },

          {
            path: 'roles',
            name: 'skriptag-edit-roles',
            meta: {
              requiresAuth: true,
              title: 'Roles',
            },
            component: () => import(/* webpackChunkName: 'profile-skriptag-edit-roles' */ '@/views/profile/roles/roles.vue'),
          },

          {
            path: 'capabilities',
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
          title: 'Basic Profile Information',
        },

        component: () => import(/* webpackChunkName: 'profile-profile-edit' */ '@/views/profile/Profile-edit'),
      },
      {
        path: '/Profile/account-edit',
        name: 'account-edit',
        meta: {
          requiresAuth: true,
          title: 'Account Details',
        },

        component: () => import(/* webpackChunkName: 'profile-account-edit' */ '@/views/profile/Account-edit'),
      },
    ],
  },

  {
    path: '/:catchAll(.*)*',
    name: '404',
    component: () => import(/* webpackChunkName: 'home-page' */ '@/views/home'),
  },
];
