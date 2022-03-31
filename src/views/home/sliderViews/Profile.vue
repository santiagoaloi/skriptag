<template>
  <!-- <v-img
    :gradient="src ? 'to top , rgba(5,5,5,.9), rgba(0,0,0, .7)' : ''"
    :src="src"
    flat
    width="100vw"
    height="40vh"
    class="d-flex align-center"
    :transition="false"
    style="color: #ccc"
  >
    <div class="ml-13 d-flex align-center">
      <v-avatar max-height="13vw" max-width="13vw" min-height="13vw" min-width="13vw">
        <v-img
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
        <h4>Profile</h4>
        <h1 style="font-size: 350%">Santiago Aloi</h1>
        <h6 class="mt-n2">{{ lastLogin }}</h6>
      </div>
    </div>
  </v-img> -->

  <template>
    <div class="center examplex">
      <vs-navbar target-scroll="#padding-scroll-content" padding-scroll center-collapsed>
        <vs-navbar-item id="guide" :active="active == 'guide'"> Guide </vs-navbar-item>
        <vs-navbar-item id="docs" :active="active == 'docs'"> Documents </vs-navbar-item>
        <vs-navbar-item id="components" :active="active == 'components'"> Components </vs-navbar-item>
        <vs-navbar-item id="license" :active="active == 'license'"> license </vs-navbar-item>
        <template #right>
          <vs-button flat>Login</vs-button>
          <vs-button>Get Started</vs-button>
        </template>
      </vs-navbar>
      <div id="padding-scroll-content" class="square">
        <div class="child">child 1</div>
        <div class="child">child 2</div>
        <div class="child">child 3</div>
      </div>
    </div>
  </template>
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
      };
    },

    computed: {
      ...get('authentication', ['lastLogin']),
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
