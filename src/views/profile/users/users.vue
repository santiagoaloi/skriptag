<template>
  <div>
    <v-container :fluid="$vuetify.breakpoint.lgAndDown">
      <v-card ref="content" class="mx-auto transparent" flat min-height="35vh">
        <v-card-actions v-if="$vuetify.breakpoint.smAndUp">
          <v-text-field
            v-model="search"
            placeholder="Search by email adrress, or user ID"
            dark
            background-color="#1c1e24"
            hide-details
            dense
            solo
            autofocus
          />
          <Base-button small class="ml-2" large> Filters</Base-button>

          <Base-button small class="ml-2" large> Invite user</Base-button>
          <vs-tooltip shadow circle color="#ccc">
            <Base-button small class="ml-2" large @click="getUsersSnapshot()"> <v-icon> $mdiRefresh</v-icon></Base-button>
            <template #tooltip> Reload </template>
          </vs-tooltip>

          <Base-button small class="ml-2" large> <v-icon> $mdiDotsVertical</v-icon></Base-button>
        </v-card-actions>
        <v-fade-transition hide-on-leave>
          <v-data-table
            v-if="!loading && filteredUsers.length"
            v-model="selected"
            show-select
            tile
            class="solidBackground"
            dark
            :headers="headers"
            :items="users"
            :items-per-page="5"
            item-key="uid"
          >
            <template #body="{}">
              <tbody is="transition-group" hide-on-leave name="slide-y-transition">
                <tr
                  v-for="(user, i) in filteredUsers"
                  :key="i"
                  class="selectable"
                  :style="isSelected(user.uid)"
                  @mouseleave="user.hover = false"
                  @mouseenter="user.hover = true"
                >
                  <td>
                    <v-checkbox v-model="selected" multiple :value="user" style="margin: 0px; padding: 0px" hide-details />
                  </td>
                  <td class="py-4">
                    <vs-tooltip :not-hover="!user.verified && !user.disabled" shadow circle color="#ccc">
                      <v-badge :color="getStatusColor(user)" :icon="getStatusIcon(user)" overlap>
                        <baseAvatarImg v-if="!user.photoURL" class="hoverAvatar" :height="35" />
                        <v-avatar v-else size="35">
                          <v-img :src="user.photoURL" flat>
                            <template #placeholder>
                              <v-row class="fill-height ma-0" align="center" justify="center">
                                <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                              </v-row>
                            </template>
                          </v-img>
                        </v-avatar>
                      </v-badge>
                      <template #tooltip> {{ getTooltipMessage(user) }} </template>
                    </vs-tooltip>
                  </td>

                  <td>
                    {{ user.email }} <br />
                    {{ user.name }} {{ user.lastName }}
                  </td>
                  <td>{{ user.uid }}</td>

                  <td>
                    <div class="d-flex flex-wrap justify-center align-center">
                      <div
                        v-for="provider in user.authUser.providerData.flatMap((profile) => profile.providerId)"
                        :key="provider"
                      >
                        <template v-if="provider === 'google.com'">
                          <vs-tooltip top shadow circle color="#ccc">
                            <v-icon class="mx-1" small> $mdiGoogle</v-icon>
                            <template #tooltip> Google</template>
                          </vs-tooltip>
                        </template>

                        <template v-if="provider === 'password'">
                          <vs-tooltip top shadow circle color="#ccc">
                            <v-icon class="mx-1" small> $mdiEmail</v-icon>
                            <template #tooltip> Password</template>
                          </vs-tooltip>
                        </template>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div class="d-flex flex-wrap justify-center align-center">
                      <div v-for="role in user.roles" :key="role">
                        <vs-tooltip top shadow circle color="#ccc">
                          <v-avatar class="mx-1" size="25" color="#373c4c"> {{ role[0] }} </v-avatar>
                          <template #tooltip> {{ role }} </template>
                        </vs-tooltip>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div class="d-flex justify-center">
                      <vs-tooltip shadow circle color="#ccc">
                        <v-fade-transition>
                          <v-icon v-if="user.hover" class="cursor-pointer">$mdiContentCopy</v-icon>
                        </v-fade-transition>
                        <template #tooltip> Copy UID </template>
                      </vs-tooltip>

                      <vs-tooltip shadow circle color="#ccc">
                        <v-menu absolute rounded="md">
                          <template #activator="{ on }">
                            <v-fade-transition>
                              <div v-if="user.hover">
                                <v-icon class="cursor-pointer ml-3" v-on="on">$mdiDotsVertical</v-icon>
                              </div>
                            </v-fade-transition>
                          </template>

                          <v-list dense dark color="#282830">
                            <v-list-item
                              v-for="item in rowActions(user)"
                              :key="item.name"
                              :ripple="false"
                              link
                              :disabled="item.disabled"
                              @click="triggerFn({ account: { ...item, ...user } })"
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

        <v-container v-if="!filteredUsers.length && !loading && usersSnapshot" fluid>
          <v-banner dark outlined rounded="">
            <v-avatar slot="icon" color="indigo" size="40">
              <v-icon icon="$mdiLock" color="white"> $mdiLock </v-icon>
            </v-avatar>

            <h4 style="color: #adbac7">
              We couldn't find an account for "jjjhdddd" Make sure the email or user UID is spelled correctly.
            </h4>
          </v-banner>
        </v-container>
      </v-card>
    </v-container>

    <base-authenticate-dialog
      v-if="disableAccountDialog"
      v-model="disableAccountDialog"
      :title="accountDisableTitle()"
      :text="accountDisableText()"
      :loading="disableAccountLoader"
      :payload="payload"
      @close="disableAccountDialog = false"
      @authenticatedWithPayload="disableAccount"
    />

    <base-authenticate-dialog
      v-if="enableAccountDialog"
      v-model="enableAccountDialog"
      :title="accountEnableTitle()"
      :text="accountEnableText()"
      :loading="enableAccountLoader"
      :payload="payload"
      @close="enableAccountDialog = false"
      @authenticatedWithPayload="enableAccount"
    />

    <base-authenticate-dialog
      v-if="removeAccountDialog"
      v-model="removeAccountDialog"
      :title="accountRemoveTitle()"
      :text="accountRemoveText()"
      :loading="removeAccountLoader"
      :payload="payload"
      @close="removeAccountDialog = false"
      @authenticatedWithPayload="removeAccount"
    />

    <base-authenticate-change-password-dialog
      v-if="changePasswordDialog"
      v-model="changePasswordDialog"
      :title="changePasswordTitle()"
      :text="changePasswordText()"
      :payload="payload"
      @close="changePasswordDialog = false"
      @authenticatedWithPayload="changeAccountPassword"
    />

    <user-roles-dialog
      v-if="editUserRolesDialog"
      v-model="editUserRolesDialog"
      :payload="payload"
      @save="saveUserRoles"
      @close="editUserRolesDialog = false"
    />
  </div>
