<template>
  <v-app>
    <default-bar />
    <default-drawer v-if="$route.meta.requiresAuth" />
    <default-view />
    <route-loader />
    <base-back-to-top></base-back-to-top>
    <base-snackbar />
  </v-app>
</template>
<script>
  export default {
    name: 'DefaultLayout',
    components: {
      DefaultBar: () => import(/* webpackChunkName:  'default-layout'  */ './AppBar'),
      DefaultDrawer: () => import(/* webpackChunkName:  'default-layout'  */ './Drawer'),
      DefaultView: () => import(/* webpackChunkName:  'default-view'  */ './View'),
      RouteLoader: () => import(/* webpackChunkName:  'route-layout'  */ './Loader'),
    },
  };
</script>
