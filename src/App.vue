<template>
  <router-view />
</template>

<script>
  import { get, call } from 'vuex-pathify';

  export default {
    name: 'BaseApp',
    data() {
      return {
        hide: false,
      };
    },
    computed: {
      ...get('authentication', ['isAccountDisabled', 'profile']),
    },
    // The authenticated account profile gets real-time updates.
    // If the disabled flag shows up, that means that all tokens are revoked
    // We are reacting to isAccountDisabled getter and forcing a logout.
    watch: {
      isAccountDisabled(disabled) {
        if (disabled) {
          this.logout();
        }
      },
    },

    methods: {
      ...call('authentication', ['logout']),
    },
  };
</script>
