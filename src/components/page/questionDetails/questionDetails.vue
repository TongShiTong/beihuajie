<template>
<div class="questionDetails">

  <div class="head">
    <i class="iconfont icon-zuo" @click="goBack"></i>
    <h1>详情</h1>
    <i></i>
  </div>

  <div class="consParent">
    <div class="title">
      <span></span>
      <h1>{{qusetionDetails.title}}</h1>
    </div>
    <div class="cons" v-html="qusetionDetails.content">

    </div>
  </div>

</div>
</template>

<script type="text/ecmascript-6">
  import {selectTableInfo} from '@/config/utils';
    export default{
      name: 'questionDetails',
      data: function () {
        return{
          qusetionDetails:'',
          articleId:0
        }
      },
      methods: {
        //问题列表
        async questions() {
            let qusetionDetail = await selectTableInfo('articles/'+ this.articleId +'');
            this.qusetionDetails = qusetionDetail.data;
         },

        //返回上一页
        goBack() {
          this.$router.go(-1);
        }
      },
      mounted: function () {
        //当前文章的id
        this.articleId = this.$route.query.id ;
        this.questions();
      }
    }
</script>

<style scoped>
.questionDetails{min-height: 100%;background: #fff;}
.consParent{padding: 0.26rem;}
.title{display: flex;margin-bottom: 0.4rem;}
.title span{display: inline-block;width: 3px;height: 0.2rem;background: #fcc270;border-radius: 1rem;margin-right: 0.16rem;margin-top: 0.1rem;}
.title h1{font-size: 0.3rem;color: #333;line-height: 0.4rem;}
.cons{font-size: 0.24rem;color: #666;line-height: 0.4rem;overflow: hidden;}
.cons >>>img{width: 100%;}
</style>
