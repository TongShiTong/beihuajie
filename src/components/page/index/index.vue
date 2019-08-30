<template>
  <transition name="fade">
    <div class="index">

      <top @click.native="showWxFun()"></top>

      <div class="looper">
        <div class="swiper-container index_container">
          <div class="swiper-wrapper">
            <div class="swiper-slide loopImg_slide" v-for="img in loopImgs" @click="goBannerLink(img.link)">
              <img :src="urlImg+img.pic">
            </div>

          </div>
          <!-- 如果需要分页器 -->
          <div class="swiper-pagination"></div>
        </div>
      </div>
      <div class="ways_money">
        <div class="Fir_title">
          <div class="redLine"></div>
          <h1 class="title">如何通过贝化街赚钱</h1>
        </div>

        <ul class="ways_money_ul">
          <li @click="goPath('/guideClass')">
            <img src="/static/images/index/class.png">
            <div>
              <h1>课堂指引</h1>
              <p>一分钟了解贝化街</p>
            </div>
          </li>

          <li @click="goPath('/myShop?isSet=0')">
            <img src="/static/images/index/loan.png">
            <div>
              <h1>我的店铺</h1>
              <p>一键代理所有产品</p>
            </div>
          </li>
        </ul>

        <div class="threePart">
           <router-link tag="div" to="/recommend">
               <img src="/static/images/index/img01.png">
               <h1>发展代理</h1>
               <p>邀请朋友赚钱</p>
           </router-link>

            <router-link tag="div" to="/myTeam">
              <img src="/static/images/index/img02.png">
              <h1>已邀请代理</h1>
              <p>我的代理团队</p>
            </router-link>

            <router-link tag="div" to="/myCustom">
              <img src="/static/images/index/img03.png">
              <h1>我的客户</h1>
              <p>做单业绩明细</p>
            </router-link>

            <router-link tag="div" to="/moreQuest">
              <img src="/static/images/index/img04.png">
              <h1>发现</h1>
              <p>技术干货</p>
            </router-link>
        </div>

        <div class="news" @click="goPath('/mails')">

          <div class="news_left" v-if="LatestNews.length == 0">
            <img src="/static/images/index/icon_xx.png">
            <p>关注贝化街公众号,了解更多新鲜资讯~</p>
          </div>

          <div class="news_left" v-else v-for="news in LatestNews">
            <img src="/static/images/index/icon_xx.png">
            <p>{{news.title | subStrFun}}  {{Number(news.create_time+'000') | formatDate}}</p>
          </div>

          <div class="news_right">
            <!-- 未读<span>3</span> -->
          </div>
        </div>

        <div class="Fir_title">
          <div class="redLine"></div>
          <h1 class="title">今日热门产品推荐</h1>
        </div>
      </div>

      <div class="today_tj">

        <div class="products">
          <ul>
            <li class="prodct_item"
                v-for="item in hot_products">
              <div class="prodct_item_up">
                <div class="prodct_img"><img :src="urlImg+item.thumb"></div>
                <div class="">
                  <div class="Proname">{{item.name}}</div>
                  <div class="item-header-label" v-for="itema in item.label">{{itema}}</div>
                  <!-- <h1 class="prodct_name"></h1> -->
                </div>
              </div>

              <div class="prodct_item_down">
                <div class="prodct_item_down1">
                  <div class="prodct_range" >
                    <h2 v-if="item.max_money!=0">{{item.min_money+'~'+item.max_money}}</h2>
                    <p v-if="item.max_money!=0">额度范围(元)</p>
                  </div>

                  <div class="prodct_adv">
                    <span @click="goGoodDetails(item.id)">我要推广</span>
                    <div>
                       <p class="prodct_sq"><i>{{item.apply_num}}</i><span>次申请</span></p>
                    </div>
                  </div>
                </div>

                <div class="prodct_item_down2">
                  <span class="Setment">
                    {{item.clearing_form}}
                  </span>
                  <span class="Setment">
                    {{item.fy_ms}}
                  </span>
                   <!-- <p v-for="itema in item.condition"> -->

                  <!-- </p> -->
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div class="profitShow">
        <div class="Fir_title">
          <div class="redLine"></div>
          <h1 class="title">实时收入排行榜</h1>
        </div>

        <div class="shop_profit">
          <div class="shop_profit_left">
            <div class="shoper_img"><img :src="shoper.head_img?urlImg+shoper.head_img: urlImg+logoImg"></div>

            <div class="shoper_infos">
              <div class="shoper_info1">
                <p>{{shoper.tel?shoper.tel.replace(shoper.tel.substr(3,4),'****'):'123****4567'}}</p>
                <span>贝化街老司机</span>
              </div>
              <p class="shoper_info2">店铺名：{{shoper.shop_name?shoper.shop_name:shoper.uid+'号贝化街店铺'}}</p>
              <p class="shoper_info3">总获收入：<i>{{shoper.income}}</i>元</p>
            </div>
          </div>

          <div class="shop_profit_right" @click="goShop(shoper.uid)">查看店铺</div>
        </div>

        <div class="others_profit">
          <div v-for="item in realTimeData" class="other_item">
            <div class="otherImg">
              <img :src="item.head_img ? urlImg+item.head_img : urlImg+logoImg">
            </div>

            <div class="otherInfos">
              <p class="shoper_info2">店铺名：{{item.shop_name?item.shop_name:(item.name?item.name:item.tid+'号闪米店铺')}}</p>
              <p>刚有客户提交了<i>{{item.pname}}</i>产品,总收入<i>{{item.income ? item.income :  Math.floor(Math.random()*10000)}}</i>元</p>
            </div>
          </div>
        </div>
      </div>

      <div class="common_ques">
        <div class="Fir_title Fir_title_link">
          <div class="Fir_title_left">
            <div class="redLine"></div>
            <h1 class="title">帮助中心 / 常见问题</h1>
          </div>

          <div class="Fir_title_right" @click="goPath('/moreQuestion')"> 更多问题  ></div>
        </div>

        <div v-for="que in IndustryNews" class="que_item"  @click="goPath('/questionDetails?id='+que.id)"><i>●</i>{{que.title | subStrFun}}</div>
      </div>

      <div class="common_ques helpers">
        <div class="Fir_title Fir_title_link">
          <div class="Fir_title_left">
            <div class="redLine"></div>
            <h1 class="title">贴心助手 / 快捷入口</h1>
          </div>

        </div>

        <div class="swiper-container helper_container">
          <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="helper in helpers"
                 @click="goPath(helper.path)">
              <img :src="helper.src">
            </div>

          </div>
        </div>
      </div>


      <!--悬浮的按钮部分-->
      <div class="hoverBtns">
        <div @click="showWxFun()">
          <div>
            <i class="iconfont icon-kefu"></i>
          </div>
        </div>

        <div @click="showWxZzc(22)">
          <div>
            <i class="iconfont icon-gongzhonghao"></i>
          </div>
        </div>
      </div>

      <!--点击悬浮按钮出现的弹窗-->
      <div class="zzc" v-if="isShowWx">
        <div class="wxCons">
           <i class="iconfont icon-guanbi1 closeZzc"
              @click="closeWxZzx()"></i>
           <div class="wxConsTop">
             <div class="wxConsTopImg">
               <img :src="urlImg+logoImg">
             </div>
             <div class="wxConsTopTxt" v-if="isKf == 22">
               <h1>关注"{{systemTitle.content}}"公众号</h1>
               <!--<p>微信号:{{wxNum.content}}</p>-->
             </div>

             <div class="wxConsTopTxt" v-else>
               <h1>关注"{{systemTitle.content}}"客服</h1>
             </div>

           </div>

            <!--<p class="wxConsMid" v-if="isKf == 22">添加“贝化街”官方客服微信</p>-->
             <!--<p class="wxConsMid" v-else>关注“贝化街”官方客服微信</p>-->

           <div class="wxConsBottom">
              <img :src="wxCode">
            </div>
        </div>
      </div>


      <!--点击头部的查看微信公众号-->
      <wxPop :showWx="showWx"
             @handleCloseFunc="closeWxPop"></wxPop>

      <foot></foot>
    </div>
  </transition>


