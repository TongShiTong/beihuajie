<template>
   <div class="guideClass">
      <div class="head">
          <i class="iconfont icon-zuo" @click="goBack"></i>
          <h1>{{guideCon.title}}</h1>
          <i></i>
      </div>
     <div v-html="guideCon.pay_html" class="guideCon">

     </div>
      <div class="buyArea">
      <div class="buyLeft">
        <div class="priceBox">
          <h1 class="true_price">￥{{guideCon.pay_money}}</h1>
          <h2 class="false_price">￥588</h2>
        </div>

        <P>
          <i class="iconfont icon-xuanzhong"
             :class="{choosed : isReadNote}"
             @click="agreeNoteFun"></i>

          我已阅读并同意<em @click="goNote()">《用户协议》</em>
        </P>
      </div>
      <div class="buyBtn" @click="buyDLClick">购买</div>
    </div>
   </div>
</template>

<script type="text/ecmascript-6">
  import {selectTableInfo} from '@/config/utils';
  import {Toast} from 'mint-ui';
    export default{
      name: 'guideClass',
      data: function () {
        return{
          guideCon:'',
          bannerId:'',
          token: '',
          isReadNote:true,//是否已经阅读用户协议
        }
      },
      methods: {
       //获取广告位详情
        async getClassDetails() {
          let acticleTxt = await selectTableInfo('banners/'+this.bannerId);
          this.guideCon = acticleTxt.data;
        },
        //返回上一页
        goBack() {
          this.$router.go(-1);
        },
        //是否同意用户协议
        agreeNoteFun: function () {
          this.isReadNote = !this.isReadNote;
        },
        buyDLClick() {
          if(!this.token){
            Toast({message: '请先登录',duration:1500});
            setTimeout(()=>{
              this.$router.push('/login');
            },1500);
            return;
          }
           if(this.guideCon.pay_money==0){
            Toast({message: '尽情期待',duration:1500});
            return;
          }
          if(!this.isReadNote){
            Toast({message:'请阅读并同意用户协议',duration:1500});
          }else{
          this.$router.push('/payOrder?area=2');
          }
        },
        //跳转到用户协议页面
        goNote: function () {
          this.$router.push({path:'/articleDetails',query:{id:197}});
        },
      },
      mounted: function(){
        this.bannerId = this.$route.query.id;//获取传过来的参数
        this.token = localStorage.getItem('tk');
        this.getClassDetails();
      }
    }
</script>

<style scoped>
.head{background: #fff;}
.head h1{font-weight: 500;font-size: 0.36rem;}
.guideClass{padding-bottom: 2rem;overflow: hidden;}
.guideCon{font-size: 0.26rem;line-height: 0.34rem;color: #333;overflow: hidden;}
.guideCon >>>img{max-width: 100%!important;height: auto;}
.buyArea{position: fixed;width: 100%;height: 1rem;bottom: 0;left: 0;background: #fef5e7;display: flex;align-items: center;justify-content: space-between;}
.buyBtn{width: 2.6rem;background: linear-gradient(to right,#ff8f05,#ff9c13);font-size: 0.3rem;color: #fff;text-align: center;line-height: 1rem;}
.buyLeft{padding-left: 0.2rem;}
.buyLeft h1{font-size: 0.36rem;color: #ff523a;font-weight: 600;}
.buyLeft p{font-size: 0.26rem;color: #666;}
i.choosed{color: #ff523a;}
.priceBox{display: flex;align-items: center;margin-bottom: 0.12rem;}
.false_price{text-decoration: line-through;font-size: 0.28rem;color: #666;margin-left: 0.1rem;}
</style>
