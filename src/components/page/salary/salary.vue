<template>
  <div class="salary">

     <div class="head">
          <i class="iconfont icon-zuo" @click="goBack"></i>
          <h1>收入总览</h1>
          <i></i>
      </div>


    <div class="salaryInfo">
      <div class="income">
        <h1>收入总额(元)</h1>
        <p>{{salary.income ? salary.income : 0.00}}</p>
      </div>
      <div class="settlement">
        <h1>可结算(元)</h1>
        <p>{{salary.balance ? salary.balance : 0.00}}</p>
      </div>
    </div>


<div class="btn" @click='goWithdraw()'>
     我要提现
</div>




    <div>
      <div class="recordKins">
        <div @click="changeRecodeKind(0)">提现记录</div>
        <div @click="changeRecodeKind(1)">收入记录</div>
        <div @click="changeRecodeKind(2)">购买记录</div>
      </div>
      <div class="redLine">
        <span :class="{'on01':curRecode == 1 , 'on':curRecode == 2}"></span>
      </div>

      <div class="incomeRecord">
        <div class="incomeTitle" v-if="curRecode == 0">
          <p>金额</p>
          <p>审核时间</p>
          <p>状态</p>
        </div>

        <div class="incomeTitle" v-if="curRecode == 1">
          <p>金额</p>
          <p>申请时间</p>
          <p>返佣渠道</p>
          <p>返佣名称</p>
        </div>
        <div class="incomeTitle" v-if="curRecode == 2">
          <p>购买金额</p>
          <p>购买时间</p>
          <p>购买产品</p>
          <p>订单号</p>
        </div>

        <div class="recordLists">

          <div v-if="curRecode == 0">
            <div class="recordItem"
                 v-for="item in withdrawList">

              <p>{{item.money}}</p>
              <p>{{Number(item.create_time+'000') | formatDate}}</p>
              <p>{{
                item.status == 1 ? '待审核' :
                item.status == 3 ? '审核未通过' :
                item.status == 4 ? '提现成功' : '审核通过'
                }}</p>

            </div>
            <div class="lookMore"
                 v-if="hasMore1"
                 @click="goRecordList()">
              查看更多...
            </div>
          </div>

          <div v-if="curRecode == 1">

            <div  class="recordItem"
                  v-for="item in incomeList">

              <p>{{item.commission_money}}</p>
              <p>{{Number(item.created_time+'000') | formatDate}}</p>
              <p>{{item.msg}}</p>
              <p>{{item.p_name}}</p>
            </div>

            <div class="lookMore"
                 v-if="hasMore2"
                 @click="goRecordList()">
              查看更多...
            </div>

          </div>

           <div v-if="curRecode == 2">

            <div  class="recordItem"
                  v-for="item in payText">

              <p>{{item.money}}</p>
              <p>{{Number(item.created_time+'000') | formatDate}}</p>
              <p>{{item.content}}</p>
              <p>{{item.order_sn}}</p>
            </div>

            <div class="lookMore"
                 v-if="hasMore3"
                 @click="goRecordList()">
              查看更多...
            </div>

          </div>


          <div v-if="(incomeList == '' && curRecode == 1) || (withdrawList == '' && curRecode == 0)"
               class="nodata">
            暂无数据...
          </div>


        </div>

      </div>
    </div>
  </div>
</template>

