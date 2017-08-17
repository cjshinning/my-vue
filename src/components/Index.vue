<template>
  <div>
    <header>
      <!--精品推荐-->
      <div class="box" v-bind:style="{ padding: boxPad }">
        <search></search>
        <a href="javascript:;" class="back" @click="backTo"></a>
      </div>
    </header>
    <section>
      <links></links>
      <div class="guess">
        <div class="tit">
          <h2>猜你喜欢</h2>
        </div>
        <guess-list :list="guesslst"></guess-list>
        <div class="loading">{{loading}}</div>
      </div>
    </section>
  </div>
</template>

<script>
  import Links from '@/components/Links'
  import GuessList from '@/components/GuessList'
  import Search from '@/components/Search'

  import {guessLike} from '@/api/api'

  import jQuery from 'jquery'

  export default {
    data() {
      return {
        boxPad: '0 0.462963rem 0 1.3rem',
//        num:20,
        flag:true,
        loading:'',
        guesslst:[]
      }
    },
    created () {
      //埋点
//      window.splash.collectData('op_coupon_home_inter');

      let page = 1;

      //默认加载猜你喜欢的数据
      this.getList(page);

      //滚动加载更多
      let _this = this;
      jQuery(window).scroll(function () {
        let scrollTop = jQuery(this).scrollTop();
        let scrollHeight = jQuery(document).height();
        let windowHeight = jQuery(this).height();
        if(scrollTop + windowHeight === scrollHeight) {
          page++;
          if(_this.flag){
            _this.getList(page);
          }
        }
      })
      this.$store.commit('changeListData',this.guesslst)
    },
    methods: {
      backTo () {
        window.splash.onBackPressed(true);
      },
      //获取猜你喜欢列表
      getList (page) {
//        let deviceInfo = JSON.parse(window.splash.jsGetDeviceInfo()),
//            imei = deviceInfo.imei,
//            net_type = deviceInfo.network_type;

        //测试数据
        let imei = '11111111',
          net_type = 'wifi';

        if(imei && net_type){
          guessLike({imei: imei, net_type: net_type,page: page}).then((res) => {
            if(res.data.code == 0) {
              let dataLen = res.data.data.length;
              let sortArr = [];

              if(dataLen>0){
                sortArr = res.data.data;

                //按优惠券面值排序，从大到小
                if(dataLen > 1) {
                  sortArr.sort(function (x,y) {
                    if (x.coupon_amount < y.coupon_amount) {
                      return 1
                    } else if (x.coupon_amount > y.coupon_amount) {
                      return -1
                    } else {
                      return 0
                    }
                  });
                }

                //将排序后的临时数组塞进list
                for(let i=0;i<sortArr.length;i++){
                  this.guesslst.push(sortArr[i]);
                }

                //保留2位小数
                function changeTwoDecimal(x){
                  var f_x = parseFloat(x);
                  if (isNaN(f_x))
                  {
                    console.log('function:changeTwoDecimal->parameter error');
                    return false;
                  }
                  f_x = Math.round(f_x *100)/100;

                  return f_x;
                }

                for(let i=0;i<this.guesslst.length;i++){
                  this.guesslst[i].save_price = changeTwoDecimal(this.guesslst[i].reserve_price - this.guesslst[i].zk_final_price);
                }

                this.loading = '加载中...';

                //埋点
//                window.splash.collectData('op_coupon_home_requestsuccess');

//              if(dataLen < this.num) {
//                this.flag = false;
//                this.loading = '没有更多了';
//              }
              }else{
                this.flag = false;
                this.loading = '没有更多了';
                //埋点
//                window.splash.collectData('op_coupon_home_request');
              }
            }
          })
        }

      }
    },
    components: {
      Links,
      GuessList,
      Search
    }
  }
</script>

<style lang="scss">
  header{
    width: 100%;
    height:90px;
    padding: 30px 0;
    background:-webkit-gradient(linear, left top, right top, from(#FF8801), to(#FF5101));
    position: fixed;
    z-index: 999;
    /*line-height:90px;*/
    /*text-align: center;*/
    /*font-size:52px;*/
    /*color: #fff;*/

    .box{
      padding: 0 50px;
    }
  }

  .back{
    width: 52px;
    height: 52px;
    position: absolute;
    left: 40px;
    top:49px;
    display: block;
    background: url(../assets/img/back.png) no-repeat;
    background-size: cover;
  }

  section{
    padding-top: 150px;
  }

  .guess{
    .tit{
      height: 50px;
      padding: 39px 0;

      h2{
        width: 312px;
        height: 34px;
        line-height: 34px;
        margin: 8px auto;
        background: url(../assets/img/tit.png) no-repeat;
        background-size: cover;
        font-size:36px;
        text-align: center;
        color: #FF4F00;
      }
    }
  }

  .loading{
    height:100px;
    line-height:100px;
    font-size:30px;
    text-align: center;
    margin-top: -30px;
    color: #cfd2d9;
  }
</style>
