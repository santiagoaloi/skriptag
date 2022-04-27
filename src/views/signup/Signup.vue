<template>
  <base-split-2 col="6">
    <v-container>
      <div class="d-flex flex-wrap flex-column">
        <h2 class="mb-5">Signup</h2>
        <div>
          <v-alert
            style="color: #ccc"
            dense
            text
            dark
            color="teal accent-3"
            border="left"
            elevation="6"
            colored-border
            icon="mdi-chevron-up"
          >
            You can also use authentication providers like google, apple or microsot. Login with your credentials directly, and
            your account wuill be created right away.
          </v-alert>
        </div>

        <h5></h5>
        <BaseLink to="login">Already have an account? Login</BaseLink>

        <SignupWithEmail />
      </div>
    </v-container>
  </base-split-2>
</template>
<script>
  import { call, sync, get } from 'vuex-pathify';
  // import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
  // import { auth } from '@/firebase/firebase';
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
      ...call('authentication', ['signup', 'signupWithGoogle']),
      ...call('snackbar/*'),

      google() {
        this.signupWithGoogle();
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
          this.snackbarError('Please correct the fields in red');
        } catch (error) {
          this.snackbarError('Something went wrong');
        }
      },
    },
  };
</script>
