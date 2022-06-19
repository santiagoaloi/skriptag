<template>
  <div>
    <v-navigation-drawer v-if="$vuetify.breakpoint.mdAndUp" v-model="drawer" color="#22272d" width="180" dark app @click.stop>
      <v-divider></v-divider>

      <!-- <v-list nav dense>
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
      </v-list> -->
    </v-navigation-drawer>

    <v-sheet
      v-if="$vuetify.breakpoint.mdAndUp"
      class="d-flex align-end justify-center v-navigation-drawer v-navigation-drawer--fixed border-right"
      height="100vh"
      :style="`margin-left:${drawer ? '170px' : '0px'}`"
      :color="drawer ? 'transparent' : '#22272d'"
      :width="drawer ? 0 : 13"
    >
      <v-btn
        :style="`margin-right:${drawer ? '-30px' : '-20px'}`"
        style="transform: rotate(90deg)"
        height="12"
        dark
        x-small
        color="#38404b"
        @click="drawer = !drawer"
        ><v-icon> {{ drawer ? '$mdiChevronDown' : '$mdiChevronUp' }} </v-icon></v-btn
      >
    </v-sheet>
  </div>
</template>
<script>
  import { get } from 'vuex-pathify';

  export default {
    name: 'DefaultDrawer',
    data() {
      return {
        drawer: false,
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
<style>
  .border-right {
    border-right: solid 1px #444c56 !important;
  }
</style>
