<template>
  <v-fade-transition hide-on-leave mode="out-in">
    <router-view class="pattern-bg" />
  </v-fade-transition>
</template>

<script>
  export default {
    name: 'BaseApp',
    mounted() {
      this.$vs.setTheme('dark');
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
    top: 43px;
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
    overflow: visible;
  }

  h1 {
    font-size: 300%;
  }
</style>
