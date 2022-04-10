<template>
  <v-app class="no-select no-drag">
    <default-drawer />
    <default-app-bar />
    <default-view />
    <base-snackbar />
  </v-app>
</template>

<script>
  export default {
    name: 'DefaultLayout',

    components: {
      DefaultDrawer: () => import(/* webpackChunkName: 'drawer' */ './Drawer'),
      DefaultAppBar: () => import(/* webpackChunkName: 'appbar' */ './AppBar'),
      DefaultView: () => import(/* webpackChunkName: 'router-view' */ './View'),
    },
  };
</script>
