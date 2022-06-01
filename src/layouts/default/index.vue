<template>
  <Elements />
</template>

<script>
  export default {
    name: 'DefaultLayout',
    components: {
      Elements: () => import(/* webpackChunkName: 'layout-bundle' */ './elements'),
    },
  };
</script>
