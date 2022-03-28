<template>
  <component :is="size" t>Skriptag<span class="ml-1 primary-font-color">> </span></component>
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
    },

    computed: {
      size() {
        return this.small ? 'h3' : 'h1';
      },
    },
  };
</script>
