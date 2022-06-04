<template>
  <router-view />
</template>

<script>
  import { get, call } from 'vuex-pathify';
  import { store } from '@/store';

  export default {
    name: 'BaseApp',

    computed: {
      ...get('authentication', ['isAccountDisabled', 'profile']),

      computedStore() {
        if (!store) return;
        return store;
      },
    },
    // The authenticated account profile gets real-time updates.
    // If the disabled flag shows up, that means that all tokens are revoked
    // We are reacting to isAccountDisabled getter and forcing a logout.
    // watch: {
    //   isAccountDisabled(newValue) {
    //     if (newValue) {
    //       this.logout();
    //     }
    //   },
    // },

    methods: {
      ...call('authentication', ['logout']),
    },
  };
</script>
