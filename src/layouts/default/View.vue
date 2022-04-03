<template>
  <v-main>
    <v-fade-transition hide-on-leave mode="out-in">
      <router-view style="margin-left: 50px; margin-top: 60px" />
    </v-fade-transition>
  </v-main>
</template>

<script>
  export default { name: 'DefaultView' };
</script>
