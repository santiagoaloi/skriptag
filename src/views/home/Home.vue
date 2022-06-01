<template>
  <div class="fill-height">
    <intro-landing right />
  </div>
</template>
<script>
  export default {
    name: 'Homepage',
    components: {
      introLanding: () => import(/* webpackChunkName:  'layout-bundle'  */ './sections/landing'),
    },
  };
</script>
