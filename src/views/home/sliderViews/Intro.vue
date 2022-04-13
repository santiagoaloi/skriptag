<template>
  <base-split-2 v-bind="$attrs">
    <skriptag-title large class="mb-4" />

    <article>
      <h1 class="font-weight-light">
        Level up your <b>developer</b> skills and boost your <b>carreer</b> - Find learning content, <b> mentoring</b> assistance
        or interact with other developers!
      </h1>
    </article>

    <p class="pt-5">
      Learn coding , download free and premium application templates, access JS/VueJS training material, participate in Skriptag's
    </p>

    <v-card-actions v-if="!isLoggedIn" class="px-0">
      <template v-for="button in ['login', 'signup']">
        <BaseButton :key="button" @click="$router.push(`${button}`)"> {{ button }}</BaseButton>
      </template>
    </v-card-actions>
  </base-split-2>
</template>
<script>
  import { call, sync, get } from 'vuex-pathify';
  import baseSplit2 from '@/components/base/baseSplit-2.vue';

  export default {
    name: 'LoginSlide',
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

    computed: {
      loading: sync('loaders/authLoader'),
      loginForm: sync('authentication/loginForm'),
      ...get('authentication', ['isLoggedIn', 'user']),
    },

    methods: {
      ...call('authentication/*'),
      ...call('app', ['sleep']),

      auth() {
        this.login().then(() => {
          this.$emit('logged-in', 'loginSlide');
        });
      },
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
