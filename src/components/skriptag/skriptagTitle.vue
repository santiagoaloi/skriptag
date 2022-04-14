<template>
  <v-responsive style="color: #ccc" min-width="100" v-on="$listeners">
    <component
      :is="size"
      v-animation:shrink="{ link: link, longPress: true }"
      :class="{ large: large }"
      class="cursor-pointer"
      data-aos="fade"
      data-aos-delay="300"
      data-aos-once="true"
      >Skriptag
      <span
        data-aos="fade"
        data-aos-delay="600"
        data-aos-once="false"
        :class="small ? 'ml-n8' : large ? 'ml-n16' : 'ml-n11'"
        class="primary-font-color"
        data-aos-duration="600"
        >ˆ
      </span>
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
