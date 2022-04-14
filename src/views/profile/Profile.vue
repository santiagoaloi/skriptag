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
            <label class="custom-file-upload">
              <input ref="file" type="file" @change="uploadProfilePhoto()" />
              <baseAvatarImg v-if="!profile.avatar" :height="180" />
              <v-avatar v-else min-height="180" min-width="180">
                <v-img min-height="100%" min-width="100%" :src="profile.avatar" flat>
                  <template #placeholder>
                    <v-row class="fill-height ma-0" align="center" justify="center">
                      <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                    </v-row>
                  </template>
                </v-img>
              </v-avatar>
            </label>

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

      uploadProfilePhoto() {
        const file = this.$refs.file.files[0];
        console.log(file.name);
        const photoRef = ref(storage, `users/${this.userId}/${file.name}`);
        const uploadTask = uploadBytesResumable(photoRef, file);
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            this.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${this.progress}% done`);
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
              default:
                console.log(`Status Unknown`);
            }
          },
          (error) => {
            switch (error.code) {
              case 'storage/unauthorized':
                break;
              case 'storage/canceled':
                break;
              case 'storage/unknown':
                break;
              default:
                console.log(`Status Unknown`);
            }
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              this.profile.avatar = downloadURL;
              this.updateProfileSettings();
            });
          },
        );
      },

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

  input[type='file'] {
    display: none;
  }

  .custom-file-upload {
    display: inline-block;
    cursor: pointer;
    border-radius: 100px;
    height: 180px;
    width: 180px;
    transition: opacity 0.25s ease-in-out;
    -moz-transition: opacity 0.25s ease-in-out;
    -webkit-transition: opacity 0.25s ease-in-out;
  }

  .custom-file-upload:hover {
    opacity: 0.6;
    transition: opacity 0.25s ease-in-out;
    -moz-transition: opacity 0.25s ease-in-out;
    -webkit-transition: opacity 0.25s ease-in-out;
  }
</style>
