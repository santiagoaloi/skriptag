<template>
  <v-fade-transition appear>
    <router-view />
  </v-fade-transition>
</template>

<script>
  // import { get, call } from 'vuex-pathify';
  // import { isEmpty } from 'lodash';

  export default {
    name: 'App',
    computed: {
      // ...get('authentication', ['isAccountDisabled', 'profile']),
    },
    renderTracked({ key, target, type }) {
      console.log('renderTracked:', { key, target, type });
    },
    renderTriggered({ key, target, type }) {
      console.log('renderTriggered:', { key, target, type });
    },

    // The authenticated account profile gets real-time updates.
    // If the disabled flag shows up, that means that auth is revoked.
    // We are reacting to isAccountDisabled Vuex getter and forcing a logout.
    // watch: {
    //   isAccountDisabled(disabled) {
    //     if (disabled) {
    //       this.logout();
    //       this.snackbarError('You have been logged out, contact support.');
    //     }
    //   },

    //   // If the authenticated account profile is missing
    //   // force a logout.
    //   // profile(profile) {
    //   //   if (isEmpty(profile)) {
    //   //     this.logout();
    //   //   }
    //   // },
    // },

    // methods: {
    //   ...call('snackbar', ['snackbarError']),
    //   ...call('authentication', ['logout']),
    // },
  };
</script>
