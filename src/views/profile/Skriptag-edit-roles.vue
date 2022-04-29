<template>
  <div>
    <v-container :fluid="$vuetify.breakpoint.lgAndDown" class="pa-10">
      <v-card ref="content" class="mx-auto transparent" flat min-height="35vh">
        <v-card-actions v-if="$vuetify.breakpoint.smAndUp">
          <v-text-field
            v-model="search"
            placeholder="Search by role name"
            dark
            background-color="#212326"
            hide-details
            dense
            solo
          />
          <Base-button small class="ml-2" large @click="addRoleDialog = true"> Add role</Base-button>
          <vs-tooltip shadow circle color="#ccc">
            <!-- <Base-button small class="ml-2" large @click="listUsers()"> <v-icon> mdi-refresh</v-icon></Base-button> -->
            <template #tooltip> Reload </template>
          </vs-tooltip>

          <Base-button small class="ml-2" large> <v-icon> mdi-dots-vertical</v-icon></Base-button>
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

                  <td>{{ role.alias }}</td>
                  <td>{{ role.description }}</td>

                  <td>
                    <div class="d-flex justify-center">
                      <vs-tooltip shadow circle color="#ccc">
                        <v-menu absolute rounded="md">
                          <template #activator="{ on }">
                            <v-fade-transition>
                              <div v-if="role.hover">
                                <v-icon class="cursor-pointer ml-3" v-on="on">mdi-dots-vertical</v-icon>
                              </div>
                            </v-fade-transition>
                          </template>

                          <v-list dense dark color="#282830">
                            <v-list-item
                              v-for="item in rowActions"
                              :key="item.name"
                              :ripple="false"
                              link
                              @click="triggerFn(item.function)"
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
    <skriptag-edit-role-add-dialog v-model="addRoleDialog" @close="addRoleDialog = false" />
    <!-- <skriptag-edit-edit-role-dialog v-model="addRoleDialog" @close="addRoleDialog = false" /> -->
  </div>
</template>
<script>
  import { collection, onSnapshot } from 'firebase/firestore';
  import { call } from 'vuex-pathify';
  import { db } from '@/firebase/firebase';
  import SkriptagEditRoleAddDialog from './Skriptag-edit-roles-add-dialog';
  // import SkriptagEditRoleEditDialog from './Skriptag-edit-roles-edit-dialog';

  // Roles collection ref
  const colRef = collection(db, 'roles');

  export default {
    name: 'SkriptagEditRoles',
    components: {
      SkriptagEditRoleAddDialog,
    },
    data() {
      return {
        addRoleDialog: false,
        rowActions: [
          { name: 'Edit role', function: '' },
          { name: 'Delete role', function: '' },
        ],
        search: '',
        loadingSpinner: null,
        loading: false,
        roles: [],
        headers: [
          { text: 'Role', value: 'alias', align: 'left' },
          { text: 'Description', value: 'description', align: 'left' },
          { text: '', align: 'center', value: 'actions', width: '200px', sortable: false },
        ],
        selected: [],
      };
    },

    mounted() {
      this.getRolesSnaphot();
    },

    methods: {
      ...call('authentication', ['addRole']),

      // isSelected(uid) {
      //   return this.selected.some((user) => user.uid === uid) ? 'background: #303036' : '';
      // },

      triggerFn(fn, params) {
        this[fn](params);
      },

      getRolesSnaphot() {
        onSnapshot(colRef, (snapshot) => {
          const roles = [];
          snapshot.docs.forEach((doc) => {
            roles.push({ ...doc.data(), hover: false });
          });
          this.roles = roles;
        });
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
