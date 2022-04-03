<template>
  <v-row class="pa-4">
    <v-col>
      <slot name="left"> </slot>
    </v-col>
  </v-row>
</template>

<script>
  // Utilities

  export default {
    name: 'BaseNoSplit',
    props: {
      right: {
        type: Boolean,
        default: false,
      },
    },
  };
</script>
