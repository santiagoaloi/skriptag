<template>
  <v-main>
    <MobileMenuView v-if="mobileMenu && $vuetify.breakpoint.smAndDown" />
    <keep-alive>
      <router-view v-if="!mobileMenu || !$vuetify.breakpoint.smAndDown" :key="$route.fullPath"></router-view>
    </keep-alive>
  </v-main>
</template>

<script>
  import { sync } from 'vuex-pathify';
  import MobileMenuView from './mobileMenu.vue';

  export default {
    name: 'DefaultView',

    components: {
      MobileMenuView,
    },
    computed: {
      ...sync('app', ['mobileMenu']),
    },

    watch: {
      '$vuetify.breakpoint.mdAndUp': {
        immediate: true,
        deep: true,
        handler(newValue) {
          if (newValue) {
            this.mobileMenu = false;
          }
        },
      },
    },
  };
</script>
