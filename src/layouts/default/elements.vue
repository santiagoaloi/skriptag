<template>
  <v-app class="no-select no-drag pattern-bg">
    <default-app-bar />
    <default-drawer v-if="$vuetify.breakpoint.mdAndUp" />

    <default-view />
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
    },

    computed: {
      ...get('snackbar', ['isActive']),
    },
  };
</script>
