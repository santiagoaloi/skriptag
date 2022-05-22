<template>
  <v-app class="no-select no-drag">
    <default-app-bar />
    <default-drawer v-if="$vuetify.breakpoint.mdAndUp" />
    <default-view :style="$vuetify.breakpoint.mdAndUp ? 'margin-left: 50px;margin-top: 44px' : 'margin-top: 44px'" />
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
