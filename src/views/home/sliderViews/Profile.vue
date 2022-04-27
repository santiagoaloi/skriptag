<template>
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
