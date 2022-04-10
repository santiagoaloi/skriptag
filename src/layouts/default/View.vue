<template>
  <v-main>
    <!-- <router-view style="margin: 60px 0px 0px 50px; overflow-y: scroll; height: 100vh" /> -->
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
