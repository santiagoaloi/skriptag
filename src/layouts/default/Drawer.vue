<template>
  <v-fade-transition>
    <vs-sidebar v-show="showSidebar" v-model="route" reduce open square>
      <vs-sidebar-item id="/" class="mt-14">
        <template #icon>
          <v-icon dark> mdi-home-outline </v-icon>
        </template>
        Home
      </vs-sidebar-item>
      <vs-sidebar-item id="market">
        <template #icon>
          <v-icon dark> mdi-cart-outline </v-icon>
        </template>
        Market Overview
      </vs-sidebar-item>
      <vs-sidebar-item id="Music">
        <template #icon>
          <v-icon dark> mdi-music-circle-outline </v-icon>
        </template>
        Music
      </vs-sidebar-item>
      <vs-sidebar-group>
        <template #header>
          <vs-sidebar-item arrow>
            <template #icon>
              <v-icon dark> mdi-account-multiple-outline </v-icon>
            </template>
            Social media
          </vs-sidebar-item>
        </template>

        <vs-sidebar-item id="Instagram">
          <template #icon>
            <v-icon dark> mdi-instagram </v-icon>
          </template>
          Instagram
        </vs-sidebar-item>
        <vs-sidebar-item id="twitter">
          <template #icon>
            <v-icon dark> mdi-twitter </v-icon>
          </template>
          Twitter
        </vs-sidebar-item>
        <vs-sidebar-item id="Facebook">
          <template #icon>
            <v-icon dark> mdi-facebook </v-icon>
          </template>
          Facebook
        </vs-sidebar-item>
      </vs-sidebar-group>

      <template #footer>
        <v-scale-transition>
          <vs-row v-if="isLoggedIn" justify="space-between">
            <vs-avatar class="pa-1 cursor-pointer" badge-color="#91fcdc" badge-position="top-right">
              <v-icon dark> mdi-bell-outline </v-icon>
              <template #badge> 28 </template>
            </vs-avatar>

            <vs-avatar class="pa-1 cursor-pointer">
              <img src="https://i.pravatar.cc/300" alt="" />
            </vs-avatar>
          </vs-row>
        </v-scale-transition>
      </template>
    </vs-sidebar>
  </v-fade-transition>
</template>

<script>
  import { call, get } from 'vuex-pathify';

  export default {
    name: 'DefaultDrawer',
    data() {
      return {
        route: '/',
        showSidebar: false,
      };
    },

    computed: {
      ...get('authentication', ['isLoggedIn']),
    },

    mounted() {
      this.delayRender(400);
    },

    methods: {
      ...call('app', ['sleep']),

      async delayRender(ms) {
        await this.sleep(ms);
        this.showSidebar = true;
      },
    },
  };
</script>
