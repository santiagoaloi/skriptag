<template>
  <base-no-split>
    <template #left>
      <!-- <v-row>
        <v-col v-for="(card, i) in allCardsFiltered" :key="i" cols="12" sm="6" :md="card.responsiveSize">
          <vs-card
            :class="{ 'disabled-card': card.disabled }"
            :disabled="card.disabled"
            class="my-card"
            @click="$router.push(`/profile/${card.route}`)"
          >
            <template #title>
              <h3>{{ card.title }}</h3>
            </template>
            <template #img>
              <v-img v-ripple :src="card.img" v-bind="imageOptions()" />
            </template>
            <template #text>
              <p>{{ card.text }}</p>
            </template>
          </vs-card>
        </v-col>
      </v-row> -->
      <v-row>
        <v-col
          v-for="(card, i) in allCardsFiltered"
          :key="i"
          cols="12"
          sm="6"
          :md="card.responsiveSize"
          @click="$router.push(`/profile/${card.route}`)"
        >
          <v-card
            :ripple="{ class: 'rounded-lg, ripple-opacity' }"
            height="100%"
            class="transparent hoverCard rounded-lg cursor-pointer"
            dark
            :disabled="card.disabled"
          >
            <v-img class="rounded-t-lg" :src="card.img" v-bind="imageOptions()"> </v-img>
            <v-container>
              <div class="pa-3" style="color: #ccc">
                <h4>{{ card.title }}</h4>
                <h5>{{ card.text }}</h5>
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
            text: 'Edit your profile information such as your names, tags,and more...',
            img: 'https://media.skriptag.com/img/a1.svg',
            route: 'profile-edit',
            responsiveSize: 3,
            disabled: false,
            visible: true,
          },

          {
            title: 'Account settings',
            text: 'Change your authentication settings,account email, 2FA, remove or disable your account.',
            img: 'https://media.skriptag.com/img/a2.svg',
            route: 'account-edit',
            responsiveSize: 3,
            disabled: false,
            visible: true,
          },

          {
            title: 'Billing information',
            text: '  add or change your payment methods, download your invoices, check your purchase history.',
            img: 'https://media.skriptag.com/img/a4.svg',
            route: '',
            responsiveSize: 3,
            disabled: true,
            visible: true,
          },

          {
            title: 'Manage Skriptag',
            text: 'Manage users, roles, and project settings.',
            img: 'https://media.skriptag.com/img/a5.svg',
            route: 'skriptag-edit',
            responsiveSize: 3,
            disabled: !this.profile.roles?.includes('root'),
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
          height: this.$vuetify.breakpoint.smAndDown ? '300' : '140',
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
    -webkit-transform: translate(0, 5px);
    transform: translate(0, 5px);
    transition: all 0.25s ease;
    transition-property: all;
    transition-duration: 0.25s;
    transition-timing-function: ease;
    transition-delay: 0s;
    -webkit-box-shadow: 0px 5px 20px 0px rgba(0, 0, 0, 0) !important;
    box-shadow: 0px 5px 20px 0px rgba(0, 0, 0, 0) !important;
  }

  .hoverCard {
    -webkit-box-shadow: 0px 5px 20px 0px rgba(0, 0, 0, var(--vs-shadow-opacity)) !important;
    box-shadow: 0px 5px 20px 0px rgba(0, 0, 0, var(--vs-shadow-opacity)) !important;
    -webkit-transition: all 0.25s ease;
    transition: all 0.25s ease;
    transition-property: all;
    transition-duration: 0.25s;
    transition-timing-function: ease;
    transition-delay: 0s;
  }

  .ripple-opacity {
    opacity: 0.1;
  }

  box-shadow .disabled-card {
    pointer-events: none;
  }
  .my-card .vs-card {
    width: auto !important;
    height: 100% !important;

    max-width: unset !important;
    max-height: unset !important;
  }

  .my-card .vs-card:hover {
    opacity: 1w;
  }

  .vs-card-content {
    height: 100% !important;
  }
</style>
