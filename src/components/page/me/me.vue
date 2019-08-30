<template>
  <transition name="fade">
    <div class="me">
      <top @click.native="showWxFun()"></top>
      <div class="userInfo">
        <div class="userInfo_p1">
          <div class="userInfo_p1Up">
            <h1 class="userPho">{{userInfo.tel}} , 您好</h1>
            <!--<img :src="userInfo.zfb" class="userZfb">-->
          </div>

          <router-link to="/setting" tag="img" src="/static/images/me/icon_set.png" class="userSet">

          </router-link>


        </div>

        <div class="userInfo_p2">
          <div class="userInfo_p2L">
            <div class="userTx">
              <img :src="userInfo.head_img ? urlImg+userInfo.head_img : urlImg+defalutTx">
            </div>

            <div class="userLevel">
              <span class="">{{userInfo.grade_id == 1 ? '普通会员' : userInfo.grade_id == 17 ? '合伙人' : userInfo.grade_id == 18 ? '信贷经理' : userInfo.grade_id == 19 ? '团队经理' : '城市经理'}}</span>
            </div>

            <p class="userId">贝化街邀请码：{{userInfo.uid}}</p>
          </div>

          <div>
            <router-link to="" tag="div">
              <h2 class="userH2">您推广所产生的收入(元)</h2>
              <p class="userTg">{{userInfo.income ? userInfo.income : 0.00}}</p>
            </router-link>


            <router-link to="/salary" tag="div">
              <h2 class="userH2">
                可提现收入(元)
                <img src="/static/images/me/icon_go1.png">
              </h2>
              <p class="userTix">{{userInfo.balance ? userInfo.balance : 0.00}}</p>
            </router-link>
          </div>
        </div>
      </div>

      <div class="userYj">
        <div class="Fir_title Fir_title_link">
          <div class="Fir_title_left">
            <div class="redLine"></div>
            <h1 class="title">贝化街总发放佣金（元）</h1>
          </div>

          <div class="Fir_title_right">{{countMoney.content}}</div>
        </div>

        <div class="userYj_con">
          <router-link to="/myCustom" tag="div" class="userYj_con_left">
            <h1>我的客户列表</h1>
            <div>
              <p>提交订单：</p>
              <span>{{countDai.Call}}单</span>
            </div>

            <div>
              <p>通过订单：</p>
              <span>{{countDai.Cvia}}单</span>
            </div>
          </router-link>

          <router-link to="/myTeam" tag="div" class="userYj_con_right">

            <h1>我的代理团队</h1>
            <div>
              <p>合计人数：</p>
              <span>{{parseInt(countCustomer.Cprent)+parseInt(countCustomer.Cfind)}}人</span>
            </div>

            <!-- <div>
              <p>简介发展：</p>
              <span>{{countCustomer.Cfind}}人</span>
            </div> -->

          </router-link>
        </div>
      </div>

      <div class="userCz">
        <router-link to="/myShop?isSet=1" tag="div" class="userCz_item">
          <div class="userCz_item_left">
            <img src="/static/images/me/icon_shop01.png">
            <div>
              <h1>设置你的店铺</h1>
              <p>个性定制你的名称与头像</p>
            </div>

          </div>
          <img src="/static/images/me/icon_go2.png">
        </router-link>

        <div class="userCz_item" @click="inviteNext()">
          <div class="userCz_item_left">
            <img src="/static/images/me/icon_dl01.png">
            <div>
              <h1>邀请发展你的代理{{user}}</h1>
              <p>推荐代理，永久享受每笔业绩提成</p>
            </div>
          </div>
          <img src="/static/images/me/icon_go2.png">
        </div>

        <router-link to="/appDownload" tag="div" class="userCz_item">
          <div class="userCz_item_left">
            <img src="/static/images/me/icon_down.png">
            <div>
              <h1>下载APP</h1>
              <p>下载APP,实时关注最新动态</p>
            </div>

          </div>
          <img src="/static/images/me/icon_go2.png">
        </router-link>
        <router-link to="/idCard" class="userCz_item" v-if="userInfo.grade_id==1">
          <div class="userCz_item_left">
            <img src="/static/images/me/idlogo.png">
            <div>
              <h1>去实名认证</h1> 
            </div>
          </div> 
          <img src="/static/images/me/icon_go2.png">
        </router-link>

        <div to="/idCard" class="userCz_item" v-else>
          <div class="userCz_item_left">
            <img src="/static/images/me/idlogo1.png">
            <div>
              <h1>你已经实名认证！</h1> 
            </div>
          </div> 
          <img src="/static/images/me/icon_go2.png">
        </div>

      </div>

      <!--点击头部的查看微信公众号-->
      <wxPop :showWx="showWx"
             @handleCloseFunc="closeWxPop"></wxPop>


      <div style="height:1.2rem"></div>
      <foot></foot>
    </div>
  </transition>

</template>

<script type="text/ecmascript-6">
  import auth from '@/services/auth.js';
