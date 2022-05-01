<template>
  <div style="color: #ccc">
    <div class="d-flex align-center">
      <h2 class="mb-6 mt-3 cursor-pointer" @click="close()">Profile</h2>
      <v-icon class="mt-n2" size="25" dark> mdi-chevron-right</v-icon>
      <h2 class="mb-6 mt-3">Skriptag edit</h2>
    </div>

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
  import EditUsers from './Skriptag-edit-users.vue';
  import EditRoles from './Skriptag-edit-roles.vue';

  export default {
    name: 'SkriptagEdit',
    components: {
      EditUsers,
      EditRoles,
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
        ],
      };
    },

    methods: {
      close() {
        this.$emit('close');
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
