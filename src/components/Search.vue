<template>
  <div class="search">
    <div class="txt">
      <i></i>
      <span><input type="text" :placeholder="holder" @click="search"></span>
    </div>
  </div>
</template>

<script>
  import {getTip} from '@/api/api'
  export default {
    data () {
      return {
        holder: ''
      }
    },
    created () {
      //埋点
//      window.splash.collectData('op_coupon_search_show');
      this.getTip();
    },
    methods: {
      getTip () {
        getTip().then((res) => {
          if(res.data.code === 0){
            this.holder = res.data.data;
          }
        })
      },
      search () {
        //埋点
//        window.splash.collectData('op_coupon_search_click');
        this.$router.push({path: '/entry'})
      }
    }
  }
</script>

<style lang="scss">
  .search{
    width: 100%;
    height:90px;
    background:-webkit-gradient(linear, left top, right top, from(#FF8801), to(#FF5101));
    position: relative;

    .txt{
      width: 100%;
      height:48px;
      padding: 21px 0;
      margin:0 auto;
      background: #fff;
      border-radius: 45px;

      i{
        width: 48px;
        height:48px;
        background: url("../assets/img/search.png") no-repeat;
        background-size:cover;
        display: block;
        float: left;
        margin-left: 50px;
        margin-right: 40px;
      }

      span{
        height:48px;
        display: block;
      }

      input{
        width: 80%;
        height:48px;
        line-height:48px;
        border:0;
        background: none;
        font-size:42px;
        color: #CFD2D9;
        border-radius: 0;
        -webkit-appearance: none;
      }

      input::-webkit-input-placeholder {color:#CFD2D9;}
    }
  }

</style>
