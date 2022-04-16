<template>
  <v-main>
    <div id="divContainer" class="divContainer">
      <v-fade-transition hide-on-leave mode="out-in">
        <router-view />
      </v-fade-transition>
    </div>
  </v-main>
</template>

<script>
  export default {
    name: 'DefaultView',
  };
</script>

<style>
  .divContainer {
    height: calc(100vh - 60px);
    overflow-x: hidden;
  }
  @supports not (overflow-y: overlay) {
    .divContainer {
      overflow-y: scroll;
    }
  }

  @supports (overflow-y: overlay) {
    .divContainer {
      /* overflow-y: auto; */
      overflow-y: overlay;
    }
  }
</style>
