<template>
  <div>
    <ValidationObserver ref="accountEdit" slim>
      <form class="d-flex flex-column" @submit.prevent="validatePasswords()">
        <v-row no-gutters>
          <v-col cols="12" sm="6" md="4">
            <v-row>
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

              <v-col cols="12">
                <div class="mt-4">
                  <BaseTitleDivider danger>Delete Account</BaseTitleDivider>
                  <p>
                    <v-icon small style="color: #ccc">$mdiHelpCircleOutline</v-icon>
                    Removing your account will also remove everything related to it, like blog posts, comments, downloadable
                    content and so on. This action can't be undone.
                  </p>
                </div>
              </v-col>

              <v-col cols="12">
                <BaseButton style="color: #e5534b" :loading="loading" @click="removeAccountDialog = true">
                  <v-icon :left="$vuetify.breakpoint.lgAndUp"> $mdiDeleteOutline</v-icon>
                  <span v-if="$vuetify.breakpoint.xs || (!$vuetify.breakpoint.md && !$vuetify.breakpoint.sm) || verified">
                    Remove account</span
                  >
                </BaseButton>

                <BaseButton
                  v-if="!verified"
                  :class="{ 'ml-3': $vuetify.breakpoint.smAndUp, 'mt-3': !$vuetify.breakpoint.smAndUp }"
                  color="orange darken-3"
                  :loading="loading"
                  @click="verifyAccountDialog = true"
                >
                  <v-icon left> $mdiRefresh</v-icon><span>Resend verification email </span>
                </BaseButton>
              </v-col>
              <v-col cols="12">
                <v-divider class="my-4" style="background: #404040"></v-divider>
                <v-btn :ripple="false" class="mr-2 my-2" dark color="#1b1e25" @click="close()"
                  ><v-icon left>$mdiClose</v-icon>Close</v-btn
                >
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
      :loading="removeAccountLoader"
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
        removeAccountLoader: false,
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
      ...sync('loaders', ['resendVerificationLoader']),
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
            this.snackbarError('please correct the fields highlighted in red');
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
