<template>
  <div class="d-flex flex-wrap flex-column">
    <ValidationObserver ref="profileEdit" slim>
      <form class="d-flex flex-column" @submit.prevent="validate()">
        <v-row>
          <v-col cols="12" lg="12">
            <small class="ml-1">Email</small>
            <div class="pr-2">
              <Validation-provider
                v-slot="{ errors, failed }"
                v-bind="{ ...vvOptions }"
                name="email"
                :rules="{ required: true, email: true }"
              >
                <vs-input
                  v-model.trim="signupForm.email"
                  maxlength="100"
                  :danger="failed"
                  block
                  placeholder="Email"
                  @focus="resetValidation()"
                >
                  <template #icon>
                    <v-icon dark>mdi-at</v-icon>
                  </template>
                  <template #message-danger>
                    <v-icon v-if="failed" color="pink" style="margin-top: -1px" x-small dark>mdi-alert-circle-outline</v-icon>
                    {{ errors[0] }}
                  </template>
                </vs-input>
              </Validation-provider>
            </div>
          </v-col>
          <v-col cols="12" lg="6">
            <small class="ml-1">Password</small>
            <div class="pr-2">
              <Validation-provider
                v-slot="{ errors, failed }"
                v-bind="{ ...vvOptions }"
                name="password"
                :rules="{ required: true, confirmed: 'confirmation' }"
              >
                <vs-input
                  v-model="signupForm.password"
                  maxlength="100"
                  :danger="failed"
                  block
                  type="password"
                  placeholder="At least 6 characters"
                  :progress="!failed ? getPasswordComplexity(signupForm.password) : null"
                  @focus="resetValidation()"
                >
                  <template #icon>
                    <v-icon dark>mdi-lock</v-icon>
                  </template>

                  <template #message-danger>
                    <v-icon v-if="failed" color="pink" style="margin-top: -1px" x-small dark>mdi-alert-circle-outline</v-icon>
                    {{ errors[0] }}
                  </template>
                </vs-input>
              </Validation-provider>
            </div>
          </v-col>
          <v-col cols="12" lg="6">
            <small class="ml-1">Confirm password</small>
            <div class="pr-2">
              <Validation-provider
                v-slot="{ errors, failed }"
                v-bind="{ ...vvOptions }"
                name="password'"
                :rules="{ required: true }"
                vid="confirmation"
              >
                <vs-input
                  v-model="signupForm.confirmNewPasswordRepeat"
                  maxlength="100"
                  :danger="failed"
                  block
                  type="password"
                  placeholder="Repeat password"
                  @focus="resetValidation()"
                >
                  <template #icon>
                    <v-icon dark>mdi-lock</v-icon>
                  </template>

                  <template #message-danger>
                    <v-icon v-if="failed" color="pink" style="margin-top: -1px" x-small dark>mdi-alert-circle-outline</v-icon>
                    {{ errors[0] }}
                  </template>
                </vs-input>
              </Validation-provider>
            </div>
          </v-col>
          <v-col cols="12" lg="6">
            <small class="ml-1">Name</small>
            <div class="pr-2">
              <Validation-provider
                v-slot="{ errors, failed }"
                v-bind="{ ...vvOptions }"
                name="name"
                :rules="{ required: true, alpha_spaces: true }"
              >
                <vs-input
                  v-model="signupForm.name"
                  maxlength="20"
                  :danger="failed"
                  block
                  placeholder="Name"
                  @focus="resetValidation()"
                >
                  <template #icon>
                    <v-icon dark>mdi-account</v-icon>
                  </template>
                  <template #message-danger>
                    <v-icon v-if="failed" color="pink" style="margin-top: -1px" x-small dark>mdi-alert-circle-outline</v-icon>
                    {{ errors[0] }}
                  </template>
                </vs-input>
              </Validation-provider>
            </div>
          </v-col>
          <v-col cols="12" lg="6">
            <small class="ml-1">Last name</small>

            <div class="pr-2">
              <Validation-provider
                v-slot="{ errors, failed }"
                v-bind="{ ...vvOptions }"
                name="last name"
                :rules="{ required: true, alpha_spaces: true }"
              >
                <vs-input
                  v-model="signupForm.lastName"
                  maxlength="20"
                  :danger="failed"
                  block
                  placeholder="Last name"
                  @focus="resetValidation()"
                >
                  <template #icon>
                    <v-icon dark>mdi-account</v-icon>
                  </template>
                  <template #message-danger>
                    <v-icon v-if="failed" color="pink" style="margin-top: -1px" x-small dark>mdi-alert-circle-outline</v-icon>
                    {{ errors[0] }}
                  </template>
                </vs-input>
              </Validation-provider>
            </div>
          </v-col>

          <v-col cols="12">
            <div :style="$vuetify.breakpoint.smAndUp ? 'float:right' : ''" class="mr-3 mt-2">
              <Base-button type="submit" :loading="loading"> Signup</Base-button>
            </div>
          </v-col>
        </v-row>
      </form>
    </ValidationObserver>
  </div>
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
          confirmNewPasswordRepeat: '',
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

      resetValidation() {
        this.$refs.profileEdit.reset();
      },

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
