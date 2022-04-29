<template>
  <div>
    <v-container class="pa-10">
      <v-card ref="content" class="mx-auto transparent" flat min-height="35vh">
        <v-card-actions v-if="$vuetify.breakpoint.smAndUp">
          <v-text-field
            v-model="search"
            placeholder="Search by email adrress, or user ID"
            dark
            background-color="#212326"
            hide-details
            dense
            solo
          />
          <Base-button small class="ml-2" large> Add user</Base-button>
          <vs-tooltip shadow circle color="#ccc">
            <Base-button small class="ml-2" large @click="getUsersSnapshot()"> <v-icon> mdi-refresh</v-icon></Base-button>
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
            :items="users"
            :items-per-page="5"
            item-key="uid"
          >
            <template #body="{}">
              <tbody>
                <tr
                  v-for="user in filteredUsers"
                  :key="user.uid"
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
                        <baseAvatarImg v-if="!user.photoURL" class="hoverAvatar" :height="35" @click="triggerAvatarInput()" />
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

                  <td>{{ user.email }}</td>
                  <td>{{ user.uid }}</td>
                  <td>
                    <div class="d-flex justify-center align-center">
                      <v-fade-transition>
                        <div v-if="user.hover">
                          <vs-tooltip top shadow circle color="#ccc">
                            <v-avatar class="mx-1" size="25" color="pink"> A </v-avatar>
                            <template #tooltip> Administrator </template>
                          </vs-tooltip>
                        </div>
                      </v-fade-transition>
                      <v-fade-transition>
                        <div v-if="user.hover">
                          <vs-tooltip top shadow circle color="#ccc">
                            <v-avatar class="mx-1" size="25" color="orange"> M </v-avatar>
                            <template #tooltip> Moderator </template>
                          </vs-tooltip>
                        </div>
                      </v-fade-transition>
                    </div>
                  </td>

                  <td>
                    <div class="d-flex justify-center">
                      <vs-tooltip shadow circle color="#ccc">
                        <v-fade-transition>
                          <v-icon v-if="user.hover" class="cursor-pointer">mdi-content-copy</v-icon>
                        </v-fade-transition>
                        <template #tooltip> Copy UID </template>
                      </vs-tooltip>

                      <vs-tooltip shadow circle color="#ccc">
                        <v-menu absolute rounded="md">
                          <template #activator="{ on }">
                            <v-fade-transition>
                              <div v-if="user.hover">
                                <v-icon class="cursor-pointer ml-3" v-on="on">mdi-dots-vertical</v-icon>
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
      </v-card>
    </v-container>

    <base-authenticate-dialog
      v-model="disableAccountDialog"
      :title="accountDisableTitle()"
      :text="accountDisableText()"
      :loading="disableAccountLoader"
      :payload="payload"
      @close="disableAccountDialog = false"
      @authenticatedWithPayload="disableAccount"
    />

    <base-authenticate-dialog
      v-model="enableAccountDialog"
      :title="accountEnableTitle()"
      :text="accountEnableText()"
      :loading="enableAccountLoader"
      :payload="payload"
      @close="enableAccountDialog = false"
      @authenticatedWithPayload="enableAccount"
    />

    <base-authenticate-dialog
      v-model="deleteAccountDialog"
      :title="accountDeleteTitle()"
      :text="accountDeleteText()"
      :loading="deleteAccountLoader"
      :payload="payload"
      @close="deleteAccountDialog = false"
      @authenticatedWithPayload="deleteAccount"
    />

    <base-authenticate-change-password-dialog
      v-model="changePasswordDialog"
      :title="changePasswordTitle()"
      :text="changePasswordText()"
      :payload="payload"
      @close="changePasswordDialog = false"
      @authenticatedWithPayload="changeAccountPassword"
    />
  </div>
</template>

<script>
  import { onSnapshot, collection } from 'firebase/firestore';
  import { call, get } from 'vuex-pathify';
  import { db } from '@/firebase/firebase';

  // Roles collection ref
  const colRef = collection(db, 'users');

  export default {
    name: 'SkriptagEditUsers',
    data() {
      return {
        search: '',
        dialogTitle: '',
        dialogText: '',
        loadingSpinner: null,
        loading: false,
        users: [],
        headers: [
          { text: 'Avatar', value: 'avatar' },
          { text: 'Identifier', value: 'email' },
          { text: 'User ID', value: 'uid' },
          { text: 'Roles', align: 'center', value: 'roles', width: '200px', sortable: false },
          { text: '', align: 'center', value: 'actions', width: '200px', sortable: false },
        ],
        selectedItem: false,
        selected: [],
        disableAccountDialog: false,
        disableAccountLoader: false,
        enableAccountDialog: false,
        enableAccountLoader: false,
        deleteAccountDialog: false,
        deleteAccountLoader: false,
        changePasswordDialog: false,
        payload: null,
      };
    },

    computed: {
      ...get('authentication', ['userId']),

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
      ]),
      ...call('snackbar/*'),

      rowActions(user) {
        return [
          { name: 'Manage Roles', test: 'changeRolesDialog', disabled: false },
          { name: 'Reset Password', method: 'changePasswordTrigger', disabled: false },
          {
            name: user.disabled ? 'Enable account' : 'Disable account',
            method: user.disabled ? 'enableAccountTrigger' : 'disableAccountTrigger',
            disabled: user.uid === this.userId,
          },
          { name: 'Delete account', method: 'deleteAccountTrigger', disabled: user.uid === this.userId },
        ];
      },

      triggerFn({ account }) {
        const { method } = account;
        this[method]({ account });
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

      accountDeleteTitle() {
        return 'Remove account';
      },

      accountDeleteText() {
        return 'This action is permament, you will not be able to undo it. All your data, will be removed immediately.';
      },

      changePasswordTitle() {
        return 'Change account password';
      },

      changePasswordText() {
        return 'Set a manual password for this account, the user will get notified of this change, but the password has to be sent to the user somehow, sms is a good option.';
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

      deleteAccountTrigger({ account }) {
        this.payload = account;
        this.deleteAccountDialog = true;
      },

      async deleteAccount(account) {
        this.deleteAccountLoader = true;

        try {
          const { email } = account;
          this.deleteAccountLoader = true;
          const result = await this.deleteAccountByEmail(email);

          if (result.deleted) {
            this.snackbarSuccess(`${email} deleted.`);
            this.deleteAccountDialog = false;
            this.deleteAccountLoader = false;
            return;
          }
          this.disableAccountLoader = false;
        } catch ({ ...error }) {
          this.deleteAccountLoader = false;
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
          return 'mdi-close-octagon';
        }

        if (user.verified) {
          return 'mdi-check-decagram';
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
          return 'green';
        }

        if (!user.verified) {
          return null;
        }
      },

      isSelected(uid) {
        return this.selected.some((user) => user.uid === uid) ? 'background: #303036' : '';
      },

      getUsersSnapshot() {
        this.loading = true;

        // Spinner while loading
        this.loadingSpinner = this.$vs.loading({
          target: this.$refs.content,
          color: 'primary',
        });

        // realtime collection data
        // reacts to CRUD operations.

        onSnapshot(colRef, (snapshot) => {
          const users = [];

          snapshot.docs.forEach((doc) => {
            // Add the hover key, for row hovering actions.
            users.push({ ...doc.data(), hover: false });
          });

          this.users = users;
        });

        setTimeout(() => {
          this.loadingSpinner.close();
          this.loading = false;
        }, 200);
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
