<template>
  <v-fade-transition mode="out-in">
    <router-view />
  </v-fade-transition>
</template>

<script>
  export default { name: 'App',
                   mounted() {
                     //Set Vuesax dark theme
                     this.$vs.setTheme('dark')

                   }}
                 
</script>
<style>



html {
  background: #24272c;
  overflow:hidden!important; 
  }

  .theme--light.v-application {
    background: #24272c !important;

}

button, input, optgroup, select, textarea {
    font: icon!important;

}

</style>
