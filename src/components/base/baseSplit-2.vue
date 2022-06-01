<template>
  <v-row style="color: #ccc" :class="rowClass()" no-gutters>
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
          <v-responsive class="mx-auto" :width="$vuetify.breakpoint.smAndDown ? '100%' : '80%'">
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

      src: {
        type: [String],
        default: '',
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
        return 'fill-height pattern-bg';
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
        const fromColor = 'rgba(56, 61, 87, .3) 40%';
        const toColor = ' rgba(56, 61, 87,.8) 160%';

        return `${direction}, ${fromColor}, ${toColor}`;
      },
      imageOptions() {
        const { right, gradientOptions } = this;
        const { xs } = this.$vuetify.breakpoint;

        return {
          gradient: gradientOptions(),
          width: '100%',
          style: { height: '100%' },
          src: this.src || `https://picsum.photos/1280/800?${Date.now().toString().slice(0, 1)}`,
          transition: (() => {
            if (xs) {
              return 'fade-transition';
            }
            if (right) {
              return 'slide-x-reverse-transition';
            }
            if (!right) {
              return 'slide-x-transition';
            }
          })(),
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
