<template>
  <base-split-2 col="6">
    <div class="pa-3">
      <div class="d-flex flex-wrap flex-column pl-1">
        <h1>Signup</h1>
        <p>Join the gang to unlock more content 🤓</p>
      </div>
      <ValidationObserver ref="profileEdit" slim>
        <form class="d-flex flex-column" @submit.prevent="validate()">
          <v-row>
            <v-col cols="12" lg="10">
              <BaseLink to="login">Already have an account? Login</BaseLink>
              <small class="ml-1">Email</small>
              <div class="pr-2">
                <Validation-provider
                  v-slot="{ errors, failed }"
                  v-bind="{ ...vvOptions }"
                  name="email"
                  :rules="{ required: true, email: true }"
                >
                  <vs-input v-model="signupForm.email" maxlength="100" :danger="failed" block placeholder="Email">
                    <template #icon>
                      <v-icon dark>mdi-at</v-icon>
                    </template>
                    <template #message-danger> {{ errors[0] }} </template>
                  </vs-input>
                </Validation-provider>
              </div>
            </v-col>
            <v-col cols="12" lg="10">
              <small class="ml-1">Password</small>
              <div class="pr-2">
                <Validation-provider
                  v-slot="{ errors, failed }"
                  v-bind="{ ...vvOptions }"
                  name="password"
                  :rules="{ required: true }"
                >
                  <vs-input
                    v-model="signupForm.password"
                    maxlength="100"
                    :danger="failed"
                    block
                    type="password"
                    placeholder="Password"
                    :progress="getPasswordComplexity(signupForm.password)"
                  >
                    <template #icon>
                      <v-icon dark>mdi-lock</v-icon>
                    </template>
                    <template v-if="!newPassword" #message-danger> {{ errors[0] }} </template>
                  </vs-input>
                </Validation-provider>
              </div>
            </v-col>
            <v-col cols="12" lg="5">
              <small class="ml-1">Name</small>
              <div class="pr-2">
                <Validation-provider
                  v-slot="{ errors, failed }"
                  v-bind="{ ...vvOptions }"
                  name="name"
                  :rules="{ required: true, alpha_spaces: true }"
                >
                  <vs-input v-model="signupForm.name" maxlength="20" :danger="failed" block placeholder="Name">
                    <template #icon>
                      <v-icon dark>mdi-account</v-icon>
                    </template>
                    <template #message-danger> {{ errors[0] }} </template>
                  </vs-input>
                </Validation-provider>
              </div>
            </v-col>
            <v-col cols="12" lg="5">
              <small class="ml-1">Last name</small>

              <div class="pr-2">
                <Validation-provider
                  v-slot="{ errors, failed }"
                  v-bind="{ ...vvOptions }"
                  name="last name"
                  :rules="{ required: true, alpha_spaces: true }"
                >
                  <vs-input v-model="signupForm.lastName" maxlength="20" :danger="failed" block placeholder="Last name">
                    <template #icon>
                      <v-icon dark>mdi-account</v-icon>
                    </template>
                    <div>{{ errors[0] }}</div>
                    <template #message-danger> {{ errors[0] }} </template>
                  </vs-input>
                </Validation-provider>
              </div>
            </v-col>

            <v-col>
              <div class="ml-n1 mt-2">
                <Base-button type="submit">
                  <v-icon left>mdi-google</v-icon>
                  Signup with google</Base-button
                >
                <Base-button type="submit" :loading="loading"> Signup</Base-button>
              </div>
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
    name: 'SignupPage',
    data() {
      return {
        vvOptions: {
          mode: 'passive',
          slim: true,
        },
        signupForm: {
          name: '',
          lastName: '',
          email: '',
          password: '',
        },
      };
    },
    computed: {
      loading: sync('loaders/signupLoader'),
      ...get('authentication', ['getPasswordComplexity']),
    },
    methods: {
      ...call('authentication', ['signup']),
      ...call('snackbar/*'),

      async validate() {
        try {
          const validated = await this.$refs.profileEdit.validate();
          if (validated) {
            this.signup(this.signupForm);
            return;
          }
          this.snackbarError('Please correct the fields in red');
        } catch (error) {
          this.snackbarError('Something went wrong');
        }
      },
    },
  };
</script>
