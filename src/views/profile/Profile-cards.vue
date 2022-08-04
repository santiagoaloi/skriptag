<template>
  <v-row>
    <v-col
      v-for="(card, i) in allCardsFiltered"
      :key="i"
      cols="12"
      sm="6"
      md="4"
      :lg="card.responsiveSize"
      @click="!card.disabled && $router.push({ name: card.route })"
    >
      <v-card
        v-once
        color="#2d333b"
        height="100%"
        class="hoverCard rounded-lg cursor-pointer"
        dark
        :disabled="card.disabled"
        flat
      >
        <v-img
          v-once
          :height="$vuetify.breakpoint.smAndDown ? 150 : 140"
          :transition="false"
          class="rounded-t-lg rounded-b-lg"
          :src="card.img"
          v-bind="imageOptions()"
          style="filter: grayscale(0.4)"
        />
        <v-container>
          <div class="pa-3">
            <p style="font-size: 110%">{{ card.title }}</p>
            <div style="font-size: 14px" class="mt-n3">{{ card.text }}</div>
          </div>
        </v-container>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
  import { get } from 'vuex-pathify';

  export default {
    name: 'ProfileItems',

    computed: {
      ...get('authentication', ['verified', 'profile']),

      allCardsFiltered() {
        // Show only the visible cards based on permissions.
        return this.allCards().filter((card) => card.visible);
      },
    },
    methods: {
      allCards() {
        return [
          {
            title: 'Profile Details',
            text: 'Edit your profile personal information',
            img: 'https://media.skriptag.com/img/a1.svg',
            route: 'skriptag-public',
            responsiveSize: 3,
            disabled: false,
            visible: true,
          },

          {
            title: 'Account settings',
            text: 'Change your authentication settings',
            img: 'https://media.skriptag.com/img/a2.svg',
            route: 'skriptag-account',
            responsiveSize: 3,
            disabled: false,
            visible: true,
          },

          {
            title: 'Billing information',
            text: 'Add or change your payment methods',
            img: 'https://media.skriptag.com/img/a4.svg',
            route: '',
            responsiveSize: 3,
            disabled: true,
            visible: true,
          },

          {
            title: 'Manage Skriptag',
            text: 'Manage users, roles, and project settings',
            img: 'https://media.skriptag.com/img/a5.svg',
            route: 'skriptag-admin',
            responsiveSize: 3,
            disabled: !this.profile.roles?.includes('root') || !this.verified,
            visible: this.profile.roles?.includes('root'),
          },
        ];
      },

      gradientOptions() {
        const direction = 'to top right';
        const fromColor = 'rgba(10,10,10,.7)';
        const toColor = 'rgba(10,10,10,.65)';

        return `${direction}, ${fromColor}, ${toColor}`;
      },

      imageOptions() {
        const { gradientOptions } = this;

        return {
          gradient: gradientOptions(),
          height: this.$vuetify.breakpoint.smAndDown ? '265' : '140',
        };
      },

      close() {
        this.switchToCardSettings = false;
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
