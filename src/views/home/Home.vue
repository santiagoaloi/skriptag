<template>
  <div class="fill-height">
    <intro-slide right />
    <intro-slide />
  </div>
</template>
<script>
  export default {
    name: 'Homepage',

    components: {
      introSlide: () => import(/* webpackChunkName: 'intro-page' */ './sliderViews/Intro'),
    },
  };
</script>
