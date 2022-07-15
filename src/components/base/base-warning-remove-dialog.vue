<template>
  <BaseDialog v-model="internalValue" no-container no-toolbar dense close-only no-actions width="500" @close="close()">
    <v-card class="bg-dialog py-4">
      <h2 class="mx-3">{{ title }}</h2>
      <h5 class="mx-3 pt-2 white--text">{{ text }}</h5>
    </v-card>

    <ValidationObserver ref="emailField" slim>
      <form class="d-flex flex-column pt-6" @submit.prevent="validateEmail()">
        <v-card-text class="mt-n6">
          <Base-field-title> Enter this account email to confirm</Base-field-title>
          <div class="py-2 pr-2">
            <Validation-provider
              v-slot="{ failed, errors }"
              v-bind="{ ...vvOptions }"
              name="Account email"
              :rules="{ is: email }"
            >
              <vs-input
                v-model="accountEmail"
                :danger="failed"
                block
                placeholder="Account email"
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

          <BaseButton :disabled="loading" text @click.prevent="close()"> Close</BaseButton>
          <BaseButton danger class="ml-3" :loading="loading" type="submit"> Remove</BaseButton>
        </v-card-actions>
      </form>
    </ValidationObserver>
  </BaseDialog>
</template>
<script>
  import { call } from 'vuex-pathify';

  export default {
    name: 'BaseWarningRemoveDialog',

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
      email: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        vvOptions: {
          mode: 'passive',
          slim: true,
        },
        accountEmail: '',
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

      resetValidation() {
        this.$refs.emailField.reset();
      },

      async validateEmail() {
        try {
          const validated = await this.$refs.emailField.validate();
          if (validated) {
            this.$emit('validated');
          }
        } catch ({ ...error }) {}
      },

      close() {
        this.$emit('close');
      },
    },
  };
</script>

<style scoped>
  .bg-dialog {
    background-color: #952e3d;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cpolygon fill='%23000' fill-opacity='.1' points='120 0 120 60 90 30 60 0 0 0 0 0 60 60 0 120 60 120 90 90 120 60 120 0'/%3E%3C/svg%3E");
  }
</style>
