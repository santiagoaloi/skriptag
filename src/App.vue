<template>
  <v-fade-transition hide-on-leave mode="out-in">
    <router-view />
  </v-fade-transition>
</template>

<script>
  export default {
    name: 'BaseApp',

    mounted() {
      this.$vs.setTheme('dark');
    },

    methods: {},
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

  .selectable {
    -webkit-user-select: text !important;
    -khtml-user-select: text !important;
    -moz-user-select: text !important;
    -o-user-select: text !important;
    user-select: text !important;
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
    overflow: overlay !important;
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

  /* Apply  scrollbar styles */
  ::-webkit-scrollbar {
    width: 16px !important;
    height: 6px !important;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #383f43;
  }
  ::-webkit-scrollbar-track {
    background: rgb(17, 27, 33);
  }

  ::-moz-selection {
    /* Code for Firefox */
    color: rgb(201, 255, 252);
    background: #16867a;
  }

  ::selection {
    color: rgb(201, 255, 252);
    background: #16867a;
  }

  .vs-input__message {
    position: absolute;
    top: 43px !important;
  }

  .vs-tooltip {
    font-family: Arial, Helvetica, sans-serif !important;
    background: #212326 !important;
  }

  .vs-input__progress {
    position: absolute;
    top: 43px;
  }

  .v-application a {
    color: #6ee6b9 !important;
  }

  .pattern-bg {
    background-color: #25272c;
    opacity: 1;
    background-image: linear-gradient(135deg, #24262a 25%, transparent 25%), linear-gradient(225deg, #24262a 25%, transparent 25%),
      linear-gradient(45deg, #24262a 25%, transparent 25%), linear-gradient(315deg, #24262a 25%, #25272c 25%);
    background-position: 65px 0, 65px 0, 0 0, 0 0;
    background-size: 130px 130px;
    background-repeat: repeat;
  }

  .v-navigation-drawer--absolute {
    z-index: 99 !important;
  }

  .v-navigation-drawer {
    overflow: visible !important;
  }

  h1 {
    font-size: 300% !important;
  }

  .v-tab {
    text-transform: unset !important;
  }

  /* disables list color change on click */
  .disable-hover.v-list-item--link:before {
    background-color: unset !important;
  }

  .theme--light.v-tabs > .v-tabs-bar .v-tab:not(.v-tab--active),
  .theme--light.v-tabs > .v-tabs-bar .v-tab:not(.v-tab--active) > .v-icon,
  .theme--light.v-tabs > .v-tabs-bar .v-tab:not(.v-tab--active) > .v-btn,
  .theme--light.v-tabs > .v-tabs-bar .v-tab--disabled {
    color: #ccc !important;
  }
</style>
