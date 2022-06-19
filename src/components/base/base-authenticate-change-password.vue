<template>
  <BaseDialog v-model="internalValue" no-toolbar dense close-only no-actions width="500" @close="close()">
    <v-card-title class="text-h5"> {{ title }}</v-card-title>
    <v-card-text>{{ text }}</v-card-text>

    <ValidationObserver ref="passwordField" slim>
      <form class="d-flex flex-column" @submit.prevent="validatePassword()">
        <v-card-text class="mt-n6">
          <Base-field-title> Password</Base-field-title>
          <v-row>
            <v-col cols="12">
              <div v class="py-2 pr-2">
                <Validation-provider
                  v-slot="{ failed, errors }"
                  v-bind="{ ...vvOptions }"
                  name="current password"
                  :rules="{ required: true }"
                >
                  <vs-input
                    v-model="password"
                    :danger="failed"
                    type="password"
                    block
                    placeholder="Your account password"
                    :disabled="loading"
                    @focus="resetValidation()"
                  >
                    <template #icon>
                      <v-icon dark> $mdiLock </v-icon>
                    </template>
                    <template #message-danger>
                      <v-icon v-if="failed" color="pink" style="margin-top: -1px" x-small dark> $mdiAlertCircleOutline </v-icon>
                      {{ errors[0] }}
                    </template>
                  </vs-input>
                </Validation-provider>
              </div>
            </v-col>
            <v-col cols="12" lg="6">
              <Base-field-title> New Password</Base-field-title>
              <div class="pr-2">
                <Validation-provider
                  v-slot="{ errors, failed }"
                  v-bind="{ ...vvOptions }"
                  name="password"
                  :rules="{ required: true, confirmed: 'confirmation' }"
                >
                  <vs-input
                    v-model="newPassword"
                    :disabled="loading"
                    maxlength="100"
                    :danger="failed"
                    block
                    type="password"
                    placeholder="At least 6 characters"
                    :progress="!failed ? getPasswordComplexity(newPassword) : null"
                    @focus="resetValidation()"
                  >
                    <template #icon>
                      <v-icon dark>$mdiLock </v-icon>
                    </template>

                    <template #message-danger>
                      <v-icon v-if="failed" color="pink" style="margin-top: -1px" x-small dark>{{
                        $mdiAlertCircleOutline
                      }}</v-icon>
                      {{ errors[0] }}
                    </template>
                  </vs-input>
                </Validation-provider>
              </div>
            </v-col>
            <v-col cols="12" lg="6">
              <Base-field-title> Confirm Password</Base-field-title>
              <div class="pr-2">
                <Validation-provider
                  v-slot="{ errors, failed }"
                  v-bind="{ ...vvOptions }"
                  name="password'"
                  :rules="{ required: true }"
                  vid="confirmation"
                >
                  <vs-input
                    v-model="newPasswordRepeat"
                    :disabled="loading"
                    maxlength="100"
                    :danger="failed"
                    block
                    type="password"
                    placeholder="Repeat password"
                    @focus="resetValidation()"
                  >
                    <template #icon>
                      <v-icon dark> $mdiLock </v-icon>
                    </template>

                    <template #message-danger>
                      <v-icon v-if="failed" color="pink" style="margin-top: -1px" x-small dark>{{
                        $mdiAlertCircleOutline
                      }}</v-icon>
                      {{ errors[0] }}
                    </template>
                  </vs-input>
                </Validation-provider>
              </div>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions class="px-6 mt-5">
          <v-spacer></v-spacer>
          <BaseButton :disabled="loading" text @click.prevent="close()"> Close</BaseButton>
          <BaseButton class="ml-3" :loading="loading" type="submit"> Continue</BaseButton>
        </v-card-actions>
      </form>
    </ValidationObserver>
  </BaseDialog>
</template>
<script>
  import { call, get } from 'vuex-pathify';

  export default {
    name: 'BaseAuthenticateChangePasswordDialog',

    props: {
      value: {
        type: Boolean,
        default: false,
      },
      title: {
        type: String,
        default: '',
      },
      text: {
        type: String,
        default: '',
      },

      payload: {
        type: [Boolean, String, Object, Array],
        default: null,
      },
    },

    data() {
      return {
        vvOptions: {
          mode: 'passive',
          slim: true,
        },
        password: '',
        newPassword: '',
        newPasswordRepeat: '',
        internalValue: this.value,
        loading: false,
      };
    },

    computed: {
      ...get('authentication', ['getPasswordComplexity']),
    },

    watch: {
      internalValue(val, oldVal) {
        if (val === oldVal) return; // Don't do anything.
        this.$emit('input', val); // emit input change to v-model
      },

      value(val, oldVal) {
        if (val === oldVal) return;
        this.internalValue = val;
      },
    },

    methods: {
      ...call('snackbar/*'),
      ...call('authentication', ['reAuthenticate', 'changeUserPasswordByEmail']),

      resetValidation() {
        this.$refs.passwordField.reset();
      },

      async validatePassword() {
        try {
          const validated = await this.$refs.passwordField.validate();
          if (validated) {
            this.loading = true;

            // Returns the authenticated user.
            const authenticated = await this.reAuthenticate(this.password);

            if (authenticated) {
              const payload = { email: this.payload.email, password: this.newPassword };
              const result = await this.changeUserPasswordByEmail({ payload });
              if (result.changed) {
                this.password = '';
                this.newPassword = '';
                this.newPasswordRepeat = '';
                this.loading = false;
                this.$emit('authenticatedWithPayload', { result: { email: this.payload.email, changed: true } });
                return;
              }
              return;
            }
            this.loading = false;
          }
        } catch ({ ...error }) {
          this.loading = false;
          if (error.code.includes('auth/wrong-password')) {
            this.snackbarError('Incorrect password , please try again.');
          }

          if (error.code.includes('auth/too-many-requests')) {
            this.snackbarError('Too many attempts, try again later.');
          }
        }
      },

      close() {
        this.$emit('close');
      },
    },
  };
</script>
