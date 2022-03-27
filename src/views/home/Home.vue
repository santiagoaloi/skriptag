<template>
  <swiper
    ref="sw"
    grab-cursor
    style="height: 100vh"
    :direction="'vertical'"
    :slides-per-view="1"
    mousewheel
    :pagination="{
      clickable: true,
    }"
    :short-swipes="false"
    :speed="500"
  >
    <swiper-slide v-for="(slide, index) in viewSlides" :key="index" class="d-flex justify-start">
      <component :is="slide" :index="index" />
    </swiper-slide>
  </swiper>
</template>
<script>
  import { call, sync } from 'vuex-pathify';
  import { Mousewheel, Pagination, Controller } from 'swiper';
  import { SwiperCore, Swiper, SwiperSlide } from 'swiper-vue2';
  import 'swiper/swiper-bundle.css';

  // Using Swiper API v6
  // https://swiper6.vercel.app/swiper-api#methods-and-properties
  SwiperCore.use([Mousewheel, Pagination, Controller]);

  export default {
    name: 'Homepage',

    components: {
      Swiper,
      SwiperSlide,
      loginSlide: () => import(/* webpackChunkName: 'login-slide' */ './sliderViews/login'),
      registerSlide: () => import(/* webpackChunkName: 'register-slide' */ './sliderViews/register'),
    },

    data() {
      return {
        viewSlides: ['loginSlide', 'registerSlide'],
        test: '',
      };
    },

    computed: {
      ...sync('swipers', ['homeActiveSlide']),

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

    mounted() {
      // setTimeout(() => {
      //   this.increase();
      // }, 1200);
    },

    methods: {
      ...call('app/*'),

      increase() {
        this.swiper.slideTo(1, 300, false);
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
    background-color: rgb(var(--vs-primary)) !important;
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
