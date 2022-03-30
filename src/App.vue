<template>
  <v-fade-transition mode="out-in">
    <router-view />
  </v-fade-transition>
</template>

<script>
  import { call } from 'vuex-pathify';

  export default {
    name: 'BaseApp',

    mounted() {
      this.$vs.setTheme('dark');
    },

    beforeMount() {
      // If there's a firebase uthenticated user, it will retrieve the user object.
      this.fetchUser();
    },
    methods: {
      ...call('authentication', ['fetchUser']),
    },
  };
</script>
<style>
  .v-application--wrap {
    background: #24272c !important;
  }

  .v-main__wrap {
    background: #24272c !important;
  }

  .v-main {
    background: #24272c !important;
  }

  /* Removes the possibility of selecting text  */
  .no-select {
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -o-user-select: none;
    user-select: none;
  }
  /* Removes the possibility of dragging content  */

  .no-drag {
    -webkit-user-drag: none;
    -khtml-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;
  }

  .vs-select__option {
    font-family: revert;
    font-size: 15px;
  }

  .primary-font-color {
    color: rgb(var(--vs-primary));
  }

  html {
    background: #24272c !important;
    /* overflow: hidden !important; */
  }
</style>
