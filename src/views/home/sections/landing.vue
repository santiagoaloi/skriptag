<template>
  <base-split-2 col="6" src="landing1.svg" v-bind="$attrs">
    <v-chip color="pink" dark small>Beta 0.1.4</v-chip>
    <skriptag-title large class="mb-4" />
    <article>
      <h2 class="font-weight-light">
        Level up your <strong>skills</strong> and launch your career as a <strong>developer</strong> - Find learning content,
        <strong> mentoring</strong> assistance or interact with other developers!
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
  /* Gradient color font styling */
  article {
    background: linear-gradient(to right, rgb(255, 255, 255), rgb(134, 195, 195));
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
</style>
