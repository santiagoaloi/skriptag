<template>
  <v-footer app dark padless>
    <v-card class="flex py-2 pl-3" flat tile>
      <v-card-actions style="font-size: 13px" class="pa-0 px-5">
        <div style="width: 120px; font-size: 8px">
          <skriptag-title small>
            <template #text> © {{ new Date().getFullYear() }} </template>
          </skriptag-title>
        </div>

        <a @click="routeTo('skriptag-privacy')">Privacy Statement</a>
        <div class="px-2">·</div>
        <a>Terms of Service</a>
        <div class="px-2">·</div>
        <a>Sitemap</a>

        <v-spacer></v-spacer>

        <base-button small>English (US)</base-button>
        <base-button small>Support and Resources</base-button>
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

    methods: {
      routeTo(route) {
        this.$router.push({ name: route });
      },
    },
  };
</script>
<style>
  .border-right {
    border-right: solid 1px #444c56 !important;
  }
</style>
