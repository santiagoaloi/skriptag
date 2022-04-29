<template>
  <v-btn
    v-animation:shrink="{ link: true, longPress: true }"
    v-bind="$attrs"
    dark
    :large="!small"
    color="#2a3143"
    class="indigo--text text--lighten-5"
    :ripple="false"
    :block="$vuetify.breakpoint.xs || block"
    :class="$vuetify.breakpoint.smAndUp ? 'ml-0' : 'mt-3'"
    v-on="$listeners"
  >
    <slot> </slot>
  </v-btn>
</template>

<script>
  export default {
    name: 'BaseButton',
    props: {
      small: {
        type: Boolean,
        default: false,
      },

      block: {
        type: Boolean,
        default: false,
      },
    },
  };
</script>
