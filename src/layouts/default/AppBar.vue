<template>
  <div>
    <vs-navbar style="position: relative" fixed shadow square>
      <template #left>
        <div class="ml-9 mr-3">
          <v-container>
            <skriptag-title small @click="$router.push('/')" />
          </v-container>
        </div>
      </template>

      <template v-if="!$vuetify.breakpoint.xs">
        <vs-navbar-group>
          Why you
          <template #items>
            <vs-navbar-item id="guide"> Guide </vs-navbar-item>
            <vs-navbar-item id="docs"> Documents </vs-navbar-item>
            <vs-navbar-item id="components"> Components </vs-navbar-item>
          </template>
        </vs-navbar-group>

        <vs-navbar-group>
          Flush your stress
          <template #items>
            <vs-navbar-item id="Github"> Github </vs-navbar-item>
            <vs-navbar-item id="Discord"> Discord </vs-navbar-item>
            <vs-navbar-item id="Twitter"> Twitter </vs-navbar-item>
            <vs-navbar-item id="Medium"> Medium </vs-navbar-item>
          </template>
        </vs-navbar-group>

        <vs-navbar-item id="License"> Variety </vs-navbar-item>
      </template>

      <template #right>
        <!-- <vs-select v-model="dropdown" placeholder="Select" @click.stop>
            <vs-option label="Vuesax" value="1"> Vuesax </vs-option>
            <vs-option label="Vue" value="2"> Vue </vs-option>
            <vs-option label="Javascript" value="3"> Javascript </vs-option>
            <vs-option disabled label="Sass" value="4"> Sass </vs-option>
            <vs-option label="Typescript" value="5"> Typescript </vs-option>
            <vs-option label="Webpack" value="6"> Webpack </vs-option>
            <vs-option label="Nodejs" value="7"> Nodejs </vs-option>
          </vs-select> -->

        <v-scale-transition>
          <v-btn v-if="isLoggedIn" :ripple="false" color="teal white--text" small @click="logout">
            <v-icon small> mdi-account</v-icon>
            {{ `Logout ${user.email}` }}
          </v-btn>
        </v-scale-transition>
      </template>
    </vs-navbar>
  </div>
</template>

<script>
  // Utilities
  import { sync, get, call } from 'vuex-pathify';

  export default {
    name: 'DefaultAppBar',
    data() {
      return {
        dropdown: [],
      };
    },

    computed: {
      drawer: sync('app/drawer'),
      ...get('authentication', ['isLoggedIn', 'user']),
    },

    methods: {
      ...call('authentication/*'),
    },
  };
</script>
<style scoped>
  ::v-deep .vs-select__input:hover {
    box-shadow: unset;
    -webkit-transform: unset;
    transform: unset;
  }

  ::v-deep .vs-select.activeOptions .vs-select__input {
    -webkit-transform: unset;
    transform: unset;
  }
</style>
