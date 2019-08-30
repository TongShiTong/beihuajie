<template>
   <div class="bindAccount">
      <div class="head">
          <i class="iconfont icon-zuo" @click="goBack"></i>
          <h1>绑定支付宝</h1>
          <i></i>
      </div>

    <div class="accountMain">
        <div class="accountInfo">
            <div>
                <label>收款账户</label>
                <input type="text" placeholder="请输入您的收款账户" v-model="accountInfo.accountNum"/>
            </div>

            <div>
                <label>账户用户名</label>
                <input type="text" placeholder="请输入您的账户用户名" v-model="accountInfo.accountName"/>
            </div>
        </div>
        
        <p class="note">此账号为收款账号，默认填写支付宝账号和姓名，请认真填写</p>
        <div class="bindBtn" @click="handleBind()">确定</div>
    </div>
      
   </div>
</template>

<script>
  import {selectTableInfo} from '@/config/utils';
  import axios from 'axios';
  import Auth from '@/services/auth.js';
  import {Toast} from 'mint-ui';
  import {goBack} from '@/../static/js/function.js';

  export default {
    name: 'bindAccount',
    data: function () {
      return {
        accountInfo: {
          accountNum: '',
          accountName: '',
        },
        token: '',
      }
    },
    methods: {
      //点击确定按钮
      handleBind() {
        if(!this.accountInfo.accountNum){
          Toast({message: '收款账户不能为空', duration: 1500});return;
        }
        if(!this.accountInfo.accountName){
          Toast({message: '收款用户名不能为空', duration: 1500});return;
        }
        axios({
          method:'post',
          url:process.env.API_HOST+'api.php/withdrawals/bind-alipay',
          data:{token: this.token,name: this.accountInfo.accountName,account: this.accountInfo.accountNum},
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
          if(data.status === 200){
            Toast({message: data.msg, duration: 1500});
            setTimeout(() => {
              this.goBack();
            },1500)
          }else{
            Toast({message: data.msg, duration: 1500});
          }
        });

      },
      //返回上一页
      goBack() {
        this.$router.go(-1);
      },
    },
    mounted: function () {
      this.token = localStorage.getItem('tk');
      axios({
        method:'post',
        url:process.env.API_HOST+'api.php/withdrawals/home',
        data:{token: this.token},
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
        this.accountInfo.accountName = data.data.userInfo.zfbName;
        this.accountInfo.accountNum = data.data.userInfo.zfbNumber;
      });
    }
  }
</script>

<style scoped>
  .bindAccount{background: #fff;height: 100%;}
  .accountMain{padding: 0.26rem;}
  .accountInfo div{display: flex;align-items: center;margin-bottom: 0.2rem;border-bottom: 1px solid #eee;padding-bottom: 0.2rem;}
  .accountInfo label{font-size: 0.28rem;color: #333;margin-right: 0.2rem;}
  .accountInfo input{border: none;font-size: 0.3rem;color: #000;}
  .note{font-size: 0.24rem;color: #666;padding: 0.12rem 0;}
  .bindBtn{width: calc(100% - 1rem);margin: 0.6rem auto 0 auto;height: 0.8rem;background:linear-gradient(to right,#9cbfff,#427ce6,#6b55ef) ;font-size: 0.3rem;color: #fff;text-align: center;line-height: 0.8rem;border-radius: 0.4rem;}
</style>
