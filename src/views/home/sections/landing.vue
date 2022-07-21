<template>
  <base-split-2
    no-animation
    col="5"
    no-divider
    :src="$vuetify.breakpoint.smAndDown ? 'landing2-v.svg' : 'landing2-h.svg'"
    v-bind="$attrs"
  >
    <v-chip color="purple darken-4" dark small>V1.0 Beta-2</v-chip>
    <skriptag-title large class="mb-4" />
    <article>
      <h2 style="font-size: 70px">Make the best app you've ever made.</h2>
    </article>

    <h2 style="font-weight: 100" class="pt-5">
      Get consultancy , learn coding, download free and premium application templates, access JS/VueJS training material and
      participate in blogs.
    </h2>

    <template #image-content>
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
                <div class="terminal__content-command terminal__content--delay-5 terminal__content-command--2">ls</div>
                <div class="terminal__content-print terminal__content--delay-10-anim">
                  my-test-vue-app my-test-react-app my-test-nodejs-app
                </div>
              </div>

              <div class="terminal__content-block terminal__content--delay-10-anim">
                <div class="terminal__content-shell mr-2">~ skriptag@my-shiny-MBP%</div>
                <div class="terminal__content-command terminal__content--delay-20 terminal__content-command--13">
                  cd my-test-vue-app
                </div>
                <!-- <div class="terminal__content-print terminal__content--delay-29-anim">my-test-vue-app</div> -->
              </div>

              <div class="terminal__content-block terminal__content--delay-35-anim">
                <div class="terminal__content-shell mr-2">~ skriptag@my-shiny-MBP%</div>
                <div class="terminal__content-command terminal__content--delay-40 terminal__content-command--12">
                  cat package.json
                </div>
                <div class="terminal__content-print terminal__content--delay-48-anim">
                  <pre>
{
  "name": "my-next--cool-vue-app",
  "description": "Starting my fresh new Vue + Vuetify project",
  "author": "A very curious software developer using a shiny laptop",
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
  }
        </pre
                  >

                  <div class="terminal__content-shell mr-2 white--text">~ skriptag@my-shiny-MBP%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </template>
  </base-split-2>
</template>
<script>
  export default {
    name: 'LandingPage',
  };
</script>
<style scoped lang="scss">
  /* Gradient color font styling  */
  article {
    background: linear-gradient(to right, rgb(203, 211, 219), rgb(196, 174, 227));
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 600;
    line-height: 1.1;
  }

  $terminal-content-background-color: rgba(30, 30, 30, 0.5);
  $terminal-header-background-color: #f6f6f6;
  $terminal-header-border-color: #b8b8b8;
  $terminal-header-button-close: #fc645f;
  $terminal-header-button-minimize: #fdbe41;
  $terminal-header-button-maximize: #35cc4b;
  $terminal-font-size: 0.7;
  $terminal-primary-font-color: rgb(230, 240, 223);
  $terminal-secondary-font-color: #b8ebd1;
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

    -webkit-box-shadow: 6px -2px 44px 0px #422b4b;
    box-shadow: 6px -2px 44px 0px #422b4b;
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
