<template>
  <div style="color: #ccc">
    <h1 class="mb-6 mt-3">Account Setttings</h1>
    <ValidationObserver ref="accountEdit" slim>
      <form class="d-flex flex-column" @submit.prevent="validatePasswords()">
        <v-row no-gutters>
          <v-col cols="12" sm="6" md="4">
            <v-row>
              <v-col cols="12">
                <h3 class="mb-2">Change password</h3>
              </v-col>

              <v-col cols="12">
                <small class="ml-1">Old password</small>
                <Validation-provider
                  v-slot="{ errors, failed }"
                  v-bind="{ ...vvOptions }"
                  name="current password"
                  :rules="{ required: true }"
                >
                  <vs-input
                    v-model="credentials.currentPassword"
                    type="password"
                    :danger="failed"
                    maxlength="20"
                    block
                    placeholder="Current password"
                    @focus="resetValidation()"
                  >
                    <template #icon>
                      <v-icon dark>mdi-account</v-icon>
                    </template>
                    <template #message-danger>
                      <v-icon v-if="failed" color="pink" style="margin-top: -1px" x-small dark>mdi-alert-circle-outline</v-icon>
                      {{ errors[0] }}
                    </template>
                  </vs-input>
                </Validation-provider>
              </v-col>
              <v-col cols="12">
                <small class="ml-1">New password</small>
                <Validation-provider
                  v-slot="{ errors, failed }"
                  v-bind="{ ...vvOptions }"
                  name="new password"
                  :rules="{ required: true, confirmed: 'confirmation' }"
                >
                  <vs-input
                    v-model="credentials.newPassword"
                    type="password"
                    :danger="failed"
                    maxlength="20"
                    block
                    placeholder="New password"
                    :progress="!failed ? getPasswordComplexity(credentials.newPassword) : null"
                    @focus="resetValidation()"
                  >
                    <template #icon>
                      <v-icon dark>mdi-lock</v-icon>
                    </template>
                    <template #message-danger>
                      <v-icon v-if="failed" color="pink" style="margin-top: -1px" x-small dark>mdi-alert-circle-outline</v-icon>
                      {{ errors[0] }}
                    </template>
                  </vs-input>
                </Validation-provider>
              </v-col>
              <v-col cols="12">
                <small class="ml-1">Confirm password</small>
                <Validation-provider
                  v-slot="{ errors, failed }"
                  v-bind="{ ...vvOptions }"
                  name="repeat new password"
                  :rules="{ required: true }"
                  vid="confirmation"
                >
                  <vs-input
                    v-model="credentials.confirmNewPasswordRepeat"
                    type="password"
                    :danger="failed"
                    maxlength="20"
                    block
                    placeholder="Repeat New password"
                    @focus="resetValidation()"
                  >
                    <template #icon>
                      <v-icon dark>mdi-lock</v-icon>
                    </template>
                    <template #message-danger>
                      <v-icon v-if="failed" color="pink" style="margin-top: -1px" x-small dark>mdi-alert-circle-outline</v-icon>
                      {{ errors[0] }}
                    </template>
                  </vs-input>
                </Validation-provider>
              </v-col>
              <v-col cols="12">
                <div class="mt-4">
                  <v-btn :block="!$vuetify.breakpoint.smAndUp" :loading="loading" type="submit" dark color="grey darken-3"
                    ><v-icon left> mdi-refresh</v-icon><span>Change password </span></v-btn
                  >
                </div>
              </v-col>

              <v-col cols="12">
                <div class="mt-4">
                  <h3 class="mb-2">Remove account</h3>
                  <p>
                    <v-icon small style="color: #ccc">mdi-help-circle-outline</v-icon>
                    Removing your account will also remove everything related to it, like blog posts, comments, downloadable
                    content and so on. This action cannot be undone.
                  </p>
                </div>
              </v-col>

              <v-col cols="12">
                <v-btn :block="!$vuetify.breakpoint.smAndUp" dark color="#de355f" @click="removeAccountDialog = true">
                  <v-icon :left="$vuetify.breakpoint.lgAndUp"> mdi-delete-outline</v-icon>
                  <span v-if="$vuetify.breakpoint.xs || (!$vuetify.breakpoint.md && !$vuetify.breakpoint.sm) || verified">
                    Remove myaccount</span
                  >
                </v-btn>

                <v-btn
                  v-if="!verified"
                  :block="!$vuetify.breakpoint.smAndUp"
                  dark
                  color="orange darken-3"
                  :class="{ 'ml-3': $vuetify.breakpoint.smAndUp, 'mt-3': !$vuetify.breakpoint.smAndUp }"
                  @click="verifyAccountDialog = true"
                >
                  <v-icon left> mdi-email-seal</v-icon>Resend verification email</v-btn
                >
              </v-col>
              <v-col cols="12">
                <v-divider class="my-4" style="background: #404040"></v-divider>
                <v-btn class="mr-2 my-2" dark color="grey" @click="close()"><v-icon left>mdi-close</v-icon>Close</v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </form>
    </ValidationObserver>
    <base-authenticate-dialog
      v-model="removeAccountDialog"
      :title="accountRemoveTitle()"
      :text="accountRemoveText()"
      :loading="deleteAccountLoader"
      @close="removeAccountDialog = false"
      @authenticated="removeAccount"
    />
    <base-authenticate-dialog
      v-model="verifyAccountDialog"
      :title="accountVerificationTitle()"
      :text="accountVerificationText()"
      :loading="resendVerificationLoader"
      @close="verifyAccountDialog = false"
      @authenticated="sendVerificationEmail"
    />
  </div>
