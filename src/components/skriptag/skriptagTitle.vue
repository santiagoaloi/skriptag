<template>
  <component
    :is="size"
    v-animation:shrink="{ link: link, longPress: true }"
    style="color: #adbac7 !important"
    class="ignore-font"
    v-on="$listeners"
  >
    <slot name="text" /> Skriptag
    <span :class="small ? 'ml-n8' : large ? 'ml-n16' : 'ml-n10'" class="primary-font-color">ˆ </span>
  </component>
</template>

<script>
  // Utilities

  export default {
    name: 'SkriptagTitle',
    props: {
      small: {
        type: Boolean,
        default: false,
      },
      large: {
        type: Boolean,
        default: false,
      },
      link: {
        type: Boolean,
        default: false,
      },
    },

    computed: {
      size() {
        return this.small ? 'h2' : 'h1';
      },
    },
  };
</script>

<style scoped>
  .large {
    font-size: 300% !important;
  }
</style>
