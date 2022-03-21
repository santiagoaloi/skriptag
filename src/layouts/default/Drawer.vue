<template>
  <div>
    <vs-sidebar
      v-model="route"
      reduce
      open
      square
    >
      <vs-sidebar-item
        id="/"
        class="mt-14"
      >
        <template #icon>
          <v-icon dark>
            mdi-home-outline
          </v-icon>
        </template>
        Home
      </vs-sidebar-item>
      <vs-sidebar-item id="market">
        <template #icon>
          <v-icon dark>
            mdi-cart-outline
          </v-icon>
        </template>
        Market Overview
      </vs-sidebar-item>
      <vs-sidebar-item id="Music">
        <template #icon>
          <v-icon dark>
            mdi-music-circle-outline
          </v-icon>
        </template>
        Music
      </vs-sidebar-item>
      <vs-sidebar-group>
        <template #header>
          <vs-sidebar-item arrow>
            <template #icon>
              <v-icon dark>
                mdi-account-multiple-outline
              </v-icon>
            </template>
            Social media
          </vs-sidebar-item>
        </template>

        <vs-sidebar-item id="Instagram">
          <template #icon>
            <v-icon dark>
              mdi-instagram
            </v-icon>
          </template>
          Instagram
        </vs-sidebar-item>
        <vs-sidebar-item id="twitter">
          <template #icon>
            <v-icon dark>
              mdi-twitter
            </v-icon>
          </template>
          Twitter
        </vs-sidebar-item>
        <vs-sidebar-item id="Facebook">
          <template #icon>
            <v-icon dark>
              mdi-facebook
            </v-icon>
          </template>
          Facebook
        </vs-sidebar-item>
      </vs-sidebar-group>

      <template #footer>
        <vs-row justify="space-between">
          <vs-avatar
            class="pa-1"
            badge-color="#91fcdc"
            badge-position="top-right"
          >
            <v-icon dark>
              mdi-bell-outline
            </v-icon>
            <template #badge>
              28
            </template>
          </vs-avatar>

          <vs-avatar class="pa-1">
            <img
              src="https://i.pravatar.cc/300"
              alt=""
            >
          </vs-avatar>
        </vs-row>
      </template>
    </vs-sidebar>
  </div>
</template>

<script>
// Utilities
  import { sync } from 'vuex-pathify'

  export default {
    name: 'DefaultDrawer',
    data() {
      return {
        route: "/",
      }
    },
    computed: { drawer: sync('app/drawer') },
  }
</script>
