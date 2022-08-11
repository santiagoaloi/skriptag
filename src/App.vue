<template>
  <keep-alive>
    <router-view />
  </keep-alive>
</template>

<script>
  import { get, call } from 'vuex-pathify';

  export default {
    name: 'App',
    computed: {
      ...get('authentication', ['isAccountDisabled']),
    },

    // The authenticated account profile gets real-time updates.
    // If the disabled flag shows up, that means that auth is revoked.
    // We are reacting to isAccountDisabled Vuex getter and forcing a logout.
    watch: {
      isAccountDisabled(disabled) {
        if (disabled) {
          this.logout();
        }
      },
    },

    // mounted() {
    //   if ('virtualKeyboard' in navigator) {
    //     navigator.virtualKeyboard.overlaysContent = true;
    //   }
    // },
    methods: {
      ...call('snackbar', ['snackbarError']),
      ...call('authentication', ['logout']),
    },
  };
</script>
