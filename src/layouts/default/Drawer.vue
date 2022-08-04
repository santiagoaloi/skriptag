<template>
  <div>
    <v-navigation-drawer v-model="drawer" disable-resize-watcher touchless color="rgba(22, 22, 33, 0.2)" width="245" dark app>
      <v-divider></v-divider>

      <div class="pa-1">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title style="font-size: 13px !important; color: darkgrey">Categories</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- <v-card flat style="color: #adbac7 !important" class="rounded-t-lg" color="rgba(18, 20, 23, 0.2)"> -->

        <v-card flat style="color: #adbac7 !important" class="rounded-t-lg mx-2" color="rgba(18, 20, 23, 0.2)">
          <v-list flat :ripple="false" class="ma-0 pa-0">
            <v-list-group v-for="item in items" :key="item.title" v-model="item.active" color="#5c77a5" :ripple="false" no-action>
              <template #activator>
                <v-list-item-content>
                  <v-list-item-title style="font-size: 14px !important"> {{ item.title }}</v-list-item-title>
                </v-list-item-content>
              </template>

              <v-list-item v-for="child in item.items" :key="child.title">
                <v-list-item-content>
                  <v-list-item-title style="font-size: 14px !important"> {{ child.title }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-group>
          </v-list>
        </v-card>
      </div>
    </v-navigation-drawer>

    <v-sheet
      class="d-flex align-end justify-center v-navigation-drawer v-navigation-drawer--fixed border-right"
      height="100vh"
      :style="`margin-left:${drawer ? '235px' : '0px'}`"
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
  import { get, sync } from 'vuex-pathify';

  export default {
    name: 'DefaultDrawer',
    data() {
      return {
        route: '/',
        items: [
          {
            items: [{ title: 'List Item' }],
            title: 'Attractions',
          },
          {
            items: [{ title: 'Breakfast & brunch' }, { title: 'New American' }, { title: 'Sushi' }],
            title: 'Dining',
          },
          {
            items: [{ title: 'List Item' }],
            title: 'Education',
          },
          {
            items: [{ title: 'List Item' }],
            title: 'Family',
          },
        ],
      };
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
