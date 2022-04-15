<template>
  <div class="white--text">
    <h1 class="mb-6">Profile Setttings</h1>
    <ValidationObserver ref="profileEdit" slim>
      <form class="d-flex flex-column" @submit.prevent="saveProfile()">
        <v-row>
          <v-col sm="6" md="4">
            <v-row no-gutters>
              <v-col cols="12">
                <v-btn tabindex="-1" :ripple="false" x-small color="white" class="ml-n2 mb-n2" plain>Name</v-btn>
                <div class="py-2 pr-2">
                  <Validation-provider v-slot="{ invalid, errors }" name="name" :rules="{ required: true, alpha: true }">
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
                <v-btn tabindex="-1" :ripple="false" x-small color="white" class="ml-n2 mb-n2" plain>Last name</v-btn>
                <div class="py-2 pr-2">
                  <Validation-provider v-slot="{ invalid, errors }" name="last name" :rules="{ required: true, alpha: true }">
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
            <v-btn class="mr-2" dark small color="grey" @click="cancel()">Cancel</v-btn>
            <v-btn type="submit" dark small color="teal">Update profile</v-btn>
          </v-col>
        </v-row>
      </form>
    </ValidationObserver>
  </div>
</template>
<script>
  import { sync, call } from 'vuex-pathify';

  export default {
    name: 'ProfileEdit',

    computed: {
      ...sync('authentication', ['profile']),
    },

    methods: {
      ...call('authentication', ['updateProfileSettings']),
      ...call('snackbar/*'),

      cancel() {
        this.$emit('close');
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
