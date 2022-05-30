<template>
  <v-responsive style="color: #ccc" min-width="200" v-on="$listeners">
    <!-- <component
      :is="size"
      v-animation:shrink="{ link: link, longPress: true }"
      data-aos="fade"
      data-aos-delay="300"
      data-aos-once="true"
      >Skriptag
      <span
        data-aos="fade"
        data-aos-delay="600"
        data-aos-once="true"
        :class="small ? 'ml-n10' : large ? 'ml-n16' : 'ml-n10'"
        class="primary-font-color"
        data-aos-duration="800"
        >ˆ
      </span>
    </component> -->

    <component :is="size" v-animation:shrink="{ link: link, longPress: true }"
      >Skriptag
      <span :class="small ? 'ml-n10' : large ? 'ml-n16' : 'ml-n10'" class="primary-font-color">ˆ </span>
    </component>
  </v-responsive>
</template>

<script>
  // Utilities

  export default {
    name: 'SkriptagTitle',
    props: {
      small: {
        type: Boolean,
        default: false,
      },
      large: {
        type: Boolean,
        default: false,
      },
      link: {
        type: Boolean,
        default: false,
      },
    },

    computed: {
      size() {
        return this.small ? 'h2' : 'h1';
      },
    },
  };
</script>

<style scoped>
  .large {
    font-size: 300% !important;
  }
</style>
