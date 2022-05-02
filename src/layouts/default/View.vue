<template>
  <v-main id="containerDiv">
    <v-expand-transition
      >H
      <MobileMenuView v-if="mobileMenu && $vuetify.breakpoint.smAndDown" />
    </v-expand-transition>

    <v-fade-transition hide-on-leave mode="out-in">
      <router-view v-if="!mobileMenu || !$vuetify.breakpoint.smAndDown"></router-view>
    </v-fade-transition>
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
  };
</script>
