<template>
  <v-main>
    <v-fade-transition mode="out-in">
      <router-view
        class="ml-12"
      />
    </v-fade-transition>
  </v-main>
</template>

<script>
  export default { name: 'DefaultView' }
</script>
