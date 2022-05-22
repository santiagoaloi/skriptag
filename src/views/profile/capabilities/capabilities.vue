<template>
  <div>
    <v-container :fluid="$vuetify.breakpoint.lgAndDown" class="pa-10">
      <v-card ref="content" class="mx-auto transparent" flat min-height="35vh">
        <v-card-actions v-if="$vuetify.breakpoint.smAndUp">
          <v-text-field
            v-model="search"
            placeholder="Search by capability name"
            dark
            background-color="#1c1e24"
            hide-details
            dense
            solo
          />
          <Base-button small class="ml-2" large @click="addCapabilityDialog = true"> Add capability</Base-button>
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
            :items="capabilities"
            :items-per-page="5"
            item-key="uid"
          >
            <template #body="{}">
              <tbody>
                <tr
                  v-for="capability in capabilities"
                  :key="capability.name"
                  @mouseleave="capability.hover = false"
                  @mouseenter="capability.hover = true"
                >
                  <td>
                    <v-checkbox v-model="selected" multiple :value="capability" style="margin: 0px; padding: 0px" hide-details />
                  </td>

                  <td>{{ capability.name }}</td>
                  <td>{{ capability.description }}</td>

                  <td>
                    <div class="d-flex justify-center">
                      <vs-tooltip shadow circle color="#ccc">
                        <v-menu absolute rounded="md">
                          <template #activator="{ on }">
                            <v-fade-transition>
                              <div v-if="capability.hover">
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
                              @click="triggerFn(item.function, capability)"
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
    <capabilities-options-dialog v-model="addCapabilityDialog" @close="addCapabilityDialog = false" />
    <base-authenticate-dialog
      v-if="removeCapabilityDialog"
      v-model="removeCapabilityDialog"
      :title="removeCapabilityTitle()"
      :text="removeCapabilityText()"
      :payload="payload"
      :loading="removeCapabilityLoader"
      @close="removeCapabilityDialog = false"
      @authenticatedWithPayload="removeCapabilityVuex"
    />
  </div>
</template>
<script>
  import { call, sync } from 'vuex-pathify';
  import CapabilitiesOptionsDialog from './capabilities-options-dialog.vue';

  export default {
    name: 'Capabilities',
    components: {
      CapabilitiesOptionsDialog,
    },
    data() {
      return {
        removeCapabilityDialog: false,
        addCapabilityDialog: false,
        removeCapabilityLoader: false,
        rowActions: [
          { name: 'Edit capability', function: '' },
          { name: 'Remove capability', function: 'removeCapabilityTrigger' },
        ],
        search: '',
        loading: false,
        headers: [
          { text: 'Capability', value: 'name', align: 'left', width: '150px' },
          { text: 'Description', value: 'description', align: 'left' },
          { text: '', align: 'center', value: 'actions', width: '200px', sortable: false },
        ],
        selected: [],
      };
    },

    computed: {
      ...sync('authentication', ['capabilities']),
    },

    methods: {
      ...call('authentication', ['addCapability', 'removeCapability']),
      ...call('snackbar/*'),

      triggerFn(fn, params) {
        this[fn](params);
      },

      removeCapabilityTitle() {
        return 'Remove capability';
      },

      removeCapabilityText() {
        return 'This will also remove the capability from any roles that has this capability assigned to it.';
      },

      removeCapabilityTrigger(capability) {
        this.payload = capability;
        this.removeCapabilityDialog = true;
      },

      async removeCapabilityVuex(capability) {
        this.removeCapabilityLoader = true;
        const { name } = capability;
        const result = await this.removeCapability(name);
        if (result.removed) {
          this.removeCapabilityDialog = false;
          this.removeCapabilityLoader = false;
          this.snackbarSuccess(`${name} capability removed successfully`);
          return;
        }

        this.snackbarError(`There was an error removing ${name}`);
        this.removeCapabilityLoader = false;
      },

      // isSelected(uid) {
      //   return this.selected.some((user) => user.uid === uid) ? 'background: #303036' : '';
      // },
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
