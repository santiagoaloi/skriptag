<template>
  <BaseDialog v-model="internalValue" no-toolbar dense close-only no-actions width="500" @close="cancel()">
    <v-card-title class="text-h5"> Send verification email</v-card-title>
    <v-card-text>Enter your current password. </v-card-text>

    <ValidationObserver ref="passwordField" slim>
      <form class="d-flex flex-column" @submit.prevent="validatePassword()">
        <v-card-text class="mt-n6">
          <v-btn tabindex="-1" :ripple="false" x-small color="white" class="ml-n2 mb-n2" plain>Password</v-btn>
          <div class="py-2 pr-2">
            <Validation-provider v-slot="{ invalid, errors }" slim name="current password" :rules="{ required: true }">
              <vs-input v-model="password" :danger="invalid" type="password" block placeholder="Current account password">
                <template #icon>
                  <v-icon dark>mdi-lock</v-icon>
                </template>
                <template #message-danger> {{ errors[0] }} </template>
              </vs-input>
            </Validation-provider>
          </div>
        </v-card-text>

        <v-card-actions class="px-6">
          <v-spacer></v-spacer>
          <v-btn color="grey lighten-1" text @click.prevent="cancel()"> Cancel </v-btn>
          <v-btn :loading="loading" color="#de355f" text type="submit"> continue </v-btn>
        </v-card-actions>
      </form>
    </ValidationObserver>
  </BaseDialog>
</template>
<script>
  import { call, sync } from 'vuex-pathify';
  // import { cloneDeep, merge } from 'lodash';

  export default {
    name: 'AccountVerifyDialog',

    props: {
      value: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        internalValue: this.value,
        password: '',
      };
    },

    computed: {
      loading: sync('loaders/verifyLoader'),
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
      ...call('authentication', ['resendActivationEmail']),
      ...call('snackbar/*'),

      async validatePassword() {
        try {
          const validated = await this.$refs.passwordField.validate();
          if (validated) {
            this.resendActivationEmail(this.password);
            return;
          }
          this.snackbarError('Please correct the fields in red');
        } catch (error) {
          this.snackbarError('something went wrong ');
        }
      },

      cancel() {
        this.$emit('close');
        document.getElementById('divContainer').scrollTop = 0;
      },
    },
  };
</script>
