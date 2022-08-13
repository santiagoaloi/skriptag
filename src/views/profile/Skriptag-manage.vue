<template>
  <div>
    <skriptag-manage-tabs />

    <v-row class="mt-0">
      <v-col sm="10">
        <skriptag-manage-views />
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
  </div>
</template>
<script>
  import SkriptagManageTabs from './Skriptag-manage-tabs.vue';
  import SkriptagManageViews from './Skriptag-manage-views.vue';

  export default {
    name: 'SkriptagManage',
    components: { SkriptagManageTabs, SkriptagManageViews },

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
