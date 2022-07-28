<template>
  <v-main class="bgs">
    <keep-alive>
      <router-view v-show="!mobileMenu"></router-view>
    </keep-alive>
    <v-fade-transition hide-on-leave>
      <MobileMenuView v-show="mobileMenu && $vuetify.breakpoint.smAndDown" />
    </v-fade-transition>
  </v-main>
</template>

<script>
  import { sync } from 'vuex-pathify';
  import MobileMenuView from './MobileMenu.vue';

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