<script>
  import {selectTableInfo} from '@/config/utils';
  import {formatDate,subStrFun} from '@/../static/js/function.js';
  import {Toast} from 'mint-ui';

  export default{
    name: 'salary',
    data: function () {
      return {
        salary: '',//用户信息
        curRecode:0,
        incomeList:[],//推广收入
        withdrawList:[],//提现记录
        payText:[],//提现记录
        isBindBank:true,//是否绑定了支付宝账号
        hasMore1:false,//是否有更多数据 提现
        hasMore2:false,//是否有更多数据 推广
        hasMore3:false,//是否有更多数据 购买
        whichList:1,//1=>提现记录 2=>收入记录
      }
    },
    filters: {
      formatDate(time) {
      var date = new Date(time);
      return formatDate(date, 'yyyy-MM hh:mm');
    },//时间
    subStrFun(value) {
      return subStrFun(value);
    }//截取字符串

    },
    methods: {
      changeRecodeKind: function (kind) {
        this.curRecode = kind;
        this.whichList = kind + 1;
      },
      //获取用户信息
      async getUserInfo() {
        let _userInfo = await selectTableInfo('members/'+ localStorage.getItem('member_id'));
        this.salary = _userInfo.data;
      },
      //推广收入
      async getIncomeList() {
        let _incomeList = await selectTableInfo('members/record?pageSize=8&page=1&type=2&mid='+ localStorage.getItem('member_id'));
        this.incomeList = _incomeList.data;
        if(_incomeList.data.length >= 8){
          this.hasMore2 = true
        }
      },
      //提现收入
      async getWithdrawList() {

        let _withdrawList = await selectTableInfo('members/record?pageSize=8&page=1&type=1&mid='+ localStorage.getItem('member_id'));
        this.withdrawList = _withdrawList.data;
        if(_withdrawList.data.length >= 8){
          this.hasMore1 = true
        }
      },
      //购买记录
      async getpayText() {

        let _payText = await selectTableInfo('members/record?pageSize=8&page=1&type=3&mid='+ localStorage.getItem('member_id'));
        this.payText = _payText.data;
        if(_payText.data.length >= 8){
          this.hasMore3 = true
        }
      },
       //返回上一页
      goBack() {
        this.$router.go(-1);
      },

      //跳转提现
      goWithdraw() {
        if (!this.salary.zfb_number) {
          this.isBindBank = false;
        }
        if (this.isBindBank) {
          this.$router.push('/withdraw');
        } else {
          Toast({message: '您还未绑定支付宝账号,请先绑定', duration: 2000});
          setTimeout(() => {
            this.$router.push('/bindAccount');
          }, 1500);
        }
      },

      //跳转记录列表页
      goRecordList() {
        switch (this.whichList){
          case 1:
                this.$router.push('/recordList?list=1');
                break;
          case 2:
                this.$router.push('/recordList?list=2');
                break;
        }
      }
  },
  mounted: function() {
    this.getUserInfo();
    this.getIncomeList();
    this.getWithdrawList();
    this.getpayText();
  }
  }
</script>

<style scoped>
  .salary{height: 100%;background: #fff;padding:0 0  0.34rem 0;}
  .salaryInfo{padding-left:0.28rem; }
  .salaryInfo div{display: flex;justify-content: space-between;align-items: center;padding: 0.34rem 0.26rem 0.34rem 0;}
  .income{border-bottom: 1px solid #eee;}
  .salaryInfo h1{font-size: 0.28rem;color: #333;}
  .salaryInfo p{font-size: 0.26rem;color: #999;}
  .btn{display: block;margin: 0.6rem auto;width: 5rem;border-radius: 0.4rem;background:#ffd190;
   text-align: center;height: 0.8rem;line-height: 0.8rem;font-size: 0.3rem;color: #fff;}
  .recordKins{display: flex;justify-content: space-between;padding: 0 1.4rem;}
  .recordKins div{font-size: 0.28rem;color: #333;}
  .incomeTitle{display: flex;background: #fffcf7;padding: 0.26rem 0.26rem;}
  .incomeTitle p{width: 33.33%;text-align: center;color: #f4c25e;font-size: 0.24rem;}
  .redLine{padding: 0.1rem 1.6rem;position: relative;width: 100%;margin-top: 0.12rem;}
  .redLine span{display: inline-block;width: 0.6rem;height: 3px;background: #ff2b71;position: absolute;left: 1.6rem;transition: all 500ms;}
  .redLine span.on{left: calc(100% - 2.2rem);transition: all 500ms;}
  .redLine span.on01{left: calc(100% - 4rem);transition: all 500ms;}
  .recordItem{display: flex;padding: 0.2rem 0.26rem;}
  .recordItem p{width: 33.33%;font-size: 0.26rem;color: #666;text-align: center;}
  .noRecord{text-align: center;}
  .noRecord img{width: 3rem;margin-bottom: 0.2rem;margin-top: 1rem;}
  .noRecord p{font-size: 0.28rem;color: #999;}
  .lookMore{text-align: center;padding: 0.2rem 0;font-size: 0.26rem;color: #999;}
  .nodata{text-align: center;font-size: 0.26rem;color: #999;padding: 0.2rem;}
</style>
