<template>
  <v-btn
    v-animation:shrink="{ link: true, longPress: true }"
    v-bind="$attrs"
    dark
    color="#343b3d"
    large
    class="teal--text text--accent-4"
    :ripple="false"
    :block="!$vuetify.breakpoint.smAndUp"
    :class="$vuetify.breakpoint.smAndUp ? 'ml-2' : 'mt-3'"
    v-on="$listeners"
  >
    <slot> </slot>
  </v-btn>
</template>

<script>
  export default {
    name: 'BaseButton',

    props: {
      customIcon: {
        type: String,
        default: '',
      },
    },
  };
</script>
