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
  };
</script>
