<template>
  <v-main>
    <div id="containerDiv" :style="custommHeight">
      <v-expand-transition>
        <MobileMenuView v-if="mobileMenu" />
      </v-expand-transition>
      <v-fade-transition hide-on-leave mode="out-in">
        <Router-view v-if="!mobileMenu" />
      </v-fade-transition>
    </div>
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
          'overflow-y': 'overlay',
          'overflow-x': 'hidden',
          'height': this.$vuetify.breakpoint.smAndDown ? '' : 'calc(100vh - 60px)',
        };
      },
    },
  };
</script>
