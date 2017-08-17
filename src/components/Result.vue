<template>
  <div>
    <header>
      <div class="box" v-bind:style="{ padding: boxPad }">
        <div class="search3">
          <div class="txt">
            <span><input type="text" @click="toSearch" v-model="keyword" ref="abc"></span>
          </div>
        </div>
        <a href="javascript:;" class="back" @click="toIndex"></a>
      </div>
    </header>

    <section>
      <div class="found" v-if="found">
        <search-list :searchList="searchList"></search-list>
        <div class="guess" v-if="hasTit">
          <div class="tit">
            <h2>猜你喜欢</h2>
          </div>
        </div>
        <guess-list :list="filterList"></guess-list>
      </div>
      <div class="not-found" v-if="notFound">
        <p class="tip">没有找到<em>{{wd}}</em>相关的优惠券或商品</p>
        <div class="guess">
          <div class="tit">
            <h2>为你推荐</h2>
          </div>
          <guess-list :list="randomList"></guess-list>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import SearchList from '@/components/SearchList'
  import GuessList from '@/components/GuessList'
  import {search} from '@/api/api'

  import {guessLike} from '@/api/api'
  import jQuery from 'jquery'

  export default {
    data() {
      return {
        boxPad: '0 0.462963rem 0 1.3rem',
        found: false,
        notFound: false,
        hasTit: false,
        searchList: [],
        keyword: this.$route.params.key,
        keywd: this.$route.params.key,
        wd: this.$route.params.key,
        num:20,
        flag:true,
        loading:'',
        searchList2:[],
        filterList:[],
        randomList:[]
      }
    },
    created () {
      //默认显示搜索列表页
      this.search(this.keywd);
    },
    mounted () {
    },
    methods: {
      toSearch () {
        this.$router.push({path: '/entry'});
      },
      toIndex () {
        this.$router.push({path: '/'});
      },
      setHistoryItems (keyword) {
        keyword = keyword.trim();
        let {historyItems} = localStorage;
        if (historyItems === undefined) {
          localStorage.historyItems = keyword;
        } else {
          const onlyItem = historyItems.split('|').filter(e => e != keyword);
          if (onlyItem.length > 0) historyItems = keyword + '|' + onlyItem.join('|');
          localStorage.historyItems = historyItems;
        }
      },
      search (key) {
        if(key === ''){
          window.splash.JSShowToast('请输入搜索词');
          return;
        }else{
          this.$router.push({path: '/result/'+key});
        }

        this.wd = key;

        //过滤数组
        this.filterList = [];
        for(let i=0;i<this.$store.state.listData.length;i++){
          if(this.$store.state.listData[i].title.indexOf(key) !== -1){
            this.filterList.push(this.$store.state.listData[i]);
          }
        }

        //随机数组
        function getRandomArrayElements(arr, count) {
          var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
          while (i-- > min) {
            index = Math.floor((i + 1) * Math.random());
            temp = shuffled[index];
            shuffled[index] = shuffled[i];
            shuffled[i] = temp;
          }
          return shuffled.slice(min);
        }

        var items = this.$store.state.listData;
        if(items.length >= 5){
          this.randomList = getRandomArrayElements(items, 5);
        }

        //搜索历史数据存储
        this.setHistoryItems(key);

        search({key: key}).then((res) => {
          this.notFound = false;
          this.found = false;

          if(res.data.data.length === 0 && this.filterList.length === 0){
            this.notFound = true;
            //埋点
//            window.splash.collectDataV3('op_coupon_search_noresult',key);
          }else{
            this.searchList = res.data.data;
            this.hasTit = false;
            if(this.filterList.length !== 0){
              this.hasTit = true;
            }

            let receiveItems = window.localStorage.getItem('receiveItems');
            let receiveArr = [];

            if(receiveItems){
              if(receiveItems.indexOf('|') !== -1) {
                receiveArr = receiveItems.split('|');
              }else{
                receiveArr.push(receiveItems)
              }
            }

            for(let i=0;i<this.searchList.length;i++){

              if(this.searchList[i].CouponDetail.indexOf('无条件券') !== -1){
                this.searchList[i].CouponDetail2 = this.searchList[i].CouponDetail.split('无条件券')[0];
              }else{
                this.searchList[i].CouponDetail2 = this.searchList[i].CouponDetail.split('减')[1];
              }

              if(this.searchList[i].CouponUrl.indexOf('https')!==-1){
                this.searchList[i].taoBaoCouponUrl = this.searchList[i].CouponUrl.replace('https','taobao');
              }else{
                this.searchList[i].taoBaoCouponUrl = this.searchList[i].CouponUrl.replace('http','taobao');
              }

              if(this.searchList[i].DetailUrl.indexOf('https')!==-1){
                this.searchList[i].taoBaoDetailUrl = this.searchList[i].DetailUrl.replace('https','taobao');
              }else{
                this.searchList[i].taoBaoDetailUrl = this.searchList[i].DetailUrl.replace('http','taobao');
              }

              this.searchList[i].Date2 = this.searchList[i].Date.substr(0,10);

              if(receiveArr.length > 0){
                for(let j=0;j<receiveArr.length;j++){
                  if(receiveArr[j] === this.searchList[i].CouponId){
//                    console.log('第'+i+'个相同，需要设置为1');
                    this.searchList[i].received = 1;
                  }else{
//                    this.searchList[i].received = 0;
                  }
                }
              }else {
//                this.searchList[i].received = 0;
              }
            }

            let num = 0;
            for(let i=0;i<this.searchList.length;i++){
              if(this.searchList[i].received === 1){
                num++;
              }
            }

            //所有的列表点击过去，将不再显示
            if(num === this.searchList.length && this.filterList.length === 0){
              this.notFound = true;
              //埋点
//              window.splash.collectDataV3('op_coupon_search_noresult',key);
            }else{
              this.found = true;
              //埋点
//              window.splash.collectDataV3('op_coupon_search_success',key);
            }

          }
        })
      }
    },
    components: {
      SearchList,
      GuessList
    }
  }
</script>

<style lang="scss">

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

  .search3{
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
        padding-left:40px;
        display: block;
      }

      input{
        width: 80%;
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

  .not-found{

    .tip{
      height: 170px;
      line-height:170px;
      background: #fff;
      font-size:36px;
      text-align: center;

      em{
        color: #2391ff;
      }
    }
  }

</style>
