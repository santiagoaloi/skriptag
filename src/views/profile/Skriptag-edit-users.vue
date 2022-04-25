<template>
  <v-container class="pa-10">
    <v-card
      ref="content"
      :disabled="disableAccountLoader || deleteAccountLoader"
      class="mx-auto transparent"
      flat
      min-height="35vh"
    >
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
          <Base-button small class="ml-2" large @click="getRolesSnaphot()"> <v-icon> mdi-refresh</v-icon></Base-button>
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
                      <baseAvatarImg v-if="!user.avatar" class="hoverAvatar" :height="35" @click="triggerAvatarInput()" />
                      <v-avatar v-else size="35">
                        <v-img :src="user.avatar" flat>
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
                            @click="triggerFn(item.function, user.email)"
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
</template>
<script>
  import { onSnapshot, collection } from 'firebase/firestore';
  import { call, sync } from 'vuex-pathify';
  import { db } from '@/firebase/firebase';

  // Roles collection ref
  const colRef = collection(db, 'users');

  export default {
    name: 'SkriptagEditUsers',
    data() {
      return {
        search: '',
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
      };
    },

    computed: {
      ...sync('loaders', ['disableAccountLoader', 'deleteAccountLoader']),
      filteredUsers() {
        const search = this.search.toString().toLowerCase();
        return this.users.filter((user) =>
          ['uid', 'email'].some((key) => user[key].toLowerCase().includes(search) && !user.removed),
        );
      },
    },

    mounted() {
      this.getRolesSnaphot();
    },

    methods: {
      ...call('authentication', ['disableAccountByEmail', 'enableAccountByEmail', 'deleteAccountByEmail']),

      rowActions(user) {
        return [
          { name: 'Manage Roles', test: 'triggerRolesDialog' },
          { name: 'Reset Password', function: '' },
          {
            name: user.disabled ? 'Enable account' : 'disable account',
            function: user.disabled ? 'enableAccountByEmail' : 'disableAccountByEmail',
          },
          { name: 'Delete account', function: 'deleteAccountByEmail' },
        ];
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

      triggerFn(fn, params) {
        alert(params);
        this[fn](params);
      },

      getRolesSnaphot() {
        this.loading = true;

        this.loadingSpinner = this.$vs.loading({
          target: this.$refs.content,
          color: 'primary',
        });

        // realtime collection data
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
