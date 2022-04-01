<template>
  <div>
    <v-fade-transition>
      <div v-show="imgBannerLoaded">
        <v-img
          :gradient="'to top , rgba(5,5,5,.9), rgba(0,0,0, .7)'"
          :src="src"
          flat
          height="300"
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
                gradient="to bottom , rgba(20,20,20, .4) 40%,  rgba(0,0,0,.8) 160%"
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
              <h1 style="font-size: 350%" class="mb-2">{{ user.email }}</h1>
              <h6 class="mt-n2">{{ lastLogin }}</h6>
            </div>
          </div>
          <template #placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
            </v-row>
          </template>
        </v-img>
        <base-no-split>
          <template #left>
            <v-row>
              <v-col cols="4">
                <vs-card class="my-card">
                  <template #title>
                    <h3>Pot with a plant</h3>
                  </template>
                  <template #img>
                    <img :src="`https://picsum.photos/1280/800?${Date.now().toString().slice(0, 1)}`" alt="" />
                  </template>
                  <template #text>
                    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
                  </template>
                  <template #interactions>
                    <vs-button danger icon>
                      <i class="bx bx-heart"></i>
                    </vs-button>
                    <vs-button class="btn-chat" shadow primary>
                      <i class="bx bx-chat"></i>
                      <span class="span"> 54 </span>
                    </vs-button>
                  </template>
                </vs-card>
              </v-col>
              <v-col cols="3">
                <vs-card class="my-card">
                  <template #title>
                    <h3>Pot with a plant</h3>
                  </template>
                  <template #img>
                    <img :src="`https://picsum.photos/1280/800?${Date.now().toString().slice(0, 1)}`" alt="" />
                  </template>
                  <template #text>
                    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
                  </template>
                  <template #interactions>
                    <vs-button danger icon>
                      <i class="bx bx-heart"></i>
                    </vs-button>
                    <vs-button class="btn-chat" shadow primary>
                      <i class="bx bx-chat"></i>
                      <span class="span"> 54 </span>
                    </vs-button>
                  </template>
                </vs-card>
              </v-col>
              <v-col cols="5" align-self="stretch">
                <vs-card class="my-card">
                  <template #title>
                    <h3>Pot with a plant</h3>
                  </template>
                  <template #img>
                    <img :src="`https://picsum.photos/1280/800?${Date.now().toString().slice(0, 1)}`" alt="" />
                  </template>
                  <template #text>
                    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
                  </template>
                  <template #interactions>
                    <vs-button danger icon>
                      <i class="bx bx-heart"></i>
                    </vs-button>
                    <vs-button class="btn-chat" shadow primary>
                      <i class="bx bx-chat"></i>
                      <span class="span"> 54 </span>
                    </vs-button>
                  </template>
                </vs-card>
              </v-col>

              <v-col cols="6" align-self="stretch">
                <vs-card class="my-card">
                  <template #title>
                    <h3>Pot with a plant</h3>
                  </template>
                  <template #img>
                    <img :src="`https://picsum.photos/1280/800?${Date.now().toString().slice(0, 1)}`" alt="" />
                  </template>
                  <template #text>
                    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
                  </template>
                  <template #interactions>
                    <vs-button danger icon>
                      <i class="bx bx-heart"></i>
                    </vs-button>
                    <vs-button class="btn-chat" shadow primary>
                      <i class="bx bx-chat"></i>
                      <span class="span"> 54 </span>
                    </vs-button>
                  </template>
                </vs-card>
              </v-col>
              <v-col cols="3" align-self="stretch">
                <vs-card class="my-card">
                  <template #title>
                    <h3>Pot with a plant</h3>
                  </template>
                  <template #img>
                    <img :src="`https://picsum.photos/1280/800?${Date.now().toString().slice(0, 1)}`" alt="" />
                  </template>
                  <template #text>
                    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
                  </template>
                  <template #interactions>
                    <vs-button danger icon>
                      <i class="bx bx-heart"></i>
                    </vs-button>
                    <vs-button class="btn-chat" shadow primary>
                      <i class="bx bx-chat"></i>
                      <span class="span"> 54 </span>
                    </vs-button>
                  </template>
                </vs-card>
              </v-col>
              <v-col cols="3" align-self="stretch">
                <vs-card class="my-card">
                  <template #title>
                    <h3>Pot with a plant</h3>
                  </template>
                  <template #img>
                    <img :src="`https://picsum.photos/1280/800?${Date.now().toString().slice(0, 1)}`" alt="" />
                  </template>
                  <template #text>
                    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
                  </template>
                  <template #interactions>
                    <vs-button danger icon>
                      <i class="bx bx-heart"></i>
                    </vs-button>
                    <vs-button class="btn-chat" shadow primary>
                      <i class="bx bx-chat"></i>
                      <span class="span"> 54 </span>
                    </vs-button>
                  </template>
                </vs-card>
              </v-col>
            </v-row>
          </template>
        </base-no-split>
      </div>
    </v-fade-transition>
  </div>
</template>
<script>
  import { get } from 'vuex-pathify';

  export default {
    name: 'ProfileSlide',

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
      };
    },

    computed: {
      ...get('authentication', ['lastLogin', 'user']),
    },

    mounted() {
      this.getSrc();

      setTimeout(() => {
        this.$emit('remove-slide', 'loginSlide');
      }, 1000);
    },

    methods: {
      getSrc() {
        setTimeout(() => {
          this.src = `https://picsum.photos/1280/800?${Date.now().toString().slice(0, 1)}`;
        }, 300);
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
</style>
