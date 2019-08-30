<template>
  <div class="buyVip">

    <div class="head">
      <i class="iconfont icon-zuo" @click="goBack"></i>
      <h1>购买会员</h1>
      <i></i>
    </div>

    <div class="imgBox">
      <img src="/static/images/vip/vip01.png">
      <img src="/static/images/vip/vip02.png">
      <img src="/static/images/vip/vip03.png">
      <img src="/static/images/vip/vip04.png">
      <img src="/static/images/vip/vip05.png">

    </div>

    <div class="buyArea">
      <div class="buyLeft">
        <div class="priceBox">
          <h1 class="true_price">￥{{price}}</h1>
          <h2 class="false_price">￥588</h2>
        </div>

        <P>
          <i class="iconfont icon-xuanzhong"
             :class="{choosed : isReadNote}"
             @click="agreeNoteFun"></i>

          我已阅读并同意<em @click="goNote()">《用户协议》</em>
        </P>
      </div>
      <div class="buyBtn" @click="buyDLClick">成为代理</div>
    </div>
</div>
</template>

<script>
  import {selectTableInfo} from '@/config/utils';
  import Auth from '@/services/auth.js';
  import {Toast} from 'mint-ui';
  import {goBack} from '@/../static/js/function.js';
  import axios from 'axios';

  var info = {
    'uid':localStorage.getItem('member_id'),
    'tel':'15012341234'
  };
  export default{
    name: 'vip',
    data: function () {
      return {
        info:{},
        token: '',
        price: '',
        isReadNote:true,//是否已经阅读用户协议
      }
    },
    methods: {
      //获取用户信息
      async getDaitype(cid,type,apply) {

        let _memberInfo = await selectTableInfo('members/'+localStorage.getItem('member_id'));
        this.info = _memberInfo.data;
      },
      //跳转到用户协议页面
      goNote: function () {
        this.$router.push({path:'/articleDetails',query:{id:110}});
      },
      //是否同意用户协议
      agreeNoteFun: function () {
        this.isReadNote = !this.isReadNote;
      },
      //返回上一页
      goBack() {
        this.$router.go(-1);
      },
      buyDLClick() {
        if(!this.token){
          Toast({message: '请先登录',duration:1500});
          setTimeout(()=>{
            this.$router.push('/login');
          },1500);
          return;
        }
        if(!this.isReadNote){
          Toast({message:'请阅读并同意用户协议',duration:1500});
        }else{
         this.$router.push('/payOrder');
        }
      }
  },
  mounted: function() {
    this.getDaitype();
    this.token = localStorage.getItem('tk');
    axios({
      method:'post',
      url:process.env.API_HOST+'api.php/grades/get-grade',
      data:{id: 2},
      headers:{'Content-Type': 'application/x-www-form-urlencoded'},
      transformRequest: function(obj) {
        var str = [];
        for(var p in obj){
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
        return str.join("&");
      }
    }).then((result)=>{
      let data = result.data;
      this.price = data.price;
    });
  }
  }
</script>

<style scoped>
  .imgBox{margin-bottom: 1.2rem;}
  .imgBox img{width: 100%;vertical-align: top;}
  .buyArea{position: fixed;width: 100%;height: 1rem;bottom: 0;left: 0;background: #fef5e7;display: flex;align-items: center;justify-content: space-between;}
  .buyBtn{width: 2.6rem;background: linear-gradient(to right,#ff8f05,#ff9c13);font-size: 0.3rem;color: #fff;text-align: center;line-height: 1rem;}
  .buyLeft{padding-left: 0.2rem;}
  .buyLeft h1{font-size: 0.36rem;color: #ff523a;font-weight: 600;}
  .buyLeft p{font-size: 0.26rem;color: #666;}
  i.choosed{color: #ff523a;}
  .priceBox{display: flex;align-items: center;margin-bottom: 0.12rem;}
  .false_price{text-decoration: line-through;font-size: 0.28rem;color: #666;margin-left: 0.1rem;}
</style>
