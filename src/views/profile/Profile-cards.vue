<template>
  <div>
    <base-no-split v-if="!switchToCardSettings">
      <template #left>
        <v-row>
          <v-col cols="3">
            <vs-card class="my-card" @click="switchCard('ProfileEdit')">
              <template #title>
                <h3>Profile Details</h3>
              </template>
              <template #img>
                <img :src="`https://picsum.photos/1280/800?${Date.now().toString().slice(0, 1)}`" alt="" />
              </template>
              <template #text>
                <p>Edit your profile information such as your names, tags and more...</p>
              </template>
            </vs-card>
          </v-col>
          <v-col cols="3">
            <vs-card class="my-card" @click="switchCard('AccountEdit')">
              <template #title>
                <h3>Account settings</h3>
              </template>
              <template #img>
                <img :src="`https://picsum.photos/1280/800?${Date.now().toString().slice(0, 1)}`" alt="" />
              </template>
              <template #text>
                <p>Change your authentication settings,account email, 2FA, remove or disable your account.</p>
              </template>
            </vs-card>
          </v-col>
        </v-row>
      </template>
    </base-no-split>
    <v-fade-transition hide-on-leave>
      <v-card-text v-if="switchToCardSettings" class="px-8">
        <component :is="activeCard" @close="close()" />
      </v-card-text>
    </v-fade-transition>
  </div>
</template>

<script>
  import ProfileEdit from './Profile-edit';
  import AccountEdit from './Account-edit';

  export default {
    name: 'ProfileItems',
    components: {
      ProfileEdit,
      AccountEdit,
    },
    data() {
      return {
        switchToCardSettings: false,
        activeCard: null,
      };
    },

    methods: {
      switchCard(card) {
        this.switchToCardSettings = true;
        this.activeCard = card;
      },

      close() {
        this.switchToCardSettings = false;
        this.activeCard = null;
      },
    },
  };
</script>
<style>
  .my-card .vs-card {
    width: auto !important;
    height: 100% !important;

    max-width: unset !important;
    max-height: unset !important;
  }

  .vs-card-content {
    height: 100% !important;
  }
</style>
