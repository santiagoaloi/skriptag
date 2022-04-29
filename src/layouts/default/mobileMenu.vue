<template>
  <v-list class="pa-0" dark color="#24272c">
    <v-list-item
      @click="
        $router.push('login');
        mobileMenu = false;
      "
    >
      <v-list-item-icon>
        <v-icon>mdi-home</v-icon>
      </v-list-item-icon>

      <v-list-item-title>Login</v-list-item-title>
    </v-list-item>

    <v-list-item @click="$router.push('signup'), (mobileMenu = false)">
      <v-list-item-icon>
        <v-icon>mdi-home</v-icon>
      </v-list-item-icon>

      <v-list-item-title>Signup</v-list-item-title>
    </v-list-item>

    <v-list-item @click="">
      <v-list-item-icon>
        <v-icon>mdi-home</v-icon>
      </v-list-item-icon>

      <v-list-item-title>Blog</v-list-item-title>
    </v-list-item>

    <v-list-group color="indigo lighten-3" no-action sub-group>
      <template #activator>
        <v-list-item-content>
          <v-list-item-title>Downloads</v-list-item-title>
        </v-list-item-content>
      </template>

      <v-list-item v-for="([title, icon], i) in cruds" :key="i" link>
        <v-list-item-title v-text="title"></v-list-item-title>

        <v-list-item-icon>
          <v-icon v-text="icon"></v-icon>
        </v-list-item-icon>
      </v-list-item>
    </v-list-group>

    <v-list-group color="indigo lighten-3" :value="true" no-action sub-group>
      <template #activator>
        <v-list-item-content>
          <v-list-item-title>Tutorials</v-list-item-title>
        </v-list-item-content>
      </template>

      <v-list-item v-for="([title, icon], i) in admins" :key="i" link>
        <v-list-item-title v-text="title"></v-list-item-title>

        <v-list-item-icon>
          <v-icon v-text="icon"></v-icon>
        </v-list-item-icon>
      </v-list-item>
    </v-list-group>
  </v-list>
</template>

<script>
  import { sync } from 'vuex-pathify';

  export default {
    name: 'MobileMenu',

    data() {
      return {
        selectedItem: 1,

        cruds: [
          ['Templates', 'mdi-plus-outline'],
          ['Freebies', 'mdi-file-outline'],
          ['Courses', 'mdi-update'],
        ],
        admins: [
          ['Firebase', 'mdi-account-multiple-outline'],
          ['VueJS', 'mdi-cog-outline'],
          ['Vuetify', 'mdi-cog-outline'],
          ['Javascript', 'mdi-cog-outline'],
        ],
      };
    },
    computed: {
      ...sync('app', ['mobileMenu']),
    },
  };
</script>
