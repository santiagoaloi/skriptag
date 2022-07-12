<template>
  <base-no-split>
    <template #left>
      <v-row class="px-5">
        <v-col
          v-for="(card, i) in allCardsFiltered"
          :key="i"
          cols="12"
          sm="6"
          md="4"
          :lg="card.responsiveSize"
          @click="!card.disabled && $router.push(`/profile/${card.route}`)"
        >
          <v-card
            :ripple="{ class: 'rounded-lg, ripple-opacity' }"
            color="#2d333b"
            height="100%"
            class="hoverCard rounded-lg cursor-pointer"
            dark
            :disabled="card.disabled"
          >
            <v-img
              :height="$vuetify.breakpoint.smAndDown ? 150 : 140"
              :transition="false"
              class="rounded-t-lg decreaseColor"
              :src="card.img"
              v-bind="imageOptions()"
            />
            <v-container>
              <div class="pa-3">
                <p style="font-size: 130%">{{ card.title }}</p>
                <div style="font-size: 14px" class="mt-n3">{{ card.text }}</div>
              </div>
            </v-container>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </base-no-split>
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
            route: 'profile-edit',
            responsiveSize: 3,
            disabled: false,
            visible: true,
          },

          {
            title: 'Account settings',
            text: 'Change your authentication settings',
            img: 'https://media.skriptag.com/img/a2.svg',
            route: 'account-edit',
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
            route: 'skriptag-edit',
            responsiveSize: 3,
            disabled: !this.profile.roles?.includes('root') || !this.verified,
            visible: this.profile.roles?.includes('root'),
          },
        ];
      },

      gradientOptions() {
        const direction = 'to bottom';
        const fromColor = 'rgba(56, 61, 87, .3) 40%';
        const toColor = ' rgba(56, 61, 87,.8) 160%';

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
    transform: translate(0, 5px) !important;
    -webkit-transform: translate(0, 5px) !important;
    -webkit-box-shadow: 0px 5px 20px 0px rgba(0, 0, 0, 0);
    box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0);
  }

  .hoverCard {
    -webkit-box-shadow: 0px 5px 20px 0px rgba(0, 0, 0, var(--vs-shadow-opacity)) !important;
    box-shadow: 0px 5px 20px 0px rgba(0, 0, 0, var(--vs-shadow-opacity)) !important;
    -webkit-transition: all 0.25s ease !important;
    transition: all 0.25s ease !important;
    transition-property: all !important;
    transition-duration: 0.25s !important;
    transition-timing-function: ease;
    transition-delay: 0s;
  }

  .ripple-opacity {
    opacity: 0.1;
  }

  .decreaseColor {
    filter: grayscale(0.1) hue-rotate(340deg);
  }
</style>
