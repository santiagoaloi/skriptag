<template>
  <div>
    <swiper
      grab-cursor
      long-swipes
      :long-swipes-ms="4000"
      style="height:100vh"
      :direction="'vertical'"
      :slides-per-view="1"
      mousewheel
      :pagination="{
        clickable: true,

      }"
    >
      <swiper-slide
        v-for="n in 2"
        :key="n"
      >
        <v-img
          gradient="to bottom , rgba(20,20,20, .4) 40%,  rgba(0,0,0,.8) 160%"
          width="40vw"
          height="100vh"
          :src="`https://picsum.photos/1280/800?${Date.now().toString().slice(0, 1)}`"
        />

        <!-- :src="`https://picsum.photos/1280/800?${Date.now().toString().slice(0, 2)}`" -->

   
        <v-sheet
          class="pa-4"
          width="50vw"
          color="transparent"
          style="color:#ccc"
        >
          <div class="px-15 mx-5">
            <h1>Skriptag<span class="teal--text ml-1">> </span> is your mentor.</h1>
            <p>
              Collaborate, manage projects, and reach new productivity peaks. 
              From high rises to the home office, the way your team works is unique—accomplish 
              it all with Trello.
            </p>


            <div class="d-flex align-center justify-center">
              <v-text-field
                dark
                solo
                placeholder="Email"
                class="mr-9 ml-n1"
                hide-details
                dense
              />

              <v-btn
                height="35"
                color="teal accent-3"
                style="color:#123456"
              >
                SignUp
              </v-btn>
            </div>
          </div>
        </v-sheet>

          <!-- <v-img
          height="
          100%"
          gradient="to bottom , rgba(50,50,50, .9) 40%,  rgba(0,0,0,.8) 160%"

          :src="`https://picsum.photos/1280/800?${Date.now().toString().slice(0, 2)}`"
        /> -->
        </v-card>
      </swiper-slide>
    </swiper>
  </div>
</template>
<script>
  import { Mousewheel, Pagination } from "swiper";
  import { SwiperCore, Swiper, SwiperSlide } from 'swiper-vue2'

  // Import Swiper styles
  import 'swiper/swiper-bundle.css'

  SwiperCore.use([Mousewheel, Pagination])

  export default {
    components: {
      Swiper,
      SwiperSlide,
    },
    methods: {
      getImageUrl (imageId) {
        return `https://picsum.photos/600/400/?image=${imageId}`
      },
      onSwiper (swiper) {
        console.log(swiper)
      },
      onSlideChange () {
        console.log('slide change')
      },
    },
  }
</script>
<style >


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
     background-color: #2ae2c3 !important;
     font-size:20px
}

.swiper-pagination-bullet {
    width: 20px;
    height: 20px;

}

</style>