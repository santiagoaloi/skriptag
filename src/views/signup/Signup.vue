<template>
  <base-split-2>
    <div class="d-flex align-center flex-wrap flex-column">
      <h1>Signup</h1>
      <p>Join the gang to unlock more content 🤓</p>
    </div>
    <form class="d-flex flex-column" @submit.prevent="signup(signupForm)">
      <v-row justify="center" no-gutters>
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
            <vs-input v-model="signupForm.email" block placeholder="Username">
              <template #icon>
                <v-icon dark>mdi-account</v-icon>
              </template>
            </vs-input>
          </div>
        </v-col>
        <v-col cols="10">
          <div class="py-2 pr-2">
            <vs-input v-model="signupForm.password" block type="password" placeholder="Password">
              <template #icon>
                <v-icon dark>mdi-lock</v-icon>
              </template>
            </vs-input>
          </div>
          <v-card-actions class="px-0">
            <v-btn :loading="loading" large type="submit" :ripple="false" width="100"> Signup</v-btn>
          </v-card-actions>
        </v-col>
      </v-row>
    </form>
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
