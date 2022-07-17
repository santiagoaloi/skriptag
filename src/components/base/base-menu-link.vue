<template>
  <h4 class="basic-link" v-on="$listeners" @click="to && $router.push(to)">
    <v-icon v-if="icon" left small dark>{{ icon }}</v-icon>
    <slot />
  </h4>
</template>

<script>
  export default {
    name: 'BaseMenuLink',
    props: {
      icon: {
        type: String,
        default: null,
      },
      to: {
        type: String,
        default: null,
      },
    },
  };
</script>
<style scoped>
  .basic-link {
    cursor: pointer;
    color: rgb(155, 155, 155) !important;
    transition: 1s;
    cursor: pointer;
  }

  .basic-link:hover {
    color: rgb(227, 227, 227) !important;
    transition: 1s;
  }
</style>
