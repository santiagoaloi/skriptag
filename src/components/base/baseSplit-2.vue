<template>
  <v-row :class="rowClass" no-gutters>
    <v-col :order="colOrder()" :md="remainingCols" cols="12">
      <v-img
        :src="src ? require(`@/assets/static/${src}`) : null"
        class="decreaseColor"
        :class="imageClass()"
        v-bind="imageOptions()"
        @load="imageLoaded = true"
      >
      </v-img>
    </v-col>
    <v-col :md="col" cols="12">
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

      svgClass: {
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
      rowClass() {
        return ['fill-height'];
      },

      remainingCols() {
        return 12 - this.col;
      },
    },
    methods: {
      imageClass() {
        const { right } = this;
        const { smAndDown } = this.$vuetify.breakpoint;

        if (smAndDown) {
          return;
        }

        if (right && !smAndDown) {
          return `diagonal-divider-right ${this.svgClass}`;
        }

        if (!right && !smAndDown) {
          return `diagonal-divider-left ${this.svgClass}`;
        }
      },

      colOrder() {
        const { right } = this;
        const { smAndDown } = this.$vuetify.breakpoint;
        return right && !smAndDown ? '12' : '-1';
      },

      gradientOptions() {
        const { imageLoaded } = this;
        if (!imageLoaded) return;

        const direction = 'to bottom';
        const fromColor = 'rgba(0, 0, 0, .4) 40%';
        const toColor = ' rgba(56, 61, 87,.1) 160%';

        return `${direction}, ${fromColor}, ${toColor}`;
      },
      imageOptions() {
        const { right, gradientOptions } = this;
        const { smAndDown } = this.$vuetify.breakpoint;

        return {
          // gradient: gradientOptions(),
          width: '100%',
          style: { height: '100%' },
          transition: (() => {
            if (smAndDown) {
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

  .reveal {
    filter: opacity(1);
    transition-duration: 0.4s;
  }

  .hide {
    filter: opacity(0);
  }
  /* .decreaseColor {
    filter: grayscale(0.1) hue-rotate(340deg);
  } */
</style>
