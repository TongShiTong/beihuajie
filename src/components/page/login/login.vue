<template>
  <div class="login">

    <div class="logo">
      <img :src="logo_img">
    </div>

    <form class="loginForm">
      <div class="phoDiv">
        <label>手机号码</label><br>
        <input type="tel" v-model="userInfo.telNum" placeholder="请输入手机号码" class="phoInput"/>
      </div>

      <div class="yzmDiv" v-if="loginWay == 0">
        <label>验证码</label><br>
        <div class="yzmDivInner">
          <input type="text" placeholder="请输入验证码" class="yzmInput" v-model="userInfo.code"/>

          <input type="button" value="获取验证码" class="getYzm" @click="SetCode()" v-if="!sendMsgDisabled"/>
          <label v-if="sendMsgDisabled">{{time+'秒后获取'}}</label>
        </div>
      </div>

      <div class="phoDiv" v-if="loginWay == 0">
        <label>密码</label><br>
        <input type="password" v-model="userInfo.psw" placeholder="请输入密码" class="phoInput"/>
      </div>

      <div class="phoDiv" v-if="loginWay == 1">
        <label>密码</label><br>
        <input type="password" v-model="userInfo.psw" placeholder="请输入密码" class="phoInput"/>
      </div>

      <div class="tip" v-if="loginWay == 1">
         <router-link to="/updataMm" tag="div">忘记密码</router-link>
         <div @click="switchLoginWay(0)">没有账号?<em>立即注册</em></div>
      </div>

      <div class="noteDiv" v-if="loginWay == 0">
        <i class="iconfont icon-xuanzhong"
           :class="{choosed : isReadNote}"
           @click="agreeNoteFun"></i>我已阅读并同意
        <span @click="goNote">《用户服务协议》</span>
      </div>

      <button class="goUse"  type="button"
              @click="handleUserCommit()" v-if="loginWay == 0">立即注册</button>

        <button class="goUse"  type="button"
              @click="handleUserCommitPass()" v-else>开始使用</button>

      <div class="goIndex" v-if="loginWay == 0" @click="switchLoginWay(1)">返回登录</div>

      <router-link  to="/" tag="div" class="goIndex" v-if="loginWay == 1">返回首页</router-link>
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
          psw:'',//登录密码
        },
        msg:'',
        token:'',
        logo_img:'',//logo图片
        get_code:'',//手机验证码状态
        time: 60, // 发送验证码倒计时
        sendMsgDisabled: false,
        isReadNote:true,//是否已经阅读用户协议
        loginWay:1,//0->快捷登录 1->密码登录
      }
    },
    methods: {

      //判断用户登录
      async handleUserInfo() {

      },
      //切换登录方式
      switchLoginWay(way) {
        this.loginWay = way;
      },
      //获取页面logo
      async getLogoImg() {
        let _logo = await selectTableInfo('systems/21');
        this.logo_img = process.env.API_HOST+_logo.data.content;
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
      //跳转到用户协议页面
      goNote: function () {
         this.$router.push({path:'/articleDetails',query:{id:110}});
      },
      //是否同意用户协议
      agreeNoteFun: function () {
         this.isReadNote = !this.isReadNote;
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
          this.msg = '请输入验证码';
          Toast({message:this.msg,duration:1500});
          return false;
        }
        if(this.userInfo.psw==''){
          this.msg = '请输入登陆密码';
          Toast({message:this.msg,duration:1500});
          return false;
        }
        let param = {
            tel:this.userInfo.telNum,
            code:this.userInfo.code,
            password:this.userInfo.psw,
          };
        if(!this.isReadNote){
          Toast({message:"您还没同意用户协议哦~",duration:1500});
        }else{
          axios({
            method:'post',
            url:process.env.API_HOST+'api.php/auths/signup',
            data:param,
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            transformRequest: function(obj) {
             //obj返回的是一个手机号
              var str = [];
              for(var p in obj){
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
              }

              return str.join("&"); //tel=15051835807

            }
          }).then((result)=>{
//            console.log(result);//tokne +  member_id
            if(result.data.status==200){
              this.msg =  result.data.msg;
              if(this.msg != undefined && this.msg != ''){
                Toast(this.msg);//作出提示
              }
              this.token = result.data.result.accessToken;
              localStorage.setItem('member_id',result.data.result.member_id); //将用户id存储
              auth.login(this.token);
              this.goOtherPage();
            }else{
              Toast(result.data.msg);//作出提示
            }
            

           

          });
        }
        //let result  = await selectTableInfoP('auths/login',param);

        //this.handleUserInfo();

      },
       //密码登陆
      async handleUserCommitPass(){
        let reg=/^1(3|4|5|7|8|9)\d{9}$/;
        if(!reg.test(this.userInfo.telNum)){
          this.msg = '请输入正确的手机号码';
          Toast({message:this.msg,duration:1500});
          return false;
        }
        if(this.userInfo.psw==''){
          this.msg = '请输入登陆密码';
          Toast({message:this.msg,duration:1500});
          return false;
        }
        if(!this.isReadNote){
          Toast({message:"您还没同意用户协议哦~",duration:1500});
          return false;
        }
        let param={
          tel:this.userInfo.telNum,
          password:this.userInfo.psw,
        };
        let _result=await selectTableInfoP('auths/login',param);
          if(_result.data.msg!= undefined &&  _result.data.msg != ''){
            Toast(_result.data.msg);//作出提示
          }
          this.token = _result.data.result.accessToken;
          localStorage.setItem('member_id',_result.data.result.member_id); //将用户id存储
          auth.login(this.token);
          this.goOtherPage();
      }
    },
    mounted: function() {
      this.getLogoImg();
    }

  }
</script>

<style scoped>
  .tip{font-size: 0.26rem;color: #999;padding:0.4rem 0;display: flex;justify-content: space-between;align-items: center;}
  .tip em{color: #fcc270;}
  .switchWay{display: flex;align-items: center;padding: 0.4rem 0.4rem 1rem 0.4rem;}
  .switchWay p{font-size: 0.3rem;color: #333;margin-right: 0.4rem;padding-bottom: 0.2rem;border-bottom: 2px solid transparent;}
  .switchWay p.on{border-bottom: 2px solid #fcc270;color: #fcc270;}
  .login{width: 100%;height: 100%;background: #fff;padding-top: 1.2rem;}
  .logo{margin: 0 auto;text-align: center;}
  .logo img{width: 1.2rem;}
  .loginForm{margin-top: 0.8rem;padding: 0 1rem;}
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
  .goUse{width: 100%;height: 0.8rem;background: linear-gradient(to right,#fcc270,#fcc270,#fcc270);
    font-size: 0.28rem;color: #fff;border-radius: 1rem;border: none;margin-top: 0.68rem;}
  .goIndex{width: 100%;height: 0.8rem;border:1px solid #ccc;text-align: center;line-height: 0.8rem;
    font-size: 0.28rem;color: #999;border-radius: 1rem;margin-top: 0.4rem;}
</style>
