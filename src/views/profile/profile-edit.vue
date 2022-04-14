<template>
  <div class="white--text">
    <h1 class="mb-6">Profile Setttings</h1>

    <v-row>
      <v-col sm="4">
        <v-row no-gutters>
          <v-col cols="12">
            <v-btn :ripple="false" x-small color="white" class="ml-n2 mb-n2" plain>Name</v-btn>
            <div class="py-2 pr-2">
              <vs-input v-model="profile.name" block placeholder="First name">
                <template #icon>
                  <v-icon dark>mdi-account</v-icon>
                </template>
              </vs-input>
            </div>
          </v-col>
          <v-col cols="12">
            <v-btn :ripple="false" x-small color="white" class="ml-n2 mb-n2" plain>Last name</v-btn>
            <div class="py-2 pr-2">
              <vs-input v-model="profile.lastName" block placeholder="Last name">
                <template #icon>
                  <v-icon dark>mdi-account</v-icon>
                </template>
              </vs-input>
            </div>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12">
        <v-btn class="mr-2" dark small color="grey" @click="cancel()">Cancel</v-btn>
        <v-btn dark small color="teal" @click="saveProfile()">Update profile</v-btn>
      </v-col>
    </v-row>
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

      cancel() {
        this.$emit('cancel');
      },

      saveProfile() {
        this.updateProfileSettings();
      },
    },
  };
</script>
