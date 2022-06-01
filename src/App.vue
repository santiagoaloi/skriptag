<template>
  <router-view v-show="booted" />
</template>

<script>
  import { get, call } from 'vuex-pathify';

  export default {
    name: 'BaseApp',
    data() {
      return {
        booted: false,
      };
    },

    computed: {
      ...get('authentication', ['isAccountDisabled', 'profile']),
    },

    // The authenticated account profile gets real-time updates.
    // If the disabled flag shows up, that means that all tokens are revoked
    // We are reacting to isAccountDisabled getter and forcing a logout.
    watch: {
      isAccountDisabled(newValue) {
        if (newValue) {
          this.logout();
        }
      },
    },

    mounted() {
      this.$nextTick(() => {
        this.booted = true;
      });
    },

    methods: {
      ...call('authentication', ['logout']),
    },
  };
</script>
