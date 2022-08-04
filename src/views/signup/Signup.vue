<template>
  <base-split-2 no-divider col="6" :src="$vuetify.breakpoint.smAndDown ? 'signup2-v.svg' : 'signup2-h.svg'" v-bind="$attrs">
    <div class="d-flex flex-wrap flex-column">
      <skriptag-title small class="mb-n4">
        <template #text> Signup with email to </template>
      </skriptag-title>

      <small class="mb-3">
        To signup with google or Github or if you already have an account,
        <span class="cursor-pointer link-color" @click="$router.push({ name: 'skriptag-login' })"> go to the login page.</span>
      </small>

      <SignupWithEmail />
    </div>
  </base-split-2>
</template>
<script>
  import { call, sync, get } from 'vuex-pathify';
  import SignupWithEmail from './SignupWithEmail.vue';

  export default {
    name: 'SignupPage',

    components: {
      SignupWithEmail,
    },
    data() {
      return {
        mode: '',
        vvOptions: {
          mode: 'passive',
          slim: true,
        },
        signupForm: {
          name: '',
          lastName: '',
          email: '',
          password: '',
          confirmNewPasswordRepeat: '',
        },
      };
    },
    computed: {
      loading: sync('loaders/signupLoader'),
      ...get('authentication', ['getPasswordComplexity']),
    },
    methods: {
      ...call('authentication', ['signup', 'authenticateWithGoogle']),
      ...call('snackbar/*'),

      google() {
        this.authenticateWithGoogle();
      },

      resetValidation() {
        this.$refs.profileEdit.reset();
      },

      async validate() {
        try {
          const validated = await this.$refs.profileEdit.validate();
          if (validated) {
            this.signup(this.signupForm);
            return;
          }
          this.snackbarError('Please correct the fields highlighted in red');
        } catch (error) {
          this.snackbarError('Something went wrong');
        }
      },
    },
  };
</script>
