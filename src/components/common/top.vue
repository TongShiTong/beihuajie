<template>
  <div class="head_ad">
    <!-- <img src="/static/images/index/head_ad.png"> -->
  
    <div class="logoBox"> 
        <img :src="logoImg">
    </div>

    <p>贝化街  加入官方群 了解更多</p>
  </div>
</template>

<script>
   import {selectTableInfo} from '@/config/utils';
   export default {
      data:function() {
        return {
          logoImg:'',//logo
        }
      },

      methods: {
      //获取网站logo
          async getWebLogo() {
            let _logo = await selectTableInfo('systems/21');
            this.logoImg = process.env.API_HOST+_logo.data.content;
          },
      },

      mounted:function() {
         this.getWebLogo();
        
      }
   }
</script>

<style scoped>
  .head_ad{width: 100%;overflow: hidden;display: flex;align-items: center;height: 1rem;background: #fcc270;padding-left: 0.2rem;}
  .logoBox{width: 0.8rem;height: 0.8rem;overflow: hidden;display: flex;align-items: center;margin-right: 0.16rem;}
  .logoBox img{width: 100%;}
  .head_ad p{font-size: 0.3rem;color: #fff;}
</style>