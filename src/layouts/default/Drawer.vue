<template>
  <v-navigation-drawer v-if="$vuetify.breakpoint.mdAndUp" color="#22272d" width="220" dark app stateless>
    <v-divider></v-divider>

    <v-list nav dense>
      <v-menu dark offset-y offset-x :nudge-left="-10">
        <template #activator="{ on }">
          <v-list-item link v-on="on">
            <v-list-item-icon>
              <v-icon>$mdiFolder</v-icon>
            </v-list-item-icon>
            <v-list-item-title>My Files</v-list-item-title>
          </v-list-item>
        </template>
        <v-list>
          <v-list-item v-for="(item, index) in items" :key="index">
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
  import { get } from 'vuex-pathify';

  export default {
    name: 'DefaultDrawer',
    data() {
      return {
        route: '/',
        showSidebar: false,
        items: [{ title: 'Click Me' }, { title: 'Click Me' }, { title: 'Click Me' }, { title: 'Click Me 2' }],
      };
    },

    computed: {
      ...get('authentication', ['isLoggedIn', 'profile']),
    },
  };
</script>
