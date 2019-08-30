<template>
<div class="myTeam">
  <div class="head">
    <i class="iconfont icon-zuo" @click="goBack"></i>
    <h1>我的团队</h1>
    <i></i>
  </div>
  <div class="teamMoney" v-if="userInfo.grade_id==17">
    <div>合计佣金奖励：{{parseInt(customerReward.Cprent)+parseInt(customerReward.Cfind)}} 元</div>
  </div>
  <div v-else>
    <div class="teamMans">
      <div @click="changeState('left')">
        <h1 :class="{choosedP : !choosed}">我直接发展的团队(位)</h1>
        <p>{{countCustomer.Cprent}}</p>
      </div>
      <span></span>
      <div @click="changeState('right')">
        <h1 :class="{choosedP : choosed}">我间接发展的团队(位)</h1>
        <p>{{countCustomer.Cfind}}</p>
      </div>
    </div>
    <div class="teamMoney">
        <div @click="changeState('left')">
        佣金奖励：{{customerReward.Cprent}}元
        </div>
        <div @click="changeState('right')">
          佣金奖励：{{customerReward.Cfind}}元
        </div>
    </div>
  </div>

  <div  @click="inviteNext()">
    <img-loop :loopImgs="loopImgs" ></img-loop>
  </div>

  <div class="profitCons">
     <div class="profitKind">
       <p>用户/注册日期</p>
       <p>推荐返佣(元)</p>
       <p>佣金提成(元)</p>
     </div>
    <div class="profits">
       <div v-for="item in customerInfo" class="profitItem">
         <p>{{item.tel?item.tel.replace(item.tel.substr(3,4),'****'):'************'}}<br/>
            {{Number(item.create_time+'000') | formatDate}}
         </p>
         <p>{{item.promotion_commission}}</p>
         <p>{{item.dai_commission}}</p>
       </div>
    </div>
  </div>
</div>
</template>

<script>
  import ImgLoop from '@/components/common/imgLoop';
  import {selectTableInfo} from '@/config/utils';
  import {formatDate,subStrFun} from '@/../static/js/function.js';
  // var loopImgs = ['/static/images/myTeam/pic01.png','/static/images/myTeam/pic02.png'];
  var loopImgs = ['/static/images/myTeam/pic03.png'];
  var profits = [
    {'name':'盈盈有钱','dl_profit':'120','yeJi_profit':'100'},
    {'name':'大象金服','dl_profit':'48','yeJi_profit':'26'}
  ];
  var teamInfo = {
    'zj_team':'0',
    'jj_team':'0',
    'zj_reward':'0',
    'jj_reward':'0'
  };
    export default{
      name: 'myTeam',
      components: {
        ImgLoop:ImgLoop
      },
      data: function () {
        return {
          teamInfo: teamInfo,
          loopImgs: loopImgs,
          profits: profits,
          choosed:false,
          customerInfo:[],//客户的信息
          countCustomer:{},
          customerReward:{},
          userInfo:{},//用户信息

        }
      },
      filters: {
        formatDate(time) {
            var date = new Date(time);
            return formatDate(date, 'yyyy-MM-dd');
        },//时间
        subStrFun(value) {
          return subStrFun(value);
        }//截取字符串

      },
      methods: {
        changeState: function (direction) {
          if(direction == 'left'){
            this.choosed = false;
            this.getFirstCustomerInfo();
          }else{
            this.choosed = true;
            this.getSecCustomerInfo();
          }
        },
        //返回上一页
        goBack() {
          this.$router.go(-1);
        },
        //获取直接用户的信息
        async getFirstCustomerInfo() {

          let _firstCustomerInfo = await selectTableInfo('members/customer?mid=' + localStorage.getItem('member_id'));
          this.customerInfo = _firstCustomerInfo.data;

        },
        //获取直接用户的信息
        async getSecCustomerInfo() {

          let _firstCustomerInfo = await selectTableInfo('members/customer-find?mid=' + localStorage.getItem('member_id'));
          this.customerInfo = _firstCustomerInfo.data;

        },

        //统计当前用户的直接和间接客户
        async getUserCustomer() {
          let _userInfo = await selectTableInfo('members/count-customer?mid='+ localStorage.getItem('member_id'));
          this.countCustomer = _userInfo.data;
        },
        //统计当前用户的直接和间接客户佣金奖励
        async getCustomerReward() {
          let _customerReward = await selectTableInfo('members/count-money?mid='+ localStorage.getItem('member_id'));
          this.customerReward = _customerReward.data;
        },
         //获取用户信息
      async getUserInfo() {
         let _userInfo = await selectTableInfo('members/'+ localStorage.getItem('member_id'));
         this.userInfo = _userInfo.data;
      },
        //点击邀请代理
      inviteNext() {
        let grade_id =  this.userInfo.grade_id;  //会员等级 1 普通会员 2 金牌会员
        if(grade_id == 1){
        let _this = this;
        _this.$layer.dialog({

              content: '您还没有完成身份认证不能成为信贷经理去推广，请先完成身份证认证',
              contentClass: 'className',
              btn: ['再看看','去身份认证'],
              time: 20000
            })
            // 如果有btn
            .then(function (res){
              // res为0时是用户点击了左边  为1时用户点击了右边
              let position = res === 0 ? 'left' : 'right';
              if(res == 0){

              }else{
                // _this.$router.push('/vip');
                _this.$router.push('/idCard');
              }

            });

          return;
        }
        this.$router.push('/recommend');
      },
      },
      mounted: function() {
          this.getFirstCustomerInfo();
          this.getUserCustomer();
          this.getCustomerReward();
          this.getUserInfo();
     }

    }
</script>

<style scoped>
.head{background: #fff;}
.teamMans{display: flex;justify-content: space-between;align-items: center;padding:0.4rem  0.26rem;background: #fff;}
.teamMans div{width: 48%;text-align: center;}
.teamMans span{display: inline-block;width: 1px;height: 0.6rem;background: #ccc;}
.teamMans h1{font-size: 0.26rem;color: #333;margin-bottom: 0.2rem;}
.teamMans p{font-size: 0.36rem;color: #000;}
.teamMoney{background: #fff;display: flex;justify-content: space-around;padding-bottom: 0.2rem;}
.teamMoney div{display: inline-block;padding: 0.1rem 0;border: 1px solid #999;font-size: 0.28rem;color: #999;width: 40%;text-align: center;border-radius: 0.06rem;}
.profitCons{padding: 0.2rem;background: #fffcf7;margin-top: 0.2rem; }
.profitKind{display: flex;padding-bottom: 0.2rem;border-bottom: 1px dashed #eee;}
.profitKind p{width: 33.33%;font-size: 0.26rem;color: #f4bd4e;text-align: center;}
.profitItem{display: flex;}
.profitItem p{width: 33.33%;text-align: center;font-size: 0.24rem;color: #666;padding: 0.16rem 0;}
.chooses{display: flex;}
.chooses p{width: 50%;}
.teamMans h1.choosedP{font-size:0.3rem;color: #000; }
.chooses span{display: block;width: 100%;height: 3px;background: rgb(241, 96, 78);}
</style>
