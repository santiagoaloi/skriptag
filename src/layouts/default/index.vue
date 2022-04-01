<template>
  <v-app class="no-select no-drag">
    <default-app-bar />
    <default-drawer />
    <default-view />
    <base-snackbar />
  </v-app>
</template>

<script>
  export default {
    name: 'DefaultLayout',

    components: {
      DefaultAppBar: () => import(/* webpackChunkName: 'appbar' */ './AppBar'),
      DefaultDrawer: () => import(/* webpackChunkName: 'drawer' */ './Drawer'),
      DefaultView: () => import(/* webpackChunkName: 'router-view' */ './View'),
    },
  };
</script>
