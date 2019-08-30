<template>
   <div class="guideClass">
      <div class="head">
          <i class="iconfont icon-zuo" @click="goBack"></i>
          <h1>{{guideCon.title}}</h1>
          <i></i>
      </div>
     <div v-html="guideCon.content" class="guideCon">

     </div>

      <div  class="fixBottom" @click="goBuyDl()">
          <img src="/static/images/guideClass/guideBtn.png">
      </div>
   </div>
</template>

<script type="text/ecmascript-6">
  import {selectTableInfo} from '@/config/utils';
  import {Toast} from 'mint-ui';
    export default{
      name: 'guideClass',
      data: function () {
        return{
          guideCon:'',
          grade_id:'',//会员等级
        }
      },
      methods: {
       //获取款爷课堂的详情
        async getClassDetails() {
          let acticleTxt = await selectTableInfo('articles/112');
          this.guideCon = acticleTxt.data;
        },
       //获取用户信息
        async getUserInfo() {
          let _userInfo = await selectTableInfo('members/'+ localStorage.getItem('member_id'));
          this.grade_id = _userInfo.data.grade_id;
        },
        //点击成为代理
        goBuyDl() {
          if(this.grade_id != 1){
             Toast({message:'您已经是平台代理了~',duration:1500});
          }else{
             this.$router.push('/vip');
          }
        },
        //返回上一页
        goBack() {
          this.$router.go(-1);
        },
      },
      mounted: function(){
        this.getClassDetails();
        this.getUserInfo();
      }
    }
</script>

<style scoped>
.head{background: #fff;}
.head h1{font-weight: 500;font-size: 0.36rem;}
.guideClass{padding-bottom: 2rem;overflow: hidden;}
.fixBottom{position: fixed;width: 100%;left: 0;bottom: 0;display: flex;align-items: flex-end;}
.fixBottom img{width: 100%;}
.guideCon{font-size: 0.26rem;line-height: 0.34rem;color: #333;overflow: hidden;}
.guideCon >>>img{max-width: 100%!important;height: auto;}
</style>
