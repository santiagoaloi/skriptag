<template>
  <BaseDialog v-model="internalValue" no-toolbar dense close-only no-actions width="500" @close="close()">
    <v-card-title class="text-h5"> Assign roles</v-card-title>

    <ValidationObserver ref="addRole" slim>
      <v-card-text class="mt-n6">
        <v-row>
          <v-col cols="12">
            <small class="ml-1">Roles</small>
            <div class="pr-2 py-1">
              <vs-select v-model="roles" collapse-chips filter multiple color="#3a3f50">
                <vs-option v-for="role in allRoles" :key="role" :label="role" :value="role">
                  {{ role }}
                </vs-option>
              </vs-select>
            </div>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions class="px-6">
        <v-spacer></v-spacer>
        <v-btn color="grey lighten-1" text @click.prevent="close()"> Cancel </v-btn>
        <v-btn color="teal" text @click="assignRoles()"> Assign </v-btn>
      </v-card-actions>
    </ValidationObserver>
  </BaseDialog>
</template>
<script>
  import { sync, get } from 'vuex-pathify';

  export default {
    name: 'UserRolesDialog',
    props: {
      value: {
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
        roles: [],
        internalValue: this.value,
      };
    },

    computed: {
      ...sync('authentication', ['capabilities']),
      ...get('authentication', ['allRoles']),
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
      if (this.payload.roles?.length) {
        this.roles = this.payload.roles;
      }
    },
    methods: {
      async assignRoles() {
        this.$emit('save', { ...this.payload, roles: [...this.roles] });
      },

      close() {
        this.$emit('close');
      },
    },
  };
</script>
