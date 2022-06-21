<template>
  <div v-if="profile">
    <v-expand-transition>
      <div v-show="isBannerVisible">
        <v-hover v-slot="{ hover }">
          <v-img
            :src="profile.coverAvatar"
            flat
            height="240"
            class="d-flex align-center elevation-3"
            :class="{ 'default-banner-bg': !profile.coverAvatar || isBannerError }"
            transition="fade-transition"
            style="color: #ccc"
            :gradient="gradientOptions()"
            @error="isBannerError = true"
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
                small
                @click="triggerUploadCoverPhoto()"
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

            <div
              :class="$vuetify.breakpoint.smAndUp ? 'mx-13' : 'justify-center'"
              class="media d-flex align-center justify-start"
            >
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
                <baseAvatarImg v-if="!profile.photoURL" class="hoverAvatar" :height="180" @click="triggerUploadProfilePhoto()" />
                <v-avatar v-else v-ripple class="elevation-13" size="180">
                  <v-img
                    transition="fade-transition"
                    class="hoverAvatar"
                    :src="profile.photoURL"
                    flat
                    @click="triggerUploadProfilePhoto()"
                  >
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
      </div>
    </v-expand-transition>

    <v-sheet class="d-flex align-center justify-center blue" height="0">
      <v-btn style="z-index: 99 !important" height="14" dark x-small color="#38404b" @click="isBannerVisible = !isBannerVisible"
        ><v-icon> {{ isBannerVisible ? '$mdiChevronUp' : '$mdiChevronDown' }} </v-icon></v-btn
      >
    </v-sheet>

    <v-alert class="mr-2" :value="!verified" dark dense tile color="#ccc" text dismissible icon="$mdiInformationOutline">
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
        progress: 0,
        showProfileItems: false,
        isBannerVisible: true,
        isBannerError: false,
      };
    },

    computed: {
      ...get('authentication', ['fullName', 'verified', 'isLoggedIn', 'isAuthExternalProvider', 'profile', 'isProfileLoaded']),
      ...sync('loaders', ['verificationInProgressLoader']),

      src() {
        return this.profile.coverAvatar || `https://media.skriptag.com/img/banner.png`;
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

      triggerUploadProfilePhoto() {
        this.$refs.avatarInput.click();
      },

      triggerUploadCoverPhoto() {
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

  .default-banner-bg {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.com/svgjs' width='1440' height='560' preserveAspectRatio='none' viewBox='0 0 1440 560'%3e%3cg mask='url(%26quot%3b%23SvgjsMask1410%26quot%3b)' fill='none'%3e%3cpath d='M256.83 108.78L382.4 181.28L382.4 326.28L256.83 398.78L131.25 326.28L131.25 181.28zM131.25 326.28L256.83 398.78L256.83 543.78L131.25 616.28L5.67 543.78L5.67 398.78zM256.83 543.78L382.4 616.28L382.4 761.28L256.83 833.78L131.25 761.28L131.25 616.28zM382.4 -108.72L507.98 -36.22L507.98 108.78L382.4 181.28L256.83 108.78L256.83 -36.22zM382.4 326.28L507.98 398.78L507.98 543.78L382.4 616.28L256.83 543.78L256.83 398.78zM633.56 -108.72L759.14 -36.22L759.14 108.78L633.56 181.28L507.98 108.78L507.98 -36.22zM759.14 543.78L884.71 616.28L884.71 761.28L759.14 833.78L633.56 761.28L633.56 616.28zM884.71 -108.72L1010.29 -36.22L1010.29 108.78L884.71 181.28L759.14 108.78L759.14 -36.22zM884.71 326.28L1010.29 398.78L1010.29 543.78L884.71 616.28L759.14 543.78L759.14 398.78zM1135.87 -108.72L1261.45 -36.22L1261.45 108.78L1135.87 181.28L1010.29 108.78L1010.29 -36.22zM1261.45 543.78L1387.02 616.28L1387.02 761.28L1261.45 833.78L1135.87 761.28L1135.87 616.28zM1512.6 108.78L1638.18 181.28L1638.18 326.28L1512.6 398.78L1387.02 326.28L1387.02 181.28z' stroke='rgba(59%2c 154%2c 139%2c 0.35)' stroke-width='2'%3e%3c/path%3e%3cpath d='M242.33 108.78 a14.5 14.5 0 1 0 29 0 a14.5 14.5 0 1 0 -29 0zM367.9 181.28 a14.5 14.5 0 1 0 29 0 a14.5 14.5 0 1 0 -29 0zM367.9 326.28 a14.5 14.5 0 1 0 29 0 a14.5 14.5 0 1 0 -29 0zM242.33 398.78 a14.5 14.5 0 1 0 29 0 a14.5 14.5 0 1 0 -29 0zM116.75 326.28 a14.5 14.5 0 1 0 29 0 a14.5 14.5 0 1 0 -29 0zM116.75 181.28 a14.5 14.5 0 1 0 29 0 a14.5 14.5 0 1 0 -29 0zM242.33 543.78 a14.5 14.5 0 1 0 29 0 a14.5 14.5 0 1 0 -29 0zM116.75 616.28 a14.5 14.5 0 1 0 29 0 a14.5 14.5 0 1 0 -29 0zM-8.83 543.78 a14.5 14.5 0 1 0 29 0 a14.5 14.5 0 1 0 -29 0zM-8.83 398.78 a14.5 14.5 0 1 0 29 0 a14.5 14.5 0 1 0 -29 0zM367.9 616.28 a14.5 14.5 0 1 0 29 0 a14.5 14.5 0 1 0 -29 0zM367.9 761.28 a14.5 14.5 0 1 0 29 0 a14.5 14.5 0 1 0 -29 0zM242.33 833.78 a14.5 14.5 0 1 0 29 0 a14.5 14.5 0 1 0 -29 0zM116.75 761.28 a14.5 14.5 0 1 0 29 0 a14.5 14.5 0 1 0 -29 0zM367.9 -108.72 a14.5 14.5 0 1 0 29 0 a14.5 14.5 0 1 0 -29 0zM493.48 -36.22 a14.5 14.5 0 1 0 29 0 a14.5 14.5 0 1 0 -29 0zM493.48 108.78 a14.5 14.5 0 1 0 29 0 a14.5 14.5 0 1 0 -29 0zM242.33 -36.22 a14.5 14.5 0 1 0 29 0 a14.5 14.5 0 1 0 -29 0zM493.48 398.78 a14.5 14.5 0 1 0 29 0 a14.5 14.5 0 1 0 -29 0zM493.48 543.78 a14.5 14.5 0 1 0 29 0 a14.5 14.5 0 1 0 -29 0zM619.06 -108.72 a14.5 14.5 0 1 0 29 0 a14.5 14.5 0 1 0 -29 0zM744.64 -36.22 a14.5 14.5 0 1 0 29 0 a14.5 14.5 0 1 0 -29 0zM744.64 108.78 a14.5 14.5 0 1 0 29 0 a14.5 14.5 0 1 0 -29 0zM619.06 181.28 a14.5 14.5 0 1 0 29 0 a14.5 14.5 0 1 0 -29 0zM744.64 543.78 a14.5 14.5 0 1 0 29 0 a14.5 14.5 0 1 0 -29 0zM870.21 616.28 a14.5 14.5 0 1 0 29 0 a14.5 14.5 0 1 0 -29 0zM870.21 761.28 a14.5 14.5 0 1 0 29 0 a14.5 14.5 0 1 0 -29 0zM744.64 833.78 a14.5 14.5 0 1 0 29 0 a14.5 14.5 0 1 0 -29 0zM619.06 761.28 a14.5 14.5 0 1 0 29 0 a14.5 14.5 0 1 0 -29 0zM619.06 616.28 a14.5 14.5 0 1 0 29 0 a14.5 14.5 0 1 0 -29 0zM870.21 -108.72 a14.5 14.5 0 1 0 29 0 a14.5 14.5 0 1 0 -29 0zM995.79 -36.22 a14.5 14.5 0 1 0 29 0 a14.5 14.5 0 1 0 -29 0zM995.79 108.78 a14.5 14.5 0 1 0 29 0 a14.5 14.5 0 1 0 -29 0zM870.21 181.28 a14.5 14.5 0 1 0 29 0 a14.5 14.5 0 1 0 -29 0zM870.21 326.28 a14.5 14.5 0 1 0 29 0 a14.5 14.5 0 1 0 -29 0zM995.79 398.78 a14.5 14.5 0 1 0 29 0 a14.5 14.5 0 1 0 -29 0zM995.79 543.78 a14.5 14.5 0 1 0 29 0 a14.5 14.5 0 1 0 -29 0zM744.64 398.78 a14.5 14.5 0 1 0 29 0 a14.5 14.5 0 1 0 -29 0zM1121.37 -108.72 a14.5 14.5 0 1 0 29 0 a14.5 14.5 0 1 0 -29 0zM1246.95 -36.22 a14.5 14.5 0 1 0 29 0 a14.5 14.5 0 1 0 -29 0zM1246.95 108.78 a14.5 14.5 0 1 0 29 0 a14.5 14.5 0 1 0 -29 0zM1121.37 181.28 a14.5 14.5 0 1 0 29 0 a14.5 14.5 0 1 0 -29 0zM1246.95 543.78 a14.5 14.5 0 1 0 29 0 a14.5 14.5 0 1 0 -29 0zM1372.52 616.28 a14.5 14.5 0 1 0 29 0 a14.5 14.5 0 1 0 -29 0zM1372.52 761.28 a14.5 14.5 0 1 0 29 0 a14.5 14.5 0 1 0 -29 0zM1246.95 833.78 a14.5 14.5 0 1 0 29 0 a14.5 14.5 0 1 0 -29 0zM1121.37 761.28 a14.5 14.5 0 1 0 29 0 a14.5 14.5 0 1 0 -29 0zM1121.37 616.28 a14.5 14.5 0 1 0 29 0 a14.5 14.5 0 1 0 -29 0zM1498.1 108.78 a14.5 14.5 0 1 0 29 0 a14.5 14.5 0 1 0 -29 0zM1623.68 181.28 a14.5 14.5 0 1 0 29 0 a14.5 14.5 0 1 0 -29 0zM1623.68 326.28 a14.5 14.5 0 1 0 29 0 a14.5 14.5 0 1 0 -29 0zM1498.1 398.78 a14.5 14.5 0 1 0 29 0 a14.5 14.5 0 1 0 -29 0zM1372.52 326.28 a14.5 14.5 0 1 0 29 0 a14.5 14.5 0 1 0 -29 0zM1372.52 181.28 a14.5 14.5 0 1 0 29 0 a14.5 14.5 0 1 0 -29 0z' fill='rgba(59%2c 154%2c 139%2c 0.35)'%3e%3c/path%3e%3cpath d='M3.73 -24.22L45.3 -0.22L45.3 47.78L3.73 71.78L-37.84 47.78L-37.84 -0.22zM3.73 119.78L45.3 143.78L45.3 191.78L3.73 215.78L-37.84 191.78L-37.84 143.78zM45.3 191.78L86.87 215.78L86.87 263.78L45.3 287.78L3.73 263.78L3.73 215.78zM45.3 479.78L86.87 503.78L86.87 551.78L45.3 575.78L3.73 551.78L3.73 503.78zM3.73 551.78L45.3 575.78L45.3 623.78L3.73 647.78L-37.84 623.78L-37.84 575.78zM86.87 -24.22L128.44 -0.22L128.44 47.78L86.87 71.78L45.3 47.78L45.3 -0.22zM128.44 191.78L170.01 215.78L170.01 263.78L128.44 287.78L86.87 263.78L86.87 215.78zM86.87 263.78L128.44 287.78L128.44 335.78L86.87 359.78L45.3 335.78L45.3 287.78zM128.44 335.78L170.01 359.78L170.01 407.78L128.44 431.78L86.87 407.78L86.87 359.78zM170.01 -24.22L211.58 -0.22L211.58 47.78L170.01 71.78L128.44 47.78L128.44 -0.22zM211.58 47.78L253.15 71.78L253.15 119.78L211.58 143.78L170.01 119.78L170.01 71.78zM170.01 119.78L211.58 143.78L211.58 191.78L170.01 215.78L128.44 191.78L128.44 143.78zM211.58 191.78L253.15 215.78L253.15 263.78L211.58 287.78L170.01 263.78L170.01 215.78zM294.72 47.78L336.29 71.78L336.29 119.78L294.72 143.78L253.15 119.78L253.15 71.78zM377.86 47.78L419.43 71.78L419.43 119.78L377.86 143.78L336.29 119.78L336.29 71.78zM336.29 119.78L377.86 143.78L377.86 191.78L336.29 215.78L294.72 191.78L294.72 143.78zM377.86 191.78L419.43 215.78L419.43 263.78L377.86 287.78L336.29 263.78L336.29 215.78zM336.29 407.78L377.86 431.78L377.86 479.78L336.29 503.78L294.72 479.78L294.72 431.78zM377.86 479.78L419.43 503.78L419.43 551.78L377.86 575.78L336.29 551.78L336.29 503.78zM336.29 551.78L377.86 575.78L377.86 623.78L336.29 647.78L294.72 623.78L294.72 575.78zM461 335.78L502.57 359.78L502.57 407.78L461 431.78L419.43 407.78L419.43 359.78zM419.43 551.78L461 575.78L461 623.78L419.43 647.78L377.86 623.78L377.86 575.78zM544.15 191.78L585.72 215.78L585.72 263.78L544.15 287.78L502.57 263.78L502.57 215.78zM544.15 335.78L585.72 359.78L585.72 407.78L544.15 431.78L502.57 407.78L502.57 359.78zM502.57 407.78L544.15 431.78L544.15 479.78L502.57 503.78L461 479.78L461 431.78zM502.57 551.78L544.15 575.78L544.15 623.78L502.57 647.78L461 623.78L461 575.78zM627.29 47.78L668.86 71.78L668.86 119.78L627.29 143.78L585.72 119.78L585.72 71.78zM585.72 119.78L627.29 143.78L627.29 191.78L585.72 215.78L544.15 191.78L544.15 143.78zM668.86 263.78L710.43 287.78L710.43 335.78L668.86 359.78L627.29 335.78L627.29 287.78zM710.43 479.78L752 503.78L752 551.78L710.43 575.78L668.86 551.78L668.86 503.78zM752 119.78L793.57 143.78L793.57 191.78L752 215.78L710.43 191.78L710.43 143.78zM835.14 119.78L876.71 143.78L876.71 191.78L835.14 215.78L793.57 191.78L793.57 143.78zM835.14 263.78L876.71 287.78L876.71 335.78L835.14 359.78L793.57 335.78L793.57 287.78zM876.71 479.78L918.28 503.78L918.28 551.78L876.71 575.78L835.14 551.78L835.14 503.78zM918.28 -24.22L959.85 -0.22L959.85 47.78L918.28 71.78L876.71 47.78L876.71 -0.22zM959.85 191.78L1001.42 215.78L1001.42 263.78L959.85 287.78L918.28 263.78L918.28 215.78zM918.28 263.78L959.85 287.78L959.85 335.78L918.28 359.78L876.71 335.78L876.71 287.78zM959.85 335.78L1001.42 359.78L1001.42 407.78L959.85 431.78L918.28 407.78L918.28 359.78zM918.28 551.78L959.85 575.78L959.85 623.78L918.28 647.78L876.71 623.78L876.71 575.78zM1001.42 -24.22L1042.99 -0.22L1042.99 47.78L1001.42 71.78L959.85 47.78L959.85 -0.22zM1001.42 119.78L1042.99 143.78L1042.99 191.78L1001.42 215.78L959.85 191.78L959.85 143.78zM1042.99 191.78L1084.56 215.78L1084.56 263.78L1042.99 287.78L1001.42 263.78L1001.42 215.78zM1001.42 263.78L1042.99 287.78L1042.99 335.78L1001.42 359.78L959.85 335.78L959.85 287.78zM1042.99 479.78L1084.56 503.78L1084.56 551.78L1042.99 575.78L1001.42 551.78L1001.42 503.78zM1084.56 -24.22L1126.13 -0.22L1126.13 47.78L1084.56 71.78L1042.99 47.78L1042.99 -0.22zM1126.13 47.78L1167.7 71.78L1167.7 119.78L1126.13 143.78L1084.56 119.78L1084.56 71.78zM1084.56 119.78L1126.13 143.78L1126.13 191.78L1084.56 215.78L1042.99 191.78L1042.99 143.78zM1167.7 119.78L1209.27 143.78L1209.27 191.78L1167.7 215.78L1126.13 191.78L1126.13 143.78zM1209.27 335.78L1250.84 359.78L1250.84 407.78L1209.27 431.78L1167.7 407.78L1167.7 359.78zM1209.27 479.78L1250.84 503.78L1250.84 551.78L1209.27 575.78L1167.7 551.78L1167.7 503.78zM1167.7 551.78L1209.27 575.78L1209.27 623.78L1167.7 647.78L1126.13 623.78L1126.13 575.78zM1375.55 47.78L1417.12 71.78L1417.12 119.78L1375.55 143.78L1333.98 119.78L1333.98 71.78zM1417.12 -24.22L1458.69 -0.22L1458.69 47.78L1417.12 71.78L1375.55 47.78L1375.55 -0.22zM1458.69 47.78L1500.26 71.78L1500.26 119.78L1458.69 143.78L1417.12 119.78L1417.12 71.78zM1417.12 119.78L1458.69 143.78L1458.69 191.78L1417.12 215.78L1375.55 191.78L1375.55 143.78zM1417.12 263.78L1458.69 287.78L1458.69 335.78L1417.12 359.78L1375.55 335.78L1375.55 287.78zM1417.12 551.78L1458.69 575.78L1458.69 623.78L1417.12 647.78L1375.55 623.78L1375.55 575.78z' stroke='rgba(55%2c 73%2c 73%2c 0.67)' stroke-width='2'%3e%3c/path%3e%3c/g%3e%3cdefs%3e%3cmask id='SvgjsMask1410'%3e%3crect width='1440' height='560' fill='white'%3e%3c/rect%3e%3c/mask%3e%3c/defs%3e%3c/svg%3e");
  }
</style>
