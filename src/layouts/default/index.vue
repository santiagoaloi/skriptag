<template>
  <v-app>
    <app-bar />

    <app-drawer v-if="$route.meta.requiresAuth" />

    <v-main class="bgs">
      <v-fade-transition :duration="130" mode="out-in">
        <keep-alive>
          <router-view />
        </keep-alive>
      </v-fade-transition>
    </v-main>

    <route-loader />

    <base-back-to-top></base-back-to-top>

    <base-snackbar />
  </v-app>
</template>
<script>
  export default {
    name: 'DefaultLayout',
    components: {
      AppBar: () => import(/* webpackChunkName:  'default-layout'  */ './AppBar'),
      AppDrawer: () => import(/* webpackChunkName:  'default-layout'  */ './Drawer'),
      RouteLoader: () => import(/* webpackChunkName:  'default-layout'  */ './Loader'),
    },
  };
</script>
