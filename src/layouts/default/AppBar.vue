<template>
  <v-app-bar class="border-bottom" absolute height="50" flat color="transparent" dark app>
    <skriptag-title
      class="overflow-visible cursor-pointer"
      :class="{ 'ml-2 ': !$vuetify.breakpoint.smAndDown }"
      link
      small
      @click.native="$router.push('/')"
    />

    <v-spacer></v-spacer>

    <template v-if="!isLoggedIn && !$vuetify.breakpoint.smAndDown">
      <BaseButton
        v-for="button in [
          { link: 'login', name: 'Login', icon: '$mdiAccountArrowRight' },
          { link: 'signup', name: 'Sign up', icon: '$mdiAccountPlus' },
        ]"
        v-show="$route.name !== button.link"
        :key="button.name"
        dark
        class="ml-3"
        @click="!$router.push(`${button.link}`)"
      >
        <v-icon left> {{ button.icon }}</v-icon
        >{{ button.name }}
      </BaseButton>
    </template>

    <template v-if="profile">
      <BaseButton v-if="!$vuetify.breakpoint.smAndDown" key="btn1" @click="logout">
        {{ `Logout ${firstAndShortLast || ''}` }}
      </BaseButton>
      <BaseButton
        v-if="!$vuetify.breakpoint.smAndDown && $route.name !== 'profile'"
        key="btn2"
        class="ml-3"
        @click="$router.push('/profile')"
      >
        Console
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
