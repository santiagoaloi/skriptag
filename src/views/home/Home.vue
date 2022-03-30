<template>
  <div>
    <intro-slide />
    <template v-if="!isLoggedIn">
      <login-slide id="login" />
      <signup-slide id="register" />
    </template>
  </div>
</template>
<script>
  import { call, get } from 'vuex-pathify';

  export default {
    name: 'Homepage',

    components: {
      introSlide: () => import(/* webpackChunkName: 'register-slide' */ './sliderViews/Intro'),
      loginSlide: () => import(/* webpackChunkName: 'login-slide' */ './sliderViews/Login'),
      signupSlide: () => import(/* webpackChunkName: 'register-slide' */ './sliderViews/Signup'),
      // profileSlide: () => import(/* webpackChunkName: 'register-slide' */ './sliderViews/Profile'),
    },

    data() {
      return {
        swiperOptions: {
          cssMode: false,
          direction: 'vertical',
          mousewheel: {
            thresholdTime: 40,
            thresholdDelta: 40,
            forceToAxis: true,
          },
          pagination: {
            clickable: true,
          },
        },
      };
    },

    computed: {
      ...get('authentication', ['isLoggedIn']),

      swiper() {
        if (!this.$refs.sw.swiperRef) return;
        return this.$refs.sw.swiperRef;
      },

      activeSlide: {
        // getter
        get() {
          return this.swiper.activeIndex;
        },
        // setter
        set() {
          this.test = this.swiper.activeIndex;
        },
      },
    },

    methods: {
      ...call('app/*'),

      removeSlide(slide) {
        this.swiper.removeSlide([0, 1, 2]);
      },

      loadProfileSlide() {
        // Adds the user profile component slide to the array.
        this.viewSlides.push('profileSlide');

        // Waits a bit for the media to load.
        setTimeout(() => {
          this.swiper.update();
          this.swiper.slideTo(3, 350, false);
        }, 500);
      },
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