</template>
<script type="text/ecmascript-6">
import foot from '@/components/common/foot';
import top from '@/components/common/top';
import {selectTableInfo} from '@/config/utils';
import {formatDate,subStrFun} from '@/../static/js/function.js';
import wxPop from '@/components/common/wxPop';

var helpers = [
  {'src':'/static/images/index/helper01.png','path':'/guideClass'},
  {'src':'/static/images/index/helper02.png','path':'/product'},
  {'src':'/static/images/index/helper03.png','path':'/product?id=49&index=2'},
  {'src':'/static/images/index/helper04.png','path':''}
  ];
var shoper = {
  'src':'/static/images/index/img_prod01.png',
  'pho':'150****1234',
  'nick':'款爷老司机',
  'name':'黑户口子大全',
  'totleMon':'1056.5'
};
export default {
  name: 'index',
  components:{
    foot:foot,
    top:top,
    wxPop:wxPop,
  },
  data: function () {
    return {
      shoper:'',
      randomNum:0,//随机数
      hot_products:'',//热点产品
      loopImgs:'',//轮播图
      helpers:helpers,
	    LatestNews:'',//最新消息
      IndustryNews:'',//行业动态
      realTimeData:'',//实时数据
      timer:null,//实时数据的定时器
      pageNum:1,//实时数据的页数
      isShowWx:false,//是否显示微信二维码的遮罩层
      wxCode:'',//微信二维码
      wxNum:'',//微信号
      systemTitle:'',//系统标题
      uid:0,
      logoImg:'',//网站logo
      isKf:'',//点击的是公众号还是客服  38客服 22公众号
      urlImg:process.env.API_HOST,//图片域名
      showWx:false,//是否显示微信公众号的那个弹窗
      zs_time:true,
    };
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
  methods:{
     swiperInit: function () {

         var swiper1 = new Swiper('.index_container', {
           pagination: '.swiper-pagination',
           autoplayDisableOnInteraction:false,
           autoplay:3000,
           notNextTick: true,
           loop: true,
           observer:true,//修改swiper自己或子元素时，自动初始化swiper
           observeParents:true//修改swiper的父元素时，自动初始化swiper
         })


     },


    swiperInit2: function () {
      let swiper2 = new Swiper('.helper_container', {
        slidesPerView: 2.5,
        spaceBetween: 10,
        freeMode: true

      })
    },
    goGoodDetails: function (id) {
      this.$router.push({
        path:'/product_details',
        query:{pid:id ,uid:this.uid,sm:''}
      });
    },
    goPath: function (path) {

      if(path == ''){
        this.isShowWx = !this.isShowWx;
        this.getWxCode(38);
      }else{
        this.$router.push(path);
      }
    },
    showWxZzc(_id) {
      this.isKf = _id;
      this.isShowWx = !this.isShowWx;
      this.getWxCode(_id);
    },
    closeWxZzx() {
      this.isShowWx = !this.isShowWx;
    },

    closeWxPop:function(data){
      this.showWx = !data;
    },

    //是否显示微信弹窗  
    showWxFun() {
      this.showWx = !this.showWx;
    },

    //获取微信号
    async getWxNum() {
      let _wxNum = await selectTableInfo('systems/37');
      this.wxNum = _wxNum.data;
    },
    //获取微信二维码
    async getWxCode(_id) {
      //id:22是APP的二维码  38是客服的二维码
      let _wxCode = await selectTableInfo('systems/'+ _id +'');
     this.wxCode = process.env.API_HOST+_wxCode.data.content;
    },
    //获取网站logo
    async getWebLogo() {
      let _logo = await selectTableInfo('systems/21');
      this.logoImg = _logo.data.content;
    },
    //获取系统标题
    async getSystemTitle() {
      let _systemTitle = await selectTableInfo('systems/1');
      this.systemTitle = _systemTitle.data;
    },
	//首页轮播
	async banner() {
		var param={type:1};
		let banner_info= await selectTableInfo('banners/type',param);
		this.loopImgs=banner_info.data;
    this.$nextTick(()=>{
      this.swiperInit()
    })
    },
	//首页最新消息
	async article() {
		var param={pageSize:1};//最新消息显示1条
		let article_info= await selectTableInfo('pages/new-notice',param);
		this.LatestNews=article_info.data;
    },
	//首页热点推荐产品
	async product() {
		var param={indexHot:1,pageSize:6};//热点推荐显示2条
		let product_info= await selectTableInfo('products/type',param);
		this.hot_products=product_info.data;
    },
  //首页下面的行业动态
    async articles() {
      var param = {type:16 ,pageSize:3};//行业动态显示3条
      let articles = await selectTableInfo('articles/type',param);
      this.IndustryNews = articles.data;
    },
   //展示实时数据 展示5条
    async getRealTimeData() {
      var param = {pageSize:4,page:1};
      let _realTimeData = await selectTableInfo('products/real-time',param);
      this.realTimeData = _realTimeData.data;
    },
    //实时收入展示 展示1条
    async getRealTimeDataOne() {

      var param = {pageSize:1,page:this.pageNum++};
      let _realTimeDataOne = await selectTableInfo('products/real-time',param);
      if(_realTimeDataOne.data.length < 1){ //如果当前页返回的数据长度为0,则表示没有更多数据,重置page值为0
         this.pageNum = 0;
      }else{
        this.realTimeData.unshift(_realTimeDataOne.data[0]);//向realTimeData的前面添加新数据
        this.realTimeData.pop();//删除realTimeData最后的一条数据
      }
    },
     //展示实时数据 第一位置
    async getNumberOneData() {
      let _numberOne = await selectTableInfo('auths/number-one');
      if(_numberOne.data!=""){
          this.shoper = _numberOne.data;
      }
    },
    //每隔几秒调用一下实时数据的接口
    setTimer:function() {
      this.timer = setInterval(() => {
        // if(this.zs_time){
          this.zs_time=false;
          this.getRealTimeDataOne();
        // }else{
        //   this.zs_time=true;
        //   var num=Math.floor(Math.random()*100+1);
        //   var money=Math.floor(Math.random()*100000+1)
        //   var arr=['团贷网','51秒贷','光大银行白金卡','万达e贷','盈盈有钱','房司令','玖富小蓝卡']
        //    var index =Math.floor((Math.random()*arr.length));
        //   let zscc={
        //     head_img:"",
        //     income:money+".00",
        //     pname:arr[index],
        //     shop_name:"",
        //     tid:num,
        //     }
        //   this.realTimeData.unshift(zscc);//向realTimeData的前面添加新数据
        //   this.realTimeData.pop();//删除realTimeData最后的一条数据
        // }
      },2000)

    },
    //每隔几秒调用一下实时数据的接口
    setTimerOne:function() {
      this.timer = setInterval(() => {
        this.getNumberOneData();
      },3000)

    },
    //查看店铺
    goShop(obj){
      localStorage.setItem('shop_id',obj);
       this.$router.push({
        path:'/myShop',
        query:{uid:obj}
      });
    },

    //banner部分的跳转
    goBannerLink(_link){
      location.href = _link
    }
  },
  mounted: function() {
    this.banner();
    this.getWebLogo();

    this.swiperInit();

    this.swiperInit2();
	  this.article();
	  this.product();
    this.articles();
    this.getRealTimeData();
    this.getNumberOneData();
    this.setTimer();
    this.setTimerOne();
    // this.getWxNum();
    this.getSystemTitle();
    this.uid = localStorage.getItem('member_id');
    //随机生成一个四位数
    this.randomNum = Math.floor(Math.random()*10000);

    //判断推广外页和系统内页
    if(this.$route.query.uid=='' || this.$route.query.uid == undefined){
      this.uid = '';
    }else{
      this.uid = this.$route.query.uid;
    };

    this.$nextTick(()=>{
      this.banner() // 再初始化swiper
    })
  },

  beforeDestory() { //组件销毁之前手动清楚定时器,节约性能
     clearInterval(this.timer);
  }


};

</script>
<style scoped>
  .threePart{display: flex;justify-content: space-around;}
  .threePart div{text-align: center;}
  .threePart img{height: 0.66rem;}
  .threePart h1{font-size: 0.26rem;color: #111;margin: 0.12rem 0;}
  .threePart p{font-size: 0.22rem;color: #999;}
  .zzc{position: fixed;width: 100%;height: 100%;background: rgba(0,0,0,0.5);display: flex;align-items: center;justify-content: center;top:0;left: 0;z-index: 1001;}
  .wxCons{width: 80%;background: linear-gradient(to right,#ffa264,#ffa86f,#ffaf7d,#ffb383);border-radius: 0.1rem;padding: 0.6rem 0.4rem;position: relative;}
  .closeZzc{position: absolute;right: 0.2rem;top:0.2rem;font-size: 0.4rem;color: #000;}
  .wxConsTop{display: flex;align-items: center;margin-bottom: 0.6rem;}
  .wxConsTopImg{width: 1rem;height: 1rem;overflow: hidden;margin-right: 0.2rem;}
  .wxConsTopImg img{width: 100%;}
  .wxConsTopTxt{width: calc(100% - 1.6rem);}
  .wxConsTopTxt h1{font-size: 0.32rem;color: #000;margin-bottom: 0.2rem;font-weight: bold;}
  .wxConsTopTxt p{font-size: 0.26rem;color: #666;}
  .wxConsMid{font-size: 0.26rem;color: #999;margin: 0.2rem 0;line-height: 0.32rem;}
  .wxConsBottom{text-align: center;}
  .wxConsBottom img{width: 4rem;}

  .index{padding-bottom: 1.2rem;}
  .looper img{width: 100%;}
  .loopImg_slide{display: flex;align-items: center;}
  .ways_money{padding: 0.26rem 0.26rem 0.1rem 0.26rem;background: #fff;box-shadow: 0 10px 10px #fff;}
  .Fir_title{display: flex;align-items: center;}
  .Fir_title_link{justify-content: space-between;margin-bottom: 0.2rem;}
  .Fir_title_left{display: flex;align-items: center;}
  .Fir_title_right{font-size: 0.26rem;color: #999;}
  .Fir_title img{height: 0.36rem;margin-left: 0.16rem;}
  .redLine{height: 0.3rem;width: 0.08rem;border-radius: 0.2rem;background: #fcc270;}
  .title{font-size: 0.3rem;padding-left: 0.2rem;color: #333;font-weight: 700;}
  .ways_money_ul{display: flex;justify-content: space-between;margin-top: 0.46rem;margin-bottom: 0.6rem;}
  .ways_money_ul li{width: 48%;display: flex;align-items: center;justify-content: center;padding: 0.4rem 0;border-radius: 0.12rem;background: rgba(249, 229, 155,0.2);}
  .ways_money_ul li img{height: 0.66rem;margin-right: 0.2rem;}
  .ways_money_ul li h1{font-size: 0.3rem;color: #000;}
  .ways_money_ul li p{font-size: 0.24rem;color: #999;margin-top: 0.12rem;}

  .index{background: #f2f2f2 0 0/100% 100% no-repeat;}
  .aboutDl{display: flex;justify-content: space-around;align-items: center;margin-top: 0.2rem;}
  .aboutDl img{width: 1.4rem;}
  .news{display: flex;justify-content: space-between;border: 1px solid #ffd293 ;border-radius: 1rem;padding: 0.1rem 0.2rem;margin: 0.4rem 0;}
  .news_left{display: flex;align-items: center;width: 100%;}
  .news_left img{margin-right: 0.2rem;height: 0.28rem;}
  .news_left p{font-size: 0.24rem;color: #333 ;display: -webkit-box;-webkit-line-clamp:1;-webkit-box-pack:center;overflow: hidden;height: 0.3rem;overflow: hidden;line-height: 0.3rem;}
  .news_right{display: flex;align-items: center;font-size: 0.24rem;color: #f05a49 ;}
  .news_right span{display: inline-block;width: 0.4rem;height: 0.4rem;border-radius: 50%;background: #f05a49 ;color: #fff;text-align: center;line-height: 0.4rem;margin-left: 0.08rem;}
  .today_tj{padding: 0.2rem 0.2rem 0 0.2rem;}
  .prodct_item{margin-bottom: 0.2rem;background:hsl(47, 90%, 96%);box-shadow: 0 0 1.2rem 0.04rem #ececec;border-radius: 0.05rem;padding: 0.2rem;}
  .prodct_item_up{display: flex;align-items: center;margin-bottom: 0.2rem;}
  .prodct_img{width: 0.8rem;height: 0.8rem;border-radius: 4px;overflow: hidden;margin-right: 0.1rem;border-radius: 50%;}
  .prodct_img img{float:left;width: 100%;}
  .prodct_name{font-size: 0.28rem;color: #000;margin-bottom: 0.2rem;}
  .prodct_sq{font-size: 0.26rem;color: #000;}
  .prodct_sq i{color: #ee7a04;}
  .prodct_item_down1{display: flex;justify-content: space-between;align-items: center;}
  .prodct_range h2{font-size: 0.4rem;color: #f1604e;font-weight: 700;margin-bottom: 0.2rem;padding-left:0.25rem;}
  .prodct_range p{font-size: 0.26rem;color: #967b66;padding-left:0.25rem;}
  .prodct_adv{text-align: right;max-width: 50%;}
  .prodct_adv>span{font-size: 0.26rem;color: #fff;background:linear-gradient(90deg,#f99e41,#ee7a04);border-radius: 1rem;text-overflow: ellipsis;
    display: -webkit-box;-webkit-line-clamp: 1;-webkit-box-pack: center;overflow: hidden;padding: 0.06rem 0.1rem;margin-bottom: 0.1rem;line-height: 0.4rem;height: 0.48rem;}
  .prodct_adv>div{display: flex;align-items: center;justify-content: flex-end;}
  .prodct_adv img{width: 0.4rem;margin-right: 0.1rem;}
  .prodct_adv div span{font-size: 0.26rem;color: #967b66;}
  .prodct_item_down2{display: flex;padding: 0.12rem 0.1rem;margin-top: 0.2rem;font-size: 0.26rem;color: #848484;line-height: 0.38rem;border-top: 1px solid #eee;}
  .common_ques{padding: 0.26rem;background: #fff;}
  .que_item{font-size: 0.26rem;color: #967b66;padding: 0.1rem 0.2rem;display: -webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:1;overflow: hidden;line-height: 0.4rem;}
  .que_item i{font-size: 0.3rem;color: #ccc;margin-right: 0.1rem;}
  .helpers{margin-top: 0.2rem;}
  .helper_container{margin-top: 0.4rem;}
  .helper_container img{width: 100%;}
  .profitShow{padding: 0.26rem;background: #fcc270;}
  .profitShow .redLine{background: #fff;}
  .profitShow .title{color: #fff;}
  .shop_profit{background: linear-gradient(58deg,#f2593a,#f35e88);border-radius: 1rem;padding:0.12rem 0.2rem;display: flex;justify-content: space-between;align-items: center;margin-top: 0.24rem;border-radius: .906666666666667rem;}
  .shop_profit_left{display: flex;align-items: center;}
  .shoper_img{width: 0.8rem;height: 0.8rem;border-radius: 50%;overflow: hidden;margin-right: 0.16rem;display: flex;-webkit-box-align: center;-ms-flex-align: center;align-items: center;}
  .shoper_img img{width: 100%;}
  .shoper_info1{display: flex;align-items: center;}
  .shoper_info1 p{font-size: 0.22rem;color: #fff;}
  .shoper_info1 span{padding: 0.06rem 0.1rem;border: 1px solid #ffff3e;margin-left: 0.2rem;font-size: 0.22rem;color: #ffff3e;border-radius: 0.1rem;}
  .shoper_info2{font-size: 0.22rem;color: #fff;margin: 0.12rem 0;}
  .shoper_info3{font-size: 0.22rem;color: #fff;}
  .shoper_info3 i{color: #ffff3e;}
  .shop_profit_right{padding:0.16rem 0.22rem;border-radius: 0.6rem;font-size: 0.26rem;color: #ffff3e;border: 1px solid #ffff3e;}
  .others_profit{margin-top: 0.4rem;}
  .other_item{display: flex;align-items: center;border-radius: 0.6rem;background: #ffd293;padding: 0.1rem 0.2rem;margin-bottom: 0.1rem;}
  .otherImg{width: 0.68rem;height: 0.68rem;border-radius: 50%;overflow: hidden;margin-right: 0.28rem;display: flex;align-items: center;}
  .otherImg img{width: 100%;}
  .otherInfos h1{font-size: 0.24rem;color: #fff;margin-bottom: 0.1rem;}
  .otherInfos p{font-size: 0.24rem;color: #fff;}
  .otherInfos p i{color: #f2593a;}
  .hoverBtns{position: fixed;right: 0;top:56%;}
  .hoverBtns>div{width: 1rem;height: 1rem;margin-bottom: 0.2rem;border-radius: 50%;background: rgba(249, 229, 155,0.5);display: flex;align-items: center;justify-content: center;}
  .hoverBtns>div>div{width: 0.9rem;height: 0.9rem;border-radius: 50%;background: #ffd293;display: flex;align-items: center;justify-content: center;}
  .hoverBtns div i{font-size: 0.6rem;color: #fff;}
  .Proname{float: left;font-size: .3rem;line-height: .2rem; color: #000;padding-right: .146666666666667rem;padding-top: .026666666666667rem;font-weight: 700;display: inline-block;}
  .item-header-label {float: left;padding-left: .133333333333333rem;padding-right: .133333333333333rem;font-size: .166666666666667rem;line-height: .466666666666667rem;color: #fff;background: #ceae9b 0 0/100% 100% no-repeat;border-radius: .053333333333333rem;margin-right: .093333333333333rem;    margin-top: -0.1rem;display: inline-block;}
  .Setment {margin-right: .133333333333333rem;font-size: .25rem;color: #fff;background: linear-gradient(90deg,#f99e41,#ee7a04);border-radius: .106666666666667rem;text-align: center;padding: .12rem .186666666666667rem .093333333333333rem;}
</style>





