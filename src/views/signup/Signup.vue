<template>
  <base-split-2 col="6">
    <div class="pa-3">
      <div class="d-flex flex-wrap flex-column">
        <h1>Signup</h1>
        <p>Join the gang to unlock more content 🤓</p>
      </div>
      <ValidationObserver ref="profileEdit" slim>
        <form class="d-flex flex-column" @submit.prevent="validate()">
          <v-row no-gutters>
            <v-col cols="12" lg="10">
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
                <Validation-provider v-slot="{ errors }" slim name="email" :rules="{ required: true, email: true }">
                  <vs-input v-model="signupForm.email" maxlength="100" :danger="errors.length > 0" block placeholder="Email">
                    <template #icon>
                      <v-icon dark>mdi-at</v-icon>
                    </template>
                    <template #message-danger> {{ errors[0] }} </template>
                  </vs-input>
                </Validation-provider>
              </div>
            </v-col>
            <v-col cols="12" lg="10">
              <div class="py-5 pr-2">
                <Validation-provider v-slot="{ errors }" slim name="password" :rules="{ required: true }">
                  <vs-input
                    v-model="signupForm.password"
                    maxlength="100"
                    :danger="errors.length > 0"
                    block
                    type="password"
                    placeholder="New password"
                    :progress="getPasswordComplexity(signupForm.password)"
                  >
                    <template #icon>
                      <v-icon dark>mdi-lock</v-icon>
                    </template>
                    <template #message-danger> {{ errors[0] }} </template>
                  </vs-input>
                </Validation-provider>
              </div>
            </v-col>
            <v-col cols="12" lg="5">
              <div class="py-2 pr-2">
                <Validation-provider v-slot="{ errors }" slim name="name" :rules="{ required: true }">
                  <vs-input v-model="signupForm.name" maxlength="20" :danger="errors.length > 0" block placeholder="Name">
                    <template #icon>
                      <v-icon dark>mdi-account</v-icon>
                    </template>
                    <template #message-danger> {{ errors[0] }} </template>
                  </vs-input>
                </Validation-provider>
              </div>
            </v-col>
            <v-col cols="12" lg="5">
              <div class="py-2 pr-2">
                <Validation-provider v-slot="{ errors }" slim name="last name" :rules="{ required: true }">
                  <vs-input
                    v-model="signupForm.lastName"
                    maxlength="20"
                    :danger="errors.length > 0"
                    block
                    placeholder="Last name"
                  >
                    <template #icon>
                      <v-icon dark>mdi-account</v-icon>
                    </template>
                    <div>{{ errors[0] }}</div>
                    <template #message-danger> {{ errors[0] }} </template>
                  </vs-input>
                </Validation-provider>
              </div>
            </v-col>

            <v-col cols="12" lg="10">
              <v-card-actions class="py-7">
                <v-spacer />
                <Base-button type="submit" :loading="loading" dark color="grey darken-3" large> Signup</Base-button>
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
    name: 'SignupPage',
    data() {
      return {
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
      ...call('authentication', ['signupForm']),
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
