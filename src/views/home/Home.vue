<template>
  <div>
    <intro-slide />
  </div>
</template>
<script>
  import { call, get } from 'vuex-pathify';

  export default {
    name: 'Homepage',

    components: {
      introSlide: () => import(/* webpackChunkName: 'register-slide' */ './sliderViews/Intro'),
    },

    computed: {
      ...get('authentication', ['isLoggedIn']),
    },

    methods: {
      ...call('app/*'),
    },
  };
</script>
<style>
  .swiper-slide {
    /* text-align: center; */
    font-size: 18px;
    background: #23272d;

    /* Center slide text vertically */
    display: -webkit-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;
  }

  .swiper-pagination-bullet-active {
    /* background-color: rgb(var(--vs-primary)) !important; */
    background-color: #61d4bc !important;

    font-size: 20px;
  }

  .swiper-pagination-bullet {
    width: 20px;
    height: 20px;
  }

  .swiper-container {
    background: #24272c;
  }
</style>
