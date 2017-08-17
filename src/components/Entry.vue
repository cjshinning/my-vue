<template>
  <div>
    <header>
      <div class="box" v-bind:style="{ padding: boxPad }">
        <div class="search2">
          <div class="txt">
            <i></i>
            <span><input type="text" v-focus placeholder="输入商品或类型" @keyup.enter="getResult(keyword)" v-model="keyword"></span>
          </div>
        </div>
        <a href="javascript:;" class="cancel" @click="toIndex">取消</a>
      </div>
    </header>
    <section>
      <div class="result">
        <div class="hot">
          <h3>热门搜索</h3>
          <ul>
            <li v-for="(hot, index) in hots" @click="getResult(hot)">
              {{hot}}
            </li>
          </ul>
        </div>
        <div class="history">
          <div class="hd">
            <h3>历史记录</h3>
            <i class="delete" @click="removeHistory"></i>
          </div>
          <div class="bd">
            <ul>
              <li v-for="(history, index) in historyArr" @click="getResult(history)">
                {{history}}
              </li>
            </ul>
            <div class="no-history" v-if="historyShow">没有历史记录</div>
          </div>
        </div>
      </div>
    </section>
  </div>

</template>

<script>
  import {getTip,getHot} from '@/api/api'
  import Toast from './common/toast'
  
  export default {
    data () {
      return {
        boxPad: '0 1.4rem 0 0.462963rem',
        keyword: '',
        hots: [],
        historyArr: [],
        historyShow: true
      }
    },
    created () {
      this.getHot();
      this.setHistory();

    },
    mounted () {
      if(this.historyArr.length > 0){
        this.historyShow = false;
      }
    },
    methods: {
      toIndex () {
        this.$router.push({path: '/'});
      },
      removeHistory () {
        window.localStorage.removeItem('historyItems');
        this.historyArr = [];
      },
      setHistory () {
        let historyItems = window.localStorage.getItem('historyItems');

        if(historyItems) {
          if(historyItems.indexOf('|') !== -1) {
            this.historyArr = historyItems.split('|');
            if(this.historyArr.length > 5){
              this.historyArr = this.historyArr.splice(0,5);
            }
          }else{
            this.historyArr.push(historyItems);
          }

        }

      },
      getHot () {
        getHot().then((res) => {
          if(res.data.code === 0){
            if(res.data.code === 0){
              this.hots = res.data.data;
            }
          }
        })
      },
      getResult (key) {
        if(key === ''){
          Toast('请输入搜索词');
          return;
        }else{
          this.$router.push({path: '/result/'+key});
        }
      }
    }
  }
</script>

<style lang="scss">

  .cancel{
    height: 90px;
    line-height:90px;
    position: absolute;
    right: 40px;
    top:30px;
    display: block;
    font-size:42px;
    color: #fff;
  }

  .search2{
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
        width: 70%;
        height:48px;
        line-height:48px;
        border:0;
        background: none;
        font-size:42px;
        color: #535252;
        border-radius: 0;
        -webkit-appearance: none;
      }

      input::-webkit-input-placeholder {color:#CFD2D9;}
    }
  }

  .result{
    width: 100%;
    position: absolute;
    left:0;
    top:150px;
    z-index: 1;
  }

  .hot{
    padding: 16px 48px 46px;
    background: #fff;

    h3{
      line-height:65px;
      font-size:36px;
      color: #9B9B9B;
    }

    ul{
      margin-right: -30px;
    }

    li{
      padding: 0 32px;
      height: 94px;
      line-height: 103px;
      background: #F5F5F5;
      border-radius: 48px;
      display: inline-block;
      margin: 30px 30px 0 0;
      color: #535252;
    }
  }

  .history{
    margin-top:12px;
    background: #fff;

    .hd{
      padding: 0 48px;
      border-bottom: 4px solid #F4F4F4;
      height: 142px;
      line-height:142px;

      h3{
        float: left;
        font-size:36px;
        color: #9B9B9B;
      }

      .delete{
        width: 52px;
        height:52px;
        margin-top: 44px;
        float: right;
        background: url(../assets/img/delete.png) no-repeat;
        background-size: cover;
      }
    }

    .bd{
      padding:0 50px;

      li{
        height: 142px;
        line-height: 142px;
        border-bottom: 4px solid #F4F4F4;
        font-size:36px;
        color: #535252;

        &:last-child{
          border-bottom: none;
        }
      }
    }

    .no-history{
      line-height:100px;
      text-align: center;
    }
  }

</style>

