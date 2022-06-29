<template>
  <div style="color: #ccc">
    <ValidationObserver ref="profileEdit" slim>
      <form class="d-flex flex-column" @submit.prevent="saveProfile()">
        <v-row no-gutters>
          <v-col cols="12" sm="6" md="4">
            <v-row>
              <v-col cols="12">
                <Base-field-title> Name</Base-field-title>
                <div class="pr-2">
                  <Validation-provider
                    v-slot="{ failed, errors }"
                    v-bind="{ ...vvOptions }"
                    name="name"
                    :rules="{ required: true, alpha_spaces: true }"
                  >
                    <vs-input
                      v-model="editableProfile.name"
                      :danger="failed"
                      maxlength="20"
                      block
                      placeholder="First name"
                      @focus="resetValidation()"
                    >
                      <template #icon>
                        <v-icon dark>$mdiAccount</v-icon>
                      </template>
                      <template #message-danger>
                        <v-icon v-if="failed" color="pink" style="margin-top: -1px" x-small dark>$mdiAlertCircleOutline</v-icon>
                        {{ errors[0] }}
                      </template>
                    </vs-input>
                  </Validation-provider>
                </div>
              </v-col>
              <v-col cols="12">
                <Base-field-title> Last Name</Base-field-title>
                <div class="pr-2">
                  <Validation-provider
                    v-slot="{ failed, errors }"
                    v-bind="{ ...vvOptions }"
                    name="last name"
                    :rules="{ required: true, alpha_spaces: true }"
                  >
                    <vs-input
                      v-model="editableProfile.lastName"
                      :danger="failed"
                      maxlength="20"
                      block
                      placeholder="Last name"
                      @focus="resetValidation()"
                    >
                      <template #icon>
                        <v-icon dark>$mdiAccount</v-icon>
                      </template>
                      <template #message-danger>
                        <v-icon v-if="failed" color="pink" style="margin-top: -1px" x-small dark>$mdiAlertCircleOutline</v-icon>
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
              <BaseButton @click="close()">
                <v-icon left class="mr-2" small>$mdiClose</v-icon>
                Close
              </BaseButton>

              <BaseButton class="ml-2" type="submit" :loading="loading">
                <v-icon left class="mr-2" small>$mdiCheck</v-icon>
                Save
              </BaseButton>
            </div>
          </v-col>
        </v-row>
      </form>
    </ValidationObserver>
  </div>
</template>
<script>
  import { sync, call, get } from 'vuex-pathify';
  import { cloneDeep } from 'lodash';

  export default {
    name: 'ProfileEdit',

    data() {
      return {
        vvOptions: {
          mode: 'passive',
          slim: true,
        },
        originProfile: {},
        loading: false,
      };
    },

    computed: {
      ...get('authentication', ['isAuthExternalProvider']),
      editableProfile: sync('authentication/profile'),
    },

    mounted() {
      // carbon copy of current profile settings.
      this.cloneProfile();
    },
    methods: {
      ...call('authentication', ['updateProfileSettings']),
      ...call('snackbar/*'),

      close() {
        this.$router.push('/profile');
        this.rollBack();
        window.scrollTo(0, 0);
      },

      cloneProfile() {
        this.originProfile = cloneDeep(this.editableProfile);
      },

      rollBack() {
        // If the user changes the profile or cover image, it will remain
        // regardless of cancelling the profile edit.

        // const profileMedia = { photoURL: this.profile.photoURL, coverAvatar: this.profile.coverAvatar };
        this.editableProfile = this.originProfile;

        // if (this.isAuthExternalProvider) {
        //   const profileMedia = { coverAvatar: this.profile.coverAvatar };
        //   this.profile = merge(originProfile, profileMedia);
        // }

        // Merge possible new image changes and rollback.
      },

      resetValidation() {
        this.$refs.profileEdit.reset();
      },

      async saveProfile() {
        try {
          this.loading = true;
          const validated = await this.$refs.profileEdit.validate();
          if (validated) {
            const profile = await this.updateProfileSettings();

            if (profile.saved) {
              this.loading = false;
              this.snackbarSuccess('Profile details saved');
              this.$router.push('/profile');
              return;
            }
            this.snackbarError('please correct the fields highlighted in red');
            this.loading = false;
          }
        } catch (error) {
          this.snackbarError('something went wrong ');
          this.loading = false;
        }
      },
    },
  };
</script>
