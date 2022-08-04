<template>
  <intro-landing right />
</template>
<script>
  export default {
    name: 'Homepage',
    components: {
      introLanding: () => import(/* webpackChunkName:  'homepage'  */ './sections/landing'),
    },
  };
</script>
