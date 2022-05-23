<template>
  <div style="color: #ccc">
    <v-tabs v-model="selectedTab" background-color="transparent">
      <v-tabs-slider color="#3a3f50"></v-tabs-slider>
      <v-tab v-for="tab in tabs" :key="tab.component" active-class="active" :disabled="tab.disabled" :ripple="false">
        {{ tab.name }}
      </v-tab>
    </v-tabs>

    <v-divider style="background: #384545"></v-divider>

    <v-tabs-items v-model="selectedTab" class="transparent">
      <v-tab-item v-for="component in tabs" :key="component.name">
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
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>
<script>
  import { get } from 'vuex-pathify';
  import EditUsers from './users/users.vue';
  import EditRoles from './roles/roles.vue';
  import EditCapabilities from './capabilities/capabilities.vue';

  export default {
    name: 'SkriptagEdit',
    components: {
      EditUsers,
      EditRoles,
      EditCapabilities,
    },
    data() {
      return {
        selectedTab: null,

        tabs: [
          {
            name: 'Users',
            componentName: 'EditUsers',
            disabled: false,
          },
          {
            name: 'Roles',
            componentName: 'EditRoles',
            disabled: false,
          },
          {
            name: 'Capabilites',
            componentName: 'EditCapabilities',
            disabled: false,
          },
        ],
      };
    },
    computed: {
      ...get('authentication', ['isRoot']),
    },

    watch: {
      isRoot: {
        handler(newVal) {
          if (!newVal) {
            this.$router.push('/profile');
          }
        },
        deep: true,
      },
    },

    methods: {
      close() {
        this.$router.push('/profile');
        window.scrollTo(0, 0);
      },
    },
  };
</script>

<style scoped>
  .active {
    color: #b2b6c3 !important;
  }

  .border {
    border-left: solid 1px #384545;
  }
</style>
