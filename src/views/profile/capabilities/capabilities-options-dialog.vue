<template>
  <BaseDialog v-model="internalValue" no-toolbar dense close-only no-actions width="500" @close="close()">
    <v-card-title class="text-h5"> Add new capability</v-card-title>

    <ValidationObserver ref="addCapability" slim>
      <form class="d-flex flex-column" @submit.prevent="validateaddCapability()">
        <v-card-text class="mt-n6">
          <v-row>
            <v-col cols="12">
              <small class="ml-1">Capability name</small>
              <div class="pr-2 py-1">
                <Validation-provider
                  v-slot="{ failed, errors }"
                  v-bind="{ ...vvOptions }"
                  name="capability name"
                  :rules="{ required: true }"
                >
                  <vs-input
                    v-model="capability.name"
                    :danger="failed"
                    block
                    placeholder="Capability name"
                    @focus="resetValidation()"
                  >
                    <template #icon>
                      <v-icon dark>$mdiAccount-cog</v-icon>
                    </template>
                    <template #message-danger>
                      <v-icon v-if="failed" color="pink" style="margin-top: -1px" x-small dark>$mdiAlertCircleOutline</v-icon>
                      {{ errors[0] }}
                    </template>
                  </vs-input>
                </Validation-provider>
              </div>
            </v-col>
            <v-col cols="12">
              <small class="ml-1">Capability description</small>
              <div class="pr-2 py-1">
                <Validation-provider
                  v-slot="{ failed, errors }"
                  v-bind="{ ...vvOptions }"
                  name="capability description"
                  :rules="{ required: true }"
                >
                  <vs-input
                    v-model="capability.description"
                    :danger="failed"
                    block
                    placeholder="Capability description"
                    @focus="resetValidation()"
                  >
                    <template #icon>
                      <v-icon dark>$mdiAccount-cog</v-icon>
                    </template>
                    <template #message-danger>
                      <v-icon v-if="failed" color="pink" style="margin-top: -1px" x-small dark>$mdiAlertCircleOutline</v-icon>
                      {{ errors[0] }}
                    </template>
                  </vs-input>
                </Validation-provider>
              </div>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions class="px-6">
          <v-spacer></v-spacer>
          <v-btn color="grey lighten-1" text @click.prevent="close()"> Cancel </v-btn>
          <v-btn color="teal" text type="submit"> Add </v-btn>
        </v-card-actions>
      </form>
    </ValidationObserver>
  </BaseDialog>
</template>
<script>
  import { call } from 'vuex-pathify';

  export default {
    name: 'CapabilitiesOptionsDialog',
    props: {
      value: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        vvOptions: {
          mode: 'passive',
          slim: true,
        },
        capability: {
          name: '',
          description: '',
        },
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
      ...call('authentication', ['addCapability']),
      ...call('snackbar/*'),

      resetValidation() {
        this.$refs.addCapability.reset();
      },

      async validateaddCapability() {
        try {
          const validated = await this.$refs.addCapability.validate();
          if (validated) {
            const { capability } = this;
            this.addCapability({ capability });
            this.snackbarSuccess('Capability added successfully');
            this.close();
            return;
          }
          this.snackbarError('Please correct the fields in red');
        } catch (error) {
          this.snackbarError('something went wrong ');
        }
      },

      close() {
        this.$emit('close');
        this.resetValidation();
      },
    },
  };
</script>
