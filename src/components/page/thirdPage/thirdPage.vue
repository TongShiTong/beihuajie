<template>
  <div class="thirdPage">
    <div class="head">
      <i class="iconfont icon-zuo" @click="goBack"></i>
      <h1>{{productDetails.name}}</h1>
      <i></i>
    </div>

    <iframe class="thirdIframe" :src="url" frameborder="0" scrolling="0">

    </iframe>
  </div>
</template>

<script>
    import {selectTableInfo,selectTableInfoP} from '@/config/utils';
    export default{
      name: 'thirdPage',
      data: function () {
        return {
          url:'',//产品链接
          id: '',//产品id
          productDetails:{},//产品详情
        }
      },
      methods: {
        //返回上一页
        goBack() {
          this.$router.go(-1);
        },
        //获取产品详情
        async getProductDetails() {
          let _productDetails = await selectTableInfo('products/' + this.id);
          this.productDetails = _productDetails.data;
        },
      },
      mounted: function () {
        this.url = this.$route.query.url;
        this.id = this.$route.query.id;
        this.getProductDetails();
      }
    }
</script>

<style scoped>
  .thirdPage{min-height: 100%;}
  .head{background: #fff;}
  .thirdIframe{width: 100%;height:calc(100% - 0.8rem);position: absolute;top:0.8rem;left: 0;}
</style>
