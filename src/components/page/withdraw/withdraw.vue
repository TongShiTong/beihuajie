<template>
   <div class="withdraw">
      <div class="head">
          <i class="iconfont icon-zuo" @click="goBack"></i>
          <h1>我要提现</h1>
          <i></i>
      </div>

      <div class="mainBox">
          <p class="notep">提现金额:</p>
          <div class="txDiv">
             <i class="iconfont icon-qian"></i>
             <input type="text" placeholder="请输入提现金额" v-model='money'/>
          </div>
          <div class="noteDiv">
            可提现金额为: <span style="font-weight: bolder">{{ userInfo.amount? userInfo.amount : 0.00}}</span> 元
          </div>

          <div class="txBtn" @click="submit">确认提现</div>

          <div class="txBox">
             <p class="noteTx">
               提现账户:
             </p>
             <div class="accountBox">
               <p>{{userInfo.accountName + ' : ' + userInfo.accountNum}}</p>
               <router-link to='/bindAccount' tag=div>
                  修改
               </router-link>

             </div>
          </div>
          <div class="noteBz">
            温馨提示：<br>
            1、 提现金额单笔下限￥{{minWithdraw}}。<br>
            2、 提现时间在星期一到星期五9：00---17:30，两小时到账，其他时间提现第二个工作日到账；有任何问题请及时联系我们！！！
          </div>
      </div>

   </div>
</template>

<script type="text/ecmascript-6">
  import {selectTableInfo} from '@/config/utils';
  import Auth from '@/services/auth.js';
  import {Toast} from 'mint-ui';
  import axios from 'axios';
  import {goBack} from '@/../static/js/function.js';

  export default {
    name: 'withdraw',
    data: function () {
      return {
        userInfo: {
          amount: '',//可提现金额
          accountName: '',//提现账户
          accountNum: '',//提现账户号码
        },
        token: '',
        minWithdraw: '',
        money: '',
        isReadNote: true,//是否已经阅读用户协议
      }
    },
    methods: {
      //跳转到用户协议页面
      goNote: function () {
        this.$router.push({path: '/articleDetails', query: {id: 110}});
      },
      //返回上一页
      goBack() {
        this.$router.go(-1);
      },
      submit(){
        this.money = parseInt(this.money);
        this.userInfo.amount = parseInt(this.userInfo.amount);
        if(!this.money || this.money < 0){
          Toast({message: '提现金额不正确',duration: 1500});return;
        }
        if(this.money < this.minWithdraw){

          Toast({message: '提现金额不能小于提现金额单笔下限',duration: 1500});return;
        }
        if(this.money > this.userInfo.amount){
          console.log(this.money + '  ' + this.userInfo.amount);
          Toast({message: '提现金额不能大于账户可提现金额',duration: 1500});return;
        }
        this.$layer.loading();
        axios({
          method:'post',
          url:process.env.API_HOST+'api.php/withdrawals/submit',
          data:{token: this.token,money: this.money},
          headers:{'Content-Type': 'application/x-www-form-urlencoded'},
          transformRequest: function(obj) {
            var str = [];
            for(var p in obj){
              str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
            return str.join("&");
          }
        }).then((result)=>{
          this.$layer.close();
          let data = result.data;
          if(data.status === 200){
            this.$layer.dialog({
              content: data.msg,
              btn: ['知道了'],
              time: 0
            }).then(()=>{
              this.money = '';
              this.userInfo.amount = data.data.balance;
            });
          }else{
            Toast({message: data.msg})
          }
        });
      }
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
        this.userInfo.amount = data.data.userInfo.balance;
        this.userInfo.accountName = data.data.userInfo.zfbName;
        this.userInfo.accountNum = data.data.userInfo.zfbNumber;
        this.minWithdraw = data.data.minWithdraw;
      });
    }

  }
</script>

<style scoped>
  .withdraw{background: #fff;height: 100%;}
  .mainBox{padding: 0.26rem;}
  .notep{font-size: 0.28rem;color: #666;}
  .txDiv{display: flex;align-items: center;padding: 0.2rem 0;border-bottom: 1px solid #eee;margin: 0.2rem 0;}
  .txDiv i{font-size: 0.4rem;margin-right: 0.2rem;}
  .txDiv input{border: none;font-size: 0.42rem;color: #000;}
  .noteDiv{font-size: 0.28rem;color: #666;padding:0 0 0.2rem 0;}
  .accountBox{display: flex;justify-content: space-between;align-items: center;}
  .accountBox p{font-size: 0.28rem;color: #666;}
  .accountBox div{width: 1.2rem;height: 0.5rem;background: #467fe8;font-size: 0.3rem;color: #fff;border-radius: 0.1rem;text-align: center;line-height: 0.5rem;}
  .noteTx{font-size: 0.3rem;color: #333;padding-top: 0.2rem;margin-top: 0.4rem;}
  .txBtn{width: calc(100% - 1rem);margin: 0.6rem auto 0 auto;height: 0.8rem;border-radius: 0.6rem;background:linear-gradient(to right,#9cbfff,#427ce6,#6b55ef) ;font-size: 0.3rem;color: #fff;text-align: center;line-height: 0.8rem;}
  .noteBz{font-size: 0.26rem;color: #999;line-height: 0.4rem;margin-top: 0.2rem;}
</style>
