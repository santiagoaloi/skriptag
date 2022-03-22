<template>
  <div>
    <swiper
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
      <swiper-slide v-for="n in 2" :key="n">
        <v-img
          gradient="to bottom , rgba(20,20,20, .4) 40%,  rgba(0,0,0,.8) 160%"
          width="40vw"
          height="100vh"
          :src="`https://picsum.photos/1280/800?${Date.now().toString().slice(0, 1) + n}`"
        >
          <template #placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
            </v-row>
          </template>
        </v-img>

        <v-sheet class="pa-4 swiper-no-swiping no-select no-drag" width="50vw" color="transparent" style="color: #ccc">
          <div class="px-15 mx-5">
            <h1>Skriptag<span class="ml-1 primary-font-color">> </span></h1>
            <p>
              Collaborate, manage projects, and reach new productivity peaks. From high rises to the home office, the way your
              team works is unique—accomplish it all with Trello.
            </p>
            <v-btn :ripple="false" x-small color="white" class="ml-n2 mb-n2" plain>Recover my password</v-btn>

            <div class="d-flex flex-wrap">
              <div class="py-2 pr-2">
                <vs-input block placeholder="Username">
                  <template #icon>
                    <v-icon dark>mdi-account</v-icon>
                  </template>
                </vs-input>
              </div>
              <div class="py-2 pr-2">
                <vs-input block type="password" placeholder="Username">
                  <template #icon>
                    <v-icon dark>mdi-lock</v-icon>
                  </template>
                </vs-input>
              </div>
            </div>
            <div class="d-flex flex-column flex-wrap justify-start">
              <v-btn width="100" class="mt-2 ml-1" small> Login</v-btn>
            </div>
          </div>
        </v-sheet>
      </swiper-slide>
    </swiper>
  </div>
</template>
<script>
  import { Mousewheel, Pagination } from 'swiper';
  import { SwiperCore, Swiper, SwiperSlide } from 'swiper-vue2';

  // Import Swiper styles
  import 'swiper/swiper-bundle.css';

  SwiperCore.use([Mousewheel, Pagination]);

  export default {
    components: {
      Swiper,
      SwiperSlide,
    },

    methods: {
      getImageUrl(imageId) {
        return `https://picsum.photos/600/400/?image=${imageId}`;
      },
      onSwiper(swiper) {
        console.log(swiper);
      },
      onSlideChange() {
        console.log('slide change');
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
