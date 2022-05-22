<template>
  <vs-sidebar v-show="showSidebar" v-model="route" reduce open square>
    <vs-sidebar-item id="/" to="/" class="mt-14">
      <template #icon>
        <div>
          <v-icon class="mt-n2" dark> mdi-home-outline </v-icon>
        </div>
      </template>
      Home
    </vs-sidebar-item>

    <template #footer>
      <vs-row v-if="isLoggedIn" justify="space-between">
        <vs-sidebar-item to="/profile">
          <template #icon>
            <vs-row v-if="isLoggedIn" justify="space-between">
              <vs-avatar class="pa-1 cursor-pointer" badge-color="#91fcdc" badge-position="top-right">
                <v-icon dark> mdi-bell-outline </v-icon>
                <template #badge> 28 </template>
              </vs-avatar>
            </vs-row>
          </template>
          Notifications
        </vs-sidebar-item>

        <vs-sidebar-item to="/profile">
          <template #icon>
            <vs-row v-if="isLoggedIn" justify="space-between">
              <vs-avatar class="pa-1 cursor-pointer" @click="$router.push('/profile')">
                <baseAvatarImg v-if="!profile.photoURL" :height="25" />
                <v-avatar v-else v-ripple min-height="25" min-width="25">
                  <v-img :src="profile.photoURL" flat>
                    <template #placeholder>
                      <v-row class="fill-height ma-0" align="center" justify="center">
                        <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                      </v-row>
                    </template>
                  </v-img>
                </v-avatar>
              </vs-avatar>
            </vs-row>
          </template>
          Profile
        </vs-sidebar-item>
      </vs-row>
    </template>
  </vs-sidebar>
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
      ...get('authentication', ['isLoggedIn', 'profile']),
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
