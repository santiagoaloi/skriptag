<template>
  <v-main class="bgs">
    <v-fade-transition mode="out-in">
      <keep-alive v-if="$route.meta.keepAlive">
        <router-view />
      </keep-alive>
      <router-view v-else />
    </v-fade-transition>
  </v-main>
</template>

<script>
  export default {
    name: 'DefaultView',
  };
</script>
