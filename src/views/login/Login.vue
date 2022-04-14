<template>
  <base-split-2 id="login" col="6" right>
    <div class="pa-3">
      <div class="d-flex flex-wrap flex-column">
        <h1>Login</h1>
        <p>Time to get stuff done!</p>
      </div>
      <form class="d-flex flex-column" @submit.prevent="login()">
        <v-row no-gutters>
          <v-col cols="10">
            <v-btn :ripple="false" x-small color="white" class="ml-n2 mb-n2" plain>Recover my password</v-btn>
            <div class="py-2 pr-2">
              <vs-input v-model="loginForm.email" block placeholder="Email">
                <template #icon>
                  <v-icon dark>mdi-account</v-icon>
                </template>
              </vs-input>
            </div>
          </v-col>
          <v-col cols="10">
            <div class="py-2 pr-2">
              <vs-input v-model="loginForm.password" block type="password" placeholder="Password">
                <template #icon>
                  <v-icon dark>mdi-lock</v-icon>
                </template>
              </vs-input>
            </div>
            <v-card-actions class="px-0">
              <Base-button type="submit" :loading="loading" dark color="grey darken-3" large> Login</Base-button>
            </v-card-actions>
          </v-col>
        </v-row>
      </form>
    </div>
  </base-split-2>
</template>
<script>
  import { call, sync, get } from 'vuex-pathify';
  import baseButton from '@/components/base/baseButton.vue';

  export default {
    name: 'LoginPage',
    components: { baseButton },

    computed: {
      ...get('authentication', ['isLoggedIn']),
      loading: sync('loaders/authLoader'),
      loginForm: sync('authentication/loginForm'),
    },

    methods: {
      ...call('authentication/*'),
      ...call('app', ['sleep']),

      async delayRender(ms) {
        await this.sleep(ms);
        this.showSlide = true;
      },
    },
  };
</script>
