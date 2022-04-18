<template>
  <base-split-2 id="login" col="6" right>
    <div class="pa-3">
      <div class="d-flex flex-wrap flex-column pl-1">
        <h1 v-if="!recoveryMode">Login</h1>
        <h1 v-else>Reset password</h1>
        <p v-if="!recoveryMode">Time to get stuff done!</p>
        <p v-else>Account recovery email.</p>
      </div>
      <ValidationObserver ref="loginForm" slim>
        <form class="d-flex flex-column" @submit.prevent="validateLoginForm()">
          <v-row no-gutters>
            <v-col cols="12" lg="10">
              <v-btn
                v-if="!recoveryMode"
                :ripple="false"
                small
                color="white"
                class="ml-n1 mb-2"
                plain
                @click="recoveryMode = true"
                ><v-icon left> mdi-lock</v-icon>Recover my password</v-btn
              >
              <div class="pb-7 pr-2">
                <Validation-provider v-slot="{ errors }" mode="lazy" name="email" :rules="{ email: true, required: true }">
                  <vs-input v-model="loginForm.email" :danger="errors.length > 0" maxlength="100" block placeholder="Email">
                    <template #icon>
                      <v-icon dark>mdi-account</v-icon>
                    </template>
                    <template #message-danger> {{ errors[0] }} </template>
                  </vs-input>
                </Validation-provider>
              </div>
            </v-col>
            <v-col cols="12" lg="10">
              <div v-if="!recoveryMode" class="pr-2 pb-7">
                <Validation-provider v-slot="{ errors }" mode="lazy" name="password" :rules="{ required: true }">
                  <vs-input
                    v-model="loginForm.password"
                    maxlength="100"
                    :danger="errors.length > 0"
                    block
                    type="password"
                    placeholder="Password"
                  >
                    <template #icon>
                      <v-icon dark>mdi-lock</v-icon>
                    </template>
                    <template #message-danger> {{ errors[0] }} </template>
                  </vs-input>
                </Validation-provider>
              </div>

              <div class="ml-n1">
                <Base-button
                  v-if="!recoveryMode"
                  :block="!$vuetify.breakpoint.smAndUp"
                  :class="$vuetify.breakpoint.smAndUp ? 'ml-2' : 'mt-3'"
                  type="submit"
                  :loading="loading"
                  dark
                  color="grey darken-3"
                  large
                  class="teal--text text--accent-3"
                >
                  Login</Base-button
                >

                <Base-button
                  v-if="recoveryMode"
                  :block="!$vuetify.breakpoint.smAndUp"
                  :class="$vuetify.breakpoint.smAndUp ? 'ml-2' : 'mt-3'"
                  dark
                  color="grey darken-3"
                  large
                  @click="recoveryMode = false"
                >
                  Cancel</Base-button
                >
                <Base-button
                  v-if="recoveryMode"
                  :block="!$vuetify.breakpoint.smAndUp"
                  :class="$vuetify.breakpoint.smAndUp ? 'ml-2' : 'mt-3'"
                  :loading="loading"
                  type="submit"
                  dark
                  color="grey darken-3"
                  large
                  class="teal--text text--accent-3"
                >
                  Reset password</Base-button
                >
              </div>
            </v-col>
          </v-row>
        </form>
      </ValidationObserver>
    </div>
  </base-split-2>
</template>
<script>
  import { call, sync } from 'vuex-pathify';

  export default {
    name: 'LoginPage',

    data() {
      return {
        recoveryMode: false,
        loginForm: {
          email: '',
          password: '',
        },
      };
    },

    computed: {
      loading: sync('loaders/authLoader'),
    },

    methods: {
      ...call('authentication', ['login', 'accountRecovery']),
      ...call('snackbar/*'),

      async validateLoginForm() {
        try {
          const validated = await this.$refs.loginForm.validate();
          if (validated) {
            if (!this.recoveryMode) {
              this.login(this.loginForm);
              return;
            }

            if (this.recoveryMode) {
              this.accountRecovery(this.loginForm.email);
              this.recoveryMode = false;
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
