<template>
  <div>
    <v-tabs v-model="selectedTab" background-color="transparent">
      <v-tabs-slider color="#f47067"></v-tabs-slider>
      <v-tab
        v-for="tab in tabs"
        :key="tab.route"
        :to="{ name: tab.route }"
        active-class="active"
        :disabled="tab.disabled"
        :ripple="false"
      >
        {{ tab.name }}
      </v-tab>
    </v-tabs>
    <v-divider style="background: #444c56"></v-divider>
  </div>
</template>
<script>
  import { get } from 'vuex-pathify';

  export default {
    name: 'SkriptagManageTabs',

    data() {
      return {
        tabs: [
          {
            name: 'Users',
            route: 'skriptag-users',
            disabled: false,
          },
          {
            name: 'Roles',
            route: 'skriptag-roles',
            disabled: false,
          },
          {
            name: 'Capabilites',
            route: 'skriptag-capabilities',
            disabled: false,
          },
        ],

        selectedTab: 'skriptag-users',
      };
    },
    computed: {
      ...get('authentication', ['isRoot']),
    },

    // watch: {
    //   isRoot: {
    //     handler(newVal) {
    //       if (!newVal) {
    //         this.$router.push('/profile');
    //         return;
    //       }
    //       if (this.$route.name === 'skriptag-edit') {
    //         this.$router.push(this.tabs[0].route);
    //       }
    //     },
    //     deep: true,
    //     immediate: true,
    //   },
    // },
  };
</script>

<style>
  .active {
    color: #b2b6c3 !important;
  }

  .border {
    border-left: solid 1px #444c56;
  }
</style>
