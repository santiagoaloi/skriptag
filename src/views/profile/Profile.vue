<template>
  <div>
    <v-img
      :gradient="'to top , rgba(5,5,5,.9), rgba(0,0,0, .7)'"
      :src="src"
      flat
      height="300"
      class="d-flex align-center"
      :transition="false"
      style="color: #ccc"
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
