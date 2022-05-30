<template>
  <div>
    <v-container :fluid="$vuetify.breakpoint.lgAndDown">
      <v-card ref="content" class="mx-auto transparent" flat min-height="35vh">
        <v-card-actions v-if="$vuetify.breakpoint.smAndUp">
          <v-text-field
            v-model="search"
            placeholder="Search by role name"
            dark
            background-color="#1c1e24"
            hide-details
            dense
            solo
          />
          <Base-button small class="ml-2" large @click="roleDialog = true"> Add role</Base-button>
          <vs-tooltip shadow circle color="#ccc">
            <template #tooltip> Reload </template>
          </vs-tooltip>

          <Base-button small class="ml-2" large> <v-icon> $mdiDotsVertical</v-icon></Base-button>
        </v-card-actions>
        <v-fade-transition>
          <v-data-table
            v-if="!loading"
            v-model="selected"
            show-select
            tile
            class="solidBackground selectable"
            dark
            :headers="headers"
            :items="roles"
            :items-per-page="5"
            item-key="uid"
          >
            <template #body="{}">
              <tbody>
                <tr v-for="role in roles" :key="role.name" @mouseleave="role.hover = false" @mouseenter="role.hover = true">
                  <td>
                    <v-checkbox v-model="selected" multiple :value="role" style="margin: 0px; padding: 0px" hide-details />
                  </td>

                  <td>{{ role.name }}</td>
                  <td>{{ role.description }}</td>

                  <td>
                    <div class="d-flex justify-center">
                      <vs-tooltip shadow circle color="#ccc">
                        <v-menu absolute rounded="md">
                          <template #activator="{ on }">
                            <v-fade-transition>
                              <div v-if="role.hover">
                                <v-icon class="cursor-pointer ml-3" v-on="on">$mdiDotsVertical</v-icon>
                              </div>
                            </v-fade-transition>
                          </template>

                          <v-list dense dark color="#282830">
                            <v-list-item
                              v-for="item in rowActions"
                              :key="item.name"
                              :ripple="false"
                              link
                              @click="triggerFn(item.function, role)"
                            >
                              <v-list-item-title v-text="item.name" />
                            </v-list-item>
                          </v-list>
                        </v-menu>
                        <template #tooltip> View more options </template>
                      </vs-tooltip>
                    </div>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-data-table>
        </v-fade-transition>
      </v-card>
    </v-container>
    <role-options-dialog
      v-if="roleDialog"
      v-model="roleDialog"
      :payload="isEditing ? payload : {}"
      :is-editing="isEditing"
      @save="saveRole"
      @close="closeOptionsDialog()"
    />

    <base-authenticate-dialog
      v-if="roleDialogAuth"
      v-model="roleDialogAuth"
      :title="isEditing ? editRoleTitle() : removeRoleTitle()"
      :text="isEditing ? editRoleText() : removeRoleText()"
      :payload="payload"
      :loading="roleLoader"
      @close="
        roleDialogAuth = false;
        isEditing = false;
      "
      @authenticatedWithPayload="onAuthenticatedAction"
    />
  </div>
</template>
<script>
  import { call, sync } from 'vuex-pathify';
  import RoleOptionsDialog from './role-options-dialog';

  export default {
    name: 'Roles',
    components: {
      RoleOptionsDialog,
    },
    data() {
      return {
        isEditing: false,
        payload: [],
        roleDialog: false,
        roleDialogAuth: false,
        rowActions: [
          { name: 'Edit role', function: 'editRoleTrigger' },
          { name: 'Remove role', function: 'removeRoleTrigger' },
        ],
        search: '',
        loading: false,
        roleLoader: false,
        headers: [
          { text: 'Role', value: 'name', align: 'left', width: '150px' },
          { text: 'Description', value: 'description', align: 'left' },
          { text: '', align: 'center', value: 'actions', width: '200px', sortable: false },
        ],
        selected: [],
      };
    },

    computed: {
      ...sync('authentication', ['roles']),
    },

    mounted() {
      this.getRolesSnaphot();
    },

    methods: {
      ...call('authentication', ['addRole', 'removeRole', 'editRole', 'getRolesSnaphot']),
      ...call('snackbar/*'),

      closeOptionsDialog() {
        this.roleDialog = false;
        this.payload = {};
        this.isEditing = false;
      },

      removeRoleTitle() {
        return 'Remove role';
      },

      removeRoleText() {
        return 'This will also remove the role from any users that has this role assigned to it.';
      },

      editRoleTitle() {
        return 'Edit role';
      },

      editRoleText() {
        return 'Change this information.';
      },

      triggerFn(fn, params) {
        this[fn](params);
      },

      removeRoleTrigger(role) {
        this.payload = role;
        this.roleDialogAuth = true;
      },

      editRoleTrigger(role) {
        this.isEditing = true;
        this.payload = role;
        this.roleDialogAuth = true;
      },

      onAuthenticatedAction(role) {
        if (this.isEditing) {
          this.roleDialog = true;
          this.roleDialogAuth = false;
          return;
        }

        if (!this.isEditing) {
          this.removeRoleVuex(role);
        }
      },

      saveRole(role) {
        return this.isEditing ? this.editRoleVuex(role) : this.addRoleVuex(role);
      },

      async addRoleVuex(role) {
        this.roleLoader = true;
        const { name } = role;
        const result = await this.addRole({ role });

        if (result.added) {
          this.roleDialog = false;
          this.roleLoader = false;
          this.snackbarSuccess('Role added successfully');
          return;
        }

        this.snackbarError(`There was an error adding this role ${name}`);
        this.roleLoader = false;
      },

      async editRoleVuex(role) {
        this.roleLoader = true;
        const { name } = role;
        const result = await this.editRole(role);
        if (result.edited) {
          this.roleDialog = false;
          this.roleLoader = false;
          this.isEditing = false;
          this.snackbarSuccess(`${name} role saved successfully`);
          return;
        }

        this.snackbarError(`There was an error saving ${name}`);
        this.roleLoader = false;
        this.isEditing = false;
      },

      async removeRoleVuex(role) {
        this.roleLoader = true;
        const { name } = role;
        const result = await this.removeRole(name);
        if (result.removed) {
          this.payload = {};
          this.roleDialogAuth = false;
          this.roleLoader = false;
          this.snackbarSuccess(`${name} role removed successfully`);
          return;
        }

        this.snackbarError(`There was an error removing ${name}`);
        this.roleLoader = false;
      },
    },
  };
</script>
<style scoped>
  .theme--dark.v-data-table.solidBackground {
    background-color: #25272c !important;
    color: #ccc;
  }

  .v-data-table {
    border-radius: 0px;
  }

  tr.v-data-table__selected {
    background: red !important;
  }

  ::v-deep .vs-loading {
    --vs-background: transparent !important;
  }
</style>
