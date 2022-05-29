<template>
  <v-app class="no-select no-drag">
    <default-app-bar />
    <!-- <default-drawer v-if="$vuetify.breakpoint.mdAndUp" /> -->
    <default-view />
    <base-snackbar v-if="isActive" />
  </v-app>
</template>

<script>
  import { get } from 'vuex-pathify';

  export default {
    name: 'DefaultLayout',

    components: {
      // DefaultDrawer: () => import(/* webpackChunkName: 'drawer' */ './Drawer'),
      DefaultAppBar: () => import(/* webpackChunkName: 'appbar' */ './AppBar'),
      DefaultView: () => import(/* webpackChunkName: 'router-view' */ './View'),
    },

    computed: {
      ...get('snackbar', ['isActive']),
    },
  };
</script>
