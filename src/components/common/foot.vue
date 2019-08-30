<template>
   <div class="foot_nav">
      <ul>
        <li @click="go('/')" :class="{on: '/' === $route.path}">
          <i class="iconfont icon-shouyeweidianji"></i>
          <p>首页</p>
        </li>

        <li @click="go('/product')" :class="{on: '/product' === $route.path}">
          <i class="iconfont icon-chanpinxingnengxuanzhong"></i>
          <p>推广产品</p>
        </li>

        <!--<li @click="go('/moreQuestion')" :class="{on: '/moreQuestion' === $route.path}">-->
          <!--<i class="iconfont icon-zuixinkouzi"></i>-->
          <!--<p>资讯</p>-->
        <!--</li>-->

        <li @click="go('/me')" :class="{on: '/me' === $route.path}">
          <i class="iconfont icon-wode2"></i>
          <p>个人中心</p>
        </li>
      </ul>
   </div>
</template>

<script>
   export default {
     name: 'foot',
     data: function (){
       return {

       }
     },
     methods: {
       /*跳转页面*/
       go:function (path){
           this.$router.push(path)
   },

     }

   }
</script>

<style scoped>
.foot_nav{position: fixed;width: 100%;left: 0;bottom:0;z-index: 1000;box-shadow: 0 -1px 1px #eee;}
.foot_nav ul{display: flex;background: #fff;height: 1rem;}
.foot_nav ul li{width:33.33%;text-align: center;display: flex;flex-direction: column;align-items: center;justify-content: center;}
.foot_nav ul li.on{color: #fcc270;}
.foot_nav ul li.on p{color:#fcc270;}
.foot_nav ul li i{font-size: 0.5rem;}
.foot_nav ul li p{font-size: 0.26rem;color: #333;margin-top: 0.1rem;}
</style>
