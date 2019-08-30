<template>
<div class="payOrder">
  <div class="head">
    <i class="iconfont icon-zuo" @click="goBack"></i>
    <h1>支付订单</h1>
    <i></i>
  </div>

  <h1 class="title">订单详情</h1>
  <ul class="orderInfo">
    <li>
       <h1>商品名称</h1>
       <p>{{siteName}} {{gradeName}}</p>
    </li>

    <li>
      <h1>订单编号</h1>
      <p>{{orderNo}}</p>
    </li>

    <li>
      <h1>商家名称</h1>
      <p>{{siteName}}</p>
    </li>

    <li>
      <h1>商品价格</h1>
      <p>￥ {{price}} 元</p>
    </li>
  </ul>

  <h1 class="title">选择支付方式</h1>
  <ul class="payWay">
    <li @click="choosePayWay(item.id)" v-for="(item) in pays">
      <div>
        <img src="/static/images/vip/zfb.png" v-if="item.id == 1 && !wxShow">
        <img src="/static/images/vip/wx.png" v-else-if="item.id == 2 && wxShow">
        <div class="payTxt" v-if="item.id == 1 && !wxShow">
          {{item.pay_name}}
        </div>
         <div class="payTxt" v-else-if="item.id == 2 && wxShow">
          {{item.pay_name}}
        </div>
      </div>
      <i class="iconfont"
         :class="{'icon-xuanzhong1':item.id == curPay , 'icon-xuanzhong2':item.id != curPay}" v-if="item.id == 1 && !wxShow"></i>
         <i class="iconfont"
         :class="{'icon-xuanzhong1':item.id == curPay , 'icon-xuanzhong2':item.id != curPay}" v-else-if="item.id == 2 && wxShow"></i>
    </li>
  </ul>

  <div class="buyBtn" @click="submit()">确认支付</div>

</div>
</template>

<script>
  import axios from 'axios';
  import {Toast} from 'mint-ui';
    export default{
      name: 'payOrder',
      data: function () {
        return {
          token: '',
          application_area:0,//申请专区标示 0非  1 是  默认是0
          siteName: '',
          price: '',
          gradeName: '',
          orderNo: '',
          pays: [],
          curPay:1,
          wxShow:false,//微信支付开关
        }
      },
      methods: {
        //返回上一页
        goBack() {
          this.$router.go(-1);
        },
        choosePayWay(index) {
          this.curPay = index;
        },
        submit() {
          location.href = process.env.API_HOST+'pay/index?type=' + this.curPay + '&order_no=' + this.orderNo + '&apply='+ this.application_area ;
        }
      },
      mounted: function () {
        if(this.$route.query.area!='' && this.$route.query.area != undefined){
          this.application_area = this.$route.query.area;//说明是从申请专区来的  非会员来源
        }
        this.token = localStorage.getItem('tk');
        axios({
          method:'post',
          url:process.env.API_HOST+'api.php/buy-agents/get-order',
          data:{token: this.token,apply:this.application_area},
          headers:{'Content-Type': 'application/x-www-form-urlencoded'},
          transformRequest: function(obj) {
            var str = [];
            for(var p in obj){
              str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
            return str.join("&");
          }
        }).then((result)=>{
          let res = result.data;
          if(res.status === 200){
            this.siteName = res.data.siteName;
            this.orderNo = res.data.orderNo;
            this.price = res.data.grade.price;
            this.gradeName = res.data.grade.grade_name;
            this.pays = res.data.pays;
          }else if(res.status === 400){
           Toast({message: data.msg,duration: 2000});
            this.$router.push({path:'/login'});
            return;
          }else{
            Toast({message: res.msg});
          }
        });
         let ua = window.navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i) == 'micromessenger'){
          this.wxShow=true;
          this.curPay=2;
        }
      }
    }
</script>

<style scoped>
.head{background: #fff;}
  .title{padding: 0.26rem;font-size: 0.3rem;color: #666;}
  .orderInfo{background: #fff;padding: 0.26rem;}
  .orderInfo li{display: flex;align-items: center;justify-content: space-between;padding: 0.26rem 0;border-bottom: 1px solid #eee;}
  .orderInfo li:last-child{border-bottom: none;}
  .orderInfo li h1{font-size: 0.28rem;color: #666;}
  .orderInfo li p{font-size: 0.28rem;color: #999;}
  .payWay{background: #fff;padding:0 0.26rem;}
  .payWay li{display: flex;justify-content: space-between;align-items: center;padding: 0.2rem 0;border-bottom: 1px solid #eee;}
  .payWay li>div{display: flex;align-items: center;}
  .payWay li img{width: 0.68rem;}
  .payTxt{font-size: 0.3rem;color: #333;margin-left: 0.2rem;}
  .payWay li i{font-size: 0.4rem;font-weight: bold;}
  .buyBtn{width: calc(100% - 0.52rem);margin: 0.6rem auto 0 auto;background: #fcc270;text-align: center;color: #fff;height: 0.88rem;line-height:0.88rem;
  font-size: 0.34rem;}
</style>
