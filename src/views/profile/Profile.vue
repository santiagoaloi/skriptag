<template>
  <div v-if="profile">
    <v-hover v-slot="{ hover }">
      <v-img
        :src="src"
        flat
        height="240"
        class="d-flex align-center elevation-3"
        transition="fade-transition"
        style="color: #ccc"
        :gradient="gradientOptions()"
        @load="imgCounter++"
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
              <v-icon class="white--text"> $mdiCamera</v-icon>
              <template #tooltip> Change cover image </template>
            </vs-tooltip>
          </v-btn>
        </v-fade-transition>

        <!-- image upload inputs -->
        <input ref="coverInput" accept="image/*" style="display: none" type="file" @change="uploadCoverPhoto()" />
        <input ref="avatarInput" accept="image/*" style="display: none" type="file" @change="uploadProfilePhoto()" />

        <div :class="$vuetify.breakpoint.smAndUp ? 'mx-13' : 'justify-center'" class="media d-flex align-center justify-start">
          <v-badge
            offset-x="40"
            offset-y="34"
            bottom
            bordered
            color="black"
            :icon="profile.photoURL ? '$mdiTrashCanOutline' : '$mdiPlus'"
            overlapa
            class="cursor-pointer"
          >
            <baseAvatarImg v-if="!profile.photoURL" class="hoverAvatar" :height="180" @click="triggerAvatarInput()" />
            <v-avatar v-else v-ripple class="elevation-13" size="180">
              <v-img transition="fade-transition" class="hoverAvatar" :src="profile.photoURL" flat @click="triggerAvatarInput()">
                <template #placeholder>
                  <v-row class="fill-height ma-0" align="center" justify="center">
                    <v-icon dark size="40">$mdiCamera</v-icon>
                  </v-row>
                </template>
              </v-img>
            </v-avatar>
          </v-badge>

          <div v-if="$vuetify.breakpoint.smAndUp" class="px-13">
            <v-row no-gutters align="center">
              <v-col cols="12">
                <v-chip
                  v-if="(profile.roles || []).includes('root')"
                  class="mb-4 mr-3 elevation-6"
                  small
                  color="brown"
                  text-color="white"
                >
                  <v-avatar left>
                    <v-icon small>$mdiLock</v-icon>
                  </v-avatar>
                  Root
                </v-chip>
                <v-chip
                  class="mb-4 elevation-6"
                  small
                  :color="verified ? 'indigo darken-3' : 'orange darken-1'"
                  text-color="white"
                >
                  <v-avatar left>
                    <v-icon small> {{ verificationInProgressLoader ? '$mdiCircleSlice2' : '$mdiAccountStar' }}</v-icon>
                  </v-avatar>
                  <span v-if="verificationInProgressLoader"> loading... </span>
                  <span v-else>
                    {{ verified ? 'Verified' : 'Pending Verification' }}
                  </span>
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
      </v-img>
    </v-hover>

    <v-alert :value="!verified" dark dense tile color="#212326" icon="$mdiInformationOutline">
      Some profile settings will not be enabled until you verify your email account.
    </v-alert>

    <v-progress-linear v-if="progress > 0" v-model="progress" color="indigo" style="position: absolute"></v-progress-linear>

    <profile-cards v-show="$route.name === 'profile'" />

    <!-- route to profile cards (childs of profile) -->
    <v-card-text v-show="$route.name !== 'profile'" class="px-8">
      <div class="d-flex justify-space-between mr-5 align-center">
        <div class="d-flex align-center linkColor">
          <span class="mb-6 mt-3 cursor-pointer underlineHover bread" @click="$router.push('/profile')">Profile</span>
          <v-icon class="mt-n2 grey--text text--darken-1 mt-n3" size="18 " dark> $mdiSlashForward</v-icon>
          <span class="mb-6 mt-3 underlineHover bread">{{ $route.meta.title }}</span>
        </div>
      </div>

      <keep-alive>
        <router-view />
      </keep-alive>
    </v-card-text>
  </div>
</template>
<script>
  import { isEmpty } from 'lodash';
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
        imgCounter: 0,
        progress: 0,
        imgBannerLoaded: false,
        showProfileItems: false,
      };
    },

    computed: {
      ...get('authentication', ['fullName', 'verified', 'isLoggedIn', 'isAuthExternalProvider', 'profile', 'isProfileLoaded']),
      ...sync('loaders', ['verificationInProgressLoader']),

      src() {
        return this.profile?.coverAvatar || `https://media.skriptag.com/img/banner.png`;
      },

      editableProfile: sync('authentication/profile'),
    },

    methods: {
      ...call('app', ['sleep']),
      ...call('authentication', ['updateProfileSettings', 'unlinkProfileImage']),
      ...call('snackbar/*'),

      gradientOptions() {
        const direction = 'to top right';
        const fromColor = 'rgba(10,10,10,.7)';
        const toColor = 'rgba(10,10,10,.65)';

        return `${direction}, ${fromColor}, ${toColor}`;
      },

      isEmpty_(v) {
        return isEmpty(v);
      },

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
          this.snackbarError('The avatar image should be less than 2MB');
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
            // console.log(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              this.editableProfile.photoURL = downloadURL;
              this.updateProfileSettings();
              setTimeout(() => {
                this.progress = 0;
              }, 200);
            });
          },
        );
      },

      uploadCoverPhoto() {
        const file = this.$refs.coverInput.files[0];
        const fileSize = this.$refs.coverInput.files[0].size;

        if (fileSize > 2 * 1024 * 1024) {
          this.snackbarError('The cover image should be less than 2MB');
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
              setTimeout(() => {
                this.progress = 0;
              }, 200);
            });
          },
        );
      },

      async delayRender(ms) {
        await this.sleep(ms);
        this.showProfileItems = true;
        // this.loadingProfile.close();
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

  .linkColor {
    /* color: #539bf5; */
    color: #5c77a5;
  }

  .slashcolor {
    color: #768390;
  }

  .bread {
    font-weight: 400 !important;
    font-size: 15px;
  }

  .decreaseColor {
    filter: grayscale(0.5);
  }
</style>
