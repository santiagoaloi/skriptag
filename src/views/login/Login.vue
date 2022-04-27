<template>
  <base-split-2 v-if="!isLoggedIn" id="login" col="6" right>
    <v-container>
      <div class="d-flex flex-wrap flex-column pl-1">
        <template v-if="!recoveryMode">
          <h1>Login</h1>
          <p>Time to get stuff done!</p>
        </template>

        <template v-if="recoveryMode">
          <h1>Reset password</h1>
          <p>Account recovery email.</p>
        </template>

        <v-fade-transition hide-on-leave>
          <v-sheet
            v-if="!recoveryMode && mode !== 'email'"
            class="transparent"
            :width="$vuetify.breakpoint.smAndDown ? '100%' : 350"
          >
            <Base-button class="my-3" block> <v-icon left> mdi-microsoft</v-icon> Sign-in with Microsoft</Base-button>
            <Base-button class="my-3" block @click="google()"> <v-icon left> mdi-google</v-icon> Sign-in with Google</Base-button>
            <Base-button class="my-3" block> <v-icon left> mdi-apple</v-icon> Sign-in with Apple</Base-button>

            <div class="d-flex align-center">
              <v-divider class="grey darken-3" /> <span class="mx-3" style="color: #ccc"> or </span>
              <v-divider class="grey darken-3" />
            </div>
            <Base-button class="mt-2" block @click="mode = 'email'">
              <v-icon left> mdi-mail</v-icon> Sign-in with Email</Base-button
            >
          </v-sheet>
        </v-fade-transition>

        <v-fade-transition hide-on-leave>
          <LoginWithEmail v-if="mode === 'email'" @goBack="mode = ''" />
        </v-fade-transition>
      </div>
    </v-container>
  </base-split-2>
</template>
<script>
  import { call, sync, get } from 'vuex-pathify';
  import LoginWithEmail from './LoginWithEmail.vue';

  export default {
    name: 'LoginPage',

    components: {
      LoginWithEmail,
    },

    data() {
      return {
        mode: '',
        vvOptions: {
          mode: 'passive',
          slim: true,
        },
        recoveryMode: false,
        loginForm: {
          email: '',
          password: '',
        },
      };
    },

    computed: {
      loading: sync('loaders/authLoader'),
      ...get('authentication', ['isLoggedIn']),
    },

    methods: {
      ...call('authentication', ['login', 'accountRecoveryRequest', 'signupWithGoogle']),
      ...call('snackbar/*'),

      google() {
        this.signupWithGoogle();
      },

      resetValidation() {
        this.$refs.loginForm.reset();
      },

      async validateLoginForm() {
        try {
          const validated = await this.$refs.loginForm.validate();
          if (validated) {
            if (this.recoveryMode) {
              this.accountRecoveryRequest(this.loginForm.email);
              this.recoveryMode = false;
              return;
            }

            if (!this.recoveryMode) {
              this.login(this.loginForm);
              return;
            }

            return;
          }
          this.snackbarError('Please correct the fields in red');
        } catch (error) {
          this.snackbarError('something went wrong ');
        }
      },
    },
  };
</script>
