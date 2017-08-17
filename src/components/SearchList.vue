<template>
  <div class="search-list">
    <ul>
      <li v-for="(item, index) in searchList" @click="jump(item, index)" v-if="item.received !== 1">
        <div class="pic"><img v-lazy="item.MainImgUrl" width="100%" alt=""></div>
        <div class="receive">
          <input type="button" value="立即领取" class="btn"/>
        </div>
        <div class="info">
          <h3>{{item.ShopName}}</h3>
          <p class="price"><span>{{item.CouponDetail2}}</span><span class="date">有效期至{{item.Date2}}</span></p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import {getUse} from '@/api/api'

  export default {
    data() {
      return {
        showItem: true
      }
    },
    props: ['searchList'],
    methods: {
      //产品跳转
      jump(item, index){
        //埋点
//        window.splash.collectDataV3('op_coupon_search_success_result_click',item.ShopName);

        //数据上报
        getUse({coupon_id: item.CouponId}).then((res) => {
        })

        this.setReceiveItems(item.CouponId);

        let jumpUrl = item.CouponUrl;
        let tbJumpUrl = item.taoBaoCouponUrl;

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
      },
      setReceiveItems (keyword) {
        keyword = keyword.trim();
        let {receiveItems} = localStorage;
        if (receiveItems === undefined) {
          localStorage.receiveItems = keyword;
        } else {
          const onlyItem = receiveItems.split('|').filter(e => e != keyword);
          if (onlyItem.length > 0) receiveItems = keyword + '|' + onlyItem.join('|');
          localStorage.receiveItems = receiveItems;
        }
      }
    }
  }
</script>

<style lang="scss">

.search-list{
  padding: 0 28px;

  ul{
    overflow: hidden;
  }

  li{
    width: 1024px;
    height:272px;
    background: url(../assets/img/coupon.png) no-repeat;
    background-size: cover;
    margin-top:30px;

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
        margin-top: 110px;
        color: #fff;
        letter-spacing: -0.8px;
      }

      p{
        margin-top: 70px;
        line-height:50px;
        font-size:30px;
        color: #FF5A00;

        span{
          font-size:50px;
        }
      }

      .mt{
        margin-top:40px;
      }
    }

    .info{

      h3{
        padding-top:24px;
        height:100px;
        line-height:50px;
        font-size:36px;
        color: #535252;
        overflow: hidden;
        letter-spacing: 0.7px;
      }

      .price{
        margin-top:64px;
        height: 54px;
        line-height:54px;
        font-size:54px;
        letter-spacing: -1.3px;
        color: #FF5A00;

        span{
          display: block;
          float: left;
        }

        .date{
          float: right;
          line-height: 34px;
          margin-top: 20px;
          font-size:30px;
          color: #9B9B9B;
        }

        .Orig{
          color:#9B9B9B;
          text-decoration: line-through;
        }
      }
    }
  }

  .loading{
    height:60px;
    line-height:60px;
    font-size:30px;
    text-align: center;
  }
}

</style>




