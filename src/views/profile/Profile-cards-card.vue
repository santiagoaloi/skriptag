<template>
  <v-card color="#2d333b" height="100%" class="hoverCard rounded-lg cursor-pointer" dark :disabled="card.disabled" flat>
    <v-img
      :height="$vuetify.breakpoint.smAndDown ? 150 : 140"
      :transition="false"
      class="rounded-t-lg rounded-b-lg"
      :src="card.img"
      v-bind="imageOptions()"
    />
    <v-container>
      <div class="pa-3">
        <p style="font-size: 110%">{{ card.title }}</p>
        <div style="font-size: 14px" class="mt-n3">{{ card.text }}</div>
      </div>
    </v-container>
  </v-card>
</template>

<script>
  import { get } from 'vuex-pathify';

  export default {
    name: 'SettingsCard',
    props: {
      card: {
        type: Object,
        default: () => {},
      },
    },

    computed: {
      ...get('authentication', ['verified', 'profile']),
    },
    methods: {
      gradientOptions() {
        const direction = 'to top right';
        const fromColor = 'rgba(10,10,10,.1)';
        const toColor = 'rgba(10,10,10,.35)';

        return `${direction}, ${fromColor}, ${toColor}`;
      },

      imageOptions() {
        const { gradientOptions } = this;

        return {
          gradient: gradientOptions(),
          height: this.$vuetify.breakpoint.smAndDown ? '265' : '140',
        };
      },
    },
  };
</script>
<style>
  .hoverCard:hover {
    transform: translateY(2px);
    box-shadow: 0 2px 5px rgb(0 0 0 / 10%), 0 1px 2px rgb(0 0 0 / 5%) !important;
  }

  .hoverCard {
    box-shadow: 0 2px 43px -4px rgb(0 0 0 / 19%) !important;
    -webkit-transition: all 0.25s ease !important;
    transition: all 0.25s ease !important;
    transition-property: all !important;
    transition-duration: 0.25s !important;
    transition-timing-function: ease;
    transition-delay: 0s;
  }
</style>
