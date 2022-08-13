<template>
  <div>
    <v-expand-transition>
      <div v-show="profileBanner">
        <v-img
          eager
          :src="profile?.coverAvatar"
          flat
          height="240"
          class="d-flex align-center elevation-0"
          :class="{ 'default-banner-bg': !profile?.coverAvatar || isBannerError }"
          :transition="null"
          style="color: #ccc"
          gradient="to top right, rgba(0,0,0,.9), rgba(30,30,32,.7)"
          @error="isBannerError = true"
        >
          <div v-if="!verified" class="pb-5 pl-10" style="font-size: 12px">
            <v-icon small dark>$mdiInformationOutline</v-icon> Some profile settings will not be enabled until you verify your
            email account.
          </div>

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
              :icon="profile?.photoURL ? '$mdiTrashCanOutline' : '$mdiPlus'"
              overlapa
              class="cursor-pointer"
            >
              <baseAvatarImg v-if="!profile?.photoURL" class="hoverAvatar" :height="180" @click="triggerUploadProfilePhoto()" />
              <v-avatar v-else class="elevation-13" size="160">
                <v-img
                  eager
                  :transition="null"
                  class="hoverAvatar"
                  :src="profile?.photoURL"
                  flat
                  @click="triggerUploadProfilePhoto()"
                  @load="media.push('profileAvatar')"
                >
                  <template #placeholder>
                    <v-row class="fill-height ma-0" align="center" justify="center">
                      <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                    </v-row>
                  </template>
                </v-img>
              </v-avatar>
            </v-badge>

            <div v-if="$vuetify.breakpoint.smAndUp" class="d-flex flex-column ml-10">
              <div class="d-flex align-center">
                <vs-tooltip v-if="verified" shadow color="#ccc">
                  <div class="pointer-events-none ml-n1">
                    <v-btn :loading="verificationInProgressLoader" icon color="#ada0fa">
                      <v-icon> {{ verificationInProgressLoader ? '$mdiCircleSlice2' : '$mdiCheckDecagram' }}</v-icon>
                    </v-btn>
                  </div>
                  <template #tooltip> Verified </template>
                </vs-tooltip>

                <vs-tooltip shadow color="#ccc">
                  <div v-if="(profile?.roles || []).includes('root')" class="mx-2 pointer-events-none">
                    <v-btn color="rgba(10,10,10 , .5)" small fab icon>
                      <v-icon class="white--text"> $mdiLock</v-icon>
                    </v-btn>
                  </div>
                  <template #tooltip> Root </template>
                </vs-tooltip>

                <!-- <div class="d-flex flex-grow-1" /> -->

                <v-fade-transition>
                  <v-btn fab icon color="rgba(10,10,10 , .5)" dark small @click="triggerUploadCoverPhoto()">
                    <vs-tooltip shadow color="#ccc">
                      <v-icon class="white--text"> $mdiCamera</v-icon>
                      <template #tooltip> Change cover image </template>
                    </vs-tooltip>
                  </v-btn>
                </v-fade-transition>
              </div>

              <v-fade-transition hide-on-leave>
                <base-typing-indicator v-if="!profile?.name && !profile?.lastName && !profile?.displayName" />
              </v-fade-transition>

              <span
                class="d-inline-block text-truncate font-weight-bold"
                style="font-size: 45px"
                :style="$vuetify.breakpoint.mdAndDown ? 'max-width: 390px' : 'max-width: 500px'"
              >
                {{ fullName || profile?.displayName }}
              </span>
              <div class="d-inline-block justify-start pl-1">
                <small>{{ profile?.email }}</small>
              </div>
            </div>
          </div>
        </v-img>
      </div>
    </v-expand-transition>

    <v-sheet class="d-flex align-center justify-center blue" height="0">
      <v-btn style="z-index: 99 !important" height="14" dark x-small color="#38404b" @click="profileBanner = !profileBanner"
        ><v-icon> {{ profileBanner ? '$mdiChevronUp' : '$mdiChevronDown' }} </v-icon></v-btn
      >
    </v-sheet>

    <v-progress-linear v-model="progress" :active="progress > 0" color="indigo" style="position: absolute"></v-progress-linear>
  </div>
</template>
<script>
  import { get, call, sync } from 'vuex-pathify';
  import { uploadBytesResumable, getDownloadURL, ref } from 'firebase/storage';
  import { storage } from '@/firebase/firebase';

  export default {
    name: 'ProfileBanner',

    data() {
      return {
        progress: 0,
        isBannerError: false,
        media: [],
      };
    },

    computed: {
      ...get('authentication', ['fullName', 'verified', 'profile']),
      ...sync('loaders', ['verificationInProgressLoader']),
      ...sync('app', ['profileBanner']),

      src() {
        return this.profile?.coverAvatar;
      },

      editableProfile: sync('authentication/profile'),
    },

    methods: {
      ...call('authentication', ['updateProfileSettings', 'unlinkProfileImage']),
      ...call('snackbar/*'),

      triggerUploadProfilePhoto() {
        this.$refs.avatarInput.click();
      },

      triggerUploadCoverPhoto() {
        this.$refs.coverInput.click();
      },

      uploadProfilePhoto() {
        const fileSize = this.$refs.avatarInput.files[0].size;

        if (fileSize > 2 * 1024 * 1024) {
          this.snackbarError('The avatar image should be less than 2MB');
          return;
        }

        const file = this.$refs.avatarInput.files[0];

        const metadata = {
          cacheControl: 'public,max-age=2592000',
        };

        const photoRef = ref(storage, `users/${this.profile.uid}/${file.name}`);
        const uploadTask = uploadBytesResumable(photoRef, file, metadata);
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            this.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(metadata);
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

        const metadata = {
          cacheControl: 'public,max-age=2592000',
        };

        if (!file) {
          return;
        }

        const photoRef = ref(storage, `users/${this.profile.uid}/${file.name}`);
        const uploadTask = uploadBytesResumable(photoRef, file, metadata);

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
    },
  };
</script>
<style>
  [disabled] {
    cursor: wait !important;
    pointer-events: none;
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
