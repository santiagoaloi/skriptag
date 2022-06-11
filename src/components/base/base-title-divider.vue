<template>
  <div>
    <h2 :style="`color: ${danger ? '#e5534b' : '#ccc'} `" class="mb-2"><slot /></h2>
    <v-divider class="grey darken-3 my-3"></v-divider>
  </div>
</template>

<script>
  export default {
    name: 'BaseTitleDivider',
    props: {
      danger: {
        type: Boolean,
        default: false,
      },
    },
  };
</script>
