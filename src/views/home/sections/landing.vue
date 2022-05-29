<template>
  <base-split-2 src="https://media.skriptag.com/img/2.svg" v-bind="$attrs">
    <v-chip color="pink" dark small>Beta 1.1.4</v-chip>
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

    <v-btn color="success" @click="testListAllUsers()">Test list users</v-btn>
  </base-split-2>
</template>
<script>
  import { call } from 'vuex-pathify';
  import baseSplit2 from '@/components/base/baseSplit-2.vue';

  export default {
    name: 'LandingPage',
    components: { baseSplit2 },
    props: {
      index: {
        type: Number,
        default: 0,
      },
    },

    data() {
      return {
        options: {
          offset: 60,
        },
      };
    },

    methods: {
      ...call('app', ['sleep']),
      ...call('authentication', ['testListAllUsers']),
    },
  };
</script>
<style>
  /* Gradient color font styling */
  article {
    background: linear-gradient(to right, rgb(255, 255, 255), rgb(134, 195, 195));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
</style>
