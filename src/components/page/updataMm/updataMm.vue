<template>
  <div class="updataMm">
    <div class="head">
      <i class="iconfont icon-zuo" @click="goBack"></i>
      <h1>修改密码</h1>
      <i></i>
    </div>

    <div class="updataMain">
      <div class="updataItem commonDiv">
        <label>手机号码</label>
        <input type="tel" placeholder="请输入手机号码" v-model="userInfo.telNum"/>
      </div>

      <div class="updataItem yzmItem">
        <div class="commonDiv">
          <label>验证码</label>
          <input type="text" placeholder="请输入验证码" v-model="userInfo.code"/>
        </div>
        <input type="button" value="获取验证码" class="getYzm" @click="SetCode()" v-if="!sendMsgDisabled"/>
        <label v-if="sendMsgDisabled">{{time+'秒后获取'}}</label>
      </div>

      <div class="updataItem commonDiv">
        <label>新密码</label>
        <input type="password" placeholder="请输入新密码" v-model="userInfo.psw"/>
      </div>
    </div>

    <button class="updataBtn" @click="updataPass()">确认修改</button>
  </div>
</template>

<script>
 import {selectTableInfo,selectTableInfoP} from '@/config/utils';
 import {Toast} from 'mint-ui';
  export default{
    name:'updataMm',
    data: function () {
      return {
          userInfo :{
            telNum:'',//手机号
            code:'',//验证码
            psw:'',//登录密码
          },
          time: 60, // 发送验证码倒计时
          sendMsgDisabled: false,
      }
    },
    methods: {
      //返回上一页
      goBack() {
        this.$router.go(-1);
      },
      //点击获取手机验证码
      async SetCode() {
        let reg=/^1(3|4|5|7|8|9)\d{9}$/;
        if(!reg.test(this.userInfo.telNum)){
          this.msg = '请输入正确的手机号码';
          Toast(this.msg);
          return false;
        }
        let param = {tel:this.userInfo.telNum};
        let _code = await selectTableInfo('systems/set-code',param);
        this.get_code = _code.data.status;
        if(this.get_code==200){
          this.msg = '已发送,请在手机查看';
          Toast(this.msg);
          //倒计时
          let me = this;
          me.sendMsgDisabled = true;
          let interval = window.setInterval(function() {
            if ((me.time--) <= 0) {
              me.time = 60;
              me.sendMsgDisabled = false;
              window.clearInterval(interval);
            }
          }, 1000);
        }

        return true;
      },
        //点击确认修改
      async updataPass(){
        let reg=/^1(3|4|5|7|8|9)\d{9}$/;//手机号码正则
        if(!reg.test(this.userInfo.telNum)){
          this.msg = '请输入正确的手机号码';
          Toast(this.msg);
          return false;
        }
        if(this.userInfo.code==''){
          this.msg = '请输入验证码';
          Toast({message:this.msg,duration:1500});
          return false;
        }
        if(this.userInfo.psw==''){
          this.msg = '请输入您的新密码';
          Toast({message:this.msg,duration:1500});
          return false;
        }
        let param = {
          tel:this.userInfo.telNum,
          code:this.userInfo.code,
          password:this.userInfo.psw,
        };
        let _pass=await selectTableInfoP('auths/uppass',param);
        Toast({message:_pass.data.msg,duration:1500});   
        if(localStorage.getItem('member_id')==''){
           this.$router.push({path:'/login'});
        }   
      }
    }
  }
</script>

<style scoped>
  .updataMm{background: #fff;height: 100%;}
  .updataMain{padding: 0.26rem 0.4rem;}
  .updataItem input{background: none;}
  .commonDiv{display: flex;align-items: center;}
  .commonDiv input{border: none;}
  .getYzm{padding-left: 0.2rem;border-left: 1px solid #ccc;}
  .yzmItem{justify-content: space-between;}
  .updataMain label{font-size: 0.26rem;color: #333;display: inline-block;width: 1.4rem;}
  .updataItem{display: flex;align-items: center;padding: 0.26rem 0;border-bottom: 1px solid #eee;}
  .updataBtn{width:calc(100% - 1rem); height: 0.8rem;background: #fcc270;font-size: 0.28rem;color: #fff;border-radius: 1rem;border: none;margin: 0.68rem auto 0 auto;display: block;}
</style>
