<template>
  <BaseDialog v-model="internalValue" no-toolbar dense close-only no-actions width="500" @close="close()">
    <v-card-title class="text-h5"> {{ title }}</v-card-title>
    <v-card-text>{{ text }}</v-card-text>
    <v-card-subtitle class="mt-n9"> Enter your password to allow this.</v-card-subtitle>
    <ValidationObserver ref="passwordField" slim>
      <form class="d-flex flex-column" @submit.prevent="validatePassword()">
        <v-card-text class="mt-n6">
          <v-btn tabindex="-1" :ripple="false" x-small color="white" class="ml-n2 mb-n2" plain>Password</v-btn>
          <div class="py-2 pr-2">
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
                  <v-icon dark>$mdiLock </v-icon>
                </template>
                <template #message-danger>
                  <v-icon v-if="failed" color="pink" style="margin-top: -1px" x-small dark> $mdiAlertCircleOutline </v-icon>
                  {{ errors[0] }}
                </template>
              </vs-input>
            </Validation-provider>
          </div>
        </v-card-text>

        <v-card-actions class="px-6">
          <v-spacer></v-spacer>
          <v-btn :disabled="loading" color="grey lighten-1" text @click.prevent="close()"> Close </v-btn>
          <v-btn :loading="loading" color="#de355f" text type="submit"> Continue </v-btn>
        </v-card-actions>
      </form>
    </ValidationObserver>
  </BaseDialog>
</template>
<script>
  import { call } from 'vuex-pathify';

  export default {
    name: 'BaseAuthenticateDialog',

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
      loading: {
        type: Boolean,
        default: false,
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
        internalValue: this.value,
      };
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
      ...call('authentication', ['reAuthenticate']),

      resetValidation() {
        this.$refs.passwordField.reset();
      },

      async validatePassword() {
        try {
          const validated = await this.$refs.passwordField.validate();
          if (validated) {
            // Returns the authenticated user.
            const authenticated = await this.reAuthenticate(this.password);

            if (authenticated) {
              this.$emit('authenticated', authenticated);
              this.$emit('authenticatedWithPayload', this.payload);
              this.password = '';
              return;
            }
          }
        } catch ({ ...error }) {
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
