<template>
  <div style="color: #ccc">
    <h1 class="mb-6">Account Setttings</h1>
    <ValidationObserver ref="accountEdit" slim>
      <form class="d-flex flex-column" @submit.prevent="validatePasswords()">
        <v-row>
          <v-col sm="6" md="6">
            <v-row no-gutters>
              <v-col cols="12">
                <h3 class="mb-2">Change password</h3>
              </v-col>

              <v-col cols="6">
                <v-btn tabindex="-1" :ripple="false" x-small color="white" class="ml-n2 mb-n2" plain>Current password</v-btn>
                <div class="py-2 pr-2">
                  <Validation-provider v-slot="{ invalid, errors }" slim name="current password" :rules="{ required: true }">
                    <vs-input
                      v-model="credentials.currentPassword"
                      type="password"
                      :danger="invalid"
                      maxlength="20"
                      block
                      placeholder="Current password"
                    >
                      <template #icon>
                        <v-icon dark>mdi-account</v-icon>
                      </template>
                      <template #message-danger> {{ errors[0] }} </template>
                    </vs-input>
                  </Validation-provider>
                </div>
              </v-col>
              <v-col sm="6"></v-col>
              <v-col cols="6">
                <v-btn tabindex="-1" :ripple="false" x-small color="white" class="ml-n2 mt-7 mb-n2" plain>New Password</v-btn>
                <div class="py-2 pr-2">
                  <Validation-provider
                    v-slot="{ invalid, errors }"
                    slim
                    name="new password"
                    :rules="{ required: true, confirmed: 'confirmation' }"
                    mode="passive"
                  >
                    <vs-input
                      v-model="credentials.newPassword"
                      type="password"
                      :danger="invalid"
                      maxlength="20"
                      block
                      placeholder="New password"
                      :progress="getPasswordComplexity(credentials.newPassword)"
                    >
                      <template #icon>
                        <v-icon dark>mdi-account</v-icon>
                      </template>
                      <template #message-danger> {{ errors[0] }} </template>
                    </vs-input>
                  </Validation-provider>
                </div>
              </v-col>
              <v-col cols="6">
                <v-btn tabindex="-1" :ripple="false" x-small color="white" class="ml-n2 mt-7 mb-n2" plain
                  >Repeat New Password</v-btn
                >
                <div class="py-2 pr-2">
                  <Validation-provider
                    v-slot="{ invalid, errors }"
                    slim
                    name="repeat new password"
                    :rules="{ required: true }"
                    vid="confirmation"
                    mode="passive"
                  >
                    <vs-input
                      v-model="credentials.newPasswordRepeat"
                      type="password"
                      :danger="invalid"
                      maxlength="20"
                      block
                      placeholder="Repeat New password"
                    >
                      <template #icon>
                        <v-icon dark>mdi-account</v-icon>
                      </template>
                      <template #message-danger> {{ errors[0] }} </template>
                    </vs-input>
                  </Validation-provider>
                </div>
              </v-col>
              <v-col cols="12">
                <div class="mt-8">
                  <v-btn :loading="loading" type="submit" dark small color="grey darken-3">Change password</v-btn>
                </div>
              </v-col>

              <v-col cols="12">
                <div class="mt-8">
                  <h3 class="mb-2">Remove account</h3>
                  <p>
                    <v-icon small style="color: #ccc">mdi-help-circle-outline</v-icon>
                    Removing your account will also remove everything related to it, like blog posts, comments, downloadable
                    content and so on. This action cannot be undone.
                  </p>
                </div>
              </v-col>

              <v-col cols="12">
                <v-btn class="" dark small color="#d45d52" @click="removeAccountDialog = true">Remove my account</v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <div class="mt-n3">
                  <v-divider class="my-4" style="background: #404040"></v-divider>
                  <v-btn class="mr-2 my-2" dark small color="grey" @click="cancel()">Close</v-btn>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </form>
    </ValidationObserver>
    <account-delete-dialog v-model="removeAccountDialog" @close="removeAccountDialog = false" />
  </div>
</template>
<script>
  import { call, sync, get } from 'vuex-pathify';
  import AccountDeleteDialog from './Account-delete-dialog.vue';
  // import { cloneDeep, merge } from 'lodash';

  export default {
    name: 'AccountEdit',
    components: { AccountDeleteDialog },

    data() {
      return {
        credentials: {
          currentPassword: '',
          newPassword: '',
          newPasswordRepeat: '',
        },
        removeAccountCurrentPassowrd: '',
        removeAccountDialog: false,
      };
    },

    computed: {
      loading: sync('loaders/authLoader'),
      ...get('authentication', ['getPasswordComplexity']),
    },

    methods: {
      ...call('authentication', ['accountResetPassword']),
      ...call('snackbar/*'),

      async validatePasswords() {
        try {
          const validated = await this.$refs.accountEdit.validate();
          if (validated) {
            this.accountResetPassword({ credentials: this.credentials });
          } else {
            this.snackbarError('Please correct the fields in red');
          }
        } catch (error) {
          this.snackbarError('Something went wrong ');
        }
      },

      cancel() {
        this.$emit('close');
        document.getElementById('divContainer').scrollTop = 0;
      },
    },
  };
</script>
