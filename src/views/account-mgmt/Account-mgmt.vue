<template>
  <base-split-2 v-if="mode" v-show="!isLoggedIn" id="login" col="6" right src="https://media.skriptag.com/img/11.svg">
    <div class="pa-3">
      <div class="d-flex flex-wrap flex-column">
        <h1 v-if="mode === 'resetPassword'">Reset Password</h1>
        <h1 v-else>Account verification</h1>

        <p v-if="mode === 'resetPassword'">Type your new password here.</p>
        <p v-else>Verification in progres...</p>
      </div>
      <ValidationObserver ref="newPassword" slim>
        <form class="d-flex flex-column" @submit.prevent="validateNewPassword()">
          <v-row>
            <v-col v-if="mode === 'resetPassword'" cols="12" lg="10">
              <small class="ml-1">Password</small>
              <div class="pr-2">
                <Validation-provider
                  v-slot="{ errors, failed }"
                  mode="passive"
                  name="new password"
                  :rules="{ required: true, confirmed: 'confirmation' }"
                >
                  <vs-input
                    v-model="newPassword"
                    type="password"
                    :danger="failed"
                    maxlength="100"
                    block
                    placeholder="New password"
                    :progress="getPasswordComplexity(newPassword)"
                  >
                    <template #icon>
                      <v-icon dark>mdi-lock</v-icon>
                    </template>
                    <template v-if="!newPassword" #message-danger> {{ errors[0] }} </template>
                  </vs-input>
                </Validation-provider>
              </div>
            </v-col>
            <v-col v-if="mode === 'resetPassword'" cols="12" lg="10">
              <small class="ml-1">Confirm password</small>
              <div class="pr-2">
                <Validation-provider
                  v-slot="{ errors, failed }"
                  mode="passive"
                  name="repeat new password"
                  :rules="{ required: true }"
                  vid="confirmation"
                >
                  <vs-input
                    v-model="confirmNewPassword"
                    type="password"
                    :danger="failed"
                    maxlength="100"
                    block
                    placeholder="New password"
                  >
                    <template #icon>
                      <v-icon dark>mdi-lock</v-icon>
                    </template>
                    <template #message-danger> {{ errors[0] }} </template>
                  </vs-input>
                </Validation-provider>
              </div>
            </v-col>
            <v-col v-if="mode === 'resetPassword'" cols="12" lg="10">
              <div class="ml-n1">
                <Base-button dark color="grey darken-3" @click="$router.push('login')"> Cancel</Base-button>
                <Base-button class="teal--text text--accent-3" type="submit" :loading="loading" dark color="grey darken-3" large>
                  Change password</Base-button
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
  import { call, sync, get } from 'vuex-pathify';

  export default {
    name: 'AccountManagement',

    data() {
      return {
        newPassword: '',
        confirmNewPassword: '',
        oobCode: this.$route.query.oobCode,
        mode: this.$route.query.mode,
      };
    },

    computed: {
      loading: sync('loaders/authLoader'),
      ...get('authentication', ['isLoggedIn']),
      ...get('authentication', ['getPasswordComplexity']),
    },

    mounted() {
      if (this.isLoggedIn || !this.mode) {
        this.$router.push('profile');
      }
      setTimeout(() => {
        if (this.mode === 'verifyEmail') {
          this.accountEmailVerification(this.oobCode);
        }
      }, 1000);
    },

    methods: {
      ...call('authentication', ['accountRecoveryResetPassword', 'accountEmailVerification']),
      ...call('snackbar/*'),

      async validateNewPassword() {
        try {
          const validated = await this.$refs.newPassword.validate();
          if (validated) {
            this.accountRecoveryResetPassword({ payload: { newPassword: this.newPassword, oobCode: this.oobCode } });
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
