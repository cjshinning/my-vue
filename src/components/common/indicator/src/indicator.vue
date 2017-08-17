<template>
  <transition name="wps-indicator">
    <div class="wps-indicator" v-show="visible">
      <div class="wps-indicator-wrapper">
        <span class="wps-indicator-spin" v-if="showSpinner">
          <div class="wps-spinner-snake" style="border-top-color: #ccc;border-left-color: #ccc;border-bottom-color: #ccc;height: .81rem;width: .81rem;"></div>
        </span>
        <div v-show="text" class="wps-indicator-text" :class="showSpinner && text ? 'wps-indicator-text-top' : ''">{{ text }}</div>
      </div>
      <div class="wps-indicator-mask" @touchmove.stop.prevent></div>
    </div>
  </transition>
</template>

<style lang="scss">
  @-webkit-keyframes wps-spinner-rotate {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  @keyframes wps-spinner-rotate {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }


  .wps-indicator {
    -webkit-transition: opacity .2s linear;
    transition: opacity .2s linear;

    .wps-indicator-wrapper {
      padding: 36px;
      top: 50%;
      left: 50%;
      position: fixed;
      -webkit-transform: translate(-50%, -50%);
      transform: translate(-50%, -50%);
      border-radius: 15px;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      box-sizing: border-box;
      text-align: center;
      font-size: 0;

      .wps-indicator-spin {
        display: inline-block;
        text-align: center;

        .wps-spinner-snake {
          -webkit-animation: wps-spinner-rotate 0.8s infinite linear;
          animation: wps-spinner-rotate 0.8s infinite linear;
          border: 12px solid transparent;
          border-radius: 50%;
        }
      }

      .wps-indicator-text {
        display: block;
        color: #fff;
        text-align: center;
        font-size: 36px;
      }

      .wps-indicator-text-top {
        margin-top: 30px;
      }

      .wps-indicator-mask {
        top: 0;
        left: 0;
        position: fixed;
        width: 100%;
        height: 100%;
        opacity: 0;
        background: transparent;
      }
    }
  }

  .wps-indicator-enter,
  .wps-indicator-leave-active {
    opacity: 0;
  }
</style>

<script type="text/babel">
  export default {
    data() {
      return {
        visible: false
      };
    },
    props: {
      text: String,
      showSpinner: Boolean
    }
  };
</script>
