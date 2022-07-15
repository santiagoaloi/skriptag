<template>
  <v-btn
    v-bind="$attrs"
    dark
    outlined
    style="border-color: #cdd9e51a !important; border: 1px solid! !important; background: #373e47 !important; color: #adbac7"
    :ripple="false"
    :block="$vuetify.breakpoint.xs || block"
    depressed
    :class="{ 'red--text text--lighten-1': danger }"
    v-on="$listeners"
  >
    <slot> </slot>
  </v-btn>
</template>

<script>
  export default {
    name: 'BaseButton',
    props: {
      block: {
        type: Boolean,
        default: false,
      },
      danger: {
        type: Boolean,
        default: false,
      },
    },
  };
</script>
