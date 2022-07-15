<template>
  <base-split-2 col="6" right src="login1.svg" v-bind="$attrs">
    <v-container>
      <div class="d-flex flex-wrap flex-column">
        <template v-if="!recoveryMode">
          <skriptag-title class="mb-n3" small>
            <template #text> Sign In to </template>
          </skriptag-title>
        </template>

        <template v-if="recoveryMode">
          <h1>Reset password</h1>
          <p>Account recovery email.</p>
        </template>

        <v-fade-transition hide-on-leave>
          <div v-if="!recoveryMode && mode !== 'email'" class="transparent" :width="$vuetify.breakpoint.smAndDown ? '100%' : 350">
            <Base-button :loading="loading" class="my-3" block @click="google()">
              <v-icon left> $mdiGoogle</v-icon> Sign-in with Google</Base-button
            >
            <Base-button class="my-3" block @click="github()"> <v-icon left> $mdiGithub</v-icon> Sign-in with Github</Base-button>

            <div class="d-flex align-center">
              <v-divider class="grey darken-3" /> <span class="mx-3"> or </span>
              <v-divider class="grey darken-3" />
            </div>
            <Base-button class="mt-2" block @click="mode = 'email'">
              <v-icon left> $mdiEmail</v-icon> Sign-in with Email</Base-button
            >
          </div>
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
      ...sync('loaders', ['signInWithGoogle', 'signInWithGithub']),
      ...get('authentication', ['isLoggedIn']),
    },

    methods: {
      ...call('authentication', ['login', 'accountRecoveryRequest', 'authenticateWithGoogle', 'authenticateWithGithub']),
      ...call('snackbar/*'),

      google() {
        this.authenticateWithGoogle();
      },

      github() {
        this.authenticateWithGithub();
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
          this.snackbarError('Please correct the fields highlighted in red');
        } catch (error) {
          this.snackbarError('something went wrong ');
        }
      },
    },
  };
</script>
