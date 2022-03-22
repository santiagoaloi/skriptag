<template>
  <v-fade-transition mode="out-in">
    <router-view />
  </v-fade-transition>
</template>

<script>
  export default {
    name: 'BaseApp',
    computed: {
      vuesax() {
        return this.$vs;
      },
    },
    mounted() {
      // Set Vuesax dark theme
      this.$vs.setTheme('dark');
    },
  };
</script>
<style>
  html {
    background: #24272c;
    overflow: hidden !important;
  }

  .v-application--wrap {
    background: #24272c !important;
  }

  .v-main__wrap {
    background: #24272c !important;
  }

  .v-main {
    background: #24272c !important;
  }

  .vs-select__option {
    font-family: revert;
    font-size: 15px;
  }

  .primary-font-color {
    color: rgb(var(--vs-primary));
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
</style>
