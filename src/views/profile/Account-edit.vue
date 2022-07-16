<template>
  <div>
    <ValidationObserver ref="accountEdit" slim>
      <form class="d-flex flex-column" @submit.prevent="validatePasswords()">
        <v-row no-gutters>
          <v-col cols="12" sm="6" md="4">
            <v-row>
              <template v-if="!isAuthExternalProviderOnly">
                <v-col cols="12">
                  <BaseTitleDivider>Change Password</BaseTitleDivider>
                </v-col>

                <v-col cols="12">
                  <Base-field-title> Old Password</Base-field-title>
                  <Validation-provider
                    v-slot="{ errors, failed }"
                    v-bind="{ ...vvOptions }"
                    name="current password"
                    :rules="{ required: false }"
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
                        <v-icon dark>$mdiAccount</v-icon>
                      </template>
                      <template #message-danger>
                        <v-icon v-if="failed" color="pink" style="margin-top: -1px" x-small dark>$mdiAlertCircleOutline</v-icon>
                        {{ errors[0] }}
                      </template>
                    </vs-input>
                  </Validation-provider>
                </v-col>
                <v-col cols="12">
                  <Base-field-title> New Password</Base-field-title>
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
                        <v-icon dark>$mdiLock</v-icon>
                      </template>
                      <template #message-danger>
                        <v-icon v-if="failed" color="pink" style="margin-top: -1px" x-small dark>$mdiAlertCircleOutline</v-icon>
                        {{ errors[0] }}
                      </template>
                    </vs-input>
                  </Validation-provider>
                </v-col>
                <v-col cols="12">
                  <Base-field-title> Confirm Password</Base-field-title>
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
                        <v-icon dark>$mdiLock</v-icon>
                      </template>
                      <template #message-danger>
                        <v-icon v-if="failed" color="pink" style="margin-top: -1px" x-small dark>$mdiAlertCircleOutline</v-icon>
                        {{ errors[0] }}
                      </template>
                    </vs-input>
                  </Validation-provider>
                </v-col>

                <v-col cols="12">
                  <div class="mt-4">
                    <BaseButton :loading="loading" type="submit">
                      <v-icon left> $mdiRefresh</v-icon><span>Update password </span>
                    </BaseButton>
                  </div>
                </v-col>
              </template>

              <template v-if="!verified">
                <v-col cols="12">
                  <div class="mt-4">
                    <BaseTitleDivider danger>Resend verification email</BaseTitleDivider>
                    <p>
                      <v-icon small style="color: #ccc">$mdiHelpCircleOutline</v-icon>
                      Check your junk folder, sometimes emails can get lost.
                    </p>
                  </div>
                </v-col>
                <v-col cols="12">
                  <BaseButton :loading="resendVerificationLoader" @click="verifyAccountDialog = true">
                    <v-icon left> $mdiRefresh</v-icon><span>Resend verification email </span>
                  </BaseButton>
                </v-col>
              </template>

              <v-col cols="12">
                <div class="mt-4">
                  <BaseTitleDivider danger>Delete Account</BaseTitleDivider>
                  <p>
                    <v-icon small style="color: #ccc">$mdiHelpCircleOutline</v-icon>
                    Once you delete your account, there is no going back. Please be certain. Any uploaded media will be
                    inmediately removed from our servers.
                  </p>
                </div>
              </v-col>

              <v-col cols="12">
                <BaseButton danger :loading="removeAccountLoader" @click="triggerDeleteAccount()">
                  <v-icon :left="$vuetify.breakpoint.lgAndUp"> $mdiDeleteOutline</v-icon>
                  <span v-if="$vuetify.breakpoint.xs || (!$vuetify.breakpoint.md && !$vuetify.breakpoint.sm) || verified">
                    Delete your account</span
                  >
                </BaseButton>
              </v-col>
              <v-col cols="12">
                <v-divider class="my-4" style="background: #404040"></v-divider>
                <BaseButton @click="close()">
                  <v-icon left class="mr-2" small>$mdiClose</v-icon>
                  Close
                </BaseButton>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </form>
    </ValidationObserver>
    <base-authenticate-dialog
      v-if="removeAccountDialog"
      v-model="removeAccountDialog"
      :title="accountRemoveTitle()"
      :text="accountRemoveText()"
      :loading="removeAccountLoader"
      @close="removeAccountDialog = false"
      @authenticated="removeAccount"
    />
    <base-authenticate-dialog
      v-if="verifyAccountDialog"
      v-model="verifyAccountDialog"
      :title="accountVerificationTitle()"
      :text="accountVerificationText()"
      :loading="resendVerificationLoader"
      @close="verifyAccountDialog = false"
      @authenticated="sendVerificationEmail"
    />

    <base-warning-remove-dialog
      v-if="warningRemoveDialog"
      v-model="warningRemoveDialog"
      :title="accountRemoveTitle()"
      :text="accountRemoveText()"
      :email="userEmail"
      :loading="removeAccountLoader"
      @close="warningRemoveDialog = false"
      @validated="removeAccountSkipAuthentication()"
    />
  </div>
</template>
<script>
  import { call, sync, get } from 'vuex-pathify';

  export default {
    name: 'AccountEdit',

    data() {
      return {
        removeAccountLoader: false,
        verifyAccountDialog: false,
        removeAccountDialog: false,
        warningRemoveDialog: false,
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
      ...get('authentication', ['getPasswordComplexity', 'verified', 'isAuthExternalProviderOnly', 'userEmail']),
      ...sync('loaders', ['resendVerificationLoader']),
    },

    methods: {
      ...call('authentication', ['accountResetPassword', 'deleteAccountByEmail', 'resendEmailVerification', 'logout']),
      ...call('snackbar/*'),

      triggerDeleteAccount() {
        if (!this.isAuthExternalProviderOnly) {
          this.removeAccountDialog = true;
          return;
        }

        this.warningRemoveDialog = true;
      },

      removeAccountSkipAuthentication() {
        const account = { email: this.userEmail };
        this.removeAccount(account);
      },

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
            this.snackbarError('Please correct the fields highlighted in red');
          }
        } catch (error) {
          this.snackbarError('Something went wrong ');
        }
      },

      accountRemoveTitle() {
        return 'Remove my account';
      },

      accountRemoveText() {
        return 'This action is permament, you will not be able to undo it.';
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
        this.removeAccountLoader = true;

        try {
          const result = await this.deleteAccountByEmail(account.email);

          if (result.removed) {
            this.logout();
            this.snackbarSuccess(`${account.email} removed.`);
            this.removeAccountLoader = false;
            this.removeAccountDialog = false;
            return;
          }
          this.removeAccountLoader = false;
        } catch ({ ...error }) {
          console.log(error.code);
          this.removeAccountLoader = false;
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
          console.log(error.code);
          this.resendVerificationLoader = false;
        }
      },

      close() {
        this.$router.push('/profile');
        window.scrollTo(0, 0);
      },
    },
  };
</script>
