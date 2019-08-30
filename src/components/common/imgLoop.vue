<template>
  <div class="imgLoop">
    <div class="swiper-container index_container">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="img in loopImgs">
          <img :src="img">
        </div>

      </div>
      <!-- 如果需要分页器 -->
      <div class="swiper-pagination"></div>
    </div>
  </div>
</template>

<script>
    export default{
      name: 'ImgLoop',
      props: ['loopImgs'],
      methods: {
        swiperInit: function () {
          this.swiper = new Swiper('.index_container', {
//            pagination: '.swiper-pagination',
            autoplayDisableOnInteraction:false,
            autoplay:false,
//            loop: true
          })
        },
      },
      mounted: function () {
        this.swiperInit()
      }
    }
</script>

<style scoped>
.swiper-slide img{width: 100%;}
</style>
