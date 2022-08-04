<template>
  <v-app-bar class="border - bottom" height="50" color="#2d333b" absolute flat dark app>
    <skriptag-title
      class="overflow-visible cursor-pointer ml-1"
      link
      small
      @click.native="$router.push({ name: 'skriptag-homepage' })"
    />

    <v-spacer></v-spacer>

    <div v-for="item in menuItems" :key="item.name" class="pr-8">
      <BaseMenuLink :link="item" />
    </div>

    <template v-if="!isLoggedIn && !$vuetify.breakpoint.smAndDown">
      <BaseButton
        v-for="button in [
          { link: 'skriptag-login', name: 'Login', icon: '$mdiAccountArrowRight' },
          { link: 'skriptag-signup', name: 'Sign up', icon: '$mdiAccountPlus' },
        ]"
        :key="button.link"
        dark
        class="ml-3"
        :class="{ 'pointer-events-none': $route.name === button.link }"
        @click="!$router.push({ name: button.link })"
      >
        <v-icon left> {{ button.icon }}</v-icon
        >{{ button.name }}
      </BaseButton>
    </template>

    <template v-if="isLoggedIn && !$vuetify.breakpoint.smAndDown">
      <BaseButton @click="logout">
        <v-icon left class="mr-2" small>$mdiLogoutVariant</v-icon>{{ `Logout ${firstAndShortLast || ''}` }}
      </BaseButton>
      <BaseButton class="ml-3" @click="$router.push({ name: 'skriptag-profile' })">
        <v-icon left class="mr-2" small>$mdiConsole</v-icon> Console
      </BaseButton>
    </template>

    <v-burger v-if="$vuetify.breakpoint.smAndDown" :active="mobileMenu" type="spring" @updated="mobileMenu = !mobileMenu" />
  </v-app-bar>
</template>

<script>
  import { sync, get, call } from 'vuex-pathify';

  export default {
    name: 'DefaultAppBar',

    data() {
      return {
        dropdown: [],
        active: '',
        menuItems: [
          { name: 'Consulting', to: 'https://calendly.com/santiagoaloi/20min', disabled: false, external: true },
          { name: 'Templates', to: '', disabled: true, external: false },
          { name: 'Blog', to: '', disabled: true, external: false },
        ],
      };
    },

    computed: {
      drawer: sync('app/drawer'),
      ...get('authentication', ['isLoggedIn', 'profile', 'firstAndShortLast']),
      ...sync('app', ['mobileMenu']),
    },

    methods: {
      ...call('authentication', ['logout']),
    },
  };
</script>
<style scoped>
  .hamburger-inner,
  .hamburger-inner::before,
  .hamburger-inner::after {
    background-color: white;
  }

  .hamburger.is-active .hamburger-inner,
  .hamburger.is-active .hamburger-inner::before,
  .hamburger.is-active .hamburger-inner::after {
    background-color: white;
  }

  .border-bottom {
    border-bottom: solid 1px #444c56 !important;
  }
</style>
