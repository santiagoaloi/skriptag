<template>
  <BaseDialog v-model="internalValue" no-toolbar dense close-only no-actions width="500" @close="close()">
    <v-card-title class="text-h5"> Add new role</v-card-title>

    <ValidationObserver ref="addRole" slim>
      <v-card-text class="mt-n6">
        <v-row>
          <v-col cols="12">
            <small class="ml-1">Role name</small>
            <div class="pr-2 py-1">
              <Validation-provider
                v-slot="{ failed, errors }"
                v-bind="{ ...vvOptions }"
                name="role name"
                :rules="{ required: true }"
              >
                <vs-input v-model="role.name" :danger="failed" block placeholder="Role name" @focus="resetValidation()">
                  <template #icon>
                    <v-icon dark>mdi-account-cog</v-icon>
                  </template>
                  <template #message-danger>
                    <v-icon v-if="failed" color="pink" style="margin-top: -1px" x-small dark>mdi-alert-circle-outline</v-icon>
                    {{ errors[0] }}
                  </template>
                </vs-input>
              </Validation-provider>
            </div>
          </v-col>
          <v-col cols="12">
            <small class="ml-1">Role description</small>
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
                    <v-icon dark>mdi-account-cog</v-icon>
                  </template>
                  <template #message-danger>
                    <v-icon v-if="failed" color="pink" style="margin-top: -1px" x-small dark>mdi-alert-circle-outline</v-icon>
                    {{ errors[0] }}
                  </template>
                </vs-input>
              </Validation-provider>
            </div>
          </v-col>

          <v-col cols="12">
            <small class="ml-1">Capabilities</small>
            <div class="pr-2 py-1">
              <vs-select v-model="role.capabilities" collapse-chips filter multiple color="#3a3f50">
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
        <v-btn color="teal" text @click="validateAddRole()"> Add </v-btn>
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
    capabilities: '',
  });

  export default {
    name: 'SkriptagEditRoleAddDialog',
    props: {
      value: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        cap: [],
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

    methods: {
      ...call('authentication', ['addRole']),
      ...call('snackbar/*'),

      resetValidation() {
        this.$refs.addRole.reset();
      },

      async validateAddRole() {
        try {
          const validated = await this.$refs.addRole.validate();
          if (validated) {
            const { role } = this;
            this.addRole({ role });
            this.close();
            this.snackbarSuccess('Role added successfully');

            return;
          }
          this.snackbarError('Please correct the fields in red');
        } catch (error) {
          this.snackbarError('something went wrong ');
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