import {selectTableInfo} from '@/config/utils';
import foot from '@/components/common/foot';
import top from '@/components/common/top';
import wxPop from '@/components/common/wxPop';
import {Toast} from 'mint-ui';
export default {
  name: 'me',
  components:{
    foot:foot,
    top:top,
    wxPop:wxPop,
  },
  data: function () {
    return{
      userInfo:{},//用户信息
      countMoney:0,//平台发放总金额
      countCustomer:{},//统计当前用户的直接和间接客户
      countDai:{},//用户客户申请量
      user:'',
      defalutTx:'',//默认头像
      urlImg:process.env.API_HOST,//图片域名
      showWx:false,//是否显示微信公众号的那个弹窗
    }
  },
  methods :{
      //是否显示微信弹窗
      showWxFun() {
        this.showWx = !this.showWx;
      },

      closeWxPop:function(data){
        this.showWx = !data;
      },

      //获取用户信息
      async getUserInfo() {
         let _userInfo = await selectTableInfo('members/'+ localStorage.getItem('member_id'));
         this.userInfo = _userInfo.data;
      },
      //统计平台发放金额
      async getUserCount() {
         let _userInfo = await selectTableInfo('systems/54');
         this.countMoney = _userInfo.data;
      },
       //用户客户申请量
      async getUserCountDai() {
         let _userInfo = await selectTableInfo('dai-records/count-dai?mid='+ localStorage.getItem('member_id'));
         this.countDai = _userInfo.data;
      },
      //统计当前用户的直接和间接客户
      async getUserCustomer() {
         let _userInfo = await selectTableInfo('members/count-customer?mid='+ localStorage.getItem('member_id'));
         this.countCustomer = _userInfo.data;
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
       //获取平台logo
      async getSmgLogo() {
         let _logo = await selectTableInfo('systems/21');
         this.defalutTx = _logo.data.content;
      },

  },

  mounted: function() {
    this.getUserInfo();
    this.getUserCount();
    this.getUserCustomer();
    this.getUserCountDai();
    this.getSmgLogo();

  }
};
</script>

<style scoped>
.userInfo{padding: 0.26rem;background: #fff;border-bottom: 1px solid #eee;}
.userInfo_p1{display: flex;align-items: center;justify-content: space-between;margin-bottom: 0.4rem;padding: 0 0.2rem;}
.userInfo_p1Up{display: flex;align-items: center;}
.userSet{height: 0.4rem;}
.userPho{font-size: 0.34rem;color: #000;}
.userInfo_p2{display: flex;justify-content: space-between;padding: 0 0.2rem 0 0.2rem;}
.userTx{width: 1.6rem;height: 1.6rem;border-radius: 50%;overflow: hidden;margin: 0 auto;box-shadow: 0 0 2px #ccc;display: flex;align-items: center;}
.userTx img{width: 100%;}
.userLevel{height: 0.34rem;position: absolute;top:1.4rem;left: 0.3rem;}
.userLevel{height: 0.34rem;position: absolute;width: 100%;left: 0;top:1.4rem;display: flex;justify-content: center;}
.userLevel span{display: inline-block;background: #fcc270;color: #fff;font-size: 0.24rem;line-height: 0.34rem;transform: skew(-16deg);padding: 0 0.1rem;}
.userZfb{height: 0.34rem;margin-left: 0.1rem;}
.userId{font-size: 0.24rem;color: #999;text-align: center;margin-top: 0.4rem;}
.userH2{font-size: 0.24rem;color: #999;display: flex;align-items: center;}
.userH2 img{height: 0.32rem;margin-left: 0.2rem;}
.userTg,.userTix{font-size: 0.34rem;color: #333;margin-top: 0.2rem;}
.userTg{margin-bottom: 0.4rem;}
.userInfo_p2L{position: relative;}
.Fir_title{display: flex;align-items: center;justify-content: space-between;margin-bottom: 0.2rem;}
.Fir_title_left{display: flex;align-items: center;}
.Fir_title_right{font-size: 0.36rem;color: #f5bd50;}
.redLine{height: 0.3rem;width: 0.08rem;border-radius: 0.2rem;background: #fcc270;}
.title{font-size: 0.3rem;padding-left: 0.2rem;color: #333;font-weight: 700;}
.userYj{background: #fff;padding: 0.2rem;margin-top: 0.18rem;}
.userYj_con{display: flex;justify-content: space-between; margin-top: 0.36rem;}
.userYj_con>div{width: 49%;height: 2rem;background:#ffd190;padding:6.4% 0 0 4%;border-radius: 0.1rem;}
.userYj_con>div h1{font-size: 0.3rem;color: #fff;margin-bottom: 0.2rem;}
.userYj_con>div div{display: flex;align-items: center;}
.userYj_con>div p{font-size: 0.26rem;color: #f7f3f3;margin-bottom: 0.1rem;}
.userYj_con>div div span{font-size: 0.26rem;color: #f05a49;margin-bottom: 0.1rem;}
.userYj_con>div.userYj_con_left{background:#ffd190 url("/static/images/me/img_custom.png") no-repeat right 4% center;background-size: 1rem;}
.userYj_con>div.userYj_con_right{background:#ffd190 url("/static/images/me/img_team.png") no-repeat right 4% center;background-size: 1rem;}
.userCz{margin-top: 0.2rem;}
.userCz_item{display: flex;align-items: center;justify-content: space-between;background: #fff;margin-bottom: 1px;padding:0.34rem 0.2rem;}
.userCz_item_left{display: flex;align-items: center;}
.userCz_item_left img{margin-right: 0.18rem;width: 0.6rem;}
.userCz_item_left h1{font-size: 0.28rem;color: #333;margin-bottom: 0.14rem;}
.userCz_item_left p{font-size: 0.24rem;color: #999;}
.userCz_item>img{width: 0.46rem;}
</style>
