<template>
  <div>
    <base-no-split v-if="!switchToCardSettings">
      <template #left>
        <v-row>
          <v-col cols="4">
            <vs-card class="my-card" @click="switchCard('ProfileEdit')">
              <template #title>
                <h3>Profile Details</h3>
              </template>
              <template #img>
                <img :src="`https://picsum.photos/1280/800?${Date.now().toString().slice(0, 1)}`" alt="" />
              </template>
              <template #text>
                <p>Edit your profile information and settings.</p>
              </template>
            </vs-card>
          </v-col>
        </v-row>
      </template>
    </base-no-split>
    <v-fade-transition>
      <v-card-text v-if="switchToCardSettings" class="px-8">
        <component :is="activeCard" @cancel="cancel()" />
      </v-card-text>
    </v-fade-transition>
  </div>
</template>

<script>
  import ProfileEdit from './profile-edit';

  export default {
    name: 'ProfileItems',
    components: {
      ProfileEdit,
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

      cancel() {
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
