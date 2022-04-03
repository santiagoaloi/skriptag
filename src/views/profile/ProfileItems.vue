<template>
  <base-no-split>
    <template #left>
      <v-row>
        <v-col cols="4">
          <vs-card class="my-card">
            <template #title>
              <h3>Pot with a plant</h3>
            </template>
            <template #img>
              <img :src="`https://picsum.photos/1280/800?${Date.now().toString().slice(0, 1)}`" alt="" />
            </template>
            <template #text>
              <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
            </template>
            <template #interactions>
              <vs-button danger icon>
                <i class="bx bx-heart"></i>
              </vs-button>
              <vs-button class="btn-chat" shadow primary>
                <i class="bx bx-chat"></i>
                <span class="span"> 54 </span>
              </vs-button>
            </template>
          </vs-card>
        </v-col>
        <v-col cols="3">
          <vs-card class="my-card">
            <template #title>
              <h3>Pot with a plant</h3>
            </template>
            <template #img>
              <img :src="`https://picsum.photos/1280/800?${Date.now().toString().slice(0, 1)}`" alt="" />
            </template>
            <template #text>
              <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
            </template>
            <template #interactions>
              <vs-button danger icon>
                <i class="bx bx-heart"></i>
              </vs-button>
              <vs-button class="btn-chat" shadow primary>
                <i class="bx bx-chat"></i>
                <span class="span"> 54 </span>
              </vs-button>
            </template>
          </vs-card>
        </v-col>
        <v-col cols="5" align-self="stretch">
          <vs-card class="my-card">
            <template #title>
              <h3>Pot with a plant</h3>
            </template>
            <template #img>
              <img :src="`https://picsum.photos/1280/800?${Date.now().toString().slice(0, 1)}`" alt="" />
            </template>
            <template #text>
              <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
            </template>
            <template #interactions>
              <vs-button danger icon>
                <i class="bx bx-heart"></i>
              </vs-button>
              <vs-button class="btn-chat" shadow primary>
                <i class="bx bx-chat"></i>
                <span class="span"> 54 </span>
              </vs-button>
            </template>
          </vs-card>
        </v-col>

        <v-col cols="6" align-self="stretch">
          <vs-card class="my-card">
            <template #title>
              <h3>Pot with a plant</h3>
            </template>
            <template #img>
              <img :src="`https://picsum.photos/1280/800?${Date.now().toString().slice(0, 1)}`" alt="" />
            </template>
            <template #text>
              <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
            </template>
            <template #interactions>
              <vs-button danger icon>
                <i class="bx bx-heart"></i>
              </vs-button>
              <vs-button class="btn-chat" shadow primary>
                <i class="bx bx-chat"></i>
                <span class="span"> 54 </span>
              </vs-button>
            </template>
          </vs-card>
        </v-col>
        <v-col cols="3" align-self="stretch">
          <vs-card class="my-card">
            <template #title>
              <h3>Pot with a plant</h3>
            </template>
            <template #img>
              <img :src="`https://picsum.photos/1280/800?${Date.now().toString().slice(0, 1)}`" alt="" />
            </template>
            <template #text>
              <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
            </template>
            <template #interactions>
              <vs-button danger icon>
                <i class="bx bx-heart"></i>
              </vs-button>
              <vs-button class="btn-chat" shadow primary>
                <i class="bx bx-chat"></i>
                <span class="span"> 54 </span>
              </vs-button>
            </template>
          </vs-card>
        </v-col>
        <v-col cols="3" align-self="stretch">
          <vs-card class="my-card">
            <template #title>
              <h3>Pot with a plant</h3>
            </template>
            <template #img>
              <img :src="`https://picsum.photos/1280/800?${Date.now().toString().slice(0, 1)}`" alt="" />
            </template>
            <template #text>
              <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
            </template>
            <template #interactions>
              <vs-button danger icon>
                <i class="bx bx-heart"></i>
              </vs-button>
              <vs-button class="btn-chat" shadow primary>
                <i class="bx bx-chat"></i>
                <span class="span"> 54 </span>
              </vs-button>
            </template>
          </vs-card>
        </v-col>
      </v-row>
    </template>
  </base-no-split>
</template>
<script>
  export default {
    name: 'ProfileItems',
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
