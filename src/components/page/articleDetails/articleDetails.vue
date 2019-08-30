<template>
  <div class="articleDetails">
    <div class="head">
      <i class="iconfont icon-zuo" @click="goBack"></i>
      <h1>{{articleInfo.title}}</h1>
      <i></i>
    </div>

    <div class="cons" v-html="articleInfo.content">
      <!--{{articleInfo.content}}-->
    </div>
  </div>
</template>

<script>
    import {selectTableInfo} from '@/config/utils';
    export default{
      name:'articleDetails',
      data: function () {
        return {
          articleId:0,//文章id
          articleInfo:{
            title:'',
            content:'',
          }//文章信息
        }
      },
      methods: {
        //获取文章详情
        async getArticlesDetails() {
           let _articleDetails = await selectTableInfo('articles/' + this.articleId);
           this.articleInfo = _articleDetails.data;
        },

        //返回上一页
        goBack() {
          this.$router.go(-1);
        }
      },
      mounted: function() {
        this.articleId = this.$route.query.id;
        this.getArticlesDetails();
      }
    }
</script>

<style scoped>
  .articleDetails{min-height: 100%;background:#fff;}
  .cons{font-size: 0.28rem;color: #333;line-height: 0.46rem;padding: 0.26rem;overflow: hidden;}
  .cons img{max-width: 100%!important;}
</style>
