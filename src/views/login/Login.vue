<template>
  <base-split-2 v-if="!isLoggedIn" id="login" col="6" right>
    <div class="pa-3">
      <div class="d-flex flex-wrap flex-column pl-1" :class="">
        <template v-if="!recoveryMode">
          <h1>Login</h1>
          <p>Time to get stuff done!</p>
        </template>

        <template v-if="recoveryMode">
          <h1>Reset password</h1>
          <p>Account recovery email.</p>
        </template>
      </div>
      <ValidationObserver ref="loginForm" slim>
        <form class="d-flex flex-column" @submit.prevent="validateLoginForm()">
          <v-row>
            <v-col cols="12" lg="10">
              <BaseLink v-if="!recoveryMode" icon="mdi-lock" @click="recoveryMode = true">Recover my password</BaseLink>
              <small class="ml-1">Email</small>
              <div class="pr-2">
                <Validation-provider
                  v-slot="{ errors, failed }"
                  v-bind="{ ...vvOptions }"
                  name="email"
                  :rules="{ email: true, required: true }"
                >
                  <vs-input v-model="loginForm.email" :danger="failed" maxlength="100" block placeholder="Email">
                    <template #icon>
                      <v-icon dark>mdi-account</v-icon>
                    </template>
                    <template #message-danger> {{ errors[0] }} </template>
                  </vs-input>
                </Validation-provider>
              </div>
            </v-col>
            <v-col v-if="!recoveryMode" cols="12" lg="10">
              <small class="ml-1">Password</small>
              <div class="pr-2">
                <Validation-provider
                  v-slot="{ errors, failed }"
                  v-bind="{ ...vvOptions }"
                  name="password"
                  :rules="{ required: true }"
                >
                  <vs-input
                    v-model="loginForm.password"
                    maxlength="100"
                    :danger="failed"
                    block
                    type="password"
                    placeholder="At least 6 characters"
                  >
                    <template #icon>
                      <v-icon dark>mdi-lock</v-icon>
                    </template>
                    <template #message-danger> {{ errors[0] }} </template>
                  </vs-input>
                </Validation-provider>
              </div>
            </v-col>
            <v-col>
              <div class="ml-n1 mt-2">
                <template v-if="!recoveryMode">
                  <Base-button type="submit" :loading="loading"> Login</Base-button>
                </template>

                <template v-if="recoveryMode">
                  <Base-button large @click.prevent="recoveryMode = false"> Cancel</Base-button>
                  <Base-button type="submit" :loading="loading"> Reset password</Base-button>
                </template>
              </div>
            </v-col>
          </v-row>
        </form>
      </ValidationObserver>
    </div>
  </base-split-2>
</template>
<script>
  import { call, sync, get } from 'vuex-pathify';

  export default {
    name: 'LoginPage',

    data() {
      return {
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
      ...call('authentication', ['login', 'accountRecovery']),
      ...call('snackbar/*'),

      async validateLoginForm() {
        try {
          const validated = await this.$refs.loginForm.validate();
          if (validated) {
            if (this.recoveryMode) {
              this.accountRecovery(this.loginForm.email);
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