</template>

<script>
  import { onSnapshot, collection } from 'firebase/firestore';
  import { call, get, sync } from 'vuex-pathify';
  import { db } from '@/firebase/firebase';
  import UserRolesDialog from './user-roles-dialog.vue';

  // Roles collection ref
  const colRefRoles = collection(db, 'roles');
  const colRefCapabilities = collection(db, 'capabilities');

  export default {
    name: 'SkriptagEditUsers',
    components: {
      UserRolesDialog,
    },
    data() {
      return {
        search: '',
        dialogTitle: '',
        dialogText: '',
        loadingSpinner: null,
        loading: false,
        headers: [
          { text: 'Avatar', value: 'avatar', width: '100px' },
          { text: 'Identifier', value: 'email', width: '200' },
          { text: 'User ID', value: 'uid', align: 'start', sortable: false },
          { text: 'Providers', align: 'center', value: 'providers', width: '159', sortable: false },
          { text: 'Roles', align: 'center', value: 'roles', sortable: false },
          { text: 'Actions', align: 'center', value: 'actions', width: '200px', sortable: false },
        ],
        selectedItem: false,
        selected: [],
        disableAccountDialog: false,
        disableAccountLoader: false,
        enableAccountDialog: false,
        enableAccountLoader: false,
        removeAccountDialog: false,
        removeAccountLoader: false,
        changePasswordDialog: false,
        editUserRolesDialog: false,
        payload: null,
      };
    },
    computed: {
      ...get('authentication', ['userId', 'fullName']),
      ...sync('authentication', ['users', 'roles', 'capabilities', 'isBooted@usersSnapshot']),

      filteredUsers() {
        const search = this.search.toString().toLowerCase();
        return this.users.filter((user) =>
          ['uid', 'email'].some((key) => user[key].toLowerCase().includes(search) && !user.removed),
        );
      },
    },

    mounted() {
      this.getUsersSnapshot();
    },

    methods: {
      ...call('authentication', [
        'disableAccountByEmail',
        'enableAccountByEmail',
        'deleteAccountByEmail',
        'chageUserPasswordByEmail',
        'assignRolesToUser',
        'getUsersSnapshot',
      ]),
      ...call('snackbar/*'),

      async saveUserRoles(data) {
        try {
          const payload = { roles: data.roles, uid: data.uid };

          const result = await this.assignRolesToUser(payload);

          if (result.assigned) {
            this.snackbarSuccess(`roles assigned successfully.`);
            this.editUserRolesDialog = false;
          }
        } catch (error) {
          this.snackbarError(`There was an error assigning roles.`);
        }
      },

      triggerFn({ account }) {
        const { method } = account;
        this[method]({ account });
      },

      rowActions(user) {
        return [
          { name: 'Manage Roles', method: 'changeRolesTrigger', disabled: false },
          { name: 'Reset Password', method: 'changePasswordTrigger', disabled: false },
          {
            name: user.disabled ? 'Enable account' : 'Disable account',
            method: user.disabled ? 'enableAccountTrigger' : 'disableAccountTrigger',
            disabled: user.uid === this.userId,
          },
          { name: 'Remove account', method: 'removeAccountTrigger', disabled: user.uid === this.userId },
          { name: 'Inspect', method: '', disabled: false },
        ];
      },

      accountDisableTitle() {
        return 'Disable account';
      },

      accountDisableText() {
        return 'This account wont be able to login once its disabled.';
      },

      accountEnableTitle() {
        return 'Enable account';
      },

      accountEnableText() {
        return 'This account will be able to login once its enabled.';
      },

      accountRemoveTitle() {
        return 'Remove account';
      },

      accountRemoveText() {
        return 'This action is permament, you will not be able to undo it. All your data, will be removed immediately.';
      },

      changePasswordTitle() {
        return 'Change account password';
      },

      changePasswordText() {
        return 'Set a manual password for this account, the user will get notified of this change, but the password has to be sent to the user somehow, sms is a good option.';
      },

      changeRolesTrigger({ account }) {
        this.payload = account;
        this.editUserRolesDialog = true;
      },

      changePasswordTrigger({ account }) {
        this.payload = account;
        this.changePasswordDialog = true;
      },

      disableAccountTrigger({ account }) {
        this.payload = account;
        this.disableAccountDialog = true;
      },

      enableAccountTrigger({ account }) {
        this.payload = account;
        this.enableAccountDialog = true;
      },

      removeAccountTrigger({ account }) {
        this.payload = account;
        this.removeAccountDialog = true;
      },

      async removeAccount(account) {
        this.removeAccountLoader = true;

        try {
          const { email } = account;
          this.removeAccountLoader = true;
          const result = await this.deleteAccountByEmail(email);

          if (result.removed) {
            this.snackbarSuccess(`${email} removed.`);
            this.removeAccountDialog = false;
            this.removeAccountLoader = false;
            return;
          }
          this.disableAccountLoader = false;
        } catch ({ ...error }) {
          this.removeAccountLoader = false;
        }
      },

      async changeAccountPassword({ result }) {
        try {
          const { email, changed } = result;
          if (changed) {
            this.snackbarSuccess(`${email} password changed.`);
            this.changePasswordDialog = false;
          }
        } catch ({ ...error }) {}
      },

      async disableAccount(account) {
        this.disableAccountDialog = true;

        try {
          const { email } = account;
          this.disableAccountLoader = true;
          const result = await this.disableAccountByEmail(email);

          if (result.disabled) {
            this.snackbarSuccess(`${email} disabled.`);
            this.disableAccountDialog = false;
            this.disableAccountLoader = false;
            return;
          }
          this.disableAccountLoader = false;
        } catch ({ ...error }) {
          this.disableAccountLoader = false;
        }
      },

      async enableAccount(account) {
        try {
          this.enableAccountLoader = true;
          const { email } = account;
          const result = await this.enableAccountByEmail(email);

          if (result.enabled) {
            this.snackbarSuccess(`${email} enabled.`);
            this.enableAccountDialog = false;
            this.enableAccountLoader = false;
            return;
          }
          this.enableAccountLoader = false;
        } catch ({ ...error }) {
          this.enableAccountLoader = false;
        }
      },

      getTooltipMessage(user) {
        if (user.disabled) {
          return 'disabled';
        }

        if (user.verified) {
          return 'verified';
        }

        if (!user.verified) {
          return null;
        }
      },

      getStatusIcon(user) {
        if (user.disabled) {
          return '$mdiClose-octagon';
        }

        if (user.verified) {
          return '$mdiCheck';
        }

        if (!user.verified) {
          return null;
        }
      },

      getStatusColor(user) {
        if (user.disabled) {
          return 'pink';
        }

        if (user.verified) {
          return 'indigo darken-2';
        }

        if (!user.verified) {
          return null;
        }
      },

      isSelected(uid) {
        return this.selected.some((user) => user.uid === uid) ? 'background: #303036' : '';
      },

      getCapabilitiesSnaphot() {
        onSnapshot(colRefCapabilities, (snapshot) => {
          const capabilities = [];
          snapshot.docs.forEach((doc) => {
            capabilities.push({ ...doc.data(), hover: false });
          });
          this.capabilities = capabilities;
        });
      },

      getRolesSnaphot() {
        onSnapshot(colRefRoles, (snapshot) => {
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

  .fruit-table-item {
    transition: all 1s;
  }
  .fruit-table-item > * {
    transition: all 1s;
    overflow: hidden;
  }
  .fruit-table-enter,
  .fruit-table-leave-to {
    line-height: 0;
  }
  .fruit-table-enter > *,
  .fruit-table-leave-to > * {
    padding-top: 0px !important;
    padding-bottom: 0px !important;
  }
</style>
