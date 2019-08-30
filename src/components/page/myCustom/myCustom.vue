<template>
<div class="myCustom">

  <div class="head">
    <i class="iconfont icon-zuo" @click="goBack"></i>
    <h1>我的客户</h1>
    <i></i>
  </div>


  <div class="productKind">
    <div class="swiper-container kinds_container">
      <div class="swiper-wrapper">
        <p class="swiper-slide kindP"
           v-for="(item,index) in productKinds"
           @click="chooseKind(index,item.id)"
           :class="{on: curKind == index}">
          {{item.name}}
        </p>

      </div>
    </div>

  </div>


  <div class="orderStates">
     <!--<p v-for="(item,index) in orders"-->
        <!--:class="{on : index == curState}"-->
        <!--@click="chooseState(index)">-->
       <!--{{item.state}} {{item.account}}-->
     <!--</p>-->
    <p :class="{on : curState == 1}"
       @click="chooseState(shInfo.cid,2,0)">审核中</p>
    <p :class="{on : curState == 2}"
       @click="chooseState(tgInfo.cid,3,1,)">已通过</p>
        <p :class="{on : curState == 3}"
       @click="chooseState(tgInfo.cid,4,1,)">未通过</p>
  </div>
  <div class="tip">
    <p>
      提示：本列表是客户在贝化街填写资料的记录，不能视为官方申请记录.
    </p>
  </div>

  <div class="systemNews">
     <div class="swiperTitle">
        <span>每天18:00-21:00审核前一个工作日数据，节假日结算顺延至下个工作日，如果订单审核完还依旧处于审核中状态，下个工作日会继续更新状态。</span>
     </div>

    <div class="swiperTitle">
      <span>每天18:00-21:00审核前一个工作日数据，节假日结算顺延至下个工作日，如果订单审核完还依旧处于审核中状态，下个工作日会继续更新状态。</span>
    </div>
  </div>

  <div class="ordersBox">
    <div v-for="(item,index) in orders">
      <!--<div v-if="index == curState">-->
        <div  class="orderItem">
          <p class="orderTime">{{Number(item.created_time + '000') | formatDate}}</p>
          <div class="orderInfo">
            <div>
              <div class="goodImg"><img :src="urlImg+item.thumb"></div>
              <p class="goodName">{{item.pname}}</p>
            </div>
            <h2 class="orderNum">订单编号：{{item.order_sn}}</h2>
          </div>

          <div class="buyerInfo">
            <div class="buyerName">
              <h1>姓名</h1>
              <p>{{item.name}}</p>
            </div>
            <span></span>
            <div class="buyerPho">
              <h1>手机号</h1>
              <p>
                {{item.tel}}
                <a :href="'tel:'+ item.tel ">
                  <img src="/static/images/myTeam/icon_pho.png">
                </a>
              </p>
            </div>
            <span></span>
            <div class="buyerNote">
              <h1>备注</h1>
             <p>{{item.remarks?item.remarks:'...'}}</p>
            </div>
          </div>
        </div>
      </div>
    <!--</div>-->

  </div>
</div>
</template>

<script>
  import NewsLoop from '@/components/common/newsLoop';
  import {selectTableInfo} from '@/config/utils';
  import {formatDate,subStrFun} from '@/../static/js/function.js';
  var orders = [{
    'state':'审核中',
    'kind':'1',
    'account':'1',
    'orderInfo':[
      {
        'time':'2018-11-20',
        'goodImg':'/static/images/index/img_prod01.png',
        'goodName':'盈盈有钱',
        'orderNum':'Yz5801543368908',
        'customName':'阿帅',
        'customPho':'150****1234',
        'customNote':'真烦'
      }

    ]
  },{
    'state':'已通过',
    'kind':'2',
    'account':'0',
    'orderInfo':[]
  },{
    'state':'未通过',
    'kind':'3',
    'account':'0',
    'orderInfo':[]
  }];
  var news = ['审核前一个工作日数据，节假日结算顺延至下个工作日，','如果订单审核完还依旧处于审核中状态，下个工作日会继续更新状态。'];
    export default{
      name: 'myCustom',
      components: {
        NewsLoop:NewsLoop
      },
      data: function () {
        return {
          curKind:0,
          curState:1,
          productKinds:[],//头部大分类
          news:news,
          cid:1,//产品id
          type:2,   //审核进度 2审核中  3审核通过
          orderInfo:{},//申请信息
          shInfo:{//审核状态的信息
            account:0,//数量
            cid:0,//他父级的cid
          },
          tgInfo:{//通过状态的信息
            account:0,//数量
            cid:0//他父级的cid
          },
          orders:[],//订单列表
          urlImg:process.env.API_HOST,//图片域名
        }
      },
      filters: {
        formatDate(time) {
            var date = new Date(time);
            return formatDate(date, 'yyyy-MM hh:mm');
        },//时间
        subStrFun(value) {
          return subStrFun(value);
        }//截取字符串

      },

      methods: {
        pSwiperInit: function () {

          var  swiper = new Swiper('.kinds_container', {
            slidesPerView: 'auto',
            spaceBetween: 10,
            initialSlide :0,
            observer:true,//修改swiper自己或子元素时，自动初始化swiper
            observeParents:true//修改swiper的父元素时，自动初始化swiper
          })

          return swiper;

        },

        //选择上面的大类
        chooseKind: function (index,id) {
          this.cid = id;
          this.curKind = index;
          this.getDaitype(this.cid, this.type);

        },
        //返回上一页
        goBack() {
          this.$router.go(-1);
        },
        //选择是审核还是通过装态
        chooseState: function (cid,type) {
          this.type = type;
          this.curState = type -1 ;
          this.getDaitype(this.cid,this.type);

        },

         //获取用户信息
        async getDaitype(cid,type) {
          let param = {
            mid:localStorage.getItem('member_id'),//推广人
            cid:cid,     //产品分类
            type:type,   //审核进度 2审核中  3审核通过
          };
          let _orderInfo = await selectTableInfo('dai-records/whtype',param);
          this.orders = _orderInfo.data;
        },

        //获取产品分类
        async getProductKinds() {
          let _productKinds = await selectTableInfo('products/cate');
          this.productKinds = _productKinds.data;
        }
      },
      mounted: function() {
        this.getProductKinds();
        this.getDaitype(1,2,0);
     },
     updated:function() {
       this.pSwiperInit();
     }

    }
