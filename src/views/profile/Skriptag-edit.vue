<template>
  <div style="color: #ccc">
    <v-tabs v-model="selectedTab" background-color="transparent">
      <v-tabs-slider color="#f47067"></v-tabs-slider>
      <v-tab v-for="tab in tabs" :key="tab.route" :to="tab.route" active-class="active" :disabled="tab.disabled" :ripple="false">
        {{ tab.name }}
      </v-tab>
    </v-tabs>

    <v-divider style="background: #444c56"></v-divider>

    <v-row>
      <v-col sm="10">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </v-col>
      <v-col class="border" sm="2">
        <v-card-text>
          <h3>Account</h3>
          <h3>Management</h3>

          <p class="mt-3">
            Firebase Auth provides the ability to use service workers to detect and pass Firebase ID tokens for session
            management. This provides the following benefits:
          </p>
        </v-card-text>
      </v-col>
    </v-row>

    <!-- <v-tab-item v-for="component in tabs" :key="component.name">
        <v-row>
          <v-col sm="10">
            <component :is="component.componentName" />
          </v-col>
          <v-col class="border" sm="2">
            <v-card-text>
              <h3>Account</h3>
              <h3>Management</h3>

              <p class="mt-3">
                Firebase Auth provides the ability to use service workers to detect and pass Firebase ID tokens for session
                management. This provides the following benefits:
              </p>
            </v-card-text>
          </v-col>
        </v-row>
      </v-tab-item> -->
  </div>
</template>
<script>
  import { get } from 'vuex-pathify';

  export default {
    name: 'SkriptagEdit',

    data() {
      return {
        tabs: [
          {
            name: 'Users',
            route: '/profile/skriptag-edit/users',
            disabled: false,
          },
          {
            name: 'Roles',
            route: '/profile/skriptag-edit/roles',
            disabled: false,
          },
          {
            name: 'Capabilites',
            route: '/profile/skriptag-edit/capabilities',
            disabled: false,
          },
        ],

        selectedTab: '/profile/skriptag-edit/users',
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
