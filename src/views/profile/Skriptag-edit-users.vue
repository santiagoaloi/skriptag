<template>
  <v-container class="pa-10">
    <v-card ref="content" class="mx-auto transparent" flat height="35vh">
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
        <Base-button small class="ml-2" large> <v-icon> mdi-refresh</v-icon></Base-button>
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
              <v-hover v-for="user in filteredUsers" :key="user.uid" v-slot="{ hover }">
                <tr :style="isSelected(user.uid)">
                  <td>
                    <v-checkbox v-model="selected" multiple :value="user" style="margin: 0px; padding: 0px" hide-details />
                  </td>
                  <td>{{ user.email }}</td>
                  <td>{{ user.uid }}</td>
                  <td>
                    <div v-if="hover" class="d-flex justify-center">
                      <v-icon class="cursor-pointer">mdi-content-copy</v-icon>
                      <v-icon class="cursor-pointer ml-3">mdi-dots-vertical</v-icon>
                    </div>
                  </td>
                </tr>
              </v-hover>
            </tbody>
          </template>
        </v-data-table>
      </v-fade-transition>
    </v-card>
  </v-container>
</template>
<script>
  import { httpsCallable } from 'firebase/functions';
  import { functions } from '@/firebase/firebase';

  export default {
    name: 'SkriptagEdit',
    data() {
      return {
        search: '',
        loadingSpinner: null,
        loading: false,
        users: [],
        headers: [
          { text: 'Identifier', value: 'email' },
          { text: 'User ID', value: 'uid' },
          { text: '', align: 'center', value: 'actions', width: '200px', sortable: false },
        ],
        selectedItem: false,
        selected: [],
      };
    },

    computed: {
      filteredUsers() {
        const search = this.search.toString().toLowerCase();
        return this.users.filter((user) => ['uid', 'email'].some((key) => user[key].toLowerCase().includes(search)));
      },
    },

    mounted() {
      this.listUsers();
    },

    methods: {
      isSelected(uid) {
        return this.selected.some((user) => user.uid === uid) ? 'background: #242626' : '';
      },

      async listUsers() {
        this.loading = true;
        this.loadingSpinner = this.$vs.loading({
          target: this.$refs.content,
          color: 'primary',
        });

        // this.loading = this.$vs.loading({});
        const listAllUsers = httpsCallable(functions, 'listAllUsersEmulator');
        const result = await listAllUsers();
        this.users = result.data;
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
