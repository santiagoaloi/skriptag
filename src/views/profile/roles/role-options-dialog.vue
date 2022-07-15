<template>
  <BaseDialog v-model="internalValue" no-toolbar dense close-only no-actions width="500" @close="close()">
    <v-card-title class="text-h5"> {{ isEditing ? 'Edit role' : 'Add new role' }} </v-card-title>

    <ValidationObserver ref="role" slim>
      <v-card-text class="mt-n6">
        <v-row>
          <v-col cols="6">
            <Base-field-title> Role Name</Base-field-title>
            <div class="pr-2 py-1">
              <Validation-provider
                v-slot="{ failed, errors }"
                v-bind="{ ...vvOptions }"
                name="role name"
                :rules="{ required: true }"
              >
                <vs-input
                  v-model="role.name"
                  :disabled="isEditing"
                  :danger="failed"
                  block
                  placeholder="Role name"
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
            <Base-field-title> Role Description</Base-field-title>
            <div class="pr-2 py-1">
              <Validation-provider
                v-slot="{ failed, errors }"
                v-bind="{ ...vvOptions }"
                name="role description"
                :rules="{ required: true }"
              >
                <vs-input
                  v-model="role.description"
                  :danger="failed"
                  block
                  placeholder="Role description"
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
            <Base-field-title> Role Capabilities</Base-field-title>
            <div class="pr-2 py-1">
              <vs-select
                v-model="role.capabilities"
                :disabled="!allCapabilities.length"
                collapse-chips
                filter
                multiple
                color="#3a3f50"
              >
                <vs-option v-for="capability in allCapabilities" :key="capability" :label="capability" :value="capability">
                  {{ capability }}
                </vs-option>
              </vs-select>
            </div>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions class="px-6">
        <v-spacer></v-spacer>
        <v-btn color="grey lighten-1" text @click.prevent="close()"> Cancel </v-btn>
        <v-btn color="teal" text @click="validateRole()"> Save</v-btn>
      </v-card-actions>
    </ValidationObserver>
  </BaseDialog>
</template>
<script>
  import { call, sync, get } from 'vuex-pathify';

  // Default role object
  // can be used to set back to default values.
  const defaultRole = () => ({
    name: '',
    description: '',
    capabilities: [],
  });

  export default {
    name: 'RoleOptionsDialog',
    props: {
      value: {
        type: Boolean,
        default: false,
      },

      payload: {
        type: [Boolean, String, Object, Array],
        default: null,
      },

      isEditing: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        loading: false,
        vvOptions: {
          mode: 'passive',
          slim: true,
        },
        role: defaultRole(),
        internalValue: this.value,
      };
    },

    computed: {
      ...sync('authentication', ['capabilities']),
      ...get('authentication', ['allCapabilities']),
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

    mounted() {
      if (this.isEditing) {
        const { name, description, capabilities } = this.payload;
        this.role = {
          name,
          description,
          capabilities,
        };
      }
    },

    methods: {
      ...call('authentication', ['addRole']),
      ...call('snackbar/*'),

      resetValidation() {
        this.$refs.role.reset();
      },

      async validateRole() {
        try {
          this.loading = true;
          const validated = await this.$refs.role.validate();
          if (validated) {
            this.$emit('save', this.role);
            return;
          }
          this.loading = false;
          this.snackbarError('Please correct the fields highlighted in red');
        } catch (error) {
          this.snackbarError('something went wrong ');
          this.loading = false;
        }
      },

      resetForm() {
        Object.assign(this.role, defaultRole());
      },

      close() {
        this.$emit('close');
        this.resetValidation();
        this.resetForm();
      },
    },
  };
</script>
