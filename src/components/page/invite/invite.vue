<template>
  <div class="login">


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
       <div class="phoDiv" >
        <label>密码</label><br>
        <input type="password" v-model="userInfo.psw" placeholder="请输入密码" class="phoInput"/>
      </div>

      <div class="noteDiv">
        <i class="iconfont icon-xuanzhong"
           :class="{choosed : isReadNote}"
           @click="agreeNoteFun"></i>我已阅读并同意
        <span @click="goNote">《用户服务协议》</span>
      </div>

      <button class="goUse"  type="button"
              @click="handleUserCommit()">开始使用</button>
    </form>

  </div>
</template>

<script type="text/ecmascript-6">
  import {selectTableInfoP,selectTableInfo} from '@/config/utils';
  import auth from '@/services/auth.js';
  import {Toast} from 'mint-ui';
  import axios from 'axios';
  export default{
    name: 'login',
    data: function () {
      return {
        userInfo :{
          telNum:'',//手机号
          code:'',//验证码
        },
        uid: '',
        msg:'',
        token:'',
        logo_img:'',//logo图片
        get_code:'',//手机验证码状态
        time: 60, // 发送验证码倒计时
        sendMsgDisabled: false,
        isReadNote:true,//是否已经阅读用户协议
      }
    },
    methods: {
      //跳转到用户协议页面
      goNote: function () {
        this.$router.push({path:'/articleDetails',query:{id:110}});
      },
      //是否同意用户协议
      agreeNoteFun: function () {
        this.isReadNote = !this.isReadNote;
      },
      //判断用户登录
      async handleUserInfo() {

      },
      //获取页面logo
      async getLogoImg() {
        let _logo = await selectTableInfo('systems/21');
        this.logo_img = _logo.data;
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
      //跳转的方法
      goOtherPage:function() {
        this.$router.push({path:'/'});
      },
      //判断用户输入
      handleUserCommit() {
        let reg=/^1(3|4|5|7|8|9)\d{9}$/;
        if(!reg.test(this.userInfo.telNum)){
          this.msg = '请输入正确的手机号码';
          Toast(this.msg);
          return false;
        }
        if(this.userInfo.code==''){
          this.msg = '请输入验证码';
          Toast(this.msg);
          return false;
        }
        if(this.userInfo.psw==''){
          this.msg = '请输入登陆密码';
          Toast({message:this.msg,duration:1500});
          return false;
        }
        let param = {tel:this.userInfo.telNum,uid: this.uid,code:this.userInfo.code,password:this.userInfo.psw};
        //let result  = await selectTableInfoP('auths/login',param);
        axios({
          method:'post',
          url:process.env.API_HOST+'api.php/auths/invite-sign-up',
          data:param,
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
          if(data.status === 100){ //不满足邀请的权限
            Toast({message: data.msg,duration: 2000});
            return;
          }else if(data.status === 101){//注册过后的用户跳转登陆页面
            Toast({message: data.msg,duration: 2000});
            this.$router.push({path:'/login'});
            return;
          }
          this.msg =  result.data.msg;
          Toast(this.msg)
          this.token = result.data.result.accessToken;
          localStorage.setItem('member_id',result.data.result.member_id); //将图片保存，并能够在其他地方加载显示
          auth.login(this.token);
          this.goOtherPage();
        });
        //this.handleUserInfo();

      }
    },
    mounted: function() {
      this.getLogoImg();
      this.uid = this.$route.query.uid;
    }

  }
</script>

<style scoped>
  .login{width: 100%;height: 100%;background: url("/static/images/me/Bginvite.png") no-repeat;background-size:100% 100%;padding-top: 3.4rem;}
  .logo{margin: 0 auto;text-align: center;}
  .logo img{width: 1.2rem;}
  .loginForm{margin-top: 0.8rem;padding: 0 1rem;}
  .loginForm label{font-size: 0.26rem;color: #fff;}
  .loginForm input{border: none;background: transparent;font-size: 0.28rem;color: #fff;}
  .phoDiv{border-bottom:1px solid #eee;padding: 0.2rem 0; }
  .yzmDiv{border-bottom:1px solid #eee;;}
  .phoInput{width: 100%;}
  .getYzm{text-align: center;}
  .yzmInput{width: 70%;padding-right: 0.2rem;border-right: 1px solid #ccc!important;}
  .yzmDivInner{display: flex;justify-content: space-between;align-items: center;padding: 0.2rem 0;}
  .noteDiv{font-size: 0.26rem;color: #eee;margin-top: 0.4rem;display: flex;align-items: center;}
  .noteDiv i{font-size: 0.36rem;margin-right: 0.1rem;color: #999;}
  .noteDiv i.choosed{color: #fff;}
  .noteDiv span{color: #fff;}
  .goUse{width: 100%;height: 0.8rem;background: linear-gradient(to right,#f05a49,#f25150,#ff2b70,#ff2b71);font-size: 0.28rem;color: #fff;border-radius: 1rem;border: none;margin-top: 0.68rem;}
</style>
