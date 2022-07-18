<template>
  <base-split-2 col="6" :src="$vuetify.breakpoint.smAndDown ? 'landing2-v.svg' : 'landing2-h.svg'" v-bind="$attrs">
    <v-chip color="purple darken-4" dark small>V1.0 Beta-2</v-chip>
    <skriptag-title large class="mb-4" />
    <article>
      <h2 style="font-size: 40px">
        Level up your <strong>skills. </strong> Find learning content, <strong> consulting</strong> assistance or interact with
        other developers.
      </h2>
    </article>

    <p class="pt-5">
      Learn coding , download free and premium application templates, access JS/VueJS training material, participate in Skriptag's
      blogs and product reviews.
    </p>
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
    background: linear-gradient(to right, rgb(255, 255, 255), rgb(145, 124, 175));
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
</style>
