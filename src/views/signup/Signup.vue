<template>
  <base-split-2 col="7" src="signup2.svg" v-bind="$attrs">
    <div class="d-flex flex-wrap flex-column">
      <skriptag-title small>
        <template #text> Signup with email to </template>
      </skriptag-title>

      <v-alert dark dismissible color="#383f43" border="top">
        <div class="px-3">
          To signup with google or Github,
          <span class="cursor-pointer" @click="$router.push('login')"> go to the login page</span>, an account will be created on
          your first login, associated with your email.
        </div>
      </v-alert>

      <BaseLink to="login">Already have an account? Login</BaseLink>
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
