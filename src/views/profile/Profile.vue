<template>
  <div>
    <v-slide-y-transition>
      <div v-show="imgBannerLoaded">
        <v-img
          :gradient="'to top , rgba(5,5,5,.9), rgba(0,0,0, .7)'"
          :src="src"
          flat
          height="240"
          class="d-flex align-center"
          :transition="false"
          style="color: #ccc"
          @load="imgBannerLoaded = true"
        >
          <div class="ml-13 d-flex align-center">
            <v-avatar min-height="200" min-width="200">
              <v-img
                style="background: #25272c"
                min-height="100%"
                min-width="100%"
                gradient="to bottom , rgba(20,20,20, .5) 40%,  rgba(0,0,0,.5) 160%"
                :src="`https://picsum.photos/1280/800?${Date.now().toString().slice(0, 1) + 12}`"
                flat
              >
                <template #placeholder>
                  <v-row class="fill-height ma-0" align="center" justify="center">
                    <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
            </v-avatar>
            <div class="ml-13">
              <p class="mb-n2">Profile</p>
              <h1 style="font-size: 350%" class="mb-2">{{ profile.name }} {{ profile.lastName }}</h1>
              <h6 class="mt-n2">Previous login: {{ lastLogin }}</h6>
            </div>
          </div>
          <template #placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
            </v-row>
          </template>
        </v-img>
      </div>
    </v-slide-y-transition>
    <v-scale-transition>
      <profile-items v-if="showProfileItems && imgBannerLoaded" />
    </v-scale-transition>
  </div>
</template>
<script>
  import { get, call, sync } from 'vuex-pathify';
  import profileItems from './ProfileItems';

  export default {
    name: 'ProfileView',
    components: {
      profileItems,
    },

    props: {
      index: {
        type: Number,
        default: 0,
      },
    },
    data() {
      return {
        src: '',
        imgBannerLoaded: false,
        showProfileItems: false,
        loadingProfile: this.$vs.loading(),
      };
    },

    computed: {
      ...get('authentication', ['lastLogin', 'user']),
      ...sync('authentication', ['profile']),
    },

    mounted() {
      this.getSrc();
      this.delayRender(800);
    },

    methods: {
      ...call('app', ['sleep']),

      getSrc() {
        setTimeout(() => {
          this.src = `https://picsum.photos/1280/800?${Date.now().toString().slice(0, 1)}`;
        }, 300);
      },

      async delayRender(ms) {
        await this.sleep(ms);
        this.showProfileItems = true;
        this.loadingProfile.close();
      },
    },
  };
</script>
<style>
  .my-card .vs-card {
    width: auto !important;
    height: 100% !important;

    max-width: unset !important;
    max-height: unset !important;
  }

  .vs-card-content {
    height: 100% !important;
  }

  .vs-loading {
    --vs-color: var(--vs-primary);
    --vs-background: 255, 255, 255;
    --vs-opacity: 0.3;

    padding: 0px;
    border-radius: unset;
  }
</style>
