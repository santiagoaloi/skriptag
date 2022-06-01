<template>
  <v-main tag="main">
    <keep-alive>
      <router-view v-show="!mobileMenu || !$vuetify.breakpoint.smAndDown"></router-view>
    </keep-alive>
  </v-main>
  <!-- <MobileMenuView v-show="mobileMenu && $vuetify.breakpoint.smAndDown" /> -->
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
        immediate: false,
        handler(newValue) {
          if (newValue) {
            this.mobileMenu = false;
          }
        },
      },
    },
  };
</script>