</script>

<style scoped>
.myCustom{padding:0  0 0.26rem 0;background: #fff;width: 100%;overflow-x: hidden;height: 100%;}
.productKind{display: flex;padding: 0.2rem 0.46rem;align-items: center;}
.productKind .swiper-wrapper{align-items: center;}
.productKind p{font-size: 0.26rem;color: #333;margin-right: 0.26rem;display: inline-block;width: auto;}
.productKind p.on{font-size: 0.32rem;color: #000;}
.orderStates{display: flex;padding: 0 0.46rem}
.orderStates p{padding: 0.1rem;border: 1px solid #ccc;font-size: 0.26rem;color: #666;margin-right: 0.2rem;border-radius: 0.04rem;}
.orderStates p.on{color:#f1604e;border-color: #f1604e;}
.tip{font-size: 0.24rem;color: #f4bd4e;line-height: 0.36rem;margin-top: 0.2rem;padding: 0 0.46rem;}
.tip p{border-top: 1px solid #eee;padding: 0.2rem 0;}
.orderItem{background: #fff;padding: 0.26rem;border-bottom: 0.1rem solid #eee;}
.orderTime{font-size: 0.26rem;color: #999;text-align: center;padding: 0.2rem;}
.orderInfo{display: flex;justify-content: space-between;align-items: center;padding-bottom: 0.1rem;border-bottom: 1px solid #eee;margin-bottom: 0.2rem;}
.orderInfo>div{display: flex;align-items: center;}
.goodImg{width: 0.6rem;height: 0.6rem;border-radius: 0.1rem;overflow: hidden;margin-right: 0.1rem;}
.goodImg img{width: 100%;}
.goodName{font-size: 0.24rem;color: #333;}
.orderNum{font-size: .26rem;color: #999;}
.buyerInfo{display: flex;justify-content: space-between;text-align: center;align-items: center;}
.buyerInfo h1{font-size: 0.26rem;color: #999;margin-bottom: 0.24rem;}
.buyerInfo p{font-size: 0.26rem;color: #666;}
.buyerName{width: 33%;}
.buyerPho{width: 33%;}
.buyerNote{width: 33%;}
.buyerInfo span{display: inline-block;height: 0.4rem;width: 1px;background: #eee;}
.systemNews{width: 44rem;background: #f3f3f3;}
.systemNews span{font-size: 0.26rem;display: inline-block;border-radius: 0.1rem;width: 100%;text-align: center;}
.buyerPho p{display: flex;align-items: center;justify-content: center;}
.buyerPho img{width: 0.3rem;margin-left: 0.1rem;}
.systemNews{animation: swiperWord 10s linear infinite both;}
.swiperTitle{font-size: .24rem; color: #fff;background: #7a7a7a;margin-left: .24rem;border-radius: .8rem; width: 17rem;display: inline-block;line-height: 0.56rem;margin-top: 0.1rem;height: 0.56rem;overflow: hidden;}
  @keyframes swiperWord {
    0% {
      -webkit-transform: translateX(0);
      transform: translateX(0);
    }
    100% {
      -webkit-transform: translateX(-17rem);
      transform: translateX(-17rem);
    }
  }
</style>
