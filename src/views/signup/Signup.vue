<template>
  <base-split-2 col="6" src="https://media.skriptag.com/img/3.svg" v-bind="$attrs">
    <v-container>
      <div class="d-flex flex-wrap flex-column">
        <h2 class="mb-5">Signup with email</h2>
        <div>
          <v-alert
            style="color: #ccc"
            dense
            text
            dark
            color="teal accent-4"
            border="left"
            elevation="6"
            colored-border
            icon="$mdiChevronUp"
          >
            To signup with google or github,
            <span class="cursor-pointer teal--text text--accent-4" @click="$router.push('login')"> go to the login page</span>. An
            account will be created on your first login.
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
          this.snackbarError('Please correct the fields in red');
        } catch (error) {
          this.snackbarError('Something went wrong');
        }
      },
    },
  };
</script>