</template>
<script>
  import { call, sync, get } from 'vuex-pathify';

  export default {
    name: 'AccountEdit',

    data() {
      return {
        verifyAccountDialog: false,
        removeAccountDialog: false,
        vvOptions: {
          mode: 'passive',
          slim: true,
        },
        credentials: {
          currentPassword: '',
          newPassword: '',
          newPasswordRepeat: '',
        },
      };
    },

    computed: {
      loading: sync('loaders/authLoader'),
      ...get('authentication', ['getPasswordComplexity', 'verified']),
      ...sync('loaders', ['deleteAccountLoader', 'resendVerificationLoader']),
    },

    methods: {
      ...call('authentication', ['accountResetPassword', 'deleteAccountByEmail', 'resendEmailVerification', 'logout']),
      ...call('snackbar/*'),

      resetValidation() {
        this.$refs.accountEdit.reset();
      },
      async validatePasswords() {
        try {
          const validated = await this.$refs.accountEdit.validate();
          if (validated) {
            this.$refs.accountEdit.reset();

            this.accountResetPassword({ credentials: this.credentials });
            this.clearCredentialsform();
          } else {
            this.snackbarError('Please correct the fields in red');
          }
        } catch (error) {
          this.snackbarError('Something went wrong ');
        }
      },

      accountRemoveTitle() {
        return 'Remove my account';
      },

      accountRemoveText() {
        return 'This action is permament, you will not be able to undo it. All your data, will be removed immediately.';
      },

      accountVerificationTitle() {
        return 'Send verification email';
      },

      accountVerificationText() {
        return 'Enter your current password.';
      },

      clearCredentialsform() {
        this.credentials = {
          currentPassword: '',
          newPassword: '',
          newPasswordRepeat: '',
        };
      },

      async removeAccount(account) {
        this.deleteAccountLoader = true;

        try {
          const result = await this.deleteAccountByEmail(account.email);

          if (result.deleted) {
            this.logout();
            this.snackbarSuccess(`${account.email} removed.`);
            this.deleteAccountLoader = false;
            this.removeAccountDialog = false;
            return;
          }
          this.deleteAccountLoader = false;
        } catch ({ ...error }) {
          this.deleteAccountLoader = false;
        }
      },

      async sendVerificationEmail(account) {
        this.resendVerificationLoader = true;

        try {
          const result = await this.resendEmailVerification();

          if (result.sent) {
            this.snackbarSuccess(`Verification email sent to ${account.email}`);
            this.resendVerificationLoader = false;
            this.verifyAccountDialog = false;
            return;
          }
          this.resendVerificationLoader = false;
        } catch ({ ...error }) {
          this.resendVerificationLoader = false;
        }
      },

      close() {
        this.$emit('close');
        document.getElementById('containerDiv').scrollTop = 0;
      },
    },
  };
</script>
