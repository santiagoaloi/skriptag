<template>
  <v-row :class="rowClass" no-gutters>
    <v-col :order="colOrder()" :md="remainingCols" cols="12">
      <v-img
        :src="src ? require(`@/assets/static/${src}`) : null"
        :class="imageClass()"
        v-bind="imageOptions()"
        class="d-flex align-center justify-end flex-row"
        @load="imageLoaded = true"
      >
        <template v-if="!$vuetify.breakpoint.smAndDown">
          <div class="wrapper">
            <div class="terminal">
              <div class="terminal__header">
                <div class="terminal__header-buttons">
                  <div class="terminal__header-button terminal__header-button--close"></div>
                  <div class="terminal__header-button terminal__header-button--minimize"></div>
                  <div class="terminal__header-button terminal__header-button--maximize"></div>
                </div>
              </div>
              <div class="terminal__content">
                <div class="terminal__content-block">
                  <div class="terminal__content-shell mr-2">~ skriptag@my-shiny-MBP%</div>
                  <div class="terminal__content-command terminal__content-command--2">pwd</div>
                  <div class="terminal__content-print terminal__content--delay-2-anim">/home/web-projects</div>
                </div>

                <div class="terminal__content-block terminal__content--delay-2-anim">
                  <div class="terminal__content-shell mr-2">~ skriptag@my-shiny-MBP%</div>
                  <div class="terminal__content-command terminal__content--delay-5 terminal__content-command--4">ls</div>
                  <div class="terminal__content-print terminal__content--delay-8-anim">my-test-vue-app</div>
                </div>

                <div class="terminal__content-block terminal__content--delay-8-anim">
                  <div class="terminal__content-shell mr-2">~ skriptag@my-shiny-MBP%</div>
                  <div class="terminal__content-command terminal__content--delay-18 terminal__content-command--16">
                    cd my-test-vue-app
                  </div>
                  <!-- <div class="terminal__content-print terminal__content--delay-29-anim">my-test-vue-app</div> -->
                </div>

                <div class="terminal__content-block terminal__content--delay-33-anim">
                  <div class="terminal__content-shell mr-2">~ skriptag@my-shiny-MBP%</div>
                  <div class="terminal__content-command terminal__content--delay-30 terminal__content-command--18">
                    cat package.json
                  </div>
                  <div class="terminal__content-print terminal__content--delay-40-anim">
                    <pre>
{
  "name": "my-text-vue-app",
  "description": "Starting my fresh new Vue + Vuetify project,
  "author": "A very curious app developer!",
  "scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "deploy": "firebase deploy --only hosting",
    "deploy-functions": "firebase deploy --only functions"  
    },
  "devDependencies": {
    "firebase": "^9.8.2",
    "vue": "^2.6.11",
    "vuetify": "^2.6.6",
    },
  "dependencies": {
    "@vue/cli-plugin-babel": "^5.0.4",
    "@vue/cli-service": "^5.0.4",
    }
        </pre
                    >

                    <div class="terminal__content-shell mr-2 white--text">~ skriptag@my-shiny-MBP%</div>
                  </div>
                </div>
                <!-- <div class="terminal__content-block terminal__content--delay-29-anim">
                  <div class="terminal__content-shell">~ david$</div>
                  <div class="terminal__content-command terminal__content-command--16 terminal__content--delay-25">
                    cat package.json
                  </div>
                  <div class="terminal__content-print terminal__content--delay-34-anim">...</div>
                </div> -->
              </div>
            </div>
          </div>
        </template>

        <!-- <v-card class="white mx-auto" width="500" height="500"> </v-card> -->
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
      noDivider: {
        type: Boolean,
        default: false,
      },
      noAnimation: {
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
        const { mobile } = this.$vuetify.breakpoint;

        if (mobile || this.noDivider) {
          return;
        }

        if (right && !mobile) {
          return `diagonal-divider-right ${this.svgClass}`;
        }

        if (!right && !mobile) {
          return `diagonal-divider-left ${this.svgClass}`;
        }
      },

      colOrder() {
        const { right } = this;
        const { smAndDown } = this.$vuetify.breakpoint;
        return right && !smAndDown ? '12' : '-1';
      },

      // gradientOptions() {
      //   const { imageLoaded } = this;
      //   if (!imageLoaded) return;

      //   const direction = 'to bottom';
      //   const fromColor = 'rgba(0, 0, 0, .4) 40%';
      //   const toColor = ' rgba(56, 61, 87,.1) 160%';

      //   return `${direction}, ${fromColor}, ${toColor}`;
      // },
      imageOptions() {
        const { right } = this;
        const { mobile } = this.$vuetify.breakpoint;

        return {
          // gradient: gradientOptions(),
          width: '100%',
          style: { height: '100%' },
          transition: (() => {
            if (this.noAnimation) {
              return;
            }

            if (mobile) {
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

<style scoped lang="scss">
  .diagonal-divider-left {
    clip-path: polygon(0 0, 100% 0, 86% 100%, 0% 100%);
  }

  .diagonal-divider-right {
    clip-path: polygon(0 0, 100% 0, 100% 100%, 14% 100%);
  }

  /* .decreaseColor {
    filter: grayscale(0.1) hue-rotate(340deg);
  } */

  $terminal-content-background-color: rgba(30, 30, 30, 0.5);
  $terminal-header-background-color: #f6f6f6;
  $terminal-header-border-color: #b8b8b8;
  $terminal-header-button-close: #fc645f;
  $terminal-header-button-minimize: #fdbe41;
  $terminal-header-button-maximize: #35cc4b;
  $terminal-font-size: 0.7;
  $terminal-primary-font-color: #fff;
  $terminal-secondary-font-color: #bfbdbd;
  $max-number-of-typewriter-animation-words: 50;

  @mixin typewriter-animation($numeroPalabras) {
    /*  animation: typewriter calc(1s - 0.2s) steps(10) 1s 1 normal both,
             blinkTextCursor 500ms steps(44) infinite normal;*/
    $segs: ($numeroPalabras / 10) * 2;
    $steps: $numeroPalabras * 2;
    $widthEm: $numeroPalabras * 1.2;
    animation: typewriter#{$numeroPalabras} calc(#{$segs}* 0.4s - 0.2s) steps($steps) 1s 1 normal both;
    @keyframes typewriter#{$numeroPalabras} {
      0% {
        width: 0; //
      }
      99% {
        border-right-width: 0.4rem;
      }
      100% {
        width: calc(#{$widthEm}*#{$terminal-font-size}* 1em);
        border-right-width: 0px;
      }
    }
  }

  .wrapper {
    width: 70%;
    margin: 1rem auto;
    height: 80vh;
    float: right;
    margin-right: 30px;
  }

  .terminal {
    width: 100%;
    height: 100%;
    //  background-color: $terminal-content-background-color;
    border-radius: 0.5rem;
    position: relative;
    font-size: calc(#{$terminal-font-size}* 1rem);
    font-family: Consolas, monaco, monospace;
    box-shadow: 0 0.6rem 2rem rgba(#000, 0.6);

    &__header {
      width: calc(100% - 1px);
      height: 1.5rem;
      background-color: $terminal-header-background-color;
      border-top-left-radius: 0.3rem;
      border-top-right-radius: 0.3rem;
      border: 0.5px solid $terminal-header-border-color;
      border-bottom: 1px solid $terminal-header-border-color;
    }

    &__header-buttons {
      position: relative;
      height: 100%;
    }

    &__header-button {
      width: 1rem;
      height: 1rem;
      border-radius: 50%;
      display: inline-block;
      position: absolute;
      top: 50%;
      border: 0.1px solid $terminal-header-border-color;

      &--close {
        background-color: $terminal-header-button-close;
        transform: translate(1rem, -50%);
      }

      &--minimize {
        background-color: $terminal-header-button-minimize;
        transform: translate(2.5rem, -50%);
      }

      &--maximize {
        background-color: $terminal-header-button-maximize;
        transform: translate(4rem, -50%);
      }
    }

    &__content {
      background-color: $terminal-content-background-color;
      height: calc(100% - 1.5rem);
      border-bottom-left-radius: 0.3rem;
      border-bottom-right-radius: 0.3rem;
      overflow-y: scroll;
    }

    &__content-block {
      padding: 0.5rem;
      color: $terminal-primary-font-color;
    }

    &__content-shell {
      display: inline-block;
      font-weight: bolder;
    }

    &__content-command {
      width: 100%;
      display: inline-block;
      font-weight: lighter;
      border-right: 0.5rem solid $terminal-secondary-font-color;
      white-space: nowrap;
      overflow: hidden;
      vertical-align: bottom;

      @for $i from 2 through $max-number-of-typewriter-animation-words {
        &--#{$i} {
          @include typewriter-animation($i);
        }
      }
    }

    &__content-print {
      //
      color: $terminal-secondary-font-color;
    }

    @for $i from 2 through $max-number-of-typewriter-animation-words {
      &__content--delay-#{$i}-anim {
        animation: appear backwards;
        animation-delay: calc(((#{$i} / 10) * 2) * 1s + 1s);
      }

      &__content--delay-#{$i} {
        animation-delay: calc(((#{$i} / 10) * 2) * 1s + 1s);
      }
    }
  }

  @keyframes blinkTextCursor {
    from {
      border-right-color: 1rem solid rgba(255, 255, 255, 0.75);
    }
    to {
      border-right-color: transparent;
    }
  }

  @keyframes appear {
    0% {
      visibility: hidden;
    }
    100% {
      visibility: visible;
    }
  }
</style>
