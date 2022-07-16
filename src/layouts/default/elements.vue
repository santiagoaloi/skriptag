<template>
  <v-app class="no-select no-drag pattern-bg">
    <default-app-bar />
    <default-drawer v-if="$vuetify.breakpoint.mdAndUp && $route.meta.requiresAuth" />
    <default-view />
    <default-footer v-if="$vuetify.breakpoint.mdAndUp" />
    <base-snackbar v-if="isActive" />
  </v-app>
</template>

<script>
  import { get } from 'vuex-pathify';

  export default {
    name: 'DefaultLayoutElements',

    components: {
      DefaultDrawer: () => import(/* webpackChunkName: 'layout-bundle' */ './Drawer'),
      DefaultAppBar: () => import(/* webpackChunkName:'layout-bundle' */ './AppBar'),
      DefaultView: () => import(/* webpackChunkName: 'layout-bundle'  */ './View'),
      DefaultFooter: () => import(/* webpackChunkName: 'layout-bundle'  */ './Footer'),
    },

    computed: {
      ...get('snackbar', ['isActive']),
    },
  };
</script>
