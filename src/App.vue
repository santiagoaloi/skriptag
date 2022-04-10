<template>
  <v-fade-transition hide-on-leave mode="out-in">
    <router-view />
  </v-fade-transition>
</template>

<script>
  import { call } from 'vuex-pathify';

  export default {
    name: 'BaseApp',

    computed: {
      vuetify() {
        return process.env.NODE_ENV === 'development' ? this.$vuetify : null;
      },
    },

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
    overflow: hidden !important;
  }

  body {
    overflow: hidden !important;
  }

  /* Hide scrollbar for Chrome, Safari and Opera */
  .scrollbar-hidden::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge add Firefox */
  .scrollbar-hidden {
    -ms-overflow-style: none;
    scrollbar-width: none; /* Firefox */
  }

  .ps .ps__rail-x:hover,
  .ps .ps__rail-y:hover,
  .ps .ps__rail-x:focus,
  .ps .ps__rail-y:focus,
  .ps .ps__rail-x.ps--clicking,
  .ps .ps__rail-y.ps--clicking {
    background-color: #24272c;
    opacity: 0.9;
  }
</style>
