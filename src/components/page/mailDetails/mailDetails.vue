<template>
<div class="mailDetails">
   <div class="mailDetailsTop">
     <router-link to="/mails" tag="span" class="backBtn">
       <i class="iconfont icon-zuo"></i>
     </router-link>
     <h1>站内信</h1>
     <span></span>
   </div>

   <div class="mailDetailsCon">
      <h1 class="title">{{mailInfo.title}}</h1>
      <div class="authorTime">
        <span class="author">{{mailInfo.author}}</span>
        <p class="time">{{mailInfo.time}}</p>
      </div>
      <div class="cons" v-html="mailInfo.content">

      </div>
   </div>
</div>
</template>

<script type="text/ecmascript-6">
  import {selectTableInfo} from '@/config/utils';
  import {formatDate,subStrFun} from '@/../static/js/function.js';
  var mailInfo = {
    'title':'”前置风控“说明事项',
    'author':'款爷邦',
    'time':'2018-11-29 8:56',
    'cons':'应部分平台官方要求，保证客户的质量，款爷邦增加前置风控功能；该标签订单平台，会有超高的返佣价格，同时也增加了客户的要求，部分客户将无法申请该类平台。'
  };
    export default{
      name: 'mailDetails',
      data: function () {
        return{
          mailInfo:'',
          mailsId:0
        }
      },

      methods: {
        //获取文章详情
        async getMailsDetails() {
          let mailsTxt = await selectTableInfo('articles/'+ this.mailsId +'');
          this.mailInfo = mailsTxt.data;
        },
         //获取公告详情
        async getPageDetails() {
          let mailsTxt = await selectTableInfo('pages/'+ this.mailsId +'');
          this.mailInfo = mailsTxt.data;
        }

      },

      mounted: function() {

        if(this.$route.query.id==undefined || this.$route.query.id==""){
          this.mailsId = this.$route.query.pid;
          this.getPageDetails();
        }else{
           this.mailsId = this.$route.query.id;
           this.getMailsDetails();
        }

      }
    }
</script>

<style scoped>
.mailDetails{height: 100%;background: #fff;}
.mailDetails >>> img{max-width: 100%;}
.mailDetailsTop{display: flex;justify-content: space-between;height: 0.8rem;background: #fff;padding:0 0.26rem;line-height: 0.8rem;}
.mailDetailsTop span{display: inline-block;width: 20%;font-size: 0.26rem;}
.mailDetailsTop h1{width: 60%;text-align: center;font-size: 0.36rem;color: #333;}
.backBtn i{font-size: 0.36rem;color: #000;}
.mailDetailsCon{padding:0.4rem 0.26rem 0.26rem 0.26rem;background: #fff;}
.title{font-size: 0.32rem;color: #000;font-weight: bold;line-height: 0.46rem;}
.author{margin-right: 0.2rem;color: #f05a49;}
.authorTime{margin:0.4rem 0 0.2rem 0;font-size: 0.3rem;color: #999;display: flex;align-items: center;}
.cons{font-size: 0.26rem;color: #333;line-height: 0.4rem;}
</style>
