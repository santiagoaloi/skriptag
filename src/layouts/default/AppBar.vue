<template>
  <vs-navbar v-model="active" style="position: relative" fixed shadow square>
    <template #left>
      <div>
        <v-container>
          <skriptag-title :class="{ 'ml-12 ': !$vuetify.breakpoint.smAndDown }" link small @click="$router.push('/')" />
        </v-container>
      </div>
    </template>

    <template v-if="!$vuetify.breakpoint.smAndDown">
      <vs-navbar-group>
        Downloads
        <template #items>
          <vs-navbar-item id="guide"> Templates </vs-navbar-item>
          <vs-navbar-item id="docs"> Freebies </vs-navbar-item>
          <vs-navbar-item id="components"> Courses </vs-navbar-item>
        </template>
      </vs-navbar-group>

      <vs-navbar-group>
        Training
        <template #items>
          <vs-navbar-item id="Github"> Firebase </vs-navbar-item>
          <vs-navbar-item id="Discord"> VueJS </vs-navbar-item>
          <vs-navbar-item id="Twitter"> Vuetify </vs-navbar-item>
          <vs-navbar-item id="Medium"> Javascript </vs-navbar-item>
        </template>
      </vs-navbar-group>
      <vs-navbar-item id="blog" :active="active == 'blog'"> Blog </vs-navbar-item>
    </template>

    <template #right>
      <v-scale-transition hide-on-leave group>
        <template v-if="!isLoggedIn && !$vuetify.breakpoint.smAndDown">
          <BaseButton
            v-for="button in [
              { link: 'login', name: 'Login', icon: 'account-arrow-right' },
              { link: 'signup', name: 'Sign up', icon: 'account-plus' },
            ]"
            :key="button.name"
            dark
            color="grey darken-3"
            class="ml-3"
            @click="$router.push(`${button.link}`)"
          >
            <v-icon left> mdi-{{ button.icon }}</v-icon
            >{{ button.name }}
          </BaseButton>
        </template>
      </v-scale-transition>

      <v-scale-transition hide-on-leave>
        <BaseButton v-if="isLoggedIn && !$vuetify.breakpoint.smAndDown" @click="logout">
          {{ `Logout ${firstAndShortLast || ''}` }}
        </BaseButton>
      </v-scale-transition>
      <v-burger v-if="$vuetify.breakpoint.smAndDown" :active="mobileMenu" type="spring" @updated="mobileMenu = !mobileMenu" />
    </template>
  </vs-navbar>
</template>

<script>
  import { sync, get, call } from 'vuex-pathify';
  import baseButton from '@/components/base/baseButton.vue';
  // Utilities

  export default {
    name: 'DefaultAppBar',
    components: { baseButton },
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
<style>
  ::v-deep .vs-select__input:hover {
    box-shadow: unset;
    -webkit-transform: unset;
    transform: unset;
  }

  ::v-deep .vs-select.activeOptions .vs-select__input {
    -webkit-transform: unset;
    transform: unset;
  }

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
</style>
