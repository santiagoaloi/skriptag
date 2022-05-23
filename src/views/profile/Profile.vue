<template>
  <div v-show="isLoggedIn" :disabled="verificationInProgressLoader">
    <v-slide-y-transition>
      <div v-show="imgBannerLoaded">
        <v-hover v-slot="{ hover }">
          <v-img
            :src="src"
            flat
            height="240"
            class="d-flex align-center elevation-14"
            :transition="false"
            style="color: #ccc"
            gradient="to top right, rgba(0,0,0,.73), rgba(50,50,50,.7)"
            @load="imgBannerLoaded = true"
          >
            <v-fade-transition>
              <v-btn
                v-show="hover"
                fab
                icon
                :style="`
                 position: absolute; right: 0;
                 margin-right: ${!$vuetify.breakpoint.smAndDown ? '80px' : '20px'}`"
                class="mt-5"
                color="rgba(10,10,10 , .5)"
                dark
                @click="triggerCoverInput()"
              >
                <vs-tooltip shadow color="#ccc">
                  <v-icon class="white--text"> mdi-camera</v-icon>
                  <template #tooltip> Change cover image </template>
                </vs-tooltip>
              </v-btn>
            </v-fade-transition>

            <!-- image upload inputs -->
            <input ref="coverInput" accept="image/*" style="display: none" type="file" @change="uploadCoverPhoto()" />
            <input ref="avatarInput" accept="image/*" style="display: none" type="file" @change="uploadProfilePhoto()" />

            <div :class="$vuetify.breakpoint.smAndUp ? 'ml-13' : 'justify-center'" class="d-flex align-center justify-start">
              <v-badge
                offset-x="40"
                offset-y="34"
                bottom
                bordered
                color="black"
                :icon="profile.photoURL ? 'mdi-trash-can-outline' : 'mdi-plus'"
                overlap
                class="cursor-pointer"
              >
                <baseAvatarImg v-if="!profile.photoURL" class="hoverAvatar" :height="180" @click="triggerAvatarInput()" />

                <v-avatar v-else v-ripple class="elevation-10" size="180">
                  <v-img class="hoverAvatar" :src="profile.photoURL" flat @click="triggerAvatarInput()">
                    <template #placeholder>
                      <v-row class="fill-height ma-0" align="center" justify="center">
                        <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                      </v-row>
                    </template>
                  </v-img>
                </v-avatar>
              </v-badge>

              <div v-if="$vuetify.breakpoint.smAndUp" class="ml-13">
                <v-row no-gutters>
                  <v-col cols="12">
                    <v-chip class="mb-4" small :color="verified ? 'indigo darken-2' : 'orange darken-1'" text-color="white">
                      <v-avatar left>
                        <v-icon small> {{ verificationInProgressLoader ? 'mdi-circle-slice-2' : 'mdi-account-star' }}</v-icon>
                      </v-avatar>
                      <span v-if="verificationInProgressLoader"> loading... </span>
                      <span v-else>
                        {{ verified ? 'Verified' : 'pending verification' }}
                      </span>
                    </v-chip>
                    <v-chip v-if="(profile.roles || []).includes('root')" class="mb-4 ml-3" small color="pink" text-color="white">
                      <v-avatar left>
                        <v-icon small>mdi-lock</v-icon>
                      </v-avatar>
                      Root
                    </v-chip>
                    <p class="mb-n2">{{ profile.email }}</p>
                  </v-col>
                  <v-col cols="12">
                    <base-typing-indicator v-if="!profile.name && !profile.lastName & !profile.displayName" class="py-12" />
                  </v-col>

                  <span
                    class="d-inline-block text-truncate mb-2 font-weight-bold"
                    style="font-size: 55px"
                    :style="$vuetify.breakpoint.mdAndDown ? 'max-width: 390px' : 'max-width: 500px'"
                  >
                    {{ fullName || profile.displayName }}
                  </span>
                  <v-col cols="12">
                    <h5 class="mt-n2">
                      <span class="grey--text text--accent-1"> Previous login: {{ profile.metadata.lastSignInTime }} </span> • 44
                      followers
                    </h5>
                  </v-col>
                </v-row>
              </div>
            </div>
            <template #placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
              </v-row>
            </template>
          </v-img>
        </v-hover>

        <v-fade-transition>
          <v-alert v-if="!verified" dark dense tile color="#212326" icon="mdi-information-outline">
            Some profile settings will not be enabled until you verify your email account.
          </v-alert>
        </v-fade-transition>

        <v-progress-linear v-if="progress > 0" v-model="progress" color="indigo" style="position: absolute"></v-progress-linear>
      </div>
    </v-slide-y-transition>

    <profile-cards v-if="showProfileItems && imgBannerLoaded && $route.name === 'profile'" />

    <!-- route to profile cards (childs of profile route) -->
    <v-card-text class="px-8">
      <div class="d-flex justify-space-between mr-5 align-center">
        <div v-if="$route.name !== 'profile'" class="d-flex align-center white--text">
          <h2 class="mb-6 mt-3 cursor-pointer" @click="$router.push('/profile')">Profile</h2>
          <v-icon class="mt-n2" size="25" dark> mdi-chevron-right</v-icon>
          <h2 class="mb-6 mt-3">{{ $route.meta.title }}</h2>
        </div>

        <div>
          <v-btn class="mx-2" color="grey">Activity logs</v-btn>
          <v-btn class="mx-2" color="grey">Firebase console</v-btn>
          <v-btn class="mx-2" color="grey">Insigts</v-btn>
        </div>
      </div>

      <router-view />
    </v-card-text>
  </div>
</template>
<script>
  import { get, call, sync } from 'vuex-pathify';
  import { uploadBytesResumable, getDownloadURL, ref } from 'firebase/storage';
  import { storage } from '@/firebase/firebase';
  import profileCards from './Profile-cards';

  export default {
    name: 'ProfileView',
    components: {
      profileCards,
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
        progress: 0,
        imgBannerLoaded: false,
        showProfileItems: false,
        loadingProfile: this.$vs.loading(),
      };
    },

    computed: {
      ...get('authentication', ['fullName', 'verified', 'isLoggedIn', 'isAuthExternalProvider', 'profile']),
      ...sync('loaders', ['verificationInProgressLoader']),
      editableProfile: sync('authentication/profile'),
    },

    mounted() {
      this.getSrc();
      this.delayRender(800);
    },

    methods: {
      ...call('app', ['sleep']),
      ...call('authentication', ['updateProfileSettings', 'unlinkProfileImage']),
      ...call('snackbar/*'),

      triggerAvatarInput() {
        this.$refs.avatarInput.click();
      },

      triggerCoverInput() {
        this.$refs.coverInput.click();
      },

      uploadProfilePhoto() {
        const file = this.$refs.avatarInput.files[0];
        const fileSize = this.$refs.avatarInput.files[0].size;

        if (fileSize > 2 * 1024 * 1024) {
          this.snackbarError('The avatar image size cannot be bigger than 2MB');
          return;
        }

        const photoRef = ref(storage, `users/${this.profile.uid}/${file.name}`);
        const uploadTask = uploadBytesResumable(photoRef, file);
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            this.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          },
          (error) => {
            console.log(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              this.editableProfile.photoURL = downloadURL;
              this.updateProfileSettings();
              setTimeout(() => {
                this.progress = 0;
              }, 500);
            });
          },
        );
      },

      uploadCoverPhoto() {
        const file = this.$refs.coverInput.files[0];
        const fileSize = this.$refs.coverInput.files[0].size;

        if (fileSize > 2 * 1024 * 1024) {
          this.snackbarError('The cover image size cannot be bigger than 2MB');
          return;
        }

        const photoRef = ref(storage, `users/${this.profile.uid}/${file.name}`);
        const uploadTask = uploadBytesResumable(photoRef, file);
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            this.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          },
          (error) => {
            console.log(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              this.editableProfile.coverAvatar = downloadURL;
              this.updateProfileSettings();
              this.getSrc();
              setTimeout(() => {
                this.progress = 0;
              }, 500);
            });
          },
        );
      },

      getSrc() {
        setTimeout(() => {
          this.src = this.profile.coverAvatar || `https://media.skriptag.com/img/banner.png`;
        }, 400);
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
  [disabled] {
    cursor: wait !important;
    pointer-events: none;
  }

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

  input[type='file'] {
    display: none;
  }

  .hoverAvatar {
    cursor: pointer;
    transition: 0.3s;
  }

  .hoverAvatar:hover {
    cursor: pointer;
    transform: scale(0.98);
    transition: 0.4s;
  }
</style>
