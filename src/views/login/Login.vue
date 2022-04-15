<template>
  <base-split-2 id="login" col="6" right>
    <div class="pa-3">
      <div class="d-flex flex-wrap flex-column">
        <h1>Login</h1>
        <p>Time to get stuff done!</p>
      </div>
      <ValidationObserver ref="loginForm" slim>
        <form class="d-flex flex-column" @submit.prevent="validateLoginForm()">
          <v-row no-gutters>
            <v-col cols="12" lg="10">
              <v-btn :ripple="false" x-small color="white" class="ml-n2 mb-n2" plain>Recover my password</v-btn>
              <div class="py-2 pr-2">
                <Validation-provider v-slot="{ errors }" mode="lazy" name="email" :rules="{ email: true, required: true }">
                  <vs-input v-model="loginForm.email" :danger="errors.length > 0" maxlength="100" block placeholder="Email">
                    <template #icon>
                      <v-icon dark>mdi-account</v-icon>
                    </template>
                    <template #message-danger> {{ errors[0] }} </template>
                  </vs-input>
                </Validation-provider>
              </div>
            </v-col>
            <v-col cols="12" lg="10">
              <div class="py-2 pr-2">
                <Validation-provider v-slot="{ errors }" mode="lazy" name="password" :rules="{ required: true }">
                  <vs-input v-model="loginForm.password" :danger="errors.length > 0" block type="password" placeholder="Password">
                    <template #icon>
                      <v-icon dark>mdi-lock</v-icon>
                    </template>
                    <template #message-danger> {{ errors[0] }} </template>
                  </vs-input>
                </Validation-provider>
              </div>
              <v-card-actions class="px-0">
                <Base-button type="submit" :loading="loading" dark color="grey darken-3" large> Login</Base-button>
              </v-card-actions>
            </v-col>
          </v-row>
        </form>
      </ValidationObserver>
    </div>
  </base-split-2>
</template>
<script>
  import { call, sync, get } from 'vuex-pathify';

  export default {
    name: 'LoginPage',

    data() {
      return {
        loginForm: {
          email: '',
          password: '',
        },
      };
    },

    computed: {
      ...get('authentication', ['isLoggedIn']),
      loading: sync('loaders/authLoader'),
    },

    methods: {
      ...call('authentication/*'),
      ...call('app', ['sleep']),
      ...call('snackbar/*'),

      async validateLoginForm() {
        try {
          const validated = await this.$refs.loginForm.validate();
          if (validated) {
            this.login(this.loginForm);
          } else {
            this.snackbarError('Please correct the fields in red');
          }
        } catch (error) {
          this.snackbarError('Something did not go right ');
        }
      },

      async delayRender(ms) {
        await this.sleep(ms);
        this.showSlide = true;
      },
    },
  };
</script>
