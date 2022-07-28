<template>
  <div class="typing-indicator">
    <span />
    <span />
    <span />
  </div>
</template>

<script>
  export default {
    name: 'BaseTypingIndicator',
  };
</script>
<style lang="scss">
  .typing-indicator {
    float: left;
    background-color: transparent;
    will-change: transform;
    width: auto;
    border-radius: 50px;
    padding: 12px;
    // display: table;
    // margin: 0 auto;
    margin-left: -8px;
    position: relative;
    animation: 2s bulge infinite ease-out;
    &::before,
    &::after {
      content: '';
      position: absolute;
      width: 20px;
      border-radius: 50%;
      background-color: transparent;
    }

    span {
      height: 15px;
      width: 15px;
      float: left;
      margin: 0 2px;
      background-color: #9e9ea1;
      display: block;
      border-radius: 50%;
      opacity: 0.4;
      @for $i from 1 through 3 {
        &:nth-of-type(#{$i}) {
          animation: 1s blink infinite ($i * 0.3333s);
        }
      }
    }
  }

  @keyframes blink {
    50% {
      opacity: 1;
    }
  }

  @keyframes bulge {
    50% {
      transform: scale(1.05);
    }
  }
</style>
