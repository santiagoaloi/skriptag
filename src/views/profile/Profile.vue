<template>
  <div>
    <v-slide-y-transition>
      <div v-show="imgBannerLoaded">
        <v-img
          :src="src"
          flat
          height="240"
          class="d-flex align-center"
          :transition="false"
          style="color: #ccc"
          gradient="to top right, rgba(0,0,0,.73), rgba(50,50,50,.7)"
          @load="imgBannerLoaded = true"
        >
          <v-btn
            small
            style="position: absolute; right: 0; margin-right: 20px"
            color="grey darken-3"
            dark
            @click="triggerCoverInput()"
            >Change cover image</v-btn
          >

          <!-- image upload inputs" -->
          <input ref="coverInput" style="display: none" type="file" @change="uploadCoverPhoto()" />
          <input ref="avatarInput" style="display: none" type="file" @change="uploadProfilePhoto()" />

          <div class="ml-13 d-flex align-center">
            <baseAvatarImg v-if="!profile.avatar" class="hoverAvatar" :height="180" @click="triggerAvatarInput()" />
            <v-avatar v-else min-height="180" min-width="180">
              <v-img
                class="hoverAvatar"
                min-height="100%"
                min-width="100%"
                :src="profile.avatar"
                flat
                @click="triggerAvatarInput()"
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
        <v-progress-linear v-if="progress > 0" v-model="progress" color="teal" style="position: absolute"></v-progress-linear>
      </div>
    </v-slide-y-transition>
    <v-scale-transition>
      <profile-items v-if="showProfileItems && imgBannerLoaded" />
    </v-scale-transition>
  </div>
</template>
<script>
  import { get, call, sync } from 'vuex-pathify';
  import { uploadBytesResumable, getDownloadURL, ref } from 'firebase/storage';
  import { storage } from '@/firebase/firebase';
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
        avatar: '',
        progress: 0,
        imgBannerLoaded: false,
        showProfileItems: false,
        loadingProfile: this.$vs.loading(),
      };
    },

    computed: {
      ...get('authentication', ['lastLogin', 'userId']),
      ...sync('authentication', ['profile']),
    },

    mounted() {
      this.getSrc();
      this.delayRender(800);
    },

    methods: {
      ...call('app', ['sleep']),
      ...call('authentication', ['updateProfileSettings']),

      triggerAvatarInput() {
        this.$refs.avatarInput.click();
      },

      triggerCoverInput() {
        this.$refs.coverInput.click();
      },

      uploadProfilePhoto() {
        const file = this.$refs.avatarInput.files[0];
        const photoRef = ref(storage, `users/${this.userId}/${file.name}`);
        const uploadTask = uploadBytesResumable(photoRef, file);
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            this.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          },
          (error) => {
            console.log(error.code);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              this.profile.avatar = downloadURL;
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
        const photoRef = ref(storage, `users/${this.userId}/${file.name}`);
        const uploadTask = uploadBytesResumable(photoRef, file);
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            this.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          },
          (error) => {
            console.log(error.code);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              this.profile.coverAvatar = downloadURL;
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
