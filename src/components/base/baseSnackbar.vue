<template>
  <v-snackbar
    v-model="snackbar.data.value"
    :timeout="snackbar.data.permanent ? 0 : 6000"
    :color="snackbar.data.color"
    transition="slide-y-reverse-transition"
    multi-line
    center
    class="px-5"
  >
    <div class="d-flex">
      <v-icon class="mr-4"> {{ snackbar.data.icon }}</v-icon>
      <div v-html="snackbar.data.text" />
    </div>
    <template #action="{ attrs }">
      <v-btn dark text fab x-small v-bind="attrs" @click="snackbar.data.value = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
  // Utilities
  import { sync } from 'vuex-pathify';

  export default {
    name: 'BaseSnackbar',
    computed: {
      snackbar: sync('snackbar'),
    },
  };
</script>
