<template>
   <div class="tgPop">

     <div class="hb_cons_list" style="transform: translateX(100%)">
       <div v-for="(item,index) in posters" class="creat-img" ref="box">
         <img :src="item" alt="分享背景图">
         <div :id="getDifId(index)" class="code"></div>
       </div>
     </div>

     <!--海报式推广的页面 start-->
     <div v-show="hbIsShow">
       <div class="link_zzc">
         <div class="hb_cons" v-if="posterConsShow">
           <div class="hb_cons_title">
             分享海报
             <span class="hb_cons_colse" @click="closePoster()">×</span>
           </div>

           <div class="hb_cons_list">
             <div v-for="(item,index) in imgUrl" @click="getCurPoster(index)">
               <img :src="item">
             </div>
           </div>

         </div>

         <poster-item v-if="isShowCurPoster"
                      :src="curPoster"
                      @hideState="hideCurP0ster">

         </poster-item>
       </div>
     </div>
     <!--海报式推广的页面 end  -->

     <!--链接式推广的页面 start-->
     <div v-show="linkIsShow">
       <div class="hb_zzc">
         <div class="link_cons">
           <i class="iconfont  icon-guanbi1 closeLink"
              @click="closeLinks()"></i>
           <img src="/static/images/product/tg_logo.png">
           <div class="ewm_box">
             <div id="qrcode" class="qrcode">

             </div>
           </div>
           <div class="linkIntroBox">
             <p class="linkIntro">扫描二维码后关注店铺</p>
             <div class="linkGn">
               <span class="copyLink"
                     @click="copyLinkAction()"
                     ::data-clipboard-text="linkUrl">复制链接</span>
               <span class="wxShare">微信分享</span>
             </div>
             <div class="link_div">

               {{linkUrl}}
             </div>
           </div>

         </div>
       </div>
     </div>
     <!--链接式推广的页面 end  -->
   </div>
</template>

<script type="text/ecmascript-6">
  import PosterItem from '@/components/common/posterItem';
  import { qrcanvas } from 'qrcanvas';
  import Clipboard from 'clipboard';/*剪切板*/
  import {loadmore,Toast} from 'mint-ui';
  var posters = ['/static/images/product/img_poster01.png','/static/images/product/img_poster02.png'];

    export default{
      name: 'tgPop',
      components: {
        PosterItem:PosterItem
      },
      props:['hbIsShow',
        'linkIsShow',
        'posterConsShow',
        'isShowCurPoster',
        'posters',
        'imgUrl'],
      data: function () {
        return{
          curPoster:null,
          linkUrl:'',
        }
      },
      methods: {
        closePoster: function () {
          this.$emit('changeState',this.hbIsShow);
        },
        closeLinks: function () {
          this.$emit('changeLinksState',this.linkIsShow);
        },
        getCurPoster: function (index) {
          this.curPoster = this.posters[index];
          this.posterConsShow = !this.posterConsShow;
          this.isShowCurPoster = !this.isShowCurPoster;
          this.$emit('showCurPoster',this.curPoster);
        },
        hideCurP0ster: function () {
          this.posterConsShow = !this.posterConsShow;
          this.isShowCurPoster = !this.isShowCurPoster;
        },

        getDifId: function (index) {
          return 'code_'+ index;
        },

        //复制链接的方法
        copyLinkAction: function () {
          let clipboard = new Clipboard(".copyLink");
          clipboard.on('success',e => {
            Toast({message:"复制成功",duration: 1500});
            this.closeLinks();
          });
          clipboard.on('error',e => {
            Toast({message:"复制失败哦,重新试试?",duration: 1500});
          });
        },

      },
      mounted: function () {

          var  _router = window.location.href;
          this.linkUrl = _router;
          //生成二维码
          var canvas1 = qrcanvas({
            data: decodeURIComponent(_router),
            size:120,
          });

          document.getElementById("qrcode").innerHTML = '';
          document.getElementById('qrcode').appendChild(canvas1);

      }
    }
</script>

<style scoped>
  .hb_zzc,.link_zzc{position: fixed;width: 100%;height: 100%;left: 0;top:0;background: rgba(0,0,0,0.5);display: flex;align-items: center;justify-content: center;z-index: 1000;}
  .hb_cons{width: 80%;background: #e6e6e6;border-radius: 0.1rem;padding: 0.2rem 0.26rem;}
  .hb_cons_title{font-size: 0.26rem;color: #333;font-weight: bold;text-align: center;position: relative;padding: 0.1rem 0 0.28rem 0;}
  .hb_cons_colse{position: absolute;display: inline-block;background: #fff;color: #333;font-size: 0.4rem;border-radius: 0.2rem;width: 0.6rem;height: 0.36rem;text-align: center;font-weight: 500;line-height: 0.36rem;right:0;top:0;}
  .hb_cons_list{display: flex;justify-content: space-between;flex-wrap: wrap;}
  .hb_cons_list div{width: 48%;overflow: hidden;margin-bottom: 0.16rem;}
  .hb_cons_list img{width: 100%;}

  .link_cons{width: 80%;border-radius: 0.2rem;background: #fff;position: relative;}
  .link_cons>img{width: 100%;}
  .ewm_box{width: 2.8rem;height: 2.8rem;margin:0.4rem auto 0 auto;overflow: hidden;text-align: center;}
  .ewm_box img{width: 100%;}
  .linkIntro{font-size: 0.22rem;color: #f4b73c;text-align: center;margin: 0.2rem 0 0.4rem 0;}
  .linkGn{display: flex;justify-content: space-around;}
  .linkGn span{display: inline-block;width: 2.2rem;height: 0.8rem;border-radius: 0.5rem;font-size: 0.26rem;color: #fff;text-align: center;line-height: 0.8rem;}
  .link_div{padding: 0.2rem;border-radius: 0.2rem;background: #f8f8f8;font-size: 0.26rem;color: #666;min-height: 1.2rem;margin-top: 0.4rem;}
  .copyLink{background: linear-gradient(90deg,#f2593a,#f3682c,#f46f25);}
  .wxShare{background: linear-gradient(90deg,#f2544e,#f8405f,#fd326b);}
  .linkIntroBox{padding: 0.2rem;}
  .closeLink{position: absolute;right:0.2rem;top:0.2rem;width: 0.6rem;height: 0.36rem;border-radius: 1rem;background: #eee;text-align: center;line-height: 0.36rem;font-size: 0.3rem;color: #000;font-weight: bold;}

</style>
