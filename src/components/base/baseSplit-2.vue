<template>
  <v-row style="color: #ccc" class="pattern-bg" :class="rowClass()" no-gutters>
    <v-col :order="colOrder()" :sm="remainingCols" cols="12">
      <v-img :class="imageClass()" v-bind="imageOptions()" @load="imageLoaded = true">
        <template #placeholder>
          <v-row class="fill-height ma-0" align="center" justify="center">
            <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
          </v-row>
        </template>
      </v-img>
    </v-col>
    <v-col :sm="col" cols="12">
      <v-container class="fill-height">
        <v-container>
          <v-responsive class="mx-auto" :width="$vuetify.smAndDOwn ? '100%' : '80%'">
            <slot></slot>
          </v-responsive>
        </v-container>
      </v-container>
    </v-col>
  </v-row>
</template>

<script>
  export default {
    name: 'BaseSplit2',
    props: {
      right: {
        type: Boolean,
        default: false,
      },
      col: {
        type: [Number, String],
        default: 5,
      },
    },

    data() {
      return {
        imageLoaded: false,
      };
    },

    computed: {
      remainingCols() {
        return 12 - this.col;
      },
    },
    methods: {
      imageClass() {
        const { right } = this;
        const { xs } = this.$vuetify.breakpoint;

        if (xs) {
          return;
        }

        if (right && !xs) {
          return 'diagonal-divider-right';
        }

        if (!right && !xs) {
          return 'diagonal-divider-left';
        }
      },

      rowClass() {
        const { smAndDown } = this.$vuetify.breakpoint;
        if (!smAndDown) {
          return 'fill-height';
        }
      },

      colOrder() {
        const { right } = this;
        const { xs } = this.$vuetify.breakpoint;
        return right && !xs ? '12' : '-1';
      },

      gradientOptions() {
        const { imageLoaded } = this;
        if (!imageLoaded) return;

        const direction = 'to bottom';
        const fromColor = 'rgba(20,20,20, .4) 40%';
        const toColor = ' rgba(0,0,0,.8) 160%';

        return `${direction}, ${fromColor}, ${toColor}`;
      },
      imageOptions() {
        const { right, gradientOptions } = this;
        const { xs } = this.$vuetify.breakpoint;

        return {
          gradient: gradientOptions(),
          width: '100%',
          style: { height: xs ? '90%' : '100%' },
          src: `https://picsum.photos/1280/800?${Date.now().toString().slice(0, 1)}`,
          transition: `${right ? 'slide-x-reverse-transition' : 'slide-x-transition'}`,
        };
      },
    },
  };
</script>

<style scoped>
  .diagonal-divider-left {
    clip-path: polygon(0 0, 100% 0, 86% 100%, 0% 100%);
  }

  .diagonal-divider-right {
    clip-path: polygon(0 0, 100% 0, 100% 100%, 14% 100%);
  }
</style>
