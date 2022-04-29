<template>
  <v-main id="containerDiv" :style="custommHeight">
    <v-expand-transition>
      <MobileMenuView v-if="mobileMenu" />
    </v-expand-transition>

    <v-fade-transition hide-on-leave mode="out-in">
      <router-view v-if="!mobileMenu"></router-view>
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

      custommHeight() {
        return {
          'background': ' #24272c',
          'overflow-x': 'hidden',
        };
      },
    },
  };
</script>
