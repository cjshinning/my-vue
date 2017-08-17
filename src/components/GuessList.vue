<template>
  <div class="guess-list">
    <ul>
      <li v-for="(item, index) in list" @click="jump(item, index)">
        <div class="pic"><img v-lazy="item.image_url" width="100%" alt=""></div>
        <div class="receive">
          <p v-if="item.coupon_amount == 0" class="mt">省<span>{{item.save_price}}元</span></p>
          <p v-else>省<span>{{item.coupon_amount}}元</span></p>
          <input v-if="item.coupon_amount == 0" type="button" value="立即购买" class="btn" />
          <input v-else type="button" value="领券购买" class="btn" @click="receive(item, index, $event)" />
        </div>
        <div class="info">
          <h3>{{item.title}}</h3>
          <p class="get">已抢{{item.volume}}件</p>
          <p class="price"><span>￥{{item.zk_final_price}}</span><span class="Orig">￥{{item.reserve_price}}</span></p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    data() {
      return {
      }
    },
    props:['list'],
    created () {
    },
    methods: {
      jump(item, index){
        console.log(this.list.length);

        if(this.list.length === 5) {    //为你推荐埋点
          //埋点
//          window.splash.collectDataV3('op_coupon_search_noresult_recommend_click',item.title);
        }else {   //猜你喜欢推荐埋点
          //埋点
          if(index<10){
//            window.splash.collectDataV3('op_coupon_home_'+(index+1)+'_click',item.title);
          }
        }


        if(item.coupon_amount === 0) {    //没券，跳转到商品
          let jumpUrl = item.click_url;
          let tbJumpUrl = item.deeplink_url;

          //判断是否客户端打开
          if(window.splash) {
            //判断是否安装淘宝app
            if(window.splash.isInstalledApp("com.taobao.taobao")) {
              window.location.href = tbJumpUrl;
//            window.splash.JSJumpURI("tb",tbJumpUrl,"")
            } else {
              window.splash.loadHyperlink(jumpUrl, "browser")
            }
          } else {
            window.location.href = jumpUrl;
          }
        }else{    //有券，跳转到券的链接
          let jumpUrl = item.coupon_click_url;
          let tbJumpUrl = item.coupon_deeplink_url;

          //判断是否客户端打开
          if(window.splash) {
            //判断是否安装淘宝app
            if(window.splash.isInstalledApp("com.taobao.taobao")) {
              window.location.href = tbJumpUrl;
//              window.splash.JSJumpURI("tb",tbJumpUrl,"");
            } else {
              window.splash.loadHyperlink(jumpUrl, "browser")
            }
          } else {
            window.location.href = jumpUrl;
          }
        }


      }
    }
  }
</script>

<style lang="scss">

.guess-list{
  padding: 0 28px;

  ul{
    overflow: hidden;
  }

  li{
    width: 1024px;
    height:272px;
    background: url(../assets/img/coupon.png) no-repeat;
    background-size: cover;
    margin-bottom:30px;

    .pic{
      width: 216px;
      height:216px;
      float: left;
      margin: 28px;
      background: #efefef;
      border-radius: 14px;
      overflow: hidden;
    }

    .receive{
      width: 274px;
      height:272px;
      float: right;
      text-align: center;
      margin-left: 28px;

      .btn{
        width: 180px;
        height: 54px;
        background:-webkit-gradient(linear, left top, right top, from(#FF8700), to(#FF4F00));
        border-radius: 100px;
        font-size:33px;
        border: 0;
        margin-top: 24px;
        color: #fff;
        letter-spacing: -0.8px;
      }

      p{
        margin-top: 70px;
        line-height:54px;
        font-size:30px;
        color: #FF5A00;

        span{
          /*display: inline-block;*/
          /*line-height: 60px;*/
          position: relative;
          bottom:-3px;
          font-size:54px;
        }
      }

      .mt{
        margin-top:40px;
      }
    }

    .info{
      letter-spacing: 0.7px;

      h3{
        padding-top:24px;
        height:100px;
        line-height:50px;
        font-size:36px;
        color: #535252;
        overflow: hidden;
      }

      .get{
        margin-top:8px;
        font-size:30px;
        color: #9B9B9B;
        line-height:40px;
      }

      .price{
        margin-top:30px;
        height: 40px;
        line-height:40px;
        font-size:30px;
        color: #535252;
        span{
          display: block;
          float: left;
          margin-right: 40px;
        }

        .Orig{
          color:#9B9B9B;
          text-decoration: line-through;
        }
      }
    }
  }

  /*.loading{*/
    /*height:60px;*/
    /*line-height:60px;*/
    /*font-size:30px;*/
    /*text-align: center;*/
  /*}*/
}

</style>




