<template>
  <base-split-2 id="login" col="6" right>
    <div class="pa-3">
      <div class="d-flex flex-wrap flex-column">
        <h1>Reset Password</h1>
        <p v-if="!recoveryMode">Type your new password here.</p>
        <p v-else>Account recovery, password reset.</p>
      </div>
      <ValidationObserver ref="newPassword" slim>
        <form class="d-flex flex-column" @submit.prevent="validateNewPassword()">
          <v-row no-gutters>
            <v-col cols="12" lg="10">
              <div class="pb-7 pr-2">
                <Validation-provider v-slot="{ errors }" mode="lazy" name="new password" :rules="{ required: true }">
                  <vs-input
                    v-model="newPassword"
                    type="password"
                    :danger="errors.length > 0"
                    maxlength="100"
                    block
                    placeholder="New password"
                  >
                    <template #icon>
                      <v-icon dark>mdi-account</v-icon>
                    </template>
                    <template #message-danger> {{ errors[0] }} </template>
                  </vs-input>
                </Validation-provider>
              </div>
            </v-col>
            <v-col cols="12" lg="10">
              <v-card-actions class="pa-0">
                <Base-button dark color="grey darken-3" large @click="$router.push('login')"> Cancel</Base-button>
                <Base-button class="teal--text text--accent-3" type="submit" :loading="loading" dark color="grey darken-3" large>
                  Change password</Base-button
                >
              </v-card-actions>
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
    name: 'ResetPassword',

    data() {
      return {
        newPassword: '',
        oobCode: this.$route.query.oobCode,
      };
    },

    computed: {
      ...get('authentication', ['isLoggedIn']),
      loading: sync('loaders/authLoader'),
    },

    methods: {
      ...call('authentication', ['accountRecoveryResetPassword']),
      ...call('app', ['sleep']),
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

      async delayRender(ms) {
        await this.sleep(ms);
        this.showSlide = true;
      },
    },
  };
</script>
