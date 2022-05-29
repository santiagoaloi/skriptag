<template>
  <div class="fill-height">
    <intro-slide right />
  </div>
</template>
<script>
  export default {
    name: 'Homepage',
    components: {
      introSlide: () => import(/* webpackChunkName: 'intro-page' */ './sections/landing'),
    },
  };
</script>
