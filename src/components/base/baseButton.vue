<template>
  <v-btn v-animation:shrink="{ longPress: true }" v-bind="$attrs" :ripple="false" large v-on="$listeners"> <slot /></v-btn>
</template>

<script>
  export default {
    name: 'BaseButton',
  };
</script>
