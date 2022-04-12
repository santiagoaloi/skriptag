<template>
  <v-main>
    <perfect-scrollbar style="height: calc(100vh - 60px)">
      <v-fade-transition hide-on-leave mode="out-in">
        <router-view />
      </v-fade-transition>
    </perfect-scrollbar>
  </v-main>
</template>

<script>
  export default { name: 'DefaultView' };
</script>
