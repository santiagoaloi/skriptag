<template>
  <v-footer app dark padless>
    <v-card class="flex py-2 px-4 blue-grey darken-3" flat tile>
      <v-card-actions class="pa-0 px-5">
        <div>© 2022 Skriptag, Inc.</div>
        <div class="px-2">·</div>
        <a>Privacy</a>
        <div class="px-2">·</div>
        <a>Terms</a>
        <div class="px-2">·</div>
        <a>Sitemap</a>

        <v-spacer></v-spacer>

        <base-button>English (US)</base-button>
        <base-button>Support and Resources</base-button>
      </v-card-actions>
    </v-card>
  </v-footer>
</template>
<script>
  import { get, sync } from 'vuex-pathify';
  import baseButton from '@/components/base/baseButton.vue';

  export default {
    name: 'DefaultFooter',
    components: { baseButton },
    data() {
      return {};
    },

    computed: {
      ...get('authentication', ['isLoggedIn', 'profile']),
      ...sync('app', ['drawer']),
    },
  };
</script>
<style>
  .border-right {
    border-right: solid 1px #444c56 !important;
  }
</style>
