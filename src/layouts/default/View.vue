<template>
  <v-main>
    <div id="containerDiv" :style="custommHeight" style="background: #24272c">
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
          'overflow-y': 'overlay',
          'overflow-x': 'hidden',
          'background': '#24272c',
          'height': this.$vuetify.breakpoint.smAndDown ? null : 'calc(100vh - 60px)',
        };
      },
    },
  };
</script>
