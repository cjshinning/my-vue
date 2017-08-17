<template>
  <transition name="fade">
    <div class="wps-toast" v-show="visible">
      <span class="wps-toast-text">{{ message }}</span>
    </div>
  </transition>
</template>

<style lang="scss">
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
    opacity: 0
  }
  .wps-toast {
    position: fixed;
    max-width: 80%;
    border-radius: 15px;
    background: rgba(0, 0, 0, 0.7);
    color: #fff;
    box-sizing: border-box;
    text-align: center;
    z-index: 1000;
    -webkit-transition: opacity .3s linear;
    transition: opacity .3s linear;

    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);

    .wps-toast-text {
      font-size: 36px;
      display: block;
      text-align: center;
      padding: 18px;
    }
  }
</style>

<script type="text/babel">
  export default {
    props: {
      message: String
    },
    data () {
      return {
        visible: false
      }
    }
  }
</script>
