<template>
<div class="idcard">
    <div class="head">
      <i class="iconfont icon-zuo" @click="goBack"></i>
      <h1>身份证认证</h1>
      <i></i>
    </div>
    <div class="idform">
        <form class="infoForm">

            <div>
              <label>姓名</label><br>
              <input type="text" placeholder="请输入您的姓名" v-model="mansInfo.name"/>
            </div>

            <div>
              <label>身份证号</label><br>
              <input type="text" placeholder="请输入您的身份证号" v-model="mansInfo.idcard"/>
            </div>
            
            <input type="button"
                   value="提交"
                   @click="handleApply()"/>
          </form>
    </div>
    <div style="display:none;">
    <div ref="before" class="before">
      <h2>尊敬的您目前是信贷经理享受信贷经理权益可通过如下方式升级晋升，加油哦！</h2>
      <p>条件1：</p>
      <p>累计分享x个好友成功认证，升级团队经理</p>
      <p>累计分享y个好友成功认证，升级城市经理</p>
      <p>成功认证：新增直推好友完成并通过信贷经理身份认证。</p>
      <p class="p1">条件2：</p>
      <p>累计推广a单有效产品订单，升级团队经理</p>
      <p>累计推广b单有效产品订单，升级城市经理</p>
      <p>有效订单：直推新户首次申请产品通过审核或下款，并获的佣金。</p>
      <p class="p1">完成以上任意一条件即可晋级对应层级。</p>
    </div>
     </div>
</div>
</template>

<script>
  import {selectTableInfo} from '@/config/utils';
  import {goBack} from '@/../static/js/function.js';
  import axios from 'axios';
  import {Toast,Indicator} from 'mint-ui';

  export default{
    name: 'idCard',
    data: function () {
      return {
          mansInfo:{
              name:'',
              idcard:''
          }
      }
    },
    methods: {

      //返回上一页
      goBack() {
        this.$router.go(-1);
      },
      //提交用户信息
      handleApply: function () {
        // this.getDeviceInfo();//设备类型
        // this.getCurIpInfo();//用户ip
        let nameReg = /^[\u4E00-\u9FA5A-Za-z]{2,10}$/;//姓名的正则
        let idCardReg = /^[1-9]\d{16}[0-9Xx]$/;//身份证号的正则
        let param = {};
        if(!nameReg.test(this.mansInfo.name) || !this.mansInfo.name){
          Toast({message:"请输入正确的姓名",duration: 1500});
        }else if(!idCardReg.test(this.mansInfo.idcard)){
          Toast({message:"请输入正确的身份证号",duration: 1500});
        }else{
          param = {
            mid:localStorage.getItem('member_id'),
            realname:this.mansInfo.name,
            idcard:this.mansInfo.idcard,
          };
          this.authEntication(param)
        //   this.getMansInfo(param);
        }

      },
      async authEntication(param) {
        let info= await selectTableInfo('members/verified',param);
        if(info.data.status==200) {
          Toast({message:"您已成为信贷经理 现在可以去推广产品了",duration: 1500});
          setTimeout(()=>{
            let _this = this;
            let before = _this.$refs.before.innerHTML
            _this.$layer.dialog({
              title: ['推广前必读', 'fontSize:0.4rem;background:red;'],
              content: before,
              contentClass: 'className',
              btn: ['信贷经理权益','已阅读，确定推广'],
              time: 30000
            })
            // 如果有btn
            .then(function (res){
              // res为0时是用户点击了左边  为1时用户点击了右边
              let position = res === 0 ? 'left' : 'right';
              if(res == 0){
                _this.$router.push('/guideClass');
              }else{
                // _this.$router.push('/vip');
                _this.$router.push('/product');
              }

            });
          },1500)
          
        }
      },
  },
  mounted: function() {
  
  }
}
</script>
<style scoped>
.before h2 {font-size: 0.3rem; text-align: center;line-height: 1.5em;padding-bottom: 0.5rem}
.before p {font-size: 0.26rem;color: #666;margin-left: 0.2rem;line-height: 2em;}
.before .p1 {margin-top: .5rem; padding-top: .5rem;}
.idcard {background: #fff}
.idform{width: 6rem; margin: 1rem auto;padding-bottom: 1rem}
.infoForm>h1{font-size: 0.28rem;color: #333;text-align: center;border-bottom: 1px dashed #eee;padding-bottom: 0.4rem;}
.infoForm label{font-size: 0.26rem;color:#fd326b; }
.infoForm div input{border: none;border-bottom: 1px solid #eee;font-size: 0.28rem;color: #333;padding-bottom: 0.2rem;width: 100%;}
.infoForm>input{display: block;width: 3.6rem;height: 0.8rem;background: linear-gradient(90deg,#f2544e,#fd326b);border-radius: 0.5rem;color: #fff;margin:0.4rem auto 0.2rem auto;}
</style>