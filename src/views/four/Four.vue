<template>
  <v-img
    height="90vh"
    class="justify-center align-center justify-center"
    :style="'height: calc(100vh - 60px);'"
    gradient="to bottom , rgba(20,20,20, .8) 40%,  rgba(0,0,0,.9) 160%"
    src="@/assets/static/bg2.jpg"
  >
    <!-- :src="`https://picsum.photos/1280/800?${Date.now().toString().slice(0, 1)}`" -->

    <v-sheet style="color: #ccc" class="d-flex justify-center align-center flex-column transparent mx-auto" width="50vw">
      <v-img src="@/assets/static/auth.svg" width="250"> </v-img>
      <h3>WRONG TURN?</h3>
      <h5>You look lost, stranger. There's absolutely nothing here!</h5>
      <v-btn class="mt-4"> Go back</v-btn>
    </v-sheet>
  </v-img>
</template>
<script>
  export default {
    name: 'Deny',
  };
</script>
