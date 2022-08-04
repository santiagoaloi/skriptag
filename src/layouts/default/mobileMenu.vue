<template>
  <v-list class="pa-0" dark color="#24272c">
    <template v-if="!isLoggedIn">
      <v-list-item
        @click="
          $router.push({ name: 'skriptag-login' });
          mobileMenu = false;
        "
      >
        <v-list-item-icon>
          <baseAvatarImg :height="25" />
        </v-list-item-icon>

        <v-list-item-title>Login</v-list-item-title>
      </v-list-item>

      <v-list-item @click="$router.push({ name: 'skriptag-signup' }), (mobileMenu = false)">
        <v-list-item-icon>
          <v-icon>$mdiHome</v-icon>
        </v-list-item-icon>

        <v-list-item-title>Signup</v-list-item-title>
      </v-list-item>
    </template>

    <template v-else>
      <v-list-item
        @click="
          $router.push({ name: 'skriptag-profile' });
          mobileMenu = false;
        "
      >
        <v-list-item-icon>
          <baseAvatarImg v-if="!profile.photoURL" :height="25" />
          <vs-avatar v-else class="pa-1 ml-n2 mr-n4">
            <v-img :src="profile.photoURL" flat>
              <template #placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                </v-row>
              </template>
            </v-img>
          </vs-avatar>
        </v-list-item-icon>

        <v-list-item-title>{{ profile.name }}'s profile</v-list-item-title><br />
      </v-list-item>
    </template>

    <v-list-item @click="">
      <v-list-item-icon>
        <v-icon>$mdiBookOpenPageVariantOutline</v-icon>
      </v-list-item-icon>
      <v-list-item-title>Blog</v-list-item-title>
    </v-list-item>

    <v-list-group color="indigo lighten-3" no-action sub-group>
      <template #activator>
        <v-list-item-content>
          <v-list-item-title>Downloads</v-list-item-title>
        </v-list-item-content>
      </template>

      <v-list-item v-for="([title, icon], i) in downloads" :key="i" link>
        <v-list-item-title v-text="title"></v-list-item-title>

        <v-list-item-icon class="mr-3">
          <v-icon v-text="icon"></v-icon>
        </v-list-item-icon>
      </v-list-item>
    </v-list-group>

    <v-list-group color="indigo lighten-3" no-action sub-group>
      <template #activator>
        <v-list-item-content>
          <v-list-item-title>Training</v-list-item-title>
        </v-list-item-content>
      </template>

      <v-list-item v-for="([title, icon], i) in training" :key="i" link>
        <v-list-item-title v-text="title"></v-list-item-title>

        <v-list-item-icon class="mr-3">
          <v-icon v-text="icon"></v-icon>
        </v-list-item-icon>
      </v-list-item>
    </v-list-group>

    <v-list-item
      v-if="isLoggedIn"
      @click="
        logout();
        mobileMenu = false;
      "
    >
      <v-list-item-icon>
        <v-icon>$mdiLogoutVariant</v-icon>
      </v-list-item-icon>

      <v-list-item-title>logout</v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<script>
  import { sync, get, call } from 'vuex-pathify';

  export default {
    name: 'MobileMenu',

    data() {
      return {
        downloads: [
          ['Freebies', '$mdiCurrencyUsdOff'],
          ['Courses', '$mdiBookOpenPageVariantOutline'],
        ],
        training: [
          ['Firebase', '$mdiFirebase'],
          ['VueJS', '$mdiVuejs'],
          ['Vuetify', '$mdiVuetify'],
          ['Javascript', '$mdiLanguageJavascript'],
        ],
      };
    },
    computed: {
      ...sync('app', ['mobileMenu']),
      ...get('authentication', ['isLoggedIn', 'profile']),
    },

    methods: {
      ...call('authentication', ['logout']),
    },
  };
</script>
