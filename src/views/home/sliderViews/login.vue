<template>
  <div class="d-flex align-center">
    <v-img
      gradient="to bottom , rgba(20,20,20, .4) 40%,  rgba(0,0,0,.8) 160%"
      width="40vw"
      height="100vh"
      :src="`https://picsum.photos/1280/800?${Date.now().toString().slice(0, 1) + index}`"
    >
      <template #placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
        </v-row>
      </template>
    </v-img>
    <v-fade-transition>
      <v-sheet
        v-if="showSlide"
        class="pa-4 swiper-no-swiping no-select no-drag"
        width="50vw"
        color="transparent"
        style="color: #ccc"
      >
        <div class="px-15 mx-5">
          <div>
            <h1>Skriptag<span class="ml-1 primary-font-color">> </span></h1>
          </div>
          <p>
            Learn, download free application templates, access JS/VueJS training material, participate in discussions forums, earn
            points, badges and get giveaways much more!.
          </p>

          <div class="d-flex">
            <h3>Login</h3>
            <!-- <span class="d-flex align-center ml-1" style="font-size: 16px">👨‍💻</span> -->
          </div>

          <v-btn :ripple="false" x-small color="white" class="ml-n2 mb-n2" plain>Recover my password</v-btn>
          <form @submit.prevent="login()">
            <div class="d-flex flex-wrap">
              <div class="py-2 pr-2">
                <vs-input v-model="loginForm.email" block placeholder="Username">
                  <template #icon>
                    <v-icon dark>mdi-account</v-icon>
                  </template>
                </vs-input>
              </div>
              <div class="py-2 pr-2">
                <vs-input v-model="loginForm.password" block type="password" placeholder="Password">
                  <template #icon>
                    <v-icon dark>mdi-lock</v-icon>
                  </template>
                </vs-input>
              </div>
            </div>
            <div class="d-flex flex-column flex-wrap justify-start">
              <v-btn
                :loading="loading"
                type="submit"
                :ripple="false"
                color="teal white--text"
                width="100"
                class="mt-2 ml-1"
                small
              >
                Login</v-btn
              >
            </div>
          </form>
        </div>
      </v-sheet>
    </v-fade-transition>
  </div>
</template>
<script>
  import { call, sync } from 'vuex-pathify';

  export default {
    name: 'LoginSlide',
    props: {
      index: {
        type: Number,
        default: 0,
      },
    },
    data() {
      return {
        showSlide: false,
      };
    },

    computed: {
      //   ...sync('authentication', ['loginForm']),
      loading: sync('loaders/authLoader'),
      loginForm: sync('authentication/loginForm'),
    },

    created() {
      this.delayRender(400);
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
