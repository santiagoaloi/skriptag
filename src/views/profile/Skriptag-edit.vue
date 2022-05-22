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
        <component :is="component.componentName" />
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>
<script>
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
</style>
