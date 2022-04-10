<template>
  <v-responsive v-animation:shrink="{ longPress: true }" style="color: #ccc" width="130">
    <component :is="size" class="cursor-pointer" data-aos="zoom-in" data-aos-delay="300" data-aos-once="true" v-on="$listeners"
      >Skriptag
      <span
        data-aos="fade"
        data-aos-delay="600"
        data-aos-once="false"
        :class="small ? 'ml-n8' : 'ml-n11'"
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
    },

    computed: {
      size() {
        return this.small ? 'h2' : 'h1';
      },
    },
  };
</script>
