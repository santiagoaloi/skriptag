<template>
  <v-btn
    v-bind="$attrs"
    dark
    outlined
    style="border-color: #cdd9e51a !important; border: 1px solid! !important; background: #373e47 !important; color: #adbac7"
    :ripple="false"
    :block="$vuetify.breakpoint.xs || block"
    :class="$vuetify.breakpoint.smAndUp ? 'ml-0' : 'mt-3'"
    depressed
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
    },
  };
</script>
