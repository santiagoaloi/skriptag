<template>
  <div style="color: #ccc">
    <h1 class="mb-6 mt-3">Profile details</h1>
    <ValidationObserver ref="profileEdit" slim>
      <form class="d-flex flex-column" @submit.prevent="saveProfile()">
        <v-row no-gutters>
          <v-col cols="12" sm="6" md="4">
            <v-row>
              <v-col cols="12">
                <small class="ml-1">Name</small>
                <div class="pr-2">
                  <Validation-provider
                    v-slot="{ failed, errors }"
                    v-bind="{ ...vvOptions }"
                    name="name"
                    :rules="{ required: true, alpha_spaces: true }"
                  >
                    <vs-input v-model="profile.name" :danger="failed" maxlength="20" block placeholder="First name">
                      <template #icon>
                        <v-icon dark>mdi-account</v-icon>
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
                <small class="ml-1">Last name</small>
                <div class="pr-2">
                  <Validation-provider
                    v-slot="{ failed, errors }"
                    v-bind="{ ...vvOptions }"
                    name="last name"
                    :rules="{ required: true, alpha_spaces: true }"
                  >
                    <vs-input v-model="profile.lastName" :danger="failed" maxlength="20" block placeholder="Last name">
                      <template #icon>
                        <v-icon dark>mdi-account</v-icon>
                      </template>
                      <template #message-danger>
                        <v-icon v-if="failed" color="pink" style="margin-top: -1px" x-small dark>mdi-alert-circle-outline</v-icon>
                        {{ errors[0] }}
                      </template>
                    </vs-input>
                  </Validation-provider>
                </div>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12">
            <div class="pt-8">
              <v-btn
                class="mr-2"
                :block="!$vuetify.breakpoint.smAndUp"
                :class="$vuetify.breakpoint.smAndUp ? '' : 'mt-3 '"
                dark
                color="grey"
                @click="cancel()"
                ><v-icon left>mdi-close</v-icon>Close</v-btn
              >
              <v-btn
                :block="!$vuetify.breakpoint.smAndUp"
                :class="$vuetify.breakpoint.smAndUp ? 'ml-2' : 'mt-3'"
                type="submit"
                dark
                color="teal"
                ><v-icon left> mdi-check-bold</v-icon>Save</v-btn
              >
            </div>
          </v-col>
        </v-row>
      </form>
    </ValidationObserver>
  </div>
</template>
<script>
  import { sync, call } from 'vuex-pathify';
  import { cloneDeep, merge } from 'lodash';

  export default {
    name: 'ProfileEdit',

    data() {
      return {
        vvOptions: {
          mode: 'passive',
          slim: true,
        },
        originProfile: {},
      };
    },

    computed: {
      ...sync('authentication', ['profile']),
    },

    mounted() {
      // carbon copy of current profile settings.
      this.cloneProfile();
    },
    methods: {
      ...call('authentication', ['updateProfileSettings']),
      ...call('snackbar/*'),

      cancel() {
        this.$emit('close');
        this.rollBack();
        window.scrollTo(0, 0);
      },

      cloneProfile() {
        this.originProfile = cloneDeep(this.profile);
      },

      rollBack() {
        const originProfile = cloneDeep(this.originProfile);

        // If the user changes the profile or cover image, it will remain
        // regardless of cancelling the profile edit.
        const profileMedia = { avatar: this.profile.avatar, coverAvatar: this.profile.coverAvatar };

        // Merge possible new image changes and rollback.
        this.profile = merge(originProfile, profileMedia);
      },

      async saveProfile() {
        try {
          const validated = await this.$refs.profileEdit.validate();
          if (validated) {
            this.updateProfileSettings();
            this.snackbarSuccess('Profile details saved');
            this.$emit('close');
          } else {
            this.snackbarError('Please correct the fields in red');
          }
        } catch (error) {
          this.snackbarError('something went wrong ');
        }
      },
    },
  };
</script>
