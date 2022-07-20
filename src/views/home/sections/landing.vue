<template>
  <base-split-2
    no-animation
    col="5"
    no-divider
    :src="$vuetify.breakpoint.smAndDown ? 'landing2-v.svg' : 'landing2-h.svg'"
    v-bind="$attrs"
  >
    <v-chip color="purple darken-4" dark small>V1.0 Beta-2</v-chip>
    <skriptag-title large class="mb-4" />
    <article>
      <h2 style="font-size: 70px">Make the best app you've ever made.</h2>
    </article>

    <h2 style="font-weight: 100" class="pt-5">
      Get consultancy , learn coding, download free and premium application templates, access JS/VueJS training material and
      participate in blogs.
    </h2>

    <div id="cal" />
  </base-split-2>
</template>
<script>
  export default {
    name: 'LandingPage',
  };
</script>
<style>
  /* Gradient color font styling  */
  article {
    background: linear-gradient(to right, rgb(203, 211, 219), rgb(196, 174, 227));
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 600;
    line-height: 1.1;
  }
</style>
