<template>
  <div class="imgLoop">
    <div class="swiper-container index_container">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="item in newItems">
        <div v-html="item" class="swiper-pr"></div>

        </div>

      </div>

    </div>
  </div>
</template>

<script>
  export default{
    name: 'NewsLoop',
    props: ['newItems'],
    methods: {
      swiperInit: function () {
        this.swiper = new Swiper('.index_container', {
          direction:'vertical',
          autoplay:3000,
          loop: true,
        })
      },
    },
    mounted: function () {

    },
    updated: function () {
      this.swiperInit()
    }
  }
</script>

<style scoped>
.imgLoop{height: 0.6rem;overflow: hidden;}
.index_container{height: 0.6rem;}
.swiper-wrapper{ transition-timing-function: linear;}
.swiper-slide{font-size: 0.26rem;color: #ec4036;text-align: left;line-height: 0.44rem;padding: 0.1rem;width: 100%;}
</style>
