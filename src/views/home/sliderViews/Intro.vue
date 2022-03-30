<template>
  <base-split-2>
    <p>
      <skriptag-title />
      Learn coding , download free and premium application templates, access JS/VueJS training material, participate in Skriptag's
      discussions forums. Buy consultancy or premium support for any product purchased.
      <v-card-actions v-if="!isLoggedIn" class="px-0">
        <v-btn large @click="$vuetify.goTo('#login', options)">Login</v-btn>
        <v-btn large @click="$vuetify.goTo('#register', options)">Signup</v-btn>
      </v-card-actions>
    </p>
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
      //   ...sync('authentication', ['loginForm']),
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
