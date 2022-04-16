<template>
  <BaseDialog v-model="internalValue" no-toolbar dense close-only no-actions width="500" @close="close()">
    <v-card-title class="text-h5"> Account removal</v-card-title>
    <v-card-text>This action is permament, you will not be able to undo it.</v-card-text>
    <v-card-text class="mt-n6">
      If you prefer to disable your account. it will only be re-enabled if you login again in the future.
    </v-card-text>
    <v-card-text class="mt-n4" t>If you want to read what a disable account does, check the <a>#FAQ</a> </v-card-text>

    <ValidationObserver ref="passwordField" slim>
      <form class="d-flex flex-column" @submit.prevent="validatePassword()">
        <v-card-text class="mt-n6">
          <v-btn tabindex="-1" :ripple="false" x-small color="white" class="ml-n2 mb-n2" plain>Password</v-btn>
          <div class="py-2 pr-2">
            <Validation-provider v-slot="{ invalid, errors }" slim name="current password" :rules="{ required: true }">
              <vs-input
                v-model="removeAccountCurrentPassowrd"
                :danger="invalid"
                type="password"
                block
                placeholder="Current account password"
              >
                <template #icon>
                  <v-icon dark>mdi-account</v-icon>
                </template>
                <template #message-danger> {{ errors[0] }} </template>
              </vs-input>
            </Validation-provider>
          </div>
        </v-card-text>

        <v-card-actions class="px-6">
          <v-spacer></v-spacer>
          <v-btn color="grey lighten-1" text @click="cancel()"> Cancel </v-btn>
          <v-btn color="grey lighten-1" text @click="cancel()"> Disable </v-btn>
          <v-btn :loading="loading" color="#de355f" text type="submit"> Remove </v-btn>
        </v-card-actions>
      </form>
    </ValidationObserver>
  </BaseDialog>
</template>
<script>
  import { call, sync } from 'vuex-pathify';
  // import { cloneDeep, merge } from 'lodash';

  export default {
    name: 'AccountDeleteDialog',

    props: {
      value: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        removeAccountCurrentPassowrd: '',
        internalValue: this.value,
      };
    },

    computed: {
      loading: sync('loaders/authLoader'),
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
      ...call('authentication', ['removeAccount']),
      ...call('snackbar/*'),

      async validatePassword() {
        try {
          const validated = await this.$refs.passwordField.validate();
          if (validated) {
            this.removeAccount(this.removeAccountCurrentPassowrd);
          } else {
            this.snackbarError('Please correct the fields in red');
          }
        } catch (error) {
          this.snackbarError('Something did not go right ');
        }
      },

      cancel() {
        this.$emit('close');
        document.getElementById('divContainer').scrollTop = 0;
      },
    },
  };
</script>
