<template>
  <div class="login">

    <div class="head">
      <i class="iconfont icon-zuo" @click="goBack"></i>
      <h1>绑定手机号</h1>
      <i></i>
    </div>
    <div>
      <p class="msg-tip">注：为了保障你的手机号和微信号信息互通，请先绑定手机号。</p>
    </div>
    <form class="loginForm">
      <div class="phoDiv">
        <label>手机号码</label><br>
        <input type="tel" v-model="userInfo.telNum" placeholder="请输入手机号码" class="phoInput"/>
      </div>

      <div class="yzmDiv">
        <label>验证码</label><br>
        <div class="yzmDivInner">
          <input type="text" placeholder="请输入验证码" class="yzmInput" v-model="userInfo.code"/>

          <input type="button" value="获取验证码" class="getYzm" @click="SetCode()" v-if="!sendMsgDisabled"/>
          <label v-if="sendMsgDisabled">{{time+'秒后获取'}}</label>
        </div>
      </div>

      <button class="goUse"  type="button"
              @click="handleUserCommit()">确定</button>
    </form>

  </div>
</template>

<script type="text/ecmascript-6">
  import {selectTableInfoP,selectTableInfo} from '@/config/utils';
  import auth from '@/services/auth.js';
  import {Toast} from 'mint-ui';
  import axios from 'axios';
  export default{
    name: 'bindPho',
    data: function () {
      return {
        userInfo :{
          telNum:'',//手机号
          code:'',//验证码
        },
        msg:'',
        token:'',
        get_code:'',//手机验证码
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
        if(this.get_code === 200){
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
      //跳转的方法
      goOtherPage:function() {
        this.$router.push({path:'/'});
      },

      //判断用户输入
      handleUserCommit() {
        let reg=/^1(3|4|5|7|8|9)\d{9}$/;
        if(!reg.test(this.userInfo.telNum)){
          this.msg = '请输入正确的手机号码';
          Toast({message:this.msg,duration:1500});
          return false;
        }
        if(this.userInfo.code==''){
          this.msg = '验证码不能为空';
          Toast({message:this.msg,duration:1500});
          return false;
        }
        location.href = process.env.API_HOST+'/wx/bind-tel?tel=' + this.userInfo.telNum + '&code=' + this.userInfo.code;
      }
    },
    mounted: function() {

    }

  }
</script>

<style scoped>
  .login{width: 100%;height: 100%;background: #fff;}
  .logo{margin: 0 auto;text-align: center;}
  .logo img{width: 1.2rem;}
  .msg-tip{font-size: 0.28rem;padding: 0.3rem;line-height: 0.5rem;color:green}
  .loginForm{padding: 0 0.26rem;}
  .loginForm label{font-size: 0.26rem;color: #fcc270;}
  .loginForm input{border: none;background: #fff;font-size: 0.28rem;color: #666;}
  .phoDiv{border-bottom:1px solid #eee;padding: 0.2rem 0; }
  .yzmDiv{border-bottom:1px solid #eee;;}
  .phoInput{width: 100%;}
  .getYzm{text-align: center;}
  .yzmInput{width: 70%;padding-right: 0.2rem;border-right: 1px solid #ccc!important;}
  .yzmDivInner{display: flex;justify-content: space-between;align-items: center;padding: 0.2rem 0;}
  .noteDiv{font-size: 0.26rem;color: #999;margin-top: 0.4rem;display: flex;align-items: center;}
  .noteDiv i{font-size: 0.36rem;margin-right: 0.1rem;color: #999;}
  .noteDiv i.choosed{color: #fcc270;}
  .noteDiv span{color: #fcc270;}
  .goUse{width: calc(100% - 1rem);height: 0.8rem;background: linear-gradient(to right,#fcc270,#fcc270,#fcc270);
    font-size: 0.28rem;color: #fff;border-radius: 1rem;border: none;margin: 0.68rem auto 0 auto;display: block;}
  .goIndex{width: 100%;height: 0.8rem;border:1px solid #ccc;text-align: center;line-height: 0.8rem;
    font-size: 0.28rem;color: #999;border-radius: 1rem;margin-top: 0.4rem;}
</style>
