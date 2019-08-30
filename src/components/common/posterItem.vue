<template>
   <div class="posterItem">
      <div>
         <div class="posterBox">
            <span class="backIcon" @click="goBackStep()"></span>
            <img :src="src" class="poster" @click="saveImg()">
           <img src="/static/images/productDetails/guide01.png" class="guideIcon">
         </div>
      </div>
   </div>
</template>

<script>
    export default{
      name:'PosterItem',
      props:['src'],
      data: function () {
        return{

        }
      },
      methods:{
        goBackStep: function () {
         this.$emit('hideState');
        },
        saveImg: function() {
          this.$emit("openSaveImg");
        }
      }
    }
</script>

<style scoped>
.posterBox{width: 70%;margin: 0 auto;position: relative;}
.poster{width: 100%;position: relative;z-index: 2;border-radius: 0.3rem;}
.guideIcon{display: block;width: 72%;position: absolute;bottom: -1rem;left: 14%;}
.backIcon{color: #333;display: inline-block;width: 0.46rem;height: 0.46rem;background: #fff url("/static/images/productDetails/icon_arrow.png") no-repeat center;background-size:0.16rem auto;text-align: center;line-height: 0.4rem;position: absolute;right: 0;top:-0.6rem;border-radius: 50%;}
</style>
