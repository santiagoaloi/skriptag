<template>
  <div style="color: #ccc">
    <h1 class="mb-6">Profile Setttings</h1>
    <ValidationObserver ref="profileEdit" slim>
      <form class="d-flex flex-column" @submit.prevent="saveProfile()">
        <v-row>
          <v-col sm="6" md="4">
            <v-row no-gutters>
              <v-col cols="12">
                <v-btn tabindex="-1" :ripple="false" x-small color="white" class="ml-n2 mb-n2" plain>Name</v-btn>
                <div class="py-2 pr-2">
                  <Validation-provider
                    v-slot="{ invalid, errors }"
                    slim
                    name="name"
                    :rules="{ required: true, alpha_spaces: true }"
                  >
                    <vs-input v-model="profile.name" :danger="invalid" maxlength="20" block placeholder="First name">
                      <template #icon>
                        <v-icon dark>mdi-account</v-icon>
                      </template>
                      <template #message-danger> {{ errors[0] }} </template>
                    </vs-input>
                  </Validation-provider>
                </div>
              </v-col>
              <v-col cols="12">
                <v-btn tabindex="-1" :ripple="false" x-small color="white" class="ml-n2 mt-7 mb-n2" plain>Last name</v-btn>
                <div class="py-2 pr-2">
                  <Validation-provider
                    v-slot="{ invalid, errors }"
                    slim
                    name="last name"
                    :rules="{ required: true, alpha_spaces: true }"
                  >
                    <vs-input v-model="profile.lastName" :danger="invalid" maxlength="20" block placeholder="Last name">
                      <template #icon>
                        <v-icon dark>mdi-account</v-icon>
                      </template>
                      <template #message-danger> {{ errors[0] }} </template>
                    </vs-input>
                  </Validation-provider>
                </div>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12">
            <div class="mt-2">
              <v-btn class="mr-2" dark small color="grey" @click="cancel()">Cancel</v-btn>
              <v-btn type="submit" dark small color="teal">Update profile</v-btn>
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
            this.snackbarSuccess('Profile saved');
            this.$emit('close');
          } else {
            this.snackbarError('Please correct the fields in red');
          }
        } catch (error) {
          this.snackbarError('Something did not go right ');
        }
      },
    },
  };
</script>
