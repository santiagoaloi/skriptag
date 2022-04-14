<template>
  <base-split-2 col="6">
    <div class="pa-3">
      <div class="d-flex flex-wrap flex-column">
        <h1>Signup</h1>
        <p>Join the gang to unlock more content 🤓</p>
      </div>
      <form class="d-flex flex-column" @submit.prevent="signup(signupForm)">
        <v-row no-gutters>
          <v-col cols="10">
            <v-btn
              v-animation:shrink="{ longPress: true }"
              :ripple="false"
              x-small
              color="white"
              class="ml-n2 mb-n2"
              plain
              @click="$router.push('login')"
              >Already have an account? Login</v-btn
            >
            <div class="py-2 pr-2">
              <vs-input v-model="signupForm.email" block placeholder="Email">
                <template #icon>
                  <v-icon dark>mdi-at</v-icon>
                </template>
              </vs-input>
            </div>
          </v-col>
          <v-col cols="10">
            <div class="py-2 pr-2">
              <vs-input v-model="signupForm.password" block type="password" placeholder="New password">
                <template #icon>
                  <v-icon dark>mdi-lock</v-icon>
                </template>
              </vs-input>
            </div>
          </v-col>
          <v-col cols="5">
            <div class="py-2 pr-2">
              <vs-input v-model="signupForm.name" block placeholder="Name">
                <template #icon>
                  <v-icon dark>mdi-account</v-icon>
                </template>
              </vs-input>
            </div>
          </v-col>
          <v-col cols="5">
            <div class="py-2 pr-2">
              <vs-input v-model="signupForm.lastName" block placeholder="Last name">
                <template #icon>
                  <v-icon dark>mdi-account</v-icon>
                </template>
              </vs-input>
            </div>
          </v-col>

          <v-col cols="10">
            <v-card-actions>
              <v-spacer />

              <Base-button type="submit" :loading="loading" dark color="grey darken-3" large> Signup</Base-button>
            </v-card-actions>
          </v-col>
        </v-row>
      </form>
    </div>
  </base-split-2>
</template>
<script>
  import { call, sync } from 'vuex-pathify';

  export default {
    name: 'SignupPage',

    computed: {
      ...sync('authentication', ['signupForm']),
      loading: sync('loaders/signupLoader'),
    },
    methods: {
      ...call('authentication/*'),
    },
  };
</script>
