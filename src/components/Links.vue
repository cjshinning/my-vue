<template>
  <div class="entrance">
    <ul>
      <li v-for="(item, index) in items" @click="jump(item, index)">
        <div class="pic">
          <img v-bind:src="item.imgUrl" width="100%" alt="">
        </div>
        <div class="txt">
          {{item.name}}
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import axios from 'axios'
  import dataServices from '@/utils/dataServices'
  import hb from '../assets/img/hb.png'
  import cs from '../assets/img/cs.png'
  import jhs from '../assets/img/jhs.png'
  import wh from '../assets/img/wh.png'
  export default {
    data(){
      return {
        items: [
          {
            name: '淘宝红包',
            imgUrl: hb,
            url: 'https://ai.m.taobao.com/index.html?pid=mm_35876686_13194734_101454604',
            alias: 'tb'
          },
          {
            name: '天猫超市',
            imgUrl: cs,
            url: 'https://s.click.taobao.com/Hhv42gw',
            alias: 'tm'
          },
          {
            name: '聚划算',
            imgUrl: jhs,
            url: 'https://s.click.taobao.com/UwD52gw',
            alias: 'jhs'
          },
          {
            name: '尾货',
            imgUrl: wh,
            url: 'https://s.click.taobao.com/2zX42gw',
            alias: 'wh'
          }
        ]
      }
    },
    created () {
    },
    methods: {
      jump(item, index){
        //埋点
//        window.splash.collectData('op_coupon_home_'+item.alias+'_click');

        var jumpUrl = item.url;
        var tbJumpUrl = jumpUrl.replace('https','taobao');

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
      }
    }
  }
</script>

<style lang="scss">
  .entrance{
    width: 100%;
    height: 340px;
    background: #fff;

    ul{
      width: 100%;
      display: flex;

      li{
        flex:1;
        text-align: center;
        height:340px;

        .pic{
          width: 140px;
          height: 140px;
          margin: 60px auto 0;
        }

        .txt{
          height:56px;
          line-height:56px;
          margin-top: 30px;
          font-size:36px;
          color: #535252;
        }

        a{
          display: block;
          width: 100%;
          height:300px;
          line-height:300px;
        }
      }
    }
  }
</style>
