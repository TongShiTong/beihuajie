<template>
 <div class="setting">

   <div class="head">
      <i class="iconfont icon-zuo" @click="goBack"></i>
      <h1>设置</h1>
      <i></i>
   </div>
   <!--<div class="settingItem">-->
     <!--<p>开启消息推送</p>-->
     <!--<i class="iconfont icon-zuo-copy"></i>-->
   <!--</div>-->

   <!--<div class="settingItem">-->
     <!--<p>实名/绑定支付宝</p>-->
     <!--<i class="iconfont icon-zuo-copy"></i>-->
   <!--</div>-->

   <router-link tag="div" class="settingItem" to="/articleDetails?id=109">
     <p>关于我们</p>
     <i class="iconfont icon-zuo-copy"></i>
   </router-link>

   <div class="settingItem">
     <p>我的数字ID</p>
     <span>{{info.uid}}</span>
   </div>

   <div class="settingItem">
     <p>绑定的手机</p>
     <span>{{info.tel}}</span>
   </div>

   <router-link tag="div" class="settingItem" to="/updataMm">
     <p>修改密码</p>
     <i class="iconfont icon-zuo-copy"></i>
   </router-link>

   <div class="exitBtn">
     <input type="button" value="退出账户" @click="logoutFun" v-if="isNotWx">
   </div>
 </div>
</template>

<script>
 import {selectTableInfo} from '@/config/utils';
 import Auth from '@/services/auth.js';
 import {Toast} from 'mint-ui';
 import {goBack} from '@/../static/js/function.js';

  var info = {
    'uid':localStorage.getItem('member_id'),
    'tel':'15012341234'
  };
    export default{
      name: 'setting',
      data: function () {
        return {
          info:{},
          isNotWx: true,
        }
      },
       methods: {
         //获取用户信息
        async getDaitype(cid,type,apply) {

          let _memberInfo = await selectTableInfo('members/'+localStorage.getItem('member_id'));
          this.info = _memberInfo.data;
        },

        //退出账户
        logoutFun() {
          let _this = this;
          Toast({message:'退出成功',duration:1000});
          Auth.logout();
          setTimeout(function() {
            _this.$router.push('/login');
          },500);
        },
        //返回上一页
        goBack() {
          this.$router.go(-1);
        }
      },
      mounted: function() {
        let ua = window.navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i) == 'micromessenger'){
          this.isNotWx = false;
        }
        this.getDaitype();
    }

    }
</script>

<style scoped>
.setting{height: 100%;background: #fff;}
.settingItem{display: flex;align-items: center;justify-content: space-between;padding: 0.26rem;border-bottom: 1px solid #eee;}
.settingItem p{font-size: 0.28rem;color: #333;}
.settingItem i{font-size: 0.34rem;color: #ccc;}
.settingItem span{font-size: 0.3rem;color: #ccc;}
.exitBtn{text-align: center;margin-top: 1rem;}
.exitBtn input{width: 80%;background: #fcc270;border: none;border-radius: 1rem;color: #fff;font-size: 0.3rem;height: 0.8rem;}
</style>
