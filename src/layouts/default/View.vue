<template>
  <v-main>
    <v-fade-transition mode="out-in">
      <router-view style="margin-left: 50px" />
    </v-fade-transition>
  </v-main>
</template>

<script>
  export default { name: 'DefaultView' };
</script>
